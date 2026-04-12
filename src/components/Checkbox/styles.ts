import { StyleSheet } from 'react-native';

import { colors, spacing, radii } from '../../types/theme';

const CHECKBOX_SIZE = spacing.md;

export const styles = StyleSheet.create({
  container: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
  },
});

export const CHECKBOX_CONSTANTS = {
  size: CHECKBOX_SIZE,
  iconSize: spacing.sm,
  uncheckedBackground: 'transparent',
  checkedBackground: colors.accent,
  uncheckedBorder: colors.border,
  checkedBorder: colors.accent,
} as const;
