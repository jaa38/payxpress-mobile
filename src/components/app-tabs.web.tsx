
import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />

      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/(tabs)" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>

          <TabTrigger name="pay-bills" href="/(tabs)/pay-bills" asChild>
            <TabButton>Pay Bills</TabButton>
          </TabTrigger>

          <TabTrigger name="transactions" href="/(tabs)/transactions" asChild>
            <TabButton>Transactions</TabButton>
          </TabTrigger>

          <TabTrigger name="account" href="/(tabs)/account" asChild>
            <TabButton>Account</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  ...props
}: TabTriggerSlotProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    tabButton: {
      borderRadius: Spacing.three,
    },
    tabButtonView: {
      paddingVertical: Spacing.one,
      paddingHorizontal: Spacing.three,
      borderRadius: Spacing.three,
    },
    tabButtonViewFocused: {
      backgroundColor: theme.action.primary.background,
    },
    pressed: {
      opacity: 0.7,
    },
  });

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.tabButton,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.tabButtonView,
          isFocused && styles.tabButtonViewFocused,
        ]}
      >
        <AppText
          variant="label"
          color={isFocused ? "inverse" : "secondary"}
        >
          {children}
        </AppText>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    tabListContainer: {
      position: "absolute",
      width: "100%",
      bottom: 0,
      padding: Spacing.three,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    innerContainer: {
      paddingVertical: Spacing.two,
      paddingHorizontal: Spacing.five,
      borderRadius: Spacing.five,
      flexDirection: "row",
      alignItems: "center",
      flexGrow: 1,
      gap: Spacing.two,
      maxWidth: MaxContentWidth,
      backgroundColor: theme.navigation.background,
      borderWidth: 1,
      borderColor: theme.navigation.border,
    },
    brandText: {
      marginRight: Spacing.three,
    },
    spacer: {
      flex: 1,
    },
  });

  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>
        <AppText
          variant="bodyBold"
          color="brand"
          style={styles.brandText}
        >
          PayXpress
        </AppText>

        {props.children}

        <View style={styles.spacer} />

        <AppText variant="caption" color="secondary">
          Payments made simple
        </AppText>
      </View>
    </View>
  );
}
