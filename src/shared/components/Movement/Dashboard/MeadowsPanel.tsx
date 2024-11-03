import React, { useState } from 'react';
import { Flower2, MapPin, Clock, Users, Calendar, LeafyGreen } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Panel from '../../common/Panel';

interface Meadow {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'planned' | 'spontaneous';
  status: 'upcoming' | 'active' | 'completed';
  host: string;
  participants: number;
  description: string;
  theme?: string;
  isAttending: boolean;
}

const mockMeadows: Meadow[] = [
  {
    id: 1,
    title: "Vårdialog i Vasaparken",
    date: "2024-04-15",
    time: "14:00",
    location: "Vasaparken, Stockholm",
    type: "planned",
    status: "upcoming",
    host: "Maria Andersson",
    participants: 12,
    description: "En öppen dialog om vårens initiativ och hur vi kan samarbeta för en blomstrande framtid.",
    theme: "Hållbarhet & Gemenskap",
    isAttending: false
  },
  {
    id: 2,
    title: "Spontan ängssamling",
    date: "2024-04-12",
    time: "16:30",
    location: "Hornsbergs strand",
    type: "spontaneous",
    status: "active",
    host: "Erik Lindberg",
    participants: 8,
    description: "Spontan samling för att diskutera lokala initiativ och njuta av vårsolen.",
    isAttending: true
  }
];

const MeadowsPanel = () => {
  const { t } = useTranslation('common');
  const [meadows, setMeadows] = useState<Meadow[]>(mockMeadows);
  const [expandedMeadow, setExpandedMeadow] = useState<number | null>(null);

  const handleAttendance = (meadowId: number) => {
    setMeadows(currentMeadows =>
      currentMeadows.map(meadow => {
        if (meadow.id === meadowId) {
          return {
            ...meadow,
            participants: meadow.isAttending ? meadow.participants - 1 : meadow.participants + 1,
            isAttending: !meadow.isAttending
          };
        }
        return meadow;
      })
    );
  };

  const handleViewAll = () => {
    console.log('Navigate to all meadows');
  };

  return (
    <Panel 
      title={t('movement.dashboard.meadowsTitle')} 
      icon={Flower2}
      onViewAll={handleViewAll}
    >
      <div className="space-y-4">
        {meadows.map(meadow => (
          <div 
            key={meadow.id} 
            className={`border-l-4 ${
              meadow.status === 'active' ? 'border-green-500' : 'border-gray-200 dark:border-gray-700'
            } pl-4 pb-4 last:pb-0`}
          >
            <div 
              className="cursor-pointer"
              onClick={() => setExpandedMeadow(expandedMeadow === meadow.id ? null : meadow.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    {meadow.title}
                  </h3>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {meadow.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {meadow.time}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-1" />
                      {meadow.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{meadow.participants}</span>
                </div>
              </div>
            </div>

            {expandedMeadow === meadow.id && (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {meadow.description}
                </p>
                {meadow.theme && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <LeafyGreen className="w-4 h-4 mr-1" />
                    {meadow.theme}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('movement.dashboard.meadowHost')}: {meadow.host}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAttendance(meadow.id);
                    }}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      meadow.isAttending
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {meadow.isAttending ? t('movement.dashboard.meadowUnattend') : t('movement.dashboard.meadowAttend')}
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

export default MeadowsPanel;
