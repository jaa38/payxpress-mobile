import { Redirect, Slot } from "expo-router";

import { useAuthStore } from "@/store/auth-store";

export function AuthGate() {
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isHydrating) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  return <Slot />;
}
