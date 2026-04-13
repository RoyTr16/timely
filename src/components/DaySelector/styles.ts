import { StyleSheet } from 'react-native';

import { colors, spacing, radii, typography } from '../../types/theme';

const DAY_ITEM_WIDTH = 50;
const DAY_ITEM_HEIGHT = 65;

export const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
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
  dayListRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayChevron: {
    padding: spacing.xs / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayList: {
    flex: 1,
  },
  monthYearText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  dayItem: {
    width: DAY_ITEM_WIDTH,
    height: DAY_ITEM_HEIGHT,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayItemActive: {
    backgroundColor: `${colors.accent}33`,
    borderWidth: 1,
    borderColor: colors.accent,
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
  pastDays: 7,
  futureDays: 14,
  itemWidth: DAY_ITEM_WIDTH + spacing.xs, // Include gap for layout calculation
} as const;
