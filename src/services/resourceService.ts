// src/services/resourceService.ts

import prisma from '@/lib/db';
import { ResourceType, AccessLevel, LifeStage } from '@prisma/client';

export interface CreateResourceInput {
  title: string;
  description: string;
  type: ResourceType;
  content: Record<string, any>;  // JSON content
  categories: string[];
  stage?: LifeStage;
  access?: AccessLevel;
  metadata?: Record<string, any>;
  meadowId?: string;  // Optional meadow association
}

export interface UpdateResourceInput extends Partial<CreateResourceInput> {
  id: string;
}

export const resourceService = {
  async createResource(data: CreateResourceInput, userId: string) {
    // Validate meadow access if meadowId is provided
    if (data.meadowId) {
      const meadow = await prisma.meadow.findUnique({
        where: { id: data.meadowId },
        include: { participants: true }
      });

      if (!meadow) {
        throw new Error('Meadow not found');
      }

      // Check if user is a participant
      const isParticipant = meadow.participants.some(p => p.userId === userId);
      if (!isParticipant) {
        throw new Error('Not authorized to add resources to this meadow');
      }
    }

    return await prisma.resource.create({
      data: {
        ...data,
        access: data.access ?? AccessLevel.PUBLIC,
        metadata: data.metadata ?? {},
        content: data.content,
        author: {
          connect: { id: userId }
        },
        meadow: data.meadowId ? {
          connect: { id: data.meadowId }
        } : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            currentStage: true
          }
        },
        meadow: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });
  },

  async updateResource(data: UpdateResourceInput, userId: string) {
    const resource = await prisma.resource.findUnique({
      where: { id: data.id },
      select: { authorId: true }
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    if (resource.authorId !== userId) {
      throw new Error('Not authorized to update resource');
    }

    return await prisma.resource.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        content: data.content,
        categories: data.categories,
        stage: data.stage,
        access: data.access,
        metadata: data.metadata,
        meadowId: data.meadowId,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            currentStage: true
          }
        },
        meadow: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });
  },

  async deleteResource(id: string, userId: string) {
    const resource = await prisma.resource.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    if (resource.authorId !== userId) {
      throw new Error('Not authorized to delete resource');
    }

    await prisma.resource.delete({ where: { id } });
  },

  async getResource(id: string) {
    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            currentStage: true
          }
        },
        meadow: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    if (resource) {
      // Increment views atomically
      await this.incrementViews(id);
    }

    return resource;
  },

  async listResources(params?: {
    type?: ResourceType;
    categories?: string[];
    stage?: LifeStage;
    access?: AccessLevel;
    meadowId?: string;
    search?: string;
  }) {
    const where: any = {};

    if (params?.type) {
      where.type = params.type;
    }

    if (params?.categories?.length) {
      where.categories = {
        hasEvery: params.categories
      };
    }

    if (params?.stage) {
      where.stage = params.stage;
    }

    if (params?.access) {
      where.access = params.access;
    }

    if (params?.meadowId) {
      where.meadowId = params.meadowId;
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } }
      ];
    }

    return await prisma.resource.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            currentStage: true
          }
        },
        meadow: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  async incrementViews(id: string) {
    await prisma.resource.update({
      where: { id },
      data: {
        views: { increment: 1 }
      }
    });
  },

  async incrementShares(id: string) {
    await prisma.resource.update({
      where: { id },
      data: {
        shares: { increment: 1 }
      }
    });
  }
};
