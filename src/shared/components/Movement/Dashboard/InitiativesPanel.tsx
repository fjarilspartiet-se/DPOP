import React, { useState } from 'react';
import { Lightbulb, ThumbsUp, MessageCircle, Users, Sprout } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Panel from '../../common/Panel';

interface Initiative {
  id: number;
  title: string;
  description: string;
  creator: string;
  stage: 'seed' | 'growing' | 'blooming';
  supporters: number;
  participants: number;
  comments: number;
  tags: string[];
  isSupporting: boolean;
}

const mockInitiatives: Initiative[] = [
  {
    id: 1,
    title: "Grannskapsodling i Södermalm",
    description: "Ett initiativ för att skapa gemensamma odlingsytor i vårt område och dela kunskap om stadsodling.",
    creator: "Anna Svensson",
    stage: 'growing',
    supporters: 45,
    participants: 12,
    comments: 23,
    tags: ['hållbarhet', 'gemenskap', 'lokal'],
    isSupporting: true
  },
  {
    id: 2,
    title: "Digital demokratiplatform",
    description: "Utveckling av verktyg för bättre lokal demokrati och deltagande i beslutsprocesser.",
    creator: "Erik Andersson",
    stage: 'seed',
    supporters: 28,
    participants: 8,
    comments: 15,
    tags: ['demokrati', 'teknik', 'deltagande'],
    isSupporting: false
  }
];

const stageIcons = {
  seed: 'Frö',
  growing: 'Växande',
  blooming: 'Blomstrande'
};

const InitiativesPanel = () => {
  const { t } = useTranslation('common');
  const [initiatives, setInitiatives] = useState<Initiative[]>(mockInitiatives);
  const [expandedInitiative, setExpandedInitiative] = useState<number | null>(null);

  const handleSupport = (initiativeId: number) => {
    setInitiatives(currentInitiatives =>
      currentInitiatives.map(initiative => {
        if (initiative.id === initiativeId) {
          return {
            ...initiative,
            supporters: initiative.isSupporting ? initiative.supporters - 1 : initiative.supporters + 1,
            isSupporting: !initiative.isSupporting
          };
        }
        return initiative;
      })
    );
  };

  const handleViewAll = () => {
    console.log('Navigate to all initiatives');
  };

  return (
    <Panel 
      title={t('movement.dashboard.initiativesTitle')} 
      icon={Lightbulb}
      onViewAll={handleViewAll}
    >
      <div className="space-y-4">
        {initiatives.map(initiative => (
          <div 
            key={initiative.id} 
            className={`border-l-4 ${
              initiative.stage === 'blooming' ? 'border-green-500' :
              initiative.stage === 'growing' ? 'border-yellow-500' :
              'border-blue-500'
            } pl-4 pb-4 last:pb-0`}
          >
            <div 
              className="cursor-pointer"
              onClick={() => setExpandedInitiative(expandedInitiative === initiative.id ? null : initiative.id)}
            >
              <h3 className="font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors">
                {initiative.title}
              </h3>
              <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                  <Sprout className="w-4 h-4 mr-1" />
                  {stageIcons[initiative.stage]}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {initiative.participants}
                </span>
              </div>
            </div>

            {expandedInitiative === initiative.id && (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {initiative.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {initiative.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSupport(initiative.id);
                      }}
                      className={`flex items-center space-x-1 text-sm ${
                        initiative.isSupporting 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-600 dark:text-gray-300'
                      } hover:text-green-600 dark:hover:text-green-400 transition-colors`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{initiative.supporters}</span>
                    </button>
                    <button
                      className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{initiative.comments}</span>
                    </button>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {initiative.creator}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default InitiativesPanel;
