import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Sun, Moon, Users, Flower2, Globe, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import PartyDashboard from '../Party/PartyDashboard';
import { MovementDashboard } from '../Movement/Dashboard';

const LANGUAGE_KEY = 'dpop_language';
const MODE_KEY = 'dpop_mode';
const THEME_KEY = 'dpop_theme';

const DualModeLayout = ({ children }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  // Initialize state with null to prevent hydration mismatch
  const [mode, setMode] = useState('party');
  const [theme, setTheme] = useState('light');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    // Load saved preferences
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    const savedMode = localStorage.getItem(MODE_KEY);
    const savedTheme = localStorage.getItem(THEME_KEY);

    // Apply saved preferences or defaults
    if (savedLanguage && savedLanguage !== router.locale) {
      router.push(router.pathname, router.asPath, { locale: savedLanguage });
    }
    if (savedMode) setMode(savedMode);
    if (savedTheme) setTheme(savedTheme);

    setIsInitialized(true);
  }, []);

  // Save preferences when they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(MODE_KEY, mode);
    }
  }, [mode, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme, isInitialized]);

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

  // Add a loading state while initializing preferences
  if (!isInitialized) {
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

            {/* Sign In Button */}
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              mode === 'party' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}>
              <span>{t('nav.signIn')}</span>
            </button>
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
                <button className={`w-full px-4 py-2 text-left rounded-lg flex items-center space-x-2 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  <LayoutDashboard size={18} />
                  <span>{t('party.menu.dashboard')}</span>
                </button>
                <button className={`w-full px-4 py-2 text-left rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  {t('party.menu.proposals')}
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
                <button className={`w-full px-4 py-2 text-left rounded-lg flex items-center space-x-2 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  <LayoutDashboard size={18} />
                  <span>{t('movement.menu.dashboard')}</span>
                </button>
                <button className={`w-full px-4 py-2 text-left rounded-lg flex items-center space-x-2 ${
                  theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
                } ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  <Flower2 size={18} />
                  <span>{t('movement.menu.meadows')}</span>
                </button>
                <button className={`w-full px-4 py-2 text-left rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  {t('movement.menu.initiatives')}
                </button>
                <button className={`w-full px-4 py-2 text-left rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'} ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                  {t('movement.menu.resources')}
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
          <div className={`max-w-7xl mx-auto ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {children || (
              mode === 'party' ? <PartyDashboard /> : <MovementDashboard />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DualModeLayout;
