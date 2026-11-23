'use client';

import { Avatar, Box, Chip, IconButton, LinearProgress, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtNumber, fmtVND } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { mockWishlists } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const wishlistsList = mockWishlists;
const TREND = {
  hot:    { label: 'Hot',     color: 'error',   icon: 'solar:fire-bold' },
  stable: { label: 'Ổn định', color: 'info',    icon: 'solar:minus-circle-bold' },
  cold:   { label: 'Nguội',   color: 'default', icon: 'solar:snowflake-bold' },
};

const columns = [
  {
    field: 'product', headerName: 'Sản phẩm', flex: 1, minWidth: 260,
    renderCell: (p) => (
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar src={p.row.image ?? '-'} variant="rounded" sx={{ width: 44, height: 44, bgcolor: 'grey.100' }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12.5 }} noWrap>{p.row.product_name ?? '-'}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: 11 }}>{p.row.product_code ?? '-'}</Typography>
        </Box>
      </Stack>
    ),
  },
  {
    field: 'trending', headerName: 'Trend', width: 110,
    renderCell: (p) => {
      const t = TREND[p.row.trending];
      return <Label color={t.color} variant="filled">{t.label}</Label>;
    },
  },
  {
    field: 'wish_count', headerName: 'Lượt wish', width: 150,
    renderCell: (p) => {
      const maxCount = wishlistsList[0].wish_count;
      const pct = (p.row.wish_count / maxCount) * 100;
      return (
        <Stack sx={{ width: '100%' }} spacing={0.25}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13 }}>{fmtNumber(p.row.wish_count)}</Typography>
          <LinearProgress variant="determinate" value={pct} sx={{ height: 4, borderRadius: 2 }} />
        </Stack>
      );
    },
  },
  { field: 'unique_users', headerName: 'Users', width: 100, align: 'right', renderCell: (p) => fmtNumber(p.row.unique_users) },
  { field: 'avg_price', headerName: 'Giá TB', width: 130, align: 'right', renderCell: (p) => fmtVND(p.row.avg_price) },
  {
    field: 'in_stock', headerName: 'Tồn kho', width: 110,
    renderCell: (p) => (
      p.row.in_stock
        ? <Chip icon={<Iconify icon="solar:check-circle-linear" width={11} />} label="Còn hàng" size="small" color="success" variant="outlined" />
        : <Chip icon={<Iconify icon="solar:close-circle-linear" width={11} />} label="Hết hàng" size="small" color="error" variant="outlined" />
    ),
  },
  {
    field: 'actions', headerName: '', width: 60, sortable: false, align: 'center',
    renderCell: () => <IconButton size="small"><Iconify icon="solar:eye-linear" width={16} /></IconButton>,
  },
];

export function WishlistListView({ embedded = false } = {}) {
  return (
    <SimpleListView
      embedded={embedded}
      title="SP được yêu thích nhất"
      subtitle={`${wishlistsList.length} SP · phân tích trend để quyết định nhập hàng`}
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Wishlist' }]}
      rows={wishlistsList}
      columns={columns}
      searchKeys={['product_name', 'product_code']}
    />
  );
}
