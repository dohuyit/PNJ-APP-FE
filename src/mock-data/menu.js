// src/mock-data/menu.js
// Navigation menus seeded khớp pnj.com.vn: 3 mega (Nữ/Nam/Trẻ em) + 3 footer + 1 mobile + 1 header_top.
// Data shape dành cho mega-menu builder (primary items + multi-column panels + service callouts).

// ───────────────────────── Locations ─────────────────────────

export const menuLocations = [
  { id: 'loc-ht',  location: 'header_top',     label: 'Header trên',       item_count: 4,  is_active: true },
  { id: 'loc-mf',  location: 'mega_female',    label: 'Mega menu · Nữ',    item_count: 8,  is_active: true },
  { id: 'loc-mm',  location: 'mega_male',      label: 'Mega menu · Nam',   item_count: 7,  is_active: true },
  { id: 'loc-mk',  location: 'mega_kids',      label: 'Mega menu · Trẻ em', item_count: 6, is_active: true },
  { id: 'loc-fa',  location: 'footer_about',   label: 'Chân trang · Về PNJ', item_count: 5, is_active: true },
  { id: 'loc-fs',  location: 'footer_service', label: 'Chân trang · Dịch vụ', item_count: 6, is_active: true },
  { id: 'loc-fp',  location: 'footer_policy',  label: 'Chân trang · Chính sách', item_count: 5, is_active: true },
  { id: 'loc-mb',  location: 'mobile',         label: 'Mobile drawer',      item_count: 8, is_active: true },
];

// ───────────────────────── Service callouts ─────────────────────────
// Dải 3 ô nổi bật ở đáy mega-panel (MIỄN PHÍ 3H · PHỤC VỤ 24/7 · THU ĐỔI 48H)

export const serviceCallouts = [
  { id: 'sc-fast', icon: 'solar:delivery-bold',     color: '#F59E0B', label: 'MIỄN PHÍ', sub_label: 'Giao hàng 3H', url: '/dich-vu/giao-nhanh' },
  { id: 'sc-24',   icon: 'solar:headphones-round-bold', color: '#EF4444', label: 'PHỤC VỤ', sub_label: '24/7',       url: '/lien-he' },
  { id: 'sc-48',   icon: 'solar:box-bold',          color: '#10B981', label: 'THU ĐỔI', sub_label: '48 giờ',       url: '/dich-vu/thu-doi' },
];

// ───────────────────────── Primary items per mega location ─────────────────────────
// Mỗi primary có mega panel riêng. `panel.columns[]` gồm các cột; mỗi entry kind:
// - 'text'       : {label, url, badge?}
// - 'brand_chip' : {brand_slug, label, logo_url, url}
// - 'co_brand'   : {partner_name, logo_url, url}

