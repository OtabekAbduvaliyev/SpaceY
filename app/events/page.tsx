'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { HiSearch, HiFilter, HiCalendar, HiLocationMarker, HiClock, HiExternalLink, HiEye, HiStar } from 'react-icons/hi';
import { WiDaySunny, WiMeteor, WiMoonAltWaxingCrescent4, WiStars } from 'react-icons/wi';
import EventModal from '../Components/Modals/EventModal';

// Unified event interface (matches /api/events route)
interface SpaceYEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
  image: string;
  images?: string[];
  visibility?: {
    rating: number;
    conditions?: string;
    bestTime?: string;
    duration?: string;
  };
  location?: {
    name?: string;
    coordinates?: string;
    hemisphere?: string;
    timezone?: string;
  };
  scientific?: Record<string, any>;
  isUpcoming?: boolean;
}

// Time calculation utilities (unchanged logic)
const getTimeUntilEvent = (eventDate: string) => {
  const now = new Date();
  const event = new Date(eventDate);
  const diffMs = event.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffMs / (1000 * 60));

  if (diffMs < 0) {
    const passedDays = Math.abs(diffDays);
    const passedHours = Math.abs(diffHours);
    const passedMinutes = Math.abs(diffMinutes);

    if (passedDays > 365) return { text: `${Math.floor(passedDays / 365)}y ago`, isUpcoming: false, priority: 4 };
    if (passedDays > 0) return { text: `${passedDays}d ago`, isUpcoming: false, priority: 3 };
    if (passedHours > 0) return { text: `${passedHours}h ago`, isUpcoming: false, priority: 2 };
    return { text: `${passedMinutes}m ago`, isUpcoming: false, priority: 1 };
  } else {
    if (diffDays > 0) return { text: `in ${diffDays}d`, isUpcoming: true, priority: 1 };
    if (diffHours > 0) return { text: `in ${diffHours}h`, isUpcoming: true, priority: 1 };
    return { text: `in ${diffMinutes}m`, isUpcoming: true, priority: 1 };
  }
};

