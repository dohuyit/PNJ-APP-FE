// src/views/admin/post/post-create-drawer.jsx
// Port 1:1 từ zeno-digital-official-fe/src/subs/admin/articles/sections/article-editor-drawer.jsx
// Full-width drawer với topbar sticky + body grid 1fr 340px (main + sidebar).
// Tokens zeno `T` → MUI palette tương đương.

'use client';

import dayjs from 'dayjs';
import { useForm, FormProvider } from 'react-hook-form';
import { useRef, useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';
import { mockPostAuthors } from 'src/mock-data';

const postCategoriesTree = []; // TODO: wire useGetPostCategoryList when view needs it

// Stubs — API chưa có hook; giữ literal để view không crash.
const postAuthorsList = mockPostAuthors;
// ─────────── Design tokens — map từ zeno T sang MUI palette
const R1 = '4px';
const R2 = '8px';
const R3 = '12px';

const COVER_GRADS = {
  'red-gold':    'linear-gradient(135deg,#E63946,#FFB700)',
  'purple-pink': 'linear-gradient(135deg,#8B5CF6,#EC4899)',
  'blue-green':  'linear-gradient(135deg,#2E90FA,#22C55E)',
  'navy-red':    'linear-gradient(135deg,#0B1F3A,#E63946)',
  'gold-orange': 'linear-gradient(135deg,#FFB700,#F59E0B)',
  'red-cyan':    'linear-gradient(135deg,#E63946,#00B8D9)',
};
const COVER_ICONS = [
  { key: 'bolt',               icon: 'mdi:lightning-bolt' },
  { key: 'emoji_events',       icon: 'mdi:trophy-outline' },
  { key: 'workspace_premium',  icon: 'mdi:crown-outline' },
  { key: 'trending_up',        icon: 'mdi:trending-up' },
  { key: 'bar_chart',          icon: 'mdi:chart-bar' },
  { key: 'verified',           icon: 'mdi:check-decagram-outline' },
];
const COVER_ICON_MAP = Object.fromEntries(COVER_ICONS.map((i) => [i.key, i.icon]));
const COVER_MAX_BYTES = 5 * 1024 * 1024;

const DEFAULT_ARTICLE = {
  title: '',
  slug: '',
  category: '',
  author: '',
  status: 'draft',
  excerpt: '',
  content: '',
  tags: [],
  featured: false,
  pinned: false,
  coverType: 'image',
  coverData: '',
  coverFileId: '',
  coverGrad: 'red-gold',
  coverIcon: 'bolt',
  coverNum: '',
  coverLabel: '',
  bigStatVal: '',
  bigStatUnit: '',
  bigStatLabel: '',
  date: '',
  scheduledAt: '',
  readTime: '',
  metaTitle: '',
  metaDescription: '',
  keyword: '',
};

function slugify(str = '') {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─────────── Shared sx — input native styles

const formInputSx = (theme) => ({
  height: 36,
  padding: '0 12px',
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: R2,
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontSize: 13.5,
  fontWeight: 400,
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'all 0.15s',
  '&::placeholder': { color: theme.palette.text.disabled },
  '&:focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.24)}`,
  },
});

const formTextareaSx = (theme) => ({
  ...formInputSx(theme),
  height: 'auto',
  padding: '10px 12px',
  minHeight: 80,
  resize: 'vertical',
  lineHeight: 1.55,
});

const STATUS_PILL = {
  published: { bgKey: 'success',  label: 'Đã đăng', pulse: true },
  draft:     { bgKey: 'grey',     label: 'Bản nháp' },
  scheduled: { bgKey: 'info',     label: 'Hẹn đăng' },
  archived:  { bgKey: 'grey',     label: 'Lưu trữ', bordered: true },
  trash:     { bgKey: 'error',    label: 'Thùng rác', strike: true },
};

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================

export function PostFormDrawer({ open, onClose, onSubmit, initial: row }) {
  const isEdit = Boolean(row);

  const defaultValues = useMemo(() => {
    if (!row) return DEFAULT_ARTICLE;
    return {
      ...DEFAULT_ARTICLE,
      ...row,
      title:     row.title ?? '',
      slug:      row.slug ?? '',
      category:  row.category_id ?? row.category ?? '',
      author:    row.author ?? '',
      status:    row.status ?? 'draft',
      excerpt:   row.excerpt ?? '',
      content:   row.content_html ?? row.content ?? '',
      tags:      row.tags ?? [],
      featured:  !!(row.is_featured ?? row.featured),
      coverType: row.coverType ?? 'image',
      coverData: row.thumbnail ?? row.coverData ?? '',
      coverGrad: row.coverGrad ?? 'red-gold',
      coverIcon: row.coverIcon ?? 'bolt',
    };
  }, [row]);

  const methods = useForm({ defaultValues, shouldFocusError: false });
  const { watch, setValue, reset, handleSubmit, formState, register } = methods;

  const [slugLocked, setSlugLocked] = useState(!isEdit);

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setSlugLocked(!isEdit);
    }
  }, [open, defaultValues, isEdit, reset]);

  // Body + html scroll lock (match FormDrawer fix) — Drawer custom paper không tự lock,
  // gây 2 scrollbar khi editor dài hơn viewport.
  useEffect(() => {
    if (!open) return undefined;
    const b = document.body.style;
    const h = document.documentElement.style;
    const prev = { bo: b.overflow, hp: b.paddingRight, ho: h.overflow };
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    if (sbw > 0) b.paddingRight = `${sbw}px`;
    b.overflow = 'hidden';
    h.overflow = 'hidden';
    return () => {
      b.overflow = prev.bo;
      b.paddingRight = prev.hp;
      h.overflow = prev.ho;
    };
  }, [open]);

  const title = watch('title');
  const slug = watch('slug');
  const status = watch('status');
  const excerpt = watch('excerpt');
  const content = watch('content');
  const metaTitle = watch('metaTitle');
  const metaDescription = watch('metaDescription');
  const category = watch('category');
  const tags = watch('tags') || [];

  // Auto-slug while locked
  useEffect(() => {
    if (!slugLocked || !title) return;
    const auto = slugify(title);
    if (auto && auto !== slug) setValue('slug', auto, { shouldValidate: false });
  }, [title, slugLocked]); // eslint-disable-line react-hooks/exhaustive-deps

  // Word count + read time
  const words = useMemo(() => {
    const raw = String(content || '').replace(/<[^>]+>/g, ' ');
    const text = `${title || ''} ${excerpt || ''} ${raw}`.trim();
    return text ? text.split(/\s+/).filter(Boolean).length : 0;
  }, [title, excerpt, content]);
  const readMin = Math.max(1, Math.round(words / 200));

  // SEO checks
  const seoChecks = useMemo(() => {
    const mt = metaTitle || title || '';
    const md = metaDescription || excerpt || '';
    const s = slug || '';
    return [
      { ok: mt.length >= 30 && mt.length <= 60, label: `Meta title ${mt.length} ký tự (30-60)` },
      { ok: md.length >= 80 && md.length <= 160, label: `Meta description ${md.length} ký tự (80-160)` },
      { ok: s.length >= 5 && s.length <= 60 && /^[a-z0-9-]+$/.test(s), label: `Slug hợp lệ (${s.length} ký tự)` },
      { ok: tags.length > 0, label: `Có ${tags.length || 0} thẻ` },
      { ok: !!category, label: 'Đã chọn chuyên mục' },
    ];
  }, [metaTitle, metaDescription, title, excerpt, slug, tags.length, category]);
  const seoScore = Math.round((seoChecks.filter((c) => c.ok).length / seoChecks.length) * 100);

  const publish = (targetStatus) =>
    handleSubmit(async (data) => {
      const nextStatus = targetStatus || data.status;
      const formValues = { ...data, status: nextStatus };
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
        await onSubmit?.(formValues);
        toast.success(isEdit ? 'Đã lưu thay đổi.' : 'Đã tạo bài viết.');
        onClose?.();
      } catch (err) {
        console.error(err);
        toast.error('Không thể xử lý yêu cầu!');
      }
    }, () => {
      toast.error('Vui lòng kiểm tra lại các trường bắt buộc.');
    });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ disableEnforceFocus: true, disableAutoFocus: true, disableRestoreFocus: true }}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100vw', md: 'calc(100vw - var(--layout-nav-vertical-width, 280px))' },
            maxWidth: '100vw',
            backgroundImage: 'none',
            bgcolor: 'grey.50',
            boxShadow: '-14px 0 44px rgba(0,0,0,0.2)',
          },
        },
        backdrop: { sx: { background: 'rgba(15,20,25,0.45)' } },
      }}
    >
      <FormProvider {...methods}>
        <Box component="form" onSubmit={publish()} sx={{ display: 'flex', flexDirection: 'column', height: '100vh', minHeight: 0 }}>
          {/* ───────── Topbar (sticky) ───────── */}
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={2}
            useFlexGap
            sx={{
              p: { xs: '12px 16px', md: '16px 28px' },
              bgcolor: 'background.paper',
              borderBottom: 1, borderColor: 'divider',
              flexWrap: 'wrap',
              gap: { xs: '12px', md: '16px' },
              flexShrink: 0,
            }}
          >
            <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ minWidth: 0, flex: '1 1 300px' }}>
              <IconButton
                onClick={onClose}
                aria-label="Quay lại danh sách"
                type="button"
                sx={{
                  width: 36, height: 36,
                  borderRadius: R2,
                  border: 1, borderColor: 'grey.300',
                  color: 'text.secondary',
                  bgcolor: 'background.paper',
                  flexShrink: 0,
                  '&:hover': { bgcolor: 'grey.100', borderColor: 'grey.400', color: 'text.primary' },
                }}
              >
                <Iconify icon="mdi:arrow-left" width={18} />
              </IconButton>
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
                  <Typography
                    component="h1"
                    sx={{
                      fontWeight: 700, fontSize: { xs: 18, md: 20 },
                      whiteSpace: 'nowrap', letterSpacing: '-0.02em',
                      color: 'text.primary', m: 0, lineHeight: 1.2,
                    }}
                  >
                    {isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                  </Typography>
                  <StatusPill status={status} />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ fontSize: 12, color: 'text.disabled', mt: '4px', flexWrap: 'wrap', rowGap: 0.5 }}>
                  <Iconify icon="mdi:text-box-outline" width={14} />
                  <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>{words}</Box>
                  <Box component="span">từ ·</Box>
                  <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>~{readMin}</Box>
                  <Box component="span">phút đọc</Box>
                  {!isEdit && <Box component="span" sx={{ color: 'text.secondary' }}>· Bài viết mới · chưa lưu</Box>}
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              <Button
                type="button"
                startIcon={<Iconify icon="mdi:eye-outline" width={17} />}
                sx={btnLightSx}
                onClick={() => {
                  const t = (watch('title') || '').trim();
                  const c = String(watch('content') || '').replace(/<[^>]+>/g, '').trim();
                  if (!t && !c) {
                    toast.error('Chưa có nội dung để xem trước');
                    return;
                  }
                  toast('Mở xem trước (chưa wire)');
                }}
              >
                Xem trước
              </Button>
              <Button
                type="button"
                startIcon={<Iconify icon="mdi:text-box-outline" width={17} />}
                sx={btnLightSx}
                onClick={publish('draft')}
                disabled={formState.isSubmitting}
              >
                Lưu nháp
              </Button>
              <Button
                type="button"
                startIcon={<Iconify icon="mdi:check-circle-outline" width={17} />}
                sx={btnDarkSx}
                onClick={publish(status === 'scheduled' ? 'scheduled' : 'published')}
                disabled={formState.isSubmitting}
              >
                {status === 'scheduled' ? 'Lên lịch' : 'Xuất bản'}
              </Button>
            </Stack>
          </Stack>

          {/* ───────── Body — grid 1fr 340px ───────── */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              bgcolor: 'grey.50',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 340px' },
              gap: '20px',
              p: { xs: '16px 16px 40px', md: '22px 28px 60px' },
              alignItems: 'start',
            }}
          >
            {/* ── MAIN ── */}
            <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              {/* Cover */}
              <CoverBlock
                coverType={watch('coverType') || 'image'}
                coverData={watch('coverData') || ''}
                coverGrad={watch('coverGrad') || 'red-gold'}
                coverIcon={watch('coverIcon') || 'bolt'}
                coverNum={watch('coverNum') || ''}
                coverLabel={watch('coverLabel') || ''}
                onChange={(patch) => {
                  Object.entries(patch).forEach(([k, v]) => setValue(k, v, { shouldDirty: true }));
                }}
                register={register}
              />

              {/* Title */}
              <Box sx={{ mt: '16px' }}>
                <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={1} sx={{ mb: '6px' }}>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Iconify icon="mdi:format-title" width={16} sx={{ color: 'primary.main' }} />
                    <Typography
                      component="label"
                      sx={{ fontWeight: 700, fontSize: 13, color: 'text.primary', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}
                    >
                      Tiêu đề bài viết
                      <Box component="span" sx={{ color: 'primary.main', ml: '2px' }}>*</Box>
                    </Typography>
                  </Stack>
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 500, fontSize: 11,
                      color: (title || '').length > 140 ? 'error.main' : 'text.disabled',
                      fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
                    }}
                  >
                    {(title || '').length} / 140
                  </Box>
                </Stack>

                <Box
                  sx={(theme) => ({
                    position: 'relative',
                    border: `1px solid ${formState.errors.title ? theme.palette.error.main : theme.palette.grey[300]}`,
                    borderRadius: R3,
                    bgcolor: 'background.paper',
                    transition: 'all 0.15s',
                    '&:hover': { borderColor: formState.errors.title ? 'error.main' : 'grey.400' },
                    '&:focus-within': {
                      borderColor: 'primary.main',
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.24)}`,
                    },
                  })}
                >
                  <Box
                    component="textarea"
                    {...register('title', { required: 'Bắt buộc có tiêu đề' })}
                    rows={1}
                    placeholder="vd: 5 xu hướng trang sức cưới nhất định phải biết 2026"
                    sx={{
                      border: 0, outline: 0, background: 'transparent',
                      width: '100%', display: 'block', boxSizing: 'border-box',
                      fontWeight: 800, fontSize: { xs: 21, md: 26 }, lineHeight: 1.25,
                      letterSpacing: '-0.02em',
                      color: 'text.primary',
                      p: { xs: '12px 14px', md: '14px 16px' },
                      resize: 'none', overflow: 'hidden',
                      whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
                      minHeight: 60,
                      fontFamily: 'inherit',
                      '&::placeholder': { color: 'text.disabled', fontWeight: 500, fontSize: 17, letterSpacing: 0 },
                    }}
                    onInput={(e) => {
                      e.currentTarget.style.height = 'auto';
                      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                    }}
                  />
                </Box>

                {formState.errors.title ? (
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: '6px' }}>
                    <Iconify icon="mdi:alert-circle-outline" width={14} sx={{ color: 'error.main' }} />
                    <Typography sx={{ fontSize: 11.5, color: 'error.main' }}>
                      {formState.errors.title.message}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: '6px', lineHeight: 1.5 }}>
                    Tiêu đề hiển thị trên trang blog, thẻ chia sẻ mạng xã hội và kết quả tìm kiếm Google.
                  </Typography>
                )}
              </Box>

              {/* Slug */}
              <Box
                sx={(theme) => ({
                  display: 'flex', alignItems: 'center',
                  border: 1, borderColor: 'grey.300', borderRadius: R2,
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                  maxWidth: '100%',
                  mt: '12px',
                  transition: 'all 0.15s',
                  '&:focus-within': {
                    borderColor: 'primary.main',
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.24)}`,
                  },
                })}
              >
                <Box
                  sx={{
                    px: '4px 12px', fontSize: 12.5, fontWeight: 500,
                    fontFamily: 'ui-monospace, Menlo, monospace',
                    color: 'text.disabled', whiteSpace: 'nowrap', padding: '0 4px 0 12px',
                  }}
                >
                  /blog/
                </Box>
                <Box
                  component="input"
                  {...register('slug')}
                  placeholder="duong-dan-bai-viet"
                  sx={{
                    flex: 1, minWidth: 0,
                    border: 0, outline: 0,
                    padding: '9px 8px',
                    fontSize: 12.5, fontWeight: 500,
                    fontFamily: 'ui-monospace, Menlo, monospace',
                    color: 'primary.dark',
                    background: 'transparent',
                  }}
                />
                <Box
                  component="button"
                  type="button"
                  onClick={() => setSlugLocked((v) => !v)}
                  title={slugLocked ? 'Đang tự tạo từ tiêu đề — bấm để chỉnh tay' : 'Đang chỉnh tay — bấm để tự tạo lại'}
                  sx={{
                    border: 0, alignSelf: 'stretch',
                    padding: '0 12px', cursor: 'pointer',
                    bgcolor: slugLocked ? 'primary.lighter' : 'grey.50',
                    color: slugLocked ? 'primary.dark' : 'text.secondary',
                    display: 'grid', placeItems: 'center',
                    transition: 'all 0.12s',
                    '&:hover': { bgcolor: 'grey.100', color: 'primary.main' },
                  }}
                >
                  <Iconify icon={slugLocked ? 'mdi:autorenew' : 'mdi:lock-open-variant-outline'} width={16} />
                </Box>
              </Box>

              {/* Excerpt */}
              <FormField label="Tóm tắt (excerpt)" sx={{ mt: '16px' }}>
                <Box
                  component="textarea"
                  {...register('excerpt')}
                  rows={2}
                  placeholder="Mô tả ngắn hiển thị ở danh sách & khi chia sẻ mạng xã hội…"
                  sx={formTextareaSx}
                />
              </FormField>

              {/* Content editor — TipTap qua Field.Editor */}
              <FormField label="Nội dung bài viết" sx={{ mt: '16px' }}>
                <Box
                  sx={(theme) => ({
                    borderRadius: R3,
                    overflow: 'hidden',
                    '& .tiptap-root': {
                      border: `1px solid ${theme.palette.grey[300]}`,
                      borderRadius: R3,
                      bgcolor: 'background.paper',
                      transition: 'all 0.15s',
                    },
                    '& .tiptap-root:focus-within': {
                      borderColor: 'primary.main',
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.24)}`,
                    },
                    '& .ProseMirror': {
                      minHeight: 420,
                      padding: '14px 16px',
                      fontSize: 14.5,
                      lineHeight: 1.65,
                    },
                  })}
                >
                  <Field.Editor
                    name="content"
                    placeholder="Bắt đầu viết nội dung bài viết…"
                    sx={{ maxHeight: 600 }}
                  />
                </Box>
              </FormField>
            </Box>

            {/* ── SIDE (sticky) ── */}
            <Box
              sx={{
                display: 'flex', flexDirection: 'column', gap: '16px',
                position: { md: 'sticky' },
                top: { md: 20 },
              }}
            >
              {/* Card: Xuất bản */}
              <FormCard icon="mdi:check-circle-outline" title="Xuất bản">
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.25}>
                  <FormLabelInline>Trạng thái</FormLabelInline>
                  <StatusPill status={status} />
                </Stack>

                <FeatToggle
                  checked={status === 'scheduled'}
                  onChange={(v) => setValue('status', v ? 'scheduled' : 'draft', { shouldDirty: true })}
                >
                  Lên lịch đăng
                </FeatToggle>

                {status === 'scheduled' && (
                  <Box sx={{ mt: '12px' }}>
                    <DateTimePicker
                      value={watch('scheduledAt') ? dayjs(watch('scheduledAt')) : null}
                      onChange={(v) => setValue('scheduledAt', v ? dayjs(v).format() : '', { shouldDirty: true })}
                      format="YYYY/MM/DD HH:mm:ss"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              height: 40,
                              borderRadius: R2,
                              fontSize: 13.5,
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: 13,
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                )}

                <FeatToggle
                  checked={watch('featured')}
                  onChange={(v) => setValue('featured', v, { shouldDirty: true })}
                >
                  Đánh dấu bài <Box component="b" sx={{ color: 'primary.dark' }}>Nổi bật</Box>
                </FeatToggle>

              </FormCard>

              {/* Card: Phân loại */}
              <FormCard icon="mdi:folder-outline" title="Phân loại">
                <FormField label="Chuyên mục">
                  <CategorySelect
                    value={category}
                    onChange={(key) => setValue('category', key || '', { shouldDirty: true })}
                  />
                </FormField>

                <FormField label="Tác giả" sx={{ mt: '12px' }}>
                  <AuthorSelect
                    value={watch('author')}
                    onChange={(id) => setValue('author', id || '', { shouldDirty: true })}
                  />
                </FormField>

                <FormField label="Thẻ (tags)" sx={{ mt: '12px' }}>
                  <TagsAutocomplete
                    value={tags}
                    onChange={(v) => setValue('tags', v, { shouldDirty: true })}
                  />
                </FormField>
              </FormCard>

              {/* Card: SEO */}
              <FormCard icon="mdi:magnify-scan" title="SEO" right={<SeoChip score={seoScore} />}>
                <FormField label="Meta title" hint={`${(metaTitle || '').length} / 60`}>
                  <Box
                    component="input"
                    {...register('metaTitle')}
                    maxLength={70}
                    placeholder="Tiêu đề hiển thị trên Google…"
                    sx={formInputSx}
                  />
                </FormField>

                <FormField label="Meta description" hint={`${(metaDescription || '').length} / 160`} sx={{ mt: '12px' }}>
                  <Box
                    component="textarea"
                    {...register('metaDescription')}
                    rows={3}
                    maxLength={180}
                    placeholder="Mô tả hiển thị trên kết quả tìm kiếm…"
                    sx={formTextareaSx}
                  />
                </FormField>

                <FormField label="Từ khoá chính" sx={{ mt: '12px' }}>
                  <Box
                    component="input"
                    {...register('keyword')}
                    placeholder="vd: trang sức cưới 2026"
                    sx={formInputSx}
                  />
                </FormField>

                <Box sx={{ mt: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {seoChecks.map((c, i) => (
                    <Stack
                      key={i}
                      direction="row" alignItems="center" spacing={0.75}
                      sx={{ fontSize: 12, color: c.ok ? 'success.darker' : 'text.disabled' }}
                    >
                      <Iconify icon={c.ok ? 'mdi:check-circle' : 'mdi:circle-outline'} width={15} />
                      {c.label}
                    </Stack>
                  ))}
                </Box>
              </FormCard>
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </Drawer>
  );
}

// ===========================================================================
// SUB-COMPONENTS
// ===========================================================================

const btnLightSx = {
  height: 34,
  px: '13px',
  borderRadius: R2,
  bgcolor: 'background.paper',
  color: 'text.primary',
  border: 1, borderColor: 'grey.300',
  fontSize: 13, fontWeight: 600,
  textTransform: 'none', whiteSpace: 'nowrap',
  '& .MuiButton-startIcon': { mr: '5px' },
  '&:hover': { bgcolor: 'grey.100', borderColor: 'grey.400', color: 'text.primary' },
  '&.Mui-disabled': { opacity: 0.5 },
};

const btnDarkSx = {
  height: 34,
  px: '14px',
  borderRadius: R2,
  bgcolor: 'text.primary',
  color: 'common.white',
  border: 0,
  fontSize: 13, fontWeight: 600,
  textTransform: 'none', whiteSpace: 'nowrap',
  '& .MuiButton-startIcon': { mr: '5px' },
  '&:hover': { bgcolor: 'grey.900' },
  '&.Mui-disabled': { opacity: 0.5, color: 'common.white' },
};

function StatusPill({ status }) {
  const s = STATUS_PILL[status] || STATUS_PILL.draft;
  const bgMap = { success: 'success.lighter', grey: 'grey.200', info: 'info.lighter', error: 'error.lighter' };
  const colorMap = { success: 'success.darker', grey: 'text.secondary', info: 'info.darker', error: 'error.darker' };
  return (
    <Box
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        px: '10px', py: '3px', borderRadius: '999px',
        fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', lineHeight: 1.5,
        bgcolor: bgMap[s.bgKey], color: colorMap[s.bgKey],
        ...(s.bordered && { boxShadow: 'inset 0 0 0 1px', boxShadowColor: 'grey.400' }),
      }}
    >
      <Box
        sx={{
          width: 6, height: 6, borderRadius: '50%',
          bgcolor: 'currentColor', flexShrink: 0,
          ...(s.pulse && {
            animation: 'stPulse 2.4s ease-in-out infinite',
            '@keyframes stPulse': {
              '0%,100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0)' },
              '50%':     { boxShadow: '0 0 0 3px rgba(34,197,94,0.24)' },
            },
          }),
        }}
      />
      <Box component="span" sx={s.strike ? { textDecoration: 'line-through', textDecorationColor: 'text.secondary' } : undefined}>
        {s.label}
      </Box>
    </Box>
  );
}

// Thin wrapper: dùng FieldLabel chung (brand-form style) nhưng giữ API `FormLabelInline` để không phải đổi call-site.
function FormLabelInline({ children }) {
  return <FieldLabel>{children}</FieldLabel>;
}

function FormField({ label, hint, children, sx }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', ...sx }}>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={1}>
        <FormLabelInline>{label}</FormLabelInline>
        {hint && (
          <Box
            component="span"
            sx={{
              fontSize: 11, fontWeight: 500, color: 'text.disabled',
              fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {hint}
          </Box>
        )}
      </Stack>
      {children}
    </Box>
  );
}

// Thin wrapper: reuse shared SectionCard pattern (brand-form style) but giữ API cũ `icon: string`
// để các call-site trong file không phải đụng tới.
function FormCard({ icon, title, right, children }) {
  const IconWrap = (props) => <Iconify icon={icon} width={18} {...props} />;
  return (
    <SectionCard icon={IconWrap} title={title} action={right}>
      {children}
    </SectionCard>
  );
}

function FeatToggle({ children, checked, onChange }) {
  return (
    <Box
      component="label"
      sx={{
        display: 'flex', alignItems: 'center', gap: '9px',
        mt: '14px', cursor: 'pointer',
        fontSize: 13, color: 'text.primary', userSelect: 'none',
      }}
    >
      <Box
        component="input"
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        sx={{ display: 'none' }}
      />
      <Box
        sx={{
          width: 38, height: 22,
          borderRadius: '11px',
          bgcolor: checked ? 'primary.main' : 'grey.300',
          position: 'relative',
          transition: 'background 0.15s', flexShrink: 0,
          '&::after': {
            content: '""',
            position: 'absolute', top: '2px', left: '2px',
            width: 18, height: 18, borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'transform 0.15s',
            transform: checked ? 'translateX(16px)' : 'none',
          },
        }}
      />
      <Box component="span">{children}</Box>
    </Box>
  );
}

function SeoChip({ score }) {
  const tone =
    score >= 80 ? { bg: 'success.lighter', color: 'success.darker', icon: 'mdi:check-circle' } :
    score >= 50 ? { bg: 'warning.lighter', color: 'warning.darker', icon: 'mdi:alert-circle-outline' } :
                  { bg: 'error.lighter',   color: 'error.darker',   icon: 'mdi:close-circle-outline' };
  return (
    <Box
      sx={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
        px: '9px', py: '2px', borderRadius: '999px',
        fontWeight: 700, fontSize: 11.5, fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap', flexShrink: 0,
        bgcolor: tone.bg, color: tone.color,
      }}
    >
      <Iconify icon={tone.icon} width={13} />
      {score}
    </Box>
  );
}

// ─────────── CoverBlock

function CoverBlock({ coverType, coverData, coverGrad, coverIcon, coverNum, coverLabel, onChange, register }) {
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  const isImageMode = coverType === 'image';
  const hasImage = isImageMode && !!coverData;

  const onFilePick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setUploadError('Chỉ nhận tệp hình ảnh (JPG / PNG / WebP)');
      return;
    }
    if (file.size > COVER_MAX_BYTES) {
      setUploadError(`Ảnh vượt quá ${Math.round(COVER_MAX_BYTES / 1024 / 1024)}MB`);
      return;
    }
    setUploadError('');
    setUploading(true);
    try {
      const url = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      onChange?.({ coverData: url, coverType: 'image' });
    } catch (err) {
      setUploadError('Không đọc được ảnh');
    } finally {
      setUploading(false);
    }
  };

  const openPicker = () => { if (isImageMode && !uploading) fileInputRef.current?.click(); };
  const removeImage = (e) => { e.stopPropagation(); onChange?.({ coverData: '', coverFileId: '' }); };

  const graphicKind = coverNum ? 'number' : 'icon';
  const setGraphicKind = (k) => {
    if (k === 'number') onChange?.({ coverNum: coverNum || 'Top 1' });
    else onChange?.({ coverNum: '' });
  };

  return (
    <Box>
      <Box component="input" ref={fileInputRef} type="file" accept="image/*" onChange={onFilePick} sx={{ display: 'none' }} />

      {/* Seg: Ảnh bìa / Đồ hoạ */}
      <Box
        sx={{
          display: 'inline-flex', gap: '4px', p: '3px',
          bgcolor: 'grey.100', border: 1, borderColor: 'divider',
          borderRadius: R2, mb: '10px',
        }}
      >
        {[
          { v: 'image',   icon: 'mdi:image-outline', label: 'Ảnh bìa' },
          { v: 'graphic', icon: 'mdi:shape-outline', label: 'Đồ hoạ' },
        ].map((s) => {
          const on = coverType === s.v;
          return (
            <Box
              key={s.v}
              component="button"
              type="button"
              onClick={() => onChange?.({ coverType: s.v })}
              sx={{
                height: 30, px: '14px', border: 0,
                bgcolor: on ? 'background.paper' : 'transparent',
                borderRadius: R1,
                color: on ? 'primary.dark' : 'text.secondary',
                fontSize: 13, fontWeight: 600,
                whiteSpace: 'nowrap', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.12s',
                boxShadow: on ? '0 1px 2px rgba(145,158,171,0.16)' : 'none',
                '&:hover': { color: 'text.primary' },
              }}
            >
              <Iconify icon={s.icon} width={15} />
              {s.label}
            </Box>
          );
        })}
      </Box>

      {/* Cover display */}
      <Box
        onClick={openPicker}
        sx={{
          position: 'relative',
          border: hasImage || !isImageMode ? 1 : '1.5px dashed',
          borderColor: hasImage || !isImageMode ? 'divider' : 'grey.400',
          borderRadius: R3,
          background: (() => {
            if (hasImage) return `#000 center/cover no-repeat url("${coverData}")`;
            if (!isImageMode) return COVER_GRADS[coverGrad] || COVER_GRADS['red-gold'];
            return undefined;
          })(),
          bgcolor: !hasImage && isImageMode ? 'grey.100' : undefined,
          minHeight: hasImage || !isImageMode ? 200 : 150,
          display: 'grid', placeItems: 'center',
          cursor: isImageMode ? 'pointer' : 'default',
          transition: 'all 0.15s', overflow: 'hidden',
          color: hasImage || !isImageMode ? '#fff' : 'text.disabled',
          '&:hover': isImageMode && !hasImage ? { borderColor: 'primary.main', bgcolor: 'primary.lighter' } : undefined,
        }}
      >
        {hasImage && (
          <Box
            component="button"
            type="button"
            onClick={removeImage}
            title="Xoá ảnh"
            sx={{
              position: 'absolute', top: 10, right: 10,
              width: 32, height: 32, borderRadius: R2,
              border: 0, background: 'rgba(0,0,0,0.55)',
              color: '#fff', display: 'grid', placeItems: 'center',
              cursor: 'pointer', zIndex: 2,
              '&:hover': { background: 'rgba(0,0,0,0.78)' },
            }}
          >
            <Iconify icon="mdi:close" width={18} />
          </Box>
        )}

        {isImageMode && !hasImage && (
          <Stack alignItems="center" spacing={0.75} sx={{ p: '24px', textAlign: 'center' }}>
            <Iconify
              icon={uploading ? 'mdi:loading' : 'mdi:cloud-upload-outline'}
              width={34}
              sx={uploading ? {
                animation: 'coverSpin 1s linear infinite',
                '@keyframes coverSpin': { to: { transform: 'rotate(360deg)' } },
              } : undefined}
            />
            <Box sx={{ fontSize: 13 }}>
              {uploading ? 'Đang tải ảnh bìa…' : <>Bấm hoặc <Box component="b" sx={{ color: 'primary.dark' }}>chọn ảnh bìa</Box></>}
            </Box>
            <Box sx={{ fontSize: 11.5 }}>Khuyến nghị 1200×630px · JPG / PNG / WebP</Box>
          </Stack>
        )}

        {!isImageMode && (
          <Stack alignItems="center" spacing={1} sx={{ p: '24px', textAlign: 'center' }}>
            {coverNum ? (
              <Box sx={{ fontWeight: 800, fontSize: 44, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {coverNum}
              </Box>
            ) : (
              <Iconify icon={COVER_ICON_MAP[coverIcon] || 'mdi:lightning-bolt'} width={46} />
            )}
            {coverLabel && (
              <Box sx={{ fontWeight: 600, fontSize: 12.5, opacity: 0.95 }}>
                {coverLabel}
              </Box>
            )}
          </Stack>
        )}
      </Box>

      {uploadError && (
        <Typography sx={{ fontSize: 11.5, color: 'error.main', mt: '6px' }}>
          {uploadError}
        </Typography>
      )}

      {/* Graphic mode controls */}
      {!isImageMode && (
        <Box sx={{ mt: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <CoverCtrlRow label="Nền gradient">
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.keys(COVER_GRADS).map((k) => {
                const on = k === coverGrad;
                return (
                  <Box
                    key={k}
                    role="button"
                    onClick={() => onChange?.({ coverGrad: k })}
                    sx={{
                      width: 30, height: 30, borderRadius: R2, cursor: 'pointer',
                      border: `2px solid ${on ? '#000' : 'transparent'}`,
                      boxShadow: on ? '0 0 0 2px #fff inset' : 'none',
                      background: COVER_GRADS[k],
                      transition: 'all 0.12s',
                      '&:hover': { transform: 'scale(1.08)' },
                    }}
                  />
                );
              })}
            </Box>
          </CoverCtrlRow>

          <CoverCtrlRow label="Kiểu">
            <Box
              sx={{
                display: 'inline-flex', gap: '4px', p: '3px',
                bgcolor: 'grey.100', border: 1, borderColor: 'divider', borderRadius: R2,
              }}
            >
              {[
                { v: 'icon',   label: 'Biểu tượng' },
                { v: 'number', label: 'Chữ nổi bật' },
              ].map((s) => {
                const on = graphicKind === s.v;
                return (
                  <Box
                    key={s.v}
                    component="button"
                    type="button"
                    onClick={() => setGraphicKind(s.v)}
                    sx={{
                      height: 30, px: '12px', border: 0,
                      bgcolor: on ? 'background.paper' : 'transparent',
                      borderRadius: R1,
                      color: on ? 'primary.dark' : 'text.secondary',
                      fontSize: 12.5, fontWeight: 600,
                      whiteSpace: 'nowrap', cursor: 'pointer',
                      transition: 'all 0.12s',
                      boxShadow: on ? '0 1px 2px rgba(145,158,171,0.16)' : 'none',
                      '&:hover': { color: 'text.primary' },
                    }}
                  >
                    {s.label}
                  </Box>
                );
              })}
            </Box>
          </CoverCtrlRow>

          {graphicKind === 'icon' && (
            <CoverCtrlRow label="Biểu tượng">
              <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {COVER_ICONS.map((it) => {
                  const on = it.key === coverIcon;
                  return (
                    <Box
                      key={it.key}
                      component="button"
                      type="button"
                      onClick={() => onChange?.({ coverIcon: it.key, coverNum: '' })}
                      sx={{
                        width: 34, height: 34, borderRadius: R2,
                        border: 1, borderColor: on ? 'primary.main' : 'grey.300',
                        bgcolor: on ? 'primary.main' : 'background.paper',
                        color: on ? 'common.white' : 'text.primary',
                        display: 'grid', placeItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.12s',
                        '&:hover': { borderColor: 'primary.main', color: on ? 'common.white' : 'primary.main' },
                      }}
                    >
                      <Iconify icon={it.icon} width={18} />
                    </Box>
                  );
                })}
              </Box>
            </CoverCtrlRow>
          )}

          {graphicKind === 'number' && (
            <CoverCtrlRow label="Chữ / số">
              <Box
                component="input"
                value={coverNum}
                onChange={(e) => onChange?.({ coverNum: e.target.value })}
                placeholder="vd: Top 4"
                maxLength={10}
                sx={(theme) => ({ ...formInputSx(theme), flex: 1, minWidth: 140 })}
              />
            </CoverCtrlRow>
          )}
        </Box>
      )}

      <FormField label="Nhãn ảnh bìa" hint="tuỳ chọn" sx={{ mt: '12px' }}>
        <Box
          component="input"
          {...register('coverLabel')}
          placeholder="vd: Featured · Quý 2/2026"
          sx={formInputSx}
        />
      </FormField>
    </Box>
  );
}

function CoverCtrlRow({ label, children }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <Box sx={{ fontWeight: 600, fontSize: 12, color: 'text.primary', minWidth: 92 }}>
        {label}
      </Box>
      {children}
    </Box>
  );
}

