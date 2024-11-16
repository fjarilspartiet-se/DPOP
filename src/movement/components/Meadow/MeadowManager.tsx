import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { Flower2, Plus, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { MeadowType, MeadowStatus } from '@prisma/client';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/common/Alert';
import { Card } from '@/shared/components/common/Card';
import { useMeadows } from '@/movement/hooks/useMeadows';
import MeadowForm from './MeadowForm';
import MeadowActivityDisplay from './MeadowActivityDisplay';
import MeadowParticipants from './MeadowParticipants';
import MeadowStatusDisplay from './MeadowStatusDisplay';

interface MeadowManagerProps {
  onSelectMeadow: (meadow: Meadow) => void;
}

const MeadowManager = ({ onSelectMeadow }: MeadowManagerProps) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const { 
    isLoading, 
    error, 
    fetchMeadows, 
    createMeadow, 
    updateMeadow, 
    deleteMeadow,
    joinMeadow,
    leaveMeadow 
  } = useMeadows();

  const [meadows, setMeadows] = useState([]);
  const [selectedMeadow, setSelectedMeadow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMeadows();
  }, []);

  const loadMeadows = async () => {
    const fetchedMeadows = await fetchMeadows({
      search: searchQuery,
    });
    setMeadows(fetchedMeadows);
  };

  const handleCreateMeadow = async (data) => {
    const newMeadow = await createMeadow(data);
    if (newMeadow) {
      setMeadows([...meadows, newMeadow]);
      setIsCreating(false);
    }
  };

  const handleUpdateMeadow = async (data) => {
    const updatedMeadow = await updateMeadow(data);
    if (updatedMeadow) {
      setMeadows(meadows.map(m => m.id === updatedMeadow.id ? updatedMeadow : m));
      setSelectedMeadow(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedMeadow) {
      const success = await deleteMeadow(selectedMeadow.id);
      if (success) {
        setMeadows(meadows.filter(m => m.id !== selectedMeadow.id));
        setSelectedMeadow(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  const handleJoinMeadow = async (meadowId) => {
    const success = await joinMeadow(meadowId);
    if (success) {
      loadMeadows(); // Reload to get updated participant count
    }
  };

  const handleLeaveMeadow = async (meadowId) => {
    const success = await leaveMeadow(meadowId);
    if (success) {
      loadMeadows(); // Reload to get updated participant count
    }
  };

  // Add click handler for meadow cards
  const handleMeadowClick = (meadow: Meadow) => {
    onSelectMeadow(meadow);
  };

  return (
    <div className="space-y-6">
      {/* Header with search and create */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Flower2 className="w-6 h-6" />
          {t('movement.meadows.title')}
        </h2>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('movement.meadows.create')}
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </div>
      )}

      {/* Meadow grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {meadows.map(meadow => (
          <Card 
            key={meadow.id} 
            className="p-6 space-y-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleMeadowClick(meadow)}
          >
            {/* Meadow header */}
            <div>
              <h3 className="font-semibold text-lg mb-2">{meadow.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {meadow.description}
              </p>
            </div>

            {/* Status section */}
            <MeadowStatusDisplay
              status={meadow.status}
              dateTime={meadow.dateTime}
              location={meadow.location}
              maxParticipants={meadow.maxParticipants}
              currentParticipants={meadow.currentParticipants}
            />

            {/* Participants section */}
            <MeadowParticipants
              participants={meadow.participants}
              maxParticipants={meadow.maxParticipants}
              compact
              onViewAll={() => setSelectedMeadow(meadow)}
            />

            {/* Activity section */}
            <MeadowActivityDisplay
              activities={meadow.activities}
              maxItems={3}
            />

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
              {session?.user && (
                meadow.participants.some(p => p.id === session.user.id) ? (
                  <button
                    onClick={() => handleLeaveMeadow(meadow.id)}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    {t('movement.meadows.leave')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinMeadow(meadow.id)}
                    className="px-4 py-2 text-sm bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
                    disabled={meadow.maxParticipants && meadow.currentParticipants >= meadow.maxParticipants}
                  >
                    {t('movement.meadows.join')}
                  </button>
                )
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Meadow form modal */}
      {(isCreating || selectedMeadow) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <MeadowForm
            meadow={selectedMeadow}
            onSubmit={selectedMeadow ? handleUpdateMeadow : handleCreateMeadow}
            onCancel={() => {
              setIsCreating(false);
              setSelectedMeadow(null);
            }}
          />
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <Alert variant="destructive">
          <AlertTitle>{t('movement.meadows.deleteConfirmTitle')}</AlertTitle>
          <AlertDescription>
            {t('movement.meadows.deleteConfirmMessage', { name: selectedMeadow?.name })}
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {t('common.delete')}
              </button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MeadowManager;
