// src/mock-data/wishlists.js
// Danh sách yêu thích — link customer + product_sku.

import { mockCustomers } from './customers';
import { PRODUCT_IDS } from './ids';

export const mockWishlists = [];

mockCustomers.slice(0, 10).forEach((c, ci) => {
  const count = 2 + (ci % 4);
  for (let i = 0; i < count; i += 1) {
    const idx = (ci * 3 + i) % PRODUCT_IDS.length;
    mockWishlists.push({
      _id: `wl-${c._id}-${idx}`,
      id: `wl-${c._id}-${idx}`,
      customer_id: c._id,
      customer_name: c.name,
      product_id: PRODUCT_IDS[idx],
      product_sku: `SKU${String(idx + 1).padStart(4, '0')}`,
      product_name: `Sản phẩm ${PRODUCT_IDS[idx]}`,
      added_at: new Date(Date.now() - (ci * 86_400_000 + i * 3600_000)).toISOString(),
      notify_on_promo: i % 2 === 0,
    });
  }
});