const primaryFemale = [
  {
    id: 'pf-brand',
    label: 'Thương Hiệu',
    icon: 'solar:crown-minimalistic-bold',
    url: '/thuong-hieu',
    sort: 1,
    badge: null,
    panel: null, // mở trang hub, không mega-panel
  },
  {
    id: 'pf-new',
    label: 'Hàng Mới',
    icon: 'solar:star-bold',
    url: '/hang-moi',
    sort: 2,
    badge: { text: 'NEW', color: '#EF4444' },
    panel: null,
  },
  {
    id: 'pf-jewelry',
    label: 'Trang Sức',
    icon: 'solar:diamond-bold',
    url: '/trang-suc',
    sort: 3,
    badge: null,
    panel: {
      kind: 'multi_column',
      banner: {
        image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85',
        eyebrow: 'BỘ SƯU TẬP MỚI',
        title: 'Tuyển Tập Kim Cương',
        subtitle: 'Ánh sáng của một đời',
        cta_label: 'Khám phá ngay',
        cta_url: '/bo-suu-tap/kim-cuong',
        cta_color: '#003468',
        position: 'right',
        width_pct: 36,
      },
      columns: [
        {
          id: 'col-type',
          heading: 'Chủng Loại',
          heading_icon: 'solar:tag-horizontal-linear',
          entries: [
            { kind: 'text', id: 'e1',  label: 'Nhẫn',               url: '/nhan' },
            { kind: 'text', id: 'e2',  label: 'Dây chuyền',          url: '/day-chuyen' },
            { kind: 'text', id: 'e3',  label: 'Mặt dây chuyền',     url: '/mat-day-chuyen' },
            { kind: 'text', id: 'e4',  label: 'Bông tai',           url: '/bong-tai' },
            { kind: 'text', id: 'e5',  label: 'Lắc',                url: '/lac' },
            { kind: 'text', id: 'e6',  label: 'Charm',              url: '/charm' },
            { kind: 'text', id: 'e7',  label: 'Vòng tay',           url: '/vong-tay' },
            { kind: 'text', id: 'e8',  label: 'Dây cổ',             url: '/day-co' },
            { kind: 'text', id: 'e9',  label: 'Kiềng',              url: '/kieng' },
            { kind: 'text', id: 'e10', label: 'Vàng kỷ niệm',       url: '/vang-ky-niem' },
          ],
        },
        {
          id: 'col-line',
          heading: 'Dòng Hàng',
          heading_icon: 'solar:diamond-linear',
          entries: [
            { kind: 'text', id: 'l1',  label: 'Trang sức kim cương',   url: '/trang-suc-kim-cuong' },
            { kind: 'text', id: 'l2',  label: 'Trang sức ECZ',         url: '/trang-suc-ecz' },
            { kind: 'text', id: 'l3',  label: 'Trang sức công nghệ Ý', url: '/trang-suc-cong-nghe-y' },
            { kind: 'text', id: 'l4',  label: 'Trang sức vỏ',          url: '/trang-suc-vo' },
            { kind: 'text', id: 'l5',  label: 'Trang sức không gắn đá', url: '/trang-suc-khong-gan-da' },
            { kind: 'text', id: 'l6',  label: 'Trang sức đá màu',      url: '/trang-suc-da-mau' },
            { kind: 'text', id: 'l7',  label: 'Trang sức CZ',          url: '/trang-suc-cz' },
            { kind: 'text', id: 'l8',  label: 'Trang sức ngọc trai',   url: '/trang-suc-ngoc-trai' },
            { kind: 'text', id: 'l9',  label: 'Kim cương Viên',        url: '/kim-cuong-vien' },
            { kind: 'text', id: 'l10', label: 'Quà tặng sưu tầm',      url: '/qua-tang-suu-tam' },
          ],
        },
        {
          id: 'col-material',
          heading: 'Chất Liệu',
          heading_icon: 'solar:palette-linear',
          entries: [
            { kind: 'text', id: 'm1', label: 'Vàng',     url: '/chat-lieu-vang' },
            { kind: 'text', id: 'm2', label: 'Bạc',      url: '/chat-lieu-bac' },
            { kind: 'text', id: 'm3', label: 'Platinum', url: '/chat-lieu-platinum' },
          ],
        },
        {
          id: 'col-trend',
          heading: 'Xu Hướng',
          heading_icon: 'solar:fire-linear',
          entries: [
            { kind: 'text', id: 't1', label: 'Trang Sức Phong Thủy', url: '/trang-suc-phong-thuy' },
            { kind: 'text', id: 't2', label: 'Trang sức Tín ngưỡng',  url: '/trang-suc-tin-nguong' },
            { kind: 'text', id: 't3', label: 'Hàng đặt trước',         url: '/hang-dat-truoc' },
          ],
        },
        {
          id: 'col-brand',
          heading: 'Thương Hiệu',
          heading_icon: 'solar:crown-minimalistic-linear',
          entries: [
            { kind: 'brand_chip', id: 'b1', brand_slug: 'pnj',   label: 'PNJ',          logo_url: '/logo/brand-pnj.svg',   url: '/thuong-hieu/pnj' },
            { kind: 'brand_chip', id: 'b2', brand_slug: 'style', label: 'STYLE by PNJ', logo_url: '/logo/brand-style.svg', url: '/thuong-hieu/style' },
            { kind: 'brand_chip', id: 'b3', brand_slug: 'arta',  label: 'ARTA by PNJ',  logo_url: '/logo/brand-arta.svg',  url: '/thuong-hieu/arta' },
          ],
        },
        {
          id: 'col-cobrand',
          heading: 'Dòng Hàng Hợp Tác Quốc Tế',
          heading_icon: 'solar:hand-shake-linear',
          entries: [
            { kind: 'co_brand', id: 'cb1', partner_name: 'Disney',      logo_url: '/logo/cobrand-disney.svg',     url: '/co-brand/disney-pnj' },
            { kind: 'co_brand', id: 'cb2', partner_name: 'Hello Kitty', logo_url: '/logo/cobrand-hellokitty.svg', url: '/co-brand/pnj-hellokitty' },
            { kind: 'co_brand', id: 'cb3', partner_name: 'Doraemon',    logo_url: '/logo/cobrand-doraemon.svg',   url: '/co-brand/doraemon-pnj' },
            { kind: 'co_brand', id: 'cb4', partner_name: 'emoji',       logo_url: '/logo/cobrand-emoji.svg',      url: '/co-brand/pnj-emoji' },
            { kind: 'co_brand', id: 'cb5', partner_name: 'Kuromi',      logo_url: '/logo/cobrand-kuromi.svg',     url: '/co-brand/pnj-kuromi' },
          ],
        },
      ],
      service_callouts: ['sc-fast', 'sc-24', 'sc-48'],
    },
  },
  {
    id: 'pf-wedding',
    label: 'Trang Sức Cưới',
    icon: 'solar:hearts-bold',
    url: '/trang-suc-cuoi',
    sort: 4,
    badge: null,
    panel: {
      kind: 'multi_column',
      banner: {
        image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85',
        eyebrow: 'BỘ SƯU TẬP TRANG SỨC CƯỚI',
        title: 'Lá Ngọc Cành Vàng',
        subtitle: 'Để thương yêu. Để nâng niu.',
        cta_label: 'KHÁM PHÁ NGAY',
        cta_url: '/bo-suu-tap/la-ngoc-canh-vang',
        cta_color: '#1A8F4C',
        position: 'right',
        width_pct: 42,
      },
      columns: [
        {
          id: 'col-w-journey',
          heading: 'Dành cho dịp',
          heading_icon: 'solar:heart-bold',
          entries: [
            { kind: 'text', id: 'w1', label: 'Cầu Hôn',   url: '/trang-suc-cuoi/cau-hon' },
            { kind: 'text', id: 'w2', label: 'Kết Hôn',   url: '/trang-suc-cuoi/ket-hon' },
            { kind: 'text', id: 'w3', label: 'Kỷ Niệm',   url: '/trang-suc-cuoi/ky-niem' },
          ],
        },
        {
          id: 'col-w-item',
          heading: 'Loại trang sức',
          heading_icon: 'solar:diamond-linear',
          entries: [
            { kind: 'text', id: 'wi1', label: 'Cặp nhẫn cưới',  url: '/trang-suc-cuoi/cap-nhan-cuoi' },
            { kind: 'text', id: 'wi2', label: 'Nhẫn cầu hôn',   url: '/trang-suc-cuoi/nhan-cau-hon' },
            { kind: 'text', id: 'wi3', label: 'Trang sức cô dâu', url: '/trang-suc-cuoi/trang-suc-co-dau' },
            { kind: 'text', id: 'wi4', label: 'Nhẫn Kim cương',  url: '/trang-suc-cuoi/nhan-kim-cuong' },
            { kind: 'text', id: 'wi5', label: 'Bông Tai',        url: '/trang-suc-cuoi/bong-tai' },
            { kind: 'text', id: 'wi6', label: 'Mặt Dây Chuyền',  url: '/trang-suc-cuoi/mat-day-chuyen' },
          ],
        },
        {
          id: 'col-w-collection',
          heading: 'Bộ Sưu Tập Cưới',
          heading_icon: 'solar:book-bookmark-linear',
          entries: [
            { kind: 'text', id: 'wc1', label: 'Lá Ngọc Cành Vàng PNJ', url: '/bo-suu-tap/la-ngoc-canh-vang', badge: 'NEW' },
            { kind: 'text', id: 'wc2', label: 'Trầu Cau PNJ',           url: '/bo-suu-tap/trau-cau',          badge: 'NEW' },
            { kind: 'text', id: 'wc3', label: 'Nhẫn Cưới Phu Thê',      url: '/bo-suu-tap/nhan-cuoi-phu-the' },
            { kind: 'text', id: 'wc4', label: 'Nhẫn Cưới Tơ Hồng',      url: '/bo-suu-tap/nhan-cuoi-to-hong' },
            { kind: 'text', id: 'wc5', label: 'The Heart of Gold',       url: '/bo-suu-tap/the-heart-of-gold' },
            { kind: 'text', id: 'wc6', label: 'Nhẫn Cầu Hôn Only You',  url: '/bo-suu-tap/nhan-cau-hon-only-you' },
          ],
        },
      ],
      service_callouts: ['sc-fast', 'sc-24', 'sc-48'],
    },
  },
  {
    id: 'pf-watch',
    label: 'Đồng Hồ',
    icon: 'solar:clock-circle-bold',
    url: '/dong-ho',
    sort: 5,
    badge: null,
    panel: null,
  },
  {
    id: 'pf-promo',
    label: 'Khuyến Mãi',
    icon: 'solar:tag-price-bold',
    url: '/khuyen-mai',
    sort: 6,
    badge: { text: '%', color: '#DC2626' },
    panel: null,
  },
  {
    id: 'pf-service',
    label: 'Dịch Vụ',
    icon: 'solar:settings-bold',
    url: '/dich-vu',
    sort: 7,
    badge: null,
    panel: {
      kind: 'multi_column',
      banner: {
        image_url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=85',
        eyebrow: 'DỊCH VỤ NỔI BẬT',
        title: 'Trả Góp 0%',
        subtitle: 'Thẻ quốc tế · 12 tháng',
        cta_label: 'TÌM HIỂU',
        cta_url: '/dich-vu/tra-gop',
        cta_color: '#AD2A36',
        position: 'right',
        width_pct: 32,
      },
      columns: [
        {
          id: 'col-s-care',
          heading: 'Chăm sóc trang sức',
          heading_icon: 'solar:shield-check-linear',
          entries: [
            { kind: 'text', id: 's1', label: 'Thu đổi 48h', url: '/dich-vu/thu-doi' },
            { kind: 'text', id: 's2', label: 'Khắc chữ',    url: '/dich-vu/khac-chu' },
            { kind: 'text', id: 's3', label: 'Đo size nhẫn', url: '/dich-vu/do-size' },
            { kind: 'text', id: 's4', label: 'Làm sạch & đánh bóng', url: '/dich-vu/lam-sach' },
          ],
        },
        {
          id: 'col-s-payment',
          heading: 'Thanh toán',
          heading_icon: 'solar:wallet-linear',
          entries: [
            { kind: 'text', id: 's5', label: 'Trả góp 0%',            url: '/dich-vu/tra-gop' },
            { kind: 'text', id: 's6', label: 'Phiếu quà tặng',         url: '/dich-vu/phieu-qua-tang' },
            { kind: 'text', id: 's7', label: 'Loyalty — Khách thân thiết', url: '/dich-vu/khach-than-thiet' },
          ],
        },
        {
          id: 'col-s-gold',
          heading: 'Giá vàng · Kiểm định',
          heading_icon: 'solar:scale-linear',
          entries: [
            { kind: 'text', id: 's8',  label: 'Bảng giá vàng hôm nay', url: '/dich-vu/gia-vang' },
            { kind: 'text', id: 's9',  label: 'Chứng nhận GIA',          url: '/dich-vu/gia' },
            { kind: 'text', id: 's10', label: 'Mua lại vàng — Buy-back', url: '/dich-vu/mua-lai' },
          ],
        },
      ],
      service_callouts: ['sc-fast', 'sc-24', 'sc-48'],
    },
  },
  {
    id: 'pf-blog',
    label: 'Blog',
    icon: 'solar:chat-round-dots-bold',
    url: '/blog',
    sort: 8,
    badge: null,
    panel: null,
  },
];

