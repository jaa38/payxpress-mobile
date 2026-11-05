
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/hooks/use-theme";
import { spacing } from "@/theme";

export default function PayBillsScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: theme.background.surface,
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
            Pay Bills
          </AppText>

          <AppText
            variant="body"
            color="secondary"
            style={{
              maxWidth: 360,
              lineHeight: 26,
            }}
          >
            Wallet functionality will be built in a later sprint.
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}
