// src/movement/hooks/useAchievements.ts

import { useState, useCallback } from 'react';
import { UserAchievement, Achievement } from '@prisma/client';

interface AchievementWithDetails extends UserAchievement {
  achievement: Achievement;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<AchievementWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/movement/achievements');
      if (!response.ok) throw new Error('Failed to fetch achievements');
      const data = await response.json();
      setAchievements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProgress = useCallback((type: string) => {
    const typeAchievements = achievements.filter(a => a.achievement.type === type);
    if (typeAchievements.length === 0) return 0;
    
    const totalProgress = typeAchievements.reduce((sum, a) => sum + a.progress, 0);
    return Math.round(totalProgress / typeAchievements.length);
  }, [achievements]);

  const getRecentAchievements = useCallback((count: number = 5) => {
    return [...achievements]
      .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime())
      .slice(0, count);
  }, [achievements]);

  return {
    achievements,
    isLoading,
    error,
    fetchAchievements,
    getProgress,
    getRecentAchievements
  };
}

