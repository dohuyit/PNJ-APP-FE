'use client';

import { Chip, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelative } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { mockConsents } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const consentsList = mockConsents;
const TYPE_META = {
  marketing_email: { label: 'Email MKT',  icon: 'solar:letter-linear' },
  marketing_sms:   { label: 'SMS MKT',    icon: 'solar:chat-round-dots-linear' },
  marketing_zalo:  { label: 'Zalo MKT',   icon: 'solar:chat-line-linear' },
  data_sharing:    { label: 'Chia sẻ DL', icon: 'solar:transfer-horizontal-linear' },
  cookies:         { label: 'Cookies',    icon: 'solar:cookies-linear' },
};

const SOURCE_META = {
  web:   { label: 'Website',  color: 'primary' },
  app:   { label: 'App',      color: 'info' },
  store: { label: 'Cửa hàng', color: 'warning' },
};

const columns = [
  { field: 'customer_name', headerName: 'Khách', flex: 1,
    renderCell: (p) => (
      <Stack>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.row.customer_name ?? '-'}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{p.row.customer_phone ?? '-'}</Typography>
      </Stack>
    ) },
  { field: 'consent_type', headerName: 'Loại', width: 160,
    renderCell: (p) => {
      const m = TYPE_META[p.row.consent_type];
      return <Chip icon={<Iconify icon={m.icon} width={12} />} label={m.label} size="small" variant="outlined" />;
    } },
  { field: 'action', headerName: 'Hành động', width: 130,
    renderCell: (p) => (
      <Label color={p.row.action === 'accept' ? 'success' : 'error'} variant="filled">
        {p.row.action === 'accept' ? 'Đồng ý' : 'Rút lại'}
      </Label>
    ) },
  { field: 'source', headerName: 'Nguồn', width: 120,
    renderCell: (p) => <Label color={SOURCE_META[p.row.source].color}>{SOURCE_META[p.row.source].label}</Label> },
  { field: 'ip', headerName: 'IP', width: 150, renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{p.row.ip ?? '-'}</Typography> },
  { field: 'created_at', headerName: 'Thời gian', width: 150, renderCell: (p) => fmtRelative(p.row.created_at) },
];

export function ConsentListView({ embedded = false } = {}) {
  return (
    <SimpleListView
      embedded={embedded}
      title="Nhật ký đồng ý (GDPR)"
      subtitle={`${consentsList.length} bản ghi · audit trail cho compliance`}
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Consent' }]}
      rows={consentsList}
      columns={columns}
      searchKeys={['customer_name', 'customer_phone']}
    />
  );
}
