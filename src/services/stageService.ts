// src/services/stageService.ts

import { LifeStage } from '@prisma/client';
import prisma from '@/lib/db';
import { achievementHandlers } from './achievementHandlers';

interface StageRequirement {
  type: 'PARTICIPATION' | 'CONTRIBUTION' | 'TIME';
  description: string;
  value: number;
  current?: number;
}

interface StageEligibility {
  eligible: boolean;
  requirements: StageRequirement[];
  missingRequirements: StageRequirement[];
  timeInCurrentStage: number; // days
}

export const stageService = {
  async transitionStage(userId: string, toStage: LifeStage, reason?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentStage: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify stage progression is valid
    const stageOrder: LifeStage[] = ['FLOWER', 'EGG', 'LARVAE', 'PUPA', 'BUTTERFLY'];
    const currentIndex = stageOrder.indexOf(user.currentStage);
    const targetIndex = stageOrder.indexOf(toStage);

    if (targetIndex <= currentIndex) {
      throw new Error('Invalid stage transition');
    }

    // Check eligibility
    const eligibility = await this.checkStageEligibility(userId, toStage);
    if (!eligibility.eligible) {
      throw new Error('Requirements not met for stage transition');
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

      // Trigger achievement checks
      await achievementHandlers.handleStageTransition(userId);

      return stageTransition;
    });

    return transition;
  },

  async getStageHistory(userId: string) {
    return await prisma.stageTransition.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  },

  async checkStageEligibility(userId: string, stage: LifeStage): Promise<StageEligibility> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stageHistory: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const timeInCurrentStage = user.stageHistory[0] 
      ? Math.floor((Date.now() - user.stageHistory[0].createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const requirements = this.getStageRequirements(stage);
    const missingRequirements: StageRequirement[] = [];

    // Check each requirement
    for (const req of requirements) {
      switch (req.type) {
        case 'PARTICIPATION':
          const participationCount = await prisma.meadowParticipant.count({
            where: { userId }
          });
          req.current = participationCount;
          if (participationCount < req.value) {
            missingRequirements.push(req);
          }
          break;

        case 'CONTRIBUTION':
          const contributionCount = await prisma.meadow.count({
            where: { 
              hostId: userId,
              status: 'COMPLETED'
            }
          });
          req.current = contributionCount;
          if (contributionCount < req.value) {
            missingRequirements.push(req);
          }
          break;

        case 'TIME':
          req.current = timeInCurrentStage;
          if (timeInCurrentStage < req.value) {
            missingRequirements.push(req);
          }
          break;
      }
    }

    return {
      eligible: missingRequirements.length === 0,
      requirements,
      missingRequirements,
      timeInCurrentStage
    };
  },

  private getStageRequirements(stage: LifeStage): StageRequirement[] {
    switch (stage) {
      case 'EGG':
        return [
          {
            type: 'PARTICIPATION',
            description: 'Participate in first meadow',
            value: 1
          }
        ];

      case 'LARVAE':
        return [
          {
            type: 'PARTICIPATION',
            description: 'Participate in at least 3 meadows',
            value: 3
          },
          {
            type: 'TIME',
            description: 'Spend at least 7 days as an egg',
            value: 7
          }
        ];

      case 'PUPA':
        return [
          {
            type: 'PARTICIPATION',
            description: 'Participate in at least 10 meadows',
            value: 10
          },
          {
            type: 'CONTRIBUTION',
            description: 'Host at least 1 meadow',
            value: 1
          },
          {
            type: 'TIME',
            description: 'Spend at least 30 days as a larvae',
            value: 30
          }
        ];

      case 'BUTTERFLY':
        return [
          {
            type: 'PARTICIPATION',
            description: 'Participate in at least 20 meadows',
            value: 20
          },
          {
            type: 'CONTRIBUTION',
            description: 'Successfully host at least 5 meadows',
            value: 5
          },
          {
            type: 'TIME',
            description: 'Spend at least 60 days as a pupa',
            value: 60
          }
        ];

      default:
        return [];
    }
  }
};
