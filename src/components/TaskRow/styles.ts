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
    // height applied via inline proportionalStyle
  },
  gapConnector: {
    position: 'absolute',
    left: 27, // GlassCard padding (16) + checkbox center (24/2) - line center (1)
    width: TIMELINE_LINE_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Frosted white
  },
  cardWrapper: {
    // Deprecated: GlassCard handles the card container
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
    paddingLeft: spacing.xs,
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
  timeInfoDone: {
    opacity: 0.5,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  cardDone: {
    opacity: 0.5,
  },
  recurrenceIcon: {
    marginLeft: spacing.xs,
  },
  energyIndicator: {
    marginLeft: spacing.xs,
  },
  templateIndicator: {
    marginLeft: spacing.xs,
  },
  quickScheduleButton: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
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
