import React from 'react';
import { useTranslation } from 'next-i18next';
import { Users, User, Crown } from 'lucide-react';
import { LifeStage } from '@prisma/client';

interface Participant {
  id: string;
  name: string;
  stage: LifeStage;
  role: 'HOST' | 'PARTICIPANT';
  joinedAt: Date;
}

interface MeadowParticipantsProps {
  participants: Participant[];
  maxParticipants?: number;
  onViewAll?: () => void;
  compact?: boolean;
}

const stageIcons = {
  EGG: '🥚',
  LARVAE: '🐛',
  PUPA: '🐚',
  BUTTERFLY: '🦋'
};

const MeadowParticipants = ({ 
  participants, 
  maxParticipants, 
  onViewAll,
  compact = false 
}: MeadowParticipantsProps) => {
  const { t } = useTranslation('common');
  const displayParticipants = compact ? participants.slice(0, 5) : participants;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Users className="w-4 h-4" />
          {t('movement.meadows.participants')}
          <span className="text-gray-500 dark:text-gray-400">
            ({participants.length}{maxParticipants ? `/${maxParticipants}` : ''})
          </span>
        </h4>
        {onViewAll && participants.length > 5 && (
          <button
            onClick={onViewAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('common.viewAll')}
          </button>
        )}
      </div>

      <div className={`grid gap-2 ${compact ? '' : 'grid-cols-2 md:grid-cols-3'}`}>
        {displayParticipants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
              {participant.role === 'HOST' ? (
                <Crown className="w-4 h-4 text-yellow-500" />
              ) : (
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{participant.name}</span>
                <span role="img" aria-label={participant.stage.toLowerCase()}>
                  {stageIcons[participant.stage]}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {participant.role === 'HOST' 
                  ? t('movement.meadows.roles.host')
                  : t('movement.meadows.roles.participant')
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {compact && participants.length > 5 && (
        <button
          onClick={onViewAll}
          className="w-full py-2 text-sm text-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
        >
          {t('common.andMoreCount', { count: participants.length - 5 })}
        </button>
      )}
    </div>
  );
};

export default MeadowParticipants;
