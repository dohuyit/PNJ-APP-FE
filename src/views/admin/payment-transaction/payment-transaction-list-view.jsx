'use client';

import { Chip, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtRelative } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { mockPaymentTransactions } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const paymentTransactionsList = mockPaymentTransactions;
const GW = {
  vnpay:     { label: 'VNPay',   color: 'primary', icon: 'solar:card-linear' },
  momo:      { label: 'MoMo',    color: 'error',   icon: 'solar:wallet-linear' },
  zalopay:   { label: 'ZaloPay', color: 'info',    icon: 'solar:chat-line-linear' },
  cod:       { label: 'COD',     color: 'default', icon: 'solar:hand-stars-linear' },
  card_intl: { label: 'Thẻ QT',  color: 'warning', icon: 'solar:card-2-linear' },
};

const TYPE = {
  auth:   { label: 'Giữ chỗ', color: 'info' },
  charge: { label: 'Thu',     color: 'success' },
  refund: { label: 'Hoàn',    color: 'warning' },
};

const STATUS = {
  success: { label: 'Thành công', color: 'success' },
  pending: { label: 'Đang chờ',    color: 'warning' },
  failed:  { label: 'Thất bại',    color: 'error' },
};

const columns = [
  { field: 'reference', headerName: 'TXN', width: 170,
    renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.row.reference ?? '-'}</Typography> },
  { field: 'order_no', headerName: 'Đơn', width: 170,
    renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>{p.row.order_no ?? '-'}</Typography> },
  {
    field: 'gateway', headerName: 'Gateway', width: 130,
    renderCell: (p) => {
      const g = GW[p.row.gateway];
      return <Chip icon={<Iconify icon={g.icon} width={12} />} label={g.label} size="small" color={g.color} variant="outlined" />;
    },
  },
  { field: 'type', headerName: 'Loại', width: 100, renderCell: (p) => <Label color={TYPE[p.row.type].color}>{TYPE[p.row.type].label}</Label> },
  { field: 'amount', headerName: 'Số tiền', width: 160, align: 'right',
    renderCell: (p) => (
      <Typography variant="body2" sx={{ fontWeight: 700, color: p.row.type === 'refund' ? 'warning.dark' : 'success.dark' }}>
        {p.row.type === 'refund' ? '-' : '+'}{fmtVND(p.row.amount ?? 0)}
      </Typography>
    ) },
  { field: 'status', headerName: 'Trạng thái', width: 130, renderCell: (p) => <Label color={STATUS[p.row.status].color} variant="filled">{STATUS[p.row.status].label}</Label> },
  { field: 'created_at', headerName: 'Thời gian', width: 150, renderCell: (p) => fmtRelative(p.row.created_at) },
];

export function PaymentTransactionListView({ embedded = false } = {}) {
  return (
    <SimpleListView
      embedded={embedded}
      title="Giao dịch thanh toán"
      subtitle={`${paymentTransactionsList.length} giao dịch · auth / charge / refund qua các gateway`}
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Giao dịch TT' }]}
      rows={paymentTransactionsList}
      columns={columns}
      searchKeys={['reference', 'order_no']}
    />
  );
}
