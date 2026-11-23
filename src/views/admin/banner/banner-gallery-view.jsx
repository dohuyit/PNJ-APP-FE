// src/views/admin/banner/banner-gallery-view.jsx
// Masonry gallery UI · ảnh banner theo tỉ lệ thật, overlay hover để xem metrics.

'use client';

import { useMemo, useState } from 'react';

import {
  Box, Button, Chip, Dialog, IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtNumber, fmtDate } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetBannerList } from 'src/actions/admin/banner';

import { Iconify } from 'src/components/iconify';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';
import { GridCardSkeleton } from 'src/components/common/skeletons';

import { BannerFormDrawer } from './banner-create-drawer';


const POSITION_META = {
  home_hero:      { label: 'Hero',          color: '#EF4444', icon: 'solar:gallery-wide-bold' },
  home_mid:       { label: 'Mid banner',    color: '#F59E0B', icon: 'solar:gallery-bold' },
  category_strip: { label: 'Strip DM',      color: '#3B82F6', icon: 'solar:widget-bold' },
  popup:          { label: 'Popup',         color: '#A855F7', icon: 'solar:popup-bold' },
  mobile_hero:    { label: 'Mobile hero',   color: '#10B981', icon: 'solar:iphone-bold' },
};

const POSITION_OPTS = [
  { value: 'all',            label: 'Mọi vị trí',     icon: 'solar:layers-minimalistic-linear' },
  { value: 'home_hero',      label: 'Hero',           icon: 'solar:gallery-wide-linear' },
  { value: 'home_mid',       label: 'Mid banner',     icon: 'solar:gallery-linear' },
  { value: 'category_strip', label: 'Strip danh mục', icon: 'solar:widget-linear' },
  { value: 'popup',          label: 'Popup',          icon: 'solar:popup-linear' },
  { value: 'mobile_hero',    label: 'Mobile hero',    icon: 'solar:iphone-linear' },
];

const STATUS_OPTS = [
  { value: 'all',      label: 'Mọi trạng thái', icon: 'solar:layers-minimalistic-linear' },
  { value: 'active',   label: 'Đang hiển thị',  dot: 'success.main' },
  { value: 'draft',    label: 'Nháp',           dot: 'warning.main' },
  { value: 'inactive', label: 'Đã ẩn',          dot: 'text.disabled' },
];

const TIME_OPTS = [
  { value: 'all',     label: 'Mọi thời gian',    icon: 'solar:infinity-linear' },
  { value: 'ending',  label: 'Sắp hết hạn (7d)', dot: 'warning.main' },
  { value: 'expired', label: 'Đã hết hạn',       dot: 'text.disabled' },
];

// -------------------------------------------- Device preview

const DEVICES = {
  desktop: { label: 'Desktop', icon: 'solar:monitor-linear',       width: 1440, viewportW: 800 },
  tablet:  { label: 'Tablet',  icon: 'solar:tablet-linear',        width: 820,  viewportW: 560 },
  mobile:  { label: 'Mobile',  icon: 'solar:iphone-linear',        width: 390,  viewportW: 340 },
};

