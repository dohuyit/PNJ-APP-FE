'use client';

import { useState } from 'react';

import { IconButton } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';

import { RegionFormDrawer } from './region-create-form';
import { mockRegions } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const regionsList = mockRegions;
export function RegionListView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);

  const columns = [
    { field: 'code', headerName: 'Code', width: 100, renderCell: (p) => <code>{p.row.code ?? '-'}</code> },
    { field: 'name', headerName: 'Vùng kinh doanh', flex: 1 },
    { field: 'province_count', headerName: 'Số tỉnh', width: 120 },
    { field: 'sort', headerName: 'Thứ tự', width: 100 },
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
        title="Vùng kinh doanh"
        subtitle="HCM · Miền Bắc · Miền Trung · Tây Nguyên · Đông Nam Bộ · Miền Tây"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Vùng kinh doanh' }]}
        rows={regionsList}
        columns={columns}
        createLabel="Tạo vùng"
        createDrawer={(close) => (
          <RegionFormDrawer open onClose={close} onSubmit={(v) => console.log('create region', v)} />
        )}
      />

      <RegionFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update region', v)}
      />
    </>
  );
}
