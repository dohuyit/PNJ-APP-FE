// src/views/admin/brand/brand-create-form.jsx — FormDrawer tạo/sửa thương hiệu (full-width 2 cột)

'use client';

import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Chip, Grid, Stack, Button, Switch,
  MenuItem, TextField, Typography, InputAdornment, FormControlLabel,
} from '@mui/material';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { SlugInput } from 'src/components/common/slug-input';
import { FormDrawer } from 'src/components/common/form-drawer';
import { UploadField } from 'src/views/admin/_shared/upload-field';
import { Editor } from 'src/components/editor';

// ----------------------------------------------------------------------

const GROUPS = [
  { value: 'product',      label: 'SP riêng',       icon: 'solar:tag-horizontal-linear',   desc: 'Nhãn hàng tự sản xuất: PNJ Signature / Gold / Diamond…' },
  { value: 'retail',       label: 'Chuỗi bán lẻ',    icon: 'solar:shop-2-linear',            desc: 'Thương hiệu PNJ vận hành bán lẻ: Jemma, Styl\'eC, CAO…' },
  { value: 'partnership',  label: 'Hợp tác',         icon: 'solar:hand-shake-linear',        desc: 'Co-brand / nhượng quyền: Disney | PNJ…' },
  { value: 'watch_maker',  label: 'Hãng đồng hồ',    icon: 'solar:clock-circle-linear',      desc: 'Các hãng đồng hồ phân phối (nếu có).' },
];

const COUNTRIES = [
  'Việt Nam', 'Ý', 'Pháp', 'Thuỵ Sĩ', 'Hoa Kỳ', 'Nhật Bản', 'Hàn Quốc', 'Đức', 'Khác',
];

const STATUSES = [
  { value: 'active',   label: 'Đang hiển thị', icon: 'solar:check-circle-linear' },
  { value: 'draft',    label: 'Nháp',          icon: 'solar:document-text-linear' },
  { value: 'inactive', label: 'Tạm ẩn',        icon: 'solar:pause-circle-linear' },
];

const SCHEMA_TYPES = [
  { value: 'Brand',        label: 'Brand' },
  { value: 'Organization', label: 'Organization' },
  { value: 'Thing',        label: 'Thing' },
];

const EMPTY = {
  name: '',
  slug: '',
  tagline: '',
  short_description: '',
  description_html: '',
  group: 'product',
  country: 'Việt Nam',
  established_year: '',
  website_url: '',
  parent_brand: '',
  status: 'active',
  sort: 10,
  is_featured: false,
  is_in_nav: true,
  is_new_badge: false,
  logo_file_id: null,
  logo_url: '',
  banner_file_id: null,
  banner_url: '',
  monogram: '',
  color_primary: '#8B6E3F',
  seo: {
    title: '',
    description: '',
    og_image: '',
    schema_type: 'Brand',
    noindex: false,
  },
};

// ----------------------------------------------------------------------

