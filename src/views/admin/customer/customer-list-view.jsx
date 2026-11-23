'use client';

import { useState } from 'react';

import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fmtVND, fmtNumber, fmtRelative, fmtDate } from 'src/utils/format';

import { useGetCustomerList } from 'src/actions/admin/customer';
import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { StatusBadge } from 'src/components/common/status-badge';

import { CustomerFormDrawer } from './customer-create-drawer';


const TIER_COLOR = { silver: 'default', gold: 'warning', platinum: 'info', diamond: 'secondary' };
const TIER_LABEL = { silver: 'Silver', gold: 'Gold', platinum: 'Platinum', diamond: 'Diamond' };

const SOURCE_META = {
  web:   { label: 'Website',   icon: 'solar:global-linear',    color: '#2563EB' },
  app:   { label: 'App',       icon: 'solar:iphone-linear',    color: '#7C3AED' },
  store: { label: 'Cửa hàng',  icon: 'solar:shop-linear',      color: '#EC4899' },
};

// Gradient sắc thái đậm hơn — deterministic theo tên để cùng 1 khách luôn ra cùng màu
const AVATAR_GRADIENTS = [
  ['#818CF8', '#4F46E5'], // indigo
  ['#F87171', '#DC2626'], // rose
  ['#34D399', '#059669'], // emerald
  ['#FBBF24', '#D97706'], // amber
  ['#A78BFA', '#7C3AED'], // violet
  ['#38BDF8', '#0284C7'], // sky
];
const hashName = (s = '') => Array.from(s).reduce((a, c) => a + c.charCodeAt(0), 0);
const gradientOf = (name) => AVATAR_GRADIENTS[hashName(name) % AVATAR_GRADIENTS.length];
const initialsOf = (name = '') =>
  name.trim().split(/\s+/).slice(-2).map((w) => w[0] ?? '').join('').toUpperCase() || '??';

