// src/views/admin/dashboard/dashboard-view.jsx — rich dashboard với 10+ Highcharts

'use client';

import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

// motion re-exported from _shared/motion
import {
  Avatar, Box, Button, Chip, Divider, Grid, IconButton, LinearProgress, MenuItem, Stack, TextField, Tooltip, Typography,
} from '@mui/material';

import { fmtVND, fmtNumber } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetGoldPrices } from 'src/actions/gold-price/gold-price';
import { m, AnimatePresence, scaleIn, staggerContainer, hoverLift, useCountUp, useRealtimeClock } from 'src/views/admin/_shared/motion';
import {
  useGetDashboardKpi, useGetRevenueSeries, useGetTopProducts, useGetOrderStatusBreakdown,
} from 'src/actions/admin/dashboard';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { DateRangePicker } from 'src/components/common/date-range-picker';
import { KpiCardsSkeleton, ChartSkeleton, ListRowsSkeleton } from 'src/components/common/skeletons';

import { HcChart } from './hc-chart';

// Stubs — 4 hook'd inside DashboardView; the rest are safe skeletons so view doesn't crash.
const DASHBOARD_KPI_FALLBACK = { revenue:{value:0,delta_pct:0,spark:[]}, orders:{value:0,delta_pct:0,spark:[]}, aov:{value:0,delta_pct:0,spark:[]}, new_customers:{value:0,delta_pct:0,spark:[]}, conversion:{value:0,delta_pct:0,spark:[]}, returning:{value:0,delta_pct:0,spark:[]} };
const dashboardAlerts = [];
const dashboardChannel = [];
const dashboardCustomerGrowth = [];
const dashboardHeatmap = [];
const dashboardLowStock = [];
const dashboardMonthlyTarget = { current: 0, target: 1 };
const dashboardPayment = [];
const dashboardRecentOrders = [];
const dashboardRegion = [];
const dashboardRevenueByCategory = [];
const dashboardSearchNoResult = [];

// =============================================================================
//                              PRIMITIVES
// =============================================================================

// ---------------------- Gold Price Ticker Strip ----------------------
// Dải ngang trên KPI — chỉ tên vàng + giá mua / giá bán.
// 4 ô hiển thị cùng lúc, tự xoay vòng qua tất cả loại vàng mỗi 4 giây.
const TICKER_VISIBLE = 4;
const TICKER_INTERVAL_MS = 4000;

function GoldTickerCell({ item }) {
  return (
    <Box
      sx={{
        flex: 1, minWidth: 0,
        px: 2, py: 1.5,
        borderLeft: 1, borderColor: 'divider',
        '&:first-of-type': { borderLeft: 0 },
      }}
    >
      <Typography
        sx={{
          fontSize: 11.5, fontWeight: 600, color: 'text.primary',
          mb: 0.75, lineHeight: 1.25,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}
        title={item.gold_type_name}
      >
        {item.gold_type_name}
      </Typography>
      <Stack direction="row" alignItems="baseline" spacing={0.75}>
        <Typography sx={{ fontSize: 10, color: 'text.disabled', minWidth: 22 }}>Mua</Typography>
        <Typography
          sx={{
            fontSize: 13.5, fontWeight: 700,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontFeatureSettings: '"tnum"',
            color: 'text.primary', lineHeight: 1.15,
          }}
        >
          {fmtVND(item.buy)}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ mt: 0.25 }}>
        <Typography sx={{ fontSize: 10, color: 'text.disabled', minWidth: 22 }}>Bán</Typography>
        <Typography
          sx={{
            fontSize: 13.5, fontWeight: 700,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontFeatureSettings: '"tnum"',
            color: '#C9A961', lineHeight: 1.15,
          }}
        >
          {fmtVND(item.sell)}
        </Typography>
      </Stack>
    </Box>
  );
}

function GoldPriceTickerStrip() {
  const { prices, pricesLoading, pricesError, lastUpdated } = useGetGoldPrices();
  const [page, setPage] = useState(0);

  const totalPages = prices.length ? Math.ceil(prices.length / TICKER_VISIBLE) : 1;
  const visible = useMemo(() => {
    if (!prices.length) return [];
    const start = (page % totalPages) * TICKER_VISIBLE;
    const slice = prices.slice(start, start + TICKER_VISIBLE);
    // Nếu trang cuối thiếu ô — pad bằng items đầu để luôn đủ 4 cột
    if (slice.length < TICKER_VISIBLE && prices.length > TICKER_VISIBLE) {
      return [...slice, ...prices.slice(0, TICKER_VISIBLE - slice.length)];
    }
    return slice;
  }, [prices, page, totalPages]);

  // Auto-rotate
  useEffect(() => {
    if (totalPages <= 1) return undefined;
    const id = setInterval(() => setPage((p) => (p + 1) % totalPages), TICKER_INTERVAL_MS);
    return () => clearInterval(id);
  }, [totalPages]);

  if (pricesLoading && prices.length === 0) {
    return (
      <Box sx={{ mb: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1.5, px: 2, py: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#F59E0B',
            boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.18)',
            animation: 'pulse 1.4s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
          }} />
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Đang tải giá vàng PNJ…</Typography>
        </Stack>
      </Box>
    );
  }
  if (pricesError || !visible.length) return null;

  return (
    <Box
      sx={{
        mb: 2,
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 1.5,
        overflow: 'hidden',
      }}
    >
      {/* Mini header */}
      <Stack
        direction="row" alignItems="center" spacing={1}
        sx={{
          px: 2, py: 0.75,
          bgcolor: '#FBF7EC',
          borderBottom: 1, borderColor: '#EFE4C8',
        }}
      >
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981',
          boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.18)' }} />
        <Typography sx={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: '#8C6B2E' }}>
          Giá vàng hôm nay · Trực tiếp
        </Typography>
        <Box sx={{ flex: 1 }} />
        {/* Trang chỉ báo */}
        {totalPages > 1 && (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mr: 1 }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: i === page % totalPages ? 14 : 4,
                  height: 4, borderRadius: 2,
                  bgcolor: i === page % totalPages ? '#8C6B2E' : '#D6C8A0',
                  transition: 'width .3s ease, background-color .3s ease',
                }}
              />
            ))}
          </Stack>
        )}
        <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>
          Cập nhật {lastUpdated ? dayjs(lastUpdated).format('HH:mm, DD/MM') : '—'} · nguồn PNJ
        </Typography>
      </Stack>

      {/* Row — fade khi đổi trang */}
      <AnimatePresence mode="wait">
        <Stack
          component={m.div}
          key={page}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          direction={{ xs: 'column', md: 'row' }}
        >
          {visible.map((p, i) => (
            <GoldTickerCell key={`${p.gold_type_code}-${i}`} item={p} />
          ))}
        </Stack>
      </AnimatePresence>
    </Box>
  );
}

