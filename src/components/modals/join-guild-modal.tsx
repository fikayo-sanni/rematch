'use client';

import { useState } from 'react';
import { X, Search, Users, Check, TrendingUp, Trophy, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { guilds } from '@/data/dummy';
import { useAppStore, useJoinedGuilds } from '@/stores/app.store';
import { Guild } from '@/types';
import { cn } from '@/lib/utils';

interface JoinGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedGuild?: Guild | null;
}

export function JoinGuildModal({ isOpen, onClose, preselectedGuild }: JoinGuildModalProps) {
  const { joinGuild, setActiveGuild } = useAppStore();
  const joinedGuilds = useJoinedGuilds();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(preselectedGuild || null);
  const [view, setView] = useState<'browse' | 'preview'>(preselectedGuild ? 'preview' : 'browse');

  if (!isOpen) return null;

  const availableGuilds = guilds.filter(
    g => !joinedGuilds.find(jg => jg.id === g.id) &&
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectGuild = (guild: Guild) => {
    setSelectedGuild(guild);
    setView('preview');
  };

  const handleJoinGuild = () => {
    if (selectedGuild) {
      joinGuild(selectedGuild.id);
      setActiveGuild(selectedGuild.id);
      onClose();
    }
  };

  const handleBack = () => {
    setView('browse');
    setSelectedGuild(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            {view === 'preview' && (
              <button
                onClick={handleBack}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mr-2"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {view === 'browse' ? 'Browse Games' : 'Join Game'}
              </h2>
              <p className="text-sm text-gray-400">
                {view === 'browse'
                  ? 'Find new games to compete in'
                  : `Join the ${selectedGuild?.name} community`
                }
              </p>
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
        <div className="flex-1 overflow-y-auto">
          {view === 'browse' ? (
            <div className="p-6">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Guild Grid */}
              {availableGuilds.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Games Found</h3>
                  <p className="text-gray-400">
                    {searchQuery
                      ? 'Try a different search term'
                      : "You've joined all available games!"
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableGuilds.map((guild) => (
                    <Card
                      key={guild.id}
                      hover
                      className="cursor-pointer"
                      onClick={() => handleSelectGuild(guild)}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 overflow-hidden"
                            style={{ backgroundColor: `${guild.accentColor}20` }}
                          >
                            {guild.logo ? (
                              <img src={guild.logo} alt={guild.name} className="w-full h-full object-cover" />
                            ) : (
                              <span style={{ color: guild.accentColor }}>
                                {guild.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white">{guild.name}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2">{guild.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-500">
                                {guild.memberCount.toLocaleString()} players
                              </span>
                              <Badge variant="success" size="sm">
                                {guild.activeNow.toLocaleString()} online
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : selectedGuild && (
            <div>
              {/* Guild Banner */}
              <div
                className="h-32 relative"
                style={{
                  background: selectedGuild.banner
                    ? `url(${selectedGuild.banner}) center/cover`
                    : `linear-gradient(135deg, ${selectedGuild.accentColor}40, ${selectedGuild.accentColor}10)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              </div>

              {/* Guild Info */}
              <div className="px-6 -mt-8 relative">
                <div className="flex items-end gap-4">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold border-4 border-gray-900 overflow-hidden"
                    style={{ backgroundColor: `${selectedGuild.accentColor}20` }}
                  >
                    {selectedGuild.logo ? (
                      <img src={selectedGuild.logo} alt={selectedGuild.name} className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ color: selectedGuild.accentColor }}>
                        {selectedGuild.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="pb-1">
                    <h3 className="text-2xl font-bold text-white">{selectedGuild.name}</h3>
                    <p className="text-gray-400">{selectedGuild.description}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-800/50 rounded-xl text-center">
                    <Users className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {selectedGuild.memberCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Total Players</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl text-center">
                    <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {selectedGuild.activeNow.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Online Now</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl text-center">
                    <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {selectedGuild.editions.length}
                    </p>
                    <p className="text-xs text-gray-500">Game Editions</p>
                  </div>
                </div>

                {/* Editions */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Available Editions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuild.editions.map((edition) => (
                      <Badge
                        key={edition.id}
                        variant={edition.isDefault ? 'success' : 'default'}
                      >
                        {edition.name}
                        {edition.isDefault && ' (Latest)'}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Top Players Preview */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Top Players</h4>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Avatar
                        key={i}
                        src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=top${selectedGuild.id}${i}`}
                        name={`Player ${i}`}
                        size="md"
                        className="border-2 border-gray-900"
                      />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center">
                      <span className="text-xs text-gray-400">+{selectedGuild.memberCount - 5}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {view === 'preview' && selectedGuild && (
          <div className="p-6 border-t border-gray-800">
            <Button
              variant="glow"
              size="lg"
              className="w-full"
              onClick={handleJoinGuild}
            >
              <Check className="w-5 h-5" />
              Join {selectedGuild.name}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
