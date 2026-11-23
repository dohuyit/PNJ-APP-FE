// src/components/common/label/label.jsx
// Nhãn minimal nhất quán với StatusBadge. 2 variant:
//  - outlined (mặc định): chấm 5px + text + border `color-mix(currentColor, 38%, transparent)`, nền trong suốt.
//  - filled: chấm + text đậm (color.dark) + nền tint nhạt (color 12%).
// Dùng thay <Chip label=... color=... variant=outlined|filled size=small /> ở các bảng list.
'use client';

import { Box } from '@mui/material';

const COLORS = {
  default: { fg: '#637381', filledBg: 'rgba(145,158,171,0.12)' },
  primary: { fg: '#143765', filledBg: 'rgba(0,52,104,0.12)' },
  secondary: { fg: '#121A3A', filledBg: 'rgba(32,46,101,0.12)' },
  info: { fg: '#1D4ED8', filledBg: 'rgba(29,78,216,0.12)' },
  success: { fg: '#118D57', filledBg: 'rgba(17,141,87,0.12)' },
  warning: { fg: '#B76E00', filledBg: 'rgba(183,110,0,0.12)' },
  error: { fg: '#B71D18', filledBg: 'rgba(183,29,24,0.12)' },
};

export function Label({ children, color = 'default', variant = 'outlined', icon, dot = true, sx }) {
  const tone = COLORS[color] ?? COLORS.default;
  const isFilled = variant === 'filled' || variant === 'soft';

  return (
    <Box
      component="span"
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          px: '7px',
          py: '1px',
          borderRadius: '6px',
          color: tone.fg,
          fontSize: 10.5,
          fontWeight: 500,
          lineHeight: 1.6,
          whiteSpace: 'nowrap',
          ...(isFilled
            ? { bgcolor: tone.filledBg, border: 'none' }
            : {
                border: '1px solid',
                borderColor: `color-mix(in srgb, ${tone.fg} 38%, transparent)`,
                bgcolor: 'transparent',
              }),
          ...(dot && !icon && {
            '&::before': {
              content: '""', width: 5, height: 5, borderRadius: '50%',
              bgcolor: 'currentColor', flexShrink: 0,
            },
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {icon}
      {children}
    </Box>
  );
}
