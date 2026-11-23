// Landing form submit — contact, newsletter, order create, order lookup, voucher validate
import axiosInstance from 'src/lib/axios';

export const CONTACT_TYPE_OPTIONS = [
    { value: 'callback', label: 'Gọi lại' },
    { value: 'store_order', label: 'Đặt tại cửa hàng' },
    { value: 'corporate_gift', label: 'Quà tặng doanh nghiệp' },
    { value: 'wholesale', label: 'Bán sỉ' },
];

export const FULFILLMENT_OPTIONS = [
    { value: 'delivery', label: 'Giao tận nơi' },
    { value: 'store_pickup', label: 'Nhận tại cửa hàng' },
];

export const PAYMENT_METHOD_OPTIONS = [
    { value: 'cod', label: 'COD khi nhận hàng' },
    { value: 'vnpay', label: 'VNPAY-QR' },
    { value: 'momo', label: 'MoMo' },
    { value: 'zalopay', label: 'ZaloPay' },
    { value: 'bank_transfer', label: 'Chuyển khoản' },
    { value: 'installment', label: 'Trả góp 0%' },
];

export const actionSubmitContact = async (payload) => {
    const url = '/api/landing/v1/contact/submit';
    const res = await axiosInstance.post(url, payload);
    return res;
};

export const actionSubscribeNewsletter = async (payload) => {
    const url = '/api/landing/v1/newsletter/subscribe';
    const res = await axiosInstance.post(url, payload);
    return res;
};

export const actionCreateOrder = async (payload) => {
    const url = '/api/landing/v1/order/create';
    const res = await axiosInstance.post(url, payload);
    return res;
};

export const actionLookupOrder = async (orderNo) => {
    const url = `/api/landing/v1/order/${encodeURIComponent(orderNo)}`;
    const res = await axiosInstance.get(url);
    return res;
};

export const actionValidateVoucher = async ({ code, subtotal }) => {
    const url = '/api/landing/v1/voucher/validate';
    const res = await axiosInstance.post(url, { code, subtotal });
    return res;
};
