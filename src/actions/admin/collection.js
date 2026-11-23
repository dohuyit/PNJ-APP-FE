// Collection — /api/v1/commerce/collection/*
// ⚠️ MOCK MODE — API calls commented out, data trả về từ src/mock-data/collections.js
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import { mockCollections, mockListResponse, mockSearch } from 'src/mock-data';

export const CONST_COLLECTION_STATUS = [
    { id: 'draft', label: 'Nháp', color: 'default' },
    { id: 'active', label: 'Đang hoạt động', color: 'success' },
    { id: 'inactive', label: 'Tạm ẩn', color: 'warning' },
];

export const useGetCollectionList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockCollections, params.search, ['name', 'slug']);
        if (params.status) items = items.filter((x) => x.status === params.status);
        if (params.brand_id) items = items.filter((x) => x.brand_id === params.brand_id);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const refreshCollectionList = async () => {};
export const actionGetCollectionDetail = async (_id) => {
    const item = mockCollections.find((c) => c._id === _id || c.id === _id) ?? null;
    return { data: { data: item } };
};
export const actionCreateCollection = async (params) => ({ data: { data: { _id: `col-mock-${Date.now()}`, ...params } } });
export const actionUpdateCollection = async (_id, params) => ({ data: { data: { _id, ...params } } });
export const actionDeleteCollection = async (_id) => ({ data: { data: { _id, deleted: true } } });
