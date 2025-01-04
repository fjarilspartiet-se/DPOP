import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, Search, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/common/Alert';
import Card from '@/shared/components/common/Card';

interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  resourceCount: number;
  children?: Category[];
}

interface CategoryManagementProps {
  onCategoryUpdate?: (categories: Category[]) => void;
  initialCategories?: Category[];
}

const CategoryManagement = ({ onCategoryUpdate, initialCategories = [] }: CategoryManagementProps) => {
  const { t } = useTranslation('common');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentId: undefined as string | undefined
  });

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      setError(t('resources.categories.errors.nameRequired'));
      return;
    }

    const newCategoryId = crypto.randomUUID();
    const newCategoryItem: Category = {
      id: newCategoryId,
      name: newCategory.name.trim(),
      description: newCategory.description.trim(),
      parentId: newCategory.parentId,
      resourceCount: 0
    };

    const updatedCategories = [...categories, newCategoryItem];
    setCategories(updatedCategories);
    onCategoryUpdate?.(updatedCategories);
    
    setNewCategory({
      name: '',
      description: '',
      parentId: undefined
    });
    setError(null);
  };

  const handleUpdateCategory = (category: Category) => {
    if (!category.name.trim()) {
      setError(t('resources.categories.errors.nameRequired'));
      return;
    }

    const updatedCategories = categories.map(c => 
      c.id === category.id ? category : c
    );
    setCategories(updatedCategories);
    onCategoryUpdate?.(updatedCategories);
    setEditingCategory(null);
    setError(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Check if category has resources
    const category = categories.find(c => c.id === categoryId);
    if (category?.resourceCount > 0) {
      setError(t('resources.categories.errors.hasResources'));
      return;
    }

    // Remove category and update children's parentId
    const updatedCategories = categories
      .filter(c => c.id !== categoryId)
      .map(c => c.parentId === categoryId ? { ...c, parentId: category?.parentId } : c);
    
    setCategories(updatedCategories);
    onCategoryUpdate?.(updatedCategories);
    setError(null);
  };

  const buildCategoryTree = (categories: Category[], parentId?: string): Category[] => {
    return categories
      .filter(category => category.parentId === parentId)
      .map(category => ({
        ...category,
        children: buildCategoryTree(categories, category.id)
      }));
  };

  const renderCategory = (category: Category, level = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const hasChildren = category.children && category.children.length > 0;
    const showInSearch = !searchQuery || 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!showInSearch) return null;

    return (
      <div key={category.id} className="mb-2">
        <div 
          className={`flex items-center p-2 rounded-lg ${
            editingCategory?.id === category.id 
              ? 'bg-blue-50 dark:bg-blue-900/20' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          style={{ marginLeft: `${level * 1.5}rem` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpand(category.id)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          {editingCategory?.id === category.id ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({
                  ...editingCategory,
                  name: e.target.value
                })}
                className="flex-1 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
              <button
                onClick={() => handleUpdateCategory(editingCategory)}
                className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <div className="font-medium">{category.name}</div>
                {category.description && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {category.description}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {category.resourceCount} {t('resources.categories.resources')}
                </span>
                <button
                  onClick={() => setEditingCategory(category)}
                  className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
        {hasChildren && isExpanded && category.children?.map(child =>
          renderCategory(child, level + 1)
        )}
      </div>
    );
  };

  // Build category tree whenever categories change
  const categoryTree = buildCategoryTree(categories);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {t('resources.categories.title')}
          </h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Add new category */}
        <div className="space-y-4 border-b dark:border-gray-700 pb-6">
          <h3 className="font-medium">
            {t('resources.categories.addNew')}
          </h3>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({
                  ...newCategory,
                  name: e.target.value
                })}
                placeholder={t('resources.categories.namePlaceholder')}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({
                  ...newCategory,
                  description: e.target.value
                })}
                placeholder={t('resources.categories.descriptionPlaceholder')}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <select
                value={newCategory.parentId || ''}
                onChange={(e) => setNewCategory({
                  ...newCategory,
                  parentId: e.target.value || undefined
                })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">
                  {t('resources.categories.noParent')}
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('resources.categories.add')}
            </button>
          </div>
        </div>

        {/* Category list */}
        <div className="space-y-4">
          <h3 className="font-medium">
            {t('resources.categories.existing')}
          </h3>
          <div className="space-y-2">
            {categoryTree.map(category => renderCategory(category))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CategoryManagement;
