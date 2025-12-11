'use client';

import { Zap, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useActiveGuild } from '@/stores/app.store';

interface QuickPullCardProps {
  onStartPull: () => void;
}

export function QuickPullCard({ onStartPull }: QuickPullCardProps) {
  const activeGuild = useActiveGuild();

  if (!activeGuild) return null;

  return (
    <Card className="relative overflow-hidden" hover glow>
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${activeGuild.accentColor}, transparent)`,
        }}
      />

      <CardContent className="relative p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${activeGuild.accentColor}20` }}
              >
                <Zap
                  className="w-7 h-7"
                  style={{ color: activeGuild.accentColor }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Quick Match</h2>
                <p className="text-gray-400">Find a ranked match instantly</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4 text-green-400" />
                <span>
                  <span className="text-white font-medium">
                    {activeGuild.activeNow.toLocaleString()}
                  </span>{' '}
                  players online
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span>
                  <span className="text-white font-medium">~30s</span> avg wait
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="glow"
            size="lg"
            onClick={onStartPull}
            className="px-8"
          >
            <Zap className="w-5 h-5" />
            Find Match
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
