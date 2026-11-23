// src/views/admin/brand/brand-collection-hub.jsx

'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import CollectionsOutlined from '@mui/icons-material/CollectionsOutlined';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetBrandList } from 'src/actions/admin/brand';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { useGetCollectionList } from 'src/actions/admin/collection';
import { CollectionListView, CollectionCreateButton } from 'src/views/admin/collection/collection-list-view';

import { PageHeader } from 'src/components/common/page-header';

import { BrandListView, BrandCreateButton } from './brand-list-view';

export function BrandCollectionHub({ defaultTab = 'brands' }) {
  const [tab, setTab] = useState(defaultTab);
  const brandsList = useGetBrandList().searchResults;
  const collectionsList = useGetCollectionList().searchResults;
  const TABS = [
    { value: 'brands',      label: 'Thương hiệu',  Icon: LocalOfferOutlined,  count: brandsList.length,       subtitle: 'Brand sản phẩm, brand đối tác, brand watch…', actions: <BrandCreateButton /> },
    { value: 'collections', label: 'Bộ sưu tập',   Icon: CollectionsOutlined, count: collectionsList.length,  subtitle: 'BST theo mùa, chủ đề hoặc sự kiện', actions: <CollectionCreateButton /> },
  ];
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
        actions={active.actions}
      />
      <HubTabs value={tab} onChange={setTab} tabs={TABS} />
      <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
        {tab === 'brands'      && <BrandListView embedded />}
        {tab === 'collections' && <CollectionListView embedded />}
      </Box>
    </DashboardContent>
  );
}
