'use client';

import { useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';
import {
  useGetProductLineList,
  refreshProductLineList,
  actionCreateProductLine,
  actionUpdateProductLine,
} from 'src/actions/admin/product-line';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';

import { ProductLineFormDrawer } from './product-line-create-form';


export function ProductLineListView({ embedded = false, createOpen, onCloseCreate } = {}) {
  const { searchResults: rows, searchLoading: loading } = useGetProductLineList();
  const [editing, setEditing] = useState(null);

  const handleCreate = async (v) => {
    try {
      await actionCreateProductLine(v);
      toast.success('Đã tạo dòng hàng');
      refreshProductLineList();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Lỗi khi tạo dòng hàng');
      throw e;
    }
  };
  const handleUpdate = async (v) => {
    try {
      await actionUpdateProductLine(editing._id ?? editing.id, v);
      toast.success('Đã lưu dòng hàng');
      refreshProductLineList();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Lỗi khi lưu dòng hàng');
      throw e;
    }
  };

  const columns = [
    {
      field: 'name', headerName: 'Dòng hàng', flex: 1, minWidth: 200,
      renderCell: (p) => (
        <Stack>
          <Typography variant="subtitle2">{p.row.name ?? '-'}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>{p.row.short_description ?? '-'}</Typography>
        </Stack>
      ),
    },
    { field: 'product_count', headerName: 'Số SP', width: 100 },
    {
      field: 'badges', headerName: 'Nhãn', width: 160,
      renderCell: (p) => p.row.is_featured_home && <Label color="warning" variant="filled">Nổi bật trang chủ</Label>,
    },
    {
      field: 'status', headerName: 'Trạng thái', width: 130,
      renderCell: (p) => <StatusBadge status={p.row.status} colorMap={COMMON_STATUS_COLOR} labelMap={COMMON_STATUS_LABEL} />,
    },
    {
      field: 'actions', headerName: '', width: 80, sortable: false,
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
        title="Dòng hàng"
        subtitle="Trang sức Ý, ECZ, CZ, Kim cương, Đá màu, Ngọc trai..."
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Dòng hàng' }]}
        rows={rows}
        columns={columns}
        loading={loading}
        createLabel="Tạo dòng hàng"
        createDrawer={(close) => (
          <ProductLineFormDrawer open onClose={close} onSubmit={handleCreate} />
        )}
        createOpen={createOpen}
        onCloseCreate={onCloseCreate}
        searchKeys={['name', 'slug']}
      />

      <ProductLineFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
      />
    </>
  );
}
