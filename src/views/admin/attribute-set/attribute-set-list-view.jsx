'use client';

import { useState } from 'react';

import { Button, IconButton } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import {
  useGetAttributeSetList,
  refreshAttributeSetList,
  actionCreateAttributeSet,
  actionUpdateAttributeSet,
} from 'src/actions/admin/attribute';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';

import { AttributeSetFormDrawer } from './attribute-set-create-form';

const handleCreate = async (v) => {
  try {
    await actionCreateAttributeSet(v);
    toast.success('Đã tạo nhóm thuộc tính');
    refreshAttributeSetList();
  } catch (e) {
    toast.error(e?.response?.data?.message || 'Lỗi khi tạo nhóm thuộc tính');
    throw e;
  }
};

export function AttributeSetCreateButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small" variant="contained"
        startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
        onClick={() => setOpen(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Thêm nhóm thuộc tính
      </Button>
      <AttributeSetFormDrawer open={open} onClose={() => setOpen(false)} onSubmit={handleCreate} />
    </>
  );
}

export function AttributeSetListView({ embedded = false } = {}) {
  const { searchResults: rows, searchLoading: loading } = useGetAttributeSetList();
  const [editing, setEditing] = useState(null);

  const columns = [
    { field: 'name', headerName: 'Nhóm thuộc tính', flex: 1, minWidth: 260 },
    {
      field: 'attribute_count', headerName: 'Số thuộc tính', width: 160,
      renderCell: (p) => <Label>{`${p.row.attributes?.length ?? p.row.attribute_count ?? 0} thuộc tính`}</Label>,
    },
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

  const handleUpdate = async (v) => {
    try {
      await actionUpdateAttributeSet(editing._id ?? editing.id, v);
      toast.success('Đã lưu nhóm thuộc tính');
      refreshAttributeSetList();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Lỗi khi lưu nhóm thuộc tính');
      throw e;
    }
  };

  return (
    <>
      <SimpleListView
        embedded={embedded}
        title="Nhóm thuộc tính"
        subtitle="Trang sức · Kim cương viên · Đồng hồ · E-gift"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Nhóm thuộc tính' }]}
        rows={rows}
        columns={columns}
        loading={loading}
        createLabel="Tạo nhóm thuộc tính"
        createDrawer={(close) => (
          <AttributeSetFormDrawer open onClose={close} onSubmit={handleCreate} />
        )}
        searchKeys={['name']}
      />

      <AttributeSetFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
      />
    </>
  );
}
