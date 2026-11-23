// src/views/admin/product-line/product-line-create-form.jsx — FormDrawer tạo/sửa dòng hàng
// Shape phản ánh mega-menu thực của PNJ: Chủng Loại · Dòng Hàng · Chất Liệu · Xu Hướng · Co-brand.

'use client';

import { useMemo, useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import StarsOutlined from '@mui/icons-material/StarsOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import DiamondOutlined from '@mui/icons-material/DiamondOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import HandshakeOutlined from '@mui/icons-material/HandshakeOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Chip, Grid, Stack, Avatar, Button, Switch, MenuItem,
  TextField, Typography, IconButton, Autocomplete, ToggleButton, InputAdornment, FormControlLabel, ToggleButtonGroup,
} from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { useGetBrandList } from 'src/actions/admin/brand';
import { useGetAttributeSetList } from 'src/actions/admin/attribute';
import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';
import { SlugInput } from 'src/components/common/slug-input';
import { MoneyInput } from 'src/components/common/money-input';
import { FormDrawer } from 'src/components/common/form-drawer';
import { UploadField } from 'src/views/admin/_shared/upload-field';
import { IconPicker, MuiIcon } from 'src/components/common/icon-picker';

// ----------------------------------------------------------------------
// Taxonomy thật của PNJ (lấy từ mega-menu pnj.com.vn)

// "Dòng Hàng" — nhóm theo công nghệ chế tác / chất đá
const LINE_KINDS = [
  { value: 'diamond',          label: 'Trang sức kim cương',   icon: 'solar:diamond-linear' },
  { value: 'ecz',              label: 'Trang sức ECZ',         icon: 'solar:star-shine-linear' },
  { value: 'italian_tech',     label: 'Trang sức công nghệ Ý', icon: 'solar:crown-star-linear' },
  { value: 'shell',            label: 'Trang sức vỏ',          icon: 'solar:stars-minimalistic-linear' },
  { value: 'no_stone',         label: 'Trang sức không gắn đá', icon: 'solar:tag-linear' },
  { value: 'colored_stone',    label: 'Trang sức đá màu',      icon: 'solar:color-filter-linear' },
  { value: 'cz',               label: 'Trang sức CZ',          icon: 'solar:star-linear' },
  { value: 'pearl',            label: 'Trang sức ngọc trai',   icon: 'solar:moon-stars-linear' },
  { value: 'loose_diamond',    label: 'Kim cương Viên',        icon: 'solar:diamond-bold' },
  { value: 'collectible_gift', label: 'Quà tặng sưu tầm',      icon: 'solar:gift-linear' },
];

// "Chủng Loại" — loại trang sức vật lý (lấy từ cột "Chủng Loại" mega-menu)
const JEWELRY_TYPES = [
  { value: 'ring',         label: 'Nhẫn' },
  { value: 'necklace',     label: 'Dây chuyền' },
  { value: 'pendant',      label: 'Mặt dây chuyền' },
  { value: 'earring',      label: 'Bông tai' },
  { value: 'bangle',       label: 'Lắc' },
  { value: 'charm',        label: 'Charm' },
  { value: 'bracelet',     label: 'Vòng tay' },
  { value: 'neck_chain',   label: 'Dây cổ' },
  { value: 'rigid_bangle', label: 'Kiềng' },
  { value: 'gold_coin',    label: 'Vàng kỷ niệm' },
];

// "Chất Liệu"
const MATERIALS = [
  { value: 'gold',     label: 'Vàng',     color: '#E0A947' },
  { value: 'silver',   label: 'Bạc',      color: '#B7BFC7' },
  { value: 'platinum', label: 'Platinum', color: '#9CAABE' },
];

// "Xu Hướng"
const TRENDS = [
  { value: '',             label: 'Không gắn',        icon: 'solar:close-circle-linear' },
  { value: 'feng_shui',    label: 'Phong Thuỷ',       icon: 'solar:moon-stars-linear' },
  { value: 'religious',    label: 'Tín ngưỡng',       icon: 'solar:crown-linear' },
  { value: 'pre_order',    label: 'Hàng đặt trước',   icon: 'solar:box-minimalistic-linear' },
];

