'use client';

import { useState } from 'react';
import { Shuffle, Clock, Coins, X, Check, Zap } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { pulls } from '@/data/dummy';
import { useActiveGuild, useAppStore } from '@/stores/app.store';
import { formatTimeRemaining, formatCredits } from '@/lib/utils';
import { cn } from '@/lib/utils';

type PullFilter = 'all' | 'pending' | 'accepted' | 'expired' | 'declined';

export default function PullsPage() {
  const activeGuild = useActiveGuild();
  const { user } = useAppStore();
  const [filter, setFilter] = useState<PullFilter>('all');

  const filteredPulls = pulls.filter((pull) => {
    if (filter === 'all') return true;
    return pull.status === filter;
  });

  // Currently searching pull simulation
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shuffle
            className="w-8 h-8"
            style={{ color: activeGuild?.accentColor }}
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Quick Match</h1>
            <p className="text-gray-400">Find instant matches with similar players</p>
          </div>
        </div>

        <Button variant="glow" onClick={() => setIsSearching(!isSearching)}>
          <Zap className="w-4 h-4" />
          {isSearching ? 'Cancel Search' : 'Find Match'}
        </Button>
      </div>

      {/* Active Search Banner */}
      {isSearching && (
        <Card className="border-green-500/30 bg-green-500/5" glow>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shuffle className="w-8 h-8 text-green-400 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-green-500/30 animate-ping" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Searching for Match</h3>
                  <p className="text-gray-400 mt-1">Finding an opponent of similar skill level...</p>
                </div>
              </div>
              <Button variant="danger" size="lg" onClick={() => setIsSearching(false)}>
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>

            {/* Searching animation dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-1 bg-gray-900 rounded-xl p-1 w-fit">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'expired', label: 'Expired' },
          { key: 'declined', label: 'Declined' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as PullFilter)}
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

      {/* Pull History */}
      {filteredPulls.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Shuffle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Match History</h3>
            <p className="text-gray-400 mb-6">Start matchmaking to find opponents automatically</p>
            <Button variant="glow" onClick={() => setIsSearching(true)}>
              <Shuffle className="w-4 h-4" />
              Start Matchmaking
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPulls.map((pull) => {
            const opponent = pull.opponent;

            return (
              <Card
                key={pull.id}
                hover
                className={cn(
                  pull.status === 'pending' && 'border-yellow-500/20',
                  pull.status === 'accepted' && 'border-green-500/20',
                  pull.status === 'expired' && 'border-gray-700',
                  pull.status === 'declined' && 'border-red-500/20'
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        pull.status === 'pending' ? 'warning' :
                        pull.status === 'accepted' ? 'success' :
                        pull.status === 'declined' ? 'danger' : 'default'
                      }
                      size="sm"
                    >
                      {pull.status.charAt(0).toUpperCase() + pull.status.slice(1)}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {pull.edition.name}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Opponent */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar
                      src={opponent.avatar}
                      name={opponent.username}
                      size="lg"
                      isOnline={opponent.isOnline}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-white">{opponent.username}</p>
                      <p className="text-sm text-gray-400">Level {opponent.level}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    {pull.creditPot > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span>Credit Pot</span>
                        </div>
                        <span className="font-bold text-yellow-400">
                          {formatCredits(pull.creditPot)} RC
                        </span>
                      </div>
                    )}

                    {pull.status === 'pending' && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Expires</span>
                        </div>
                        <span className="text-white">
                          {formatTimeRemaining(pull.expiresAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  {pull.status === 'pending' ? (
                    <div className="flex gap-2 w-full">
                      <Button variant="success" className="flex-1">
                        <Check className="w-4 h-4" />
                        Accept
                      </Button>
                      <Button variant="danger" className="flex-1">
                        <X className="w-4 h-4" />
                        Decline
                      </Button>
                    </div>
                  ) : pull.status === 'accepted' ? (
                    <Button variant="primary" className="w-full">
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
