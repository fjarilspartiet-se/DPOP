import React from 'react';
import { useTranslation } from 'next-i18next';
import { Book, Sprout } from 'lucide-react';
import Card from '../common/Card';
import { LifeStage } from '@prisma/client';

interface WelcomeMeadowProps {
  userStage?: LifeStage | null;
}

const WelcomeMeadow: React.FC<WelcomeMeadowProps> = ({ userStage = 'EGG' }) => {
  const { t } = useTranslation('common');

  const isCurrentStage = (stage: string) => {
    if (!userStage) return false;
    return stage.toUpperCase() === userStage;
  };

  const stages: Array<keyof typeof LifeStage> = ['EGG', 'LARVAE', 'PUPA', 'BUTTERFLY'];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">{t('meadow.welcome.name')}</h1>
        <p className="text-gray-600 dark:text-gray-300">{t('meadow.welcome.description')}</p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Getting Started Guide */}
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Book className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">
                {t('meadow.welcome.resources.gettingStarted.title')}
              </h2>
            </div>
            <div className="space-y-4">
              {['welcome', 'firstSteps', 'nextSteps'].map((section) => (
                <div key={section}>
                  <h3 className="font-medium mb-1">
                    {t(`meadow.welcome.resources.gettingStarted.sections.${section}.title`)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t(`meadow.welcome.resources.gettingStarted.sections.${section}.content`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Butterfly Effect */}
        <Card>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Sprout className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">
                {t('meadow.welcome.resources.butterflyEffect.title')}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('meadow.welcome.resources.butterflyEffect.introduction')}
            </p>
            <div className="space-y-4">
              {stages.map((stage) => (
                <div
                  key={stage}
                  className={`p-3 rounded-lg ${
                    isCurrentStage(stage)
                      ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">
                      {t(`lifestages.${stage.toLowerCase()}`)}:{' '}
                    </span>
                    {t(`meadow.welcome.resources.butterflyEffect.stages.${stage.toLowerCase()}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeMeadow;
