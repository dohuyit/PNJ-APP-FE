// src/mock-data/index.js
// Barrel re-export + helpers paginate / filter dùng chung cho mọi action mock.
export * from './ids';
export * from './brands';
export * from './collections';
export * from './product-lines';
export * from './categories';
export * from './attributes';
export * from './attribute-sets';
export * from './size-guides';
export * from './stores';
export * from './products';
export * from './variants';
export * from './inventory';
export * from './movements';
export * from './customers';
export * from './orders';
export * from './faqs';
export * from './gold-prices';
// --- added (phase mock expansion) ---
export * from './admins';
export * from './regions';
export * from './locations';
export * from './banks';
export * from './payment-methods';
export * from './installment-plans';
export * from './payment-transactions';
export * from './promotions';
export * from './coupons';
export * from './coupon-usages';
export * from './gift-cards';
export * from './ecards';
export * from './banners';
export * from './home-sections';
export * from './landing-pages';
export * from './post-categories';
export * from './post-authors';
export * from './posts';
export * from './reviews';
export * from './return-requests';
export * from './leads';
export * from './membership-tiers';
export * from './loyalty-transactions';
export * from './wishlists';
export * from './notification-templates';
export * from './notification-logs';
export * from './activity-logs';
export * from './documents';
export * from './pages';
export * from './url-redirects';
export * from './media';
export * from './consents';
export * from './e-invoices';
export * from './dashboard';
export * from './menu-locations';
export * from './mock-auth-users';
export * from './admin-notifications';

// Chuẩn hóa response SWR hook — mock trả về đúng shape dự án đang kỳ vọng.
export function mockListResponse(items, params = {}) {
  const page = Number(params.page) || 1;
  const perPage = Number(params.perPage) || 20;
  const total = items.length;
  const start = (page - 1) * perPage;
  const paged = items.slice(start, start + perPage);
  return {
    searchResults: paged,
    searchLoading: false,
    searchError: null,
    searchValidating: false,
    searchEmpty: paged.length === 0,
    metaPage: page,
    metaPerPage: perPage,
    metaTotal: total,
    metaTotalPage: Math.ceil(total / perPage),
  };
}

// Filter helper: lọc theo key-value chính xác (string equality).
export function mockFilter(items, params = {}, allowedKeys = []) {
  return items.filter((it) =>
    allowedKeys.every((k) => {
      const v = params[k];
      if (v === undefined || v === null || v === '') return true;
      return String(it[k]) === String(v);
    })
  );
}

// Search helper: text match trên các field cho trước.
export function mockSearch(items, q, fields) {
  if (!q) return items;
  const needle = String(q).toLowerCase();
  return items.filter((it) =>
    fields.some((f) => String(it[f] ?? '').toLowerCase().includes(needle))
  );
}

export function mockFindById(items, id) {
  if (!id) return null;
  return items.find((it) => it._id === id || it.id === id) ?? null;
}
