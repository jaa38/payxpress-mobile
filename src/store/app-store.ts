
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

import { mmkvStorage } from "@/services/storage/mmkv-storage";
import type { ThemeMode } from "@/theme/theme";

interface AppState {
  isHydrated: boolean;
  themeMode: ThemeMode;
  setHydrated: (value: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const zustandMMKVStorage: StateStorage = {
  getItem: (name) => mmkvStorage.getString(name) ?? null,
  setItem: (name, value) => mmkvStorage.set(name, value),
  removeItem: (name) => mmkvStorage.remove(name),
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isHydrated: false,
      themeMode: "system",

      setHydrated: (value) => {
        set({ isHydrated: value });
      },

      setThemeMode: (mode) => {
        set({ themeMode: mode });
      },
    }),
    {
      name: "payxpress-app-settings",
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    },
  ),
);
