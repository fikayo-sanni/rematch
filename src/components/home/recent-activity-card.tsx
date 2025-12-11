'use client';

import { Activity, Trophy, Swords, UserPlus } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { users } from '@/data/dummy';
import { formatTimeAgo } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'match_win' | 'match_loss' | 'rank_up' | 'joined_guild';
  user: typeof users[0];
  description: string;
  timestamp: string;
}

// Mock activity data
const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'match_win',
    user: users[0],
    description: 'won a 1v1 match',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'rank_up',
    user: users[1],
    description: 'reached Diamond III',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'match_loss',
    user: users[2],
    description: 'lost a 2v2 match',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'joined_guild',
    user: users[3],
    description: 'joined the guild',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

function getActivityIcon(type: ActivityItem['type']) {
  switch (type) {
    case 'match_win':
      return <Trophy className="w-4 h-4 text-yellow-400" />;
    case 'match_loss':
      return <Swords className="w-4 h-4 text-red-400" />;
    case 'rank_up':
      return <Trophy className="w-4 h-4 text-purple-400" />;
    case 'joined_guild':
      return <UserPlus className="w-4 h-4 text-green-400" />;
  }
}

export function RecentActivityCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Activity className="w-5 h-5 text-blue-400" />
        <h3 className="font-bold text-white">Recent Activity</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 p-3 bg-gray-800/30  rounded-lg"
          >
            <Avatar
              src={activity.user.avatar}
              alt={activity.user.username}
              fallback={activity.user.username}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 truncate">
                <span className="font-medium text-white">
                  {activity.user.username}
                </span>{' '}
                {activity.description}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
            {getActivityIcon(activity.type)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
