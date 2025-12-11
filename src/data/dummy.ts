import { User, Guild, Edition, RankEntry, Pull, Call, Run, Crew, NoisePost, Notification, Match, Spotcheck, League } from '@/types';

// Helper to generate avatar URLs using DiceBear API
const avatar = (seed: string) => `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`;
const initials = (name: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

// ==================== CURRENT USER ====================

export const currentUser: User = {
  id: 'user-001',
  username: 'ShadowStrike',
  email: 'shadow@rematch.gg',
  avatar: avatar('ShadowStrike'),
  bio: 'Competitive FIFA player. Come catch these hands.',
  reputation: 4.8,
  xp: 12500,
  level: 24,
  credits: { rc: 2450, bc: 150 },
  createdAt: new Date('2024-01-15'),
  isOnline: true,
};

// ==================== USERS ====================

export const users: User[] = [
  currentUser,
  {
    id: 'user-002',
    username: 'NightHawk',
    email: 'hawk@rematch.gg',
    avatar: avatar('NightHawk'),
    reputation: 4.6,
    xp: 9800,
    level: 19,
    credits: { rc: 1800, bc: 50 },
    createdAt: new Date('2024-02-20'),
    isOnline: true,
  },
  {
    id: 'user-003',
    username: 'ViperQueen',
    email: 'viper@rematch.gg',
    avatar: avatar('ViperQueen'),
    reputation: 4.9,
    xp: 18200,
    level: 32,
    credits: { rc: 5200, bc: 300 },
    createdAt: new Date('2023-11-10'),
    isOnline: false,
  },
  {
    id: 'user-004',
    username: 'BlitzKrieg',
    email: 'blitz@rematch.gg',
    avatar: avatar('BlitzKrieg'),
    reputation: 4.3,
    xp: 7500,
    level: 15,
    credits: { rc: 900, bc: 25 },
    createdAt: new Date('2024-03-05'),
    isOnline: true,
  },
  {
    id: 'user-005',
    username: 'PhantomX',
    email: 'phantom@rematch.gg',
    avatar: avatar('PhantomX'),
    reputation: 4.7,
    xp: 14300,
    level: 27,
    credits: { rc: 3100, bc: 200 },
    createdAt: new Date('2023-12-01'),
    isOnline: true,
  },
];

// ==================== EDITIONS ====================

export const fcEditions: Edition[] = [
  { id: 'fc25', name: 'EA FC 25', year: '2025', isDefault: true },
  { id: 'fc24', name: 'EA FC 24', year: '2024' },
];

export const codEditions: Edition[] = [
  { id: 'bo6', name: 'Black Ops 6', year: '2024', isDefault: true },
  { id: 'mw3', name: 'Modern Warfare III', year: '2023' },
];

export const nba2kEditions: Edition[] = [
  { id: '2k25', name: 'NBA 2K25', year: '2025', isDefault: true },
  { id: '2k24', name: 'NBA 2K24', year: '2024' },
];

// ==================== GUILDS (Games) ====================

export const guilds: Guild[] = [
  {
    id: 'guild-fc',
    name: 'EA FC',
    slug: 'ea-fc',
    logo: initials('EA FC'),
    banner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=400&fit=crop',
    description: 'The ultimate football gaming community. Prove your skills on the virtual pitch.',
    editions: fcEditions,
    memberCount: 24500,
    activeNow: 892,
    accentColor: '#00FF87',
    isJoined: true,
  },
  {
    id: 'guild-cod',
    name: 'Call of Duty',
    slug: 'call-of-duty',
    logo: initials('COD'),
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop',
    description: 'Lock and load. Competitive CoD matches and tournaments.',
    editions: codEditions,
    memberCount: 18200,
    activeNow: 654,
    accentColor: '#FF6B00',
    isJoined: true,
  },
  {
    id: 'guild-2k',
    name: 'NBA 2K',
    slug: 'nba-2k',
    logo: initials('2K'),
    banner: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=400&fit=crop',
    description: 'Ball is life. Show em what you got on the court.',
    editions: nba2kEditions,
    memberCount: 15800,
    activeNow: 423,
    accentColor: '#FF1744',
    isJoined: false,
  },
  {
    id: 'guild-madden',
    name: 'Madden NFL',
    slug: 'madden',
    logo: initials('NFL'),
    banner: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200&h=400&fit=crop',
    description: 'Gridiron glory awaits. Dominate the virtual football field.',
    editions: [{ id: 'madden25', name: 'Madden 25', year: '2024', isDefault: true }],
    memberCount: 12400,
    activeNow: 287,
    accentColor: '#1E88E5',
    isJoined: false,
  },
];

// ==================== LEADERBOARD ====================

export const rankboard: RankEntry[] = [
  { rank: 1, user: users[2], wins: 187, losses: 23, creditsEarned: 45200, winStreak: 12, change: 0 },
  { rank: 2, user: users[4], wins: 156, losses: 31, creditsEarned: 38500, winStreak: 5, change: 2 },
  { rank: 3, user: users[0], wins: 142, losses: 38, creditsEarned: 32100, winStreak: 3, change: -1 },
  { rank: 4, user: users[1], wins: 128, losses: 42, creditsEarned: 28700, winStreak: 0, change: -1 },
  { rank: 5, user: users[3], wins: 98, losses: 52, creditsEarned: 21300, winStreak: 2, change: 3 },
];

// ==================== QUICK MATCH (formerly Pulls) ====================

export const pulls: Pull[] = [
  {
    id: 'pull-001',
    guild: guilds[0],
    edition: fcEditions[0],
    opponent: users[1],
    creditPot: 50,
    expiresAt: new Date(Date.now() + 1000 * 60 * 2), // 2 minutes
    status: 'pending',
  },
  {
    id: 'pull-002',
    guild: guilds[1],
    edition: codEditions[0],
    opponent: users[4],
    creditPot: 100,
    expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
    status: 'pending',
  },
];

// ==================== CHALLENGES (formerly Calls) ====================

export const calls: Call[] = [
  {
    id: 'call-001',
    guild: guilds[0],
    edition: fcEditions[0],
    challenger: users[3],
    challenged: currentUser,
    creditPot: 75,
    message: "Let's run it! I've been practicing all week.",
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    expiresAt: new Date(Date.now() + 1000 * 60 * 50),
  },
  {
    id: 'call-002',
    guild: guilds[0],
    edition: fcEditions[0],
    challenger: currentUser,
    challenged: users[2],
    creditPot: 150,
    message: "Time to dethrone the queen!",
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    expiresAt: new Date(Date.now() + 1000 * 60 * 30),
  },
];

// ==================== TOURNAMENTS (formerly Runs) ====================

export const runs: Run[] = [
  {
    id: 'run-001',
    name: 'Daily Grind',
    type: 'daily',
    guild: guilds[0],
    edition: fcEditions[0],
    creditPot: 5000,
    participantCount: 128,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
    isActive: true,
    isJoined: true,
  },
  {
    id: 'run-002',
    name: 'Weekend Warfare',
    type: 'weekend',
    guild: guilds[0],
    edition: fcEditions[0],
    creditPot: 25000,
    participantCount: 512,
    maxParticipants: 1024,
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 72),
    isActive: false,
    isJoined: false,
  },
  {
    id: 'run-003',
    name: 'Ranked Season',
    type: 'rank_push',
    guild: guilds[0],
    edition: fcEditions[0],
    creditPot: 100000,
    participantCount: 2048,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    isActive: true,
    isJoined: true,
  },
];

