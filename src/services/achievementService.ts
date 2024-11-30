// src/services/achievementService.ts

import prisma from '@/lib/db';
import { LifeStage, AchievementType } from '@prisma/client';

export const achievementService = {
  async getUserAchievements(userId: string) {
    return await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true
      },
      orderBy: {
        earnedAt: 'desc'
      }
    });
  },

  async checkAndAwardAchievements(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: true,
        stageHistory: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) return;

    // Check stage-based achievements
    if (user.stageHistory.length > 0) {
      const latestTransition = user.stageHistory[0];
      await this.checkStageAchievements(userId, latestTransition.toStage);
    }

    // Check other achievement types
    await this.checkParticipationAchievements(userId);
    await this.checkContributionAchievements(userId);
  },

  private async checkStageAchievements(userId: string, stage: LifeStage) {
    const stageAchievements = await prisma.achievement.findMany({
      where: {
        type: AchievementType.STAGE,
        requirements: {
          path: ['stage'],
          equals: stage
        }
      }
    });

    for (const achievement of stageAchievements) {
      await this.awardAchievement(userId, achievement.id);
    }
  },

  private async awardAchievement(userId: string, achievementId: string) {
    await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      },
      update: {
        progress: 100,
        earnedAt: new Date()
      },
      create: {
        userId,
        achievementId,
        progress: 100,
        earnedAt: new Date()
      }
    });
  }
};

// src/services/stageService.ts

import prisma from '@/lib/db';
import { LifeStage } from '@prisma/client';
import { achievementService } from './achievementService';

export const stageService = {
  async transitionStage(userId: string, toStage: LifeStage, reason?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentStage: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const transition = await prisma.$transaction(async (tx) => {
      // Record the transition
      const stageTransition = await tx.stageTransition.create({
        data: {
          userId,
          fromStage: user.currentStage,
          toStage,
          reason
        }
      });

      // Update user's current stage
      await tx.user.update({
        where: { id: userId },
        data: {
          currentStage: toStage,
          stageUpdatedAt: new Date()
        }
      });

      return stageTransition;
    });

    // Check for achievements
    await achievementService.checkAndAwardAchievements(userId);

    return transition;
  },

  async getStageHistory(userId: string) {
    return await prisma.stageTransition.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
};
