'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Zap,
  Crosshair,
  Medal,
  Trophy,
  Users,
  MessageSquare,
  Menu,
  X,
  Settings,
  User,
  BarChart3,
  Calendar,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAppStore, useActiveGuild, useJoinedGuilds } from '@/stores/app.store';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/pulls', icon: Zap, label: 'Quick Match' },
  { href: '/calls', icon: Crosshair, label: 'Challenges' },
  { href: '/leagues', icon: Medal, label: 'Leagues' },
  { href: '/runs', icon: Calendar, label: 'Tournaments' },
  { href: '/rankboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/crews', icon: Users, label: 'Squads' },
  { href: '/noise', icon: MessageSquare, label: 'Feed' },
  { href: '/stats', icon: BarChart3, label: 'My Stats' },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAppStore();
  const activeGuild = useActiveGuild();
  const joinedGuilds = useJoinedGuilds();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-gray-950 border-b border-gray-800 z-50 px-4 flex items-center justify-between">
        {/* Menu Button */}
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo/Game */}
        <div className="flex items-center gap-2">
          {activeGuild && (
            <>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: `${activeGuild.accentColor}20` }}
              >
                {activeGuild.logo ? (
                  <img src={activeGuild.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span style={{ color: activeGuild.accentColor }}>
                    {activeGuild.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="font-bold text-white">{activeGuild.name}</span>
            </>
          )}
        </div>

        {/* User Avatar */}
        {user && (
          <Link href="/profile">
            <Avatar src={user.avatar} name={user.username} size="sm" />
          </Link>
        )}
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-gray-950 border-t border-gray-800 z-50 px-2 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
                isActive
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: isActive ? activeGuild?.accentColor : undefined }}
              />
              <span className="text-xs">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>

      {/* Slide-out Menu */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={closeMenu}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            'absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-gray-900 transform transition-transform duration-300',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold text-white">Rematch</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Section */}
          {user && (
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <Avatar src={user.avatar} name={user.username} size="lg" />
                <div>
                  <p className="font-bold text-white">{user.username}</p>
                  <p className="text-sm text-gray-400">Level {user.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">{user.credits?.rc?.toLocaleString() || 0} RC</Badge>
                <Badge variant="warning" size="sm">{user.credits?.bc?.toLocaleString() || 0} BC</Badge>
              </div>
            </div>
          )}

          {/* Guilds */}
          <div className="p-4 border-b border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Your Games</p>
            <div className="space-y-2">
              {joinedGuilds.map((guild) => (
                <button
                  key={guild.id}
                  onClick={() => {
                    useAppStore.getState().setActiveGuild(guild.id);
                    closeMenu();
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl transition-colors',
                    activeGuild?.id === guild.id
                      ? 'bg-gray-800'
                      : 'hover:bg-gray-800/50'
                  )}
                  style={{
                    borderLeft: activeGuild?.id === guild.id
                      ? `3px solid ${guild.accentColor}`
                      : '3px solid transparent'
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: `${guild.accentColor}20` }}
                  >
                    {guild.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium text-white">{guild.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Navigation</p>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    )}
                    style={{
                      borderLeft: isActive
                        ? `3px solid ${activeGuild?.accentColor}`
                        : '3px solid transparent'
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-800/50 rounded-xl">
              <span className="text-sm text-gray-400">Dark Mode</span>
              <ThemeToggle size="sm" />
            </div>

            {/* Settings & Logout */}
            <div className="space-y-1">
              <Link
                href="/settings"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <button
                onClick={() => {
                  useAppStore.getState().logout();
                  closeMenu();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
