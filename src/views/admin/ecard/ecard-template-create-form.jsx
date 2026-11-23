// src/views/admin/ecard/ecard-template-create-form.jsx — FormDrawer tạo/sửa mẫu thiệp
// Style khớp brand-form: full-width · SectionCard · 2-col · dirty · preview chip.

'use client';

import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Chip, FormControlLabel, Grid, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { UploadField } from 'src/views/admin/_shared/upload-field';
import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';
import { mockEcardCategories } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const ecardCategoriesList = mockEcardCategories;
const STATUSES = [
  { value: 'active',   label: 'Đang hiển thị', icon: 'solar:check-circle-linear' },
  { value: 'draft',    label: 'Nháp',          icon: 'solar:document-text-linear' },
  { value: 'inactive', label: 'Tạm ẩn',        icon: 'solar:pause-circle-linear' },
];

const EMPTY = {
  category_id: '',
  category_name: '',
  name: '',
  image_url: '',
  default_message: 'Chúc mừng {recipient}! Gửi tặng bạn món quà từ {sender}.',
  sort: 10,
  status: 'active',
};

export function EcardTemplateFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  const canSubmit = form.name.trim() && form.category_id && !!form.image_url;

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa mẫu thiệp · ${initial?.name ?? ''}` : 'Tạo mẫu thiệp'}
      subtitle={isEdit ? `Chủ đề ${form.category_name}` : 'Ảnh + lời chúc mặc định + chủ đề — khách dùng khi tặng quà điện tử.'}
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo mẫu'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={ImageOutlined} title="Ảnh thiệp" description="Ảnh hiển thị khi khách chọn mẫu · tỷ lệ 3:2 · ≥ 1200×800">
                <UploadField
                  label=""
                  value={form.image_url}
                  onChange={(v) => set('image_url', v)}
                  helperText="JPG/PNG/WEBP ≤ 2MB"
                />
              </SectionCard>

              <SectionCard icon={InfoOutlined} title="Thông tin mẫu">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>TÊN MẪU</FieldLabel>
                    <TextField
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: Mẫu hoa hồng — tặng mẹ"
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <FieldLabel required>CHỦ ĐỀ</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.category_id}
                        onChange={(e) => {
                          const c = ecardCategoriesList.find((x) => x.id === e.target.value);
                          set('category_id', e.target.value);
                          set('category_name', c?.name ?? '');
                        }}
                      >
                        {ecardCategoriesList.length === 0 && (
                          <MenuItem value="" disabled>Chưa có chủ đề · tạo ở Chủ đề thiệp</MenuItem>
                        )}
                        {ecardCategoriesList.map((c) => (
                          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FieldLabel>SORT ORDER</FieldLabel>
                      <TextField
                        type="number"
                        value={form.sort}
                        onChange={(e) => set('sort', Number(e.target.value) || 0)}
                        fullWidth size="small"
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </SectionCard>

              <SectionCard icon={ArticleOutlined} title="Lời chúc mặc định" description="Dùng biến {recipient} (người nhận) và {sender} (người gửi).">
                <TextField
                  value={form.default_message}
                  onChange={(e) => set('default_message', e.target.value)}
                  fullWidth size="small" multiline rows={4}
                  placeholder="Chúc mừng {recipient}! Gửi tặng bạn món quà từ {sender}."
                  helperText={`${form.default_message?.length ?? 0} ký tự`}
                />
              </SectionCard>
            </Stack>
          </Grid>

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

              {/* Preview */}
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, border: 1, borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.4, color: 'text.disabled' }}>
                  PREVIEW
                </Typography>
                <Box
                  sx={{
                    mt: 1.25, aspectRatio: '3 / 2', borderRadius: 1,
                    bgcolor: 'grey.100', border: 1, borderColor: 'divider',
                    backgroundImage: form.image_url ? `url(${form.image_url})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'grid', placeItems: 'center',
                  }}
                >
                  {!form.image_url && <ImageOutlined sx={{ color: 'text.disabled', fontSize: 40 }} />}
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, mt: 1 }} noWrap>
                  {form.name || 'Tên mẫu'}
                </Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
                  {form.category_name || '—'}
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ mt: 0.75 }}>
                  <Chip label={STATUSES.find((s) => s.value === form.status)?.label?.toUpperCase?.()} size="small" sx={{ height: 16, fontSize: 9.5, fontWeight: 700 }} />
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </FormDrawer>
  );
}
