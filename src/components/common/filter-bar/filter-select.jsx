// src/components/common/filter-bar/filter-select.jsx
// Select nhỏ gọn: icon/dot + label + caret.
// Option shape: { value, label, icon?, dot? }. Giá trị default thường là 'all'.
// Highlight khi value !== defaultValue (border/text/bg đổi sang primary).
'use client';

import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function FilterSelect({
  value,
  options,
  onChange,
  minWidth = 150,
  defaultValue = 'all',
  sx,
}) {
  const active = value !== defaultValue;
  const current = options.find((o) => o.value === value);

  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      IconComponent={(p) => (
        <Iconify
          {...p}
          icon="solar:alt-arrow-down-linear"
          width={14}
          sx={{
            color: active ? 'primary.main' : 'text.secondary',
            right: 8, pointerEvents: 'none', position: 'absolute',
          }}
        />
      )}
      renderValue={() => (
        <Stack direction="row" alignItems="center" spacing={0.75}>
          {current?.dot && (
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: current.dot, flexShrink: 0 }} />
          )}
          {current?.icon && !current?.dot && (
            <Iconify icon={current.icon} width={14} sx={{ color: active ? 'primary.main' : 'text.secondary', flexShrink: 0 }} />
          )}
          <Typography
            noWrap
            sx={{
              fontSize: 12.5,
              fontWeight: active ? 700 : 500,
              color: active ? 'primary.main' : 'text.primary',
              lineHeight: 1,
            }}
          >
            {current?.label}
          </Typography>
        </Stack>
      )}
      MenuProps={{
        PaperProps: {
          sx: {
            mt: 0.5, borderRadius: '6px',
            boxShadow: '0 8px 24px -4px rgba(145,158,171,0.24)',
            bgcolor: 'common.white',
            maxHeight: 320,
            '& .MuiMenuItem-root': {
              fontSize: 12.5, py: 0.75, minHeight: 34, gap: '8px',
              '&.Mui-selected':       { bgcolor: 'transparent' },
              '&.Mui-selected:hover': { bgcolor: 'action.hover' },
              '&:hover':              { bgcolor: 'action.hover' },
            },
          },
        },
      }}
      sx={{
        minWidth, height: 36, borderRadius: '6px',
        bgcolor: active ? 'grey.100' : 'background.paper',
        '&:hover': { bgcolor: active ? 'grey.200' : 'grey.50' },
        '& .MuiSelect-select': { py: 0.75, pl: 1.5, pr: '32px !important', display: 'flex', alignItems: 'center' },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: active ? 'rgba(145,158,171,0.5)' : 'rgba(145,158,171,0.24)',
          transition: 'border-color .15s',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(145,158,171,0.6)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: 1,
          borderColor: 'rgba(145,158,171,0.6)',
        },
        ...sx,
      }}
    >
      {options.map((o) => (
        <MenuItem key={o.value} value={o.value}>
          {o.dot ? (
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: o.dot, flexShrink: 0 }} />
          ) : (
            <Iconify icon={o.icon ?? 'solar:tag-linear'} width={15} sx={{ color: 'text.secondary', flexShrink: 0 }} />
          )}
          <span>{o.label}</span>
        </MenuItem>
      ))}
    </Select>
  );
}
