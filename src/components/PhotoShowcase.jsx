import React from 'react';
import { weddingData } from '../config/weddingData';

export default function PhotoShowcase() {
  return (
    <section className="py-8 px-4 max-w-4xl mx-auto">
      <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-500 hover:shadow-wedding-rose/20">
        <img
          src={weddingData.photos.story}
          alt="Dishan and Pabodha romantic photo"
          className="w-full h-[320px] sm:h-[480px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
        />
        {/* Soft bottom vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
        
        {/* Caption Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-serif italic text-lg sm:text-xl text-wedding-pink drop-shadow">
            "Two souls, one heart, forever together."
          </p>
          <span className="text-xs uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
            {weddingData.couple.title}
          </span>
        </div>
      </div>
    </section>
  );
}
