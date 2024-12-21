// src/services/votingService.ts

import { VoteType, VoteStatus, Proposal, Vote } from '@prisma/client';
import prisma from '@/lib/db';

interface CreateProposalInput {
  title: string;
  description: string;
  content: Record<string, any>;
  voteType: VoteType;
  startDate?: Date;
  endDate?: Date;
  quorum?: number;
  threshold?: number;
}

interface UpdateProposalInput extends Partial<CreateProposalInput> {
  id: string;
}

interface VoteInput {
  proposalId: string;
  choice: Record<string, any>;
}

export const votingService = {
  async createProposal(data: CreateProposalInput, authorId: string): Promise<Proposal> {
    return await prisma.proposal.create({
      data: {
        ...data,
        authorId,
        status: 'draft',
        voteStatus: VoteStatus.DRAFT
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  },

  async updateProposal(data: UpdateProposalInput, userId: string): Promise<Proposal> {
    const proposal = await prisma.proposal.findUnique({
      where: { id: data.id },
      select: { authorId: true, voteStatus: true }
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.authorId !== userId) {
      throw new Error('Not authorized to update proposal');
    }

    if (proposal.voteStatus !== VoteStatus.DRAFT) {
      throw new Error('Cannot update proposal once voting has started');
    }

    return await prisma.proposal.update({
      where: { id: data.id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  },

  async startVoting(proposalId: string, userId: string): Promise<Proposal> {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { authorId: true, voteStatus: true }
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.authorId !== userId) {
      throw new Error('Not authorized to start voting');
    }

    if (proposal.voteStatus !== VoteStatus.DRAFT) {
      throw new Error('Voting has already started or is closed');
    }

    return await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        voteStatus: VoteStatus.ACTIVE,
        startDate: new Date()
      }
    });
  },

  async castVote(data: VoteInput, userId: string): Promise<Vote> {
    const proposal = await prisma.proposal.findUnique({
      where: { id: data.proposalId }
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.voteStatus !== VoteStatus.ACTIVE) {
      throw new Error('Voting is not active for this proposal');
    }

    if (proposal.endDate && proposal.endDate < new Date()) {
      throw new Error('Voting period has ended');
    }

    // Validate vote based on vote type
    this.validateVote(data.choice, proposal.voteType);

    // Create or update vote
    return await prisma.vote.upsert({
      where: {
        proposalId_userId: {
          proposalId: data.proposalId,
          userId
        }
      },
      update: {
        choice: data.choice
      },
      create: {
        proposalId: data.proposalId,
        userId,
        choice: data.choice
      }
    });
  },

  async closeVoting(proposalId: string, userId: string): Promise<Proposal> {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { votes: true }
    });

    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.authorId !== userId) {
      throw new Error('Not authorized to close voting');
    }

    if (proposal.voteStatus !== VoteStatus.ACTIVE) {
      throw new Error('Voting is not active');
    }

    // Calculate results based on vote type
    const result = await this.calculateResults(proposal);

    return await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        voteStatus: VoteStatus.CLOSED,
        closedAt: new Date(),
        result
      }
    });
  },

  async getProposal(id: string): Promise<Proposal | null> {
    return await prisma.proposal.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        votes: {
          select: {
            choice: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
  },

  async listProposals(params?: {
    status?: string;
    voteStatus?: VoteStatus;
    search?: string;
  }): Promise<Proposal[]> {
    const where: any = {};

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.voteStatus) {
      where.voteStatus = params.voteStatus;
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } }
      ];
    }

    return await prisma.proposal.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            votes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  private validateVote(choice: Record<string, any>, voteType: VoteType): void {
    switch (voteType) {
      case VoteType.SIMPLE:
        if (typeof choice.vote !== 'boolean') {
          throw new Error('Simple vote must be boolean');
        }
        break;

      case VoteType.RANKED:
        if (!Array.isArray(choice.rankings)) {
          throw new Error('Ranked vote must provide array of rankings');
        }
        break;

      case VoteType.WEIGHTED:
        if (typeof choice.weight !== 'number' || choice.weight < 0 || choice.weight > 1) {
          throw new Error('Weight must be between 0 and 1');
        }
        break;

      case VoteType.APPROVAL:
        if (!Array.isArray(choice.approved)) {
          throw new Error('Approval vote must provide array of approved options');
        }
        break;
    }
  },

  private async calculateResults(proposal: Proposal & { votes: Vote[] }) {
    const totalVotes = proposal.votes.length;
    
    if (proposal.quorum && totalVotes < proposal.quorum) {
      return {
        status: 'failed',
        reason: 'quorum_not_met',
        quorum: proposal.quorum,
        totalVotes
      };
    }

    switch (proposal.voteType) {
      case VoteType.SIMPLE:
        return this.calculateSimpleVoteResults(proposal);
      case VoteType.RANKED:
        return this.calculateRankedVoteResults(proposal);
      case VoteType.WEIGHTED:
        return this.calculateWeightedVoteResults(proposal);
      case VoteType.APPROVAL:
        return this.calculateApprovalVoteResults(proposal);
    }
  },

  private calculateSimpleVoteResults(proposal: Proposal & { votes: Vote[] }) {
    const votes = proposal.votes;
    const yesVotes = votes.filter(v => v.choice.vote === true).length;
    const percentage = (yesVotes / votes.length) * 100;

    const passed = proposal.threshold 
      ? percentage >= proposal.threshold
      : percentage > 50;

    return {
      status: passed ? 'passed' : 'failed',
      totalVotes: votes.length,
      yesVotes,
      noVotes: votes.length - yesVotes,
      percentage
    };
  },

  private calculateRankedVoteResults(proposal: Proposal & { votes: Vote[] }) {
    // Implement Ranked Choice Voting algorithm
    // Return detailed ranking results
    return {
      status: 'calculated',
      method: 'ranked_choice',
      rounds: [], // Add detailed round calculations
      winner: null // Add winning option
    };
  },

  private calculateWeightedVoteResults(proposal: Proposal & { votes: Vote[] }) {
    const votes = proposal.votes;
    const totalWeight = votes.reduce((sum, vote) => sum + vote.choice.weight, 0);
    const averageWeight = totalWeight / votes.length;

    return {
      status: 'calculated',
      method: 'weighted',
      totalVotes: votes.length,
      totalWeight,
      averageWeight
    };
  },

  private calculateApprovalVoteResults(proposal: Proposal & { votes: Vote[] }) {
    const votes = proposal.votes;
    const approvals = new Map<string, number>();

    votes.forEach(vote => {
      vote.choice.approved.forEach((option: string) => {
        approvals.set(option, (approvals.get(option) || 0) + 1);
      });
    });

    const results = Array.from(approvals.entries())
      .map(([option, count]) => ({
        option,
        count,
        percentage: (count / votes.length) * 100
      }))
      .sort((a, b) => b.count - a.count);

    return {
      status: 'calculated',
      method: 'approval',
      totalVotes: votes.length,
      results
    };
  }
};
