// src/views/admin/order/order-detail-drawer.jsx
// Xem chi tiết đơn hàng — tabs: Tổng quan · Sản phẩm · Thanh toán · Vận chuyển · Lịch sử

'use client';

import {
  Avatar, Box, Button, Chip, Grid, Stack, Typography,
} from '@mui/material';

import { fmtVND, fmtNumber, fmtDateTime, fmtRelative } from 'src/utils/format';

import { DetailDrawer, DetailSection, DetailRow } from 'src/views/admin/_shared/detail-drawer';

import { Iconify } from 'src/components/iconify';

const STATUS_META = {
  pending:          { label: 'Chờ xác nhận',  color: '#D97706', soft: '#FFFBEB', icon: 'solar:clock-circle-linear' },
  confirmed:        { label: 'Đã xác nhận',   color: '#2563EB', soft: '#EFF6FF', icon: 'solar:check-circle-linear' },
  processing:       { label: 'Đang chuẩn bị', color: '#7C3AED', soft: '#F5F3FF', icon: 'solar:box-linear' },
  ready_for_pickup: { label: 'Sẵn sàng giao', color: '#0891B2', soft: '#ECFEFF', icon: 'solar:bell-bing-linear' },
  shipping:         { label: 'Đang giao',      color: '#059669', soft: '#ECFDF5', icon: 'solar:delivery-linear' },
  delivered:        { label: 'Đã giao',        color: '#059669', soft: '#ECFDF5', icon: 'solar:check-read-linear' },
  completed:        { label: 'Hoàn tất',       color: '#059669', soft: '#ECFDF5', icon: 'solar:check-circle-linear' },
  cancelled:        { label: 'Đã huỷ',         color: '#DC2626', soft: '#FEF2F2', icon: 'solar:close-circle-linear' },
  returned:         { label: 'Hoàn trả',       color: '#64748B', soft: '#F8FAFC', icon: 'solar:refresh-linear' },
};

const PAYMENT_STATUS_META = {
  pending: { label: 'Chờ thanh toán', color: '#D97706', soft: '#FFFBEB' },
  paid:    { label: 'Đã thanh toán',   color: '#059669', soft: '#ECFDF5' },
  failed:  { label: 'Thất bại',        color: '#DC2626', soft: '#FEF2F2' },
};

const PAYMENT_METHOD_LABEL = {
  cod: 'COD — Thanh toán khi nhận', vnpay: 'VNPay', momo: 'MoMo', zalopay: 'ZaloPay',
  card_intl: 'Thẻ quốc tế', installment_0: 'Trả góp 0%',
};

const CHANNEL_META = {
  web:         { label: 'Website',    icon: 'solar:global-linear' },
  app:         { label: 'Ứng dụng',   icon: 'solar:smartphone-linear' },
  store_order: { label: 'Tại cửa hàng', icon: 'solar:shop-linear' },
  hotline:     { label: 'Tổng đài',    icon: 'solar:phone-linear' },
};

