// src/pages/movement/meadows/index.tsx

import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import DualModeLayout from '@/shared/components/Layout/DualModeLayout';
import MeadowsPage from '@/movement/components/Meadow/MeadowsPage';

const MeadowsRoute = () => {
  return (
    <DualModeLayout>
      <MeadowsPage />
    </DualModeLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'sv', ['common'])),
      session,
    },
  };
};

export default MeadowsRoute;
