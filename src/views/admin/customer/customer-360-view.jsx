// src/views/admin/customer/customer-360-view.jsx — Customer 360 flat redesign

'use client';

import { useMemo } from 'react';

import {
  Avatar, Box, Button, Chip, Grid, IconButton, LinearProgress, Stack, Tooltip, Typography,
} from '@mui/material';

import { fmtVND, fmtNumber, fmtDate, fmtRelative } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetOrderList } from 'src/actions/admin/order';
import { useGetCustomerList } from 'src/actions/admin/customer';

import { Iconify } from 'src/components/iconify';
import { DetailSkeleton } from 'src/components/common/skeletons';
import { mockLoyaltyTransactions, mockWishlists } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const customersDetail = {};
const loyaltyTransactionsList = mockLoyaltyTransactions;
const wishlistsList = mockWishlists;
// Pastel tier accents
const TIER_META = {
  silver:   { label: 'Silver',   accent: '#64748B', soft: '#F8FAFC', icon: 'solar:medal-ribbon-linear' },
  gold:     { label: 'Gold',     accent: '#D97706', soft: '#FFFBEB', icon: 'solar:medal-ribbons-star-linear' },
  platinum: { label: 'Platinum', accent: '#2563EB', soft: '#EFF6FF', icon: 'solar:crown-minimalistic-linear' },
  diamond:  { label: 'Diamond',  accent: '#7C3AED', soft: '#F5F3FF', icon: 'solar:crown-star-linear' },
};

// --- Panel: wrap flat, header soft ---
function Panel({ title, icon, iconColor, action, children, sx }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        height: '100%',
        ...sx,
      }}
    >
      {(title || action) && (
        <Stack
          direction="row" alignItems="center" spacing={1}
          sx={{ px: 2, py: 1.25, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}
        >
          {icon && (
            <Iconify icon={icon} width={14} sx={{ color: iconColor ?? 'text.secondary' }} />
          )}
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.primary', flex: 1, minWidth: 0 }}>
            {title}
          </Typography>
          {action}
        </Stack>
      )}
      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
}

// --- Profile strip: thay hero gradient bằng flat row ---
function ProfileStrip({ customer }) {
  const tier = TIER_META[customer.membership?.tier_code ?? 'silver'];
  const initials = customer.full_name.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase();

  return (
    <Box sx={{
      bgcolor: 'background.paper',
      border: 1, borderColor: 'divider',
      borderRadius: 1,
      p: 2.5,
    }}>
      <Grid container spacing={2.5} alignItems="center">
        <Grid size={{ xs: 12, md: 'auto' }}>
          <Avatar
            sx={{
              width: 72, height: 72,
              bgcolor: tier.soft, color: tier.accent,
              fontSize: 24, fontWeight: 600,
              border: 1, borderColor: tier.accent + '33',
            }}
          >
            {initials}
          </Avatar>
        </Grid>

        <Grid size={{ xs: 12, md: 'grow' }}>
          <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap" rowGap={0.5}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
              {customer.full_name}
            </Typography>
            <Chip
              icon={<Iconify icon={tier.icon} width={11} />}
              label={tier.label}
              size="small"
              sx={{
                height: 20, fontSize: 10.5, fontWeight: 600,
                bgcolor: tier.soft, color: tier.accent,
                border: 1, borderColor: tier.accent + '33',
                '& .MuiChip-icon': { color: 'inherit', ml: 0.5 },
              }}
            />
          </Stack>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
            {customer.phone}{customer.email ? ` · ${customer.email}` : ''}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.125 }}>
            Khách hàng từ {fmtDate(customer.created_at)} · nguồn {customer.source}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 'auto' }}>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Gọi điện">
              <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: 'grey.50', '&:hover': { bgcolor: 'grey.100' } }}>
                <Iconify icon="solar:phone-linear" width={14} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chat Zalo">
              <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: 'grey.50', '&:hover': { bgcolor: 'grey.100' } }}>
                <Iconify icon="solar:chat-line-linear" width={14} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Email">
              <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: 'grey.50', '&:hover': { bgcolor: 'grey.100' } }}>
                <Iconify icon="solar:letter-linear" width={14} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Thêm ghi chú">
              <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: 'grey.50', '&:hover': { bgcolor: 'grey.100' } }}>
                <Iconify icon="solar:notes-linear" width={14} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

// --- KPI card (bigger than regular, flat) ---
function KpiTile({ label, value, sub, icon, color }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 1,
        p: 2,
        height: '100%',
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography sx={{
          fontSize: 10.5, fontWeight: 600, color: 'text.disabled',
          letterSpacing: 0.4, textTransform: 'uppercase',
        }}>
          {label}
        </Typography>
        <Box sx={{
          width: 28, height: 28, borderRadius: 0.75,
          bgcolor: color + '14', color,
          display: 'grid', placeItems: 'center',
        }}>
          <Iconify icon={icon} width={14} />
        </Box>
      </Stack>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: 'text.primary', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.5 }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

