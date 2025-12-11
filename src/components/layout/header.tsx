'use client';

import { Bell, Search, Settings, ChevronDown, Zap, Coins } from 'lucide-react';
import Link from 'next/link';
import { useAppStore, useActiveGuild, useUnreadNotificationCount } from '@/stores/app.store';
import { Avatar } from '@/components/ui/avatar';
import { Badge, CountBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { formatCredits } from '@/lib/utils';

interface EditionTabProps {
  id: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

function EditionTab({ id, name, isActive, onClick }: EditionTabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium rounded-lg transition-all duration-200',
        isActive
          ? 'bg-gray-800 text-white dark:bg-gray-800 dark:text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      )}
    >
      {name}
    </button>
  );
}

export function Header() {
  const { user, activeEditionId, setActiveEdition } = useAppStore();
  const activeGuild = useActiveGuild();
  const unreadCount = useUnreadNotificationCount();

  if (!activeGuild || !user) return null;

  return (
    <header className="h-16 bg-gray-900/80 dark:bg-gray-900/80 light:bg-white/80 backdrop-blur-sm border-b border-gray-800 dark:border-gray-800 light:border-gray-200 hidden lg:flex items-center justify-between px-4 lg:px-6">
      {/* Left: Guild name and editions */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Guild name */}
        <div className="flex items-center gap-2 lg:gap-3">
          <h1
            className="text-lg lg:text-xl font-bold"
            style={{ color: activeGuild.accentColor }}
          >
            {activeGuild.name}
          </h1>
          <Badge variant="default" size="sm" className="hidden md:flex">
            {activeGuild.memberCount.toLocaleString()} members
          </Badge>
        </div>

        {/* Edition tabs */}
        <div className="flex items-center gap-1 bg-gray-900 dark:bg-gray-900 rounded-xl p-1">
          {activeGuild.editions.map((edition) => (
            <EditionTab
              key={edition.id}
              id={edition.id}
              name={edition.name}
              isActive={activeEditionId === edition.id}
              onClick={() => setActiveEdition(edition.id)}
            />
          ))}
        </div>
      </div>

      {/* Right: Actions and user */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Credits display */}
        <div className="flex items-center gap-2 lg:gap-3 px-2 lg:px-4 py-2 bg-gray-800 dark:bg-gray-800 rounded-xl">
          <div className="flex items-center gap-1 lg:gap-1.5">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs lg:text-sm font-medium text-yellow-400">
              {formatCredits(user.credits.rc)}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <div className="flex items-center gap-1 lg:gap-1.5">
            <Coins className="w-4 h-4 text-purple-400" />
            <span className="text-xs lg:text-sm font-medium text-purple-400">
              {formatCredits(user.credits.bc)}
            </span>
          </div>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle size="sm" />

        {/* Search */}
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Search className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          {unreadCount > 0 && (
            <CountBadge count={unreadCount} className="absolute -top-1 -right-1" />
          )}
        </div>

        {/* Settings */}
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Settings className="w-5 h-5" />
          </Button>
        </Link>

        {/* User dropdown */}
        <Link
          href="/profile"
          className="flex items-center gap-2 pl-2 lg:pl-4 border-l border-gray-700"
        >
          <Avatar
            src={user.avatar}
            name={user.username}
            size="sm"
            isOnline={user.isOnline}
          />
          <div className="text-left hidden xl:block">
            <p className="text-sm font-medium text-white dark:text-white">{user.username}</p>
            <p className="text-xs text-gray-500">Level {user.level}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500 hidden xl:block" />
        </Link>
      </div>
    </header>
  );
}
