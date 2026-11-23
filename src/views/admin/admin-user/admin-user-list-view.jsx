'use client';

import { useState } from 'react';

import { Avatar, Chip, IconButton, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelative } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';

import { AdminUserFormDrawer } from './admin-user-create-form';
import { mockAdmins } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const adminsList = mockAdmins;
export function AdminUserListView() {
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'avatar', headerName: '', width: 60, sortable: false,
      renderCell: (p) => <Avatar sx={{ width: 36, height: 36 }}>{p.row.name?.[0]}</Avatar>,
    },
    {
      field: 'name', headerName: 'Tên', flex: 1,
      renderCell: (p) => (
        <Stack>
          <Typography variant="subtitle2">{p.row.name ?? '-'}</Typography>
          <Typography variant="caption" color="text.secondary">{p.row.email ?? '-'}</Typography>
        </Stack>
      ),
    },
    { field: 'phone', headerName: 'SĐT', width: 130, renderCell: (p) => <Typography sx={{ fontFamily: 'monospace' }}>{p.row.phone ?? '-'}</Typography> },
    { field: 'role', headerName: 'Vai trò', width: 180, renderCell: (p) => <Label color="primary">{p.row.role ?? '-'}</Label> },
    {
      field: 'two_factor', headerName: '2FA', width: 90,
      renderCell: (p) => p.row.two_factor_enabled
        ? <Chip icon={<Iconify icon="solar:shield-check-linear" width={12} />} label="Bật" size="small" color="success" />
        : <Label>Tắt</Label>,
    },
    { field: 'last_login', headerName: 'Đăng nhập cuối', width: 160, renderCell: (p) => <Typography variant="caption">{fmtRelative(p.row.last_login_at)}</Typography> },
    {
      field: 'status', headerName: 'Trạng thái', width: 130,
      renderCell: (p) => <StatusBadge status={p.row.status} colorMap={COMMON_STATUS_COLOR} labelMap={COMMON_STATUS_LABEL} />,
    },
    {
      field: 'actions', headerName: '', width: 100, sortable: false,
      renderCell: (p) => (
        <Stack direction="row">
          <IconButton size="small" title="Reset 2FA"><Iconify icon="solar:shield-warning-linear" width={16} /></IconButton>
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
        title="Tài khoản admin"
        subtitle={`${adminsList.length} tài khoản · phân theo vai trò + phạm vi cửa hàng/vùng`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Admin' }]}
        rows={adminsList}
        columns={columns}
        createLabel="Mời admin"
        createDrawer={(close) => (
          <AdminUserFormDrawer open onClose={close} onSubmit={(v) => console.log('invite admin', v)} />
        )}
        searchKeys={['name', 'email']}
      />

      <AdminUserFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update admin', v)}
      />
    </>
  );
}