// --- Timeline event: flat, no shadow ---
function TimelineEvent({ event, isLast }) {
  const meta = {
    order:   { icon: 'solar:bag-linear',          color: '#2563EB', soft: '#EFF6FF' },
    earn:    { icon: 'solar:add-circle-linear',   color: '#059669', soft: '#ECFDF5' },
    redeem:  { icon: 'solar:gift-linear',         color: '#7C3AED', soft: '#F5F3FF' },
    expire:  { icon: 'solar:clock-circle-linear', color: '#64748B', soft: '#F8FAFC' },
  }[event.kind] ?? { icon: 'solar:dot-linear', color: '#64748B', soft: '#F8FAFC' };

  return (
    <Stack direction="row" spacing={1.5}>
      <Box sx={{ width: 28, position: 'relative', flexShrink: 0 }}>
        <Box
          sx={{
            width: 28, height: 28, borderRadius: '50%',
            bgcolor: meta.soft, color: meta.color,
            display: 'grid', placeItems: 'center',
            border: 1, borderColor: meta.color + '33',
            position: 'relative', zIndex: 1,
          }}
        >
          <Iconify icon={meta.icon} width={13} />
        </Box>
        {!isLast && (
          <Box
            sx={{
              position: 'absolute', left: 13, top: 28, bottom: -16,
              width: 1, bgcolor: 'divider',
            }}
          />
        )}
      </Box>

      <Box sx={{ flex: 1, pb: 2 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.primary' }}>
              {event.title}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.125 }}>
              {event.subtitle}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 10.5, color: 'text.disabled', whiteSpace: 'nowrap' }}>
            {fmtRelative(event.at)}
          </Typography>
        </Stack>
        {event.amount && (
          <Chip
            label={event.amount}
            size="small"
            sx={{
              mt: 0.75, height: 20, fontSize: 10.5, fontWeight: 600,
              bgcolor: meta.soft, color: meta.color,
              border: 1, borderColor: meta.color + '33',
            }}
          />
        )}
      </Box>
    </Stack>
  );
}

// ========== Main ==========

