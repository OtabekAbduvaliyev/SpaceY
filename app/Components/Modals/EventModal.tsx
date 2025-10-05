'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HiX, HiChevronLeft, HiChevronRight, HiCalendar, HiLocationMarker, HiClock, HiStar, HiEye } from 'react-icons/hi';
import { WiDaySunny, WiMeteor, WiMoonAltWaxingCrescent4, WiStars } from 'react-icons/wi';

interface EventModalProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const mainImgRef = useRef<HTMLImageElement | null>(null);

  // Reset image index when event changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [event]);

  // Ensure thumbnail is visible when index changes
  useEffect(() => {
    if (!thumbRef.current) return;
    const thumbs = Array.from(thumbRef.current.querySelectorAll<HTMLButtonElement>('.thumb-btn'));
    const btn = thumbs[currentImageIndex];
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentImageIndex, event]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePreviousImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentImageIndex, event]);

  if (!isOpen || !event) return null;

  const images = event.images || [event.image];
  const hasMultipleImages = images.length > 1;

  const handleNextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setIsLoading(true);
    }
  };

  const handlePreviousImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsLoading(true);
    }
  };

  const handleThumbClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsLoading(true);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    mainImgRef.current?.focus();
  };

  const handleImageError = () => {
    setIsLoading(false);
  };

  // Get event type icon
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'eclipse':
        return <WiDaySunny className="w-6 h-6 text-orange-400" />;
      case 'meteor':
        return <WiMeteor className="w-6 h-6 text-blue-400" />;
      case 'moon':
        return <WiMoonAltWaxingCrescent4 className="w-6 h-6 text-gray-300" />;
      case 'conjunction':
        return <WiStars className="w-6 h-6 text-yellow-400" />;
      default:
        return <HiStar className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-6xl max-h-[92vh] mx-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/30 rounded-3xl overflow-hidden shadow-2xl">
        {/* Compact Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {getEventIcon(event.type)}
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">
                {event.title || event.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <HiCalendar className="w-3 h-3" />
                <span>
                  {new Date(event.date || event.close_approach_date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all hover:rotate-90 duration-300"
            aria-label="Close event modal"
          >
            <HiX className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[92vh] pt-20">
          {/* Image Section - Larger, more prominent */}
          <div className="lg:w-3/5 relative flex flex-col">
            <div className="relative flex-1 bg-gradient-to-br from-gray-950 to-black flex items-center justify-center overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
              )}
              
              <img
                ref={mainImgRef}
                src={images[currentImageIndex]}
                alt={event.title || event.name}
                className="w-full h-full object-contain outline-none"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ display: isLoading ? 'none' : 'block' }}
                tabIndex={0}
              />

              {/* Image Navigation */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <HiChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <HiChevronRight className="w-6 h-6 text-white" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded-full text-sm text-white">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails rail - positioned at bottom of image area */}
            {hasMultipleImages && (
              <div className="relative px-4 py-3 bg-black/40 backdrop-blur-sm border-t border-white/10">
                {/* left gradient hint */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
                {/* right gradient hint */}
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black via-black/60 to-transparent z-10" />

                <div
                  ref={thumbRef}
                  className="flex gap-3 overflow-x-auto py-2 px-1 no-scrollbar snap-x snap-mandatory"
                  role="list"
                  aria-label="Image thumbnails"
                >
                  {images.map((src: string, i: number) => (
                    <button
                      key={i}
                      className={`thumb-btn snap-center flex-none w-28 h-16 rounded-lg overflow-hidden border transition-transform duration-200 ${currentImageIndex === i ? 'ring-2 ring-emerald-500 scale-105' : 'hover:scale-[1.02]'}`}
                      onClick={() => handleThumbClick(i)}
                      aria-label={`View image ${i + 1}`}
                      role="listitem"
                      style={{
                        backgroundImage: `url('${src}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details Section - Optimized layout */}
          <div className="lg:w-2/5 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-black/90 border-l border-white/10 custom-scrollbar">
            <div className="p-6 space-y-5">
              {/* Key Info Cards - Most important at top */}
              <div className="grid grid-cols-2 gap-3">
                {/* Visibility */}
                {event.visibility && (
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-3 backdrop-blur-sm">
                    <h4 className="text-xs font-semibold text-emerald-300 mb-2 flex items-center gap-1.5">
                      <HiEye className="w-3.5 h-3.5" />
                      Visibility
                    </h4>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <HiStar 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < event.visibility.rating 
                              ? 'text-yellow-400' 
                              : 'text-gray-600'
                          }`} 
                        />
                      ))}
                      <span className="text-sm font-bold text-white ml-1">{event.visibility.rating}/5</span>
                    </div>
                    <p className="text-xs text-gray-300">{event.visibility.conditions}</p>
                  </div>
                )}

                {/* Best Time */}
                {event.visibility?.bestTime && (
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-3 backdrop-blur-sm">
                    <h4 className="text-xs font-semibold text-emerald-300 mb-2 flex items-center gap-1.5">
                      <HiClock className="w-3.5 h-3.5" />
                      Best Time
                    </h4>
                    <p className="text-sm font-semibold text-white">{event.visibility.bestTime}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{event.visibility.duration}</p>
                  </div>
                )}

                {/* Location */}
                {event.location && (
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-3 backdrop-blur-sm col-span-2">
                    <h4 className="text-xs font-semibold text-emerald-300 mb-2 flex items-center gap-1.5">
                      <HiLocationMarker className="w-3.5 h-3.5" />
                      Location
                    </h4>
                    <p className="text-sm font-semibold text-white">{event.location.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{event.location.coordinates}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-emerald-400 mb-2.5 uppercase tracking-wide">About This Event</h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {event.description || event.explanation}
                </p>
              </div>

              {/* Scientific Data */}
              {event.scientific && (
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-4 backdrop-blur-sm">
                  <h4 className="text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wide">Scientific Data</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    {event.scientific.magnitude && (
                      <div>
                        <p className="text-gray-400 uppercase tracking-wider mb-0.5">Magnitude</p>
                        <p className="text-white font-semibold text-sm">{event.scientific.magnitude}</p>
                      </div>
                    )}
                    {event.scientific.distance && (
                      <div>
                        <p className="text-gray-400 uppercase tracking-wider mb-0.5">Distance</p>
                        <p className="text-white font-semibold text-sm">{event.scientific.distance}</p>
                      </div>
                    )}
                    {event.scientific.size && (
                      <div>
                        <p className="text-gray-400 uppercase tracking-wider mb-0.5">Size</p>
                        <p className="text-white font-semibold text-sm">{event.scientific.size}</p>
                      </div>
                    )}
                    {event.scientific.speed && (
                      <div>
                        <p className="text-gray-400 uppercase tracking-wider mb-0.5">Speed</p>
                        <p className="text-white font-semibold text-sm">{event.scientific.speed}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Event Type Badge */}
              <div className="flex items-center justify-center gap-2 pt-2 pb-1">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                  {getEventIcon(event.type)}
                  <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">{event.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* remove native scrollbar but keep accessibility for keyboard */
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          height: 8px;
          display: none;
        }
        /* subtle focus highlight for thumbnails */
        .thumb-btn:focus {
          outline: 2px solid rgba(16, 185, 129, 0.14);
          outline-offset: 3px;
        }
        /* Thin minimalistic scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(16, 185, 129, 0.3) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default EventModal;