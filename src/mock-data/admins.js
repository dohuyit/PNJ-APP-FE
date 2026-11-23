// src/mock-data/admins.js
// 12 admin users liên kết đến roles (SYSTEM_ROLES.key) + stores (STORE_IDS).
// Các field cover đủ cho admin-roster-view: avatar, status, 2FA, last_login.

import { STORE_IDS } from './ids';

// Role keys phải trùng với SYSTEM_ROLES ở src/constants/permissions.js
const ROLE_KEY = {
  SUPER_ADMIN:  'super_admin',
  STORE_MGR:    'store_manager',
  CATALOG_EDIT: 'catalog_editor',
  MARKETING:    'marketing_lead',
  FINANCE:      'finance',
  VIEWER:       'viewer',
};

export const ADMIN_IDS = {
  ADMIN_01: 'admin-01', ADMIN_02: 'admin-02', ADMIN_03: 'admin-03', ADMIN_04: 'admin-04',
  ADMIN_05: 'admin-05', ADMIN_06: 'admin-06', ADMIN_07: 'admin-07', ADMIN_08: 'admin-08',
  ADMIN_09: 'admin-09', ADMIN_10: 'admin-10', ADMIN_11: 'admin-11', ADMIN_12: 'admin-12',
};

const now = Date.now();
const mins = (n) => new Date(now - n * 60_000).toISOString();
const hours = (n) => new Date(now - n * 3600_000).toISOString();
const days = (n) => new Date(now - n * 86_400_000).toISOString();

