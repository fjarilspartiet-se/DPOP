import React, { useState } from 'react';
import { FileText, ThumbsUp, MessageCircle } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Panel from '../../common/Panel';

interface Proposal {
  id: number;
  title: string;
  author: string;
  date: string;
  summary: string;
  likes: number;
  comments: number;
  hasLiked: boolean;
}

const mockProposals: Proposal[] = [
  {
    id: 1,
    title: "Digital demokratiutveckling",
    author: "Anna Svensson",
    date: "2024-03-15",
    summary: "Ett förslag om att utveckla vår digitala demokratiplattform för att öka medlemmarnas engagemang och deltagande i beslutsprocesser.",
    likes: 24,
    comments: 8,
    hasLiked: false
  },
  {
    id: 2,
    title: "Hållbarhetsinitiativ",
    author: "Erik Andersson",
    date: "2024-03-14",
    summary: "Förslag på konkreta åtgärder för att minska vårt klimatavtryck och främja hållbara praktiker inom partiet.",
    likes: 31,
    comments: 12,
    hasLiked: true
  }
];

const ProposalsPanel = () => {
  const { t } = useTranslation('common');
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [expandedProposal, setExpandedProposal] = useState<number | null>(null);

  const handleLike = (proposalId: number) => {
    setProposals(currentProposals =>
      currentProposals.map(proposal => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            likes: proposal.hasLiked ? proposal.likes - 1 : proposal.likes + 1,
            hasLiked: !proposal.hasLiked
          };
        }
        return proposal;
      })
    );
  };

  const handleViewAll = () => {
    console.log('Navigate to all proposals');
  };

  return (
    <Panel 
      title={t('party.dashboard.recentProposals')} 
      icon={FileText}
      onViewAll={handleViewAll}
    >
      <div className="space-y-4">
        {proposals.map(proposal => (
          <div 
            key={proposal.id} 
            className="border-b last:border-0 pb-4 last:pb-0"
          >
            <div 
              className="cursor-pointer"
              onClick={() => setExpandedProposal(expandedProposal === proposal.id ? null : proposal.id)}
            >
              <h3 className="font-medium mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {proposal.title}
              </h3>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>{proposal.author}</span>
                <span>{proposal.date}</span>
              </div>
            </div>

            {expandedProposal === proposal.id && (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                  {proposal.summary}
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(proposal.id);
                    }}
                    className={`flex items-center space-x-1 text-sm ${
                      proposal.hasLiked 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-300'
                    } hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{proposal.likes}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Open comments');
                    }}
                    className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{proposal.comments}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default ProposalsPanel;
