// src/views/admin/order/order-kanban-view.jsx — Kanban view đơn hàng (style zeno-crm-fe).
// Card chia 5 zones: A source bar, B identity+amount, C data grid, D payment SLA, E footer.

'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DndContext, closestCorners, PointerSensor, useSensor, useSensors, useDraggable, useDroppable,
} from '@dnd-kit/core';

import {
  Avatar, Box, Divider, InputAdornment, Stack, TextField, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelativeDate } from 'src/utils/format-time';
import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import { useGetOrderList } from 'src/actions/admin/order';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';
import { AdminKanbanBoard, AdminKanbanColumn, AdminKanbanCard } from 'src/views/admin/_shared/admin-kanban';

import { Iconify } from 'src/components/iconify';
import { KanbanSkeleton } from 'src/components/common/skeletons';


// 6 cột gom từ 9 status gốc
const COLUMNS = [
  { id: 'pending',   label: 'Chờ xác nhận',   tone: 'warning', statuses: ['pending'] },
  { id: 'confirmed', label: 'Đã xác nhận',    tone: 'info',    statuses: ['confirmed'] },
  { id: 'prep',      label: 'Đang chuẩn bị',  tone: 'primary', statuses: ['processing', 'ready_for_pickup'] },
  { id: 'shipping',  label: 'Đang giao',      tone: 'cyan',    statuses: ['shipping'] },
  { id: 'done',      label: 'Hoàn tất',       tone: 'success', statuses: ['delivered', 'completed'] },
  { id: 'issue',     label: 'Vấn đề',         tone: 'error',   statuses: ['cancelled', 'returned'] },
];

// Channel badge — source bar bên trái
const CHANNEL_META = {
  web:         { label: 'WEB',     icon: 'solar:global-linear',  color: '#1877F2' },
  store_order: { label: 'CH',      icon: 'solar:shop-linear',    color: '#EC4899' },
  hotline:     { label: 'HOTLINE', icon: 'solar:phone-linear',   color: '#F59E0B' },
};

// Payment status — SLA bar
const PAYMENT_META = {
  paid:    { label: 'Đã thanh toán', icon: 'solar:check-circle-linear', bg: '#f0fdf4', border: 'rgba(22,163,74,.2)',  color: '#16a34a' },
  pending: { label: 'Chờ thanh toán', icon: 'solar:clock-circle-linear', bg: '#fffbeb', border: 'rgba(217,119,6,.22)', color: '#d97706' },
  failed:  { label: 'Thanh toán lỗi', icon: 'solar:close-circle-linear', bg: '#fff5f5', border: 'rgba(220,38,38,.22)', color: '#dc2626' },
};

function colByStatus(status) {
  return COLUMNS.find((c) => c.statuses.includes(status))?.id;
}

