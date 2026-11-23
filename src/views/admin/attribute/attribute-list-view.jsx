'use client';

import { useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { useGetAttributeList } from 'src/actions/admin/attribute';
import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';

import { AttributeFormDrawer } from './attribute-create-drawer';


const INPUT_LABEL = { select: 'Chọn 1', multiselect: 'Chọn nhiều', number: 'Số', decimal: 'Thập phân', text: 'Text', boolean: 'Có/Không' };

export function AttributeListView() {
  const { searchResults: attributesList, searchLoading: attributesLoading } = useGetAttributeList();
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'code', headerName: 'Code', width: 160,
      renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', px: 1, borderRadius: 0.5 }}>{p.row.code ?? '-'}</Typography>,
    },
    { field: 'name', headerName: 'Tên', flex: 1, minWidth: 200 },
    { field: 'input_type', headerName: 'Kiểu', width: 120, renderCell: (p) => <Label>{INPUT_LABEL[p.row.input_type]}</Label> },
    { field: 'option_count', headerName: 'Số tuỳ chọn', width: 110 },
    {
      field: 'badges', headerName: 'Vai trò', width: 220, sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5}>
          {p.row.is_filterable && <Label color="primary" variant="filled">Lọc</Label>}
          {p.row.is_visible_on_detail && <Label color="info" variant="filled">Chi tiết</Label>}
          {p.row.is_variant_axis && <Label color="warning" variant="filled">Trục biến thể</Label>}
        </Stack>
      ),
    },
    {
      field: 'actions', headerName: '', width: 100, sortable: false,
      renderCell: (p) => (
        <Stack direction="row">
          <IconButton size="small" onClick={() => setEditing(p.row)}>
            <Iconify icon="solar:pen-linear" width={16} />
          </IconButton>
          <IconButton size="small" disabled={p.row.in_use ?? '-'} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-linear" width={16} />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <SimpleListView
        title="Thuộc tính"
        subtitle="20+ thuộc tính · là nguồn cho bộ lọc, bảng thông số, trục biến thể"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Thuộc tính' }]}
        rows={attributesList}
        columns={columns}
        loading={attributesLoading}
        createLabel="Tạo thuộc tính"
        createDrawer={(close) => (
          <AttributeFormDrawer open onClose={close} onSubmit={(v) => console.log('create attribute', v)} />
        )}
        searchKeys={['code', 'name']}
      />

      <AttributeFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update attribute', v)}
      />
    </>
  );
}
