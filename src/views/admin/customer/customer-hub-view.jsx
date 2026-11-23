// src/views/admin/customer/customer-hub-view.jsx

'use client';

import { useMemo, useState } from 'react';

import { Box, Button, Grid } from '@mui/material';
import StarsOutlined from '@mui/icons-material/StarsOutlined';
import BlockOutlined from '@mui/icons-material/BlockOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import DiamondOutlined from '@mui/icons-material/DiamondOutlined';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined';
import FavoriteOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined';
import PersonSearchOutlined from '@mui/icons-material/PersonSearchOutlined';
import HourglassBottomOutlined from '@mui/icons-material/HourglassBottomOutlined';
import AddCircleOutlineOutlined from '@mui/icons-material/AddCircleOutlineOutlined';

import { adminPaths } from 'src/routes/paths';

import { fmtNumber } from 'src/utils/format';

import { useGetLeadList } from 'src/actions/admin/lead';
import { DashboardContent } from 'src/layouts/dashboard';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { KpiCard } from 'src/views/admin/_shared/kpi-card';
import { useGetCustomerList } from 'src/actions/admin/customer';
import { LeadScheduleView } from 'src/views/admin/lead/lead-schedule-view';
import { WishlistListView } from 'src/views/admin/wishlist/wishlist-list-view';
import { MembershipTierLadderView } from 'src/views/admin/membership-tier/membership-tier-ladder';
import { MembershipTierFormDrawer } from 'src/views/admin/membership-tier/membership-tier-create-form';
import { LoyaltyTransactionListView } from 'src/views/admin/loyalty-transaction/loyalty-transaction-list-view';

import { PageHeader } from 'src/components/common/page-header';

import { CustomerListView } from './customer-list-view';
import { CustomerFormDrawer } from './customer-create-drawer';
import { mockLeads, mockMembershipTiers, mockLoyaltyTransactions, mockCustomers, mockWishlists } from 'src/mock-data';

// Stubs — API chưa có hook, hoặc hook chỉ gọi được trong component.
// Giữ literal ở module scope để TABS khởi tạo không vỡ TDZ.
// Count hiển thị ở tab header là count tĩnh 0 cho các list chưa có API;
// các list đã có hook (customers/leads) sẽ hiển thị con số thật trong KpiCard bên trong view.
const customersList = mockCustomers;
const leadsList = mockLeads;
const loyaltyTransactionsList = mockLoyaltyTransactions;
const membershipTiersList = mockMembershipTiers;
const wishlistsList = mockWishlists;
const TABS = [
  { value: 'customers', label: 'Khách hàng',      Icon: PeopleOutlined,       count: customersList.length,            subtitle: 'Hồ sơ, hạng thẻ, điểm, đơn hàng của khách' },
  { value: 'leads',     label: 'Lead',            Icon: SupportAgentOutlined, count: leadsList.length,                 subtitle: 'Yêu cầu tư vấn — kéo thả qua các stage của pipeline' },
  { value: 'tiers',     label: 'Hạng thành viên', Icon: EmojiEventsOutlined,  count: membershipTiersList.length,       subtitle: 'Thang hạng · quyền lợi · ngưỡng chi tiêu' },
  { value: 'wishlist',  label: 'Wishlist',        Icon: FavoriteOutlined,     count: wishlistsList.length,             subtitle: 'Sản phẩm được KH yêu thích & lưu lại' },
  { value: 'loyalty',   label: 'Điểm thưởng',     Icon: StarsOutlined,        count: loyaltyTransactionsList.length,   subtitle: 'Nhật ký cộng / trừ điểm · redemption' },
];

