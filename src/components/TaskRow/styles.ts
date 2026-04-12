import { StyleSheet } from 'react-native';

import { colors, spacing, radii, typography } from '../../types/theme';
import type { EnergyLevel } from '../../types/task';

export function getEnergyColor(level: EnergyLevel): string {
  switch (level) {
    case 1:
      return colors.textMuted;
    case 2:
      return colors.accent;
    case 3:
      return colors.energyHigh;
    default:
      return colors.textMuted;
  }
}

const TIMELINE_WIDTH = spacing.md; // Match checkbox size
const TIMELINE_LINE_WIDTH = 2;

export const styles = StyleSheet.create({
  swipeableContainer: {
    paddingBottom: spacing.sm, // Internal padding for visual spacing
  },
  timelineLine: {
    position: 'absolute',
    left: spacing.xs + (TIMELINE_WIDTH + spacing.xs) / 2 - TIMELINE_LINE_WIDTH / 2, // Center under checkbox
    top: 0,
    bottom: 0,
    width: TIMELINE_LINE_WIDTH,
    backgroundColor: colors.border,
    zIndex: -1,
  },
  cardWrapper: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
    paddingLeft: spacing.xs,
    borderRadius: radii.md, // 16px for immersive card
    gap: spacing.xs,
  },
  timelineContainer: {
    width: TIMELINE_WIDTH + spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  taskIcon: {
    marginRight: spacing.xs / 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  timeInfo: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  recurrenceIcon: {
    marginLeft: spacing.xs,
  },
  energyIndicator: {
    marginLeft: spacing.xs,
  },
  deleteAction: {
    width: 80,
    height: '100%',
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const TASKROW_CONSTANTS = {
  recurrenceIconSize: 14,
  energyIconSize: 14,
  taskIconSize: 16,
  activeOpacity: 0.7,
  deleteIconSize: 24,
  swipeThreshold: 80,
} as const;
