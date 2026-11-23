// Order — /api/v1/commerce/order/*
// ⚠️ MOCK MODE
import { useMemo } from 'react';

// import useSWR, { mutate } from 'swr';
// import axiosInstance, { fetcher } from 'src/lib/axios';
import { mockOrders, mockListResponse, mockSearch } from 'src/mock-data';

export const CONST_ORDER_STATUS = [
    { id: 'pending', label: 'Chờ xác nhận', color: 'warning' },
    { id: 'confirmed', label: 'Đã xác nhận', color: 'info' },
    { id: 'processing', label: 'Đang xử lý', color: 'info' },
    { id: 'ready_for_pickup', label: 'Sẵn sàng lấy', color: 'info' },
    { id: 'shipping', label: 'Đang giao', color: 'info' },
    { id: 'delivered', label: 'Đã giao', color: 'success' },
    { id: 'completed', label: 'Hoàn tất', color: 'success' },
    { id: 'cancelled', label: 'Đã hủy', color: 'error' },
    { id: 'canceled', label: 'Đã hủy', color: 'error' },
    { id: 'returned', label: 'Đã trả', color: 'error' },
];

export const CONST_ORDER_CHANNEL = [
    { id: 'web', label: 'Website' },
    { id: 'app', label: 'Mobile App' },
    { id: 'store_order', label: 'Đơn tại cửa hàng' },
    { id: 'store', label: 'Cửa hàng' },
    { id: 'online', label: 'Online' },
    { id: 'hotline', label: 'Hotline' },
];

export const CONST_ORDER_PAYMENT_STATUS = [
    { id: 'pending', label: 'Chờ thanh toán', color: 'warning' },
    { id: 'paid', label: 'Đã thanh toán', color: 'success' },
    { id: 'partially_paid', label: 'Thanh toán 1 phần', color: 'info' },
    { id: 'failed', label: 'Thất bại', color: 'error' },
    { id: 'refunded', label: 'Đã hoàn tiền', color: 'default' },
];

export const CONST_ORDER_FULFILLMENT = [
    { id: 'delivery', label: 'Giao hàng' },
    { id: 'store_pickup', label: 'Nhận tại cửa hàng' },
];

export const useGetOrderList = (params = {}, _fetched = true) => {
    /* === REAL API (commented) === */
    const paramsKey = JSON.stringify(params);
    return useMemo(() => {
        let items = mockSearch(mockOrders, params.search, ['code', 'customer_name', 'customer_phone']);
        if (params.status) items = items.filter((x) => x.status === params.status);
        if (params.channel) items = items.filter((x) => x.channel === params.channel);
        if (params.payment_status) items = items.filter((x) => x.payment_status === params.payment_status);
        if (params.store_id) items = items.filter((x) => x.store_id === params.store_id);
        return mockListResponse(items, params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);
};

export const useGetOrderStatusCount = (_params = {}, _fetched = true) => useMemo(() => {
        const result = { all: mockOrders.length };
        CONST_ORDER_STATUS.forEach((s) => {
            result[s.id] = mockOrders.filter((o) => o.status === s.id).length;
        });
        return { counts: result, loading: false, error: null };
    }, []);

export const refreshOrderList = async () => {};
export const actionGetOrderDetail = async (idOrNo) => {
    const item = mockOrders.find((o) => o._id === idOrNo || o.id === idOrNo || o.code === idOrNo) ?? null;
    return { data: { data: item } };
};
export const actionChangeOrderStatus = async (_id, { status, note } = {}) => ({ data: { data: { _id, status, note } } });
export const actionUpdateOrderAdminNote = async (_id, admin_note) => ({ data: { data: { _id, admin_note } } });
