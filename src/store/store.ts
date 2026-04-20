import { create } from 'zustand';

export type UserRole = 'admin' | 'analyst' | 'developer' | 'client';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    organization: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    sidebarCollapsed: boolean;
    theme: 'dark' | 'light';
    notifications: Notification[];
    commandPaletteOpen: boolean;
    login: (user: User) => void;
    logout: () => void;
    toggleSidebar: () => void;
    toggleTheme: () => void;
    toggleCommandPalette: () => void;
    addNotification: (notification: Notification) => void;
    clearNotifications: () => void;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'danger' | 'success';
    timestamp: Date;
    read: boolean;
}

export const useStore = create<AuthState>((set) => ({
    user: {
        id: '1',
        name: 'Alex Morgan',
        email: 'alex@spamdetector.ai',
        role: 'admin',
        organization: 'Spam Detector Global',
    },
    isAuthenticated: true,
    sidebarCollapsed: false,
    theme: 'dark',
    notifications: [
        { id: '1', title: 'Critical Threat Detected', message: 'Phishing campaign targeting enterprise clients', type: 'danger', timestamp: new Date(), read: false },
        { id: '2', title: 'Model Update Available', message: 'v3.2.1 ready for deployment', type: 'info', timestamp: new Date(), read: false },
        { id: '3', title: 'System Health', message: 'All services operational', type: 'success', timestamp: new Date(), read: true },
    ],
    commandPaletteOpen: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
    addNotification: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications] })),
    clearNotifications: () => set({ notifications: [] }),
}));
