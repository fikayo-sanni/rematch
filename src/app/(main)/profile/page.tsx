'use client';

import { useState } from 'react';
import {
  User,
  Trophy,
  Swords,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit2,
  Camera,
  Award,
  Target,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app.store';
import { guilds } from '@/data/dummy';
import { formatCredits } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Mock achievements
const achievements = [
  { id: '1', name: 'First Blood', description: 'Win your first match', icon: '🎯', unlocked: true },
  { id: '2', name: 'On Fire', description: 'Win 5 matches in a row', icon: '🔥', unlocked: true },
  { id: '3', name: 'Diamond Hunter', description: 'Reach Diamond rank', icon: '💎', unlocked: true },
  { id: '4', name: 'Century', description: 'Play 100 matches', icon: '💯', unlocked: true },
  { id: '5', name: 'Champion', description: 'Win a tournament', icon: '🏆', unlocked: false },
  { id: '6', name: 'Legend', description: 'Reach #1 on rankboard', icon: '👑', unlocked: false },
];

type ProfileTab = 'overview' | 'achievements' | 'match-history';

export default function ProfilePage() {
  const { user, joinedGuildIds } = useAppStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  if (!user) return null;

  const joinedGuilds = guilds.filter(g => joinedGuildIds.includes(g.id));
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Mock stats for profile display (would come from API in real app)
  const stats = {
    wins: 156,
    losses: 89,
    winStreak: 12,
    highestRank: 'Diamond I',
    tournamentWins: 3,
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-violet-600 to-purple-600 relative">
          <button className="absolute top-4 right-4 p-2 bg-black/20 rounded-lg text-white/80 hover:text-white hover:bg-black/30 transition-colors">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Profile info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative">
              <Avatar
                src={user.avatar}
                alt={user.username}
                fallback={user.username}
                size="xl"
                className="border-4 border-gray-900"
              />
              <button className="absolute bottom-0 right-0 p-1.5 bg-gray-800 rounded-full border-2 border-gray-900 text-gray-400 hover:text-white transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                <Badge variant="default">Level {user.level}</Badge>
              </div>
              <p className="text-gray-400">{user.bio || 'No bio yet'}</p>
            </div>

            <Button variant="secondary">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-gray-800/50 rounded-xl text-center">
              <p className="text-2xl font-bold text-white">{stats.wins}</p>
              <p className="text-sm text-gray-400">Wins</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl text-center">
              <p className="text-2xl font-bold text-white">{stats.losses}</p>
              <p className="text-sm text-gray-400">Losses</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-400">
                {((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-400">Win Rate</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {formatCredits(user.credits.rc)}
              </p>
              <p className="text-sm text-gray-400">RC Earned</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-900 rounded-xl p-1 w-fit">
        {[
          { key: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
          { key: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
          { key: 'match-history', label: 'Match History', icon: <Swords className="w-4 h-4" /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as ProfileTab)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all',
              activeTab === key
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guilds */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h3 className="font-bold text-white">Joined Guilds</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {joinedGuilds.map((guild) => (
                <div
                  key={guild.id}
                  className="flex items-center gap-4 p-3 bg-gray-800/300  rounded-lg"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold"
                    style={{
                      backgroundColor: `${guild.accentColor}20`,
                      color: guild.accentColor,
                    }}
                  >
                    {guild.name.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{guild.name}</p>
                    <p className="text-sm text-gray-400">
                      Rank #42 • Diamond III
                    </p>
                  </div>
                  <Badge variant="default">
                    156 matches
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Best Performance
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Longest Win Streak</span>
                  <span className="font-bold text-white">12 wins</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Highest Rank</span>
                  <span className="font-bold text-cyan-400">Diamond I</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tournament Wins</span>
                  <span className="font-bold text-yellow-400">3</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Account Info
                </h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Play Time</span>
                  <span className="text-white">248 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <Badge variant="success" size="sm">Online</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              {unlockedCount} of {achievements.length} achievements unlocked
            </p>
            <div className="h-2 w-48 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={cn(
                  'transition-opacity',
                  !achievement.unlocked && 'opacity-50'
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
                        achievement.unlocked
                          ? 'bg-violet-500/20'
                          : 'bg-gray-800 grayscale'
                      )}
                    >
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{achievement.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <Badge variant="success" size="sm" className="mt-2">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'match-history' && (
        <Card>
          <CardHeader>
            <h3 className="font-bold text-white">Recent Matches</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-800">
              {Array.from({ length: 10 }).map((_, i) => {
                const isWin = Math.random() > 0.4;
                return (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center justify-between p-4',
                      isWin ? 'bg-green-500/5' : 'bg-red-500/5'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center font-bold',
                          isWin
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        )}
                      >
                        {isWin ? 'W' : 'L'}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          vs Player{Math.floor(Math.random() * 1000)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="default" size="sm">1v1</Badge>
                          <span className="text-xs text-gray-500">
                            {Math.floor(Math.random() * 10 + 3)}m {Math.floor(Math.random() * 60)}s
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {Math.floor(Math.random() * 24) + 1}h ago
                      </p>
                      <p className={cn(
                        'text-sm font-medium',
                        isWin ? 'text-green-400' : 'text-red-400'
                      )}>
                        {isWin ? '+' : '-'}{Math.floor(Math.random() * 30 + 10)} pts
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
