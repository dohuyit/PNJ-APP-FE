import useSWR from 'swr';
// Dashboard KPI — /api/v1/commerce/dashboard/*
import { useMemo } from 'react';

import axiosInstance, { fetcher } from 'src/lib/axios';

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

const buildUrl = (base, params) => {
    const qs = new URLSearchParams(
        Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    return qs ? `${base}?${qs}` : base;
};

export const useGetDashboardKpi = (params = { days: 30 }, fetched = true) => {
    const url = buildUrl('/api/v1/commerce/dashboard/kpi', params);
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);
    return useMemo(() => ({
        data: data?.data || null,
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const useGetRevenueSeries = (params = { days: 30 }, fetched = true) => {
    const url = buildUrl('/api/v1/commerce/dashboard/revenue-series', params);
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);
    return useMemo(() => ({
        items: data?.data?.items || data?.data || [],
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const useGetTopProducts = (params = { days: 30, limit: 10 }, fetched = true) => {
    const url = buildUrl('/api/v1/commerce/dashboard/top-products', params);
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);
    return useMemo(() => ({
        items: data?.data?.items || data?.data || [],
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const useGetOrderStatusBreakdown = (fetched = true) => {
    const url = '/api/v1/commerce/dashboard/order-status-breakdown';
    const { data, isLoading, error } = useSWR(fetched ? url : null, fetcher, swrOptions);
    return useMemo(() => ({
        items: data?.data?.items || data?.data || [],
        loading: isLoading,
        error,
    }), [data, isLoading, error]);
};

export const actionGetDashboardKpi = async (params = { days: 30 }) => {
    const url = buildUrl('/api/v1/commerce/dashboard/kpi', params);
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetRevenueSeries = async (params = { days: 30 }) => {
    const url = buildUrl('/api/v1/commerce/dashboard/revenue-series', params);
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetTopProducts = async (params = { days: 30, limit: 10 }) => {
    const url = buildUrl('/api/v1/commerce/dashboard/top-products', params);
    const res = await axiosInstance.get(url);
    return res;
};

export const actionGetOrderStatusBreakdown = async () => {
    const url = '/api/v1/commerce/dashboard/order-status-breakdown';
    const res = await axiosInstance.get(url);
    return res;
};
