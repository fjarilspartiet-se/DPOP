// src/pages/api/resources/categories/validate.ts

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

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, excludeId } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  // Check for existing category with the same name
  const whereClause = {
    name: {
      equals: name.trim(),
      mode: 'insensitive' as const
    },
    ...(excludeId && { id: { not: excludeId } })
  };

  const existing = await prisma.resourceCategory.findFirst({
    where: whereClause
  });

  return res.status(200).json({
    valid: !existing,
    message: existing ? 'Category name already exists' : null
  });
}

export default withErrorHandler(handler);
