import React, { useState } from 'react';
import { X, CheckCircle2, Heart, Calendar, Send, ChevronRight, ChevronLeft, Sparkles, User, Phone, Users, UtensilsCrossed, Wine, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingData } from '../config/weddingData';
import { saveRSVPRecord } from '../utils/rsvpStorage';

export default function RSVPModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    side: 'Groom', // 'Groom' or 'Bride'
    attending: 'yes', // 'yes' or 'no'
    guestCount: 1,
    guestNames: '',
    needsDrinks: 'yes', // 'yes' or 'no'
    foodPreference: 'non-veg', // 'non-veg', 'veg'
    dietaryNotes: '',
  });

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log("Confetti error", e);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name.trim()) {
        alert("Please enter your name.");
        return;
      }
      if (formData.attending === 'no') {
        setStep(3);
        triggerConfetti();
        saveRSVP();
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      triggerConfetti();
      saveRSVP();
    }
  };

  const saveRSVP = () => {
    saveRSVPRecord(formData);
    localStorage.setItem('wedding_user_rsvp', JSON.stringify(formData));
  };

  // Generate .ics Calendar Download File
  const downloadCalendarFile = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//${weddingData.couple.title} Wedding//EN
BEGIN:VEVENT
SUMMARY:Wedding of ${weddingData.couple.title}
DESCRIPTION:Celebrate the wedding of ${weddingData.couple.title}! Venue: ${weddingData.event.venueName}, ${weddingData.event.address}.
LOCATION:${weddingData.event.venueName}, ${weddingData.event.address}
DTSTART:20260916T033000Z
DTEND:20260916T103000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${weddingData.couple.groom}_${weddingData.couple.bride}_Wedding.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format WhatsApp message
  const getWhatsAppShareUrl = () => {
    const sideText = formData.side === 'Groom' ? "Groom's Side 🤵 (Rajitha)" : "Bride's Side 👰 (Divya)";
    let msg = `🎉 *WEDDING RSVP CONFIRMATION*\n`;
    msg += `---------------------------------\n`;
    msg += `👤 *Name:* ${formData.name}\n`;
    msg += `📱 *Phone:* ${formData.phone || 'N/A'}\n`;
    msg += `🎈 *Side:* ${sideText}\n`;
    msg += `✨ *Attending:* ${formData.attending === 'yes' ? 'YES, Joyfully Accepts! 🥂' : 'No, Regretfully Declines 💔'}\n`;
    
    if (formData.attending === 'yes') {
      msg += `👥 *Number of Guests:* ${formData.guestCount}\n`;
      if (formData.guestNames) msg += `📝 *Guest Names:* ${formData.guestNames}\n`;
      msg += `🍱 *Food Preference:* ${formData.foodPreference === 'veg' ? 'Vegetarian 🥗' : 'Non-Vegetarian 🍗'}\n`;
      msg += `🥂 *Drinks Required:* ${formData.needsDrinks === 'yes' ? 'Yes, please 🥂' : 'No, thank you 🥤'}\n`;
      if (formData.dietaryNotes) msg += `🥗 *Dietary/Allergies:* ${formData.dietaryNotes}\n`;
    }
    
    msg += `---------------------------------\n`;
    msg += `Sent from ${weddingData.couple.title} Wedding Invitation Site`;

    return `https://wa.me/${weddingData.event.hostWhatsAppPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fadeIn">
      {/* Container Box */}
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-wedding-emerald text-white p-5 flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-wedding-rose fill-wedding-rose" />
            <h3 className="font-serif font-bold text-lg sm:text-xl">
              RSVP — {weddingData.couple.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-wedding-pink/50 px-6 py-2 border-b border-wedding-rose/20 flex items-center justify-between text-xs font-semibold text-wedding-emerald">
          <span className={step === 1 ? 'text-wedding-rose font-bold' : ''}>1. Participation</span>
          <ChevronRight className="w-3 h-3 text-wedding-slate/40" />
          <span className={step === 2 ? 'text-wedding-rose font-bold' : ''}>2. Food & Drinks</span>
          <ChevronRight className="w-3 h-3 text-wedding-slate/40" />
          <span className={step === 3 ? 'text-wedding-rose font-bold' : ''}>3. Confirmation</span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: PARTICIPATION */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-5">
              <div className="text-center space-y-1">
                <h4 className="font-serif text-2xl font-bold text-wedding-emerald">Will you join us?</h4>
                <p className="text-xs text-wedding-slate/70">Please respond by August 20, 2026</p>
              </div>

              {/* Attendance Toggle Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: 'yes' })}
                  className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                    formData.attending === 'yes'
                      ? 'border-wedding-rose bg-wedding-pink/40 text-wedding-emerald font-bold shadow-md'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <Sparkles className={`w-6 h-6 ${formData.attending === 'yes' ? 'text-wedding-rose' : 'text-slate-400'}`} />
                  <span className="text-sm">Joyfully Accepts</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: 'no' })}
                  className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                    formData.attending === 'no'
                      ? 'border-slate-600 bg-slate-100 text-slate-800 font-bold shadow-md'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${formData.attending === 'no' ? 'text-slate-600' : 'text-slate-400'}`} />
                  <span className="text-sm">Regretfully Declines</span>
                </button>
              </div>

              {/* Groom's vs Bride's Side Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-wedding-emerald uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-wedding-rose" />
                  Are you attending from the Groom's or Bride's side? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, side: 'Groom' })}
                    className={`p-3 rounded-xl border-2 text-center transition-all flex items-center justify-center gap-1.5 ${
                      formData.side === 'Groom'
                        ? 'border-wedding-rose bg-wedding-pink/40 text-wedding-emerald font-bold shadow-sm'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">🤵</span>
                    <span className="text-xs">Groom's Side (Rajitha)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, side: 'Bride' })}
                    className={`p-3 rounded-xl border-2 text-center transition-all flex items-center justify-center gap-1.5 ${
                      formData.side === 'Bride'
                        ? 'border-wedding-rose bg-wedding-pink/40 text-wedding-emerald font-bold shadow-sm'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">👰</span>
                    <span className="text-xs">Bride's Side (Divya)</span>
                  </button>
                </div>
              </div>

              {/* Guest Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-wedding-emerald uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-wedding-rose" />
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Perera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wedding-rose/50 text-sm"
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-wedding-emerald uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-wedding-rose" />
                  Contact Number (For admin check-in) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0771234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wedding-rose/50 text-sm"
                />
              </div>

              {/* Number of Attending Guests */}
              {formData.attending === 'yes' && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-wedding-emerald uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-wedding-rose" />
                      Number of Guests Attending
                    </label>
                    <select
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-wedding-emerald focus:outline-none"
                    >
                      <option value={1}>1 Guest (Just Me)</option>
                      <option value={2}>2 Guests (+1)</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4+ Guests (Family)</option>
                    </select>
                  </div>

                  {formData.guestCount > 1 && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-600">
                        Additional Guest Name(s)
                      </label>
                      <input
                        type="text"
                        placeholder="Names of your plus ones..."
                        value={formData.guestNames}
                        onChange={(e) => setFormData({ ...formData, guestNames: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wedding-rose/50 text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-wedding-emerald hover:bg-wedding-teal text-white font-semibold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 text-base flex items-center justify-center gap-2"
              >
                {formData.attending === 'yes' ? 'Next: Food & Drinks' : 'Submit Response'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: FOOD & DRINKS PREFERENCES */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-5">
              <div className="text-center space-y-1">
                <div className="inline-flex p-2.5 rounded-full bg-wedding-pink text-wedding-rose mb-1">
                  <UtensilsCrossed className="w-6 h-6 text-wedding-rose" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-wedding-emerald">Food & Drink Preferences</h4>
                <p className="text-xs text-wedding-slate/70">Please let us know your preferences for the reception</p>
              </div>

              {/* Food Preference Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-wedding-emerald uppercase tracking-wider">
                  Meal Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, foodPreference: 'non-veg' })}
                    className={`p-3.5 rounded-xl border-2 text-center transition-all flex items-center justify-center gap-2 ${
                      formData.foodPreference === 'non-veg'
                        ? 'border-wedding-rose bg-wedding-pink/40 text-wedding-emerald font-bold shadow-sm'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">🍗</span>
                    <span className="text-sm">Non-Vegetarian</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, foodPreference: 'veg' })}
                    className={`p-3.5 rounded-xl border-2 text-center transition-all flex items-center justify-center gap-2 ${
                      formData.foodPreference === 'veg'
                        ? 'border-wedding-rose bg-wedding-pink/40 text-wedding-emerald font-bold shadow-sm'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">🥗</span>
                    <span className="text-sm">Vegetarian</span>
                  </button>
                </div>
              </div>

              {/* Drinks Requirement Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-wedding-emerald uppercase tracking-wider flex items-center gap-1">
                  <Wine className="w-3.5 h-3.5 text-wedding-rose" />
                  Would you like drinks / beverages served?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, needsDrinks: 'yes' })}
                    className={`p-3.5 rounded-xl border-2 text-center transition-all flex items-center justify-center gap-2 ${
                      formData.needsDrinks === 'yes'
                        ? 'border-wedding-rose bg-wedding-pink/40 text-wedding-emerald font-bold shadow-sm'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">🥂</span>
                    <span className="text-sm">Yes, please</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, needsDrinks: 'no' })}
                    className={`p-3.5 rounded-xl border-2 text-center transition-all flex items-center justify-center gap-2 ${
                      formData.needsDrinks === 'no'
                        ? 'border-slate-400 bg-slate-100 text-slate-700 font-bold shadow-sm'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">🥤</span>
                    <span className="text-sm">No, thank you</span>
                  </button>
                </div>
              </div>

              {/* Dietary / Allergies */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-wedding-emerald uppercase tracking-wider">
                  Dietary Restrictions or Special Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Seafood allergy, Gluten-free, Kids meal..."
                  value={formData.dietaryNotes}
                  onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wedding-rose/50 text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-wedding-emerald hover:bg-wedding-teal text-white font-semibold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 text-base flex items-center justify-center gap-2"
                >
                  Confirm & Submit RSVP
                  <CheckCircle2 className="w-4 h-4 text-wedding-pink" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CONFIRMATION SUMMARY */}
          {step === 3 && (
            <div className="space-y-6 text-center animate-fadeIn">
              <div className="inline-flex p-4 rounded-full bg-wedding-pink text-wedding-rose">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-3xl font-bold text-wedding-emerald">
                  {formData.attending === 'yes' ? 'Thank You!' : 'Response Received'}
                </h4>
                <p className="text-sm text-wedding-slate/80 font-light">
                  {formData.attending === 'yes' 
                    ? `We are thrilled to celebrate with you, ${formData.name}!` 
                    : `We will miss you, ${formData.name}. Thank you for letting us know!`}
                </p>
              </div>

              {/* Response Summary Card */}
              <div className="bg-wedding-pink/30 p-4 rounded-2xl text-left border border-wedding-rose/20 space-y-2 text-xs text-wedding-slate">
                <div className="flex justify-between border-b border-wedding-rose/20 pb-2 font-bold text-wedding-emerald">
                  <span>RSVP Status</span>
                  <span className="text-wedding-rose uppercase">
                    {formData.attending === 'yes' ? 'Attending' : 'Not Attending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Guest Name:</span>
                  <span className="font-semibold">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Attending Side:</span>
                  <span className="font-semibold">{formData.side === 'Groom' ? "Groom's Side 🤵" : "Bride's Side 👰"}</span>
                </div>
                {formData.attending === 'yes' && (
                  <>
                    <div className="flex justify-between">
                      <span>Total Guests:</span>
                      <span className="font-semibold">{formData.guestCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meal Preference:</span>
                      <span className="font-semibold">{formData.foodPreference === 'veg' ? 'Vegetarian 🥗' : 'Non-Vegetarian 🍗'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Drinks Required:</span>
                      <span className="font-semibold">{formData.needsDrinks === 'yes' ? 'Yes 🥂' : 'No 🥤'}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Send via WhatsApp Button */}
                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Confirmation to Couple via WhatsApp
                </a>

                {/* Add to Calendar (.ics) Button */}
                {formData.attending === 'yes' && (
                  <button
                    onClick={downloadCalendarFile}
                    className="w-full bg-wedding-emerald hover:bg-wedding-teal text-white font-semibold py-3 rounded-xl shadow transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-wedding-pink" />
                    Add Wedding to Apple / Google Calendar
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full text-slate-500 hover:text-slate-800 text-xs font-semibold py-2"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
