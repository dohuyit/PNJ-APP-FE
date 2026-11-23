// src/views/admin/order/order-detail-pipeline-view.jsx — pipeline + chat timeline

'use client';

import { useMemo, useState } from 'react';

// animation primitives re-exported from _shared/motion
import {
  Avatar, Box, Button, Chip, Divider, Grid, IconButton, Stack, TextField, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtDateTime, fmtRelative } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetOrderList } from 'src/actions/admin/order';
import { m, AnimatePresence, fadeIn, slideUp, staggerContainer, hoverLift, useCountUp } from 'src/views/admin/_shared/motion';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { DetailSkeleton } from 'src/components/common/skeletons';

// Stubs — API chưa có hook; giữ literal để view không crash.
const ordersDetail = {};

const STAGES = [
  { id: 'pending',    label: 'Chờ xác nhận', icon: 'solar:clock-circle-bold',      color: '#F59E0B' },
  { id: 'confirmed',  label: 'Đã xác nhận',  icon: 'solar:check-circle-bold',      color: '#3B82F6' },
  { id: 'processing', label: 'Đang chuẩn bị', icon: 'solar:box-bold',               color: '#8B5CF6' },
  { id: 'shipping',   label: 'Đang giao',    icon: 'solar:delivery-bold',           color: '#06B6D4' },
  { id: 'delivered',  label: 'Đã giao',       icon: 'solar:verified-check-bold',    color: '#10B981' },
  { id: 'completed',  label: 'Hoàn tất',     icon: 'solar:cup-star-bold',           color: '#059669' },
];

// ========== Horizontal stepper với progress animate ==========

function PipelineStepper({ currentStatus }) {
  const currentIdx = STAGES.findIndex((s) => s.id === currentStatus);
  const percent = Math.max(0, (currentIdx / (STAGES.length - 1)) * 100);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 2.5,
        mx: { xs: 2, md: 3 }, mt: 2,
        p: { xs: 2, md: 2.5 },
        position: 'relative',
        boxShadow: '0 1px 2px rgba(145, 158, 171, 0.08)',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Base track */}
        <Box
          sx={{
            position: 'absolute', top: 18, left: 20, right: 20,
            height: 4, borderRadius: 2,
            bgcolor: 'grey.200',
          }}
        />
        {/* Progress fill — animate width */}
        <m.div
          initial={{ width: '0%' }}
          animate={{ width: `calc(${percent}% - ${percent === 100 ? 20 : percent === 0 ? 0 : 0}px)` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 18, left: 20,
            height: 4, borderRadius: 2,
            background: `linear-gradient(90deg, ${STAGES[0].color}, ${STAGES[Math.min(currentIdx, STAGES.length - 1)].color})`,
            zIndex: 1,
          }}
        />

        {/* Stages */}
        <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative' }}>
          {STAGES.map((s, i) => {
            const isDone    = i <= currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <m.div
                key={s.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 220, damping: 15 }}
              >
                <Stack alignItems="center" sx={{ flex: 1, position: 'relative', zIndex: 2 }}>
                  <Box
                    sx={{
                      width: 40, height: 40, borderRadius: '50%',
                      display: 'grid', placeItems: 'center',
                      bgcolor: isDone ? s.color : 'background.paper',
                      color: isDone ? 'common.white' : 'text.disabled',
                      border: `3px solid ${isDone ? s.color : '#E5E7EB'}`,
                      boxShadow: isCurrent ? `0 0 0 6px ${s.color}22, 0 0 20px ${s.color}44` : 'none',
                      animation: isCurrent ? 'stepperPulse 1.8s ease-in-out infinite' : 'none',
                      '@keyframes stepperPulse': {
                        '0%,100%': { boxShadow: `0 0 0 6px ${s.color}22, 0 0 0 0 ${s.color}66` },
                        '50%':     { boxShadow: `0 0 0 10px ${s.color}00, 0 0 20px ${s.color}66` },
                      },
                    }}
                  >
                    <Iconify icon={s.icon} width={18} />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1, fontSize: 10.5,
                      fontWeight: isCurrent ? 800 : 600,
                      color: isDone ? s.color : 'text.disabled',
                      textAlign: 'center',
                    }}
                  >
                    {s.label}
                  </Typography>
                </Stack>
              </m.div>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}

// ========== Item card ==========

function ItemCard({ item }) {
  return (
    <m.div variants={fadeIn} {...hoverLift}>
      <Stack
        direction="row" spacing={2} alignItems="flex-start"
        sx={{
          p: 1.75, borderRadius: 2,
          border: 1, borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Avatar src={item.image} variant="rounded" sx={{ width: 68, height: 68, bgcolor: 'grey.100' }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13 }} noWrap>{item.name}</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Chip label={`Size ${item.size}`} size="small" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: 11 }}>
              {item.sku}
            </Typography>
          </Stack>
          {item.gifts?.length > 0 && (
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
              <Iconify icon="solar:gift-bold" width={12} sx={{ color: 'error.main' }} />
              <Typography variant="caption" sx={{ fontSize: 10.5, color: 'error.main', fontWeight: 600 }}>
                Kèm: {item.gifts.map((g) => g.name).join(', ')}
              </Typography>
            </Stack>
          )}
        </Box>
        <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10.5 }}>
            SL {item.qty} · {fmtVND(item.unit_price)}
          </Typography>
          <Typography sx={{ fontWeight: 800, color: 'warning.dark', fontSize: 15 }}>
            {fmtVND(item.line_total)}
          </Typography>
        </Stack>
      </Stack>
    </m.div>
  );
}

