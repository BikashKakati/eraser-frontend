import { create } from 'zustand';
import type { User } from '../services/api/auth-service';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    updateUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('flowbit_token'),
    isAuthenticated: !!localStorage.getItem('flowbit_token'),

    setAuth: (user, token) => {
        localStorage.setItem('flowbit_token', token);
        set({ user, token, isAuthenticated: true });
    },

    updateUser: (user) => {
        set({ user });
    },

    logout: () => {
        localStorage.removeItem('flowbit_token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));