function formatPhone(p) {
  if (!p) return '';
  return p.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

// ---------------------------------------------------------- Card

function OrderCard({ order }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: order.id });
  const ch = CHANNEL_META[order.channel] ?? { label: order.channel?.toUpperCase?.() || '—', icon: 'solar:tag-linear', color: '#637381' };
  const pay = PAYMENT_META[order.payment?.status] ?? PAYMENT_META.pending;
  const fm = order.fulfillment ?? {};
  const isPickup = fm.method !== 'delivery';

  return (
    <AdminKanbanCard
      nodeRef={setNodeRef}
      dragProps={{ ...attributes, ...listeners }}
      transform={transform}
      isDragging={isDragging}
    >
      {/* Zone A — Source bar */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          pt: '7px', pb: '7px', pl: '12px', pr: '10px',
          gap: '8px',
          background: 'linear-gradient(180deg,#fafafa 0%,#fff 100%)',
          borderBottom: '1px solid rgba(145,158,171,0.16)',
        }}
      >
        <Stack direction="row" alignItems="center" gap="5px" sx={{ flexShrink: 0 }}>
          <Box
            sx={{
              width: 16, height: 16, borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: ch.color, flexShrink: 0,
            }}
          >
            <Iconify icon={ch.icon} width={11} sx={{ color: '#fff' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 10.5, letterSpacing: '0.02em', color: ch.color, whiteSpace: 'nowrap' }}>
            {ch.label}
          </Typography>
        </Stack>
        <Box sx={{ width: '1px', height: '11px', bgcolor: 'rgba(145,158,171,0.16)', flexShrink: 0 }} />
        <Typography
          noWrap
          sx={{
            flex: 1, minWidth: 0,
            fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
            fontSize: 11, fontWeight: 700, color: 'primary.main',
            letterSpacing: '-0.02em',
          }}
        >
          {order.order_no}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
            fontSize: 10, fontWeight: 600, color: '#637381',
            flexShrink: 0, letterSpacing: '-0.01em',
          }}
        >
          {fmtRelativeDate(order.created_at)}
        </Typography>
      </Stack>

      {/* Zone B — Identity + amount */}
      <Stack direction="row" alignItems="center" gap="8px" sx={{ pt: '10px', pb: '8px', pl: '12px', pr: '10px' }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700, bgcolor: 'grey.200', color: 'text.secondary', flexShrink: 0 }}>
          {order.buyer?.full_name?.[0] ?? '?'}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            noWrap
            sx={{ fontWeight: 600, fontSize: 12.5, letterSpacing: '-0.015em', lineHeight: 1.25, color: 'text.primary' }}
          >
            {order.buyer?.full_name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: 11,
              fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
              lineHeight: 1.8,
            }}
          >
            {formatPhone(order.buyer?.phone)}
          </Typography>
        </Box>

        {/* Amount box — right pill giống score box của zeno */}
        <Tooltip title={`Tổng: ${fCurrency(order.amounts?.grand_total ?? 0, 'VND')}`}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              minWidth: 56, px: '6px', py: '5px',
              borderRadius: '8px',
              flexShrink: 0,
              bgcolor: 'rgba(255,171,0,0.12)',
              color: '#B76E00',
            }}
          >
            <Typography sx={{
              fontWeight: 800, fontSize: 13, lineHeight: 1,
              fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
              letterSpacing: '-0.03em', color: 'inherit',
            }}>
              {fShortenNumber(order.amounts?.grand_total ?? 0)}
            </Typography>
            <Typography sx={{ fontSize: 9, fontWeight: 600, mt: '3px', opacity: 0.8, color: 'inherit', letterSpacing: '0.04em' }}>
              VND
            </Typography>
          </Stack>
        </Tooltip>
      </Stack>

      {/* Zone C — Form data */}
      <Box
        sx={{
          pt: '2px', pb: '9px', pl: '12px', pr: '10px',
          display: 'grid',
          gridTemplateColumns: '58px 1fr',
          rowGap: '3px',
          columnGap: '8px',
          alignItems: 'baseline',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10.5, fontWeight: 500 }}>
          Sản phẩm
        </Typography>
        <Typography variant="caption" noWrap sx={{ fontWeight: 600, fontSize: 10.5, color: 'text.primary' }}>
          {order.item_count} SP
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10.5, fontWeight: 500 }}>
          Giao hàng
        </Typography>
        <Stack direction="row" alignItems="center" gap="4px" sx={{ minWidth: 0 }}>
          <Iconify icon={isPickup ? 'solar:shop-2-linear' : 'solar:delivery-linear'} width={11} sx={{ color: 'text.secondary', flexShrink: 0 }} />
          <Typography variant="caption" noWrap sx={{ fontWeight: 600, fontSize: 10.5, color: 'text.primary' }}>
            {isPickup ? (fm.pickup_store_snapshot?.name ?? 'Nhận tại cửa hàng') : 'Giao tận nơi'}
          </Typography>
        </Stack>
      </Box>

      {/* Zone D — Payment SLA bar */}
      <Stack
        direction="row"
        alignItems="center"
        gap="6px"
        sx={{
          ml: '12px', mr: '10px', mb: '9px',
          px: '8px', py: '5px',
          borderRadius: '6px',
          background: pay.bg,
          border: `1px solid ${pay.border}`,
        }}
      >
        <Iconify icon={pay.icon} width={12} sx={{ color: pay.color, flexShrink: 0 }} />
        <Typography sx={{ flex: 1, fontSize: 11, fontWeight: 600, color: pay.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {pay.label}
        </Typography>
        <Box
          component="span"
          sx={{
            fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
            fontSize: 10.5, fontWeight: 700, color: pay.color,
            flexShrink: 0, letterSpacing: '-0.01em',
          }}
        >
          {fCurrency(order.amounts?.grand_total ?? 0, 'VND')}
        </Box>
      </Stack>

      {/* Zone E — Footer actions */}
      <Stack
        direction="row"
        alignItems="center"
        gap="6px"
        sx={{
          pt: '6px', pb: '7px', pl: '12px', pr: '8px',
          borderTop: '1px solid rgba(145,158,171,0.16)',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex', alignItems: 'center',
            px: '6px', py: '1px',
            fontSize: 9.5, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.04em',
            color: 'text.secondary',
            bgcolor: 'rgba(145,158,171,0.12)',
            borderRadius: '4px',
            flexShrink: 0,
          }}
        >
          {order.payment?.method_code ?? '—'}
        </Box>
        <Box sx={{ flex: 1 }} />
        <RowActionsMenu
          items={[
            { label: 'Xem chi tiết',   icon: 'solar:eye-linear',       href: adminPaths.order.detail(order.id) },
            { label: 'In phiếu đóng gói', icon: 'solar:printer-linear', onClick: () => window.open(`/admin/order/${order.id}/packing-slip`, '_blank') },
            { label: 'Copy mã đơn',    icon: 'solar:copy-linear',      onClick: () => navigator.clipboard?.writeText(order.order_no) },
            { divider: true },
            { label: 'Huỷ đơn',        icon: 'solar:close-circle-linear', color: 'error', onClick: () => alert('Huỷ ' + order.order_no) },
          ]}
        />
      </Stack>
    </AdminKanbanCard>
  );
}

// ---------------------------------------------------------- Column

