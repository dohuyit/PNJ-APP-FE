// src/views/admin/category/category-create-form.jsx — FormDrawer tạo/sửa danh mục
// Style khớp brand-form.jsx: full-width drawer · SectionCard · 2-col · dirty indicator · preview chip.

'use client';

import { useMemo, useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Chip, Grid, Stack, Button, Switch, MenuItem,
  TextField, Typography, InputAdornment, FormControlLabel,
} from '@mui/material';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { SlugInput } from 'src/components/common/slug-input';
import { FormDrawer } from 'src/components/common/form-drawer';
import { UploadField } from 'src/views/admin/_shared/upload-field';
import { IconPicker, MuiIcon } from 'src/components/common/icon-picker';

// ----------------------------------------------------------------------
// Taxonomy axis: khớp mega-menu PNJ (Chủng Loại / Chất Liệu / Xu Hướng / Dòng Hàng)

const AXES = [
  { value: 'jewelry_type', label: 'Chủng Loại',  icon: 'solar:tag-horizontal-linear', desc: 'Nhẫn, dây chuyền, bông tai, lắc, charm…' },
  { value: 'product_line', label: 'Dòng Hàng',   icon: 'solar:diamond-linear',         desc: 'Kim cương, ECZ, công nghệ Ý, ngọc trai…' },
  { value: 'material',     label: 'Chất Liệu',   icon: 'solar:palette-linear',          desc: 'Vàng, bạc, platinum.' },
  { value: 'trend',        label: 'Xu Hướng',    icon: 'solar:fire-linear',             desc: 'Phong thuỷ, tín ngưỡng, hàng đặt trước.' },
  { value: 'occasion',     label: 'Dịp',          icon: 'solar:heart-linear',            desc: 'Cưới, sinh nhật, kỷ niệm, lễ tết.' },
  { value: 'other',        label: 'Khác',          icon: 'solar:folder-linear',           desc: 'Danh mục tự do ngoài 4 trục chính.' },
];

const VERTICALS = [
  { value: 'jewelry', label: 'Trang sức', icon: 'solar:crown-linear' },
  { value: 'watch',   label: 'Đồng hồ',   icon: 'solar:clock-circle-linear' },
  { value: 'diamond', label: 'Kim cương', icon: 'solar:star-shine-linear' },
  { value: 'gift',    label: 'Quà tặng',  icon: 'solar:gift-linear' },
  { value: 'egift',   label: 'E-gift',    icon: 'solar:letter-linear' },
];

const AUDIENCES = [
  { value: 'female', label: 'Nữ',     icon: 'solar:women-linear',                   color: '#DB2777' },
  { value: 'male',   label: 'Nam',    icon: 'solar:men-linear',                      color: '#2563EB' },
  { value: 'kids',   label: 'Trẻ em', icon: 'solar:emoji-funny-circle-linear',       color: '#F59E0B' },
  { value: 'unisex', label: 'Unisex', icon: 'solar:users-group-rounded-linear',      color: '#7C3AED' },
];

const STATUSES = [
  { value: 'active',   label: 'Đang hiển thị', icon: 'solar:check-circle-linear' },
  { value: 'draft',    label: 'Nháp',          icon: 'solar:document-text-linear' },
  { value: 'inactive', label: 'Tạm ẩn',        icon: 'solar:pause-circle-linear' },
];

const SCHEMA_TYPES = [
  { value: 'CategoryPage', label: 'CategoryPage' },
  { value: 'ItemList',     label: 'ItemList' },
  { value: 'Thing',        label: 'Thing' },
];

const EMPTY = {
  name: '',
  slug: '',
  axis: 'jewelry_type',
  vertical: 'jewelry',
  parent_id: '',
  audiences: ['female'],
  short_description: '',
  tagline: '',
  icon_url: '',
  cover_file_id: null,
  cover_url: '',
  banner_file_id: null,
  banner_url: '',
  color_accent: '#003468',
  sort: 10,
  status: 'active',
  is_in_mega_menu: true,
  is_featured_home: false,
  is_new_badge: false,
  seo: {
    title: '',
    description: '',
    og_image: '',
    schema_type: 'CategoryPage',
    noindex: false,
  },
};

// ----------------------------------------------------------------------

