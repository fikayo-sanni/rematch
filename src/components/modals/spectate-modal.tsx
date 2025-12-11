'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Eye, Users, Clock, Search, Play, TrendingUp, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { matches, users } from '@/data/dummy';
import { useActiveGuild } from '@/stores/app.store';
import { cn } from '@/lib/utils';

interface SpectateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LiveMatch {
  id: string;
  player1: typeof users[0];
  player2: typeof users[0];
  score1: number;
  score2: number;
  viewers: number;
  duration: string;
  isHot?: boolean;
}

// Simulated live matches
const liveMatches: LiveMatch[] = [
  {
    id: 'live-1',
    player1: users[0],
    player2: users[1],
    score1: 2,
    score2: 1,
    viewers: 156,
    duration: '32:15',
    isHot: true,
  },
  {
    id: 'live-2',
    player1: users[2],
    player2: users[3],
    score1: 0,
    score2: 0,
    viewers: 43,
    duration: '05:30',
  },
  {
    id: 'live-3',
    player1: users[4] || users[0],
    player2: users[5] || users[1],
    score1: 3,
    score2: 3,
    viewers: 89,
    duration: '67:45',
    isHot: true,
  },
  {
    id: 'live-4',
    player1: users[1],
    player2: users[3],
    score1: 1,
    score2: 2,
    viewers: 24,
    duration: '41:20',
  },
];

export function SpectateModal({ isOpen, onClose }: SpectateModalProps) {
  const router = useRouter();
  const activeGuild = useActiveGuild();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'viewers' | 'recent'>('viewers');

  if (!isOpen) return null;

  const filteredMatches = liveMatches
    .filter(match =>
      match.player1.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.player2.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'viewers') return b.viewers - a.viewers;
      return 0; // Recent would use timestamp
    });

  const handleSpectate = (matchId: string) => {
    onClose();
    // Navigate to match page with spectate mode
    router.push(`/match/${matchId}?spectate=true`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: activeGuild?.accentColor + '20' }}
            >
              <Eye className="w-5 h-5" style={{ color: activeGuild?.accentColor }} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Spectate Matches</h2>
              <p className="text-xs sm:text-sm text-gray-400">Watch live games in progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by player name..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-1 bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setSortBy('viewers')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  sortBy === 'viewers'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Popular</span>
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  sortBy === 'recent'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Recent</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Stats */}
        <div className="px-4 sm:px-6 py-3 bg-gray-800/30 border-b border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-gray-400">
                <span className="text-white font-medium">{liveMatches.length}</span> matches live
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Eye className="w-4 h-4" />
              <span className="text-white font-medium">
                {liveMatches.reduce((acc, m) => acc + m.viewers, 0)}
              </span>
              <span>watching</span>
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Live Matches</h3>
              <p className="text-gray-400">
                {searchQuery
                  ? 'No matches found for your search'
                  : 'Check back later for live games'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMatches.map((match) => (
                <Card
                  key={match.id}
                  hover
                  className={cn(
                    'cursor-pointer transition-all',
                    match.isHot && 'border-orange-500/30'
                  )}
                  onClick={() => handleSpectate(match.id)}
                >
                  <div className="p-4">
                    {/* Hot badge */}
                    {match.isHot && (
                      <div className="flex items-center gap-1 text-orange-400 text-xs font-medium mb-3">
                        <Flame className="w-3 h-3" />
                        Trending Match
                      </div>
                    )}

                    {/* Players & Score */}
                    <div className="flex items-center justify-between gap-4">
                      {/* Player 1 */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar
                          src={match.player1.avatar}
                          name={match.player1.username}
                          size="md"
                          isOnline
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{match.player1.username}</p>
                          <p className="text-xs text-gray-500">Lvl {match.player1.level}</p>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-2 px-4">
                        <span className={cn(
                          'text-2xl font-bold',
                          match.score1 > match.score2 ? 'text-green-400' : 'text-white'
                        )}>
                          {match.score1}
                        </span>
                        <span className="text-gray-600">-</span>
                        <span className={cn(
                          'text-2xl font-bold',
                          match.score2 > match.score1 ? 'text-green-400' : 'text-white'
                        )}>
                          {match.score2}
                        </span>
                      </div>

                      {/* Player 2 */}
                      <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                        <div className="min-w-0 text-right">
                          <p className="font-medium text-white truncate">{match.player2.username}</p>
                          <p className="text-xs text-gray-500">Lvl {match.player2.level}</p>
                        </div>
                        <Avatar
                          src={match.player2.avatar}
                          name={match.player2.username}
                          size="md"
                          isOnline
                        />
                      </div>
                    </div>

                    {/* Match stats */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{match.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{match.viewers} watching</span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">
                        <Play className="w-4 h-4" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
