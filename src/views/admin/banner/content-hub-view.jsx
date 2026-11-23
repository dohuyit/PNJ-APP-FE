// src/views/admin/banner/content-hub-view.jsx

'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import WebOutlined from '@mui/icons-material/WebOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import MenuOutlined from '@mui/icons-material/MenuOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { PageListView } from 'src/views/admin/page/page-list-view';
import { LandingPageListView } from 'src/views/admin/landing-page/landing-page-list-view';
import { MenuListView, MenuLocationCreateButton } from 'src/views/admin/menu/menu-list-view';
import { HomeSectionListView, HomeSectionActions } from 'src/views/admin/home-section/home-section-list-view';

import { PageHeader } from 'src/components/common/page-header';

import { BannerGalleryView } from './banner-gallery-view';
import { mockLandingPages, mockHomeSections, mockPages, mockBanners, mockMenuLocations } from 'src/mock-data';

const pagesList = mockPages;
const bannersList = mockBanners;
const homeSectionsList = mockHomeSections;
const landingPagesList = mockLandingPages;
const menuLocationsList = mockMenuLocations;

const TABS = [
  { value: 'banners',  label: 'Banner',     Icon: ImageOutlined,   count: bannersList.length,       subtitle: 'Banner trang chủ · landing · sale event' },
  { value: 'home',     label: 'Trang chủ',  Icon: HomeOutlined,    count: homeSectionsList.length,  subtitle: 'Cấu hình section trang chủ · thứ tự hiển thị', actions: <HomeSectionActions /> },
  { value: 'menu',     label: 'Menu',       Icon: MenuOutlined,    count: menuLocationsList.length, subtitle: 'Menu header / footer / mobile · nhóm nav', actions: <MenuLocationCreateButton /> },
  { value: 'landing',  label: 'Landing',    Icon: WebOutlined,     count: landingPagesList.length,  subtitle: 'Landing page chiến dịch · A/B test' },
  { value: 'pages',    label: 'Trang tĩnh', Icon: ArticleOutlined, count: pagesList.length,         subtitle: 'Giới thiệu · chính sách · câu hỏi thường gặp' },
];

export function ContentHubView({ defaultTab = 'banners' }) {
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
        {tab === 'banners' && <BannerGalleryView embedded />}
        {tab === 'home'    && <HomeSectionListView embedded />}
        {tab === 'menu'    && <MenuListView embedded />}
        {tab === 'landing' && <LandingPageListView embedded />}
        {tab === 'pages'   && <PageListView embedded />}
      </Box>
    </DashboardContent>
  );
}
