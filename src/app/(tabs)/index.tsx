import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { spacing, theme } from "@/theme";

export default function HomeScreen() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: theme.background.primary,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
        }}
      >
        {/* Header */}
        <View
          style={{
            alignItems: "flex-start",
          }}
        >
          <AppText variant="body" color="secondary">
            {greeting}
          </AppText>

          <AppText variant="h1">Customer Name</AppText>
        </View>

        {/* Page heading */}
        <View
          style={{
            marginTop: spacing.rg,
          }}
        >
          <AppText
            variant="h1"
            style={{
              marginBottom: spacing.sm,
            }}
          >
            Home
          </AppText>

          <AppText
            variant="body"
            color="secondary"
            style={{
              maxWidth: 360,
              lineHeight: 26,
            }}
          >
            PayXpress home will be built in a later sprint.
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}
