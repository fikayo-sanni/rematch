'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Trophy,
  Users,
  Clock,
  Coins,
  ChevronRight,
  Crown,
  Medal,
  Calendar,
  Play,
  ArrowLeft,
  Swords,
  Star
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VoiceChat } from '@/components/match/voice-chat';
import { leagues, users, currentUser } from '@/data/dummy';
import { useAppStore } from '@/stores/app.store';
import { formatTimeRemaining, formatCredits } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type TabType = 'standings' | 'matches' | 'highlights';

// Simulated league matches data
const leagueMatches = [
  {
    id: 'lm-001',
    player1: currentUser,
    player2: users[1],
    score1: 3,
    score2: 1,
    status: 'completed' as const,
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    highlight: 'https://example.com/highlight1',
  },
  {
    id: 'lm-002',
    player1: users[2],
    player2: currentUser,
    score1: 2,
    score2: 2,
    status: 'completed' as const,
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: 'lm-003',
    player1: currentUser,
    player2: users[3],
    status: 'scheduled' as const,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
  },
  {
    id: 'lm-004',
    player1: users[4],
    player2: currentUser,
    status: 'scheduled' as const,
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: 'lm-005',
    player1: users[1],
    player2: users[2],
    score1: 4,
    score2: 0,
    status: 'completed' as const,
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    highlight: 'https://example.com/highlight2',
  },
];

