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
    flex: 1,
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
  iconRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  iconBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceElevated,
  },
  iconBadgeActive: {
    backgroundColor: colors.accent,
  },
  iconBadgeText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  iconBadgeTextActive: {
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
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
  snapPoints: ['60%'],
  saveIconSize: 20,
} as const;