export const mockAdmins = [
  {
    _id: ADMIN_IDS.ADMIN_01, id: ADMIN_IDS.ADMIN_01,
    name: 'Nguyễn Hoàng Minh', email: 'minh.nh@pnj.vn', phone: '0912345601',
    role_keys: [ROLE_KEY.SUPER_ADMIN], role: 'Super Admin',
    accessible_store_ids: 'all',
    two_factor_enabled: true, status: 'active',
    last_login_at: mins(5), created_at: days(540),
    avatar: null, department: 'Tổng giám đốc',
  },
  {
    _id: ADMIN_IDS.ADMIN_02, id: ADMIN_IDS.ADMIN_02,
    name: 'Trần Thị Mai Anh', email: 'maianh.tt@pnj.vn', phone: '0912345602',
    role_keys: [ROLE_KEY.MARKETING, ROLE_KEY.CATALOG_EDIT], role: 'Marketing',
    accessible_store_ids: 'all',
    two_factor_enabled: true, status: 'active',
    last_login_at: mins(12), created_at: days(420),
    avatar: null, department: 'Marketing · HCM HQ',
  },
  {
    _id: ADMIN_IDS.ADMIN_03, id: ADMIN_IDS.ADMIN_03,
    name: 'Lê Quốc Khánh', email: 'khanh.lq@pnj.vn', phone: '0912345603',
    role_keys: [ROLE_KEY.STORE_MGR], role: 'Quản lý cửa hàng',
    accessible_store_ids: [STORE_IDS.HCM_NTMK],
    two_factor_enabled: true, status: 'active',
    last_login_at: mins(45), created_at: days(380),
    avatar: null, department: 'PNJ Nguyễn Thị Minh Khai',
  },
  {
    _id: ADMIN_IDS.ADMIN_04, id: ADMIN_IDS.ADMIN_04,
    name: 'Phạm Thu Hằng', email: 'hang.pt@pnj.vn', phone: '0912345604',
    role_keys: [ROLE_KEY.STORE_MGR], role: 'Quản lý cửa hàng',
    accessible_store_ids: [STORE_IDS.HN_HBT, STORE_IDS.HN_BAT_DAN, STORE_IDS.HN_XUAN_THUY],
    two_factor_enabled: true, status: 'active',
    last_login_at: hours(2), created_at: days(360),
    avatar: null, department: 'PNJ Hà Nội · Cụm trung tâm',
  },
  {
    _id: ADMIN_IDS.ADMIN_05, id: ADMIN_IDS.ADMIN_05,
    name: 'Võ Hoàng Nam', email: 'nam.vh@pnj.vn', phone: '0912345605',
    role_keys: [ROLE_KEY.CATALOG_EDIT], role: 'Biên tập Catalog',
    accessible_store_ids: 'all',
    two_factor_enabled: false, status: 'active',
    last_login_at: hours(8), created_at: days(310),
    avatar: null, department: 'Catalog · HCM HQ',
  },
  {
    _id: ADMIN_IDS.ADMIN_06, id: ADMIN_IDS.ADMIN_06,
    name: 'Đinh Bảo Châu', email: 'chau.db@pnj.vn', phone: '0912345606',
    role_keys: [ROLE_KEY.FINANCE], role: 'Kế toán',
    accessible_store_ids: 'all',
    two_factor_enabled: true, status: 'active',
    last_login_at: hours(1), created_at: days(290),
    avatar: null, department: 'Tài chính · HCM HQ',
  },
  {
    _id: ADMIN_IDS.ADMIN_07, id: ADMIN_IDS.ADMIN_07,
    name: 'Bùi Thanh Tùng', email: 'tung.bt@pnj.vn', phone: '0912345607',
    role_keys: [ROLE_KEY.STORE_MGR], role: 'Quản lý cửa hàng',
    accessible_store_ids: [STORE_IDS.DN_LE_DUAN],
    two_factor_enabled: false, status: 'active',
    last_login_at: days(1), created_at: days(250),
    avatar: null, department: 'PNJ Đà Nẵng',
  },
  {
    _id: ADMIN_IDS.ADMIN_08, id: ADMIN_IDS.ADMIN_08,
    name: 'Ngô Phương Linh', email: 'linh.np@pnj.vn', phone: '0912345608',
    role_keys: [ROLE_KEY.MARKETING], role: 'Marketing',
    accessible_store_ids: 'all',
    two_factor_enabled: true, status: 'active',
    last_login_at: mins(90), created_at: days(210),
    avatar: null, department: 'Content · HCM HQ',
  },
  {
    _id: ADMIN_IDS.ADMIN_09, id: ADMIN_IDS.ADMIN_09,
    name: 'Hoàng Văn Đức', email: 'duc.hv@pnj.vn', phone: '0912345609',
    role_keys: [ROLE_KEY.VIEWER], role: 'Chỉ xem',
    accessible_store_ids: 'all',
    two_factor_enabled: false, status: 'blocked',
    last_login_at: days(30), created_at: days(180),
    avatar: null, department: 'Audit · Bên thứ ba',
  },
  {
    _id: ADMIN_IDS.ADMIN_10, id: ADMIN_IDS.ADMIN_10,
    name: 'Trương Hà My', email: 'my.th@pnj.vn', phone: '0912345610',
    role_keys: [ROLE_KEY.STORE_MGR], role: 'Quản lý cửa hàng',
    accessible_store_ids: [STORE_IDS.CT_30T4],
    two_factor_enabled: true, status: 'active',
    last_login_at: hours(4), created_at: days(160),
    avatar: null, department: 'PNJ Cần Thơ',
  },
  {
    _id: ADMIN_IDS.ADMIN_11, id: ADMIN_IDS.ADMIN_11,
    name: 'Phan Minh Tuấn', email: 'tuan.pm@pnj.vn', phone: '0912345611',
    role_keys: [ROLE_KEY.FINANCE, ROLE_KEY.VIEWER], role: 'Kế toán',
    accessible_store_ids: 'all',
    two_factor_enabled: true, status: 'active',
    last_login_at: mins(25), created_at: days(140),
    avatar: null, department: 'Tài chính · Đối soát TMĐT',
  },
  {
    _id: ADMIN_IDS.ADMIN_12, id: ADMIN_IDS.ADMIN_12,
    name: 'Lưu Khả Ngân', email: 'ngan.lk@pnj.vn', phone: '0912345612',
    role_keys: [ROLE_KEY.CATALOG_EDIT, ROLE_KEY.MARKETING], role: 'Biên tập Catalog',
    accessible_store_ids: 'all',
    two_factor_enabled: false, status: 'active',
    last_login_at: hours(6), created_at: days(90),
    avatar: null, department: 'Catalog · Phụ trách bộ Tết',
  },
];
