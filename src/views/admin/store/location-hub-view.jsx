// src/views/admin/store/location-hub-view.jsx

'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import PublicOutlined from '@mui/icons-material/PublicOutlined';
import PinDropOutlined from '@mui/icons-material/PinDropOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetStoreList } from 'src/actions/admin/store';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { RegionListView } from 'src/views/admin/region/region-list-view';
import { LocationListView } from 'src/views/admin/location/location-list-view';

import { PageHeader } from 'src/components/common/page-header';

import { StoreListView } from './store-list-view';
import { mockRegions, mockStores, mockProvinces } from 'src/mock-data';

const storesList = mockStores;
const locationsProvinces = mockProvinces;
const regionsList = mockRegions;
const TABS = [
  { value: 'stores',    label: 'Cửa hàng',            Icon: StorefrontOutlined, count: storesList.length,           subtitle: 'Danh sách cửa hàng · giờ hoạt động · dịch vụ' },
  { value: 'regions',   label: 'Vùng kinh doanh',     Icon: PublicOutlined,     count: regionsList.length,          subtitle: 'Nhóm cửa hàng theo vùng · chính sách riêng' },
  { value: 'locations', label: 'Địa giới hành chính', Icon: PinDropOutlined,    count: locationsProvinces.length,   subtitle: 'Tỉnh / quận / phường — dùng cho địa chỉ KH' },
];

export function LocationHubView({ defaultTab = 'stores' }) {
  const [tab, setTab] = useState(defaultTab);
  const active = TABS.find((t) => t.value === tab) ?? TABS[0];
  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={active.label}
        subtitle={active.subtitle}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Vận hành' },
          { label: active.label },
        ]}
      />
      <HubTabs value={tab} onChange={setTab} tabs={TABS} />
      <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
        {tab === 'stores'    && <StoreListView embedded />}
        {tab === 'regions'   && <RegionListView embedded />}
        {tab === 'locations' && <LocationListView embedded />}
      </Box>
    </DashboardContent>
  );
}
