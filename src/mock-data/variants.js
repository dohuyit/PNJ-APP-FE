// src/mock-data/variants.js
// Sinh variants = cartesian product cho mỗi SP dựa trên attribute-set.
// Shape: { product_id, sku, attribute_values: { axis_code: value }, price, total_stock, is_default }
import { mockProducts } from './products';
import { mockAttributeSets } from './attribute-sets';

function axesForSet(setId) {
  const set = mockAttributeSets.find((s) => s._id === setId);
  if (!set) return [];
  return set.attributes
    .filter((a) => a.is_variant)
    .map((row) => ({
      code: row.attribute?.code,
      name: row.attribute?.name,
      options: row.attribute?.options ?? [],
    }));
}

function cartesian(lists) {
  if (lists.some((l) => l.length === 0)) return [];
  return lists.reduce(
    (acc, list) => acc.flatMap((prev) => list.map((cur) => ({ ...prev, ...cur }))),
    [{}]
  );
}

// Pick subset of options → không nhân tổ hợp quá lớn.
function pickSubset(options, max) {
  if (options.length <= max) return options;
  const stride = Math.ceil(options.length / max);
  return options.filter((_, i) => i % stride === 0).slice(0, max);
}

export const mockVariants = [];

mockProducts.forEach((p, idx) => {
  const axes = axesForSet(p.attribute_set_id);
  if (axes.length === 0) {
    // SP đơn — 1 variant
    mockVariants.push({
      _id: `${p._id}-v1`, id: `${p._id}-v1`,
      product_id: p._id,
      sku: p.display_code,
      attribute_values: {},
      price: p.sale_price,
      compare_at_price: p.compare_at_price ?? null,
      total_stock: 20 + (idx * 3) % 40,
      is_default: true,
    });
    return;
  }

  // Giới hạn 2 option / axis để variants khống bùng (demo).
  const lists = axes.map((a) => pickSubset(a.options, 2).map((o) => ({ [a.code]: o.value ?? o })));
  const combos = cartesian(lists);
  combos.forEach((values, i) => {
    const skuSuffix = Object.values(values).join('-');
    mockVariants.push({
      _id: `${p._id}-v${i + 1}`, id: `${p._id}-v${i + 1}`,
      product_id: p._id,
      sku: `${p.display_code}-${skuSuffix}`,
      attribute_values: values,
      price: p.sale_price + i * 500_000,
      compare_at_price: p.compare_at_price ? p.compare_at_price + i * 500_000 : null,
      total_stock: 5 + (idx + i * 2) % 40,
      is_default: i === 0,
    });
  });
});
