import { themeConfig } from 'src/theme/theme-config';

// ----------------------------------------------------------------------

export const SETTINGS_STORAGE_KEY = 'app-settings';

// ----------------------------------------------------------------------

export const defaultSettings = {
  colorScheme: themeConfig.defaultMode,
  direction: themeConfig.direction,
  contrast: 'hight',
  navLayout: 'vertical',
  primaryColor: 'preset1',
  navColor: 'integrate',
  compactLayout: false,
  fontSize: 16,
  fontFamily: themeConfig.fontFamily.primary,
};
