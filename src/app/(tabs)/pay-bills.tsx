import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { spacing, theme } from '@/theme';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="h1">Pay Bills</AppText>
      <AppText
        variant="body"
        color="secondary"
        style={styles.description}
      >
        Wallet functionality will be built in a later sprint.
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

  description: {
    marginTop: spacing.sm,
  },
});
