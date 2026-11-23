// src/mock-data/inventory.js
// Tồn kho: variants × stores (subset). KPI + top-low + recent movements.
import { mockVariants } from './variants';
import { mockProducts } from './products';
import { mockStores } from './stores';
import { STORE_IDS, ATTRIBUTE_IDS } from './ids';

const activeStores = mockStores.filter((s) => s.status === 'active');

// Mỗi variant có tồn ở 4-6 cửa hàng ngẫu nhiên (deterministic theo index).
export const mockInventory = [];

mockVariants.forEach((v, idx) => {
  const product = mockProducts.find((p) => p._id === v.product_id);
  const storeCount = 4 + (idx % 3);
  for (let i = 0; i < storeCount; i += 1) {
    const store = activeStores[(idx + i) % activeStores.length];
    const onHand = (idx * 3 + i * 7 + 1) % 30;
    const reserved = (idx + i) % 4;
    const available = Math.max(0, onHand - reserved);
    // Variant label — ghép từ attribute_values đọc được.
    const variantLabel = Object.entries(v.attribute_values ?? {})
      .map(([k, val]) => val)
      .join(' · ') || 'Mặc định';

    mockInventory.push({
      _id: `${v._id}@${store._id}`, id: `${v._id}@${store._id}`,
      product_id: product?._id,
      product_name: product?.name,
      product_line_id: product?.product_line_id,
      variant_id: v._id,
      variant_label: variantLabel,
      sku: v.sku,
      store_id: store._id,
      store_name: store.name,
      store_code: store.code,
      qty_on_hand: onHand,
      qty_reserved: reserved,
      available,
      synced_at: new Date(Date.now() - (idx * 1000 * 60 * 15 + i * 1000 * 60 * 3)).toISOString(),
      synced_source: i % 2 === 0 ? 'POS' : 'ERP',
    });
  }
});

// Top SKU sắp hết (available ≤ 5)
export const mockTopLowStock = mockInventory
  .filter((r) => r.available > 0 && r.available <= 5)
  .slice(0, 10);

// KPI summary
const totalSkus = new Set(mockInventory.map((r) => r.sku)).size;
const outOfStockCount = mockInventory.filter((r) => r.available === 0).length;
const lowStockCount = mockInventory.filter((r) => r.available > 0 && r.available <= 5).length;
const totalValue = mockInventory.reduce((sum, r) => {
  const v = mockVariants.find((x) => x._id === r.variant_id);
  return sum + (v?.price ?? 0) * r.qty_on_hand;
}, 0);

export const mockInventorySummary = {
  total_skus: totalSkus,
  out_of_stock_count: outOfStockCount,
  low_stock_count: lowStockCount,
  total_value: totalValue,
  top_low_stock: mockTopLowStock.map((r) => ({
    sku: r.sku,
    product_name: r.product_name,
    store_id: r.store_id,
    store_name: r.store_name,
    available: r.available,
  })),
  recent_movements: [], // điền từ movements.js
};
