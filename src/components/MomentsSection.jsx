import React, { useState } from 'react';
import { Heart, Play, Camera, Sparkles, X } from 'lucide-react';
import { weddingData } from '../config/weddingData';

export default function MomentsSection({ onOpenRSVP }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="moments" className="py-16 sm:py-24 px-4 max-w-4xl mx-auto space-y-16">
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

      {/* Our Moments Section Header */}
      {/* <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-wedding-pink text-wedding-rose mb-1">
            <Camera className="w-6 h-6 text-wedding-rose" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wedding-emerald">
            Our Moments
          </h2>
          <p className="text-sm text-wedding-slate/80">
            A glimpse into our journey of love
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group cursor-pointer" onClick={() => setModalOpen(true)}>
          <img
            src={weddingData.photos.moments}
            alt="Dishan and Pabodha moments photo"
            className="w-full h-[300px] sm:h-[450px] object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white">
            <div className="w-7 h-7 rounded-full bg-wedding-rose flex items-center justify-center font-bold text-xs">
              {weddingData.couple.groom[0]}{weddingData.couple.bride[0]}
            </div>
            <div>
              <p className="text-xs font-semibold leading-tight">{weddingData.couple.title}</p>
              <p className="text-[10px] text-white/70">Sunset Moments</p>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-wedding-rose/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-115 transition-transform duration-300">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm flex items-center justify-between">
            <span className="font-serif italic text-wedding-pink">Click to view memory photo</span>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px]">{weddingData.event.dateFormatted}</span>
          </div>
        </div>
      </div> */}

      {/* Fullscreen Photo Lightbox Modal */}
      {/* {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" onClick={() => setModalOpen(false)}>
          <button className="absolute top-6 right-6 text-white hover:text-wedding-rose p-2">
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={weddingData.photos.moments}
              alt={`${weddingData.couple.title} photo`}
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-center text-white/80 font-serif text-lg mt-4 italic">
              "Love is composed of a single soul inhabiting two bodies." — {weddingData.couple.title}
            </p>
          </div>
        </div>
      )} */}
    </section>
  );
}
