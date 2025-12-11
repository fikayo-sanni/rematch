'use client';

import { useState } from 'react';
import { Plus, Gamepad2 } from 'lucide-react';
import { useAppStore, useJoinedGuilds } from '@/stores/app.store';
import { guilds } from '@/data/dummy';
import { cn } from '@/lib/utils';
import { Guild } from '@/types';
import { JoinGuildModal } from '@/components/modals/join-guild-modal';

interface GuildIconProps {
  guild: Guild;
  isActive: boolean;
  onClick: () => void;
}

function GuildIcon({ guild, isActive, onClick }: GuildIconProps) {
  return (
    <div className="relative group px-3">
      {/* Active indicator bar */}
      <div
        className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-200',
          isActive ? 'h-10 bg-white' : 'h-0 group-hover:h-5 bg-white/50'
        )}
      />

      {/* Guild button */}
      <button
        onClick={onClick}
        className={cn(
          'relative w-12 h-12 rounded-2xl overflow-hidden',
          'flex items-center justify-center',
          'transition-all duration-200 ease-out',
          'bg-gray-800 border-2',
          isActive
            ? 'rounded-xl border-transparent'
            : 'hover:rounded-xl border-gray-700 hover:border-gray-600'
        )}
        style={{
          boxShadow: isActive ? `0 0 20px ${guild.accentColor}40` : undefined,
          borderColor: isActive ? guild.accentColor : undefined,
        }}
      >
        {guild.logo ? (
          <img
            src={guild.logo}
            alt={guild.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className="text-lg font-bold"
            style={{ color: guild.accentColor }}
          >
            {guild.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </button>

      {/* Tooltip */}
      <div
        className={cn(
          'absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50',
          'px-3 py-2 rounded-lg',
          'bg-gray-900 border border-gray-700',
          'text-sm font-medium text-white whitespace-nowrap',
          'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
          'transition-all duration-150 pointer-events-none',
          'shadow-xl'
        )}
      >
        {guild.name}
        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 rotate-45" />
      </div>
    </div>
  );
}

export function GuildSidebar() {
  const { activeGuildId, setActiveGuild } = useAppStore();
  const joinedGuilds = useJoinedGuilds();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Get guilds not joined for the "explore" section
  const exploreGuilds = guilds.filter(g => !joinedGuilds.find(jg => jg.id === g.id));

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[72px] bg-gray-950 border-r border-gray-800 flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Gamepad2 className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Joined Guilds */}
      <div className="flex-1 py-3 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
        {joinedGuilds.map((guild) => (
          <GuildIcon
            key={guild.id}
            guild={guild}
            isActive={activeGuildId === guild.id}
            onClick={() => setActiveGuild(guild.id)}
          />
        ))}

        {/* Divider */}
        <div className="mx-auto my-2 w-8 h-0.5 bg-gray-800 rounded-full" />

        {/* Explore/Add Guild */}
        <div className="px-3">
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className={cn(
              'w-12 h-12 rounded-2xl',
              'flex items-center justify-center',
              'bg-gray-800 border-2 border-dashed border-gray-700',
              'text-gray-500 hover:text-green-400 hover:border-green-400/50',
              'transition-all duration-200 hover:rounded-xl',
              'group'
            )}
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Explore Guilds Preview */}
        {exploreGuilds.slice(0, 2).map((guild) => (
          <div key={guild.id} className="px-3 opacity-50 hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className={cn(
                'w-12 h-12 rounded-2xl',
                'flex items-center justify-center',
                'bg-gray-800/50 border border-gray-800',
                'transition-all duration-200 hover:rounded-xl hover:bg-gray-800'
              )}
            >
              <span className="text-xs font-bold text-gray-500">
                {guild.name.slice(0, 2).toUpperCase()}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Bottom section - could add settings/profile here */}
      <div className="p-3 border-t border-gray-800">
        <button
          className={cn(
            'w-12 h-12 rounded-2xl',
            'flex items-center justify-center',
            'bg-gray-800 border border-gray-700',
            'text-gray-400 hover:text-white',
            'transition-all duration-200 hover:rounded-xl hover:bg-gray-700'
          )}
        >
          <span className="text-sm font-bold">SS</span>
        </button>
      </div>

      {/* Join Guild Modal */}
      <JoinGuildModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </aside>
  );
}