// ---------------------- TrendBadge ----------------------
// Chip tăng/giảm % so với kỳ trước — dùng chung cho các card biểu đồ.
function TrendBadge({ delta, label = 'vs kỳ trước', size = 'sm' }) {
  if (delta == null || Number.isNaN(delta)) return null;
  const isUp = delta >= 0;
  const px = size === 'lg' ? 1.25 : 1;
  const py = size === 'lg' ? 0.5  : 0.375;
  const iconW = size === 'lg' ? 14 : 12;
  const fontPct = size === 'lg' ? 12.5 : 11;
  return (
    <Stack
      direction="row" alignItems="center" spacing={0.4}
      sx={{
        bgcolor: isUp ? '#F0FDF4' : '#FEF2F2',
        border: 1, borderColor: isUp ? '#BBF7D0' : '#FECACA',
        px, py, borderRadius: 1, flexShrink: 0,
      }}
    >
      <Iconify
        icon={isUp ? 'solar:arrow-right-up-bold' : 'solar:arrow-right-down-bold'}
        width={iconW}
        sx={{ color: isUp ? '#059669' : '#DC2626' }}
      />
      <Typography sx={{ fontWeight: 700, color: isUp ? '#059669' : '#DC2626', fontSize: fontPct, lineHeight: 1 }}>
        {isUp ? '+' : ''}{Number(delta).toFixed(1)}%
      </Typography>
      {label && (
        <Typography sx={{ fontSize: 10, color: 'text.disabled', ml: 0.25 }}>
          {label}
        </Typography>
      )}
    </Stack>
  );
}

function ChartCard({ title, subtitle, action, children }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 2.5,
        boxShadow: '0 1px 2px rgba(145, 158, 171, 0.08)',
        display: 'flex', flexDirection: 'column', height: '100%',
        overflow: 'hidden',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2.25, py: 1.75 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 13, fontWeight: 600,
              color: 'text.primary', lineHeight: 1.3, letterSpacing: 0.1,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                fontSize: 11, fontWeight: 400,
                color: 'text.disabled', display: 'block', mt: 0.25,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
      <Box sx={{ p: 1.5, pt: 0, flex: 1 }}>{children}</Box>
    </Box>
  );
}

function StatCardWithSpark({ icon, label, value, delta, spark, color, format }) {
  const isUp = delta >= 0;
  const animated = useCountUp(value, { duration: 1400, decimals: format === 'pct' ? 1 : 0 });
  const options = useMemo(() => ({
    chart: { type: 'areaspline', backgroundColor: 'transparent', margin: [2, 0, 2, 0], height: 44 },
    title: { text: null },
    xAxis: { visible: false }, yAxis: { visible: false },
    legend: { enabled: false }, tooltip: { enabled: false },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.3, lineWidth: 2, marker: { enabled: false },
        states: { hover: { enabled: false } },
        fillColor: { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, color + '66'], [1, color + '00']] },
      },
    },
    series: [{ data: spark, color }],
  }), [spark, color]);

  return (
    <m.div variants={scaleIn} {...hoverLift} style={{ height: '100%' }}>
      <Box
        sx={{
          bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2.5,
          p: 2, position: 'relative', overflow: 'hidden', height: '100%',
          boxShadow: '0 1px 2px rgba(145, 158, 171, 0.08)',
          transition: 'border-color .2s ease',
          '&:hover': { borderColor: color + '55' },
        }}
      >
        {/* Decorative corner glow — theo màu KPI */}
        <Box
          sx={{
            position: 'absolute', top: -40, right: -40,
            width: 120, height: 120, borderRadius: '50%',
            background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        {/* Thin color bar trái cho mỗi card */}
        <Box
          sx={{
            position: 'absolute', top: 10, bottom: 10, left: 0,
            width: 3, borderRadius: '0 2px 2px 0',
            bgcolor: color,
            opacity: 0.5,
          }}
        />

        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1} sx={{ position: 'relative' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: 32, height: 32, borderRadius: 1.25,
                display: 'grid', placeItems: 'center',
                bgcolor: color + '1A', color,
              }}
            >
              <Iconify icon={icon} width={16} />
            </Box>
            <Typography
              sx={{
                color: 'text.secondary', fontWeight: 500, letterSpacing: 0.2,
                fontSize: 11.5, lineHeight: 1.25,
              }}
            >
              {label}
            </Typography>
          </Stack>
          <Stack
            direction="row" alignItems="center" spacing={0.25}
            sx={{
              bgcolor: isUp ? '#F0FDF4' : '#FEF2F2',
              px: 0.75, py: 0.3, borderRadius: 10,
              border: 1, borderColor: isUp ? '#BBF7D0' : '#FECACA',
              flexShrink: 0,
            }}
          >
            <Iconify icon={isUp ? 'solar:arrow-right-up-bold' : 'solar:arrow-right-down-bold'} width={10} sx={{ color: isUp ? '#059669' : '#DC2626' }} />
            <Typography sx={{ fontWeight: 700, color: isUp ? '#059669' : '#DC2626', fontSize: 10 }}>
              {Math.abs(delta).toFixed(1)}%
            </Typography>
          </Stack>
        </Stack>

        <Typography
          sx={{
            fontWeight: 700, fontSize: 24, lineHeight: 1.1, mt: 1.5,
            color: 'text.primary', fontVariantNumeric: 'tabular-nums',
            position: 'relative',
          }}
        >
          {format === 'vnd' ? fmtVND(animated) : format === 'pct' ? `${animated}%` : fmtNumber(animated)}
        </Typography>

        <Typography sx={{ fontSize: 10.5, color: 'text.disabled', mt: 0.25, position: 'relative' }}>
          so với 30 ngày trước
        </Typography>

        <Box sx={{ mt: 0.75, mx: -2, mb: -2, position: 'relative' }}>
          <HcChart options={options} height={44} />
        </Box>
      </Box>
    </m.div>
  );
}

// ================== WELCOME BANNER — deprecated, dead code giữ cho đến khi dọn ==================

