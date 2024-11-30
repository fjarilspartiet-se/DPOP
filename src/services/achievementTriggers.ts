// src/services/achievementTriggers.ts

import { AchievementType, LifeStage, MeadowType } from '@prisma/client';
import prisma from '@/lib/db';

interface TriggerContext {
  userId: string;
  metadata?: Record<string, any>;
}

interface AchievementProgress {
  currentValue: number;
  targetValue: number;
  progress: number;
}

// Define achievement requirements and triggers
const achievementDefinitions = {
  // Participation achievements
  FIRST_MEADOW_VISIT: {
    type: AchievementType.PARTICIPATION,
    title: 'First Steps',
    description: 'Attended your first meadow gathering',
    check: async ({ userId }: TriggerContext): Promise<AchievementProgress> => {
      const count = await prisma.meadowParticipant.count({
        where: { userId }
      });
      return {
        currentValue: count,
        targetValue: 1,
        progress: count >= 1 ? 100 : 0
      };
    }
  },

  MEADOW_REGULAR: {
    type: AchievementType.PARTICIPATION,
    title: 'Regular Participant',
    description: 'Attended 10 meadow gatherings',
    check: async ({ userId }: TriggerContext): Promise<AchievementProgress> => {
      const count = await prisma.meadowParticipant.count({
        where: { userId }
      });
      const progress = Math.min((count / 10) * 100, 100);
      return {
        currentValue: count,
        targetValue: 10,
        progress
      };
    }
  },

  // Contribution achievements
  FIRST_INITIATIVE: {
    type: AchievementType.CONTRIBUTION,
    title: 'Initiative Taker',
    description: 'Started your first community initiative',
    check: async ({ userId }: TriggerContext): Promise<AchievementProgress> => {
      const count = await prisma.meadow.count({
        where: { 
          hostId: userId,
          type: MeadowType.GATHERING
        }
      });
      return {
        currentValue: count,
        targetValue: 1,
        progress: count >= 1 ? 100 : 0
      };
    }
  },

  COMMUNITY_BUILDER: {
    type: AchievementType.CONTRIBUTION,
    title: 'Community Builder',
    description: 'Successfully hosted 5 meadow gatherings',
    check: async ({ userId }: TriggerContext): Promise<AchievementProgress> => {
      const count = await prisma.meadow.count({
        where: {
          hostId: userId,
          status: 'COMPLETED'
        }
      });
      const progress = Math.min((count / 5) * 100, 100);
      return {
        currentValue: count,
        targetValue: 5,
        progress
      };
    }
  },

  // Stage achievements
  METAMORPHOSIS_BEGIN: {
    type: AchievementType.STAGE,
    title: 'Beginning of Change',
    description: 'Started your transformation journey',
    check: async ({ userId }: TriggerContext): Promise<AchievementProgress> => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { currentStage: true }
      });
      return {
        currentValue: user?.currentStage === 'EGG' ? 1 : 0,
        targetValue: 1,
        progress: user?.currentStage === 'EGG' ? 100 : 0
      };
    }
  },

  FULL_BUTTERFLY: {
    type: AchievementType.STAGE,
    title: 'Full Transformation',
    description: 'Completed your journey to become a butterfly',
    check: async ({ userId }: TriggerContext): Promise<AchievementProgress> => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { currentStage: true }
      });
      return {
        currentValue: user?.currentStage === 'BUTTERFLY' ? 1 : 0,
        targetValue: 1,
        progress: user?.currentStage === 'BUTTERFLY' ? 100 : 0
      };
    }
  },

  // Milestone achievements
  ACTIVE_QUARTER: {
    type: AchievementType.MILESTONE,
    title: 'Active Quarter',
    description: 'Maintained regular participation for 3 months',
    check: async ({ userId }: TriggerContext): Promise<AchievementProgress> => {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const participations = await prisma.meadowParticipant.count({
        where: {
          userId,
          createdAt: {
            gte: threeMonthsAgo
          }
        }
      });
      
      // Require at least 6 participations over 3 months
      const progress = Math.min((participations / 6) * 100, 100);
      return {
        currentValue: participations,
        targetValue: 6,
        progress
      };
    }
  }
};

export type AchievementTrigger = keyof typeof achievementDefinitions;

// Achievement trigger service
export const achievementTriggers = {
  async checkAchievement(
    achievementId: AchievementTrigger,
    context: TriggerContext
  ): Promise<AchievementProgress> {
    const definition = achievementDefinitions[achievementId];
    if (!definition) {
      throw new Error(`Unknown achievement: ${achievementId}`);
    }
    return await definition.check(context);
  },

  async checkAndAwardAchievements(userId: string, triggers: AchievementTrigger[]) {
    const results = await Promise.all(
      triggers.map(async (triggerId) => {
        try {
          const progress = await this.checkAchievement(triggerId, { userId });
          if (progress.progress > 0) {
            await this.updateAchievementProgress(userId, triggerId, progress);
          }
          return { triggerId, progress, success: true };
        } catch (error) {
          console.error(`Error checking achievement ${triggerId}:`, error);
          return { triggerId, error, success: false };
        }
      })
    );
    return results;
  },

  private async updateAchievementProgress(
    userId: string,
    achievementId: AchievementTrigger,
    progress: AchievementProgress
  ) {
    const definition = achievementDefinitions[achievementId];
    
    await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      },
      update: {
        progress: progress.progress,
        ...(progress.progress === 100 ? { earnedAt: new Date() } : {})
      },
      create: {
        userId,
        achievementId,
        progress: progress.progress,
        ...(progress.progress === 100 ? { earnedAt: new Date() } : {}),
        achievement: {
          create: {
            title: definition.title,
            description: definition.description,
            type: definition.type,
            requirements: {}
          }
        }
      }
    });
  }
};
