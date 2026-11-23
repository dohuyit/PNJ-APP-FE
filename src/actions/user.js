import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher } from '../lib/axios';

export const CONST_USER_STATUS_OPTIONS = [
    { id: 'active', label: 'Đang hoạt động', color: 'success' },
    { id: 'inactive', label: 'Ngừng hoạt động', color: 'warning' },
];

export const CONST_USER_STATUS_ALERT_LABEL = [
    { status: 'active', label: 'Tài khoản đang hoạt động' },
    { status: 'inactive', label: 'Tài khoản tạm ngừng hoạt động' },
    { status: 'blocked', label: 'Tài khoản đã bị khoá' },
];

export const USER_GENDER = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
]

const swrOptions = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    keepPreviousData: true,
};

export function getUserStatusOptions() {
    return {
        active: 'Đang hoạt động',
        inactive: 'Ngừng hoạt động',
        blocked: 'Bị khoá',
    };
}

export const refreshUserList = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    let url = '/api/v1/user/list';
    if (queryString) {
        url += '?' + queryString;
    }
    mutate(url);
};

export const useGetUserList = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    let url = '/api/v1/user/list';
    if (queryString) {
        url += '?' + queryString;
    }

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
        ...swrOptions,
        keepPreviousData: true,
    });

    const memoizedValue = useMemo(
        () => ({
            searchResults: data?.data?.items || [],
            loading: isLoading,
            error,
            validating: isValidating,
            metaPage: data?.data?.meta?.page ?? 1,
            metaPerPage: data?.data?.meta?.perPage ?? 10,
            metaTotalItem: data?.data?.meta?.total ?? 0,
            metaTotalPage: data?.data?.meta?.totalPage ?? 0,
        }),
        [data?.data?.items, error, isLoading, isValidating]
    );

    return memoizedValue;
};

export const useGetUserFilter = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    let url = '/api/v1/user/filter';
    if (queryString) {
        url += '?' + queryString;
    }

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
        ...swrOptions,
        keepPreviousData: true,
    });

    const memoizedValue = useMemo(
        () => ({
            searchResults: data?.data?.items,
            loading: isLoading,
            error,
            validating: isValidating,
            metaPage: data?.data?.meta?.page ?? 1,
            metaPerPage: data?.data?.meta?.perPage ?? 10,
            metaTotalItem: data?.data?.meta?.total ?? 0,
            metaTotalPage: data?.data?.meta?.totalPage ?? 0,
        }),
        [data?.data?.items, error, isLoading, isValidating]
    );

    return memoizedValue;
};

export const actionUpdateUser = async (_id, dataChanged = {}) => {
    const url = `/api/v1/user/${_id}/update`;
    const res = await axiosInstance.post(url, dataChanged);
    return res;
};

export const actionGetStatusUser = async () => {
    const url = `api/v1/user/status/count`;
    const res = await axiosInstance.get(url);
    return res.data;
};

export const actionGetCurrentUserDetail = async () => {
    const url = `/api/v1/user/profile`
    const res = await axiosInstance.get(url)
    return res.data
}

export const actionGetUserDetail = async (_id) => {
    const url = `/api/v1/user/${_id}/detail`
    const res = await axiosInstance.get(url)
    return res.data
}

export const actionLogout = async () => {
    const url = `/api/v1/user/profile/logout`
    const res = await axiosInstance.post(url)
    return res.data
}

export const actionChangeBranch = async (_id) => {
    const url = `/api/v1/user/branches/${_id}/switch`
    const res = await axiosInstance.post(url)
    return res.data
}

export const actionProvideInfoUser = async (data) => {
    const url = '/api/v1/user/init-info'
    const res = await axiosInstance.post(url, data)
    return res
}

export const actionChangePassword = async (data) => {
    const url = `/api/v1/user/change-password`
    const res = await axiosInstance.post(url, data)
    return res
}

export const actionUpdateProfile = async (_id, data) => {
    const url = `/api/v1/user/${_id}/update`
    const res = await axiosInstance.post(url, data)
    return res
}

export const actionMarkWalktour = async (userId, data) => {
    const url = `/api/v1/walktour/${userId}/mark-done`
    const res = await axiosInstance.post(url, data)
    return res
}

export const actionGetTransferAccountList = async () => {
    const url = `/api/v1/transfer/account/list`
    const res = await axiosInstance.get(url)
    return res
}

export const actionGetRequestBalance = async (data) => {
    const url = `/api/v1/user/balance/request/create`
    const res = await axiosInstance.post(url, data)
    return res
}

export const actionGetUserProfileCrm = async (_id) => {
    const url = `/api/v1/user/crm/${_id}/detail`
    const res = await axiosInstance.get(url)
    return res
}
