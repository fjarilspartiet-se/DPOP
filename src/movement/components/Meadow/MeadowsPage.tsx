import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { MeadowManager } from '@/movement/components/Meadow';
import { MeadowDetail } from '@/movement/components/Meadow';
import { useMeadows } from '@/movement/hooks/useMeadows';
import type { Meadow } from '@/movement/types/meadow';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/common/Alert';

const MeadowsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [selectedMeadow, setSelectedMeadow] = useState<Meadow | null>(null);
  const { 
    isLoading, 
    error,
    fetchMeadows,
    updateMeadow,
    deleteMeadow,
    joinMeadow,
    leaveMeadow
  } = useMeadows();

  const handleSelectMeadow = (meadow: Meadow) => {
    setSelectedMeadow(meadow);
  };

  const handleBack = () => {
    setSelectedMeadow(null);
  };

  const handleUpdate = async (updatedMeadow: Meadow) => {
    const result = await updateMeadow(updatedMeadow);
    if (result) {
      setSelectedMeadow(result);
    }
  };

  const handleDelete = async (meadowId: string) => {
    await deleteMeadow(meadowId);
    setSelectedMeadow(null);
  };

  const handleJoinMeadow = async (meadowId: string) => {
    const success = await joinMeadow(meadowId);
    if (success && selectedMeadow) {
      // Refresh meadow data
      const updatedMeadow = await fetchMeadows({ id: meadowId });
      if (updatedMeadow.length > 0) {
        setSelectedMeadow(updatedMeadow[0]);
      }
    }
  };

  const handleLeaveMeadow = async (meadowId: string) => {
    const success = await leaveMeadow(meadowId);
    if (success && selectedMeadow) {
      // Refresh meadow data
      const updatedMeadow = await fetchMeadows({ id: meadowId });
      if (updatedMeadow.length > 0) {
        setSelectedMeadow(updatedMeadow[0]);
      }
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {selectedMeadow ? (
        <MeadowDetail
          meadow={selectedMeadow}
          onBack={handleBack}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onJoin={handleJoinMeadow}
          onLeave={handleLeaveMeadow}
        />
      ) : (
        <MeadowManager 
          onSelectMeadow={handleSelectMeadow}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default MeadowsPage;
