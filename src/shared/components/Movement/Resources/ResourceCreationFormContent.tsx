import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { FileText, Upload, X, Plus } from 'lucide-react';
import { ResourceType, AccessLevel, LifeStage } from '@prisma/client';
import Card from '@/shared/components/common/Card';
import { Alert, AlertDescription } from '@/shared/components/common/Alert';
import { fileUploadService } from '@/services/fileUploadService';

interface ResourceFormData {
  title: string;
  description: string;
  type: ResourceType;
  content: Record<string, any>;
  categories: string[];
  stage?: LifeStage;
  access: AccessLevel;
  meadowId?: string;
}

export interface ResourceCreationFormProps {
  onSubmit: (data: ResourceFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ResourceFormData>;
  meadowId?: string;
}

interface FileUpload {
  file: File;
  preview?: string;
  progress: number;
}

interface ResourceContent {
  text?: string;
  files?: FileUpload[];
  url?: string;
  metadata?: Record<string, any>;
}

const ResourceCreationForm: React.FC<ResourceCreationFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  meadowId
}) => {
  const { t } = useTranslation('common');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ResourceFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || ResourceType.DOCUMENT,
    content: initialData?.content || {},
    categories: initialData?.categories || [],
    stage: initialData?.stage,
    access: initialData?.access || AccessLevel.PUBLIC,
    meadowId: meadowId || initialData?.meadowId
  });

  const [newCategory, setNewCategory] = useState('');

  const [content, setContent] = useState<ResourceContent>({
    text: '',
    files: [],
    url: '',
    metadata: {}
  });
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error(t('resources.errors.titleRequired'));
      }
      if (!formData.description.trim()) {
        throw new Error(t('resources.errors.descriptionRequired'));
      }
      if (formData.categories.length === 0) {
        throw new Error(t('resources.errors.categoriesRequired'));
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    try {
      const newFiles: FileUpload[] = await Promise.all(
        files.map(async (file) => {
          let preview: string | undefined;
          
          if (file.type.startsWith('image/')) {
            preview = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
          }

          return {
            file,
            preview,
            progress: 0
          };
        })
      );

      setContent(prev => ({
        ...prev,
        files: [...(prev.files || []), ...newFiles]
      }));

      // Upload files
      const uploadedFiles = await fileUploadService.uploadMultipleFiles(
        files,
        formData.type,
        (fileIndex, progress) => {
          setContent(prev => ({
            ...prev,
            files: prev.files?.map((file, index) =>
              index === fileIndex ? { ...file, progress } : file
            )
          }));
        }
      );

      // Update form data with uploaded file information
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          files: [...(prev.content.files || []), ...uploadedFiles]
        }
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'File upload failed');
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {initialData ? t('resources.edit') : t('resources.create')}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            {t('resources.form.title')}
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">
            {t('resources.form.description')}
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="type">
            {t('resources.form.type')}
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ResourceType }))}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            {Object.values(ResourceType).map((type) => (
              <option key={type} value={type}>
                {t(`resources.types.${type.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('resources.form.categories')}
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.categories.map(category => (
              <span
                key={category}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {category}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(category)}
                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder={t('resources.form.addCategory')}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stage Requirement */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="stage">
            {t('resources.form.stage')}
          </label>
          <select
            id="stage"
            value={formData.stage || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              stage: e.target.value ? e.target.value as LifeStage : undefined 
            }))}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">{t('resources.form.noStageRequirement')}</option>
            {Object.values(LifeStage).map((stage) => (
              <option key={stage} value={stage}>
                {t(`lifestages.${stage.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Access Level */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="access">
            {t('resources.form.access')}
          </label>
          <select
            id="access"
            value={formData.access}
            onChange={(e) => setFormData(prev => ({ ...prev, access: e.target.value as AccessLevel }))}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            {Object.values(AccessLevel).map((level) => (
              <option key={level} value={level}>
                {t(`resources.access.${level.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Content Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('resources.form.content')}
          </label>
          
          {/* URL Input for LINK type */}
          {formData.type === ResourceType.LINK && (
            <input
              type="url"
              value={content.url || ''}
              onChange={(e) => {
                setContent(prev => ({ ...prev, url: e.target.value }));
                setFormData(prev => ({
                  ...prev,
                  content: { ...prev.content, url: e.target.value }
                }));
              }}
              placeholder={t('resources.form.enterUrl')}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 mb-4"
            />
          )}

          {/* Text Content for DOCUMENT type */}
          {formData.type === ResourceType.DOCUMENT && (
            <textarea
              value={content.text || ''}
              onChange={(e) => {
                setContent(prev => ({ ...prev, text: e.target.value }));
                setFormData(prev => ({
                  ...prev,
                  content: { ...prev.content, text: e.target.value }
                }));
              }}
              rows={6}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 mb-4"
              placeholder={t('resources.form.enterContent')}
            />
          )}

          {/* File Upload for MEDIA and other types */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 ${
              dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFiles(Array.from(e.target.files));
                }
              }}
            />
            
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('resources.form.uploadInstructions')}
              </p>
            </label>

            {/* File Preview */}
            {content.files && content.files.length > 0 && (
              <div className="mt-4 space-y-2">
                {content.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      ) : (
                        <FileText className="w-8 h-8 text-gray-400" />
                      )}
                      <span className="text-sm">{file.file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setContent(prev => ({
                          ...prev,
                          files: prev.files?.filter((_, i) => i !== index)
                        }));
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {isSubmitting 
              ? t('common.processing')
              : initialData
                ? t('common.save')
                : t('common.create')
            }
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ResourceCreationFormContent;
