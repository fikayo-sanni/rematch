'use client';

import { ReactNode, useEffect } from 'react';
import { GuildSidebar } from './guild-sidebar';
import { Header } from './header';
import { GuildNav } from './guild-nav';
import { MobileNav } from './mobile-nav';
import { useAppStore } from '@/stores/app.store';
import { useThemeStore } from '@/stores/theme.store';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, activeGuildId } = useAppStore();
  const { theme } = useThemeStore();

  // Apply theme class to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  // If not logged in, render children without layout (for auth pages)
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen bg-gray-950 dark:bg-gray-950 text-white ${theme}`}>
      {/* Guild sidebar (left edge) - Hidden on mobile */}
      <GuildSidebar />

      {/* Mobile Navigation - Component handles its own responsive visibility */}
      <MobileNav />

      {/* Main content area */}
      <div className="pl-0 lg:pl-[72px] min-h-screen flex flex-col pt-14 lg:pt-0 pb-16 lg:pb-0">
        {/* Header - Desktop only */}
        <Header />

        {/* Content with nav */}
        <div className="flex-1 flex">
          {/* Guild navigation - Hidden on mobile */}
          {activeGuildId && <GuildNav />}

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
