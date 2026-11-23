// Lead — /api/v1/commerce/lead/*
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const CONST_LEAD_TYPE = [
    { id: 'callback', label: 'Gọi lại' },
    { id: 'store_order', label: 'Đặt tại cửa hàng' },
    { id: 'corporate_gift', label: 'Quà doanh nghiệp' },
    { id: 'wholesale', label: 'Mua sỉ' },
];

export const CONST_LEAD_STATUS = [
    { id: 'new', label: 'Mới', color: 'info' },
    { id: 'contacted', label: 'Đã liên hệ', color: 'warning' },
    { id: 'converted', label: 'Đã chốt', color: 'success' },
    { id: 'closed', label: 'Đã đóng', color: 'default' },
];

export const useGetLeadList = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/v1/commerce/lead/list';
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

export const refreshLeadList = async () => {
    const prefix = '/api/v1/commerce/lead/list';
    await mutate(
        (key) => typeof key === 'string' && key.startsWith(prefix),
        undefined,
        { revalidate: true }
    );
};

export const actionChangeLeadStatus = async (_id, status) => {
    const url = `/api/v1/commerce/lead/${_id}/change-status`;
    const res = await axiosInstance.post(url, { status });
    return res;
};

export const actionAddLeadNote = async (_id, content) => {
    const url = `/api/v1/commerce/lead/${_id}/note`;
    const res = await axiosInstance.post(url, { content });
    return res;
};
