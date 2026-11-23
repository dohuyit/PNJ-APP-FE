// SizeGuide — /api/v1/commerce/size-guide/*
// ⚠️ MOCK MODE
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import { mockSizeGuides, mockListResponse, mockSearch } from 'src/mock-data';

export const CONST_SIZE_GUIDE_TYPE = [
    { id: 'ring', label: 'Nhẫn' },
    { id: 'bangle', label: 'Vòng tay' },
    { id: 'necklace', label: 'Dây chuyền' },
    { id: 'bracelet', label: 'Lắc tay' },
];

export const useGetSizeGuideList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockSizeGuides, params.search, ['name']);
        if (params.type) items = items.filter((x) => x.type === params.type);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const refreshSizeGuideList = async () => {};
export const actionGetSizeGuideDetail = async (_id) => {
    const item = mockSizeGuides.find((s) => s._id === _id || s.id === _id) ?? null;
    return { data: { data: item } };
};
export const actionCreateSizeGuide = async (params) => ({ data: { data: { _id: `sg-mock-${Date.now()}`, ...params } } });
export const actionUpdateSizeGuide = async (_id, params) => ({ data: { data: { _id, ...params } } });
export const actionDeleteSizeGuide = async (_id) => ({ data: { data: { _id, deleted: true } } });