export default function LeagueDetailPage() {
  const params = useParams();
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('standings');

  // Find the league
  const league = leagues.find(l => l.id === params.id) || leagues[0];

  // Filter matches for different views
  const myMatches = leagueMatches.filter(
    m => m.player1.id === user?.id || m.player2.id === user?.id
  );
  const upcomingMatches = myMatches.filter(m => m.status === 'scheduled');
  const completedMatches = myMatches.filter(m => m.status === 'completed');
  const highlightMatches = leagueMatches.filter(m => m.highlight);

  const formatMatchTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) {
      // Past match
      const days = Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24)));
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      return `${days} days ago`;
    }

    // Future match
    return formatTimeRemaining(date);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/leagues" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Leagues
      </Link>

      {/* League Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main League Info */}
        <div className="flex-1">
          <Card className={cn(
            league.status === 'active' && 'border-green-500/30',
            league.status === 'upcoming' && 'border-yellow-500/30'
          )}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className={cn(
                      "w-8 h-8",
                      league.status === 'active' ? "text-green-400" : "text-yellow-400"
                    )} />
                    <h1 className="text-2xl font-bold text-white">{league.name}</h1>
                    {league.status === 'active' && (
                      <Badge variant="success" size="sm" glow>Live</Badge>
                    )}
                    {league.status === 'upcoming' && (
                      <Badge variant="warning" size="sm">Starting Soon</Badge>
                    )}
                  </div>
                  <p className="text-gray-400">{league.description}</p>
                </div>
              </div>

              {/* League Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-gray-800/50 rounded-xl text-center">
                  <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">
                    {league.participantCount}/{league.maxParticipants}
                  </p>
                  <p className="text-xs text-gray-500">Players</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl text-center">
                  <Coins className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-yellow-400">
                    {formatCredits(league.prizePool)}
                  </p>
                  <p className="text-xs text-gray-500">Prize Pool</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl text-center">
                  <Swords className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">
                    {league.matchesPerPlayer}
                  </p>
                  <p className="text-xs text-gray-500">Matches Each</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl text-center">
                  <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">
                    {league.status === 'active'
                      ? formatTimeRemaining(league.endsAt)
                      : formatTimeRemaining(league.startsAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {league.status === 'active' ? 'Ends in' : 'Starts in'}
                  </p>
                </div>
              </div>

              {/* Creator */}
              <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl">
                <Avatar src={league.creator.avatar} name={league.creator.username} size="md" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Created by</p>
                  <p className="font-medium text-white">{league.creator.username}</p>
                </div>
                <Badge variant="default" size="sm">{league.edition.name}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Chatterbox */}
        <div className="lg:w-72 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <h3 className="font-bold text-white">League Room</h3>
              <p className="text-xs text-gray-500">Chat with other participants</p>
            </CardHeader>
            <CardContent>
              <VoiceChat
                matchId={`league-${league.id}`}
                username={user?.username || 'Guest'}
                className="h-36"
              />
            </CardContent>
          </Card>

          {/* My Next Match */}
          {upcomingMatches.length > 0 && (
            <Card className="border-orange-500/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <h3 className="font-bold text-white">My Next Match</h3>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const match = upcomingMatches[0];
                  const opponent = match.player1.id === user?.id ? match.player2 : match.player1;
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={opponent.avatar} name={opponent.username} size="md" />
                        <div>
                          <p className="font-medium text-white">{opponent.username}</p>
                          <p className="text-xs text-gray-500">Level {opponent.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Starts in</span>
                        <span className="text-orange-400 font-bold">
                          {formatMatchTime(match.scheduledAt)}
                        </span>
                      </div>
                      <Button variant="primary" className="w-full" size="sm">
                        <Play className="w-4 h-4" />
                        Join Match
                      </Button>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-900 rounded-xl p-1 w-fit">
        {[
          { key: 'standings', label: 'Standings', icon: Trophy },
          { key: 'matches', label: 'My Matches', icon: Swords },
          { key: 'highlights', label: 'Highlights', icon: Star },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as TabType)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all',
              activeTab === key
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'standings' && league.standings && (
        <Card>
          <CardHeader>
            <h3 className="font-bold text-white">League Standings</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-gray-500 border-b border-gray-800">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Player</div>
                <div className="col-span-2 text-center">W-D-L</div>
                <div className="col-span-2 text-center">GD</div>
                <div className="col-span-2 text-right">Pts</div>
              </div>

              {/* Standings rows */}
              {league.standings.map((standing, index) => (
                <div
                  key={standing.user.id}
                  className={cn(
                    'grid grid-cols-12 gap-2 px-3 py-3 rounded-lg items-center',
                    index === 0 && 'bg-yellow-500/10',
                    index === 1 && 'bg-gray-400/10',
                    index === 2 && 'bg-amber-600/10',
                    standing.user.id === user?.id && 'bg-violet-500/10 border border-violet-500/20'
                  )}
                >
                  <div className="col-span-1">
                    {index === 0 && <Crown className="w-5 h-5 text-yellow-400" />}
                    {index === 1 && <Medal className="w-5 h-5 text-gray-300" />}
                    {index === 2 && <Medal className="w-5 h-5 text-amber-600" />}
                    {index > 2 && <span className="text-gray-400 font-medium">{index + 1}</span>}
                  </div>
                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar src={standing.user.avatar} name={standing.user.username} size="sm" />
                    <div>
                      <p className={cn(
                        'font-medium',
                        standing.user.id === user?.id ? 'text-violet-400' : 'text-white'
                      )}>
                        {standing.user.username}
                        {standing.user.id === user?.id && <span className="text-xs ml-1">(You)</span>}
                      </p>
                      <p className="text-xs text-gray-500">Lvl {standing.user.level}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm text-gray-300">
                    {standing.wins}-{standing.draws}-{standing.losses}
                  </div>
                  <div className="col-span-2 text-center text-sm">
                    <span className={cn(
                      (standing.wins - standing.losses) > 0 ? 'text-green-400' :
                      (standing.wins - standing.losses) < 0 ? 'text-red-400' : 'text-gray-400'
                    )}>
                      {(standing.wins - standing.losses) > 0 ? '+' : ''}{standing.wins - standing.losses}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-bold text-white">{standing.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'matches' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Matches */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-400" />
                <h3 className="font-bold text-white">Upcoming Matches</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMatches.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming matches</p>
              ) : (
                upcomingMatches.map((match) => {
                  const opponent = match.player1.id === user?.id ? match.player2 : match.player1;
                  return (
                    <div
                      key={match.id}
                      className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={opponent.avatar} name={opponent.username} size="md" />
                          <div>
                            <p className="font-medium text-white">vs {opponent.username}</p>
                            <p className="text-xs text-gray-500">Level {opponent.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-orange-400 font-bold text-sm">
                            {formatMatchTime(match.scheduledAt)}
                          </p>
                        </div>
                      </div>
                      <Button variant="primary" className="w-full" size="sm">
                        <Play className="w-4 h-4" />
                        Join Match
                      </Button>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Completed Matches */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-white">Completed Matches</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedMatches.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No completed matches yet</p>
              ) : (
                completedMatches.map((match) => {
                  const opponent = match.player1.id === user?.id ? match.player2 : match.player1;
                  const myScore = match.player1.id === user?.id ? match.score1 : match.score2;
                  const oppScore = match.player1.id === user?.id ? match.score2 : match.score1;
                  const isWin = myScore! > oppScore!;
                  const isDraw = myScore === oppScore;

                  return (
                    <div
                      key={match.id}
                      className={cn(
                        "p-4 rounded-xl",
                        isWin ? "bg-green-500/10 border border-green-500/20" :
                        isDraw ? "bg-gray-800/50" :
                        "bg-red-500/10 border border-red-500/20"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar src={opponent.avatar} name={opponent.username} size="md" />
                          <div>
                            <p className="font-medium text-white">vs {opponent.username}</p>
                            <p className="text-xs text-gray-500">{formatMatchTime(match.scheduledAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "font-bold text-lg",
                            isWin ? "text-green-400" :
                            isDraw ? "text-gray-400" :
                            "text-red-400"
                          )}>
                            {myScore} - {oppScore}
                          </p>
                          <Badge
                            variant={isWin ? "success" : isDraw ? "default" : "danger"}
                            size="sm"
                          >
                            {isWin ? "Win" : isDraw ? "Draw" : "Loss"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'highlights' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-white">Match Highlights</h3>
            </div>
          </CardHeader>
          <CardContent>
            {highlightMatches.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No highlights yet</p>
                <p className="text-sm text-gray-600">Exciting match moments will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlightMatches.map((match) => (
                  <div
                    key={match.id}
                    className="group relative aspect-video bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
                  >
                    {/* Placeholder thumbnail */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Match info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar src={match.player1.avatar} name={match.player1.username} size="xs" />
                          <span className="text-white text-sm font-medium">{match.player1.username}</span>
                        </div>
                        <span className="text-white font-bold">{match.score1} - {match.score2}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{match.player2.username}</span>
                          <Avatar src={match.player2.avatar} name={match.player2.username} size="xs" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{formatMatchTime(match.scheduledAt)}</p>
                    </div>

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
