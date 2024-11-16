import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { 
  ArrowLeft, Edit2, Trash2, Share2, Calendar, 
  MapPin, User, MessageSquare, AlertCircle 
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Meadow } from '@/movement/types/meadow';
import { Card } from '@/shared/components/common/Card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/common/Alert';
import MeadowStatusDisplay from './MeadowStatusDisplay';
import MeadowParticipants from './MeadowParticipants';
import MeadowActivityDisplay from './MeadowActivityDisplay';
import MeadowForm from './MeadowForm';

interface MeadowDetailProps {
  meadow: Meadow;
  onBack: () => void;
  onUpdate: (meadow: Meadow) => Promise<void>;
  onDelete: (meadowId: string) => Promise<void>;
  onJoin: (meadowId: string) => Promise<void>;
  onLeave: (meadowId: string) => Promise<void>;
}

const MeadowDetail: React.FC<MeadowDetailProps> = ({
  meadow,
  onBack,
  onUpdate,
  onDelete,
  onJoin,
  onLeave,
}) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHost = session?.user?.id === meadow.host.id;
  const isParticipant = meadow.participants.some(p => p.id === session?.user?.id);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await onUpdate({ ...data, id: meadow.id });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update meadow');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onDelete(meadow.id);
      onBack(); // Return to meadow list after successful deletion
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete meadow');
      setShowDeleteConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setIsEditing(false)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </button>
        <MeadowForm
          meadow={meadow}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <Alert variant="destructive" className="absolute top-4 right-4 left-4 z-50">
          <AlertTitle>{t('movement.meadows.deleteConfirmTitle')}</AlertTitle>
          <AlertDescription>
            {t('movement.meadows.deleteConfirmMessage', { name: meadow.name })}
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? t('common.deleting') : t('common.delete')}
              </button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main content - remains mostly the same but with updated handlers */}
      <div className="flex justify-between items-start">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </button>
        
        {isHost && (
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Main info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">{meadow.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {meadow.description}
            </p>
            
            <MeadowStatusDisplay
              status={meadow.status}
              dateTime={meadow.dateTime}
              location={meadow.location}
              maxParticipants={meadow.maxParticipants}
              currentParticipants={meadow.currentParticipants}
            />

            {session?.user && (
              <div className="mt-6 flex gap-4">
                {isParticipant ? (
                  <button
                    onClick={() => onLeave(meadow.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    {t('movement.meadows.leave')}
                  </button>
                ) : (
                  <button
                    onClick={() => onJoin(meadow.id)}
                    className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
                    disabled={meadow.maxParticipants && meadow.currentParticipants >= meadow.maxParticipants}
                  >
                    {t('movement.meadows.join')}
                  </button>
                )}
                <button
                  onClick={() => {/* Implement sharing */}}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {t('common.share')}
                </button>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t('movement.meadows.participants')}
            </h2>
            <MeadowParticipants
              participants={meadow.participants}
              maxParticipants={meadow.maxParticipants}
            />
          </Card>
        </div>

        {/* Right column - Activity and details */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t('movement.meadows.host')}
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <div className="font-medium">{meadow.host.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {t('movement.meadows.hostSince', { 
                    date: new Date(meadow.createdAt).toLocaleDateString() 
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t('movement.meadows.activity')}
            </h2>
            <MeadowActivityDisplay
              activities={meadow.activities}
              maxItems={10}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {t('movement.meadows.details')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{t('movement.meadows.created')}: </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {new Date(meadow.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{t('movement.meadows.location')}: </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {meadow.location}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span>{t('movement.meadows.messageCount')}: </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {meadow.activities.filter(a => a.type === 'message').length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeadowDetail;
