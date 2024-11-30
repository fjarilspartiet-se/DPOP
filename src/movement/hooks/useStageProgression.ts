// src/movement/hooks/useStageProgression.ts

import { useState, useCallback } from 'react';
import { LifeStage, StageTransition } from '@prisma/client';

interface StageTransitionError {
  message: string;
  code: string;
}

export function useStageProgression() {
  const [stageHistory, setStageHistory] = useState<StageTransition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<StageTransitionError | null>(null);

  const fetchStageHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/movement/stages/history');
      if (!response.ok) throw new Error('Failed to fetch stage history');
      const data = await response.json();
      setStageHistory(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An error occurred',
        code: 'FETCH_ERROR'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const transitionStage = useCallback(async (toStage: LifeStage, reason?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/movement/stages/transition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toStage, reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transition stage');
      }

      const newTransition = await response.json();
      setStageHistory(prev => [newTransition, ...prev]);
      return newTransition;
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An error occurred',
        code: 'TRANSITION_ERROR'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStageRequirements = useCallback((stage: LifeStage) => {
    // Define requirements for each stage transition
    const requirements = {
      EGG: {
        minDays: 0,
        requirements: ['Complete profile', 'Join first meadow']
      },
      LARVAE: {
        minDays: 7,
        requirements: ['Participate in 3 meadows', 'Make first contribution']
      },
      PUPA: {
        minDays: 30,
        requirements: ['Complete 5 achievements', 'Regular participation']
      },
      BUTTERFLY: {
        minDays: 60,
        requirements: ['Mentor new members', 'Lead initiatives']
      }
    };

    return requirements[stage] || null;
  }, []);

  const checkStageEligibility = useCallback(async (stage: LifeStage) => {
    try {
      const response = await fetch(`/api/movement/stages/check-eligibility?stage=${stage}`);
      if (!response.ok) throw new Error('Failed to check stage eligibility');
      return await response.json();
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An error occurred',
        code: 'ELIGIBILITY_ERROR'
      });
      return null;
    }
  }, []);

  return {
    stageHistory,
    isLoading,
    error,
    fetchStageHistory,
    transitionStage,
    getStageRequirements,
    checkStageEligibility
  };
}

