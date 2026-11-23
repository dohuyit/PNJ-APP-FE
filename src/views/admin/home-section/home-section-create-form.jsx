// src/views/admin/home-section/home-section-create-form.jsx — FormDrawer tạo/sửa section trang chủ
// Style khớp brand-form: full-width · SectionCard · 2-col · dirty indicator · preview chip.

'use client';

import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CodeOutlined from '@mui/icons-material/CodeOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import DevicesOutlined from '@mui/icons-material/DevicesOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Chip, FormControlLabel, Grid, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { useGetCategoryList } from 'src/actions/admin/category';
import { useGetCollectionList } from 'src/actions/admin/collection';
import { useGetProductLineList } from 'src/actions/admin/product-line';
import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';

// ----------------------------------------------------------------------

const TYPES = [
  { value: 'hero_slider',         label: 'Hero slider',         icon: 'solar:gallery-wide-linear',   sourceLabel: '—',                        desc: 'Slider ảnh full-width trên cùng trang chủ.' },
  { value: 'usp',                 label: 'USP bar',             icon: 'solar:verified-check-linear', sourceLabel: '—',                        desc: 'Dải 3-4 chip thuộc tính (Giao 3H · 24/7 · Thu đổi 48H).' },
  { value: 'category_icons',      label: 'Icon danh mục',       icon: 'solar:widget-linear',         sourceLabel: 'Category IDs',             desc: 'Lưới icon + label điều hướng danh mục.' },
  { value: 'brand_carousel',      label: 'Thương hiệu',         icon: 'solar:tag-horizontal-linear', sourceLabel: '—',                        desc: 'Carousel logo brand với link landing.' },
  { value: 'product_tabs',        label: 'Tabs sản phẩm',       icon: 'solar:bag-4-linear',          sourceLabel: 'Category / Collection',    desc: 'Tabs chia theo category hoặc BST, hiện lưới SP.' },
  { value: 'collection_products', label: 'Sản phẩm từ BST',     icon: 'solar:gallery-linear',        sourceLabel: 'Collection',               desc: 'Lưới SP lấy từ 1 BST cụ thể.' },
  { value: 'product_line_tabs',   label: 'Tabs dòng hàng',      icon: 'solar:layers-linear',         sourceLabel: 'Product-line',             desc: 'Tabs chia theo dòng hàng (kim cương / vàng…).' },
  { value: 'post_list',           label: 'Blog mới nhất',       icon: 'solar:pen-new-square-linear', sourceLabel: '—',                        desc: 'Lưới bài blog mới nhất.' },
  { value: 'html',                label: 'HTML tuỳ biến',       icon: 'solar:code-linear',           sourceLabel: '—',                        desc: 'Snippet HTML tự do cho campaign đặc biệt.' },
];

const PLATFORMS = [
  { value: 'both', label: 'Web + App', icon: 'solar:devices-linear' },
  { value: 'web',  label: 'Chỉ Web',   icon: 'solar:monitor-linear' },
  { value: 'app',  label: 'Chỉ App',   icon: 'solar:iphone-linear' },
];

const STATUSES = [
  { value: 'active',   label: 'Đang hiển thị', icon: 'solar:check-circle-linear' },
  { value: 'draft',    label: 'Nháp',          icon: 'solar:document-text-linear' },
  { value: 'inactive', label: 'Tạm ẩn',        icon: 'solar:pause-circle-linear' },
];

const EMPTY = {
  title: '',
  subtitle: '',
  type: 'hero_slider',
  source_id: '',
  limit: 8,
  platform: 'both',
  html: '',
  sort: 10,
  status: 'active',
  cta_label: '',
  cta_url: '',
  bg_color: '',
  is_lazy: true,
};

// ----------------------------------------------------------------------

