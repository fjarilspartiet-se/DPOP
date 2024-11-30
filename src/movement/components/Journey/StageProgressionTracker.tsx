import React from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { Sparkles, ArrowRight } from 'lucide-react';
import { LifeStage } from '@prisma/client';
import { Card } from '@/components/ui/card';

interface StageProgressionTrackerProps {
  currentStage: LifeStage;
  onStageClick?: (stage: LifeStage) => void;
  showDetails?: boolean;
}

const stages: { stage: LifeStage; icon: string; durationDays: number }[] = [
  { stage: 'FLOWER', icon: '🌸', durationDays: 7 },
  { stage: 'EGG', icon: '🥚', durationDays: 14 },
  { stage: 'LARVAE', icon: '🐛', durationDays: 30 },
  { stage: 'PUPA', icon: '🐚', durationDays: 21 },
  { stage: 'BUTTERFLY', icon: '🦋', durationDays: -1 } // -1 indicates no duration limit
];

const StageProgressionTracker = ({ 
  currentStage, 
  onStageClick,
  showDetails = true 
}: StageProgressionTrackerProps) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();

  // Find the index of the current stage
  const currentStageIndex = stages.findIndex(s => s.stage === currentStage);

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold">
          {t('movement.journey.stageProgression')}
        </h3>
      </div>

      {/* Stage Progress Visual */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-purple-500 transform -translate-y-1/2 transition-all duration-500"
          style={{ 
            width: `${(currentStageIndex / (stages.length - 1)) * 100}%` 
          }}
        />
        
        <div className="relative flex justify-between">
          {stages.map(({ stage, icon }, index) => {
            const isCurrentStage = stage === currentStage;
            const isPastStage = index <= currentStageIndex;
            const isClickable = onStageClick && isPastStage;

            return (
              <div 
                key={stage}
                className={`flex flex-col items-center space-y-2 ${
                  isClickable ? 'cursor-pointer' : ''
                }`}
                onClick={() => isClickable && onStageClick(stage)}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-xl
                  ${isCurrentStage 
                    ? 'bg-purple-100 dark:bg-purple-900 ring-4 ring-purple-500' 
                    : isPastStage
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }
                  transition-all duration-300
                `}>
                  {icon}
                </div>
                <span className={`text-sm font-medium ${
                  isCurrentStage ? 'text-purple-500' : ''
                }`}>
                  {t(`lifestages.${stage.toLowerCase()}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Details */}
      {showDetails && (
        <div className="mt-6">
          <div className="space-y-4">
            {stages.map(({ stage, durationDays }, index) => {
              const isCurrentStage = stage === currentStage;
              const isPastStage = index <= currentStageIndex;

              return (
                <div 
                  key={stage}
                  className={`p-4 rounded-lg ${
                    isCurrentStage 
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500' 
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{stages[index].icon}</span>
                      <div>
                        <h4 className="font-medium">
                          {t(`lifestages.${stage.toLowerCase()}`)}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {durationDays === -1 
                            ? t('movement.journey.finalStage')
                            : t('movement.journey.stageDuration', { days: durationDays })}
                        </p>
                      </div>
                    </div>
                    {isPastStage && (
                      <span className="text-green-600 dark:text-green-400 text-sm">
                        {isCurrentStage 
                          ? t('movement.journey.current') 
                          : t('movement.journey.completed')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default StageProgressionTracker;
