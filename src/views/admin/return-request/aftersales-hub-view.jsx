// src/views/admin/return-request/aftersales-hub-view.jsx

'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import StarBorderOutlined from '@mui/icons-material/StarBorderOutlined';
import AssignmentReturnOutlined from '@mui/icons-material/AssignmentReturnOutlined';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { ReviewFeedView } from 'src/views/admin/review/review-feed-view';

import { PageHeader } from 'src/components/common/page-header';

import { ReturnRequestListView } from './return-request-list-view';
import { mockReviews, mockReturnRequests } from 'src/mock-data';

const reviewsList = mockReviews;
const returnRequestsList = mockReturnRequests;


const TABS = [
  { value: 'returns', label: 'Thu đổi/Hoàn tiền', Icon: AssignmentReturnOutlined, count: returnRequestsList.length, subtitle: 'Yêu cầu thu đổi · hoàn tiền · bảo hành' },
  { value: 'reviews', label: 'Đánh giá',          Icon: StarBorderOutlined,       count: reviewsList.length,         subtitle: 'Duyệt / ẩn / trả lời đánh giá sản phẩm' },
];

export function AfterSalesHubView({ defaultTab = 'returns' }) {
  const [tab, setTab] = useState(defaultTab);
  const active = TABS.find((t) => t.value === tab) ?? TABS[0];
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
      />
      <HubTabs value={tab} onChange={setTab} tabs={TABS} />
      <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
        {tab === 'returns' && <ReturnRequestListView embedded />}
        {tab === 'reviews' && <ReviewFeedView embedded />}
      </Box>
    </DashboardContent>
  );
}
