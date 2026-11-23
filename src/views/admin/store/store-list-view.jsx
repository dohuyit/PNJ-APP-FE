'use client';

import { useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { useGetStoreList } from 'src/actions/admin/store';
import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { usePermission } from 'src/auth/pnj/use-auth-context';
import { StatusBadge } from 'src/components/common/status-badge';

import { StoreFormDrawer } from './store-create-drawer';


const TYPE_LABEL = { jewelry_center: 'TTKH', store: 'Cửa hàng', watch_store: 'CH Đồng hồ', kiosk: 'Kiosk' };
const SERVICE_LABEL = { pickup: 'Nhận', buy_gold_raw: 'Mua vàng', diamond_check: 'KT KC', engraving: 'Khắc', express_3h: '3H' };

export function StoreListView({ embedded = false } = {}) {
  const { searchResults: storesList, searchLoading: storesLoading } = useGetStoreList();
  const [editing, setEditing] = useState(null);
  const { has } = usePermission();
  const canUpdate = has('store.update');
  const canCreate = has('store.create');

  const columns = [
    { field: 'code', headerName: 'Mã', width: 90, renderCell: (p) => <code>{p.row.code ?? '-'}</code> },
    {
      field: 'name', headerName: 'Cửa hàng', flex: 1, minWidth: 260,
      renderCell: (p) => (
        <Stack>
          <Typography variant="subtitle2" noWrap>{p.row.name ?? '-'}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>{p.row.address ?? '-'}</Typography>
        </Stack>
      ),
    },
    { field: 'type', headerName: 'Loại', width: 110, renderCell: (p) => <Label>{TYPE_LABEL[p.row.type]}</Label> },
    {
      field: 'province_name', headerName: 'Tỉnh/TP', width: 150,
      renderCell: (p) => (
        <Stack>
          <Typography variant="body2">{p.row.province_name ?? '-'}</Typography>
          <Typography variant="caption" color="text.secondary">{p.row.ward_name ?? '-'}</Typography>
        </Stack>
      ),
    },
    { field: 'phone', headerName: 'SĐT', width: 130, renderCell: (p) => <Typography sx={{ fontFamily: 'monospace' }}>{p.row.phone ?? '-'}</Typography> },
    {
      field: 'services', headerName: 'Dịch vụ', width: 200, sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5}>
          {(p.row.services ?? []).slice(0, 3).map((s) => <Label key={s} variant="filled">{SERVICE_LABEL[s] ?? s}</Label>)}
        </Stack>
      ),
    },
    {
      field: 'status', headerName: 'Trạng thái', width: 130,
      renderCell: (p) => <StatusBadge status={p.row.status} colorMap={COMMON_STATUS_COLOR} labelMap={COMMON_STATUS_LABEL} />,
    },
    {
      field: 'actions', headerName: '', width: 60, sortable: false,
      renderCell: (p) => canUpdate ? (
        <IconButton size="small" onClick={() => setEditing(p.row)}>
          <Iconify icon="solar:pen-linear" width={16} />
        </IconButton>
      ) : null,
    },
  ];

  return (
    <>
      <SimpleListView
        embedded={embedded}
        title="Cửa hàng"
        subtitle={`${storesList.length} cửa hàng · TTKH / Store / Watch Store / Kiosk`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Cửa hàng' }]}
        rows={storesList}
        loading={storesLoading}
        columns={columns}
        createLabel={canCreate ? 'Tạo cửa hàng' : undefined}
        createDrawer={canCreate ? (close) => (
          <StoreFormDrawer open onClose={close} onSubmit={(v) => console.log('create store', v)} />
        ) : undefined}
        searchKeys={['code', 'name', 'address']}
      />

      <StoreFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update store', v)}
      />
    </>
  );
}
