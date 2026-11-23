'use client';

import { useState } from 'react';

import { Avatar, IconButton, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';

import { BankFormDrawer } from './bank-create-form';
import { mockBanks } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const banksList = mockBanks;
export function BankListView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'logo', headerName: '', width: 70, sortable: false,
      renderCell: (p) => (
        <Avatar src={p.row.logo_file_id ?? '-'} variant="rounded" sx={{ width: 48, height: 30, bgcolor: 'grey.100' }}>
          <Iconify icon="solar:card-linear" width={16} sx={{ color: 'text.disabled' }} />
        </Avatar>
      ),
    },
    {
      field: 'code', headerName: 'Code', width: 100,
      renderCell: (p) => <code style={{ fontWeight: 600 }}>{p.row.code ?? '-'}</code>,
    },
    {
      field: 'name', headerName: 'Ngân hàng', flex: 1, minWidth: 220,
      renderCell: (p) => (
        <Stack>
          <Typography variant="subtitle2">{p.row.name ?? '-'}</Typography>
          <Typography variant="caption" color="text.secondary">{p.row.short_name ?? '-'}</Typography>
        </Stack>
      ),
    },
    {
      field: 'supports_installment', headerName: 'Trả góp', width: 110,
      renderCell: (p) => (p.row.supports_installment ? <Label color="success" variant="filled">0%</Label> : '—'),
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
        title="Ngân hàng"
        subtitle={`${banksList.length} ngân hàng · dùng cho thanh toán, trả góp, VietQR`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Ngân hàng' }]}
        rows={banksList}
        columns={columns}
        createLabel="Thêm ngân hàng"
        createDrawer={(close) => (
          <BankFormDrawer open onClose={close} onSubmit={(v) => console.log('create bank', v)} />
        )}
        searchKeys={['code', 'name', 'short_name']}
      />

      <BankFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update bank', v)}
      />
    </>
  );
}