// Nam gần giống Nữ nhưng ít dòng hàng có ngọc trai + bỏ "Cưới" riêng
const primaryMale = [
  { id: 'pm-brand',   label: 'Thương Hiệu', icon: 'solar:crown-minimalistic-bold', url: '/nam/thuong-hieu', sort: 1, badge: null, panel: null },
  { id: 'pm-new',     label: 'Hàng Mới',    icon: 'solar:star-bold',               url: '/nam/hang-moi',    sort: 2, badge: { text: 'NEW', color: '#EF4444' }, panel: null },
  {
    id: 'pm-jewelry',
    label: 'Trang Sức Nam',
    icon: 'solar:diamond-bold',
    url: '/nam/trang-suc',
    sort: 3,
    badge: null,
    panel: {
      kind: 'multi_column',
      columns: [
        {
          id: 'mcol-type',
          heading: 'Chủng Loại',
          heading_icon: 'solar:tag-horizontal-linear',
          entries: [
            { kind: 'text', id: 'nm1', label: 'Nhẫn',       url: '/nam/nhan' },
            { kind: 'text', id: 'nm2', label: 'Dây chuyền', url: '/nam/day-chuyen' },
            { kind: 'text', id: 'nm3', label: 'Lắc',        url: '/nam/lac' },
            { kind: 'text', id: 'nm4', label: 'Vòng tay',   url: '/nam/vong-tay' },
            { kind: 'text', id: 'nm5', label: 'Dây cổ',     url: '/nam/day-co' },
            { kind: 'text', id: 'nm6', label: 'Mặt dây',    url: '/nam/mat-day' },
          ],
        },
        {
          id: 'mcol-line',
          heading: 'Dòng Hàng',
          heading_icon: 'solar:diamond-linear',
          entries: [
            { kind: 'text', id: 'nml1', label: 'Trang sức kim cương', url: '/nam/trang-suc-kim-cuong' },
            { kind: 'text', id: 'nml2', label: 'Trang sức Ý',         url: '/nam/trang-suc-y' },
            { kind: 'text', id: 'nml3', label: 'Vàng không gắn đá',   url: '/nam/vang-khong-gan-da' },
          ],
        },
        {
          id: 'mcol-material',
          heading: 'Chất Liệu',
          heading_icon: 'solar:palette-linear',
          entries: [
            { kind: 'text', id: 'nmm1', label: 'Vàng',     url: '/nam/vang' },
            { kind: 'text', id: 'nmm2', label: 'Bạc',      url: '/nam/bac' },
            { kind: 'text', id: 'nmm3', label: 'Platinum', url: '/nam/platinum' },
          ],
        },
        {
          id: 'mcol-brand',
          heading: 'Thương Hiệu',
          heading_icon: 'solar:crown-minimalistic-linear',
          entries: [
            { kind: 'brand_chip', id: 'nmb1', brand_slug: 'pnj',   label: 'PNJ',       logo_url: '/logo/brand-pnj.svg',   url: '/nam/thuong-hieu/pnj' },
            { kind: 'brand_chip', id: 'nmb2', brand_slug: 'arta',  label: 'ARTA',      logo_url: '/logo/brand-arta.svg',  url: '/nam/thuong-hieu/arta' },
          ],
        },
      ],
      service_callouts: ['sc-fast', 'sc-24', 'sc-48'],
    },
  },
  { id: 'pm-watch',   label: 'Đồng Hồ',       icon: 'solar:clock-circle-bold',    url: '/nam/dong-ho',   sort: 4, badge: null, panel: null },
  { id: 'pm-promo',   label: 'Khuyến Mãi',    icon: 'solar:tag-price-bold',       url: '/nam/khuyen-mai', sort: 5, badge: { text: '%', color: '#DC2626' }, panel: null },
  { id: 'pm-service', label: 'Dịch Vụ',       icon: 'solar:settings-bold',        url: '/nam/dich-vu',    sort: 6, badge: null, panel: null },
  { id: 'pm-blog',    label: 'Blog',          icon: 'solar:chat-round-dots-bold', url: '/blog',           sort: 7, badge: null, panel: null },
];

