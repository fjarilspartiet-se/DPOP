// src/pages/api/resources/categories/index.ts

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

  switch (req.method) {
    case 'GET':
      const categories = await prisma.resourceCategory.findMany({
        include: {
          _count: {
            select: { resources: true }
          },
          parent: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      return res.status(200).json(categories);

    case 'POST':
      const { name, description, parentId } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      // Check if category name already exists
      const existing = await prisma.resourceCategory.findFirst({
        where: {
          name: {
            equals: name.trim(),
            mode: 'insensitive'
          }
        }
      });

      if (existing) {
        return res.status(400).json({ error: 'Category name already exists' });
      }

      // Create new category
      const newCategory = await prisma.resourceCategory.create({
        data: {
          name: name.trim(),
          description: description?.trim(),
          parentId,
          createdBy: session.user.id
        },
        include: {
          _count: {
            select: { resources: true }
          }
        }
      });

      return res.status(201).json(newCategory);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withErrorHandler(handler);
