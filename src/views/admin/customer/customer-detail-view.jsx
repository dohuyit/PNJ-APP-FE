'use client';

import { useState } from 'react';

import {
  Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Divider, Grid, Stack,
  Tab, Tabs, Typography, Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtNumber, fmtDate, fmtDateTime } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCustomerList } from 'src/actions/admin/customer';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { PageHeader } from 'src/components/common/page-header';
import { StatusBadge } from 'src/components/common/status-badge';
import { DetailSkeleton } from 'src/components/common/skeletons';

// Stubs — API chưa có hook; giữ literal để view không crash.
const customersDetail = { addresses: [], loyalty_transactions: [] };

const TIER_COLOR = { silver: 'default', gold: 'warning', platinum: 'info', diamond: 'secondary' };

const TABS = [
  { value: 'profile', label: 'Hồ sơ', icon: 'solar:user-id-linear' },
  { value: 'orders', label: 'Đơn hàng', icon: 'solar:cart-large-linear' },
  { value: 'loyalty', label: 'Điểm & lịch sử', icon: 'solar:star-linear' },
  { value: 'reviews', label: 'Đánh giá', icon: 'solar:chat-line-linear' },
  { value: 'consents', label: 'Đồng ý', icon: 'solar:shield-check-linear' },
  { value: 'notes', label: 'Ghi chú', icon: 'solar:notes-linear' },
];

export function CustomerDetailView({ id }) {
  const { searchResults: customersList, searchLoading: customersLoading } = useGetCustomerList();
  const [tab, setTab] = useState('profile');
  if (customersLoading) return <DashboardContent disablePadding><DetailSkeleton tabCount={6} leftSections={3} rightSections={2} /></DashboardContent>;
  const c = customersList.find((x) => x.id === id) ?? customersDetail;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={c.full_name}
        subtitle={`${c.phone} · ${c.email ?? '—'}`}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Khách hàng', href: adminPaths.customer.root },
          { label: c.full_name },
        ]}
        actions={
          <>
            <Button variant="outlined" startIcon={<Iconify icon="solar:star-linear" width={16} />}>Cộng/trừ điểm</Button>
            <Button variant="outlined" color="warning" startIcon={<Iconify icon="solar:lock-linear" width={16} />}>Khoá tài khoản</Button>
          </>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <Avatar sx={{ width: 96, height: 96, fontSize: 36, bgcolor: 'primary.light' }}>{c.full_name?.[0]}</Avatar>
                <Typography variant="h5">{c.full_name}</Typography>
                <StatusBadge status={c.status} colorMap={COMMON_STATUS_COLOR} labelMap={COMMON_STATUS_LABEL} />
                <Divider sx={{ width: '100%' }} />
                <Chip
                  icon={<Iconify icon="solar:crown-bold" width={16} />}
                  label={`Hạng ${c.membership?.tier_code?.toUpperCase()}`}
                  color={TIER_COLOR[c.membership?.tier_code]}
                  sx={{ fontWeight: 600 }}
                />
                <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                  <Grid item xs={4}>
                    <Typography variant="h5" color="primary.main">{fmtNumber(c.membership?.points)}</Typography>
                    <Typography variant="caption" color="text.secondary">Điểm</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h5">{fmtNumber(c.stats.order_count)}</Typography>
                    <Typography variant="caption" color="text.secondary">Đơn hàng</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h5" color="warning.main" sx={{ fontSize: 16 }}>{fmtVND(c.stats.total_spent)}</Typography>
                    <Typography variant="caption" color="text.secondary">Tổng chi</Typography>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              {TABS.map((t) => (
                <Tab key={t.value} value={t.value} label={t.label} iconPosition="start" icon={<Iconify icon={t.icon} width={16} />} sx={{ minHeight: 48 }} />
              ))}
            </Tabs>
            <CardContent>
              {tab === 'profile' && (
                <Stack spacing={2}>
                  <Typography variant="subtitle2">Địa chỉ ({customersDetail.addresses.length}/10)</Typography>
                  {customersDetail.addresses.map((ad) => (
                    <Card key={ad.id} variant="outlined" sx={{ p: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="subtitle2">
                            {ad.full_name} {ad.is_default && <Label color="primary" variant="filled">Mặc định</Label>}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">{ad.phone}</Typography>
                          <Typography variant="body2">{ad.street}, {ad.ward_name}, {ad.province_name}</Typography>
                        </Box>
                        <Iconify icon="solar:pen-linear" width={16} />
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              )}

              {tab === 'loyalty' && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Loại</TableCell>
                      <TableCell>Điểm</TableCell>
                      <TableCell>Số dư</TableCell>
                      <TableCell>Lý do</TableCell>
                      <TableCell>Thời gian</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customersDetail.loyalty_transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell><Label color={t.type === 'earn' ? 'success' : 'warning'}>{t.type}</Label></TableCell>
                        <TableCell sx={{ color: t.points > 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                          {t.points > 0 ? '+' : ''}{t.points}
                        </TableCell>
                        <TableCell>{t.balance_after}</TableCell>
                        <TableCell>{t.reason}</TableCell>
                        <TableCell>{fmtDateTime(t.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {tab === 'orders' && (
                <Typography color="text.secondary">Danh sách đơn hàng của khách sẽ hiển thị ở đây.</Typography>
              )}
              {tab === 'reviews' && (
                <Typography color="text.secondary">Đánh giá của khách.</Typography>
              )}
              {tab === 'consents' && (
                <Typography color="text.secondary">Nhật ký đồng ý marketing / dữ liệu cá nhân.</Typography>
              )}
              {tab === 'notes' && (
                <Typography color="text.secondary">Ghi chú nội bộ của CSKH.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
