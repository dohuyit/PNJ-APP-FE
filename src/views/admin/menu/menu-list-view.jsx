// src/views/admin/menu/menu-list-view.jsx — tonal grouped menu locations

'use client';

import { useState } from 'react';

import {
  Box, Button, Chip, Divider, Grid, IconButton, Stack, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { menuTreeByLocation } from 'src/mock-data/menu';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMenuLocationList } from 'src/actions/admin/menu';
import { m, staggerContainer, fadeIn, hoverLift } from 'src/views/admin/_shared/motion';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';

import { MenuLocationFormDrawer } from './menu-create-form';

// ---------- Metadata ----------

// Tonal per group · màu dịu, không gắt
const GROUP_PALETTE = {
  header: { color: '#2563EB', soft: '#EFF6FF' },  // sky
  mega:   { color: '#D97706', soft: '#FFFBEB' },  // amber (vibes trang sức)
  footer: { color: '#059669', soft: '#ECFDF5' },  // emerald
  mobile: { color: '#7C3AED', soft: '#F5F3FF' },  // violet
};

const LOCATION_META = {
  header_top:     { icon: 'solar:hamburger-menu-linear',        group: 'header', hint: 'Dưới logo · trên banner hero' },
  mega_female:    { icon: 'solar:women-linear',                 group: 'mega',   hint: 'Hover "Nữ" ở main nav' },
  mega_male:      { icon: 'solar:men-linear',                   group: 'mega',   hint: 'Hover "Nam" ở main nav' },
  mega_kids:      { icon: 'solar:emoji-funny-circle-linear',    group: 'mega',   hint: 'Hover "Trẻ em" ở main nav' },
  footer_about:   { icon: 'solar:info-circle-linear',           group: 'footer', hint: 'Cột 1 ở footer' },
  footer_service: { icon: 'solar:settings-linear',              group: 'footer', hint: 'Cột 2 ở footer' },
  footer_policy:  { icon: 'solar:shield-user-linear',           group: 'footer', hint: 'Cột 3 ở footer' },
  mobile:         { icon: 'solar:smartphone-linear',            group: 'mobile', hint: 'Drawer bên trái trên mobile' },
};

const GROUP_META = {
  header: { label: 'Khu vực đầu trang', icon: 'solar:hamburger-menu-linear' },
  mega:   { label: 'Mega menu',          icon: 'solar:widget-linear' },
  footer: { label: 'Chân trang',          icon: 'solar:document-text-linear' },
  mobile: { label: 'Thiết bị di động',    icon: 'solar:smartphone-linear' },
};

// ---------- Menu card ----------

