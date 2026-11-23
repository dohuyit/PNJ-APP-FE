// src/views/admin/page/page-create-drawer.jsx — Full-width drawer tạo/sửa trang tĩnh CMS

'use client';

import { useEffect, useState } from 'react';

import CloseOutlined from '@mui/icons-material/CloseOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import {
  Box, Button, Chip, Divider, FormControlLabel, Grid, LinearProgress, MenuItem, Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';

import { SectionCard, FieldLabel } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { SlugInput } from 'src/components/common/slug-input';
import { FormDrawer } from 'src/components/common/form-drawer';
import { Editor } from 'src/components/editor';

const TYPES = [
  { value: 'about',   label: 'Về chúng tôi',   icon: 'solar:info-circle-linear' },
  { value: 'guide',   label: 'Hướng dẫn',      icon: 'solar:book-linear' },
  { value: 'policy',  label: 'Chính sách',     icon: 'solar:shield-check-linear' },
  { value: 'service', label: 'Dịch vụ',        icon: 'solar:hand-stars-linear' },
];

const STATUSES = [
  { value: 'active',   label: 'Đang hiển thị', icon: 'solar:check-circle-linear' },
  { value: 'draft',    label: 'Nháp',          icon: 'solar:document-text-linear' },
  { value: 'inactive', label: 'Tạm ẩn',        icon: 'solar:pause-circle-linear' },
];

const EMPTY = {
  title: '',
  slug: '',
  type: 'about',
  summary: '',
  content_html: '',
  cover_url: '',
  show_in_footer: false,
  show_in_menu: false,
  status: 'draft',
  seo: {
    title: '',
    description: '',
    canonical: '',
    og_image: '',
    schema_type: 'WebPage',
    noindex: false,
  },
};

const SCHEMA_TYPES = ['WebPage', 'AboutPage', 'ContactPage', 'FAQPage', 'Article'];

// ----- Length score: trả về {state: 'empty'|'low'|'good'|'warn'|'over', color, label} -----
function lengthScore(len, { min, ideal, max }) {
  if (len === 0)      return { state: 'empty', color: 'text.disabled', label: 'Trống' };
  if (len < min)      return { state: 'low',   color: 'warning.main',  label: 'Quá ngắn' };
  if (len <= ideal)   return { state: 'good',  color: 'success.main',  label: 'Tốt' };
  if (len <= max)     return { state: 'warn',  color: 'warning.main',  label: 'Dài' };
  return                     { state: 'over',  color: 'error.main',    label: 'Vượt giới hạn' };
}

function LengthMeter({ len, min, ideal, max }) {
  const score = lengthScore(len, { min, ideal, max });
  const pct = Math.min(100, (len / max) * 100);
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <Box sx={{ flex: 1 }}>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 3, borderRadius: 2, bgcolor: 'grey.100',
            '& .MuiLinearProgress-bar': {
              bgcolor: score.color, opacity: 0.8, borderRadius: 2,
            },
          }}
        />
      </Box>
      <Typography sx={{ fontSize: 10.5, color: score.color, fontWeight: 700, fontVariantNumeric: 'tabular-nums', width: 42, textAlign: 'right' }}>
        {len}/{max}
      </Typography>
      <Chip
        label={score.label}
        size="small"
        sx={{
          height: 16, fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
          bgcolor: 'grey.100', color: score.color,
          '& .MuiChip-label': { px: 0.75 },
        }}
      />
    </Stack>
  );
}

