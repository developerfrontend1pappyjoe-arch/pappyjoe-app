import {
  MD3LightTheme,
  configureFonts,
  type MD3Theme,
} from 'react-native-paper';
import {colorList} from './global.styles';
import {FONT_FAMILY, FONT_SIZE} from './typography';

const fontConfig = {
  displayLarge: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.display,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 30,
  },
  displayMedium: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.h1,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 26,
  },
  displaySmall: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.h2,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  headlineLarge: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.h2,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  headlineMedium: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.h3,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  headlineSmall: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  titleLarge: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  titleMedium: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
    fontWeight: '500' as const,
    letterSpacing: 0.15,
    lineHeight: 18,
  },
  titleSmall: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 16,
  },
  bodyLarge: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.lg,
    fontWeight: '400' as const,
    letterSpacing: 0.15,
    lineHeight: 18,
  },
  bodyMedium: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 16,
  },
  bodySmall: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 14,
  },
  labelLarge: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    lineHeight: 16,
  },
  labelMedium: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 14,
  },
  labelSmall: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: 12,
  },
};

export const appTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 4,
  fonts: configureFonts({config: fontConfig}),
  colors: {
    ...MD3LightTheme.colors,
    background: colorList.white,
    onSurface: colorList.dark,
    outlineVariant: colorList.Grey4,
    primary: colorList.primary,
  },
};
