// src/pages/api/resources/categories/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/db';
import { withErrorHandler } from '@/middleware/error';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  // Get category and verify it exists
  const category = await prisma.resourceCategory.findUnique({
    where: { id },
    include: {
      _count: {
        select: { resources: true }
      }
    }
  });

  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  switch (req.method) {
    case 'GET':
      return res.status(200).json(category);

    case 'PUT':
      const { name, description, parentId } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      // Check if new name already exists (excluding current category)
      const existing = await prisma.resourceCategory.findFirst({
        where: {
          AND: [
            { name: { equals: name.trim(), mode: 'insensitive' } },
            { id: { not: id } }
          ]
        }
      });

      if (existing) {
        return res.status(400).json({ error: 'Category name already exists' });
      }

      // Prevent circular references in hierarchy
      if (parentId) {
        const wouldCreateCircular = await checkCircularReference(id, parentId);
        if (wouldCreateCircular) {
          return res.status(400).json({ error: 'Invalid parent category (would create circular reference)' });
        }
      }

      const updatedCategory = await prisma.resourceCategory.update({
        where: { id },
        data: {
          name: name.trim(),
          description: description?.trim(),
          parentId,
          updatedAt: new Date()
        },
        include: {
          _count: {
            select: { resources: true }
          }
        }
      });

      return res.status(200).json(updatedCategory);

    case 'DELETE':
      // Check if category has resources
      if (category._count.resources > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete category with resources. Move or delete resources first.' 
        });
      }

      // Move child categories to parent before deletion
      if (category.parentId) {
        await prisma.resourceCategory.updateMany({
          where: { parentId: id },
          data: { parentId: category.parentId }
        });
      }

      await prisma.resourceCategory.delete({
        where: { id }
      });

      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Helper function to check for circular references in category hierarchy
async function checkCircularReference(categoryId: string, newParentId: string): Promise<boolean> {
  let currentId = newParentId;
  const visited = new Set<string>();

  while (currentId) {
    if (currentId === categoryId) return true;
    if (visited.has(currentId)) return true;
    visited.add(currentId);

    const parent = await prisma.resourceCategory.findUnique({
      where: { id: currentId },
      select: { parentId: true }
    });

    if (!parent?.parentId) break;
    currentId = parent.parentId;
  }

  return false;
}

export default withErrorHandler(handler);
