// src/mock-data/brands.js
import { BRAND_IDS } from './ids';

export const mockBrands = [
  {
    _id: BRAND_IDS.PNJ, id: BRAND_IDS.PNJ, code: 'PNJ', name: 'PNJ',
    group: 'product', status: 'active', sort: 1,
    logo_url: 'https://cdn.pnj.io/mock/brand-pnj.png',
    short_description: 'Thương hiệu trang sức hàng đầu Việt Nam.',
    product_count: 1240,
    is_featured: true,
  },
  {
    _id: BRAND_IDS.STYLE, id: BRAND_IDS.STYLE, code: 'STYLE', name: 'STYLE by PNJ',
    group: 'product', status: 'active', sort: 2,
    logo_url: 'https://cdn.pnj.io/mock/brand-style.png',
    short_description: 'Dòng trang sức thời trang trẻ trung.',
    product_count: 320,
  },
  {
    _id: BRAND_IDS.MANCODE, id: BRAND_IDS.MANCODE, code: 'MANCODE', name: 'MANCODE by PNJ',
    group: 'product', status: 'active', sort: 3,
    logo_url: 'https://cdn.pnj.io/mock/brand-mancode.png',
    short_description: 'Trang sức dành cho phái mạnh.',
    product_count: 180,
    is_featured: true,
  },
  {
    _id: BRAND_IDS.DISNEY, id: BRAND_IDS.DISNEY, code: 'DISNEY', name: 'Disney | PNJ',
    group: 'partnership', status: 'active', sort: 4,
    logo_url: 'https://cdn.pnj.io/mock/brand-disney.png',
    short_description: 'BST Disney độc quyền tại PNJ.',
    product_count: 95,
  },
  {
    _id: BRAND_IDS.HEARTS_ON_FIRE, id: BRAND_IDS.HEARTS_ON_FIRE, code: 'HOF', name: 'Hearts On Fire',
    group: 'partnership', status: 'active', sort: 5,
    logo_url: 'https://cdn.pnj.io/mock/brand-hof.png',
    short_description: 'Kim cương Mỹ cao cấp.',
    product_count: 42,
  },
  {
    _id: BRAND_IDS.RADO, id: BRAND_IDS.RADO, code: 'RADO', name: 'Rado',
    group: 'watch_maker', status: 'active', sort: 6,
    logo_url: 'https://cdn.pnj.io/mock/brand-rado.png',
    short_description: 'Đồng hồ Thuỵ Sĩ.',
    product_count: 68,
  },
  {
    _id: BRAND_IDS.ARTA, id: BRAND_IDS.ARTA, code: 'ARTA', name: 'ARTA by PNJ',
    group: 'product', status: 'active', sort: 7,
    logo_url: 'https://cdn.pnj.io/mock/brand-arta.png',
    short_description: 'Nghệ thuật chế tác thủ công.',
    product_count: 76,
  },
];
