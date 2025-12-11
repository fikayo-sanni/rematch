'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Crown,
  Shield,
  MessageSquare,
  Swords,
  Trophy,
  Clock,
  ChevronLeft,
  BarChart3,
  Calendar,
  UserPlus,
  Settings,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VoiceChat } from '@/components/match/voice-chat';
import { crews, users, currentUser } from '@/data/dummy';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/lib/utils';

type TabType = 'members' | 'matches' | 'stats';

// Simulated squad matches
const squadMatches = [
  {
    id: 'sm1',
    opponent: { name: 'Savage Squad', tag: 'SVG' },
    result: 'win',
    score: '3-1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    type: 'Ranked',
  },
  {
    id: 'sm2',
    opponent: { name: 'Elite Gamers', tag: 'ELT' },
    result: 'win',
    score: '2-0',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    type: 'Tournament',
  },
  {
    id: 'sm3',
    opponent: { name: 'Pro Players', tag: 'PRO' },
    result: 'loss',
    score: '1-2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72),
    type: 'Ranked',
  },
  {
    id: 'sm4',
    opponent: { name: 'Champions', tag: 'CHP' },
    result: 'win',
    score: '3-0',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96),
    type: 'League',
  },
];

export default function SquadDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('members');
  const chatterboxRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to chatterbox if coming from chat button
  useEffect(() => {
    if (searchParams.get('tab') === 'chat' && chatterboxRef.current) {
      chatterboxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchParams]);

  // Find the squad
  const squad = crews.find(c => c.id === params.crewId);

  if (!squad) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Squad Not Found</h2>
          <p className="text-gray-400 mb-4">This squad doesn&apos;t exist or has been disbanded.</p>
          <Link href="/crews">
            <Button variant="secondary">
              <ChevronLeft className="w-4 h-4" />
              Back to Squads
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isMember = squad.members.some(m => m.id === user?.id);
  const isLeader = squad.members[0]?.id === user?.id;
  const winRate = ((squad.wins / (squad.wins + squad.losses)) * 100).toFixed(1);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'members', label: 'Members', icon: <Users className="w-4 h-4" /> },
    { id: 'matches', label: 'Matches', icon: <Swords className="w-4 h-4" /> },
    { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/crews" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Squads</span>
      </Link>

      {/* Squad Header */}
      <div className="relative">
        {/* Banner */}
        {squad.banner && (
          <div className="h-32 rounded-xl overflow-hidden mb-4">
            <img src={squad.banner} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Squad Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-gray-900 -mt-10 relative z-10"
            style={{ backgroundColor: '#8b5cf620' }}
          >
            {squad.avatar ? (
              <img src={squad.avatar} alt={squad.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-violet-300">{squad.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{squad.name}</h1>
              <Badge variant="default" size="sm">[{squad.tag}]</Badge>
              {squad.rank === 1 && (
                <Badge variant="warning" size="sm" className="gap-1">
                  <Trophy className="w-3 h-3" />
                  #1
                </Badge>
              )}
            </div>
            <p className="text-gray-400">
              {squad.memberCount} members &bull; Rank #{squad.rank} &bull; {winRate}% Win Rate
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isMember ? (
              <>
                <Button variant="secondary" size="sm">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </Button>
                {isLeader && (
                  <Button variant="secondary" size="sm">
                    <Settings className="w-4 h-4" />
                    Manage
                  </Button>
                )}
                <Button variant="primary" size="sm">
                  <Swords className="w-4 h-4" />
                  Find Match
                </Button>
              </>
            ) : (
              <Button variant="primary">
                <UserPlus className="w-4 h-4" />
                Request to Join
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-white">{squad.wins}</p>
                <p className="text-xs text-gray-500">Total Wins</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-400">{squad.losses}</p>
                <p className="text-xs text-gray-500">Total Losses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{winRate}%</p>
                <p className="text-xs text-gray-500">Win Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-violet-400">#{squad.rank}</p>
                <p className="text-xs text-gray-500">Global Rank</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-900 rounded-xl p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all',
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'members' && (
            <Card>
              <CardHeader>
                <h3 className="font-bold text-white">Squad Members</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {squad.members.map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar src={member.avatar} name={member.username} size="md" />
                        {index === 0 && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Crown className="w-3 h-3 text-black" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.username}</p>
                        <p className="text-xs text-gray-500">
                          {index === 0 ? 'Leader' : 'Member'} &bull; Level {member.level}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={member.isOnline ? 'success' : 'default'}
                        size="sm"
                      >
                        {member.isOnline ? 'online' : 'offline'}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* Placeholder for more members */}
                {squad.memberCount > squad.members.length && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    +{squad.memberCount - squad.members.length} more members
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'matches' && (
            <Card>
              <CardHeader>
                <h3 className="font-bold text-white">Recent Matches</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {squadMatches.map((match) => (
                  <div
                    key={match.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border",
                      match.result === 'win'
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-red-500/5 border-red-500/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold",
                        match.result === 'win' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      )}>
                        {match.result === 'win' ? 'W' : 'L'}
                      </div>
                      <div>
                        <p className="font-medium text-white">vs {match.opponent.name}</p>
                        <p className="text-xs text-gray-500">[{match.opponent.tag}] &bull; {match.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-bold",
                        match.result === 'win' ? "text-green-400" : "text-red-400"
                      )}>
                        {match.score}
                      </p>
                      <p className="text-xs text-gray-500">
                        {match.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <h3 className="font-bold text-white">Performance</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Win Streak</span>
                    <span className="font-bold text-green-400">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Best Win Streak</span>
                    <span className="font-bold text-white">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Games This Week</span>
                    <span className="font-bold text-white">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Avg. Game Duration</span>
                    <span className="font-bold text-white">24m</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="font-bold text-white">Achievements</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-yellow-500/10 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Tournament Champions</p>
                      <p className="text-xs text-gray-500">Won 3 tournaments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-violet-500/10 rounded-lg">
                    <Swords className="w-5 h-5 text-violet-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Win Streak Master</p>
                      <p className="text-xs text-gray-500">10+ game win streak</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Team Player</p>
                      <p className="text-xs text-gray-500">100+ squad games</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Squad Room - Chatterbox */}
          {isMember && (
            <div ref={chatterboxRef} className="h-48">
              <VoiceChat
                matchId={`squad-${squad.id}`}
                username={user?.username || 'Guest'}
                className="h-full"
              />
            </div>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-white text-sm">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {isMember ? (
                <>
                  <Button variant="secondary" className="w-full justify-start" size="sm">
                    <Swords className="w-4 h-4" />
                    Start Squad Match
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" size="sm">
                    <Calendar className="w-4 h-4" />
                    Schedule Practice
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" size="sm">
                    <UserPlus className="w-4 h-4" />
                    Invite Players
                  </Button>
                </>
              ) : (
                <Button variant="primary" className="w-full">
                  <UserPlus className="w-4 h-4" />
                  Request to Join
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Online Members */}
          <Card>
            <CardHeader>
              <h3 className="font-bold text-white text-sm">Online Now</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              {squad.members
                .filter(m => m.isOnline)
                .slice(0, 5)
                .map((member) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <Avatar src={member.avatar} name={member.username} size="sm" />
                    <span className="text-sm text-white">{member.username}</span>
                    <div className="w-2 h-2 rounded-full bg-green-400 ml-auto" />
                  </div>
                ))}
              {squad.members.filter(m => m.isOnline).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">No members online</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
