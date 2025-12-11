'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  Clock,
  Upload,
  AlertCircle,
  CheckCircle,
  Trophy,
  Swords,
  MessageSquare,
  Flag,
  Eye,
  Users,
  ArrowLeft,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StreamEmbed } from '@/components/match/stream-embed';
import { VoiceChat } from '@/components/match/voice-chat';
import { matches, users } from '@/data/dummy';
import { useAppStore } from '@/stores/app.store';
import { formatTimeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';

type MatchPhase = 'lobby' | 'playing' | 'submit' | 'spotcheck' | 'completed';

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAppStore();
  const [phase, setPhase] = useState<MatchPhase>('lobby');
  const [countdown, setCountdown] = useState(10);
  const [submittedResult, setSubmittedResult] = useState<'win' | 'loss' | null>(null);
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 150) + 20);

  const isSpectating = searchParams.get('spectate') === 'true';
  const match = matches.find(m => m.id === params.id);

  // For spectate mode with live matches that don't exist in dummy data,
  // create a simulated match
  const liveMatch = !match && params.id?.toString().startsWith('live-') ? {
    id: params.id as string,
    player1: users[0],
    player2: users[1],
    type: 'Ranked 1v1',
    status: 'in_progress' as const,
    startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    score: { player1: Math.floor(Math.random() * 4), player2: Math.floor(Math.random() * 4) },
  } : null;

  const currentMatch = match || liveMatch;

  // Simulate countdown for demo (skip for spectators)
  useEffect(() => {
    if (isSpectating) {
      setPhase('playing');
      return;
    }
    if (phase === 'lobby' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'lobby' && countdown === 0) {
      setPhase('playing');
    }
  }, [phase, countdown, isSpectating]);

  // Simulate viewer count changes for spectate mode
  useEffect(() => {
    if (!isSpectating) return;
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSpectating]);

  if (!currentMatch) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Match Not Found</h2>
            <p className="text-gray-400 mb-6">This match may have expired or doesn't exist.</p>
            <Button variant="primary" onClick={() => router.push('/')}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const player1 = currentMatch.player1;
  const player2 = currentMatch.player2;
  const isPlayer1 = player1.id === user?.id;
  const isPlayer = player1.id === user?.id || player2.id === user?.id;
  const liveScore = liveMatch?.score;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button for spectators */}
      {isSpectating && (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to matches
        </button>
      )}

      {/* Spectator Banner */}
      {isSpectating && (
        <Card className="border-violet-500/30 bg-violet-500/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Spectator Mode</p>
                  <p className="text-sm text-gray-400">You're watching this match live</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="text-white font-medium">{viewerCount}</span>
                  <span className="text-sm">watching</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-sm font-medium">LIVE</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Badge
              variant={
                phase === 'lobby' ? 'warning' :
                phase === 'playing' ? 'danger' :
                phase === 'completed' ? 'success' : 'default'
              }
              size="sm"
              glow={phase === 'playing'}
            >
              {phase === 'lobby' && 'Waiting'}
              {phase === 'playing' && 'LIVE'}
              {phase === 'submit' && 'Submit Results'}
              {phase === 'spotcheck' && 'Under Review'}
              {phase === 'completed' && 'Completed'}
            </Badge>
            <Badge variant="default">{currentMatch.type}</Badge>
            {isSpectating && <Badge variant="info" size="sm"><Eye className="w-3 h-3 mr-1" />Spectating</Badge>}
          </div>
          <h1 className="text-2xl font-bold text-white">Match #{currentMatch.id.slice(0, 8)}</h1>
        </div>

        {phase === 'playing' && (
          <div className="text-right">
            <p className="text-sm text-gray-400">Started</p>
            <p className="text-lg font-bold text-white">
              {currentMatch.startedAt ? formatTimeAgo(currentMatch.startedAt) : 'Just now'}
            </p>
          </div>
        )}
      </div>

      {/* Stream Embed - Full width during playing phase */}
      {phase === 'playing' && (
        <StreamEmbed isSpectator={isSpectating} />
      )}

      {/* Lobby Phase */}
      {phase === 'lobby' && (
        <Card className="border-yellow-500/30">
          <CardContent className="py-12 text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-yellow-500/30 animate-ping" />
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-yellow-400">{countdown}</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Match Starting Soon</h2>
            <p className="text-gray-400">Get ready! The match will begin in {countdown} seconds.</p>
          </CardContent>
        </Card>
      )}

      {/* Live Score Display for Spectators */}
      {isSpectating && liveScore && phase === 'playing' && (
        <Card className="border-gray-700">
          <CardContent className="py-8">
            <div className="flex items-center justify-center gap-8">
              {/* Player 1 Score */}
              <div className="text-center">
                <Avatar
                  src={player1.avatar}
                  name={player1.username}
                  size="xl"
                  isOnline
                />
                <p className="font-bold text-white mt-2">{player1.username}</p>
                <p className="text-6xl font-bold text-white mt-2">{liveScore.player1}</p>
              </div>

              {/* VS */}
              <div className="text-center px-8">
                <div className="text-3xl font-bold text-gray-600">VS</div>
                <div className="flex items-center gap-1 mt-2 justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-sm font-medium">LIVE</span>
                </div>
              </div>

              {/* Player 2 Score */}
              <div className="text-center">
                <Avatar
                  src={player2.avatar}
                  name={player2.username}
                  size="xl"
                  isOnline
                />
                <p className="font-bold text-white mt-2">{player2.username}</p>
                <p className="text-6xl font-bold text-white mt-2">{liveScore.player2}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Players Display with Chatterbox - 40% / 40% / 20% */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Player 1 - 40% (2/5) */}
        <Card className={cn('md:col-span-2', !isSpectating && isPlayer1 && 'border-violet-500/30')}>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Player 1</h3>
              {!isSpectating && isPlayer1 && <Badge variant="default" size="sm">You</Badge>}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg">
              <Avatar
                src={player1.avatar}
                name={player1.username}
                size="md"
                isOnline={player1.isOnline}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">
                  {player1.username}
                  {!isSpectating && player1.id === user?.id && (
                    <span className="text-xs text-gray-500 ml-1">(You)</span>
                  )}
                </p>
                <p className="text-xs text-gray-400">Level {player1.level}</p>
              </div>
              <Badge
                variant={player1.isOnline ? 'success' : 'default'}
                size="sm"
              >
                {player1.isOnline ? 'Ready' : 'Waiting'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Player 2 - 40% (2/5) */}
        <Card className={cn('md:col-span-2', !isSpectating && !isPlayer1 && 'border-violet-500/30')}>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Player 2</h3>
              {!isSpectating && !isPlayer1 && <Badge variant="default" size="sm">You</Badge>}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg">
              <Avatar
                src={player2.avatar}
                name={player2.username}
                size="md"
                isOnline={player2.isOnline}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">
                  {player2.username}
                  {!isSpectating && player2.id === user?.id && (
                    <span className="text-xs text-gray-500 ml-1">(You)</span>
                  )}
                </p>
                <p className="text-xs text-gray-400">Level {player2.level}</p>
              </div>
              <Badge
                variant={player2.isOnline ? 'success' : 'default'}
                size="sm"
              >
                {player2.isOnline ? 'Ready' : 'Waiting'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Chatterbox - 20% (1/5) */}
        <div className="md:col-span-1">
          <VoiceChat
            matchId={currentMatch.id}
            username={user?.username || 'Guest'}
            isPlayer={isPlayer && !isSpectating}
            onParticipantCountChange={(count) => {
              console.log('Participants in voice:', count);
            }}
          />
        </div>
      </div>

      {/* Playing Phase Actions */}
      {phase === 'playing' && !isSpectating && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white mb-1">Match in Progress</h3>
                <p className="text-gray-400 text-sm">
                  Play your game, then submit the results when finished.
                </p>
              </div>
              <Button variant="primary" onClick={() => setPhase('submit')}>
                <Upload className="w-4 h-4" />
                Submit Results
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spectator Actions */}
      {phase === 'playing' && isSpectating && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-sm font-medium">LIVE</span>
                </div>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-2 text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span className="text-white font-medium">{viewerCount}</span>
                  <span className="text-sm">watching</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </Button>
                <Button variant="secondary" size="sm" onClick={() => router.back()}>
                  Leave
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Phase - Only for players */}
      {phase === 'submit' && !isSpectating && (
        <Card className="border-blue-500/30">
          <CardHeader>
            <h3 className="font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              Submit Match Results
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-400">
              Select the outcome of your match. Both players must submit matching results.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSubmittedResult('win')}
                className={cn(
                  'p-6 rounded-xl border-2 transition-all text-center',
                  submittedResult === 'win'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-800 hover:border-gray-700'
                )}
              >
                <Trophy className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="font-bold text-white text-lg">Victory</p>
                <p className="text-sm text-gray-400">I won the match</p>
              </button>

              <button
                onClick={() => setSubmittedResult('loss')}
                className={cn(
                  'p-6 rounded-xl border-2 transition-all text-center',
                  submittedResult === 'loss'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-gray-800 hover:border-gray-700'
                )}
              >
                <Swords className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="font-bold text-white text-lg">Defeat</p>
                <p className="text-sm text-gray-400">I lost the match</p>
              </button>
            </div>

            {/* Upload proof */}
            <div className="p-4 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  Upload screenshot proof (optional)
                </p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Choose File
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-3">
            <Button variant="ghost" onClick={() => setPhase('playing')}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!submittedResult}
              onClick={() => setPhase('spotcheck')}
            >
              <CheckCircle className="w-4 h-4" />
              Confirm Result
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Spotcheck Phase - Only for players */}
      {phase === 'spotcheck' && !isSpectating && (
        <Card className="border-yellow-500/30">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Spotcheck in Progress</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Your submission is being reviewed. If both players submitted matching results,
              the match will be finalized shortly.
            </p>
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <Button
              variant="secondary"
              className="mt-6"
              onClick={() => setPhase('completed')}
            >
              Skip (Demo)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Completed Phase - Only for players */}
      {phase === 'completed' && !isSpectating && (
        <Card className={cn(
          submittedResult === 'win'
            ? 'border-green-500/30 bg-green-500/5'
            : 'border-red-500/30 bg-red-500/5'
        )}>
          <CardContent className="py-12 text-center">
            <div
              className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
                submittedResult === 'win'
                  ? 'bg-green-500/20'
                  : 'bg-red-500/20'
              )}
            >
              {submittedResult === 'win' ? (
                <Trophy className="w-10 h-10 text-green-400" />
              ) : (
                <Swords className="w-10 h-10 text-red-400" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {submittedResult === 'win' ? 'Victory!' : 'Defeat'}
            </h2>
            <p className="text-gray-400 mb-6">
              {submittedResult === 'win'
                ? 'Congratulations! You earned +25 rank points.'
                : 'Better luck next time. You lost -15 rank points.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="ghost" onClick={() => router.push('/')}>
                Return Home
              </Button>
              <Button variant="primary">
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match Actions - Different for spectators */}
      {!isSpectating ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <MessageSquare className="w-4 h-4" />
              Match Chat
            </Button>
            <Button variant="ghost" size="sm" className="text-red-400">
              <Flag className="w-4 h-4" />
              Report Issue
            </Button>
          </div>
          {phase !== 'completed' && (
            <Button variant="danger" size="sm">
              Forfeit Match
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <MessageSquare className="w-4 h-4" />
              Spectator Chat
            </Button>
            <Button variant="ghost" size="sm" className="text-red-400">
              <Flag className="w-4 h-4" />
              Report
            </Button>
          </div>
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
            Leave
          </Button>
        </div>
      )}
    </div>
  );
}
