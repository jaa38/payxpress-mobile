
import { NativeTabs } from "expo-router/unstable-native-tabs";

import { useTheme } from "@/hooks/use-theme";

export default function AppTabs() {
  const { theme } = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.navigation.background}
      indicatorColor={theme.action.primary.background}
      tintColor={theme.action.primary.background}
      labelStyle={{
        default: {
          color: theme.text.secondary,
        },
        selected: {
          color: theme.action.primary.background,
        },
      }}
    >
      {/* Home */}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "house",
            selected: "house.fill",
          }}
        />
      </NativeTabs.Trigger>

      {/* Pay Bills */}
      <NativeTabs.Trigger name="pay-bills">
        <NativeTabs.Trigger.Label>Pay Bills</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "creditcard",
            selected: "creditcard.fill",
          }}
        />
      </NativeTabs.Trigger>

      {/* Transactions */}
      <NativeTabs.Trigger name="transactions">
        <NativeTabs.Trigger.Label>Transactions</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "arrow.left.arrow.right",
            selected: "arrow.left.arrow.right",
          }}
        />
      </NativeTabs.Trigger>

      {/* Account */}
      <NativeTabs.Trigger name="account">
        <NativeTabs.Trigger.Label>Account</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: "person",
            selected: "person.fill",
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
