import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { spacing, theme } from '@/theme';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="h1">More</AppText>
      <AppText
        variant="body"
        color="secondary"
        style={styles.description}
      >
        Additional PayXpress features will be built in later sprints.
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
