// GoldPrice (admin) — /api/v1/commerce/gold-price/*
// ⚠️ MOCK MODE
import { useMemo } from 'react';

// import useSWR from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import { mockGoldPrices, mockListResponse } from 'src/mock-data';

export const CONST_GOLD_REGION = [
    { id: 'HCM', label: 'TP. Hồ Chí Minh' },
    { id: 'HN', label: 'Hà Nội' },
    { id: 'DN', label: 'Đà Nẵng' },
];

export const CONST_GOLD_TYPE_CODE = [
    { id: '24k', label: 'Vàng 24K' },
    { id: '18k', label: 'Vàng 18K' },
    { id: '14k', label: 'Vàng 14K' },
    { id: 'silver', label: 'Bạc' },
];

export const useGetGoldPriceCurrent = (_region_code = 'HCM', _fetched = true) => 
    /* === REAL API (commented) === */
     useMemo(() => {
        const current = mockGoldPrices[0] ?? null;
        return {
            data: current ? [current] : [],
            loading: false,
            error: null,
            empty: !current,
        };
    }, [])
;

export const useGetGoldPriceHistory = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => mockListResponse(mockGoldPrices, params),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [paramsKey]);
};

export const actionPushGoldPrice = async (params) => ({ data: { data: { _id: `gp-mock-${Date.now()}`, ...params } } });
