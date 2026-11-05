
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppStore } from "@/store/app-store";
import {
  darkTheme,
  lightTheme,
  type ResolvedTheme,
} from "@/theme/theme";

export function useTheme() {
  const systemScheme = useColorScheme();

  const themeMode = useAppStore((state) => state.themeMode);
  const setThemeMode = useAppStore((state) => state.setThemeMode);

  const resolvedTheme: ResolvedTheme =
    themeMode === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : themeMode;

  const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  return {
    theme,
    themeMode,
    resolvedTheme,
    setThemeMode,
    isDark: resolvedTheme === "dark",
  };
}
