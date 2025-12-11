'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  X,
  Users,
  Settings,
  CheckCircle2,
} from 'lucide-react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useLocalParticipant,
  useTracks,
  TrackToggle,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceChatProps {
  matchId: string;
  username: string;
  isPlayer?: boolean;
  onParticipantCountChange?: (count: number) => void;
  className?: string;
}

// Demo LiveKit server URL - in production, use your own LiveKit server
const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://rematch-demo.livekit.cloud';

// Generate a demo token - in production, generate tokens server-side
async function generateToken(roomName: string, participantName: string): Promise<string> {
  // For demo purposes, we'll use LiveKit's sandbox token endpoint
  // In production, implement your own token generation on the backend
  try {
    const response = await fetch('/api/livekit/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName, participantName }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
  } catch (error) {
    console.log('Using demo mode - token API not available');
  }

  // Return empty string to indicate demo mode / no server
  return '';
}

// Participant count component
function ParticipantCount({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const participants = useParticipants();

  // Notify parent of participant count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(participants.length);
    }
  }, [participants.length, onCountChange]);

  return <span className="hidden">{participants.length}</span>;
}

// Custom audio-only room view with speaker control
function AudioRoomView({
  onLeave,
  isSpeakerMuted,
  onToggleSpeaker
}: {
  onLeave: () => void;
  isSpeakerMuted: boolean;
  onToggleSpeaker: () => void;
}) {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const tracks = useTracks([Track.Source.Microphone]);

  const isMicMuted = !localParticipant.isMicrophoneEnabled;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Participants grid */}
      <div className="flex-1 min-h-0 p-4 overflow-y-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {participants.map((participant) => {
            const audioTrack = tracks.find(
              (t) => t.participant.identity === participant.identity && t.source === Track.Source.Microphone
            );
            const isSpeaking = audioTrack?.publication?.track?.isMuted === false;

            return (
              <div
                key={participant.identity}
                className={cn(
                  "flex flex-col items-center p-3 rounded-xl transition-all",
                  isSpeaking ? "bg-green-500/20 ring-2 ring-green-500/50" : "bg-gray-800/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-2",
                  participant.identity === localParticipant.identity
                    ? "bg-violet-500/30 text-violet-300"
                    : "bg-gray-700 text-gray-300"
                )}>
                  {participant.identity.charAt(0).toUpperCase()}
                </div>
                <p className="text-xs text-white truncate max-w-full">
                  {participant.identity}
                  {participant.identity === localParticipant.identity && " (You)"}
                </p>
                <div className="mt-1">
                  {participant.isMicrophoneEnabled ? (
                    <Mic className="w-3 h-3 text-green-400" />
                  ) : (
                    <MicOff className="w-3 h-3 text-red-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-center gap-3">
          {/* Microphone Toggle */}
          <TrackToggle
            source={Track.Source.Microphone}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              isMicMuted
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-gray-800 text-white hover:bg-gray-700"
            )}
          >
            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </TrackToggle>

          {/* Speaker Toggle */}
          <button
            onClick={onToggleSpeaker}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              isSpeakerMuted
                ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                : "bg-gray-800 text-white hover:bg-gray-700"
            )}
            title={isSpeakerMuted ? "Unmute speaker" : "Mute speaker"}
          >
            {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Leave Button */}
          <button
            onClick={onLeave}
            className="w-12 h-12 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition-all"
            title="Leave"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-3">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">{participants.length} in room</span>
        </div>
      </div>

      {/* Only render audio if speaker is not muted */}
      {!isSpeakerMuted && <RoomAudioRenderer />}
    </div>
  );
}


