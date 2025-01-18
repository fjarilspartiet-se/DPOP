import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { StatsOverview } from './Dashboard';
import { useSession } from 'next-auth/react';
import WelcomeMeadow from './WelcomeMeadow';
import { LifeStage } from '@prisma/client';
import MeadowsPanel from './Dashboard/MeadowsPanel';
import InitiativesPanel from './Dashboard/InitiativesPanel';
import CommunityPanel from './Dashboard/CommunityPanel';
import JourneyPanel from './Dashboard/JourneyPanel';
import ResourcesPanel from './Dashboard/ResourcesPanel';
import { useWebSocket } from '@/services/websocketService';

const mockStats = {
  activeMeadows: 12,
  activeInitiatives: 24,
  communityMembers: 345,
  completedJourneys: 56
};

const MovementDashboard = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState(mockStats);
  const { subscribe } = useWebSocket(session?.user?.id || '');

  const handleMetricClick = (metric: string) => {
    console.log(`Navigating to /${metric}`);
  };

  useEffect(() => {
    const unsubscribeStats = subscribe('stats', (payload) => {
      setStats(prev => ({
        ...prev,
        ...payload
      }));
    });

    // Subscribe to activity updates
    const unsubscribeActivity = subscribe('activity', (payload) => {
      // Update relevant panels based on activity type
      switch (payload.type) {
        case 'meadow':
          setStats(prev => ({
            ...prev,
            activeMeadows: payload.count
          }));
          break;
        case 'initiative':
          setStats(prev => ({
            ...prev,
            activeInitiatives: payload.count
          }));
          break;
        case 'member':
          setStats(prev => ({
            ...prev,
            communityMembers: payload.count
          }));
          break;
      }
    });

    return () => {
      unsubscribeStats();
      unsubscribeActivity();
    };
  }, [session?.user?.id, subscribe]);

  return (
    <div className="space-y-6">
      {session?.user && (
        <WelcomeMeadow userStage={session.user.lifeStage as LifeStage} />
      )}
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
          <ResourcesPanel />
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
