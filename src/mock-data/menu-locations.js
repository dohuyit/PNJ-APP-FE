// src/mock-data/menu-locations.js
// Vị trí menu trên storefront — link với mockMenu (menu.js).

export const mockMenuLocations = [
  { _id: 'ml-header-main',    id: 'ml-header-main',    code: 'header_main',    name: 'Menu chính header',  description: 'Hiển thị trên top header storefront', max_items: 8,  is_assigned: true,  menu_code: 'main-menu',    status: 'active' },
  { _id: 'ml-header-sub',     id: 'ml-header-sub',     code: 'header_sub',     name: 'Menu phụ header',    description: 'Dưới logo, trên banner',              max_items: 6,  is_assigned: true,  menu_code: 'sub-menu',     status: 'active' },
  { _id: 'ml-footer-col-1',   id: 'ml-footer-col-1',   code: 'footer_col_1',   name: 'Footer · Cột 1',    description: 'Về PNJ',                               max_items: 6,  is_assigned: true,  menu_code: 'company-menu', status: 'active' },
  { _id: 'ml-footer-col-2',   id: 'ml-footer-col-2',   code: 'footer_col_2',   name: 'Footer · Cột 2',    description: 'Chính sách',                           max_items: 6,  is_assigned: true,  menu_code: 'policy-menu',  status: 'active' },
  { _id: 'ml-footer-col-3',   id: 'ml-footer-col-3',   code: 'footer_col_3',   name: 'Footer · Cột 3',    description: 'Hỗ trợ khách hàng',                    max_items: 6,  is_assigned: false, menu_code: null,           status: 'active' },
  { _id: 'ml-mobile-drawer',  id: 'ml-mobile-drawer',  code: 'mobile_drawer',  name: 'Drawer mobile',      description: 'Hiển thị khi bấm hamburger',           max_items: 12, is_assigned: true,  menu_code: 'mobile-menu',  status: 'active' },
  { _id: 'ml-account-side',   id: 'ml-account-side',   code: 'account_side',   name: 'Sidebar tài khoản',  description: 'Trong trang account/*',                max_items: 8,  is_assigned: true,  menu_code: 'account-menu', status: 'active' },
];
