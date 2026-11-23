// src/views/admin/role/role-create-drawer.jsx — Drawer tạo/sửa vai trò
// Layout flat, nền sáng, bỏ shadow/gradient — nhất quán với role-list-view
// Permissions dùng PermissionPicker (group card layout mới).

'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Alert, Box, Button, FormControlLabel, Grid, Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';

import { PermissionPicker } from './permission-picker';
import {
  PERMISSION_GROUPS, ALL_PERMISSION_KEYS, getPermissionsByGroup,
} from 'src/constants/permissions';

// --- Panel: wrapper flat, không shadow, radius nhẹ, header bg grey.50 ---
function Panel({ title, description, action, children, sx }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {(title || action) && (
        <Stack
          direction="row" alignItems="center" spacing={1.25}
          sx={{ px: 2, py: 1.25, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {title && (
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', lineHeight: 1.25 }}>
                {title}
              </Typography>
            )}
            {description && (
              <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.125, lineHeight: 1.35 }}>
                {description}
              </Typography>
            )}
          </Box>
          {action}
        </Stack>
      )}
      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
}

function Label({ children, required }) {
  return (
    <Typography
      sx={{
        fontSize: 10.5, fontWeight: 700, color: 'text.disabled',
        letterSpacing: 0.4, textTransform: 'uppercase', mb: 0.75,
      }}
    >
      {children}
      {required && <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>}
    </Typography>
  );
}

const COLORS = [
  { value: 'red',    label: 'Đỏ',   hex: '#DC2626' },
  { value: 'blue',   label: 'Xanh', hex: '#2563EB' },
  { value: 'purple', label: 'Tím',  hex: '#7C3AED' },
  { value: 'green',  label: 'Lá',   hex: '#059669' },
  { value: 'amber',  label: 'Vàng', hex: '#D97706' },
  { value: 'grey',   label: 'Xám',  hex: '#64748B' },
];

const EMPTY = {
  key: '',
  name: '',
  description: '',
  color: 'blue',
  is_system: false,
  permission_keys: [],
};

