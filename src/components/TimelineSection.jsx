import React from 'react';
import { Sparkles, Camera, Music, Heart, Calendar } from 'lucide-react';
import { weddingData } from '../config/weddingData';

const iconMap = {
  Sparkles: Sparkles,
  Camera: Camera,
  Music: Music,
  Heart: Heart
};

export default function TimelineSection() {
  return (
    <section id="events" className="py-16 sm:py-24 px-4 max-w-3xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12 space-y-2">
        <div className="inline-flex p-3 rounded-full bg-wedding-pink text-wedding-rose mb-2">
          <Calendar className="w-6 h-6 text-wedding-rose" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-wedding-emerald">
          Events Schedule
        </h2>
        <p className="text-sm text-wedding-slate/80">
          Here is what we have planned for our memorable evening
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative border-l-2 border-wedding-rose/40 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-10">
        {weddingData.schedule.map((item, idx) => {
          const IconComponent = iconMap[item.icon] || Sparkles;

          return (
            <div key={idx} className="relative group">
              {/* Icon Marker */}
              <div className="absolute -left-[35px] sm:-left-[51px] top-0.5 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-wedding-cream border-2 border-wedding-rose flex items-center justify-center text-wedding-rose shadow-md group-hover:scale-110 group-hover:bg-wedding-rose group-hover:text-white transition-all duration-300">
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Event Card */}
              <div className="glass-card p-5 sm:p-6 rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-wedding-emerald">
                    {item.title}
                  </h3>
                  <span className="inline-block text-xs font-semibold px-3 py-1 bg-wedding-pink text-wedding-rose rounded-full shrink-0 w-fit">
                    {item.time}
                  </span>
                </div>
                <p className="text-sm text-wedding-slate/80 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
