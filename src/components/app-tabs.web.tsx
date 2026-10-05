import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import {
  Pressable,
  useColorScheme,
  View,
  StyleSheet,
} from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { theme } from '@/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />

      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/(tabs)" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>

          <TabTrigger
            name="transactions"
            href="/(tabs)/transactions"
            asChild
          >
            <TabButton>Transactions</TabButton>
          </TabTrigger>

          <TabTrigger
            name="wallet"
            href="/(tabs)/wallet"
            asChild
          >
            <TabButton>Wallet</TabButton>
          </TabTrigger>

          <TabTrigger
            name="more"
            href="/(tabs)/more"
            asChild
          >
            <TabButton>More</TabButton>
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
          color={isFocused ? 'brand' : 'secondary'}
        >
          {children}
        </AppText>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors =
    Colors[scheme === 'unspecified' ? 'light' : scheme];

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
          {colors.text ? 'Payments made simple' : ''}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
    backgroundColor: theme.background.surface,
    borderWidth: 1,
    borderColor: theme.border.default,
  },

  brandText: {
    marginRight: Spacing.three,
  },

  spacer: {
    flex: 1,
  },

  tabButton: {
    borderRadius: Spacing.three,
  },

  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },

  tabButtonViewFocused: {
    backgroundColor: theme.background.brand,
  },

  pressed: {
    opacity: 0.7,
  },
});