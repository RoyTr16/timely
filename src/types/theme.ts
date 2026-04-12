/**
 * Strict 8px Grid Spacing Tokens
 * All margins, paddings, border radii, and gaps must use these values.
 */
export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
} as const;

/**
 * Border Radius Tokens (8px grid compliant)
 */
export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 9999,
} as const;

/**
 * Dark-Mode First Color Palette
 * True Black for OLED power saving, Dark Grays for depth.
 */
export const colors = {
  // Backgrounds
  background: '#000000', // True Black - OLED optimized
  surface: '#0A0A0A', // Elevated cards/sheets
  surfaceElevated: '#141414', // Higher elevation components

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#606060',

  // Accent (single brand color)
  accent: '#6366F1', // Indigo-500
  accentMuted: '#4F46E5',

  // Utility
  border: '#1F1F1F',
  success: '#22C55E',
  danger: '#EF4444',
} as const;

/**
 * Typography scale using consistent sizing
 */
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

/**
 * Animation timing constants
 */
export const timing = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

export type Spacing = keyof typeof spacing;
export type Radii = keyof typeof radii;
export type Colors = keyof typeof colors;
