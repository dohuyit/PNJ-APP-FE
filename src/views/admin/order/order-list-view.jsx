'use client';

import { useMemo, useState } from 'react';

import PaidOutlined from '@mui/icons-material/PaidOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import PendingActionsOutlined from '@mui/icons-material/PendingActionsOutlined';
import {
  Avatar, Badge, Box, Button, Chip, Drawer, FormControlLabel,
  Grid, IconButton, Stack, Switch, Tab, Tabs, TextField, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fmtVND, fmtDateTime, fmtNumber } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { KpiCard } from 'src/views/admin/_shared/kpi-card';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';
import { useGetOrderList, useGetOrderStatusCount } from 'src/actions/admin/order';
import {
  ORDER_STATUS_COLOR, ORDER_STATUS_LABEL,
  PAYMENT_STATUS_COLOR, PAYMENT_STATUS_LABEL,
} from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { StatusBadge } from 'src/components/common/status-badge';

import { OrderKanbanView } from './order-kanban-view';
import { OrderDetailDrawer } from './order-detail-drawer';

// Stub detail chưa có hook; counts lấy từ useGetOrderStatusCount trong component.
// `{}` cho phép spread `{...ordersDetail, ...row}` không crash khi row thiếu field.
const ordersDetail = {};

const PAY_LABEL = { cod: 'COD', vnpay: 'VNPay', momo: 'MoMo', zalopay: 'ZaloPay', card_intl: 'Thẻ QT', installment_0: 'Trả góp 0%' };
const CHANNEL_LABEL = { web: 'Website', store_order: 'Tại cửa hàng', hotline: 'Hotline' };
const CHANNEL_ICON  = { web: 'solar:global-linear', store_order: 'solar:shop-linear', hotline: 'solar:phone-linear' };

