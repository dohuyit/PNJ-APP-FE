// src/views/admin/banner/banner-create-drawer.jsx — Full-width drawer tạo/sửa banner

'use client';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import LinkOutlined from '@mui/icons-material/LinkOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import EventOutlined from '@mui/icons-material/EventOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Grid, InputAdornment, MenuItem, Stack, TextField, Typography,
} from '@mui/material';

import { fNumber } from 'src/utils/format-number';

import { UploadField } from 'src/views/admin/_shared/upload-field';
import { SectionCard, FieldLabel } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';

const POSITIONS = [
  { value: 'home_hero',        label: 'Home Hero (slider trên)',  icon: 'solar:gallery-wide-linear' },
  { value: 'home_mid',         label: 'Home Mid banner',          icon: 'solar:gallery-linear' },
  { value: 'category_strip',   label: 'Strip trên danh mục',      icon: 'solar:widget-linear' },
  { value: 'popup',            label: 'Popup trang chủ',          icon: 'solar:popup-linear' },
  { value: 'mobile_hero',      label: 'Mobile Hero',              icon: 'solar:iphone-linear' },
];

const STATUSES = [
  { value: 'active', label: 'Đang hiển thị', icon: 'solar:check-circle-linear' },
  { value: 'draft',  label: 'Nháp',          icon: 'solar:document-text-linear' },
  { value: 'inactive', label: 'Tạm ẩn',      icon: 'solar:pause-circle-linear' },
];

const EMPTY = {
  title: '',
  subtitle: '',
  position: 'home_hero',
  image_desktop: '',
  image_mobile: '',
  link_url: '',
  link_target: '_self',
  cta_label: '',
  start_at: '',
  end_at: '',
  sort: 1,
  click_count: 0,
  impression_count: 0,
  status: 'active',
};

export function BannerFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const canSubmit = form.title.trim() && !!form.image_desktop && form.position;

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  const ctr = form.impression_count ? ((form.click_count / form.impression_count) * 100).toFixed(2) : '—';

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa banner · ${initial?.title ?? ''}` : 'Tạo banner mới'}
      subtitle={isEdit ? `CTR ${ctr}% · ${form.click_count} click / ${form.impression_count} impression` : 'Desktop + Mobile riêng · ảnh tỷ lệ 16:9 (desktop) / 4:5 (mobile)'}
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo banner'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={ImageOutlined} title="Nội dung banner" description="Tiêu đề & phụ đề hiển thị overlay lên ảnh.">
                <Stack spacing={2.25}>
                  <Box>
                    <FieldLabel required>TIÊU ĐỀ</FieldLabel>
                    <TextField
                      value={form.title}
                      onChange={(e) => set('title', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: Siêu sale 11/11 — Giảm 45% toàn danh mục nhẫn"
                    />
                  </Box>
                  <Box>
                    <FieldLabel>PHỤ ĐỀ</FieldLabel>
                    <TextField
                      value={form.subtitle}
                      onChange={(e) => set('subtitle', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Giới hạn 2.000 đơn đầu tiên"
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <FieldLabel>LINK CLICK</FieldLabel>
                      <TextField
                        value={form.link_url}
                        onChange={(e) => set('link_url', e.target.value)}
                        fullWidth size="small"
                        placeholder="/khuyen-mai/sale-1111"
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Iconify icon="solar:link-linear" width={14} /></InputAdornment>,
                          sx: { fontFamily: 'monospace' },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FieldLabel>TAB</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.link_target}
                        onChange={(e) => set('link_target', e.target.value)}
                      >
                        <MenuItem value="_self">Cùng tab</MenuItem>
                        <MenuItem value="_blank">Tab mới</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                  <Box>
                    <FieldLabel>CTA LABEL</FieldLabel>
                    <TextField
                      value={form.cta_label}
                      onChange={(e) => set('cta_label', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Mua ngay"
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SectionCard icon={ImageOutlined} title="Ảnh Desktop" description="Tỷ lệ 16:9 hoặc 21:9 · ≥ 1920px">
                    <UploadField
                      value={form.image_desktop}
                      onChange={(v) => set('image_desktop', v)}
                      helperText="Kéo thả ảnh desktop (JPG/PNG/WEBP) ≤ 2MB"
                    />
                  </SectionCard>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SectionCard icon={ImageOutlined} title="Ảnh Mobile" description="Tỷ lệ 4:5 hoặc 1:1 · ≥ 800px">
                    <UploadField
                      value={form.image_mobile}
                      onChange={(v) => set('image_mobile', v)}
                      helperText="Kéo thả ảnh mobile (JPG/PNG/WEBP) ≤ 2MB"
                    />
                  </SectionCard>
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard icon={PlaceOutlined} title="Vị trí hiển thị">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>VỊ TRÍ</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.position}
                      onChange={(e) => set('position', e.target.value)}
                    >
                      {POSITIONS.map((p) => (
                        <MenuItem key={p.value} value={p.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify icon={p.icon} width={16} sx={{ color: 'text.secondary' }} />
                            <span>{p.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Box>
                    <FieldLabel>THỨ TỰ TRONG VỊ TRÍ</FieldLabel>
                    <TextField
                      type="number" fullWidth size="small"
                      value={form.sort}
                      onChange={(e) => set('sort', Number(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard icon={EventOutlined} title="Lịch chạy">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>BẮT ĐẦU</FieldLabel>
                    <DateTimePicker
                      value={form.start_at ? dayjs(form.start_at) : null}
                      onChange={(v) => set('start_at', v ? dayjs(v).toISOString() : '')}
                      format="DD/MM/YYYY HH:mm"
                      slotProps={{
                        textField: { fullWidth: true, size: 'small', placeholder: 'dd/mm/yyyy hh:mm' },
                        actionBar: { actions: ['clear', 'today', 'accept'] },
                      }}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>KẾT THÚC</FieldLabel>
                    <DateTimePicker
                      value={form.end_at ? dayjs(form.end_at) : null}
                      onChange={(v) => set('end_at', v ? dayjs(v).toISOString() : '')}
                      format="DD/MM/YYYY HH:mm"
                      minDateTime={form.start_at ? dayjs(form.start_at) : undefined}
                      slotProps={{
                        textField: { fullWidth: true, size: 'small', placeholder: 'dd/mm/yyyy hh:mm' },
                        actionBar: { actions: ['clear', 'today', 'accept'] },
                      }}
                    />
                  </Box>
                </Stack>
              </SectionCard>

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

              {isEdit && (
                <Box sx={{ bgcolor: 'primary.lighter', color: 'primary.darker', borderRadius: 2, p: 2, border: 1, borderColor: 'primary.light' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>HIỆU QUẢ</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Box>
                      <Typography variant="caption" color="inherit">Impression</Typography>
                      <Typography variant="subtitle2">{fNumber(form.impression_count)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="inherit">Click</Typography>
                      <Typography variant="subtitle2">{fNumber(form.click_count)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="inherit">CTR</Typography>
                      <Typography variant="subtitle2">{ctr}%</Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </FormDrawer>
  );
}
