// src/views/admin/admin-user/people-hub-view.jsx

'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import BadgeOutlined from '@mui/icons-material/BadgeOutlined';
import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { RoleListView } from 'src/views/admin/role/role-list-view';

import { PageHeader } from 'src/components/common/page-header';

import { AdminRosterView } from './admin-roster-view';
import { mockAdmins } from 'src/mock-data';
import { SYSTEM_ROLES } from 'src/constants/permissions';

const adminsList = mockAdmins;
const rolesList = SYSTEM_ROLES;

const TABS = [
  { value: 'admins', label: 'Tài khoản admin',  Icon: BadgeOutlined,               count: adminsList.length, subtitle: 'Danh sách admin nội bộ · trạng thái · lần đăng nhập cuối' },
  { value: 'roles',  label: 'Vai trò & quyền',   Icon: AdminPanelSettingsOutlined,  count: rolesList.length,  subtitle: 'Ma trận vai trò & quyền truy cập' },
];

export function PeopleHubView({ defaultTab = 'admins' }) {
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
        {tab === 'admins' && <AdminRosterView embedded />}
        {tab === 'roles'  && <RoleListView />}
      </Box>
    </DashboardContent>
  );
}
