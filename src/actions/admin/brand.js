// Brand — /api/v1/commerce/brand/*
// ⚠️ MOCK MODE — API calls commented out, data trả về từ src/mock-data/brands.js
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import { mockBrands, mockListResponse, mockSearch } from 'src/mock-data';

// const swrOptions = {
//     revalidateIfStale: false,
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
// };

export const CONST_BRAND_STATUS = [
    { id: 'draft', label: 'Nháp', color: 'default' },
    { id: 'active', label: 'Đang hoạt động', color: 'success' },
    { id: 'inactive', label: 'Tạm ẩn', color: 'warning' },
];

export const CONST_BRAND_GROUP = [
    { id: 'product', label: 'Thương hiệu sản phẩm' },
    { id: 'retail', label: 'Thương hiệu bán lẻ' },
    { id: 'partnership', label: 'Đối tác' },
    { id: 'watch_maker', label: 'Hãng đồng hồ' },
];

export const useGetBrandList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) ===
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/v1/commerce/brand/list';
    if (queryString) url += '?' + queryString;
    const { data, isLoading, error, isValidating } = useSWR(_fetched ? url : null, fetcher, {
        ...swrOptions, keepPreviousData: true,
    });
    return useMemo(() => ({
        searchResults: data?.data?.items || [],
        searchLoading: isLoading || isValidating,
        searchError: error,
        searchValidating: isValidating,
        searchEmpty: !isLoading && !isValidating && !data?.data?.items?.length,
        metaPage: data?.data?.meta?.page ?? 1,
        metaPerPage: data?.data?.meta?.perPage ?? 20,
        metaTotal: data?.data?.meta?.total ?? 0,
        metaTotalPage: data?.data?.meta?.totalPage ?? 0,
    }), [data, isLoading, isValidating, error]);
    */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockBrands, params.search, ['name', 'code']);
        if (params.status) items = items.filter((x) => x.status === params.status);
        if (params.group) items = items.filter((x) => x.group === params.group);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const refreshBrandList = async () => {
    /* === REAL ===
    const prefix = '/api/v1/commerce/brand/list';
    await mutate((key) => typeof key === 'string' && key.startsWith(prefix), undefined, { revalidate: true });
    */
};

export const actionGetBrandDetail = async (_id) => {
    /* === REAL ===
    const url = `/api/v1/commerce/brand/${_id}/detail`;
    return axiosInstance.get(url);
    */
    const item = mockBrands.find((b) => b._id === _id || b.id === _id) ?? null;
    return { data: { data: item } };
};

export const actionCreateBrand = async (params) => 
    /* === REAL ===
    const url = '/api/v1/commerce/brand/create';
    return axiosInstance.post(url, params);
    */
     ({ data: { data: { _id: `brand-mock-${Date.now()}`, ...params } } })
;

export const actionUpdateBrand = async (_id, params) => 
    /* === REAL ===
    return axiosInstance.post(`/api/v1/commerce/brand/${_id}/update`, params);
    */
     ({ data: { data: { _id, ...params } } })
;

export const actionDeleteBrand = async (_id) => 
    /* === REAL ===
    return axiosInstance.post(`/api/v1/commerce/brand/${_id}/delete`);
    */
     ({ data: { data: { _id, deleted: true } } })
;

export const actionReorderBrand = async (items) => 
    /* === REAL ===
    return axiosInstance.post('/api/v1/commerce/brand/reorder', { items });
    */
     ({ data: { data: { items } } })
;
