// src/services/achievementHandlers.ts

import { achievementTriggers, AchievementTrigger } from './achievementTriggers';

export const achievementHandlers = {
  async handleMeadowParticipation(userId: string) {
    // Check meadow-related achievements
    const triggers: AchievementTrigger[] = [
      'FIRST_MEADOW_VISIT',
      'MEADOW_REGULAR',
      'ACTIVE_QUARTER'
    ];
    
    return await achievementTriggers.checkAndAwardAchievements(userId, triggers);
  },

  async handleMeadowHosting(userId: string) {
    // Check hosting-related achievements
    const triggers: AchievementTrigger[] = [
      'FIRST_INITIATIVE',
      'COMMUNITY_BUILDER'
    ];
    
    return await achievementTriggers.checkAndAwardAchievements(userId, triggers);
  },

  async handleStageTransition(userId: string) {
    // Check stage-related achievements
    const triggers: AchievementTrigger[] = [
      'METAMORPHOSIS_BEGIN',
      'FULL_BUTTERFLY'
    ];
    
    return await achievementTriggers.checkAndAwardAchievements(userId, triggers);
  },

  async handlePeriodicCheck(userId: string) {
    // Check time-based achievements
    const triggers: AchievementTrigger[] = [
      'ACTIVE_QUARTER'
    ];
    
    return await achievementTriggers.checkAndAwardAchievements(userId, triggers);
  }
};
