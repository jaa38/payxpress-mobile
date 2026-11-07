
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

import AppTabs from "@/components/app-tabs";
import { onboardingStorage } from "@/services/auth/onboarding-storage";
import { useAuthStore } from "@/store/auth-store";

export default function TabsLayout() {
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [hasCompletedOnboarding, setHasCompletedOnboarding] =
    useState<boolean | null>(null);

  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (!isAuthenticated || isHydrating) {
      setHasCheckedOnboarding(false);
      setHasCompletedOnboarding(null);

      return () => {
        mounted = false;
      };
    }

    setHasCheckedOnboarding(false);

    const checkOnboarding = async () => {
      try {
        const completed = await onboardingStorage.hasCompleted();

        if (mounted) {
          setHasCompletedOnboarding(completed);
        }
      } catch {
        if (mounted) {
          setHasCompletedOnboarding(false);
        }
      } finally {
        if (mounted) {
          setHasCheckedOnboarding(true);
        }
      }
    };

    if (isAuthenticated && !isHydrating) {
      void checkOnboarding();
    }

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, isHydrating]);

  if (isHydrating || (isAuthenticated && !hasCheckedOnboarding)) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  if (hasCompletedOnboarding === false) {
    return <Redirect href="/(tabs)/first-time-guidance" />;
  }

  return <AppTabs />;
}
