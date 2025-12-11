'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  MessageSquare,
  Trophy,
  Calendar,
  Users,
  Crosshair,
  Zap,
  BarChart3,
  Medal,
} from 'lucide-react';
import { useActiveGuild } from '@/stores/app.store';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  isActive: boolean;
  accentColor?: string;
}

function NavItem({ href, icon, label, description, isActive, accentColor }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200',
        'text-sm font-medium',
        isActive
          ? 'bg-gray-800 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      )}
      style={{
        borderLeft: isActive ? `3px solid ${accentColor}` : '3px solid transparent',
      }}
    >
      <span className={cn(isActive && 'text-white')}>{icon}</span>
      <div className="flex-1">
        {label}
        {description && (
          <span className="block text-xs text-gray-500 font-normal">{description}</span>
        )}
      </div>
    </Link>
  );
}

export function GuildNav() {
  const pathname = usePathname();
  const activeGuild = useActiveGuild();

  // Simplified, clearer navigation labels
  const navItems = [
    { href: '/home', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { href: '/pulls', icon: <Zap className="w-5 h-5" />, label: 'Quick Match', description: 'Find instant games' },
    { href: '/calls', icon: <Crosshair className="w-5 h-5" />, label: 'Challenges', description: 'Challenge players' },
    { href: '/leagues', icon: <Medal className="w-5 h-5" />, label: 'Leagues', description: 'Mini competitions' },
    { href: '/runs', icon: <Calendar className="w-5 h-5" />, label: 'Tournaments', description: 'Big events' },
    { href: '/rankboard', icon: <Trophy className="w-5 h-5" />, label: 'Leaderboard' },
    { href: '/crews', icon: <Users className="w-5 h-5" />, label: 'Squads' },
    { href: '/noise', icon: <MessageSquare className="w-5 h-5" />, label: 'Feed', description: 'Community chat' },
    { href: '/stats', icon: <BarChart3 className="w-5 h-5" />, label: 'My Stats' },
  ];

  return (
    <nav className="hidden lg:flex w-56 bg-gray-900 border-r border-gray-800 p-4 flex-col gap-1">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          description={item.description}
          isActive={pathname === item.href}
          accentColor={activeGuild?.accentColor}
        />
      ))}
    </nav>
  );
}
