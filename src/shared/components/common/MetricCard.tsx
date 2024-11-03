import React from 'react';
import { LucideIcon } from 'lucide-react';
import Card from './Card';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  onClick?: () => void;
}

const colorClasses = {
  blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
  green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
  purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
  yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
};

const MetricCard = ({ icon: Icon, label, value, color, onClick }: MetricCardProps) => {
  return (
    <Card className={`transition-transform hover:scale-102 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
