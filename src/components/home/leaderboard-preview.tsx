'use client';

import { Trophy, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { rankboard } from '@/data/dummy';
import { useActiveGuild } from '@/stores/app.store';
import { formatCredits } from '@/lib/utils';
import { cn } from '@/lib/utils';

function RankChangeIndicator({ change }: { change: number }) {
  if (change > 0) {
    return (
      <div className="flex items-center gap-0.5 text-green-400 text-xs">
        <TrendingUp className="w-3 h-3" />
        <span>{change}</span>
      </div>
    );
  }
  if (change < 0) {
    return (
      <div className="flex items-center gap-0.5 text-red-400 text-xs">
        <TrendingDown className="w-3 h-3" />
        <span>{Math.abs(change)}</span>
      </div>
    );
  }
  return <Minus className="w-3 h-3 text-gray-500" />;
}

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'text-yellow-400';
    case 2:
      return 'text-gray-300';
    case 3:
      return 'text-amber-600';
    default:
      return 'text-gray-500';
  }
}

export function LeaderboardPreview() {
  const activeGuild = useActiveGuild();
  const topPlayers = rankboard.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="font-bold text-white">Top Players</h3>
        </div>
        <Link
          href="/rankboard"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {topPlayers.map((entry, index) => {
          const user = entry.user;

          return (
            <div
              key={user.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-colors',
                index === 0
                  ? 'bg-yellow-400/10 border border-yellow-400/20'
                  : 'bg-gray-800/30  hover:bg-gray-800/50'
              )}
            >
              {/* Rank */}
              <span
                className={cn(
                  'w-6 text-center font-bold',
                  getRankColor(entry.rank)
                )}
              >
                {entry.rank}
              </span>

              {/* Avatar */}
              <Avatar
                src={user.avatar}
                name={user.username}
                size="sm"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{user.username}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {entry.wins}W / {entry.losses}L
                  </span>
                  <RankChangeIndicator change={entry.change} />
                </div>
              </div>

              {/* Credits */}
              <div className="text-right">
                <p
                  className="font-bold text-yellow-400"
                >
                  {formatCredits(entry.creditsEarned)}
                </p>
                <p className="text-xs text-gray-500">RC</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