// ==================== MINI LEAGUES ====================

export const leagues: League[] = [
  {
    id: 'league-001',
    name: 'Ultimate Champions League',
    description: 'Weekly league for top players. 10 matches, best record wins.',
    guild: guilds[0],
    edition: fcEditions[0],
    creator: users[2],
    type: 'round_robin',
    entryFee: 100,
    prizePool: 2500,
    maxParticipants: 16,
    participants: [users[0], users[1], users[2], users[3], users[4]],
    participantCount: 12,
    matchesPerPlayer: 10,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    status: 'active',
    isJoined: true,
    standings: [
      { user: users[2], played: 5, wins: 4, draws: 1, losses: 0, points: 13, goalsFor: 12, goalsAgainst: 3 },
      { user: users[0], played: 5, wins: 3, draws: 1, losses: 1, points: 10, goalsFor: 9, goalsAgainst: 5 },
      { user: users[4], played: 4, wins: 3, draws: 0, losses: 1, points: 9, goalsFor: 8, goalsAgainst: 4 },
      { user: users[1], played: 5, wins: 2, draws: 1, losses: 2, points: 7, goalsFor: 7, goalsAgainst: 8 },
      { user: users[3], played: 4, wins: 1, draws: 0, losses: 3, points: 3, goalsFor: 4, goalsAgainst: 10 },
    ],
  },
  {
    id: 'league-002',
    name: 'Casual Friday League',
    description: 'Relaxed weekly league for fun. Low stakes, big vibes.',
    guild: guilds[0],
    edition: fcEditions[0],
    creator: users[1],
    type: 'round_robin',
    entryFee: 25,
    prizePool: 500,
    maxParticipants: 8,
    participants: [users[0], users[1]],
    participantCount: 6,
    matchesPerPlayer: 7,
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9),
    status: 'upcoming',
    isJoined: true,
  },
  {
    id: 'league-003',
    name: 'Pro Invitational',
    description: 'Invite-only league for verified pros. High stakes matches.',
    guild: guilds[0],
    edition: fcEditions[0],
    creator: users[2],
    type: 'round_robin',
    entryFee: 500,
    prizePool: 10000,
    maxParticipants: 12,
    participants: [users[2], users[4]],
    participantCount: 10,
    matchesPerPlayer: 11,
    startsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    endsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    status: 'completed',
    isJoined: false,
    winner: users[2],
    standings: [
      { user: users[2], played: 11, wins: 9, draws: 1, losses: 1, points: 28, goalsFor: 28, goalsAgainst: 8 },
      { user: users[4], played: 11, wins: 8, draws: 2, losses: 1, points: 26, goalsFor: 24, goalsAgainst: 10 },
    ],
  },
];

