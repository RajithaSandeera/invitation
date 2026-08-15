import * as XLSX from 'xlsx';

const STORAGE_KEY = 'wedding_all_rsvps_database';

// Sample initial data if database is empty
const defaultSamples = [
  {
    id: 'rsvp-1',
    name: 'Nuwan Pradeep',
    phone: '0771234567',
    side: 'Groom', // 'Groom' or 'Bride'
    attending: 'yes',
    guestCount: 2,
    guestNames: 'Dilhani Perera',
    foodPreference: 'non-veg',
    needsDrinks: 'yes',
    dietaryNotes: 'No seafood',
    timestamp: new Date().toISOString(),
    checkedIn: true
  },
  {
    id: 'rsvp-2',
    name: 'Samanthika Silva',
    phone: '0719876543',
    side: 'Bride',
    attending: 'yes',
    guestCount: 1,
    guestNames: '',
    foodPreference: 'veg',
    needsDrinks: 'no',
    dietaryNotes: 'Strictly Vegetarian',
    timestamp: new Date().toISOString(),
    checkedIn: false
  },
  {
    id: 'rsvp-3',
    name: 'Kamal Fernando',
    phone: '0754443322',
    side: 'Groom',
    attending: 'no',
    guestCount: 0,
    guestNames: '',
    foodPreference: 'non-veg',
    needsDrinks: 'no',
    dietaryNotes: '',
    timestamp: new Date().toISOString(),
    checkedIn: false
  }
];

// Fetch all RSVPs
export function getAllRSVPs() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSamples));
    return defaultSamples;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing RSVPs:", e);
    return defaultSamples;
  }
}

// Add or update an RSVP record
export function saveRSVPRecord(record) {
  const rsvps = getAllRSVPs();
  const existingIndex = rsvps.findIndex(r => (record.id && r.id === record.id) || (record.phone && r.phone === record.phone));

  const newRecord = {
    id: record.id || `rsvp-${Date.now()}`,
    name: record.name,
    phone: record.phone || 'N/A',
    side: record.side || 'Groom',
    attending: record.attending || 'yes',
    guestCount: record.attending === 'yes' ? (parseInt(record.guestCount) || 1) : 0,
    guestNames: record.guestNames || '',
    foodPreference: record.foodPreference || 'non-veg',
    needsDrinks: record.needsDrinks || 'yes',
    dietaryNotes: record.dietaryNotes || '',
    timestamp: record.timestamp || new Date().toISOString(),
    checkedIn: record.checkedIn || false
  };

  if (existingIndex >= 0) {
    rsvps[existingIndex] = { ...rsvps[existingIndex], ...newRecord };
  } else {
    rsvps.unshift(newRecord);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvps));
  return newRecord;
}

// Delete record
export function deleteRSVPRecord(id) {
  let rsvps = getAllRSVPs();
  rsvps = rsvps.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvps));
  return rsvps;
}

// Toggle Check-in status (for guest arrival validation)
export function toggleCheckIn(id) {
  const rsvps = getAllRSVPs();
  const index = rsvps.findIndex(r => r.id === id);
  if (index >= 0) {
    rsvps[index].checkedIn = !rsvps[index].checkedIn;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvps));
  }
  return rsvps;
}

// Export all records to Excel (.xlsx)
export function exportToExcel(rsvps) {
  const recordsToExport = (rsvps || getAllRSVPs()).map((r, idx) => ({
    'No.': idx + 1,
    'Guest Name': r.name,
    'Phone Number': r.phone,
    'Side': r.side === 'Groom' ? "Groom's Side (Rajitha)" : "Bride's Side (Divya)",
    'Status': r.attending === 'yes' ? 'Attending ✅' : 'Declined ❌',
    'Total Headcount': r.guestCount,
    'Plus-One Names': r.guestNames || 'None',
    'Meal Preference': r.foodPreference === 'veg' ? 'Vegetarian 🥗' : 'Non-Vegetarian 🍗',
    'Drinks Required': r.needsDrinks === 'yes' ? 'Yes 🥂' : 'No 🥤',
    'Dietary / Special Notes': r.dietaryNotes || 'None',
    'Checked-In At Venue': r.checkedIn ? 'Yes ✅' : 'No ⏳',
    'RSVP Date': new Date(r.timestamp).toLocaleString()
  }));

  const worksheet = XLSX.utils.json_to_sheet(recordsToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Wedding RSVPs');

  // Generate and download Excel file
  XLSX.writeFile(workbook, `Rajitha_Divya_Wedding_RSVP_List.xlsx`);
}
