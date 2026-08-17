/**
 * Helper utilities to create calendar events for Google, Apple iCal, and Outlook.
 */

export function getGoogleCalendarUrl(weddingData) {
  const title = `${weddingData.couple.groom} & ${weddingData.couple.bride}'s Wedding`;
  const details = `Join us as we celebrate the wedding of ${weddingData.couple.groomFull} & ${weddingData.couple.brideFull}!\n\nVenue: ${weddingData.event.venueName}\nAddress: ${weddingData.event.address}`;
  const location = `${weddingData.event.venueName}, ${weddingData.event.address}`;
  
  // Event Date: 2026-09-16 09:00:00 to 16:00:00 in UTC+5:30 -> UTC: 20260916T033000Z / 20260916T103000Z
  const dates = "20260916T033000Z/20260916T103000Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: dates,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl(weddingData) {
  const title = `${weddingData.couple.groom} & ${weddingData.couple.bride}'s Wedding`;
  const body = `Join us for the wedding celebration of ${weddingData.couple.groomFull} & ${weddingData.couple.brideFull}!`;
  const location = `${weddingData.event.venueName}, ${weddingData.event.address}`;

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    startdt: "2026-09-16T09:00:00+05:30",
    enddt: "2026-09-16T16:00:00+05:30",
    body: body,
    location: location,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function downloadIcsFile(weddingData) {
  const title = `${weddingData.couple.groom} & ${weddingData.couple.bride}'s Wedding`;
  const description = `Join us for the wedding celebration of ${weddingData.couple.groomFull} & ${weddingData.couple.brideFull}!`;
  const location = `${weddingData.event.venueName}, ${weddingData.event.address}`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rajitha & Divya Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "DTSTART:20260916T033000Z",
    "DTEND:20260916T103000Z",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${weddingData.couple.groom}_${weddingData.couple.bride}_Wedding.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
