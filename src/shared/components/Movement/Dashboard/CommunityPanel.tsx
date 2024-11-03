import React, { useState } from 'react';
import { Users, Star, Heart, Activity, Sparkles } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Panel from '../../common/Panel';

interface CommunityMember {
  id: number;
  name: string;
  stage: 'egg' | 'larvae' | 'pupa' | 'butterfly';
  recentActivity: string;
  contributions: number;
  specialties: string[];
  isFollowing: boolean;
  lastActive: string;
}

const mockMembers: CommunityMember[] = [
  {
    id: 1,
    name: "Maria Johansson",
    stage: 'butterfly',
    recentActivity: "Startade initiativet 'Digital Demokrati'",
    contributions: 45,
    specialties: ["facilitering", "digital demokrati", "hållbarhet"],
    isFollowing: true,
    lastActive: "2024-04-10"
  },
  {
    id: 2,
    name: "Johan Andersson",
    stage: 'larvae',
    recentActivity: "Deltog i ängssamling i Vasaparken",
    contributions: 12,
    specialties: ["stadsodling", "gemenskap"],
    isFollowing: false,
    lastActive: "2024-04-11"
  },
  {
    id: 3,
    name: "Lisa Berg",
    stage: 'pupa',
    recentActivity: "Bidrog till hållbarhetsinitiativet",
    contributions: 28,
    specialties: ["miljö", "utbildning"],
    isFollowing: false,
    lastActive: "2024-04-12"
  }
];

const stageIcons = {
  egg: '🥚',
  larvae: '🐛',
  pupa: '🐚',
  butterfly: '🦋'
};

const CommunityPanel = () => {
  const { t } = useTranslation('common');
  const [members, setMembers] = useState<CommunityMember[]>(mockMembers);
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  const handleFollow = (memberId: number) => {
    setMembers(currentMembers =>
      currentMembers.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            isFollowing: !member.isFollowing
          };
        }
        return member;
      })
    );
  };

  const handleViewAll = () => {
    console.log('Navigate to community page');
  };

  return (
    <Panel 
      title={t('movement.dashboard.communityTitle')} 
      icon={Users}
      onViewAll={handleViewAll}
    >
      <div className="space-y-4">
        {members.map(member => (
          <div 
            key={member.id} 
            className="border-b last:border-0 pb-4 last:pb-0"
          >
            <div 
              className="cursor-pointer"
              onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl" role="img" aria-label={member.stage}>
                      {stageIcons[member.stage]}
                    </span>
                    <h3 className="font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      {member.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {member.recentActivity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Star className="w-4 h-4 mr-1" />
                    {member.contributions}
                  </span>
                </div>
              </div>
            </div>

            {expandedMember === member.id && (
              <div className="mt-3 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map(specialty => (
                    <span 
                      key={specialty}
                      className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('movement.dashboard.lastActive')}: {member.lastActive}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(member.id);
                    }}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      member.isFollowing
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {member.isFollowing ? t('movement.dashboard.following') : t('movement.dashboard.follow')}
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

export default CommunityPanel;
