// FAQ — /api/v1/commerce/faq/*
// ⚠️ MOCK MODE
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import { mockFaqs, mockListResponse, mockSearch } from 'src/mock-data';

export const useGetFaqList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockFaqs, params.search, ['question', 'answer']);
        if (params.category) items = items.filter((x) => x.category === params.category);
        if (params.status) items = items.filter((x) => x.status === params.status);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const refreshFaqList = async () => {};
export const actionGetFaqDetail = async (_id) => {
    const item = mockFaqs.find((f) => f._id === _id || f.id === _id) ?? null;
    return { data: { data: item } };
};
export const actionCreateFaq = async (params) => ({ data: { data: { _id: `faq-mock-${Date.now()}`, ...params } } });
export const actionUpdateFaq = async (_id, params) => ({ data: { data: { _id, ...params } } });
export const actionDeleteFaq = async (_id) => ({ data: { data: { _id, deleted: true } } });
