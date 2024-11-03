import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { 
  StatsOverview,
  ActiveVotes,
  ProposalsPanel,
  EventsPanel,
  AlertsPanel,
} from './Dashboard';

const mockStats = {
  activeMembers: 156,
  activeProposals: 8,
  upcomingEvents: 3,
};

const PartyDashboard = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleMetricClick = (metric: string) => {
    console.log(`Navigating to /${metric}`);
    // router.push(`/${metric}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{t('party.dashboard.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('party.dashboard.welcome')}
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview 
        stats={mockStats}
        onMetricClick={handleMetricClick}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ActiveVotes />
          <EventsPanel />
        </div>
        <div className="space-y-6">
          <ProposalsPanel />
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
};

export default PartyDashboard;
