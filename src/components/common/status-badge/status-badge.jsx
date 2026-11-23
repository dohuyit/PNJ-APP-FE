// src/components/common/status-badge/status-badge.jsx
// Minimal dot-label (match zeno-crm-fe/subs/adsAccount/elements/ads-account-helper.jsx::TableStatusLabel).
'use client';

import { Box } from '@mui/material';

// Màu chữ nhạt vừa — border dùng color-mix 38% transparent của chính color đó.
const STATUS_COLORS = {
  success: '#118D57',
  error: '#B71D18',
  warning: '#B76E00',
  primary: '#8C6128', // gold dark — primary mới = vàng
  secondary: '#003468',
  info: '#1D4ED8',
  default: '#637381',
};

/**
 * @param {{
 *   status: string,
 *   colorMap: Record<string, 'default'|'primary'|'secondary'|'success'|'warning'|'error'|'info'>,
 *   labelMap: Record<string, string>,
 * }} props
 */
export function StatusBadge({ status, colorMap, labelMap }) {
  const tone = colorMap?.[status] ?? 'default';
  const label = labelMap?.[status] ?? status;
  const color = STATUS_COLORS[tone] ?? STATUS_COLORS.default;

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        px: '7px',
        py: '1px',
        borderRadius: '6px',
        border: '1px solid',
        borderColor: `color-mix(in srgb, ${color} 38%, transparent)`,
        color,
        fontSize: 10.5,
        fontWeight: 500,
        lineHeight: 1.6,
        whiteSpace: 'nowrap',
        '&::before': {
          content: '""',
          width: 5,
          height: 5,
          borderRadius: '50%',
          bgcolor: 'currentColor',
          flexShrink: 0,
        },
      }}
    >
      {label}
    </Box>
  );
}
