'use client';

import {
  Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Divider, Grid,
  IconButton, List, ListItem, ListItemText, Stack, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtDateTime } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetOrderList } from 'src/actions/admin/order';
import {
  ORDER_STATUS_COLOR, ORDER_STATUS_LABEL, ORDER_TRANSITIONS,
  PAYMENT_STATUS_COLOR, PAYMENT_STATUS_LABEL,
} from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { PageHeader } from 'src/components/common/page-header';
import { StatusBadge } from 'src/components/common/status-badge';
import { DetailSkeleton } from 'src/components/common/skeletons';
import { AuditTimeline } from 'src/components/common/audit-timeline';

// Stubs — API chưa có hook; giữ literal để view không crash.
// Fallback shape cho khi API detail chưa có hook — tránh crash ở các `o.X ?? ordersDetail.X`.
const ordersDetail = {
  items: [],
  promotions_applied: [],
  status_history: [],
  fulfillment: { method: '', shipping_address: null, express_3h: false },
  ecard: { enabled: false, recipient_phone: '', message: '' },
};

export function OrderDetailView({ id }) {
  const { searchResults: ordersList, searchLoading: ordersLoading } = useGetOrderList();
  if (ordersLoading) return <DashboardContent disablePadding><DetailSkeleton tabCount={5} leftSections={4} rightSections={3} /></DashboardContent>;
  const o = ordersList.find((x) => x.id === id) ?? ordersDetail;
  const transitions = ORDER_TRANSITIONS[o.status] ?? [];

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={<Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="h4">{o.order_no}</Typography>
          <StatusBadge status={o.status} colorMap={ORDER_STATUS_COLOR} labelMap={ORDER_STATUS_LABEL} size="medium" />
        </Stack>}
        subtitle={`Đặt lúc ${fmtDateTime(o.created_at)} · Kênh ${o.channel}`}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Đơn hàng', href: adminPaths.order.root },
          { label: o.order_no },
        ]}
        actions={
          <>
            <Button variant="outlined" startIcon={<Iconify icon="solar:printer-linear" width={16} />}>In phiếu</Button>
            <Button variant="outlined" startIcon={<Iconify icon="solar:document-text-linear" width={16} />}>Xuất hoá đơn điện tử</Button>
            <Button variant="outlined" color="error" startIcon={<Iconify icon="solar:refresh-linear" width={16} />}>Tạo yêu cầu thu đổi</Button>
          </>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Sản phẩm" />
              <CardContent sx={{ pt: 0 }}>
                <List disablePadding>
                  {(o.items ?? ordersDetail.items).map((it, i) => (
                    <ListItem
                      key={i}
                      disableGutters
                      sx={{ py: 2, borderBottom: i === (o.items ?? ordersDetail.items).length - 1 ? 0 : 1, borderColor: 'grey.200' }}
                    >
                      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                        <Avatar src={it.image} variant="rounded" sx={{ width: 64, height: 64, bgcolor: 'grey.100' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2">{it.name}</Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                            <Label>{`Size ${it.size}`}</Label>
                            <Label>{it.sku}</Label>
                          </Stack>
                          {(it.gifts ?? []).map((g, j) => (
                            <Stack key={j} direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                              <Iconify icon="solar:gift-linear" width={12} sx={{ color: 'warning.main' }} />
                              <Typography variant="caption" color="warning.dark">Tặng kèm: {g.name}</Typography>
                            </Stack>
                          ))}
                        </Box>
                        <Stack alignItems="flex-end">
                          <Typography variant="body2">{it.qty} × {fmtVND(it.unit_price)}</Typography>
                          <Typography variant="subtitle1" color="primary.main">{fmtVND(it.line_total)}</Typography>
                        </Stack>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Tạm tính</Typography>
                    <Typography variant="body2">{fmtVND(o.amounts.subtotal)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Giảm giá</Typography>
                    <Typography variant="body2" color="error.main">- {fmtVND(o.amounts.discount)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Phí ship</Typography>
                    <Typography variant="body2">{fmtVND(o.amounts.shipping_fee)}</Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Tổng cộng (đã gồm VAT)</Typography>
                    <Typography variant="h5" color="primary.main">{fmtVND(o.amounts.grand_total)}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Khuyến mãi áp dụng" />
              <CardContent sx={{ pt: 0 }}>
                {(o.promotions_applied ?? ordersDetail.promotions_applied).map((pr, i) => (
                  <Stack key={i} direction="row" justifyContent="space-between" sx={{ py: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Iconify icon="solar:sale-linear" width={16} sx={{ color: 'warning.main' }} />
                      <Typography variant="body2">{pr.name}</Typography>
                      <Label>{pr.type}</Label>
                    </Stack>
                    <Typography variant="body2" color="success.main">- {fmtVND(pr.discount_amount)}</Typography>
                  </Stack>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Lịch sử trạng thái" />
              <CardContent sx={{ pt: 0 }}>
                <AuditTimeline
                  entries={(o.status_history ?? ordersDetail.status_history).map((h) => ({
                    action: 'transition',
                    summary: `${h.from ?? 'Mới'} → ${ORDER_STATUS_LABEL[h.to]}`,
                    actor: h.by_admin ?? h.by,
                    at: h.at,
                  }))}
                />
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Hành động" titleTypographyProps={{ variant: 'subtitle1' }} />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={1}>
                  {transitions.map((next) => (
                    <Button
                      key={next}
                      variant={next === 'cancelled' || next === 'returned' ? 'outlined' : 'contained'}
                      color={next === 'cancelled' || next === 'returned' ? 'error' : 'primary'}
                      fullWidth
                      startIcon={<Iconify icon="solar:arrow-right-linear" width={16} />}
                    >
                      Chuyển sang: {ORDER_STATUS_LABEL[next]}
                    </Button>
                  ))}
                  {transitions.length === 0 && (
                    <Typography variant="caption" color="text.secondary">Không có chuyển trạng thái nào hợp lệ.</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Khách hàng" titleTypographyProps={{ variant: 'subtitle1' }} />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">{o.buyer.full_name}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Iconify icon="solar:phone-linear" width={14} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{o.buyer.phone}</Typography>
                  </Stack>
                  {o.buyer.email && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Iconify icon="solar:letter-linear" width={14} />
                      <Typography variant="body2">{o.buyer.email}</Typography>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Giao / Nhận" titleTypographyProps={{ variant: 'subtitle1' }} />
              <CardContent sx={{ pt: 0 }}>
                {(o.fulfillment?.method === 'delivery' || ordersDetail.fulfillment.method === 'delivery') && (
                  <Stack spacing={1}>
                    <Chip icon={<Iconify icon="solar:delivery-linear" width={14} />} label="Giao hàng" size="small" color="info" />
                    {ordersDetail.fulfillment.shipping_address && (
                      <Typography variant="body2">
                        {ordersDetail.fulfillment.shipping_address.street},<br />
                        {ordersDetail.fulfillment.shipping_address.ward_name},<br />
                        {ordersDetail.fulfillment.shipping_address.province_name}
                      </Typography>
                    )}
                    {ordersDetail.fulfillment.express_3h && <Label color="success">Giao 3H</Label>}
                  </Stack>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Thiệp điện tử"
                titleTypographyProps={{ variant: 'subtitle1' }}
                action={<IconButton><Iconify icon="solar:eye-linear" width={16} /></IconButton>}
              />
              <CardContent sx={{ pt: 0 }}>
                {(o.ecard?.enabled || ordersDetail.ecard.enabled) ? (
                  <Stack spacing={1}>
                    <Label color="success" variant="filled">Đã bật</Label>
                    <Typography variant="body2">Người nhận: {o.ecard?.recipient_phone ?? ordersDetail.ecard.recipient_phone}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      "{o.ecard?.message ?? ordersDetail.ecard.message}"
                    </Typography>
                    <Button size="small" startIcon={<Iconify icon="solar:refresh-linear" width={14} />}>Gửi lại SMS</Button>
                  </Stack>
                ) : <Typography variant="body2" color="text.secondary">Không có thiệp</Typography>}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