export function HomeSectionFormDrawer({ open, onClose, onSubmit, initial }) {
  const categoriesList = useGetCategoryList().searchResults;
  const collectionsList = useGetCollectionList().searchResults;
  const productLinesList = useGetProductLineList().searchResults;
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  const typeMeta = TYPES.find((t) => t.value === form.type);
  const needsSource = ['category_icons', 'product_tabs', 'collection_products', 'product_line_tabs'].includes(form.type);
  const needsHtml = form.type === 'html';
  const needsLimit = !['usp', 'html'].includes(form.type);

  const canSubmit = form.title.trim() && (!needsHtml || form.html.trim());

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  const sourceOptions =
    form.type === 'collection_products' ? collectionsList :
    form.type === 'product_line_tabs'   ? productLinesList :
    categoriesList;

  const sourceCurrent = sourceOptions.find((o) => (o._id ?? o.id) === form.source_id);

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa section · ${initial?.title ?? ''}` : 'Thêm section trang chủ'}
      subtitle={
        isEdit
          ? `${typeMeta?.label ?? '—'} · ${form.platform === 'both' ? 'Web + App' : form.platform === 'web' ? 'Web' : 'App'}`
          : 'Chọn loại section → chọn nguồn dữ liệu → sắp xếp. Bật/tắt theo nền tảng Web/App riêng.'
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
            {dirty ? 'Có thay đổi chưa lưu' : isEdit ? 'Chưa có thay đổi' : 'Điền thông tin rồi bấm Thêm'}
          </Typography>
          <Button onClick={onClose} color="inherit" startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}>Huỷ</Button>
          <Button
            variant="contained"
            disabled={!canSubmit || submitting || (isEdit && !dirty)}
            startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
            onClick={handleSubmit}
          >
            {isEdit ? 'Lưu thay đổi' : 'Thêm section'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          {/* ============ LEFT ============ */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard
                icon={InfoOutlined}
                title="Thông tin section"
                description="Tiêu đề hiển thị trên trang chủ + loại section."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>TIÊU ĐỀ SECTION</FieldLabel>
                    <TextField
                      value={form.title}
                      onChange={(e) => set('title', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: Sản phẩm bán chạy / Bộ sưu tập mới ra mắt"
                    />
                  </Box>
                  <Box>
                    <FieldLabel>PHỤ ĐỀ (tuỳ chọn)</FieldLabel>
                    <TextField
                      value={form.subtitle}
                      onChange={(e) => set('subtitle', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Các thiết kế hot nhất tuần này"
                    />
                  </Box>
                  <Box>
                    <FieldLabel required>LOẠI SECTION</FieldLabel>
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
                    {typeMeta && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.disabled' }}>
                        {typeMeta.desc}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </SectionCard>

              {(needsSource || needsLimit) && (
                <SectionCard
                  icon={LayersOutlined}
                  title="Nguồn dữ liệu"
                  description={`Dòng nội dung hiển thị · ${typeMeta?.sourceLabel ?? '—'}`}
                >
                  <Stack spacing={2}>
                    {needsSource && (
                      <Box>
                        <FieldLabel required>CHỌN NGUỒN</FieldLabel>
                        <TextField
                          select fullWidth size="small"
                          value={form.source_id}
                          onChange={(e) => set('source_id', e.target.value)}
                        >
                          <MenuItem value="">— Chọn —</MenuItem>
                          {sourceOptions.map((o) => (
                            <MenuItem key={o._id ?? o.id} value={o._id ?? o.id}>{o.name}</MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    )}
                    {needsLimit && (
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FieldLabel>GIỚI HẠN ITEM</FieldLabel>
                          <TextField
                            type="number" fullWidth size="small"
                            value={form.limit}
                            onChange={(e) => set('limit', Number(e.target.value) || 0)}
                            inputProps={{ min: 1, max: 100 }}
                            helperText="Số SP/bài viết hiển thị"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FieldLabel>MÀU NỀN (hex)</FieldLabel>
                          <TextField
                            value={form.bg_color}
                            onChange={(e) => set('bg_color', e.target.value)}
                            fullWidth size="small"
                            placeholder="#F5F6F8 — để trống = trắng"
                            inputProps={{ style: { fontFamily: 'monospace' } }}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Stack>
                </SectionCard>
              )}

              {needsHtml && (
                <SectionCard
                  icon={CodeOutlined}
                  title="HTML tuỳ biến"
                  description="Snippet HTML tự do (cho campaign đặc biệt). Chỉ admin với quyền HTML được phép sửa."
                >
                  <TextField
                    value={form.html}
                    onChange={(e) => set('html', e.target.value)}
                    fullWidth size="small" multiline rows={10}
                    placeholder="<section class=&quot;promo&quot;>…</section>"
                    InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
                  />
                </SectionCard>
              )}

              <SectionCard
                icon={StorefrontOutlined}
                title="CTA · liên kết"
                description="Nút gọi hành động dưới section (xem tất cả, khám phá…)."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <FieldLabel>CTA LABEL</FieldLabel>
                    <TextField
                      value={form.cta_label}
                      onChange={(e) => set('cta_label', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Xem tất cả"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <FieldLabel>CTA URL</FieldLabel>
                    <TextField
                      value={form.cta_url}
                      onChange={(e) => set('cta_url', e.target.value)}
                      fullWidth size="small"
                      placeholder="/khuyen-mai/sale-1111"
                      inputProps={{ style: { fontFamily: 'monospace' } }}
                    />
                  </Grid>
                </Grid>
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
                      helperText="Nhỏ hiện trước (hero = 1, bán chạy = 10, blog = 90…)."
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={DevicesOutlined}
                title="Nền tảng"
                description="Section có thể hiện ở Web + App hoặc chỉ một phía."
              >
                <TextField
                  select fullWidth size="small"
                  value={form.platform}
                  onChange={(e) => set('platform', e.target.value)}
                >
                  {PLATFORMS.map((p) => (
                    <MenuItem key={p.value} value={p.value}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon={p.icon} width={16} sx={{ color: 'text.secondary' }} />
                        <span>{p.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </SectionCard>

              <SectionCard
                icon={ToggleOnOutlined}
                title="Hiệu năng"
              >
                <FormControlLabel
                  control={<Switch checked={!!form.is_lazy} onChange={(_, v) => set('is_lazy', v)} />}
                  label={<Typography variant="body2">Lazy load (hiện khi scroll tới)</Typography>}
                />
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
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.25 }}>
                  <Box
                    sx={{
                      width: 38, height: 38, borderRadius: 1,
                      display: 'grid', placeItems: 'center',
                      bgcolor: 'grey.100',
                      color: 'text.secondary',
                      border: 1, borderColor: 'divider',
                    }}
                  >
                    <Iconify icon={typeMeta?.icon ?? 'solar:widget-linear'} width={18} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }} noWrap>
                      {form.title || 'Tiêu đề section'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
                      {typeMeta?.label} {sourceCurrent ? `· ${sourceCurrent.name}` : ''}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
                      <Chip
                        label={form.platform === 'both' ? 'WEB+APP' : form.platform === 'web' ? 'WEB' : 'APP'}
                        size="small"
                        sx={{ height: 16, fontSize: 9.5, fontWeight: 700 }}
                      />
                      <Chip label={`#${form.sort}`} size="small" variant="outlined" sx={{ height: 16, fontSize: 9.5 }} />
                      {form.is_lazy && <Chip label="LAZY" size="small" color="info" sx={{ height: 16, fontSize: 9.5 }} />}
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
