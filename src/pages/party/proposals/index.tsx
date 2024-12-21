// src/pages/party/proposals/index.tsx

import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import DualModeLayout from '@/shared/components/Layout/DualModeLayout';
import ProposalList from '@/party/components/Proposals/ProposalList';

const ProposalsRoute = () => {
  return (
    <DualModeLayout>
      <ProposalList />
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

export default ProposalsRoute;
