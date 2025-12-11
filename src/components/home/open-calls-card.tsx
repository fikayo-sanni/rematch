'use client';

import { Crosshair, Clock, Coins, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { calls } from '@/data/dummy';
import { formatTimeRemaining, formatCredits } from '@/lib/utils';

export function OpenCallsCard() {
  const openCalls = calls.filter(c => c.status === 'pending');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-orange-400" />
          <h3 className="font-bold text-white">Open Challenges</h3>
        </div>
        <Link
          href="/calls"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {openCalls.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm mb-3">No open challenges right now</p>
            <Button variant="secondary" size="sm">
              Send a Challenge
            </Button>
          </div>
        ) : (
          openCalls.slice(0, 3).map((call) => {
            const challenger = call.challenger;

            return (
              <div
                key={call.id}
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-400/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={challenger.avatar}
                      name={challenger.username}
                      size="sm"
                    />
                    <div>
                      <p className="font-medium text-white text-sm">
                        {challenger.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        Level {challenger.level}
                      </p>
                    </div>
                  </div>
                  <Badge variant="warning" size="sm">
                    {call.edition.name}
                  </Badge>
                </div>

                {call.message && (
                  <p className="text-sm text-gray-400 mb-3 italic">
                    "{call.message}"
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeRemaining(call.expiresAt)}
                    </div>
                    {call.creditPot > 0 && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Coins className="w-3 h-3" />
                        {formatCredits(call.creditPot)} RC
                      </div>
                    )}
                  </div>
                  <Button variant="primary" size="sm">
                    Accept
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
