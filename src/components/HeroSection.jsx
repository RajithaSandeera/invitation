import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { weddingData } from '../config/weddingData';
import { getGoogleCalendarUrl, getOutlookCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';

export default function HeroSection({ onOpenRSVP }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const heroMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (heroMenuRef.current && !heroMenuRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const targetDate = new Date(weddingData.event.dateIso).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-end sm:items-center justify-center overflow-hidden pb-12 pt-24 px-4">
      {/* Background Image with Dark Vignette Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={weddingData.photos.hero}
          alt={`${weddingData.couple.title} Wedding`}
          className="w-full h-full object-cover object-top filter brightness-[0.9] scale-105 transition-transform duration-10000 ease-out"
        />
        {/* Soft elegant gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-wedding-slate/90 via-wedding-slate/30 to-black/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white max-w-xl mx-auto w-full space-y-6 animate-fadeIn">
        {/* Interactive Save The Date Badge Dropdown */}
        <div className="relative inline-block z-20" ref={heroMenuRef}>
          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-xs uppercase tracking-widest text-wedding-pink border border-white/30 shadow-lg transition-all transform hover:scale-105"
            title="Click to Save to Google / Apple Calendar"
          >
            <Heart className="w-3.5 h-3.5 fill-wedding-pink text-wedding-pink" />
            <span className="font-semibold">Save The Date</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${calendarOpen ? 'rotate-180' : ''}`} />
          </button>

          {calendarOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-white/95 backdrop-blur-md text-wedding-slate rounded-2xl shadow-2xl border border-white/50 p-2 z-30 space-y-1 text-left animate-fadeIn">
              <p className="text-[10px] uppercase font-bold text-wedding-slate/60 px-3 py-1 tracking-wider">
                Add to your calendar
              </p>
              <a
                href={getGoogleCalendarUrl(weddingData)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setCalendarOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-wedding-pink/40 rounded-xl transition-colors font-medium text-wedding-slate"
              >
                <span className="text-base">📅</span>
                Google Calendar
              </a>
              <button
                onClick={() => {
                  downloadIcsFile(weddingData);
                  setCalendarOpen(false);
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs hover:bg-wedding-pink/40 rounded-xl transition-colors font-medium text-wedding-slate"
              >
                <span className="text-base">🍏</span>
                Apple Calendar (.ics)
              </button>
              <a
                href={getOutlookCalendarUrl(weddingData)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setCalendarOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-wedding-pink/40 rounded-xl transition-colors font-medium text-wedding-slate"
              >
                <span className="text-base">📧</span>
                Outlook Web
              </a>
            </div>
          )}
        </div>

        {/* Couple Names */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-white drop-shadow-md">
          {weddingData.couple.groom} <span className="font-cursive text-wedding-rose font-normal text-5xl sm:text-7xl md:text-8xl">&</span> {weddingData.couple.bride}
        </h1>

        {/* Date & Location Subtitle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base font-light text-white/90">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-wedding-rose" />
            <span>{weddingData.event.dateFormatted}</span>
          </div>
          <span className="hidden sm:inline text-wedding-rose">•</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-wedding-rose" />
            <span>{weddingData.event.venueName}</span>
          </div>
        </div>

        {/* Countdown Timer Grid */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Mins', val: timeLeft.minutes },
              { label: 'Secs', val: timeLeft.seconds },
            ].map((unit, idx) => (
              <div key={idx} className="bg-black/35 backdrop-blur-md border border-white/25 rounded-2xl p-2.5 sm:p-3 text-center shadow-lg">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-white leading-none">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-wedding-pink font-medium mt-1 block">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenRSVP}
            className="w-full sm:w-auto bg-wedding-rose hover:bg-wedding-rose/90 text-white font-semibold px-8 py-3.5 rounded-full shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 text-base flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            Confirm Participation (RSVP)
          </button>
          
          <a
            href="#story"
            className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white font-medium px-6 py-3.5 rounded-full border border-white/30 backdrop-blur-sm transition-all text-sm flex items-center justify-center gap-1"
          >
            Our Story
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-white/60 animate-bounce hidden sm:block">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
}
