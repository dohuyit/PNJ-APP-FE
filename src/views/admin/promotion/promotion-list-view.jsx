// src/views/admin/promotion/promotion-list-view.jsx
// Chương trình khuyến mãi — layout pattern chuẩn: KPI + FilterBar + DataTable enhanced.

'use client';

import { useMemo, useState } from 'react';

import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import LocalActivityOutlined from '@mui/icons-material/LocalActivityOutlined';
import PlayCircleOutlineOutlined from '@mui/icons-material/PlayCircleOutlineOutlined';
import {
  Box, Button, Grid, IconButton, LinearProgress, Stack, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtDate, fmtNumber, fmtRelative } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { KpiCard } from 'src/views/admin/_shared/kpi-card';
import { useGetPromotionList } from 'src/actions/admin/promotion';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';
import { PROMOTION_STATUS_COLOR, PROMOTION_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';
import { StatusBadge } from 'src/components/common/status-badge';

import { PromotionFormDrawer } from './promotion-create-drawer';


// ---------- Meta cho loại KM · icon + accent hex
const TYPE_META = {
  product_discount:     { label: 'Giảm giá SP',           icon: 'solar:tag-price-linear',  color: '#DC2626' },
  gift_with_purchase:   { label: 'Quà tặng kèm',          icon: 'solar:gift-linear',        color: '#DB2777' },
  tiered_quantity:      { label: 'Mua nhiều giảm',         icon: 'solar:tuning-linear',      color: '#2563EB' },
  order_threshold_gift: { label: 'Quà theo hoá đơn',       icon: 'solar:box-linear',         color: '#D97706' },
  payment_method:       { label: 'Theo ví TT',             icon: 'solar:card-linear',        color: '#7C3AED' },
  coupon:               { label: 'Coupon',                 icon: 'solar:ticket-linear',      color: '#059669' },
};

const TYPE_OPTS = [
  { value: 'all', label: 'Mọi loại KM', icon: 'solar:layers-minimalistic-linear' },
  ...Object.entries(TYPE_META).map(([v, m]) => ({ value: v, label: m.label, icon: m.icon })),
];

const STATUS_OPTS = [
  { value: 'all',       label: 'Mọi trạng thái', icon: 'solar:layers-minimalistic-linear' },
  { value: 'running',   label: 'Đang chạy',       dot: 'success.main' },
  { value: 'scheduled', label: 'Đã lên lịch',     dot: 'info.main' },
  { value: 'paused',    label: 'Tạm dừng',        dot: 'warning.main' },
  { value: 'ended',     label: 'Đã kết thúc',     dot: 'text.disabled' },
];

const PHASE_OPTS = [
  { value: 'all',      label: 'Mọi giai đoạn',  icon: 'solar:infinity-linear' },
  { value: 'active',   label: 'Đang trong hạn', dot: 'success.main' },
  { value: 'upcoming', label: 'Sắp bắt đầu',    dot: 'info.main' },
  { value: 'expired',  label: 'Đã qua hạn',     dot: 'text.disabled' },
];

function phaseOf(p) {
  const now = Date.now();
  const s = new Date(p.start_at).getTime();
  const e = new Date(p.end_at).getTime();
  if (now < s) return 'upcoming';
  if (now > e) return 'expired';
  return 'active';
}

export function PromotionCreateButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small" variant="contained"
        startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
        onClick={() => setOpen(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Tạo chương trình
      </Button>
      <PromotionFormDrawer open={open} onClose={() => setOpen(false)} onSubmit={(v) => console.log('create promotion', v)} />
    </>
  );
}

export function PromotionListView({ embedded = false } = {}) {
  const { searchResults: promotionsList, searchLoading: promotionsLoading } = useGetPromotionList();
  const [editing, setEditing] = useState(null);
  const [search, setSearch]   = useState('');
  const [type, setType]       = useState('all');
  const [status, setStatus]   = useState('all');
  const [phase, setPhase]     = useState('all');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });

  const kpi = useMemo(() => {
    const total     = promotionsList.length;
    const running   = promotionsList.filter((p) => p.status === 'running').length;
    const scheduled = promotionsList.filter((p) => p.status === 'scheduled').length;
    const totalUsed = promotionsList.reduce((s, p) => s + (p.used_count ?? 0), 0);
    return { total, running, scheduled, totalUsed };
  }, [promotionsList]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return promotionsList.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q)) return false;
      if (type   !== 'all' && p.type   !== type)   return false;
      if (status !== 'all' && p.status !== status) return false;
      if (phase  !== 'all' && phaseOf(p) !== phase) return false;
      return true;
    });
  }, [promotionsList, search, type, status, phase]);

  const hasFilter = search || type !== 'all' || status !== 'all' || phase !== 'all';
  const resetFilters = () => { setSearch(''); setType('all'); setStatus('all'); setPhase('all'); };

  const columns = [
    {
      field: 'name', headerName: 'Chương trình', width: 320,
      renderCell: (p) => {
        const m = TYPE_META[p.row.type] ?? TYPE_META.product_discount;
        return (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{
              width: 40, height: 40, borderRadius: 1,
              bgcolor: 'grey.100', color: 'text.secondary',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Iconify icon={m.icon} width={20} />
            </Box>
            <Stack sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 13 }} noWrap>
                {p.row.name ?? '-'}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box component="span" sx={{
                  display: 'inline-flex', alignItems: 'center',
                  px: 0.625, py: 0.125, borderRadius: 0.5,
                  bgcolor: 'grey.100', border: 1, borderColor: 'grey.200',
                  fontFamily: 'monospace', fontSize: 10.5, fontWeight: 600, color: 'text.secondary',
                }}>
                  {p.row.code ?? '-'}
                </Box>
                {p.row.stackable && (
                  <Tooltip title="Có thể cộng dồn với KM khác">
                    <Box component="span" sx={{
                      display: 'inline-flex', alignItems: 'center',
                      px: 0.625, py: 0.125, borderRadius: 0.5,
                      bgcolor: 'primary.lighter', color: 'primary.dark',
                      fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
                    }}>
                      <Iconify icon="solar:layers-minimalistic-linear" width={10} sx={{ mr: '2px' }} />
                      STACK
                    </Box>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: 'type', headerName: 'Loại KM', width: 180,
      renderCell: (p) => {
        const m = TYPE_META[p.row.type] ?? TYPE_META.product_discount;
        return (
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Iconify icon={m.icon} width={14} sx={{ color: 'text.disabled' }} />
            <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: 'text.primary' }}>
              {m.label}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'scope', headerName: 'Phạm vi', width: 110, align: 'center', headerAlign: 'center',
      renderCell: (p) => (
        <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="center">
          <Iconify icon="solar:box-linear" width={12} sx={{ color: 'text.disabled' }} />
          <Typography sx={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600 }}>
            {p.row.scope_summary ?? '—'}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'schedule', headerName: 'Lịch chạy', width: 240,
      renderCell: (p) => {
        const ph = phaseOf(p.row);
        const daysLeft = Math.ceil((new Date(p.row.end_at) - Date.now()) / 86_400_000);
        const daysUntil = Math.ceil((new Date(p.row.start_at) - Date.now()) / 86_400_000);
        return (
          <Stack spacing={0.25}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="solar:calendar-linear" width={11} sx={{ color: 'text.disabled' }} />
              <Typography variant="caption" sx={{ fontSize: 11.5, fontWeight: 500 }}>
                {fmtDate(p.row.start_at)} → {fmtDate(p.row.end_at)}
              </Typography>
            </Stack>
            {ph === 'active' && daysLeft > 0 && (
              <Typography variant="caption" sx={{ fontSize: 10.5, color: daysLeft < 7 ? 'warning.dark' : 'success.dark', fontWeight: 600 }}>
                {daysLeft < 7 ? '⚠' : '●'} Còn {daysLeft} ngày
              </Typography>
            )}
            {ph === 'upcoming' && (
              <Typography variant="caption" sx={{ fontSize: 10.5, color: 'info.dark', fontWeight: 600 }}>
                ● Khởi chạy sau {daysUntil} ngày
              </Typography>
            )}
            {ph === 'expired' && (
              <Typography variant="caption" sx={{ fontSize: 10.5, color: 'text.disabled' }}>
                Đã kết thúc {fmtRelative(p.row.end_at)}
              </Typography>
            )}
          </Stack>
        );
      },
    },
    {
      field: 'usage', headerName: 'Đã dùng', width: 180,
      renderCell: (p) => {
        const pct = Math.min((p.row.used_count / Math.max(p.row.usage_limit, 1)) * 100, 100);
        return (
          <Stack sx={{ width: '100%' }} spacing={0.375}>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
                {fmtNumber(p.row.used_count ?? 0)}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
                / {fmtNumber(p.row.usage_limit ?? 0)}
              </Typography>
              <Box sx={{ flex: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10.5, fontWeight: 600 }}>
                {pct.toFixed(0)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 4, borderRadius: 2,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  bgcolor: pct > 90 ? 'error.main' : pct > 70 ? 'warning.main' : 'success.main',
                  borderRadius: 2,
                },
              }}
            />
          </Stack>
        );
      },
    },
    {
      field: 'priority', headerName: 'Ưu tiên', width: 90, align: 'center', headerAlign: 'center',
      renderCell: (p) => (
        <Box sx={{
          display: 'inline-flex', alignItems: 'center',
          px: 0.875, py: 0.25, borderRadius: 0.75,
          bgcolor: p.row.priority >= 3 ? 'warning.lighter' : 'grey.100',
          color:   p.row.priority >= 3 ? 'warning.darker' : 'text.secondary',
          fontFamily: 'monospace', fontSize: 11.5, fontWeight: 700,
        }}>
          #{p.row.priority}
        </Box>
      ),
    },
    {
      field: 'status', headerName: 'Trạng thái', width: 140,
      renderCell: (p) => <StatusBadge status={p.row.status} colorMap={PROMOTION_STATUS_COLOR} labelMap={PROMOTION_STATUS_LABEL} />,
    },
    {
      field: 'actions', headerName: '', width: 110, align: 'center', sortable: false,
      renderCell: (p) => {
        const paused = p.row.status === 'paused';
        return (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={paused ? 'Kích hoạt' : 'Tạm dừng'}>
              <IconButton
                onClick={() => alert((paused ? 'Resume' : 'Pause') + ' ' + p.row.code)}
                sx={{
                  width: 32, height: 32,
                  color: paused ? 'success.main' : 'warning.main',
                  '&:hover': { bgcolor: paused ? 'success.lighter' : 'warning.lighter' },
                }}
              >
                <Iconify icon={paused ? 'solar:play-circle-linear' : 'solar:pause-circle-linear'} width={18} />
              </IconButton>
            </Tooltip>
            <RowActionsMenu
              items={[
                { label: 'Xem chi tiết', icon: 'solar:eye-linear',     onClick: () => alert('Chi tiết ' + p.row.code) },
                { label: 'Sửa',          icon: 'solar:pen-linear',     onClick: () => setEditing(p.row) },
                { label: 'Nhân bản',     icon: 'solar:copy-linear',    onClick: () => alert('Clone ' + p.row.code) },
                { label: 'Copy code',    icon: 'solar:copy-linear',    onClick: () => navigator.clipboard?.writeText(p.row.code) },
                { divider: true },
                { label: 'Kết thúc sớm', icon: 'solar:stop-circle-linear', color: 'warning', disabled: p.row.status === 'ended', onClick: () => alert('End ' + p.row.code) },
                { label: 'Xoá',          icon: 'solar:trash-bin-trash-linear', color: 'error', disabled: (p.row.used_count ?? 0) > 0, onClick: () => alert('Xoá ' + p.row.code) },
              ]}
            />
          </Stack>
        );
      },
    },
  ];

  const body = (
    <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
      {/* KPI row */}
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={0} icon={LocalActivityOutlined}      label="Tổng chương trình" value={fmtNumber(kpi.total)}     color="primary" helperText="6 loại khuyến mãi khác nhau" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={1} icon={PlayCircleOutlineOutlined}  label="Đang chạy"         value={fmtNumber(kpi.running)}   color="success" helperText="Đang áp dụng trên site" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={2} icon={ScheduleOutlined}           label="Đã lên lịch"       value={fmtNumber(kpi.scheduled)} color="info"    helperText="Chờ ngày khởi chạy" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={3} icon={TrendingUpOutlined}         label="Tổng lượt đã dùng" value={fmtNumber(kpi.totalUsed)} color="warning" valueSize={24} helperText="Lượt áp mã / quà tặng kèm" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        loading={promotionsLoading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}
        emptyText={hasFilter ? 'Không có kết quả · thử xoá bớt lọc' : 'Chưa có chương trình nào'}
        emptyIcon="solar:tag-price-linear"
        toolbar={
          <FilterBar
            searchValue={search} onSearch={setSearch}
            placeholder="Tìm tên / code chương trình…"
            filters={[
              { value: type,   onChange: setType,   options: TYPE_OPTS,   minWidth: 180 },
              { value: status, onChange: setStatus, options: STATUS_OPTS, minWidth: 170 },
              { value: phase,  onChange: setPhase,  options: PHASE_OPTS,  minWidth: 160 },
            ]}
            onReset={hasFilter ? resetFilters : undefined}
          />
        }
      />

      <PromotionFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update promotion', v)}
      />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Chương trình khuyến mãi"
        subtitle={`${promotionsList.length} chương trình · 6 loại khuyến mãi khác nhau`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Khuyến mãi' }]}
        actions={<PromotionCreateButton />}
      />
      {body}
    </DashboardContent>
  );
}
