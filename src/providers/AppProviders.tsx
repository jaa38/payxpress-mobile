
import type { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router";
import { useColorScheme } from "react-native";

import { queryClient } from "@/lib/query-client";
import { AuthBootstrap } from "@/providers/AuthBootstrap";
import { useAppStore } from "@/store/app-store";
import { darkTheme, lightTheme } from "@/theme/theme";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const systemScheme = useColorScheme();
  const themeMode = useAppStore((state) => state.themeMode);

  const resolvedTheme =
    themeMode === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : themeMode;

  const appTheme = resolvedTheme === "dark" ? darkTheme : lightTheme;
  const navigationTheme =
    resolvedTheme === "dark" ? DarkTheme : DefaultTheme;

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("@/assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("@/assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        value={{
          ...navigationTheme,
          colors: {
            ...navigationTheme.colors,
            primary: appTheme.navigation.active,
            background: appTheme.background.primary,
            card: appTheme.navigation.background,
            text: appTheme.text.primary,
            border: appTheme.navigation.border,
            notification: appTheme.action.secondary.background,
          },
        }}
      >
        <AuthBootstrap>{children}</AuthBootstrap>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
