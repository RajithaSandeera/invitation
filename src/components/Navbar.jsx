import React, { useState, useEffect, useRef } from 'react';
import { Heart, Music, Volume2, VolumeX, Menu, X, Calendar, Lock } from 'lucide-react';
import { weddingData } from '../config/weddingData';

export default function Navbar({ onOpenRSVP, onOpenAdmin }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let hasPlayedOnScroll = false;

    const startAudioOnUserInteraction = () => {
      if (!hasPlayedOnScroll && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          hasPlayedOnScroll = true;
        }).catch((err) => {
          console.log("Autoplay on interaction waiting for explicit user gesture:", err);
        });
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (window.scrollY > 20 && !hasPlayedOnScroll) {
        startAudioOnUserInteraction();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', startAudioOnUserInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', startAudioOnUserInteraction);
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Audio play deferred by browser policy:", err);
      });
    }
  };

  const navLinks = [
    { name: "Story", href: "#story" },
    { name: "Venue", href: "#venue" },
    { name: "Events", href: "#events" },
    { name: "Gallery", href: "#moments" },
  ];

  return (
    <>
      {/* Audio element - royalty free romantic wedding piano loop */}
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-113063.mp3"
      />

      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'glass-card py-3 shadow-md' : 'bg-gradient-to-b from-black/60 to-transparent py-4 text-white'
      }`}>
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          {/* Logo / Names */}
          <a href="#" className="flex items-center gap-2 text-lg sm:text-xl font-serif font-semibold tracking-wide hover:opacity-80 transition-opacity">
            <Heart className="w-5 h-5 text-wedding-rose fill-wedding-rose animate-pulse" />
            <span className={isScrolled ? 'text-wedding-emerald' : 'text-white'}>
              {weddingData.couple.groom} & {weddingData.couple.bride}
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`transition-colors hover:text-wedding-rose ${
                  isScrolled ? 'text-wedding-slate' : 'text-white/90'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Actions: Music Toggle & RSVP Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleMusic}
              title={isPlaying ? "Mute Music" : "Play Romantic Music"}
              className={`p-2 rounded-full transition-all ${
                isPlaying 
                  ? 'bg-wedding-rose text-white shadow-lg animate-bounce' 
                  : isScrolled 
                    ? 'bg-wedding-pink text-wedding-emerald hover:bg-wedding-rose/20' 
                    : 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30'
              }`}
            >
              {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenRSVP}
              className="bg-wedding-emerald hover:bg-wedding-teal text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-lg transition-transform transform active:scale-95 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              RSVP
            </button>

            <button
              onClick={onOpenAdmin}
              title="Admin Portal"
              className={`p-2 rounded-full transition-all text-xs font-medium flex items-center gap-1 ${
                isScrolled ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${isScrolled ? 'text-wedding-slate' : 'text-white'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card mt-2 mx-4 p-4 rounded-2xl flex flex-col gap-3 shadow-xl animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-wedding-slate font-medium py-2 px-3 rounded-lg hover:bg-wedding-pink/50 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
