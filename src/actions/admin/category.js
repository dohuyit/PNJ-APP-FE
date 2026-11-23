// Category — /api/v1/commerce/category/*
// ⚠️ MOCK MODE
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import { mockCategories, mockCategoriesFlat, mockListResponse, mockSearch } from 'src/mock-data';

export const CONST_CATEGORY_STATUS = [
    { id: 'draft', label: 'Nháp', color: 'default' },
    { id: 'active', label: 'Đang hoạt động', color: 'success' },
    { id: 'inactive', label: 'Tạm ẩn', color: 'warning' },
];

export const CONST_CATEGORY_TYPE = [
    { id: 'jewelry', label: 'Trang sức' },
    { id: 'watch', label: 'Đồng hồ' },
    { id: 'diamond', label: 'Kim cương' },
    { id: 'gift', label: 'Quà tặng' },
    { id: 'egift', label: 'eGift' },
    { id: 'collectible', label: 'Sưu tầm' },
];

export const CONST_CATEGORY_AUDIENCE = [
    { id: 'female', label: 'Nữ' },
    { id: 'male', label: 'Nam' },
    { id: 'kids', label: 'Trẻ em' },
    { id: 'unisex', label: 'Unisex' },
];

export const CONST_CATEGORY_DEFAULT_SORT = [
    { id: 'newest', label: 'Mới nhất' },
    { id: 'best_selling', label: 'Bán chạy' },
    { id: 'price_asc', label: 'Giá tăng dần' },
    { id: 'price_desc', label: 'Giá giảm dần' },
    { id: 'featured', label: 'Nổi bật' },
];

export const useGetCategoryList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockCategoriesFlat, params.search, ['name', 'slug']);
        if (params.status) items = items.filter((x) => x.status === params.status);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const useGetCategoryTree = (_params = {}, _fetched = true) => 
    /* === REAL API (commented) === */
     useMemo(() => ({
        tree: mockCategories,
        loading: false,
        error: null,
    }), [])
;

export const refreshCategoryList = async () => {};
export const actionGetCategoryDetail = async (_id) => {
    const item = mockCategoriesFlat.find((c) => c._id === _id || c.id === _id) ?? null;
    return { data: { data: item } };
};
export const actionCreateCategory = async (params) => ({ data: { data: { _id: `cat-mock-${Date.now()}`, ...params } } });
export const actionUpdateCategory = async (_id, params) => ({ data: { data: { _id, ...params } } });
export const actionDeleteCategory = async (_id) => ({ data: { data: { _id, deleted: true } } });
