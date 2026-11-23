'use client';

import { IconButton, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelative } from 'src/utils/format';

import { useGetLeadList } from 'src/actions/admin/lead';
import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { LEAD_STATUS_COLOR, LEAD_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';


const TYPE_LABEL = { callback: 'Gọi lại', store_order: 'Đặt tại CH', corporate_gift: 'Quà DN', wholesale: 'Bán sỉ' };
const TYPE_COLOR = { callback: 'info', store_order: 'primary', corporate_gift: 'warning', wholesale: 'secondary' };

const columns = [
  { field: 'type', headerName: 'Loại', width: 130, renderCell: (p) => <Label color={TYPE_COLOR[p.row.type]}>{TYPE_LABEL[p.row.type]}</Label> },
  { field: 'full_name', headerName: 'Khách', flex: 1,
    renderCell: (p) => (
      <Stack>
        <Typography variant="subtitle2">{p.row.full_name ?? '-'}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{p.row.phone ?? '-'}</Typography>
      </Stack>
    ) },
  { field: 'message', headerName: 'Lời nhắn', flex: 1, renderCell: (p) => <Typography variant="body2" noWrap>{p.row.message ?? '-'}</Typography> },
  { field: 'assigned_admin', headerName: 'Phụ trách', width: 140,
    renderCell: (p) => p.row.assigned_admin ? <Label>{p.row.assigned_admin ?? '-'}</Label> : <Label color="warning">Chưa gán</Label> },
  { field: 'created_at', headerName: 'Thời gian', width: 150, renderCell: (p) => fmtRelative(p.row.created_at) },
  { field: 'status', headerName: 'Trạng thái', width: 130, renderCell: (p) => <StatusBadge status={p.row.status} colorMap={LEAD_STATUS_COLOR} labelMap={LEAD_STATUS_LABEL} /> },
  { field: 'actions', headerName: '', width: 60, sortable: false, renderCell: () => <IconButton size="small"><Iconify icon="solar:eye-linear" width={16} /></IconButton> },
];

export function LeadListView({ embedded = false } = {}) {
  const { searchResults: leadsList, searchLoading: leadsLoading } = useGetLeadList();
  return (
    <SimpleListView
      embedded={embedded}
      title="Lead / Yêu cầu tư vấn"
      subtitle={`${leadsList.length} lead · Gọi ngay, Đặt tại CH, Quà DN, Bán sỉ`}
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Lead' }]}
      rows={leadsList}
      columns={columns}
      loading={leadsLoading}
      searchKeys={['full_name', 'phone']}
      filters={[
        {
          key: 'status',
          minWidth: 160,
          options: [
            { value: 'all',       label: 'Mọi trạng thái', icon: 'solar:layers-minimalistic-linear' },
            { value: 'new',       label: 'Mới',            dot: 'info.main' },
            { value: 'contacted', label: 'Đã liên hệ',     dot: 'primary.main' },
            { value: 'converted', label: 'Đã chốt',        dot: 'success.main' },
            { value: 'closed',    label: 'Đã đóng',        dot: 'text.disabled' },
          ],
          predicate: (r, v) => r.status === v,
        },
        {
          key: 'type',
          minWidth: 160,
          options: [
            { value: 'all',            label: 'Mọi loại',      icon: 'solar:tag-linear' },
            { value: 'callback',       label: 'Gọi lại',       icon: 'solar:phone-calling-linear' },
            { value: 'store_order',    label: 'Đặt tại CH',    icon: 'solar:shop-linear' },
            { value: 'corporate_gift', label: 'Quà DN',        icon: 'solar:gift-linear' },
            { value: 'wholesale',      label: 'Bán sỉ',        icon: 'solar:box-linear' },
          ],
          predicate: (r, v) => r.type === v,
        },
        {
          key: 'assigned',
          minWidth: 160,
          options: [
            { value: 'all',         label: 'Tất cả',     icon: 'solar:layers-minimalistic-linear' },
            { value: 'assigned',    label: 'Đã phân',    dot: 'success.main' },
            { value: 'unassigned',  label: 'Chưa phân',  dot: 'warning.main' },
          ],
          predicate: (r, v) => v === 'assigned' ? !!r.assigned_admin : !r.assigned_admin,
        },
      ]}
    />
  );
}
