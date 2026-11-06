import { Redirect, Stack } from "expo-router";

import { useAuthStore } from "@/store/auth-store";

export default function AuthLayout() {
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  if (isHydrating) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}