// ---------------------- TAB: Tổng quan ----------------------
function OverviewTab({ order }) {
  const ch = CHANNEL_META[order.channel] ?? { label: order.channel, icon: 'solar:tag-linear' };
  const status = STATUS_META[order.status] ?? { label: order.status, color: '#64748B', soft: '#F8FAFC' };
  const payment = PAYMENT_STATUS_META[order.payment?.status] ?? { label: order.payment?.status, color: '#64748B', soft: '#F8FAFC' };

  return (
    <Box>
      {/* Hero: mã đơn + trạng thái */}
      <Box sx={{ px: 2.5, py: 2, bgcolor: 'grey.50' }}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box sx={{
            width: 42, height: 42, borderRadius: 1,
            bgcolor: status.soft, color: status.color,
            display: 'grid', placeItems: 'center',
          }}>
            <Iconify icon={status.icon} width={20} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary', fontFamily: 'monospace', letterSpacing: 0.3 }}>
              {order.order_no}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }} flexWrap="wrap" rowGap={0.25}>
              <Chip
                label={status.label}
                size="small"
                sx={{
                  height: 20, fontSize: 10.5, fontWeight: 500,
                  bgcolor: status.soft, color: status.color,
                  border: 1, borderColor: status.color + '33',
                }}
              />
              <Chip
                icon={<Iconify icon={ch.icon} width={11} />}
                label={ch.label}
                size="small"
                sx={{
                  height: 20, fontSize: 10.5, fontWeight: 500,
                  bgcolor: 'background.paper', color: 'text.secondary',
                  border: 1, borderColor: 'divider',
                  '& .MuiChip-icon': { color: 'inherit', ml: 0.5 },
                }}
              />
              <Chip
                label={payment.label}
                size="small"
                sx={{
                  height: 20, fontSize: 10.5, fontWeight: 500,
                  bgcolor: payment.soft, color: payment.color,
                  border: 1, borderColor: payment.color + '33',
                }}
              />
            </Stack>
          </Box>
        </Stack>

        {/* Số liệu gọn */}
        <Grid container spacing={1} sx={{ mt: 1.5 }}>
          <Grid size={6}>
            <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1, px: 1.5, py: 1 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 600, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
                Tổng tiền
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'success.darker', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
                {fmtVND(order.amounts?.grand_total ?? 0)}
              </Typography>
            </Box>
          </Grid>
          <Grid size={6}>
            <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1, px: 1.5, py: 1 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 600, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
                Số sản phẩm
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
                {fmtNumber(order.item_count ?? 0)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Khách hàng */}
      <DetailSection title="Khách hàng">
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'grey.200', fontSize: 13, fontWeight: 600 }}>
            {order.buyer?.full_name?.[0] ?? '?'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>
              {order.buyer?.full_name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'monospace' }}>
              {order.buyer?.phone}
            </Typography>
          </Box>
        </Stack>
        {order.buyer?.email && (
          <DetailRow icon="solar:letter-linear" label="Email" value={order.buyer.email} />
        )}
      </DetailSection>

      <DetailSection title="Thời gian" sx={{ borderBottom: 0 }}>
        <DetailRow icon="solar:calendar-add-linear" label="Ngày đặt" value={fmtDateTime(order.created_at)} />
        <DetailRow icon="solar:clock-circle-linear" label="Đã tạo" value={fmtRelative(order.created_at)} />
        {order.payment?.paid_at && (
          <DetailRow icon="solar:dollar-linear" label="Thanh toán" value={fmtDateTime(order.payment.paid_at)} />
        )}
      </DetailSection>
    </Box>
  );
}

