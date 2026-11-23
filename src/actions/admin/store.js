// Store — /api/v1/commerce/store/*
// ⚠️ MOCK MODE
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import { mockStores, mockListResponse, mockSearch } from 'src/mock-data';

export const CONST_STORE_STATUS = [
    { id: 'active', label: 'Đang hoạt động', color: 'success' },
    { id: 'inactive', label: 'Tạm ngưng', color: 'warning' },
    { id: 'closed', label: 'Đã đóng', color: 'error' },
];

export const CONST_STORE_TYPE = [
    { id: 'jewelry_center', label: 'Trung tâm trang sức' },
    { id: 'store', label: 'Cửa hàng' },
    { id: 'watch_store', label: 'Cửa hàng đồng hồ' },
    { id: 'kiosk', label: 'Kiosk' },
    { id: 'flagship', label: 'Flagship' },
];

export const CONST_STORE_SERVICE = [
    { id: 'pickup', label: 'Nhận hàng tại cửa hàng' },
    { id: 'buy_gold_raw', label: 'Thu mua vàng nguyên liệu' },
    { id: 'diamond_check', label: 'Kiểm định kim cương' },
    { id: 'engraving', label: 'Khắc chữ' },
    { id: 'express_3h', label: 'Giao hỏa tốc 3h' },
    { id: 'pos', label: 'POS' },
    { id: 'repair', label: 'Sửa chữa' },
];

export const useGetStoreList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockStores, params.search, ['name', 'code', 'address']);
        if (params.status) items = items.filter((x) => x.status === params.status);
        if (params.type) items = items.filter((x) => x.type === params.type);
        if (params.province) items = items.filter((x) => x.province === params.province);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const useGetStoreProvinces = (_fetched = true) => useMemo(() => {
        const set = new Set(mockStores.map((s) => s.province));
        return {
            searchResults: Array.from(set).map((p) => ({ name: p })),
            searchLoading: false,
            searchError: null,
        };
    }, []);

export const refreshStoreList = async () => {};
export const actionGetStoreDetail = async (_id) => {
    const item = mockStores.find((s) => s._id === _id || s.id === _id) ?? null;
    return { data: { data: item } };
};
export const actionCreateStore = async (params) => ({ data: { data: { _id: `store-mock-${Date.now()}`, ...params } } });
export const actionUpdateStore = async (_id, params) => ({ data: { data: { _id, ...params } } });
export const actionDeleteStore = async (_id) => ({ data: { data: { _id, deleted: true } } });
