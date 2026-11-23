// src/views/admin/product/product-list-columns.jsx — DataGrid columns for product list

'use client';

import { Avatar, Badge, Box, Chip, Rating, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fmtVND, fmtNumber, fmtRelative } from 'src/utils/format';

import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';
import { PRODUCT_STATUS_COLOR, PRODUCT_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';

const TYPE_META = {
  jewelry: { label: 'Trang sức', icon: 'solar:crown-bold',       color: '#F59E0B' },
  watch:   { label: 'Đồng hồ',   icon: 'solar:clock-circle-bold', color: '#3B82F6' },
  diamond: { label: 'Kim cương', icon: 'solar:star-shine-bold',   color: '#A855F7' },
  gift:    { label: 'Quà tặng',  icon: 'solar:gift-bold',         color: '#EC4899' },
  egift:   { label: 'E-gift',    icon: 'solar:letter-bold',       color: '#10B981' },
};

export function makeProductListColumns({ onDelete, onDuplicate, onView }) {
  return [
    {
      field: 'name', headerName: 'Sản phẩm', flex: 1.5, minWidth: 300, sortable: false,
      renderCell: (p) => {
        const variantCount = p.row.variants?.length ?? 0;
        const firstVar = p.row.variants?.[0];
        const sizes = (p.row.variants ?? []).map((v) => v.size).filter(Boolean).join('/') || firstVar?.size;
        return (
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ py: 1, minWidth: 0, width: '100%' }}>
            <Badge
              overlap="rectangular"
              badgeContent={variantCount > 1 ? `×${variantCount}` : null}
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  top: 4, right: 4, height: 18, minWidth: 22, px: 0.5,
                  fontSize: 10, fontWeight: 800, fontFamily: 'monospace',
                  borderRadius: '6px',
                  boxShadow: '0 0 0 2px #fff',
                },
              }}
            >
              <Avatar
                src={p.row.media?.[0]}
                variant="rounded"
                sx={{ width: 48, height: 48, bgcolor: 'grey.100', flexShrink: 0 }}
              >
                <Iconify icon="solar:box-linear" width={18} />
              </Avatar>
            </Badge>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                component={RouterLink}
                href={adminPaths.product.edit(p.row.id)}
                variant="subtitle2"
                sx={{ textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' }, fontSize: 13, display: 'block' }}
                noWrap
              >
                {p.row.name}
              </Typography>
              <Typography
                variant="caption" color="text.secondary" noWrap
                sx={{ fontFamily: 'monospace', display: 'block', fontSize: 10.5 }}
              >
                {p.row.display_code} · {p.row.brand?.name}
                {sizes && ` · Size ${sizes}`}
              </Typography>
            </Box>
          </Stack>
        );
      },
    },

    // Loại SP mới
    {
      field: 'type', headerName: 'Loại', width: 130,
      renderCell: (p) => {
        const m = TYPE_META[p.row.type] ?? { label: p.row.type, icon: 'solar:tag-linear', color: '#64748B' };
        return (
          <Chip
            icon={<Iconify icon={m.icon} width={11} />}
            label={m.label}
            size="small"
            sx={{
              height: 22, fontSize: 10.5, fontWeight: 600,
              bgcolor: `${m.color}1A`, color: m.color,
              '& .MuiChip-icon': { color: 'inherit' },
            }}
          />
        );
      },
    },

    { field: 'category', headerName: 'Danh mục', width: 140,
      renderCell: (p) => (
        <Stack>
          <Typography variant="body2">{p.row.category?.name}</Typography>
          <Typography variant="caption" color="text.secondary">{p.row.brand?.name}</Typography>
        </Stack>
      ),
    },

    // Fix: align right cho cả header + content
    {
      field: 'price', headerName: 'Giá', width: 170, align: 'right', headerAlign: 'right',
      renderCell: (p) => (
        <Box sx={{ width: '100%', textAlign: 'right' }}>
          <Typography variant="body2" fontWeight={700} color="warning.dark" sx={{ fontSize: 13 }}>
            {fmtVND(p.row.price_min)}
          </Typography>
          {p.row.price_max !== p.row.price_min && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
              → {fmtVND(p.row.price_max)}
            </Typography>
          )}
        </Box>
      ),
    },

    // Biến thể mới
    {
      field: 'variants', headerName: 'Biến thể', width: 100, align: 'center',
      renderCell: (p) => (
        <Chip
          icon={<Iconify icon="solar:layers-minimalistic-linear" width={11} />}
          label={p.row.variants?.length ?? 0}
          size="small"
          variant="outlined"
          sx={{ height: 22, fontSize: 11, fontWeight: 600 }}
        />
      ),
    },

    // Tồn
    {
      field: 'stock', headerName: 'Tồn', width: 90, align: 'right',
      renderCell: (p) => {
        const total = (p.row.variants ?? []).reduce((s, v) => s + (v.total_stock ?? 0), 0);
        return <Label color={total === 0 ? 'error' : total < 5 ? 'warning' : 'default'} variant="filled">{fmtNumber(total)}</Label>;
      },
    },

    // Đã bán mới
    {
      field: 'sold', headerName: 'Đã bán', width: 100, align: 'right',
      renderCell: (p) => (
        <Stack alignItems="flex-end" sx={{ width: '100%' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 12.5 }}>
            {fmtNumber(p.row.stats?.sold_count ?? 0)}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>
            {fmtNumber(p.row.stats?.view_count ?? 0)} lượt xem
          </Typography>
        </Stack>
      ),
    },

    // Rating mới
    {
      field: 'rating', headerName: 'Đánh giá', width: 150,
      renderCell: (p) => (
        <Stack spacing={0.25}>
          <Rating value={p.row.rating?.avg ?? 0} readOnly precision={0.1} size="small" sx={{ fontSize: 13 }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10.5 }}>
            {(p.row.rating?.avg ?? 0).toFixed(1)} · {p.row.rating?.count ?? 0} đánh giá
          </Typography>
        </Stack>
      ),
    },

    // Doanh thu: ước lượng sold_count × giá trung bình — thay cho cột Nhãn
    {
      field: 'revenue', headerName: 'Doanh thu', width: 160, align: 'right', headerAlign: 'right',
      renderCell: (p) => {
        const sold = p.row.stats?.sold_count ?? 0;
        const avgPrice = ((p.row.price_min ?? 0) + (p.row.price_max ?? p.row.price_min ?? 0)) / 2;
        const revenue = sold * avgPrice;
        const wishlist = p.row.stats?.wishlist_count ?? 0;
        return (
          <Box sx={{ width: '100%', textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.darker', fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>
              {fmtVND(revenue)}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end" sx={{ mt: 0.25 }}>
              <Iconify icon="solar:heart-linear" width={10} sx={{ color: 'text.disabled' }} />
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10 }}>
                {fmtNumber(wishlist)} wishlist
              </Typography>
            </Stack>
          </Box>
        );
      },
    },

    {
      field: 'status', headerName: 'Trạng thái', width: 130,
      renderCell: (p) => <StatusBadge status={p.row.status} colorMap={PRODUCT_STATUS_COLOR} labelMap={PRODUCT_STATUS_LABEL} />,
    },

    {
      field: 'updated_at', headerName: 'Cập nhật', width: 130,
      renderCell: (p) => <Typography variant="caption" color="text.secondary">{fmtRelative(p.row.updated_at)}</Typography>,
    },

    {
      field: 'actions', headerName: '', width: 60, align: 'center', sortable: false,
      renderCell: (p) => (
        <RowActionsMenu
          items={[
            { label: 'Xem chi tiết',   icon: 'solar:eye-linear',       onClick: () => onView?.(p.row) },
            { label: 'Sửa sản phẩm',   icon: 'solar:pen-linear',       href: adminPaths.product.edit(p.row.id) },
            { label: 'Xem trên site',  icon: 'solar:global-linear',    onClick: () => p.row.slug && window.open(`/products/${p.row.slug}`, '_blank', 'noopener,noreferrer') },
            { label: 'Nhân bản',       icon: 'solar:copy-linear',      onClick: () => onDuplicate?.(p.row) },
            { divider: true },
            { label: 'In tem SKU',     icon: 'solar:printer-linear',   onClick: () => alert('In tem ' + p.row.display_code) },
            { label: 'Xuất JSON',      icon: 'solar:download-linear',  onClick: () => console.log(JSON.stringify(p.row, null, 2)) },
            { divider: true },
            { label: 'Xoá sản phẩm',   icon: 'solar:trash-bin-trash-linear', color: 'error', onClick: () => onDelete?.(p.row) },
          ]}
        />
      ),
    },
  ];
}
