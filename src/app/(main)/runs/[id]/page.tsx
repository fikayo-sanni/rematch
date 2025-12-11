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
  Star,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VoiceChat } from '@/components/match/voice-chat';
import { runs, users, currentUser } from '@/data/dummy';
import { useAppStore } from '@/stores/app.store';
import { formatTimeRemaining, formatCredits } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { User } from '@/types';

type TabType = 'bracket' | 'standings' | 'matches' | 'highlights';

interface BracketMatch {
  id: string;
  player1: User | null;
  player2: User | null;
  score1: number | null;
  score2: number | null;
  status: 'completed' | 'scheduled' | 'pending';
  winner?: User | null;
  scheduledAt?: Date;
}

interface BracketRound {
  name: string;
  matches: BracketMatch[];
}

// Simulated bracket data for knockout tournament
const bracketRounds: BracketRound[] = [
  {
    name: 'Quarter Finals',
    matches: [
      { id: 'qf1', player1: users[0], player2: users[1], score1: 3, score2: 1, status: 'completed' as const, winner: users[0] },
      { id: 'qf2', player1: users[2], player2: users[3], score1: 2, score2: 3, status: 'completed' as const, winner: users[3] },
      { id: 'qf3', player1: currentUser, player2: users[4], score1: 3, score2: 0, status: 'completed' as const, winner: currentUser },
      { id: 'qf4', player1: users[1], player2: users[2], score1: null, score2: null, status: 'scheduled' as const, scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 2) },
    ]
  },
  {
    name: 'Semi Finals',
    matches: [
      { id: 'sf1', player1: users[0], player2: users[3], score1: null, score2: null, status: 'scheduled' as const, scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24) },
      { id: 'sf2', player1: currentUser, player2: null, score1: null, score2: null, status: 'pending' as const },
    ]
  },
  {
    name: 'Final',
    matches: [
      { id: 'f1', player1: null, player2: null, score1: null, score2: null, status: 'pending' as const },
    ]
  }
];

// Simulated standings for group stage or leaderboard
const tournamentStandings = [
  { rank: 1, user: currentUser, wins: 4, losses: 0, points: 12, gd: 8 },
  { rank: 2, user: users[0], wins: 3, losses: 1, points: 9, gd: 5 },
  { rank: 3, user: users[3], wins: 2, losses: 2, points: 6, gd: 1 },
  { rank: 4, user: users[1], wins: 1, losses: 3, points: 3, gd: -3 },
  { rank: 5, user: users[2], wins: 1, losses: 3, points: 3, gd: -4 },
  { rank: 6, user: users[4], wins: 0, losses: 4, points: 0, gd: -7 },
];

interface TournamentMatch {
  id: string;
  opponent: User | null;
  score: number | null;
  oppScore: number | null;
  status: 'completed' | 'scheduled';
  round: string;
  date: Date;
}

