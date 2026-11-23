// src/views/admin/landing-page/landing-page-create-form.jsx — FormDrawer tạo/sửa landing page
// Style khớp brand-form: full-width · SectionCard · 2-col · dirty · preview chip.
// Landing page = /disneypnj, /sanrio, /trang-suc-thang-11... · gồm chuỗi block UI tuỳ biến.

'use client';

import dayjs from 'dayjs';
import { useState, useEffect, useMemo } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import EventOutlined from '@mui/icons-material/EventOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import DragIndicatorOutlined from '@mui/icons-material/DragIndicatorOutlined';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineOutlined from '@mui/icons-material/AddCircleOutlineOutlined';
import {
  Box, Button, Chip, FormControlLabel, Grid, IconButton, InputAdornment,
  MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';
import { SlugInput } from 'src/components/common/slug-input';
import { FormDrawer } from 'src/components/common/form-drawer';
import { UploadField } from 'src/views/admin/_shared/upload-field';

// ----------------------------------------------------------------------

const BLOCK_TYPES = [
  { value: 'hero',         label: 'Hero banner',       icon: 'solar:gallery-wide-linear',   desc: 'Ảnh lớn + title + CTA.' },
  { value: 'strip',        label: 'Strip USP',         icon: 'solar:verified-check-linear', desc: 'Dải 3-4 chip (giao 3H / thu đổi 48H…).' },
  { value: 'products',     label: 'Lưới sản phẩm',     icon: 'solar:bag-4-linear',          desc: 'Tabs chia theo category/BST, hiện lưới SP.' },
  { value: 'collection',   label: 'Khối BST',          icon: 'solar:gallery-linear',        desc: 'Lấy SP từ 1 BST, layout coverflow/grid.' },
  { value: 'countdown',    label: 'Đếm ngược',         icon: 'solar:clock-circle-linear',   desc: 'Đồng hồ đếm ngược cho flash sale.' },
  { value: 'voucher',      label: 'Thẻ voucher',       icon: 'solar:ticket-linear',         desc: 'Hiện voucher kèm nút copy mã.' },
  { value: 'html',         label: 'HTML tuỳ biến',     icon: 'solar:code-linear',           desc: 'Snippet tự do (chỉ admin HTML role).' },
  { value: 'image',        label: 'Ảnh đơn / grid',    icon: 'solar:gallery-wide-linear',   desc: 'Ảnh tuỳ chỉnh, link click được.' },
  { value: 'faq',          label: 'FAQ accordion',     icon: 'solar:question-circle-linear', desc: 'Nhóm Q&A gập mở.' },
  { value: 'newsletter',   label: 'Form nhận tin',     icon: 'solar:letter-linear',         desc: 'Form email đăng ký newsletter.' },
];

const AUDIENCES = [
  { value: 'any',    label: 'Bất kỳ',   color: '#64748B' },
  { value: 'female', label: 'Nữ',       color: '#DB2777' },
  { value: 'male',   label: 'Nam',      color: '#2563EB' },
  { value: 'kids',   label: 'Trẻ em',   color: '#F59E0B' },
];

const STATUSES = [
  { value: 'published', label: 'Đã đăng',    icon: 'solar:check-circle-linear' },
  { value: 'scheduled', label: 'Hẹn lịch',   icon: 'solar:calendar-linear' },
  { value: 'draft',     label: 'Nháp',       icon: 'solar:document-text-linear' },
  { value: 'archived',  label: 'Lưu trữ',    icon: 'solar:box-minimalistic-linear' },
];

const SCHEMA_TYPES = [
  { value: 'WebPage',      label: 'WebPage' },
  { value: 'LandingPage',  label: 'LandingPage' },
  { value: 'CollectionPage', label: 'CollectionPage' },
];

const EMPTY = {
  title: '',
  slug: '',
  subtitle: '',
  description: '',
  intro_html: '',
  cover_file_id: null,
  cover_url: '',
  og_image: '',
  blocks: [], // [{id, type, title, source_id, html, image_url, cta_label, cta_url, sort, is_active}]
  audience: 'any',
  status: 'draft',
  start_at: '',
  end_at: '',
  sort: 10,
  is_featured_home: false,
  is_full_bleed: false,
  seo: {
    title: '',
    description: '',
    og_image: '',
    schema_type: 'LandingPage',
    noindex: false,
  },
};

const newBlockId = () => `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

// ----------------------------------------------------------------------

export function LandingPageFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial
        ? { ...EMPTY, ...initial, seo: { ...EMPTY.seo, ...(initial.seo ?? {}) }, blocks: initial.blocks ?? [] }
        : EMPTY);
      setDirty(false);
    }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const setSeo = (k, v) => { setForm((f) => ({ ...f, seo: { ...f.seo, [k]: v } })); setDirty(true); };

  // Block manipulation
  const addBlock = (type) => {
    const meta = BLOCK_TYPES.find((b) => b.value === type);
    const nb = {
      id: newBlockId(),
      type,
      title: meta?.label ?? 'Block',
      source_id: '',
      html: '',
      image_url: '',
      cta_label: '',
      cta_url: '',
      sort: form.blocks.length + 1,
      is_active: true,
    };
    set('blocks', [...form.blocks, nb]);
  };
  const removeBlock = (id) => set('blocks', form.blocks.filter((b) => b.id !== id));
  const moveBlock = (id, dir) => {
    const idx = form.blocks.findIndex((b) => b.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= form.blocks.length) return;
    const next = [...form.blocks];
    [next[idx], next[target]] = [next[target], next[idx]];
    set('blocks', next);
  };
  const updateBlock = (id, patch) => {
    set('blocks', form.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const canSubmit = form.title.trim() && form.slug.trim();
  const audienceMeta = AUDIENCES.find((a) => a.value === form.audience);

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  const blockCountByType = useMemo(() => {
    const map = {};
    form.blocks.forEach((b) => { map[b.type] = (map[b.type] ?? 0) + 1; });
    return map;
  }, [form.blocks]);

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa landing · ${initial?.title ?? ''}` : 'Tạo landing page mới'}
      subtitle={
        isEdit
          ? `/${form.slug} · ${form.blocks.length} block · ${STATUSES.find((s) => s.value === form.status)?.label ?? '—'}`
          : 'Trang campaign tuỳ biến · Disney | PNJ, Sanrio, Trang sức tháng 11… Lắp ghép block theo thứ tự hiển thị.'
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo landing'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 } }}>
        <Grid container spacing={2}>
          {/* ============ LEFT ============ */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard
                icon={InfoOutlined}
                title="Thông tin trang"
                description="Tiêu đề hiển thị, slug URL và mô tả ngắn."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>TIÊU ĐỀ LANDING</FieldLabel>
                    <TextField
                      value={form.title}
                      onChange={(e) => set('title', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: Disney | PNJ · Khởi nguồn phép màu"
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <FieldLabel required>SLUG URL</FieldLabel>
                      <SlugInput label="" sourceName={form.title} value={form.slug} onChange={(v) => set('slug', v)} />
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.disabled' }}>
                        URL: <code style={{ fontFamily: 'monospace' }}>pnj.com.vn/{form.slug || 'slug'}</code>
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <FieldLabel>TẬP KHÁN GIẢ</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.audience}
                        onChange={(e) => set('audience', e.target.value)}
                      >
                        {AUDIENCES.map((a) => (
                          <MenuItem key={a.value} value={a.value}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: a.color }} />
                              <span>{a.label}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Box>
                    <FieldLabel>PHỤ ĐỀ</FieldLabel>
                    <TextField
                      value={form.subtitle}
                      onChange={(e) => set('subtitle', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Bộ sưu tập giới hạn 1.000 sản phẩm"
                    />
                  </Box>

                  <Box>
                    <FieldLabel>MÔ TẢ NGẮN (hiện trong listing)</FieldLabel>
                    <TextField
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      fullWidth size="small" multiline rows={2}
                      helperText={`${form.description?.length ?? 0}/180`}
                      inputProps={{ maxLength: 180 }}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={ImageOutlined}
                title="Ảnh bìa"
                description="Hero banner xuất hiện trên đầu trang + OG image."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <FieldLabel>ẢNH BÌA (16:9)</FieldLabel>
                    <UploadField
                      value={form.cover_url || null}
                      onChange={(file) => {
                        if (file instanceof File) {
                          set('cover_file_id', `tmp-${Date.now()}`);
                          set('cover_url', URL.createObjectURL(file));
                        } else {
                          set('cover_file_id', null);
                          set('cover_url', '');
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <FieldLabel>FULL BLEED (edge-to-edge)</FieldLabel>
                    <FormControlLabel
                      control={<Switch checked={!!form.is_full_bleed} onChange={(_, v) => set('is_full_bleed', v)} />}
                      label={<Typography variant="body2">Ảnh tràn hết chiều ngang viewport</Typography>}
                    />
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.disabled' }}>
                      Bật khi muốn hero ảnh full width, tắt nếu cần padding hai bên.
                    </Typography>
                  </Grid>
                </Grid>
              </SectionCard>

              <SectionCard
                icon={ArticleOutlined}
                title="Intro (HTML)"
                description="Đoạn mở đầu dưới hero · rich text với liên kết, bullet…"
              >
                <Editor
                  fullItem
                  value={form.intro_html}
                  onChange={(v) => set('intro_html', v)}
                  placeholder="Vd: Đây là dòng khởi đầu · một chương mới của PNJ x Disney…"
                  sx={{ minHeight: 220 }}
                />
              </SectionCard>

              <SectionCard
                icon={LayersOutlined}
                title={`Blocks · ${form.blocks.length}`}
                description="Lắp ghép block theo thứ tự. Kéo sắp xếp với nút ↑↓."
                action={
                  <TextField
                    select
                    size="small"
                    value=""
                    onChange={(e) => { if (e.target.value) addBlock(e.target.value); }}
                    sx={{ minWidth: 180 }}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value="" disabled>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AddCircleOutlineOutlined sx={{ fontSize: 16 }} />
                        <span>Thêm block…</span>
                      </Stack>
                    </MenuItem>
                    {BLOCK_TYPES.map((b) => (
                      <MenuItem key={b.value} value={b.value}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Iconify icon={b.icon} width={16} sx={{ color: 'text.secondary' }} />
                          <span>{b.label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </TextField>
                }
              >
                {form.blocks.length === 0 ? (
                  <Box
                    sx={{
                      py: 5, textAlign: 'center',
                      border: '2px dashed', borderColor: 'divider',
                      borderRadius: 1, bgcolor: 'background.paper',
                    }}
                  >
                    <LayersOutlined sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Chưa có block nào
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      Chọn &ldquo;Thêm block&rdquo; ở trên để bắt đầu lắp ghép landing.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.25}>
                    {form.blocks.map((b, idx) => {
                      const meta = BLOCK_TYPES.find((x) => x.value === b.type);
                      return (
                        <Box
                          key={b.id}
                          sx={{
                            p: 1.5,
                            borderRadius: 1,
                            border: 1,
                            borderColor: b.is_active ? 'divider' : 'warning.light',
                            bgcolor: b.is_active ? 'background.paper' : 'warning.lighter',
                            opacity: b.is_active ? 1 : 0.7,
                            transition: 'all .2s ease',
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <DragIndicatorOutlined sx={{ fontSize: 18, color: 'text.disabled', cursor: 'grab' }} />
                            <Chip
                              icon={<Iconify icon={meta?.icon ?? 'solar:box-linear'} width={14} />}
                              label={meta?.label ?? b.type}
                              size="small"
                              sx={{ fontWeight: 700 }}
                            />
                            <TextField
                              size="small"
                              value={b.title}
                              onChange={(e) => updateBlock(b.id, { title: e.target.value })}
                              placeholder="Tiêu đề block"
                              sx={{ flex: 1 }}
                            />
                            <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', mx: 1 }}>
                              #{idx + 1}
                            </Typography>
                            <Switch
                              size="small"
                              checked={b.is_active}
                              onChange={(_, v) => updateBlock(b.id, { is_active: v })}
                            />
                            <IconButton size="small" disabled={idx === 0} onClick={() => moveBlock(b.id, -1)}>
                              <Iconify icon="solar:arrow-up-linear" width={14} />
                            </IconButton>
                            <IconButton
                              size="small"
                              disabled={idx === form.blocks.length - 1}
                              onClick={() => moveBlock(b.id, 1)}
                            >
                              <Iconify icon="solar:arrow-down-linear" width={14} />
                            </IconButton>
                            <IconButton size="small" onClick={() => removeBlock(b.id)} sx={{ color: 'error.main' }}>
                              <DeleteOutlineOutlined sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Stack>
                          {(b.type === 'hero' || b.type === 'image' || b.type === 'countdown' || b.type === 'voucher') && (
                            <Grid container spacing={1} sx={{ mt: 1 }}>
                              {(b.type === 'hero' || b.type === 'image') && (
                                <Grid size={6}>
                                  <TextField
                                    size="small" fullWidth
                                    value={b.image_url}
                                    onChange={(e) => updateBlock(b.id, { image_url: e.target.value })}
                                    placeholder="URL ảnh"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <Iconify icon="solar:gallery-linear" width={14} />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </Grid>
                              )}
                              <Grid size={b.type === 'hero' || b.type === 'image' ? 3 : 6}>
                                <TextField
                                  size="small" fullWidth
                                  value={b.cta_label}
                                  onChange={(e) => updateBlock(b.id, { cta_label: e.target.value })}
                                  placeholder="CTA label"
                                />
                              </Grid>
                              <Grid size={b.type === 'hero' || b.type === 'image' ? 3 : 6}>
                                <TextField
                                  size="small" fullWidth
                                  value={b.cta_url}
                                  onChange={(e) => updateBlock(b.id, { cta_url: e.target.value })}
                                  placeholder="CTA URL"
                                  inputProps={{ style: { fontFamily: 'monospace', fontSize: 12 } }}
                                />
                              </Grid>
                            </Grid>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </SectionCard>
            </Stack>
          </Grid>

          {/* ============ RIGHT ============ */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard
                icon={ToggleOnOutlined}
                title="Trạng thái & sort"
              >
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
                    <FieldLabel>SORT ORDER</FieldLabel>
                    <TextField
                      type="number"
                      value={form.sort}
                      onChange={(e) => set('sort', Number(e.target.value) || 0)}
                      fullWidth size="small"
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={EventOutlined}
                title="Lịch chạy"
                description="Landing có thể hẹn lịch publish + hạn cuối. Để trống = always on."
              >
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

              <SectionCard
                icon={FlagOutlined}
                title="Hiển thị"
              >
                <Stack spacing={0} divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ py: 1.25 }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Nổi bật trang chủ</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Đưa landing vào khối &ldquo;Landing nổi bật&rdquo;.
                      </Typography>
                    </Box>
                    <Switch checked={!!form.is_featured_home} onChange={(_, v) => set('is_featured_home', v)} />
                  </Stack>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={CampaignOutlined}
                title={`Tổng số block · ${form.blocks.length}`}
              >
                <Stack spacing={0.5}>
                  {BLOCK_TYPES.filter((b) => blockCountByType[b.value]).map((b) => (
                    <Stack key={b.value} direction="row" alignItems="center" spacing={1}>
                      <Iconify icon={b.icon} width={14} sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ flex: 1, fontSize: 12.5 }}>
                        {b.label}
                      </Typography>
                      <Chip label={blockCountByType[b.value]} size="small" sx={{ height: 18, fontSize: 10, fontWeight: 700 }} />
                    </Stack>
                  ))}
                  {form.blocks.length === 0 && (
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      Chưa có block nào.
                    </Typography>
                  )}
                </Stack>
              </SectionCard>

              <SectionCard
                icon={LanguageOutlined}
                title="SEO"
                description="Metadata cho trang landing."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>TITLE</FieldLabel>
                    <TextField
                      value={form.seo.title}
                      onChange={(e) => setSeo('title', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Disney | PNJ · PNJ"
                      helperText={`${form.seo.title?.length ?? 0}/60`}
                      inputProps={{ maxLength: 60 }}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>META DESCRIPTION</FieldLabel>
                    <TextField
                      value={form.seo.description}
                      onChange={(e) => setSeo('description', e.target.value)}
                      fullWidth size="small" multiline rows={2}
                      helperText={`${form.seo.description?.length ?? 0}/160`}
                      inputProps={{ maxLength: 160 }}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>OG IMAGE URL</FieldLabel>
                    <TextField
                      value={form.seo.og_image}
                      onChange={(e) => setSeo('og_image', e.target.value)}
                      fullWidth size="small"
                      placeholder="https://cdn.pnj.com.vn/og/disney.jpg"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkOutlined sx={{ fontSize: 14 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>SCHEMA TYPE</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.seo.schema_type}
                      onChange={(e) => setSeo('schema_type', e.target.value)}
                    >
                      {SCHEMA_TYPES.map((s) => (
                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <FormControlLabel
                    control={<Switch checked={!!form.seo.noindex} onChange={(_, v) => setSeo('noindex', v)} />}
                    label="Chặn index (noindex)"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                  />
                </Stack>
              </SectionCard>

              {/* Preview */}
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.4, color: 'text.disabled' }}>
                  PREVIEW
                </Typography>
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.25 }}>
                  <Box
                    sx={{
                      width: 42, height: 42, borderRadius: 1,
                      display: 'grid', placeItems: 'center',
                      bgcolor: 'grey.100',
                      border: 1, borderColor: 'divider',
                      backgroundImage: form.cover_url ? `url(${form.cover_url})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!form.cover_url && <ImageOutlined sx={{ color: 'text.disabled' }} />}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }} noWrap>
                      {form.title || 'Tên landing'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'monospace' }} noWrap>
                      /{form.slug || 'slug'}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
                      <Chip
                        label={audienceMeta?.label}
                        size="small"
                        sx={{
                          height: 16, fontSize: 9.5, fontWeight: 700,
                          bgcolor: (audienceMeta?.color ?? '#999') + '22',
                          color: audienceMeta?.color,
                        }}
                      />
                      <Chip label={`${form.blocks.length} BLOCK`} size="small" variant="outlined" sx={{ height: 16, fontSize: 9.5 }} />
                      {form.is_featured_home && <Chip label="NỔI BẬT" size="small" color="warning" sx={{ height: 16, fontSize: 9.5 }} />}
                      {form.is_full_bleed && <Chip label="FULL" size="small" color="info" sx={{ height: 16, fontSize: 9.5 }} />}
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
