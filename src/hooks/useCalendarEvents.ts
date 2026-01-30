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
      
      const isRealCalendar = calendarId.includes('@group.calendar.google.com') || calendarId.includes('@gmail.com');
      
      if (isRealCalendar) {
        try {
          const icsUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
          
          const corsProxies = [
            '',
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?'
          ];
          
          let icsData = '';
          let lastError: Error | null = null;
          
          for (const proxy of corsProxies) {
            try {
              const url = proxy ? proxy + encodeURIComponent(icsUrl) : icsUrl;
              const response = await fetch(url);
              
              if (response.ok) {
                icsData = await response.text();
                break;
              } else {
                lastError = new Error(`HTTP ${response.status}`);
              }
            } catch (err) {
              lastError = err as Error;
              continue;
            }
          }
          
          if (!icsData) {
            throw new Error(`Unable to fetch calendar. Please ensure the calendar is set to public. Last error: ${lastError?.message || 'Unknown error'}`);
          }
          
          const calendarEvents = parseICSData(icsData);
          
          const now = new Date();
          const upcomingEvents = calendarEvents
            .filter(event => new Date(event.start) >= now)
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
            .slice(0, 10);
          
          setEvents(upcomingEvents);
        } catch (err) {
          console.error('Error fetching Google Calendar events:', err);
          setError(err instanceof Error ? err.message : 'Failed to load events');
          setEvents([]);
        }
      } else {
        // Mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let mockEvents: CalendarEvent[] = [];
        
        if (calendarId === 'didi-calendar@example.com') {
          mockEvents = [
            {
              id: '1',
              title: 'DIDI: Opening Night',
              start: '2026-02-15T19:30:00',
              end: '2026-02-15T21:30:00',
              location: 'The Underground Theatre, 123 Main St, Toronto, ON',
              description: JSON.stringify({
                body: '**Join us** for our spectacular opening night! \\n\\nExperience an evening of *laughter* and entertainment. \\n\\n- Doors open at 7:00 PM\\n- Show starts at 7:30 PM\\n- Refreshments available',
                link: 'https://example.com/tickets/opening-night'
              })
            },
            {
              id: '2',
              title: 'DIDI: Weekend Matinee',
              start: '2026-02-22T14:00:00',
              end: '2026-02-22T16:00:00',
              location: 'The Underground Theatre, 123 Main St, Toronto, ON',
              description: JSON.stringify({
                body: 'A family-friendly afternoon performance perfect for all ages!',
                link: 'https://example.com/tickets/weekend-matinee'
              })
            }
          ];
        } else if (calendarId === 'people-you-may-know-calendar@example.com') {
          mockEvents = [
            {
              id: '1',
              title: 'PYMK: Opening Night',
              start: '2026-02-15T19:30:00',
              end: '2026-02-15T21:30:00',
              location: 'The Underground Theatre, 123 Main St, Toronto, ON',
              description: JSON.stringify({
                body: '**Join us** for our spectacular opening night! \\n\\nExperience an evening of *laughter* and entertainment. \\n\\n- Doors open at 7:00 PM\\n- Show starts at 7:30 PM\\n- Refreshments available',
                link: 'https://example.com/tickets/opening-night'
              })
            },
            {
              id: '2',
              title: 'PYMK: Weekend Matinee',
              start: '2026-02-22T14:00:00',
              end: '2026-02-22T16:00:00',
              location: 'The Underground Theatre, 123 Main St, Toronto, ON',
              description: JSON.stringify({
                body: 'A family-friendly afternoon performance perfect for all ages!',
                link: 'https://example.com/tickets/weekend-matinee'
              })
            }
          ];
        }
        
        setEvents(mockEvents);
      }
      
      setLoading(false);
    };

    fetchEvents();
  }, [calendarId]);

  return { events, loading, error };
}