// Simulated my matches
const myTournamentMatches: TournamentMatch[] = [
  { id: 'tm1', opponent: users[1], score: 3, oppScore: 1, status: 'completed', round: 'Group Stage', date: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { id: 'tm2', opponent: users[2], score: 2, oppScore: 0, status: 'completed', round: 'Group Stage', date: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 'tm3', opponent: users[4], score: 3, oppScore: 0, status: 'completed', round: 'Quarter Final', date: new Date(Date.now() - 1000 * 60 * 60 * 12) },
  { id: 'tm4', opponent: null, score: null, oppScore: null, status: 'scheduled', round: 'Semi Final', date: new Date(Date.now() + 1000 * 60 * 60 * 24) },
];

export default function TournamentDetailPage() {
  const params = useParams();
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('bracket');

  // Find the tournament (run)
  const tournament = runs.find(r => r.id === params.id) || runs[0];

  const formatMatchTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) {
      const days = Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24)));
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      return `${days} days ago`;
    }

    return formatTimeRemaining(date);
  };

  // Get tournament status
  const now = new Date();
  const isActive = now >= tournament.startsAt && now <= tournament.endsAt;
  const isUpcoming = now < tournament.startsAt;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/runs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Tournaments
      </Link>

      {/* Tournament Header */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Tournament Info */}
        <div className="flex-1">
          <Card className={cn(
            isActive && 'border-green-500/30',
            isUpcoming && 'border-yellow-500/30'
          )}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Target className={cn(
                      "w-8 h-8",
                      isActive ? "text-green-400" : "text-yellow-400"
                    )} />
                    <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
                    {isActive && (
                      <Badge variant="success" size="sm" glow>Live</Badge>
                    )}
                    {isUpcoming && (
                      <Badge variant="warning" size="sm">Upcoming</Badge>
                    )}
                  </div>
                  <p className="text-gray-400">{tournament.edition.name} • {tournament.guild.name}</p>
                </div>
              </div>

              {/* Tournament Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-gray-800/50 rounded-xl text-center">
                  <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">
                    {tournament.participantCount}
                    {tournament.maxParticipants && <span className="text-gray-500">/{tournament.maxParticipants}</span>}
                  </p>
                  <p className="text-xs text-gray-500">Players</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl text-center">
                  <Coins className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-yellow-400">
                    {formatCredits(tournament.creditPot)}
                  </p>
                  <p className="text-xs text-gray-500">Prize Pool</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl text-center">
                  <Trophy className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">
                    Knockout
                  </p>
                  <p className="text-xs text-gray-500">Format</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl text-center">
                  <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">
                    {isActive
                      ? formatTimeRemaining(tournament.endsAt)
                      : formatTimeRemaining(tournament.startsAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isActive ? 'Ends in' : 'Starts in'}
                  </p>
                </div>
              </div>

              {/* Prize Distribution */}
              <div className="p-4 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-yellow-500/10 rounded-xl border border-yellow-500/20">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Prize Distribution</h3>
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-yellow-400">{formatCredits(tournament.creditPot * 0.5)}</p>
                    <p className="text-xs text-gray-500">1st Place</p>
                  </div>
                  <div className="text-center">
                    <Medal className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-300">{formatCredits(tournament.creditPot * 0.3)}</p>
                    <p className="text-xs text-gray-500">2nd Place</p>
                  </div>
                  <div className="text-center">
                    <Medal className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-amber-600">{formatCredits(tournament.creditPot * 0.2)}</p>
                    <p className="text-xs text-gray-500">3rd Place</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Chatterbox & Next Match */}
        <div className="lg:w-72 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <h3 className="font-bold text-white">Tournament Room</h3>
              <p className="text-xs text-gray-500">Chat with participants</p>
            </CardHeader>
            <CardContent>
              <VoiceChat
                matchId={`tournament-${tournament.id}`}
                username={user?.username || 'Guest'}
                className="h-36"
              />
            </CardContent>
          </Card>

          {/* My Next Match */}
          {myTournamentMatches.filter(m => m.status === 'scheduled').length > 0 && (
            <Card className="border-orange-500/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <h3 className="font-bold text-white">My Next Match</h3>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const match = myTournamentMatches.find(m => m.status === 'scheduled')!;
                  return (
                    <div className="space-y-3">
                      <Badge variant="default" size="sm">{match.round}</Badge>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Opponent</span>
                        <span className="text-white font-medium">
                          {match.opponent ? match.opponent.username : 'TBD'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Starts in</span>
                        <span className="text-orange-400 font-bold">
                          {formatMatchTime(match.date)}
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
          { key: 'bracket', label: 'Bracket', icon: Target },
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
      {activeTab === 'bracket' && (
        <Card>
          <CardHeader>
            <h3 className="font-bold text-white">Tournament Bracket</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex gap-8 min-w-max pb-4">
                {bracketRounds.map((round, roundIndex) => (
                  <div key={round.name} className="flex flex-col gap-4">
                    <h4 className="text-sm font-medium text-gray-400 text-center mb-2">{round.name}</h4>
                    <div className="flex flex-col justify-around h-full gap-4" style={{ marginTop: roundIndex * 40 }}>
                      {round.matches.map((match) => {
                        const isMyMatch = match.player1?.id === user?.id || match.player2?.id === user?.id;
                        return (
                          <div
                            key={match.id}
                            className={cn(
                              "w-64 rounded-xl overflow-hidden border",
                              isMyMatch ? "border-violet-500/30 bg-violet-500/5" : "border-gray-700 bg-gray-800/50",
                              match.status === 'completed' && "opacity-80"
                            )}
                          >
                            {/* Player 1 */}
                            <div className={cn(
                              "flex items-center justify-between p-3 border-b border-gray-700",
                              match.winner?.id === match.player1?.id && "bg-green-500/10"
                            )}>
                              {match.player1 ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Avatar src={match.player1.avatar} name={match.player1.username} size="xs" />
                                    <span className={cn(
                                      "text-sm font-medium",
                                      match.player1.id === user?.id ? "text-violet-400" : "text-white"
                                    )}>
                                      {match.player1.username}
                                    </span>
                                  </div>
                                  <span className={cn(
                                    "font-bold",
                                    match.winner?.id === match.player1?.id ? "text-green-400" : "text-white"
                                  )}>
                                    {match.score1 ?? '-'}
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-500 text-sm">TBD</span>
                              )}
                            </div>
                            {/* Player 2 */}
                            <div className={cn(
                              "flex items-center justify-between p-3",
                              match.winner?.id === match.player2?.id && "bg-green-500/10"
                            )}>
                              {match.player2 ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Avatar src={match.player2.avatar} name={match.player2.username} size="xs" />
                                    <span className={cn(
                                      "text-sm font-medium",
                                      match.player2.id === user?.id ? "text-violet-400" : "text-white"
                                    )}>
                                      {match.player2.username}
                                    </span>
                                  </div>
                                  <span className={cn(
                                    "font-bold",
                                    match.winner?.id === match.player2?.id ? "text-green-400" : "text-white"
                                  )}>
                                    {match.score2 ?? '-'}
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-500 text-sm">TBD</span>
                              )}
                            </div>
                            {/* Match status */}
                            {match.status === 'scheduled' && match.scheduledAt && (
                              <div className="px-3 py-2 bg-gray-900/50 text-center">
                                <span className="text-xs text-orange-400">
                                  {formatMatchTime(match.scheduledAt)}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'standings' && (
        <Card>
          <CardHeader>
            <h3 className="font-bold text-white">Tournament Standings</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-gray-500 border-b border-gray-800">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Player</div>
                <div className="col-span-2 text-center">W-L</div>
                <div className="col-span-2 text-center">GD</div>
                <div className="col-span-2 text-right">Pts</div>
              </div>

              {tournamentStandings.map((standing, index) => (
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
                    {standing.wins}-{standing.losses}
                  </div>
                  <div className="col-span-2 text-center text-sm">
                    <span className={cn(
                      standing.gd > 0 ? 'text-green-400' :
                      standing.gd < 0 ? 'text-red-400' : 'text-gray-400'
                    )}>
                      {standing.gd > 0 ? '+' : ''}{standing.gd}
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
              {myTournamentMatches.filter(m => m.status === 'scheduled').length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming matches</p>
              ) : (
                myTournamentMatches.filter(m => m.status === 'scheduled').map((match) => (
                  <div
                    key={match.id}
                    className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="default" size="sm">{match.round}</Badge>
                      <span className="text-orange-400 font-bold text-sm">
                        {formatMatchTime(match.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      {match.opponent ? (
                        <>
                          <Avatar src={match.opponent.avatar} name={match.opponent.username} size="md" />
                          <div>
                            <p className="font-medium text-white">vs {match.opponent.username}</p>
                            <p className="text-xs text-gray-500">Level {match.opponent.level}</p>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500">Opponent TBD</p>
                      )}
                    </div>
                    <Button variant="primary" className="w-full" size="sm">
                      <Play className="w-4 h-4" />
                      Join Match
                    </Button>
                  </div>
                ))
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
              {myTournamentMatches.filter(m => m.status === 'completed').length === 0 ? (
                <p className="text-gray-500 text-center py-4">No completed matches yet</p>
              ) : (
                myTournamentMatches.filter(m => m.status === 'completed').map((match) => {
                  const isWin = match.score! > match.oppScore!;
                  return (
                    <div
                      key={match.id}
                      className={cn(
                        "p-4 rounded-xl",
                        isWin
                          ? "bg-green-500/10 border border-green-500/20"
                          : "bg-red-500/10 border border-red-500/20"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="default" size="sm">{match.round}</Badge>
                        <span className="text-xs text-gray-500">{formatMatchTime(match.date)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar src={match.opponent!.avatar} name={match.opponent!.username} size="md" />
                          <div>
                            <p className="font-medium text-white">vs {match.opponent!.username}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "font-bold text-lg",
                            isWin ? "text-green-400" : "text-red-400"
                          )}>
                            {match.score} - {match.oppScore}
                          </p>
                          <Badge variant={isWin ? "success" : "danger"} size="sm">
                            {isWin ? "Win" : "Loss"}
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
              <h3 className="font-bold text-white">Tournament Highlights</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No highlights yet</p>
              <p className="text-sm text-gray-600">Epic moments from matches will appear here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
