// ==================== USER TYPES ====================

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  reputation: number;
  xp: number;
  level: number;
  credits: Credits;
  createdAt: Date;
  isOnline: boolean;
}

export interface Credits {
  rc: number; // Rank Credits (earned)
  bc: number; // Boost Credits (purchased)
}

// ==================== GUILD TYPES ====================

export interface Guild {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  editions: Edition[];
  memberCount: number;
  activeNow: number;
  accentColor: string;
  isJoined?: boolean;
}

export interface Edition {
  id: string;
  name: string;
  year: string;
  isDefault?: boolean;
}

// ==================== RANKBOARD TYPES ====================

export interface RankEntry {
  rank: number;
  user: User;
  wins: number;
  losses: number;
  creditsEarned: number;
  winStreak: number;
  change: number; // +/- change in rank
}

// ==================== MATCH TYPES ====================

export type MatchStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';
export type MatchType = 'pull' | 'call';

export interface MatchContext {
  type: 'challenge' | 'league' | 'tournament' | 'pull';
  name: string;
}

export interface Match {
  id: string;
  type: MatchType;
  status: MatchStatus;
  guild: Guild;
  edition: Edition;
  player1: User;
  player2: User;
  creditPot: number;
  createdAt: Date;
  startedAt?: Date;
  scheduledAt?: Date;
  completedAt?: Date;
  result?: MatchResult;
  context?: MatchContext;
}

export interface MatchResult {
  winnerId: string;
  player1Score: number;
  player2Score: number;
  evidence?: string;
  verifiedBy?: string;
}

// ==================== PULL TYPES ====================

export interface Pull {
  id: string;
  guild: Guild;
  edition: Edition;
  opponent: User;
  creditPot: number;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired' | 'declined';
}

// ==================== CALL TYPES ====================

export interface Call {
  id: string;
  guild: Guild;
  edition: Edition;
  challenger: User;
  challenged: User;
  creditPot: number;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

// ==================== RUN TYPES ====================

export type RunType = 'daily' | 'weekend' | 'crew' | 'rank_push' | 'special';

export interface Run {
  id: string;
  name: string;
  type: RunType;
  guild: Guild;
  edition: Edition;
  creditPot: number;
  participantCount: number;
  maxParticipants?: number;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
  isJoined?: boolean;
}

// ==================== CREW TYPES ====================

export interface Crew {
  id: string;
  name: string;
  tag: string; // Short tag like [XYZ]
  avatar: string;
  banner: string;
  guild: Guild;
  rank: number;
  members: User[];
  memberCount: number;
  wins: number;
  losses: number;
  createdAt: Date;
}

// ==================== NOISE (BANTER) TYPES ====================

export interface NoisePost {
  id: string;
  author: User;
  guild: Guild;
  content: string;
  image?: string;
  clipUrl?: string;
  likes: number;
  replies: number;
  isLiked?: boolean;
  createdAt: Date;
  mentions?: User[];
}

// ==================== SPOTCHECK TYPES ====================

export interface Spotcheck {
  id: string;
  match: Match;
  evidence: string[];
  player1Claim: { score: number; opponentScore: number };
  player2Claim: { score: number; opponentScore: number };
  status: 'pending' | 'resolved' | 'escalated';
  assignedTo?: User;
  resolution?: {
    winnerId: string;
    resolvedBy: User;
    resolvedAt: Date;
  };
}

// ==================== MINI LEAGUE TYPES ====================

export type LeagueType = 'round_robin' | 'knockout' | 'swiss';
export type LeagueStatus = 'upcoming' | 'active' | 'completed';

export interface LeagueStanding {
  user: User;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface League {
  id: string;
  name: string;
  description: string;
  guild: Guild;
  edition: Edition;
  creator: User;
  type: LeagueType;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  participants: User[];
  participantCount: number;
  matchesPerPlayer: number;
  startsAt: Date;
  endsAt: Date;
  status: LeagueStatus;
  isJoined?: boolean;
  standings?: LeagueStanding[];
  winner?: User;
}

// ==================== NOTIFICATION TYPES ====================

export type NotificationType =
  | 'match_found'
  | 'challenge_received'
  | 'challenge_accepted'
  | 'match_ready'
  | 'match_result'
  | 'verification_request'
  | 'tournament_update'
  | 'league_update'
  | 'feed_mention'
  | 'team_invite'
  | 'team_update';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

// ==================== STORE TYPES ====================

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  type: 'credit_pack' | 'cosmetic' | 'crew_banner' | 'player_frame' | 'emote';
  price: number;
  currency: 'bc' | 'rc' | 'usd';
  image: string;
}
