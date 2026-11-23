// src/views/admin/membership-tier/membership-tier-ladder.jsx
// Hạng thành viên — KPI row + grid card (không dạng table, không gradient).

'use client';

import { useMemo, useState } from 'react';

import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import DiamondOutlined from '@mui/icons-material/DiamondOutlined';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined';
import {
  Box, Divider, Grid, IconButton, LinearProgress, Stack, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtNumber } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { KpiCard } from 'src/views/admin/_shared/kpi-card';
import { useGetCustomerList } from 'src/actions/admin/customer';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { KpiCardsSkeleton, GridCardSkeleton } from 'src/components/common/skeletons';

import { MembershipTierFormDrawer } from './membership-tier-create-form';
import { mockMembershipTiers } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const membershipTiersList = mockMembershipTiers;
// Icon + accent nhẹ — flat, không gradient
const TIER_META = {
  silver:   { icon: 'solar:medal-ribbon-linear',       accent: '#64748B' },
  gold:     { icon: 'solar:medal-ribbons-star-linear', accent: '#D97706' },
  platinum: { icon: 'solar:crown-minimalistic-linear', accent: '#2563EB' },
  diamond:  { icon: 'solar:crown-star-linear',         accent: '#7C3AED' },
};

function TierCard({ tier, index, cols = 4, share, onEdit, onInspect }) {
  const meta = TIER_META[tier.code] ?? TIER_META.silver;
  const i = index;
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        borderRightWidth: {
          xs: 0,
          sm: i % 2 === 1 ? 0 : 1,
          md: (i + 1) % cols === 0 ? 0 : 1,
        },
        borderRightStyle: 'solid',
        borderRightColor: 'grey.200',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'grey.100',
        px: 2, py: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top row: icon + index chip + actions */}
      <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ mb: 1.5 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 1,
          bgcolor: meta.accent + '14', color: meta.accent,
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Iconify icon={meta.icon} width={20} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
              {tier.name}
            </Typography>
            <Box component="span" sx={{
              display: 'inline-flex', alignItems: 'center',
              px: 0.625, py: 0.125, borderRadius: 0.75,
              fontSize: 9.5, fontWeight: 700,
              bgcolor: 'grey.100', color: 'text.secondary',
              letterSpacing: 0.3,
            }}>
              #{i + 1}
            </Box>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: 10.5 }}>
            {tier.code}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.25}>
          <Tooltip title="Xem quyền lợi">
            <IconButton size="small" onClick={() => onInspect?.(tier)}>
              <Iconify icon="solar:eye-linear" width={15} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sửa hạng">
            <IconButton size="small" onClick={() => onEdit?.(tier)}>
              <Iconify icon="solar:pen-linear" width={15} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Discount lớn */}
      <Stack direction="row" alignItems="baseline" spacing={0.5}>
        <Typography sx={{
          fontSize: 32, fontWeight: 700, lineHeight: 1,
          color: meta.accent, fontVariantNumeric: 'tabular-nums',
        }}>
          {tier.discount_pct}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.secondary' }}>
          % giảm
        </Typography>
      </Stack>

      {/* Detail lines */}
      <Stack spacing={0.75} sx={{ mt: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:dollar-linear" width={13} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1, fontSize: 11 }}>
            Ngưỡng chi tiêu
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 11 }}>
            {fmtVND(tier.min_spent)}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:star-linear" width={13} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1, fontSize: 11 }}>
            Điểm / 1.000₫
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 11 }}>
            ×{tier.point_rate}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 1.25 }} />

      {/* Share progress */}
      <Box>
        <Stack direction="row" alignItems="center" sx={{ mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10.5, flex: 1 }}>
            {fmtNumber(share.count)} khách · {share.pct}% tệp
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={Number(share.pct)}
          sx={{
            height: 4, borderRadius: 2,
            bgcolor: 'grey.100',
            '& .MuiLinearProgress-bar': {
              bgcolor: meta.accent,
              borderRadius: 2,
            },
          }}
        />
      </Box>
    </Box>
  );
}

export function MembershipTierLadderView({ embedded = false } = {}) {
  const { searchResults: customersList, searchLoading: customersLoading } = useGetCustomerList();
  const [editing, setEditing]   = useState(null);
  const [createOpen, setCreate] = useState(false);
  const [inspecting, setInspecting] = useState(null);

  const perTier = useMemo(() => {
    const counts = {};
    customersList.forEach((c) => {
      const k = c.membership?.tier_code ?? 'silver';
      counts[k] = (counts[k] ?? 0) + 1;
    });
    return counts;
  }, [customersList]);

  const totalCustomers = customersList.length;
  const vipCount = (perTier.platinum ?? 0) + (perTier.diamond ?? 0);
  const totalTiers = membershipTiersList.length;
  const avgDiscount = (
    membershipTiersList.reduce((s, t) => s + (t.discount_pct ?? 0), 0) / Math.max(totalTiers, 1)
  ).toFixed(1);

  const cols = Math.max(Math.min(totalTiers, 4), 1); // auto fit tới 4 cột

  const body = customersLoading ? (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <KpiCardsSkeleton count={4} />
      <GridCardSkeleton count={4} cols={{ xs: 12, sm: 6, md: 3 }} imageHeight={220} />
    </Box>
  ) : (
    <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
      {/* KPI row — pattern chuẩn */}
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            index={0}
            icon={EmojiEventsOutlined}
            label="Tổng hạng"
            value={fmtNumber(totalTiers)}
            color="primary"
            helperText="Cấu hình các bậc thưởng"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            index={1}
            icon={PeopleOutlined}
            label="Tổng khách"
            value={fmtNumber(totalCustomers)}
            color="info"
            helperText="Áp dụng cho mọi hạng"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            index={2}
            icon={DiamondOutlined}
            label="Khách VIP"
            value={fmtNumber(vipCount)}
            color="warning"
            helperText={`${((vipCount / Math.max(totalCustomers, 1)) * 100).toFixed(0)}% là Platinum/Diamond`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            index={3}
            icon={LocalOfferOutlined}
            label="Giảm giá TB"
            value={`${avgDiscount}%`}
            color="success"
            helperText="Chiết khấu trung bình các bậc"
          />
        </Grid>
      </Grid>

      {/* Tier card grid — mỗi hạng 1 card phẳng */}
      <Grid container spacing={0}>
        {membershipTiersList.map((t, i) => {
          const count = perTier[t.code] ?? 0;
          const pct = totalCustomers > 0 ? ((count / totalCustomers) * 100).toFixed(1) : '0.0';
          return (
            <Grid key={t.code} size={{ xs: 12, sm: 6, md: 12 / cols }}>
              <TierCard
                tier={t}
                index={i}
                cols={cols}
                share={{ count, pct }}
                onEdit={setEditing}
                onInspect={setInspecting}
              />
            </Grid>
          );
        })}
      </Grid>

      <MembershipTierFormDrawer
        open={createOpen}
        onClose={() => setCreate(false)}
        onSubmit={(v) => console.log('create tier', v)}
      />
      <MembershipTierFormDrawer
        open={!!editing || !!inspecting}
        initial={editing ?? inspecting}
        onClose={() => { setEditing(null); setInspecting(null); }}
        onSubmit={(v) => console.log('update tier', v)}
      />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Hạng thành viên"
        subtitle="Silver → Gold → Platinum → Diamond · ngưỡng chi tiêu · chiết khấu · điểm thưởng"
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Bán hàng' },
          { label: 'Hạng thành viên' },
        ]}
      />
      {body}
    </DashboardContent>
  );
}
