import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../types/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>timely</Text>
        <Text style={styles.subtitle}>Your tasks, simplified.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
  },
});
