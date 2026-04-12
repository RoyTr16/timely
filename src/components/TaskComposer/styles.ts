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
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
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
  snapPoints: ['45%'],
  saveIconSize: 20,
} as const;