function BigStatBlock({ register }) {
  return (
    <Box
      sx={{
        mt: '14px', p: '12px',
        bgcolor: 'grey.100', borderRadius: R2,
        border: '1px dashed', borderColor: 'grey.400',
      }}
    >
      <Stack
        direction="row" alignItems="center" spacing={0.75}
        sx={{ fontSize: 11, fontWeight: 600, color: 'text.primary', mb: '10px' }}
      >
        <Iconify icon="mdi:trophy-outline" width={14} sx={{ color: 'primary.main' }} />
        <Box>Số nổi bật (chỉ bài hero)</Box>
      </Stack>
      <FormField label="Giá trị" hint="vd: 85">
        <Box component="input" {...register('bigStatVal')} maxLength={10} placeholder="85" sx={formInputSx} />
      </FormField>
      <FormField label="Đơn vị" hint="vd: tỷ, %, x" sx={{ mt: '8px' }}>
        <Box component="input" {...register('bigStatUnit')} maxLength={12} placeholder="tỷ" sx={formInputSx} />
      </FormField>
      <FormField label="Nhãn mô tả" sx={{ mt: '8px' }}>
        <Box component="input" {...register('bigStatLabel')} maxLength={60} placeholder="GMV / tháng đỉnh điểm" sx={formInputSx} />
      </FormField>
    </Box>
  );
}

