import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { weddingData } from '../config/weddingData';

export default function PhotoShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images = weddingData.gallery && weddingData.gallery.length > 0
    ? weddingData.gallery
    : [
        { src: "/images/1.jpeg", title: "Sweet Embrace", caption: "Two souls, one heart, forever together." },
        { src: "/images/2.jpeg", title: "Hand in Hand", caption: "Walking into a beautiful future together." },
        { src: "/images/3.jpeg", title: "Pure Joy", caption: "Every moment with you is a blessing." },
        { src: "/images/4.jpeg", title: "Romantic Moments", caption: "Love that grows deeper with every passing day." },
        { src: "/images/5.jpeg", title: "Golden Memories", caption: "Framed in warmth, affection, and happiness." },
        { src: "/images/6.jpeg", title: "Forever & Always", caption: "Ready to step onto life's grandest stage together." }
      ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, images.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <section className="py-8 px-4 max-w-4xl mx-auto">
      <div 
        className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-500 hover:shadow-wedding-rose/20 bg-black/10"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Slideshow Image container */}
        <div className="relative w-full h-[340px] sm:h-[480px]">
          {images.map((img, idx) => (
            <img
              key={img.src || idx}
              src={img.src}
              alt={img.title || `${weddingData.couple.title} photo`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            />
          ))}
        </div>

        {/* Soft bottom vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Caption & Indicators Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-serif italic text-base sm:text-xl text-wedding-pink drop-shadow">
              "{images[currentIndex].caption || images[currentIndex].title}"
            </p>
            <span className="text-[11px] uppercase tracking-widest text-white/70 block">
              {weddingData.couple.title} • {currentIndex + 1} of {images.length}
            </span>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-wedding-rose' : 'w-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

