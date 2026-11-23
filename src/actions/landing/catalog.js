// Landing catalog — /api/landing/v1/{mega-menu, category/{type}/{id}/list, product/{slug}, search}
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const PRODUCT_SORT_OPTIONS = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'bestseller', label: 'Bán chạy' },
    { value: 'featured', label: 'Nổi bật' },
    { value: 'price_asc', label: 'Giá tăng dần' },
    { value: 'price_desc', label: 'Giá giảm dần' },
];

export const AUDIENCE_OPTIONS = [
    { value: 'female', label: 'Nữ' },
    { value: 'male', label: 'Nam' },
    { value: 'kids', label: 'Trẻ em' },
    { value: 'unisex', label: 'Unisex' },
];

export const MATERIAL_OPTIONS = [
    { value: 'gold', label: 'Vàng', color: '#C48C46' },
    { value: 'silver', label: 'Bạc', color: '#C0C0C0' },
    { value: 'platinum', label: 'Bạch kim', color: '#E5E4E2' },
    { value: 'diamond', label: 'Kim cương', color: '#B9F2FF' },
];

export const useGetMegaMenu = (fetched = true) => {
    const url = '/api/landing/v1/mega-menu';
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        categories: data?.data?.categories ?? [],
        brandsFeatured: data?.data?.brands_featured ?? [],
        collectionsWedding: data?.data?.collections_wedding ?? [],
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const useGetCategoryProductList = (type, id, params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = type && id ? `/api/landing/v1/category/${encodeURIComponent(type)}/${encodeURIComponent(id)}/list` : null;
    if (url && queryString) {
        url += '?' + queryString;
    }

    const { data, isLoading, error, isValidating } = useSWR(fetched ? url : null, fetcher, {
        ...swrOptions,
        keepPreviousData: true,
    });

    return useMemo(() => ({
        category: data?.data?.category ?? null,
        searchResults: data?.data?.products ?? [],
        filtersAvailable: data?.data?.filters_available ?? null,
        searchLoading: isLoading || isValidating,
        searchError: error,
        searchValidating: isValidating,
        searchEmpty: !isLoading && !isValidating && !data?.data?.products?.length,
        metaPage: data?.data?.meta?.page ?? 1,
        metaPerPage: data?.data?.meta?.perPage ?? 24,
        metaTotal: data?.data?.meta?.total ?? 0,
        metaTotalPage: data?.data?.meta?.totalPage ?? 0,
        metaHasMore: data?.data?.meta?.has_more ?? false,
    }), [data, isLoading, isValidating, error]);
};

export const useGetProductDetail = (slug, fetched = true) => {
    const url = slug ? `/api/landing/v1/product/${encodeURIComponent(slug)}` : null;
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        product: data?.data?.product ?? null,
        relatedProducts: data?.data?.related_products ?? [],
        breadcrumb: data?.data?.breadcrumb ?? [],
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const useSearchProducts = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = params.query ? `/api/landing/v1/search` : null;
    if (url && queryString) {
        url += '?' + queryString;
    }

    const { data, isLoading, error, isValidating } = useSWR(fetched ? url : null, fetcher, {
        ...swrOptions,
        keepPreviousData: true,
    });

    return useMemo(() => ({
        query: data?.data?.query ?? '',
        searchResults: data?.data?.products ?? [],
        quickFilters: data?.data?.quick_filters ?? [],
        searchLoading: isLoading || isValidating,
        searchError: error,
        searchValidating: isValidating,
        searchEmpty: !isLoading && !isValidating && !data?.data?.products?.length,
        metaPage: data?.data?.meta?.page ?? 1,
        metaPerPage: data?.data?.meta?.perPage ?? 24,
        metaTotal: data?.data?.meta?.total ?? 0,
        metaHasMore: data?.data?.meta?.has_more ?? false,
    }), [data, isLoading, isValidating, error]);
};

export const refreshCategoryProductList = async (prefix = '/api/landing/v1/category') => {
    await mutate(
        (key) => typeof key === 'string' && key.startsWith(prefix),
        undefined,
        { revalidate: true }
    );
};

export const actionGetMegaMenu = async () => {
    const url = '/api/landing/v1/mega-menu';
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetCategoryProductList = async (type, id, params = {}) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = `/api/landing/v1/category/${encodeURIComponent(type)}/${encodeURIComponent(id)}/list`;
    if (queryString) {
        url += '?' + queryString;
    }
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetProductDetail = async (slug) => {
    const url = `/api/landing/v1/product/${encodeURIComponent(slug)}`;
    const res = await axiosInstance.get(url);
    return res;
};

export const actionSearchProducts = async (params = {}) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/landing/v1/search';
    if (queryString) {
        url += '?' + queryString;
    }
    const res = await axiosInstance.get(url);
    return res;
};
