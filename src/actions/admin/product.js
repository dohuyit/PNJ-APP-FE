// Product — /api/v1/commerce/product/*
// ⚠️ MOCK MODE
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import { mockProducts, mockListResponse, mockSearch } from 'src/mock-data';

export const CONST_PRODUCT_STATUS = [
    { id: 'draft', label: 'Nháp', color: 'default' },
    { id: 'active', label: 'Đang hoạt động', color: 'success' },
    { id: 'inactive', label: 'Tạm ẩn', color: 'warning' },
    { id: 'out_of_stock', label: 'Hết hàng', color: 'error' },
];

export const CONST_PRODUCT_TYPE = [
    { id: 'jewelry', label: 'Trang sức' },
    { id: 'watch', label: 'Đồng hồ' },
    { id: 'diamond', label: 'Kim cương' },
    { id: 'gift', label: 'Quà tặng' },
    { id: 'egift', label: 'eGift' },
    { id: 'collectible', label: 'Sưu tầm' },
];

export const CONST_PRODUCT_AUDIENCE = [
    { id: 'female', label: 'Nữ' },
    { id: 'male', label: 'Nam' },
    { id: 'kids', label: 'Trẻ em' },
    { id: 'unisex', label: 'Unisex' },
];

export const CONST_PRODUCT_PRICING_MODE = [
    { id: 'fixed', label: 'Giá cố định' },
    { id: 'by_gold_rate', label: 'Theo giá vàng' },
];

export const useGetProductList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockProducts, params.search, ['name', 'display_code', 'code', 'slug']);
        if (params.status) items = items.filter((x) => x.status === params.status);
        if (params.type) items = items.filter((x) => x.type === params.type);
        if (params.brand_id) items = items.filter((x) => x.brand_id === params.brand_id);
        if (params.product_line_id) items = items.filter((x) => x.product_line_id === params.product_line_id);
        if (params.category_id) items = items.filter((x) => x.category_id === params.category_id);
        if (params.collection_id) items = items.filter((x) => (x.collection_ids ?? []).includes(params.collection_id));
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const useGetProductStatusCount = (_params = {}, _fetched = true) => useMemo(() => {
        const result = { all: mockProducts.length };
        CONST_PRODUCT_STATUS.forEach((s) => {
            result[s.id] = mockProducts.filter((p) => p.status === s.id).length;
        });
        return { counts: result, loading: false, error: null };
    }, []);

export const refreshProductList = async () => {};
export const actionGetProductDetail = async (_id) => {
    const item = mockProducts.find((p) => p._id === _id || p.id === _id) ?? null;
    return { data: { data: item } };
};
export const actionCreateProduct = async (params) => ({ data: { data: { _id: `prod-mock-${Date.now()}`, ...params } } });
export const actionUpdateProduct = async (_id, params) => ({ data: { data: { _id, ...params } } });
export const actionChangeProductStatus = async (_id, status) => ({ data: { data: { _id, status } } });
export const actionDeleteProduct = async (_id) => ({ data: { data: { _id, deleted: true } } });
