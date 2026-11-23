'use client';

import { useState } from 'react';

import { Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';

import { NotificationTemplateFormDrawer } from './notification-template-create-form';
import { mockNotificationTemplates } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const notificationTemplatesList = mockNotificationTemplates;
const CHANNEL = {
  sms: { label: 'SMS', color: 'primary', icon: 'solar:chat-round-dots-linear' },
  zalo_zns: { label: 'Zalo ZNS', color: 'info', icon: 'solar:chat-line-linear' },
  email: { label: 'Email', color: 'warning', icon: 'solar:letter-linear' },
  push: { label: 'Push', color: 'secondary', icon: 'solar:bell-linear' },
};

const STATUS = { active: { label: 'Bật', color: 'success' }, inactive: { label: 'Tắt', color: 'default' } };

export function NotificationTemplateListView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'code', headerName: 'Code', width: 200,
      renderCell: (p) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', px: 1, borderRadius: 0.5 }}>
          {p.row.code ?? '-'}
        </Typography>
      ),
    },
    { field: 'name', headerName: 'Tên', flex: 1, minWidth: 220 },
    {
      field: 'channel', headerName: 'Kênh', width: 140,
      renderCell: (p) => {
        const c = CHANNEL[p.row.channel] ?? { label: p.row.channel, color: 'default', icon: 'solar:bell-linear' };
        return <Chip icon={<Iconify icon={c.icon} width={12} />} label={c.label} size="small" color={c.color} variant="outlined" />;
      },
    },
    {
      field: 'status', headerName: 'Trạng thái', width: 110,
      renderCell: (p) => <Label color={STATUS[p.row.status].color} variant="filled">{STATUS[p.row.status].label}</Label>,
    },
    {
      field: 'actions', headerName: '', width: 100, sortable: false,
      renderCell: (p) => (
        <Stack direction="row">
          <Tooltip title="Gửi thử"><IconButton size="small"><Iconify icon="solar:test-tube-linear" width={16} /></IconButton></Tooltip>
          <Tooltip title="Sửa">
            <IconButton size="small" onClick={() => setEditing(p.row)}>
              <Iconify icon="solar:pen-linear" width={16} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <SimpleListView
        embedded={embedded}
        title="Mẫu thông báo"
        subtitle={`${notificationTemplatesList.length} mẫu · dùng cho OTP, đơn hàng, thiệp điện tử, e-gift`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Mẫu thông báo' }]}
        rows={notificationTemplatesList}
        columns={columns}
        createLabel="Tạo mẫu"
        createDrawer={(close) => (
          <NotificationTemplateFormDrawer open onClose={close} onSubmit={(v) => console.log('create template', v)} />
        )}
        searchKeys={['code', 'name']}
      />

      <NotificationTemplateFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update template', v)}
      />
    </>
  );
}
