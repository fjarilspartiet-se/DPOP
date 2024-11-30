// src/movement/components/Journey/AchievementNotification.tsx

import React from 'react';
import { useTranslation } from 'next-i18next';
import { Trophy, X } from 'lucide-react';
import { AchievementType } from '@prisma/client';

interface AchievementNotificationProps {
  title: string;
  description: string;
  type: AchievementType;
  onClose: () => void;
}

const AchievementNotification = ({ 
  title, 
  description, 
  type, 
  onClose 
}: AchievementNotificationProps) => {
  const { t } = useTranslation('common');

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-yellow-200 dark:border-yellow-800 animate-slide-up">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('movement.achievements.unlocked')}
              </h3>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {title}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="ml-4 inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <span className="sr-only">{t('common.close')}</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;

