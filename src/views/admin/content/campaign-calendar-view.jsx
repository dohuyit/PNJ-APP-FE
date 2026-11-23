// src/views/admin/content/campaign-calendar-view.jsx
// Lịch chiến dịch — tháng view · banner + landing + promotion timeline + filter by type.

'use client';

import { useMemo, useState } from 'react';
import NextLink from 'next/link';

import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';

import { mockBanners, mockLandingPages, mockPromotions } from 'src/mock-data';

// ---- date utils ----

const DAY = 86_400_000;
const DOW = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function toTs(v) {
  if (!v) return 0;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
}

function monthMatrix(year, month) {
  // month: 0-11; trả về mảng 42 cell cho 6 tuần
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay(); // 0=CN
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const dayOffset = i - startWeekday;
    const d = new Date(year, month, 1 + dayOffset);
    cells.push({
      date: d,
      ts: startOfDay(d).getTime(),
      inMonth: d.getMonth() === month,
      isToday: startOfDay(d).getTime() === startOfDay(new Date()).getTime(),
    });
  }
  return cells;
}

// ---- Event mapping ----

const TYPE_META = {
  banner:    { label: 'Banner',    icon: 'solar:gallery-wide-linear', color: '#2563EB', bg: '#DBEAFE', fg: '#1D4ED8' },
  landing:   { label: 'Landing',   icon: 'solar:star-shine-linear',   color: '#7C3AED', bg: '#EDE9FE', fg: '#6D28D9' },
  promotion: { label: 'KM',        icon: 'solar:tag-price-linear',    color: '#EC4899', bg: '#FCE7F3', fg: '#BE185D' },
};

function buildEvents() {
  const rows = [];
  mockBanners.forEach((b) => {
    if (!b.start_at && !b.end_at) return;
    rows.push({
      id: `banner-${b._id}`,
      type: 'banner',
      title: b.name,
      start: toTs(b.start_at),
      end: toTs(b.end_at) || toTs(b.start_at) + DAY * 7,
      status: b.status,
      href: adminPaths.banner.root,
    });
  });
  mockLandingPages.forEach((l) => {
    if (!l.published_at) return;
    rows.push({
      id: `landing-${l._id}`,
      type: 'landing',
      title: l.title,
      start: toTs(l.published_at),
      end: toTs(l.published_at) + DAY * 30,
      status: l.status,
      href: adminPaths.landingPage.root,
    });
  });
  mockPromotions.forEach((p) => {
    if (!p.start_at || !p.end_at) return;
    rows.push({
      id: `promo-${p._id}`,
      type: 'promotion',
      title: p.name,
      start: toTs(p.start_at),
      end: toTs(p.end_at),
      status: p.status,
      href: adminPaths.promotion.root,
    });
  });
  return rows.sort((a, b) => a.start - b.start);
}

// ---- Main ----

