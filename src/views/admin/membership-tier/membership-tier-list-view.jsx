'use client';

import { useState } from 'react';

import { Chip, IconButton } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtNumber } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';

import { MembershipTierFormDrawer } from './membership-tier-create-form';
import { mockMembershipTiers } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const membershipTiersList = mockMembershipTiers;
const TIER_COLOR = { silver: 'default', gold: 'warning', platinum: 'info', diamond: 'secondary' };

export function MembershipTierListView() {
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'name', headerName: 'Hạng', width: 160,
      renderCell: (p) => <Chip icon={<Iconify icon={p.row.icon ?? 'solar:crown-linear'} width={14} />} label={p.row.name ?? '-'} color={TIER_COLOR[p.row.code]} />,
    },
    { field: 'min_spent', headerName: 'Chi tiêu tối thiểu', width: 180, align: 'right', renderCell: (p) => fmtVND(p.row.min_spent) },
    { field: 'point_rate', headerName: 'Tỉ lệ điểm / 1k₫', width: 150, renderCell: (p) => p.row.point_rate },
    { field: 'discount_pct', headerName: '% giảm', width: 100, renderCell: (p) => `${p.row.discount_pct ?? 0}%` },
    { field: 'customer_count', headerName: 'Số khách', width: 110, renderCell: (p) => fmtNumber(p.row.customer_count ?? 0) },
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
        title="Hạng thành viên"
        subtitle="Silver → Gold → Platinum → Diamond"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Hạng thành viên' }]}
        rows={membershipTiersList}
        columns={columns}
        createLabel="Tạo hạng"
        createDrawer={(close) => (
          <MembershipTierFormDrawer open onClose={close} onSubmit={(v) => console.log('create tier', v)} />
        )}
      />

      <MembershipTierFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update tier', v)}
      />
    </>
  );
}