// ==================== TEAMS (formerly Crews) ====================

export const crews: Crew[] = [
  {
    id: 'crew-001',
    name: 'Night Owls',
    tag: 'NITE',
    avatar: initials('NO'),
    banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=300&fit=crop',
    guild: guilds[0],
    rank: 1,
    members: [users[0], users[1], users[4]],
    memberCount: 8,
    wins: 234,
    losses: 45,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'crew-002',
    name: 'Savage Squad',
    tag: 'SVG',
    avatar: initials('SS'),
    banner: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=300&fit=crop',
    guild: guilds[0],
    rank: 2,
    members: [users[2], users[3]],
    memberCount: 6,
    wins: 198,
    losses: 52,
    createdAt: new Date('2024-02-15'),
  },
];

// ==================== FEED (formerly Noise) ====================

export const noisePosts: NoisePost[] = [
  {
    id: 'noise-001',
    author: users[2],
    guild: guilds[0],
    content: "Just went on a 15-game win streak! Who wants smoke?",
    likes: 45,
    replies: 12,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 'noise-002',
    author: users[1],
    guild: guilds[0],
    content: "That last goal was INSANE! @ShadowStrike you seeing this?",
    likes: 23,
    replies: 8,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    mentions: [users[0]],
  },
  {
    id: 'noise-003',
    author: users[4],
    guild: guilds[0],
    content: "Weekend tournament starting soon. Who's ready to get their credits taken?",
    likes: 67,
    replies: 24,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'noise-004',
    author: users[3],
    guild: guilds[0],
    content: "New meta is crazy. Y'all not ready for what I got cooking.",
    clipUrl: 'https://clips.example.com/blitz-goal',
    likes: 89,
    replies: 31,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
];

// ==================== NOTIFICATIONS ====================

export const notifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'match_found',
    title: 'Match Found!',
    message: 'NightHawk accepted your Quick Match',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: 'notif-002',
    type: 'challenge_received',
    title: 'New Challenge',
    message: 'BlitzKrieg challenged you! 75 credits on the line.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: 'notif-003',
    type: 'feed_mention',
    title: 'You were mentioned',
    message: 'NightHawk mentioned you in the Feed',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: 'notif-004',
    type: 'tournament_update',
    title: 'Tournament Starting',
    message: 'Daily Grind is now live! Join now.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: 'notif-005',
    type: 'league_update',
    title: 'League Match Scheduled',
    message: 'Your next league match vs ViperQueen is in 2 hours',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

// ==================== MATCHES ====================

export const matches: Match[] = [
  {
    id: 'match-001',
    type: 'pull',
    status: 'completed',
    guild: guilds[0],
    edition: fcEditions[0],
    player1: currentUser,
    player2: users[3],
    creditPot: 50,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    completedAt: new Date(Date.now() - 1000 * 60 * 60),
    result: {
      winnerId: currentUser.id,
      player1Score: 3,
      player2Score: 1,
    },
  },
  {
    id: 'match-002',
    type: 'call',
    status: 'completed',
    guild: guilds[0],
    edition: fcEditions[0],
    player1: currentUser,
    player2: users[2],
    creditPot: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
    result: {
      winnerId: users[2].id,
      player1Score: 2,
      player2Score: 4,
    },
  },
  {
    id: 'match-003',
    type: 'pull',
    status: 'in_progress',
    guild: guilds[0],
    edition: fcEditions[0],
    player1: users[1],
    player2: users[4],
    creditPot: 75,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    startedAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  // Upcoming/Scheduled matches for current user
  {
    id: 'match-004',
    type: 'call',
    status: 'accepted',
    guild: guilds[0],
    edition: fcEditions[0],
    player1: currentUser,
    player2: users[1],
    creditPot: 150,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    scheduledAt: new Date(Date.now() + 1000 * 60 * 45), // 45 mins from now
    context: { type: 'challenge', name: 'Direct Challenge' },
  },
  {
    id: 'match-005',
    type: 'pull',
    status: 'accepted',
    guild: guilds[0],
    edition: fcEditions[0],
    player1: users[2],
    player2: currentUser,
    creditPot: 200,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
    context: { type: 'league', name: 'Weekend Warriors League' },
  },
  {
    id: 'match-006',
    type: 'call',
    status: 'accepted',
    guild: guilds[1],
    edition: codEditions[0],
    player1: currentUser,
    player2: users[4],
    creditPot: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    context: { type: 'tournament', name: 'CoD Weekly Cup' },
  },
];

// ==================== SPOTCHECKS (Match Verification) ====================

export const spotchecks: Spotcheck[] = [
  {
    id: 'spot-001',
    match: matches[0],
    evidence: ['https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400'],
    player1Claim: { score: 3, opponentScore: 1 },
    player2Claim: { score: 2, opponentScore: 2 },
    status: 'pending',
    assignedTo: currentUser,
  },
];

// ==================== HELPER FUNCTIONS ====================

export const getJoinedGuilds = () => guilds.filter(g => g.isJoined);
export const getRecommendedGuilds = () => guilds.filter(g => !g.isJoined);
export const getGuildById = (id: string) => guilds.find(g => g.id === id);
export const getUserById = (id: string) => users.find(u => u.id === id);
export const getActiveRuns = () => runs.filter(r => r.isActive);
export const getPendingPulls = () => pulls.filter(p => p.status === 'pending');
export const getPendingCalls = () => calls.filter(c => c.status === 'pending');
export const getUnreadNotifications = () => notifications.filter(n => !n.isRead);
export const getActiveLeagues = () => leagues.filter(l => l.status === 'active');
export const getLeagueById = (id: string) => leagues.find(l => l.id === id);
