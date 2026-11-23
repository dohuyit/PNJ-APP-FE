'use client';

import { useState } from 'react';

import { IconButton } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { StatusBadge } from 'src/components/common/status-badge';

import { EcardCategoryFormDrawer } from './ecard-category-create-form';
import { mockEcardCategories } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const ecardCategoriesList = mockEcardCategories;
export function EcardCategoryListView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);

  const columns = [
    { field: 'code', headerName: 'Code', width: 150, renderCell: (p) => <code>{p.row.code ?? '-'}</code> },
    { field: 'name', headerName: 'Chủ đề', flex: 1 },
    { field: 'sort', headerName: 'Thứ tự', width: 100 },
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
        title="Chủ đề thiệp điện tử"
        subtitle="Tặng mẹ · Thả thính · Cảm ơn · 20/10 · Nhà giáo · Giáng Sinh..."
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Thiệp — Chủ đề' }]}
        rows={ecardCategoriesList}
        columns={columns}
        createLabel="Tạo chủ đề"
        createDrawer={(close) => (
          <EcardCategoryFormDrawer open onClose={close} onSubmit={(v) => console.log('create ecard-category', v)} />
        )}
      />

      <EcardCategoryFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update ecard-category', v)}
      />
    </>
  );
}
