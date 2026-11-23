// ProductLine — /api/v1/commerce/product-line/*
// ⚠️ MOCK MODE — API calls commented out, data trả về từ src/mock-data/product-lines.js
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import { mockProductLines, mockListResponse, mockSearch } from 'src/mock-data';

export const CONST_PRODUCT_LINE_STATUS = [
    { id: 'draft', label: 'Nháp', color: 'default' },
    { id: 'active', label: 'Đang hoạt động', color: 'success' },
    { id: 'inactive', label: 'Tạm ẩn', color: 'warning' },
];

export const useGetProductLineList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockProductLines, params.search, ['name', 'slug']);
        if (params.status) items = items.filter((x) => x.status === params.status);
        if (params.brand_id) items = items.filter((x) => x.brand_id === params.brand_id);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const refreshProductLineList = async () => {};
export const actionGetProductLineDetail = async (_id) => {
    const item = mockProductLines.find((l) => l._id === _id || l.id === _id) ?? null;
    return { data: { data: item } };
};
export const actionCreateProductLine = async (params) => ({ data: { data: { _id: `line-mock-${Date.now()}`, ...params } } });
export const actionUpdateProductLine = async (_id, params) => ({ data: { data: { _id, ...params } } });
export const actionDeleteProductLine = async (_id) => ({ data: { data: { _id, deleted: true } } });
