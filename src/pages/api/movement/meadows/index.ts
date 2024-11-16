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

// src/pages/api/movement/meadows/[id].ts

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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid meadow ID' });
  }

  switch (req.method) {
    case 'GET':
      const meadow = await meadowService.getMeadow(id);
      if (!meadow) {
        return res.status(404).json({ error: 'Meadow not found' });
      }
      return res.status(200).json(meadow);

    case 'PUT':
      const updatedMeadow = await meadowService.updateMeadow({
        id,
        ...req.body,
      });
      return res.status(200).json(updatedMeadow);

    case 'DELETE':
      await meadowService.deleteMeadow(id);
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withErrorHandler(handler);

// src/pages/api/movement/meadows/[id]/join.ts

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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid meadow ID' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await meadowService.joinMeadow(id, session.user.id);
  return res.status(200).json({ success: true });
}

export default withErrorHandler(handler);

// src/pages/api/movement/meadows/[id]/leave.ts

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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid meadow ID' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await meadowService.leaveMeadow(id, session.user.id);
  return res.status(200).json({ success: true });
}

export default withErrorHandler(handler);
