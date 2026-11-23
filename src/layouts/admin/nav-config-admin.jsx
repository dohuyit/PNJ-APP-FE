// src/layouts/admin/nav-config-admin.jsx — single source for admin sidebar menu
// Gom các module liên quan thành "hub" view — mỗi hub có 2–8 tab bên trong.
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import AssignmentReturnOutlined from '@mui/icons-material/AssignmentReturnOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import PaidOutlined from '@mui/icons-material/PaidOutlined';
import LocalActivityOutlined from '@mui/icons-material/LocalActivityOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import EditNoteOutlined from '@mui/icons-material/EditNoteOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import SyncAltOutlined from '@mui/icons-material/SyncAltOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import StoreOutlined from '@mui/icons-material/StoreOutlined';
import InsightsOutlined from '@mui/icons-material/InsightsOutlined';
// --- Nội dung hub icons ---
import DashboardCustomizeOutlined from '@mui/icons-material/DashboardCustomizeOutlined';
import ViewCarouselOutlined from '@mui/icons-material/ViewCarouselOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import MenuOutlined from '@mui/icons-material/MenuOutlined';
import MailOutlined from '@mui/icons-material/MailOutlined';
import PermMediaOutlined from '@mui/icons-material/PermMediaOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';

import { adminPaths } from 'src/routes/paths';
import { NAV_PERMISSIONS } from 'src/constants/permissions';

const ic = (Comp) => <Comp fontSize="small" />;

export const adminNavData = [
  {
    subheader: 'Tổng quan',
    items: [
      { title: 'Dashboard', path: adminPaths.dashboard, icon: ic(DashboardOutlined), permissions: NAV_PERMISSIONS.dashboard },
    ],
  },

  {
    subheader: 'Bán hàng',
    items: [
      { title: 'Đơn hàng',   path: adminPaths.order.root,         icon: ic(ShoppingCartOutlined),     permissions: NAV_PERMISSIONS.order },
      { title: 'Khách hàng', path: adminPaths.customer.root,      icon: ic(PeopleOutlined),           permissions: NAV_PERMISSIONS.customer },
      { title: 'Hậu mãi',    path: adminPaths.returnRequest.root, icon: ic(AssignmentReturnOutlined), permissions: NAV_PERMISSIONS.return_request },
    ],
  },

  {
    subheader: 'Catalog',
    items: [
      { title: 'Sản phẩm',          path: adminPaths.product.root,   icon: ic(Inventory2Outlined), permissions: NAV_PERMISSIONS.product },
      { title: 'Thuộc tính',        path: adminPaths.attribute.root, icon: ic(TuneOutlined),       permissions: NAV_PERMISSIONS.attribute },
      { title: 'Thương hiệu & BST', path: adminPaths.brand.root,     icon: ic(LocalOfferOutlined), permissions: NAV_PERMISSIONS.brand },
      { title: 'Giá vàng',          path: adminPaths.goldPrice.root, icon: ic(PaidOutlined),       permissions: NAV_PERMISSIONS.gold_price },
    ],
  },

  {
    subheader: 'Tồn kho',
    items: [
      { title: 'Tổng quan',           path: adminPaths.inventory.root,      icon: ic(InsightsOutlined), permissions: NAV_PERMISSIONS.inventory },
      { title: 'Theo kho',            path: adminPaths.inventory.stores,    icon: ic(StoreOutlined),    permissions: NAV_PERMISSIONS.inventory },
      { title: 'Nhật ký nhập/xuất',   path: adminPaths.inventory.movements, icon: ic(HistoryOutlined),  permissions: NAV_PERMISSIONS.inventory },
      { title: 'Nhập · Xuất · Chuyển',path: adminPaths.inventory.transfers, icon: ic(SyncAltOutlined),  permissions: NAV_PERMISSIONS.inventory },
    ],
  },

  {
    subheader: 'Marketing',
    items: [
      { title: 'Khuyến mãi', path: adminPaths.promotion.root, icon: ic(LocalActivityOutlined), permissions: NAV_PERMISSIONS.promotion },
      {
        title: 'Nội dung',
        path: adminPaths.content.root,
        icon: ic(ImageOutlined),
        permissions: NAV_PERMISSIONS.content,
        children: [
          { title: 'Tổng quan CMS',     path: adminPaths.content.root,        icon: ic(DashboardCustomizeOutlined), permissions: NAV_PERMISSIONS.content_dashboard },
          { title: 'Banner & Carousel', path: adminPaths.banner.root,          icon: ic(ViewCarouselOutlined),       permissions: NAV_PERMISSIONS.content_banner },
          { title: 'Trang chủ Builder', path: adminPaths.homeSection.root,     icon: ic(HomeOutlined),                permissions: NAV_PERMISSIONS.content_home },
          { title: 'Landing page',      path: adminPaths.landingPage.root,     icon: ic(AutoAwesomeOutlined),         permissions: NAV_PERMISSIONS.content_landing },
          { title: 'Trang tĩnh',        path: adminPaths.page.root,            icon: ic(ArticleOutlined),             permissions: NAV_PERMISSIONS.content_page },
          { title: 'Menu & Nav',        path: adminPaths.menu.root,            icon: ic(MenuOutlined),                permissions: NAV_PERMISSIONS.content_menu },
          { title: 'Thiệp điện tử',     path: adminPaths.ecardTemplate.root,   icon: ic(MailOutlined),                permissions: NAV_PERMISSIONS.content_ecard },
          { title: 'Blog',              path: adminPaths.post.root,            icon: ic(EditNoteOutlined),            permissions: NAV_PERMISSIONS.content_blog },
          { title: 'Media library',     path: adminPaths.media.root,           icon: ic(PermMediaOutlined),           permissions: NAV_PERMISSIONS.content_media },
          { title: 'Lịch chiến dịch',   path: adminPaths.campaignCalendar.root, icon: ic(CalendarMonthOutlined),      permissions: NAV_PERMISSIONS.content_calendar },
        ],
      },
    ],
  },

  {
    subheader: 'Vận hành',
    items: [
      { title: 'Thanh toán', path: adminPaths.paymentMethod.root, icon: ic(CreditCardOutlined), permissions: NAV_PERMISSIONS.payment },
      { title: 'Chi nhánh',  path: adminPaths.store.root,         icon: ic(StorefrontOutlined), permissions: NAV_PERMISSIONS.store },
    ],
  },

  {
    subheader: 'Hệ thống',
    items: [
      { title: 'Nhân sự',              path: adminPaths.admin.root,   icon: ic(AdminPanelSettingsOutlined), permissions: NAV_PERMISSIONS.admin },
      { title: 'Thông báo & cấu hình', path: adminPaths.setting.root, icon: ic(SettingsOutlined),           permissions: NAV_PERMISSIONS.setting },
    ],
  },
];

// Recursive filter: giữ item nếu match quyền, với group (có children) giữ nếu còn ít nhất 1 child match.
function filterItems(items, hasAny) {
  return items
    .map((it) => {
      if (it.children?.length) {
        const kept = filterItems(it.children, hasAny);
        if (kept.length === 0) return null;
        return { ...it, children: kept };
      }
      if (it.permissions?.length && !hasAny(it.permissions)) return null;
      return it;
    })
    .filter(Boolean);
}

export function filterNavDataByPermissions(sections, hasAny) {
  return sections
    .map((section) => {
      const items = filterItems(section.items ?? [], hasAny);
      return items.length ? { ...section, items } : null;
    })
    .filter(Boolean);
}
