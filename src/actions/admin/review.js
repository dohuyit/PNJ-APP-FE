// Review — /api/v1/commerce/review/*
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const CONST_REVIEW_STATUS = [
    { id: 'pending', label: 'Chờ duyệt', color: 'warning' },
    { id: 'approved', label: 'Đã duyệt', color: 'success' },
    { id: 'rejected', label: 'Từ chối', color: 'error' },
    { id: 'hidden', label: 'Đã ẩn', color: 'default' },
];

export const CONST_REVIEW_RATING = [
    { id: 1, label: '1 sao' },
    { id: 2, label: '2 sao' },
    { id: 3, label: '3 sao' },
    { id: 4, label: '4 sao' },
    { id: 5, label: '5 sao' },
];

export const useGetReviewList = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/v1/commerce/review/list';
    if (queryString) {
        url += '?' + queryString;
    }

    const { data, isLoading, error, isValidating } = useSWR(fetched ? url : null, fetcher, {
        ...swrOptions,
        keepPreviousData: true,
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
};

export const refreshReviewList = async () => {
    const prefix = '/api/v1/commerce/review/list';
    await mutate(
        (key) => typeof key === 'string' && key.startsWith(prefix),
        undefined,
        { revalidate: true }
    );
};

export const actionChangeReviewStatus = async (_id, status) => {
    const url = `/api/v1/commerce/review/${_id}/change-status`;
    const res = await axiosInstance.post(url, { status });
    return res;
};

export const actionReplyReview = async (_id, content) => {
    const url = `/api/v1/commerce/review/${_id}/reply`;
    const res = await axiosInstance.post(url, { content });
    return res;
};
