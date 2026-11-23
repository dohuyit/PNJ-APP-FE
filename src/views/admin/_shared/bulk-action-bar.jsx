// src/views/admin/_shared/bulk-action-bar.jsx — Toolbar hiển thị khi có row selected

'use client';

import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

/**
 * @typedef {Object} BulkAction
 * @property {string}   label
 * @property {string}   icon
 * @property {Function} onClick
 * @property {'primary'|'success'|'warning'|'error'|'inherit'} [color]
 * @property {boolean}  [divider]   - render separator thay vì button
 */

/**
 * @param {{ count: number, total: number, actions: BulkAction[], onClear: Function }} props
 */
export function BulkActionBar({ count, total, actions = [], onClear }) {
  if (!count) return null;
  return (
    <Box
      sx={{
        position: 'sticky', top: 0, zIndex: 2,
        bgcolor: 'primary.lighter',
        borderBottom: 1, borderColor: 'primary.light',
        px: { xs: 2, md: 3 }, py: 1.25,
        display: 'flex', alignItems: 'center', gap: 1.5,
        flexWrap: 'wrap', rowGap: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', color: 'common.white', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800 }}>
          {count}
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.darker' }}>
          đang chọn
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          · trong {total}
        </Typography>
      </Stack>

      <Box sx={{ borderLeft: 1, borderColor: 'primary.light', height: 20, mx: 0.5 }} />

      {actions.map((a, i) =>
        a.divider ? (
          <Box key={`d-${i}`} sx={{ borderLeft: 1, borderColor: 'primary.light', height: 20, mx: 0.5 }} />
        ) : (
          <Button
            key={a.label}
            size="small"
            variant="outlined"
            color={a.color ?? 'inherit'}
            startIcon={<Iconify icon={a.icon} width={14} />}
            onClick={a.onClick}
            sx={{
              bgcolor: 'common.white',
              borderColor: a.color === 'error' ? 'error.light' : 'divider',
              '&:hover': { bgcolor: a.color === 'error' ? 'error.lighter' : 'grey.100' },
            }}
          >
            {a.label}
          </Button>
        )
      )}

      <Box sx={{ flex: 1 }} />

      <Tooltip title="Bỏ chọn tất cả">
        <IconButton size="small" onClick={onClear} sx={{ color: 'primary.dark' }}>
          <Iconify icon="solar:close-circle-linear" width={16} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