// Trẻ em: gọn hơn, chủ yếu quà tặng + charm + sưu tầm
const primaryKids = [
  { id: 'pk-new',     label: 'Hàng Mới',     icon: 'solar:star-bold',            url: '/tre-em/hang-moi', sort: 1, badge: { text: 'NEW', color: '#EF4444' }, panel: null },
  {
    id: 'pk-jewelry',
    label: 'Trang Sức Trẻ Em',
    icon: 'solar:diamond-bold',
    url: '/tre-em/trang-suc',
    sort: 2,
    badge: null,
    panel: {
      kind: 'multi_column',
      columns: [
        {
          id: 'kcol-type',
          heading: 'Chủng Loại',
          heading_icon: 'solar:tag-horizontal-linear',
          entries: [
            { kind: 'text', id: 'k1', label: 'Lắc chân', url: '/tre-em/lac-chan' },
            { kind: 'text', id: 'k2', label: 'Vòng tay', url: '/tre-em/vong-tay' },
            { kind: 'text', id: 'k3', label: 'Bông tai', url: '/tre-em/bong-tai' },
            { kind: 'text', id: 'k4', label: 'Charm',    url: '/tre-em/charm' },
          ],
        },
        {
          id: 'kcol-cobrand',
          heading: 'Co-brand',
          heading_icon: 'solar:hand-shake-linear',
          entries: [
            { kind: 'co_brand', id: 'kcb1', partner_name: 'Disney',      logo_url: '/logo/cobrand-disney.svg',     url: '/co-brand/disney-pnj' },
            { kind: 'co_brand', id: 'kcb2', partner_name: 'Hello Kitty', logo_url: '/logo/cobrand-hellokitty.svg', url: '/co-brand/pnj-hellokitty' },
          ],
        },
        {
          id: 'kcol-gift',
          heading: 'Quà tặng',
          heading_icon: 'solar:gift-bold',
          entries: [
            { kind: 'text', id: 'kg1', label: 'Quà tặng sưu tầm',   url: '/tre-em/qua-tang-suu-tam' },
            { kind: 'text', id: 'kg2', label: 'Set quà sinh nhật',  url: '/tre-em/sinh-nhat' },
          ],
        },
      ],
      service_callouts: ['sc-fast', 'sc-24', 'sc-48'],
    },
  },
  { id: 'pk-promo',   label: 'Khuyến Mãi', icon: 'solar:tag-price-bold',       url: '/tre-em/khuyen-mai', sort: 3, badge: { text: '%', color: '#DC2626' }, panel: null },
  { id: 'pk-blog',    label: 'Blog · Trẻ em', icon: 'solar:chat-round-dots-bold', url: '/blog/tre-em', sort: 4, badge: null, panel: null },
];

