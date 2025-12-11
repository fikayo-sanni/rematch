'use client';

import { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { rankboard } from '@/data/dummy';
import { useActiveGuild, useAppStore } from '@/stores/app.store';
import { formatCredits } from '@/lib/utils';
import { cn } from '@/lib/utils';

function RankChangeIndicator({ change }: { change: number }) {
  if (change > 0) {
    return (
      <div className="flex items-center gap-0.5 text-green-400">
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm font-medium">{change}</span>
      </div>
    );
  }
  if (change < 0) {
    return (
      <div className="flex items-center gap-0.5 text-red-400">
        <TrendingDown className="w-4 h-4" />
        <span className="text-sm font-medium">{Math.abs(change)}</span>
      </div>
    );
  }
  return <Minus className="w-4 h-4 text-gray-500" />;
}

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return {
        bg: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        icon: '👑',
      };
    case 2:
      return {
        bg: 'bg-gradient-to-r from-gray-400/20 to-gray-500/10',
        border: 'border-gray-400/30',
        text: 'text-gray-300',
        icon: '🥈',
      };
    case 3:
      return {
        bg: 'bg-gradient-to-r from-amber-600/20 to-orange-600/10',
        border: 'border-amber-600/30',
        text: 'text-amber-500',
        icon: '🥉',
      };
    default:
      return {
        bg: 'bg-gray-800/30',
        border: 'border-gray-800',
        text: 'text-gray-500',
        icon: null,
      };
  }
}

export default function RankboardPage() {
  const activeGuild = useActiveGuild();
  const { user } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRankboard = rankboard.filter((entry) => {
    return entry.user.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Find current user's rank
  const userRank = rankboard.find(r => r.user.id === user?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy
            className="w-8 h-8"
            style={{ color: activeGuild?.accentColor }}
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Rankboard</h1>
            <p className="text-gray-400">
              Season rankings for {activeGuild?.name}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players..."
            className="w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* User's current rank card */}
      {userRank && (
        <Card className="border-violet-500/30 bg-violet-500/5" glow>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-violet-400">
                  #{userRank.rank}
                </div>
                <div>
                  <p className="font-medium text-white">Your Rank</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {userRank.wins}W / {userRank.losses}L
                    </span>
                    <RankChangeIndicator change={userRank.change} />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-400">
                  {formatCredits(userRank.creditsEarned)} RC
                </p>
                <p className="text-sm text-gray-400">earned this season</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rankboard table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="font-bold text-white">Season Rankings</h3>
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-800">
            {filteredRankboard.map((entry) => {
              const entryUser = entry.user;
              const style = getRankStyle(entry.rank);
              const isCurrentUser = entry.user.id === user?.id;

              return (
                <div
                  key={entry.user.id}
                  className={cn(
                    'flex items-center gap-4 p-4 transition-colors',
                    style.bg,
                    isCurrentUser && 'bg-violet-500/10'
                  )}
                >
                  {/* Rank */}
                  <div className="w-16 flex items-center justify-center">
                    {style.icon ? (
                      <span className="text-2xl">{style.icon}</span>
                    ) : (
                      <span className={cn('text-xl font-bold', style.text)}>
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Player info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar
                      src={entryUser.avatar}
                      name={entryUser.username}
                      size="md"
                      isOnline={entryUser.isOnline}
                    />
                    <div className="min-w-0">
                      <p className={cn(
                        'font-medium truncate',
                        isCurrentUser ? 'text-violet-400' : 'text-white'
                      )}>
                        {entryUser.username}
                        {isCurrentUser && <span className="ml-2 text-xs text-gray-500">(You)</span>}
                      </p>
                      <p className="text-sm text-gray-500">Level {entryUser.level}</p>
                    </div>
                  </div>

                  {/* Win streak */}
                  {entry.winStreak > 0 && (
                    <div className="w-20">
                      <Badge variant="success" size="sm">
                        🔥 {entry.winStreak} streak
                      </Badge>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="w-24 text-center">
                    <p className="text-sm text-gray-400">
                      {entry.wins}W / {entry.losses}L
                    </p>
                    <p className="text-xs text-gray-500">
                      {((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(1)}%
                    </p>
                  </div>

                  {/* Rank change */}
                  <div className="w-16 flex justify-center">
                    <RankChangeIndicator change={entry.change} />
                  </div>

                  {/* Credits earned */}
                  <div className="w-24 text-right">
                    <p
                      className="text-lg font-bold text-yellow-400"
                    >
                      {formatCredits(entry.creditsEarned)}
                    </p>
                    <p className="text-xs text-gray-500">RC</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