export function Customer360View({ id }) {
  const { searchResults: customersList, searchLoading: customersLoading } = useGetCustomerList();
  const { searchResults: ordersList, searchLoading: ordersLoading } = useGetOrderList();
  if (customersLoading || ordersLoading) return <DashboardContent disablePadding><DetailSkeleton tabCount={6} leftSections={4} rightSections={3} /></DashboardContent>;
  const c = customersList.find((x) => x.id === id) ?? customersDetail;
  const addresses = customersDetail.addresses ?? [];

  const timeline = useMemo(() => {
    const lv = loyaltyTransactionsList.slice(0, 6).map((l) => ({
      id: `lt-${l.id}`, kind: l.type, title: l.reason,
      subtitle: `${l.points > 0 ? '+' : ''}${l.points} điểm · dư ${l.balance_after}`,
      amount: `${l.points > 0 ? '+' : ''}${l.points}`,
      at: l.created_at,
    }));
    const ov = ordersList.slice(0, 4).map((o) => ({
      id: `o-${o.id}`, kind: 'order', title: `Đặt đơn ${o.order_no}`,
      subtitle: `${o.item_count} SP · ${o.channel}`,
      amount: fmtVND(o.amounts.grand_total),
      at: o.created_at,
    }));
    return [...lv, ...ov].sort((a, b) => new Date(b.at) - new Date(a.at));
  }, [ordersList]);

  const tierProgress = (c.membership?.points ?? 0) / ((c.membership?.points ?? 0) + 500) * 100;
  const wishlistMini = wishlistsList.slice(0, 4);
  const avgOrder = (c.stats?.total_spent ?? 0) / Math.max(c.stats?.order_count ?? 1, 1);

  return (
    <DashboardContent disablePadding>
      <Box sx={{ p: { xs: 1.5, md: 2 } }}>
        <Stack spacing={1.5}>
          {/* Title + profile */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                Hồ sơ khách hàng 360°
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
                Tổng quan · lịch sử · điểm · yêu thích · marketing
              </Typography>
            </Box>
          </Stack>

          <ProfileStrip customer={c} />

          {/* KPI tiles row */}
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6, md: 3 }}>
              <KpiTile
                label="Điểm thành viên"
                value={fmtNumber(c.membership?.points ?? 0)}
                sub={`Còn ${Math.max(500 - ((c.membership?.points ?? 0) % 500), 0)} điểm lên hạng`}
                icon="solar:star-linear"
                color="#D97706"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <KpiTile
                label="Giá trị vòng đời"
                value={fmtVND(c.stats?.total_spent ?? 0)}
                sub={`TB ${fmtVND(avgOrder)} / đơn`}
                icon="solar:dollar-linear"
                color="#059669"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <KpiTile
                label="Số đơn hàng"
                value={fmtNumber(c.stats?.order_count ?? 0)}
                sub={`Đơn cuối ${fmtRelative(c.stats?.last_order_at)}`}
                icon="solar:bag-linear"
                color="#2563EB"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <KpiTile
                label="SP yêu thích"
                value={fmtNumber(wishlistsList.length)}
                sub={`${wishlistMini.filter((w) => w.in_stock).length} đang có hàng`}
                icon="solar:heart-linear"
                color="#DB2777"
              />
            </Grid>
          </Grid>

          {/* Info panels row */}
          <Grid container spacing={1.5}>
            {/* Hạng thẻ */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Panel title="Hạng thẻ" icon="solar:medal-ribbon-linear" iconColor="#D97706">
                <Stack spacing={1}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>
                    {TIER_META[c.membership?.tier_code ?? 'silver'].label}
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                    {fmtNumber(c.membership?.points)} điểm tích luỹ
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(tierProgress, 100)}
                    sx={{
                      height: 4, borderRadius: 2, bgcolor: 'grey.100',
                      '& .MuiLinearProgress-bar': { bgcolor: '#D97706', opacity: 0.7, borderRadius: 2 },
                    }}
                  />
                  <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                    Còn {Math.max(500 - ((c.membership?.points ?? 0) % 500), 0)} điểm để lên hạng kế tiếp
                  </Typography>
                </Stack>
              </Panel>
            </Grid>

            {/* Địa chỉ */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Panel title={`Địa chỉ · ${addresses.length}`} icon="solar:map-point-linear" iconColor="#2563EB">
                {addresses[0] ? (
                  <Stack spacing={0.5}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.primary' }}>
                      {addresses[0].full_name}
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: 'text.secondary', lineHeight: 1.45 }}>
                      {addresses[0].street}, {addresses[0].ward_name}, {addresses[0].province_name}
                    </Typography>
                    {addresses[0].is_default && (
                      <Chip
                        label="Mặc định"
                        size="small"
                        sx={{
                          mt: 0.25, height: 18, fontSize: 10.5, fontWeight: 500,
                          bgcolor: 'grey.100', color: 'text.secondary',
                          alignSelf: 'flex-start',
                        }}
                      />
                    )}
                  </Stack>
                ) : (
                  <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>
                    Chưa có địa chỉ
                  </Typography>
                )}
              </Panel>
            </Grid>

            {/* Marketing */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Panel title="Kênh marketing" icon="solar:bell-bing-linear" iconColor="#7C3AED">
                <Stack spacing={0.75}>
                  {['SMS', 'Email', 'Zalo', 'Push'].map((ch) => (
                    <Stack key={ch} direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 6, height: 6, borderRadius: '50%',
                          bgcolor: c.marketing_opt_in ? 'success.main' : 'grey.400',
                        }}
                      />
                      <Typography sx={{ fontSize: 11.5, color: 'text.secondary', flex: 1 }}>
                        {ch}
                      </Typography>
                      <Typography sx={{
                        fontSize: 10, fontWeight: 600,
                        color: c.marketing_opt_in ? 'success.darker' : 'text.disabled',
                      }}>
                        {c.marketing_opt_in ? 'ON' : 'OFF'}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Panel>
            </Grid>
          </Grid>

          {/* Main content: Timeline + Wishlist */}
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Panel
                title="Dòng thời gian"
                icon="solar:history-linear"
                iconColor="#2563EB"
                action={
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Chip
                      label={timeline.length}
                      size="small"
                      sx={{
                        height: 18, fontSize: 10.5, fontWeight: 500,
                        bgcolor: 'grey.100', color: 'text.secondary',
                      }}
                    />
                    <Button
                      size="small" variant="text"
                      startIcon={<Iconify icon="solar:filter-linear" width={12} />}
                      sx={{ fontSize: 11, color: 'text.secondary' }}
                    >
                      Lọc
                    </Button>
                  </Stack>
                }
              >
                <Stack>
                  {timeline.map((e, i) => (
                    <TimelineEvent key={e.id} event={e} isLast={i === timeline.length - 1} />
                  ))}
                </Stack>
              </Panel>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Panel title="SP yêu thích" icon="solar:heart-linear" iconColor="#DB2777">
                <Stack spacing={1}>
                  {wishlistMini.map((w) => (
                    <Stack
                      key={w.id}
                      direction="row" spacing={1.25} alignItems="center"
                      sx={{
                        p: 0.75, borderRadius: 0.75, cursor: 'pointer',
                        '&:hover': { bgcolor: 'grey.50' },
                      }}
                    >
                      <Avatar src={w.image} variant="rounded" sx={{ width: 36, height: 36, bgcolor: 'grey.100' }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }} noWrap>
                          {w.product_name}
                        </Typography>
                        <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
                          {w.wish_count} lượt yêu thích
                        </Typography>
                      </Box>
                      <Iconify
                        icon={w.in_stock ? 'solar:check-circle-linear' : 'solar:close-circle-linear'}
                        width={13}
                        sx={{ color: w.in_stock ? 'success.main' : 'error.main' }}
                      />
                    </Stack>
                  ))}
                </Stack>
                <Button
                  fullWidth size="small" variant="text"
                  sx={{ mt: 1, fontSize: 11.5, color: 'text.secondary', justifyContent: 'center' }}
                >
                  Xem tất cả
                </Button>
              </Panel>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </DashboardContent>
  );
}
