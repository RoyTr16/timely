import { StyleSheet } from 'react-native';

import { colors, spacing, radii, typography } from '../../types/theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.sm,
  },
  input: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
  },
  toolboxRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  toolButton: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolButtonActive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  controlArea: {
    marginBottom: spacing.sm,
  },

  // === Schedule Tab ===
  scheduleRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  scheduleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceElevated,
  },
  scheduleButtonActive: {
    borderWidth: 1,
    borderColor: colors.accent,
  },
  scheduleButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  dateClearButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  dateClearText: {
    fontSize: typography.sizes.xs,
    color: colors.danger,
  },
  durationRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  recurrenceRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  weekdayRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  weekdayButton: {
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekdayButtonActive: {
    backgroundColor: colors.accent,
  },
  weekdayText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
  },
  weekdayTextActive: {
    color: colors.textPrimary,
  },
  pickerContainer: {
    backgroundColor: 'transparent',
    borderRadius: radii.sm,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  pickerDoneButton: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  pickerDoneText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.accent,
  },

  // === Shared Badges ===
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceElevated,
  },
  badgeActive: {
    backgroundColor: colors.accent,
  },
  badgeText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  badgeTextActive: {
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },

  // === Energy Tab ===
  energyRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  energyBlock: {
    flex: 1,
    height: spacing.xxl,
    borderRadius: radii.sm,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyBlockActive: {
    transform: [{ scale: 1.08 }],
  },
  energyFill: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  energyValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
  },
  energyLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // === Style Tab ===
  swatchRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  colorSwatch: {
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchActive: {
    borderColor: colors.textPrimary,
  },
  hexInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  hexPrefix: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
  },
  hexInput: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceElevated,
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
  },
  hexPreview: {
    width: spacing.md,
    height: spacing.md,
    borderRadius: radii.full,
  },
  iconScrollRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  iconGridItem: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGridItemActive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
  },

  // === Icon Picker Modal ===
  iconModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  iconModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  iconModalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  iconModalClose: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconModalGrid: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  iconModalRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  iconModalItem: {
    width: '18%' as unknown as number,
    aspectRatio: 0.85,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  iconModalItemActive: {
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  iconModalLabel: {
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'center',
  },
  iconModalLabelActive: {
    color: colors.accent,
  },

  // === Footer ===
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  saveButton: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.surfaceElevated,
  },
  handleIndicator: {
    backgroundColor: colors.textMuted,
    width: spacing.xl,
  },
  background: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
  },
});

export const COMPOSER_CONSTANTS = {
  snapPoints: ['70%'],
  saveIconSize: 20,
} as const;