function OrderKanbanColumn({ column, orders, totalCount, hasFilter }) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });
  const total = useMemo(
    () => orders.reduce((s, o) => s + (o.amounts?.grand_total ?? 0), 0),
    [orders]
  );

  return (
    <AdminKanbanColumn
      title={column.label}
      badgeTone={column.tone}
      count={orders.length}
      totalCount={totalCount}
      hasFilter={hasFilter}
      subtitle={total > 0 ? fShortenNumber(total) + ' VND' : undefined}
      nodeRef={setNodeRef}
      isOver={isOver}
    >
      {orders.length === 0 ? (
        <Stack alignItems="center" spacing={0.5} sx={{ py: 4, color: 'text.disabled' }}>
          <Iconify icon="solar:box-minimalistic-linear" width={20} />
          <Typography variant="caption">Không có đơn</Typography>
        </Stack>
      ) : (
        orders.map((o) => <OrderCard key={o.id} order={o} />)
      )}
    </AdminKanbanColumn>
  );
}

// ---------------------------------------------------------- Main view

export function OrderKanbanView() {
  const { searchResults: ordersList, searchLoading: ordersLoading } = useGetOrderList();
  const [orders, setOrders] = useState(ordersList);
  useEffect(() => { setOrders(ordersList); }, [ordersList]);
  const [search, setSearch] = useState('');
  const [channels, setChannels] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const toggleChannel = (v) =>
    setChannels((c) => (c.includes(v) ? c.filter((x) => x !== v) : [...c, v]));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (q && !o.order_no.toLowerCase().includes(q) && !o.buyer.phone.includes(q) && !o.buyer.full_name.toLowerCase().includes(q)) return false;
      if (channels.length && !channels.includes(o.channel)) return false;
      return true;
    });
  }, [orders, search, channels]);

  const byColumn = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.id, []]));
    filtered.forEach((o) => {
      const cid = colByStatus(o.status);
      if (cid) map[cid].push(o);
    });
    return map;
  }, [filtered]);

  const totalByColumn = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.id, 0]));
    orders.forEach((o) => {
      const cid = colByStatus(o.status);
      if (cid) map[cid] += 1;
    });
    return map;
  }, [orders]);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const dest = COLUMNS.find((c) => c.id === over.id);
    if (!dest) return;
    setOrders((list) =>
      list.map((o) => {
        if (o.id !== active.id) return o;
        if (colByStatus(o.status) === dest.id) return o;
        return { ...o, status: dest.statuses[0] };
      })
    );
  };

  const activeFilters = (search ? 1 : 0) + channels.length;
  const hasFilter = activeFilters > 0;

  if (ordersLoading) return <KanbanSkeleton columnCount={6} cardsPerColumn={3} />;

  return (
    <Box>
      {/* Toolbar sạch kiểu zeno */}
      <Stack
        direction="row" alignItems="center" flexWrap="wrap"
        sx={{
          px: { xs: 2, md: 3 }, py: 1.25,
          borderBottom: 1, borderColor: 'divider',
          bgcolor: 'background.paper',
          gap: '8px', rowGap: 1,
        }}
        className="board_toolbar"
      >
        <TextField
          size="small"
          sx={(theme) => ({
            width: 240, flexShrink: 0,
            '& .MuiInputBase-root': {
              height: 32, fontSize: 12, borderRadius: '8px', bgcolor: 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(145,158,171,0.24)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
            },
            '& .MuiInputBase-input': { py: 0, fontSize: 12 },
          })}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm mã đơn / SĐT / tên KH…"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:magnifer-linear" width={14} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Divider orientation="vertical" flexItem sx={{ mx: '4px' }} />

        {Object.entries(CHANNEL_META).map(([v, m]) => {
          const active = channels.includes(v);
          return (
            <Box
              key={v}
              onClick={() => toggleChannel(v)}
              sx={{
                display: 'inline-flex', alignItems: 'center',
                gap: '5px',
                height: 30, px: '10px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: active ? m.color : 'rgba(145,158,171,0.24)',
                bgcolor: active ? `${m.color}14` : 'background.paper',
                color: active ? m.color : 'text.secondary',
                fontSize: 11.5, fontWeight: 700,
                cursor: 'pointer', userSelect: 'none',
                letterSpacing: '0.02em',
                transition: 'all .15s',
                '&:hover': { borderColor: m.color, color: m.color, bgcolor: `${m.color}0D` },
              }}
            >
              <Iconify icon={m.icon} width={12} />
              {m.label}
            </Box>
          );
        })}

        <Box sx={{ flex: 1 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
          {filtered.length}/{orders.length} đơn
          {activeFilters > 0 && ` · ${activeFilters} filter`}
        </Typography>
      </Stack>

      {/* Board — flush edges */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <AdminKanbanBoard sx={{ px: { xs: 1, md: 1.5 }, pt: 1.5 }}>
          {COLUMNS.map((col) => (
            <OrderKanbanColumn
              key={col.id}
              column={col}
              orders={byColumn[col.id]}
              totalCount={totalByColumn[col.id]}
              hasFilter={hasFilter}
            />
          ))}
        </AdminKanbanBoard>
      </DndContext>
    </Box>
  );
}
