'use client';

import { BarChart3, TrendingUp, TrendingDown, Trophy, Swords, Clock, Target } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useActiveGuild, useAppStore } from '@/stores/app.store';
import { cn } from '@/lib/utils';

// Mock stats data
const playerStats = {
  totalMatches: 247,
  wins: 156,
  losses: 91,
  winStreak: 5,
  bestWinStreak: 12,
  avgMatchDuration: '8m 32s',
  totalPlayTime: '124h 15m',
  rank: {
    current: 'Diamond III',
    peak: 'Diamond I',
    points: 2847,
  },
  recentMatches: [
    { result: 'win', opponent: 'ProGamer99', matchType: '1v1', duration: '6m 45s' },
    { result: 'win', opponent: 'ShadowNinja', matchType: '1v1', duration: '9m 12s' },
    { result: 'loss', opponent: 'ElitePlayer', matchType: '1v1', duration: '4m 33s' },
    { result: 'win', opponent: 'GameMaster', matchType: '1v1', duration: '11m 08s' },
    { result: 'win', opponent: 'NightHawk', matchType: '1v1', duration: '7m 21s' },
  ],
  byMatchType: {
    '1v1': { wins: 89, losses: 45 },
    '2v2': { wins: 42, losses: 28 },
    '3v3': { wins: 18, losses: 12 },
    '5v5': { wins: 7, losses: 6 },
  },
};

function StatCard({
  icon,
  label,
  value,
  subValue,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-gray-800">
            {icon}
          </div>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-sm',
              trend === 'up' && 'text-green-400',
              trend === 'down' && 'text-red-400',
              trend === 'neutral' && 'text-gray-400'
            )}>
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : null}
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
          {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatsPage() {
  const activeGuild = useActiveGuild();
  const { user } = useAppStore();

  const winRate = ((playerStats.wins / playerStats.totalMatches) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3
          className="w-8 h-8"
          style={{ color: activeGuild?.accentColor }}
        />
        <div>
          <h1 className="text-2xl font-bold text-white">My Stats</h1>
          <p className="text-gray-400">Your performance in {activeGuild?.name}</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Swords className="w-5 h-5 text-violet-400" />}
          label="Total Matches"
          value={playerStats.totalMatches}
          trend="up"
        />
        <StatCard
          icon={<Target className="w-5 h-5 text-green-400" />}
          label="Win Rate"
          value={`${winRate}%`}
          subValue={`${playerStats.wins}W - ${playerStats.losses}L`}
          trend="up"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5 text-yellow-400" />}
          label="Current Streak"
          value={`${playerStats.winStreak}W`}
          subValue={`Best: ${playerStats.bestWinStreak}W`}
          trend="up"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-blue-400" />}
          label="Play Time"
          value={playerStats.totalPlayTime}
          subValue={`Avg: ${playerStats.avgMatchDuration}/match`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rank Card */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Rank Progress
            </h3>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/30 mb-4">
                <span className="text-3xl">💎</span>
              </div>
              <h4 className="text-2xl font-bold text-cyan-400">{playerStats.rank.current}</h4>
              <p className="text-gray-400 mt-1">
                {playerStats.rank.points.toLocaleString()} points
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">Peak Rank</p>
                <p className="font-bold text-white">{playerStats.rank.peak}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">To Next Rank</p>
                <p className="font-bold text-white">153 pts</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: '72%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Diamond III</span>
                <span>Diamond II</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Type Breakdown */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-400" />
              By Match Type
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(playerStats.byMatchType).map(([type, stats]) => {
              const total = stats.wins + stats.losses;
              const wr = ((stats.wins / total) * 100).toFixed(0);

              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" size="sm">{type}</Badge>
                      <span className="text-sm text-gray-400">{total} matches</span>
                    </div>
                    <span className={cn(
                      'text-sm font-medium',
                      parseInt(wr) >= 50 ? 'text-green-400' : 'text-red-400'
                    )}>
                      {wr}% WR
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${wr}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="text-green-400">{stats.wins}W</span>
                    <span className="text-red-400">{stats.losses}L</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-white">Recent Matches</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-800">
            {playerStats.recentMatches.map((match, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-4',
                  match.result === 'win' ? 'bg-green-500/5' : 'bg-red-500/5'
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center font-bold',
                      match.result === 'win'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    )}
                  >
                    {match.result === 'win' ? 'W' : 'L'}
                  </div>
                  <div>
                    <p className="font-medium text-white">vs {match.opponent}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" size="sm">{match.matchType}</Badge>
                      <span className="text-xs text-gray-500">{match.duration}</span>
                    </div>
                  </div>
                </div>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
