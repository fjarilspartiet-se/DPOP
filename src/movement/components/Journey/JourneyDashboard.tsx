import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { Trophy, Target, Clock, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import StageProgressionTracker from './StageProgressionTracker';
import { useJourney } from '@/movement/hooks/useJourney';

const JourneyDashboard = () => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const { 
    achievements,
    stageHistory,
    isLoading,
    error,
    refreshJourneyData,
    getJourneySummary,
    transitionStage,
    getStageRequirements
  } = useJourney();

  useEffect(() => {
    refreshJourneyData();
  }, [refreshJourneyData]);

  if (!session?.user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-300">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <p>{error instanceof Error ? error.message : 'An error occurred'}</p>
      </Alert>
    );
  }

  const journeySummary = getJourneySummary();
  const currentStageRequirements = getStageRequirements(session.user.lifeStage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {t('movement.journey.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('movement.journey.description')}
          </p>
        </div>
      </div>

      {/* Stage Progression */}
      <StageProgressionTracker 
        currentStage={session.user.lifeStage}
        stageHistory={stageHistory}
        onStageClick={async (stage) => {
          if (currentStageRequirements) {
            // Handle stage click - could show requirements or trigger transition
            console.log('Stage requirements:', currentStageRequirements);
          }
        }}
        showDetails={true}
      />

      {/* Achievements Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Achievements */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">
              {t('movement.journey.achievements')}
            </h3>
          </div>
          
          <div className="space-y-4">
            {achievements.filter(a => a.progress === 100).map(({ achievement, earnedAt }) => (
              <div 
                key={achievement.id}
                className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {achievement.description}
                    </p>
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {new Date(earnedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* In Progress Achievements */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">
              {t('movement.journey.inProgress')}
            </h3>
          </div>
          
          <div className="space-y-4">
            {achievements.filter(a => a.progress < 100).map(({ achievement, progress }) => (
              <div 
                key={achievement.id}
                className="p-4 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {achievement.description}
                    </p>
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                      <div 
                        className="h-1 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium ml-4">
                    {progress}%
                  </span>
                </div>
              </div>
            ))}

            {currentStageRequirements && (
              <div className="mt-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <h4 className="font-medium mb-2">
                  {t('movement.journey.stageRequirements')}
                </h4>
                <ul className="space-y-2">
                  {currentStageRequirements.requirements.map((req, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="mr-2">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JourneyDashboard;
