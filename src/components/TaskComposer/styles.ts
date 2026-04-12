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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timeButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceElevated,
  },
  timeButtonActive: {
    borderWidth: 1,
    borderColor: colors.accent,
  },
  timeButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
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
  timeInput: {
    width: 72,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceElevated,
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  durationRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  dateSelectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceElevated,
  },
  dateSelectButtonActive: {
    borderWidth: 1,
    borderColor: colors.accent,
  },
  dateSelectText: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
  },
  dateSelectTextActive: {
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  dateClearButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  dateClearText: {
    fontSize: typography.sizes.sm,
    color: colors.danger,
  },
  templateToggle: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceElevated,
  },
  templateToggleActive: {
    backgroundColor: colors.accent,
  },
  templateToggleText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  templateToggleTextActive: {
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
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
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.sm,
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
