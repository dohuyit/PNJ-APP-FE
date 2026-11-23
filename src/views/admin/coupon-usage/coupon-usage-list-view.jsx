'use client';

import { Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtRelative } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Label } from 'src/components/common/label';
import { mockCouponUsages } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const couponUsagesList = mockCouponUsages;
const columns = [
  { field: 'coupon_code', headerName: 'Mã', width: 180,
    renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: 0.5 }}>{p.row.coupon_code ?? '-'}</Typography> },
  { field: 'customer_name', headerName: 'Khách', flex: 1 },
  { field: 'order_no', headerName: 'Đơn', width: 170,
    renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>{p.row.order_no ?? '-'}</Typography> },
  { field: 'discount_amount', headerName: 'Giảm', width: 130, align: 'right',
    renderCell: (p) => <Typography sx={{ color: 'success.main', fontWeight: 700 }}>-{fmtVND(p.row.discount_amount)}</Typography> },
  { field: 'order_total', headerName: 'Tổng đơn', width: 140, align: 'right', renderCell: (p) => fmtVND(p.row.order_total) },
  { field: 'status', headerName: 'TT', width: 110,
    renderCell: (p) => <Label color={p.row.status === 'applied' ? 'success' : 'default'} variant="filled">{p.row.status === 'applied' ? 'Áp dụng' : 'Huỷ'}</Label> },
  { field: 'used_at', headerName: 'Thời gian', width: 150, renderCell: (p) => fmtRelative(p.row.used_at) },
];

export function CouponUsageListView({ embedded = false } = {}) {
  return (
    <SimpleListView
      embedded={embedded}
      title="Lịch sử dùng mã"
      subtitle={`${couponUsagesList.length} lần dùng · theo mã, khách, thời gian`}
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Dùng mã' }]}
      rows={couponUsagesList}
      columns={columns}
      searchKeys={['coupon_code', 'customer_name', 'order_no']}
    />
  );
}
