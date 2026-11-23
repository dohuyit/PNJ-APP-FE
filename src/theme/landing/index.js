// Landing tokens + sx snippets — aligned to PNJ brand palette.
// Values mirror src/theme/pnj/tokens.js so landing matches the admin theme.
// NO MUI theme overrides. Style applied via sx on each element.

import { pnjTokens } from 'src/theme/pnj/tokens';

const { color } = pnjTokens;

const PRIMARY = color.primary;          // '#003468' - PNJ navy
const PRIMARY_DARK = color.primaryDark; // '#143765'
const PRIMARY_LIGHT = '#2C5D9A';
const SECONDARY = color.secondary;      // '#202E65'
const CTA = color.cta;                  // '#AD2A36' - buy-now red
const CTA_DARK = '#8A1E29';
const GOLD = color.gold;                // '#C48C46'
const GOLD_DARK = '#8A6A2F';
const INK = color.textStrong;           // '#282828'
const INK_MUTED = color.text;           // '#5A5A5A'
const PAPER = color.bg;                 // '#FFFFFF'
const SURFACE = color.bg;
const NEUTRAL = color.bgGray2;          // '#F5F6F8'
const NEUTRAL_SOFT = color.bgSoft;      // '#EEEFF3'
const HAIRLINE = color.cardBorder;      // '#E5E7EB'

export const landingTokens = {
  // Primary brand
  PRIMARY,
  PRIMARY_DARK,
  PRIMARY_LIGHT,
  SECONDARY,
  // Call-to-action red (for "Mua ngay" and sale price)
  CTA,
  CTA_DARK,
  // Accent
  GOLD,
  GOLD_DARK,
  // Text
  INK,
  INK_MUTED,
  // Surfaces
  PAPER,
  SURFACE,
  NEUTRAL,
  NEUTRAL_SOFT,
  // Divider / border
  HAIRLINE,
  // Fonts — PNJ is sans-serif throughout
  FONT_SERIF: pnjTokens && pnjTokens.font ? pnjTokens.font : '"Inter", "Montserrat", system-ui, sans-serif',
  FONT_SANS: '"Inter", "Montserrat", system-ui, sans-serif',
};

// Reusable sx snippets. Spread into sx prop at use site.

export const sxSharpBtn = {
  borderRadius: 1,
  textTransform: 'none',
  boxShadow: 'none',
  letterSpacing: '0.02em',
  fontWeight: 600,
};

// Primary action: navy blue (brand nav/filter/secondary CTAs)
export const sxSharpBtnContained = {
  ...sxSharpBtn,
  px: { xs: 3, md: 3.5 },
  py: 1.5,
  bgcolor: PRIMARY,
  color: '#FFFFFF',
  '&:hover': { bgcolor: PRIMARY_DARK, boxShadow: 'none', transform: 'translateY(-1px)' },
  '&:active': { transform: 'translateY(0)' },
  transition: 'transform 180ms ease, background-color 180ms ease',
};

// Primary CTA: red (for "Mua ngay" buy-now action)
export const sxSharpBtnCta = {
  ...sxSharpBtn,
  px: { xs: 3, md: 3.5 },
  py: 1.5,
  bgcolor: CTA,
  color: '#FFFFFF',
  '&:hover': { bgcolor: CTA_DARK, boxShadow: 'none', transform: 'translateY(-1px)' },
  '&:active': { transform: 'translateY(0)' },
  transition: 'transform 180ms ease, background-color 180ms ease',
};

export const sxSharpBtnOutlined = {
  ...sxSharpBtn,
  px: { xs: 3, md: 3.5 },
  py: 1.5,
  color: PRIMARY,
  borderColor: PRIMARY,
  borderWidth: '1px',
  bgcolor: 'transparent',
  '&:hover': { borderColor: PRIMARY_DARK, color: PRIMARY_DARK, borderWidth: '1px', bgcolor: 'rgba(0,52,104,0.04)' },
};

export const sxSharpInput = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1,
    backgroundColor: SURFACE,
    '& fieldset': { borderColor: 'rgba(40,40,40,0.18)' },
    '&:hover fieldset': { borderColor: PRIMARY },
    '&.Mui-focused fieldset': { borderColor: PRIMARY, borderWidth: 1 },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY },
};

export const sxSharpCard = {
  borderRadius: 1,
  boxShadow: 'none',
  backgroundColor: SURFACE,
  border: `1px solid ${HAIRLINE}`,
};

export const sxSectionHeading = {
  fontWeight: 700,
  letterSpacing: '-0.01em',
};

export const sxEyebrow = {
  letterSpacing: '0.18em',
  color: PRIMARY,
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  display: 'block',
};
