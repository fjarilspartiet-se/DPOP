// src/pages/api/party/proposals/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { votingService } from '@/services/votingService';
import { withErrorHandler } from '@/middleware/error';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid proposal ID' });
  }

  switch (req.method) {
    case 'GET':
      const proposal = await votingService.getProposal(id);
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }
      return res.status(200).json(proposal);

    case 'PUT':
      const updatedProposal = await votingService.updateProposal({
        ...req.body,
        id
      }, session.user.id);
      return res.status(200).json(updatedProposal);

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withErrorHandler(handler);
