import { useState } from 'react';
import { Calendar, MapPin, Clock, Download, Ticket } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { 
  CalendarEvent, 
  parseEventDescription, 
  downloadICSFile 
} from '../utils/calendar';
import { getGoogleMapsUrl } from '../utils/googleMaps';

interface UpcomingEventsProps {
  calendarId: string;
  title?: string;
}

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

function EventCard({ event }: { event: CalendarEvent }) {
  const { date, time } = formatDateTime(event.start);
  const parsedDescription = parseEventDescription(event.description);
  
  return (
    <div className="bg-[#6B2828] rounded-lg p-6 hover:bg-[#5A1F1F] transition-colors duration-200">
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
}

function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Subscribing email:', email);
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return (
      <div className="max-w-md mx-auto bg-[#6B2828] rounded-lg p-6">
        <p className="text-white font-sans text-lg">
          ✓ Thank you for subscribing! We'll notify you about upcoming shows.
        </p>
      </div>
    );
  }

  return (
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
  );
}

export function UpcomingEvents({ calendarId, title = 'Upcoming Events' }: UpcomingEventsProps) {
  const { events, loading, error } = useCalendarEvents(calendarId);

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
          <SubscriptionForm />
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}