// "Đối tượng" (Nữ · Nam · Trẻ em)
const AUDIENCES = [
  { value: 'women',    label: 'Nữ',       icon: 'solar:women-linear' },
  { value: 'men',      label: 'Nam',      icon: 'solar:men-linear' },
  { value: 'children', label: 'Trẻ em',   icon: 'solar:baby-linear' },
];

const STATUSES = [
  { value: 'active',   label: 'Đang hiển thị', icon: 'solar:check-circle-linear' },
  { value: 'draft',    label: 'Nháp',          icon: 'solar:document-text-linear' },
  { value: 'inactive', label: 'Tạm ẩn',        icon: 'solar:pause-circle-linear' },
];

const SCHEMA_TYPES = [
  { value: 'CategoryPage', label: 'CategoryPage' },
  { value: 'ItemList',     label: 'ItemList' },
  { value: 'Collection',   label: 'Collection' },
];

const EMPTY = {
  name: '',
  slug: '',
  tagline: '',
  short_description: '',
  description_html: '',
  line_kind: 'diamond',
  jewelry_types: [],
  materials: [],
  audiences: [],
  trend_tag: '',
  brand_id: null,
  attribute_set_id: null,
  // Co-brand (dòng hàng hợp tác quốc tế)
  is_co_brand: false,
  co_brand_partner: '',
  co_brand_logo_url: '',
  // Media
  icon_url: '',
  cover_image_id: null,
  cover_image_url: '',
  banner_image_id: null,
  banner_image_url: '',
  hero_video_url: '',
  hero_cta_label: 'Khám phá ngay',
  hero_cta_url: '',
  // Giá
  price_min: 0,
  price_max: 0,
  // PNJ-specific (mới — khảo sát từ pnj.com.vn)
  heritage_story_html: '',       // Câu chuyện xuất xứ / di sản dòng hàng (pearls: Akoya/Tahiti…)
  sub_types: [],                  // [{ id, name, origin, description, image_url, sort }] · Akoya, Tahiti, FreshWater…
  hashtags: [],                   // Chip filter phía trên lưới SP: #Vàng, #Dây_cổ, #Khuyến_mãi…
  related_line_ids: [],           // "Cùng khám phá" cross-sell các dòng khác
  trust_badges: [],               // Chip badge: GIA · BH trọn đời · Thu đổi 48h
  usp_chips: [],                  // USP ngắn: "Mua càng nhiều — giá càng yêu"…
  hotline_number: '1800 54 54 57', // Hotline tư vấn (override mặc định nếu dùng riêng)
  consultant_calendar_url: '',   // "Đặt lịch tư vấn"
  care_guide_url: '',             // Educational "Cách bảo quản vàng/ngọc trai…"
  promo_override_text: '',        // "Ưu đãi đến 45% — Mua càng nhiều — giá càng yêu"
  // Flags
  status: 'active',
  sort: 10,
  is_featured_home: false,
  is_in_mega_menu: true,
  is_new_badge: false,
  show_gold_price_widget: false,  // Widget bảng giá vàng real-time (chỉ dùng vàng)
  seo: {
    title: '',
    description: '',
    og_image: '',
    schema_type: 'CategoryPage',
    noindex: false,
  },
};

