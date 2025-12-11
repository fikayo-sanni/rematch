'use client';

import { useState, useEffect } from 'react';
import { QuickPullCard } from '@/components/home/quick-pull-card';
import { ActiveMatchesCard } from '@/components/home/active-matches-card';
import { RecentActivityCard } from '@/components/home/recent-activity-card';
import { LeaderboardPreview } from '@/components/home/leaderboard-preview';
import { OpenCallsCard } from '@/components/home/open-calls-card';
import { UpcomingMatchesCard } from '@/components/home/upcoming-matches-card';
import { QuickPullModal } from '@/components/modals/quick-pull-modal';
import { useAppStore } from '@/stores/app.store';
import { currentUser } from '@/data/dummy';

export default function Home() {
  const { user, login } = useAppStore();
  const [isPullModalOpen, setIsPullModalOpen] = useState(false);

  // Auto-login for demo purposes
  useEffect(() => {
    if (!user) {
      login(currentUser);
    }
  }, [user, login]);

  // Show loading state while initializing
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading Rematch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Matches Banner */}
      <UpcomingMatchesCard variant="banner" />

      {/* Quick Pull - Hero Section */}
      <QuickPullCard onStartPull={() => setIsPullModalOpen(true)} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Takes 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <ActiveMatchesCard />
          <RecentActivityCard />
        </div>

        {/* Right Column - Takes 1/3 */}
        <div className="space-y-6">
          <LeaderboardPreview />
          <OpenCallsCard />
        </div>
      </div>

      {/* Quick Pull Modal */}
      <QuickPullModal
        isOpen={isPullModalOpen}
        onClose={() => setIsPullModalOpen(false)}
      />
    </div>
  );
}
