// src/party/components/Proposals/ProposalForm.tsx

import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { X } from 'lucide-react';
import { VoteType } from '@prisma/client';
import { Alert, AlertDescription } from '@/shared/components/common/Alert';

interface ProposalFormData {
  title: string;
  description: string;
  content: Record<string, any>;
  voteType: VoteType;
  startDate?: string;
  endDate?: string;
  quorum?: number;
  threshold?: number;
}

interface ProposalFormProps {
  initialData?: Partial<ProposalFormData>;
  onSubmit: (data: ProposalFormData) => Promise<void>;
  onCancel: () => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { t } = useTranslation('common');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProposalFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || {},
    voteType: initialData?.voteType || VoteType.SIMPLE,
    startDate: initialData?.startDate,
    endDate: initialData?.endDate,
    quorum: initialData?.quorum,
    threshold: initialData?.threshold
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error(t('party.proposals.errors.titleRequired'));
      }
      if (!formData.description.trim()) {
        throw new Error(t('party.proposals.errors.descriptionRequired'));
      }

      // Validate dates if provided
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end <= start) {
          throw new Error(t('party.proposals.errors.invalidDates'));
        }
      }

      // Validate voting parameters
      if (formData.quorum !== undefined && formData.quorum < 1) {
        throw new Error(t('party.proposals.errors.invalidQuorum'));
      }
      if (formData.threshold !== undefined && (formData.threshold < 0 || formData.threshold > 100)) {
        throw new Error(t('party.proposals.errors.invalidThreshold'));
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {initialData ? t('party.proposals.edit') : t('party.proposals.create')}
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
            {t('party.proposals.form.title')}
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
            {t('party.proposals.form.description')}
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

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="content">
            {t('party.proposals.form.content')}
          </label>
          <textarea
            id="content"
            value={formData.content.text || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: { ...prev.content, text: e.target.value }
            }))}
            rows={6}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        {/* Vote Type */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="voteType">
            {t('party.proposals.form.voteType')}
          </label>
          <select
            id="voteType"
            value={formData.voteType}
            onChange={(e) => setFormData(prev => ({ ...prev, voteType: e.target.value as VoteType }))}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          >
            {Object.values(VoteType).map((type) => (
              <option key={type} value={type}>
                {t(`party.proposals.voteTypes.${type.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Voting Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="startDate">
              {t('party.proposals.form.startDate')}
            </label>
            <input
              type="datetime-local"
              id="startDate"
              value={formData.startDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="endDate">
              {t('party.proposals.form.endDate')}
            </label>
            <input
              type="datetime-local"
              id="endDate"
              value={formData.endDate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Voting Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="quorum">
              {t('party.proposals.form.quorum')}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                ({t('party.proposals.form.optional')})
              </span>
            </label>
            <input
              type="number"
              id="quorum"
              min="1"
              value={formData.quorum || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                quorum: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              placeholder={t('party.proposals.form.quorumPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="threshold">
              {t('party.proposals.form.threshold')}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                ({t('party.proposals.form.optional')})
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="threshold"
                min="0"
                max="100"
                value={formData.threshold || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  threshold: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                placeholder={t('party.proposals.form.thresholdPlaceholder')}
              />
              <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400">%</span>
            </div>
          </div>
        </div>

        {/* Vote Type Specific Settings */}
        {formData.voteType === VoteType.RANKED && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('party.proposals.form.rankingOptions')}
            </label>
            <div className="space-y-2">
              {formData.content.options?.map((option: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(formData.content.options || [])];
                      newOptions[index] = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        content: { ...prev.content, options: newOptions }
                      }));
                    }}
                    className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    placeholder={t('party.proposals.form.optionPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = [...(formData.content.options || [])];
                      newOptions.splice(index, 1);
                      setFormData(prev => ({
                        ...prev,
                        content: { ...prev.content, options: newOptions }
                      }));
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newOptions = [...(formData.content.options || []), ''];
                  setFormData(prev => ({
                    ...prev,
                    content: { ...prev.content, options: newOptions }
                  }));
                }}
                className="w-full p-2 border border-dashed rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                {t('party.proposals.form.addOption')}
              </button>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting 
              ? t('common.submitting')
              : initialData
                ? t('common.save')
                : t('common.create')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;
