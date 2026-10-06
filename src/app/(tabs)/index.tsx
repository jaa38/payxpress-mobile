import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PayXpressLogo from "@/components/PayXpressLogo";
import { AppText } from "@/components/ui/AppText";
import { spacing, theme } from "@/theme";

export default function HomeScreen() {
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
            paddingTop: spacing.sm,
            marginBottom: spacing.xl,
          }}
        >
          <PayXpressLogo
            width={180}
            height={60}
            containerStyle={{
              alignItems: "flex-start",
            }}
          />
        </View>

        {/* Page heading */}
        <View
          style={{
            marginTop: spacing.md,
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
