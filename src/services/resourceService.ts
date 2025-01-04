// src/services/resourceService.ts

import prisma from '@/lib/db';
import { ResourceType, AccessLevel, LifeStage } from '@prisma/client';

export interface CreateResourceInput {
  title: string;
  description: string;
  type: ResourceType;
  content: Record<string, any>;  // JSON content
  categoryIds: string[];        // Added for categories
  stage?: LifeStage;
  access?: AccessLevel;
  metadata?: Record<string, any>;
  meadowId?: string;
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

    // Verify categories exist
    if (data.categoryIds?.length > 0) {
      const categories = await prisma.resourceCategory.findMany({
        where: { id: { in: data.categoryIds } }
      });

      if (categories.length !== data.categoryIds.length) {
        throw new Error('One or more categories not found');
      }
    }

    return await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        content: data.content,
        access: data.access ?? AccessLevel.PUBLIC,
        metadata: data.metadata ?? {},
        stage: data.stage,
        author: {
          connect: { id: userId }
        },
        meadow: data.meadowId ? {
          connect: { id: data.meadowId }
        } : undefined,
        categories: data.categoryIds?.length > 0 ? {
          connect: data.categoryIds.map(id => ({ id }))
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
        },
        categories: {
          select: {
            id: true,
            name: true
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

    // Verify new categories if provided
    if (data.categoryIds?.length > 0) {
      const categories = await prisma.resourceCategory.findMany({
        where: { id: { in: data.categoryIds } }
      });

      if (categories.length !== data.categoryIds.length) {
        throw new Error('One or more categories not found');
      }
    }

    return await prisma.resource.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        content: data.content,
        stage: data.stage,
        access: data.access,
        metadata: data.metadata,
        meadowId: data.meadowId,
        categories: data.categoryIds ? {
          set: data.categoryIds.map(id => ({ id }))
        } : undefined,
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
        },
        categories: {
          select: {
            id: true,
            name: true
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
    categoryIds?: string[];
    stage?: LifeStage;
    access?: AccessLevel;
    meadowId?: string;
    search?: string;
  }) {
    const where: any = {};

    if (params?.type) {
      where.type = params.type;
    }

    if (params?.categoryIds?.length) {
      where.categories = {
        some: {
          id: { in: params.categoryIds }
        }
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
        },
        categories: {
          select: {
            id: true,
            name: true
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
