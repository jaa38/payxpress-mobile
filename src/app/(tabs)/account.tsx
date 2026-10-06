import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { spacing, theme } from "@/theme";

export default function AccountScreen() {
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
        {/* Page heading */}
        <View
          style={{
            paddingTop: spacing.sm,
            marginBottom: spacing.xl,
          }}
        >
          <AppText
            variant="h1"
            style={{
              marginBottom: spacing.sm,
            }}
          >
            Account
          </AppText>

          <AppText
            variant="body"
            color="secondary"
            style={{
              maxWidth: 360,
              lineHeight: 26,
            }}
          >
            Additional PayXpress features will be built in later sprints.
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}
