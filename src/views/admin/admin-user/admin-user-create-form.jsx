// src/views/admin/admin-user/admin-user-create-form.jsx — FormDrawer mời/sửa admin
// Multi-role + effective permissions preview + accessible stores (multi-branch).

'use client';

import { useState, useEffect, useMemo } from 'react';

import KeyOutlined from '@mui/icons-material/KeyOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import {
  Alert, Avatar, Box, Button, Chip, FormControlLabel, Grid, InputAdornment, LinearProgress,
  MenuItem, Radio, RadioGroup, Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';
import { m, fadeIn } from 'src/views/admin/_shared/motion';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';

import {
  SYSTEM_ROLES, PERMISSION_GROUPS, getPermissionsByGroup, ALL_PERMISSION_KEYS,
} from 'src/constants/permissions';
import { mockStores } from 'src/mock-data/stores';

const ROLE_COLOR = { red:'#DC2626', blue:'#2563EB', purple:'#7C3AED', green:'#059669', amber:'#D97706', grey:'#64748B' };

const STATUSES = [
  { value: 'active',  label: 'Đang hoạt động', icon: 'solar:check-circle-linear' },
  { value: 'blocked', label: 'Đã khoá',        icon: 'solar:lock-password-linear' },
];

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  role_keys: [],
  accessible_store_ids: [],      // mảng id, hoặc 'all' bằng cờ store_scope
  store_scope: 'all',            // 'all' | 'specific'
  password: '',
  send_invite: true,
  two_factor_enabled: false,
  status: 'active',
};

