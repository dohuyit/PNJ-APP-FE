// src/views/admin/payment-method/payment-method-list-view.jsx — list phương thức thanh toán

'use client';

import { useState } from 'react';

import { Avatar, Chip, IconButton, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { StatusBadge } from 'src/components/common/status-badge';

import { PaymentMethodFormDrawer } from './payment-method-create-form';
import { mockPaymentMethods } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const paymentMethodsList = mockPaymentMethods;
export function PaymentMethodListView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'logo', headerName: '', width: 80, sortable: false,
      renderCell: (p) => (
        <Avatar src={p.row.logo_file_id ?? '-'} variant="rounded" sx={{ width: 56, height: 28, bgcolor: 'grey.100' }}>
          <Iconify icon="solar:card-linear" width={16} sx={{ color: 'text.disabled' }} />
        </Avatar>
      ),
    },
    {
      field: 'code', headerName: 'Code', width: 150,
      renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{p.row.code ?? '-'}</Typography>,
    },
    {
      field: 'name', headerName: 'Tên', flex: 1, minWidth: 220,
      renderCell: (p) => (
        <Stack>
          <Typography variant="subtitle2">{p.row.name ?? '-'}</Typography>
          <Typography variant="caption" color="text.secondary">Gateway: {p.row.gateway ?? '-'}</Typography>
        </Stack>
      ),
    },
    {
      field: 'gateway', headerName: 'Gateway', width: 120,
      renderCell: (p) => <Chip label={p.row.gateway ?? '-'} size="small" variant="outlined" />,
    },
    {
      field: 'max_amount', headerName: 'Tối đa', width: 140, align: 'right',
      renderCell: (p) => (p.row.max_amount ? fmtVND(p.row.max_amount) : '—'),
    },
    { field: 'sort', headerName: 'Thứ tự', width: 90 },
    {
      field: 'status', headerName: 'Trạng thái', width: 130,
      renderCell: (p) => <StatusBadge status={p.row.status} colorMap={COMMON_STATUS_COLOR} labelMap={COMMON_STATUS_LABEL} />,
    },
    {
      field: 'actions', headerName: '', width: 60, sortable: false,
      renderCell: (p) => (
        <IconButton size="small" onClick={() => setEditing(p.row)}>
          <Iconify icon="solar:pen-linear" width={16} />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <SimpleListView
        embedded={embedded}
        title="Phương thức thanh toán"
        subtitle={`${paymentMethodsList.length} phương thức · VNPay / MoMo / ZaloPay / OnePay / Payoo / Manual`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Thanh toán' }]}
        rows={paymentMethodsList}
        columns={columns}
        createLabel="Thêm phương thức"
        createDrawer={(close) => (
          <PaymentMethodFormDrawer open onClose={close} onSubmit={(v) => console.log('create pm', v)} />
        )}
        searchKeys={['code', 'name']}
      />

      <PaymentMethodFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update pm', v)}
      />
    </>
  );
}
