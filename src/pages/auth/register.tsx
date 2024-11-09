import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import { validatePassword, type PasswordStrength } from '@/shared/utils/password';
import PasswordStrengthMeter from '@/shared/components/common/PasswordStrengthMeter';
import Image from 'next/image';

interface ValidationState {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [validation, setValidation] = useState<ValidationState>({
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string) => {
    return name.length >= 2 && name.length <= 50;
  };

  const handleValidation = (field: keyof ValidationState, value: string) => {
    switch (field) {
      case 'name':
        setValidation(prev => ({ ...prev, name: validateName(value) }));
        break;
      case 'email':
        setValidation(prev => ({ ...prev, email: validateEmail(value) }));
        break;
      case 'password':
        const strength = validatePassword(value);
        setPasswordStrength(strength);
        setValidation(prev => ({ ...prev, password: strength.isStrong }));
        break;
      case 'confirmPassword':
        const password = (document.getElementById('password') as HTMLInputElement)?.value;
        setValidation(prev => ({ ...prev, confirmPassword: value === password }));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
      };

      // Validate all fields
      const newValidation = {
        name: validateName(data.name),
        email: validateEmail(data.email),
        password: passwordStrength?.isStrong ?? false,
        confirmPassword: data.password === data.confirmPassword,
      };
      setValidation(newValidation);

      // Check if any validation failed
      if (Object.values(newValidation).includes(false)) {
        setError(t('auth.errors.validationFailed'));
        setIsLoading(false);
        return;
      }

      console.log('Sending registration request...');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response:', await response.text());
        throw new Error('Invalid server response');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || t('auth.errors.unknown'));
      }

      console.log('Registration successful, attempting sign in...');
      
      // After successful registration, sign in
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      // If everything succeeded, redirect to home
      router.push('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : t('auth.errors.unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header section remains the same */}
        
        <div className="flex flex-col space-y-4">
          {/* Social login buttons */}

          {/* Google login button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Image
              src="/images/google-logo.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            {t('auth.register.continueWithGoogle')}
          </button>

          {/* GitHub login button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Github className="h-5 w-5 mr-2" />
            {t('auth.register.continueWithGithub')}
          </button>

          {/* Twitter login button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('twitter')}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Twitter className="h-5 w-5 mr-2" />
            {t('auth.register.continueWithTwitter')}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                {t('auth.register.orContinueWith')}
              </span>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Form fields with validation */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                {t('auth.name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                onChange={(e) => handleValidation('name', e.target.value)}
                className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border ${
                  validation.name ? 'border-gray-300 dark:border-gray-700' : 'border-red-500'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder={t('auth.name')}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                onChange={(e) => handleValidation('email', e.target.value)}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  validation.email ? 'border-gray-300 dark:border-gray-700' : 'border-red-500'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
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
                onChange={(e) => handleValidation('password', e.target.value)}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  validation.password ? 'border-gray-300 dark:border-gray-700' : 'border-red-500'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder={t('auth.password')}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {t('auth.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                onChange={(e) => handleValidation('confirmPassword', e.target.value)}
                className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border ${
                  validation.confirmPassword ? 'border-gray-300 dark:border-gray-700' : 'border-red-500'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder={t('auth.confirmPassword')}
              />
            </div>
          </div>

          {/* Password strength meter */}
          {passwordStrength && <PasswordStrengthMeter strength={passwordStrength} />}

          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? t('common.loading') : t('auth.register.submit')}
            </button>
          </div>

          {/* Sign in link */}
          <div className="text-sm text-center">
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('auth.register.signInLink')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'sv', ['common'])),
    },
  };
};