// eslint-disable-next-line no-unused-vars
function greetingVN(hour) {
  if (hour < 5)  return { label: 'Chúc ngủ ngon', icon: 'solar:moon-stars-bold' };
  if (hour < 11) return { label: 'Chào buổi sáng', icon: 'solar:sunrise-bold' };
  if (hour < 14) return { label: 'Chào buổi trưa', icon: 'solar:sun-bold' };
  if (hour < 18) return { label: 'Chào buổi chiều', icon: 'solar:sun-2-bold' };
  return { label: 'Chào buổi tối', icon: 'solar:moon-bold' };
}

// eslint-disable-next-line no-unused-vars
function WelcomeBanner() {
  const now = useRealtimeClock();
  const greet = greetingVN(now.getHours());
  const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  // Palette đơn sắc trang sức: ngà (#FAF7F2) · vàng champagne (#C9A961) · dark slate (#1C2434)
  const GOLD = '#C9A961';
  const GOLD_DARK = '#9A7D3A';
  const INK  = '#1C2434';

  return (
    <Box
      sx={{
        mx: { xs: 2, md: 3 }, mt: 2,
        borderRadius: 2.5, overflow: 'hidden', position: 'relative',
        bgcolor: '#FAF7F2',
        border: 1, borderColor: 'rgba(201, 169, 97, 0.2)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {/* Vàng champagne đường chéo nhẹ bên phải — minimal luxury */}
      <Box sx={{
        position: 'absolute', right: -80, top: -40,
        width: 280, height: 280,
        background: `radial-gradient(circle, ${GOLD}18 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />
      {/* Line pattern diagonal — hoa văn tinh xảo */}
      <Box sx={{
        position: 'absolute', inset: 0, opacity: 0.4,
        backgroundImage: `repeating-linear-gradient(135deg, transparent 0 20px, ${GOLD}0A 20px 21px)`,
        pointerEvents: 'none',
      }} />

      <Stack
        direction="row" alignItems="center" spacing={3}
        sx={{ p: { xs: 2.5, md: 3 }, position: 'relative' }}
        flexWrap="wrap" rowGap={2}
      >
        {/* Ornament — monogram tinh tế thay mascot */}
        <Box
          sx={{
            position: 'relative',
            width: 64, height: 64, flexShrink: 0,
          }}
        >
          {/* Vòng ngoài vàng mỏng */}
          <Box sx={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1.5px solid', borderColor: GOLD + '66',
          }} />
          {/* Vòng trong đậm */}
          <Box sx={{
            position: 'absolute', inset: 6, borderRadius: '50%',
            border: '1px solid', borderColor: GOLD,
            bgcolor: '#FFFFFF',
            display: 'grid', placeItems: 'center',
          }}>
            <Iconify icon={greet.icon} width={24} sx={{ color: GOLD_DARK }} />
          </Box>
          {/* 4 chấm góc kim cương tượng trưng */}
          {[0, 90, 180, 270].map((deg) => (
            <Box
              key={deg}
              sx={{
                position: 'absolute', top: '50%', left: '50%',
                width: 4, height: 4, borderRadius: '50%', bgcolor: GOLD,
                transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-34px)`,
                transformOrigin: 'center',
              }}
            />
          ))}
        </Box>

        {/* Greeting + date */}
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* Divider line trước greeting để sang trọng kiểu editorial */}
            <Box sx={{ width: 24, height: 1, bgcolor: GOLD }} />
            <Typography sx={{ fontSize: 10.5, color: GOLD_DARK, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
              {greet.label}
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontSize: 24, fontWeight: 400, color: INK, lineHeight: 1.2, mt: 0.75,
              fontFamily: '"Playfair Display", "Be Vietnam Pro", serif',
              letterSpacing: -0.3,
            }}
          >
            Quản trị viên PNJ
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.75, textTransform: 'capitalize', letterSpacing: 0.15 }}>
            {dateStr} · <b style={{ fontFamily: 'monospace', color: INK, fontWeight: 500 }}>{timeStr}</b>
          </Typography>
        </Box>

        {/* Quick stats — minimal luxe không nhiều màu */}
        <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', rowGap: 1 }} divider={
          <Box sx={{ width: 1, height: 40, bgcolor: GOLD + '33', alignSelf: 'center' }} />
        }>
          {[
            { label: 'Đơn hôm nay',  value: '52', icon: 'solar:bag-linear' },
            { label: 'Khách mới',    value: '18', icon: 'solar:user-plus-linear' },
            { label: 'Hoàn tất',     value: '41', icon: 'solar:check-circle-linear' },
          ].map((s) => (
            <Stack key={s.label} direction="row" alignItems="center" spacing={1.25} sx={{ px: 2 }}>
              <Iconify icon={s.icon} width={16} sx={{ color: GOLD_DARK }} />
              <Box>
                <Typography sx={{ fontSize: 9.5, color: 'text.disabled', lineHeight: 1.1, fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {s.label}
                </Typography>
                <Typography sx={{ fontSize: 17, fontWeight: 600, color: INK, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums', mt: 0.2 }}>
                  {s.value}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* Viền vàng mảnh dưới banner */}
      <Box sx={{ height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
    </Box>
  );
}

// ================== SMART ALERT BAR — rotate alerts theo tình hình ==================
const DASHBOARD_ALERTS = [
  {
    severity: 'critical',
    icon: 'solar:box-minimalistic-bold',
    headline: '8 sản phẩm sắp hết hàng',
    body:     'Trong đó 3 SP top-seller đã ở ngưỡng &lt; 3 tồn — nguy cơ miss order',
    cta:      { label: 'Kiểm tra kho', href: '/admin/inventory' },
  },
  {
    severity: 'warning',
    icon: 'solar:clock-circle-bold',
    headline: '14 đơn hàng chờ xác nhận quá 2h',
    body:     'CSKH cần gọi xác nhận trước giờ cut-off 11:00 để kịp giao 3H',
    cta:      { label: 'Xem đơn', href: '/admin/order?status=pending' },
  },
  {
    severity: 'info',
    icon: 'solar:chat-round-dots-bold',
    headline: '26 đánh giá chờ duyệt',
    body:     '3 đánh giá 1 sao cần phản hồi trong 24h để không ảnh hưởng điểm shop',
    cta:      { label: 'Duyệt ngay', href: '/admin/review' },
  },
  {
    severity: 'success',
    icon: 'solar:cup-star-bold',
    headline: 'Doanh thu tuần đã vượt KPI 115%',
    body:     'Mục tiêu 2.1 tỷ · thực hiện 2.4 tỷ · có thể nới room khuyến mãi',
  },
];

const SEVERITY_META = {
  critical: { bg: 'linear-gradient(135deg, #FEE2E2 0%, #FEF3F2 100%)', ringColor: '#EF4444', iconColor: '#B91C1C', title: '#991B1B', tag: 'Khẩn cấp',       tagBg: '#EF4444' },
  warning:  { bg: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)', ringColor: '#F59E0B', iconColor: '#B45309', title: '#92400E', tag: 'Cần xử lý',    tagBg: '#F59E0B' },
  info:     { bg: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)', ringColor: '#3B82F6', iconColor: '#1D4ED8', title: '#1E3A8A', tag: 'Thông báo',    tagBg: '#3B82F6' },
  success:  { bg: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)', ringColor: '#10B981', iconColor: '#047857', title: '#065F46', tag: 'Tin vui',       tagBg: '#10B981' },
};

function SmartAlertBar() {
  const now = useRealtimeClock();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = DASHBOARD_ALERTS.length;

  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 5500);
    return () => clearInterval(t);
  }, [paused, total]);

  const alert = DASHBOARD_ALERTS[idx];
  const meta = SEVERITY_META[alert.severity];
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        mx: { xs: 2, md: 3 }, mt: 2,
        borderRadius: 2.5,
        border: 1, borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 1px 2px rgba(145, 158, 171, 0.08)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <AnimatePresence mode="wait">
        <m.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Stack
            direction="row" alignItems="center" spacing={2}
            sx={{ p: 1.75, background: meta.bg, position: 'relative' }}
          >
            {/* Icon circle */}
            <Box
              sx={{
                width: 42, height: 42, borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.9)',
                display: 'grid', placeItems: 'center',
                color: meta.iconColor, flexShrink: 0,
                boxShadow: `0 0 0 3px ${meta.ringColor}22`,
              }}
            >
              <Iconify icon={alert.icon} width={20} />
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }} flexWrap="wrap">
                <Chip
                  label={meta.tag}
                  size="small"
                  sx={{
                    bgcolor: meta.tagBg, color: 'common.white',
                    fontWeight: 600, fontSize: 10, height: 18, letterSpacing: 0.3,
                    textTransform: 'uppercase',
                  }}
                />
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: meta.title, lineHeight: 1.3 }}>
                  {alert.headline}
                </Typography>
              </Stack>
              <Typography
                sx={{ fontSize: 11.5, color: 'text.secondary', fontWeight: 400 }}
                dangerouslySetInnerHTML={{ __html: alert.body }}
              />
            </Box>

            {/* CTA button */}
            {alert.cta && (
              <Button
                size="small"
                variant="contained"
                endIcon={<Iconify icon="solar:arrow-right-linear" width={13} />}
                onClick={() => (window.location.href = alert.cta.href)}
                sx={{
                  bgcolor: meta.ringColor, color: 'common.white',
                  fontWeight: 600, textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: meta.iconColor, boxShadow: 'none' },
                  flexShrink: 0,
                }}
              >
                {alert.cta.label}
              </Button>
            )}

            {/* Controls */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0, pl: 1, borderLeft: 1, borderColor: 'rgba(0,0,0,0.08)' }}>
              <Typography sx={{ fontSize: 10.5, color: 'text.disabled', fontFamily: 'monospace' }}>
                {String(idx + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setIdx((i) => (i - 1 + total) % total)}
                sx={{ color: 'text.secondary', width: 22, height: 22 }}
              >
                <Iconify icon="solar:alt-arrow-left-linear" width={12} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setIdx((i) => (i + 1) % total)}
                sx={{ color: 'text.secondary', width: 22, height: 22 }}
              >
                <Iconify icon="solar:alt-arrow-right-linear" width={12} />
              </IconButton>
              <Typography sx={{ fontSize: 10.5, color: 'text.disabled', ml: 0.5, fontFamily: 'monospace' }}>
                · {timeStr}
              </Typography>
            </Stack>
          </Stack>

          {/* Progress bar auto-rotate */}
          <Box sx={{
            height: 2, bgcolor: 'rgba(0,0,0,0.04)',
            position: 'relative', overflow: 'hidden',
          }}>
            <Box sx={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              bgcolor: meta.ringColor,
              animation: paused ? 'none' : 'alertProgress 5.5s linear',
              '@keyframes alertProgress': {
                '0%':   { width: '0%' },
                '100%': { width: '100%' },
              },
            }} />
          </Box>
        </m.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', bottom: 6, right: 12 }}>
        {DASHBOARD_ALERTS.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIdx(i)}
            sx={{
              width: i === idx ? 14 : 5, height: 5, borderRadius: 3,
              bgcolor: i === idx ? SEVERITY_META[DASHBOARD_ALERTS[i].severity].ringColor : 'rgba(0,0,0,0.15)',
              cursor: 'pointer',
              transition: 'width .3s ease, background-color .3s ease',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

// =============================================================================
//                              SKELETON
// =============================================================================

const CARD_SX = {
  bgcolor: 'background.paper',
  border: 1,
  borderColor: 'divider',
  borderRadius: 2.5,
  boxShadow: '0 1px 2px rgba(145, 158, 171, 0.08)',
  overflow: 'hidden',
  height: '100%',
};

function SkeletonCard({ children, sx }) {
  return <Box sx={{ ...CARD_SX, ...sx }}>{children}</Box>;
}

function DashboardSkeleton() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* KPI row — 6 standalone cards */}
      <Box sx={{ mb: 3 }}>
        <KpiCardsSkeleton count={6} mode="standalone" spacing={2} size={{ xs: 12, sm: 6, md: 4, lg: 2 }} />
      </Box>

      {/* Revenue + Gauge */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <SkeletonCard><ChartSkeleton height={320} variant="bars" /></SkeletonCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <SkeletonCard><ChartSkeleton height={240} variant="line" withTabs={false} /></SkeletonCard>
        </Grid>
      </Grid>

      {/* 3 Donuts */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <SkeletonCard><ChartSkeleton height={240} variant="line" withTabs={false} /></SkeletonCard>
          </Grid>
        ))}
      </Grid>

      {/* Funnel + Region + Heatmap */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <SkeletonCard><ChartSkeleton height={300} variant="bars" withTabs={false} /></SkeletonCard>
          </Grid>
        ))}
      </Grid>

      {/* Growth chart + Alerts list */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <SkeletonCard><ChartSkeleton height={280} variant="line" withTabs={false} /></SkeletonCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <SkeletonCard>
            <Box sx={{ p: 2 }}>
              <ListRowsSkeleton count={4} leadingSize={32} />
            </Box>
          </SkeletonCard>
        </Grid>
      </Grid>

      {/* Top products + Recent orders + Low stock + Search no-result (all list cards) */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SkeletonCard>
            <Box sx={{ p: 2 }}>
              <ListRowsSkeleton count={7} leadingSize={36} withProgress />
            </Box>
          </SkeletonCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SkeletonCard>
            <Box sx={{ p: 2 }}>
              <ListRowsSkeleton count={6} leadingSize={32} />
            </Box>
          </SkeletonCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SkeletonCard>
            <Box sx={{ p: 2 }}>
              <ListRowsSkeleton count={5} leadingSize={36} />
            </Box>
          </SkeletonCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SkeletonCard>
            <Box sx={{ p: 2 }}>
              <ListRowsSkeleton count={5} leadingSize={32} withTrailing={false} />
            </Box>
          </SkeletonCard>
        </Grid>
      </Grid>
    </Box>
  );
}