export function CampaignCalendarView() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [typeFilter, setTypeFilter] = useState({ banner: true, landing: true, promotion: true });

  const allEvents = useMemo(() => buildEvents(), []);

  const events = useMemo(
    () => allEvents.filter((e) => typeFilter[e.type]),
    [allEvents, typeFilter]
  );

  const cells = useMemo(() => monthMatrix(cursor.year, cursor.month), [cursor]);

  // Gán events vào từng day cell
  const cellEvents = useMemo(() => {
    const map = new Map();
    cells.forEach((c) => map.set(c.ts, []));
    events.forEach((e) => {
      cells.forEach((c) => {
        if (e.start <= c.ts + DAY - 1 && e.end >= c.ts) {
          map.get(c.ts).push(e);
        }
      });
    });
    return map;
  }, [cells, events]);

  const prevMonth = () => setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  const nextMonth = () => setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
  const goToday = () => {
    const d = new Date();
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
  };

  const toggleType = (t) => setTypeFilter((v) => ({ ...v, [t]: !v[t] }));

  const monthLabel = `${MONTHS[cursor.month]} ${cursor.year}`;
  const monthEvents = events.filter((e) => {
    const monthStart = new Date(cursor.year, cursor.month, 1).getTime();
    const monthEnd = new Date(cursor.year, cursor.month + 1, 0).getTime() + DAY;
    return e.start < monthEnd && e.end > monthStart;
  });

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Lịch chiến dịch"
        subtitle={`${monthEvents.length} chiến dịch trong tháng · ${allEvents.length} tổng`}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Marketing' },
          { label: 'Nội dung' },
          { label: 'Lịch chiến dịch' },
        ]}
      />

      {/* Toolbar: month navigator + type filters */}
      <Box sx={{
        px: 2, py: 1.5,
        bgcolor: 'grey.50',
        borderTop: '1px solid rgba(145, 158, 171, 0.08)',
        borderBottom: 1, borderColor: 'divider',
        display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', rowGap: 1,
      }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton size="small" onClick={prevMonth} sx={{ color: 'text.secondary' }}>
            <Iconify icon="solar:alt-arrow-left-linear" width={16} />
          </IconButton>
          <Box sx={{
            minWidth: 160, textAlign: 'center',
            px: 1.5, py: 0.5,
            bgcolor: 'background.paper',
            border: 1, borderColor: 'divider', borderRadius: 1,
          }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>
              {monthLabel}
            </Typography>
          </Box>
          <IconButton size="small" onClick={nextMonth} sx={{ color: 'text.secondary' }}>
            <Iconify icon="solar:alt-arrow-right-linear" width={16} />
          </IconButton>
          <Chip
            label="Hôm nay"
            size="small"
            onClick={goToday}
            sx={{ ml: 1, height: 24, fontSize: 11, fontWeight: 600 }}
          />
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={0.75} alignItems="center">
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase', mr: 0.5 }}>
            Hiện
          </Typography>
          {Object.entries(TYPE_META).map(([t, meta]) => {
            const active = typeFilter[t];
            return (
              <Chip
                key={t}
                icon={<Iconify icon={meta.icon} width={11} />}
                label={meta.label}
                size="small"
                variant={active ? 'filled' : 'outlined'}
                onClick={() => toggleType(t)}
                sx={{
                  height: 24, fontSize: 11, fontWeight: 600,
                  bgcolor: active ? meta.bg : 'background.paper',
                  color: active ? meta.fg : 'text.disabled',
                  borderColor: active ? meta.fg + '44' : 'divider',
                  opacity: active ? 1 : 0.7,
                  '& .MuiChip-icon': { color: 'inherit' },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* Calendar grid */}
      <Box sx={{ p: { xs: 1.5, md: 2 } }}>
        {/* Weekday header */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0,
          mb: 0.5,
        }}>
          {DOW.map((d, i) => (
            <Typography
              key={d}
              sx={{
                fontSize: 10.5, fontWeight: 700, color: i === 0 ? 'error.main' : 'text.disabled',
                letterSpacing: 0.4, textTransform: 'uppercase', textAlign: 'center', py: 0.5,
              }}
            >
              {d}
            </Typography>
          ))}
        </Box>

        {/* Day cells */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0,
          border: '1px solid rgba(145, 158, 171, 0.12)',
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}>
          {cells.map((c, i) => {
            const dayEvents = cellEvents.get(c.ts) ?? [];
            const isSunday = c.date.getDay() === 0;
            return (
              <Box
                key={c.ts}
                sx={{
                  position: 'relative',
                  minHeight: 110,
                  p: 0.75,
                  borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid rgba(145, 158, 171, 0.08)',
                  borderBottom: i >= 35 ? 'none' : '1px solid rgba(145, 158, 171, 0.08)',
                  bgcolor: c.isToday ? 'primary.lighter' : c.inMonth ? 'background.paper' : 'grey.50',
                  opacity: c.inMonth ? 1 : 0.55,
                  transition: 'background-color .15s',
                  '&:hover': { bgcolor: c.isToday ? 'primary.lighter' : 'grey.50' },
                }}
              >
                <Typography sx={{
                  fontSize: 11, fontWeight: c.isToday ? 800 : 500,
                  color: c.isToday ? 'primary.dark' : isSunday ? 'error.main' : 'text.primary',
                  lineHeight: 1, mb: 0.5,
                }}>
                  {c.date.getDate()}
                </Typography>

                <Stack spacing={0.25}>
                  {dayEvents.slice(0, 3).map((e) => {
                    const meta = TYPE_META[e.type];
                    const isStart = startOfDay(new Date(e.start)).getTime() === c.ts;
                    const isEnd = startOfDay(new Date(e.end)).getTime() === c.ts;
                    return (
                      <Tooltip key={e.id} title={e.title} placement="top">
                        <Box
                          component={NextLink}
                          href={e.href}
                          sx={{
                            display: 'block',
                            px: 0.5, py: 0.25,
                            bgcolor: meta.bg,
                            color: meta.fg,
                            borderLeft: isStart ? `2px solid ${meta.color}` : 'none',
                            borderRadius: isStart && isEnd ? 0.5 : isStart ? '2px 0 0 2px' : isEnd ? '0 2px 2px 0' : 0,
                            fontSize: 10, fontWeight: 600,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            textDecoration: 'none',
                            transition: 'opacity .15s',
                            '&:hover': { opacity: 0.8 },
                          }}
                        >
                          {e.title}
                        </Box>
                      </Tooltip>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <Typography sx={{ fontSize: 9.5, color: 'text.disabled', fontWeight: 600 }}>
                      +{dayEvents.length - 3} khác
                    </Typography>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Box>

        {/* Legend */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1.5, px: 0.5 }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
            Chú thích
          </Typography>
          {Object.entries(TYPE_META).map(([t, meta]) => (
            <Stack key={t} direction="row" spacing={0.5} alignItems="center">
              <Box sx={{ width: 12, height: 8, bgcolor: meta.bg, borderLeft: `2px solid ${meta.color}` }} />
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{meta.label}</Typography>
            </Stack>
          ))}
          <Box sx={{ flex: 1 }} />
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 12, height: 8, bgcolor: 'primary.lighter', border: 1, borderColor: 'primary.main' }} />
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Hôm nay</Typography>
          </Stack>
        </Stack>
      </Box>
    </DashboardContent>
  );
}
