import React from 'react';
import { Sparkles, HeartHandshake } from 'lucide-react';
import { weddingData } from '../config/weddingData';

export default function StorySection() {
  return (
    <section id="story" className="py-16 sm:py-24 px-4 max-w-3xl mx-auto text-center relative">
      {/* Decorative top icon */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-wedding-pink flex items-center justify-center text-wedding-rose shadow-inner">
          <HeartHandshake className="w-6 h-6" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wedding-emerald mb-2">
        {weddingData.couple.storyTitle}
      </h2>

      {/* Date Tag */}
      <div className="inline-block mb-6">
        <span className="text-lg sm:text-xl font-bold font-mono tracking-widest text-wedding-rose italic">
          {weddingData.couple.storyDate}
        </span>
      </div>

      {/* Story Content Card */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden text-wedding-slate leading-relaxed text-base sm:text-lg font-light">
        <Sparkles className="w-6 h-6 text-wedding-gold/40 absolute top-4 left-4" />
        <Sparkles className="w-6 h-6 text-wedding-gold/40 absolute bottom-4 right-4" />
        
        <p className="relative z-10 italic">
          "{weddingData.couple.storyText}"
        </p>

        {/* Signature */}
        <div className="mt-8 pt-6 border-t border-wedding-rose/20 flex items-center justify-center gap-2">
          <span className="font-cursive text-3xl text-wedding-rose">{weddingData.couple.title}</span>
        </div>
      </div>
    </section>
  );
}
