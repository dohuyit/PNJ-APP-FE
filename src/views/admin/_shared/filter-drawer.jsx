// src/views/admin/_shared/filter-drawer.jsx
// Drawer bộ lọc chi tiết — nhiều section kiểu select/chip-multi/range/date-range/switch.

'use client';

import { useEffect, useState } from 'react';

import {
  Box, Button, Chip, Drawer, FormControlLabel, IconButton, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { MoneyInput } from 'src/components/common/money-input';

/**
 * @typedef {Object} FilterSection
 * @property {string} key
 * @property {string} label
 * @property {string} [icon]
 * @property {'select'|'chip-multi'|'range-money'|'range-number'|'date-range'|'switch'} type
 * @property {Array<{value:any,label:string,icon?:string,color?:string}>} [options]
 * @property {string} [helperText]
 */

// Flat section — không divider giữa các mục, header 1 dòng
function SectionWrap({ label, icon, children, active }) {
  return (
    <Box sx={{
      bgcolor: active ? 'grey.50' : 'transparent',
      border: 1, borderColor: active ? 'divider' : 'transparent',
      borderRadius: 1,
      p: 1.5,
      mb: 1,
      transition: 'background-color .15s ease, border-color .15s ease',
    }}>
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
        {icon && (
          <Box sx={{
            width: 24, height: 24, borderRadius: 0.75,
            bgcolor: active ? 'primary.lighter' : 'grey.100',
            color: active ? 'primary.main' : 'text.secondary',
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Iconify icon={icon} width={13} />
          </Box>
        )}
        <Typography sx={{
          fontWeight: 600, color: 'text.primary', fontSize: 12.5,
          letterSpacing: 0.1, flex: 1,
        }}>
          {label}
        </Typography>
        {active && (
          <Box sx={{
            width: 6, height: 6, borderRadius: '50%',
            bgcolor: 'primary.main',
          }} />
        )}
      </Stack>
      {children}
    </Box>
  );
}

// Helper — kiểm tra section có active không
function isSectionActive(type, v) {
  if (v == null) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'string') return v !== '';
  if (typeof v === 'boolean') return v;
  if (typeof v === 'object') return Object.values(v).some((x) => x !== '' && x != null);
  return false;
}

/**
 * @param {{
 *   open: boolean,
 *   onClose: Function,
 *   sections: FilterSection[],
 *   value: Record<string, any>,
 *   onApply: (next: Record<string, any>) => void,
 *   title?: string,
 * }} props
 */
export function FilterDrawer({ open, onClose, sections = [], value, onApply, title = 'Bộ lọc chi tiết' }) {
  const [local, setLocal] = useState(value ?? {});

  useEffect(() => { if (open) setLocal(value ?? {}); }, [open, value]);

  const set = (k, v) => setLocal((s) => ({ ...s, [k]: v }));
  const toggleChip = (k, v) => {
    const arr = local[k] ?? [];
    set(k, arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  const activeCount = sections.reduce((n, s) => {
    const v = local[s.key];
    if (v == null) return n;
    if (Array.isArray(v) && v.length === 0) return n;
    if (typeof v === 'string' && v === '') return n;
    if (typeof v === 'object' && !Array.isArray(v) && Object.values(v).every((x) => x == null || x === '')) return n;
    if (v === false) return n;
    return n + 1;
  }, 0);

  const handleReset = () => {
    const empty = {};
    sections.forEach((s) => { empty[s.key] = s.type === 'chip-multi' ? [] : s.type === 'switch' ? false : ''; });
    setLocal(empty);
  };

  const handleApply = () => { onApply?.(local); onClose(); };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      // Clamp để không tràn qua sidebar — giống pattern ở FormDrawer
      sx={{
        '& .MuiBackdrop-root': {
          left: { xs: 0, md: 'var(--layout-nav-vertical-width, 280px)' },
        },
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480 },
          maxWidth: { xs: '100%', md: 'calc(100vw - var(--layout-nav-vertical-width, 280px) - 24px)' },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'common.white',
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row" alignItems="center" spacing={1.25}
        sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
      >
        <Box sx={{
          width: 32, height: 32, borderRadius: 0.75,
          bgcolor: 'primary.lighter', color: 'primary.main',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Iconify icon="solar:filter-linear" width={16} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
              {title}
            </Typography>
            {activeCount > 0 && (
              <Chip
                label={`${activeCount} bộ lọc`}
                size="small"
                sx={{
                  height: 18, fontSize: 10.5, fontWeight: 600,
                  bgcolor: 'primary.lighter', color: 'primary.main',
                }}
              />
            )}
          </Stack>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.125 }}>
            Kết hợp nhiều tiêu chí để lọc tinh gọn
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Iconify icon="solar:close-circle-linear" width={16} />
        </IconButton>
      </Stack>

      {/* Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
        {sections.map((s) => (
          <Box key={s.key}>
            <SectionWrap label={s.label} icon={s.icon} active={isSectionActive(s.type, local[s.key])}>
              {s.type === 'select' && (
                <TextField
                  select size="small" fullWidth
                  value={local[s.key] ?? ''}
                  onChange={(e) => set(s.key, e.target.value)}
                  helperText={s.helperText}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {s.options?.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {o.icon && <Iconify icon={o.icon} width={14} sx={{ color: 'text.secondary' }} />}
                        <span>{o.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {s.type === 'chip-multi' && (
                <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ gap: 0.75 }}>
                  {s.options?.map((o) => {
                    const active = (local[s.key] ?? []).includes(o.value);
                    return (
                      <Chip
                        key={o.value}
                        icon={o.icon ? <Iconify icon={o.icon} width={12} sx={{ ml: 0.5 }} /> : undefined}
                        label={o.label}
                        size="small"
                        variant="outlined"
                        onClick={() => toggleChip(s.key, o.value)}
                        sx={{
                          bgcolor: active ? 'primary.lighter' : 'background.paper',
                          color:   active ? 'primary.main'    : 'text.secondary',
                          borderColor: active ? 'primary.main' : 'divider',
                          fontWeight: active ? 600 : 500,
                          '& .MuiChip-icon': { color: 'inherit' },
                        }}
                      />
                    );
                  })}
                </Stack>
              )}

              {s.type === 'range-money' && (
                <Stack direction="row" spacing={1}>
                  <MoneyInput
                    size="small" fullWidth placeholder="Từ"
                    value={local[s.key]?.min ?? ''}
                    onChange={(e) => set(s.key, { ...(local[s.key] ?? {}), min: e.target.value.value })}
                  />
                  <MoneyInput
                    size="small" fullWidth placeholder="Đến"
                    value={local[s.key]?.max ?? ''}
                    onChange={(e) => set(s.key, { ...(local[s.key] ?? {}), max: e.target.value.value })}
                  />
                </Stack>
              )}

              {s.type === 'range-number' && (
                <Stack direction="row" spacing={1}>
                  <TextField
                    type="number" size="small" fullWidth placeholder="Từ"
                    value={local[s.key]?.min ?? ''}
                    onChange={(e) => set(s.key, { ...(local[s.key] ?? {}), min: e.target.value })}
                  />
                  <TextField
                    type="number" size="small" fullWidth placeholder="Đến"
                    value={local[s.key]?.max ?? ''}
                    onChange={(e) => set(s.key, { ...(local[s.key] ?? {}), max: e.target.value })}
                  />
                </Stack>
              )}

              {s.type === 'date-range' && (
                <Stack direction="row" spacing={1}>
                  <TextField
                    type="date" size="small" fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Từ"
                    value={local[s.key]?.from ?? ''}
                    onChange={(e) => set(s.key, { ...(local[s.key] ?? {}), from: e.target.value })}
                  />
                  <TextField
                    type="date" size="small" fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Đến"
                    value={local[s.key]?.to ?? ''}
                    onChange={(e) => set(s.key, { ...(local[s.key] ?? {}), to: e.target.value })}
                  />
                </Stack>
              )}

              {s.type === 'switch' && (
                <FormControlLabel
                  control={<Switch checked={!!local[s.key]} onChange={(_, v) => set(s.key, v)} />}
                  label={s.helperText ?? 'Bật'}
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                />
              )}
            </SectionWrap>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Stack
        direction="row" spacing={1}
        sx={{ px: 2.5, py: 1.75, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
      >
        <Button
          onClick={handleReset} color="inherit" variant="outlined" fullWidth
          startIcon={<Iconify icon="solar:restart-linear" width={14} />}
          sx={{ boxShadow: 'none', borderColor: 'divider' }}
        >
          Xoá hết
        </Button>
        <Button
          onClick={handleApply} variant="contained" fullWidth
          startIcon={<Iconify icon="solar:check-circle-linear" width={14} />}
          sx={{
            boxShadow: 'none',
            bgcolor: '#1E293B', color: 'common.white',
            '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
          }}
        >
          Áp dụng {activeCount > 0 && `(${activeCount})`}
        </Button>
      </Stack>
    </Drawer>
  );
}
