// src/mock-data/categories.js
// Tree phân cấp: Trang sức > {Nhẫn (> KC, Vàng), Dây chuyền, Vòng/lắc, Hoa tai}, Đồng hồ, Kim cương viên, Quà tặng.
import { CATEGORY_IDS } from './ids';

export const mockCategories = [
  {
    _id: CATEGORY_IDS.TRANG_SUC, id: CATEGORY_IDS.TRANG_SUC,
    name: 'Trang sức', slug: 'trang-suc', parent_id: null,
    sort: 1, status: 'active', product_count: 820,
    children: [
      {
        _id: CATEGORY_IDS.NHAN, id: CATEGORY_IDS.NHAN,
        name: 'Nhẫn', slug: 'nhan', parent_id: CATEGORY_IDS.TRANG_SUC,
        sort: 1, status: 'active', product_count: 320,
        children: [
          {
            _id: CATEGORY_IDS.NHAN_KIM_CUONG, id: CATEGORY_IDS.NHAN_KIM_CUONG,
            name: 'Nhẫn kim cương', slug: 'nhan-kim-cuong', parent_id: CATEGORY_IDS.NHAN,
            sort: 1, status: 'active', product_count: 120, children: [],
          },
          {
            _id: CATEGORY_IDS.NHAN_VANG, id: CATEGORY_IDS.NHAN_VANG,
            name: 'Nhẫn vàng', slug: 'nhan-vang', parent_id: CATEGORY_IDS.NHAN,
            sort: 2, status: 'active', product_count: 200, children: [],
          },
        ],
      },
      {
        _id: CATEGORY_IDS.DAY_CHUYEN, id: CATEGORY_IDS.DAY_CHUYEN,
        name: 'Dây chuyền', slug: 'day-chuyen', parent_id: CATEGORY_IDS.TRANG_SUC,
        sort: 2, status: 'active', product_count: 178, children: [],
      },
      {
        _id: CATEGORY_IDS.VONG_LAC, id: CATEGORY_IDS.VONG_LAC,
        name: 'Vòng · Lắc', slug: 'vong-lac', parent_id: CATEGORY_IDS.TRANG_SUC,
        sort: 3, status: 'active', product_count: 156, children: [],
      },
      {
        _id: CATEGORY_IDS.HOA_TAI, id: CATEGORY_IDS.HOA_TAI,
        name: 'Hoa tai', slug: 'hoa-tai', parent_id: CATEGORY_IDS.TRANG_SUC,
        sort: 4, status: 'active', product_count: 134, children: [],
      },
    ],
  },
  {
    _id: CATEGORY_IDS.DONG_HO, id: CATEGORY_IDS.DONG_HO,
    name: 'Đồng hồ', slug: 'dong-ho', parent_id: null,
    sort: 2, status: 'active', product_count: 68, children: [],
  },
  {
    _id: CATEGORY_IDS.KIM_CUONG_VIEN, id: CATEGORY_IDS.KIM_CUONG_VIEN,
    name: 'Kim cương viên', slug: 'kim-cuong-vien', parent_id: null,
    sort: 3, status: 'active', product_count: 36, children: [],
  },
  {
    _id: CATEGORY_IDS.QUA_TANG, id: CATEGORY_IDS.QUA_TANG,
    name: 'Quà tặng', slug: 'qua-tang', parent_id: null,
    sort: 4, status: 'active', product_count: 92, children: [],
  },
];

// Flatten → dùng cho list view.
function flatten(nodes, acc = []) {
  nodes.forEach((n) => {
    acc.push({ ...n, has_children: !!n.children?.length });
    if (n.children?.length) flatten(n.children, acc);
  });
  return acc;
}
export const mockCategoriesFlat = flatten(mockCategories).map(({ children, ...rest }) => rest);
