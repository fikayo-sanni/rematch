'use client';

import { useState } from 'react';
import { X, Trophy, Calendar, Users, Coins, Info, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore, useActiveGuild, useActiveEdition } from '@/stores/app.store';
import { LeagueType } from '@/types';
import { cn } from '@/lib/utils';

interface CreateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const leagueTypes: { type: LeagueType; label: string; description: string }[] = [
  { type: 'round_robin', label: 'Round Robin', description: 'Everyone plays everyone once' },
  { type: 'knockout', label: 'Knockout', description: 'Single elimination bracket' },
  { type: 'swiss', label: 'Swiss System', description: 'Paired by similar records' },
];

const participantOptions = [4, 8, 12, 16, 24, 32];

export function CreateLeagueModal({ isOpen, onClose }: CreateLeagueModalProps) {
  const { user } = useAppStore();
  const activeGuild = useActiveGuild();
  const activeEdition = useActiveEdition();

  const [leagueName, setLeagueName] = useState('');
  const [description, setDescription] = useState('');
  const [leagueType, setLeagueType] = useState<LeagueType>('round_robin');
  const [maxParticipants, setMaxParticipants] = useState(8);
  const [entryFee, setEntryFee] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen || !user || !activeGuild) return null;

  const prizePool = entryFee * maxParticipants * 0.9; // 10% platform fee

  const handleCreateLeague = () => {
    // In real app, this would create the league via API
    console.log('Creating league:', {
      name: leagueName,
      description,
      type: leagueType,
      maxParticipants,
      entryFee,
      prizePool,
      startDate,
      isPrivate,
      guild: activeGuild,
      edition: activeEdition,
      creator: user,
    });
    onClose();
  };

  const isValid = leagueName.length >= 3 && startDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: activeGuild.accentColor + '20' }}
            >
              <Trophy className="w-5 h-5" style={{ color: activeGuild.accentColor }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create League</h2>
              <p className="text-sm text-gray-400">Host a competitive mini-league</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* League Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              League Name
            </label>
            <input
              type="text"
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              placeholder="Enter league name..."
              maxLength={40}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your league..."
              rows={2}
              maxLength={200}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          {/* League Type */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {leagueTypes.map(({ type, label, description }) => (
                <button
                  key={type}
                  onClick={() => setLeagueType(type)}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all text-left',
                    leagueType === type
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  )}
                >
                  <p className="font-medium text-white text-sm">{label}</p>
                  <p className="text-xs text-gray-500 mt-1">{description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Participants & Entry Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Max Players
              </label>
              <div className="relative">
                <select
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-violet-500 transition-colors"
                >
                  {participantOptions.map((num) => (
                    <option key={num} value={num}>{num} players</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Coins className="w-4 h-4 inline mr-1" />
                Entry Fee (RC)
              </label>
              <input
                type="number"
                value={entryFee}
                onChange={(e) => setEntryFee(Math.max(0, Number(e.target.value)))}
                placeholder="0"
                min={0}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* Prize Pool Preview */}
          {entryFee > 0 && (
            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/5 rounded-xl border border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-400">Prize Pool</span>
                </div>
                <span className="text-xl font-bold text-yellow-400">
                  {prizePool.toLocaleString()} RC
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                10% platform fee deducted from total entries
              </p>
            </div>
          )}

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Private Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
            <div>
              <p className="font-medium text-white">Private League</p>
              <p className="text-sm text-gray-400">Only invited players can join</p>
            </div>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={cn(
                'w-12 h-6 rounded-full transition-colors relative',
                isPrivate ? 'bg-violet-500' : 'bg-gray-700'
              )}
            >
              <div
                className={cn(
                  'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                  isPrivate ? 'translate-x-7' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Game Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: activeGuild.accentColor + '20' }}
            >
              <span className="text-sm font-bold" style={{ color: activeGuild.accentColor }}>
                {activeGuild.name.slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{activeGuild.name}</p>
              <p className="text-xs text-gray-500">{activeEdition?.name || 'All editions'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <Button
            variant="glow"
            size="lg"
            className="w-full"
            onClick={handleCreateLeague}
            disabled={!isValid}
          >
            <Trophy className="w-5 h-5" />
            Create League
          </Button>
        </div>
      </div>
    </div>
  );
}
