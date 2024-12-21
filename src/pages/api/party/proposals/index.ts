// src/pages/api/party/proposals/index.ts

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

  switch (req.method) {
    case 'GET':
      const proposals = await votingService.listProposals({
        status: req.query.status as string,
        voteStatus: req.query.voteStatus as any,
        search: req.query.search as string
      });
      return res.status(200).json(proposals);

    case 'POST':
      const proposal = await votingService.createProposal(
        req.body,
        session.user.id
      );
      return res.status(201).json(proposal);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withErrorHandler(handler);
