'use client';

import { useState } from 'react';
import { X, Users, Search, Check, Plus, Crown, Trash2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { users } from '@/data/dummy';
import { useAppStore, useActiveGuild } from '@/stores/app.store';
import { User } from '@/types';
import { cn } from '@/lib/utils';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const { user } = useAppStore();
  const activeGuild = useActiveGuild();
  const [step, setStep] = useState<'details' | 'members'>('details');
  const [teamName, setTeamName] = useState('');
  const [teamTag, setTeamTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  if (!isOpen || !user) return null;

  const availableUsers = users.filter(
    u => u.id !== user.id &&
    !selectedMembers.find(m => m.id === u.id) &&
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = (member: User) => {
    if (selectedMembers.length < 9) { // Max 10 including creator
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== memberId));
  };

  const handleCreateTeam = () => {
    // In real app, this would create the team via API
    console.log('Creating team:', {
      name: teamName,
      tag: teamTag,
      members: [user, ...selectedMembers],
    });
    onClose();
  };

  const isValid = teamName.length >= 3 && teamTag.length >= 2 && teamTag.length <= 4;

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
              style={{ backgroundColor: activeGuild?.accentColor + '20' }}
            >
              <Users className="w-5 h-5" style={{ color: activeGuild?.accentColor }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Team</h2>
              <p className="text-sm text-gray-400">
                {step === 'details' ? 'Set up your team identity' : 'Invite members to join'}
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

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep('details')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                step === 'details'
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                step === 'details' ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-400'
              )}>
                1
              </div>
              Team Details
            </button>
            <div className="flex-1 h-px bg-gray-800" />
            <button
              onClick={() => isValid && setStep('members')}
              disabled={!isValid}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                step === 'members'
                  ? 'bg-violet-500/20 text-violet-400'
                  : isValid
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 cursor-not-allowed'
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                step === 'members' ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-400'
              )}>
                2
              </div>
              Invite Members
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'details' ? (
            <div className="space-y-6">
              {/* Team Avatar */}
              <div className="flex justify-center">
                <button className="relative group">
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold"
                    style={{ backgroundColor: activeGuild?.accentColor + '20' }}
                  >
                    {teamName ? teamName.slice(0, 2).toUpperCase() : 'TM'}
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </button>
              </div>

              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name..."
                  maxLength={24}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">{teamName.length}/24 characters</p>
              </div>

              {/* Team Tag */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Team Tag
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">[</span>
                  <input
                    type="text"
                    value={teamTag}
                    onChange={(e) => setTeamTag(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    placeholder="TAG"
                    maxLength={4}
                    className="w-full px-8 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-center placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors uppercase tracking-wider"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">]</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">2-4 characters, shown as [{teamTag || 'TAG'}]</p>
              </div>

              {/* Preview */}
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: activeGuild?.accentColor + '20' }}
                  >
                    {teamName ? teamName.slice(0, 2).toUpperCase() : 'TM'}
                  </div>
                  <div>
                    <p className="font-bold text-white">{teamName || 'Team Name'}</p>
                    <p className="text-sm text-gray-400">[{teamTag || 'TAG'}]</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Members */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Team Members ({1 + selectedMembers.length}/10)
                </h3>
                <div className="space-y-2">
                  {/* Creator (You) */}
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-violet-500/20">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.avatar}
                        name={user.username}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-white">{user.username}</p>
                        <p className="text-xs text-gray-500">Level {user.level}</p>
                      </div>
                    </div>
                    <Badge variant="warning" size="sm">
                      <Crown className="w-3 h-3 mr-1" />
                      Leader
                    </Badge>
                  </div>

                  {/* Selected Members */}
                  {selectedMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={member.avatar}
                          name={member.username}
                          size="md"
                          isOnline={member.isOnline}
                        />
                        <div>
                          <p className="font-medium text-white">{member.username}</p>
                          <p className="text-xs text-gray-500">Level {member.level}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search & Add Members */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Add Members</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search players..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableUsers.slice(0, 10).map((availableUser) => (
                    <button
                      key={availableUser.id}
                      onClick={() => handleAddMember(availableUser)}
                      disabled={selectedMembers.length >= 9}
                      className="w-full flex items-center justify-between p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={availableUser.avatar}
                          name={availableUser.username}
                          size="sm"
                          isOnline={availableUser.isOnline}
                        />
                        <div className="text-left">
                          <p className="font-medium text-white">{availableUser.username}</p>
                          <p className="text-xs text-gray-500">Level {availableUser.level}</p>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          {step === 'details' ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setStep('members')}
              disabled={!isValid}
            >
              Continue to Invite Members
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={() => setStep('details')}
              >
                Back
              </Button>
              <Button
                variant="glow"
                size="lg"
                className="flex-1"
                onClick={handleCreateTeam}
              >
                Create Team
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
