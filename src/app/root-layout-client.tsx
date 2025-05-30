'use client';

import type React from 'react';
import { useEffect } from 'react';
import { useUser } from '@/hooks/use-user';

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { preferences } = useUser();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = preferences.language === 'fa' ? 'fa' : 'en';
      document.documentElement.dir = preferences.language === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(preferences.theme);
    }
  }, [preferences.language, preferences.theme]);

  return <html lang={preferences.language === 'fa' ? 'fa' : 'en'} dir={preferences.language === 'fa' ? 'rtl' : 'ltr'} className={preferences.theme}>
    {children}
  </html>;
}