// =============================================================================
//                              MAIN
// =============================================================================

export function DashboardView() {
  const [range, setRange]   = useState([dayjs().subtract(30, 'day'), dayjs()]);
  const [period, setPeriod] = useState('30d');

  // Wire 4 real hooks; keys fall back to module-level skeletons if API returns null.
  // BE shape: revenue:{current,previous,delta_pct}, orders:{current,previous}, aov, new_customers (scalar).
  // Normalize về shape view expects: {value, delta_pct, spark} cho mỗi KPI.
  const kpiState = useGetDashboardKpi();
  const revenueState = useGetRevenueSeries();
  const topProductsState = useGetTopProducts();
  const funnelState = useGetOrderStatusBreakdown();
  const dashboardLoading = kpiState.loading || revenueState.loading || topProductsState.loading || funnelState.loading;
  const _kpiApi = kpiState.data ?? {};
  const _wrap = (k, valueField = 'current') => ({
    value: typeof _kpiApi[k] === 'number' ? _kpiApi[k] : (_kpiApi[k]?.[valueField] ?? _kpiApi[k]?.value ?? 0),
    delta_pct: _kpiApi[k]?.delta_pct ?? 0,
    spark: _kpiApi[k]?.spark ?? [],
  });
  const dashboardKpi = {
    revenue:       _wrap('revenue'),
    orders:        _wrap('orders'),
    aov:           _wrap('aov'),
    new_customers: _wrap('new_customers'),
    conversion:    _wrap('conversion'),
    returning:     _wrap('returning'),
  };
  const dashboardRevenueSeries = revenueState.items;
  const dashboardTopProducts = topProductsState.items;
  const dashboardOrderFunnel = funnelState.items;

  // Revenue area + column
  const revenueChartOpts = useMemo(() => ({
    chart: { height: 320 },
    title: { text: null },
    xAxis: { categories: dashboardRevenueSeries.map((s) => s.date.slice(5)), tickInterval: 3 },
    yAxis: [
      { labels: { formatter() { return (this.value / 1_000_000).toFixed(0) + 'tr'; } }, title: { text: null } },
      { opposite: true, labels: { enabled: false }, gridLineWidth: 0, title: { text: null } },
    ],
    plotOptions: {
      areaspline: { fillOpacity: 0.2, marker: { enabled: false }, lineWidth: 3 },
      column: { borderWidth: 0, borderRadius: 3 },
    },
    tooltip: {
      shared: true,
      formatter() {
        const rev = this.points?.find((p) => p.series.name === 'Doanh thu');
        const ord = this.points?.find((p) => p.series.name === 'Số đơn');
        return `<b>${this.x}</b><br/>` +
          (rev ? `<span style="color:${rev.color}">●</span> Doanh thu: <b>${fmtVND(rev.y)}</b><br/>` : '') +
          (ord ? `<span style="color:${ord.color}">●</span> Số đơn: <b>${ord.y}</b>` : '');
      },
    },
    legend: { align: 'right', verticalAlign: 'top', floating: true, y: -10 },
    series: [
      { name: 'Doanh thu', type: 'areaspline', data: dashboardRevenueSeries.map((s) => s.revenue), color: '#93C5FD' },
      { name: 'Số đơn',    type: 'column',     data: dashboardRevenueSeries.map((s) => s.orders),  color: '#FCD34D', yAxis: 1 },
    ],
  }), []);

  const categoryDonutOpts = useMemo(() => ({
    chart: { type: 'pie', height: 240 }, title: { text: null },
    plotOptions: {
      pie: {
        innerSize: '65%',
        dataLabels: { enabled: true, formatter() { return `<b>${this.point.name}</b><br/>${((this.y / this.total) * 100).toFixed(1)}%`; }, style: { fontSize: '10px', fontWeight: '600' }, distance: 12 },
        borderWidth: 2, borderColor: '#fff',
      },
    },
    tooltip: { formatter() { return `<b>${this.point.name}</b><br/>${fmtVND(this.y)}`; } },
    series: [{ name: 'Danh mục', data: dashboardRevenueByCategory }],
  }), []);

  const paymentDonutOpts = useMemo(() => ({
    chart: { type: 'pie', height: 240 }, title: { text: null },
    plotOptions: {
      pie: {
        innerSize: '70%',
        dataLabels: { enabled: true, formatter() { return `<b>${this.point.name}</b><br/>${this.y}%`; }, style: { fontSize: '10px', fontWeight: '600' } },
        borderWidth: 2, borderColor: '#fff',
      },
    },
    // Pastel donut payment
    colors: ['#A5B4FC', '#F9A8D4', '#86EFAC', '#A5F3FC', '#FDE68A', '#D8B4FE'],
    series: [{ name: 'PTTT', data: dashboardPayment }],
  }), []);

  const channelDonutOpts = useMemo(() => ({
    chart: { type: 'pie', height: 240 }, title: { text: null },
    plotOptions: {
      pie: {
        innerSize: '55%',
        dataLabels: { enabled: true, formatter() { return `<b>${this.point.name}</b><br/>${this.y}%`; }, style: { fontSize: '10px', fontWeight: '600' } },
        borderWidth: 2, borderColor: '#fff',
      },
    },
    series: [{ name: 'Kênh', data: dashboardChannel }],
  }), []);

  const funnelOpts = useMemo(() => ({
    chart: { type: 'funnel', height: 300, marginRight: 100 }, title: { text: null },
    plotOptions: {
      series: {
        dataLabels: { enabled: true, format: '<b>{point.name}</b><br/>{point.y} đơn', softConnector: true, style: { fontSize: '11px', fontWeight: '600' } },
        center: ['45%', '50%'], neckWidth: '30%', neckHeight: '20%', width: '75%',
      },
    },
    // Pastel funnel — mỗi tầng pastel khác nhau
    colors: ['#FCD34D', '#93C5FD', '#C4B5FD', '#F9A8D4', '#86EFAC', '#6EE7B7'],
    series: [{ name: 'Đơn hàng', data: dashboardOrderFunnel }],
  }), []);

  const regionBarOpts = useMemo(() => ({
    chart: { type: 'bar', height: 300 }, title: { text: null },
    xAxis: { categories: dashboardRegion.map((r) => r.name), lineWidth: 0, tickWidth: 0 },
    yAxis: { labels: { formatter() { return (this.value / 1_000_000_000).toFixed(1) + 'B'; } }, title: { text: null } },
    plotOptions: {
      bar: {
        borderRadius: 4, borderWidth: 0,
        dataLabels: { enabled: true, formatter() { return (this.y / 1_000_000).toFixed(0) + 'tr'; }, style: { fontSize: '10px', fontWeight: '700' } },
        colorByPoint: true,
      },
    },
    legend: { enabled: false },
    tooltip: { formatter() { return `<b>${this.point.name}</b><br/>${fmtVND(this.y)}`; } },
    // Pastel region bar
    colors: ['#FCA5A5', '#FCD34D', '#86EFAC', '#93C5FD', '#D8B4FE', '#D1D5DB'],
    series: [{ name: 'Doanh thu', data: dashboardRegion.map((r) => ({ name: r.name, y: r.y })) }],
  }), []);

  const heatmapOpts = useMemo(() => ({
    chart: { type: 'heatmap', height: 300, marginTop: 20, marginBottom: 60 },
    title: { text: null },
    xAxis: { categories: Array.from({ length: 24 }, (_, i) => `${i}h`), opposite: true },
    yAxis: { categories: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'], title: null, reversed: true },
    colorAxis: { min: 0, minColor: '#F3F4F6', maxColor: '#1E40AF', labels: { style: { fontSize: '10px' } } },
    legend: { align: 'right', verticalAlign: 'top', layout: 'vertical', y: 25, symbolHeight: 160 },
    tooltip: { formatter() { return `Thứ ${this.point.y + 1}, ${this.point.x}h: <b>${this.point.value} đơn</b>`; } },
    series: [{ name: 'Đơn hàng', borderWidth: 0.5, borderColor: '#fff', data: dashboardHeatmap, dataLabels: { enabled: false } }],
  }), []);

  const growthOpts = useMemo(() => ({
    chart: { height: 280 },
    title: { text: null },
    xAxis: { categories: dashboardCustomerGrowth.map((g) => g.month) },
    yAxis: { title: { text: null } },
    plotOptions: { spline: { marker: { radius: 4, lineWidth: 2, lineColor: '#fff' }, lineWidth: 3 } },
    tooltip: { shared: true },
    legend: { align: 'right', verticalAlign: 'top', floating: true, y: -5 },
    series: [
      { name: 'KH mới',    type: 'column', data: dashboardCustomerGrowth.map((g) => g.new),    color: '#FCD34D' },
      { name: 'KH active', type: 'spline', data: dashboardCustomerGrowth.map((g) => g.active), color: '#93C5FD' },
    ],
  }), []);

  const gaugeOpts = useMemo(() => {
    const pct = (dashboardMonthlyTarget.current / dashboardMonthlyTarget.target) * 100;
    // Màu kết quả theo mức — gradient xanh pastel một tầng, không chói
    const ARC_START = '#93C5FD';
    const ARC_END   = '#60A5FA';
    return {
      chart: { type: 'solidgauge', height: 240, backgroundColor: 'transparent', marginTop: 20 },
      title: { text: null },
      pane: {
        center: ['50%', '75%'], size: '140%',
        startAngle: -120, endAngle: 120,
        background: {
          backgroundColor: '#F1F5F9',
          innerRadius: '75%', outerRadius: '100%',
          shape: 'arc', borderWidth: 0,
          borderColor: 'transparent',
        },
      },
      yAxis: {
        min: 0, max: 100,
        // Dải màu gradient pastel từ xanh dương nhạt → xanh dương đậm nhẹ
        stops: [[0, ARC_START], [1, ARC_END]],
        lineWidth: 0, tickWidth: 0,
        minorTickInterval: null, tickAmount: 0,
        labels: { enabled: false },
      },
      plotOptions: {
        solidgauge: {
          innerRadius: '75%',
          rounded: true,
          dataLabels: {
            y: -34, borderWidth: 0, useHTML: true,
            format: `<div style="text-align:center">
                      <div style="font-size:10.5px;color:#94A3B8;font-weight:500;letter-spacing:0.4px;text-transform:uppercase">Hoàn thành</div>
                      <div style="font-size:30px;font-weight:700;line-height:1.1;color:#334155;margin-top:2px">${pct.toFixed(1)}%</div>
                    </div>`,
          },
        },
      },
      series: [{ name: 'Mục tiêu', data: [pct] }],
    };
  }, []);

  const PERIOD_OPTS = [{ v: '7d', l: '7 ngày' }, { v: '30d', l: '30 ngày' }, { v: '90d', l: '90 ngày' }, { v: 'ytd', l: 'YTD' }];

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Tổng quan"
        subtitle="Số liệu kinh doanh thời gian thực — doanh thu · đơn · khách · tồn kho · tiếp thị"
        actions={
          <Stack direction="row" spacing={1}>
            <TextField select size="small" value={period} onChange={(e) => setPeriod(e.target.value)} sx={{ width: 120 }}>
              {PERIOD_OPTS.map((p) => <MenuItem key={p.v} value={p.v}>{p.l}</MenuItem>)}
            </TextField>
            <DateRangePicker value={range} onChange={setRange} />
            <Button variant="outlined" startIcon={<Iconify icon="solar:download-linear" width={16} />}>
              Xuất báo cáo
            </Button>
          </Stack>
        }
      />

      {/* ===== Smart alerts ===== */}
      <SmartAlertBar />

      {dashboardLoading ? (
        <DashboardSkeleton />
      ) : (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Gold price ticker — nhắc cái hiệu luôn tình hình thị trường */}
        <GoldPriceTickerStrip />

        {/* 6 KPI với stagger animation + count-up */}
        <Grid
          component={m.div}
          variants={staggerContainer(0.08, 0.1)}
          initial="hidden" animate="show"
          container spacing={2} sx={{ mb: 3 }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}><StatCardWithSpark icon="solar:dollar-bold"    label="Doanh thu 30 ngày" value={dashboardKpi.revenue.value}       delta={dashboardKpi.revenue.delta_pct}       spark={dashboardKpi.revenue.spark}       color="#10B981" format="vnd" /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}><StatCardWithSpark icon="solar:bag-4-bold"      label="Số đơn"             value={dashboardKpi.orders.value}        delta={dashboardKpi.orders.delta_pct}        spark={dashboardKpi.orders.spark}        color="#3B82F6" format="num" /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}><StatCardWithSpark icon="solar:cart-large-bold" label="Giá trị đơn trung bình"   value={dashboardKpi.aov.value}           delta={dashboardKpi.aov.delta_pct}           spark={dashboardKpi.aov.spark}           color="#F59E0B" format="vnd" /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}><StatCardWithSpark icon="solar:user-plus-bold"  label="Khách mới"          value={dashboardKpi.new_customers.value} delta={dashboardKpi.new_customers.delta_pct} spark={dashboardKpi.new_customers.spark} color="#A855F7" format="num" /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}><StatCardWithSpark icon="solar:graph-up-bold"   label="Tỷ lệ chuyển đổi"         value={dashboardKpi.conversion.value}    delta={dashboardKpi.conversion.delta_pct}    spark={dashboardKpi.conversion.spark}    color="#EC4899" format="pct" /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}><StatCardWithSpark icon="solar:refresh-bold"    label="% KH quay lại"      value={dashboardKpi.returning.value}     delta={dashboardKpi.returning.delta_pct}     spark={dashboardKpi.returning.spark}     color="#06B6D4" format="pct" /></Grid>
        </Grid>

        {/* Revenue + Gauge */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <ChartCard
              title="Doanh thu & số đơn 30 ngày"
              subtitle="Vùng doanh thu kết hợp cột số đơn trên hai trục"
              action={<TrendBadge delta={dashboardKpi.revenue.delta_pct} label="vs 30 ngày trước" size="lg" />}
            >
              <HcChart options={revenueChartOpts} height={320} />
            </ChartCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <ChartCard
              title="Mục tiêu tháng"
              subtitle={`${fmtVND(dashboardMonthlyTarget.current)} / ${fmtVND(dashboardMonthlyTarget.target)}`}
              action={
                <TrendBadge
                  delta={((dashboardMonthlyTarget.current / dashboardMonthlyTarget.target) - (new Date().getDate() / 30)) * 100}
                  label="so với tiến độ"
                />
              }
            >
              <HcChart options={gaugeOpts} height={240} />
              <Stack direction="row" spacing={1} justifyContent="space-around" sx={{ mt: 1, mb: 1, px: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10.5, fontWeight: 600 }}>ĐẠT ĐƯỢC</Typography>
                  <Typography sx={{ fontWeight: 800, color: 'success.main', fontSize: 15 }}>{fmtVND(dashboardMonthlyTarget.current)}</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10.5, fontWeight: 600 }}>CÒN THIẾU</Typography>
                  <Typography sx={{ fontWeight: 800, color: 'warning.dark', fontSize: 15 }}>
                    {fmtVND(dashboardMonthlyTarget.target - dashboardMonthlyTarget.current)}
                  </Typography>
                </Box>
              </Stack>
            </ChartCard>
          </Grid>
        </Grid>

        {/* 3 Donuts */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ChartCard
              title="Doanh thu theo danh mục"
              subtitle="Năm nhóm hàng chủ lực"
              action={<TrendBadge delta={dashboardKpi.revenue.delta_pct} label="vs tháng trước" />}
            >
              <HcChart options={categoryDonutOpts} height={240} />
            </ChartCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}><ChartCard title="Phương thức thanh toán"   subtitle="Tỷ trọng đơn theo cổng thanh toán"><HcChart options={paymentDonutOpts}   height={240} /></ChartCard></Grid>
          <Grid size={{ xs: 12, md: 4 }}><ChartCard title="Kênh bán hàng"             subtitle="Website · Ứng dụng · Cửa hàng · Tổng đài"><HcChart options={channelDonutOpts} height={240} /></ChartCard></Grid>
        </Grid>

        {/* Funnel + Region + Heatmap */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}><ChartCard title="Phễu đơn hàng" subtitle="Tỷ lệ chuyển đổi qua từng trạng thái"><HcChart options={funnelOpts} height={300} /></ChartCard></Grid>
          <Grid size={{ xs: 12, md: 4 }}><ChartCard title="Vùng mang doanh thu lớn nhất" subtitle="Doanh thu theo khu vực kinh doanh"><HcChart options={regionBarOpts} height={300} /></ChartCard></Grid>
          <Grid size={{ xs: 12, md: 4 }}><ChartCard title="Hoạt động đơn theo giờ · thứ" subtitle="Bản đồ nhiệt bảy ngày trong tuần"><HcChart options={heatmapOpts} height={300} /></ChartCard></Grid>
        </Grid>

        {/* Growth + Alerts */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <ChartCard
              title="Tăng trưởng khách hàng"
              subtitle="Mười hai tháng — khách mới và khách hoạt động"
              action={<TrendBadge delta={dashboardKpi.new_customers.delta_pct} label="khách mới vs tháng trước" size="lg" />}
            >
              <HcChart options={growthOpts} height={280} />
            </ChartCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <ChartCard title="Cần chú ý ngay" subtitle={`${dashboardAlerts.length} cảnh báo`}>
              <Stack spacing={1}>
                {dashboardAlerts.map((a, i) => {
                  const palette = {
                    danger:  { bg: 'rgba(239,68,68,0.08)',  color: '#B91C1C', border: 'rgba(239,68,68,0.2)' },
                    warning: { bg: 'rgba(245,158,11,0.08)', color: '#B45309', border: 'rgba(245,158,11,0.2)' },
                    info:    { bg: 'rgba(59,130,246,0.08)', color: '#1D4ED8', border: 'rgba(59,130,246,0.2)' },
                    success: { bg: 'rgba(16,185,129,0.08)', color: '#047857', border: 'rgba(16,185,129,0.2)' },
                  }[a.type];
                  return (
                    <Box
                      key={i}
                      sx={{
                        p: 1.5, borderRadius: 1.5, bgcolor: palette.bg, border: 1, borderColor: palette.border,
                        display: 'flex', alignItems: 'center', gap: 1.25,
                        cursor: a.href ? 'pointer' : 'default',
                        '&:hover': a.href ? { transform: 'translateX(2px)' } : {},
                        transition: 'transform .15s ease',
                      }}
                      onClick={() => a.href && (window.location.href = a.href)}
                    >
                      <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'common.white', display: 'grid', placeItems: 'center', color: palette.color, flexShrink: 0 }}>
                        <Iconify icon={a.icon} width={16} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 12.5, color: palette.color }}>{a.title}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>{a.desc}</Typography>
                      </Box>
                      {a.href && <Iconify icon="solar:arrow-right-linear" width={14} sx={{ color: palette.color }} />}
                    </Box>
                  );
                })}
              </Stack>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Top SP + Recent orders + Low stock + Search no-result */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard title="Sản phẩm bán chạy nhất" subtitle="Bảy sản phẩm hàng đầu · bấm để xem chi tiết">
              <Stack spacing={0.5}>
                {dashboardTopProducts.slice(0, 7).map((p, i) => {
                  const maxSold = dashboardTopProducts[0].sold_count;
                  const pct = (p.sold_count / maxSold) * 100;
                  const isUp = p.change_pct >= 0;
                  return (
                    <Stack
                      key={p.id}
                      direction="row" alignItems="center" spacing={1.5}
                      sx={{ p: 1, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover' }, cursor: 'pointer' }}
                    >
                      <Box sx={{
                        width: 24, height: 24, borderRadius: 1,
                        bgcolor: i < 3 ? 'warning.main' : 'grey.200',
                        color: i < 3 ? 'common.white' : 'text.secondary',
                        display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800,
                      }}>
                        {i + 1}
                      </Box>
                      <Avatar src={p.image} variant="rounded" sx={{ width: 36, height: 36, bgcolor: 'grey.100' }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600 }} noWrap>{p.name}</Typography>
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
                            {p.sold_count} đơn · {fmtVND(p.revenue)}
                          </Typography>
                          <Chip
                            icon={<Iconify icon={isUp ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'} width={9} />}
                            label={`${Math.abs(p.change_pct).toFixed(1)}%`}
                            size="small"
                            sx={{
                              height: 16, fontSize: 9.5, fontWeight: 700,
                              bgcolor: isUp ? '#DCFCE7' : '#FEE2E2',
                              color: isUp ? '#047857' : '#B91C1C',
                              '& .MuiChip-icon': { color: 'inherit', ml: 0.5 },
                            }}
                          />
                        </Stack>
                      </Box>
                      <Box sx={{ width: 60, flexShrink: 0 }}>
                        <LinearProgress
                          variant="determinate" value={pct}
                          sx={{
                            height: 6, borderRadius: 3, bgcolor: 'grey.100',
                            '& .MuiLinearProgress-bar': { borderRadius: 3, background: i < 3 ? 'linear-gradient(90deg, #F59E0B, #F97316)' : 'linear-gradient(90deg, #94A3B8, #64748B)' },
                          }}
                        />
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard title="Đơn hàng mới nhất" subtitle="Sáu đơn trong ba mươi phút qua">
              <Stack spacing={1}>
                {dashboardRecentOrders.map((o) => {
                  const sc = {
                    pending:    { label: 'Chờ xác nhận', color: '#F59E0B' },
                    confirmed:  { label: 'Đã xác nhận',  color: '#3B82F6' },
                    processing: { label: 'Chuẩn bị',      color: '#8B5CF6' },
                    delivered:  { label: 'Đã giao',       color: '#10B981' },
                    completed:  { label: 'Hoàn tất',      color: '#059669' },
                  }[o.status] ?? { label: o.status, color: '#6B7280' };
                  return (
                    <Stack
                      key={o.id}
                      direction="row" alignItems="center" spacing={1.5}
                      sx={{ p: 1.25, borderRadius: 1.5, bgcolor: 'grey.50', border: 1, borderColor: 'divider' }}
                    >
                      <Box sx={{ width: 3, height: 32, borderRadius: 1, bgcolor: sc.color }} />
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.200', fontSize: 12 }}>{o.customer[0]}</Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'primary.main' }}>
                            {o.order_no}
                          </Typography>
                          <Chip label={sc.label} size="small" sx={{ height: 16, fontSize: 9.5, fontWeight: 700, bgcolor: sc.color + '22', color: sc.color }} />
                        </Stack>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>{o.customer} · {o.minutes_ago}p trước</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 800, color: 'warning.dark', fontSize: 13 }}>{fmtVND(o.amount)}</Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ChartCard title="Hàng sắp hết" subtitle={`${dashboardLowStock.length} SKU cần nhập ngay`}>
              <Stack spacing={1}>
                {dashboardLowStock.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row" alignItems="center" spacing={1}
                    sx={{ p: 1, borderRadius: 1, bgcolor: item.qty === 0 ? 'rgba(239,68,68,0.06)' : 'grey.50' }}
                  >
                    <Box
                      sx={{
                        width: 36, height: 36, borderRadius: 1, flexShrink: 0,
                        bgcolor: item.qty === 0 ? '#EF4444' : item.qty < 3 ? '#F59E0B' : '#F3F4F6',
                        color: item.qty === 0 || item.qty < 3 ? 'common.white' : 'text.secondary',
                        display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 15,
                      }}
                    >
                      {item.qty}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontSize: 12.5, fontWeight: 600 }} noWrap>{item.product}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: 10.5 }}>
                        {item.sku} · {item.store}
                      </Typography>
                    </Box>
                    <IconButton size="small"><Iconify icon="solar:restart-linear" width={14} /></IconButton>
                  </Stack>
                ))}
              </Stack>
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ChartCard title="Tìm kiếm không có kết quả" subtitle="Năm cụm từ khách tìm nhiều nhất">
              <Stack spacing={1}>
                {dashboardSearchNoResult.map((s, i) => (
                  <Stack
                    key={i}
                    direction="row" alignItems="center" spacing={1.5}
                    sx={{ p: 1.25, borderRadius: 1.5, bgcolor: 'grey.50', border: 1, borderColor: 'divider' }}
                  >
                    <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'rgba(239,68,68,0.1)', color: 'error.main', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Iconify icon="solar:magnifer-linear" width={16} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: 12.5 }}>"{s.keyword}"</Typography>
                    </Box>
                    <Tooltip title="Số lượt tìm">
                      <Chip label={`${s.count}`} size="small" sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: 'error.main', color: 'common.white' }} />
                    </Tooltip>
                  </Stack>
                ))}
              </Stack>
            </ChartCard>
          </Grid>
        </Grid>
      </Box>
      )}
    </DashboardContent>
  );
}