// ========== Chat Timeline ==========

function ChatBubble({ event }) {
  const isAdmin  = event.by_admin;
  const isSystem = !event.by_admin && !event.by === 'customer';

  return (
    <m.div variants={fadeIn}>
      <Stack direction="row" spacing={1.25} sx={{ mb: 1.5 }} alignItems="flex-start">
        <Avatar sx={{
          width: 28, height: 28, fontSize: 11, flexShrink: 0,
          bgcolor: isAdmin ? 'primary.main' : isSystem ? 'grey.400' : 'warning.main',
        }}>
          {isAdmin ? event.by_admin[0] : isSystem ? 'S' : 'KH'}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11 }}>
              {isAdmin ? event.by_admin : isSystem ? 'System' : 'Khách hàng'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10 }}>
              · {fmtRelative(event.at)}
            </Typography>
          </Stack>
          <Box
            sx={{
              display: 'inline-block',
              bgcolor: isAdmin ? 'primary.lighter' : isSystem ? 'grey.100' : 'warning.lighter',
              color:    isAdmin ? 'primary.darker' : isSystem ? 'text.secondary' : 'warning.darker',
              px: 1.5, py: 1, borderRadius: 2, borderTopLeftRadius: 0,
              maxWidth: '100%',
            }}
          >
            <Typography variant="body2" sx={{ fontSize: 12.5 }}>
              {event.from ? (
                <>Chuyển <b>{event.from}</b> → <b>{event.to}</b></>
              ) : (
                <>Tạo đơn — trạng thái <b>{event.to}</b></>
              )}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </m.div>
  );
}

// ========== Main ==========

