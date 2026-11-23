// src/views/admin/customer/customer-create-drawer.jsx — Full-width drawer tạo/sửa khách hàng

'use client';

import { useEffect, useState } from 'react';

import CloseOutlined from '@mui/icons-material/CloseOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import MailOutlineOutlined from '@mui/icons-material/MailOutlineOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Avatar, Box, Button, Chip, FormControlLabel, Grid, InputAdornment, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { fmtVND, fmtNumber, fmtRelative } from 'src/utils/format';

import { SectionCard, FieldLabel } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';
import { mockMembershipTiers } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const membershipTiersList = mockMembershipTiers;
const SOURCES = [
  { value: 'web',   label: 'Website', icon: 'solar:global-linear' },
  { value: 'app',   label: 'App',     icon: 'solar:iphone-linear' },
  { value: 'store', label: 'Cửa hàng',icon: 'solar:shop-linear' },
];

const STATUSES = [
  { value: 'active',  label: 'Hoạt động', icon: 'solar:check-circle-linear' },
  { value: 'blocked', label: 'Khoá',      icon: 'solar:lock-password-linear' },
];

const SALUTATIONS = [
  { value: 'mr', label: 'Anh' },
  { value: 'ms', label: 'Chị' },
];

const TIER_COLOR = { silver: 'default', gold: 'warning', platinum: 'info', diamond: 'secondary' };

const EMPTY = {
  full_name: '',
  salutation: 'ms',
  phone: '',
  email: '',
  marketing_opt_in: true,
  source: 'store',
  status: 'active',
  tags: [],
  note: '',
  membership: { tier_code: 'silver', points: 0, lifetime_spent: 0 },
  stats: { order_count: 0, total_spent: 0, last_order_at: null },
};

