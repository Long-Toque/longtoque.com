import { useState, useEffect } from 'react';
import { CalendarEvent, parseICSData } from '../utils/calendar';

export function useCalendarEvents(calendarId: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);


      const icsUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
      const request = new Request(icsUrl, {headers: {}});
      const response = await fetch(request);

      let icsData = '';
      let calErr: Error | null = null;
      let err: Error | null = null;

      try {
        if (response.ok) {
          icsData = await response.text();
        } else {
          calErr = new Error(`HTTP ${response.status}`);
        }

        if (icsData) {
          const calendarEvents = parseICSData(icsData);
          const now = new Date();
          const upcomingEvents = calendarEvents
              .filter(event => new Date(event.start) >= now)
              .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
              .slice(0, 10);
          setEvents(upcomingEvents);

        } else {
          err = new Error(`Unable to fetch calendar. Last error: ${calErr?.message || 'Unknown error'}`);
        }
      } catch (e) {
        err = e;
      }

      if (err) {
        console.error('Error fetching Google Calendar events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
        setEvents([]);
      }

      setLoading(false);
    };

    fetchEvents();
  }, [calendarId]);

  return { events, loading, error };
}
