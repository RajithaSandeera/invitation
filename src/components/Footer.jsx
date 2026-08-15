import React from 'react';
import { Heart, ArrowUp, Lock } from 'lucide-react';
import { weddingData } from '../config/weddingData';

export default function Footer({ onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-wedding-emerald text-white py-12 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-wedding-rose fill-wedding-rose animate-pulse" />
        </div>

        <h3 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
          {weddingData.couple.groom} & {weddingData.couple.bride}
        </h3>

        <p className="font-serif italic text-wedding-pink text-sm sm:text-base max-w-md mx-auto">
          "Thank you for being a part of our love story and celebrating our new beginning."
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 text-xs text-white/60 gap-4">
          <p>© 2026 {weddingData.couple.title}. All Rights Reserved.</p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-white/70 hover:text-wedding-pink transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
            >
              <Lock className="w-3.5 h-3.5" />
              Admin Portal
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-wedding-pink hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-full"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
