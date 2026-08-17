import * as XLSX from 'xlsx';

const STORAGE_KEY = 'wedding_all_rsvps_database';
const GOOGLE_SHEET_URL_KEY = 'wedding_google_sheet_url';

// Sample initial data if database is empty
const defaultSamples = [
  
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

// Google Sheet Webhook Sync
export function getGoogleSheetUrl() {
  return localStorage.getItem(GOOGLE_SHEET_URL_KEY) || 'https://script.google.com/macros/s/AKfycbyVQ0OCfI2loEArRlQBdwWWDcH1BHbPWos20vmeGogX2R7wf71z6YMdT2kfTeeZhFH1/exec';
}

export function setGoogleSheetUrl(url) {
  localStorage.setItem(GOOGLE_SHEET_URL_KEY, url.trim());
}

export async function sendToGoogleSheets(record) {
  const webhookUrl = getGoogleSheetUrl();
  if (!webhookUrl || !webhookUrl.startsWith('http')) return;

  try {
    const payload = {
      name: record.name,
      phone: record.phone || 'N/A',
      side: record.side === 'Groom' ? "Groom's Side (Rajitha)" : "Bride's Side (Divya)",
      attending: record.attending === 'yes' ? 'Attending' : 'Declined',
      guestCount: record.guestCount,
      guestNames: record.guestNames || 'None',
      foodPreference: record.foodPreference === 'veg' ? 'Vegetarian 🥗' : 'Non-Vegetarian 🍗',
      needsDrinks: record.needsDrinks === 'yes' ? 'Yes 🥂' : 'No 🥤',
      dietaryNotes: record.dietaryNotes || 'None',
      timestamp: new Date(record.timestamp || Date.now()).toLocaleString()
    };

    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(payload)
    });
    console.log("Successfully sent RSVP entry to Google Sheet webhook.");
  } catch (err) {
    console.error("Error sending to Google Sheet webhook:", err);
  }
}

// Fetch all RSVPs directly from Google Sheet webhook
export async function fetchRSVPsFromGoogleSheets() {
  const webhookUrl = getGoogleSheetUrl();
  if (!webhookUrl || !webhookUrl.startsWith('http')) return null;

  try {
    const res = await fetch(webhookUrl);
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data)) {
      const existing = getAllRSVPs();
      // Keep local check-in statuses if matching ID/phone exists
      const merged = data.map(item => {
        const match = existing.find(e => (e.id && e.id === item.id) || (e.phone && e.phone === item.phone));
        return match ? { ...item, checkedIn: match.checkedIn } : item;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.error("Error fetching RSVPs from Google Sheet:", err);
  }
  return null;
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

  // Trigger async background sync to Google Sheet
  sendToGoogleSheets(newRecord);

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
