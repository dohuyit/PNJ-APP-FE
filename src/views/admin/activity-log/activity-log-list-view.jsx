'use client';

import { Chip, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtDateTime } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { mockActivityLogs } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const activityLogsList = mockActivityLogs;
const ACTION = {
  create: { label: 'Tạo', color: 'success', icon: 'solar:add-circle-linear' },
  update: { label: 'Sửa', color: 'info', icon: 'solar:pen-linear' },
  delete: { label: 'Xoá', color: 'error', icon: 'solar:trash-bin-trash-linear' },
  login: { label: 'Đăng nhập', color: 'default', icon: 'solar:login-3-linear' },
  export: { label: 'Xuất file', color: 'warning', icon: 'solar:download-linear' },
};

const SUBJECT_LABEL = {
  products: 'Sản phẩm',
  orders: 'Đơn hàng',
  customers: 'Khách hàng',
  promotions: 'Khuyến mãi',
};

const columns = [
  {
    field: 'admin_name', headerName: 'Người thực hiện', width: 180,
    renderCell: (p) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Iconify icon="solar:user-circle-linear" width={16} />
        <Typography variant="body2">{p.row.admin_name ?? '-'}</Typography>
      </Stack>
    ),
  },
  {
    field: 'action', headerName: 'Hành động', width: 140,
    renderCell: (p) => {
      const a = ACTION[p.row.action] ?? { label: p.row.action, color: 'default', icon: 'solar:question-circle-linear' };
      return <Chip icon={<Iconify icon={a.icon} width={12} />} label={a.label} size="small" color={a.color} variant="outlined" />;
    },
  },
  {
    field: 'subject_type', headerName: 'Đối tượng', width: 120,
    renderCell: (p) => SUBJECT_LABEL[p.row.subject_type] ?? p.row.subject_type,
  },
  {
    field: 'subject_id', headerName: 'ID', width: 120,
    renderCell: (p) => (
      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{p.row.subject_id}</Typography>
    ),
  },
  { field: 'summary', headerName: 'Tóm tắt', flex: 1, minWidth: 220 },
  {
    field: 'ip', headerName: 'IP', width: 130,
    renderCell: (p) => <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{p.row.ip ?? '-'}</Typography>,
  },
  {
    field: 'created_at', headerName: 'Thời điểm', width: 180,
    renderCell: (p) => fmtDateTime(p.row.created_at),
  },
];

export function ActivityLogListView({ embedded = false } = {}) {
  return (
    <SimpleListView
      embedded={embedded}
      title="Nhật ký thao tác"
      subtitle={`${activityLogsList.length} bản ghi · ghi đổi giá, trạng thái đơn, hoàn tiền, cập nhật giá vàng`}
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Nhật ký thao tác' }]}
      rows={activityLogsList}
      columns={columns}
      searchKeys={['admin_name', 'summary', 'subject_id']}
      deletable={false}
    />
  );
}
