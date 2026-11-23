// ReturnRequest — /api/v1/commerce/return-request/*
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const CONST_RETURN_STATUS = [
    { id: 'requested', label: 'Yêu cầu', color: 'warning' },
    { id: 'approved', label: 'Chấp nhận', color: 'info' },
    { id: 'rejected', label: 'Từ chối', color: 'error' },
    { id: 'received', label: 'Đã nhận hàng', color: 'info' },
    { id: 'refunded', label: 'Đã hoàn tiền', color: 'success' },
    { id: 'closed', label: 'Đã đóng', color: 'default' },
];

export const CONST_RETURN_TYPE = [
    { id: 'exchange', label: 'Đổi hàng' },
    { id: 'refund', label: 'Hoàn tiền' },
    { id: 'warranty', label: 'Bảo hành' },
];

export const useGetReturnRequestList = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/v1/commerce/return-request/list';
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

export const refreshReturnRequestList = async () => {
    const prefix = '/api/v1/commerce/return-request/list';
    await mutate(
        (key) => typeof key === 'string' && key.startsWith(prefix),
        undefined,
        { revalidate: true }
    );
};

export const actionChangeReturnRequestStatus = async (_id, { status, note } = {}) => {
    const url = `/api/v1/commerce/return-request/${_id}/change-status`;
    const res = await axiosInstance.post(url, { status, note });
    return res;
};
