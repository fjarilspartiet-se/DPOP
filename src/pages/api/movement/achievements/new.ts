// src/pages/api/movement/achievements/new.ts

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

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Get unseen achievements
  const newAchievements = await prisma.userAchievement.findMany({
    where: {
      userId: session.user.id,
      seenAt: null,
      progress: 100 // Only show completed achievements
    },
    include: {
      achievement: true
    },
    orderBy: {
      earnedAt: 'desc'
    }
  });

  return res.status(200).json(newAchievements);
}

export default withErrorHandler(handler);
