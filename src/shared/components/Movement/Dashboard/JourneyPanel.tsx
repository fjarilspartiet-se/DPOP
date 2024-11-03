import React, { useState } from 'react';
import { Sparkles, Award, Target, Flag, ArrowRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Panel from '../../common/Panel';

interface Achievement {
  id: number;
  title: string;
  description: string;
  type: 'personal' | 'collective';
  status: 'completed' | 'in-progress';
  progress: number;
  completedDate?: string;
  nextMilestone?: string;
}

const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: "Från ägg till fjäril",
    description: "Din personliga transformationsresa genom rörelsens stadier.",
    type: 'personal',
    status: 'in-progress',
    progress: 75,
    nextMilestone: "Puppa → Fjäril"
  },
  {
    id: 2,
    title: "Gemenskapens växtkraft",
    description: "Kollektiv framgång i att skapa hållbara lokala initiativ.",
    type: 'collective',
    status: 'in-progress',
    progress: 60,
    nextMilestone: "10 aktiva initiativ"
  },
  {
    id: 3,
    title: "Första ängssamlingen",
    description: "Deltog i din första ängssamling.",
    type: 'personal',
    status: 'completed',
    progress: 100,
    completedDate: "2024-03-15"
  }
];

const JourneyPanel = () => {
  const { t } = useTranslation('common');
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [expandedAchievement, setExpandedAchievement] = useState<number | null>(null);

  const handleViewAll = () => {
    console.log('Navigate to journey page');
  };

  return (
    <Panel 
      title={t('movement.dashboard.journeyTitle')} 
      icon={Sparkles}
      onViewAll={handleViewAll}
    >
      <div className="space-y-4">
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`border-l-4 ${
              achievement.type === 'personal' 
                ? 'border-purple-500' 
                : 'border-green-500'
            } pl-4 pb-4 last:pb-0`}
          >
            <div 
              className="cursor-pointer"
              onClick={() => setExpandedAchievement(expandedAchievement === achievement.id ? null : achievement.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center">
                    {achievement.status === 'completed' && (
                      <Award className="w-4 h-4 mr-2 text-yellow-500" />
                    )}
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {achievement.description}
                  </p>
                </div>
                {achievement.status === 'in-progress' && (
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {achievement.progress}%
                  </span>
                )}
              </div>
            </div>

            {expandedAchievement === achievement.id && (
              <div className="mt-3 space-y-3">
                {achievement.status === 'in-progress' && (
                  <>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Target className="w-4 h-4 mr-1" />
                      <span>Nästa milstolpe: {achievement.nextMilestone}</span>
                    </div>
                  </>
                )}
                {achievement.status === 'completed' && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Flag className="w-4 h-4 mr-1" />
                    <span>Uppnått: {achievement.completedDate}</span>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`View details for achievement ${achievement.id}`);
                  }}
                  className="flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                >
                  {t('movement.dashboard.viewDetails')}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default JourneyPanel;
