// src/shared/components/Movement/Community/MemberDirectory.tsx
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { 
  Search, 
  Users, 
  Filter,
  MessageCircle,
  User,
  Star,
  Clock,
  MapPin
} from 'lucide-react';
import { LifeStage } from '@prisma/client';
import Card from '@/shared/components/common/Card';
import { Alert, AlertDescription } from '@/shared/components/common/Alert';

interface Member {
  id: string;
  name: string;
  location?: string;
  stage: LifeStage;
  joinDate: Date;
  lastActive: Date;
  contributions: number;
  specialties: string[];
  isFollowing: boolean;
  recentActivity?: {
    type: 'meadow' | 'initiative' | 'contribution';
    description: string;
    date: Date;
  };
}

interface MemberDirectoryProps {
  onMessage?: (memberId: string) => void;
  onFollow?: (memberId: string) => void;
  onViewProfile?: (memberId: string) => void;
}

const stageIcons = {
  FLOWER: '🌸',
  EGG: '🥚',
  LARVAE: '🐛',
  PUPA: '🐚',
  BUTTERFLY: '🦋'
};

// Mock data - replace with API call in production
const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Maria Andersson',
    location: 'Stockholm',
    stage: 'BUTTERFLY',
    joinDate: new Date('2024-01-15'),
    lastActive: new Date('2024-04-12'),
    contributions: 45,
    specialties: ['facilitering', 'digital demokrati', 'hållbarhet'],
    isFollowing: false,
    recentActivity: {
      type: 'initiative',
      description: 'Startade initiativet "Digital Demokrati"',
      date: new Date('2024-04-10')
    }
  },
  // Add more mock members...
];

const MemberDirectory: React.FC<MemberDirectoryProps> = ({
  onMessage,
  onFollow,
  onViewProfile
}) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<LifeStage | ''>('');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter members based on search and stage
  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchQuery || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStage = !selectedStage || member.stage === selectedStage;

    return matchesSearch && matchesStage;
  });

  const handleFollow = async (memberId: string) => {
    try {
      if (onFollow) {
        await onFollow(memberId);
        // Update local state
        setMembers(currentMembers =>
          currentMembers.map(member =>
            member.id === memberId
              ? { ...member, isFollowing: !member.isFollowing }
              : member
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update following status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          {t('community.memberDirectory')}
        </h2>
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
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as LifeStage | '')}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">{t('community.allStages')}</option>
            {Object.keys(stageIcons).map((stage) => (
              <option key={stage} value={stage}>
                {t(`lifestages.${stage.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Member Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <Card key={member.id} className="p-6">
            <div className="space-y-4">
              {/* Member Header */}
              <div className="flex justify-between items-start">
                <div 
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => onViewProfile?.(member.id)}
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xl">
                    {stageIcons[member.stage]}
                  </div>
                  <div>
                    <h3 className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    {member.location && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {member.location}
                      </div>
                    )}
                  </div>
                </div>
                <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Star className="w-4 h-4 mr-1" />
                  {member.contributions}
                </span>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2">
                {member.specialties.map(specialty => (
                  <span
                    key={specialty}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Recent Activity */}
              {member.recentActivity && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p>{member.recentActivity.description}</p>
                  <span className="flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(member.recentActivity.date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {t('community.memberSince')}: {new Date(member.joinDate).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  {onMessage && (
                    <button
                      onClick={() => onMessage(member.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}
                  {onFollow && member.id !== session?.user?.id && (
                    <button
                      onClick={() => handleFollow(member.id)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        member.isFollowing
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {member.isFollowing ? t('common.following') : t('common.follow')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {t('community.noMembersFound')}
        </div>
      )}
    </div>
  );
};

export default MemberDirectory;
