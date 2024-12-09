import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Book, Search, Tags, Filter, Plus, Share2, Eye } from 'lucide-react';
import Card from '@/shared/components/common/Card';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'link' | 'media' | 'template';
  categories: string[];
  stage?: 'EGG' | 'LARVAE' | 'PUPA' | 'BUTTERFLY';
  author: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  views: number;
  shares: number;
}

interface ResourceLibraryProps {
  onResourceCreate?: () => void;
  onResourceView?: (resourceId: string) => void;
  onResourceShare?: (resourceId: string) => void;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Guide till ängssamlingar',
    description: 'En omfattande guide för att organisera och facilitera ängssamlingar.',
    type: 'document',
    categories: ['guider', 'äng', 'facilitering'],
    stage: 'LARVAE',
    author: {
      id: 'author1',
      name: 'Maria Svensson'
    },
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    views: 145,
    shares: 23
  },
  {
    id: '2',
    title: 'Mall för projektplanering',
    description: 'En användbar mall för att planera och strukturera lokala initiativ.',
    type: 'template',
    categories: ['mallar', 'projekt', 'planering'],
    author: {
      id: 'author2',
      name: 'Erik Andersson'
    },
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
    views: 89,
    shares: 12
  }
];

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({
  onResourceCreate,
  onResourceView,
  onResourceShare
}) => {
  const { t } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Get unique categories from resources
  const allCategories = Array.from(
    new Set(mockResources.flatMap(resource => resource.categories))
  );

  // Filter resources based on search and filters
  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategories = selectedCategories.length === 0 ||
      selectedCategories.some(cat => resource.categories.includes(cat));

    const matchesType = !selectedType || resource.type === selectedType;

    return matchesSearch && matchesCategories && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return Book;
      case 'template':
        return File;
      case 'media':
        return Image;
      default:
        return Link;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Book className="w-6 h-6" />
          {t('resources.title')}
        </h2>
        <button
          onClick={onResourceCreate}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('resources.create')}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Tags className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <select
            multiple
            value={selectedCategories}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedCategories(values);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            {allCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <select
            value={selectedType || ''}
            onChange={(e) => setSelectedType(e.target.value || null)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">{t('resources.allTypes')}</option>
            <option value="document">{t('resources.types.document')}</option>
            <option value="template">{t('resources.types.template')}</option>
            <option value="media">{t('resources.types.media')}</option>
            <option value="link">{t('resources.types.link')}</option>
          </select>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => {
          const TypeIcon = getTypeIcon(resource.type);
          return (
            <Card key={resource.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <TypeIcon className="w-5 h-5 text-gray-500" />
                    <h3 className="font-medium">{resource.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {resource.description}
                  </p>
                </div>
                {resource.stage && (
                  <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                    {t(`stages.${resource.stage.toLowerCase()}`)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {resource.categories.map(category => (
                  <span
                    key={category}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center mr-4">
                    <Eye className="w-4 h-4 mr-1" />
                    {resource.views}
                  </div>
                  <div className="flex items-center">
                    <Share2 className="w-4 h-4 mr-1" />
                    {resource.shares}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onResourceView?.(resource.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onResourceShare?.(resource.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceLibrary;
