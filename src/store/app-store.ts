import { create } from "zustand";

interface AppState {
  isHydrated: boolean;
  setHydrated: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isHydrated: false,

  setHydrated: (value) => {
    set({
      isHydrated: value,
    });
  },
}));