export function RoleFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? { ...EMPTY, ...initial, permission_keys: initial.permission_keys ?? initial.permissions ?? [] }
          : EMPTY
      );
      setDirty(false);
    }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  const colorMeta = COLORS.find((c) => c.value === form.color);
  const accent = colorMeta?.hex ?? '#64748B';
  const canSubmit = form.key.trim() && form.name.trim();
  const totalPerms = ALL_PERMISSION_KEYS.length;

  // Số group đã cấp đầy đủ
  const fullGroupCount = useMemo(() => {
    const selected = new Set(form.permission_keys);
    return PERMISSION_GROUPS.filter((g) => {
      const perms = getPermissionsByGroup(g.key);
      return perms.length > 0 && perms.every((p) => selected.has(p.key));
    }).length;
  }, [form.permission_keys]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa vai trò · ${initial?.name ?? ''}` : 'Tạo vai trò mới'}
      subtitle={`${form.permission_keys.length}/${totalPerms} quyền · ${fullGroupCount}/${PERMISSION_GROUPS.length} nhóm cấp đầy đủ`}
      footer={
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'warning.main' }} />}
          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: dirty ? 'warning.dark' : 'text.secondary', fontSize: 12.5 }}>
            {dirty ? 'Có thay đổi chưa lưu' : isEdit ? 'Chưa có thay đổi' : 'Điền thông tin rồi bấm Tạo'}
          </Typography>
          <Button
            onClick={onClose}
            color="inherit" variant="outlined" size="small"
            sx={{ boxShadow: 'none', borderColor: 'divider' }}
            startIcon={<Iconify icon="solar:close-circle-linear" width={14} />}
          >
            Huỷ
          </Button>
          <Button
            variant="contained" size="small"
            disabled={!canSubmit || submitting || (isEdit && !dirty)}
            startIcon={<Iconify icon="solar:check-circle-linear" width={14} />}
            onClick={handleSubmit}
            sx={{
              boxShadow: 'none',
              bgcolor: '#1E293B', color: 'common.white',
              '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: 'grey.300' },
            }}
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo vai trò'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'background.paper', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          {/* --- CỘT TRÁI: Thông tin + tóm tắt --- */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <Panel title="Thông tin vai trò" description="Khoá định danh + tên hiển thị + mô tả ngắn">
                <Stack spacing={2}>
                  <Box>
                    <Label required>Khoá định danh (key)</Label>
                    <TextField
                      value={form.key}
                      onChange={(e) => set('key', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      fullWidth size="small" autoFocus
                      placeholder="product_manager"
                      inputProps={{ style: { fontFamily: 'monospace' } }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: 'text.disabled', display: 'flex' }}>
                            <Iconify icon="solar:code-linear" width={14} />
                          </Box>
                        ),
                      }}
                    />
                  </Box>
                  <Box>
                    <Label required>Tên vai trò</Label>
                    <TextField
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      fullWidth size="small"
                      placeholder="Quản lý sản phẩm"
                    />
                  </Box>
                  <Box>
                    <Label>Mô tả</Label>
                    <TextField
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      fullWidth size="small" multiline rows={3}
                      placeholder="Mô tả phạm vi trách nhiệm của vai trò này"
                    />
                  </Box>
                  <Box>
                    <Label>Màu nhãn</Label>
                    <Stack direction="row" spacing={0.75}>
                      {COLORS.map((c) => {
                        const active = form.color === c.value;
                        return (
                          <Tooltip key={c.value} title={c.label}>
                            <Box
                              onClick={() => set('color', c.value)}
                              sx={{
                                width: 28, height: 28, borderRadius: 1,
                                bgcolor: c.hex,
                                cursor: 'pointer',
                                border: 2,
                                borderColor: active ? c.hex : 'transparent',
                                boxShadow: active ? 'inset 0 0 0 2px #fff' : 'none',
                                opacity: active ? 1 : 0.7,
                                transition: 'opacity .15s ease',
                                '&:hover': { opacity: 1 },
                              }}
                            />
                          </Tooltip>
                        );
                      })}
                    </Stack>
                  </Box>
                  <FormControlLabel
                    control={<Switch size="small" checked={form.is_system} onChange={(_, v) => set('is_system', v)} />}
                    label={
                      <Stack>
                        <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>Vai trò hệ thống</Typography>
                        <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>Không cho phép xoá</Typography>
                      </Stack>
                    }
                    sx={{ m: 0 }}
                  />
                </Stack>
              </Panel>

              <Panel title="Tóm tắt quyền hạn" description={`Tổng ${totalPerms} quyền · ${PERMISSION_GROUPS.length} nhóm`}>
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography sx={{ fontSize: 28, fontWeight: 700, color: accent, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                      {form.permission_keys.length}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                      / {totalPerms} quyền được cấp
                    </Typography>
                  </Stack>
                  <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'grey.100', overflow: 'hidden' }}>
                    <Box sx={{
                      height: '100%',
                      width: `${(form.permission_keys.length / totalPerms) * 100}%`,
                      bgcolor: accent, opacity: 0.7,
                      transition: 'width .3s ease',
                    }} />
                  </Box>
                  <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                    <b>{fullGroupCount}</b>/{PERMISSION_GROUPS.length} nhóm được cấp đầy đủ
                  </Typography>
                </Stack>
              </Panel>

              {form.is_system && (
                <Alert
                  severity="warning"
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    bgcolor: 'warning.lighter',
                    '& .MuiAlert-icon': { color: 'warning.dark' },
                    fontSize: 12,
                  }}
                >
                  Vai trò hệ thống — mọi thay đổi quyền sẽ ảnh hưởng admin đang online.
                </Alert>
              )}
            </Stack>
          </Grid>

          {/* --- CỘT PHẢI: Permission Picker --- */}
          <Grid size={{ xs: 12, md: 8 }}>
            <PermissionPicker
              value={form.permission_keys}
              onChange={(next) => set('permission_keys', next)}
              accentColor={accent}
            />
          </Grid>
        </Grid>
      </Box>
    </FormDrawer>
  );
}
