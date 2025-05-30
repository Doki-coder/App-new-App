'use client';

import type React from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import type { UserPreferences, Currency, Language, Theme, CalendarSystem } from '@/types';
import { DEFAULT_USER_PREFERENCES } from '@/lib/constants';

const USER_PREFERENCES_KEY = 'hesabdar_user_preferences';

export interface UserContextType {
  preferences: UserPreferences;
  loading: boolean;
  updateName: (name: string) => void;
  updateCurrency: (currency: Currency) => void;
  updateLanguage: (language: Language) => void;
  updateTheme: (theme: Theme) => void;
  updateCalendarSystem: (calendarSystem: CalendarSystem) => void;
  completeFirstLaunch: (name: string, currency: Currency, language: Language) => void;
  resetPreferences: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedPrefs = localStorage.getItem(USER_PREFERENCES_KEY);
      if (storedPrefs) {
        const parsedPrefs = JSON.parse(storedPrefs) as Partial<UserPreferences>;
        // Validate essential keys and merge with defaults to handle potentially missing new keys like calendarSystem
        const validatedPrefs: UserPreferences = {
          ...DEFAULT_USER_PREFERENCES, // Start with defaults
          ...(parsedPrefs.name !== undefined && { name: parsedPrefs.name }),
          ...(parsedPrefs.currency && { currency: parsedPrefs.currency }),
          ...(parsedPrefs.language && { language: parsedPrefs.language }),
          ...(parsedPrefs.theme !== undefined && { theme: parsedPrefs.theme }),
          ...(parsedPrefs.calendarSystem && { calendarSystem: parsedPrefs.calendarSystem }),
          isFirstLaunch: parsedPrefs.isFirstLaunch !== undefined ? parsedPrefs.isFirstLaunch : DEFAULT_USER_PREFERENCES.isFirstLaunch,
        };
        setPreferences(validatedPrefs);
        localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(validatedPrefs)); // Re-save potentially merged prefs
      } else {
         // No stored prefs, set defaults (isFirstLaunch will be true)
        localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(DEFAULT_USER_PREFERENCES));
        setPreferences(DEFAULT_USER_PREFERENCES);
      }
    } catch (error) {
      console.error("Failed to load user preferences from localStorage", error);
      // Fallback to default if parsing fails
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(DEFAULT_USER_PREFERENCES));
      setPreferences(DEFAULT_USER_PREFERENCES);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs };
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateName = (name: string) => updatePreferences({ name });
  const updateCurrency = (currency: Currency) => updatePreferences({ currency });
  const updateLanguage = (language: Language) => {
    updatePreferences({ language });
    if (typeof window !== 'undefined') {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    }
  };
  const updateTheme = (theme: Theme) => {
    updatePreferences({ theme });
     if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }
  };
  const updateCalendarSystem = (calendarSystem: CalendarSystem) => updatePreferences({ calendarSystem });

  const completeFirstLaunch = (name: string, currency: Currency, language: Language) => {
    const currentTheme = preferences.theme; 
    const currentCalendarSystem = preferences.calendarSystem;
    updatePreferences({ name, currency, language, theme: currentTheme, calendarSystem: currentCalendarSystem, isFirstLaunch: false });
    if (typeof window !== 'undefined') {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    }
  };
  
  const resetPreferences = () => {
    localStorage.removeItem(USER_PREFERENCES_KEY);
    setPreferences(DEFAULT_USER_PREFERENCES);
    if (typeof window !== 'undefined') {
        document.documentElement.lang = DEFAULT_USER_PREFERENCES.language;
        document.documentElement.dir = DEFAULT_USER_PREFERENCES.language === 'fa' ? 'rtl' : 'ltr';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(DEFAULT_USER_PREFERENCES.theme);
    }
    setLoading(false); // Ensure loading is false after reset
  };


  return (
    <UserContext.Provider value={{ preferences, loading, updateName, updateCurrency, updateLanguage, updateTheme, updateCalendarSystem, completeFirstLaunch, resetPreferences }}>
      {children}
    </UserContext.Provider>
  );
}