const newSubTypeId = () => `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

// ----------------------------------------------------------------------

export function ProductLineFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { searchResults: brandList = [] } = useGetBrandList();
  const { searchResults: attrSetList = [] } = useGetAttributeSetList();

  const brandOption = useMemo(
    () => brandList.find((b) => (b._id ?? b.id) === form.brand_id) ?? null,
    [brandList, form.brand_id]
  );
  const attrSetOption = useMemo(
    () => attrSetList.find((s) => (s._id ?? s.id) === form.attribute_set_id) ?? null,
    [attrSetList, form.attribute_set_id]
  );

  useEffect(() => {
    if (open) {
      setForm(initial
        ? { ...EMPTY, ...initial, seo: { ...EMPTY.seo, ...(initial.seo ?? {}) } }
        : EMPTY);
      setDirty(false);
    }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const setSeo = (k, v) => { setForm((f) => ({ ...f, seo: { ...f.seo, [k]: v } })); setDirty(true); };
  const toggleIn = (k, v) => {
    setForm((f) => {
      const cur = f[k] ?? [];
      const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
      return { ...f, [k]: next };
    });
    setDirty(true);
  };

  const canSubmit = form.name.trim() && form.slug.trim();
  const currentLineKind = LINE_KINDS.find((k) => k.value === form.line_kind);

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa dòng hàng — ${initial?.name ?? ''}` : 'Tạo dòng hàng mới'}
      subtitle={
        isEdit
          ? `${currentLineKind?.label ?? '—'} · ${form.materials.length} chất liệu · ${form.jewelry_types.length} chủng loại`
          : 'Nhóm theo công nghệ chế tác / chất đá — hiển thị thành cột "Dòng Hàng" trong mega-menu.'
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo dòng hàng'}
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
                description="Tên hiển thị, slug URL và nhóm dòng hàng gốc theo mega-menu PNJ."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>TÊN DÒNG HÀNG</FieldLabel>
                    <TextField
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: Trang sức kim cương / Trang sức ngọc trai Akoya"
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>SLUG URL</FieldLabel>
                      <SlugInput label="" sourceName={form.name} value={form.slug} onChange={(v) => set('slug', v)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>DÒNG HÀNG GỐC (PNJ)</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.line_kind}
                        onChange={(e) => set('line_kind', e.target.value)}
                      >
                        {LINE_KINDS.map((k) => (
                          <MenuItem key={k.value} value={k.value}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Iconify icon={k.icon} width={16} sx={{ color: 'text.secondary' }} />
                              <span>{k.label}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Box>
                    <FieldLabel>SLOGAN / TAGLINE</FieldLabel>
                    <TextField
                      value={form.tagline}
                      onChange={(e) => set('tagline', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Tinh hoa thủ công · với chất lượng vượt trội"
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
                      placeholder="1–2 câu giới thiệu dòng hàng · xuất hiện ở trang landing /dong-hang/<slug>."
                      helperText={`${form.short_description?.length ?? 0}/180`}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={CategoryOutlined}
                title="Chủng loại · Chất liệu · Đối tượng"
                description="Dòng hàng này có mặt ở những loại trang sức, chất liệu và tệp khách nào trong mega-menu."
              >
                <Stack spacing={2.5}>
                  <Box>
                    <FieldLabel>CHỦNG LOẠI (multi)</FieldLabel>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.75 }}>
                      {JEWELRY_TYPES.map((t) => {
                        const on = form.jewelry_types.includes(t.value);
                        return (
                          <Chip
                            key={t.value}
                            label={t.label}
                            size="small"
                            clickable
                            onClick={() => toggleIn('jewelry_types', t.value)}
                            variant={on ? 'filled' : 'outlined'}
                            color={on ? 'primary' : 'default'}
                            sx={{ height: 28, fontWeight: 600, fontSize: 12 }}
                          />
                        );
                      })}
                    </Stack>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.75, color: 'text.disabled' }}>
                      Chọn các loại sản phẩm hiện có trong dòng này. Hiển thị filter &ldquo;Chủng loại&rdquo; ở trang landing.
                    </Typography>
                  </Box>

                  <Box>
                    <FieldLabel>CHẤT LIỆU (multi)</FieldLabel>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.75 }}>
                      {MATERIALS.map((m) => {
                        const on = form.materials.includes(m.value);
                        return (
                          <Chip
                            key={m.value}
                            label={m.label}
                            size="small"
                            clickable
                            onClick={() => toggleIn('materials', m.value)}
                            variant={on ? 'filled' : 'outlined'}
                            sx={{
                              height: 28, fontWeight: 600, fontSize: 12,
                              bgcolor: on ? m.color + '22' : undefined,
                              borderColor: on ? m.color : undefined,
                              color: on ? m.color : undefined,
                              '&:hover': { bgcolor: on ? m.color + '33' : undefined },
                            }}
                            avatar={
                              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: m.color, ml: '4px !important' }} />
                            }
                          />
                        );
                      })}
                    </Stack>
                  </Box>

                  <Box>
                    <FieldLabel>ĐỐI TƯỢNG (multi)</FieldLabel>
                    <ToggleButtonGroup
                      value={form.audiences}
                      onChange={(_, v) => set('audiences', v)}
                      size="small"
                      sx={{ flexWrap: 'wrap', gap: 0.5 }}
                    >
                      {AUDIENCES.map((a) => (
                        <ToggleButton
                          key={a.value}
                          value={a.value}
                          sx={{ border: '1px solid', borderColor: 'divider !important', borderRadius: '6px !important', px: 1.5, py: 0.5, textTransform: 'none', fontSize: 12, fontWeight: 600 }}
                        >
                          <Iconify icon={a.icon} width={14} sx={{ mr: 0.75 }} />
                          {a.label}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>

                  <Box>
                    <FieldLabel>XU HƯỚNG</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.trend_tag}
                      onChange={(e) => set('trend_tag', e.target.value)}
                    >
                      {TRENDS.map((t) => (
                        <MenuItem key={t.value || 'none'} value={t.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify icon={t.icon} width={16} sx={{ color: 'text.secondary' }} />
                            <span>{t.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.disabled' }}>
                      Gắn thẻ xu hướng để hiển thị trong cột &ldquo;Xu Hướng&rdquo; của mega-menu nếu có.
                    </Typography>
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={HandshakeOutlined}
                title="Dòng hàng hợp tác quốc tế"
                description="Bật nếu là co-brand (Disney | PNJ, PNJ × Hello Kitty, Doraemon | PNJ…)."
              >
                <Stack spacing={2}>
                  <FormControlLabel
                    control={<Switch checked={!!form.is_co_brand} onChange={(_, v) => set('is_co_brand', v)} />}
                    label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Là dòng hợp tác quốc tế</Typography>}
                  />
                  {form.is_co_brand && (
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FieldLabel>ĐỐI TÁC</FieldLabel>
                        <TextField
                          value={form.co_brand_partner}
                          onChange={(e) => set('co_brand_partner', e.target.value)}
                          fullWidth size="small"
                          placeholder="Vd: Disney / Hello Kitty / Doraemon / Kuromi"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FieldLabel>LOGO CO-BRAND URL</FieldLabel>
                        <TextField
                          value={form.co_brand_logo_url}
                          onChange={(e) => set('co_brand_logo_url', e.target.value)}
                          fullWidth size="small"
                          placeholder="https://cdn.pnj.com.vn/co-brand/disney-pnj.png"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Iconify icon="solar:gallery-linear" width={14} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Stack>
              </SectionCard>

              <SectionCard
                icon={ArticleOutlined}
                title="Nội dung chi tiết"
                description="Mô tả dài hiển thị trên trang landing của dòng hàng."
              >
                <Editor
                  value={form.description_html}
                  onChange={(v) => set('description_html', v)}
                />
              </SectionCard>

              <SectionCard
                icon={ImageOutlined}
                title="Hình ảnh"
                description="Icon mega-menu · ảnh đại diện card · banner trang landing."
              >
                <Grid container spacing={2}>
                  {/* Row 1: ảnh đại diện (card thumbnail) + Banner (landing hero) — 2 upload cùng cỡ */}
                  <Grid size={{ xs: 12, md: 5 }}>
                    <FieldLabel>ẢNH ĐẠI DIỆN (1:1)</FieldLabel>
                    <UploadField
                      value={form.cover_image_url || null}
                      onChange={(file) => {
                        if (file instanceof File) {
                          set('cover_image_id', `tmp-${Date.now()}`);
                          set('cover_image_url', URL.createObjectURL(file));
                        } else {
                          set('cover_image_id', null);
                          set('cover_image_url', '');
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <FieldLabel>BANNER LANDING (16:9)</FieldLabel>
                    <UploadField
                      value={form.banner_image_url || null}
                      onChange={(file) => {
                        if (file instanceof File) {
                          set('banner_image_id', `tmp-${Date.now()}`);
                          set('banner_image_url', URL.createObjectURL(file));
                        } else {
                          set('banner_image_id', null);
                          set('banner_image_url', '');
                        }
                      }}
                    />
                  </Grid>

                  {/* Row 2: Icon picker · row ngang gọn với preview + button */}
                  <Grid size={{ xs: 12 }}>
                    <FieldLabel>ICON MEGA-MENU</FieldLabel>
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
                          <Iconify icon={currentLineKind?.icon ?? 'solar:tag-linear'} width={20} sx={{ color: 'text.disabled' }} />
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
                  <Grid size={{ xs: 12 }}>
                    <FieldLabel>VIDEO HERO URL (tuỳ chọn)</FieldLabel>
                    <TextField
                      value={form.hero_video_url}
                      onChange={(e) => set('hero_video_url', e.target.value)}
                      fullWidth size="small"
                      placeholder="https://cdn.pnj.com.vn/video/hero-kim-cuong.mp4 · hoặc YouTube embed"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:videocamera-record-linear" width={14} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <FieldLabel>CTA LABEL</FieldLabel>
                    <TextField
                      value={form.hero_cta_label}
                      onChange={(e) => set('hero_cta_label', e.target.value)}
                      fullWidth size="small"
                      placeholder="Khám phá ngay"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <FieldLabel>CTA URL</FieldLabel>
                    <TextField
                      value={form.hero_cta_url}
                      onChange={(e) => set('hero_cta_url', e.target.value)}
                      fullWidth size="small"
                      placeholder="/bo-suu-tap/kim-cuong"
                      inputProps={{ style: { fontFamily: 'monospace', fontSize: 12 } }}
                    />
                  </Grid>
                </Grid>
              </SectionCard>

              {/* --- Heritage story --- */}
              <SectionCard
                icon={ArticleOutlined}
                title="Câu chuyện xuất xứ · di sản dòng hàng"
                description='Nội dung dài kể lịch sử / nguồn gốc · ví dụ "Ngọc trai Akoya biểu tượng của sự thanh lịch Nhật Bản…".'
              >
                <Editor
                  fullItem
                  value={form.heritage_story_html}
                  onChange={(v) => set('heritage_story_html', v)}
                  placeholder="Ngọc trai Akoya là biểu tượng thanh lịch của Nhật Bản, được nuôi cấy từ mẹ…"
                  sx={{ minHeight: 220 }}
                />
              </SectionCard>

              {/* --- Sub-types (Freshwater / Akoya / Tahiti · 10K/14K/18K/24K · Oval/Round/Pear…) --- */}
              <SectionCard
                icon={CategoryOutlined}
                title={`Nhóm con · ${form.sub_types.length}`}
                description='Vd: ngọc trai "Freshwater/Akoya/Tahiti/Mother of Pearl" hoặc vàng "10K/14K/18K/24K" — mỗi nhóm con là 1 tab trên landing.'
                action={
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
                    onClick={() => {
                      setForm((f) => ({
                        ...f,
                        sub_types: [
                          ...f.sub_types,
                          { id: newSubTypeId(), name: '', origin: '', description: '', image_url: '', sort: f.sub_types.length + 1 },
                        ],
                      }));
                      setDirty(true);
                    }}
                  >
                    Thêm nhóm
                  </Button>
                }
              >
                {form.sub_types.length === 0 ? (
                  <Box
                    sx={{
                      py: 4, textAlign: 'center',
                      border: '2px dashed', borderColor: 'divider', borderRadius: 1,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chưa có nhóm con · tuỳ chọn, chỉ thêm nếu dòng cần tab phụ.</Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.25}>
                    {form.sub_types.map((st, idx) => (
                      <Box key={st.id} sx={{ p: 1.5, borderRadius: 1, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <Chip label={`#${idx + 1}`} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700 }} />
                          <TextField
                            size="small"
                            value={st.name}
                            onChange={(e) => {
                              setForm((f) => ({
                                ...f,
                                sub_types: f.sub_types.map((x) => (x.id === st.id ? { ...x, name: e.target.value } : x)),
                              }));
                              setDirty(true);
                            }}
                            placeholder="Tên nhóm · Vd: Akoya"
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            size="small"
                            value={st.origin}
                            onChange={(e) => {
                              setForm((f) => ({
                                ...f,
                                sub_types: f.sub_types.map((x) => (x.id === st.id ? { ...x, origin: e.target.value } : x)),
                              }));
                              setDirty(true);
                            }}
                            placeholder="Xuất xứ · Nhật Bản / Tahiti…"
                            sx={{ flex: 1 }}
                          />
                          <IconButton
                            size="small" sx={{ color: 'error.main' }}
                            onClick={() => {
                              setForm((f) => ({ ...f, sub_types: f.sub_types.filter((x) => x.id !== st.id) }));
                              setDirty(true);
                            }}
                          >
                            <Iconify icon="solar:trash-bin-trash-linear" width={16} />
                          </IconButton>
                        </Stack>
                        <TextField
                          size="small" fullWidth multiline rows={2}
                          value={st.description}
                          onChange={(e) => {
                            setForm((f) => ({
                              ...f,
                              sub_types: f.sub_types.map((x) => (x.id === st.id ? { ...x, description: e.target.value } : x)),
                            }));
                            setDirty(true);
                          }}
                          placeholder="Mô tả nhóm · Vd: Biểu tượng thanh lịch của Nhật Bản, màu trắng tinh khôi…"
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </SectionCard>

              {/* --- Hashtags · USP · Trust badges · Promo --- */}
              <SectionCard
                icon={StarsOutlined}
                title="Tag · Badge · USP · Promo"
                description="Chip hiển thị dọc theo trang landing · hashtag filter, badge uy tín, USP, override promo."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>HASHTAGS (filter chip)</FieldLabel>
                    <Autocomplete
                      multiple freeSolo openOnFocus
                      options={['#Bộ_trang_sức', '#Vàng', '#Dây_cổ', '#Khuyến_mãi', '#Mới', '#Cưới']}
                      value={form.hashtags}
                      onChange={(_e, next) => {
                        const cleaned = Array.from(new Set(next.map((t) => String(t).trim()).filter(Boolean))).slice(0, 12);
                        set('hashtags', cleaned);
                      }}
                      size="small"
                      renderInput={(p) => <TextField {...p} placeholder="Chọn hoặc gõ rồi Enter · tối đa 12" />}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>TRUST BADGES</FieldLabel>
                    <Autocomplete
                      multiple freeSolo openOnFocus
                      options={['GIA Certified', 'BH trọn đời', 'Thu đổi 48h', 'Giao hàng 3H', 'Trả góp 0%', 'Chuẩn SJC']}
                      value={form.trust_badges}
                      onChange={(_e, next) => {
                        const cleaned = Array.from(new Set(next.map((t) => String(t).trim()).filter(Boolean))).slice(0, 8);
                        set('trust_badges', cleaned);
                      }}
                      size="small"
                      renderInput={(p) => <TextField {...p} placeholder="Chọn hoặc gõ · tối đa 8" />}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>USP CHIPS</FieldLabel>
                    <Autocomplete
                      multiple freeSolo openOnFocus
                      options={['Mua càng nhiều — giá càng yêu', 'Chạm tay vào kim cương thật', 'PNJ Fast · Giao 3H', 'Phục vụ 24/7']}
                      value={form.usp_chips}
                      onChange={(_e, next) => {
                        const cleaned = Array.from(new Set(next.map((t) => String(t).trim()).filter(Boolean))).slice(0, 6);
                        set('usp_chips', cleaned);
                      }}
                      size="small"
                      renderInput={(p) => <TextField {...p} placeholder="USP ngắn 1 dòng · tối đa 6" />}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>PROMO OVERRIDE TEXT</FieldLabel>
                    <TextField
                      value={form.promo_override_text}
                      onChange={(e) => set('promo_override_text', e.target.value)}
                      fullWidth size="small"
                      placeholder='Vd: "Ưu đãi đến 45% — Mua càng nhiều — giá càng yêu"'
                      helperText="Override tag promo chung. Để trống dùng promo mặc định của site."
                    />
                  </Box>
                </Stack>
              </SectionCard>

              {/* --- Consultant · Education · Related --- */}
              <SectionCard
                icon={HandshakeOutlined}
                title="Tư vấn · Hướng dẫn · Liên kết chéo"
                description="Hotline, lịch tư vấn, guide chăm sóc, dòng hàng cùng khám phá."
              >
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel>HOTLINE OVERRIDE</FieldLabel>
                      <TextField
                        value={form.hotline_number}
                        onChange={(e) => set('hotline_number', e.target.value)}
                        fullWidth size="small"
                        placeholder="1800 54 54 57"
                        inputProps={{ style: { fontFamily: 'monospace' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel>LỊCH TƯ VẤN URL</FieldLabel>
                      <TextField
                        value={form.consultant_calendar_url}
                        onChange={(e) => set('consultant_calendar_url', e.target.value)}
                        fullWidth size="small"
                        placeholder="/dich-vu/dat-lich-tu-van"
                        inputProps={{ style: { fontFamily: 'monospace', fontSize: 12 } }}
                      />
                    </Grid>
                  </Grid>
                  <Box>
                    <FieldLabel>GUIDE CHĂM SÓC URL</FieldLabel>
                    <TextField
                      value={form.care_guide_url}
                      onChange={(e) => set('care_guide_url', e.target.value)}
                      fullWidth size="small"
                      placeholder="/blog/cach-bao-quan-ngoc-trai"
                      inputProps={{ style: { fontFamily: 'monospace', fontSize: 12 } }}
                      helperText='Vd: "Cách bảo quản vàng 24K" — hiện ở cuối trang landing.'
                    />
                  </Box>
                </Stack>
              </SectionCard>
            </Stack>
          </Grid>

          {/* ============ RIGHT (md=4) ============ */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard
                icon={StorefrontOutlined}
                title="Liên kết"
                description="Gắn thương hiệu quản lý và nhóm thuộc tính gợi ý cho sản phẩm trong dòng này."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>THƯƠNG HIỆU</FieldLabel>
                    <Autocomplete
                      size="small"
                      options={brandList}
                      value={brandOption}
                      getOptionLabel={(o) => o?.name ?? ''}
                      isOptionEqualToValue={(a, b) => (a._id ?? a.id) === (b._id ?? b.id)}
                      onChange={(_, v) => set('brand_id', v ? (v._id ?? v.id) : null)}
                      renderOption={(props, opt) => (
                        <Box component="li" {...props}>
                          <Avatar src={opt.logo_url ?? opt.logo} variant="rounded" sx={{ width: 22, height: 22, mr: 1, bgcolor: 'grey.100' }} />
                          <span>{opt.name}</span>
                        </Box>
                      )}
                      renderInput={(p) => <TextField {...p} placeholder="Chọn brand gắn cho dòng này" />}
                    />
                  </Box>

                  <Box>
                    <FieldLabel>NHÓM THUỘC TÍNH MẶC ĐỊNH</FieldLabel>
                    <Autocomplete
                      size="small"
                      options={attrSetList}
                      value={attrSetOption}
                      getOptionLabel={(o) => o?.name ?? ''}
                      isOptionEqualToValue={(a, b) => (a._id ?? a.id) === (b._id ?? b.id)}
                      onChange={(_, v) => set('attribute_set_id', v ? (v._id ?? v.id) : null)}
                      renderInput={(p) => <TextField {...p} placeholder="Set thuộc tính gợi ý khi tạo SP" />}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={DiamondOutlined}
                title="Khoảng giá tham chiếu"
                description="Giá min — max hiển thị ở landing của dòng hàng."
              >
                <Grid container spacing={1.5}>
                  <Grid size={6}>
                    <FieldLabel>GIÁ MIN</FieldLabel>
                    <MoneyInput
                      size="small"
                      fullWidth
                      value={form.price_min}
                      onChange={(v) => set('price_min', Number(v) || 0)}
                    />
                  </Grid>
                  <Grid size={6}>
                    <FieldLabel>GIÁ MAX</FieldLabel>
                    <MoneyInput
                      size="small"
                      fullWidth
                      value={form.price_max}
                      onChange={(v) => set('price_max', Number(v) || 0)}
                    />
                  </Grid>
                </Grid>
                {form.price_min > 0 && form.price_max > 0 && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                    Khoảng giá: <b>{fCurrency(form.price_min)} — {fCurrency(form.price_max)}</b>
                  </Typography>
                )}
              </SectionCard>

              <SectionCard
                icon={StarsOutlined}
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
                icon={FlagOutlined}
                title="Nhãn & hiển thị"
              >
                <Stack spacing={0} divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
                  {[
                    { k: 'is_featured_home', label: 'Nổi bật trang chủ', desc: 'Khối "Dòng hàng nổi bật" ở homepage.' },
                    { k: 'is_in_mega_menu',  label: 'Hiện ở mega-menu',  desc: 'Xuất hiện trong cột "Dòng Hàng" của header.' },
                    { k: 'show_gold_price_widget', label: 'Widget bảng giá vàng', desc: 'Hiện bảng giá vàng real-time (chỉ dùng vàng).' },
                    { k: 'is_new_badge',     label: 'Nhãn NEW',          desc: 'Huy hiệu đỏ "NEW" trên card dòng hàng.' },
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
                description="Metadata cho trang landing /dong-hang/<slug>."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>TITLE</FieldLabel>
                    <TextField
                      value={form.seo.title}
                      onChange={(e) => setSeo('title', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Trang sức Kim Cương PNJ · Chuẩn GIA"
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
                  PREVIEW MEGA-MENU
                </Typography>
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.25 }}>
                  <Box
                    sx={{
                      width: 38, height: 38, borderRadius: 1,
                      display: 'grid', placeItems: 'center',
                      bgcolor: 'grey.100',
                      border: 1, borderColor: 'divider',
                    }}
                  >
                    {form.cover_image_url ? (
                      <Box component="img" src={form.cover_image_url} sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }} />
                    ) : (
                      <Iconify icon={currentLineKind?.icon ?? 'solar:tag-linear'} width={20} sx={{ color: 'text.secondary' }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }} noWrap>
                      {form.name || 'Tên dòng hàng'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
                      {form.tagline || currentLineKind?.label || '—'}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
                      {form.materials.map((m) => {
                        const mat = MATERIALS.find((x) => x.value === m);
                        return (
                          <Chip
                            key={m}
                            label={mat?.label}
                            size="small"
                            sx={{
                              height: 16, fontSize: 9.5, fontWeight: 600,
                              bgcolor: (mat?.color ?? '#999') + '22',
                              color: mat?.color,
                            }}
                          />
                        );
                      })}
                      {form.is_co_brand && (
                        <Chip label="CO-BRAND" size="small" color="info" sx={{ height: 16, fontSize: 9.5 }} />
                      )}
                      {form.is_new_badge && (
                        <Chip label="NEW" size="small" color="error" sx={{ height: 16, fontSize: 9.5 }} />
                      )}
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
