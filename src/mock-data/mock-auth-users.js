// src/mock-data/mock-auth-users.js
// Test credentials cho mock auth — mỗi user ứng với 1 role trong SYSTEM_ROLES.
// Dùng ở màn login (click-to-fill) và được kiểm tra bởi use-auth-login mock mode.

import { STORE_IDS } from './ids';

export const MOCK_TEST_USERS = [
  {
    id: 'mock-user-super',
    name: 'Nguyễn Hoàng Minh',
    email: 'super@pnj.local',
    password: 'super',
    role_keys: ['super_admin'],
    role_label: 'Quản trị tối cao',
    role_color: '#DC2626',
    accessible_store_ids: 'all',
    hint: 'Toàn quyền hệ thống · xem mọi cửa hàng',
    department: 'CEO · HCM HQ',
  },
  {
    id: 'mock-user-store-hcm',
    name: 'Lê Quốc Khánh',
    email: 'store.hcm@pnj.local',
    password: 'store',
    role_keys: ['store_manager'],
    role_label: 'Quản lý cửa hàng',
    role_color: '#2563EB',
    accessible_store_ids: [STORE_IDS.HCM_NTMK, STORE_IDS.HCM_LTT, STORE_IDS.HCM_LTK],
    hint: 'Chỉ 3 cửa hàng TP.HCM · không CRUD store',
    department: 'PNJ NTMK · HCM',
  },
  {
    id: 'mock-user-store-hn',
    name: 'Phạm Thu Hằng',
    email: 'store.hn@pnj.local',
    password: 'store',
    role_keys: ['store_manager'],
    role_label: 'Quản lý cửa hàng',
    role_color: '#2563EB',
    accessible_store_ids: [STORE_IDS.HN_HBT, STORE_IDS.HN_BAT_DAN, STORE_IDS.HN_XUAN_THUY],
    hint: 'Cụm 3 cửa hàng Hà Nội · thử switch store',
    department: 'PNJ Hà Nội · Cụm trung tâm',
  },
  {
    id: 'mock-user-catalog',
    name: 'Võ Hoàng Nam',
    email: 'catalog@pnj.local',
    password: 'catalog',
    role_keys: ['catalog_editor'],
    role_label: 'Biên tập Catalog',
    role_color: '#7C3AED',
    accessible_store_ids: 'all',
    hint: 'Chỉ Catalog + Media · không thấy Đơn hàng',
    department: 'Catalog · HCM HQ',
  },
  {
    id: 'mock-user-marketing',
    name: 'Trần Thị Mai Anh',
    email: 'marketing@pnj.local',
    password: 'marketing',
    role_keys: ['marketing_lead'],
    role_label: 'Trưởng Marketing',
    role_color: '#D97706',
    accessible_store_ids: 'all',
    hint: 'Khuyến mãi + CMS + Blog · không thấy Catalog CRUD',
    department: 'Marketing · HCM HQ',
  },
  {
    id: 'mock-user-finance',
    name: 'Đinh Bảo Châu',
    email: 'finance@pnj.local',
    password: 'finance',
    role_keys: ['finance'],
    role_label: 'Kế toán · Đối soát',
    role_color: '#059669',
    accessible_store_ids: 'all',
    hint: 'Đọc dữ liệu tài chính + đối soát giao dịch',
    department: 'Tài chính · HCM HQ',
  },
  {
    id: 'mock-user-viewer',
    name: 'Hoàng Văn Đức',
    email: 'viewer@pnj.local',
    password: 'viewer',
    role_keys: ['viewer'],
    role_label: 'Chỉ xem',
    role_color: '#64748B',
    accessible_store_ids: 'all',
    hint: 'Read-only · test gating nghiêm ngặt',
    department: 'Audit · Bên thứ ba',
  },
];

// Helper: tìm user theo email + password (lowercase match email)
export function findMockUser(email, password) {
  const e = (email || '').trim().toLowerCase();
  return MOCK_TEST_USERS.find((u) => u.email.toLowerCase() === e && u.password === password);
}

export const MOCK_TOKEN_PREFIX = 'mock-token::';
// Dùng dấu `::` để tránh collision với dấu `-` trong user.id (mock-user-store-hcm...).
export function makeMockToken(userId) {
  return MOCK_TOKEN_PREFIX + userId + '::' + Date.now();
}
export function parseMockToken(token) {
  if (!token?.startsWith?.(MOCK_TOKEN_PREFIX)) return null;
  const rest = token.slice(MOCK_TOKEN_PREFIX.length);
  const userId = rest.split('::')[0];
  return MOCK_TEST_USERS.find((u) => u.id === userId) ?? null;
}
