// src/views/admin/gold/gold-pricing-dashboard.jsx
// Dashboard giá vàng — thiết kế hero chuyên biệt + pricing cards lớn + sparkline SVG tự vẽ.

'use client';

import { useMemo, useState } from 'react';

import {
  Avatar, Box, Button, Chip, Divider, Grid, IconButton, InputAdornment, Skeleton, Stack, TextField, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND } from 'src/utils/format';
import { fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetGoldPrices } from 'src/actions/gold-price/gold-price';
import { useGetGoldPriceHistory } from 'src/actions/admin/gold-price';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { mockGoldPriceRegions } from 'src/mock-data';

const goldPriceRegionsList = mockGoldPriceRegions;

// Palette flat — dùng accent 1 màu/group. Không dùng icon header để gọn gàng.
const GROUP_META = {
  bar:          { label: 'Vàng miếng',  accent: '#C9A961', soft: '#FBF7EC' },
  ring:         { label: 'Nhẫn tròn',   accent: '#B8863B', soft: '#FAF4E3' },
  jewelry:      { label: 'Trang sức',   accent: '#8C6B2E', soft: '#F5EFDF' },
  raw_material: { label: 'Nguyên liệu', accent: '#6B5A3E', soft: '#F0ECE1' },
};

// ---------------------- Sparkline SVG tự vẽ, không depend lib ----------------------
function Sparkline({ series, width = 120, height = 36, color = '#F9A825' }) {
  if (!series?.length) return null;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const dx = width / (series.length - 1);
  const dy = max === min ? 0 : height / (max - min);
  const path = series
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * dx).toFixed(2)} ${(height - (v - min) * dy).toFixed(2)}`)
    .join(' ');
  // Area fill path
  const area = `${path} L${width} ${height} L0 ${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color.replace('#','')})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------- Skeleton khi đang refresh ----------------------
function PricingCardSkeleton() {
  return (
    <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" sx={{ px: 1.75, py: 1, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Skeleton variant="rectangular" width={4} height={12} sx={{ mr: 0.75, borderRadius: 0.5 }} />
        <Skeleton variant="text" width={90} height={14} />
        <Box sx={{ flex: 1 }} />
        <Skeleton variant="rounded" width={32} height={18} />
      </Stack>
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="40%" height={12} />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="50%" height={10} />
            <Skeleton variant="text" width="90%" height={28} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="50%" height={10} />
            <Skeleton variant="text" width="90%" height={28} />
          </Box>
        </Stack>
        <Skeleton variant="rounded" width="100%" height={36} sx={{ mt: 1.5 }} />
      </Box>
    </Box>
  );
}

