// src/views/admin/notification-template/system-config-hub-view.jsx

'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import SwapHorizOutlined from '@mui/icons-material/SwapHorizOutlined';
import PermMediaOutlined from '@mui/icons-material/PermMediaOutlined';
import PrivacyTipOutlined from '@mui/icons-material/PrivacyTipOutlined';
import HelpOutlineOutlined from '@mui/icons-material/HelpOutlineOutlined';
import MarkEmailReadOutlined from '@mui/icons-material/MarkEmailReadOutlined';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { FaqListView } from 'src/views/admin/faq/faq-list-view';
import { MediaLibraryView } from 'src/views/admin/media/media-library-view';
import { ConsentListView } from 'src/views/admin/consent/consent-list-view';
import { DocumentLibraryView } from 'src/views/admin/document/document-library-view';
import { ActivityLogListView } from 'src/views/admin/activity-log/activity-log-list-view';
import { UrlRedirectListView } from 'src/views/admin/url-redirect/url-redirect-list-view';
import { NotificationLogListView } from 'src/views/admin/notification-log/notification-log-list-view';

import { PageHeader } from 'src/components/common/page-header';

import { NotificationTemplateListView } from './notification-template-list-view';
import { mockActivityLogs, mockNotificationTemplates, mockNotificationLogs, mockConsents, mockDocuments, mockUrlRedirects, mockMedia, mockFaqs } from 'src/mock-data';

const mediaList = mockMedia;
const faqsList = mockFaqs;

// Stubs — API chưa có hook; giữ literal để view không crash.
const activityLogsList = mockActivityLogs;
const consentsList = mockConsents;
const documentsList = mockDocuments;
const notificationLogsList = mockNotificationLogs;
const notificationTemplatesList = mockNotificationTemplates;
const urlRedirectsList = mockUrlRedirects;
const TABS = [
  { value: 'templates',  label: 'Mẫu thông báo',     Icon: NotificationsNoneOutlined, count: notificationTemplatesList.length, subtitle: 'Email · SMS · Zalo template cho các sự kiện' },
  { value: 'notif_logs', label: 'Nhật ký gửi',        Icon: MarkEmailReadOutlined,     count: notificationLogsList.length,      subtitle: 'Log gửi thông báo thực tế · trạng thái' },
  { value: 'activity',   label: 'Nhật ký thao tác',  Icon: HistoryOutlined,            count: activityLogsList.length,          subtitle: 'Audit log admin thao tác' },
  { value: 'redirects',  label: 'URL Redirect',      Icon: SwapHorizOutlined,          count: urlRedirectsList.length,          subtitle: '301 / 302 redirect SEO' },
  { value: 'faq',        label: 'FAQ',               Icon: HelpOutlineOutlined,        count: faqsList.length,                  subtitle: 'Câu hỏi thường gặp theo chủ đề' },
  { value: 'docs',       label: 'Tài liệu IR',       Icon: FolderOutlined,             count: documentsList.length,             subtitle: 'Thư viện tài liệu quan hệ cổ đông' },
  { value: 'media',      label: 'Media',             Icon: PermMediaOutlined,          count: mediaList.length,                 subtitle: 'Thư viện ảnh / video dùng cho CMS' },
  { value: 'consent',    label: 'Consent (GDPR)',    Icon: PrivacyTipOutlined,         count: consentsList.length,              subtitle: 'Lịch sử đồng ý / rút lại marketing' },
];

export function SystemConfigHubView({ defaultTab = 'templates' }) {
  const [tab, setTab] = useState(defaultTab);
  const active = TABS.find((t) => t.value === tab) ?? TABS[0];
  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={active.label}
        subtitle={active.subtitle}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Hệ thống' },
          { label: active.label },
        ]}
      />
      <HubTabs value={tab} onChange={setTab} tabs={TABS} />
      <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
        {tab === 'templates'  && <NotificationTemplateListView embedded />}
        {tab === 'notif_logs' && <NotificationLogListView embedded />}
        {tab === 'activity'   && <ActivityLogListView embedded />}
        {tab === 'redirects'  && <UrlRedirectListView embedded />}
        {tab === 'faq'        && <FaqListView embedded />}
        {tab === 'docs'       && <DocumentLibraryView embedded />}
        {tab === 'media'      && <MediaLibraryView embedded />}
        {tab === 'consent'    && <ConsentListView embedded />}
      </Box>
    </DashboardContent>
  );
}
