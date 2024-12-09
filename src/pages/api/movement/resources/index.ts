// src/pages/api/movement/resources/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { resourceService } from '@/services/resourceService';
import { withErrorHandler } from '@/middleware/error';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      const { type, categories, stage, access, meadowId, search } = req.query;
      const resources = await resourceService.listResources({
        type: type as any,
        categories: Array.isArray(categories) ? categories : categories ? [categories as string] : undefined,
        stage: stage as any,
        access: access as any,
        meadowId: meadowId as string,
        search: search as string
      });
      return res.status(200).json(resources);

    case 'POST':
      const resource = await resourceService.createResource(
        req.body,
        session.user.id
      );
      return res.status(201).json(resource);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withErrorHandler(handler);
