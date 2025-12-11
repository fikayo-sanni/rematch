'use client';

import { Calendar, Clock, Trophy, Users, ChevronRight, Zap } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { runs } from '@/data/dummy';
import { useActiveGuild } from '@/stores/app.store';
import { formatTimeRemaining, formatCredits } from '@/lib/utils';
import { Run, RunType } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function getRunStatus(run: Run): 'active' | 'upcoming' | 'completed' {
  const now = new Date();
  const start = new Date(run.startsAt);
  const end = new Date(run.endsAt);

  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
}

function getStatusBadge(status: 'active' | 'upcoming' | 'completed') {
  switch (status) {
    case 'active':
      return <Badge variant="success" size="sm" glow>Active</Badge>;
    case 'upcoming':
      return <Badge variant="warning" size="sm">Upcoming</Badge>;
    case 'completed':
      return <Badge variant="default" size="sm">Completed</Badge>;
    default:
      return null;
  }
}

function getRunTypeLabel(type: RunType) {
  switch (type) {
    case 'daily': return 'Daily';
    case 'weekend': return 'Weekend';
    case 'crew': return 'Crew';
    case 'rank_push': return 'Rank Push';
    case 'special': return 'Special';
    default: return type;
  }
}

export default function RunsPage() {
  const activeGuild = useActiveGuild();

  const runsWithStatus = runs.map(run => ({
    ...run,
    status: getRunStatus(run)
  }));

  const activeRuns = runsWithStatus.filter(r => r.status === 'active');
  const upcomingRuns = runsWithStatus.filter(r => r.status === 'upcoming');
  const completedRuns = runsWithStatus.filter(r => r.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calendar
          className="w-8 h-8"
          style={{ color: activeGuild?.accentColor }}
        />
        <div>
          <h1 className="text-2xl font-bold text-white">Tournaments</h1>
          <p className="text-gray-400">Competitive events and seasons</p>
        </div>
      </div>

      {/* Active Runs */}
      {activeRuns.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-400" />
            Active Tournaments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRuns.map((run) => (
              <Card key={run.id} className="border-green-500/20" hover glow>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg">{run.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="default" size="sm">{getRunTypeLabel(run.type)}</Badge>
                        <span className="text-sm text-gray-400">{run.edition.name}</span>
                      </div>
                    </div>
                    {getStatusBadge(run.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                        <Clock className="w-4 h-4" />
                        Ends in
                      </div>
                      <p className="font-bold text-white">
                        {formatTimeRemaining(run.endsAt)}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                        <Users className="w-4 h-4" />
                        Participants
                      </div>
                      <p className="font-bold text-white">
                        {run.participantCount.toLocaleString()}
                        {run.maxParticipants && <span className="text-gray-500"> / {run.maxParticipants}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Credit pot */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/5 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-400">Prize Pool</span>
                      </div>
                      <span className="text-xl font-bold text-yellow-400">
                        {formatCredits(run.creditPot)} RC
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/runs/${run.id}`} className="w-full">
                    <Button
                      variant={run.isJoined ? "secondary" : "primary"}
                      className="w-full"
                    >
                      {run.isJoined ? 'Enter Tournament' : 'View Tournament'}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Runs */}
      {upcomingRuns.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Upcoming Tournaments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingRuns.map((run) => (
              <Card key={run.id} hover>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-white">{run.name}</h3>
                    {getStatusBadge(run.status)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" size="sm">{getRunTypeLabel(run.type)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Starts</span>
                      <span className="text-white">
                        {new Date(run.startsAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Prize Pool</span>
                      <span className="text-yellow-400 font-bold">
                        {formatCredits(run.creditPot)} RC
                      </span>
                    </div>
                    {run.maxParticipants && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Max Slots</span>
                        <span className="text-white">{run.maxParticipants}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/runs/${run.id}`} className="w-full">
                    <Button variant="secondary" className="w-full">
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Completed Runs */}
      {completedRuns.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gray-400" />
            Past Tournaments
          </h2>
          <div className="space-y-3">
            {completedRuns.map((run) => (
              <Card key={run.id} className="opacity-75 hover:opacity-100 transition-opacity">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-medium text-white">{run.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(run.startsAt).toLocaleDateString()} - {new Date(run.endsAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Participants</p>
                        <p className="font-bold text-white">{run.participantCount.toLocaleString()}</p>
                      </div>
                      <Link href={`/runs/${run.id}`}>
                        <Button variant="ghost" size="sm">
                          Results
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {runs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Tournaments Available</h3>
            <p className="text-gray-400">Check back later for competitive events</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
