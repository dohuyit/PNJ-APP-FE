// src/components/common/filter-bar/filter-bar.jsx
// Toolbar chuẩn admin: search + N select lọc + nút "Bộ lọc" (badge count) + nút xoá lọc.
// Style thống nhất cho toàn module admin.
'use client';

import {
  Box, Button, Chip, IconButton, InputAdornment, Stack, TextField, Typography,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { FilterSelect } from './filter-select';

// Chip hiển thị kết quả lọc — màu grey nhạt, dot indicator + delete icon
function FilterResultChip({ label, onDelete }) {
  return (
    <Chip
      label={
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{
            width: 6, height: 6, borderRadius: '50%',
            bgcolor: 'primary.main', opacity: 0.6, flexShrink: 0,
          }} />
          <Box component="span" sx={{ lineHeight: 1 }}>{label}</Box>
        </Stack>
      }
      onDelete={onDelete}
      deleteIcon={<Iconify icon="solar:close-circle-linear" width={16} />}
      sx={{
        height: 30, fontSize: 12.5, fontWeight: 500,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderRadius: '8px',
        border: 1, borderColor: 'grey.300',
        boxShadow: '0 1px 2px rgba(145, 158, 171, 0.06)',
        transition: 'all .15s',
        '& .MuiChip-label': { px: 1.25, py: 0.25 },
        '& .MuiChip-deleteIcon': {
          color: 'text.secondary', fontSize: 16, mr: 0.75, ml: '-2px',
          transition: 'color .15s',
          '&:hover': { color: 'error.main' },
        },
        '&:hover': {
          bgcolor: 'grey.50',
          borderColor: 'text.disabled',
          boxShadow: '0 2px 6px rgba(145, 158, 171, 0.12)',
        },
      }}
    />
  );
}

/**
 * Props mới (ưu tiên, backward compat):
 *   filters         — array of { value, options, onChange, minWidth? } để render FilterSelect.
 *   advancedCount   — số filter nâng cao đang active, hiện badge trong nút "Bộ lọc".
 *
 * Props cũ (giữ nguyên để không đụng call-site):
 *   searchValue, onSearch, placeholder, chips, onChipDelete, onOpenAdvanced, onReset, extra, sx.
 */
export function FilterBar({
  searchValue,
  onSearch,
  placeholder = 'Tìm kiếm...',
  chips = [],
  onChipDelete,
  onOpenAdvanced,
  onReset,
  extra,
  filters = [],
  advancedCount = 0,
  advancedChips = [],   // [{ label, onClear }] từ drawer lọc nâng cao
  sx,
}) {
  // Auto-compute chips kết quả lọc từ search + filters
  const autoChips = [];
  if (searchValue) {
    autoChips.push({ label: `Tìm: "${searchValue}"`, onClear: () => onSearch('') });
  }
  filters.forEach((f) => {
    const defaultVal = f.defaultValue ?? 'all';
    if (f.value === defaultVal) return;
    const opt = f.options.find((o) => o.value === f.value);
    autoChips.push({
      label: opt?.label ?? String(f.value),
      onClear: () => f.onChange(defaultVal),
    });
  });
  const allChips = [...autoChips, ...(advancedChips ?? [])];
  const hasAnyChip = allChips.length > 0;

  return (
    <Stack spacing={1} sx={sx}>
    <Stack
      direction="row"
      alignItems="center"
      flexWrap="wrap"
      sx={{ gap: 1, rowGap: 1 }}
    >
      {/* Search */}
      <TextField
        placeholder={placeholder}
        value={searchValue ?? ''}
        onChange={(e) => onSearch(e.target.value)}
        size="small"
        sx={{
          width: 280,
          '& .MuiInputBase-root': {
            height: 36, borderRadius: '6px', fontSize: 12.5,
            bgcolor: 'background.paper',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(145,158,171,0.24)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(145,158,171,0.6)' },
          },
          '& .MuiInputBase-input': { py: 0, fontSize: 12.5 },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="solar:magnifer-linear" width={16} sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: searchValue ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onSearch('')} sx={{ p: 0.5 }}>
                <Iconify icon="solar:close-circle-linear" width={14} />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      {/* Filter selects */}
      {filters.map((f, i) => (
        <FilterSelect
          key={i}
          value={f.value}
          options={f.options}
          onChange={f.onChange}
          minWidth={f.minWidth ?? 150}
          defaultValue={f.defaultValue}
        />
      ))}

      {/* Legacy chips (giữ compat) */}
      {chips.length > 0 && (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          {chips.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              onDelete={onChipDelete ? () => onChipDelete(c.key) : undefined}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ bgcolor: 'primary.lighter' }}
            />
          ))}
        </Stack>
      )}

      <Box sx={{ flex: 1, minWidth: 8 }} />

      {extra}

      {onReset && (chips.length > 0 || searchValue || advancedCount > 0 || filters.some((f) => f.value !== (f.defaultValue ?? 'all'))) && (
        <Button
          size="small"
          color="inherit"
          onClick={onReset}
          startIcon={<Iconify icon="solar:restart-linear" width={13} />}
          sx={{
            height: 36, px: 1, fontSize: 12.5, fontWeight: 600, color: 'text.secondary',
            '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
          }}
        >
          Xoá lọc
        </Button>
      )}

      {onOpenAdvanced && (
        <Button
          onClick={onOpenAdvanced}
          startIcon={<Iconify icon="solar:tuning-2-linear" width={14} />}
          sx={(theme) => ({
            height: 36, px: 1.75, borderRadius: '6px',
            fontSize: 12.5, fontWeight: 700,
            border: '1px solid',
            borderColor: advancedCount > 0 ? theme.palette.primary.main : 'rgba(145,158,171,0.24)',
            bgcolor:     advancedCount > 0 ? theme.palette.primary.lighter : 'background.paper',
            color:       advancedCount > 0 ? theme.palette.primary.main    : 'text.primary',
            '&:hover': {
              borderColor: advancedCount > 0 ? theme.palette.primary.main : 'rgba(145,158,171,0.6)',
              bgcolor:     advancedCount > 0 ? theme.palette.primary.lighter : 'action.hover',
              color:       advancedCount > 0 ? theme.palette.primary.main : 'text.primary',
            },
          })}
        >
          Bộ lọc
          {advancedCount > 0 && (
            <Box
              component="span"
              sx={{
                ml: 0.75, px: 0.75, minWidth: 18, height: 18,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '6px', bgcolor: 'primary.main', color: 'common.white',
                fontSize: 10.5, fontWeight: 800, fontFamily: 'monospace',
              }}
            >
              {advancedCount}
            </Box>
          )}
        </Button>
      )}
    </Stack>

    {/* Chips kết quả lọc — dòng dưới toolbar */}
    {hasAnyChip && (
      <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ gap: 0.75, rowGap: 0.75 }}>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary', mr: 0.5 }}>
          <Iconify icon="solar:filter-linear" width={14} />
          <Typography variant="caption" sx={{ color: 'inherit', fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3 }}>
            ĐANG LỌC
          </Typography>
        </Stack>
        {allChips.map((c, i) => (
          <FilterResultChip key={i} label={c.label} onDelete={c.onClear} />
        ))}
      </Stack>
    )}
    </Stack>
  );
}
