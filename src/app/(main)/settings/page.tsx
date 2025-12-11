'use client';

import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Volume2,
  Globe,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/lib/utils';

type SettingsTab = 'account' | 'notifications' | 'privacy' | 'appearance' | 'audio';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors',
        enabled ? 'bg-violet-500' : 'bg-gray-700'
      )}
    >
      <div
        className={cn(
          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
          enabled ? 'left-6' : 'left-1'
        )}
      />
    </button>
  );
}

interface SettingRowProps {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingRow({ icon, label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        {icon && <div className="text-gray-400">{icon}</div>}
        <div>
          <p className="font-medium text-white">{label}</p>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAppStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    matchNotifications: true,
    soundEffects: true,
    emailNotifications: false,
    pushNotifications: true,
    // Privacy
    showOnlineStatus: true,
    allowChallenges: true,
    showProfile: true,
    // Appearance
    theme: 'dark' as 'light' | 'dark' | 'system',
    compactMode: false,
    animationsEnabled: true,
    // Audio
    masterVolume: 80,
    musicVolume: 50,
    sfxVolume: 100,
  });

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { key: 'account', label: 'Account', icon: <User className="w-5 h-5" /> },
    { key: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { key: 'privacy', label: 'Privacy', icon: <Shield className="w-5 h-5" /> },
    { key: 'appearance', label: 'Appearance', icon: <Palette className="w-5 h-5" /> },
    { key: 'audio', label: 'Audio', icon: <Volume2 className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-violet-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your account preferences</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as SettingsTab)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                activeTab === key
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              )}
            >
              {icon}
              {label}
            </button>
          ))}

          <div className="pt-4 border-t border-gray-800 mt-4">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Account */}
          {activeTab === 'account' && (
            <Card>
              <CardHeader>
                <h3 className="font-bold text-white">Account Settings</h3>
              </CardHeader>
              <CardContent className="divide-y divide-gray-800">
                <SettingRow label="Username" description={user?.username}>
                  <Button variant="ghost" size="sm">
                    Change
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </SettingRow>

                <SettingRow label="Email" description={user?.email}>
                  <Button variant="ghost" size="sm">
                    Change
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </SettingRow>

                <SettingRow label="Password" description="Last changed 3 months ago">
                  <Button variant="ghost" size="sm">
                    Change
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </SettingRow>

                <SettingRow
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security"
                >
                  <Badge variant="warning" size="sm">Not enabled</Badge>
                </SettingRow>

                <div className="pt-4">
                  <Button variant="danger" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <h3 className="font-bold text-white">Notification Preferences</h3>
              </CardHeader>
              <CardContent className="divide-y divide-gray-800">
                <SettingRow
                  icon={<Bell className="w-5 h-5" />}
                  label="Match Notifications"
                  description="Get notified when a match is found"
                >
                  <Toggle
                    enabled={settings.matchNotifications}
                    onChange={(v) => updateSetting('matchNotifications', v)}
                  />
                </SettingRow>

                <SettingRow
                  icon={<Volume2 className="w-5 h-5" />}
                  label="Sound Effects"
                  description="Play sounds for notifications"
                >
                  <Toggle
                    enabled={settings.soundEffects}
                    onChange={(v) => updateSetting('soundEffects', v)}
                  />
                </SettingRow>

                <SettingRow
                  label="Email Notifications"
                  description="Receive updates via email"
                >
                  <Toggle
                    enabled={settings.emailNotifications}
                    onChange={(v) => updateSetting('emailNotifications', v)}
                  />
                </SettingRow>

                <SettingRow
                  label="Push Notifications"
                  description="Browser push notifications"
                >
                  <Toggle
                    enabled={settings.pushNotifications}
                    onChange={(v) => updateSetting('pushNotifications', v)}
                  />
                </SettingRow>
              </CardContent>
            </Card>
          )}

          {/* Privacy */}
          {activeTab === 'privacy' && (
            <Card>
              <CardHeader>
                <h3 className="font-bold text-white">Privacy Settings</h3>
              </CardHeader>
              <CardContent className="divide-y divide-gray-800">
                <SettingRow
                  icon={<Globe className="w-5 h-5" />}
                  label="Show Online Status"
                  description="Let others see when you're online"
                >
                  <Toggle
                    enabled={settings.showOnlineStatus}
                    onChange={(v) => updateSetting('showOnlineStatus', v)}
                  />
                </SettingRow>

                <SettingRow
                  label="Allow Challenges"
                  description="Let other players challenge you to matches"
                >
                  <Toggle
                    enabled={settings.allowChallenges}
                    onChange={(v) => updateSetting('allowChallenges', v)}
                  />
                </SettingRow>

                <SettingRow
                  label="Public Profile"
                  description="Allow others to view your profile"
                >
                  <Toggle
                    enabled={settings.showProfile}
                    onChange={(v) => updateSetting('showProfile', v)}
                  />
                </SettingRow>

                <div className="pt-4 space-y-3">
                  <Button variant="secondary" className="w-full">
                    Download My Data
                  </Button>
                  <Button variant="ghost" className="w-full text-gray-400">
                    View Blocked Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <h3 className="font-bold text-white">Appearance</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="font-medium text-white mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'light', label: 'Light', icon: <Sun className="w-5 h-5" /> },
                      { key: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" /> },
                      { key: 'system', label: 'System', icon: <Monitor className="w-5 h-5" /> },
                    ].map(({ key, label, icon }) => (
                      <button
                        key={key}
                        onClick={() => updateSetting('theme', key as any)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors',
                          settings.theme === key
                            ? 'border-violet-500 bg-violet-500/10'
                            : 'border-gray-800 hover:border-gray-700'
                        )}
                      >
                        {icon}
                        <span className="text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-gray-800">
                  <SettingRow
                    label="Compact Mode"
                    description="Reduce spacing and padding"
                  >
                    <Toggle
                      enabled={settings.compactMode}
                      onChange={(v) => updateSetting('compactMode', v)}
                    />
                  </SettingRow>

                  <SettingRow
                    label="Animations"
                    description="Enable UI animations"
                  >
                    <Toggle
                      enabled={settings.animationsEnabled}
                      onChange={(v) => updateSetting('animationsEnabled', v)}
                    />
                  </SettingRow>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio */}
          {activeTab === 'audio' && (
            <Card>
              <CardHeader>
                <h3 className="font-bold text-white">Audio Settings</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'masterVolume', label: 'Master Volume' },
                  { key: 'musicVolume', label: 'Music' },
                  { key: 'sfxVolume', label: 'Sound Effects' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-white">{label}</p>
                      <span className="text-sm text-gray-400">
                        {settings[key as keyof typeof settings]}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings[key as keyof typeof settings] as number}
                      onChange={(e) =>
                        updateSetting(key as any, parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