/* Countdown component — updates every second */
function Countdown({ targetDate }: { targetDate: string }) {
  const [remaining, setRemaining] = useState(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    return diff > 0 ? diff : 0;
  });

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      setRemaining(diff > 0 ? diff : 0);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (remaining <= 0) return <span className="text-sm font-mono">Now</span>;

  const sec = Math.floor((remaining / 1000) % 60);
  const min = Math.floor((remaining / (1000 * 60)) % 60);
  const hr = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));

  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      {days > 0 && <span className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/30">{days}d</span>}
      <span className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/30">{String(hr).padStart(2,'0')}h</span>
      <span className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/30">{String(min).padStart(2,'0')}m</span>
      <span className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/30">{String(sec).padStart(2,'0')}s</span>
    </div>
  );
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<SpaceYEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<SpaceYEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal handlers
  const handleEventClick = (event: SpaceYEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Load unified events data from API route (/api/events -> returns all)
  useEffect(() => {
    const loadLocalData = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        // use data.all which contains full events list
        setEvents(Array.isArray(data.all) ? data.all : []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
        setLoading(false);
      }
    };

    loadLocalData();
  }, []);

  // Filter + map to add eventDate and timeInfo
  const filteredEvents = events
    .filter((ev) => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (ev.title || '').toLowerCase().includes(s) ||
             (ev.description || '').toLowerCase().includes(s) ||
             (ev.type || '').toLowerCase().includes(s) ||
             (ev.location?.name || '').toLowerCase().includes(s);
    })
    .map((ev) => {
      const eventDate = ev.date;
      const timeInfo = getTimeUntilEvent(eventDate);
      // timeDelta in ms relative to now: positive => upcoming, negative => passed
      const timeDelta = new Date(eventDate).getTime() - Date.now();
      return { ...ev, eventDate, timeInfo, timeDelta };
    })
    .sort((a: any, b: any) => {
      const aUpcoming = a.timeInfo.isUpcoming;
      const bUpcoming = b.timeInfo.isUpcoming;
      // Upcoming events first
      if (aUpcoming && !bUpcoming) return -1;
      if (!aUpcoming && bUpcoming) return 1;
      // Both upcoming: closest (smallest positive timeDelta) first
      if (aUpcoming && bUpcoming) return a.timeDelta - b.timeDelta;
      // Both past: closest past (smallest absolute timeDelta) first
      return Math.abs(a.timeDelta) - Math.abs(b.timeDelta);
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading SpaceY data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-emerald-300 rounded-full animate-ping opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse opacity-50"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
        </div>
      </div>

      {/* Minimalist Header */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href={'/'} className="group">
              <h1 className="text-5xl font-light tracking-tight mb-2 group-hover:tracking-wider transition-all duration-500">
                SPACEY
                <span className="text-emerald-400 group-hover:animate-pulse">.</span>
              </h1>
              <p className="text-gray-400 text-sm font-mono animate-fade-in">Real-time space events</p>
            </Link>

            {/* Controls */}
            <div className="flex items-center justify-between w-full">
              {/* Search - Centered */}
              <div className="relative max-w-[600px] w-full mx-auto">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-400 transition-colors z-10" />
                <input
                  type="text"
                  placeholder="Search the cosmos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                />
                {searchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              {/* Calendar button */}
              <a
                href="/calendar"
                className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 backdrop-blur-sm font-medium ml-4"
              >
                <div className="flex items-center gap-2">
                  <HiCalendar className="w-4 h-4" />
                  <span>SpaceY Calendar</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Events Display - Journey View Only */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        {/* Main Event Card - HERO SPOTLIGHT */}
        {filteredEvents.length > 0 && (
          <div className="flex justify-center mb-24 mt-12">
            <div
              onClick={() => handleEventClick(filteredEvents[0])}
              className="group relative cursor-pointer max-w-6xl w-full"
            >
              {/* Glowing aura effect */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-700 animate-pulse"></div> */}
              
              {/* Main card container */}
              <div className="relative   to-gray-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl overflow-hidden  group-hover:border-emerald-400/60 group-hover:shadow-emerald-500/20  transition-all duration-700">
                
                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-emerald-400/60 rounded-tl-3xl group-hover:w-40 group-hover:h-40 transition-all duration-500"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-emerald-400/60 rounded-br-3xl group-hover:w-40 group-hover:h-40 transition-all duration-500"></div>
                
                {/* Status badge */}
                <div className="absolute top-6 left-6 z-20">
                  <div className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider backdrop-blur-sm ${
                    filteredEvents[0].timeInfo.isUpcoming
                      ? 'bg-emerald-500/90 text-black shadow-lg shadow-emerald-500/50'
                      : 'bg-gray-500/90 text-white shadow-lg'
                  }`}>
                    {filteredEvents[0].timeInfo.isUpcoming ? '🚀 NEXT EVENT' : '📅 ARCHIVE'}
                  </div>
                </div>

                {/* Content grid */}
                <div className="grid md:grid-cols-2 gap-8 p-10">
                  
                  {/* Left: Image */}
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-emerald-500/20 group-hover:ring-emerald-400/40 transition-all duration-500">
                      <img
                        src={filteredEvents[0].image || filteredEvents[0].images?.[0]}
                        alt={filteredEvents[0].title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Image overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Floating particles around image */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-75"></div>
                  </div>

                  {/* Right: Content */}
                  <div className="flex flex-col justify-center space-y-6">
                    
                    {/* Event type badge */}
                    <div className="inline-flex items-center gap-2 self-start">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-400 text-sm font-mono uppercase tracking-wider">
                        {filteredEvents[0].type}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-5xl font-bold text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-300 group-hover:to-cyan-300 transition-all duration-500">
                      {filteredEvents[0].title}
                    </h2>

                    {/* Date */}
                    <div className="flex items-center gap-3 text-gray-300 text-lg">
                      <HiCalendar className="w-5 h-5 text-emerald-400" />
                      <span className="font-light">
                        {new Date(filteredEvents[0].eventDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Time badge */}
                    <div className="flex items-center gap-3">
                      <div className={`px-6 py-3 rounded-xl text-xl font-mono font-bold shadow-lg ${
                        filteredEvents[0].timeInfo.isUpcoming
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-emerald-500/50'
                          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-gray-500/50'
                      }`}>
                        {filteredEvents[0].timeInfo.text}
                      </div>
                    </div>

                    {/* Live countdown */}
                    {filteredEvents[0].timeInfo.isUpcoming && (
                      <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                          ⏱️ Live Countdown
                        </div>
                        <Countdown targetDate={filteredEvents[0].eventDate} />
                      </div>
                    )}

                    {/* CTA */}
                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2 text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        <span className="font-medium">View Full Details</span>
                        <HiExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="absolute left-1/2 top-186 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-emerald-300 to-emerald-500 opacity-60 transform -translate-x-1/2"></div>

        {/* Timeline Events */}
        <div className="space-y-24 mt-16">
          {filteredEvents.slice(1).map((event, index) => (
            <div
              key={event.id || index}
              onClick={() => handleEventClick(event)}
              className={`group relative cursor-pointer ${index % 2 === 0 ? 'flex justify-start slide-in-left' : 'flex justify-end slide-in-right'}`}
            >
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-400 rounded-full border-4 border-black group-hover:scale-150 transition-all duration-300 z-20 journey-node shadow-lg"></div>

              <div className={`relative max-w-lg ${index % 2 === 0 ? 'mr-auto pr-16' : 'ml-auto pl-16'}`}>
                <div className="relative p-6 hover:scale-105 transition-all duration-500">
                  <div className="w-64 h-64 bg-gray-800 rounded-2xl overflow-hidden shadow-xl mb-4">
                    <img
                      src={event.image || event.images?.[0]}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{event.title}</h3>

                    <div className="text-lg text-gray-400 mb-4">{new Date(event.eventDate).toLocaleDateString()}</div>

                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className={`px-4 py-2 rounded-full text-sm font-mono ${event.timeInfo.isUpcoming ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>{event.timeInfo.text}</div>

                      {event.timeInfo.isUpcoming && (
                        <div className="flex gap-2 text-xs font-mono">
                          <Countdown targetDate={event.eventDate} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-2">No events found</div>
            <p className="text-gray-500 text-sm">Try adjusting your search</p>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}></div>

          <div className="relative bg-black border border-white/20 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-scroll">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="p-8">
              <div className="aspect-video bg-gray-800 rounded-lg mb-6 overflow-hidden">
                <img src={selectedEvent.images?.[0] || selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              </div>

              <h2 className="text-3xl font-light text-white mb-4">{selectedEvent.title}</h2>
              <div className="text-sm text-gray-400 mb-6">{new Date(selectedEvent.date).toLocaleDateString()} • {selectedEvent.type}</div>
              <p className="text-gray-300 leading-relaxed">{selectedEvent.description}</p>
            </div>
          </div>
        </div>
      )}

      <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}