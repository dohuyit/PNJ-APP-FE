// Banner — /api/v1/commerce/banner/*
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const CONST_BANNER_POSITION = [
    { id: 'home_hero', label: 'Hero trang chủ' },
    { id: 'home_brand_carousel', label: 'Carousel thương hiệu' },
    { id: 'category_top', label: 'Đầu trang danh mục' },
    { id: 'mega_menu', label: 'Mega menu' },
    { id: 'popup', label: 'Popup' },
    { id: 'promo_page', label: 'Trang khuyến mãi' },
    { id: 'store_page', label: 'Trang cửa hàng' },
];

export const CONST_BANNER_STATUS = [
    { id: 'active', label: 'Đang hiển thị', color: 'success' },
    { id: 'inactive', label: 'Tạm ẩn', color: 'warning' },
];

export const useGetBannerList = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/v1/commerce/banner/list';
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

export const refreshBannerList = async () => {
    const prefix = '/api/v1/commerce/banner/list';
    await mutate(
        (key) => typeof key === 'string' && key.startsWith(prefix),
        undefined,
        { revalidate: true }
    );
};

export const actionCreateBanner = async (params) => {
    const url = '/api/v1/commerce/banner/create';
    const res = await axiosInstance.post(url, params);
    return res;
};

export const actionUpdateBanner = async (_id, params) => {
    const url = `/api/v1/commerce/banner/${_id}/update`;
    const res = await axiosInstance.post(url, params);
    return res;
};

export const actionDeleteBanner = async (_id) => {
    const url = `/api/v1/commerce/banner/${_id}/delete`;
    const res = await axiosInstance.post(url);
    return res;
};
