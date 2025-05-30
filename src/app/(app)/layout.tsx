'use client';

import type React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import UserNav from '@/components/layout/user-nav';
import MainNav from '@/components/layout/main-nav';
import { Landmark, Moon, Sun } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { preferences, updateTheme } = useUser();
  const { t } = useTranslation();

  const toggleTheme = () => {
    updateTheme(preferences.theme === 'light' ? 'dark' : 'light');
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r-2 border-sidebar-border shadow-lg">
        <SidebarHeader className="p-4 flex items-center gap-2 justify-center">
          <Landmark className="h-8 w-8 text-sidebar-primary" />
          <h1 className="text-2xl font-semibold text-sidebar-primary group-data-[collapsible=icon]:hidden">
            {t('appName')}
          </h1>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-full justify-center group-data-[collapsible=icon]:w-auto"
            aria-label={preferences.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {preferences.theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="ml-2 group-data-[collapsible=icon]:hidden">
              {preferences.theme === 'light' ? t('dark') : t('light')}
            </span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 shadow-sm backdrop-blur-md md:px-6">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="flex-1">
            {/* Placeholder for breadcrumbs or page title if needed */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
