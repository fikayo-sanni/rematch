'use client';

import { useState } from 'react';
import { X, Zap, Users, Clock, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore, useActiveGuild } from '@/stores/app.store';
import { cn } from '@/lib/utils';

interface QuickPullModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MatchType = '1v1' | '2v2' | '3v3' | '5v5';

const matchTypes: { type: MatchType; label: string; players: number }[] = [
  { type: '1v1', label: 'Solo Duel', players: 2 },
  { type: '2v2', label: 'Duo Battle', players: 4 },
  { type: '3v3', label: 'Trio Clash', players: 6 },
  { type: '5v5', label: 'Squad War', players: 10 },
];

export function QuickPullModal({ isOpen, onClose }: QuickPullModalProps) {
  const activeGuild = useActiveGuild();
  const { activeEditionId } = useAppStore();
  const [selectedType, setSelectedType] = useState<MatchType>('1v1');
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen || !activeGuild) return null;

  const activeEdition = activeGuild.editions.find(e => e.id === activeEditionId);

  const handleStartPull = () => {
    setIsSearching(true);
    // In real app, this would connect to matchmaking service
    // For demo, simulate a search then close
    setTimeout(() => {
      setIsSearching(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        {/* Glow effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${activeGuild.accentColor}, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${activeGuild.accentColor}20` }}
              >
                <Zap className="w-5 h-5" style={{ color: activeGuild.accentColor }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Quick Match</h2>
                <p className="text-sm text-gray-400">Find a match instantly</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Game info */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
              <Gamepad2 className="w-8 h-8 text-gray-400" />
              <div className="flex-1">
                <p className="font-medium text-white">{activeGuild.name}</p>
                <p className="text-sm text-gray-400">
                  {activeEdition?.name || 'Select edition'}
                </p>
              </div>
              <Badge variant="success" size="sm">
                {activeGuild.activeNow.toLocaleString()} online
              </Badge>
            </div>
          </div>

          {/* Match type selection */}
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Match Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {matchTypes.map(({ type, label, players }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                    selectedType === type
                      ? 'border-transparent bg-gradient-to-br from-violet-600/20 to-purple-600/20'
                      : 'border-gray-800 bg-gray-800/30 hover:border-gray-700'
                  )}
                  style={{
                    borderColor: selectedType === type ? activeGuild.accentColor : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-bold text-white">{type}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Estimated wait time */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Estimated wait</span>
              </div>
              <span className="text-green-400 font-medium">~30 seconds</span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6">
            <Button
              variant="glow"
              size="lg"
              className="w-full"
              onClick={handleStartPull}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching for match...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Start Matchmaking
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
