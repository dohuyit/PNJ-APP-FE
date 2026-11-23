'use client';

import { Chip, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtDateTime } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { mockNotificationLogs } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const notificationLogsList = mockNotificationLogs;
const CHANNEL = {
  sms: { label: 'SMS', color: 'primary', icon: 'solar:chat-round-dots-linear' },
  zalo_zns: { label: 'Zalo ZNS', color: 'info', icon: 'solar:chat-line-linear' },
  email: { label: 'Email', color: 'warning', icon: 'solar:letter-linear' },
  push: { label: 'Push', color: 'secondary', icon: 'solar:bell-linear' },
};

const STATUS = {
  queued: { label: 'Đang chờ', color: 'default' },
  sent: { label: 'Đã gửi', color: 'info' },
  delivered: { label: 'Đã nhận', color: 'success' },
  failed: { label: 'Thất bại', color: 'error' },
};

const columns = [
  {
    field: 'template_code', headerName: 'Mẫu', width: 200,
    renderCell: (p) => (
      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{p.row.template_code ?? '-'}</Typography>
    ),
  },
  {
    field: 'channel', headerName: 'Kênh', width: 130,
    renderCell: (p) => {
      const c = CHANNEL[p.row.channel] ?? { label: p.row.channel, color: 'default', icon: 'solar:bell-linear' };
      return <Chip icon={<Iconify icon={c.icon} width={12} />} label={c.label} size="small" color={c.color} variant="outlined" />;
    },
  },
  {
    field: 'recipient', headerName: 'Người nhận', width: 160,
    renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{p.row.recipient ?? '-'}</Typography>,
  },
  {
    field: 'status', headerName: 'Trạng thái', width: 130,
    renderCell: (p) => <Label color={STATUS[p.row.status].color} variant="filled">{STATUS[p.row.status].label}</Label>,
  },
  {
    field: 'sent_at', headerName: 'Gửi lúc', width: 180,
    renderCell: (p) => fmtDateTime(p.row.sent_at),
  },
];

export function NotificationLogListView({ embedded = false } = {}) {
  return (
    <SimpleListView
      embedded={embedded}
      title="Nhật ký gửi thông báo"
      subtitle={`${notificationLogsList.length} bản ghi · TTL 180 ngày`}
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Nhật ký gửi' }]}
      rows={notificationLogsList}
      columns={columns}
      searchKeys={['template_code', 'recipient']}
      deletable={false}
    />
  );
}
