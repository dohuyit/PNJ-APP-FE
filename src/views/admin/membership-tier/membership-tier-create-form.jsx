// src/views/admin/membership-tier/membership-tier-create-form.jsx — FormDrawer tạo/sửa hạng thành viên
// Style khớp brand-form: full-width · SectionCard · 2-col · dirty · preview chip.

'use client';

import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import PaidOutlined from '@mui/icons-material/PaidOutlined';
import StarsOutlined from '@mui/icons-material/StarsOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Chip, Grid, InputAdornment, MenuItem, Stack, TextField, Typography,
} from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { MoneyInput } from 'src/components/common/money-input';
import { FormDrawer } from 'src/components/common/form-drawer';

const CODES = [
  { value: 'silver',   label: 'Silver',   icon: 'solar:medal-ribbon-linear',       color: '#9E9E9E' },
  { value: 'gold',     label: 'Gold',     icon: 'solar:medal-ribbons-linear',      color: '#FFB800' },
  { value: 'platinum', label: 'Platinum', icon: 'solar:crown-minimalistic-linear', color: '#64B5F6' },
  { value: 'diamond',  label: 'Diamond',  icon: 'solar:crown-star-linear',         color: '#AB47BC' },
];

const EMPTY = {
  code: 'silver',
  name: 'Silver',
  color_hex: '#9E9E9E',
  icon: 'solar:medal-ribbon-linear',
  min_spent: 0,
  point_rate: 1,
  discount_pct: 0,
  birthday_bonus: 0,
  free_ship_threshold: 0,
  sort: 10,
};

export function MembershipTierFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const setBatch = (patch) => { setForm((f) => ({ ...f, ...patch })); setDirty(true); };

  const canSubmit = form.code.trim() && form.name.trim();
  const currentPreset = CODES.find((c) => c.value === form.code);

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa hạng · ${initial?.name ?? ''}` : 'Tạo hạng thành viên'}
      subtitle={
        isEdit
          ? `${initial?.customer_count ?? 0} khách đang ở hạng này`
          : 'Silver → Gold → Platinum → Diamond · thiết lập ngưỡng chi tiêu + ưu đãi cho từng hạng.'
      }
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo hạng'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={InfoOutlined} title="Thông tin & nhận dạng">
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>CODE HẠNG</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.code}
                        onChange={(e) => {
                          const c = CODES.find((x) => x.value === e.target.value);
                          if (c) setBatch({ code: c.value, name: c.label, color_hex: c.color, icon: c.icon });
                        }}
                      >
                        {CODES.map((c) => (
                          <MenuItem key={c.value} value={c.value}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Iconify icon={c.icon} width={16} sx={{ color: c.color }} />
                              <span>{c.label}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>TÊN HIỂN THỊ</FieldLabel>
                      <TextField
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        fullWidth size="small"
                        placeholder="Vd: Kim Cương PNJ"
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid size={{ xs: 4, md: 2 }}>
                      <FieldLabel>MÀU NHÃN</FieldLabel>
                      <Box
                        sx={{
                          width: 44, height: 40, borderRadius: 1,
                          bgcolor: form.color_hex,
                          border: 1, borderColor: 'divider',
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 8, md: 4 }}>
                      <FieldLabel>HEX</FieldLabel>
                      <TextField
                        type="color" size="small" fullWidth
                        value={form.color_hex}
                        onChange={(e) => set('color_hex', e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel>ICON (solar)</FieldLabel>
                      <TextField
                        value={form.icon}
                        onChange={(e) => set('icon', e.target.value)}
                        fullWidth size="small"
                        placeholder="solar:crown-star-linear"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon={form.icon} width={16} sx={{ color: form.color_hex }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </SectionCard>

              <SectionCard icon={PaidOutlined} title="Ngưỡng & tích điểm" description="Khách đạt chi tiêu tối thiểu sẽ lên hạng này.">
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel>CHI TIÊU TỐI THIỂU (12 THÁNG)</FieldLabel>
                    <MoneyInput
                      size="small"
                      fullWidth
                      value={form.min_spent}
                      onChange={(e) => set('min_spent', e.target.value?.value ?? 0)}
                      placeholder="30.000.000"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel>ĐIỂM / 1.000đ CHI TIÊU</FieldLabel>
                    <TextField
                      type="number" fullWidth size="small"
                      value={form.point_rate}
                      onChange={(e) => set('point_rate', Number(e.target.value) || 0)}
                      inputProps={{ min: 0, step: 0.1 }}
                      helperText="Mặc định 1 điểm = 1.000đ chi tiêu"
                    />
                  </Grid>
                </Grid>
              </SectionCard>

              <SectionCard icon={LocalOfferOutlined} title="Ưu đãi hạng">
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FieldLabel>% GIẢM GIÁ</FieldLabel>
                    <TextField
                      type="number" fullWidth size="small"
                      value={form.discount_pct}
                      onChange={(e) => set('discount_pct', Number(e.target.value) || 0)}
                      InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FieldLabel>THƯỞNG SINH NHẬT</FieldLabel>
                    <MoneyInput
                      size="small"
                      fullWidth
                      value={form.birthday_bonus}
                      onChange={(e) => set('birthday_bonus', e.target.value?.value ?? 0)}
                      placeholder="500.000"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FieldLabel>FREESHIP TỪ</FieldLabel>
                    <MoneyInput
                      size="small"
                      fullWidth
                      value={form.free_ship_threshold}
                      onChange={(e) => set('free_ship_threshold', e.target.value?.value ?? 0)}
                      placeholder="0 = luôn freeship"
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard icon={StarsOutlined} title="Sort order">
                <TextField
                  type="number"
                  value={form.sort}
                  onChange={(e) => set('sort', Number(e.target.value) || 0)}
                  fullWidth size="small"
                  inputProps={{ min: 0 }}
                  helperText="Silver = 1 · Diamond = 4 · dùng để hiển thị bậc thang."
                />
              </SectionCard>

              {/* Preview */}
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, border: 1, borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.4, color: 'text.disabled' }}>
                  PREVIEW
                </Typography>
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.25 }}>
                  <Box
                    sx={{
                      width: 46, height: 46, borderRadius: 1,
                      display: 'grid', placeItems: 'center',
                      bgcolor: form.color_hex + '22',
                      color: form.color_hex,
                      border: `2px solid ${form.color_hex}`,
                    }}
                  >
                    <Iconify icon={form.icon} width={22} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 800, color: form.color_hex }} noWrap>
                      {form.name || 'Tên hạng'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
                      Từ {fCurrency(form.min_spent)}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
                      {form.discount_pct > 0 && <Chip label={`-${form.discount_pct}%`} size="small" sx={{ height: 16, fontSize: 9.5, fontWeight: 700, bgcolor: form.color_hex + '22', color: form.color_hex }} />}
                      {form.point_rate > 0 && <Chip label={`${form.point_rate}x ĐIỂM`} size="small" variant="outlined" sx={{ height: 16, fontSize: 9.5 }} />}
                      {form.birthday_bonus > 0 && <Chip label="Sinh nhật" size="small" sx={{ height: 16, fontSize: 9.5 }} />}
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
