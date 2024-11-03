import React, { useState } from 'react';
import { Vote } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Panel from '../../common/Panel';

interface VoteItem {
  id: number;
  title: string;
  votes: number;
  total: number;
  hasVoted: boolean;
  endDate: string;
}

const mockVotes: VoteItem[] = [
  { 
    id: 1, 
    title: "Nytt förslag om kommunikationsstrategi", 
    votes: 45, 
    total: 50, 
    hasVoted: false,
    endDate: "2024-04-15" 
  },
  { 
    id: 2, 
    title: "Val av evenemangskommitté", 
    votes: 32, 
    total: 50, 
    hasVoted: true,
    endDate: "2024-04-20" 
  },
];

const ActiveVotes = () => {
  const { t } = useTranslation('common');
  const [votes, setVotes] = useState<VoteItem[]>(mockVotes);
  const [expandedVote, setExpandedVote] = useState<number | null>(null);

  const handleVote = (voteId: number) => {
    setVotes(currentVotes => 
      currentVotes.map(vote => {
        if (vote.id === voteId && !vote.hasVoted) {
          return {
            ...vote,
            votes: vote.votes + 1,
            hasVoted: true
          };
        }
        return vote;
      })
    );
  };

  const handleViewAll = () => {
    console.log('Navigate to all votes page');
  };

  return (
    <Panel 
      title={t('party.dashboard.activeVotes')} 
      icon={Vote}
      onViewAll={handleViewAll}
    >
      <div className="space-y-4">
        {votes.map(vote => (
          <div 
            key={vote.id} 
            className="border-b last:border-0 pb-4 last:pb-0"
          >
            <div 
              className="cursor-pointer"
              onClick={() => setExpandedVote(expandedVote === vote.id ? null : vote.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{vote.title}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {vote.votes}/{vote.total} {t('party.dashboard.votes.title')}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`rounded-full h-2 transition-all duration-300 ${
                    vote.hasVoted ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${(vote.votes / vote.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {expandedVote === vote.id && (
              <div className="mt-3 space-y-3 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('common.endDate')}: {vote.endDate}
                </p>
                {!vote.hasVoted && (
                  <button
                    onClick={() => handleVote(vote.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                  >
                    {t('party.dashboard.votes.voteButton')}
                  </button>
                )}
                {vote.hasVoted && (
                  <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                    {t('party.dashboard.votes.hasVoted')}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default ActiveVotes;
