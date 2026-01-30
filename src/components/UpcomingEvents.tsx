import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Download, Ticket } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}

interface ParsedEventDescription {
  body: string;
  link: string;
}

interface UpcomingEventsProps {
  calendarId: string;
  title?: string; // Optional title prop
}

export function UpcomingEvents({ calendarId, title = 'Upcoming Events' }: UpcomingEventsProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      
      // Check if this is a real Google Calendar ID (contains @group.calendar.google.com or @gmail.com)
      const isRealCalendar = calendarId.includes('@group.calendar.google.com') || calendarId.includes('@gmail.com');
      
      if (isRealCalendar) {
        // Fetch public Google Calendar via ICS feed (no API key required)
        try {
          // Public Google Calendar ICS URL format
          const icsUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
          
          // Try direct fetch first, then fallback to CORS proxies if needed
          const corsProxies = [
            '',  // Try direct fetch first (cleanest solution)
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
          
          // Parse ICS data
          const calendarEvents = parseICSData(icsData);
          
          // Filter for upcoming events only
          const now = new Date();
          const upcomingEvents = calendarEvents
            .filter(event => new Date(event.start) >= now)
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
            .slice(0, 10); // Limit to 10 upcoming events
          
          setEvents(upcomingEvents);
        } catch (err) {
          console.error('Error fetching Google Calendar events:', err);
          setError(err instanceof Error ? err.message : 'Failed to load events');
          setEvents([]);
        }
      } else {
        // Mock data for testing calendars
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let mockEvents: CalendarEvent[] = [];
        
        // Different mock events based on calendarId
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
        // For grad-school-improv-calendar@example.com, keep mockEvents as empty array []
        
        setEvents(mockEvents);
      }
      
      setLoading(false);
    };

    fetchEvents();
  }, [calendarId]);

  // Function to parse ICS (iCalendar) data
  const parseICSData = (icsText: string): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const lines = icsText.split(/\r\n|\n|\r/);
    
    let currentEvent: Partial<CalendarEvent> | null = null;
    let currentField = '';
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Handle multi-line values (lines starting with space or tab)
      while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
        i++;
        line += lines[i].trim();
      }
      
      if (line === 'BEGIN:VEVENT') {
        currentEvent = { id: '', title: '', start: '', end: '' };
      } else if (line === 'END:VEVENT' && currentEvent) {
        if (currentEvent.id && currentEvent.title && currentEvent.start && currentEvent.end) {
          events.push(currentEvent as CalendarEvent);
        }
        currentEvent = null;
      } else if (currentEvent) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;
        
        const fullField = line.substring(0, colonIndex);
        const value = line.substring(colonIndex + 1);
        
        // Extract field name (before any semicolon for parameters)
        const field = fullField.split(';')[0];
        
        switch (field) {
          case 'UID':
            currentEvent.id = value;
            break;
          case 'SUMMARY':
            currentEvent.title = value.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/g, '\n');
            break;
          case 'DTSTART':
            currentEvent.start = parseICSDate(value, fullField);
            break;
          case 'DTEND':
            currentEvent.end = parseICSDate(value, fullField);
            break;
          case 'LOCATION':
            currentEvent.location = value.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/g, '\n');
            break;
          case 'DESCRIPTION':
            currentEvent.description = value.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/g, '\n').replace(/\\\\n/g, '\n');
            break;
        }
      }
    }
    
    return events;
  };

  // Function to parse ICS date format to ISO string
  const parseICSDate = (dateString: string, fullField: string): string => {
    // Check if it's a date-only field (no time)
    const isDateOnly = fullField.includes('VALUE=DATE');
    
    if (isDateOnly) {
      // Format: YYYYMMDD
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${year}-${month}-${day}T00:00:00`;
    } else {
      // Format: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(9, 11);
      const minute = dateString.substring(11, 13);
      const second = dateString.substring(13, 15);
      
      return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In production, send email to backend for newsletter signup
      console.log('Subscribing email:', email);
      setSubscribed(true);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  const parseEventDescription = (description?: string): ParsedEventDescription | null => {
    if (!description) return null;
    
    try {
      const parsed = JSON.parse(description);
      if (parsed.body && parsed.link) {
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Failed to parse event description:', error);
      return null;
    }
  };

  const formatDateForICS = (dateString: string) => {
    // Convert date to iCalendar format: YYYYMMDDTHHMMSSZ
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  const downloadICSFile = (event: CalendarEvent) => {
    const parsedDescription = parseEventDescription(event.description);
    const descriptionText = parsedDescription?.body || event.description || '';
    
    // Create ICS file content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Long Toque Club//Event Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}@longtoque.club`,
      `DTSTART:${formatDateForICS(event.start)}`,
      `DTEND:${formatDateForICS(event.end)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${descriptionText.replace(/\n/g, '\\n')}`,
      ...(event.location ? [`LOCATION:${event.location}`] : []),
      `DTSTAMP:${formatDateForICS(new Date().toISOString())}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Create blob and download
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

  if (loading) {
    return (
      <div className="bg-[#8B3838] rounded-lg p-8">
        <h3 className="text-2xl font-serif text-gray-200 mb-6">{title}</h3>
        <div className="text-white font-sans">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#8B3838] rounded-lg p-8">
      <h3 className="text-2xl font-serif text-gray-200 mb-6">{title}</h3>
      
      {error && (
        <div className="bg-[#5A1F1F] border-2 border-red-300 rounded-lg p-4 mb-6">
          <p className="text-red-100 font-sans">
            <strong>Error loading events:</strong> {error}
          </p>
        </div>
      )}
      
      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white font-sans mb-6 text-lg">
            There are no upcoming events at this time.
          </p>
          
          {!subscribed ? (
            <div className="max-w-md mx-auto bg-[#6B2828] rounded-lg p-6">
              <h4 className="text-white font-serif text-xl mb-4">
                Get Notified About Upcoming Shows
              </h4>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2 rounded-md bg-white text-gray-800 font-sans focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-[#8B3838] font-sans rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-[#6B2828] rounded-lg p-6">
              <p className="text-white font-sans text-lg">
                ✓ Thank you for subscribing! We'll notify you about upcoming shows.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => {
            const { date, time } = formatDateTime(event.start);
            const parsedDescription = parseEventDescription(event.description);
            
            return (
              <div key={event.id} className="bg-[#6B2828] rounded-lg p-6 hover:bg-[#5A1F1F] transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <h4 className="text-xl font-serif text-white">
                    {event.title}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {parsedDescription?.link && (
                      <a
                        href={parsedDescription.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-[#8B3838] font-sans rounded-md hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
                      >
                        <Ticket size={18} />
                        Tickets
                      </a>
                    )}
                    <button
                      onClick={() => downloadICSFile(event)}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-[#8B3838] font-sans rounded-md hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
                    >
                      <Download size={18} />
                      Add to Calendar
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3 text-gray-200 font-sans">
                    <Calendar size={20} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <div>{date}</div>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <Clock size={16} />
                        {time}
                      </div>
                    </div>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-start gap-3 text-gray-200 font-sans">
                      <MapPin size={20} className="flex-shrink-0 mt-0.5" />
                      <a
                        href={getGoogleMapsUrl(event.location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white underline transition-colors duration-200"
                      >
                        {event.location}
                      </a>
                    </div>
                  )}
                </div>
                
                {parsedDescription?.body && (
                  <div className="text-gray-200 font-sans prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{parsedDescription.body}</ReactMarkdown>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}