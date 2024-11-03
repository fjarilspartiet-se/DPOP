import React from 'react';
import { Users, FileText, Calendar } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import MetricCard from '../../common/MetricCard';

interface StatsOverviewProps {
  stats: {
    activeMembers: number;
    activeProposals: number;
    upcomingEvents: number;
  };
  onMetricClick: (metric: string) => void;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, onMetricClick }) => {
  const { t } = useTranslation('common');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        icon={Users}
        label={t('party.dashboard.activeMembers')}
        value={stats.activeMembers}
        color="blue"
        onClick={() => onMetricClick('members')}
      />
      <MetricCard
        icon={FileText}
        label={t('party.dashboard.activeProposals')}
        value={stats.activeProposals}
        color="green"
        onClick={() => onMetricClick('proposals')}
      />
      <MetricCard
        icon={Calendar}
        label={t('party.dashboard.upcomingEvents')}
        value={stats.upcomingEvents}
        color="purple"
        onClick={() => onMetricClick('events')}
      />
    </div>
  );
};

export default StatsOverview;
