'use client';

import { useState } from 'react';

import { IconButton } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import {
  useGetSizeGuideList,
  refreshSizeGuideList,
  actionCreateSizeGuide,
  actionUpdateSizeGuide,
} from 'src/actions/admin/size-guide';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { SizeGuideFormDrawer } from './size-guide-create-form';

export function SizeGuideListView({ embedded = false, createOpen, onCloseCreate } = {}) {
  const { searchResults: rows, searchLoading: loading } = useGetSizeGuideList();
  const [editing, setEditing] = useState(null);

  const columns = [
    { field: 'name', headerName: 'Hướng dẫn', flex: 1 },
    {
      field: 'item_count', headerName: 'Số size', width: 120,
      valueGetter: (_v, row) => row?.items?.length ?? row?.item_count ?? 0,
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

  const handleCreate = async (v) => {
    try {
      await actionCreateSizeGuide(v);
      toast.success('Đã tạo hướng dẫn size');
      refreshSizeGuideList();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Lỗi khi tạo hướng dẫn size');
      throw e;
    }
  };
  const handleUpdate = async (v) => {
    try {
      await actionUpdateSizeGuide(editing._id ?? editing.id, v);
      toast.success('Đã lưu hướng dẫn size');
      refreshSizeGuideList();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Lỗi khi lưu hướng dẫn size');
      throw e;
    }
  };

  return (
    <>
      <SimpleListView
        embedded={embedded}
        title="Hướng dẫn đo size"
        subtitle="Đo size nhẫn / vòng tay / lắc / dây chuyền"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Hướng dẫn size' }]}
        rows={rows}
        columns={columns}
        loading={loading}
        createLabel="Tạo hướng dẫn"
        createDrawer={(close) => (
          <SizeGuideFormDrawer open onClose={close} onSubmit={handleCreate} />
        )}
        createOpen={createOpen}
        onCloseCreate={onCloseCreate}
      />

      <SizeGuideFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
      />
    </>
  );
}
