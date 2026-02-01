import { Calendar, MapPin, Clock, Download, Ticket } from 'lucide-react';
import '@/components/tiptap-node/list-node/list-node.scss';

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location?: string;
  locationHref?: string;
  descriptionHtml?: string;
  ticketLink?: string;
  onAddToCalendar?: () => void;
  showAddToCalendar?: boolean;
  readOnlyActions?: boolean;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function EventCard({
  title,
  date,
  time,
  location,
  locationHref,
  descriptionHtml,
  ticketLink,
  onAddToCalendar,
  showAddToCalendar,
  readOnlyActions = false,
  containerClassName = '',
  titleClassName = '',
  descriptionClassName = ''
}: EventCardProps) {
  const actionBaseClass =
    'flex items-center gap-2 px-4 py-2 bg-white text-[#8B3838] font-sans rounded-md whitespace-nowrap';
  const actionClass = readOnlyActions
    ? `${actionBaseClass} opacity-80 cursor-default`
    : `${actionBaseClass} hover:bg-gray-100 transition-colors duration-200`;
  const locationClass = readOnlyActions
    ? 'underline decoration-gray-400'
    : 'hover:text-white underline transition-colors duration-200';
  const shouldShowAddToCalendar = showAddToCalendar ?? Boolean(onAddToCalendar);

  return (
    <div className={`rounded-lg p-6 ${containerClassName}`.trim()}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <h4 className={`text-xl font-serif text-white ${titleClassName}`.trim()}>{title}</h4>
        <div className="flex flex-wrap gap-3">
          {ticketLink &&
            (readOnlyActions ? (
              <div className={actionClass}>
                <Ticket size={18} />
                Tickets
              </div>
            ) : (
              <a
                href={ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className={actionClass}
              >
                <Ticket size={18} />
                Tickets
              </a>
            ))}
          {shouldShowAddToCalendar &&
            (readOnlyActions ? (
              <div className={actionClass}>
                <Download size={18} />
                Add to Calendar
              </div>
            ) : (
              <button type="button" onClick={onAddToCalendar} className={actionClass}>
                <Download size={18} />
                Add to Calendar
              </button>
            ))}
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

        {location && (
          <div className="flex items-start gap-3 text-gray-200 font-sans">
            <MapPin size={20} className="flex-shrink-0 mt-0.5" />
            {locationHref && !readOnlyActions ? (
              <a
                href={locationHref}
                target="_blank"
                rel="noopener noreferrer"
                className={locationClass}
              >
                {location}
              </a>
            ) : (
              <span className={locationClass}>{location}</span>
            )}
          </div>
        )}
      </div>

      {descriptionHtml && (
        <div
          className={`tiptap ProseMirror text-gray-200 font-sans prose prose-invert prose-sm max-w-none ${descriptionClassName}`.trim()}
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      )}
    </div>
  );
}
