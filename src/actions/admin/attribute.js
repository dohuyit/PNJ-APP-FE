// Attribute + AttributeSet — /api/v1/commerce/attribute/*, /attribute-set/*
// ⚠️ MOCK MODE
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import {
    mockAttributes, mockAttributeSets, mockListResponse, mockSearch,
} from 'src/mock-data';

export const CONST_ATTRIBUTE_INPUT_TYPE = [
    { id: 'select', label: 'Chọn 1' },
    { id: 'multiselect', label: 'Chọn nhiều' },
    { id: 'number', label: 'Số nguyên' },
    { id: 'decimal', label: 'Số thập phân' },
    { id: 'text', label: 'Chữ' },
    { id: 'boolean', label: 'Đúng/Sai' },
];

export const CONST_ATTRIBUTE_FILTER_DISPLAY = [
    { id: 'chip', label: 'Chip' },
    { id: 'color', label: 'Màu' },
    { id: 'range', label: 'Khoảng giá trị' },
    { id: 'rating', label: 'Rating' },
];

// ---------- Attribute ----------

export const useGetAttributeList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockAttributes, params.search, ['name', 'code']);
        if (params.display_group) items = items.filter((x) => x.display_group === params.display_group);
        if (params.input_type) items = items.filter((x) => x.input_type === params.input_type);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const refreshAttributeList = async () => {};
export const actionGetAttributeDetail = async (_id) => {
    const item = mockAttributes.find((a) => a._id === _id || a.id === _id) ?? null;
    return { data: { data: item } };
};
export const actionCreateAttribute = async (params) => ({ data: { data: { _id: `attr-mock-${Date.now()}`, ...params } } });
export const actionUpdateAttribute = async (_id, params) => ({ data: { data: { _id, ...params } } });
export const actionDeleteAttribute = async (_id) => ({ data: { data: { _id, deleted: true } } });

// ---------- AttributeSet ----------

export const useGetAttributeSetList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        const items = mockSearch(mockAttributeSets, params.search, ['name']);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const refreshAttributeSetList = async () => {};
export const actionGetAttributeSetDetail = async (_id) => {
    const item = mockAttributeSets.find((s) => s._id === _id || s.id === _id) ?? null;
    return { data: { data: item } };
};
export const actionCreateAttributeSet = async (params) => ({ data: { data: { _id: `set-mock-${Date.now()}`, ...params } } });
export const actionUpdateAttributeSet = async (_id, params) => ({ data: { data: { _id, ...params } } });
export const actionDeleteAttributeSet = async (_id) => ({ data: { data: { _id, deleted: true } } });
