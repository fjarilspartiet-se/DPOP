// src/services/meadowService.ts

import { Meadow, CreateMeadowInput, UpdateMeadowInput } from '@/types/meadow';
import prisma from '@/lib/db';
import { MeadowType, MeadowStatus } from '@prisma/client';

export const meadowService = {
  async createMeadow(data: CreateMeadowInput, userId: string): Promise<Meadow> {
    return await prisma.meadow.create({
      data: {
        ...data,
        hostId: userId,
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
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });
  },

  async updateMeadow(data: UpdateMeadowInput): Promise<Meadow> {
    const { id, ...updateData } = data;
    return await prisma.meadow.update({
      where: { id },
      data: updateData,
      include: {
        host: true,
        participants: true,
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });
  },

  async deleteMeadow(id: string): Promise<void> {
    await prisma.meadow.delete({
      where: { id }
    });
  },

  async getMeadow(id: string): Promise<Meadow | null> {
    return await prisma.meadow.findUnique({
      where: { id },
      include: {
        host: true,
        participants: true,
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });
  },

  async listMeadows(params: {
    type?: MeadowType;
    status?: MeadowStatus;
    search?: string;
  }): Promise<Meadow[]> {
    const { type, status, search } = params;
    
    return await prisma.meadow.findMany({
      where: {
        ...(type && { type }),
        ...(status && { status }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        })
      },
      include: {
        host: true,
        participants: true,
        activities: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      },
      orderBy: {
        dateTime: 'asc'
      }
    });
  },

  async joinMeadow(meadowId: string, userId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
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
          type: 'join'
        }
      });
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
  }
};
