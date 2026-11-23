'use client';

import { useState } from 'react';

import { IconButton, Stack, Typography, Avatar } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtDate, fmtNumber } from 'src/utils/format';

import { useGetBannerList } from 'src/actions/admin/banner';
import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';

import { BannerFormDrawer } from './banner-create-drawer';


export function BannerListView({ embedded = false } = {}) {
  const { searchResults: bannersList, searchLoading: bannersLoading } = useGetBannerList();
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'image', headerName: '', width: 100, sortable: false,
      renderCell: (p) => <Avatar src={p.row.image_desktop ?? '-'} variant="rounded" sx={{ width: 80, height: 40, bgcolor: 'grey.100' }} />,
    },
    {
      field: 'title', headerName: 'Banner', flex: 1,
      renderCell: (p) => (
        <Stack>
          <Typography variant="subtitle2" noWrap>{p.row.title ?? '-'}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{p.row.link_url ?? '-'}</Typography>
        </Stack>
      ),
    },
    { field: 'position', headerName: 'Vị trí', width: 170, renderCell: (p) => <Label>{p.row.position}</Label> },
    {
      field: 'schedule', headerName: 'Lịch', width: 180,
      renderCell: (p) => <Typography variant="caption">{fmtDate(p.row.start_at)} → {fmtDate(p.row.end_at)}</Typography>,
    },
    { field: 'click_count', headerName: 'Click', width: 100, align: 'right', renderCell: (p) => fmtNumber(p.row.click_count ?? 0) },
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
        title="Banner"
        subtitle={`${bannersList.length} banner · nhiều vị trí · desktop + mobile riêng`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Banner' }]}
        rows={bannersList}
        columns={columns}
        loading={bannersLoading}
        createLabel="Tạo banner"
        createDrawer={(close) => (
          <BannerFormDrawer open onClose={close} onSubmit={(v) => console.log('create banner', v)} />
        )}
        searchKeys={['title', 'position']}
      />

      <BannerFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update banner', v)}
      />
    </>
  );
}
