import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StorySection from './components/StorySection';
import PhotoShowcase from './components/PhotoShowcase';
import VenueSection from './components/VenueSection';
import TimelineSection from './components/TimelineSection';
import MomentsSection from './components/MomentsSection';
import Footer from './components/Footer';
import RSVPModal from './components/RSVPModal';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-wedding-lightBg text-wedding-slate selection:bg-wedding-rose selection:text-white">
      {/* Floating Header Navbar */}
      <Navbar
        onOpenRSVP={() => setIsRSVPOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 space-y-4">
        <HeroSection onOpenRSVP={() => setIsRSVPOpen(true)} />
        <StorySection />
        <PhotoShowcase />
        <VenueSection />
        <TimelineSection />
        <MomentsSection onOpenRSVP={() => setIsRSVPOpen(true)} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Interactive RSVP Modal */}
      <RSVPModal
        isOpen={isRSVPOpen}
        onClose={() => setIsRSVPOpen(false)}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