const makeColumns = ({ onView } = {}) => [
  {
    field: 'order_no', headerName: 'Mã đơn', width: 170,
    renderCell: (p) => (
      <Stack>
        <Typography
          component={RouterLink}
          href={adminPaths.order.detail(p.row.id)}
          variant="subtitle2"
          sx={{ textDecoration: 'none', color: 'text.primary', fontFamily: 'monospace' }}
        >
          {p.row.order_no ?? '-'}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
          <Iconify icon={CHANNEL_ICON[p.row.channel] ?? 'solar:tag-linear'} width={11} />
          <Typography variant="caption" color="inherit">
            {CHANNEL_LABEL[p.row.channel] ?? p.row.channel}
          </Typography>
        </Stack>
      </Stack>
    ),
  },
  {
    field: 'buyer', headerName: 'Khách', flex: 1, minWidth: 200,
    renderCell: (p) => (
      <Stack>
        <Typography variant="body2" noWrap>{p.row.buyer?.full_name ?? '-'}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{p.row.buyer?.phone ?? '-'}</Typography>
        {p.row.buyer.email && (
          <Typography variant="caption" color="text.disabled" noWrap sx={{ fontSize: 10.5 }}>
            {p.row.buyer?.email ?? '-'}
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    field: 'product', headerName: 'Sản phẩm', flex: 1, minWidth: 260,
    renderCell: (p) => {
      const it = p.row.first_item ?? {};
      const count = p.row.item_count ?? 1;
      return (
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, width: '100%' }}>
          <Badge
            overlap="rectangular"
            badgeContent={count > 1 ? `×${count}` : null}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                top: 4, right: 4, height: 18, minWidth: 22, px: 0.5,
                fontSize: 10, fontWeight: 800, fontFamily: 'monospace',
                borderRadius: '6px',
                boxShadow: '0 0 0 2px #fff',
              },
            }}
          >
            <Avatar
              src={it.image}
              variant="rounded"
              sx={{ width: 42, height: 42, bgcolor: 'grey.100', flexShrink: 0 }}
            >
              <Iconify icon="solar:box-linear" width={16} />
            </Avatar>
          </Badge>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: 12.5 }}>
              {it.name ?? '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontFamily: 'monospace', fontSize: 10.5 }}>
              {it.sku} · {it.material} · {it.weight_g}g
            </Typography>
          </Box>
        </Stack>
      );
    },
  },
  {
    field: 'fees', headerName: 'Phí & VAT', width: 160, align: 'right', headerAlign: 'right',
    renderCell: (p) => {
      const s = p.row.amounts.shipping_fee ?? 0;
      const v = p.row.amounts.vat ?? 0;
      return (
        <Stack alignItems="flex-end" spacing={0.25}>
          <Typography
            variant="body2"
            sx={{ fontFamily: 'monospace', fontSize: 12, color: s > 0 ? 'text.primary' : 'text.disabled' }}
          >
            Phí ship: {s > 0 ? fmtVND(s) : 'Miễn phí'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: 10.5 }}>
            VAT: {fmtVND(v)}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: 'grand_total', headerName: 'Tổng tiền', width: 180, align: 'right', headerAlign: 'right',
    renderCell: (p) => {
      const a = p.row.amounts;
      const parts = [
        `Tạm ${fmtNumber(a.subtotal)}`,
        a.discount > 0 && `- ${fmtNumber(a.discount)}`,
      ].filter(Boolean).join(' · ');
      return (
        <Stack alignItems="flex-end" spacing={0.25}>
          <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ fontFamily: 'monospace' }}>
            {fmtVND(a.grand_total)}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, fontFamily: 'monospace' }}>
            {parts}
          </Typography>
          {p.row.promo_code && (
            <Typography variant="caption" sx={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'success.dark' }}>
              KM: {p.row.promo_code ?? '-'}
            </Typography>
          )}
        </Stack>
      );
    },
  },
  {
    field: 'payment', headerName: 'Thanh toán', width: 180,
    renderCell: (p) => (
      <Stack spacing={0.25}>
        <Typography variant="caption">{PAY_LABEL[p.row.payment.method_code] ?? p.row.payment.method_code}</Typography>
        <StatusBadge status={p.row.payment.status} colorMap={PAYMENT_STATUS_COLOR} labelMap={PAYMENT_STATUS_LABEL} />
      </Stack>
    ),
  },
  {
    field: 'fulfillment', headerName: 'Nhận', width: 170,
    renderCell: (p) => (
      <Stack>
        <Chip
          icon={<Iconify icon={p.row.fulfillment.method === 'delivery' ? 'solar:delivery-linear' : 'solar:shop-2-linear'} width={12} />}
          label={p.row.fulfillment.method === 'delivery' ? 'Giao hàng' : 'Nhận tại CH'}
          size="small"
          variant="outlined"
        />
        {p.row.fulfillment.pickup_store_snapshot && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {p.row.fulfillment.pickup_store_snapshot.name}
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    field: 'status', headerName: 'Trạng thái', width: 150,
    renderCell: (p) => <StatusBadge status={p.row.status} colorMap={ORDER_STATUS_COLOR} labelMap={ORDER_STATUS_LABEL} />,
  },
  {
    field: 'created_at', headerName: 'Ngày đặt', width: 160,
    renderCell: (p) => <Typography variant="caption" color="text.secondary">{fmtDateTime(p.row.created_at)}</Typography>,
  },
  {
    field: 'actions', headerName: '', width: 60, align: 'center', sortable: false,
    renderCell: (p) => {
      const isCancellable = ['pending', 'confirmed'].includes(p.row.status);
      return (
        <RowActionsMenu
          items={[
            { label: 'Xem chi tiết',   icon: 'solar:eye-linear',             onClick: () => onView?.(p.row) },
            { label: 'Mở trang đầy đủ', icon: 'solar:arrow-right-up-linear', href: adminPaths.order.detail(p.row.id) },
            { label: 'Cập nhật trạng thái', icon: 'solar:refresh-circle-linear', onClick: () => alert('Mở drawer đổi trạng thái: ' + p.row.order_no) },
            { divider: true },
            { label: 'In phiếu đóng gói', icon: 'solar:printer-linear',  onClick: () => window.open(`/admin/order/${p.row.id}/packing-slip`, '_blank') },
            { label: 'Xuất hoá đơn PDF',  icon: 'solar:document-linear', onClick: () => window.open(`/admin/order/${p.row.id}/invoice.pdf`, '_blank') },
            { label: 'Copy mã đơn',       icon: 'solar:copy-linear',     onClick: () => navigator.clipboard?.writeText(p.row.order_no) },
            { divider: true },
            { label: 'Huỷ đơn', icon: 'solar:close-circle-linear', color: 'error', disabled: !isCancellable, onClick: () => alert('Huỷ đơn: ' + p.row.order_no) },
          ]}
        />
      );
    },
  },
];

const CHANNEL_OPTS = [
  { value: 'all',         label: 'Tất cả kênh',    icon: 'solar:layers-minimalistic-linear' },
  { value: 'web',         label: 'Website',        icon: 'solar:global-linear' },
  { value: 'store_order', label: 'Tại cửa hàng',   icon: 'solar:shop-linear' },
  { value: 'hotline',     label: 'Hotline',        icon: 'solar:phone-linear' },
];

const PAY_STATUS_OPTS = [
  { value: 'all',     label: 'Thanh toán: tất cả', icon: 'solar:card-linear' },
  { value: 'paid',    label: 'Đã thanh toán',      icon: 'solar:check-circle-linear',   dot: 'success.main' },
  { value: 'pending', label: 'Chờ thanh toán',     icon: 'solar:clock-circle-linear',   dot: 'warning.main' },
  { value: 'failed',  label: 'Thanh toán lỗi',     icon: 'solar:close-circle-linear',   dot: 'error.main' },
];

const TIME_OPTS = [
  { value: 'all',   label: 'Mọi thời gian', icon: 'solar:infinity-linear' },
  { value: 'today', label: 'Hôm nay',       icon: 'solar:sun-linear' },
  { value: '7d',    label: '7 ngày qua',    icon: 'solar:calendar-linear' },
  { value: '30d',   label: '30 ngày qua',   icon: 'solar:calendar-mark-linear' },
  { value: '90d',   label: '90 ngày qua',   icon: 'solar:calendar-search-linear' },
];

const FULFILLMENT_OPTS = [
  { value: 'all',          label: 'Tất cả' },
  { value: 'delivery',     label: 'Giao hàng' },
  { value: 'store_pickup', label: 'Nhận tại CH' },
];

const PAY_METHOD_OPTS = Object.entries(PAY_LABEL);

const EMPTY_ADV = {
  paymentMethods: [],
  fulfillment: 'all',
  amountMin: '',
  amountMax: '',
  hasPromo: false,
};

function countAdvFilters(adv) {
  return (
    (adv.paymentMethods.length ? 1 : 0) +
    (adv.fulfillment !== 'all' ? 1 : 0) +
    (adv.amountMin || adv.amountMax ? 1 : 0) +
    (adv.hasPromo ? 1 : 0)
  );
}

function OrderAdvancedFilterDrawer({ open, value, onChange, onClose, onReset }) {
  const v = value ?? EMPTY_ADV;
  const set = (patch) => onChange({ ...v, ...patch });
  const toggleMethod = (m) =>
    set({ paymentMethods: v.paymentMethods.includes(m) ? v.paymentMethods.filter((x) => x !== m) : [...v.paymentMethods, m] });

  return (
    <Drawer
      anchor="right" open={open} onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 380 }, bgcolor: 'common.white' } }}
    >
      <Stack sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography sx={{ flex: 1, fontWeight: 700 }}>Bộ lọc nâng cao</Typography>
          <IconButton size="small" onClick={onClose}><Iconify icon="solar:close-circle-linear" width={18} /></IconButton>
        </Stack>

        <Stack spacing={2.5} sx={{ p: 2, flex: 1, overflow: 'auto' }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Phương thức thanh toán
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {PAY_METHOD_OPTS.map(([code, label]) => {
                const active = v.paymentMethods.includes(code);
                return (
                  <Chip
                    key={code}
                    label={label}
                    size="small"
                    onClick={() => toggleMethod(code)}
                    color={active ? 'primary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                  />
                );
              })}
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Hình thức nhận hàng
            </Typography>
            <Stack direction="row" gap={0.75}>
              {FULFILLMENT_OPTS.map((f) => {
                const active = v.fulfillment === f.value;
                return (
                  <Chip
                    key={f.value}
                    label={f.label}
                    size="small"
                    onClick={() => set({ fulfillment: f.value })}
                    color={active ? 'primary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                  />
                );
              })}
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Khoảng tổng tiền (₫)
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small" placeholder="Tối thiểu" fullWidth
                value={v.amountMin}
                onChange={(e) => set({ amountMin: e.target.value.replace(/[^\d]/g, '') })}
              />
              <TextField
                size="small" placeholder="Tối đa" fullWidth
                value={v.amountMax}
                onChange={(e) => set({ amountMax: e.target.value.replace(/[^\d]/g, '') })}
              />
            </Stack>
          </Box>

          <FormControlLabel
            control={<Switch checked={v.hasPromo} onChange={(e) => set({ hasPromo: e.target.checked })} />}
            label={<Typography sx={{ fontSize: 13 }}>Chỉ đơn có mã khuyến mãi</Typography>}
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={onReset}>Đặt lại</Button>
          <Button fullWidth variant="contained" onClick={onClose}>Áp dụng</Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

const STATUS_TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'processing', label: 'Đang chuẩn bị' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'completed', label: 'Hoàn tất' },
  { value: 'cancelled', label: 'Đã huỷ' },
];

export function OrderListView() {
  const { searchResults: ordersList, searchLoading: ordersLoading } = useGetOrderList();
  const { counts: ordersCounts = {} } = useGetOrderStatusCount();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('table');     // 'table' | 'kanban'
  const [viewing, setViewing] = useState(null);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });
  const [channel, setChannel] = useState('all');
  const [payStatus, setPayStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [adv, setAdv] = useState(EMPTY_ADV);
  const [advOpen, setAdvOpen] = useState(false);
  const columns = useMemo(() => makeColumns({ onView: (row) => setViewing({ ...ordersDetail, ...row }) }), []);

  const rows = useMemo(() => {
    let r = ordersList;
    if (tab !== 'all') r = r.filter((o) => o.status === tab);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((o) => o.order_no.toLowerCase().includes(q) || o.buyer.phone.includes(q) || o.buyer.full_name.toLowerCase().includes(q));
    }
    if (channel !== 'all')   r = r.filter((o) => o.channel === channel);
    if (payStatus !== 'all') r = r.filter((o) => o.payment?.status === payStatus);
    if (timeRange !== 'all') {
      const DAY = 86_400_000;
      const span = { today: DAY, '7d': 7*DAY, '30d': 30*DAY, '90d': 90*DAY }[timeRange];
      const cutoff = Date.now() - span;
      r = r.filter((o) => new Date(o.created_at).getTime() >= cutoff);
    }
    if (adv.paymentMethods.length) r = r.filter((o) => adv.paymentMethods.includes(o.payment?.method_code));
    if (adv.fulfillment !== 'all') r = r.filter((o) => o.fulfillment?.method === adv.fulfillment);
    if (adv.amountMin) r = r.filter((o) => (o.amounts?.grand_total ?? 0) >= Number(adv.amountMin));
    if (adv.amountMax) r = r.filter((o) => (o.amounts?.grand_total ?? 0) <= Number(adv.amountMax));
    if (adv.hasPromo)  r = r.filter((o) => !!o.promo_code);
    return r;
  }, [ordersList, tab, search, channel, payStatus, timeRange, adv]);

  const advCount = countAdvFilters(adv);

  const kpi = useMemo(() => {
    const totalRevenue = ordersList.reduce((s, o) => s + (o.amounts?.grand_total ?? 0), 0);
    const paidRevenue  = ordersList
      .filter((o) => o.payment?.status === 'paid')
      .reduce((s, o) => s + (o.amounts?.grand_total ?? 0), 0);
    const pending   = ordersCounts.pending   ?? 0;
    const shipping  = ordersCounts.shipping  ?? 0;
    const completed = ordersCounts.completed ?? 0;
    return { total: ordersCounts.all, totalRevenue, paidRevenue, pending, shipping, completed };
  }, [ordersList, ordersCounts]);

  return (
    <DashboardContent disablePadding>
      <Box sx={{
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}>
        {/* Title row + view toggle */}
        <Stack
          direction="row" alignItems="center" spacing={1.5}
          sx={{ px: { xs: 2, md: 2.5 }, py: 2, borderBottom: 1, borderColor: 'divider' }}
          flexWrap="wrap" rowGap={1}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
              Đơn hàng
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
              {ordersList.length} đơn · quản lý trạng thái, in phiếu, xuất hoá đơn
            </Typography>
          </Box>

          {/* View toggle flat */}
          <Stack
            direction="row"
            sx={{
              border: 1, borderColor: 'divider', borderRadius: 1, p: 0.375,
              bgcolor: 'grey.100',
              gap: 0.375,
            }}
          >
            {[
              { k: 'table',  label: 'Bảng',   icon: 'solar:list-linear' },
              { k: 'kanban', label: 'Kanban', icon: 'solar:widget-linear' },
            ].map(({ k, label, icon }) => {
              const active = view === k;
              return (
                <Button
                  key={k}
                  size="small"
                  onClick={() => setView(k)}
                  startIcon={<Iconify icon={icon} width={14} />}
                  sx={(theme) => ({
                    minWidth: 'auto', px: 1.25, py: 0.5, borderRadius: 0.75, fontSize: 12.5,
                    fontWeight: 700, letterSpacing: '-0.005em',
                    boxShadow: active
                      ? '0 1px 2px rgba(145,158,171,0.24), 0 0 0 1px rgba(145,158,171,0.16)'
                      : 'none',
                    bgcolor: active ? 'background.paper' : 'transparent',
                    color:   active ? 'primary.main'     : 'text.secondary',
                    '&:hover': {
                      bgcolor: active ? 'background.paper' : 'action.hover',
                      color:   active ? 'primary.dark'     : 'text.primary',
                      boxShadow: active
                        ? '0 1px 2px rgba(145,158,171,0.24), 0 0 0 1px rgba(145,158,171,0.16)'
                        : 'none',
                    },
                  })}
                >
                  {label}
                </Button>
              );
            })}
          </Stack>

          <Button
            variant="outlined" size="small"
            startIcon={<Iconify icon="solar:download-linear" width={13} />}
            sx={{ boxShadow: 'none', borderColor: 'divider' }}
          >
            Xuất Excel
          </Button>
          <Button
            variant="outlined" size="small"
            startIcon={<Iconify icon="solar:printer-linear" width={13} />}
            sx={{ boxShadow: 'none', borderColor: 'divider' }}
          >
            In phiếu hàng loạt
          </Button>
        </Stack>

        {/* KPI row — full-width, border nhẹ */}
        <Box>
          <Grid container spacing={0}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              index={0}
              icon={ReceiptLongOutlined}
              label="Tổng đơn"
              value={fmtNumber(kpi.total)}
              color="primary"
              helperText={`Đã hoàn tất ${fmtNumber(kpi.completed)}`}
              onClick={() => setTab('all')}
              selected={tab === 'all'}
              trend={{ value: 8.3, direction: 'up', period: 'so với tháng trước' }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              index={1}
              icon={PendingActionsOutlined}
              label="Chờ xác nhận"
              value={fmtNumber(kpi.pending)}
              color="warning"
              helperText="Cần CSKH gọi xác nhận"
              onClick={() => setTab('pending')}
              selected={tab === 'pending'}
              trend={{ value: 3.1, direction: 'down', period: 'hôm nay' }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              index={2}
              icon={LocalShippingOutlined}
              label="Đang giao"
              value={fmtNumber(kpi.shipping)}
              color="info"
              helperText="Theo dõi ETA giao hàng"
              onClick={() => setTab('shipping')}
              selected={tab === 'shipping'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              index={3}
              icon={PaidOutlined}
              label="Doanh thu đã thu"
              value={fmtVND(kpi.paidRevenue)}
              color="success"
              helperText={`Tổng GMV ${fmtVND(kpi.totalRevenue)}`}
              trend={{ value: 12.4, direction: 'up', period: 'so với tháng trước' }}
            />
          </Grid>
        </Grid>
      </Box>

        {view === 'kanban' ? (
          <OrderKanbanView />
        ) : (
          <>
            {/* Status tabs — flat, lighter */}
            <Box sx={{ px: { xs: 2, md: 2.5 }, borderBottom: 1, borderColor: 'divider', mt: 1.5 }}>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{ sx: { height: 2, bgcolor: 'text.primary' } }}
                sx={{
                  minHeight: 36,
                  '& .MuiTabs-flexContainer': { gap: 0 },
                  '& .MuiTab-root': {
                    minHeight: 36, minWidth: 'auto', fontWeight: 500, fontSize: 12.5,
                    textTransform: 'none', px: 1.25, mr: 0.5,
                    color: 'text.secondary',
                    '&.Mui-selected': { color: 'text.primary', fontWeight: 600 },
                  },
                }}
              >
                {STATUS_TABS.map((t) => {
                  const count = t.value === 'all' ? ordersCounts.all : (ordersCounts[t.value] ?? 0);
                  return (
                    <Tab
                      key={t.value}
                      value={t.value}
                      label={
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <span>{t.label}</span>
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              minWidth: 20, height: 18, px: 0.75, borderRadius: 1,
                              fontSize: 10.5, fontWeight: 600,
                              bgcolor: tab === t.value ? 'grey.200' : 'grey.100',
                              color: tab === t.value ? 'text.primary' : 'text.disabled',
                            }}
                          >
                            {count}
                          </Box>
                        </Stack>
                      }
                    />
                  );
                })}
              </Tabs>
            </Box>

            <DataTable
              rows={rows}
              columns={columns}
              loading={ordersLoading}
              paginationModel={pagination}
              onPaginationModelChange={setPagination}
              checkboxSelection
              onRowClick={(p) => setViewing({ ...ordersDetail, ...p.row })}
              sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}
              toolbar={
                <FilterBar
                  searchValue={search} onSearch={setSearch}
                  placeholder="Tìm mã đơn / SĐT / tên KH…"
                  filters={[
                    { value: channel,   options: CHANNEL_OPTS,    onChange: setChannel,   minWidth: 160 },
                    { value: payStatus, options: PAY_STATUS_OPTS, onChange: setPayStatus, minWidth: 180 },
                    { value: timeRange, options: TIME_OPTS,       onChange: setTimeRange, minWidth: 160 },
                  ]}
                  advancedCount={advCount}
                  onOpenAdvanced={() => setAdvOpen(true)}
                  advancedChips={[
                    ...adv.paymentMethods.map((code) => ({
                      label: `PTTT: ${PAY_LABEL[code] ?? code}`,
                      onClear: () => setAdv({ ...adv, paymentMethods: adv.paymentMethods.filter((x) => x !== code) }),
                    })),
                    ...(adv.fulfillment !== 'all' ? [{
                      label: `Nhận: ${FULFILLMENT_OPTS.find((o) => o.value === adv.fulfillment)?.label}`,
                      onClear: () => setAdv({ ...adv, fulfillment: 'all' }),
                    }] : []),
                    ...(adv.amountMin || adv.amountMax ? [{
                      label: `Tiền: ${adv.amountMin ? Number(adv.amountMin).toLocaleString('vi-VN') : '0'} — ${adv.amountMax ? Number(adv.amountMax).toLocaleString('vi-VN') : '∞'}`,
                      onClear: () => setAdv({ ...adv, amountMin: '', amountMax: '' }),
                    }] : []),
                    ...(adv.hasPromo ? [{
                      label: 'Có mã khuyến mãi',
                      onClear: () => setAdv({ ...adv, hasPromo: false }),
                    }] : []),
                  ]}
                  onReset={
                    (channel !== 'all' || payStatus !== 'all' || timeRange !== 'all' || advCount > 0 || search)
                      ? () => { setChannel('all'); setPayStatus('all'); setTimeRange('all'); setAdv(EMPTY_ADV); setSearch(''); }
                      : undefined
                  }
                />
              }
            />
          </>
        )}
      </Box>

      <OrderAdvancedFilterDrawer
        open={advOpen}
        value={adv}
        onChange={setAdv}
        onClose={() => setAdvOpen(false)}
        onReset={() => setAdv(EMPTY_ADV)}
      />

      <OrderDetailDrawer
        open={!!viewing}
        order={viewing}
        onClose={() => setViewing(null)}
        onUpdateStatus={(o) => alert('Cập nhật trạng thái: ' + o.order_no)}
      />
    </DashboardContent>
  );
}
