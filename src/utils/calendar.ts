import ICAL from './ical.js';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}

export interface ParsedEventDescription {
  body: string;
  link: string;
}

export const parseEventDescription = (description?: string): ParsedEventDescription | null => {
  if (!description) return null;
  
  try {
    const parsed = JSON.parse(description);
    if (parsed.body && parsed.link) {
      return parsed;
    }
    return null;
  } catch (error) {
    // Some descriptions might not be JSON, which is fine
    return null;
  }
};

const toLocalISOString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const parseICSData = (icsText: string): CalendarEvent[] => {
  const parsed = ICAL.parse(icsText);
  const vcalendar = new ICAL.Component(parsed);
  const vevents = vcalendar.getAllSubcomponents('vevent');

  return vevents
    .map((component) => {
      const event = new ICAL.Event(component);
      const startDate = event.startDate?.toJSDate();
      const endDate = event.endDate?.toJSDate();

      if (!event.uid || !event.summary || !startDate || !endDate) {
        return null;
      }

      return {
        id: event.uid,
        title: event.summary,
        start: toLocalISOString(startDate),
        end: toLocalISOString(endDate),
        location: event.location || undefined,
        description: event.description || undefined
      } as CalendarEvent;
    })
    .filter((event): event is CalendarEvent => Boolean(event));
};

export const downloadICSFile = (event: CalendarEvent) => {
  const parsedDescription = parseEventDescription(event.description);
  const descriptionText = parsedDescription?.body || event.description || '';
  
  const vcalendar = new ICAL.Component(['vcalendar', [], []]);
  vcalendar.addPropertyWithValue('version', '2.0');
  vcalendar.addPropertyWithValue('prodid', '-//Long Toque Club//Event Calendar//EN');
  vcalendar.addPropertyWithValue('calscale', 'GREGORIAN');
  vcalendar.addPropertyWithValue('method', 'PUBLISH');

  const vevent = new ICAL.Component('vevent');
  const icalEvent = new ICAL.Event(vevent);
  icalEvent.uid = `${event.id}@longtoque.club`;
  icalEvent.summary = event.title;
  icalEvent.description = descriptionText;
  icalEvent.location = event.location || undefined;
  icalEvent.startDate = ICAL.Time.fromJSDate(new Date(event.start));
  icalEvent.endDate = ICAL.Time.fromJSDate(new Date(event.end));
  vcalendar.addSubcomponent(vevent);

  const icsContent = vcalendar.toString();

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