export function CategoryFormDrawer({ open, onClose, onSubmit, initial, parent, flatCategories = [] }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? { ...EMPTY, ...initial, seo: { ...EMPTY.seo, ...(initial.seo ?? {}) }, audiences: initial.audiences ?? ['female'] }
          : { ...EMPTY, parent_id: parent?.id ?? '' }
      );
      setDirty(false);
    }
  }, [open, initial, parent]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const setSeo = (k, v) => { setForm((f) => ({ ...f, seo: { ...f.seo, [k]: v } })); setDirty(true); };
  const toggleAudience = (v) => {
    setForm((f) => ({
      ...f,
      audiences: f.audiences.includes(v) ? f.audiences.filter((x) => x !== v) : [...f.audiences, v],
    }));
    setDirty(true);
  };

  const currentAxis = AXES.find((x) => x.value === form.axis);
  const currentVertical = VERTICALS.find((v) => v.value === form.vertical);

  const parentOptions = useMemo(
    () => flatCategories.filter((c) => !isEdit || c.id !== initial?.id),
    [flatCategories, isEdit, initial?.id]
  );

  const canSubmit = form.name.trim() && form.slug.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  const title = isEdit
    ? `Sửa danh mục — ${initial?.name ?? ''}`
    : parent
      ? `Thêm danh mục con của "${parent.name}"`
      : 'Thêm danh mục gốc';

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={title}
      subtitle={
        isEdit
          ? `/${initial?.slug ?? ''} · ${currentAxis?.label ?? '—'} · ${currentVertical?.label ?? '—'}`
          : `${currentAxis?.label ?? '—'} · ${currentVertical?.label ?? '—'} · dùng cho mega-menu, filter và landing category.`
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
            {isEdit ? 'Lưu thay đổi' : 'Thêm danh mục'}
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
                title="Thông tin chung"
                description="Tên, slug, mô tả và tagline — hiển thị trên trang landing của danh mục."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>TÊN DANH MỤC</FieldLabel>
                    <TextField
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: Nhẫn kim cương / Vàng 24K / Phong thuỷ"
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>SLUG URL</FieldLabel>
                      <SlugInput label="" sourceName={form.name} value={form.slug} onChange={(v) => set('slug', v)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel>MÀU NHẤN</FieldLabel>
                      <TextField
                        value={form.color_accent}
                        onChange={(e) => set('color_accent', e.target.value)}
                        fullWidth size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ width: 16, height: 16, borderRadius: 0.5, bgcolor: form.color_accent, border: 1, borderColor: 'divider' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <FieldLabel>TAGLINE / SLOGAN</FieldLabel>
                    <TextField
                      value={form.tagline}
                      onChange={(e) => set('tagline', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Ánh sáng của một đời"
                      helperText={`${form.tagline?.length ?? 0}/80`}
                      inputProps={{ maxLength: 80 }}
                    />
                  </Box>

                  <Box>
                    <FieldLabel>MÔ TẢ NGẮN</FieldLabel>
                    <TextField
                      value={form.short_description}
                      onChange={(e) => set('short_description', e.target.value)}
                      fullWidth size="small" multiline rows={3}
                      placeholder="1–2 câu giới thiệu danh mục — xuất hiện ở top trang landing và meta."
                      helperText={`${form.short_description?.length ?? 0}/180`}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={AccountTreeOutlined}
                title="Phân loại · Trục taxonomy"
                description="Chọn trục taxonomy của mega-menu PNJ + vertical + danh mục cha nếu có."
              >
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>TRỤC TAXONOMY</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.axis}
                        onChange={(e) => set('axis', e.target.value)}
                      >
                        {AXES.map((a) => (
                          <MenuItem key={a.value} value={a.value}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Iconify icon={a.icon} width={16} sx={{ color: 'text.secondary' }} />
                              <span>{a.label}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                      {currentAxis && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.disabled' }}>
                          {currentAxis.desc}
                        </Typography>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>VERTICAL</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.vertical}
                        onChange={(e) => set('vertical', e.target.value)}
                      >
                        {VERTICALS.map((v) => (
                          <MenuItem key={v.value} value={v.value}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Iconify icon={v.icon} width={16} sx={{ color: 'text.secondary' }} />
                              <span>{v.label}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Box>
                    <FieldLabel>DANH MỤC CHA</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.parent_id}
                      onChange={(e) => set('parent_id', e.target.value)}
                      helperText="Để trống = danh mục gốc"
                    >
                      <MenuItem value="">— Không có —</MenuItem>
                      {parentOptions.map((c) => (
                        <MenuItem key={c.id} value={c.id} sx={{ pl: c._depth ? (c._depth * 2 + 2) : 2 }}>
                          {c._depth > 0 ? '└ ' : ''}{c.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Box>
                    <FieldLabel>ĐỐI TƯỢNG (multi)</FieldLabel>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.75 }}>
                      {AUDIENCES.map((a) => {
                        const on = form.audiences.includes(a.value);
                        return (
                          <Chip
                            key={a.value}
                            icon={<Iconify icon={a.icon} width={14} sx={{ ml: 0.5 }} />}
                            label={a.label}
                            size="small"
                            clickable
                            onClick={() => toggleAudience(a.value)}
                            variant={on ? 'filled' : 'outlined'}
                            sx={{
                              height: 28, fontWeight: 600, fontSize: 12,
                              bgcolor: on ? a.color + '22' : undefined,
                              borderColor: on ? a.color : undefined,
                              color: on ? a.color : undefined,
                              '& .MuiChip-icon': { color: on ? a.color : 'text.secondary' },
                            }}
                          />
                        );
                      })}
                    </Stack>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.75, color: 'text.disabled' }}>
                      Danh mục hiển thị ở tab audience nào trên mega-menu.
                    </Typography>
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={ImageOutlined}
                title="Hình ảnh"
                description="Icon mega-menu · ảnh đại diện card · banner trang landing."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <FieldLabel>ICON</FieldLabel>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          display: 'grid', placeItems: 'center',
                          width: 48, height: 40,
                          borderRadius: 1, border: 1, borderColor: 'divider',
                          bgcolor: 'grey.50', flexShrink: 0,
                        }}
                      >
                        {form.icon_url ? (
                          <MuiIcon name={form.icon_url} width={22} />
                        ) : (
                          <Iconify icon={currentAxis?.icon ?? 'solar:folder-linear'} width={20} sx={{ color: 'text.disabled' }} />
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <IconPicker
                          value={form.icon_url}
                          onChange={(v) => set('icon_url', v)}
                          placeholder="Chọn icon từ thư viện MUI..."
                        />
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FieldLabel>ẢNH ĐẠI DIỆN (1:1)</FieldLabel>
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
                    <FieldLabel>BANNER LANDING (16:9)</FieldLabel>
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

          {/* ============ RIGHT ============ */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard
                icon={CategoryOutlined}
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
                      helperText="Nhỏ hiện trước — dùng khi sort tay trong mega menu"
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={FlagOutlined}
                title="Nhãn & hiển thị"
                description="Bật nhãn + vị trí xuất hiện."
              >
                <Stack spacing={0} divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
                  {[
                    { k: 'is_in_mega_menu',  label: 'Hiện ở mega-menu',  desc: 'Xuất hiện trong cột trục đã chọn.' },
                    { k: 'is_featured_home', label: 'Nổi bật trang chủ', desc: 'Đưa vào khối "Danh mục nổi bật" ở homepage.' },
                    { k: 'is_new_badge',     label: 'Nhãn NEW',          desc: 'Huy hiệu đỏ "NEW" trên card.' },
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
                description="Metadata cho trang landing /danh-muc/<slug>."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>TITLE</FieldLabel>
                    <TextField
                      value={form.seo.title}
                      onChange={(e) => setSeo('title', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Nhẫn Kim Cương PNJ | Chuẩn GIA"
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
                      width: 38, height: 38, borderRadius: 1,
                      display: 'grid', placeItems: 'center',
                      bgcolor: form.color_accent + '18',
                      color: form.color_accent,
                      border: 1, borderColor: 'divider',
                    }}
                  >
                    {form.cover_url ? (
                      <Box component="img" src={form.cover_url} sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }} />
                    ) : (
                      <Iconify icon={form.icon_url || currentAxis?.icon || 'solar:folder-linear'} width={18} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }} noWrap>
                      {form.name || 'Tên danh mục'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
                      {currentAxis?.label} · {currentVertical?.label}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
                      {form.audiences.map((a) => {
                        const au = AUDIENCES.find((x) => x.value === a);
                        return (
                          <Chip
                            key={a}
                            label={au?.label}
                            size="small"
                            sx={{
                              height: 16, fontSize: 9.5, fontWeight: 600,
                              bgcolor: (au?.color ?? '#999') + '22',
                              color: au?.color,
                            }}
                          />
                        );
                      })}
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
