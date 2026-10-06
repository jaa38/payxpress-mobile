import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";
import { colors as appColors } from "@/theme/colors";

export default function AppTabs() {
  const scheme = useColorScheme();

  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      tintColor={appColors.primary[500]}
      labelStyle={{
        default: {
          color: appColors.gray[500],
        },
        selected: {
          color: appColors.primary[500],
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