// Header top (Câu chuyện · Quan hệ cổ đông · Cửa hàng · Tuyển dụng)
const primaryHeaderTop = [
  { id: 'ht1', label: 'Câu Chuyện PNJ',    icon: 'solar:book-bookmark-linear', url: '/cau-chuyen-pnj',    sort: 1, badge: null, panel: null },
  { id: 'ht2', label: 'Quan Hệ Cổ Đông (IR)', icon: 'solar:graph-up-linear',     url: '/quan-he-co-dong', sort: 2, badge: null, panel: null },
  { id: 'ht3', label: 'Cửa Hàng',          icon: 'solar:shop-linear',          url: '/cua-hang',          sort: 3, badge: null, panel: null },
  { id: 'ht4', label: 'Tuyển dụng',        icon: 'solar:case-round-linear',    url: '/tuyen-dung',        sort: 4, badge: null, panel: null },
];

// Footer menus (flat, no mega panel)
const footerAbout = [
  { id: 'fa1', label: 'Về PNJ',             icon: null, url: '/cau-chuyen-pnj',     sort: 1, badge: null, panel: null },
  { id: 'fa2', label: 'Giải thưởng',         icon: null, url: '/giai-thuong',        sort: 2, badge: null, panel: null },
  { id: 'fa3', label: 'ESG · Phát triển bền vững', icon: null, url: '/esg',          sort: 3, badge: null, panel: null },
  { id: 'fa4', label: 'Quan hệ cổ đông',     icon: null, url: '/quan-he-co-dong',    sort: 4, badge: null, panel: null },
  { id: 'fa5', label: 'Tuyển dụng',          icon: null, url: '/tuyen-dung',         sort: 5, badge: null, panel: null },
];

