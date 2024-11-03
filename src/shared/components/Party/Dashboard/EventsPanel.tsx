import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Panel from '../../common/Panel';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'physical' | 'digital' | 'hybrid';
  maxParticipants?: number;
  currentParticipants: number;
  isRegistered: boolean;
  description: string;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Medlemsmöte",
    date: "2024-04-05",
    time: "18:00",
    location: "Kulturhuset, Stockholm",
    type: "physical",
    maxParticipants: 50,
    currentParticipants: 32,
    isRegistered: false,
    description: "Månatligt medlemsmöte med fokus på kommande initiativ och uppdateringar om våra pågående projekt."
  },
  {
    id: 2,
    title: "Digital workshop",
    date: "2024-04-08",
    time: "19:00",
    location: "Zoom",
    type: "digital",
    currentParticipants: 15,
    isRegistered: true,
    description: "Workshop om digitala demokrativerktyg och hur vi kan använda dem effektivt i vårt partiarbete."
  }
];

const EventsPanel = () => {
  const { t } = useTranslation('common');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  const handleRegistration = (eventId: number) => {
    setEvents(currentEvents =>
      currentEvents.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            currentParticipants: event.isRegistered 
              ? event.currentParticipants - 1 
              : event.currentParticipants + 1,
            isRegistered: !event.isRegistered
          };
        }
        return event;
      })
    );
  };

  const handleViewAll = () => {
    console.log('Navigate to all events');
  };

  return (
    <Panel 
      title={t('party.dashboard.upcomingEvents')} 
      icon={Calendar}
      onViewAll={handleViewAll}
    >
      <div className="space-y-4">
        {events.map(event => (
          <div 
            key={event.id} 
            className="border-b last:border-0 pb-4 last:pb-0"
          >
            <div 
              className="cursor-pointer"
              onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
            >
              <h3 className="font-medium mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {event.title}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {event.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {event.location}
                </div>
              </div>
            </div>

            {expandedEvent === event.id && (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                  {event.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Users className="w-4 h-4 mr-1" />
                    <span>
                      {event.currentParticipants}
                      {event.maxParticipants && ` / ${event.maxParticipants}`}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegistration(event.id);
                    }}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      event.isRegistered
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {event.isRegistered ? 'Avanmäl' : 'Anmäl dig'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default EventsPanel;
