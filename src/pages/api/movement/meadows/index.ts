// src/pages/api/movement/meadows/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { meadowService } from '@/services/meadowService';
import { withErrorHandler } from '@/middleware/error';
import { MeadowStatus, MeadowType } from '@prisma/client';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      const { type, status, search } = req.query;
      const meadows = await meadowService.listMeadows({
        type: type as MeadowType | undefined,
        status: status as MeadowStatus | undefined,
        search: search as string | undefined,
      });
      return res.status(200).json(meadows);

    case 'POST':
      const meadow = await meadowService.createMeadow(
        req.body,
        session.user.id
      );
      return res.status(201).json(meadow);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withErrorHandler(handler);
