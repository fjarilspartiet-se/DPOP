import React from 'react';
import { useTranslation } from 'next-i18next';
import { Timer, Calendar, MapPin } from 'lucide-react';
import { MeadowStatus } from '@prisma/client';

interface MeadowStatusProps {
  status: MeadowStatus;
  dateTime?: Date;
  location: string;
  maxParticipants?: number;
  currentParticipants: number;
}

const statusColors = {
  PLANNED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
};

const MeadowStatusDisplay = ({ 
  status, 
  dateTime, 
  location,
  maxParticipants,
  currentParticipants 
}: MeadowStatusProps) => {
  const { t } = useTranslation('common');

  const getTimeRemaining = () => {
    if (!dateTime) return null;
    const now = new Date();
    const diff = dateTime.getTime() - now.getTime();
    
    if (diff < 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return t('common.daysRemaining', { days });
    }
    return t('common.hoursRemaining', { hours });
  };

  const getCapacityColor = () => {
    if (!maxParticipants) return 'bg-gray-200 dark:bg-gray-700';
    const ratio = currentParticipants / maxParticipants;
    if (ratio >= 0.9) return 'bg-red-200 dark:bg-red-900';
    if (ratio >= 0.7) return 'bg-yellow-200 dark:bg-yellow-900';
    return 'bg-green-200 dark:bg-green-900';
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {t(`movement.meadows.status.${status.toLowerCase()}`)}
        </span>
        {dateTime && (
          <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
            <Timer className="w-4 h-4" />
            {getTimeRemaining()}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {dateTime && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4" />
          {location}
        </div>

        {maxParticipants && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>{t('movement.meadows.capacity')}</span>
              <span>{currentParticipants}/{maxParticipants}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getCapacityColor()} transition-all duration-300`}
                style={{ width: `${(currentParticipants / maxParticipants) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeadowStatusDisplay;
