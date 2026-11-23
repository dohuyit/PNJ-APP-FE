'use client';

import { IconButton, Typography, Stack } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtDate } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { PROMOTION_STATUS_COLOR, PROMOTION_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';
import { mockLandingPages } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const landingPagesList = mockLandingPages;
const columns = [
  { field: 'title', headerName: 'Landing page', flex: 1,
    renderCell: (p) => (
      <Stack>
        <Typography variant="subtitle2">{p.row.title ?? '-'}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>/{p.row.slug ?? '-'}</Typography>
      </Stack>
    ) },
  { field: 'block_count', headerName: 'Số section', width: 120, renderCell: (p) => <Label>{`${p.row.block_count} section`}</Label> },
  { field: 'product_count', headerName: 'Số SP', width: 100 },
  { field: 'schedule', headerName: 'Lịch', width: 180, renderCell: (p) => <Typography variant="caption">{fmtDate(p.row.start_at)} → {fmtDate(p.row.end_at)}</Typography> },
  { field: 'status', headerName: 'Trạng thái', width: 130, renderCell: (p) => <StatusBadge status={p.row.status} colorMap={PROMOTION_STATUS_COLOR} labelMap={PROMOTION_STATUS_LABEL} /> },
  { field: 'actions', headerName: '', width: 60, sortable: false, renderCell: () => <IconButton size="small"><Iconify icon="solar:pen-linear" width={16} /></IconButton> },
];

export function LandingPageListView({ embedded = false } = {}) {
  return (
    <SimpleListView
      embedded={embedded}
      title="Landing page"
      subtitle="/disneypnj, /sanrio, /trang-suc-thang-11..."
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Landing page' }]}
      rows={landingPagesList}
      columns={columns}
      createHref={adminPaths.landingPage.new}
      createLabel="Tạo landing page"
    />
  );
}
