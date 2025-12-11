'use client';

import { useState, useEffect } from 'react';
import { X, Zap, Users, Clock, Gamepad2, Check, AlertCircle, Swords, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { useAppStore, useActiveGuild, useActiveEdition } from '@/stores/app.store';
import { users } from '@/data/dummy';
import { User } from '@/types';
import { cn } from '@/lib/utils';

interface MatchmakingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MatchmakingState = 'selecting' | 'searching' | 'found' | 'confirming' | 'ready' | 'timeout';
type MatchType = '1v1' | '2v2' | '3v3' | '5v5';

const matchTypes: { type: MatchType; label: string; players: number }[] = [
  { type: '1v1', label: 'Solo Duel', players: 2 },
  { type: '2v2', label: 'Duo Battle', players: 4 },
  { type: '3v3', label: 'Trio Clash', players: 6 },
  { type: '5v5', label: 'Squad War', players: 10 },
];

export function MatchmakingModal({ isOpen, onClose }: MatchmakingModalProps) {
  const { user } = useAppStore();
  const activeGuild = useActiveGuild();
  const activeEdition = useActiveEdition();

  const [state, setState] = useState<MatchmakingState>('selecting');
  const [selectedType, setSelectedType] = useState<MatchType>('1v1');
  const [searchTime, setSearchTime] = useState(0);
  const [opponent, setOpponent] = useState<User | null>(null);
  const [userReady, setUserReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [confirmTimeout, setConfirmTimeout] = useState(30);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setState('selecting');
      setSearchTime(0);
      setOpponent(null);
      setUserReady(false);
      setOpponentReady(false);
      setConfirmTimeout(30);
    }
  }, [isOpen]);

  // Search timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === 'searching') {
      interval = setInterval(() => {
        setSearchTime((t) => t + 1);
      }, 1000);

      // Simulate finding a match after random time
      const findTime = 3000 + Math.random() * 5000;
      const timeout = setTimeout(() => {
        const randomOpponent = users[Math.floor(Math.random() * users.length)];
        setOpponent(randomOpponent);
        setState('found');
      }, findTime);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
    return () => clearInterval(interval);
  }, [state]);

  // Confirm timeout
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === 'confirming') {
      interval = setInterval(() => {
        setConfirmTimeout((t) => {
          if (t <= 1) {
            setState('timeout');
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      // Simulate opponent ready
      const opponentReadyTime = 2000 + Math.random() * 3000;
      const timeout = setTimeout(() => {
        setOpponentReady(true);
      }, opponentReadyTime);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
    return () => clearInterval(interval);
  }, [state]);

  // Check if both ready
  useEffect(() => {
    if (state === 'confirming' && userReady && opponentReady) {
      setState('ready');
    }
  }, [state, userReady, opponentReady]);

  const handleStartSearch = () => {
    setState('searching');
    setSearchTime(0);
  };

  const handleCancelSearch = () => {
    setState('selecting');
    setSearchTime(0);
  };

  const handleAcceptMatch = () => {
    setState('confirming');
    setUserReady(true);
    setConfirmTimeout(30);
  };

  const handleDeclineMatch = () => {
    setState('selecting');
    setOpponent(null);
  };

  const handleEnterMatch = () => {
    // In real app, would navigate to match
    onClose();
  };

  const handleTryAgain = () => {
    setState('selecting');
    setOpponent(null);
    setUserReady(false);
    setOpponentReady(false);
    setConfirmTimeout(30);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !user || !activeGuild) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={state === 'selecting' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        {/* Glow effect based on state */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: state === 'found' || state === 'confirming'
              ? 'radial-gradient(circle at 50% 0%, #22c55e, transparent 70%)'
              : state === 'ready'
              ? 'radial-gradient(circle at 50% 0%, #8b5cf6, transparent 70%)'
              : state === 'timeout'
              ? 'radial-gradient(circle at 50% 0%, #ef4444, transparent 70%)'
              : `radial-gradient(circle at 50% 0%, ${activeGuild.accentColor}, transparent 70%)`
          }}
        />

        {/* Content */}
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${activeGuild.accentColor}20` }}
              >
                <Zap className="w-5 h-5" style={{ color: activeGuild.accentColor }} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Quick Match</h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  {state === 'selecting' && 'Select match type'}
                  {state === 'searching' && 'Finding opponent...'}
                  {state === 'found' && 'Match found!'}
                  {state === 'confirming' && 'Waiting for confirmation...'}
                  {state === 'ready' && 'Match ready!'}
                  {state === 'timeout' && 'Match cancelled'}
                </p>
              </div>
            </div>
            {(state === 'selecting' || state === 'timeout') && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* State: Selecting */}
          {state === 'selecting' && (
            <>
              {/* Game info */}
              <div className="p-4 sm:p-6 border-b border-gray-800">
                <div className="flex items-center gap-4 p-3 sm:p-4 bg-gray-800/50 rounded-xl">
                  <Gamepad2 className="w-6 sm:w-8 h-6 sm:h-8 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{activeGuild.name}</p>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {activeEdition?.name || 'Select edition'}
                    </p>
                  </div>
                  <Badge variant="success" size="sm">
                    {activeGuild.activeNow.toLocaleString()} online
                  </Badge>
                </div>
              </div>

              {/* Match type selection */}
              <div className="p-4 sm:p-6 border-b border-gray-800">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Match Type</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {matchTypes.map(({ type, label, players }) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={cn(
                        'p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left',
                        selectedType === type
                          ? 'border-transparent bg-gradient-to-br from-violet-600/20 to-purple-600/20'
                          : 'border-gray-800 bg-gray-800/30 hover:border-gray-700'
                      )}
                      style={{
                        borderColor: selectedType === type ? activeGuild.accentColor : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Users className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                        <div>
                          <p className="font-bold text-white text-sm sm:text-base">{type}</p>
                          <p className="text-xs text-gray-500">{label}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated wait time */}
              <div className="p-4 sm:p-6 border-b border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Estimated wait</span>
                  </div>
                  <span className="text-green-400 font-medium">~30 seconds</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 sm:p-6">
                <Button
                  variant="glow"
                  size="lg"
                  className="w-full"
                  onClick={handleStartSearch}
                >
                  <Zap className="w-5 h-5" />
                  Start Matchmaking
                </Button>
              </div>
            </>
          )}

          {/* State: Searching */}
          {state === 'searching' && (
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                {/* Animated search indicator */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <Zap className="w-10 h-10 text-violet-400 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-violet-500/30 animate-ping" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Searching for Match</h3>
                <p className="text-gray-400 mb-4">Finding an opponent of similar skill level...</p>

                {/* Search time */}
                <div className="flex items-center gap-2 text-gray-500 mb-6">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(searchTime)}</span>
                </div>

                {/* Bouncing dots */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>

                <Button
                  variant="danger"
                  size="lg"
                  className="w-full"
                  onClick={handleCancelSearch}
                >
                  <X className="w-5 h-5" />
                  Cancel Search
                </Button>
              </div>
            </div>
          )}

          {/* State: Found */}
          {state === 'found' && opponent && (
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Match Found!</h3>
                <p className="text-gray-400 mb-6">Do you want to accept this match?</p>

                {/* Opponent info */}
                <div className="w-full p-4 bg-gray-800/50 rounded-xl mb-6">
                  <p className="text-xs text-gray-500 mb-3">Your Opponent</p>
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={opponent.avatar}
                      name={opponent.username}
                      size="lg"
                      isOnline
                    />
                    <div className="text-left flex-1">
                      <p className="font-bold text-white">{opponent.username}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" size="sm">Lvl {opponent.level}</Badge>
                        <span className="text-sm text-gray-400">
                          Level {opponent.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full">
                  <Button
                    variant="danger"
                    size="lg"
                    className="flex-1"
                    onClick={handleDeclineMatch}
                  >
                    <X className="w-5 h-5" />
                    Decline
                  </Button>
                  <Button
                    variant="success"
                    size="lg"
                    className="flex-1"
                    onClick={handleAcceptMatch}
                  >
                    <Check className="w-5 h-5" />
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* State: Confirming */}
          {state === 'confirming' && opponent && (
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-white mb-6">Waiting for Confirmation</h3>

                {/* VS Display */}
                <div className="flex items-center gap-4 sm:gap-8 mb-6 w-full justify-center">
                  {/* You */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar
                        src={user.avatar}
                        name={user.username}
                        size="lg"
                        className={cn(userReady && 'ring-2 ring-green-500')}
                      />
                      {userReady && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-white font-medium mt-2 text-sm sm:text-base">{user.username}</p>
                    <Badge variant={userReady ? 'success' : 'warning'} size="sm">
                      {userReady ? 'Ready' : 'Waiting'}
                    </Badge>
                  </div>

                  {/* VS */}
                  <div className="text-2xl font-bold text-gray-600">
                    <Swords className="w-8 h-8" />
                  </div>

                  {/* Opponent */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar
                        src={opponent.avatar}
                        name={opponent.username}
                        size="lg"
                        className={cn(opponentReady && 'ring-2 ring-green-500')}
                      />
                      {opponentReady && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-white font-medium mt-2 text-sm sm:text-base">{opponent.username}</p>
                    <Badge variant={opponentReady ? 'success' : 'warning'} size="sm">
                      {opponentReady ? 'Ready' : 'Waiting'}
                    </Badge>
                  </div>
                </div>

                {/* Timeout countdown */}
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Time remaining: {confirmTimeout}s</span>
                </div>
              </div>
            </div>
          )}

          {/* State: Ready */}
          {state === 'ready' && opponent && (
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30 animate-pulse">
                  <Swords className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Match Ready!</h3>
                <p className="text-gray-400 mb-8">Both players confirmed. Let's go!</p>

                {/* Match info */}
                <div className="w-full p-4 bg-gray-800/50 rounded-xl mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.username} size="md" />
                      <p className="font-medium text-white">{user.username}</p>
                    </div>
                    <span className="text-gray-500 font-bold">VS</span>
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-white">{opponent.username}</p>
                      <Avatar src={opponent.avatar} name={opponent.username} size="md" />
                    </div>
                  </div>
                </div>

                <Button
                  variant="glow"
                  size="lg"
                  className="w-full"
                  onClick={handleEnterMatch}
                >
                  <Swords className="w-5 h-5" />
                  Enter Match
                </Button>
              </div>
            </div>
          )}

          {/* State: Timeout */}
          {state === 'timeout' && (
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Match Cancelled</h3>
                <p className="text-gray-400 mb-8">
                  Your opponent failed to confirm in time. Don't worry, you won't lose any rating.
                </p>

                <div className="flex gap-3 w-full">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={handleTryAgain}
                  >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
