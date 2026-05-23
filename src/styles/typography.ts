/**
 * Application-standard type scale.
 * Body default: 12px. Use these constants instead of raw font sizes.
 */
export const FONT_SIZE = {
  xs: 9,
  sm: 10,
  md: 12,
  lg: 13,
  xl: 14,
  xxl: 14,
  h3: 16,
  h2: 18,
  h1: 20,
  display: 24,
} as const;

export const LINE_HEIGHT = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 20,
  h3: 22,
  h2: 24,
  h1: 26,
  display: 30,
} as const;

/** @deprecated Use FONT_SIZE — kept for existing imports */
export const FONTSIZE = {
  fs9: FONT_SIZE.xs,
  fs10: FONT_SIZE.sm,
  fs11: FONT_SIZE.sm,
  fs12: FONT_SIZE.md,
  fs13: FONT_SIZE.lg,
  fs14: FONT_SIZE.xl,
  fs16: FONT_SIZE.xxl,
  fs18: FONT_SIZE.h3,
  fs20: FONT_SIZE.h2,
  fs22: FONT_SIZE.h1,
  fs28: FONT_SIZE.h1,
} as const;

export const FONT_FAMILY = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;