export function BrandFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial, seo: { ...EMPTY.seo, ...(initial.seo ?? {}) } } : EMPTY);
      setDirty(false);
    }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const setSeo = (k, v) => { setForm((f) => ({ ...f, seo: { ...f.seo, [k]: v } })); setDirty(true); };

  const canSubmit = form.name.trim() && form.slug.trim();
  const currentGroup = GROUPS.find((g) => g.value === form.group);

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa thương hiệu — ${initial?.name ?? ''}` : 'Tạo thương hiệu mới'}
      subtitle={
        isEdit
          ? `${currentGroup?.label ?? '—'} · ${form.country ?? '—'} · ${form.established_year || '—'}`
          : 'Nhãn hàng nội bộ · chuỗi bán lẻ · co-brand — hiển thị ở mega menu, trang BST và card sản phẩm.'
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
          <Button onClick={onClose} color="inherit" startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}>
            Huỷ
          </Button>
          <Button
            variant="contained"
            disabled={!canSubmit || submitting || (isEdit && !dirty)}
            startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
            onClick={handleSubmit}
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo thương hiệu'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          {/* ============ LEFT (md=8) ============ */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard
                icon={InfoOutlined}
                title="Thông tin chung"
                description="Tên, URL slug, nhóm phân loại và các trường nhận dạng."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>TÊN THƯƠNG HIỆU</FieldLabel>
                    <TextField
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: PNJ Signature / Jemma / CAO Fine Jewelry"
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>SLUG URL</FieldLabel>
                      <SlugInput label="" sourceName={form.name} value={form.slug} onChange={(v) => set('slug', v)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel>MONOGRAM / VIẾT TẮT</FieldLabel>
                      <TextField
                        value={form.monogram}
                        onChange={(e) => set('monogram', e.target.value.toUpperCase().slice(0, 4))}
                        fullWidth size="small"
                        placeholder="PNJ / CAO / JM"
                        helperText="1–4 ký tự — dùng làm avatar fallback khi chưa có logo"
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel>QUỐC GIA XUẤT XỨ</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.country}
                        onChange={(e) => set('country', e.target.value)}
                      >
                        {COUNTRIES.map((c) => (
                          <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <FieldLabel>NĂM THÀNH LẬP</FieldLabel>
                      <TextField
                        type="number"
                        value={form.established_year}
                        onChange={(e) => set('established_year', e.target.value)}
                        fullWidth size="small"
                        placeholder="1988"
                        inputProps={{ min: 1800, max: new Date().getFullYear() }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <FieldLabel>MÀU CHỦ ĐẠO</FieldLabel>
                      <TextField
                        value={form.color_primary}
                        onChange={(e) => set('color_primary', e.target.value)}
                        fullWidth size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ width: 16, height: 16, borderRadius: 0.5, bgcolor: form.color_primary, border: 1, borderColor: 'divider' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <FieldLabel>WEBSITE / FANPAGE CHÍNH THỨC</FieldLabel>
                    <TextField
                      value={form.website_url}
                      onChange={(e) => set('website_url', e.target.value)}
                      fullWidth size="small"
                      placeholder="https://jemma.vn"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:link-linear" width={14} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={ArticleOutlined}
                title="Câu chuyện thương hiệu"
                description="Slogan + mô tả ngắn cho card, và nội dung dài cho trang landing /thuong-hieu/<slug>."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>SLOGAN / TAGLINE</FieldLabel>
                    <TextField
                      value={form.tagline}
                      onChange={(e) => set('tagline', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Niềm tin của phái đẹp Việt"
                      helperText={`${form.tagline?.length ?? 0}/80 ký tự`}
                      inputProps={{ maxLength: 80 }}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>MÔ TẢ NGẮN</FieldLabel>
                    <TextField
                      value={form.short_description}
                      onChange={(e) => set('short_description', e.target.value)}
                      fullWidth size="small" multiline rows={3}
                      placeholder="1–2 câu giới thiệu thương hiệu — xuất hiện ở card và mega menu."
                      helperText={`${form.short_description?.length ?? 0}/180`}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>CÂU CHUYỆN DÀI (HTML)</FieldLabel>
                    <Editor
                      value={form.description_html}
                      onChange={(v) => set('description_html', v)}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={ImageOutlined}
                title="Hình ảnh thương hiệu"
                description="Logo (vuông 1:1, nền trong) + banner trang landing (ngang 16:9 hoặc 2:1, ≥ 1600px)."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FieldLabel>LOGO (1:1)</FieldLabel>
                    <UploadField
                      value={form.logo_url || null}
                      onChange={(file) => {
                        if (file instanceof File) {
                          set('logo_file_id', `tmp-${Date.now()}`);
                          set('logo_url', URL.createObjectURL(file));
                        } else {
                          set('logo_file_id', null);
                          set('logo_url', '');
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <FieldLabel>BANNER TRANG LANDING (16:9)</FieldLabel>
                    <UploadField
                      value={form.banner_url || null}
                      onChange={(file) => {
                        if (file instanceof File) {
                          set('banner_file_id', `tmp-${Date.now()}`);
                          set('banner_url', URL.createObjectURL(file));
                        } else {
                          set('banner_file_id', null);
                          set('banner_url', '');
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            </Stack>
          </Grid>

          {/* ============ RIGHT (md=4) ============ */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard
                icon={StorefrontOutlined}
                title="Phân loại & trạng thái"
                description="Nhóm phân loại quyết định thương hiệu nằm vào mega-menu / card nào trên front."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>NHÓM</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.group}
                      onChange={(e) => set('group', e.target.value)}
                    >
                      {GROUPS.map((g) => (
                        <MenuItem key={g.value} value={g.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify icon={g.icon} width={16} sx={{ color: 'text.secondary' }} />
                            <span>{g.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                    {currentGroup && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.disabled' }}>
                        {currentGroup.desc}
                      </Typography>
                    )}
                  </Box>

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
                      helperText="Nhỏ hiện trước — dùng khi sort tay trong mega menu"
                    />
                  </Box>

                  <Box>
                    <FieldLabel>THƯƠNG HIỆU MẸ (nếu có)</FieldLabel>
                    <TextField
                      value={form.parent_brand}
                      onChange={(e) => set('parent_brand', e.target.value)}
                      fullWidth size="small"
                      placeholder="Slug brand mẹ — để trống nếu độc lập"
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={FlagOutlined}
                title="Nhãn & hiển thị"
                description="Bật nhãn + vị trí xuất hiện trên front-end."
              >
                <Stack spacing={0} divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
                  {[
                    { k: 'is_featured',  label: 'Nổi bật trang chủ', desc: 'Đưa vào khối "Thương hiệu nổi bật" ở homepage.' },
                    { k: 'is_in_nav',    label: 'Hiện ở mega menu',  desc: 'Xuất hiện trong dropdown header khi hover /thuong-hieu.' },
                    { k: 'is_new_badge', label: 'Nhãn NEW',          desc: 'Gắn huy hiệu đỏ "NEW" lên card brand.' },
                  ].map((it) => (
                    <Stack
                      key={it.k}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{ py: 1.25 }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{it.label}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{it.desc}</Typography>
                      </Box>
                      <Switch checked={!!form[it.k]} onChange={(_, v) => set(it.k, v)} />
                    </Stack>
                  ))}
                </Stack>
              </SectionCard>

              <SectionCard
                icon={LanguageOutlined}
                title="SEO"
                description="Metadata hiển thị trên Google + mạng xã hội khi share trang thương hiệu."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>TITLE</FieldLabel>
                    <TextField
                      value={form.seo.title}
                      onChange={(e) => setSeo('title', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Jemma — Trang sức bạc trẻ trung | PNJ"
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
                      placeholder="Tóm tắt 1 câu cho Google SERP."
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
                      placeholder="https://cdn.pnj.com.vn/og/jemma.jpg"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:gallery-linear" width={14} />
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

              {/* Preview chip */}
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
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1.25 }}>
                  <Box
                    sx={{
                      width: 48, height: 48, borderRadius: 1,
                      display: 'grid', placeItems: 'center',
                      bgcolor: form.color_primary + '18',
                      color: form.color_primary,
                      fontWeight: 800, fontSize: 14, letterSpacing: 0.5,
                      backgroundImage: form.logo_url ? `url(${form.logo_url})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!form.logo_url && (form.monogram || form.name?.[0]?.toUpperCase() || '?')}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }} noWrap>
                      {form.name || 'Tên thương hiệu'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
                      {form.tagline || currentGroup?.label || '—'}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                      {form.is_featured && <Chip label="NỔI BẬT" size="small" color="warning" sx={{ height: 16, fontSize: 9.5 }} />}
                      {form.is_new_badge && <Chip label="NEW" size="small" color="error" sx={{ height: 16, fontSize: 9.5 }} />}
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

// Back-compat alias
export const BrandCreateDrawer = BrandFormDrawer;