const footerService = [
  { id: 'fs1', label: 'PNJ Fast · Giao 3H',    icon: null, url: '/dich-vu/giao-nhanh', sort: 1, badge: null, panel: null },
  { id: 'fs2', label: 'Thu đổi 48 giờ',         icon: null, url: '/dich-vu/thu-doi',    sort: 2, badge: null, panel: null },
  { id: 'fs3', label: 'Trả góp 0%',             icon: null, url: '/dich-vu/tra-gop',    sort: 3, badge: null, panel: null },
  { id: 'fs4', label: 'Khắc chữ · đánh bóng',   icon: null, url: '/dich-vu/khac-chu',   sort: 4, badge: null, panel: null },
  { id: 'fs5', label: 'Chứng nhận GIA',         icon: null, url: '/dich-vu/gia',        sort: 5, badge: null, panel: null },
  { id: 'fs6', label: 'Khách thân thiết',       icon: null, url: '/khach-than-thiet',   sort: 6, badge: null, panel: null },
];

const footerPolicy = [
  { id: 'fp1', label: 'Điều khoản sử dụng',    icon: null, url: '/dieu-khoan',          sort: 1, badge: null, panel: null },
  { id: 'fp2', label: 'Chính sách bảo mật',     icon: null, url: '/chinh-sach-bao-mat',  sort: 2, badge: null, panel: null },
  { id: 'fp3', label: 'Chính sách đổi trả',     icon: null, url: '/chinh-sach-doi-tra',  sort: 3, badge: null, panel: null },
  { id: 'fp4', label: 'Chính sách bảo hành',    icon: null, url: '/chinh-sach-bao-hanh', sort: 4, badge: null, panel: null },
  { id: 'fp5', label: 'Hướng dẫn mua hàng',    icon: null, url: '/huong-dan-mua-hang',  sort: 5, badge: null, panel: null },
];

// Mobile = chỉ dùng Nữ gọn
const primaryMobile = primaryFemale.map((it) => ({ ...it, panel: null }));

// ───────────────────────── Index by location ─────────────────────────

export const menuTreeByLocation = {
  header_top:     primaryHeaderTop,
  mega_female:    primaryFemale,
  mega_male:      primaryMale,
  mega_kids:      primaryKids,
  footer_about:   footerAbout,
  footer_service: footerService,
  footer_policy:  footerPolicy,
  mobile:         primaryMobile,
};

// Helper: lấy mega-panel của 1 primary item theo (location, primaryId)
export function getMegaPanel(location, primaryId) {
  const tree = menuTreeByLocation[location] ?? [];
  const item = tree.find((it) => it.id === primaryId);
  return item?.panel ?? null;
}

// Helper: resolve service callout objects from id list
export function resolveCallouts(idList = []) {
  return idList.map((id) => serviceCallouts.find((c) => c.id === id)).filter(Boolean);
}
