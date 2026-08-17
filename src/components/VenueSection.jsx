import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Clock, ExternalLink, Navigation, Calendar, ChevronDown, Download } from 'lucide-react';
import { weddingData } from '../config/weddingData';
import { getGoogleCalendarUrl, getOutlookCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';

export default function VenueSection() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section id="venue" className="py-16 sm:py-24 px-4 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex p-3 rounded-full bg-wedding-pink text-wedding-emerald mb-2">
          <MapPin className="w-6 h-6 text-wedding-rose" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wedding-emerald">
          Venue & Time
        </h2>
        <p className="text-sm text-wedding-slate/80">
          Join us as we celebrate our special day at this breathtaking location
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        {/* Venue Info Top Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-wedding-rose/20">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-wedding-emerald">
              {weddingData.event.venueName}
            </h3>
            <p className="text-sm sm:text-base text-wedding-slate/80 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-wedding-rose shrink-0" />
              {weddingData.event.address}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-wedding-teal font-medium">
              <a 
                href={weddingData.event.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 bg-wedding-pink/60 px-3 py-1 rounded-full text-wedding-emerald"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Website / Map
              </a>
            </div>
          </div>

          <div className="bg-wedding-emerald text-white p-5 rounded-2xl shrink-0 flex flex-col justify-center space-y-3 shadow-lg relative">
            <div className="flex items-center gap-2 text-wedding-pink text-xs uppercase tracking-wider font-semibold">
              <Calendar className="w-4 h-4 text-wedding-rose" />
              <span>Wedding Day</span>
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold">
              {weddingData.event.fullDateDisplay}
            </div>
            <div className="text-xs text-white/80 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-wedding-pink" />
              {weddingData.event.timeFormatted}
            </div>

            {/* Add to Calendar Dropdown Button */}
            <div className="relative pt-1" ref={menuRef}>
              <button
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="w-full bg-wedding-rose hover:bg-wedding-rose/90 text-white font-medium text-xs py-2 px-3 rounded-xl shadow flex items-center justify-between gap-1 transition-all"
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  Add to Calendar
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${calendarOpen ? 'rotate-180' : ''}`} />
              </button>

              {calendarOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white text-wedding-slate rounded-xl shadow-2xl border border-wedding-rose/20 p-1.5 z-30 space-y-1 animate-fadeIn">
                  <a
                    href={getGoogleCalendarUrl(weddingData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setCalendarOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-wedding-pink/40 rounded-lg transition-colors text-wedding-slate font-medium"
                  >
                    <span className="text-base leading-none">📅</span>
                    Google Calendar
                  </a>
                  <button
                    onClick={() => {
                      downloadIcsFile(weddingData);
                      setCalendarOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs hover:bg-wedding-pink/40 rounded-lg transition-colors text-wedding-slate font-medium"
                  >
                    <span className="text-base leading-none">🍏</span>
                    Apple Calendar (.ics)
                  </button>
                  <a
                    href={getOutlookCalendarUrl(weddingData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setCalendarOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-wedding-pink/40 rounded-lg transition-colors text-wedding-slate font-medium"
                  >
                    <span className="text-base leading-none">📧</span>
                    Outlook Web
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-serif font-semibold text-wedding-emerald flex items-center gap-2">
              <Navigation className="w-5 h-5 text-wedding-rose" />
              Location Map
            </h4>
            
            <div className="flex items-center gap-2">
              <a
                href={weddingData.event.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold bg-wedding-rose text-white px-3.5 py-2 rounded-full shadow hover:bg-wedding-rose/90 transition-colors flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                Open Google Maps
              </a>
              <a
                href={weddingData.event.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold bg-wedding-slate text-white px-3.5 py-2 rounded-full shadow hover:bg-wedding-slate/90 transition-colors hidden sm:flex items-center gap-1"
              >
                Waze
              </a>
            </div>
          </div>

          {/* Map Preview Container */}
          <div className="w-full h-[280px] sm:h-[360px] rounded-2xl overflow-hidden shadow-inner border border-wedding-rose/20 relative bg-slate-100">
            <iframe
              title="Venue Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(weddingData.event.venueName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