function MenuCard({ meta, location }) {
  const tree = menuTreeByLocation[location.location] ?? [];
  const preview = tree.slice(0, 4);
  const totalChildren = tree.reduce((n, it) => n + (it.children?.length ?? 0), 0);
  const palette = GROUP_PALETTE[meta.group] ?? GROUP_PALETTE.header;

  return (
    <m.div variants={fadeIn} {...hoverLift} style={{ height: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          border: 1, borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          height: '100%',
          display: 'flex', flexDirection: 'column',
          transition: 'border-color .2s ease, box-shadow .2s ease',
          '&:hover': {
            borderColor: palette.color,
            boxShadow: `0 8px 24px ${palette.color}22`,
          },
        }}
      >
        {/* Top accent strip theo nhóm · mảnh, duy nhất 1 đường màu */}
        <Box sx={{ height: 3, bgcolor: palette.color, opacity: 0.85 }} />

        <Stack
          direction="row" alignItems="center" spacing={1.5}
          sx={{ px: 2, pt: 2, pb: 1.5 }}
        >
          {/* Icon trong ô bo nhỏ có bg accent */}
          <Box
            sx={{
              width: 40, height: 40, borderRadius: 1.25,
              bgcolor: palette.soft,
              border: 1, borderColor: palette.color + '33',
              display: 'grid', placeItems: 'center',
              color: palette.color, flexShrink: 0,
            }}
          >
            <Iconify icon={meta.icon} width={20} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'text.primary', lineHeight: 1.25 }}>
              {location.label}
            </Typography>
            <Typography sx={{ fontSize: 10.5, color: 'text.disabled', mt: 0.25 }} noWrap>
              {meta.hint}
            </Typography>
          </Box>

          {/* Status chip "Đã đăng" nhẹ */}
          <Tooltip title="Trạng thái: Đã đăng">
            <Stack
              direction="row" alignItems="center" spacing={0.5}
              sx={{
                bgcolor: '#F0FDF4', color: '#16A34A',
                border: '1px solid #DCFCE7',
                borderRadius: 10, px: 0.75, py: 0.2,
                flexShrink: 0,
              }}
            >
              <Box sx={{
                width: 5, height: 5, borderRadius: '50%', bgcolor: '#22C55E',
                animation: 'statusPulse 2s ease-in-out infinite',
                '@keyframes statusPulse': {
                  '0%,100%': { opacity: 1 },
                  '50%':     { opacity: 0.45 },
                },
              }} />
              <Typography sx={{ fontSize: 9.5, fontWeight: 600, letterSpacing: 0.2 }}>Hoạt động</Typography>
            </Stack>
          </Tooltip>
        </Stack>

        <Divider />

        {/* Stats inline · số chính dùng accent */}
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ px: 2, py: 1.5, bgcolor: palette.soft + '77' }}
        >
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 9, color: 'text.disabled', fontWeight: 500, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              Mục chính
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: palette.color, lineHeight: 1.1, mt: 0.2, fontVariantNumeric: 'tabular-nums' }}>
              {location.item_count}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 9, color: 'text.disabled', fontWeight: 500, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              Mục con
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary', lineHeight: 1.1, mt: 0.2, fontVariantNumeric: 'tabular-nums' }}>
              {totalChildren}
            </Typography>
          </Box>
        </Stack>

        <Divider />

        {/* Preview items */}
        {preview.length > 0 && (
          <Box sx={{ p: 2, flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
              <Box sx={{ width: 10, height: 1.5, bgcolor: palette.color, opacity: 0.6 }} />
              <Typography sx={{ fontSize: 9, color: palette.color, fontWeight: 700, letterSpacing: 0.5 }}>
                XEM TRƯỚC
              </Typography>
            </Stack>
            <Stack spacing={0.75}>
              {preview.map((item) => (
                <Stack key={item.id} direction="row" alignItems="center" spacing={0.75}>
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: palette.color, opacity: 0.6, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 11.5, color: 'text.secondary', flex: 1 }} noWrap>
                    {item.label}
                  </Typography>
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 15, fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
                        bgcolor: palette.color, color: 'common.white',
                        '& .MuiChip-label': { px: 0.6 },
                      }}
                    />
                  )}
                  {item.children?.length > 0 && (
                    <Typography sx={{ fontSize: 10, color: palette.color, fontFamily: 'monospace', fontWeight: 600, bgcolor: palette.soft, px: 0.5, borderRadius: 0.5 }}>
                      +{item.children.length}
                    </Typography>
                  )}
                </Stack>
              ))}
              {tree.length > 4 && (
                <Typography sx={{ fontSize: 10.5, color: 'text.disabled', pl: 1.5 }}>
                  … {tree.length - 4} mục khác
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        <Divider />

        {/* Footer actions */}
        <Stack direction="row" sx={{ bgcolor: 'background.paper' }}>
          <Button
            component={RouterLink}
            href={adminPaths.menu.edit(location.location)}
            size="small"
            fullWidth
            startIcon={<Iconify icon="solar:pen-linear" width={12} />}
            sx={{
              borderRadius: 0, py: 1.25,
              color: palette.color, fontWeight: 600, fontSize: 12,
              borderRight: 1, borderColor: 'divider',
              '&:hover': { bgcolor: palette.soft },
            }}
          >
            Chỉnh sửa
          </Button>
          <Tooltip title="Sao chép">
            <IconButton size="small" sx={{ borderRadius: 0, color: 'text.secondary', px: 1.5, borderRight: 1, borderColor: 'divider', '&:hover': { bgcolor: 'grey.50', color: palette.color } }}>
              <Iconify icon="solar:copy-linear" width={14} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xem trước">
            <IconButton size="small" sx={{ borderRadius: 0, color: 'text.secondary', px: 1.5, '&:hover': { bgcolor: 'grey.50', color: palette.color } }}>
              <Iconify icon="solar:eye-linear" width={14} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </m.div>
  );
}

// ---------- Group section ----------

function GroupSection({ groupKey, locations }) {
  const meta = GROUP_META[groupKey];
  const palette = GROUP_PALETTE[groupKey] ?? GROUP_PALETTE.header;
  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
        <Box
          sx={{
            width: 28, height: 28, borderRadius: 1,
            bgcolor: palette.soft, color: palette.color,
            border: 1, borderColor: palette.color + '33',
            display: 'grid', placeItems: 'center',
          }}
        >
          <Iconify icon={meta.icon} width={14} />
        </Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>
          {meta.label}
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
          · {locations.length} vị trí · {locations.reduce((n, l) => n + l.item_count, 0)} mục
        </Typography>
        <Box sx={{
          flex: 1, height: 1,
          background: `linear-gradient(90deg, ${palette.color}44, transparent)`,
        }} />
      </Stack>

      <m.div variants={staggerContainer(0.06, 0.1)} initial="hidden" animate="show">
        <Grid container spacing={2}>
          {locations.map((loc) => (
            <Grid key={loc.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <MenuCard meta={LOCATION_META[loc.location]} location={loc} />
            </Grid>
          ))}
        </Grid>
      </m.div>
    </Box>
  );
}

// ---------- Main ----------

export function MenuLocationCreateButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small" variant="contained"
        startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
        onClick={() => setOpen(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Thêm vị trí
      </Button>
      <MenuLocationFormDrawer
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(v) => console.log('create menu location', v)}
      />
    </>
  );
}

export function MenuListView({ embedded = false } = {}) {
  const { locations: menuLocationsList } = useGetMenuLocationList();
  const grouped = menuLocationsList.reduce((acc, loc) => {
    const g = LOCATION_META[loc.location]?.group ?? 'other';
    (acc[g] = acc[g] ?? []).push(loc);
    return acc;
  }, {});

  const body = (
    <Box sx={{ p: { xs: 2, md: 2.5 } }}>
      {['header', 'mega', 'footer', 'mobile'].map((g) =>
        grouped[g] ? <GroupSection key={g} groupKey={g} locations={grouped[g]} /> : null
      )}
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Menu điều hướng"
        subtitle="Quản lý mega menu, header, footer và mobile · đồng bộ cache Redis"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Menu' }]}
        actions={<MenuLocationCreateButton />}
      />
      {body}
    </DashboardContent>
  );
}
