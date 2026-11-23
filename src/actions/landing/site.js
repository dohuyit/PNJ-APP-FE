// Landing misc — stores, provinces, faq, policy, gold-price
import { useMemo } from 'react';
import useSWR from 'swr';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const FAQ_GROUP_LABEL = {
    product_general: 'Sản phẩm',
    payment: 'Thanh toán',
    shipping: 'Giao hàng',
    warranty: 'Đổi trả & bảo hành',
};

export const POLICY_KEYS = [
    { value: 'warranty', label: 'Chính sách bảo hành' },
    { value: 'return', label: 'Chính sách đổi trả' },
    { value: 'shipping', label: 'Chính sách giao hàng' },
    { value: 'privacy', label: 'Chính sách bảo mật' },
    { value: 'terms', label: 'Điều khoản dịch vụ' },
];

export const useGetStoreList = (params = {}, fetched = true) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/landing/v1/stores';
    if (queryString) {
        url += '?' + queryString;
    }

    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        stores: data?.data?.stores ?? [],
        provinces: data?.data?.provinces ?? [],
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const useGetProvinceList = (fetched = true) => {
    const url = '/api/landing/v1/address/provinces';
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        provinces: data?.data?.items ?? [],
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const useGetFaq = (search, fetched = true) => {
    let url = '/api/landing/v1/faq/list';
    if (search) {
        url += `?search=${encodeURIComponent(search)}`;
    }

    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        groups: data?.data?.groups ?? [],
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const useGetPolicy = (key, fetched = true) => {
    const url = key ? `/api/landing/v1/policy/${encodeURIComponent(key)}` : null;
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        page: data?.data?.page ?? null,
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const useGetGoldPriceCurrent = (regionCode = 'HCM', fetched = true) => {
    const url = `/api/landing/v1/gold-price/current?region_code=${encodeURIComponent(regionCode)}`;
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);

    return useMemo(() => ({
        regionCode: data?.data?.region_code ?? regionCode,
        items: data?.data?.items ?? [],
        loading: isLoading,
        error,
    }), [data, isLoading, error, regionCode]);
};

export const actionGetStoreList = async (params = {}) => {
    const queryString = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    let url = '/api/landing/v1/stores';
    if (queryString) {
        url += '?' + queryString;
    }
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetProvinceList = async () => {
    const url = '/api/landing/v1/address/provinces';
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetFaq = async (search) => {
    let url = '/api/landing/v1/faq/list';
    if (search) {
        url += `?search=${encodeURIComponent(search)}`;
    }
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetPolicy = async (key) => {
    const url = `/api/landing/v1/policy/${encodeURIComponent(key)}`;
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetGoldPriceCurrent = async (regionCode = 'HCM') => {
    const url = `/api/landing/v1/gold-price/current?region_code=${encodeURIComponent(regionCode)}`;
    const res = await axiosInstance.get(url);
    return res;
};
