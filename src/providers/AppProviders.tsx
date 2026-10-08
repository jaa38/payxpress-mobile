import type { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";

import { queryClient } from "@/lib/query-client";
import { AuthBootstrap } from "@/providers/AuthBootstrap";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthBootstrap>{children}</AuthBootstrap>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