// ─────────── Autocompletes

const autocompleteSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    padding: '2px 36px 2px 8px !important',
    minHeight: 36,
    borderRadius: R2,
    bgcolor: 'background.paper',
    fontSize: 13.5,
    color: 'text.primary',
    transition: 'all 0.15s',
  },
  '& .MuiOutlinedInput-root fieldset': { borderColor: theme.palette.grey[300] },
  '& .MuiOutlinedInput-root:hover fieldset': { borderColor: theme.palette.grey[400] },
  '& .MuiOutlinedInput-root.Mui-focused fieldset': {
    borderColor: `${theme.palette.primary.main} !important`,
    borderWidth: '1px !important',
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.24)}`,
  },
  '& .MuiAutocomplete-input': { padding: '4px 4px !important' },
});

// Flat category options from mock tree
const CATEGORY_OPTIONS = postCategoriesTree.flatMap((c) =>
  [c, ...(c.children ?? []).map((ch) => ({ ...ch, parent: c.name }))]
);

function CategorySelect({ value, onChange }) {
  const selected = CATEGORY_OPTIONS.find((c) => c.id === value) || null;
  return (
    <Autocomplete
      options={CATEGORY_OPTIONS}
      value={selected}
      onChange={(_e, opt) => onChange?.(opt?.id || '')}
      getOptionLabel={(opt) => opt?.name || ''}
      isOptionEqualToValue={(opt, v) => opt?.id === v?.id}
      openOnFocus fullWidth
      noOptionsText="Chưa có chuyên mục"
      renderOption={(props, opt) => {
        const { key, ...rest } = props;
        return (
        <Box component="li" key={opt.id} {...rest} sx={{ gap: 1 }}>
          <Box
            sx={{
              width: 24, height: 24, borderRadius: R1,
              bgcolor: 'primary.lighter', color: 'primary.dark',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}
          >
            <Iconify icon="mdi:folder-outline" width={14} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ fontWeight: 600, fontSize: 13, color: 'text.primary' }}>
              {opt.parent ? `${opt.parent} / ` : ''}{opt.name}
            </Box>
            {opt.description && (
              <Box sx={{ fontSize: 11, color: 'text.disabled', mt: '2px' }}>{opt.description}</Box>
            )}
          </Box>
          {opt.post_count != null && (
            <Box sx={{ fontSize: 11, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>
              {opt.post_count}
            </Box>
          )}
        </Box>
        );
      }}
      renderInput={(params) => <TextField {...params} placeholder="Chọn chuyên mục…" size="small" />}
      sx={autocompleteSx}
    />
  );
}

const initialsOf = (s = '') => s.trim().split(/\s+/).slice(-2).map((w) => w[0] ?? '').join('').toUpperCase() || '?';

function AuthorSelect({ value, onChange }) {
  const selected = postAuthorsList.find((a) => a.id === value) || null;
  return (
    <Autocomplete
      options={postAuthorsList}
      value={selected}
      onChange={(_e, opt) => onChange?.(opt?.id || '')}
      getOptionLabel={(opt) => opt?.name || ''}
      isOptionEqualToValue={(opt, v) => opt?.id === v?.id}
      openOnFocus fullWidth
      noOptionsText="Chưa có tác giả"
      renderOption={(props, opt) => {
        const { key, ...rest } = props;
        return (
        <Box component="li" key={opt.id} {...rest} sx={{ gap: 1 }}>
          <Avatar
            sx={{
              width: 28, height: 28,
              background: 'linear-gradient(135deg,#818CF8,#4F46E5)',
              fontWeight: 700, fontSize: 11, color: '#fff',
              flexShrink: 0,
            }}
          >
            {initialsOf(opt.name)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ fontWeight: 600, fontSize: 13, color: 'text.primary' }}>{opt.name}</Box>
            {opt.role && (
              <Box sx={{ fontSize: 11, color: 'text.disabled', mt: '2px' }}>{opt.role}</Box>
            )}
          </Box>
        </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Chọn tác giả…"
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: selected ? (
              <Avatar
                sx={{
                  width: 22, height: 22, ml: 0.5,
                  background: 'linear-gradient(135deg,#818CF8,#4F46E5)',
                  fontWeight: 700, fontSize: 10, color: '#fff',
                }}
              >
                {initialsOf(selected.name)}
              </Avatar>
            ) : (
              params.InputProps.startAdornment
            ),
          }}
        />
      )}
      sx={autocompleteSx}
    />
  );
}

const TAG_SUGGESTIONS = [
  'trang-suc-cuoi', 'kim-cuong', 'vang-24k', 'phong-thuy', 'cung-hoang-dao',
  'mix-and-match', 'xu-huong', 'giam-gia', 'bst-moi', 'cham-soc-trang-suc',
];

function TagsAutocomplete({ value = [], onChange }) {
  const normalize = (raw) => String(raw || '').trim().replace(/^#/, '').toLowerCase();
  return (
    <Autocomplete
      multiple freeSolo openOnFocus filterSelectedOptions
      options={TAG_SUGGESTIONS}
      value={value}
      onChange={(_e, next) => {
        const cleaned = Array.from(new Set(next.map(normalize).filter(Boolean)));
        onChange?.(cleaned);
      }}
      noOptionsText="Nhập để thêm thẻ mới"
      renderTags={(items, getTagProps) =>
        items.map((t, i) => {
          const { key, ...rest } = getTagProps({ index: i });
          return (
            <Chip
              key={key}
              {...rest}
              label={`#${t}`}
              size="small"
              sx={{
                height: 26, borderRadius: R1,
                bgcolor: 'primary.lighter', color: 'primary.dark',
                fontWeight: 600, fontSize: 12,
                '& .MuiChip-deleteIcon': {
                  color: 'primary.dark', fontSize: 14,
                  '&:hover': { color: 'error.main' },
                },
              }}
            />
          );
        })
      }
      renderOption={(props, opt) => {
        const { key, ...rest } = props;
        return (
        <Box component="li" key={opt} {...rest} sx={{ gap: 1 }}>
          <Box sx={{ fontSize: 12, color: 'primary.dark', fontFamily: 'monospace', flexShrink: 0 }}>#</Box>
          <Box sx={{ fontWeight: 600, fontSize: 13, color: 'text.primary', flex: 1 }}>{opt}</Box>
        </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={value.length ? 'Thêm thẻ…' : 'Chọn hoặc nhập thẻ rồi Enter…'}
          size="small"
        />
      )}
      sx={(theme) => ({
        ...autocompleteSx(theme),
        '& .MuiOutlinedInput-root': {
          ...autocompleteSx(theme)['& .MuiOutlinedInput-root'],
          minHeight: 36,
          padding: '4px 36px 4px 8px !important',
          flexWrap: 'wrap', alignItems: 'center', gap: '4px',
        },
      })}
    />
  );
}
