import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';
import Card from './Card';

interface PanelProps {
  title: string;
  icon: LucideIcon;
  onViewAll?: () => void;
  children: React.ReactNode;
}

const Panel = ({ title, icon: Icon, onViewAll, children }: PanelProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Icon className="w-5 h-5 mr-2" />
          {title}
        </h2>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-blue-600 dark:text-blue-400 text-sm flex items-center hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Visa alla
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
      {children}
    </Card>
  );
};

export default Panel;
