'use client';

import { useState } from 'react';

import { Chip, IconButton, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtDate } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';

import { InstallmentPlanFormDrawer } from './installment-plan-create-form';
import { mockInstallmentPlans, mockBanks } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const banksList = mockBanks;
const installmentPlansList = mockInstallmentPlans;
const bankByCode = Object.fromEntries(banksList.map((b) => [b.code, b]));

export function InstallmentPlanListView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'provider', headerName: 'Provider', width: 110,
      renderCell: (p) => <Label color="info">{p.row.provider ?? '-'}</Label>,
    },
    {
      field: 'bank_code', headerName: 'Ngân hàng', width: 160,
      renderCell: (p) => {
        const b = bankByCode[p.row.bank_code];
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <code>{p.row.bank_code ?? '-'}</code>
            <Typography variant="caption" color="text.secondary">{b?.short_name}</Typography>
          </Stack>
        );
      },
    },
    {
      field: 'months', headerName: 'Kỳ hạn', flex: 1, minWidth: 200,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {p.row.months.map((m) => <Chip key={m} label={`${m}m`} size="small" variant="outlined" />)}
        </Stack>
      ),
    },
    {
      field: 'interest_rate', headerName: 'Lãi suất', width: 100,
      renderCell: (p) => (p.row.interest_rate === 0 ? <Label color="success" variant="filled">0%</Label> : `${p.row.interest_rate ?? 0}%`),
    },
    { field: 'min_order_amount', headerName: 'Đơn tối thiểu', width: 150, align: 'right', renderCell: (p) => fmtVND(p.row.min_order_amount) },
    { field: 'end_at', headerName: 'Hết hạn', width: 120, renderCell: (p) => fmtDate(p.row.end_at) },
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
        title="Gói trả góp"
        subtitle={`${installmentPlansList.length} gói · Payoo / OnePay / Home Credit / FE Credit`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Trả góp' }]}
        rows={installmentPlansList}
        columns={columns}
        createLabel="Tạo gói"
        createDrawer={(close) => (
          <InstallmentPlanFormDrawer open onClose={close} onSubmit={(v) => console.log('create plan', v)} />
        )}
        searchKeys={['bank_code', 'provider']}
      />

      <InstallmentPlanFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update plan', v)}
      />
    </>
  );
}