function BannerPreviewDialog({ banner, onClose, onEdit }) {
  const [device, setDevice] = useState('desktop');
  const spec = DEVICES[device];

  if (!banner) return null;
  const pm = POSITION_META[banner.position] ?? { label: banner.position, color: '#64748B', icon: 'solar:tag-linear' };
  const img = device === 'mobile' && banner.image_mobile ? banner.image_mobile : banner.image_desktop;

  return (
    <Dialog
      open={!!banner}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' } }}
    >
      {/* Header */}
      <Stack
        direction="row" alignItems="center" spacing={1.5}
        sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}
      >
        <Box sx={{
          width: 34, height: 34, borderRadius: 0.75,
          bgcolor: pm.color + '14', color: pm.color,
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Iconify icon={pm.icon} width={16} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }} noWrap>
            {banner.title}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
            Vị trí {pm.label} · {banner.image_desktop ? '🖥 Desktop' : ''} {banner.image_mobile ? '📱 Mobile' : ''}
          </Typography>
        </Box>

        {/* Device switch */}
        <ToggleButtonGroup
          size="small"
          exclusive
          value={device}
          onChange={(_, v) => v && setDevice(v)}
          sx={{
            '& .MuiToggleButton-root': {
              px: 1, py: 0.5, fontSize: 11, fontWeight: 600, textTransform: 'none',
              border: 1, borderColor: 'divider',
              '&.Mui-selected': {
                bgcolor: 'primary.lighter', color: 'primary.main',
                borderColor: 'primary.main',
              },
            },
          }}
        >
          {Object.entries(DEVICES).map(([k, d]) => (
            <ToggleButton key={k} value={k}>
              <Iconify icon={d.icon} width={13} sx={{ mr: 0.5 }} />
              {d.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Button
          size="small" variant="outlined"
          onClick={() => onEdit?.(banner)}
          startIcon={<Iconify icon="solar:pen-linear" width={13} />}
          sx={{ boxShadow: 'none', borderColor: 'divider' }}
        >
          Sửa
        </Button>
        <IconButton size="small" onClick={onClose}>
          <Iconify icon="solar:close-circle-linear" width={16} />
        </IconButton>
      </Stack>

      {/* Preview canvas — mô phỏng khung device */}
      <Box sx={{
        bgcolor: 'grey.100',
        p: 3,
        display: 'grid', placeItems: 'center',
        minHeight: 420,
      }}>
        <Box sx={{
          width: spec.viewportW,
          maxWidth: '100%',
          bgcolor: 'common.white',
          border: '12px solid #0F172A',
          borderRadius: device === 'mobile' ? 3 : device === 'tablet' ? 2 : 1,
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Fake browser chrome for desktop/tablet */}
          {device !== 'mobile' && (
            <Stack direction="row" spacing={0.5} sx={{ px: 1, py: 0.75, bgcolor: 'grey.100', borderBottom: 1, borderColor: 'divider' }}>
              {[0, 1, 2].map((i) => (
                <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: ['#EF4444', '#F59E0B', '#10B981'][i] }} />
              ))}
              <Box sx={{
                ml: 1, flex: 1, bgcolor: 'common.white', border: 1, borderColor: 'divider', borderRadius: 0.5,
                px: 1, fontSize: 9.5, color: 'text.disabled',
                display: 'flex', alignItems: 'center',
              }}>
                www.pnj.com.vn
              </Box>
            </Stack>
          )}
          {/* Mobile notch */}
          {device === 'mobile' && (
            <Box sx={{ height: 20, bgcolor: '#0F172A', position: 'relative', mt: '-12px' }}>
              <Box sx={{
                position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
                width: 80, height: 14, bgcolor: '#0F172A', borderRadius: 1,
              }} />
            </Box>
          )}
          <Box
            component="img"
            src={img}
            alt={banner.title}
            sx={{ display: 'block', width: '100%', height: 'auto' }}
            onError={(e) => {
              e.currentTarget.style.aspectRatio = device === 'mobile' ? '9/16' : '16/9';
              e.currentTarget.style.background = `linear-gradient(135deg, ${pm.color}22, ${pm.color}44)`;
            }}
          />
          {banner.link_url && (
            <Box sx={{ px: 1.5, py: 1, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Iconify icon="solar:link-linear" width={11} sx={{ color: 'text.disabled' }} />
                <Typography sx={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'text.disabled' }} noWrap>
                  {banner.link_url}
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>

      {/* Meta row */}
      <Stack
        direction="row" spacing={2} alignItems="center"
        sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Iconify icon="solar:eye-linear" width={12} sx={{ color: 'text.disabled' }} />
          <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
            {fmtNumber(banner.impression_count ?? 0)} impressions
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Iconify icon="solar:cursor-linear" width={12} sx={{ color: 'text.disabled' }} />
          <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
            {fmtNumber(banner.click_count ?? 0)} clicks
          </Typography>
        </Stack>
        {banner.impression_count > 0 && (
          <Chip
            label={`CTR ${((banner.click_count / banner.impression_count) * 100).toFixed(2)}%`}
            size="small"
            sx={{ height: 20, fontSize: 10.5, fontWeight: 700, bgcolor: 'success.lighter', color: 'success.dark' }}
          />
        )}
        <Box sx={{ flex: 1 }} />
        {banner.start_at && (
          <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
            Bắt đầu {fmtDate(banner.start_at)}
          </Typography>
        )}
        {banner.end_at && (
          <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
            → {fmtDate(banner.end_at)}
          </Typography>
        )}
      </Stack>
    </Dialog>
  );
}

// -------------------------------------------- Timeline view

const DAY = 86_400_000;

function TimelineView({ banners, onPreview }) {
  const { lanes, dayLabels, totalDays, todayPct } = useMemo(() => {
    const now = Date.now();
    const start = now - 14 * DAY;
    const end = now + 30 * DAY;
    const tDays = Math.floor((end - start) / DAY);

    // Group by position
    const grouped = {};
    banners.forEach((b) => {
      if (!b.start_at && !b.end_at) return;
      const key = b.position ?? 'other';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(b);
    });

    const laneList = Object.entries(grouped).map(([pos, items]) => ({
      position: pos,
      meta: POSITION_META[pos] ?? { label: pos, color: '#64748B', icon: 'solar:tag-linear' },
      items: items.map((b) => {
        const s = new Date(b.start_at ?? now).getTime();
        const e = new Date(b.end_at ?? s + 7 * DAY).getTime();
        const leftPct = Math.max(0, Math.min(100, ((s - start) / (end - start)) * 100));
        const rightPct = Math.max(0, Math.min(100, ((e - start) / (end - start)) * 100));
        return { ...b, leftPct, widthPct: Math.max(1.5, rightPct - leftPct) };
      }).sort((a, b) => a.leftPct - b.leftPct),
    }));

    // Day labels — every ~5 days
    const labels = [];
    for (let i = 0; i <= tDays; i += Math.ceil(tDays / 8)) {
      const d = new Date(start + i * DAY);
      labels.push({ pct: (i / tDays) * 100, label: `${d.getDate()}/${d.getMonth() + 1}` });
    }

    const tPct = ((now - start) / (end - start)) * 100;

    return { lanes: laneList, dayLabels: labels, totalDays: tDays, todayPct: tPct };
  }, [banners]);

  if (lanes.length === 0) {
    return (
      <Stack alignItems="center" spacing={1.5} sx={{ py: 10, color: 'text.disabled' }}>
        <Iconify icon="solar:calendar-linear" width={40} />
        <Typography variant="body2">Chưa có banner nào có lịch chạy</Typography>
      </Stack>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      {/* Axis header */}
      <Stack direction="row" sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Box sx={{ width: 160, px: 2, py: 1, borderRight: 1, borderColor: 'divider' }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
            Vị trí
          </Typography>
        </Box>
        <Box sx={{ flex: 1, position: 'relative', py: 1, px: 1 }}>
          {dayLabels.map((l, i) => (
            <Typography
              key={i}
              sx={{
                position: 'absolute', top: 6,
                left: `${l.pct}%`,
                transform: 'translateX(-50%)',
                fontSize: 9.5, color: 'text.disabled', fontFamily: 'ui-monospace, monospace',
                fontWeight: 600,
              }}
            >
              {l.label}
            </Typography>
          ))}
        </Box>
      </Stack>

      {/* Lanes */}
      {lanes.map((lane) => (
        <Stack key={lane.position} direction="row" sx={{ borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{
            width: 160, px: 2, py: 1.5, borderRight: 1, borderColor: 'divider', flexShrink: 0,
          }}>
            <Box sx={{
              width: 24, height: 24, borderRadius: 0.5,
              bgcolor: lane.meta.color + '14', color: lane.meta.color,
              display: 'grid', placeItems: 'center',
            }}>
              <Iconify icon={lane.meta.icon} width={12} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: 'text.primary' }} noWrap>
                {lane.meta.label}
              </Typography>
              <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>
                {lane.items.length} banner
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ flex: 1, position: 'relative', minHeight: 56, py: 1 }}>
            {/* Today line */}
            <Box sx={{
              position: 'absolute', top: 0, bottom: 0, left: `${todayPct}%`,
              width: 1, bgcolor: 'primary.main', zIndex: 2,
            }} />
            <Box sx={{
              position: 'absolute', top: -2, left: `${todayPct}%`,
              transform: 'translateX(-50%)',
              fontSize: 8.5, fontWeight: 800, color: 'primary.main', letterSpacing: 0.4,
              bgcolor: 'background.paper', px: 0.5,
              zIndex: 3,
            }}>
              HÔM NAY
            </Box>

            {/* Bars */}
            {lane.items.map((b, i) => (
              <Tooltip key={b.id} title={`${b.title} · ${fmtDate(b.start_at)} → ${fmtDate(b.end_at)}`}>
                <Box
                  onClick={() => onPreview?.(b)}
                  sx={{
                    position: 'absolute',
                    top: 8 + i * 22,
                    height: 18,
                    left: `${b.leftPct}%`,
                    width: `${b.widthPct}%`,
                    bgcolor: lane.meta.color,
                    opacity: b.status === 'active' ? 0.85 : b.status === 'draft' ? 0.4 : 0.6,
                    borderRadius: 0.5,
                    display: 'flex', alignItems: 'center',
                    px: 0.75,
                    cursor: 'pointer',
                    transition: 'opacity .18s, transform .18s',
                    '&:hover': { opacity: 1, transform: 'translateY(-1px)' },
                  }}
                >
                  <Typography sx={{
                    fontSize: 9.5, fontWeight: 700,
                    color: 'common.white',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {b.title}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Stack>
      ))}
    </Box>
  );
}

// -------------------------------------------- Masonry card

function BannerTile({ banner, onEdit }) {
  const pm = POSITION_META[banner.position] ?? { label: banner.position, color: '#64748B', icon: 'solar:tag-linear' };
  const ctr = banner.impression_count ? ((banner.click_count / banner.impression_count) * 100).toFixed(1) : null;
  const isActive = banner.status === 'active';

  return (
    <Box
      sx={{
        breakInside: 'avoid',
        mb: 2,
        position: 'relative',
        borderRadius: 1,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'border-color .15s ease, box-shadow .15s ease',
        '&:hover': {
          borderColor: 'text.disabled',
          boxShadow: '0 2px 6px rgba(145, 158, 171, 0.14)',
          '& .banner-actions': { opacity: 1, transform: 'translateY(0)' },
          '& .banner-img': { transform: 'scale(1.02)' },
        },
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', bgcolor: 'grey.100', overflow: 'hidden' }}>
        <Box
          component="img"
          className="banner-img"
          src={banner.image_desktop}
          alt={banner.title}
          sx={{
            display: 'block', width: '100%', height: 'auto',
            transition: 'transform .35s ease',
          }}
          loading="lazy"
          onError={(e) => { e.currentTarget.style.aspectRatio = '16/9'; e.currentTarget.style.background = pm.color + '22'; }}
        />

        {/* Position badge · top-left, flat & subtle */}
        <Box
          sx={{
            position: 'absolute', top: 8, left: 8,
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            px: 0.875, py: 0.25,
            borderRadius: '4px',
            bgcolor: 'rgba(17,24,39,0.72)',
            color: 'common.white',
            fontSize: 10.5, fontWeight: 600, letterSpacing: 0.2,
            backdropFilter: 'blur(6px)',
          }}
        >
          <Iconify icon={pm.icon} width={11} />
          {pm.label}
        </Box>

        {/* Floating action buttons · chỉ hiện khi hover, không có overlay che toàn image */}
        <Stack
          className="banner-actions"
          direction="row" spacing={0.5}
          sx={{
            position: 'absolute', top: 8, right: 8,
            opacity: 0,
            transform: 'translateY(-4px)',
            transition: 'opacity .2s ease, transform .2s ease',
          }}
        >
          <Tooltip title="Sửa banner">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onEdit(banner); }}
              sx={{
                width: 28, height: 28,
                bgcolor: 'rgba(255,255,255,0.95)',
                color: 'text.primary',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                '&:hover': { bgcolor: 'common.white' },
              }}
            >
              <Iconify icon="solar:pen-linear" width={14} />
            </IconButton>
          </Tooltip>
          {banner.link_url && (
            <Tooltip title="Mở link">
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); window.open(banner.link_url, '_blank'); }}
                sx={{
                  width: 28, height: 28,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  color: 'text.primary',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  '&:hover': { bgcolor: 'common.white' },
                }}
              >
                <Iconify icon="solar:external-link-linear" width={14} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Box>

      {/* Info strip · always visible, clean */}
      <Box sx={{ px: 1.5, py: 1.25 }}>
        {/* Title row với status dot */}
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.25 }}>
          <Tooltip title={isActive ? 'Đang hiển thị' : banner.status === 'draft' ? 'Nháp' : 'Đã ẩn'}>
            <Box sx={{
              width: 7, height: 7, borderRadius: '50%',
              bgcolor: isActive ? 'success.main' : banner.status === 'draft' ? 'warning.main' : 'grey.400',
              flexShrink: 0,
            }} />
          </Tooltip>
          <Typography noWrap sx={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: 'text.primary' }}>
            {banner.title}
          </Typography>
        </Stack>

        {banner.subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, display: 'block', mb: 0.75 }} noWrap>
            {banner.subtitle}
          </Typography>
        )}

        {/* Metrics row */}
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mt: 0.75 }}>
          <Stack direction="row" alignItems="center" spacing={0.375}>
            <Iconify icon="solar:eye-linear" width={11} sx={{ color: 'text.disabled' }} />
            <Typography variant="caption" sx={{ fontSize: 10.5, fontFamily: 'monospace', color: 'text.secondary' }}>
              {fmtNumber(banner.impression_count ?? 0)}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.375}>
            <Iconify icon="solar:cursor-linear" width={11} sx={{ color: 'text.disabled' }} />
            <Typography variant="caption" sx={{ fontSize: 10.5, fontFamily: 'monospace', color: 'text.secondary' }}>
              {fmtNumber(banner.click_count ?? 0)}
            </Typography>
          </Stack>
          {ctr && (
            <Box sx={{
              display: 'inline-flex', alignItems: 'center',
              px: 0.625, py: 0.125, borderRadius: 0.5,
              bgcolor: 'grey.100',
              fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: 'text.primary',
            }}>
              {ctr}% CTR
            </Box>
          )}
          <Box sx={{ flex: 1 }} />
          {banner.end_at && (
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10, fontFamily: 'monospace' }}>
              {fmtDate(banner.end_at)}
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

// -------------------------------------------- Main

export function BannerGalleryView({ embedded = false } = {}) {
  const { searchResults: bannersList, searchLoading: bannersLoading } = useGetBannerList();
  const [editing, setEditing]       = useState(null);
  const [previewing, setPreviewing] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewMode, setViewMode]     = useState('gallery'); // 'gallery' | 'timeline'
  const [search, setSearch]   = useState('');
  const [position, setPos]    = useState('all');
  const [status, setStatus]   = useState('all');
  const [timeRange, setTime]  = useState('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bannersList.filter((b) => {
      if (q && !b.title.toLowerCase().includes(q)) return false;
      if (position !== 'all' && b.position !== position) return false;
      if (status   !== 'all' && b.status   !== status)   return false;
      if (timeRange !== 'all' && b.end_at) {
        const daysLeft = (new Date(b.end_at) - Date.now()) / 86_400_000;
        if (timeRange === 'ending'  && !(daysLeft >= 0 && daysLeft <= 7)) return false;
        if (timeRange === 'expired' && daysLeft > 0) return false;
      }
      return true;
    });
  }, [bannersList, search, position, status, timeRange]);

  const hasFilter = search || position !== 'all' || status !== 'all' || timeRange !== 'all';

  const Wrap = embedded ? Box : DashboardContent;
  const wrapProps = embedded ? {} : { disablePadding: true };
  if (bannersLoading) {
    return <Wrap {...wrapProps}><GridCardSkeleton count={9} cols={{ xs: 12, sm: 6, md: 4 }} imageHeight={200} /></Wrap>;
  }
  return (
    <Wrap {...wrapProps}>
      {!embedded && (
      <PageHeader
        title="Thư viện Banner"
        subtitle="Masonry gallery · xem ảnh theo tỉ lệ thật, hover để đọc metrics, click để sửa"
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Marketing' },
          { label: 'Banner' },
        ]}
        actions={
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:add-circle-bold" width={16} />}
            onClick={() => setCreateOpen(true)}
          >
            Tạo banner
          </Button>
        }
      />
      )}

      {/* Filter toolbar · dùng FilterBar shared giống order/product + view toggle */}
      <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <FilterBar
          searchValue={search}
          onSearch={setSearch}
          placeholder="Tìm banner…"
          filters={[
            { value: position,  onChange: setPos,    options: POSITION_OPTS, minWidth: 170 },
            { value: status,    onChange: setStatus, options: STATUS_OPTS,   minWidth: 170 },
            { value: timeRange, onChange: setTime,   options: TIME_OPTS,     minWidth: 180 },
          ]}
          onReset={hasFilter ? () => { setSearch(''); setPos('all'); setStatus('all'); setTime('all'); } : undefined}
          extra={
            <ToggleButtonGroup
              size="small"
              exclusive
              value={viewMode}
              onChange={(_, v) => v && setViewMode(v)}
              sx={{
                ml: 1,
                '& .MuiToggleButton-root': {
                  px: 1.25, py: 0.5, fontSize: 11, fontWeight: 600, textTransform: 'none',
                  border: 1, borderColor: 'divider',
                  '&.Mui-selected': {
                    bgcolor: 'primary.lighter', color: 'primary.main',
                    borderColor: 'primary.main',
                  },
                },
              }}
            >
              <ToggleButton value="gallery">
                <Iconify icon="solar:gallery-wide-linear" width={13} sx={{ mr: 0.5 }} />
                Gallery
              </ToggleButton>
              <ToggleButton value="timeline">
                <Iconify icon="solar:calendar-linear" width={13} sx={{ mr: 0.5 }} />
                Lịch chạy
              </ToggleButton>
            </ToggleButtonGroup>
          }
        />
      </Box>

      {/* Content area: Gallery hoặc Timeline */}
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 3, bgcolor: 'grey.50', minHeight: '60vh' }}>
        {filtered.length === 0 ? (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 10, color: 'text.disabled' }}>
            <Iconify icon="solar:gallery-wide-linear" width={40} />
            <Typography variant="body2">Không có banner phù hợp</Typography>
          </Stack>
        ) : viewMode === 'timeline' ? (
          <Box sx={{ pt: 2 }}>
            <TimelineView banners={filtered} onPreview={setPreviewing} />
          </Box>
        ) : (
          <Box
            sx={{
              pt: 2,
              columnCount: { xs: 1, sm: 2, md: 3, lg: 4 },
              columnGap: 2,
            }}
          >
            {filtered.map((b) => (
              <Box key={b.id} onClick={() => setPreviewing(b)} sx={{ cursor: 'pointer' }}>
                <BannerTile banner={b} onEdit={setEditing} />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <BannerPreviewDialog
        banner={previewing}
        onClose={() => setPreviewing(null)}
        onEdit={(b) => { setPreviewing(null); setEditing(b); }}
      />

      <BannerFormDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(v) => console.log('create banner', v)}
      />
      <BannerFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update banner', v)}
      />
    </Wrap>
  );
}
