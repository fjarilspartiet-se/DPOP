// src/pages/api/movement/achievements/[id]/seen.ts

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

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid achievement ID' });
  }

  // Mark achievement as seen
  await prisma.userAchievement.update({
    where: {
      id,
      userId: session.user.id // Ensure user owns this achievement
    },
    data: {
      seenAt: new Date()
    }
  });

  return res.status(200).json({ success: true });
}

export default withErrorHandler(handler);
