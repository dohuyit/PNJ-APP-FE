// Customer — /api/v1/commerce/customer/*
// ⚠️ MOCK MODE
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import { mockCustomers, mockListResponse, mockSearch } from 'src/mock-data';

export const CONST_CUSTOMER_STATUS = [
    { id: 'active', label: 'Hoạt động', color: 'success' },
    { id: 'blocked', label: 'Bị khóa', color: 'error' },
    { id: 'inactive', label: 'Không hoạt động', color: 'default' },
];

export const CONST_CUSTOMER_SOURCE = [
    { id: 'web', label: 'Website' },
    { id: 'app', label: 'Mobile App' },
    { id: 'store', label: 'Cửa hàng' },
];

export const CONST_CUSTOMER_SALUTATION = [
    { id: 'mr', label: 'Anh' },
    { id: 'ms', label: 'Chị' },
];

export const CONST_CUSTOMER_GENDER = [
    { id: 'male', label: 'Nam' },
    { id: 'female', label: 'Nữ' },
    { id: 'other', label: 'Khác' },
];

export const useGetCustomerList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockCustomers, params.search, ['name', 'email', 'phone', 'code']);
        if (params.status) items = items.filter((x) => x.status === params.status);
        if (params.tier) items = items.filter((x) => x.tier === params.tier);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const useGetCustomerStatusCount = (_params = {}, _fetched = true) => useMemo(() => {
        const result = { all: mockCustomers.length };
        CONST_CUSTOMER_STATUS.forEach((s) => {
            result[s.id] = mockCustomers.filter((c) => c.status === s.id).length;
        });
        return { counts: result, loading: false, error: null };
    }, []);

export const refreshCustomerList = async () => {};
export const actionGetCustomerDetail = async (_id) => {
    const item = mockCustomers.find((c) => c._id === _id || c.id === _id) ?? null;
    return { data: { data: item } };
};
export const actionUpdateCustomer = async (_id, params) => ({ data: { data: { _id, ...params } } });
export const actionChangeCustomerStatus = async (_id, status) => ({ data: { data: { _id, status } } });
export const actionDeleteCustomer = async (_id) => ({ data: { data: { _id, deleted: true } } });
