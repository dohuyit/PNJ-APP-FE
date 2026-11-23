// src/theme/pnj/status-colors.js — enum → MUI color + label mapping
// Source: pnj-style.md §11.4.

export const ORDER_STATUS_COLOR = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  ready_for_pickup: 'info',
  shipping: 'info',
  delivered: 'success',
  completed: 'success',
  cancelled: 'default',
  returned: 'error',
};

export const ORDER_STATUS_LABEL = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang chuẩn bị',
  ready_for_pickup: 'Chờ khách nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn tất',
  cancelled: 'Đã huỷ',
  returned: 'Hoàn/trả',
};

export const ORDER_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipping', 'ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['completed', 'cancelled'],
  shipping: ['delivered', 'returned'],
  delivered: ['completed', 'returned'],
  completed: ['returned'],
  cancelled: [],
  returned: [],
};

export const PAYMENT_STATUS_COLOR = {
  pending: 'warning', paid: 'success', partially_paid: 'info', failed: 'error', refunded: 'default',
};

export const PAYMENT_STATUS_LABEL = {
  pending: 'Chờ thanh toán', paid: 'Đã thanh toán', partially_paid: 'Thanh toán 1 phần',
  failed: 'Thất bại', refunded: 'Đã hoàn',
};

export const PRODUCT_STATUS_COLOR = {
  draft: 'default', active: 'success', inactive: 'warning', out_of_stock: 'error',
};

export const PRODUCT_STATUS_LABEL = {
  draft: 'Nháp', active: 'Đang bán', inactive: 'Tạm ẩn', out_of_stock: 'Hết hàng',
};

export const PROMOTION_STATUS_COLOR = {
  draft: 'default', scheduled: 'info', running: 'success', paused: 'warning', ended: 'default',
};

export const PROMOTION_STATUS_LABEL = {
  draft: 'Nháp', scheduled: 'Đã lên lịch', running: 'Đang chạy', paused: 'Tạm dừng', ended: 'Kết thúc',
};

export const LEAD_STATUS_COLOR = {
  new: 'info', contacted: 'warning', converted: 'success', closed: 'default',
};

export const LEAD_STATUS_LABEL = {
  new: 'Mới', contacted: 'Đã liên hệ', converted: 'Chuyển đổi', closed: 'Đóng',
};

export const REVIEW_STATUS_COLOR = {
  pending: 'warning', approved: 'success', rejected: 'error', hidden: 'default',
};

export const REVIEW_STATUS_LABEL = {
  pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối', hidden: 'Đã ẩn',
};

export const RETURN_STATUS_COLOR = {
  requested: 'info', approved: 'success', rejected: 'error',
  received: 'info', refunded: 'success', closed: 'default',
};

export const RETURN_STATUS_LABEL = {
  requested: 'Mới yêu cầu', approved: 'Đã duyệt', rejected: 'Từ chối',
  received: 'Đã nhận', refunded: 'Đã hoàn', closed: 'Đóng',
};

export const COMMON_STATUS_COLOR = {
  active: 'success', inactive: 'default', blocked: 'error',
};

export const COMMON_STATUS_LABEL = {
  active: 'Đang hoạt động', inactive: 'Tạm ngưng', blocked: 'Tạm khoá',
};
