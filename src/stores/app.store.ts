import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Guild, Edition, Pull, Call, Notification } from '@/types';
import { currentUser, guilds, notifications as dummyNotifications, pulls as dummyPulls, calls as dummyCalls } from '@/data/dummy';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;

  // Active Guild (workspace concept)
  activeGuildId: string | null;
  activeEditionId: string | null;

  // Joined Guilds
  joinedGuildIds: string[];

  // Real-time data
  pulls: Pull[];
  calls: Call[];
  notifications: Notification[];

  // UI State
  isSidebarOpen: boolean;
  isQuickPullModalOpen: boolean;

  // Actions
  login: (user: User) => void;
  logout: () => void;

  setActiveGuild: (guildId: string) => void;
  setActiveEdition: (editionId: string) => void;

  joinGuild: (guildId: string) => void;
  leaveGuild: (guildId: string) => void;

  addPull: (pull: Pull) => void;
  removePull: (pullId: string) => void;

  addCall: (call: Call) => void;
  removeCall: (callId: string) => void;

  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;

  toggleSidebar: () => void;
  openQuickPullModal: () => void;
  closeQuickPullModal: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: currentUser, // Start logged in with dummy user
      isAuthenticated: true,

      activeGuildId: 'guild-fc', // Default to EA FC
      activeEditionId: 'fc25',

      joinedGuildIds: ['guild-fc', 'guild-cod'],

      pulls: dummyPulls,
      calls: dummyCalls,
      notifications: dummyNotifications,

      isSidebarOpen: true,
      isQuickPullModalOpen: false,

      // Actions
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      setActiveGuild: (guildId) => {
        const guild = guilds.find(g => g.id === guildId);
        const defaultEdition = guild?.editions.find(e => e.isDefault);
        set({
          activeGuildId: guildId,
          activeEditionId: defaultEdition?.id || guild?.editions[0]?.id || null
        });
      },

      setActiveEdition: (editionId) => set({ activeEditionId: editionId }),

      joinGuild: (guildId) => {
        const { joinedGuildIds } = get();
        if (!joinedGuildIds.includes(guildId)) {
          set({ joinedGuildIds: [...joinedGuildIds, guildId] });
        }
      },

      leaveGuild: (guildId) => {
        const { joinedGuildIds, activeGuildId } = get();
        const newJoinedIds = joinedGuildIds.filter(id => id !== guildId);
        set({
          joinedGuildIds: newJoinedIds,
          activeGuildId: activeGuildId === guildId ? newJoinedIds[0] || null : activeGuildId
        });
      },

      addPull: (pull) => set((state) => ({ pulls: [pull, ...state.pulls] })),
      removePull: (pullId) => set((state) => ({
        pulls: state.pulls.filter(p => p.id !== pullId)
      })),

      addCall: (call) => set((state) => ({ calls: [call, ...state.calls] })),
      removeCall: (callId) => set((state) => ({
        calls: state.calls.filter(c => c.id !== callId)
      })),

      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
      })),
      markNotificationRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      })),
      clearNotifications: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
      })),

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      openQuickPullModal: () => set({ isQuickPullModalOpen: true }),
      closeQuickPullModal: () => set({ isQuickPullModalOpen: false }),
    }),
    {
      name: 'rematch-storage',
      partialize: (state) => ({
        activeGuildId: state.activeGuildId,
        activeEditionId: state.activeEditionId,
        joinedGuildIds: state.joinedGuildIds,
      }),
    }
  )
);

// Selectors
export const useActiveGuild = () => {
  const activeGuildId = useAppStore((state) => state.activeGuildId);
  return guilds.find(g => g.id === activeGuildId) || null;
};

export const useActiveEdition = () => {
  const activeGuildId = useAppStore((state) => state.activeGuildId);
  const activeEditionId = useAppStore((state) => state.activeEditionId);
  const guild = guilds.find(g => g.id === activeGuildId);
  return guild?.editions.find(e => e.id === activeEditionId) || null;
};

export const useJoinedGuilds = () => {
  const joinedGuildIds = useAppStore((state) => state.joinedGuildIds);
  return guilds.filter(g => joinedGuildIds.includes(g.id));
};

export const useUnreadNotificationCount = () => {
  const notifications = useAppStore((state) => state.notifications);
  return notifications.filter(n => !n.isRead).length;
};

export const usePendingPullCount = () => {
  const pulls = useAppStore((state) => state.pulls);
  return pulls.filter(p => p.status === 'pending').length;
};

export const usePendingCallCount = () => {
  const calls = useAppStore((state) => state.calls);
  return calls.filter(c => c.status === 'pending').length;
};
