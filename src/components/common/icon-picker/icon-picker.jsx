// src/components/common/icon-picker/icon-picker.jsx
// Searchable grid picker for MUI icons from ICON_REGISTRY.
// Usage:
//   <IconPicker value={form.icon_url} onChange={(name) => set('icon_url', name)} />

'use client';

import { useMemo, useState } from 'react';

import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid,
  IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Tooltip, Typography,
} from '@mui/material';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';

import { MuiIcon } from './mui-icon';
import { ICON_GROUPS, ICON_NAMES, ICON_REGISTRY } from './icon-registry';

const GROUPS = [{ value: 'all', label: 'Tất cả' }, ...ICON_GROUPS];

export function IconPicker({
  value,
  onChange,
  label,
  placeholder = 'Chọn icon',
  size = 'small',
  sx,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ICON_NAMES.filter((name) => {
      const entry = ICON_REGISTRY[name];
      if (group !== 'all' && entry.group !== group) return false;
      if (!q) return true;
      return name.toLowerCase().includes(q) || entry.label.toLowerCase().includes(q);
    });
  }, [search, group]);

  const currentLabel = value && ICON_REGISTRY[value]?.label;

  return (
    <>
      {label && (
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: 0.75 }}>
          {label}
        </Typography>
      )}
      <Button
        variant="outlined"
        fullWidth
        size={size}
        onClick={() => setOpen(true)}
        startIcon={
          value ? (
            <MuiIcon name={value} width={18} />
          ) : (
            <SearchOutlined sx={{ fontSize: 18, color: 'text.disabled' }} />
          )
        }
        endIcon={
          value ? (
            <Tooltip title="Bỏ chọn">
              <Box
                component="span"
                role="button"
                tabIndex={-1}
                onClick={(e) => { e.stopPropagation(); onChange?.(''); }}
                sx={{
                  display: 'inline-flex', p: 0.25, borderRadius: 0.75,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <DeleteOutline sx={{ fontSize: 16 }} />
              </Box>
            </Tooltip>
          ) : null
        }
        sx={{
          justifyContent: 'flex-start',
          textTransform: 'none',
          color: value ? 'text.primary' : 'text.disabled',
          fontWeight: value ? 500 : 400,
          borderColor: 'divider',
          '& .MuiButton-startIcon': { mr: 1 },
          ...sx,
        }}
      >
        {value ? (currentLabel || value) : placeholder}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchOutlined sx={{ fontSize: 20 }} />
          <Typography variant="h6" sx={{ flex: 1 }}>Chọn icon</Typography>
          <Chip label={`${ICON_NAMES.length} icon`} size="small" />
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseOutlined fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              autoFocus
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên icon hoặc nhãn..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined sx={{ fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Tabs
              value={group}
              onChange={(_, v) => setGroup(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mt: 1.5, minHeight: 32, '& .MuiTab-root': { minHeight: 32, py: 0.5, fontSize: 12 } }}
            >
              {GROUPS.map((g) => (
                <Tab key={g.value} value={g.value} label={g.label} />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ p: 2, maxHeight: '52vh', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
                <Typography variant="body2">Không tìm thấy icon phù hợp.</Typography>
              </Box>
            ) : (
              <Grid container spacing={1}>
                {filtered.map((name) => {
                  const selected = name === value;
                  const { label: lbl } = ICON_REGISTRY[name];
                  return (
                    <Grid key={name} size={{ xs: 3, sm: 2, md: 1.5 }}>
                      <Tooltip title={`${name}${lbl ? ` — ${lbl}` : ''}`} placement="top" arrow>
                        <Box
                          role="button"
                          tabIndex={0}
                          onClick={() => { onChange?.(name); setOpen(false); }}
                          sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', gap: 0.5,
                            p: 1, borderRadius: 1, cursor: 'pointer',
                            border: 1, borderColor: selected ? 'primary.main' : 'divider',
                            bgcolor: selected ? 'primary.lighter' : 'background.paper',
                            color: selected ? 'primary.dark' : 'text.secondary',
                            transition: 'all .12s',
                            minHeight: 72,
                            '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.light', color: 'text.primary' },
                          }}
                        >
                          <MuiIcon name={name} width={22} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: 9.5, lineHeight: 1.2,
                              textAlign: 'center',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {lbl}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
            <Typography variant="caption">{filtered.length} icon</Typography>
            {value && (
              <>
                <Typography variant="caption">· đang chọn:</Typography>
                <Chip
                  size="small"
                  icon={<MuiIcon name={value} width={14} />}
                  label={ICON_REGISTRY[value]?.label || value}
                  onDelete={() => onChange?.('')}
                  sx={{ height: 22 }}
                />
              </>
            )}
          </Stack>
          <Button size="small" onClick={() => setOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