// ---------------------- Pricing Card — ticker-style flat ----------------------
function PricingCard({ priceRow, goldType, onEdit }) {
  const goldPricesHistory = useGetGoldPriceHistory().searchResults;
  const meta = GROUP_META[goldType.group] ?? GROUP_META.jewelry;
  const spread = priceRow.sell - priceRow.buy;
  const isUp = (priceRow.change_pct ?? 0) >= 0;
  const hasChange = priceRow.change_pct !== 0;

  const spark = goldPricesHistory.slice(-10).map((h) => h.buy);

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderLeft: 3,
        borderLeftColor: meta.accent,
        borderRadius: 1,
        overflow: 'hidden',
        transition: 'border-color .15s ease',
        '&:hover': { borderColor: meta.accent },
      }}
    >
      {/* Header strip — label group (typography-only, không icon) */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 1.75, py: 1,
          bgcolor: meta.soft,
          borderBottom: 1, borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 4, height: 12, borderRadius: 0.5, bgcolor: meta.accent }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700, letterSpacing: 0.8, fontSize: 10,
              textTransform: 'uppercase', color: meta.accent,
            }}
          >
            {meta.label}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 10, fontWeight: 600, color: 'text.secondary',
            bgcolor: 'background.paper', px: 0.75, py: 0.125, borderRadius: 0.5,
            border: 1, borderColor: 'divider',
          }}
        >
          {priceRow.karat_label}
        </Typography>
      </Stack>

      {/* Body */}
      <Box sx={{ px: 1.75, py: 1.5 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Typography
            variant="subtitle2"
            sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, flex: 1, pr: 1 }}
          >
            {priceRow.gold_type_name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.25}
            sx={{
              bgcolor: !hasChange ? 'grey.100' : isUp ? 'success.lighter' : 'error.lighter',
              color:   !hasChange ? 'text.secondary' : isUp ? 'success.darker' : 'error.darker',
              px: 0.75, py: 0.25, borderRadius: 0.75,
            }}
          >
            {hasChange && (
              <Iconify
                icon={isUp ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'}
                width={12}
              />
            )}
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11 }}>
              {hasChange ? `${isUp ? '+' : ''}${priceRow.change_pct.toFixed(2)}%` : '—'}
            </Typography>
          </Stack>
        </Stack>

        {/* Prices — dual column separated by vertical rule */}
        <Stack direction="row" sx={{ mt: 1.5 }} divider={<Box sx={{ width: '1px', bgcolor: 'divider', mx: 1.5 }} />}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8, color: 'text.disabled', mb: 0.25 }}>
              ◂ MUA
            </Typography>
            <Typography
              sx={{
                fontSize: 17, fontWeight: 700, lineHeight: 1.1,
                color: 'text.primary',
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontFeatureSettings: '"tnum"',
              }}
            >
              {fmtVND(priceRow.buy)}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8, color: 'text.disabled', mb: 0.25 }}>
              BÁN ▸
            </Typography>
            <Typography
              sx={{
                fontSize: 17, fontWeight: 700, lineHeight: 1.1,
                color: meta.accent,
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontFeatureSettings: '"tnum"',
              }}
            >
              {fmtVND(priceRow.sell)}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Footer: spread + sparkline + edit */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{ px: 1.75, py: 0.75, borderTop: '1px dashed', borderColor: 'divider', bgcolor: 'grey.50' }}
      >
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography
            variant="caption"
            sx={{ fontSize: 10, color: 'text.disabled', fontWeight: 600, letterSpacing: 0.4 }}
          >
            CHÊNH
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700, color: 'text.primary', fontSize: 11,
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            }}
          >
            {fmtVND(spread)}
          </Typography>
        </Stack>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Sparkline series={spark} color={meta.accent} width={100} height={22} />
        </Box>
        <Tooltip title="Sửa nhanh giá">
          <IconButton size="small" onClick={() => onEdit?.(priceRow)} sx={{ color: 'text.secondary', '&:hover': { color: meta.accent } }}>
            <Iconify icon="solar:pen-linear" width={14} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}