export function OrderDetailPipelineView({ id }) {
  const { searchResults: ordersList, searchLoading: ordersLoading } = useGetOrderList();
  if (ordersLoading) return <DashboardContent disablePadding><DetailSkeleton tabCount={6} leftSections={4} rightSections={3} /></DashboardContent>;
  const o = ordersList.find((x) => x.id === id) ?? ordersDetail;
  // Fill missing fields from mockDetail
  const order = { ...ordersDetail, ...o };
  const [message, setMessage] = useState('');

  const grandTotal = useCountUp(order.amounts?.grand_total ?? 0, { duration: 1400 });

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>{order.order_no}</Typography>
          </Stack>
        }
        subtitle={`Đặt lúc ${fmtDateTime(order.created_at)} · Kênh ${order.channel}`}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Đơn hàng', href: adminPaths.order.root },
          { label: order.order_no },
        ]}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<Iconify icon="solar:printer-linear" width={14} />}>In phiếu</Button>
            <Button variant="outlined" startIcon={<Iconify icon="solar:document-linear" width={14} />}>Hoá đơn PDF</Button>
            <Button variant="contained" color="warning" startIcon={<Iconify icon="solar:refresh-circle-bold" width={14} />}>Chuyển trạng thái</Button>
          </Stack>
        }
      />

      {/* Horizontal stepper pipeline */}
      <PipelineStepper currentStatus={order.status} />

      {/* Body grid: Left items+payment / Right chat timeline + buyer */}
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <m.div variants={staggerContainer(0.08, 0.1)} initial="hidden" animate="show">
          <Grid container spacing={2}>
            {/* LEFT */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={2}>
                {/* Items */}
                <m.div variants={slideUp}>
                  <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2.5, p: 2.5 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon="solar:bag-bold" width={18} sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 14 }}>
                          Sản phẩm ({order.items?.length ?? 0})
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack spacing={1.5}>
                      {(order.items ?? []).map((it, i) => <ItemCard key={i} item={it} />)}
                    </Stack>
                  </Box>
                </m.div>

                {/* Payment summary */}
                <m.div variants={slideUp}>
                  <Box
                    sx={{
                      bgcolor: 'background.paper', border: 1, borderColor: 'divider',
                      borderRadius: 2.5, p: 2.5, position: 'relative', overflow: 'hidden',
                    }}
                  >
                    <Box sx={{
                      position: 'absolute', right: -50, top: -50, width: 180, height: 180, borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)', pointerEvents: 'none',
                    }} />
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Iconify icon="solar:dollar-bold" width={18} sx={{ color: 'warning.dark' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 14 }}>Thanh toán</Typography>
                      <Chip
                        label={order.payment?.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                        size="small"
                        color={order.payment?.status === 'paid' ? 'success' : 'warning'}
                        sx={{ height: 20, fontWeight: 700 }}
                      />
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 7 }}>
                        <Stack spacing={1}>
                          {[
                            { label: 'Tạm tính',         value: order.amounts?.subtotal },
                            { label: 'Giảm giá',          value: -(order.amounts?.discount ?? 0),  color: 'success.main' },
                            { label: 'Phí ship',          value: order.amounts?.shipping_fee ?? 0 },
                          ].map((r) => (
                            <Stack key={r.label} direction="row" justifyContent="space-between">
                              <Typography variant="caption" color="text.secondary">{r.label}</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: r.color }}>
                                {fmtVND(r.value)}
                              </Typography>
                            </Stack>
                          ))}
                          <Divider sx={{ my: 1 }} />
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Tổng cộng</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: 20, color: 'warning.dark', fontVariantNumeric: 'tabular-nums' }}>
                              {fmtVND(grandTotal)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 5 }}>
                        <Box sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'divider', borderRadius: 1.5, p: 1.5 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 0.4, fontSize: 10.5, display: 'block' }}>
                            PTTT
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                            <Iconify icon="solar:card-bold" width={16} sx={{ color: 'primary.main' }} />
                            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                              {{ cod: 'COD', vnpay: 'VNPay', momo: 'MoMo', zalopay: 'ZaloPay', card_intl: 'Thẻ QT' }[order.payment?.method_code] ?? order.payment?.method_code}
                            </Typography>
                          </Stack>
                          {order.payment?.paid_at && (
                            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10.5, mt: 0.5, display: 'block' }}>
                              Thanh toán {fmtRelative(order.payment.paid_at)}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </m.div>
              </Stack>
            </Grid>

            {/* RIGHT */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                {/* Buyer card */}
                <m.div variants={slideUp}>
                  <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2.5, p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                      <Iconify icon="solar:user-bold" width={16} sx={{ color: 'primary.main' }} />
                      <Typography variant="subtitle2" sx={{ fontSize: 12.5, fontWeight: 700 }}>Khách hàng</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'grey.200' }}>{order.buyer?.full_name?.[0]}</Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 12.5 }}>{order.buyer?.full_name}</Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: 11 }}>
                          {order.buyer?.phone}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" sx={{ bgcolor: 'rgba(16,185,129,0.1)', color: 'success.main', width: 28, height: 28 }}>
                          <Iconify icon="solar:phone-bold" width={12} />
                        </IconButton>
                        <IconButton size="small" sx={{ bgcolor: 'rgba(59,130,246,0.1)', color: 'primary.main', width: 28, height: 28 }}>
                          <Iconify icon="solar:chat-line-bold" width={12} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                </m.div>

                {/* Fulfillment */}
                <m.div variants={slideUp}>
                  <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2.5, p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                      <Iconify icon={order.fulfillment?.method === 'delivery' ? 'solar:delivery-bold' : 'solar:shop-bold'} width={16} sx={{ color: 'info.main' }} />
                      <Typography variant="subtitle2" sx={{ fontSize: 12.5, fontWeight: 700 }}>
                        {order.fulfillment?.method === 'delivery' ? 'Giao hàng' : 'Nhận tại cửa hàng'}
                      </Typography>
                      {order.fulfillment?.express_3h && (
                        <Chip label="3H" size="small" sx={{ height: 18, fontSize: 10, bgcolor: '#10B981', color: 'white', fontWeight: 700 }} />
                      )}
                    </Stack>
                    {order.fulfillment?.shipping_address && (
                      <>
                        <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>{order.fulfillment.shipping_address.full_name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
                          {order.fulfillment.shipping_address.street}, {order.fulfillment.shipping_address.ward_name}, {order.fulfillment.shipping_address.province_name}
                        </Typography>
                      </>
                    )}
                    {order.fulfillment?.pickup_store_snapshot && (
                      <Typography variant="body2">{order.fulfillment.pickup_store_snapshot.name}</Typography>
                    )}
                  </Box>
                </m.div>

                {/* Chat timeline */}
                <m.div variants={slideUp}>
                  <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2.5, p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                      <Iconify icon="solar:chat-round-dots-bold" width={16} sx={{ color: 'warning.main' }} />
                      <Typography variant="subtitle2" sx={{ fontSize: 12.5, fontWeight: 700 }}>Lịch sử trạng thái</Typography>
                      <Chip label={order.status_history?.length ?? 0} size="small" sx={{ height: 18, fontSize: 10 }} />
                    </Stack>
                    <m.div variants={staggerContainer(0.05)} initial="hidden" animate="show">
                      {(order.status_history ?? []).map((ev, i) => <ChatBubble key={i} event={ev} />)}
                    </m.div>

                    {/* Comment input */}
                    <Divider sx={{ my: 1.5 }} />
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <TextField
                        size="small" fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ghi chú nội bộ…"
                        InputProps={{ sx: { fontSize: 12.5 } }}
                      />
                      <IconButton size="small" sx={{ bgcolor: 'primary.main', color: 'common.white', '&:hover': { bgcolor: 'primary.dark' } }}>
                        <Iconify icon="solar:plain-bold" width={14} />
                      </IconButton>
                    </Stack>
                  </Box>
                </m.div>
              </Stack>
            </Grid>
          </Grid>
        </m.div>
      </Box>
    </DashboardContent>
  );
}
