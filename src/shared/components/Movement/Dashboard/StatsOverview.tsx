import React from 'react';
import { Flower2, Lightbulb, Users, Sparkles } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import MetricCard from '../../common/MetricCard';

interface StatsOverviewProps {
  stats: {
    activeMeadows: number;
    activeInitiatives: number;
    communityMembers: number;
    completedJourneys: number;
  };
  onMetricClick: (metric: string) => void;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, onMetricClick }) => {
  const { t } = useTranslation('common');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        icon={Flower2}
        label={t('movement.dashboard.activeMeadows')}
        value={stats.activeMeadows}
        color="green"
        onClick={() => onMetricClick('meadows')}
      />
      <MetricCard
        icon={Lightbulb}
        label={t('movement.dashboard.activeInitiatives')}
        value={stats.activeInitiatives}
        color="yellow"
        onClick={() => onMetricClick('initiatives')}
      />
      <MetricCard
        icon={Users}
        label={t('movement.dashboard.communityMembers')}
        value={stats.communityMembers}
        color="purple"
        onClick={() => onMetricClick('community')}
      />
      <MetricCard
        icon={Sparkles}
        label={t('movement.dashboard.completedJourneys')}
        value={stats.completedJourneys}
        color="blue"
        onClick={() => onMetricClick('journeys')}
      />
    </div>
  );
};

export default StatsOverview;