export function CustomerFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [tagInput, setTagInput] = useState('');
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial ? {
        ...EMPTY,
        ...initial,
        membership: { ...EMPTY.membership, ...(initial.membership ?? {}) },
        stats: { ...EMPTY.stats, ...(initial.stats ?? {}) },
        tags: initial.tags ?? [],
      } : EMPTY);
      setDirty(false);
    }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const setTier = (k, v) => { setForm((f) => ({ ...f, membership: { ...f.membership, [k]: v } })); setDirty(true); };

  const addTag = () => { const t = tagInput.trim(); if (!t) return; set('tags', [...form.tags, t]); setTagInput(''); };
  const removeTag = (i) => set('tags', form.tags.filter((_, idx) => idx !== i));

  const canSubmit = form.full_name.trim() && form.phone.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa KH · ${initial?.full_name ?? ''}` : 'Tạo khách hàng'}
      subtitle={isEdit ? `Mã KH ${initial?.code ?? '—'}` : 'Tạo tay cho khách walk-in · hoặc cập nhật profile sau onboard'}
      footer={
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && (
            <Box
              sx={{
                width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main',
                animation: 'pulse 1.4s infinite',
                '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
              }}
            />
          )}
          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: dirty ? 'warning.dark' : 'text.secondary' }}>
            {dirty ? 'Có thay đổi chưa lưu' : isEdit ? 'Chưa có thay đổi' : 'Điền thông tin rồi bấm Tạo'}
          </Typography>
          <Button onClick={onClose} color="inherit" startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}>Huỷ</Button>
          <Button
            variant="contained"
            disabled={!canSubmit || submitting || (isEdit && !dirty)}
            startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
            onClick={handleSubmit}
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo khách'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={PersonOutlined} title="Thông tin cá nhân">
                <Stack spacing={2.25}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <FieldLabel>XƯNG HÔ</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.salutation}
                        onChange={(e) => set('salutation', e.target.value)}
                      >
                        {SALUTATIONS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }}>
                      <FieldLabel required>HỌ VÀ TÊN</FieldLabel>
                      <TextField
                        value={form.full_name}
                        onChange={(e) => set('full_name', e.target.value)}
                        fullWidth size="small" autoFocus
                        placeholder="Vd: Nguyễn Thị Anh"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>SỐ ĐIỆN THOẠI</FieldLabel>
                      <TextField
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value.replace(/[^\d+]/g, ''))}
                        fullWidth size="small"
                        placeholder="0912345678"
                        inputProps={{ style: { fontFamily: 'monospace' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel>EMAIL</FieldLabel>
                      <TextField
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        fullWidth size="small"
                        placeholder="khach@example.com"
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><MailOutlineOutlined sx={{ fontSize: 16 }} /></InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <FormControlLabel
                    control={<Switch checked={form.marketing_opt_in} onChange={(_, v) => set('marketing_opt_in', v)} />}
                    label="Đồng ý nhận marketing (SMS/Email/Zalo)"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                  />
                </Stack>
              </SectionCard>

              <SectionCard icon={LocalOfferOutlined} title={`Tag · ${form.tags.length}`} description="Enter để thêm tag riêng cho khách (VIP, hay đổi quà…).">
                <Stack spacing={1.5}>
                  <TextField
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    fullWidth size="small"
                    placeholder="Gõ tag rồi Enter"
                  />
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ gap: 0.75 }}>
                    {form.tags.map((t, i) => <Chip key={`${t}-${i}`} label={t} size="small" onDelete={() => removeTag(i)} />)}
                  </Stack>
                </Stack>
              </SectionCard>

              <SectionCard icon={PersonOutlined} title="Ghi chú nội bộ" description="Chỉ admin thấy. Dùng để lưu sở thích/ghi chú chăm sóc.">
                <TextField
                  value={form.note}
                  onChange={(e) => set('note', e.target.value)}
                  fullWidth size="small" multiline rows={4}
                  placeholder="Vd: Khách thích đá trắng, sinh nhật 20/10, hay đi cùng mẹ…"
                />
              </SectionCard>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard icon={ToggleOnOutlined} title="Trạng thái & nguồn">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>TRẠNG THÁI</FieldLabel>
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
                  </Box>
                  <Box>
                    <FieldLabel>NGUỒN ĐĂNG KÝ</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.source}
                      onChange={(e) => set('source', e.target.value)}
                    >
                      {SOURCES.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify icon={s.icon} width={16} sx={{ color: 'text.secondary' }} />
                            <span>{s.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard icon={LocalOfferOutlined} title="Hạng & điểm">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>HẠNG THÀNH VIÊN</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.membership.tier_code}
                      onChange={(e) => setTier('tier_code', e.target.value)}
                    >
                      {membershipTiersList.map((t) => (
                        <MenuItem key={t.code} value={t.code}>
                          <Chip label={t.name} color={TIER_COLOR[t.code]} size="small" />
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Box>
                    <FieldLabel>ĐIỂM HIỆN TẠI</FieldLabel>
                    <TextField
                      type="number" fullWidth size="small"
                      value={form.membership.points}
                      onChange={(e) => setTier('points', Number(e.target.value) || 0)}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              {isEdit && (
                <Box sx={{ bgcolor: 'primary.lighter', color: 'primary.darker', borderRadius: 2, p: 2, border: 1, borderColor: 'primary.light' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>LỊCH SỬ MUA</Typography>
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    <Typography variant="body2"><b>{fmtNumber(form.stats.order_count)}</b> đơn · tổng <b>{fmtVND(form.stats.total_spent)}</b></Typography>
                    <Typography variant="caption">Đơn gần nhất: {form.stats.last_order_at ? fmtRelative(form.stats.last_order_at) : '—'}</Typography>
                  </Stack>
                </Box>
              )}

              {/* Preview chip */}
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, border: 1, borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.4, color: 'text.disabled' }}>
                  PREVIEW
                </Typography>
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.25 }}>
                  <Avatar sx={{ width: 42, height: 42, bgcolor: 'grey.100', color: 'text.secondary', fontSize: 16, fontWeight: 700 }}>
                    {(form.full_name || '?').split(' ').pop().slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }} noWrap>
                      {SALUTATIONS.find((s) => s.value === form.salutation)?.label} {form.full_name || 'Tên khách hàng'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'monospace' }} noWrap>
                      {form.phone || '—'} · {form.email || 'no-email'}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
                      <Chip label={form.membership.tier_code?.toUpperCase?.()} color={TIER_COLOR[form.membership.tier_code] ?? 'default'} size="small" sx={{ height: 16, fontSize: 9.5, fontWeight: 700 }} />
                      {form.marketing_opt_in && <Chip label="MARKETING" size="small" color="success" sx={{ height: 16, fontSize: 9.5 }} />}
                      {form.status === 'blocked' && <Chip label="KHOÁ" size="small" color="error" sx={{ height: 16, fontSize: 9.5 }} />}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </FormDrawer>
  );
}
