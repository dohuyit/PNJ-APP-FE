// src/theme/pnj/palette.js — maps PNJ tokens into MUI palette shape
import { pnjTokens } from './tokens';

const { color } = pnjTokens;

export const pnjPalette = {
  primary: {
    lighter: '#D6E4F5',
    light: '#3366B5',
    main: color.primary,
    dark: color.primaryDark,
    darker: '#001833',
    contrastText: '#FFFFFF',
  },
  secondary: {
    lighter: '#D9DEF0',
    light: '#5B6AA8',
    main: color.secondary,
    dark: '#121A3A',
    darker: '#070C1E',
    contrastText: '#FFFFFF',
  },
  info: {
    lighter: '#DBEAFE',
    light: '#60A5FA',
    main: '#2563EB',
    dark: '#1D4ED8',
    darker: '#1E3A8A',
    contrastText: '#FFFFFF',
  },
  success: {
    lighter: '#DCFCE7',
    light: '#4ADE80',
    main: '#16A34A',
    dark: '#15803D',
    darker: '#14532D',
    contrastText: '#FFFFFF',
  },
  warning: {
    lighter: '#FEF3C7',
    light: '#FBBF24',
    main: '#D97706',
    dark: '#B45309',
    darker: '#78350F',
    contrastText: '#FFFFFF',
  },
  error: {
    lighter: '#FEE2E2',
    light: '#F87171',
    main: color.sale,
    dark: '#B91C1C',
    darker: '#7F1D1D',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FAFBFC',
    100: color.bgGray2,
    200: color.bgGray,
    300: color.cardBorder,
    400: '#C4CDD5',
    500: '#919EAB',
    600: color.textMuted,
    700: '#454F5B',
    800: color.textStrong,
    900: '#141A21',
  },
  common: { black: '#000000', white: '#FFFFFF' },
};
