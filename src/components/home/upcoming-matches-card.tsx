'use client';

import { Calendar, Clock, Coins, Trophy, Swords, Target, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { matches } from '@/data/dummy';
import { useAppStore } from '@/stores/app.store';
import { formatCredits } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Format time until match
function formatTimeUntil(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff < 0) return 'Now';

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}

// Get icon for match context
function getContextIcon(type?: string) {
  switch (type) {
    case 'league':
      return <Trophy className="w-3 h-3" />;
    case 'tournament':
      return <Target className="w-3 h-3" />;
    case 'challenge':
      return <Swords className="w-3 h-3" />;
    default:
      return <Swords className="w-3 h-3" />;
  }
}

// Get badge variant for context type
function getContextVariant(type?: string): 'default' | 'success' | 'warning' | 'danger' {
  switch (type) {
    case 'league':
      return 'success';
    case 'tournament':
      return 'warning';
    default:
      return 'default';
  }
}

interface UpcomingMatchesCardProps {
  variant?: 'card' | 'banner';
  maxItems?: number;
}

export function UpcomingMatchesCard({ variant = 'card', maxItems = 3 }: UpcomingMatchesCardProps) {
  const { user } = useAppStore();

  // Get upcoming matches for the current user
  const upcomingMatches = matches
    .filter(match => {
      const isUserMatch = match.player1.id === user?.id || match.player2.id === user?.id;
      const isUpcoming = match.status === 'accepted' && match.scheduledAt;
      return isUserMatch && isUpcoming;
    })
    .sort((a, b) => (a.scheduledAt?.getTime() || 0) - (b.scheduledAt?.getTime() || 0))
    .slice(0, maxItems);

  if (upcomingMatches.length === 0) {
    return null;
  }

  // Banner variant - compact horizontal display
  if (variant === 'banner') {
    const nextMatch = upcomingMatches[0];
    const opponent = nextMatch.player1.id === user?.id ? nextMatch.player2 : nextMatch.player1;
    const timeUntil = formatTimeUntil(nextMatch.scheduledAt!);
    const isUrgent = nextMatch.scheduledAt && (nextMatch.scheduledAt.getTime() - Date.now()) < 1000 * 60 * 60; // < 1 hour

    return (
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-4",
        isUrgent
          ? "bg-gradient-to-r from-orange-500/20 via-red-500/10 to-orange-500/20 border border-orange-500/30"
          : "bg-gradient-to-r from-violet-500/20 via-purple-500/10 to-violet-500/20 border border-violet-500/30"
      )}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Urgency indicator */}
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isUrgent ? "bg-orange-500/20" : "bg-violet-500/20"
            )}>
              <Clock className={cn("w-6 h-6", isUrgent ? "text-orange-400" : "text-violet-400")} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-400">Next Match</span>
                {nextMatch.context && (
                  <Badge variant={getContextVariant(nextMatch.context.type)} size="sm" className="gap-1">
                    {getContextIcon(nextMatch.context.type)}
                    {nextMatch.context.name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">vs</span>
                  <Avatar src={opponent.avatar} name={opponent.username} size="sm" />
                  <span className="text-white font-bold">{opponent.username}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className={cn(
                  "font-bold",
                  isUrgent ? "text-orange-400" : "text-violet-400"
                )}>
                  {timeUntil}
                </span>
                {nextMatch.creditPot > 0 && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="text-yellow-400 font-medium flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {formatCredits(nextMatch.creditPot)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {upcomingMatches.length > 1 && (
              <span className="text-sm text-gray-500">+{upcomingMatches.length - 1} more</span>
            )}
            <Link href={`/match/${nextMatch.id}`}>
              <Button variant={isUrgent ? "primary" : "secondary"} size="sm">
                {isUrgent ? 'Join Now' : 'View'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Card variant - full list display
  return (
    <Card className="border-violet-500/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-violet-400" />
          <h3 className="font-bold text-white">My Upcoming Matches</h3>
        </div>
        <Badge variant="default" size="sm">{upcomingMatches.length} scheduled</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingMatches.map((match) => {
          const opponent = match.player1.id === user?.id ? match.player2 : match.player1;
          const timeUntil = formatTimeUntil(match.scheduledAt!);
          const isUrgent = match.scheduledAt && (match.scheduledAt.getTime() - Date.now()) < 1000 * 60 * 60;

          return (
            <div
              key={match.id}
              className={cn(
                "p-3 rounded-xl transition-colors",
                isUrgent
                  ? "bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/15"
                  : "bg-gray-800/50 hover:bg-gray-800"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar src={opponent.avatar} name={opponent.username} size="sm" />
                  <div>
                    <p className="font-medium text-white">{opponent.username}</p>
                    <p className="text-xs text-gray-500">Level {opponent.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-bold text-sm",
                    isUrgent ? "text-orange-400" : "text-violet-400"
                  )}>
                    {timeUntil}
                  </p>
                  {match.creditPot > 0 && (
                    <p className="text-xs text-yellow-400">{formatCredits(match.creditPot)} RC</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {match.context && (
                    <Badge variant={getContextVariant(match.context.type)} size="sm" className="gap-1">
                      {getContextIcon(match.context.type)}
                      {match.context.name}
                    </Badge>
                  )}
                  <Badge variant="default" size="sm">{match.guild.name}</Badge>
                </div>
                <Link href={`/match/${match.id}`}>
                  <Button variant={isUrgent ? "primary" : "ghost"} size="sm">
                    {isUrgent ? 'Join' : 'View'}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}

        <Link href="/calls" className="block">
          <Button variant="secondary" size="sm" className="w-full">
            View All Matches
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
