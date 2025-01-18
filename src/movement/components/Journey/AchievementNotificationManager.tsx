// src/movement/components/Journey/AchievementNotificationManager.tsx

import React, { useState, useEffect } from 'react';
import AchievementNotification from './AchievementNotification';
import { useWebSocket } from '@/services/websocketService';

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: any; // Using AchievementType from @prisma/client
}

interface AchievementNotificationManagerProps {
  userId: string;
}

const AchievementNotificationManager = ({ userId }: AchievementNotificationManagerProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const { subscribe } = useWebSocket(userId);

  useEffect(() => {
    // Subscribe to real-time achievement notifications
    const unsubscribe = subscribe('achievement', (payload) => {
      setAchievements(prev => [...prev, payload]);
    });

    // Initial check for offline achievements
    const checkNewAchievements = async () => {
      try {
        const response = await fetch('/api/movement/achievements/new');
        if (response.ok) {
          const newAchievements = await response.json();
          if (newAchievements.length > 0) {
            setAchievements(prev => [...prev, ...newAchievements]);
          }
        }
      } catch (error) {
        console.error('Failed to check for new achievements:', error);
      }
    };

    checkNewAchievements();
    
    return () => {
      unsubscribe();
    };
  }, [userId, subscribe]);

  useEffect(() => {
    if (achievements.length > 0 && !currentAchievement) {
      setCurrentAchievement(achievements[0]);
      setAchievements(prev => prev.slice(1));
    }
  }, [achievements, currentAchievement]);

  const handleClose = async () => {
    if (currentAchievement) {
      try {
        // Mark the achievement as seen
        await fetch(`/api/movement/achievements/${currentAchievement.id}/seen`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Failed to mark achievement as seen:', error);
      }
      setCurrentAchievement(null);
    }
  };

  if (!currentAchievement) return null;

  return (
    <AchievementNotification
      title={currentAchievement.title}
      description={currentAchievement.description}
      type={currentAchievement.type}
      onClose={handleClose}
    />
  );
};

export default AchievementNotificationManager;
