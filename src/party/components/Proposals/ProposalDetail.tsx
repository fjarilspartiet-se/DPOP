// src/party/components/Proposals/ProposalDetail.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  AlertCircle,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Check,
  X
} from 'lucide-react';
import { VoteStatus, VoteType } from '@prisma/client';
import Card from '@/shared/components/common/Card';
import { Alert, AlertDescription } from '@/shared/components/common/Alert';

interface ProposalDetailProps {
  proposalId: string;
  onBack: () => void;
}

const ProposalDetail: React.FC<ProposalDetailProps> = ({ proposalId, onBack }) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [proposal, setProposal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProposal();
  }, [proposalId]);

  const fetchProposal = async () => {
    try {
      const response = await fetch(`/api/party/proposals/${proposalId}`);
      if (!response.ok) throw new Error('Failed to fetch proposal');
      const data = await response.json();
      setProposal(data);
      // Find user's existing vote
      if (session?.user) {
        const userVote = data.votes.find(
          (v: any) => v.user.id === session.user.id
        );
        setUserVote(userVote);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (choice: any) => {
    if (!session?.user) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/party/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice }),
      });

      if (!response.ok) throw new Error('Failed to cast vote');
      
      const vote = await response.json();
      setUserVote(vote);
      await fetchProposal(); // Refresh proposal data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cast vote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseVoting = async () => {
    if (!session?.user) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/party/proposals/${proposalId}/close`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to close voting');
      await fetchProposal(); // Refresh proposal data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close voting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderVotingInterface = () => {
    if (!proposal) return null;

    switch (proposal.voteType) {
      case 'SIMPLE':
        return (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleVote({ vote: true })}
              disabled={isSubmitting || userVote}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                userVote?.choice.vote === true
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 hover:bg-green-50 dark:bg-gray-800 dark:hover:bg-green-900/20'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
              {t('party.proposals.vote.yes')}
            </button>
            <button
              onClick={() => handleVote({ vote: false })}
              disabled={isSubmitting || userVote}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                userVote?.choice.vote === false
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                  : 'bg-gray-100 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20'
              }`}
            >
              <ThumbsDown className="w-5 h-5" />
              {t('party.proposals.vote.no')}
            </button>
          </div>
        );

      case 'RANKED':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {t('party.proposals.vote.rankInstructions')}
            </div>
            <div className="space-y-2">
              {proposal.content.options?.map((option: string, index: number) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <input
                    type="number"
                    min="1"
                    max={proposal.content.options.length}
                    value={userVote?.choice.rankings?.[index] || ''}
                    onChange={(e) => {
                      const rankings = [...(userVote?.choice.rankings || [])];
                      rankings[index] = parseInt(e.target.value);
                      handleVote({ rankings });
                    }}
                    className="w-16 p-2 border rounded-md dark:bg-gray-700"
                  />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'WEIGHTED':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {t('party.proposals.vote.weightInstructions')}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={userVote?.choice.weight * 100 || 0}
              onChange={(e) => handleVote({ weight: parseInt(e.target.value) / 100 })}
              className="w-full"
            />
            <div className="text-center font-medium">
              {userVote?.choice.weight ? `${(userVote.choice.weight * 100).toFixed(0)}%` : '0%'}
            </div>
          </div>
        );

      case 'APPROVAL':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {t('party.proposals.vote.approvalInstructions')}
            </div>
            <div className="space-y-2">
              {proposal.content.options?.map((option: string, index: number) => {
                const isApproved = userVote?.choice.approved?.includes(option);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      const approved = [...(userVote?.choice.approved || [])];
                      if (isApproved) {
                        approved.splice(approved.indexOf(option), 1);
                      } else {
                        approved.push(option);
                      }
                      handleVote({ approved });
                    }}
                    className={`w-full p-4 rounded-lg transition-colors ${
                      isApproved
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-gray-50 hover:bg-green-50 dark:bg-gray-800 dark:hover:bg-green-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isApproved && <Check className="w-5 h-5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!proposal?.result) return null;

    switch (proposal.voteType) {
      case 'SIMPLE':
        const { yesVotes, noVotes, percentage } = proposal.result;
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{t('party.proposals.results.yes')}: {yesVotes}</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>{t('party.proposals.results.no')}: {noVotes}</span>
              <span>{(100 - percentage).toFixed(1)}%</span>
            </div>
          </div>
        );

      case 'RANKED':
        return (
          <div className="space-y-4">
            {proposal.result.rounds.map((round: any, index: number) => (
              <div key={index} className="border-b dark:border-gray-700 pb-4">
                <h4 className="font-medium mb-2">
                  {t('party.proposals.results.round')} {index + 1}
                </h4>
                {Object.entries(round.counts).map(([option, count]: [string, any]) => (
                  <div key={option} className="flex justify-between text-sm mb-2">
                    <span>{option}</span>
                    <span>{count} {t('party.proposals.results.votes')}</span>
                  </div>
                ))}
                {round.eliminated && (
                  <div className="text-sm text-red-500 mt-2">
                    {t('party.proposals.results.eliminated')}: {round.eliminated}
                  </div>
                )}
              </div>
            ))}
            {proposal.result.winner && (
              <div className="text-lg font-medium text-green-600 dark:text-green-400">
                {t('party.proposals.results.winner')}: {proposal.result.winner}
              </div>
            )}
          </div>
        );

      default:
        return (
          <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-auto">
            {JSON.stringify(proposal.result, null, 2)}
          </pre>
        );
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">{t('common.loading')}</div>;
  }

  if (!proposal) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error || t('party.proposals.errors.notFound')}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </button>

        <span className={`px-3 py-1 rounded-full text-sm ${
          proposal.voteStatus === 'ACTIVE' 
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          {t(`party.proposals.status.${proposal.voteStatus.toLowerCase()}`)}
        </span>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Title and Description */}
          <div>
            <h1 className="text-2xl font-bold mb-4">{proposal.title}</h1>
            <p className="text-gray-600 dark:text-gray-300">{proposal.description}</p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(proposal.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {proposal.votes.length} {t('party.proposals.votes')}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {proposal.comments.length} {t('party.proposals.comments')}
            </span>
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            {proposal.content.text}
          </div>

          {/* Voting Section */}
          {proposal.voteStatus === 'ACTIVE' && (
            <div className="border-t dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold mb-4">
                {t('party.proposals.castVote')}
              </h2>
              {renderVotingInterface()}
            </div>
          )}

          {/* Results Section */}
          {proposal.voteStatus === 'CLOSED' && (
            <div className="border-t dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold mb-4">
                {t('party.proposals.results.title')}
              </h2>
              <div className="space-y-4">
                {/* Participation Stats */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{proposal.votes.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {t('party.proposals.results.totalVotes')}
                      </div>
                    </div>
                    {proposal.quorum && (
                      <div className="text-center">
                        <div className="text-2xl font-bold">{proposal.quorum}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {t('party.proposals.results.quorumRequired')}
                        </div>
                      </div>
                    )}
                    {proposal.threshold && (
                      <div className="text-center">
                        <div className="text-2xl font-bold">{proposal.threshold}%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {t('party.proposals.results.thresholdRequired')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Result Banner */}
                <div className={`p-4 rounded-lg ${
                  proposal.result.status === 'passed'
                    ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                    : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {proposal.result.status === 'passed'
                        ? t('party.proposals.results.proposalPassed')
                        : t('party.proposals.results.proposalFailed')}
                    </div>
                    {proposal.result.reason && (
                      <div className="text-sm">
                        {t(`party.proposals.results.reasons.${proposal.result.reason}`)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Results */}
                {renderResults()}

                {/* Vote List */}
                <div className="mt-6">
                  <h3 className="font-medium mb-4">
                    {t('party.proposals.results.individualVotes')}
                  </h3>
                  <div className="space-y-2">
                    {proposal.votes.map((vote: any) => (
                      <div 
                        key={vote.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium">
                            {vote.user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(vote.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-sm">
                          {formatVoteChoice(vote.choice, proposal.voteType)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold mb-4">
              {t('party.proposals.comments')} ({proposal.comments.length})
            </h2>
            {/* Comment Input */}
            {session?.user && (
              <div className="mb-4">
                <textarea
                  placeholder={t('party.proposals.addComment')}
                  className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    {t('party.proposals.submitComment')}
                  </button>
                </div>
              </div>
            )}
            {/* Comments List */}
            <div className="space-y-4">
              {proposal.comments.map((comment: any) => (
                <div key={comment.id} className="border-b dark:border-gray-700 last:border-0 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{comment.user.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              ))}
              {proposal.comments.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  {t('party.proposals.noComments')}
                </div>
              )}
            </div>
          </div>

          {/* Admin Actions */}
          {session?.user?.id === proposal.author.id && proposal.voteStatus === 'ACTIVE' && (
            <div className="border-t dark:border-gray-700 pt-6">
              <div className="flex justify-end">
                <button
                  onClick={handleCloseVoting}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  {t('party.proposals.closeVoting')}
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProposalDetail;
