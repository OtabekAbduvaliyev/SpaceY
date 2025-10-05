'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HiCalendar, HiChevronLeft, HiChevronRight, HiClock, HiLocationMarker, HiStar, HiEye, HiArrowLeft } from 'react-icons/hi';
import { WiDaySunny, WiMeteor, WiMoonAltWaxingCrescent4, WiStars } from 'react-icons/wi';
import EventModal from '../Components/Modals/EventModal';

// Unified event interface (same as events page)
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
  isUpcoming?: boolean;
}

// Calendar component for SpaceY events
export const SpaceYCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const selectedEventsRef = useRef<HTMLDivElement | null>(null);
  const [events, setEvents] = useState<SpaceYEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<SpaceYEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal handlers
  const handleEventClick = (event: SpaceYEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Fetch events from our API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(Array.isArray(data.all) ? data.all : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get events for a specific date (match by yyyy-mm-dd)
  const getEventsForDate = (date: Date) => {
    if (!events || events.length === 0) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => (new Date(event.date).toISOString().split('T')[0]) === dateStr);
  };

  // Get events for the current month
  const getEventsForMonth = () => {
    if (!events || events.length === 0) return [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return events.filter(event => {
      const d = new Date(event.date);
      return d >= startDate && d <= endDate;
    }).map(ev => ({ ...ev, isUpcoming: new Date(ev.date) > new Date() }));
  };

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
      return newDate;
    });
  };

  // Get calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Get event type icon
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'eclipse':
        return <WiDaySunny className="w-4 h-4 text-orange-400" />;
      case 'meteor':
        return <WiMeteor className="w-4 h-4 text-blue-400" />;
      case 'moon':
        return <WiMoonAltWaxingCrescent4 className="w-4 h-4 text-gray-300" />;
      case 'conjunction':
        return <WiStars className="w-4 h-4 text-yellow-400" />;
      default:
        return <HiStar className="w-4 h-4 text-emerald-400" />;
    }
  };

  const calendarDays = getCalendarDays();
  const monthEvents = getEventsForMonth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading SpaceY calendar...</p>
        </div>
      </div>
    );
  }
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    // small delay to allow DOM/layout update, then smoothly scroll the events panel into view
    setTimeout(() => {
      if (selectedEventsRef.current) {
        selectedEventsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }, 120);
  };
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Add Back Button */}
      <div className="fixed top-6 left-6 z-20">
        <a
          href="/"
          className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
        >
          <HiArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Back</span>
        </a>
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="text-emerald-400">SpaceY</span>
              <span className="text-emerald-400 group-hover:animate-pulse">.</span>
              <span className="text-white">CALENDAR</span>
            </h1>
            <p className="text-gray-400 text-sm font-mono">Track celestial events across time</p>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-semibold text-white min-w-[200px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const isSelected = selectedDate?.toDateString() === day.toDateString();

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`
                    relative min-h-[100px] p-2 rounded-lg cursor-pointer transition-all duration-300
                    ${isCurrentMonth ? 'bg-white/5 hover:bg-white/10' : 'bg-white/2 text-gray-500'}
                    ${isToday ? 'ring-2 ring-emerald-500 bg-emerald-500/10' : ''}
                    ${isSelected ? 'bg-emerald-500/20 border border-emerald-500/50' : 'border border-white/10'}
                  `}
                >
                  {/* Day Number */}
                  <div className="text-sm font-medium mb-1">
                    {day.getDate()}
                  </div>

                  {/* Events */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30"
                      >
                        {getEventIcon(event.type)}
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div ref={selectedEventsRef} className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4">
              Events on {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getEventsForDate(selectedDate).map((event, index) => (
                  <div
                    key={index}
                    onClick={() => handleEventClick(event)}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {getEventIcon(event.type)}
                      <span className="text-sm font-medium text-emerald-400 uppercase">
                        {event.type}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {event.title}
                    </h4>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <HiClock className="w-3 h-3" />
                        <span>{event.visibility?.bestTime || 'All day'}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <HiLocationMarker className="w-3 h-3" />
                          <span>{event.location.name}</span>
                        </div>
                      )}
                      
                      {event.visibility && (
                        <div className="flex items-center gap-2">
                          <HiEye className="w-3 h-3" />
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <HiStar 
                                key={i} 
                                className={`w-3 h-3 ${i < (event.visibility?.rating || 0) ? 'text-yellow-400' : 'text-gray-600'}`} 
                              />
                            ))}
                            <span className="ml-1">{event.visibility?.rating || 0}/5</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <HiCalendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No events scheduled for this date</p>
              </div>
            )}
          </div>
        )}

        {/* Month Summary */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-4">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Summary
          </h3>
          
          {monthEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthEvents.map((event, index) => (
                <div
                  key={index}
                  onClick={() => handleEventClick(event)}
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  {getEventIcon(event.type)}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{event.title}</h4>
                    <p className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-mono ${
                    event.isUpcoming ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {event.isUpcoming ? 'UPCOMING' : 'PASSED'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <HiCalendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No events scheduled for this month</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SpaceYCalendar;
