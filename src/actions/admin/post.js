// Post + PostCategory — /api/v1/commerce/post/*, /post-category/*
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const CONST_POST_STATUS = [
    { id: 'draft', label: 'Nháp', color: 'default' },
    { id: 'scheduled', label: 'Lên lịch', color: 'info' },
    { id: 'published', label: 'Đã xuất bản', color: 'success' },
];

// ---------- Post ----------

export const useGetPostList = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/v1/commerce/post/list';
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

export const refreshPostList = async () => {
    const prefix = '/api/v1/commerce/post/list';
    await mutate(
        (key) => typeof key === 'string' && key.startsWith(prefix),
        undefined,
        { revalidate: true }
    );
};

export const actionGetPostDetail = async (idOrSlug) => {
    const url = `/api/v1/commerce/post/${idOrSlug}/detail`;
    const res = await axiosInstance.get(url);
    return res;
};

export const actionCreatePost = async (params) => {
    const url = '/api/v1/commerce/post/create';
    const res = await axiosInstance.post(url, params);
    return res;
};

export const actionUpdatePost = async (_id, params) => {
    const url = `/api/v1/commerce/post/${_id}/update`;
    const res = await axiosInstance.post(url, params);
    return res;
};

export const actionDeletePost = async (_id) => {
    const url = `/api/v1/commerce/post/${_id}/delete`;
    const res = await axiosInstance.post(url);
    return res;
};

// ---------- PostCategory ----------

export const useGetPostCategoryList = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/v1/commerce/post-category/list';
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

export const refreshPostCategoryList = async () => {
    const prefix = '/api/v1/commerce/post-category/list';
    await mutate(
        (key) => typeof key === 'string' && key.startsWith(prefix),
        undefined,
        { revalidate: true }
    );
};

export const actionCreatePostCategory = async (params) => {
    const url = '/api/v1/commerce/post-category/create';
    const res = await axiosInstance.post(url, params);
    return res;
};

export const actionUpdatePostCategory = async (_id, params) => {
    const url = `/api/v1/commerce/post-category/${_id}/update`;
    const res = await axiosInstance.post(url, params);
    return res;
};

export const actionDeletePostCategory = async (_id) => {
    const url = `/api/v1/commerce/post-category/${_id}/delete`;
    const res = await axiosInstance.post(url);
    return res;
};
