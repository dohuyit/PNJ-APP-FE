'use client';

import { useState } from 'react';

import { IconButton, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelative } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';

import { UrlRedirectFormDrawer } from './url-redirect-create-form';
import { mockUrlRedirects } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const urlRedirectsList = mockUrlRedirects;
export function UrlRedirectListView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'from_path', headerName: 'Từ', flex: 1,
      renderCell: (p) => <Typography sx={{ fontFamily: 'monospace', color: 'error.main' }}>{p.row.from_path ?? '-'}</Typography>,
    },
    { field: 'arrow', headerName: '', width: 40, sortable: false, renderCell: () => <Iconify icon="solar:arrow-right-linear" width={16} /> },
    {
      field: 'to_path', headerName: 'Đến', flex: 1,
      renderCell: (p) => <Typography sx={{ fontFamily: 'monospace', color: 'success.main' }}>{p.row.to_path ?? '-'}</Typography>,
    },
    { field: 'code', headerName: 'Code', width: 80, renderCell: (p) => <Label color={p.row.code === 301 ? 'primary' : 'warning'} variant="filled">{p.row.code ?? '-'}</Label> },
    { field: 'hit_count', headerName: 'Hit', width: 100, align: 'right' },
    { field: 'is_active', headerName: 'Bật', width: 80, renderCell: (p) => (p.row.is_active ? <Label color="success" variant="filled">Bật</Label> : <Label variant="filled">Tắt</Label>) },
    { field: 'updated_at', headerName: 'Cập nhật', width: 140, renderCell: (p) => fmtRelative(p.row.updated_at) },
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
        title="URL Redirect"
        subtitle={`${urlRedirectsList.length} redirect · đổi slug không mất SEO`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Redirect' }]}
        rows={urlRedirectsList}
        columns={columns}
        createLabel="Tạo redirect"
        createDrawer={(close) => (
          <UrlRedirectFormDrawer open onClose={close} onSubmit={(v) => console.log('create redirect', v)} />
        )}
        searchKeys={['from_path', 'to_path']}
      />

      <UrlRedirectFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update redirect', v)}
      />
    </>
  );
}