// ----- Google SERP preview -----
function SerpPreview({ title, description, slug, canonical }) {
  const url = canonical || `https://www.pnj.com.vn/${slug || 'trang-moi'}`;
  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return (
    <Box sx={{
      p: 1.5,
      bgcolor: '#FFFFFF',
      border: 1, borderColor: 'divider',
      borderRadius: 1,
      fontFamily: 'arial, sans-serif',
    }}>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
        <Box sx={{
          width: 18, height: 18, borderRadius: '50%',
          bgcolor: '#FBF7F2', border: '1px solid #E8DFD4',
          display: 'grid', placeItems: 'center',
          fontSize: 9, fontWeight: 700, color: '#C48C46',
        }}>P</Box>
        <Stack>
          <Typography sx={{ fontSize: 10.5, color: '#202124', fontWeight: 500, lineHeight: 1 }}>
            PNJ
          </Typography>
          <Typography sx={{ fontSize: 10, color: '#4D5156', lineHeight: 1 }}>
            {displayUrl}
          </Typography>
        </Stack>
      </Stack>
      <Typography sx={{
        fontSize: 15, fontWeight: 400,
        color: '#1A0DAB',
        lineHeight: 1.25,
        cursor: 'pointer',
        '&:hover': { textDecoration: 'underline' },
      }}>
        {title || 'Tiêu đề trang (meta title)'}
      </Typography>
      <Typography sx={{
        fontSize: 11.5, color: '#4D5156', lineHeight: 1.4, mt: 0.5,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {description || 'Mô tả ngắn cho SEO (meta description). Nếu bỏ trống, Google sẽ tự chọn đoạn text từ nội dung trang.'}
      </Typography>
    </Box>
  );
}

// ----- OG (Facebook/Zalo) card preview -----
function OgPreview({ title, description, slug, image }) {
  const displayUrl = `www.pnj.com.vn/${slug || 'trang-moi'}`;
  return (
    <Box sx={{
      border: 1, borderColor: 'divider',
      borderRadius: 1, overflow: 'hidden',
      bgcolor: '#F0F2F5',
    }}>
      <Box sx={{
        aspectRatio: '1200 / 630',
        bgcolor: image ? 'grey.900' : 'grey.200',
        display: 'grid', placeItems: 'center',
        color: 'text.disabled',
        position: 'relative',
      }}>
        {image ? (
          <Box
            component="img"
            src={image}
            alt=""
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Stack alignItems="center" spacing={0.5}>
            <Iconify icon="solar:gallery-wide-linear" width={32} />
            <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
              Chưa có OG image · gợi ý 1200×630
            </Typography>
          </Stack>
        )}
      </Box>
      <Box sx={{ px: 1.5, py: 1, bgcolor: '#FFFFFF' }}>
        <Typography sx={{ fontSize: 10, color: '#606770', textTransform: 'uppercase', letterSpacing: 0.2 }}>
          {displayUrl}
        </Typography>
        <Typography sx={{
          fontSize: 13, fontWeight: 600, color: '#050505', lineHeight: 1.25, mt: 0.25,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {title || 'Meta title'}
        </Typography>
        <Typography sx={{
          fontSize: 11, color: '#606770', lineHeight: 1.3, mt: 0.25,
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {description || 'Meta description'}
        </Typography>
      </Box>
    </Box>
  );
}

// ----- Version row -----
function VersionRow({ version, onRevert, onPreview }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{
      px: 1.25, py: 0.875,
      bgcolor: version.current ? 'primary.lighter' : 'background.paper',
      border: 1, borderColor: version.current ? 'primary.main' : 'divider',
      borderRadius: 1,
    }}>
      <Box sx={{
        width: 24, height: 24, borderRadius: 0.5,
        bgcolor: version.current ? 'primary.main' : 'grey.100',
        color: version.current ? 'common.white' : 'text.secondary',
        display: 'grid', placeItems: 'center',
        fontSize: 10, fontWeight: 700,
      }}>
        v{version.rev}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: 'text.primary' }} noWrap>
            {version.title_at}
          </Typography>
          {version.current && (
            <Chip label="HIỆN TẠI" size="small" sx={{ height: 14, fontSize: 8.5, fontWeight: 800, bgcolor: 'primary.main', color: 'common.white', '& .MuiChip-label': { px: 0.5 } }} />
          )}
        </Stack>
        <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>
          {version.author} · {new Date(version.saved_at).toLocaleString('vi-VN')}
        </Typography>
      </Box>
      <Tooltip title="Xem trước phiên bản này">
        <Button
          size="small" variant="text"
          onClick={() => onPreview?.(version)}
          sx={{ minWidth: 0, fontSize: 10.5, color: 'text.secondary' }}
        >
          Xem
        </Button>
      </Tooltip>
      {!version.current && (
        <Tooltip title="Khôi phục phiên bản này">
          <Button
            size="small" variant="outlined"
            onClick={() => onRevert?.(version)}
            sx={{
              minWidth: 0, fontSize: 10.5, fontWeight: 700,
              boxShadow: 'none', borderColor: 'divider',
            }}
            startIcon={<Iconify icon="solar:refresh-circle-linear" width={12} />}
          >
            Khôi phục
          </Button>
        </Tooltip>
      )}
    </Stack>
  );
}

// ----- Mock version history generator -----
function mockVersions(initial) {
  const now = Date.now();
  const author = ['Trần Thị Mai Anh', 'Ngô Phương Linh', 'Nguyễn Hoàng Minh', 'Lưu Khả Ngân'];
  return [
    { rev: 5, title_at: initial?.title ?? 'Trang hiện tại',       author: author[0], saved_at: new Date(now - 2 * 3600_000).toISOString(),  current: true  },
    { rev: 4, title_at: 'Bản nháp chuẩn SEO Q4',                   author: author[1], saved_at: new Date(now - 2 * 86400_000).toISOString(),  current: false },
    { rev: 3, title_at: 'Cập nhật ngân hàng ảnh',                  author: author[0], saved_at: new Date(now - 7 * 86400_000).toISOString(),  current: false },
    { rev: 2, title_at: 'Sửa typo đoạn mở',                        author: author[2], saved_at: new Date(now - 30 * 86400_000).toISOString(), current: false },
    { rev: 1, title_at: 'Khởi tạo nội dung',                       author: author[3], saved_at: new Date(now - 90 * 86400_000).toISOString(), current: false },
  ];
}

export function PageFormDrawer({ open, onClose, onSubmit, initial }) {
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

  const canSubmit = form.title.trim() && form.slug.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa trang · ${initial?.title ?? ''}` : 'Tạo trang tĩnh'}
      subtitle={isEdit ? `/${initial?.slug ?? ''}` : 'Câu chuyện PNJ · Hướng dẫn · Chính sách · Dịch vụ'}
      footer={
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />}
          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: dirty ? 'warning.dark' : 'text.secondary' }}>
            {dirty ? 'Có thay đổi chưa lưu' : isEdit ? 'Chưa có thay đổi' : 'Điền thông tin rồi bấm Tạo'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:eye-linear" width={16} />}
            onClick={() => form.slug && window.open(`/${form.slug}`, '_blank', 'noopener,noreferrer')}
          >
            Preview
          </Button>
          <Button onClick={onClose} color="inherit" startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}>Huỷ</Button>
          <Button
            variant="contained"
            disabled={!canSubmit || submitting || (isEdit && !dirty)}
            startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
            onClick={handleSubmit}
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo trang'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={ArticleOutlined} title="Thông tin trang">
                <Stack spacing={2.25}>
                  <Box>
                    <FieldLabel required>TIÊU ĐỀ</FieldLabel>
                    <TextField
                      value={form.title}
                      onChange={(e) => set('title', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: Chính sách bảo hành trang sức"
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <FieldLabel required>SLUG URL</FieldLabel>
                      <SlugInput label="" sourceName={form.title} value={form.slug} onChange={(v) => set('slug', v)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FieldLabel required>LOẠI</FieldLabel>
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
                    </Grid>
                  </Grid>

                  <Box>
                    <FieldLabel>TÓM TẮT</FieldLabel>
                    <TextField
                      value={form.summary}
                      onChange={(e) => set('summary', e.target.value)}
                      fullWidth size="small" multiline rows={2}
                      placeholder="1-2 câu tóm tắt nội dung trang (dùng cho SEO description nếu trống)."
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard icon={ArticleOutlined} title="Nội dung HTML">
                <Editor value={form.content_html} onChange={(v) => set('content_html', v)} />
              </SectionCard>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard icon={ToggleOnOutlined} title="Trạng thái">
                <Stack spacing={2}>
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
                </Stack>
              </SectionCard>

              <SectionCard icon={LayersOutlined} title="Hiển thị trong nav">
                <Stack spacing={0.5}>
                  <FormControlLabel
                    control={<Switch checked={form.show_in_menu} onChange={(_, v) => set('show_in_menu', v)} />}
                    label="Hiện trong menu chính"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                  />
                  <FormControlLabel
                    control={<Switch checked={form.show_in_footer} onChange={(_, v) => set('show_in_footer', v)} />}
                    label="Hiện trong footer"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                  />
                </Stack>
              </SectionCard>

              <SectionCard icon={LanguageOutlined} title="SEO" description="Google SERP + Facebook / Zalo card preview realtime">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>META TITLE</FieldLabel>
                    <TextField
                      value={form.seo.title}
                      onChange={(e) => setSeo('title', e.target.value)}
                      fullWidth size="small"
                      placeholder="Mặc định = tiêu đề trang"
                    />
                    <Box sx={{ mt: 0.5 }}>
                      <LengthMeter len={(form.seo.title ?? form.title ?? '').length} min={30} ideal={60} max={70} />
                    </Box>
                  </Box>
                  <Box>
                    <FieldLabel>META DESCRIPTION</FieldLabel>
                    <TextField
                      value={form.seo.description}
                      onChange={(e) => setSeo('description', e.target.value)}
                      fullWidth size="small" multiline rows={2}
                      placeholder="1-2 câu tóm tắt nội dung — hiện trong kết quả Google + card chia sẻ"
                    />
                    <Box sx={{ mt: 0.5 }}>
                      <LengthMeter len={(form.seo.description ?? form.summary ?? '').length} min={70} ideal={155} max={180} />
                    </Box>
                  </Box>
                  <Box>
                    <FieldLabel>CANONICAL URL</FieldLabel>
                    <TextField
                      value={form.seo.canonical}
                      onChange={(e) => setSeo('canonical', e.target.value)}
                      fullWidth size="small"
                      placeholder="Để trống = tự sinh theo slug"
                      inputProps={{ style: { fontFamily: 'monospace' } }}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>OG IMAGE (Facebook / Zalo)</FieldLabel>
                    <TextField
                      value={form.seo.og_image}
                      onChange={(e) => setSeo('og_image', e.target.value)}
                      fullWidth size="small"
                      placeholder="URL ảnh 1200×630"
                      inputProps={{ style: { fontFamily: 'monospace' } }}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>SCHEMA TYPE</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.seo.schema_type}
                      onChange={(e) => setSeo('schema_type', e.target.value)}
                    >
                      {SCHEMA_TYPES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </TextField>
                  </Box>
                  <FormControlLabel
                    control={<Switch checked={!!form.seo.noindex} onChange={(_, v) => setSeo('noindex', v)} />}
                    label="Chặn index (noindex)"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                  />

                  <Divider sx={{ my: 1 }} />

                  {/* SERP preview */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75 }}>
                      <Iconify icon="solar:magnifer-linear" width={12} sx={{ color: 'text.disabled' }} />
                      <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
                        Google SERP preview
                      </Typography>
                    </Stack>
                    <SerpPreview
                      title={form.seo.title || form.title}
                      description={form.seo.description || form.summary}
                      slug={form.slug}
                      canonical={form.seo.canonical}
                    />
                  </Box>

                  {/* OG preview */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75 }}>
                      <Iconify icon="solar:share-linear" width={12} sx={{ color: 'text.disabled' }} />
                      <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
                        Khi chia sẻ (Facebook / Zalo)
                      </Typography>
                    </Stack>
                    <OgPreview
                      title={form.seo.title || form.title}
                      description={form.seo.description || form.summary}
                      slug={form.slug}
                      image={form.seo.og_image || form.cover_url}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              {/* Version history — chỉ khi edit */}
              {isEdit && (
                <SectionCard icon={HistoryOutlined} title="Lịch sử phiên bản" description="5 lần lưu gần nhất · bấm khôi phục để đưa về bản cũ">
                  <Stack spacing={0.75}>
                    {mockVersions(initial).map((v) => (
                      <VersionRow
                        key={v.rev}
                        version={v}
                        onRevert={(ver) => {
                          if (confirm(`Khôi phục về v${ver.rev}? Nội dung hiện tại sẽ được lưu thành bản mới.`)) {
                            console.log('revert to', ver.rev);
                          }
                        }}
                        onPreview={(ver) => window.alert(`Xem trước v${ver.rev} — tính năng sẽ mở tab mới khi BE wire xong`)}
                      />
                    ))}
                  </Stack>
                </SectionCard>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </FormDrawer>
  );
}
