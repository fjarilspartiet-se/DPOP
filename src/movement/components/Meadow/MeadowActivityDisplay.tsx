import React from 'react';
import { useTranslation } from 'next-i18next';
import { Activity, MessageSquare, UserPlus, UserMinus, Star } from 'lucide-react';
import { MeadowActivity } from '@/movement/types/meadow';

interface MeadowActivityDisplayProps {
  activities: MeadowActivity[];
  maxItems?: number;
}

const activityIcons = {
  join: UserPlus,
  leave: UserMinus,
  message: MessageSquare,
  contribution: Star
};

const MeadowActivityDisplay = ({ activities, maxItems = 5 }: MeadowActivityDisplayProps) => {
  const { t } = useTranslation('common');
  const recentActivities = activities.slice(0, maxItems);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium flex items-center gap-2">
        <Activity className="w-4 h-4" />
        {t('movement.meadows.recentActivity')}
      </h4>
      
      <div className="space-y-2">
        {recentActivities.map((activity) => {
          const IconComponent = activityIcons[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm"
            >
              <IconComponent className="w-4 h-4 shrink-0" />
              <span className="font-medium">{activity.userName}</span>
              <span className="text-gray-600 dark:text-gray-300">
                {t(`movement.meadows.activities.${activity.type}`)}
              </span>
              {activity.details && (
                <span className="text-gray-500 dark:text-gray-400 truncate">
                  {activity.details}
                </span>
              )}
              <span className="ml-auto text-gray-500 dark:text-gray-400 text-xs">
                {new Date(activity.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeadowActivityDisplay;
