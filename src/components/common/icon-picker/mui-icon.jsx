// src/components/common/icon-picker/mui-icon.jsx
// Render MUI icon by registry name. Fallback to Iconify for legacy iconify-style strings.

'use client';

import { Box } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { ICON_REGISTRY } from './icon-registry';

/**
 * @param {{ name?: string, width?: number, color?: string, sx?: object }} props
 * - `name` MUI registry key (e.g. "DiamondOutlined") → renders MUI icon.
 * - Fallback: iconify string ("solar:xxx") → renders via Iconify.
 * - Fallback: URL string ("http...") → renders as <img>.
 */
export function MuiIcon({ name, width = 20, color, sx, ...rest }) {
  if (!name) return null;

  const entry = ICON_REGISTRY[name];
  if (entry) {
    const { Component } = entry;
    return (
      <Component sx={{ fontSize: width, color, ...sx }} {...rest} />
    );
  }

  // Legacy iconify string → fallback (giữ tương thích với data cũ `solar:xxx-linear`).
  if (typeof name === 'string' && name.includes(':')) {
    return <Iconify icon={name} width={width} sx={{ color, ...sx }} />;
  }

  // URL hoặc text khác → hiển thị như image (data cũ dạng URL).
  if (typeof name === 'string' && name.startsWith('http')) {
    return (
      <Box
        component="img"
        src={name}
        sx={{ width, height: width, objectFit: 'contain', ...sx }}
      />
    );
  }

  return null;
}
