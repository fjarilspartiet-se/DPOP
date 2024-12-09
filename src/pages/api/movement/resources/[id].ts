// src/pages/api/movement/resources/[id].ts

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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid resource ID' });
  }

  switch (req.method) {
    case 'GET':
      const resource = await resourceService.getResource(id);
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      return res.status(200).json(resource);

    case 'PUT':
      const updatedResource = await resourceService.updateResource({
        id,
        ...req.body
      }, session.user.id);
      return res.status(200).json(updatedResource);

    case 'DELETE':
      await resourceService.deleteResource(id, session.user.id);
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withErrorHandler(handler);
