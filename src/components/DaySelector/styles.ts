import { StyleSheet } from 'react-native';

import { colors, spacing, radii, typography } from '../../types/theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.xs,
  },
  chevronButton: {
    padding: spacing.xs,
  },
  todayPill: {
    paddingHorizontal: spacing.sm - 4,
    paddingVertical: 4,
    borderRadius: radii.md,
    backgroundColor: `${colors.accent}33`,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  todayPillText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.accent,
  },
  monthYearText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xs,
  },
  dayItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  dayItemActive: {
    backgroundColor: `${colors.accent}33`,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  weekdayText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: 4,
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
  dayNumberToday: {
    color: colors.accent,
  },
});
