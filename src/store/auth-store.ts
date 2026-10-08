import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  tagName: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;

  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  setHydrating: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrating: true,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  setHydrating: (value) => {
    set({
      isHydrating: value,
    });
  },
}));
