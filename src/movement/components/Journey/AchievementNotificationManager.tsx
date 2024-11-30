// src/movement/components/Journey/AchievementNotificationManager.tsx

import React, { useState, useEffect } from 'react';
import AchievementNotification from './AchievementNotification';

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

  useEffect(() => {
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

    // Check for new achievements periodically
    const interval = setInterval(checkNewAchievements, 30000);
    return () => clearInterval(interval);
  }, [userId]);

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
