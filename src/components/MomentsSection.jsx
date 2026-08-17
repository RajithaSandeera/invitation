import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Camera, Sparkles, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { weddingData } from '../config/weddingData';

export default function MomentsSection({ onOpenRSVP }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const galleryItems = weddingData.gallery && weddingData.gallery.length > 0
    ? weddingData.gallery
    : [
        { id: 1, src: "/images/1.jpeg", title: "Sweet Embrace", caption: "Cherished togetherness" },
        { id: 2, src: "/images/2.jpeg", title: "Hand in Hand", caption: "Walking into a beautiful future" },
        { id: 3, src: "/images/3.jpeg", title: "Pure Joy", caption: "Moments of laughter and love" },
        { id: 4, src: "/images/4.jpeg", title: "Romantic Moments", caption: "Every glance speaks a thousand feelings" },
        { id: 5, src: "/images/5.jpeg", title: "Golden Memories", caption: "A love story framed in warmth" },
        { id: 6, src: "/images/6.jpeg", title: "Forever & Always", caption: "Beginning life's grandest journey" }
      ];

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  }, [galleryItems.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  }, [galleryItems.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  return (
    <section id="moments" className="py-16 sm:py-24 px-4 max-w-5xl mx-auto space-y-16">
      {/* Our Gallery / Moments Header */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 rounded-full bg-wedding-pink text-wedding-rose mb-1 shadow-sm">
            <Camera className="w-6 h-6 text-wedding-rose" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-wedding-emerald">
            Our Moments
          </h2>
          <p className="text-sm sm:text-base text-wedding-slate/80 max-w-md mx-auto font-light">
            A glimpse into our journey of love & togetherness
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => setSelectedIndex(index)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg border-2 border-white cursor-pointer transform transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
            >
              <img
                src={item.src}
                alt={item.title || `Gallery photo ${index + 1}`}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
              
              {/* Expand Icon on Hover */}
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/30">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Title & Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1 transform group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-serif font-semibold text-lg text-wedding-pink leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-1 font-light">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Can't Wait To See You Banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden bg-gradient-to-br from-wedding-pink/30 via-white to-wedding-pink/20">
        <Sparkles className="w-8 h-8 text-wedding-gold/40 absolute top-4 left-4" />
        <Sparkles className="w-8 h-8 text-wedding-gold/40 absolute bottom-4 right-4" />

        <div className="inline-flex p-3 rounded-full bg-wedding-pink text-wedding-rose mb-3">
          <Heart className="w-6 h-6 fill-wedding-rose" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-wedding-emerald mb-3">
          Can't wait to see you
        </h2>

        <p className="text-sm sm:text-base text-wedding-slate/80 max-w-lg mx-auto mb-8 font-light leading-relaxed">
          Our joy will not be complete without your presence. Please let us know if you can join our celebration so we can prepare everything for you!
        </p>

        <button
          onClick={onOpenRSVP}
          className="bg-wedding-emerald hover:bg-wedding-teal text-white font-semibold text-base px-8 py-3.5 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
        >
          <Heart className="w-5 h-5 fill-wedding-pink text-wedding-pink" />
          Confirm Participation (RSVP)
        </button>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs sm:text-sm font-medium tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Photo {selectedIndex + 1} of {galleryItems.length}
            </span>
            <button
              onClick={() => setSelectedIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors border border-white/20"
              aria-label="Close photo modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo View with Nav Buttons */}
          <div className="relative flex-1 flex items-center justify-center my-2" onClick={(e) => e.stopPropagation()}>
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all border border-white/20 shadow-lg"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Photo */}
            <div className="max-w-4xl max-h-[72vh] flex flex-col items-center justify-center px-4">
              <img
                src={galleryItems[selectedIndex].src}
                alt={galleryItems[selectedIndex].title}
                className="max-h-[65vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 transition-all duration-300"
              />
              <div className="text-center mt-3 text-white space-y-1">
                <h4 className="font-serif text-xl sm:text-2xl text-wedding-pink">
                  {galleryItems[selectedIndex].title}
                </h4>
                <p className="text-xs sm:text-sm text-white/75 font-light italic">
                  {galleryItems[selectedIndex].caption}
                </p>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all border border-white/20 shadow-lg"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10" onClick={(e) => e.stopPropagation()}>
            {galleryItems.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => setSelectedIndex(idx)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  idx === selectedIndex ? 'border-wedding-rose scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={item.src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

