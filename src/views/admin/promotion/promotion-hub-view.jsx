// src/views/admin/promotion/promotion-hub-view.jsx

'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import MailOutlined from '@mui/icons-material/MailOutlined';
import NoteAddOutlined from '@mui/icons-material/NoteAddOutlined';
import CardGiftcardOutlined from '@mui/icons-material/CardGiftcardOutlined';
import LocalActivityOutlined from '@mui/icons-material/LocalActivityOutlined';
import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { EcardCategoryListView } from 'src/views/admin/ecard/ecard-category-list-view';
import { EcardTemplateListView } from 'src/views/admin/ecard/ecard-template-list-view';
import { GiftCardGalleryView } from 'src/views/admin/gift-card/gift-card-gallery-view';
import { CouponListView, CouponCreateButton } from 'src/views/admin/coupon/coupon-list-view';

import { PageHeader } from 'src/components/common/page-header';

import { PromotionListView, PromotionCreateButton } from './promotion-list-view';
import { mockEcardTemplates, mockCoupons, mockEcardCategories, mockGiftCards, mockPromotions } from 'src/mock-data';

const promotionsList = mockPromotions;

const couponsList = mockCoupons;
const ecardCategoriesList = mockEcardCategories;
const ecardTemplatesList = mockEcardTemplates;
const giftCardsList = mockGiftCards;
const TABS = [
  { value: 'campaigns',    label: 'Chương trình',  Icon: LocalActivityOutlined,      count: promotionsList.length,       subtitle: 'Chiến dịch khuyến mãi theo mùa / sự kiện', actions: <PromotionCreateButton /> },
  { value: 'coupons',      label: 'Mã giảm giá',    Icon: ConfirmationNumberOutlined, count: couponsList.length,          subtitle: 'Mã voucher · điều kiện áp dụng · lịch sử dùng', actions: <CouponCreateButton /> },
  { value: 'gift_cards',   label: 'Gift Card',      Icon: CardGiftcardOutlined,       count: giftCardsList.length,        subtitle: 'Thẻ quà tặng · phát hành & quy đổi' },
  { value: 'ecard_cat',    label: 'Chủ đề thiệp',    Icon: MailOutlined,               count: ecardCategoriesList.length,  subtitle: 'Nhóm thiệp mừng theo dịp' },
  { value: 'ecard_tpl',    label: 'Mẫu thiệp',       Icon: NoteAddOutlined,            count: ecardTemplatesList.length,   subtitle: 'Template thiệp quà đi kèm đơn' },
];

export function PromotionHubView({ defaultTab = 'campaigns' }) {
  const [tab, setTab] = useState(defaultTab);
  const active = TABS.find((t) => t.value === tab) ?? TABS[0];
  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={active.label}
        subtitle={active.subtitle}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Marketing' },
          { label: active.label },
        ]}
        actions={active.actions}
      />
      <HubTabs value={tab} onChange={setTab} tabs={TABS} />
      <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
        {tab === 'campaigns'    && <PromotionListView embedded />}
        {tab === 'coupons'      && <CouponListView embedded />}
        {tab === 'gift_cards'   && <GiftCardGalleryView embedded />}
        {tab === 'ecard_cat'    && <EcardCategoryListView embedded />}
        {tab === 'ecard_tpl'    && <EcardTemplateListView />}
      </Box>
    </DashboardContent>
  );
}
