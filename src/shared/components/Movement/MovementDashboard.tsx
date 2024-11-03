import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { StatsOverview } from './Dashboard';
import MeadowsPanel from './Dashboard/MeadowsPanel';
import InitiativesPanel from './Dashboard/InitiativesPanel';
import CommunityPanel from './Dashboard/CommunityPanel';
import JourneyPanel from './Dashboard/JourneyPanel';

const mockStats = {
  activeMeadows: 12,
  activeInitiatives: 24,
  communityMembers: 345,
  completedJourneys: 56
};

const MovementDashboard = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleMetricClick = (metric: string) => {
    console.log(`Navigating to /${metric}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{t('movement.dashboard.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('movement.dashboard.welcome')}
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview 
        stats={mockStats}
        onMetricClick={handleMetricClick}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <MeadowsPanel />
          <InitiativesPanel />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <CommunityPanel />
          <JourneyPanel />
        </div>
      </div>
    </div>
  );
};

export default MovementDashboard;