export function VoiceChat({ matchId, username, onParticipantCountChange, className }: VoiceChatProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string>('');
  const [participantCount, setParticipantCount] = useState(0);
  const [demoMode, setDemoMode] = useState(false);

  // Audio settings
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isMicMutedInline, setIsMicMutedInline] = useState(false);

  const roomName = `rematch-${matchId.replace(/[^a-zA-Z0-9]/g, '')}`;

  const handleParticipantCountChange = useCallback((count: number) => {
    setParticipantCount(count);
    onParticipantCountChange?.(count);
  }, [onParticipantCountChange]);

  // Open setup modal when clicking join
  const handleJoinClick = () => {
    setShowSetupModal(true);
  };

  // Actually join after setup
  const joinVoiceChat = async () => {
    setShowSetupModal(false);
    setIsLoading(true);
    setShowModal(true);
    setIsSpeakerMuted(!speakerEnabled);

    try {
      const generatedToken = await generateToken(roomName, username);

      if (!generatedToken) {
        // Demo mode - show UI without actual connection
        setDemoMode(true);
        setIsJoined(true);
        setParticipantCount(1);
        onParticipantCountChange?.(1);
      } else {
        setToken(generatedToken);
        setIsJoined(true);
      }
    } catch (error) {
      console.error('Failed to join voice chat:', error);
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const leaveVoiceChat = () => {
    setIsJoined(false);
    setShowModal(false);
    setToken('');
    setParticipantCount(0);
    setDemoMode(false);
    onParticipantCountChange?.(0);
  };

  const handleConnected = () => {
    setIsLoading(false);
    // Auto-close modal after connection
    setTimeout(() => setShowModal(false), 500);
  };

  const handleDisconnected = () => {
    leaveVoiceChat();
  };

  const toggleSpeaker = () => {
    setIsSpeakerMuted(!isSpeakerMuted);
  };

  // Setup Modal - shown before joining
  const SetupModal = () => {
    if (!showSetupModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Join Chatterbox</h3>
                <p className="text-xs text-gray-500">Setup your audio before joining</p>
              </div>
            </div>
            <button
              onClick={() => setShowSetupModal(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Setup Content */}
          <div className="p-6 space-y-6">
            {/* User Preview */}
            <div className="flex flex-col items-center py-4">
              <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mb-3">
                <span className="text-3xl font-bold text-violet-300">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-white font-medium">{username}</p>
              <p className="text-xs text-gray-500">Joining voice chat</p>
            </div>

            {/* Audio Settings */}
            <div className="space-y-4">
              {/* Microphone Setting */}
              <button
                onClick={() => setMicEnabled(!micEnabled)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                  micEnabled
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-gray-800/50 border-gray-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    micEnabled ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-400"
                  )}>
                    {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Microphone</p>
                    <p className="text-xs text-gray-500">
                      {micEnabled ? "Others can hear you" : "You'll be muted"}
                    </p>
                  </div>
                </div>
                {micEnabled && <CheckCircle2 className="w-5 h-5 text-green-400" />}
              </button>

              {/* Speaker Setting */}
              <button
                onClick={() => setSpeakerEnabled(!speakerEnabled)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                  speakerEnabled
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-gray-800/50 border-gray-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    speakerEnabled ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-400"
                  )}>
                    {speakerEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Speaker</p>
                    <p className="text-xs text-gray-500">
                      {speakerEnabled ? "You can hear others" : "Audio muted"}
                    </p>
                  </div>
                </div>
                {speakerEnabled && <CheckCircle2 className="w-5 h-5 text-green-400" />}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowSetupModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 gap-2"
              onClick={joinVoiceChat}
            >
              <Mic className="w-4 h-4" />
              Join Chat
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Connection Modal - shown when in the room
  const ConnectionModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl mx-4 h-[500px] max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Chatterbox</h3>
                <p className="text-xs text-gray-500">
                  {isLoading ? 'Connecting...' : `${participantCount} in room`}
                  {demoMode && ' (Demo)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isJoined && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400">Connected</span>
                </div>
              )}
              <button
                onClick={() => {
                  if (isJoined) {
                    setShowModal(false);
                  } else {
                    leaveVoiceChat();
                  }
                }}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Room Content */}
          <div className="flex-1 min-h-0 bg-gray-950 overflow-hidden">
            {demoMode ? (
              // Demo mode UI
              <div className="flex flex-col h-full">
                <div className="flex-1 p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-violet-300">
                        {username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white font-medium">{username}</p>
                    <p className="text-xs text-gray-500 mt-1">Demo Mode - Configure LiveKit server for real chat</p>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-800 flex-shrink-0">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setIsMicMutedInline(!isMicMutedInline)}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        isMicMutedInline
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      )}
                    >
                      {isMicMutedInline ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={toggleSpeaker}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        isSpeakerMuted
                          ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      )}
                    >
                      {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={leaveVoiceChat}
                      className="w-12 h-12 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center transition-all"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : token ? (
              <div className="h-full flex flex-col">
                <LiveKitRoom
                  serverUrl={LIVEKIT_URL}
                  token={token}
                  connect={true}
                  audio={micEnabled}
                  video={false}
                  onConnected={handleConnected}
                  onDisconnected={handleDisconnected}
                  className="h-full flex flex-col"
                >
                  <AudioRoomView
                    onLeave={leaveVoiceChat}
                    isSpeakerMuted={isSpeakerMuted}
                    onToggleSpeaker={toggleSpeaker}
                  />
                  <ParticipantCount onCountChange={handleParticipantCountChange} />
                </LiveKitRoom>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="flex items-center gap-2 text-violet-300">
                  <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
                  <span>Connecting...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Joined state - show inline controls with mic and speaker toggles
  if (isJoined && !showModal) {
    return (
      <div className={cn("h-full", className)}>
        <SetupModal />
        <ConnectionModal />
        <div className="h-full bg-violet-500/10 border border-violet-500/30 rounded-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-violet-500/20">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400">Live</span>
              </div>
              <span className="text-[10px] text-violet-300">{participantCount}</span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="text-[10px] text-violet-400 hover:text-white transition-colors"
              title="Open room"
            >
              Open
            </button>
          </div>

          {/* Compact Controls */}
          <div className="flex-1 flex items-center justify-center p-2">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {/* Mic Toggle */}
              <button
                onClick={() => setIsMicMutedInline(!isMicMutedInline)}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                  isMicMutedInline
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "bg-gray-800/80 text-white hover:bg-gray-700"
                )}
                title={isMicMutedInline ? "Unmute mic" : "Mute mic"}
              >
                {isMicMutedInline ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </button>

              {/* Speaker Toggle */}
              <button
                onClick={toggleSpeaker}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                  isSpeakerMuted
                    ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                    : "bg-gray-800/80 text-white hover:bg-gray-700"
                )}
                title={isSpeakerMuted ? "Unmute speaker" : "Mute speaker"}
              >
                {isSpeakerMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>

              {/* Leave */}
              <button
                onClick={leaveVoiceChat}
                className="w-7 h-7 rounded-full bg-red-500/80 text-white hover:bg-red-500 flex items-center justify-center transition-all"
                title="Leave"
              >
                <PhoneOff className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not joined state - purple box with join button
  return (
    <div className={cn("h-full", className)}>
      <SetupModal />
      <ConnectionModal />
      <div className="h-full bg-violet-500/10 border border-violet-500/30 rounded-2xl flex flex-col items-center justify-center p-3">
        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center mb-2">
          <Volume2 className="w-4 h-4 text-violet-400" />
        </div>
        <p className="text-violet-300 text-[10px] font-medium mb-2">Chatterbox</p>
        {!isLoading ? (
          <Button
            variant="primary"
            size="sm"
            onClick={handleJoinClick}
            className="gap-1.5 text-xs px-3 py-1.5"
          >
            <Mic className="w-3 h-3" />
            Join
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-violet-300">
            <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
            <span className="text-xs">Connecting...</span>
          </div>
        )}
      </div>
    </div>
  );
}
