import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppProviders } from "@/providers/AppProviders";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppProviders>
      <Slot />
      <AnimatedSplashOverlay />
    </AppProviders>
  );
}
