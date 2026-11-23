// src/views/admin/store/store-create-drawer.jsx — Full-width drawer tạo/sửa cửa hàng

'use client';

import { useEffect, useState } from 'react';

import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import HandshakeOutlined from '@mui/icons-material/HandshakeOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Chip, FormControlLabel, Grid, InputAdornment, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { useGetStoreProvinces } from 'src/actions/admin/store';
import { SectionCard, FieldLabel } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';


const TYPES = [
  { value: 'jewelry_center', label: 'TT Kim hoàn',  icon: 'solar:crown-linear' },
  { value: 'store',          label: 'Cửa hàng',     icon: 'solar:shop-linear' },
  { value: 'watch_store',    label: 'CH Đồng hồ',   icon: 'solar:clock-circle-linear' },
  { value: 'kiosk',          label: 'Kiosk',        icon: 'solar:tag-horizontal-linear' },
];

const SERVICES = [
  { value: 'pickup',         label: 'Nhận tại CH',     icon: 'solar:box-linear' },
  { value: 'buy_gold_raw',   label: 'Mua vàng miếng',  icon: 'solar:dollar-linear' },
  { value: 'diamond_check',  label: 'KT kim cương',    icon: 'solar:star-shine-linear' },
  { value: 'engraving',      label: 'Khắc chữ',        icon: 'solar:pen-new-square-linear' },
  { value: 'express_3h',     label: 'Giao 3H',         icon: 'solar:delivery-linear' },
];

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const EMPTY = {
  code: '',
  name: '',
  type: 'store',
  address: '',
  province_code: '79',
  province_name: 'TP. Hồ Chí Minh',
  ward_name: '',
  phone: '',
  services: ['pickup'],
  accept_store_order: true,
  opening_hours: DAYS.map((_, d) => ({ day: d, open: '09:00', close: '20:00' })),
  sort: 1,
  status: 'active',
};

export function StoreFormDrawer({ open, onClose, onSubmit, initial }) {
  const locationsProvinces = useGetStoreProvinces().provinces;
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial ? {
        ...EMPTY,
        ...initial,
        services: initial.services ?? EMPTY.services,
        opening_hours: initial.opening_hours ?? EMPTY.opening_hours,
      } : EMPTY);
      setDirty(false);
    }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const toggleService = (v) =>
    set('services', form.services.includes(v) ? form.services.filter((x) => x !== v) : [...form.services, v]);
  const setHour = (day, k, v) =>
    set('opening_hours', form.opening_hours.map((h) => (h.day === day ? { ...h, [k]: v } : h)));

  const canSubmit = form.code.trim() && form.name.trim() && form.phone.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa cửa hàng · ${initial?.code ?? ''}` : 'Tạo cửa hàng mới'}
      subtitle={isEdit ? initial?.address : 'TT Kim hoàn / CH / CH Đồng hồ / Kiosk · Google Maps cập nhật sau'}
      footer={
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />}
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo cửa hàng'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={StorefrontOutlined} title="Thông tin cửa hàng">
                <Stack spacing={2.25}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FieldLabel required>MÃ CỬA HÀNG</FieldLabel>
                      <TextField
                        value={form.code}
                        onChange={(e) => set('code', e.target.value.toUpperCase())}
                        fullWidth size="small" autoFocus
                        placeholder="PNJ001"
                        inputProps={{ style: { fontFamily: 'monospace' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <FieldLabel required>TÊN CỬA HÀNG</FieldLabel>
                      <TextField
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        fullWidth size="small"
                        placeholder="Vd: Trung Tâm Kim Hoàn Nguyễn Trãi"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>LOẠI</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.type}
                        onChange={(e) => set('type', e.target.value)}
                      >
                        {TYPES.map((t) => (
                          <MenuItem key={t.value} value={t.value}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Iconify icon={t.icon} width={16} sx={{ color: 'text.secondary' }} />
                              <span>{t.label}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>SỐ ĐIỆN THOẠI</FieldLabel>
                      <TextField
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                        fullWidth size="small"
                        placeholder="028 38123456"
                        inputProps={{ style: { fontFamily: 'monospace' } }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </SectionCard>

              <SectionCard icon={PlaceOutlined} title="Địa chỉ">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>ĐỊA CHỈ CHI TIẾT</FieldLabel>
                    <TextField
                      value={form.address}
                      onChange={(e) => set('address', e.target.value)}
                      fullWidth size="small"
                      placeholder="Số nhà + đường"
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>TỈNH / TP</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.province_code}
                        onChange={(e) => {
                          const p = locationsProvinces.find((x) => x.code === e.target.value);
                          set('province_code', e.target.value);
                          set('province_name', p?.name ?? '');
                        }}
                      >
                        {locationsProvinces.map((p) => (
                          <MenuItem key={p.id} value={p.code}>{p.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel>PHƯỜNG / XÃ</FieldLabel>
                      <TextField
                        value={form.ward_name}
                        onChange={(e) => set('ward_name', e.target.value)}
                        fullWidth size="small"
                        placeholder="Vd: Phường Bến Thành"
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </SectionCard>

              <SectionCard icon={AccessTimeOutlined} title="Giờ mở cửa" description="Theo thứ. Có thể để trống open/close nếu ngày đó nghỉ.">
                <Stack spacing={1}>
                  {form.opening_hours.map((h) => (
                    <Stack key={h.day} direction="row" spacing={1.5} alignItems="center">
                      <Typography sx={{ width: 40, fontWeight: 600, textAlign: 'center' }}>{DAYS[h.day]}</Typography>
                      <TextField
                        type="time" size="small" sx={{ flex: 1 }}
                        value={h.open}
                        onChange={(e) => setHour(h.day, 'open', e.target.value)}
                      />
                      <Typography>→</Typography>
                      <TextField
                        type="time" size="small" sx={{ flex: 1 }}
                        value={h.close}
                        onChange={(e) => setHour(h.day, 'close', e.target.value)}
                      />
                    </Stack>
                  ))}
                </Stack>
              </SectionCard>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard icon={ToggleOnOutlined} title="Trạng thái">
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.status === 'active'}
                        onChange={(_, v) => set('status', v ? 'active' : 'inactive')}
                      />
                    }
                    label={form.status === 'active' ? 'Đang mở' : 'Tạm ngưng'}
                  />
                  <FormControlLabel
                    control={<Switch checked={form.accept_store_order} onChange={(_, v) => set('accept_store_order', v)} />}
                    label="Nhận đặt tại cửa hàng"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                  />
                  <Box>
                    <FieldLabel>THỨ TỰ HIỂN THỊ</FieldLabel>
                    <TextField
                      type="number" size="small" sx={{ width: 120 }}
                      value={form.sort}
                      onChange={(e) => set('sort', Number(e.target.value) || 0)}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard icon={HandshakeOutlined} title="Dịch vụ cung cấp">
                <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ gap: 0.75 }}>
                  {SERVICES.map((s) => {
                    const active = form.services.includes(s.value);
                    return (
                      <Chip
                        key={s.value}
                        icon={<Iconify icon={s.icon} width={14} sx={{ ml: 0.5 }} />}
                        label={s.label}
                        size="small"
                        color={active ? 'primary' : 'default'}
                        variant={active ? 'filled' : 'outlined'}
                        onClick={() => toggleService(s.value)}
                      />
                    );
                  })}
                </Stack>
              </SectionCard>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </FormDrawer>
  );
}
