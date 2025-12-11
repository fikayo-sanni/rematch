'use client';

import { useState } from 'react';
import { MessageSquare, Send, Image as ImageIcon, Smile, TrendingUp, Clock, Eye, Swords, Play, Crosshair, Users, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoiceChat } from '@/components/match/voice-chat';
import { noisePosts, users, calls } from '@/data/dummy';
import { useActiveGuild, useAppStore } from '@/stores/app.store';
import { formatTimeAgo, formatTimeRemaining, formatCredits } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type FilterType = 'recent' | 'trending';

// Simulated live matches for the sidebar
const liveMatches = [
  {
    id: 'live-1',
    player1: users[0],
    player2: users[1],
    score1: 2,
    score2: 1,
    viewers: 156,
    duration: '32:15',
  },
  {
    id: 'live-2',
    player1: users[2],
    player2: users[3],
    score1: 0,
    score2: 0,
    viewers: 43,
    duration: '05:30',
  },
  {
    id: 'live-3',
    player1: users[0],
    player2: users[2],
    score1: 3,
    score2: 3,
    viewers: 89,
    duration: '67:45',
  },
];

export default function NoisePage() {
  const activeGuild = useActiveGuild();
  const { user } = useAppStore();
  const [filter, setFilter] = useState<FilterType>('recent');
  const [newPost, setNewPost] = useState('');

  const filteredPosts = [...noisePosts].sort((a, b) => {
    if (filter === 'trending') {
      return (b.likes || 0) - (a.likes || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Get pending calls for challenges section
  const openChallenges = calls.filter(c => c.status === 'pending').slice(0, 3);

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    // In real app, this would create a post via API
    setNewPost('');
  };

  const handleChallenge = (userId: string) => {
    // In real app, would open challenge modal pre-filled with user
    console.log('Challenge user:', userId);
  };

  return (
    <div className="flex gap-6">
      {/* Main Feed */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MessageSquare
              className="w-8 h-8"
              style={{ color: activeGuild?.accentColor }}
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Feed</h1>
              <p className="text-gray-400">Community posts and updates</p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-gray-900 rounded-xl p-1 w-fit">
            <button
              onClick={() => setFilter('recent')}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all',
                filter === 'recent'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <Clock className="w-4 h-4" />
              Recent
            </button>
            <button
              onClick={() => setFilter('trending')}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all',
                filter === 'trending'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </button>
          </div>
        </div>

        {/* New Post Input */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3 sm:gap-4">
              <Avatar
                src={user?.avatar}
                name={user?.username || 'You'}
                size="md"
                className="hidden sm:block"
              />
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind? Share your wins, clips, or challenge someone..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-violet-500 transition-colors text-sm sm:text-base"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmitPost}
                    disabled={!newPost.trim()}
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Post</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const author = post.author;

            return (
              <Card key={post.id} hover>
                <CardContent className="p-4 sm:p-5">
                  {/* Author header */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Avatar
                      src={author.avatar}
                      name={author.username}
                      size="md"
                      isOnline={author.isOnline}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-white">{author.username}</span>
                        <Badge variant="default" size="sm">Lvl {author.level}</Badge>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(post.createdAt)}
                        </span>
                      </div>

                      {/* Post content */}
                      <p className="text-gray-300 whitespace-pre-wrap text-sm sm:text-base">{post.content}</p>

                      {/* Media */}
                      {post.image && (
                        <div className="mt-3">
                          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                            <img
                              src={post.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* Clip */}
                      {post.clipUrl && (
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg flex items-center justify-between">
                          <p className="text-sm text-violet-400">🎬 Video clip attached</p>
                          <Button variant="ghost" size="sm">
                            <Play className="w-4 h-4" />
                            Play
                          </Button>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                        <div className="flex items-center gap-4 sm:gap-6">
                          <button className={`flex items-center gap-2 text-sm transition-colors ${post.isLiked ? 'text-orange-400' : 'text-gray-400 hover:text-white'}`}>
                            <span>🔥</span>
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.replies}</span>
                          </button>
                          <button className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
                            Share
                          </button>
                        </div>

                        {/* Challenge button on posts */}
                        {author.id !== user?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleChallenge(author.id)}
                            className="text-orange-400 hover:text-orange-300 hover:bg-orange-400/10"
                          >
                            <Crosshair className="w-4 h-4" />
                            <span className="hidden sm:inline">Challenge</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sidebar - Hidden on mobile, shown on lg screens */}
      <div className="hidden lg:block w-80 space-y-6 flex-shrink-0">
        {/* Chatterbox */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="font-bold text-white">Chatterbox</h3>
            <p className="text-xs text-gray-500">Jump into voice chat</p>
          </CardHeader>
          <CardContent>
            <VoiceChat
              matchId="community-lounge"
              username={user?.username || 'Guest'}
              className="h-36"
            />
          </CardContent>
        </Card>

        {/* Live Matches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h3 className="font-bold text-white">Live Matches</h3>
            </div>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {liveMatches.map((match) => (
              <div
                key={match.id}
                className="p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar src={match.player1.avatar} name={match.player1.username} size="xs" />
                    <span className="text-sm text-white truncate max-w-[60px]">{match.player1.username}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2">
                    <span className="text-white font-bold">{match.score1}</span>
                    <span className="text-gray-600">-</span>
                    <span className="text-white font-bold">{match.score2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white truncate max-w-[60px]">{match.player2.username}</span>
                    <Avatar src={match.player2.avatar} name={match.player2.username} size="xs" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{match.duration}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{match.viewers}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full">
              <Eye className="w-4 h-4" />
              Spectate More
            </Button>
          </CardContent>
        </Card>

        {/* Open Challenges */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-orange-400" />
              <h3 className="font-bold text-white">Open Challenges</h3>
            </div>
            <Link
              href="/calls"
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {openChallenges.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No open challenges right now</p>
            ) : (
              openChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar src={challenge.challenger.avatar} name={challenge.challenger.username} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-white">{challenge.challenger.username}</p>
                        <p className="text-xs text-gray-500">Lvl {challenge.challenger.level}</p>
                      </div>
                    </div>
                    {challenge.creditPot > 0 && (
                      <Badge variant="warning" size="sm">
                        {formatCredits(challenge.creditPot)} RC
                      </Badge>
                    )}
                  </div>
                  {challenge.message && (
                    <p className="text-xs text-gray-400 italic mb-2 truncate">"{challenge.message}"</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Expires {formatTimeRemaining(challenge.expiresAt)}
                    </span>
                    <Button variant="primary" size="sm">
                      Accept
                    </Button>
                  </div>
                </div>
              ))
            )}
            <Link href="/calls">
              <Button variant="secondary" size="sm" className="w-full">
                <Swords className="w-4 h-4" />
                Send Challenge
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Online Players */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              <h3 className="font-bold text-white">Online Now</h3>
            </div>
            <Badge variant="success" size="sm">
              {users.filter(u => u.isOnline).length} online
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {users.filter(u => u.isOnline && u.id !== user?.id).slice(0, 6).map((onlineUser) => (
              <div
                key={onlineUser.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    src={onlineUser.avatar}
                    name={onlineUser.username}
                    size="sm"
                    isOnline
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{onlineUser.username}</p>
                    <p className="text-xs text-gray-500">Lvl {onlineUser.level}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleChallenge(onlineUser.id)}
                  className="text-orange-400 hover:text-orange-300 hover:bg-orange-400/10 p-1"
                >
                  <Crosshair className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
