// src/movement/hooks/useJourney.ts

import { useCallback } from 'react';
import { useAchievements } from './useAchievements';
import { useStageProgression } from './useStageProgression';

export function useJourney() {
  const achievements = useAchievements();
  const stageProgression = useStageProgression();

  const refreshJourneyData = useCallback(async () => {
    await Promise.all([
      achievements.fetchAchievements(),
      stageProgression.fetchStageHistory()
    ]);
  }, [achievements, stageProgression]);

  const getJourneySummary = useCallback(() => {
    const completedAchievements = achievements.achievements.filter(a => a.progress === 100);
    const latestStage = stageProgression.stageHistory[0]?.toStage;

    return {
      totalAchievements: achievements.achievements.length,
      completedAchievements: completedAchievements.length,
      currentStage: latestStage,
      overallProgress: achievements.getProgress('OVERALL'),
      recentAchievements: achievements.getRecentAchievements(3)
    };
  }, [achievements, stageProgression.stageHistory]);

  return {
    ...achievements,
    ...stageProgression,
    refreshJourneyData,
    getJourneySummary,
    isLoading: achievements.isLoading || stageProgression.isLoading,
    error: achievements.error || stageProgression.error
  };
}
