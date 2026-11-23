// src/views/admin/gold/gold-type-list-view.jsx
// Loại vàng — grid card thay vì table (chỉ 6 item). Thiết kế nổi bật karat + purity.

'use client';

import { useState } from 'react';

import {
  Box, Button, Grid, IconButton, Stack, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetGoldPriceHistory } from 'src/actions/admin/gold-price';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { GridCardSkeleton } from 'src/components/common/skeletons';


// ---------- Meta: nhóm vàng → icon + accent hex + pastel bg
const GROUP_META = {
  bar:          { label: 'Vàng miếng',   icon: 'solar:box-linear',            accent: '#B8863B', soft: 'rgba(184,134,59,0.08)' },
  ring:         { label: 'Nhẫn trơn',    icon: 'solar:ring-linear',           accent: '#D97706', soft: 'rgba(217,119,6,0.08)' },
  jewelry:      { label: 'Trang sức',    icon: 'solar:crown-linear',          accent: '#8C6B2E', soft: 'rgba(140,107,46,0.08)' },
  raw_material: { label: 'Nguyên liệu',  icon: 'solar:scale-linear',          accent: '#6B5A3E', soft: 'rgba(107,90,62,0.08)' },
};

// Karat → gradient riêng
const KARAT_GRADIENT = {
  '24K': 'linear-gradient(135deg, #FFD700 0%, #F4A800 100%)',
  '18K': 'linear-gradient(135deg, #FFC87A 0%, #E89532 100%)',
  '14K': 'linear-gradient(135deg, #F5C27A 0%, #C89A5F 100%)',
  '10K': 'linear-gradient(135deg, #D9BA9A 0%, #B48B5C 100%)',
  '—':   'linear-gradient(135deg, #A5968A 0%, #78665A 100%)',
};

function GoldTypeCard({ type, onEdit }) {
  const meta = GROUP_META[type.group] ?? GROUP_META.jewelry;
  const purity = (Number(type.purity) * 100).toFixed(2);

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 1.5,
        overflow: 'hidden',
        transition: 'border-color .15s, box-shadow .15s, transform .15s',
        '&:hover': {
          borderColor: meta.accent,
          boxShadow: `0 8px 20px -6px ${meta.accent}30`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Top banner — karat gradient */}
      <Box
        sx={{
          px: 2, py: 1.75,
          position: 'relative',
          background: KARAT_GRADIENT[type.karat_label] ?? KARAT_GRADIENT['—'],
          color: 'common.white',
          overflow: 'hidden',
        }}
      >
        {/* decorative shimmer */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
          pointerEvents: 'none', opacity: 0.7,
        }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative' }}>
          <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography sx={{
              fontWeight: 900, fontSize: 32, lineHeight: 1,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)', letterSpacing: '-0.02em',
            }}>
              {type.karat_label}
            </Typography>
            {type.karat_label !== '—' && (
              <Typography sx={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>
                KARAT
              </Typography>
            )}
          </Stack>
          {type.buy_only && (
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              px: 1, py: 0.25, borderRadius: '999px',
              bgcolor: 'rgba(0,0,0,0.3)', color: '#FFE89A',
              fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase',
              backdropFilter: 'blur(4px)',
            }}>
              <Iconify icon="solar:bag-smile-bold" width={10} />
              Chỉ mua
            </Box>
          )}
        </Stack>
      </Box>

      {/* Body */}
      <Box sx={{ px: 2, py: 1.75 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25 }} noWrap>
          {type.name}
        </Typography>
        <Box sx={{
          display: 'inline-block', mt: 0.5,
          px: 0.875, py: 0.125, borderRadius: 0.75,
          bgcolor: 'grey.100', border: 1, borderColor: 'grey.200',
          fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: 'text.secondary',
        }}>
          {type.code}
        </Box>

        {/* Metrics row */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }} alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{
              color: 'text.disabled', fontWeight: 600, fontSize: 10,
              letterSpacing: 0.5, textTransform: 'uppercase', display: 'block',
            }}>
              Hàm lượng
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 18, fontFamily: 'monospace', lineHeight: 1.2, color: 'text.primary' }}>
              {purity}
              <Box component="span" sx={{ fontSize: 12, color: 'text.disabled', ml: 0.25 }}>%</Box>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{
              color: 'text.disabled', fontWeight: 600, fontSize: 10,
              letterSpacing: 0.5, textTransform: 'uppercase', display: 'block',
            }}>
              Nhóm
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
              <Box sx={{
                width: 20, height: 20, borderRadius: 0.75,
                bgcolor: meta.soft, color: meta.accent,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <Iconify icon={meta.icon} width={12} />
              </Box>
              <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: meta.accent }}>
                {meta.label}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Footer */}
      <Stack
        direction="row" alignItems="center" spacing={1}
        sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'grey.100', bgcolor: 'grey.50' }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box sx={{
            width: 7, height: 7, borderRadius: '50%',
            bgcolor: type.status === 'active' ? 'success.main' : 'grey.400',
            boxShadow: type.status === 'active' ? '0 0 0 3px rgba(34,197,94,0.15)' : 'none',
          }} />
          <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, color: type.status === 'active' ? 'success.darker' : 'text.secondary' }}>
            {type.status === 'active' ? 'Đang dùng' : 'Đã ẩn'}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, fontFamily: 'monospace', ml: 'auto' }}>
          #{type.sort}
        </Typography>
        <Tooltip title="Sửa loại vàng">
          <IconButton size="small" onClick={() => onEdit?.(type)} sx={{ width: 26, height: 26 }}>
            <Iconify icon="solar:pen-linear" width={14} />
          </IconButton>
        </Tooltip>
        <RowActionsMenu
          items={[
            { label: 'Copy code', icon: 'solar:copy-linear', onClick: () => navigator.clipboard?.writeText(type.code) },
            { label: 'Xem lịch sử giá', icon: 'solar:chart-linear', onClick: () => alert('Lịch sử ' + type.code) },
            { divider: true },
            { label: 'Xoá', icon: 'solar:trash-bin-trash-linear', color: 'error', onClick: () => alert('Xoá ' + type.code) },
          ]}
        />
      </Stack>
    </Box>
  );
}

export function GoldTypeListView({ embedded = false } = {}) {
  const { searchResults: goldTypesList, searchLoading: goldTypesLoading } = useGetGoldPriceHistory();
  const [editing, setEditing] = useState(null);

  const body = goldTypesLoading ? (
    <GridCardSkeleton count={6} cols={{ xs: 12, sm: 6, md: 4 }} imageHeight={180} />
  ) : (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 3 } }}>
      <Grid container spacing={2}>
        {goldTypesList.map((t) => (
          <Grid key={t.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GoldTypeCard type={t} onEdit={setEditing} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Loại vàng"
        subtitle="SJC 9999 · Nhẫn trơn · Vàng 750 (18K)…"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Loại vàng' }]}
        actions={
          <Button
            variant="contained" size="small"
            startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
            href={adminPaths.goldType.root + '/new'}
            sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
          >
            Thêm loại vàng
          </Button>
        }
      />
      {body}
    </DashboardContent>
  );
}
