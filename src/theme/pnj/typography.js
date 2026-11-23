// src/theme/pnj/typography.js — font scale from pnj-style.md §10.3 + §11.1
// Primary = Be Vietnam Pro (Google Fonts, loaded in global.css).
export const pnjFontFamily = {
  primary: 'Be Vietnam Pro',
  secondary: 'Playfair Display',
  footer: 'Be Vietnam Pro',
};

export const pnjTypography = {
  h1: { fontSize: 32, fontWeight: 700, lineHeight: 1.25 },
  h2: { fontSize: 24, fontWeight: 700, lineHeight: 1.3 },
  h3: { fontSize: 20, fontWeight: 700, lineHeight: 1.5 },
  h4: { fontSize: 18, fontWeight: 600, lineHeight: 1.5 },
  h5: { fontSize: 16, fontWeight: 600, lineHeight: 1.5 },
  h6: { fontSize: 14, fontWeight: 600, lineHeight: 1.5 },
  subtitle1: { fontSize: 16, fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontSize: 14, fontWeight: 500, lineHeight: 1.5 },
  body1: { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: 13, fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.5 },
  overline: { fontSize: 11, fontWeight: 500, lineHeight: 1.5, textTransform: 'uppercase' },
  button: { fontSize: 13, fontWeight: 700, textTransform: 'none' },
};
