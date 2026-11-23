// src/views/admin/return-request/return-request-list-view.jsx
// Thu đổi & Hoàn tiền — layout pattern order/customer: KPI row + FilterBar + DataTable.

'use client';

import { useMemo, useState } from 'react';

import PaidOutlined from '@mui/icons-material/PaidOutlined';
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import HourglassBottomOutlined from '@mui/icons-material/HourglassBottomOutlined';
import AssignmentReturnOutlined from '@mui/icons-material/AssignmentReturnOutlined';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtNumber, fmtRelative, fmtDate } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { KpiCard } from 'src/views/admin/_shared/kpi-card';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';
import { useGetReturnRequestList } from 'src/actions/admin/return-request';
import { RETURN_STATUS_COLOR, RETURN_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';
import { StatusBadge } from 'src/components/common/status-badge';


// ---------------- Meta: loại yêu cầu — icon + accent color pastel
const TYPE_META = {
  exchange: { label: 'Thu đổi',   icon: 'solar:refresh-circle-linear',  color: '#2563EB' },
  refund:   { label: 'Hoàn tiền', icon: 'solar:dollar-linear',          color: '#D97706' },
  warranty: { label: 'Bảo hành',  icon: 'solar:shield-check-linear',    color: '#7C3AED' },
};

const TYPE_OPTS = [
  { value: 'all',       label: 'Mọi loại',  icon: 'solar:layers-minimalistic-linear' },
  { value: 'exchange',  label: 'Thu đổi',   icon: 'solar:refresh-circle-linear' },
  { value: 'refund',    label: 'Hoàn tiền', icon: 'solar:dollar-linear' },
  { value: 'warranty',  label: 'Bảo hành',  icon: 'solar:shield-check-linear' },
];

const STATUS_OPTS = [
  { value: 'all',        label: 'Mọi trạng thái', icon: 'solar:layers-minimalistic-linear' },
  { value: 'requested',  label: 'Chờ xử lý',      dot: 'warning.main' },
  { value: 'approved',   label: 'Đã duyệt',       dot: 'info.main' },
  { value: 'received',   label: 'Đã nhận SP',     dot: 'primary.main' },
  { value: 'refunded',   label: 'Đã hoàn tiền',   dot: 'success.main' },
  { value: 'rejected',   label: 'Đã từ chối',     dot: 'error.main' },
  { value: 'closed',     label: 'Đã đóng',        dot: 'text.disabled' },
];

const TIME_OPTS = [
  { value: 'all',   label: 'Mọi thời gian', icon: 'solar:infinity-linear' },
  { value: 'today', label: 'Hôm nay',       icon: 'solar:sun-linear' },
  { value: '7d',    label: '7 ngày qua',    icon: 'solar:calendar-linear' },
  { value: '30d',   label: '30 ngày qua',   icon: 'solar:calendar-mark-linear' },
];

// Avatar gradient palette — đồng bộ với customer list
const AVATAR_GRADIENTS = [
  ['#818CF8', '#4F46E5'],
  ['#F87171', '#DC2626'],
  ['#34D399', '#059669'],
  ['#FBBF24', '#D97706'],
  ['#A78BFA', '#7C3AED'],
  ['#38BDF8', '#0284C7'],
];
const hashStr = (s = '') => Array.from(s).reduce((a, c) => a + c.charCodeAt(0), 0);
const gradientOf = (name) => AVATAR_GRADIENTS[hashStr(name) % AVATAR_GRADIENTS.length];
const initialsOf = (name = '') =>
  name.trim().split(/\s+/).slice(-2).map((w) => w[0] ?? '').join('').toUpperCase() || '??';

// ---------------- Progress step của yêu cầu — map theo status
const STATUS_STEP = { requested: 1, approved: 2, received: 3, refunded: 4, rejected: 0, closed: 0 };
const TOTAL_STEPS = 4;

export function ReturnRequestListView({ embedded = false } = {}) {
  const { searchResults: returnRequestsList, searchLoading: returnRequestsLoading } = useGetReturnRequestList();
  const [search, setSearch]       = useState('');
  const [typeFilter, setType]     = useState('all');
  const [statusFilter, setStatus] = useState('all');
  const [timeRange, setTime]      = useState('all');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });

  const kpi = useMemo(() => {
    const list = returnRequestsList;
    const total     = list.length;
    const pending   = list.filter((r) => ['requested', 'approved', 'received'].includes(r.status)).length;
    const refunded  = list.filter((r) => r.status === 'refunded').length;
    const totalAmt  = list.reduce((s, r) => s + (r.refund_amount ?? 0), 0);
    return { total, pending, refunded, totalAmt };
  }, [returnRequestsList]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return returnRequestsList.filter((r) => {
      if (q && !r.order_no.toLowerCase().includes(q) && !r.customer_name.toLowerCase().includes(q)) return false;
      if (typeFilter   !== 'all' && r.type   !== typeFilter)   return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (timeRange !== 'all') {
        const DAY = 86_400_000;
        const span = { today: DAY, '7d': 7*DAY, '30d': 30*DAY }[timeRange];
        if (Date.now() - new Date(r.created_at).getTime() > span) return false;
      }
      return true;
    });
  }, [returnRequestsList, search, typeFilter, statusFilter, timeRange]);

  const hasFilter = !!search || typeFilter !== 'all' || statusFilter !== 'all' || timeRange !== 'all';

  const columns = [
    {
      field: 'order_no', headerName: 'Mã yêu cầu', width: 170,
      renderCell: (p) => (
        <Stack>
          <Typography
            sx={{
              fontFamily: 'monospace', fontWeight: 700, fontSize: 12.5, color: 'text.primary',
              '&:hover': { color: 'primary.main' },
              cursor: 'pointer',
            }}
          >
            {p.row.order_no ?? '-'}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, fontFamily: 'monospace' }}>
            #{p.row.id}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'customer_name', headerName: 'Khách hàng', width: 260,
      renderCell: (p) => {
        const [g0, g1] = gradientOf(p.row.customer_name);
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              sx={{
                width: 36, height: 36,
                background: `linear-gradient(135deg, ${g0}, ${g1})`,
                color: 'common.white', fontWeight: 800, fontSize: 12,
                textShadow: '0 1px 1px rgba(0,0,0,0.15)',
                flexShrink: 0,
              }}
            >
              {initialsOf(p.row.customer_name)}
            </Avatar>
            <Stack sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }} noWrap>
                {p.row.customer_name ?? '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                {fmtNumber(p.row.item_count)} sản phẩm
              </Typography>
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: 'type', headerName: 'Loại yêu cầu', width: 160,
      renderCell: (p) => {
        const m = TYPE_META[p.row.type] ?? TYPE_META.exchange;
        return (
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Box sx={{
              width: 28, height: 28, borderRadius: 1,
              bgcolor: m.color + '14', color: m.color,
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Iconify icon={m.icon} width={15} />
            </Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: m.color }}>
              {m.label}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'refund_amount', headerName: 'Số tiền', width: 160, align: 'right', headerAlign: 'right',
      renderCell: (p) => (
        <Stack alignItems="flex-end" spacing={0.25}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'warning.dark' }}>
            {fmtVND(p.row.refund_amount)}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
            {p.row.type === 'refund' ? 'Phải hoàn' : p.row.type === 'exchange' ? 'Giá trị đổi' : 'Ước tính'}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'progress', headerName: 'Tiến độ', width: 160,
      renderCell: (p) => {
        const step = STATUS_STEP[p.row.status] ?? 0;
        const rejected = p.row.status === 'rejected';
        return (
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={0.375} sx={{ alignItems: 'center' }}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                const done = i < step;
                return (
                  <Box
                    key={i}
                    sx={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      bgcolor: rejected ? 'error.main' : done ? 'success.main' : 'grey.200',
                      opacity: rejected ? 0.5 : 1,
                    }}
                  />
                );
              })}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10.5 }}>
              {rejected ? 'Dừng xử lý' : `Bước ${step}/${TOTAL_STEPS}`}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'created_at', headerName: 'Ngày tạo', width: 140,
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
      field: 'status', headerName: 'Trạng thái', width: 150,
      renderCell: (p) => <StatusBadge status={p.row.status} colorMap={RETURN_STATUS_COLOR} labelMap={RETURN_STATUS_LABEL} />,
    },
    {
      field: 'actions', headerName: '', width: 56, align: 'center', sortable: false,
      renderCell: (p) => {
        const canApprove = p.row.status === 'requested';
        return (
          <RowActionsMenu
            items={[
              { label: 'Xem chi tiết', icon: 'solar:eye-linear',             onClick: () => alert('Chi tiết ' + p.row.id) },
              { label: 'Mở đơn gốc',  icon: 'solar:bag-4-linear',           href: adminPaths.order.detail(p.row.order_no) },
              { label: 'Copy mã',     icon: 'solar:copy-linear',            onClick: () => navigator.clipboard?.writeText(p.row.order_no) },
              { divider: true },
              { label: 'Duyệt yêu cầu', icon: 'solar:check-circle-linear',  color: 'success', disabled: !canApprove, onClick: () => alert('Duyệt ' + p.row.id) },
              { label: 'Từ chối',      icon: 'solar:close-circle-linear',   color: 'error',   disabled: !canApprove, onClick: () => alert('Từ chối ' + p.row.id) },
            ]}
          />
        );
      },
    },
  ];

  const body = (
    <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
      {/* KPI row */}
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            index={0}
            icon={AssignmentReturnOutlined}
            label="Tổng yêu cầu"
            value={fmtNumber(kpi.total)}
            color="primary"
            helperText="Thu đổi · hoàn tiền · bảo hành"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            index={1}
            icon={HourglassBottomOutlined}
            label="Đang xử lý"
            value={fmtNumber(kpi.pending)}
            color="warning"
            helperText={`${((kpi.pending / Math.max(kpi.total, 1)) * 100).toFixed(0)}% chờ CSKH thao tác`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            index={2}
            icon={ReceiptLongOutlined}
            label="Đã hoàn tiền"
            value={fmtNumber(kpi.refunded)}
            color="success"
            helperText="Đã chuyển tiền cho khách"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            index={3}
            icon={PaidOutlined}
            label="Giá trị hoàn"
            value={fmtVND(kpi.totalAmt)}
            valueSize={20}
            color="error"
            helperText="Tổng tiền hoàn tất cả yêu cầu"
          />
        </Grid>
      </Grid>

      <DataTable
        rows={rows}
        columns={columns}
        loading={returnRequestsLoading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}
        toolbar={
          <FilterBar
            searchValue={search}
            onSearch={setSearch}
            placeholder="Tìm mã yêu cầu / tên khách…"
            filters={[
              { value: typeFilter,   onChange: setType,   options: TYPE_OPTS,   minWidth: 160 },
              { value: statusFilter, onChange: setStatus, options: STATUS_OPTS, minWidth: 170 },
              { value: timeRange,    onChange: setTime,   options: TIME_OPTS,   minWidth: 160 },
            ]}
            onReset={hasFilter ? () => { setSearch(''); setType('all'); setStatus('all'); setTime('all'); } : undefined}
          />
        }
      />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Thu đổi & Hoàn tiền"
        subtitle={`${returnRequestsList.length} yêu cầu · Thu đổi 48h · Hoàn tiền · Bảo hành`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Hậu mãi' }, { label: 'Thu đổi' }]}
      />
      {body}
    </DashboardContent>
  );
}
