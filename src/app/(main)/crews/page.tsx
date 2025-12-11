'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Plus, Crown, Shield, UserPlus, MessageSquare, Swords, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { crews } from '@/data/dummy';
import { useActiveGuild, useAppStore } from '@/stores/app.store';
import { cn } from '@/lib/utils';

export default function CrewsPage() {
  const activeGuild = useActiveGuild();
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<'my-crews' | 'discover'>('my-crews');

  // Find user's crews (members is User[] so check by member.id)
  const myCrews = crews.filter(crew =>
    crew.members.some(member => member.id === user?.id)
  );
  const discoverCrews = crews.filter(crew =>
    !crew.members.some(member => member.id === user?.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users
            className="w-8 h-8"
            style={{ color: activeGuild?.accentColor }}
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Squads</h1>
            <p className="text-gray-400">Team up with your squad</p>
          </div>
        </div>

        <Button variant="primary">
          <Plus className="w-4 h-4" />
          Create Squad
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-900 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('my-crews')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-all',
            activeTab === 'my-crews'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white'
          )}
        >
          My Crews ({myCrews.length})
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-all',
            activeTab === 'discover'
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white'
          )}
        >
          Discover
        </button>
      </div>

      {/* Content */}
      {activeTab === 'my-crews' ? (
        myCrews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Squads Yet</h3>
              <p className="text-gray-400 mb-6">Create or join a squad to play with others</p>
              <Button variant="primary">
                <Plus className="w-4 h-4" />
                Create Your First Squad
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCrews.map((crew) => {
              // First member is the leader in our simplified model
              const leader = crew.members[0];

              return (
                <Card key={crew.id} hover glow>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold overflow-hidden"
                          style={{ backgroundColor: '#8b5cf620' }}
                        >
                          {crew.avatar ? (
                            <img src={crew.avatar} alt={crew.name} className="w-full h-full object-cover" />
                          ) : (
                            crew.name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{crew.name}</h3>
                          <p className="text-sm text-gray-400">[{crew.tag}]</p>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">Member</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="p-2 bg-gray-800/50 rounded-lg text-center">
                        <p className="text-lg font-bold text-white">{crew.memberCount}</p>
                        <p className="text-xs text-gray-500">Members</p>
                      </div>
                      <div className="p-2 bg-gray-800/50 rounded-lg text-center">
                        <p className="text-lg font-bold text-green-400">{crew.wins}</p>
                        <p className="text-xs text-gray-500">Wins</p>
                      </div>
                      <div className="p-2 bg-gray-800/50 rounded-lg text-center">
                        <p className="text-lg font-bold text-white">
                          {((crew.wins / (crew.wins + crew.losses)) * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-500">Win Rate</p>
                      </div>
                    </div>

                    {/* Members preview */}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {crew.members.slice(0, 5).map((member, index) => (
                          <div key={member.id} className="relative">
                            <Avatar
                              src={member.avatar}
                              name={member.username}
                              size="sm"
                              className="border-2 border-gray-900"
                            />
                            {index === 0 && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                                <Crown className="w-3 h-3 text-yellow-400" />
                              </div>
                            )}
                          </div>
                        ))}
                        {crew.members.length > 5 && (
                          <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center">
                            <span className="text-xs text-gray-400">+{crew.members.length - 5}</span>
                          </div>
                        )}
                      </div>
                      {leader && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Leader</p>
                          <p className="text-sm text-white">{leader.username}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Link href={`/crews/${crew.id}?tab=chat`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">
                        <MessageSquare className="w-4 h-4" />
                        Chat
                      </Button>
                    </Link>
                    <Link href={`/crews/${crew.id}`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">
                        <Swords className="w-4 h-4" />
                        Enter
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discoverCrews.map((crew) => (
            <Card key={crew.id} hover>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold overflow-hidden"
                    style={{ backgroundColor: '#8b5cf620' }}
                  >
                    {crew.avatar ? (
                      <img src={crew.avatar} alt={crew.name} className="w-full h-full object-cover" />
                    ) : (
                      crew.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{crew.name}</h3>
                    <p className="text-sm text-gray-400">[{crew.tag}]</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{crew.memberCount} members</span>
                  </div>
                  <span className="text-green-400">
                    {((crew.wins / (crew.wins + crew.losses)) * 100).toFixed(0)}% WR
                  </span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Link href={`/crews/${crew.id}`} className="flex-1">
                  <Button variant="secondary" className="w-full">
                    View
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
