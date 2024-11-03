import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DualModeLayout from '../shared/components/Layout/DualModeLayout';

const Home: NextPage = () => {
  return (
    <DualModeLayout />
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'sv', ['common'])),
    },
  };
};

export default Home;