export function CustomerListView({ embedded = false } = {}) {
  const { searchResults: customersList, searchLoading: customersLoading } = useGetCustomerList();
  const [editing, setEditing] = useState(null);

  const columns = [
    {
      field: 'full_name', headerName: 'Khách hàng', width: 240,
      renderCell: (p) => {
        const [g0, g1] = gradientOf(p.row.full_name);
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              sx={{
                width: 36, height: 36,
                background: `linear-gradient(135deg, ${g0}, ${g1})`,
                color: 'common.white',
                fontWeight: 800, fontSize: 12.5, letterSpacing: 0.3,
                textShadow: '0 1px 1px rgba(0,0,0,0.15)',
                flexShrink: 0,
              }}
            >
              {initialsOf(p.row.full_name)}
            </Avatar>
            <Stack sx={{ minWidth: 0 }}>
              <Typography
                component={RouterLink}
                href={adminPaths.customer.detail(p.row.id)}
                variant="subtitle2"
                sx={{ textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}
                noWrap
              >
                {p.row.full_name ?? '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontFamily: 'monospace' }}>
                {p.row.phone ?? '-'}
              </Typography>
              {p.row.email && (
                <Typography variant="caption" color="text.disabled" noWrap sx={{ fontSize: 10.5 }}>
                  {p.row.email ?? '-'}
                </Typography>
              )}
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: 'tier', headerName: 'Hạng', width: 150,
      renderCell: (p) => {
        const code = p.row.membership?.tier_code;
        return (
          <Stack spacing={0.25}>
            <Chip
              icon={<Iconify icon="solar:crown-linear" width={12} />}
              label={TIER_LABEL[code] ?? code?.toUpperCase()}
              size="small"
              color={TIER_COLOR[code] ?? 'default'}
              variant="outlined"
              sx={{ width: 'fit-content', fontWeight: 600 }}
            />
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, fontFamily: 'monospace' }}>
              Lifetime {fmtVND(p.row.membership?.lifetime_spent ?? 0)}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'order_count', headerName: 'Đơn hàng', width: 140, align: 'right', headerAlign: 'right',
      renderCell: (p) => (
        <Stack alignItems="flex-end" spacing={0.25}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13 }}>
            {fmtNumber(p.row.stats?.order_count ?? 0)}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
            Gần nhất: {fmtRelative(p.row.stats?.last_order_at)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'total_spent', headerName: 'Chi tiêu', width: 170, align: 'right', headerAlign: 'right',
      renderCell: (p) => {
        const spent = p.row.stats?.total_spent ?? 0;
        const avg = (p.row.stats?.order_count ?? 0) > 0 ? spent / p.row.stats.order_count : 0;
        return (
          <Stack alignItems="flex-end" spacing={0.25}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'warning.dark', fontFamily: 'monospace' }}>
              {fmtVND(spent)}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
              TB/đơn {fmtVND(avg)}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'points', headerName: 'Điểm', width: 130, align: 'right', headerAlign: 'right',
      renderCell: (p) => (
        <Stack alignItems="flex-end" spacing={0.25}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="solar:star-bold" width={13} sx={{ color: 'warning.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
              {fmtNumber(p.row.membership?.points ?? 0)}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
            Tích luỹ
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'source', headerName: 'Nguồn', width: 130,
      renderCell: (p) => {
        const m = SOURCE_META[p.row.source] ?? { label: p.row.source, icon: 'solar:tag-linear', color: '#637381' };
        return (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: m.color }}>
            <Iconify icon={m.icon} width={13} />
            <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 600, fontSize: 11.5 }}>
              {m.label}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'created_at', headerName: 'Đăng ký', width: 130,
      renderCell: (p) => (
        <Stack>
          <Typography variant="caption" sx={{ fontSize: 11.5 }}>
            {fmtDate(p.row.created_at)}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
            {fmtRelative(p.row.created_at)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'status', headerName: 'Trạng thái', width: 130,
      renderCell: (p) => (
        <Stack spacing={0.25}>
          <StatusBadge status={p.row.status} colorMap={COMMON_STATUS_COLOR} labelMap={COMMON_STATUS_LABEL} />
          {p.row.marketing_opt_in && (
            <Box component="span" sx={{
              display: 'inline-flex', alignItems: 'center', gap: '3px',
              px: 0.75, py: 0.125, borderRadius: 0.5,
              fontSize: 9.5, fontWeight: 700,
              color: 'success.darker', bgcolor: 'success.lighter',
              width: 'fit-content',
            }}>
              <Iconify icon="solar:bell-linear" width={10} /> Nhận TB
            </Box>
          )}
        </Stack>
      ),
    },
    {
      field: 'actions', headerName: '', width: 56, align: 'center', sortable: false,
      renderCell: (p) => (
        <RowActionsMenu
          items={[
            { label: 'Xem chi tiết', icon: 'solar:eye-linear',  href: adminPaths.customer.detail(p.row.id) },
            { label: 'Sửa khách',    icon: 'solar:pen-linear',  onClick: () => setEditing(p.row) },
            { label: 'Copy SĐT',     icon: 'solar:copy-linear', onClick: () => navigator.clipboard?.writeText(p.row.phone) },
            { divider: true },
            { label: 'Gửi email',    icon: 'solar:letter-linear', onClick: () => alert('Mail ' + p.row.email), disabled: !p.row.email },
            { label: 'Thêm vào CS',  icon: 'solar:tag-linear',  onClick: () => alert('Tag ' + p.row.full_name) },
            { divider: true },
            { label: p.row.status === 'blocked' ? 'Mở khoá' : 'Khoá KH',
              icon: p.row.status === 'blocked' ? 'solar:unlock-keyhole-minimalistic-linear' : 'solar:lock-keyhole-minimalistic-linear',
              color: p.row.status === 'blocked' ? undefined : 'error',
              onClick: () => alert((p.row.status === 'blocked' ? 'Mở' : 'Khoá') + ' ' + p.row.full_name) },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <SimpleListView
        embedded={embedded}
        title="Khách hàng"
        subtitle={`${customersList.length} khách hàng · hồ sơ, hạng thẻ, điểm, đơn hàng`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Khách hàng' }]}
        rows={customersList}
        columns={columns}
        loading={customersLoading}
        createLabel="Tạo khách"
        createDrawer={(close) => (
          <CustomerFormDrawer open onClose={close} onSubmit={(v) => console.log('create customer', v)} />
        )}
        searchKeys={['full_name', 'phone', 'email']}
        filters={[
          {
            key: 'status',
            minWidth: 160,
            options: [
              { value: 'all',     label: 'Mọi trạng thái', icon: 'solar:layers-minimalistic-linear' },
              { value: 'active',  label: 'Hoạt động',      dot: 'success.main' },
              { value: 'blocked', label: 'Đã khoá',        dot: 'error.main' },
            ],
            predicate: (r, v) => r.status === v,
          },
          {
            key: 'tier',
            minWidth: 160,
            options: [
              { value: 'all',      label: 'Mọi hạng',  icon: 'solar:medal-ribbons-star-linear' },
              { value: 'silver',   label: 'Silver',    icon: 'solar:medal-star-linear' },
              { value: 'gold',     label: 'Gold',      icon: 'solar:medal-star-bold' },
              { value: 'platinum', label: 'Platinum',  icon: 'solar:crown-linear' },
              { value: 'diamond',  label: 'Diamond',   icon: 'solar:diamond-linear' },
            ],
            predicate: (r, v) => r.membership?.tier_code === v,
          },
        ]}
      />

      <CustomerFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update customer', v)}
      />
    </>
  );
}
