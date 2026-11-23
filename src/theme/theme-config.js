// src/theme/theme-config.js — PNJ brand overrides (see theme/pnj/*)
import { pnjPalette } from './pnj/palette';
import { pnjFontFamily } from './pnj/typography';

export const themeConfig = {
  direction: 'ltr',
  defaultMode: 'light',
  modeStorageKey: 'pnj-theme-mode',
  classesPrefix: 'pnj',
  fontFamily: pnjFontFamily,
  palette: pnjPalette,
  cssVariables: {
    cssVarPrefix: 'pnj',
    colorSchemeSelector: 'data-color-scheme',
  },
};
