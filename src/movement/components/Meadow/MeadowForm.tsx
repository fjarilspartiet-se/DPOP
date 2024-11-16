import React from 'react';
import { useTranslation } from 'next-i18next';
import { MeadowType, MeadowStatus } from '@prisma/client';
import { Card } from '@/shared/components/common/Card';
import { X } from 'lucide-react';

interface MeadowFormProps {
  meadow?: {
    id?: string;
    name: string;
    description: string;
    type: MeadowType;
    status: MeadowStatus;
    location: string;
    dateTime?: Date;
    maxParticipants?: number;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const MeadowForm: React.FC<MeadowFormProps> = ({
  meadow,
  onSubmit,
  onCancel
}) => {
  const { t } = useTranslation('common');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        type: formData.get('type'),
        status: formData.get('status'),
        location: formData.get('location'),
        dateTime: formData.get('dateTime'),
        maxParticipants: formData.get('maxParticipants'),
      };
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting meadow:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          {meadow ? t('movement.meadows.edit') : t('movement.meadows.create')}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            {t('movement.meadows.form.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={meadow?.name}
            required
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">
            {t('movement.meadows.form.description')}
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={meadow?.description}
            rows={3}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="type">
              {t('movement.meadows.form.type')}
            </label>
            <select
              id="type"
              name="type"
              defaultValue={meadow?.type || 'GATHERING'}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="GATHERING">{t('movement.meadows.types.gathering')}</option>
              <option value="WORKSHOP">{t('movement.meadows.types.workshop')}</option>
              <option value="DISCUSSION">{t('movement.meadows.types.discussion')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="status">
              {t('movement.meadows.form.status')}
            </label>
            <select
              id="status"
              name="status"
              defaultValue={meadow?.status || 'PLANNED'}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="PLANNED">{t('movement.meadows.status.planned')}</option>
              <option value="ACTIVE">{t('movement.meadows.status.active')}</option>
              <option value="COMPLETED">{t('movement.meadows.status.completed')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="location">
            {t('movement.meadows.form.location')}
          </label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={meadow?.location}
            required
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="dateTime">
              {t('movement.meadows.form.dateTime')}
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              defaultValue={meadow?.dateTime?.toISOString().slice(0, 16)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="maxParticipants">
              {t('movement.meadows.form.maxParticipants')}
            </label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              defaultValue={meadow?.maxParticipants}
              min="1"
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {isProcessing 
              ? t('common.processing')
              : meadow
                ? t('common.save')
                : t('common.create')
            }
          </button>
        </div>
      </form>
    </Card>
  );
};

export default MeadowForm;

