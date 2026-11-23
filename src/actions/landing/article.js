// Landing blog — /api/landing/v1/blog/{list,{slug}}
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const BLOG_SORT_OPTIONS = [
    { value: 'latest', label: 'Mới nhất' },
    { value: 'popular', label: 'Xem nhiều' },
    { value: 'featured', label: 'Nổi bật' },
];

export const useGetBlogList = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/landing/v1/blog/list';
    if (queryString) {
        url += '?' + queryString;
    }

    const { data, isLoading, error, isValidating } = useSWR(fetched ? url : null, fetcher, {
        ...swrOptions,
        keepPreviousData: true,
    });

    return useMemo(() => ({
        articles: data?.data?.articles ?? [],
        featured: data?.data?.featured_articles ?? [],
        categories: data?.data?.categories ?? [],
        searchResults: data?.data?.articles ?? [],
        searchLoading: isLoading || isValidating,
        searchError: error,
        searchValidating: isValidating,
        searchEmpty: !isLoading && !isValidating && !data?.data?.articles?.length,
        metaPage: data?.data?.meta?.page ?? 1,
        metaPerPage: data?.data?.meta?.perPage ?? 12,
        metaTotal: data?.data?.meta?.total ?? 0,
        metaHasMore: data?.data?.meta?.has_more ?? false,
    }), [data, isLoading, isValidating, error]);
};

export const useGetBlogDetail = (slug, fetched = true) => {
    const url = slug ? `/api/landing/v1/blog/${encodeURIComponent(slug)}` : null;
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        article: data?.data?.article ?? null,
        relatedArticles: data?.data?.related_articles ?? [],
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const refreshBlogList = async () => {
    const prefix = '/api/landing/v1/blog/list';
    await mutate(
        (key) => typeof key === 'string' && key.startsWith(prefix),
        undefined,
        { revalidate: true }
    );
};

export const actionGetBlogList = async (params = {}) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/landing/v1/blog/list';
    if (queryString) {
        url += '?' + queryString;
    }
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetBlogDetail = async (slug) => {
    const url = `/api/landing/v1/blog/${encodeURIComponent(slug)}`;
    const res = await axiosInstance.get(url);
    return res;
};
