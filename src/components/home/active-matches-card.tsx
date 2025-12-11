'use client';

import { useRouter } from 'next/navigation';
import { Clock, Swords, Eye } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { matches } from '@/data/dummy';
import { formatTimeAgo } from '@/lib/utils';

export function ActiveMatchesCard() {
  const router = useRouter();
  const activeMatches = matches.filter(m => m.status === 'in_progress');

  const handleSpectate = (matchId: string) => {
    router.push(`/match/${matchId}?spectate=true`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-red-400" />
          <h3 className="font-bold text-white">Active Matches</h3>
        </div>
        <Badge variant="danger" size="sm" glow>
          {activeMatches.length} LIVE
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeMatches.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No active matches
          </p>
        ) : (
          activeMatches.slice(0, 3).map((match) => {
            const player1 = match.player1;
            const player2 = match.player2;

            return (
              <div
                key={match.id}
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="default" size="sm">{match.type}</Badge>
                  {match.startedAt && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      Started {formatTimeAgo(match.startedAt)}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  {/* Player 1 */}
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={player1.avatar}
                      name={player1.username}
                      size="sm"
                      className="border-2 border-gray-800"
                    />
                    <span className="text-sm text-white font-medium">{player1.username}</span>
                  </div>

                  {/* VS */}
                  <span className="text-xs font-bold text-gray-500 px-3">VS</span>

                  {/* Player 2 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{player2.username}</span>
                    <Avatar
                      src={player2.avatar}
                      name={player2.username}
                      size="sm"
                      className="border-2 border-gray-800"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => handleSpectate(match.id)}
                >
                  <Eye className="w-4 h-4" />
                  Spectate
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
