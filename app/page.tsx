'use client';

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { HiArrowRight, HiCalendar, HiMenu } from 'react-icons/hi';
import { WiDaySunny, WiMeteor, WiMoonAltWaxingCrescent4 } from 'react-icons/wi';

export default function SpaceEventsHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; radius: number; opacity: number; speed: number }[] = [];
    
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.005 + 0.001,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach((star) => {
        star.opacity += star.speed;
        if (star.opacity > 1 || star.opacity < 0.2) star.speed *= -1;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 overflow-hidden home-font">
      {/* Animated Stars Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Track cosmic events in real-time
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight home-heading">
            JOURNEY TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">SPACE</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-slate-500"></div>
            <p className="text-slate-400 text-xl tracking-wide">
              Discover upcoming celestial events
            </p>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-slate-500"></div>
          </div>

          {/* Event Types - Minimal */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-slate-300">
              <WiDaySunny className="text-3xl text-emerald-400" />
              <span className="text-sm font-medium">Solar Eclipses</span>
            </div>
            <div className="w-px h-6 bg-slate-700"></div>
            <div className="flex items-center gap-2 text-slate-300">
              <WiMeteor className="text-3xl text-teal-400" />
              <span className="text-sm font-medium">Meteor Showers</span>
            </div>
            <div className="w-px h-6 bg-slate-700"></div>
            <div className="flex items-center gap-2 text-slate-300">
              <WiMeteor className="text-3xl text-cyan-400" />
              <span className="text-sm font-medium">Comets</span>
            </div>
            <div className="w-px h-6 bg-slate-700"></div>
            <div className="flex items-center gap-2 text-slate-300">
              <WiMoonAltWaxingCrescent4 className="text-3xl text-emerald-300" />
              <span className="text-sm font-medium">Planetary Events</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group relative px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 w-full sm:w-auto">
              <Link href={'/events'} className="flex items-center justify-center gap-2">
                View All Events
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </button>
            
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-md text-sm font-semibold border border-white/10 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto">
              <Link href={'/calendar'} className="flex items-center justify-center gap-2">
                <HiCalendar className="w-5 h-5" />
                Events Calendar
              </Link>
            </button>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
    </div>
  );
}