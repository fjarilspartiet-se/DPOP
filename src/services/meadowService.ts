// src/services/meadowService.ts

import { Meadow, MeadowStatus, MeadowType } from '@prisma/client';
import prisma from '@/lib/db';
import { achievementHandlers } from './achievementHandlers';
import type { CreateMeadowInput, UpdateMeadowInput } from '@/types/meadow';

import { mockMeadows } from '@/movement/mocks/meadowData';

export const meadowService = {
  async createMeadow(data: CreateMeadowInput, userId: string): Promise<Meadow> {
    const meadow = await prisma.$transaction(async (tx) => {
      const newMeadow = await tx.meadow.create({
        data: {
          ...data,
          host: {
            connect: { id: userId }
          },
          participants: {
            create: {
              userId,
              role: 'HOST',
            }
          }
        },
        include: {
          host: true,
          participants: true,
        }
      });

      // Create initial activity
      await tx.meadowActivity.create({
        data: {
          meadowId: newMeadow.id,
          userId,
          type: 'creation',
          details: 'Meadow created'
        }
      });

      // Trigger achievement checks
      await achievementHandlers.handleMeadowHosting(userId);

      return newMeadow;
    });

    return meadow;
  },

  async updateMeadow(data: UpdateMeadowInput & { userId: string }): Promise<Meadow> {
    const { id, userId, ...updateData } = data;
    
    // First check if user is authorized to update
    const meadow = await prisma.meadow.findUnique({
      where: { id },
      select: { host: { select: { id: true } } }
    });

    if (!meadow) {
      throw new Error('Meadow not found');
    }

    if (meadow.host.id !== userId) {
      throw new Error('Not authorized to update meadow');
    }

    return await prisma.meadow.update({
      where: { id },
      data: updateData,
      include: {
        host: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                lifeStage: true
              }
            }
          }
        },
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });
  },

  async deleteMeadow(id: string, userId: string): Promise<void> {
    // First check if user is authorized to delete
    const meadow = await prisma.meadow.findUnique({
      where: { id },
      select: { host: { select: { id: true } } }
    });

    if (!meadow) {
      throw new Error('Meadow not found');
    }

    if (meadow.host.id !== userId) {
      throw new Error('Not authorized to delete meadow');
    }

    await prisma.meadow.delete({
      where: { id }
    });
  },

  async getMeadow(id: string): Promise<Meadow | null> {
    return await prisma.meadow.findUnique({
      where: { id },
      include: {
        host: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                lifeStage: true
              }
            }
          }
        },
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });
  },

  async listMeadows(params?: {
    type?: MeadowType;
    status?: MeadowStatus;
    search?: string;
  }) {
    const where: any = {};
    
    if (params?.type) {
      where.type = params.type;
    }
    
    if (params?.status) {
      where.status = params.status;
    }
    
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } }
      ];
    }

    return await prisma.meadow.findMany({
      where,
      include: {
        host: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                lifeStage: true
              }
            }
          }
        },
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },


  async joinMeadow(meadowId: string, userId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Check if meadow exists and isn't full
      const meadow = await tx.meadow.findUnique({
        where: { id: meadowId },
        include: { participants: true }
      });

      if (!meadow) {
        throw new Error('Meadow not found');
      }

      if (meadow.maxParticipants && meadow.participants.length >= meadow.maxParticipants) {
        throw new Error('Meadow is full');
      }

      if (meadow.status !== MeadowStatus.PLANNED && meadow.status !== MeadowStatus.ACTIVE) {
        throw new Error('Meadow is not accepting participants');
      }

      // Add participant
      await tx.meadowParticipant.create({
        data: {
          meadowId,
          userId,
          role: 'PARTICIPANT'
        }
      });

      // Create activity
      await tx.meadowActivity.create({
        data: {
          meadowId,
          userId,
          type: 'join',
          details: 'Joined meadow'
        }
      });

      // Trigger achievement checks
      await achievementHandlers.handleMeadowParticipation(userId);
    });
  },

  async leaveMeadow(meadowId: string, userId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Remove participant
      await tx.meadowParticipant.delete({
        where: {
          meadowId_userId: {
            meadowId,
            userId
          }
        }
      });

      // Create activity
      await tx.meadowActivity.create({
        data: {
          meadowId,
          userId,
          type: 'leave'
        }
      });
    });
  },

  async completeMeadow(meadowId: string, userId: string): Promise<void> {
    const meadow = await prisma.meadow.findUnique({
      where: { id: meadowId },
      include: { 
        participants: true,
        host: true
      }
    });

    if (!meadow) {
      throw new Error('Meadow not found');
    }

    if (meadow.host.id !== userId) {
      throw new Error('Only the host can complete a meadow');
    }

    if (meadow.status === MeadowStatus.COMPLETED) {
      throw new Error('Meadow is already completed');
    }

    await prisma.$transaction(async (tx) => {
      // Update meadow status
      await tx.meadow.update({
        where: { id: meadowId },
        data: { 
          status: MeadowStatus.COMPLETED,
          completedAt: new Date()
        }
      });

      // Create completion activity
      await tx.meadowActivity.create({
        data: {
          meadowId,
          userId,
          type: 'completion',
          details: 'Meadow completed'
        }
      });

      // Trigger achievement checks for all participants
      await Promise.all(
        meadow.participants.map(participant => 
          achievementHandlers.handleMeadowParticipation(participant.userId)
        )
      );

      // Check host achievements
      await achievementHandlers.handleMeadowHosting(meadow.host.id);
    });
  }
};
