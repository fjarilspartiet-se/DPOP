import dynamic from 'next/dynamic';
import React from 'react';
import type { ResourceCreationFormProps } from './ResourceCreationFormContent';

const ResourceCreationFormContent = dynamic(
  () => import('./ResourceCreationFormContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
);

const ResourceCreationForm: React.FC<ResourceCreationFormProps> = (props) => {
  return <ResourceCreationFormContent {...props} />;
};

export default ResourceCreationForm;
