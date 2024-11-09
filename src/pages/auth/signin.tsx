import { useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import Image from 'next/image';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';

// Helper to get provider icon
const getProviderIcon = (providerId: string) => {
  switch (providerId) {
    case 'google':
      return <Image src="/images/google-logo.svg" alt="Google" width={20} height={20} className="mr-2" />;
    case 'github':
      return <Github className="h-5 w-5 mr-2" />;
    case 'twitter':
      return <Twitter className="h-5 w-5 mr-2" />;
    default:
      return null;
  }
};

type SignInProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function SignIn({ providers }: SignInProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl: '/' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(t(`auth.errors.${result.error}`));
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(t('auth.errors.unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.signIn.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.signIn.description')}
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          {Object.values(providers ?? {}).map((provider: any) => 
            provider.name !== "Credentials" && (
              <button
                key={provider.id}
                onClick={() => handleSocialSignIn(provider.id)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {getProviderIcon(provider.id)}
                {t(`auth.signIn.continueWith${provider.name}`)}
              </button>
            )
          )}

          {Object.keys(providers ?? {}).length > 1 && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500">
                  {t('auth.signIn.orContinueWith')}
                </span>
              </div>
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('auth.email')}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('auth.password')}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? t('common.loading') : t('auth.signIn.submit')}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {t('auth.signIn.noAccount')}{' '}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('auth.signIn.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const providers = await getProviders();
  
  return {
    props: {
      providers,
      ...(await serverSideTranslations(locale ?? 'sv', ['common'])),
    },
  };
};
