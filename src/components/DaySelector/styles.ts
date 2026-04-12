import { StyleSheet } from 'react-native';

import { colors, spacing, radii, typography } from '../../types/theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: spacing.xxl + spacing.sm,
  },
  dayItemActive: {
    borderRadius: radii.md,
  },
  weekdayText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs / 2,
  },
  weekdayTextActive: {
    color: colors.textSecondary,
  },
  dayNumber: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
  },
  dayNumberActive: {
    color: colors.textPrimary,
  },
});

export const DAY_SELECTOR_CONSTANTS = {
  pastDays: 3,
  futureDays: 10,
} as const;