// ---------------------- TAB: Sản phẩm ----------------------
function ItemsTab({ order }) {
  const items = order.items ?? [];

  if (items.length === 0) {
    return (
      <Stack alignItems="center" spacing={1} sx={{ py: 6, color: 'text.disabled' }}>
        <Iconify icon="solar:box-minimalistic-linear" width={32} />
        <Typography sx={{ fontSize: 12 }}>Chưa có dữ liệu chi tiết sản phẩm</Typography>
      </Stack>
    );
  }

  return (
    <Box>
      <DetailSection title={`${items.length} mặt hàng`}>
        <Stack spacing={1}>
          {items.map((item, i) => (
            <Box
              key={`${item.sku}-${i}`}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.25 }}
            >
              <Stack direction="row" spacing={1.25}>
                <Avatar
                  src={item.image}
                  variant="rounded"
                  sx={{ width: 56, height: 56, bgcolor: 'grey.100', border: 1, borderColor: 'divider' }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontSize: 10.5, color: 'text.disabled', fontFamily: 'monospace', mt: 0.25 }}>
                    {item.sku}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }} flexWrap="wrap" rowGap={0.25}>
                    {item.size && (
                      <Chip
                        label={`Size ${item.size}`}
                        size="small"
                        sx={{ height: 18, fontSize: 10, bgcolor: 'grey.100', color: 'text.secondary' }}
                      />
                    )}
                    <Chip
                      label={`SL: ${item.qty}`}
                      size="small"
                      sx={{ height: 18, fontSize: 10, fontWeight: 600, bgcolor: 'grey.100', color: 'text.primary' }}
                    />
                  </Stack>
                </Box>
                <Stack alignItems="flex-end">
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'success.darker', fontVariantNumeric: 'tabular-nums' }}>
                    {fmtVND(item.line_total ?? (item.unit_price * item.qty))}
                  </Typography>
                  {item.discount > 0 && (
                    <Typography sx={{ fontSize: 10.5, color: 'error.main', fontVariantNumeric: 'tabular-nums' }}>
                      -{fmtVND(item.discount)}
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: 10.5, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>
                    {fmtVND(item.unit_price)} / cái
                  </Typography>
                </Stack>
              </Stack>

              {/* Gifts */}
              {item.gifts?.length > 0 && (
                <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                    <Iconify icon="solar:gift-linear" width={12} sx={{ color: '#7C3AED' }} />
                    <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: 'text.secondary', letterSpacing: 0.3, textTransform: 'uppercase' }}>
                      Quà tặng kèm
                    </Typography>
                  </Stack>
                  {item.gifts.map((g, gi) => (
                    <Typography key={gi} sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                      · {g.name} <Typography component="span" sx={{ fontSize: 11, color: 'text.disabled' }}>({fmtVND(g.value)})</Typography>
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      </DetailSection>
    </Box>
  );
}

// ---------------------- TAB: Thanh toán ----------------------
function PaymentTab({ order }) {
  const paymentMeta = PAYMENT_STATUS_META[order.payment?.status] ?? { label: order.payment?.status, color: '#64748B', soft: '#F8FAFC' };
  const amounts = order.amounts ?? {};

  return (
    <Box>
      <DetailSection title="Phương thức">
        <DetailRow icon="solar:card-linear" label="Kênh thanh toán" value={PAYMENT_METHOD_LABEL[order.payment?.method_code] ?? order.payment?.method_code} />
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ py: 0.75 }}>
          <Iconify icon="solar:check-circle-linear" width={13} sx={{ color: 'text.disabled', flexShrink: 0 }} />
          <Typography sx={{ fontSize: 11.5, color: 'text.secondary', minWidth: 120 }}>
            Trạng thái
          </Typography>
          <Box sx={{ flex: 1, textAlign: 'right' }}>
            <Chip
              label={paymentMeta.label}
              size="small"
              sx={{
                height: 20, fontSize: 10.5, fontWeight: 600,
                bgcolor: paymentMeta.soft, color: paymentMeta.color,
                border: 1, borderColor: paymentMeta.color + '33',
              }}
            />
          </Box>
        </Stack>
        {order.payment?.paid_at && (
          <DetailRow icon="solar:clock-circle-linear" label="Thời điểm thanh toán" value={fmtDateTime(order.payment.paid_at)} />
        )}
        {order.payment?.paid_amount && (
          <DetailRow icon="solar:dollar-linear" label="Số tiền đã thu" value={fmtVND(order.payment.paid_amount)} mono />
        )}
      </DetailSection>

      {/* Breakdown */}
      <DetailSection title="Chi tiết giá">
        <Stack spacing={0.5}>
          <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Tạm tính</Typography>
            <Typography sx={{ fontSize: 12.5, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
              {fmtVND(amounts.subtotal ?? 0)}
            </Typography>
          </Stack>
          {(amounts.discount ?? 0) > 0 && (
            <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Giảm giá</Typography>
              <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: 'error.main', fontVariantNumeric: 'tabular-nums' }}>
                -{fmtVND(amounts.discount)}
              </Typography>
            </Stack>
          )}
          <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Phí vận chuyển</Typography>
            <Typography sx={{ fontSize: 12.5, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
              {amounts.shipping_fee === 0 ? 'Miễn phí' : fmtVND(amounts.shipping_fee ?? 0)}
            </Typography>
          </Stack>
          <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 0.5, pt: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.primary' }}>Tổng cộng</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'success.darker', fontVariantNumeric: 'tabular-nums' }}>
                {fmtVND(amounts.grand_total ?? 0)}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </DetailSection>

      {/* Promotions */}
      {order.promotions_applied?.length > 0 && (
        <DetailSection title="Khuyến mãi đã áp dụng" sx={{ borderBottom: 0 }}>
          <Stack spacing={0.75}>
            {order.promotions_applied.map((p, i) => (
              <Stack
                key={i}
                direction="row" justifyContent="space-between" alignItems="center"
                sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'divider', borderRadius: 1, px: 1.25, py: 1 }}
              >
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Iconify icon="solar:tag-price-linear" width={14} sx={{ color: '#D97706' }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{p.name}</Typography>
                </Stack>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'error.main', fontVariantNumeric: 'tabular-nums' }}>
                  -{fmtVND(p.discount_amount)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </DetailSection>
      )}
    </Box>
  );
}

// ---------------------- TAB: Vận chuyển ----------------------
function FulfillmentTab({ order }) {
  const f = order.fulfillment ?? {};
  const addr = f.shipping_address;
  const pickup = f.pickup_store_snapshot;

  return (
    <Box>
      <DetailSection title="Hình thức">
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ py: 0.75 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: 0.75,
            bgcolor: f.method === 'delivery' ? '#EFF6FF' : '#FFFBEB',
            color: f.method === 'delivery' ? '#2563EB' : '#D97706',
            display: 'grid', placeItems: 'center',
          }}>
            <Iconify icon={f.method === 'delivery' ? 'solar:delivery-linear' : 'solar:shop-2-linear'} width={16} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>
              {f.method === 'delivery' ? 'Giao hàng tận nơi' : 'Nhận tại cửa hàng'}
            </Typography>
            {f.express_3h && (
              <Typography sx={{ fontSize: 11, color: 'success.darker', fontWeight: 500 }}>
                Giao nhanh 3H
              </Typography>
            )}
          </Box>
        </Stack>
        {f.carrier && (
          <DetailRow icon="solar:truck-linear" label="Đơn vị vận chuyển" value={f.carrier.toUpperCase()} />
        )}
        {f.shipping_fee != null && (
          <DetailRow icon="solar:dollar-linear" label="Phí giao" value={f.shipping_fee === 0 ? 'Miễn phí' : fmtVND(f.shipping_fee)} />
        )}
      </DetailSection>

      {/* Địa chỉ giao */}
      {addr && (
        <DetailSection title="Địa chỉ giao hàng">
          <Box sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
            <Stack direction="row" alignItems="flex-start" spacing={1}>
              <Iconify icon="solar:map-point-linear" width={15} sx={{ color: '#2563EB', mt: 0.25 }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>
                  {addr.full_name}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: 'text.secondary', fontFamily: 'monospace' }}>
                  {addr.phone}
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.5, mt: 0.5 }}>
                  {addr.street}, {addr.ward_name}, {addr.province_name}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </DetailSection>
      )}

      {/* Cửa hàng nhận */}
      {pickup && (
        <DetailSection title="Cửa hàng nhận">
          <Stack direction="row" spacing={1}>
            <Iconify icon="solar:shop-linear" width={15} sx={{ color: '#D97706', mt: 0.25 }} />
            <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>
              {pickup.name}
            </Typography>
          </Stack>
        </DetailSection>
      )}

      {/* E-card */}
      {order.ecard?.enabled && (
        <DetailSection title="Thiệp điện tử" sx={{ borderBottom: 0 }}>
          <DetailRow icon="solar:phone-linear" label="SĐT người nhận" value={order.ecard.recipient_phone} mono />
          <DetailRow icon="solar:letter-linear" label="Hình thức gửi" value={order.ecard.send_mode === 'scheduled' ? 'Hẹn giờ' : 'Gửi ngay'} />
          {order.ecard.scheduled_at && (
            <DetailRow icon="solar:clock-circle-linear" label="Thời điểm gửi" value={fmtDateTime(order.ecard.scheduled_at)} />
          )}
          {order.ecard.message && (
            <Box sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'divider', borderRadius: 1, p: 1.25, mt: 1 }}>
              <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase', mb: 0.5 }}>
                Lời nhắn
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.primary', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{order.ecard.message}"
              </Typography>
            </Box>
          )}
        </DetailSection>
      )}
    </Box>
  );
}

