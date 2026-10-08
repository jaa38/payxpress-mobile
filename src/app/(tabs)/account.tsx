import { Alert, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { AppText } from "@/components/ui/AppText";
import { authService } from "@/services/auth/auth-service";
import { spacing, theme } from "@/theme";

export default function AccountScreen() {
  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out of your PayXpress account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            try {
              await authService.logout();
              router.replace("/welcome");
            } catch {
              Alert.alert(
                "Unable to log out",
                "We couldn't securely clear your session. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

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

        {/* Logout */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log out"
          onPress={handleLogout}
          style={{
            marginTop: spacing.lg,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.lg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border.error,
          }}
        >
          <AppText
            variant="bodyBold"
            color="error"
            align="center"
          >
            Log out
          </AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