// ---------------------- Main view ----------------------
export function GoldPricingDashboard({ embedded = false } = {}) {
  const goldTypesList = useGetGoldPriceHistory().searchResults;
  const [editing, setEditing] = useState(null);
  const [editBuy, setEditBuy] = useState('');
  const [editSell, setEditSell] = useState('');

  // Realtime từ PNJ public API — fallback khi API fail hoặc đang load
  const { prices: livePrices, pricesLoading, pricesError, lastUpdated, refresh } = useGetGoldPrices();
  // Local overrides (admin sửa tay) — key theo gold_type_code
  const [overrides, setOverrides] = useState({});

  // Merge live + overrides
  const prices = useMemo(() => {
    if (!livePrices?.length) return [];
    return livePrices.map((p) => {
      const o = overrides[p.gold_type_code];
      return o ? { ...p, buy: o.buy, sell: o.sell, updated_at: o.updated_at, _dirty: true } : p;
    });
  }, [livePrices, overrides]);

  const defaultRegion = goldPriceRegionsList.find((r) => r.is_default) ?? { code: 'HCM', name: 'TP.HCM' };
  const typesByCode = useMemo(() => {
    const from = Object.fromEntries(goldTypesList.map((t) => [t.code, t]));
    // Fallback meta cho code từ API chưa có trong mock
    prices.forEach((p) => {
      if (!from[p.gold_type_code]) {
        from[p.gold_type_code] = {
          code: p.gold_type_code,
          name: p.gold_type_name,
          karat_label: p.karat_label,
          group: p.group || 'bar',
        };
      }
    });
    return from;
  }, [prices]);

  const openEdit = (row) => {
    setEditing(row);
    setEditBuy(String(row.buy));
    setEditSell(String(row.sell));
  };
  const saveEdit = () => {
    setOverrides((o) => ({
      ...o,
      [editing.gold_type_code]: {
        buy:  Number(editBuy)  || editing.buy,
        sell: Number(editSell) || editing.sell,
        updated_at: new Date().toISOString(),
      },
    }));
    setEditing(null);
  };

  const summary = useMemo(() => {
    if (!prices.length) return { avgChange: 0, highest: null, spread: 0 };
    const avgChange = prices.reduce((s, p) => s + (p.change_pct ?? 0), 0) / prices.length;
    const highest = prices.reduce((m, p) => (p.sell > (m?.sell ?? 0) ? p : m), prices[0]);
    const spread = prices.reduce((s, p) => s + (p.sell - p.buy), 0) / prices.length;
    return { avgChange, highest, spread };
  }, [prices]);

  const Wrap = embedded ? Box : DashboardContent;
  const wrapProps = embedded ? {} : { disablePadding: true };
  return (
    <Wrap {...wrapProps}>
      {!embedded && (
      <PageHeader
        title="Bảng giá vàng"
        subtitle="Cập nhật giá theo từng vùng — đăng trực tiếp lên website & máy POS cửa hàng"
        breadcrumbs={[
          { label: 'Quản trị PNJ', href: adminPaths.dashboard },
          { label: 'Danh mục' },
          { label: 'Giá vàng' },
        ]}
      />
      )}

      {/* HERO — luxury gold + crimson palette */}
      <Box
        sx={{
          m: { xs: 2, md: 3 },
          borderRadius: 1,
          p: { xs: 2.5, md: 3 },
          color: 'common.white',
          background: `
            linear-gradient(135deg, #3B0A0A 0%, #6D0F0F 45%, #4A0D0D 100%)
          `,
          border: '1px solid',
          borderColor: 'rgba(212, 175, 55, 0.35)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gold shimmer overlays */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 15% 10%, rgba(255,215,0,0.22) 0%, transparent 42%)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', right: -80, bottom: -80, width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,168,37,0.28) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Diagonal gold highlight */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(120deg, transparent 40%, rgba(255,215,0,0.08) 50%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        {/* Top gold accent line */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent 0%, #D4AF37 20%, #FFD700 50%, #D4AF37 80%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ md: 'center' }}
          spacing={2}
          sx={{ position: 'relative' }}
        >
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 8, height: 8, borderRadius: '50%',
                  bgcolor: pricesError ? '#EF4444' : pricesLoading ? '#F59E0B' : '#10B981',
                  boxShadow: pricesError
                    ? '0 0 0 4px rgba(239, 68, 68, 0.2)'
                    : pricesLoading ? '0 0 0 4px rgba(245, 158, 11, 0.2)'
                    : '0 0 0 4px rgba(16, 185, 129, 0.2)',
                  animation: pricesLoading ? 'pulse 1.4s infinite' : 'none',
                  '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
                }}
              />
              <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', fontSize: 10.5 }}>
                {pricesError ? 'LỖI KẾT NỐI · dùng giá tạm' : pricesLoading ? 'ĐANG TẢI' : 'TRỰC TIẾP · PNJ'} · {defaultRegion?.name ?? 'HCM'}
              </Typography>
            </Stack>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900, mb: 0.5,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE89A 60%, #D4AF37 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.015em',
              }}
            >
              Giá vàng ngày {fDateTime(new Date(), 'DD/MM/YYYY')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,232,154,0.75)' }}>
              Lần cập nhật gần nhất: <b style={{ color: '#FFE89A' }}>{lastUpdated ? fDateTime(lastUpdated, 'HH:mm, DD/MM') : '—'}</b>
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="solar:refresh-bold" width={14} />}
            onClick={() => refresh?.()}
            disabled={pricesLoading}
            sx={{
              color: '#FFE89A',
              borderColor: 'rgba(212,175,55,0.5)',
              bgcolor: 'rgba(0,0,0,0.2)',
              fontWeight: 700, px: 1.75,
              backdropFilter: 'blur(4px)',
              alignSelf: { xs: 'flex-start', md: 'center' },
              flexShrink: 0,
              '&:hover': {
                borderColor: '#FFD700',
                bgcolor: 'rgba(212,175,55,0.15)',
                color: '#FFD700',
              },
              '&.Mui-disabled': { color: 'rgba(255,232,154,0.4)', borderColor: 'rgba(212,175,55,0.2)' },
            }}
          >
            Làm mới
          </Button>
        </Stack>
      </Box>

      {/* Pricing grid */}
      <Box sx={{ px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {prices.length} loại vàng
          </Typography>
          <Chip label="Nhấn biểu tượng bút để sửa nhanh" size="small" variant="outlined" sx={{ height: 20, fontSize: 10.5 }} />
          {pricesError && (
            <Chip
              icon={<Iconify icon="solar:danger-circle-bold" width={12} />}
              label={`Lỗi tải dữ liệu: ${pricesError.message ?? 'không kết nối được'}`}
              size="small"
              color="error"
              sx={{ height: 20, fontSize: 10.5 }}
            />
          )}
        </Stack>

        {pricesLoading ? (
          <Grid container spacing={2}>
            {Array.from({ length: Math.max(prices.length, 6) }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
                <PricingCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : prices.length === 0 ? (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 10, color: 'text.disabled' }}>
            <Iconify icon="solar:box-minimalistic-linear" width={40} />
            <Typography variant="body2">Không có dữ liệu giá vàng</Typography>
            <Button size="small" variant="outlined" onClick={() => refresh?.()} startIcon={<Iconify icon="solar:refresh-linear" width={13} />}>
              Thử lại
            </Button>
          </Stack>
        ) : (
          <Grid container spacing={2}>
            {prices.map((p) => {
              const type = typesByCode[p.gold_type_code];
              if (!type) return null;
              return (
                <Grid key={p.gold_type_code} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <PricingCard priceRow={p} goldType={type} onEdit={openEdit} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Quick-edit modal inline */}
      {editing && (
        <Box
          sx={{
            position: 'fixed', inset: 0, zIndex: 1300,
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'grid', placeItems: 'center',
          }}
          onClick={() => setEditing(null)}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              bgcolor: 'background.paper', borderRadius: 2, p: 3,
              width: 420, maxWidth: '90vw',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Sửa nhanh · {editing.gold_type_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Loại {editing.karat_label} · {defaultRegion?.name}
            </Typography>

            <Stack spacing={2} sx={{ mt: 2.5 }}>
              <TextField
                label="Giá mua" fullWidth size="small"
                value={editBuy}
                onChange={(e) => setEditBuy(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">₫</InputAdornment> }}
              />
              <TextField
                label="Giá bán" fullWidth size="small"
                value={editSell}
                onChange={(e) => setEditSell(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">₫</InputAdornment> }}
              />
            </Stack>

            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button onClick={() => setEditing(null)} color="inherit">Huỷ</Button>
              <Button variant="contained" onClick={saveEdit} startIcon={<Iconify icon="solar:check-circle-bold" width={14} />}>Lưu & Đăng</Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Wrap>
  );
}
