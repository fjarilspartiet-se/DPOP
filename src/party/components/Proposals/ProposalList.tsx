// src/party/components/Proposals/ProposalList.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { 
  FileText, 
  Search, 
  Filter,
  ThumbsUp, 
  MessageCircle, 
  Clock,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { VoteStatus, VoteType } from '@prisma/client';
import Card from '@/shared/components/common/Card';
import { Alert, AlertDescription } from '@/shared/components/common/Alert';
import ProposalForm from './ProposalForm';

interface Proposal {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
  };
  voteType: VoteType;
  voteStatus: VoteStatus;
  startDate?: Date;
  endDate?: Date;
  _count: {
    votes: number;
    comments: number;
  };
  createdAt: Date;
}

const ProposalList = () => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VoteStatus | ''>('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, [searchQuery, statusFilter]);

  const fetchProposals = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('voteStatus', statusFilter);

      const response = await fetch(`/api/party/proposals?${params}`);
      if (!response.ok) throw new Error('Failed to fetch proposals');
      const data = await response.json();
      setProposals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProposal = async (data: any) => {
    try {
      const response = await fetch('/api/party/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create proposal');
      
      const newProposal = await response.json();
      setProposals(prev => [newProposal, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleStartVoting = async (proposalId: string) => {
    try {
      const response = await fetch(`/api/party/proposals/${proposalId}/start`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to start voting');
      
      const updatedProposal = await response.json();
      setProposals(prev => 
        prev.map(p => p.id === proposalId ? updatedProposal : p)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getStatusColor = (status: VoteStatus) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CLOSED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ARCHIVED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6" />
          {t('party.proposals.title')}
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('party.proposals.create')}
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as VoteStatus | '')}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">{t('party.proposals.allStatuses')}</option>
            {Object.values(VoteStatus).map((status) => (
              <option key={status} value={status}>
                {t(`party.proposals.status.${status.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 gap-4">
        {proposals.map(proposal => (
          <Card key={proposal.id} className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Header Section */}
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-grow">
                  <h3 className="font-medium text-lg hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                    {proposal.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {proposal.description}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(proposal.voteStatus)}`}>
                  {t(`party.proposals.status.${proposal.voteStatus.toLowerCase()}`)}
                </span>
              </div>

              {/* Metadata Section */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{proposal.author.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {proposal._count.votes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {proposal._count.comments}
                </span>
              </div>

              {/* Vote Type and Timeline */}
              <div className="flex flex-wrap items-center justify-between pt-4 border-t dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <span className="text-sm">
                    {t(`party.proposals.voteTypes.${proposal.voteType.toLowerCase()}`)}
                  </span>
                  {proposal.startDate && (
                    <span className="text-sm">
                      {t('party.proposals.startDate')}: {new Date(proposal.startDate).toLocaleDateString()}
                    </span>
                  )}
                  {proposal.endDate && (
                    <span className="text-sm">
                      {t('party.proposals.endDate')}: {new Date(proposal.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {proposal.voteStatus === 'DRAFT' && proposal.author.id === session?.user?.id && (
                    <button
                      onClick={() => handleStartVoting(proposal.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                    >
                      {t('party.proposals.startVoting')}
                    </button>
                  )}
                  {proposal.voteStatus === 'ACTIVE' && (
                    <button
                      onClick={() => router.push(`/party/proposals/${proposal.id}`)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      {t('party.proposals.vote')}
                    </button>
                  )}
                  {proposal.voteStatus === 'CLOSED' && (
                    <button
                      onClick={() => router.push(`/party/proposals/${proposal.id}`)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                    >
                      {t('party.proposals.viewResults')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {proposals.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('party.proposals.noProposals')}
          </div>
        )}
      </div>

      {/* Create Proposal Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
            <ProposalForm
              onSubmit={handleCreateProposal}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalList;
