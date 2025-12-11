'use client';

import { useState } from 'react';
import { Crosshair, Plus, Clock, Coins, Users, Search } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UpcomingMatchesCard } from '@/components/home/upcoming-matches-card';
import { calls } from '@/data/dummy';
import { useActiveGuild, useAppStore } from '@/stores/app.store';
import { formatTimeRemaining, formatCredits } from '@/lib/utils';
import { cn } from '@/lib/utils';

type CallFilter = 'all' | 'open' | 'mine';

export default function CallsPage() {
  const activeGuild = useActiveGuild();
  const { user } = useAppStore();
  const [filter, setFilter] = useState<CallFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalls = calls.filter((call) => {
    const matchesSearch = call.challenger.username.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'open') return call.status === 'pending' && matchesSearch;
    if (filter === 'mine') return call.challenger.id === user?.id && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Upcoming Matches Banner */}
      <UpcomingMatchesCard variant="banner" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crosshair
            className="w-8 h-8"
            style={{ color: activeGuild?.accentColor }}
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Challenges</h1>
            <p className="text-gray-400">Challenge specific players to a match</p>
          </div>
        </div>

        <Button variant="glow">
          <Plus className="w-4 h-4" />
          Send Challenge
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-gray-900 rounded-xl p-1">
          {[
            { key: 'all', label: 'All Challenges' },
            { key: 'open', label: 'Open' },
            { key: 'mine', label: 'My Challenges' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as CallFilter)}
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

      {/* Calls Grid */}
      {filteredCalls.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Crosshair className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Challenges Found</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'mine'
                ? "You haven't sent any challenges yet"
                : 'No open challenges at the moment'}
            </p>
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              Send a Challenge
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCalls.map((call) => {
            const challenger = call.challenger;
            const opponent = call.challenged;
            const isOwner = call.challenger.id === user?.id;

            return (
              <Card
                key={call.id}
                hover
                className={cn(
                  call.status === 'pending' && 'border-orange-500/20',
                  isOwner && 'border-violet-500/20'
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        call.status === 'pending' ? 'warning' :
                        call.status === 'accepted' ? 'success' :
                        call.status === 'declined' ? 'danger' : 'default'
                      }
                      size="sm"
                    >
                      {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Challenger */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar
                      src={challenger.avatar}
                      alt={challenger.username}
                      fallback={challenger.username}
                      size="lg"
                      isOnline={challenger.isOnline}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-white">
                        {challenger.username}
                        {isOwner && <span className="text-xs text-gray-500 ml-2">(You)</span>}
                      </p>
                      <p className="text-sm text-gray-400">Level {challenger.level}</p>
                    </div>
                  </div>

                  {/* Message */}
                  {call.message && (
                    <div className="p-3 bg-gray-800/50 rounded-lg mb-4">
                      <p className="text-sm text-gray-300 italic">"{call.message}"</p>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-2">
                    {call.creditPot > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span>Wager</span>
                        </div>
                        <span className="font-bold text-yellow-400">
                          {formatCredits(call.creditPot)} RC
                        </span>
                      </div>
                    )}

                    {call.status === 'pending' && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Expires</span>
                        </div>
                        <span className="text-white">
                          {formatTimeRemaining(call.expiresAt)}
                        </span>
                      </div>
                    )}

                    {opponent && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>Challenged</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={opponent.avatar}
                            alt={opponent.username}
                            fallback={opponent.username}
                            size="xs"
                          />
                          <span className="text-white">{opponent.username}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  {call.status === 'pending' && !isOwner ? (
                    <Button variant="primary" className="w-full">
                      Accept Challenge
                    </Button>
                  ) : call.status === 'pending' && isOwner ? (
                    <Button variant="danger" className="w-full">
                      Cancel Challenge
                    </Button>
                  ) : call.status === 'accepted' ? (
                    <Button variant="success" className="w-full">
                      Enter Match
                    </Button>
                  ) : (
                    <Button variant="ghost" className="w-full">
                      View Details
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
