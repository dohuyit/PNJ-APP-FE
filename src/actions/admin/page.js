// Page — /api/v1/commerce/page/*
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const CONST_PAGE_TYPE = [
    { id: 'about', label: 'Giới thiệu' },
    { id: 'guide', label: 'Hướng dẫn' },
    { id: 'policy', label: 'Chính sách' },
    { id: 'service', label: 'Dịch vụ' },
];

export const CONST_PAGE_STATUS = [
    { id: 'active', label: 'Đang hiển thị', color: 'success' },
    { id: 'inactive', label: 'Tạm ẩn', color: 'warning' },
];

export const useGetPageList = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/v1/commerce/page/list';
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

export const refreshPageList = async () => {
    const prefix = '/api/v1/commerce/page/list';
    await mutate(
        (key) => typeof key === 'string' && key.startsWith(prefix),
        undefined,
        { revalidate: true }
    );
};

export const actionGetPageDetail = async (idOrSlug) => {
    const url = `/api/v1/commerce/page/${idOrSlug}/detail`;
    const res = await axiosInstance.get(url);
    return res;
};

export const actionCreatePage = async (params) => {
    const url = '/api/v1/commerce/page/create';
    const res = await axiosInstance.post(url, params);
    return res;
};

export const actionUpdatePage = async (_id, params) => {
    const url = `/api/v1/commerce/page/${_id}/update`;
    const res = await axiosInstance.post(url, params);
    return res;
};

export const actionDeletePage = async (_id) => {
    const url = `/api/v1/commerce/page/${_id}/delete`;
    const res = await axiosInstance.post(url);
    return res;
};
