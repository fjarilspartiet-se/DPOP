// src/pages/movement/resources/index.tsx

import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DualModeLayout from '@/shared/components/Layout/DualModeLayout';
import ResourceLibrary from '@/shared/components/Movement/Resources/ResourceLibrary';
import ResourceCreationForm from '@/shared/components/Movement/Resources/ResourceCreationForm';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/shared/components/common/Alert';
import { Resource } from '@prisma/client';

const ResourcesPage = () => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateResource = async (data: any) => {
    try {
      const response = await fetch('/api/movement/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create resource');

      setShowCreateForm(false);
      // You might want to refresh the resource list here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showCreateForm ? (
        <ResourceCreationForm
          onSubmit={handleCreateResource}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : (
        <ResourceLibrary
          onResourceCreate={() => setShowCreateForm(true)}
        />
      )}
    </div>
  );
};

ResourcesPage.getLayout = (page: React.ReactElement) => {
  return <DualModeLayout>{page}</DualModeLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'sv', ['common'])),
    },
  };
};

export default ResourcesPage;
