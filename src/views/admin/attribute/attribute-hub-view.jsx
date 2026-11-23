// src/views/admin/attribute/attribute-hub-view.jsx — Hub 2 tab: Thuộc tính + Nhóm thuộc tính

'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { useGetAttributeList, useGetAttributeSetList } from 'src/actions/admin/attribute';
import { AttributeSetListView, AttributeSetCreateButton } from 'src/views/admin/attribute-set/attribute-set-list-view';

import { PageHeader } from 'src/components/common/page-header';

import { AttributeView, AttributeCreateButton } from './attribute-view';

export function AttributeHubView({ defaultTab = 'attrs' }) {
  const [tab, setTab] = useState(defaultTab);
  const attributesCount = useGetAttributeList().metaTotal ?? 0;
  const setsCount = useGetAttributeSetList().metaTotal ?? 0;

  const TABS = [
    {
      value: 'attrs',
      label: 'Thuộc tính',
      Icon: TuneOutlined,
      count: attributesCount,
      subtitle: 'Attribute cho lọc, bảng thông số và biến thể',
      actions: <AttributeCreateButton />,
    },
    {
      value: 'sets',
      label: 'Nhóm thuộc tính',
      Icon: LayersOutlined,
      count: setsCount,
      subtitle: 'Gom nhóm thuộc tính theo loại sản phẩm (Trang sức · Kim cương · Đồng hồ…)',
      actions: <AttributeSetCreateButton />,
    },
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
        {tab === 'attrs' && <AttributeView embedded />}
        {tab === 'sets' && <AttributeSetListView embedded />}
      </Box>
    </DashboardContent>
  );
}