export function AdminUserFormDrawer({ open, onClose, onSubmit, initial, roles = SYSTEM_ROLES }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              ...EMPTY,
              ...initial,
              role_keys: initial.role_keys ?? (initial.role_id ? [initial.role_id] : []),
              password: '',
              store_scope: initial.accessible_store_ids === 'all' ? 'all'
                : Array.isArray(initial.accessible_store_ids) && initial.accessible_store_ids.length ? 'specific' : 'all',
              accessible_store_ids: Array.isArray(initial.accessible_store_ids) ? initial.accessible_store_ids : [],
            }
          : EMPTY
      );
      setDirty(false);
    }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  const effectivePermissions = useMemo(() => {
    const set = new Set();
    form.role_keys.forEach((rk) => {
      const r = roles.find((x) => x.key === rk);
      r?.permission_keys?.forEach((pk) => set.add(pk));
    });
    return set;
  }, [form.role_keys, roles]);

  const groupCoverage = useMemo(() => {
    return PERMISSION_GROUPS.map((g) => {
      const perms = getPermissionsByGroup(g.key);
      const granted = perms.filter((p) => effectivePermissions.has(p.key)).length;
      return { group: g, granted, total: perms.length };
    });
  }, [effectivePermissions]);

  const canSubmit = form.name.trim() && form.email.trim() && form.role_keys.length > 0;

  const toggleRole = (key) => {
    set('role_keys', form.role_keys.includes(key) ? form.role_keys.filter((k) => k !== key) : [...form.role_keys, key]);
  };

  const toggleStore = (id) => {
    set('accessible_store_ids', form.accessible_store_ids.includes(id)
      ? form.accessible_store_ids.filter((s) => s !== id)
      : [...form.accessible_store_ids, id]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        accessible_store_ids: form.store_scope === 'all' ? 'all' : form.accessible_store_ids,
      };
      await onSubmit?.(payload);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const initials = form.name ? form.name.split(' ').map((p) => p[0]).slice(-2).join('').toUpperCase() : '?';
  const grantedCount = effectivePermissions.size;
  const totalPerms = ALL_PERMISSION_KEYS.length;
  const pct = totalPerms > 0 ? (grantedCount / totalPerms) * 100 : 0;

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa tài khoản · ${initial?.name ?? ''}` : 'Mời admin mới'}
      subtitle={`${form.role_keys.length} vai trò · ${grantedCount}/${totalPerms} quyền hiệu lực`}
      footer={
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && (
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
          )}
          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: dirty ? 'warning.dark' : 'text.secondary', fontSize: 12.5 }}>
            {dirty ? 'Có thay đổi chưa lưu' : isEdit ? 'Chưa có thay đổi' : 'Điền thông tin rồi bấm Mời'}
          </Typography>
          <Button onClick={onClose} color="inherit" variant="outlined" size="small" sx={{ boxShadow: 'none', borderColor: 'divider' }}
            startIcon={<CloseOutlined sx={{ fontSize: 14 }} />}>Huỷ</Button>
          <Button
            variant="contained" size="small"
            disabled={!canSubmit || submitting || (isEdit && !dirty)}
            startIcon={<CheckCircleOutlined sx={{ fontSize: 14 }} />}
            onClick={handleSubmit}
            sx={{
              boxShadow: 'none', bgcolor: '#1E293B', color: 'common.white',
              '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: 'grey.300' },
            }}
          >
            {isEdit ? 'Lưu thay đổi' : 'Mời admin'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 } }}>
        <Grid container spacing={2}>
          {/* --- Cột chính --- */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={PersonOutlined} title="Thông tin cá nhân">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>HỌ VÀ TÊN</FieldLabel>
                    <TextField
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: Nguyễn Minh Khoa"
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <FieldLabel required>EMAIL CÔNG TY</FieldLabel>
                      <TextField
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        type="email"
                        fullWidth size="small"
                        placeholder="khoa@pnj.vn"
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Iconify icon="solar:letter-linear" width={14} /></InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <FieldLabel>SỐ ĐIỆN THOẠI</FieldLabel>
                      <TextField
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value.replace(/[^\d+]/g, ''))}
                        fullWidth size="small"
                        placeholder="0912345678"
                        inputProps={{ style: { fontFamily: 'monospace' } }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={ShieldOutlined}
                title="Vai trò"
                description="Có thể gán nhiều vai trò — quyền hiệu lực = hợp tất cả"
              >
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                  {roles.map((r) => {
                    const checked = form.role_keys.includes(r.key);
                    const accent = ROLE_COLOR[r.color] ?? ROLE_COLOR.grey;
                    return (
                      <m.div key={r.key} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                        <Box
                          onClick={() => toggleRole(r.key)}
                          sx={{
                            display: 'flex', alignItems: 'flex-start', gap: 1.25,
                            p: 1.25,
                            bgcolor: checked ? accent + '10' : 'background.paper',
                            border: 1,
                            borderColor: checked ? accent + '66' : 'divider',
                            borderRadius: 1,
                            cursor: 'pointer',
                            transition: 'background-color .18s, border-color .18s',
                            '&:hover': { borderColor: accent + '66' },
                          }}
                        >
                          <Box sx={{
                            width: 28, height: 28, borderRadius: 0.75,
                            bgcolor: accent + '18', color: accent,
                            display: 'grid', placeItems: 'center', flexShrink: 0,
                          }}>
                            <Iconify icon={r.is_system ? 'solar:shield-linear' : 'solar:user-id-linear'} width={14} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                              {r.name}
                            </Typography>
                            <Typography sx={{ fontSize: 10.5, color: 'text.secondary', mt: 0.1, lineHeight: 1.3 }} noWrap>
                              {r.description}
                            </Typography>
                            <Typography sx={{ fontSize: 10, color: 'text.disabled', fontFamily: 'monospace', mt: 0.1 }}>
                              {r.permission_keys.length} quyền
                            </Typography>
                          </Box>
                          <Box sx={{
                            width: 14, height: 14, mt: 0.25,
                            borderRadius: 0.5,
                            border: 1, borderColor: checked ? accent : 'divider',
                            bgcolor: checked ? accent : 'transparent',
                            color: 'common.white',
                            display: 'grid', placeItems: 'center', flexShrink: 0,
                          }}>
                            {checked && <Iconify icon="solar:check-read-linear" width={10} />}
                          </Box>
                        </Box>
                      </m.div>
                    );
                  })}
                </Box>

                {form.role_keys.includes('super_admin') && (
                  <Alert
                    severity="warning"
                    variant="outlined"
                    sx={{ mt: 1.5, borderRadius: 1, fontSize: 11.5, bgcolor: 'warning.lighter' }}
                  >
                    Quản trị tối cao có toàn quyền — cân nhắc kỹ khi gán.
                  </Alert>
                )}
              </SectionCard>

              <SectionCard
                icon={StorefrontOutlined}
                title="Phạm vi cửa hàng"
                description="Giới hạn tài khoản này chỉ thấy dữ liệu của những cửa hàng nào"
              >
                <RadioGroup
                  row
                  value={form.store_scope}
                  onChange={(_, v) => set('store_scope', v)}
                  sx={{ mb: form.store_scope === 'specific' ? 1.5 : 0 }}
                >
                  <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography sx={{ fontSize: 12.5 }}>Tất cả cửa hàng</Typography>} />
                  <FormControlLabel value="specific" control={<Radio size="small" />} label={<Typography sx={{ fontSize: 12.5 }}>Chọn cửa hàng cụ thể</Typography>} />
                </RadioGroup>

                {form.store_scope === 'specific' && (
                  <Box sx={{
                    maxHeight: 220, overflowY: 'auto',
                    bgcolor: 'grey.50', border: 1, borderColor: 'divider', borderRadius: 1, p: 1,
                    display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 0.75,
                  }}>
                    {mockStores.map((s) => {
                      const checked = form.accessible_store_ids.includes(s.id);
                      return (
                        <Box
                          key={s.id}
                          onClick={() => toggleStore(s.id)}
                          sx={{
                            display: 'flex', alignItems: 'center', gap: 1,
                            px: 1, py: 0.625,
                            bgcolor: checked ? 'primary.lighter' : 'background.paper',
                            border: 1, borderColor: checked ? 'primary.main' : 'divider',
                            borderRadius: 1, cursor: 'pointer',
                            transition: 'background-color .15s, border-color .15s',
                          }}
                        >
                          <Box sx={{
                            width: 14, height: 14, borderRadius: 0.5,
                            border: 1, borderColor: checked ? 'primary.main' : 'divider',
                            bgcolor: checked ? 'primary.main' : 'transparent',
                            color: 'common.white', display: 'grid', placeItems: 'center', flexShrink: 0,
                          }}>
                            {checked && <Iconify icon="solar:check-read-linear" width={10} />}
                          </Box>
                          <Typography sx={{ fontSize: 10.5, fontFamily: 'monospace', color: 'text.disabled', flexShrink: 0 }}>
                            {s.code}
                          </Typography>
                          <Typography sx={{ fontSize: 11.5, fontWeight: 500, color: 'text.primary', flex: 1, minWidth: 0 }} noWrap>
                            {s.name}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </SectionCard>

              <SectionCard icon={KeyOutlined} title="Bảo mật" description="Mời qua email · hoặc đặt password thủ công · bắt buộc 2FA.">
                <Stack spacing={2}>
                  {!isEdit && (
                    <FormControlLabel
                      control={<Switch size="small" checked={form.send_invite} onChange={(_, v) => set('send_invite', v)} />}
                      label={<Typography sx={{ fontSize: 12.5 }}>Gửi email mời đặt password (khuyến nghị)</Typography>}
                    />
                  )}
                  {(isEdit || !form.send_invite) && (
                    <Box>
                      <FieldLabel>{isEdit ? 'ĐẶT LẠI PASSWORD (để trống nếu không đổi)' : 'PASSWORD KHỞI TẠO'}</FieldLabel>
                      <TextField
                        type="password" fullWidth size="small"
                        value={form.password}
                        onChange={(e) => set('password', e.target.value)}
                        placeholder="Tối thiểu 10 ký tự · gồm chữ hoa, số, ký hiệu"
                      />
                    </Box>
                  )}
                  <FormControlLabel
                    control={<Switch size="small" checked={form.two_factor_enabled} onChange={(_, v) => set('two_factor_enabled', v)} />}
                    label={<Typography sx={{ fontSize: 12.5 }}>Yêu cầu 2FA (TOTP)</Typography>}
                  />
                </Stack>
              </SectionCard>
            </Stack>
          </Grid>

          {/* --- Preview pane --- */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard icon={ToggleOnOutlined} title="Trạng thái">
                <TextField
                  select fullWidth size="small"
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon={s.icon} width={16} sx={{ color: 'text.secondary' }} />
                        <span>{s.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </SectionCard>

              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, border: 1, borderColor: 'divider' }}>
                <Typography sx={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, color: 'text.disabled', textTransform: 'uppercase' }}>
                  PREVIEW
                </Typography>
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.25 }}>
                  <Avatar sx={{ width: 42, height: 42, bgcolor: 'primary.lighter', color: 'primary.main', fontWeight: 700 }}>
                    {initials}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }} noWrap>
                      {form.name || 'Tên admin'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
                      {form.email || 'no-email'}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 0.5 }}>
                  {form.role_keys.map((rk) => {
                    const r = roles.find((x) => x.key === rk);
                    if (!r) return null;
                    const accent = ROLE_COLOR[r.color];
                    return (
                      <Chip
                        key={rk}
                        label={r.name}
                        size="small"
                        sx={{ height: 18, fontSize: 10, fontWeight: 600, bgcolor: accent + '18', color: accent, border: 1, borderColor: accent + '33' }}
                      />
                    );
                  })}
                  {form.two_factor_enabled && <Chip label="2FA" size="small" color="success" sx={{ height: 18, fontSize: 10 }} />}
                  {form.status === 'blocked' && <Chip label="KHOÁ" size="small" color="error" sx={{ height: 18, fontSize: 10 }} />}
                </Stack>
              </Box>

              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, border: 1, borderColor: 'divider' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
                  <Iconify icon="solar:shield-check-linear" width={14} sx={{ color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary' }}>
                    Quyền hiệu lực
                  </Typography>
                  <Typography sx={{ ml: 'auto', fontSize: 11, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                    {grantedCount}/{totalPerms}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 3, borderRadius: 2, bgcolor: 'grey.100',
                    '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', opacity: 0.7, borderRadius: 2 },
                    mb: 1.25,
                  }}
                />
                <Stack spacing={0.75}>
                  {groupCoverage.map(({ group, granted, total }) => {
                    const gpct = total > 0 ? (granted / total) * 100 : 0;
                    const state = gpct === 100 ? 'full' : gpct > 0 ? 'partial' : 'empty';
                    return (
                      <Tooltip key={group.key} title={`${group.label} · ${granted}/${total}`} placement="left">
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: state === 'empty' ? 0.45 : 1 }}>
                          <Box sx={{
                            width: 18, height: 18, borderRadius: 0.5, flexShrink: 0,
                            bgcolor: group.color + '14', color: group.color,
                            display: 'grid', placeItems: 'center',
                          }}>
                            <Iconify icon={group.icon} width={10} />
                          </Box>
                          <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'text.primary', flex: 1, minWidth: 0 }} noWrap>
                            {group.label}
                          </Typography>
                          <Box sx={{ width: 56, height: 2, bgcolor: 'grey.100', borderRadius: 1, overflow: 'hidden' }}>
                            <Box sx={{ height: '100%', width: `${gpct}%`, bgcolor: state === 'full' ? group.color : '#F59E0B', opacity: 0.7 }} />
                          </Box>
                          <Typography sx={{ fontSize: 10, color: 'text.disabled', fontVariantNumeric: 'tabular-nums', width: 36, textAlign: 'right' }}>
                            {granted}/{total}
                          </Typography>
                        </Stack>
                      </Tooltip>
                    );
                  })}
                </Stack>
              </Box>

              {form.store_scope === 'specific' && (
                <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, border: 1, borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                    Cửa hàng được truy cập
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                    {form.accessible_store_ids.length === 0 ? 'Chưa chọn' : `${form.accessible_store_ids.length} cửa hàng`}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </FormDrawer>
  );
}
