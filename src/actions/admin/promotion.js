// Promotion — /api/v1/commerce/promotion/*
import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const CONST_PROMOTION_STATUS = [
    { id: 'draft', label: 'Nháp', color: 'default' },
    { id: 'scheduled', label: 'Lên lịch', color: 'info' },
    { id: 'running', label: 'Đang chạy', color: 'success' },
    { id: 'paused', label: 'Tạm dừng', color: 'warning' },
    { id: 'ended', label: 'Đã kết thúc', color: 'error' },
];

export const CONST_PROMOTION_TYPE = [
    { id: 'product_discount', label: 'Giảm giá sản phẩm' },
    { id: 'gift_with_purchase', label: 'Mua kèm quà' },
    { id: 'tiered_quantity', label: 'Mua nhiều ưu đãi' },
    { id: 'order_threshold_gift', label: 'Quà theo giá trị đơn' },
    { id: 'payment_method', label: 'Ưu đãi thanh toán' },
    { id: 'coupon', label: 'Mã giảm giá' },
];

export const useGetPromotionList = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/v1/commerce/promotion/list';
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

export const refreshPromotionList = async () => {
    const prefix = '/api/v1/commerce/promotion/list';
    await mutate(
        (key) => typeof key === 'string' && key.startsWith(prefix),
        undefined,
        { revalidate: true }
    );
};

export const actionGetPromotionDetail = async (_id) => {
    const url = `/api/v1/commerce/promotion/${_id}/detail`;
    const res = await axiosInstance.get(url);
    return res;
};

export const actionCreatePromotion = async (params) => {
    const url = '/api/v1/commerce/promotion/create';
    const res = await axiosInstance.post(url, params);
    return res;
};

export const actionUpdatePromotion = async (_id, params) => {
    const url = `/api/v1/commerce/promotion/${_id}/update`;
    const res = await axiosInstance.post(url, params);
    return res;
};

export const actionDuplicatePromotion = async (_id) => {
    const url = `/api/v1/commerce/promotion/${_id}/duplicate`;
    const res = await axiosInstance.post(url);
    return res;
};

export const actionDeletePromotion = async (_id) => {
    const url = `/api/v1/commerce/promotion/${_id}/delete`;
    const res = await axiosInstance.post(url);
    return res;
};
