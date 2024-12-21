// src/pages/party/proposals/[id].tsx

import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth/next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import DualModeLayout from '@/shared/components/Layout/DualModeLayout';
import ProposalDetail from '@/party/components/Proposals/ProposalDetail';

const ProposalDetailRoute = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <DualModeLayout>
      <ProposalDetail 
        proposalId={id as string} 
        onBack={() => router.push('/party/proposals')} 
      />
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

export default ProposalDetailRoute;
