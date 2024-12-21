import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Sun, Moon, Users, Flower2, Globe, LayoutDashboard, FileText, LogOut, User } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useSession, signOut } from 'next-auth/react';
import PartyDashboard from '../Party/PartyDashboard';
import { MovementDashboard } from '../Movement/Dashboard';
import AchievementNotificationManager from '@/movement/components/Journey/AchievementNotificationManager';
import Link from 'next/link';

const LANGUAGE_KEY = 'dpop_language';
const MODE_KEY = 'dpop_mode';
const THEME_KEY = 'dpop_theme';

const DualModeLayout = ({ children }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { data: session, status } = useSession();

  // Initialize state with null to prevent hydration mismatch
  const [mode, setMode] = useState(null);
  const [theme, setTheme] = useState(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [showUserMenu, setShowUserMenu] = useState(false);

  // Initialize state after mount
  useEffect(() => {
    const savedMode = localStorage.getItem(MODE_KEY) || 'party';
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

    setMode(savedMode);
    setTheme(savedTheme);

    // Update language if needed
    if (savedLanguage && savedLanguage !== router.locale) {
      router.push(router.pathname, router.asPath, { locale: savedLanguage });
    }

    setMounted(true);
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    if (mounted && mode) {
      localStorage.setItem(MODE_KEY, mode);
    }
  }, [mode, mounted]);

  useEffect(() => {
    if (mounted && theme) {
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const changeLanguage = (locale: string) => {
    localStorage.setItem(LANGUAGE_KEY, locale);
    router.push(router.pathname, router.asPath, { locale });
    setShowLanguageMenu(false);
  };

  const getModeText = (mode: string) => {
    return t(`welcome.modes.${mode}`);
  };

  const handleModeChange = (newMode: 'party' | 'movement') => {
    setMode(newMode);
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Show loading state until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {/* Top Navigation */}
      <nav className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border-b px-4 py-3`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo and Mode Switch */}
          <div className="flex items-center space-x-4">
            <span className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              DPOP
            </span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleModeChange('party')}
                className={`flex items-center px-3 py-2 rounded-md space-x-2 ${
                  mode === 'party' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users size={18} />
                <span>{t('nav.party')}</span>
              </button>
              <button
                onClick={() => handleModeChange('movement')}
                className={`flex items-center px-3 py-2 rounded-md space-x-2 ${
                  mode === 'movement' 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Flower2 size={18} />
                <span>{t('nav.movement')}</span>
              </button>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className={`p-2 rounded-full flex items-center space-x-1 ${
                  theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <Globe size={20} />
                <span className="text-sm">{router.locale === 'sv' ? 'SV' : 'EN'}</span>
              </button>
              
              {showLanguageMenu && (
                <div 
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                    theme === 'light' ? 'bg-white' : 'bg-gray-800'
                  } ring-1 ring-black ring-opacity-5 z-50`}
                >
                  <div className="py-1" role="menu">
                    {['sv', 'en'].map((locale) => (
                      <button
                        key={locale}
                        onClick={() => changeLanguage(locale)}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          theme === 'light' 
                            ? 'hover:bg-gray-100 text-gray-900' 
                            : 'hover:bg-gray-700 text-gray-100'
                        } ${router.locale === locale ? 'bg-blue-50' : ''}`}
                      >
                        {t(`nav.language.${locale}`)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeChange}
              className={`p-2 rounded-full ${
                theme === 'light' 
                  ? 'hover:bg-gray-100 text-gray-700' 
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* User Menu */}
            {status === 'authenticated' ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ''}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {session.user.name || session.user.email}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                        {t('nav.lifeStage')}: {session.user.lifeStage}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('nav.signOut')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  mode === 'party' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                <span>{t('nav.signIn')}</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={`w-64 h-[calc(100vh-64px)] ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border-r`}>
          <nav className="p-4">
            {mode === 'party' ? (
              <div className="space-y-2">
                <h3 className={`px-4 py-2 text-sm font-semibold ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {t('party.menu.title')}
                </h3>
                <button
                  onClick={() => router.push('/party/dashboard')}
                  className={`w-full px-4 py-2 text-left rounded-lg flex items-center space-x-2 ${
                    router.pathname === '/party/dashboard'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
                  } ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
                >
                  <LayoutDashboard size={18} />
                  <span>{t('party.menu.dashboard')}</span>
                </button>
                <button
                  onClick={() => router.push('/party/proposals')}
                  className={`w-full px-4 py-2 text-left rounded-lg flex items-center space-x-2 ${
                    router.pathname.startsWith('/party/proposals')
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
                  } ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
                >
                  <FileText size={18} />
                  <span>{t('party.menu.proposals')}</span>
                </button>
                <button className={`w-full px-4 py-2 text-left rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  {t('party.menu.committees')}
                </button>
                <button className={`w-full px-4 py-2 text-left rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  {t('party.menu.members')}
                </button>
                <button className={`w-full px-4 py-2 text-left rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  {t('party.menu.resources')}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className={`px-4 py-2 text-sm font-semibold ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {t('movement.menu.title')}
                </h3>
                <button
                  onClick={() => router.push('/movement/dashboard')}
                  className={`w-full px-4 py-2 text-left rounded-lg flex items-center space-x-2 ${
                    router.pathname === '/movement/dashboard' 
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
                  } ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
                >
                  <LayoutDashboard size={18} />
                  <span>{t('movement.menu.dashboard')}</span>
                </button>
                <button
                  onClick={() => router.push('/movement/meadows')}
                  className={`w-full px-4 py-2 text-left rounded-lg flex items-center space-x-2 ${
                    router.pathname === '/movement/meadows'
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
                  } ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
                >
                  <Flower2 size={18} />
                  <span>{t('movement.menu.meadows')}</span>
                </button>
                <button
                  onClick={() => router.push('/movement/resources')}
                  className={`w-full px-4 py-2 text-left rounded-lg flex items-center space-x-2 ${
                    router.pathname === '/movement/resources'
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
                  } ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
                >
                  <FileText size={18} />
                  <span>{t('movement.menu.resources')}</span>
                </button>
                <button className={`w-full px-4 py-2 text-left rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  {t('movement.menu.initiatives')}
                </button>
                <button className={`w-full px-4 py-2 text-left rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  {t('movement.menu.community')}
                </button>
                <button className={`w-full px-4 py-2 text-left rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  {t('movement.menu.journey')}
                </button>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {mounted && (
            <div className={`max-w-7xl mx-auto ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {children || (
                mode === 'party' ? <PartyDashboard /> : <MovementDashboard />
              )}
            </div>
          )}
        </main>
      </div>
      {mounted && session?.user && (
        <AchievementNotificationManager userId={session.user.id} />
      )}
    </div>
  );
};

export default DualModeLayout;
