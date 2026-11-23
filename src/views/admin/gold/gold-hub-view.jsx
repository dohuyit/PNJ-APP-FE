// src/views/admin/gold/gold-hub-view.jsx

'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import MapOutlined from '@mui/icons-material/MapOutlined';
import PaidOutlined from '@mui/icons-material/PaidOutlined';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';

import { PageHeader } from 'src/components/common/page-header';

import { GoldTypeListView } from './gold-type-list-view';
import { GoldPricingDashboard } from './gold-pricing-dashboard';
import { GoldPriceRegionListView } from './gold-price-region-list-view';
import { mockGoldPriceRegions, mockGoldPrices } from 'src/mock-data';

const goldPricesHistory = mockGoldPrices;

const goldPriceRegionsList = mockGoldPriceRegions;

const TABS = [
  { value: 'dashboard', label: 'Bảng giá',      Icon: PaidOutlined,             count: null,                              subtitle: 'Bảng giá vàng hiện tại · mua / bán theo loại vàng' },
  { value: 'types',     label: 'Loại vàng',     Icon: WorkspacePremiumOutlined, count: goldTypesList.length,          subtitle: 'Danh mục các loại vàng · tuổi vàng · nhóm sản phẩm' },
  { value: 'regions',   label: 'Vùng niêm yết', Icon: MapOutlined,              count: goldPriceRegionsList.length,   subtitle: 'Vùng niêm yết giá riêng theo địa lý' },
];

export function GoldHubView({ defaultTab = 'dashboard' }) {
  const [tab, setTab] = useState(defaultTab);
  const active = TABS.find((t) => t.value === tab) ?? TABS[0];
  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={active.label}
        subtitle={active.subtitle}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Catalog' },
          { label: active.label },
        ]}
      />
      <HubTabs value={tab} onChange={setTab} tabs={TABS} />
      <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
        {tab === 'dashboard' && <GoldPricingDashboard embedded />}
        {tab === 'types'     && <GoldTypeListView embedded />}
        {tab === 'regions'   && <GoldPriceRegionListView embedded />}
      </Box>
    </DashboardContent>
  );
}
