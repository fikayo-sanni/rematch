'use client';

import { useState } from 'react';
import { Trophy, Users, Clock, Coins, Plus, ChevronRight, Crown, Medal } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreateLeagueModal } from '@/components/modals/create-league-modal';
import { leagues } from '@/data/dummy';
import { useActiveGuild, useAppStore } from '@/stores/app.store';
import { formatTimeRemaining, formatCredits } from '@/lib/utils';
import { LeagueStatus } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type LeagueFilter = 'all' | 'active' | 'upcoming' | 'completed' | 'mine';

export default function LeaguesPage() {
  const activeGuild = useActiveGuild();
  const { user } = useAppStore();
  const [filter, setFilter] = useState<LeagueFilter>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredLeagues = leagues.filter((league) => {
    if (filter === 'all') return true;
    if (filter === 'mine') return league.isJoined;
    return league.status === filter;
  });

  const getStatusBadge = (status: LeagueStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm" glow>Live</Badge>;
      case 'upcoming':
        return <Badge variant="warning" size="sm">Starting Soon</Badge>;
      case 'completed':
        return <Badge variant="default" size="sm">Finished</Badge>;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy
              className="w-8 h-8"
              style={{ color: activeGuild?.accentColor }}
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Mini Leagues</h1>
              <p className="text-gray-400">Create or join competitive leagues</p>
            </div>
          </div>

          <Button variant="glow" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Create League
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-gray-900 rounded-xl p-1 w-fit">
        {[
          { key: 'all', label: 'All Leagues' },
          { key: 'active', label: 'Live' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'mine', label: 'My Leagues' },
          { key: 'completed', label: 'Finished' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as LeagueFilter)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-all',
              filter === key
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {label}
          </button>
        ))}
        </div>

        {/* Leagues Grid */}
        {filteredLeagues.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Leagues Found</h3>
              <p className="text-gray-400 mb-6">
                {filter === 'mine'
                  ? "You haven't joined any leagues yet"
                  : 'No leagues available in this category'}
              </p>
              <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Create a League
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredLeagues.map((league) => (
            <Card
              key={league.id}
              hover
              className={cn(
                league.status === 'active' && 'border-green-500/20',
                league.isJoined && 'border-violet-500/20'
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-lg">{league.name}</h3>
                      {league.isJoined && (
                        <Badge variant="default" size="sm">Joined</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{league.description}</p>
                  </div>
                  {getStatusBadge(league.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Creator */}
                <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <Avatar
                    src={league.creator.avatar}
                    name={league.creator.username}
                    size="sm"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Created by</p>
                    <p className="font-medium text-white">{league.creator.username}</p>
                  </div>
                  <Badge variant="default" size="sm">{league.edition.name}</Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-white">
                      {league.participantCount}/{league.maxParticipants}
                    </p>
                    <p className="text-xs text-gray-500">Players</p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <Coins className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-yellow-400">
                      {formatCredits(league.prizePool)}
                    </p>
                    <p className="text-xs text-gray-500">Prize Pool</p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                    <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-white">
                      {league.matchesPerPlayer}
                    </p>
                    <p className="text-xs text-gray-500">Matches</p>
                  </div>
                </div>

                {/* Entry fee */}
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-sm text-gray-400">Entry Fee</span>
                  <span className="font-bold text-white">
                    {league.entryFee > 0 ? `${formatCredits(league.entryFee)} credits` : 'Free'}
                  </span>
                </div>

                {/* Standings preview for active/completed */}
                {league.standings && league.standings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-400">Standings</p>
                    {league.standings.slice(0, 3).map((standing, index) => (
                      <div
                        key={standing.user.id}
                        className={cn(
                          'flex items-center gap-3 p-2 rounded-lg',
                          index === 0 && 'bg-yellow-500/10',
                          standing.user.id === user?.id && 'bg-violet-500/10'
                        )}
                      >
                        <span className={cn(
                          'w-6 text-center font-bold',
                          index === 0 && 'text-yellow-400',
                          index === 1 && 'text-gray-300',
                          index === 2 && 'text-amber-600'
                        )}>
                          {index + 1}
                        </span>
                        <Avatar
                          src={standing.user.avatar}
                          name={standing.user.username}
                          size="xs"
                        />
                        <span className={cn(
                          'flex-1 text-sm',
                          standing.user.id === user?.id ? 'text-violet-400' : 'text-white'
                        )}>
                          {standing.user.username}
                        </span>
                        <span className="text-sm text-gray-400">
                          {standing.wins}W {standing.draws}D {standing.losses}L
                        </span>
                        <span className="font-bold text-white">{standing.points} pts</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Winner for completed leagues */}
                {league.status === 'completed' && league.winner && (
                  <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    <Avatar
                      src={league.winner.avatar}
                      name={league.winner.username}
                      size="md"
                    />
                    <div>
                      <p className="text-xs text-yellow-400">Champion</p>
                      <p className="font-bold text-white">{league.winner.username}</p>
                    </div>
                    <Medal className="w-5 h-5 text-yellow-400 ml-auto" />
                  </div>
                )}

                {/* Time info */}
                {league.status === 'upcoming' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Starts in</span>
                    <span className="text-white font-medium">
                      {formatTimeRemaining(league.startsAt)}
                    </span>
                  </div>
                )}
                {league.status === 'active' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Ends in</span>
                    <span className="text-white font-medium">
                      {formatTimeRemaining(league.endsAt)}
                    </span>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                {league.status === 'upcoming' && !league.isJoined && (
                  <Button variant="primary" className="w-full">
                    Join League ({formatCredits(league.entryFee)} credits)
                  </Button>
                )}
                {league.status === 'upcoming' && league.isJoined && (
                  <Link href={`/leagues/${league.id}`} className="w-full">
                    <Button variant="secondary" className="w-full">
                      View League
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                {league.status === 'active' && league.isJoined && (
                  <Link href={`/leagues/${league.id}`} className="w-full">
                    <Button variant="primary" className="w-full">
                      Enter League Room
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                {league.status === 'active' && !league.isJoined && (
                  <Link href={`/leagues/${league.id}`} className="w-full">
                    <Button variant="ghost" className="w-full">
                      View Standings
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                {league.status === 'completed' && (
                  <Link href={`/leagues/${league.id}`} className="w-full">
                    <Button variant="ghost" className="w-full">
                      View Final Results
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
          </div>
        )}

        {/* Create League Modal */}
        <CreateLeagueModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  );
}