function CustomerKpiRow() {
  const customersList = useGetCustomerList().searchResults;
  const stats = useMemo(() => {
    const total   = customersList.length;
    const active  = customersList.filter((c) => c.status === 'active').length;
    const blocked = total - active;
    const vip     = customersList.filter((c) => ['platinum', 'diamond'].includes(c.membership?.tier_code)).length;
    const orders  = customersList.reduce((s, c) => s + (c.stats?.order_count ?? 0), 0);
    return { total, active, blocked, vip, orders };
  }, []);
  return (
    <Box>
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={0} icon={PeopleOutlined} label="Tổng khách hàng" value={fmtNumber(stats.total)} color="primary"
            helperText={`${stats.active} đang hoạt động · ${fmtNumber(stats.orders)} đơn đã đặt`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={1} icon={CheckCircleOutlined} label="Đang hoạt động" value={fmtNumber(stats.active)} color="success"
            helperText={`${((stats.active / Math.max(stats.total, 1)) * 100).toFixed(0)}% tổng`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={2} icon={DiamondOutlined} label="VIP (Platinum/Diamond)" value={fmtNumber(stats.vip)} color="warning"
            helperText={`${((stats.vip / Math.max(stats.total, 1)) * 100).toFixed(0)}% là VIP`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={3} icon={BlockOutlined} label="Đã khoá" value={fmtNumber(stats.blocked)} color="error"
            helperText="KH bị chặn bởi hệ thống" />
        </Grid>
      </Grid>
    </Box>
  );
}

function LeadKpiRow() {
  const leadsList = useGetLeadList().searchResults;
  const stats = useMemo(() => {
    const total      = leadsList.length;
    const pending    = leadsList.filter((l) => l.status === 'new').length;
    const confirmed  = leadsList.filter((l) => l.status === 'contacted').length;
    const unassigned = leadsList.filter((l) => !l.assigned_admin).length;
    return { total, pending, confirmed, unassigned };
  }, []);
  return (
    <Box>
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={0} icon={SupportAgentOutlined} label="Tổng lead" value={fmtNumber(stats.total)} color="primary"
            helperText="Yêu cầu tư vấn từ khách" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={1} icon={HourglassBottomOutlined} label="Chờ xác nhận" value={fmtNumber(stats.pending)} color="warning"
            helperText="Cần CSKH gọi xác nhận" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={2} icon={CheckCircleOutlined} label="Đã xác nhận" value={fmtNumber(stats.confirmed)} color="info"
            helperText="Đang theo dõi tư vấn" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={3} icon={PersonSearchOutlined} label="Chưa giao" value={fmtNumber(stats.unassigned)} color="error"
            helperText="Chưa gán nhân viên phụ trách" />
        </Grid>
      </Grid>
    </Box>
  );
}

export function CustomerHubView({ defaultTab = 'customers' }) {
  const [tab, setTab] = useState(defaultTab);
  const [createCustomerOpen, setCreateCustomer] = useState(false);
  const [createTierOpen, setCreateTier] = useState(false);
  const active = TABS.find((t) => t.value === tab) ?? TABS[0];

  // Actions per tab — render trên PageHeader (không ở toolbar nữa)
  const actionsByTab = {
    customers: (
      <Button
        variant="contained" size="small"
        startIcon={<AddCircleOutlineOutlined sx={{ fontSize: 14 }} />}
        onClick={() => setCreateCustomer(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Tạo khách
      </Button>
    ),
    tiers: (
      <Button
        variant="contained" size="small"
        startIcon={<AddCircleOutlineOutlined sx={{ fontSize: 14 }} />}
        onClick={() => setCreateTier(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Thêm hạng
      </Button>
    ),
  };

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={active.label}
        subtitle={active.subtitle}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Bán hàng' },
          { label: active.label },
        ]}
        actions={actionsByTab[tab]}
      />
      <HubTabs value={tab} onChange={setTab} tabs={TABS} />

      <CustomerFormDrawer
        open={createCustomerOpen}
        onClose={() => setCreateCustomer(false)}
        onSubmit={(v) => console.log('create customer', v)}
      />
      <MembershipTierFormDrawer
        open={createTierOpen}
        onClose={() => setCreateTier(false)}
        onSubmit={(v) => console.log('create tier', v)}
      />
      {tab === 'customers' && (
        <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
          <CustomerKpiRow />
          <CustomerListView embedded />
        </Box>
      )}
      {tab === 'leads' && (
        <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
          <LeadKpiRow />
          <LeadScheduleView embedded />
        </Box>
      )}
      {tab === 'tiers' && (
        <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
          <MembershipTierLadderView embedded />
        </Box>
      )}
      {tab === 'wishlist'  && <WishlistListView embedded />}
      {tab === 'loyalty'   && <LoyaltyTransactionListView embedded />}
    </DashboardContent>
  );
}
