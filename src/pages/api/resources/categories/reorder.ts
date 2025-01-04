// src/pages/api/resources/categories/reorder.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/db';
import { withErrorHandler } from '@/middleware/error';

interface ReorderRequest {
  categoryId: string;
  newParentId?: string | null;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { categoryId, newParentId } = req.body as ReorderRequest;

  if (!categoryId) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  // Verify category exists
  const category = await prisma.resourceCategory.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // If moving to a new parent, verify parent exists
  if (newParentId) {
    const parent = await prisma.resourceCategory.findUnique({
      where: { id: newParentId }
    });

    if (!parent) {
      return res.status(404).json({ error: 'Parent category not found' });
    }

    // Check for circular reference
    const wouldCreateCircular = await checkCircularReference(categoryId, newParentId);
    if (wouldCreateCircular) {
      return res.status(400).json({ error: 'Invalid parent (would create circular reference)' });
    }
  }

  // Update category parent
  const updatedCategory = await prisma.resourceCategory.update({
    where: { id: categoryId },
    data: {
      parentId: newParentId || null,
      updatedAt: new Date()
    },
    include: {
      parent: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return res.status(200).json(updatedCategory);
}

// Helper function to check for circular references (same as in [id].ts)
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
