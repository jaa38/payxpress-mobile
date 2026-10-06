import { StyleSheet, View } from "react-native";

import PayXpressLogo from "@/components/PayXpressLogo";
import { AppText } from "@/components/ui/AppText";
import { spacing, theme } from "@/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <PayXpressLogo
        width={180}
        height={60}
        containerStyle={styles.logoContainer}
      />

      <AppText variant="h1">Home</AppText>

      <AppText variant="body" color="secondary" style={styles.description}>
        PayXpress home will be built in a later sprint.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: theme.background.primary,
  },

  logoContainer: {
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },

  description: {
    marginTop: spacing.sm,
  },
});
