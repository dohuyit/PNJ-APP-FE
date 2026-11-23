// src/views/admin/collection/collection-create-drawer.jsx
// FormDrawer full-width 2 cột để tạo/sửa BST, thay cho page trống /collection/new.

'use client';

import dayjs from 'dayjs';
import { useMemo, useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EventOutlined from '@mui/icons-material/EventOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Chip, Grid, Stack, Avatar, Button, Switch, MenuItem,
  TextField, Typography, Autocomplete, InputAdornment, FormControlLabel,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useGetBrandList } from 'src/actions/admin/brand';
import { useGetProductList } from 'src/actions/admin/product';
import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';
import { SlugInput } from 'src/components/common/slug-input';
import { FormDrawer } from 'src/components/common/form-drawer';
import { UploadField } from 'src/views/admin/_shared/upload-field';


// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'draft',    label: 'Nháp',          icon: 'solar:document-text-linear' },
  { value: 'active',   label: 'Đang hiển thị', icon: 'solar:check-circle-linear' },
  { value: 'inactive', label: 'Tạm ẩn',        icon: 'solar:pause-circle-linear' },
];

const SCHEMA_TYPES = [
  { value: 'CollectionPage', label: 'CollectionPage' },
  { value: 'ItemList',       label: 'ItemList' },
  { value: 'Product',        label: 'Product' },
];

const EMPTY = {
  name: '',
  slug: '',
  brand_id: 'b1',
  short_description: '',
  description_html: '',
  tagline: '',
  product_ids: [],
  status: 'draft',
  launch_date: '',
  end_date: '',
  sort: 1,
  is_wedding: false,
  is_new_badge: true,
  is_featured_home: false,
  cover_file_id: null,
  seo: {
    title: '',
    description: '',
    og_image: '',
    schema_type: 'CollectionPage',
    noindex: false,
  },
};

// ----------------------------------------------------------------------

