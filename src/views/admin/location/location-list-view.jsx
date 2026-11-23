'use client';

import { IconButton } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { useGetStoreProvinces } from 'src/actions/admin/store';
import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';


const columns = [
  { field: 'code', headerName: 'Mã', width: 100, renderCell: (p) => <code>{p.row.code ?? '-'}</code> },
  { field: 'name', headerName: 'Tỉnh / TP', flex: 1 },
  { field: 'ward_count', headerName: 'Số phường', width: 130 },
  { field: 'shipping_zone', headerName: 'Vùng ship', width: 130, renderCell: (p) => <Label>{p.row.shipping_zone ?? '-'}</Label> },
  { field: 'express_3h_available', headerName: 'Giao 3H', width: 130, renderCell: (p) => p.row.express_3h_available ? <Label color="success" variant="filled">Có</Label> : '—' },
  { field: 'actions', headerName: '', width: 60, sortable: false, renderCell: () => <IconButton size="small"><Iconify icon="solar:pen-linear" width={16} /></IconButton> },
];

export function LocationListView({ embedded = false } = {}) {
  const { provinces: locationsProvinces, provincesLoading } = useGetStoreProvinces();
  return (
    <SimpleListView
      embedded={embedded}
      title="Địa giới hành chính"
      subtitle="Tỉnh / Phường sau sáp nhập · mapping từ mã cũ"
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Địa giới' }]}
      rows={locationsProvinces}
      columns={columns}
      loading={provincesLoading}
      createLabel="Nhập từ JSON"
    />
  );
}
