'use client';

import { useState } from 'react';

import { IconButton, Typography, Stack } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelative } from 'src/utils/format';

import { useGetPageList } from 'src/actions/admin/page';
import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';

import { PageFormDrawer } from './page-create-drawer';


const TYPE_COLOR = { about: 'primary', guide: 'info', policy: 'warning', service: 'success' };

export function PageListView({ embedded = false } = {}) {
  const { searchResults: pagesList, searchLoading: pagesLoading } = useGetPageList();
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'title', headerName: 'Tiêu đề', flex: 1,
      renderCell: (p) => (
        <Stack>
          <Typography variant="subtitle2">{p.row.title ?? '-'}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>/{p.row.slug ?? '-'}</Typography>
        </Stack>
      ),
    },
    { field: 'type', headerName: 'Loại', width: 130, renderCell: (p) => <Label color={TYPE_COLOR[p.row.type]}>{p.row.type ?? '-'}</Label> },
    { field: 'updated_at', headerName: 'Cập nhật', width: 150, renderCell: (p) => fmtRelative(p.row.updated_at) },
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
        title="Trang tĩnh"
        subtitle="Câu chuyện PNJ · Hướng dẫn · Chính sách · Dịch vụ"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Trang tĩnh' }]}
        rows={pagesList}
        columns={columns}
        loading={pagesLoading}
        createLabel="Tạo trang"
        createDrawer={(close) => (
          <PageFormDrawer open onClose={close} onSubmit={(v) => console.log('create page', v)} />
        )}
      />

      <PageFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update page', v)}
      />
    </>
  );
}
