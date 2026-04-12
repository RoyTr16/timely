import { View, Text, StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../../types/theme';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={localStyles.container} edges={['top']}>
      <View style={localStyles.header}>
        <Text style={localStyles.headerTitle}>Settings</Text>
      </View>
      <View style={localStyles.content}>
        <Text style={localStyles.placeholder}>Settings coming soon...</Text>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
  },
});
