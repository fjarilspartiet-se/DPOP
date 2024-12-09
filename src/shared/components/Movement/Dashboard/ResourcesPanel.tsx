// src/shared/components/Movement/Dashboard/ResourcesPanel.tsx

import React from 'react';
import { useTranslation } from 'next-i18next';
import { Book, FileText, ExternalLink } from 'lucide-react';
import Panel from '../../common/Panel';
import { ResourceType } from '@prisma/client';

interface RecentResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  views: number;
  author: {
    name: string;
  };
}

const ResourcesPanel = () => {
  const { t } = useTranslation('common');
  const [resources, setResources] = React.useState<RecentResource[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/movement/resources?limit=5');
        if (response.ok) {
          const data = await response.json();
          setResources(data);
        }
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleViewAll = () => {
    window.location.href = '/movement/resources';
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <Panel 
      title={t('movement.dashboard.resourcesTitle')} 
      icon={Book}
      onViewAll={handleViewAll}
    >
      <div className="space-y-4">
        {resources.map(resource => (
          <div
            key={resource.id}
            className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {resource.type === ResourceType.DOCUMENT && (
                    <FileText className="w-4 h-4" />
                  )}
                  {resource.type === ResourceType.LINK && (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {resource.description}
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {t('common.by')} {resource.author.name}
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {resource.views} {t('common.views')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default ResourcesPanel;