export function CollectionFormDrawer({ open, onClose, onSubmit, initial }) {
  const brandsList = useGetBrandList().searchResults;
  const productsList = useGetProductList().searchResults;
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

  const selectedBrand = useMemo(
    () => brandsList.find((b) => b.id === form.brand_id),
    [form.brand_id]
  );
  const selectedProducts = useMemo(
    () => productsList.filter((p) => form.product_ids?.includes(p.id)),
    [form.product_ids]
  );

  const canSubmit = form.name.trim() && form.slug.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit?.(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa bộ sưu tập — ${initial?.name ?? ''}` : 'Tạo bộ sưu tập mới'}
      subtitle={
        isEdit
          ? `${selectedProducts.length} sản phẩm · cập nhật ${fDate(initial?.updated_at ?? new Date())}`
          : 'BST cưới · BST theo chủ đề · BST theo mùa — hiển thị khối riêng trên trang chủ nếu bật nhãn NEW'
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo bộ sưu tập'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          {/* ============ LEFT COLUMN (md=8) ============ */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard
                icon={InfoOutlined}
                title="Thông tin chung"
                description="Tên, URL slug, thương hiệu sở hữu và mô tả ngắn hiển thị trên card BST."
              >
                <Stack spacing={2.25}>
                  <Box>
                    <FieldLabel required>TÊN BỘ SƯU TẬP</FieldLabel>
                    <TextField
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: BST Mùa Cưới 2027 · Golden Promise"
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>SLUG URL</FieldLabel>
                      <SlugInput
                        label=""
                        sourceName={form.name}
                        value={form.slug}
                        onChange={(v) => set('slug', v)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>THƯƠNG HIỆU</FieldLabel>
                      <TextField
                        select size="small" fullWidth
                        value={form.brand_id}
                        onChange={(e) => set('brand_id', e.target.value)}
                      >
                        {brandsList.map((b) => (
                          <MenuItem key={b.id} value={b.id}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar src={b.logo} variant="rounded" sx={{ width: 20, height: 20, bgcolor: 'grey.100' }} />
                              <span>{b.name}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Box>
                    <FieldLabel>MÔ TẢ NGẮN</FieldLabel>
                    <TextField
                      value={form.short_description}
                      onChange={(e) => set('short_description', e.target.value)}
                      fullWidth size="small" multiline rows={3}
                      placeholder="1–2 câu giới thiệu BST — xuất hiện ở card và trang danh mục."
                      helperText={`${form.short_description?.length ?? 0}/160`}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={ArticleOutlined}
                title="Nội dung chi tiết"
                description="Mô tả dài và câu slogan hiển thị trên landing BST."
              >
                <Stack spacing={2.25}>
                  <Box>
                    <FieldLabel>SLOGAN / TAGLINE</FieldLabel>
                    <TextField
                      value={form.tagline}
                      onChange={(e) => set('tagline', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Khởi đầu tình yêu — Khởi đầu PNJ"
                    />
                  </Box>
                  <Box>
                    <FieldLabel>MÔ TẢ CHI TIẾT (HTML)</FieldLabel>
                    <Editor
                      value={form.description_html}
                      onChange={(v) => set('description_html', v)}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={ShoppingBagOutlined}
                title={`Sản phẩm trong BST · ${form.product_ids?.length ?? 0}`}
                description="Multi-select sản phẩm. Thứ tự chip quyết định thứ tự hiển thị trên trang BST."
                action={
                  <Chip
                    icon={<Iconify icon="solar:add-circle-linear" width={14} />}
                    label="Thêm hàng loạt"
                    size="small"
                    clickable
                    variant="outlined"
                    color="primary"
                  />
                }
              >
                <Autocomplete
                  multiple
                  size="small"
                  options={productsList}
                  getOptionLabel={(opt) => opt.name}
                  value={selectedProducts}
                  onChange={(_, v) => set('product_ids', v.map((p) => p.id))}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  renderOption={(props, opt) => (
                    <Box component="li" {...props}>
                      <Avatar src={opt.media?.[0]} variant="rounded" sx={{ width: 32, height: 32, mr: 1.25, bgcolor: 'grey.100' }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{opt.name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {opt.display_code}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((opt, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={opt.id}
                        label={opt.name}
                        size="small"
                        avatar={<Avatar src={opt.media?.[0]} />}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Tìm theo tên hoặc mã" />
                  )}
                />
              </SectionCard>
            </Stack>
          </Grid>

          {/* ============ RIGHT COLUMN (md=4) ============ */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard
                icon={EventOutlined}
                title="Trạng thái & lịch"
                description="Trạng thái hiển thị + thời điểm ra mắt / kết thúc nếu là BST theo mùa."
              >
                <Stack spacing={2.25}>
                  <Box>
                    <FieldLabel required>TRẠNG THÁI</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.status}
                      onChange={(e) => set('status', e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify icon={s.icon} width={16} sx={{ color: 'text.secondary' }} />
                            <span>{s.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Grid container spacing={1.5}>
                    <Grid size={12}>
                      <FieldLabel>NGÀY RA MẮT</FieldLabel>
                      <DatePicker
                        value={form.launch_date ? dayjs(form.launch_date) : null}
                        onChange={(v) => set('launch_date', v ? dayjs(v).toISOString() : '')}
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: { fullWidth: true, size: 'small', placeholder: 'dd/mm/yyyy' },
                          actionBar: { actions: ['clear', 'today', 'accept'] },
                        }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <FieldLabel>NGÀY KẾT THÚC</FieldLabel>
                      <DatePicker
                        value={form.end_date ? dayjs(form.end_date) : null}
                        onChange={(v) => set('end_date', v ? dayjs(v).toISOString() : '')}
                        format="DD/MM/YYYY"
                        minDate={form.launch_date ? dayjs(form.launch_date) : undefined}
                        slotProps={{
                          textField: {
                            fullWidth: true, size: 'small', placeholder: 'dd/mm/yyyy',
                            helperText: 'Để trống nếu BST không có hạn kết thúc',
                          },
                          actionBar: { actions: ['clear', 'today', 'accept'] },
                        }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <FieldLabel>SORT ORDER</FieldLabel>
                      <TextField
                        type="number"
                        size="small" fullWidth
                        value={form.sort}
                        onChange={(e) => set('sort', Number(e.target.value) || 0)}
                        inputProps={{ min: 0 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="solar:sort-vertical-linear" width={14} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={FlagOutlined}
                title="Nhãn hiển thị"
                description="Bật để gắn label trên card + đưa BST vào khối tương ứng trên trang chủ."
              >
                <Stack spacing={0.5} divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
                  {[
                    { k: 'is_wedding',       label: 'BST Cưới',         desc: 'Gắn label "BST Cưới" & vào trang /trang-suc-cuoi.' },
                    { k: 'is_new_badge',     label: 'Nhãn NEW',         desc: 'Hiện huy hiệu đỏ "NEW" trên card BST.' },
                    { k: 'is_featured_home', label: 'Nổi bật trang chủ', desc: 'Đưa vào khối "BST tiêu biểu" trên homepage.' },
                  ].map((it) => (
                    <Stack
                      key={it.k}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{ py: 1 }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{it.label}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{it.desc}</Typography>
                      </Box>
                      <Switch
                        checked={!!form[it.k]}
                        onChange={(_, v) => set(it.k, v)}
                      />
                    </Stack>
                  ))}
                </Stack>
              </SectionCard>

              <SectionCard
                icon={ImageOutlined}
                title="Ảnh bìa BST"
                description="1 ảnh duy nhất · tỷ lệ 16:9 hoặc 2:1 · ≥ 1200px."
              >
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
              </SectionCard>

              <SectionCard
                icon={LanguageOutlined}
                title="SEO"
                description="Metadata hiển thị trên Google & mạng xã hội khi share BST."
              >
                <Stack spacing={2.25}>
                  <Box>
                    <FieldLabel>TITLE</FieldLabel>
                    <TextField
                      value={form.seo.title}
                      onChange={(e) => setSeo('title', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: BST Mùa Cưới 2027 · PNJ"
                      helperText={`${form.seo.title?.length ?? 0}/60`}
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
                    />
                  </Box>
                  <Box>
                    <FieldLabel>OG IMAGE URL</FieldLabel>
                    <TextField
                      value={form.seo.og_image}
                      onChange={(e) => setSeo('og_image', e.target.value)}
                      fullWidth size="small"
                      placeholder="https://cdn.pnj.com.vn/og/bst-mua-cuoi-2027.jpg"
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

              {/* Tóm tắt nhanh · giúp preview trạng thái lưu */}
              <Box
                sx={{
                  bgcolor: 'primary.lighter',
                  color: 'primary.darker',
                  borderRadius: 2,
                  p: 2,
                  border: 1,
                  borderColor: 'primary.light',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                  TÓM TẮT
                </Typography>
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <b>{form.name || 'Chưa đặt tên'}</b> · {selectedBrand?.name ?? '—'}
                  </Typography>
                  <Typography variant="caption">
                    {form.product_ids?.length ?? 0} sản phẩm · ra mắt {form.launch_date ? fDate(form.launch_date) : '—'}
                  </Typography>
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
export const CollectionCreateDrawer = CollectionFormDrawer;
