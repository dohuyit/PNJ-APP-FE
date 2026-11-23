'use client';

import { Avatar, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtNumber, fmtRelative } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { mockLoyaltyTransactions } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const loyaltyTransactionsList = mockLoyaltyTransactions;
const TYPE_META = {
  earn:   { label: 'Tích',    color: 'success', icon: 'solar:add-circle-linear' },
  redeem: { label: 'Đổi',     color: 'primary', icon: 'solar:gift-linear' },
  expire: { label: 'Hết hạn', color: 'default', icon: 'solar:clock-circle-linear' },
};

const columns = [
  {
    field: 'customer', headerName: 'Khách hàng', flex: 1, minWidth: 200,
    renderCell: (p) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar sx={{ width: 32, height: 32, fontSize: 12 }}>{p.row.customer_name?.[0]}</Avatar>
        <Stack>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12.5 }}>{p.row.customer_name ?? '-'}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: 11 }}>{p.row.customer_code ?? '-'}</Typography>
        </Stack>
      </Stack>
    ),
  },
  {
    field: 'type', headerName: 'Loại', width: 120,
    renderCell: (p) => {
      const m = TYPE_META[p.row.type];
      return <Label color={m.color} variant="filled">{m.label}</Label>;
    },
  },
  {
    field: 'points', headerName: 'Điểm', width: 120, align: 'right',
    renderCell: (p) => (
      <Typography sx={{ fontWeight: 700, fontSize: 14, color: p.row.points > 0 ? 'success.main' : 'error.main' }}>
        {p.row.points > 0 ? '+' : ''}{fmtNumber(p.row.points ?? 0)}
      </Typography>
    ),
  },
  { field: 'balance_after', headerName: 'Dư cuối', width: 110, align: 'right',
    renderCell: (p) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtNumber(p.row.balance_after)}</Typography> },
  { field: 'reason', headerName: 'Lý do', flex: 1, renderCell: (p) => <Typography variant="body2">{p.row.reason ?? '-'}</Typography> },
  { field: 'created_at', headerName: 'Thời gian', width: 130, renderCell: (p) => fmtRelative(p.row.created_at) },
];

export function LoyaltyTransactionListView({ embedded = false } = {}) {
  return (
    <SimpleListView
      embedded={embedded}
      title="Nhật ký điểm thưởng"
      subtitle={`${loyaltyTransactionsList.length} giao dịch · Tích / Đổi / Hết hạn`}
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Điểm thưởng' }]}
      rows={loyaltyTransactionsList}
      columns={columns}
      searchKeys={['customer_name', 'reason']}
    />
  );
}
