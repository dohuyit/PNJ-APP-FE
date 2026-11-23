'use client';

import { useState } from 'react';

import { IconButton, Typography, Stack } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtDate } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';

import { DocumentFormDrawer } from './document-create-form';
import { mockDocuments } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const documentsList = mockDocuments;
const GROUP_LABEL = { agm: 'ĐHĐCĐ', financial_report: 'Báo cáo TC', disclosure: 'Công bố', license: 'Giấy phép' };

export function DocumentListView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'title', headerName: 'Tiêu đề', flex: 1,
      renderCell: (p) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="solar:file-text-linear" width={18} sx={{ color: 'text.secondary' }} />
          <Typography variant="body2">{p.row.title ?? '-'}</Typography>
        </Stack>
      ),
    },
    { field: 'group', headerName: 'Nhóm', width: 150, renderCell: (p) => <Label>{GROUP_LABEL[p.row.group]}</Label> },
    { field: 'year', headerName: 'Năm', width: 100 },
    { field: 'file_size', headerName: 'Dung lượng', width: 130, renderCell: (p) => `${(p.row.file_size / 1024 / 1024).toFixed(1)} MB` },
    { field: 'published_at', headerName: 'Ngày đăng', width: 150, renderCell: (p) => fmtDate(p.row.published_at) },
    { field: 'status', headerName: 'Trạng thái', width: 130, renderCell: (p) => <StatusBadge status={p.row.status} colorMap={COMMON_STATUS_COLOR} labelMap={COMMON_STATUS_LABEL} /> },
    {
      field: 'actions', headerName: '', width: 100, sortable: false,
      renderCell: (p) => (
        <Stack direction="row">
          <IconButton size="small" onClick={() => p.row.file_url && window.open(p.row.file_url, '_blank', 'noopener,noreferrer')}>
            <Iconify icon="solar:download-linear" width={16} />
          </IconButton>
          <IconButton size="small" onClick={() => setEditing(p.row)}>
            <Iconify icon="solar:pen-linear" width={16} />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <SimpleListView
        embedded={embedded}
        title="Tài liệu IR / Giấy tờ"
        subtitle="Báo cáo tài chính · ĐHĐCĐ · Công bố thông tin · Giấy phép"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Tài liệu' }]}
        rows={documentsList}
        columns={columns}
        createLabel="Upload tài liệu"
        createDrawer={(close) => (
          <DocumentFormDrawer open onClose={close} onSubmit={(v) => console.log('upload document', v)} />
        )}
        searchKeys={['title']}
      />

      <DocumentFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update document', v)}
      />
    </>
  );
}
