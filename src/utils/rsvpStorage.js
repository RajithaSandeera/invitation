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

const GOOGLE_SHEET_DOC_URL_KEY = 'wedding_google_sheet_doc_url';

export function getGoogleSheetDocUrl() {
  return localStorage.getItem(GOOGLE_SHEET_DOC_URL_KEY) || '';
}

export function setGoogleSheetDocUrl(url) {
  localStorage.setItem(GOOGLE_SHEET_DOC_URL_KEY, url.trim());
}

export function extractSpreadsheetId(urlStr) {
  if (!urlStr) return null;
  const match = urlStr.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : (urlStr.length > 20 && !urlStr.includes('/') ? urlStr.trim() : null);
}

// Parse CSV text into RSVP objects
export function parseGoogleSheetCsv(csvText) {
  const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length <= 1) return [];

  const parseRow = (text) => {
    const res = [];
    let curr = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        res.push(curr.trim().replace(/^"|"$/g, ''));
        curr = '';
      } else {
        curr += c;
      }
    }
    res.push(curr.trim().replace(/^"|"$/g, ''));
    return res;
  };

  const rows = lines.map(parseRow);
  const rsvps = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[1] || r[1].trim() === '' || r[1].toLowerCase() === 'name' || r[1].toLowerCase() === 'guest name') continue;

    const sideVal = r[3] ? r[3] : 'Groom';
    const statusVal = r[4] ? r[4].toLowerCase() : 'attending';
    const mealVal = r[7] ? r[7].toLowerCase() : 'non-veg';
    const drinksVal = r[8] ? r[8].toLowerCase() : 'yes';

    rsvps.push({
      id: `gsheet-${i}-${r[1]}`,
      timestamp: r[0] || new Date().toISOString(),
      name: r[1].trim(),
      phone: r[2] ? r[2].trim() : 'N/A',
      side: sideVal.indexOf('Bride') !== -1 || sideVal.indexOf('Divya') !== -1 ? 'Bride' : 'Groom',
      attending: statusVal.indexOf('declined') !== -1 || statusVal.indexOf('no') !== -1 || statusVal.indexOf('not') !== -1 ? 'no' : 'yes',
      guestCount: parseInt(r[5]) || 1,
      guestNames: (!r[6] || r[6] === 'None') ? '' : r[6].trim(),
      foodPreference: mealVal.indexOf('veg') !== -1 && mealVal.indexOf('non') === -1 ? 'veg' : 'non-veg',
      needsDrinks: drinksVal.indexOf('yes') !== -1 || drinksVal.indexOf('🥂') !== -1 ? 'yes' : 'no',
      dietaryNotes: (!r[9] || r[9] === 'None') ? '' : r[9].trim(),
      checkedIn: false
    });
  }

  return rsvps;
}

// Fetch all RSVPs directly from Google Sheet CSV API or Webhook
export async function fetchRSVPsFromGoogleSheets() {
  const webhookUrl = getGoogleSheetUrl();
  const docUrl = getGoogleSheetDocUrl();
  const spreadsheetId = extractSpreadsheetId(docUrl) || extractSpreadsheetId(webhookUrl);

  // METHOD 1: Direct Google Sheet CSV fetch (100% CORS-free, works on all browsers/devices)
  if (spreadsheetId) {
    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv`;
      const res = await fetch(csvUrl);
      if (res.ok) {
        const csvText = await res.text();
        const parsedData = parseGoogleSheetCsv(csvText);
        
        const existing = getAllRSVPs();
        const merged = parsedData.map(item => {
          const match = existing.find(e => (e.id && e.id === item.id) || (e.phone && e.phone === item.phone));
          return match ? { ...item, checkedIn: match.checkedIn } : item;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return { success: true, data: merged, method: 'csv' };
      }
    } catch (csvErr) {
      console.warn("Direct CSV fetch failed, trying Apps Script GET...", csvErr);
    }
  }

  // METHOD 2: Webhook GET Request
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, error: "Please enter your Google Sheet link or Webhook URL in settings." };
  }

  try {
    const res = await fetch(webhookUrl);
    if (!res.ok) {
      return { success: false, error: `Google Sheet webhook returned HTTP ${res.status}` };
    }
    
    const rawText = await res.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      return { 
        success: false, 
        error: "Google Apps Script returned HTML (CORS issue). Solution: Paste your main Google Sheet Link (https://docs.google.com/spreadsheets/d/...) in settings for instant direct sync!" 
      };
    }

    if (Array.isArray(data)) {
      const existing = getAllRSVPs();
      const merged = data.map(item => {
        const match = existing.find(e => (e.id && e.id === item.id) || (e.phone && e.phone === item.phone));
        return match ? { ...item, checkedIn: match.checkedIn } : item;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return { success: true, data: merged, method: 'webhook' };
    }
  } catch (err) {
    console.error("Error fetching RSVPs from Google Sheet:", err);
    return { 
      success: false, 
      error: "Browser blocked cross-origin request (Failed to fetch). Fix: Paste your main Google Sheet Link (https://docs.google.com/spreadsheets/d/...) into settings for instant CORS-free sync!" 
    };
  }

  return { success: false, error: "Could not fetch Google Sheet data." };
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
