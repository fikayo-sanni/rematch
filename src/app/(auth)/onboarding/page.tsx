'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gamepad2, ChevronRight, Check, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { guilds } from '@/data/dummy';
import { useAppStore } from '@/stores/app.store';
import { currentUser } from '@/data/dummy';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Select Games', description: 'Choose the games you play' },
  { id: 2, title: 'Join Guilds', description: 'Find your gaming communities' },
  { id: 3, title: 'Ready to Play', description: 'Start competing!' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { login, joinGuild } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedGuilds, setSelectedGuilds] = useState<string[]>([]);

  const handleGameToggle = (gameId: string) => {
    setSelectedGames(prev =>
      prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleGuildToggle = (guildId: string) => {
    setSelectedGuilds(prev =>
      prev.includes(guildId)
        ? prev.filter(id => id !== guildId)
        : [...prev, guildId]
    );
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      login(currentUser);
      selectedGuilds.forEach(guildId => joinGuild(guildId));
      router.push('/');
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedGames.length > 0;
    if (currentStep === 2) return selectedGuilds.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Rematch</span>
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors',
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-violet-500 text-white'
                        : 'bg-gray-800 text-gray-500'
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p
                      className={cn(
                        'font-medium',
                        currentStep >= step.id ? 'text-white' : 'text-gray-500'
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-12 sm:w-24 h-0.5 mx-4',
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-800'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Step 1: Select Games */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  What games do you play?
                </h2>
                <p className="text-gray-400">
                  Select the games you're interested in competing in
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {guilds.map((guild) => (
                  <button
                    key={guild.id}
                    onClick={() => handleGameToggle(guild.id)}
                    className={cn(
                      'p-6 rounded-2xl border-2 transition-all duration-200 text-left',
                      selectedGames.includes(guild.id)
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl overflow-hidden"
                        style={{ backgroundColor: `${guild.accentColor}20` }}
                      >
                        {guild.logo ? (
                          <img src={guild.logo} alt={guild.name} className="w-full h-full object-cover" />
                        ) : (
                          <span style={{ color: guild.accentColor }}>{guild.name.slice(0, 2)}</span>
                        )}
                      </div>
                      {selectedGames.includes(guild.id) && (
                        <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-white">{guild.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {guild.memberCount.toLocaleString()} players
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Join Guilds */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Join your first guilds
                </h2>
                <p className="text-gray-400">
                  Guilds are communities around specific games
                </p>
              </div>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search guilds..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guilds
                  .filter(g => selectedGames.includes(g.id))
                  .map((guild) => (
                    <Card
                      key={guild.id}
                      hover
                      className={cn(
                        'cursor-pointer transition-all',
                        selectedGuilds.includes(guild.id) && 'border-violet-500'
                      )}
                      onClick={() => handleGuildToggle(guild.id)}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold overflow-hidden"
                              style={{
                                backgroundColor: `${guild.accentColor}20`,
                                color: guild.accentColor,
                              }}
                            >
                              {guild.logo ? (
                                <img src={guild.logo} alt={guild.name} className="w-full h-full object-cover" />
                              ) : (
                                guild.name.slice(0, 2)
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-white">{guild.name}</h3>
                              <p className="text-sm text-gray-400 mt-0.5">
                                {guild.description}
                              </p>
                            </div>
                          </div>
                          {selectedGuilds.includes(guild.id) && (
                            <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Users className="w-4 h-4" />
                            {guild.memberCount.toLocaleString()} members
                          </div>
                          <Badge variant="success" size="sm">
                            {guild.activeNow.toLocaleString()} online
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Step 3: Ready */}
          {currentStep === 3 && (
            <div className="text-center space-y-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-purple-500/30 mb-4">
                <Check className="w-12 h-12 text-white" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  You're all set!
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Welcome to Rematch. Start competing, climb the ranks, and dominate your games.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {selectedGuilds.map((guildId) => {
                  const guild = guilds.find(g => g.id === guildId);
                  if (!guild) return null;
                  return (
                    <Badge
                      key={guild.id}
                      variant="default"
                      style={{
                        backgroundColor: `${guild.accentColor}20`,
                        color: guild.accentColor,
                      }}
                    >
                      {guild.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {currentStep > 1 ? (
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {currentStep < 3 && (
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Skip
              </Button>
            )}
            <Button
              variant="glow"
              size="lg"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === 3 ? (
                'Enter Rematch'
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
