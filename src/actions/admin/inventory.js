// Inventory — /api/v1/commerce/inventory/*
// ⚠️ MOCK MODE
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import {
    mockInventory, mockInventorySummary, mockMovements, mockTransfers,
    mockListResponse, mockSearch,
} from 'src/mock-data';

// ---------- CONSTS ----------

export const CONST_MOVEMENT_TYPE = [
    { id: 'in',       label: 'Nhập kho',     color: 'success' },
    { id: 'out',      label: 'Xuất kho',     color: 'error' },
    { id: 'adjust',   label: 'Điều chỉnh',   color: 'warning' },
    { id: 'transfer', label: 'Chuyển kho',   color: 'info' },
];

export const CONST_MOVEMENT_REASON = [
    { id: 'purchase',        label: 'Nhập mua' },
    { id: 'order',           label: 'Bán hàng (đơn)' },
    { id: 'return_customer', label: 'Khách hoàn trả' },
    { id: 'damage',          label: 'Hỏng / mất' },
    { id: 'stock_count',     label: 'Kiểm kê' },
    { id: 'transfer_out',    label: 'Chuyển đi' },
    { id: 'transfer_in',     label: 'Chuyển đến' },
    { id: 'manual',          label: 'Thủ công' },
];

export const CONST_TRANSFER_STATUS = [
    { id: 'draft',      label: 'Nháp',       color: 'default' },
    { id: 'in_transit', label: 'Đang chuyển', color: 'warning' },
    { id: 'received',   label: 'Đã nhận',    color: 'success' },
    { id: 'canceled',   label: 'Đã huỷ',     color: 'error' },
];

// ---------- List hooks ----------

export const useGetInventoryList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockInventory, params.search, ['sku', 'product_name', 'store_name']);
        if (params.store_id) items = items.filter((x) => x.store_id === params.store_id);
        if (params.product_line_id) items = items.filter((x) => x.product_line_id === params.product_line_id);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const refreshInventoryList = async () => {};

export const useGetInventoryByStore = (storeId, params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        if (!storeId) {
            return { searchResults: [], searchLoading: false, searchError: null, metaTotal: 0 };
        }
        const items = mockInventory.filter((r) => r.store_id === storeId);
        const paged = mockListResponse(items, params);
        return { searchResults: paged.searchResults, searchLoading: false, searchError: null, metaTotal: paged.metaTotal };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeId, paramsKey]);
};

export const useGetInventoryBySku = (sku, _fetched = true) => 
    /* === REAL API (commented) === */
     useMemo(() => {
        if (!sku) return { byStore: [], totalAvailable: 0, loading: false, error: null };
        const byStore = mockInventory.filter((r) => r.sku === sku);
        const totalAvailable = byStore.reduce((s, r) => s + r.available, 0);
        return { byStore, totalAvailable, loading: false, error: null };
    }, [sku])
;

export const useGetInventorySummary = (_fetched = true) => 
    /* === REAL API (commented) === */
     useMemo(() => ({
        totalSkus: mockInventorySummary.total_skus,
        outOfStockCount: mockInventorySummary.out_of_stock_count,
        lowStockCount: mockInventorySummary.low_stock_count,
        totalValue: mockInventorySummary.total_value,
        topLowStock: mockInventorySummary.top_low_stock,
        recentMovements: mockInventorySummary.recent_movements,
        loading: false,
        error: null,
    }), [])
;

export const useGetInventoryMovements = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockMovements, params.search, ['sku', 'note', 'actor_name', 'product_name']);
        if (params.type) items = items.filter((x) => x.type === params.type);
        if (params.reason) items = items.filter((x) => x.reason === params.reason);
        if (params.store_id) items = items.filter((x) =>
            x.from_store_id === params.store_id || x.to_store_id === params.store_id
        );
        if (params.sku) items = items.filter((x) => x.sku === params.sku);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const refreshInventoryMovements = async () => {};

export const useGetInventoryTransfers = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockTransfers, params.search, ['from_store_name', 'to_store_name', 'note']);
        if (params.status) items = items.filter((x) => x.status === params.status);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const refreshInventoryTransfers = async () => {};

// ---------- Actions ----------

export const actionAdjustInventory = async (params) => ({ data: { data: { ...params, ok: true } } });
export const actionInventoryMovement = async (params) => ({ data: { data: { _id: `mov-mock-${Date.now()}`, ...params } } });
export const actionInventoryTransfer = async (params) => {
    if (process.env.NODE_ENV !== 'production') {
        console.assert(params?.from_store_id !== params?.to_store_id, '[inventory] transfer: from must differ to');
    }
    return { data: { data: { _id: `trf-mock-${Date.now()}`, status: 'draft', ...params } } };
};
export const actionInventoryTransferUpdateStatus = async (_id, status) => ({ data: { data: { _id, status } } });
export const actionInventoryImport = async (file_id) => ({ data: { data: { file_id, queued: true } } });
export const actionInventoryExport = async (params = {}) => ({ data: { data: { url: '/mock/exports/inventory.csv', params } } });
