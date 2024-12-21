// src/party/utils/voteFormatter.ts

import { VoteType } from '@prisma/client';

export const formatVoteChoice = (choice: any, voteType: VoteType): string => {
  switch (voteType) {
    case 'SIMPLE':
      return choice.vote ? '✓ Yes' : '✗ No';

    case 'RANKED':
      return `Ranked: ${choice.rankings?.join(' > ')}`;

    case 'WEIGHTED':
      return `${(choice.weight * 100).toFixed(0)}%`;

    case 'APPROVAL':
      return choice.approved?.join(', ') || 'None approved';

    default:
      return JSON.stringify(choice);
  }
};