// ---------------------- TAB: Lịch sử ----------------------
function HistoryTab({ order }) {
  const history = order.status_history ?? [];

  if (history.length === 0) {
    return (
      <Stack alignItems="center" spacing={1} sx={{ py: 6, color: 'text.disabled' }}>
        <Iconify icon="solar:history-linear" width={32} />
        <Typography sx={{ fontSize: 12 }}>Chưa có lịch sử</Typography>
      </Stack>
    );
  }

  return (
    <DetailSection title={`${history.length} thay đổi`}>
      <Stack>
        {history.map((h, i) => {
          const meta = STATUS_META[h.to] ?? { color: '#64748B', soft: '#F8FAFC', icon: 'solar:dot-linear', label: h.to };
          const isLast = i === history.length - 1;
          return (
            <Stack key={i} direction="row" spacing={1.5}>
              <Box sx={{ width: 24, position: 'relative', flexShrink: 0, pt: 0.5 }}>
                <Box
                  sx={{
                    width: 24, height: 24, borderRadius: '50%',
                    bgcolor: meta.soft, color: meta.color,
                    display: 'grid', placeItems: 'center',
                    border: 1, borderColor: meta.color + '33',
                    position: 'relative', zIndex: 1,
                  }}
                >
                  <Iconify icon={meta.icon} width={12} />
                </Box>
                {!isLast && (
                  <Box
                    sx={{
                      position: 'absolute', left: 11, top: 28, bottom: -12,
                      width: 1, bgcolor: 'divider',
                    }}
                  />
                )}
              </Box>

              <Box sx={{ flex: 1, pb: 2 }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.primary' }}>
                      {meta.label}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.125 }}>
                      {h.from ? `Từ ${STATUS_META[h.from]?.label ?? h.from}` : 'Trạng thái đầu tiên'} · bởi {h.by_admin ?? h.by}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 10.5, color: 'text.disabled', whiteSpace: 'nowrap' }}>
                    {fmtRelative(h.at)}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </DetailSection>
  );
}

// ---------------------- Main ----------------------
export function OrderDetailDrawer({ open, onClose, order, onUpdateStatus }) {
  if (!order) return null;

  const status = STATUS_META[order.status] ?? STATUS_META.pending;

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      icon="solar:bag-5-linear"
      accent={status.color}
      title={order.order_no}
      subtitle={`${order.buyer?.full_name ?? '—'} · ${fmtDateTime(order.created_at)}`}
      headerActions={null}
      tabs={[
        { value: 'overview',    label: 'Tổng quan',  icon: 'solar:info-circle-linear', content: <OverviewTab order={order} /> },
        { value: 'items',       label: 'Sản phẩm',   icon: 'solar:box-linear', count: order.items?.length ?? order.item_count, content: <ItemsTab order={order} /> },
        { value: 'payment',     label: 'Thanh toán', icon: 'solar:card-linear', content: <PaymentTab order={order} /> },
        { value: 'fulfillment', label: 'Vận chuyển', icon: 'solar:delivery-linear', content: <FulfillmentTab order={order} /> },
        { value: 'history',     label: 'Lịch sử',    icon: 'solar:history-linear', count: order.status_history?.length, content: <HistoryTab order={order} /> },
      ]}
      footer={
        <>
          <Button
            onClick={onClose}
            color="inherit" variant="outlined" size="small"
            sx={{ boxShadow: 'none', borderColor: 'divider' }}
          >
            Đóng
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="outlined" size="small"
            startIcon={<Iconify icon="solar:printer-linear" width={13} />}
            sx={{ boxShadow: 'none', borderColor: 'divider' }}
          >
            In phiếu
          </Button>
          <Button
            variant="contained" size="small"
            startIcon={<Iconify icon="solar:refresh-circle-linear" width={13} />}
            onClick={() => onUpdateStatus?.(order)}
            sx={{
              boxShadow: 'none',
              bgcolor: '#1E293B', color: 'common.white',
              '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
            }}
          >
            Cập nhật trạng thái
          </Button>
        </>
      }
    />
  );
}
