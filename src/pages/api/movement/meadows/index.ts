// src/pages/api/movement/meadows/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { meadowService } from '@/services/meadowService';
import { withErrorHandler } from '@/middleware/error';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      const { type, status, search } = req.query;
      const meadows = await meadowService.listMeadows({
        type: type as any,
        status: status as any,
        search: search as string,
      });
      return res.status(200).json(meadows);

    case 'POST':
      const newMeadow = await meadowService.createMeadow(
        req.body,
        session.user.id
      );
      return res.status(201).json(newMeadow);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withErrorHandler(handler);
