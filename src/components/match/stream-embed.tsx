'use client';

import { useState } from 'react';
import { Video, Tv, Link2, X, ExternalLink, Play } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StreamPlatform = 'twitch' | 'youtube' | 'kick' | null;

interface StreamEmbedProps {
  className?: string;
  defaultUrl?: string;
  isSpectator?: boolean;
}

// Platform icons as simple components
function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function KickIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.333 0v24h5.334v-8l8 8h6.666l-8-8 8-8h-6.666l-8 8V0z" />
    </svg>
  );
}

function detectPlatform(url: string): { platform: StreamPlatform; embedId: string | null } {
  // Twitch channel
  const twitchMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
  if (twitchMatch) {
    return { platform: 'twitch', embedId: twitchMatch[1] };
  }

  // YouTube video or live
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return { platform: 'youtube', embedId: youtubeMatch[1] };
  }

  // Kick channel
  const kickMatch = url.match(/kick\.com\/([a-zA-Z0-9_]+)/);
  if (kickMatch) {
    return { platform: 'kick', embedId: kickMatch[1] };
  }

  return { platform: null, embedId: null };
}

function getEmbedUrl(platform: StreamPlatform, embedId: string): string {
  switch (platform) {
    case 'twitch':
      return `https://player.twitch.tv/?channel=${embedId}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`;
    case 'youtube':
      return `https://www.youtube.com/embed/${embedId}?autoplay=1`;
    case 'kick':
      return `https://player.kick.com/${embedId}`;
    default:
      return '';
  }
}

export function StreamEmbed({ className, defaultUrl, isSpectator = false }: StreamEmbedProps) {
  const [streamUrl, setStreamUrl] = useState(defaultUrl || '');
  const [activeStream, setActiveStream] = useState<{ platform: StreamPlatform; embedId: string; url: string } | null>(null);
  const [isAddingStream, setIsAddingStream] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddStream = () => {
    if (!streamUrl.trim()) {
      setError('Please enter a stream URL');
      return;
    }

    const { platform, embedId } = detectPlatform(streamUrl);

    if (!platform || !embedId) {
      setError('Invalid URL. Please enter a Twitch, YouTube, or Kick stream URL');
      return;
    }

    setActiveStream({ platform, embedId, url: streamUrl });
    setIsAddingStream(false);
    setError(null);
  };

  const handleRemoveStream = () => {
    setActiveStream(null);
    setStreamUrl('');
  };

  const platformColors = {
    twitch: 'text-purple-400',
    youtube: 'text-red-500',
    kick: 'text-green-400',
  };

  const platformBgColors = {
    twitch: 'bg-purple-500/10 border-purple-500/30',
    youtube: 'bg-red-500/10 border-red-500/30',
    kick: 'bg-green-500/10 border-green-500/30',
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-violet-400" />
          <h3 className="font-bold text-white">Live Stream</h3>
          {activeStream && (
            <Badge variant="danger" size="sm" glow>
              LIVE
            </Badge>
          )}
        </div>
        {activeStream ? (
          <div className="flex items-center gap-2">
            <a
              href={activeStream.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            {!isSpectator && (
              <button
                onClick={handleRemoveStream}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : !isSpectator && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingStream(true)}
          >
            <Link2 className="w-4 h-4" />
            Add Stream
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {activeStream ? (
          <div className="relative">
            {/* Platform indicator */}
            <div className={cn(
              'absolute top-3 left-3 z-10 flex items-center gap-2 px-2 py-1 rounded-lg',
              platformBgColors[activeStream.platform!]
            )}>
              {activeStream.platform === 'twitch' && <TwitchIcon className={cn('w-4 h-4', platformColors.twitch)} />}
              {activeStream.platform === 'youtube' && <YouTubeIcon className={cn('w-4 h-4', platformColors.youtube)} />}
              {activeStream.platform === 'kick' && <KickIcon className={cn('w-4 h-4', platformColors.kick)} />}
              <span className="text-xs font-medium text-white capitalize">{activeStream.platform}</span>
            </div>

            {/* Stream embed */}
            <div className="h-80 w-full bg-black">
              <iframe
                src={getEmbedUrl(activeStream.platform, activeStream.embedId)}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        ) : isAddingStream ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 justify-center text-gray-500">
              <div className="flex items-center gap-2">
                <TwitchIcon className="w-5 h-5 text-purple-400" />
                <span className="text-xs">Twitch</span>
              </div>
              <div className="flex items-center gap-2">
                <YouTubeIcon className="w-5 h-5 text-red-500" />
                <span className="text-xs">YouTube</span>
              </div>
              <div className="flex items-center gap-2">
                <KickIcon className="w-5 h-5 text-green-400" />
                <span className="text-xs">Kick</span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={streamUrl}
                onChange={(e) => {
                  setStreamUrl(e.target.value);
                  setError(null);
                }}
                placeholder="Paste Twitch, YouTube, or Kick URL..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingStream(false);
                  setError(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddStream}
              >
                <Play className="w-4 h-4" />
                Load Stream
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-80 w-full flex flex-col items-center justify-center bg-gray-900/50 text-gray-500">
            <Video className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium mb-1">No stream connected</p>
            {!isSpectator && (
              <p className="text-xs text-gray-600">Click "Add Stream" to embed a live stream</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
