import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Download, Search, Users, UserCheck, Phone, RefreshCw, Trash2, Plus, X, Check, ShieldCheck, Heart, Filter } from 'lucide-react';
import { adminConfig } from '../config/adminConfig';
import { getAllRSVPs, saveRSVPRecord, deleteRSVPRecord, toggleCheckIn, exportToExcel } from '../utils/rsvpStorage';

export default function AdminPanel({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [rsvps, setRsvps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sideFilter, setSideFilter] = useState('ALL'); // 'ALL', 'Groom', 'Bride'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'yes', 'no'

  // Manual Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    phone: '',
    side: 'Groom',
    attending: 'yes',
    guestCount: 1,
    guestNames: '',
    foodPreference: 'non-veg',
    needsDrinks: 'yes',
    dietaryNotes: ''
  });

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      refreshData();
    }
  }, [isOpen, isAuthenticated]);

  const refreshData = () => {
    setRsvps(getAllRSVPs());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === adminConfig.defaultUsername && password === adminConfig.defaultPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
      refreshData();
    } else {
      setLoginError('Invalid Admin Username or Password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setUsername('');
    setPassword('');
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this RSVP record?")) {
      const updated = deleteRSVPRecord(id);
      setRsvps(updated);
    }
  };

  const handleToggleCheckIn = (id) => {
    const updated = toggleCheckIn(id);
    setRsvps(updated);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newGuest.name.trim()) return;
    saveRSVPRecord(newGuest);
    refreshData();
    setShowAddModal(false);
    setNewGuest({
      name: '',
      phone: '',
      side: 'Groom',
      attending: 'yes',
      guestCount: 1,
      guestNames: '',
      foodPreference: 'non-veg',
      needsDrinks: 'yes',
      dietaryNotes: ''
    });
  };

  if (!isOpen) return null;

  // Filtered List
  const filteredRSVPs = rsvps.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = r.name.toLowerCase().includes(q) || (r.phone && r.phone.includes(q)) || (r.guestNames && r.guestNames.toLowerCase().includes(q));
    const matchesSide = sideFilter === 'ALL' || r.side === sideFilter;
    const matchesStatus = statusFilter === 'ALL' || r.attending === statusFilter;
    return matchesSearch && matchesSide && matchesStatus;
  });

  // Calculate Counters
  const attendingList = rsvps.filter(r => r.attending === 'yes');
  const totalHeadcount = attendingList.reduce((acc, curr) => acc + (parseInt(curr.guestCount) || 1), 0);
  const groomSideHeadcount = attendingList.filter(r => r.side === 'Groom').reduce((acc, curr) => acc + (parseInt(curr.guestCount) || 1), 0);
  const brideSideHeadcount = attendingList.filter(r => r.side === 'Bride').reduce((acc, curr) => acc + (parseInt(curr.guestCount) || 1), 0);
  const nonVegCount = attendingList.filter(r => r.foodPreference === 'non-veg').reduce((acc, curr) => acc + (parseInt(curr.guestCount) || 1), 0);
  const vegCount = attendingList.filter(r => r.foodPreference === 'veg').reduce((acc, curr) => acc + (parseInt(curr.guestCount) || 1), 0);
  const drinksCount = attendingList.filter(r => r.needsDrinks === 'yes').reduce((acc, curr) => acc + (parseInt(curr.guestCount) || 1), 0);
  const checkedInCount = attendingList.filter(r => r.checkedIn).reduce((acc, curr) => acc + (parseInt(curr.guestCount) || 1), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 text-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[95vh]">
        {/* Top Header */}
        <div className="bg-wedding-emerald p-4 sm:p-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-wedding-rose" />
            <h2 className="font-serif font-bold text-lg sm:text-xl text-white">
              {adminConfig.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold px-3 py-1.5 rounded-full border border-red-500/30 flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* LOGIN SCREEN */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-wedding-rose/20 text-wedding-rose mx-auto flex items-center justify-center border border-wedding-rose/40">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-serif font-bold text-white">Admin Login</h3>
              <p className="text-xs text-white/70">Enter credentials to view RSVP counts & validate guests</p>
            </div>

            {loginError && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/80 uppercase">Username</label>
                <input
                  type="text"
                  required
                  placeholder="Username (e.g. admin)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-wedding-rose text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/80 uppercase">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-wedding-rose text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-wedding-rose hover:bg-wedding-rose/90 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 text-sm"
              >
                Access Admin Dashboard
              </button>

              <p className="text-[11px] text-center text-white/50 pt-2">
                Default: Username <code className="text-wedding-rose">admin</code> | Password <code className="text-wedding-rose">wedding2026</code>
              </p>
            </form>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* STATS SUMMARY COUNTERS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="bg-slate-800 p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl font-bold text-wedding-rose">{totalHeadcount}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Total Attending</span>
              </div>

              <div className="bg-slate-800 p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl font-bold text-blue-400">{groomSideHeadcount}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Groom's Side 🤵</span>
              </div>

              <div className="bg-slate-800 p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl font-bold text-pink-400">{brideSideHeadcount}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Bride's Side 👰</span>
              </div>

              <div className="bg-slate-800 p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl font-bold text-amber-400">{nonVegCount} / {vegCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Non-Veg 🍗 / Veg 🥗</span>
              </div>

              <div className="bg-slate-800 p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl font-bold text-emerald-400">{drinksCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Drinks Needed 🥂</span>
              </div>

              <div className="bg-slate-800 p-3.5 rounded-2xl border border-white/10 text-center">
                <span className="block text-2xl font-bold text-teal-400">{checkedInCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Checked-In 📌</span>
              </div>
            </div>

            {/* CONTROLS BAR: SEARCH, FILTERS, EXPORT & ADD */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-white/10">
              {/* Phone / Name Search Lookup Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Lookup guest by Phone Number or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-wedding-rose"
                />
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Side Filter */}
                <select
                  value={sideFilter}
                  onChange={(e) => setSideFilter(e.target.value)}
                  className="bg-slate-900 border border-white/15 text-white text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none"
                >
                  <option value="ALL">All Sides</option>
                  <option value="Groom">Groom's Side 🤵</option>
                  <option value="Bride">Bride's Side 👰</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-white/15 text-white text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="yes">Attending Only</option>
                  <option value="no">Declined Only</option>
                </select>

                {/* Export Excel Button */}
                <button
                  onClick={() => exportToExcel(rsvps)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Export Excel (.xlsx)
                </button>

                {/* Add Manual Guest Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-wedding-rose hover:bg-wedding-rose/90 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Guest
                </button>
              </div>
            </div>

            {/* GUEST RECORDS TABLE */}
            <div className="bg-slate-800/60 rounded-2xl border border-white/10 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-white/90">
                  <thead className="bg-slate-900 text-white/60 font-semibold uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-3">Guest Name & Contact</th>
                      <th className="p-3">Side</th>
                      <th className="p-3">Headcount</th>
                      <th className="p-3">Meal & Drinks</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Arrival Check-In</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRSVPs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-white/50 italic">
                          No matching guest RSVP records found.
                        </td>
                      </tr>
                    ) : (
                      filteredRSVPs.map((r) => (
                        <tr key={r.id} className={`hover:bg-white/5 transition-colors ${r.checkedIn ? 'bg-emerald-950/20' : ''}`}>
                          {/* Name & Phone */}
                          <td className="p-3 space-y-0.5">
                            <p className="font-bold text-white text-sm">{r.name}</p>
                            <p className="text-[11px] text-white/60 font-mono flex items-center gap-1">
                              <Phone className="w-3 h-3 text-wedding-rose" />
                              {r.phone}
                            </p>
                            {r.dietaryNotes && (
                              <p className="text-[10px] text-amber-300 italic">Notes: {r.dietaryNotes}</p>
                            )}
                          </td>

                          {/* Side */}
                          <td className="p-3">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              r.side === 'Groom' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                            }`}>
                              {r.side === 'Groom' ? "Groom's (Rajitha)" : "Bride's (Divya)"}
                            </span>
                          </td>

                          {/* Headcount */}
                          <td className="p-3">
                            <span className="font-bold text-white text-sm">{r.guestCount} Guest(s)</span>
                            {r.guestNames && (
                              <p className="text-[10px] text-white/60">{r.guestNames}</p>
                            )}
                          </td>

                          {/* Meal & Drinks */}
                          <td className="p-3 space-y-1">
                            <p className="text-white/90 font-medium">
                              {r.foodPreference === 'veg' ? '🥗 Veg' : '🍗 Non-Veg'}
                            </p>
                            <p className="text-[10px] text-white/60">
                              Drinks: {r.needsDrinks === 'yes' ? '🥂 Yes' : '🥤 No'}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="p-3">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              r.attending === 'yes' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {r.attending === 'yes' ? 'Attending' : 'Declined'}
                            </span>
                          </td>

                          {/* Check-in toggle */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleCheckIn(r.id)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 mx-auto ${
                                r.checkedIn
                                  ? 'bg-emerald-500 text-white shadow-lg'
                                  : 'bg-slate-700 hover:bg-slate-600 text-white/70 border border-white/10'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              {r.checkedIn ? 'Checked-In' : 'Validate'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDelete(r.id)}
                              title="Delete Record"
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MANUAL ADD GUEST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 p-6 rounded-3xl max-w-md w-full space-y-4 text-white">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-lg font-bold font-serif">Add Guest RSVP Manually</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 font-semibold mb-1">Guest Name *</label>
                <input
                  type="text"
                  required
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Side</label>
                  <select
                    value={newGuest.side}
                    onChange={(e) => setNewGuest({ ...newGuest, side: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-white"
                  >
                    <option value="Groom">Groom's Side</option>
                    <option value="Bride">Bride's Side</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Guest Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newGuest.guestCount}
                    onChange={(e) => setNewGuest({ ...newGuest, guestCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Meal</label>
                  <select
                    value={newGuest.foodPreference}
                    onChange={(e) => setNewGuest({ ...newGuest, foodPreference: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-white"
                  >
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="veg">Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">Drinks Required?</label>
                  <select
                    value={newGuest.needsDrinks}
                    onChange={(e) => setNewGuest({ ...newGuest, needsDrinks: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-white"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Dietary / Special Notes</label>
                <input
                  type="text"
                  value={newGuest.dietaryNotes}
                  onChange={(e) => setNewGuest({ ...newGuest, dietaryNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/15 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-wedding-rose hover:bg-wedding-rose/90 text-white font-bold py-3 rounded-xl mt-2"
              >
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
