// src/views/admin/gold/gold-price-region-list-view.jsx
// Vùng niêm yết — grid card với bản đồ-style, chỉ 6 vùng.

'use client';

import { useState } from 'react';

import { Box, Button, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { mockGoldPriceRegions } from 'src/mock-data';

const goldPriceRegionsList = mockGoldPriceRegions;

// Accent nhạt cho pin, không dùng gradient chói
const REGION_ACCENT = {
  HCM: { color: '#B91C1C' },
  HN:  { color: '#1D4ED8' },
  DN:  { color: '#047857' },
  MT:  { color: '#B45309' },
  TN:  { color: '#6D28D9' },
  DNB: { color: '#BE185D' },
};

function RegionCard({ region, onEdit }) {
  const meta = REGION_ACCENT[region.code] ?? { color: '#64748B' };
  const provinceCount = (region.province_codes ?? []).length;

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        transition: 'border-color .15s',
        '&:hover': { borderColor: 'text.disabled' },
      }}
    >
      <Box sx={{ p: 1.75 }}>
        {/* Header: pin nhỏ + code + default pill */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
          <Box sx={{
            width: 28, height: 28, borderRadius: 0.75,
            bgcolor: meta.color + '14', color: meta.color,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Iconify icon="solar:map-point-linear" width={14} />
          </Box>
          <Stack sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{
              fontWeight: 700, fontSize: 13, color: 'text.primary', lineHeight: 1.2,
              fontFamily: 'monospace',
            }}>
              {region.code}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', lineHeight: 1.3 }} noWrap>
              {region.name}
            </Typography>
          </Stack>
          {region.is_default && (
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: '3px',
              px: 0.625, py: 0.125, borderRadius: 0.5,
              bgcolor: 'success.lighter', color: 'success.darker',
              fontSize: 9.5, fontWeight: 700, letterSpacing: 0.2,
              flexShrink: 0,
            }}>
              <Iconify icon="solar:check-circle-bold" width={9} />
              Mặc định
            </Box>
          )}
        </Stack>

        {/* Metrics */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'text.primary' }}>
              {provinceCount}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
              tỉnh/TP
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10, fontFamily: 'monospace' }}>
            · #{region.sort}
          </Typography>
        </Stack>
      </Box>

      {/* Footer — chỉ actions */}
      <Stack
        direction="row" alignItems="center"
        sx={{
          px: 1.75, py: 0.75,
          borderTop: 1, borderColor: 'grey.100',
          bgcolor: 'grey.50',
        }}
      >
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10, flex: 1, fontFamily: 'monospace' }} noWrap>
          {(region.province_codes ?? []).join(', ') || '—'}
        </Typography>
        <Tooltip title="Sửa vùng">
          <IconButton size="small" onClick={() => onEdit?.(region)} sx={{ width: 24, height: 24 }}>
            <Iconify icon="solar:pen-linear" width={13} />
          </IconButton>
        </Tooltip>
        <RowActionsMenu
          items={[
            { label: 'Copy code', icon: 'solar:copy-linear', onClick: () => navigator.clipboard?.writeText(region.code) },
            { label: region.is_default ? 'Đang là mặc định' : 'Đặt làm mặc định',
              icon: 'solar:star-linear', disabled: region.is_default, onClick: () => alert('Default ' + region.code) },
            { divider: true },
            { label: 'Xoá', icon: 'solar:trash-bin-trash-linear', color: 'error', disabled: region.is_default, onClick: () => alert('Xoá ' + region.code) },
          ]}
        />
      </Stack>
    </Box>
  );
}

export function GoldPriceRegionListView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);

  const body = (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 3 } }}>
      <Grid container spacing={2}>
        {goldPriceRegionsList.map((r) => (
          <Grid key={r.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <RegionCard region={r} onEdit={setEditing} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Vùng niêm yết giá vàng"
        subtitle="HCM · Hà Nội · Đà Nẵng · Miền Tây · Tây Nguyên · Đông Nam Bộ"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Vùng giá vàng' }]}
        actions={
          <Button
            variant="contained" size="small"
            startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
            href={adminPaths.goldPriceRegion.root + '/new'}
            sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
          >
            Thêm vùng
          </Button>
        }
      />
      {body}
    </DashboardContent>
  );
}
