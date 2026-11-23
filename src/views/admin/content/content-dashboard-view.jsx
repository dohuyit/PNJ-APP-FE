// src/views/admin/content/content-dashboard-view.jsx
// Tổng quan CMS — KPI banner/landing/blog + lịch chiến dịch + top page + quick shortcuts.

'use client';

import { useMemo } from 'react';
import NextLink from 'next/link';

import { Box, Chip, Grid, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';
import { fmtNumber } from 'src/utils/format';
import { DashboardContent } from 'src/layouts/dashboard';
import { m, fadeIn, staggerContainer } from 'src/views/admin/_shared/motion';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';

import {
  mockBanners, mockLandingPages, mockPages, mockPosts, mockHomeSections,
  mockEcardTemplates, mockMenuLocations, mockMedia,
} from 'src/mock-data';

// ---- tiny utils ----

const now = Date.now();
const DAY = 86_400_000;

function toTs(v) {
  if (!v) return 0;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
}

function isLive(item) {
  const s = toTs(item.start_at);
  const e = toTs(item.end_at);
  if (item.status === 'ended' || item.status === 'archived' || item.status === 'draft') return false;
  if (s && s > now) return false;
  if (e && e < now) return false;
  return item.status === 'active' || item.status === 'published';
}

function isScheduled(item) {
  const s = toTs(item.start_at ?? item.published_at);
  return s > now || item.status === 'scheduled';
}

// ---- KPI tile ----

function KpiTile({ label, value, delta, icon, color, href, foot, i, cols = 4 }) {
  return (
    <Stack
      component={href ? NextLink : 'div'}
      href={href}
      direction="row" spacing={1.25} alignItems="center"
      sx={{
        px: 2, py: 1.5,
        textDecoration: 'none',
        color: 'inherit',
        cursor: href ? 'pointer' : 'default',
        borderRight: {
          xs: i % 2 === 0 ? '1px solid rgba(145, 158, 171, 0.08)' : 'none',
          md: (i + 1) % cols === 0 ? 'none' : '1px solid rgba(145, 158, 171, 0.08)',
        },
        borderBottom: {
          xs: '1px solid rgba(145, 158, 171, 0.08)',
          md: 'none',
        },
        transition: 'background-color .15s',
        '&:hover': href ? { bgcolor: 'grey.50' } : undefined,
      }}
    >
      <Box sx={{
        width: 36, height: 36, borderRadius: 0.75,
        bgcolor: color + '14', color,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <Iconify icon={icon} width={18} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{
          fontSize: 10.5, color: 'text.disabled', lineHeight: 1.2, fontWeight: 500,
          letterSpacing: 0.3, textTransform: 'uppercase',
        }}>
          {label}
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary', lineHeight: 1.15, fontVariantNumeric: 'tabular-nums' }}>
            {fmtNumber(value)}
          </Typography>
          {foot && (
            <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>
              {foot}
            </Typography>
          )}
        </Stack>
        {delta != null && (
          <Stack direction="row" alignItems="center" spacing={0.25} sx={{ mt: 0.25 }}>
            <Iconify icon={delta >= 0 ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'} width={10}
              sx={{ color: delta >= 0 ? 'success.main' : 'error.main' }} />
            <Typography sx={{
              fontSize: 10.5, fontWeight: 700,
              color: delta >= 0 ? 'success.main' : 'error.main',
            }}>
              {delta >= 0 ? '+' : ''}{delta}%
            </Typography>
            <Typography sx={{ fontSize: 10, color: 'text.disabled', ml: 0.25 }}>vs tuần trước</Typography>
          </Stack>
        )}
      </Box>
      {href && <Iconify icon="solar:arrow-right-linear" width={14} sx={{ color: 'text.disabled' }} />}
    </Stack>
  );
}

// ---- Panel ----

function Panel({ title, subtitle, action, children, sx }) {
  return (
    <Box sx={{
      bgcolor: 'background.paper',
      border: 1, borderColor: 'divider',
      borderRadius: 1,
      overflow: 'hidden',
      ...sx,
    }}>
      <Stack
        direction="row" alignItems="center" spacing={1.25}
        sx={{ px: 2, py: 1.25, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', lineHeight: 1.25 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.125 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
}

// ---- Campaign calendar strip ----

function CampaignStrip() {
  const items = useMemo(() => {
    const all = [
      ...mockBanners.map((b) => ({ type: 'banner', id: b._id, title: b.name, color: '#2563EB', start: toTs(b.start_at), end: toTs(b.end_at), status: b.status })),
      ...mockLandingPages.map((l) => ({ type: 'landing', id: l._id, title: l.title, color: '#7C3AED', start: toTs(l.published_at ?? l.updated_at), end: null, status: l.status })),
    ].filter((x) => x.start > 0);

    const start = Math.max(now - 14 * DAY, Math.min(...all.map((x) => x.start)));
    const end = Math.min(now + 30 * DAY, Math.max(...all.map((x) => x.end || now + 30 * DAY)));
    const range = end - start;

    return all.map((x) => {
      const left = Math.max(0, ((x.start - start) / range) * 100);
      const right = x.end ? ((x.end - start) / range) * 100 : left + 2;
      return { ...x, left, width: Math.max(1.5, right - left) };
    }).sort((a, b) => a.start - b.start).slice(0, 10);
  }, []);

  return (
    <Box>
      {/* Time axis */}
      <Stack direction="row" sx={{ fontSize: 10, color: 'text.disabled', mb: 0.5 }}>
        <Typography sx={{ fontSize: 10, color: 'text.disabled', flex: 1 }}>-14d</Typography>
        <Typography sx={{ fontSize: 10, color: 'text.primary', fontWeight: 700, flex: 1, textAlign: 'center' }}>Hôm nay</Typography>
        <Typography sx={{ fontSize: 10, color: 'text.disabled', flex: 1, textAlign: 'right' }}>+30d</Typography>
      </Stack>
      <Box sx={{ position: 'relative', height: 2, bgcolor: 'grey.100', mb: 1.5 }}>
        <Box sx={{ position: 'absolute', top: -3, bottom: -3, left: `${(14 / 44) * 100}%`, width: 1, bgcolor: 'primary.main' }} />
      </Box>

      <Stack spacing={0.75}>
        {items.map((x) => (
          <Stack key={`${x.type}-${x.id}`} direction="row" alignItems="center" spacing={1}>
            <Chip
              icon={<Iconify icon={x.type === 'banner' ? 'solar:gallery-wide-linear' : 'solar:star-shine-linear'} width={10} />}
              label={x.type === 'banner' ? 'B' : 'L'}
              size="small"
              sx={{
                height: 16, fontSize: 9, fontWeight: 700, width: 42, flexShrink: 0,
                bgcolor: x.color + '14', color: x.color,
                '& .MuiChip-icon': { color: 'inherit', ml: 0.4 },
                '& .MuiChip-label': { px: 0.5 },
              }}
            />
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'text.primary', width: 180, flexShrink: 0 }} noWrap>
              {x.title}
            </Typography>
            <Box sx={{ position: 'relative', flex: 1, height: 10, bgcolor: 'grey.100', borderRadius: 0.5, overflow: 'hidden' }}>
              <Tooltip title={`${new Date(x.start).toLocaleDateString('vi-VN')} ${x.end ? `→ ${new Date(x.end).toLocaleDateString('vi-VN')}` : ''}`}>
                <Box sx={{
                  position: 'absolute', top: 1, bottom: 1,
                  left: `${x.left}%`, width: `${x.width}%`,
                  bgcolor: x.color, opacity: 0.8, borderRadius: 0.5,
                }} />
              </Tooltip>
              <Box sx={{ position: 'absolute', top: -2, bottom: -2, left: `${(14 / 44) * 100}%`, width: 1, bgcolor: 'primary.main', opacity: 0.4 }} />
            </Box>
            <Chip
              label={{ active: 'Đang chạy', scheduled: 'Lên lịch', published: 'Live', draft: 'Nháp', ended: 'Kết thúc', archived: 'Lưu trữ' }[x.status] ?? x.status}
              size="small"
              variant="outlined"
              sx={{ height: 18, fontSize: 9, fontWeight: 600, flexShrink: 0 }}
            />
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

// ---- Top content list ----

function TopList({ items, keyField = 'id', renderRow }) {
  if (!items.length) {
    return (
      <Typography sx={{ fontSize: 11.5, color: 'text.disabled', textAlign: 'center', py: 3 }}>
        Chưa có dữ liệu
      </Typography>
    );
  }
  return (
    <Stack spacing={1}>
      {items.map((it, i) => (
        <Stack key={it[keyField] ?? i} direction="row" alignItems="center" spacing={1.25}>
          <Typography sx={{
            fontSize: 10.5, fontWeight: 700, fontFamily: 'ui-monospace, monospace',
            color: i < 3 ? 'warning.dark' : 'text.disabled', width: 20, flexShrink: 0,
          }}>
            #{i + 1}
          </Typography>
          {renderRow(it)}
        </Stack>
      ))}
    </Stack>
  );
}

// ---- Main ----

export function ContentDashboardView() {
  const stats = useMemo(() => {
    const bannerLive = mockBanners.filter(isLive).length;
    const landingLive = mockLandingPages.filter(isLive).length;
    const landingScheduled = mockLandingPages.filter(isScheduled).length;
    const postsPublished = mockPosts.filter((p) => p.status === 'published').length;
    const postsDraft = mockPosts.filter((p) => p.status === 'draft').length;

    const bannerImpressions = mockBanners.reduce((n, b) => n + (b.impressions ?? 0), 0);
    const bannerClicks = mockBanners.reduce((n, b) => n + (b.clicks ?? 0), 0);
    const landingViews = mockLandingPages.reduce((n, l) => n + (l.views ?? 0), 0);
    const pageViews = mockPages.reduce((n, p) => n + (p.views ?? 0), 0);
    const postViews = mockPosts.reduce((n, p) => n + (p.views ?? 0), 0);

    return {
      bannerLive, bannerImpressions, bannerClicks,
      landingLive, landingScheduled, landingViews,
      postsPublished, postsDraft, postViews,
      pageViews,
      mediaCount: mockMedia.length,
      ecardCount: mockEcardTemplates.length,
    };
  }, []);

  const topBanners = useMemo(
    () => [...mockBanners]
      .sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))
      .slice(0, 5),
    []
  );
  const topLanding = useMemo(
    () => [...mockLandingPages]
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 5),
    []
  );
  const topPages = useMemo(
    () => [...mockPages]
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 5),
    []
  );
  const topPosts = useMemo(
    () => [...mockPosts]
      .filter((p) => p.status === 'published')
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 5),
    []
  );

  const quickLinks = [
    { label: 'Banner',        path: adminPaths.banner.root,         icon: 'solar:gallery-wide-linear',   count: mockBanners.length,         color: '#2563EB' },
    { label: 'Trang chủ',     path: adminPaths.homeSection.root,    icon: 'solar:home-linear',           count: mockHomeSections.length,    color: '#7C3AED' },
    { label: 'Landing page',  path: adminPaths.landingPage.root,    icon: 'solar:star-shine-linear',     count: mockLandingPages.length,    color: '#EC4899' },
    { label: 'Trang tĩnh',    path: adminPaths.page.root,           icon: 'solar:document-text-linear',  count: mockPages.length,           color: '#059669' },
    { label: 'Menu',          path: adminPaths.menu.root,           icon: 'solar:hamburger-menu-linear', count: mockMenuLocations.length,   color: '#D97706' },
    { label: 'Thiệp',         path: adminPaths.ecardTemplate.root,  icon: 'solar:letter-linear',         count: mockEcardTemplates.length,  color: '#F59E0B' },
    { label: 'Blog',          path: adminPaths.post.root,           icon: 'solar:notebook-linear',       count: mockPosts.length,           color: '#8B5CF6' },
    { label: 'Media',         path: adminPaths.media.root,          icon: 'solar:folder-with-files-linear', count: mockMedia.length,        color: '#64748B' },
  ];

  const ctr = stats.bannerImpressions > 0 ? (stats.bannerClicks / stats.bannerImpressions) * 100 : 0;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Tổng quan CMS"
        subtitle={`${stats.bannerLive} banner đang chạy · ${stats.landingLive} landing live · ${stats.postsPublished} bài blog · ${stats.mediaCount} file media`}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Marketing' },
          { label: 'Nội dung' },
        ]}
      />

      {/* KPI row — edge-to-edge */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        bgcolor: 'background.paper',
        borderTop: '1px solid rgba(145, 158, 171, 0.08)',
        borderBottom: '1px solid rgba(145, 158, 171, 0.08)',
      }}>
        <KpiTile
          i={0}
          label="Banner impressions (30d)"
          value={stats.bannerImpressions}
          delta={12.4}
          icon="solar:eye-linear"
          color="#2563EB"
          href={adminPaths.banner.root}
          foot={`CTR ${ctr.toFixed(2)}%`}
        />
        <KpiTile
          i={1}
          label="Landing views (30d)"
          value={stats.landingViews}
          delta={8.2}
          icon="solar:star-shine-linear"
          color="#7C3AED"
          href={adminPaths.landingPage.root}
          foot={`${stats.landingScheduled} chờ lịch`}
        />
        <KpiTile
          i={2}
          label="Blog views (30d)"
          value={stats.postViews}
          delta={-3.1}
          icon="solar:notebook-linear"
          color="#8B5CF6"
          href={adminPaths.post.root}
          foot={`${stats.postsDraft} nháp`}
        />
        <KpiTile
          i={3}
          label="Page views (static)"
          value={stats.pageViews}
          delta={2.5}
          icon="solar:document-text-linear"
          color="#059669"
          href={adminPaths.page.root}
          foot=""
        />
      </Box>

      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <m.div variants={staggerContainer(0.04, 0.02)} initial="hidden" animate="show">
          <Grid container spacing={2}>
            {/* Quick shortcuts */}
            <Grid size={{ xs: 12 }}>
              <m.div variants={fadeIn}>
                <Panel title="Lối tắt" subtitle="Bấm để vào từng module quản lý">
                  <Grid container spacing={1}>
                    {quickLinks.map((q) => (
                      <Grid key={q.label} size={{ xs: 6, sm: 4, md: 3, lg: 1.5 }}>
                        <Stack
                          component={NextLink}
                          href={q.path}
                          spacing={0.75}
                          alignItems="center"
                          sx={{
                            textDecoration: 'none',
                            bgcolor: 'background.paper',
                            border: 1, borderColor: 'divider',
                            borderRadius: 1,
                            px: 1, py: 1.5,
                            transition: 'border-color .15s, background-color .15s',
                            '&:hover': { borderColor: q.color + '66', bgcolor: q.color + '08' },
                          }}
                        >
                          <Box sx={{
                            width: 32, height: 32, borderRadius: 0.75,
                            bgcolor: q.color + '14', color: q.color,
                            display: 'grid', placeItems: 'center',
                          }}>
                            <Iconify icon={q.icon} width={16} />
                          </Box>
                          <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: 'text.primary', textAlign: 'center' }} noWrap>
                            {q.label}
                          </Typography>
                          <Typography sx={{ fontSize: 10, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>
                            {fmtNumber(q.count)} mục
                          </Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Panel>
              </m.div>
            </Grid>

            {/* Lịch chiến dịch */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <m.div variants={fadeIn}>
                <Panel title="Lịch chiến dịch" subtitle="Banner và Landing — 14 ngày qua → 30 ngày tới">
                  <CampaignStrip />
                </Panel>
              </m.div>
            </Grid>

            {/* Top blog posts */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <m.div variants={fadeIn}>
                <Panel title="Blog bán chạy nhất" subtitle="Top 5 theo lượt xem">
                  <TopList
                    items={topPosts}
                    keyField="_id"
                    renderRow={(p) => (
                      <>
                        <Box sx={{
                          width: 28, height: 28, borderRadius: 0.5,
                          bgcolor: '#8B5CF614', color: '#8B5CF6',
                          display: 'grid', placeItems: 'center', flexShrink: 0,
                        }}>
                          <Iconify icon="solar:notebook-linear" width={13} />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }} noWrap>
                            {p.title}
                          </Typography>
                          <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
                            {fmtNumber(p.views ?? 0)} lượt · {p.reading_time}′ đọc
                          </Typography>
                        </Box>
                      </>
                    )}
                  />
                </Panel>
              </m.div>
            </Grid>

            {/* Top banners */}
            <Grid size={{ xs: 12, md: 6 }}>
              <m.div variants={fadeIn}>
                <Panel title="Banner CTR cao nhất" subtitle="Top 5 theo lượt click">
                  <TopList
                    items={topBanners}
                    keyField="_id"
                    renderRow={(b) => {
                      const imp = b.impressions ?? 0;
                      const clk = b.clicks ?? 0;
                      const localCtr = imp > 0 ? (clk / imp) * 100 : 0;
                      return (
                        <>
                          <Box sx={{
                            width: 28, height: 28, borderRadius: 0.5,
                            bgcolor: '#2563EB14', color: '#2563EB',
                            display: 'grid', placeItems: 'center', flexShrink: 0,
                          }}>
                            <Iconify icon="solar:gallery-wide-linear" width={13} />
                          </Box>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }} noWrap>
                              {b.name}
                            </Typography>
                            <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
                              {fmtNumber(imp)} xem · {fmtNumber(clk)} click
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'success.dark', fontVariantNumeric: 'tabular-nums' }}>
                            {localCtr.toFixed(1)}%
                          </Typography>
                        </>
                      );
                    }}
                  />
                </Panel>
              </m.div>
            </Grid>

            {/* Top landing */}
            <Grid size={{ xs: 12, md: 6 }}>
              <m.div variants={fadeIn}>
                <Panel title="Landing page chạy mạnh" subtitle="Top 5 theo lượt xem · conversion">
                  <TopList
                    items={topLanding}
                    keyField="_id"
                    renderRow={(l) => (
                      <>
                        <Box sx={{
                          width: 28, height: 28, borderRadius: 0.5,
                          bgcolor: '#7C3AED14', color: '#7C3AED',
                          display: 'grid', placeItems: 'center', flexShrink: 0,
                        }}>
                          <Iconify icon="solar:star-shine-linear" width={13} />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }} noWrap>
                            {l.title}
                          </Typography>
                          <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
                            /{l.slug} · {fmtNumber(l.views ?? 0)} xem
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}>
                          {(l.conversion ?? 0).toFixed(1)}%
                        </Typography>
                      </>
                    )}
                  />
                </Panel>
              </m.div>
            </Grid>

            {/* Top static pages */}
            <Grid size={{ xs: 12 }}>
              <m.div variants={fadeIn}>
                <Panel title="Trang tĩnh nhiều người đọc" subtitle="Top 5 theo lượt xem">
                  <Stack spacing={1.25}>
                    {topPages.map((p, i) => {
                      const totalViews = topPages[0]?.views ?? 1;
                      const pct = ((p.views ?? 0) / totalViews) * 100;
                      return (
                        <Box key={p._id}>
                          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 0.4 }}>
                            <Typography sx={{
                              fontSize: 10.5, fontWeight: 700, fontFamily: 'ui-monospace, monospace',
                              color: i < 3 ? 'warning.dark' : 'text.disabled', width: 20, flexShrink: 0,
                            }}>
                              #{i + 1}
                            </Typography>
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', flex: 1 }} noWrap>
                              {p.title}
                            </Typography>
                            <Typography sx={{ fontSize: 10.5, color: 'text.disabled', fontFamily: 'ui-monospace, monospace' }}>
                              /{p.slug}
                            </Typography>
                            <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums', width: 70, textAlign: 'right' }}>
                              {fmtNumber(p.views ?? 0)}
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                              height: 3, borderRadius: 2, bgcolor: 'grey.100',
                              '& .MuiLinearProgress-bar': { bgcolor: '#059669', opacity: 0.7, borderRadius: 2 },
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </Panel>
              </m.div>
            </Grid>
          </Grid>
        </m.div>
      </Box>
    </DashboardContent>
  );
}
