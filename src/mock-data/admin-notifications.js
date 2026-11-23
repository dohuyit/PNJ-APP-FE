// src/mock-data/admin-notifications.js
// Thông báo cho admin header drawer — link đến order/return/promotion/inventory/payment.

import { mockOrders } from './orders';
import { mockReturnRequests } from './return-requests';
import { mockPromotions } from './promotions';

const mins = (n) => new Date(Date.now() - n * 60_000).toISOString();
const hours = (n) => new Date(Date.now() - n * 3600_000).toISOString();
const days = (n) => new Date(Date.now() - n * 86_400_000).toISOString();

// Mỗi notification: { id, category, severity, icon, color, title, message, deeplink, created_at, is_unread, meta }
export const mockAdminNotifications = [
  {
    id: 'ntf-001', category: 'order', severity: 'info',
    icon: 'solar:bag-check-linear', color: '#2563EB',
    title: `Đơn hàng mới ${mockOrders[0]?.order_no ?? '#DH001001'}`,
    message: `Khách ${mockOrders[0]?.buyer?.full_name ?? '—'} vừa đặt đơn trị giá ${new Intl.NumberFormat('vi-VN').format(mockOrders[0]?.grand_total ?? 0)}₫`,
    deeplink: `/admin/order/${mockOrders[0]?.id ?? ''}`,
    created_at: mins(3), is_unread: true,
  },
  {
    id: 'ntf-002', category: 'inventory', severity: 'warning',
    icon: 'solar:danger-triangle-linear', color: '#D97706',
    title: 'Tồn kho thấp · HCM01',
    message: 'SKU NC-18K-01 còn 2 / ngưỡng 5 — cân nhắc nhập thêm',
    deeplink: '/admin/inventory/stores',
    created_at: mins(18), is_unread: true,
  },
  {
    id: 'ntf-003', category: 'return', severity: 'warning',
    icon: 'solar:box-minimalistic-linear', color: '#8B5CF6',
    title: `Yêu cầu thu đổi ${mockReturnRequests[0]?.code ?? 'YCRR100'}`,
    message: `${mockReturnRequests[0]?.customer_name ?? 'Khách'} xin ${mockReturnRequests[0]?.type === 'refund' ? 'hoàn tiền' : 'đổi sản phẩm'} · chờ duyệt`,
    deeplink: `/admin/return-request`,
    created_at: mins(42), is_unread: true,
  },
  {
    id: 'ntf-004', category: 'payment', severity: 'success',
    icon: 'solar:dollar-linear', color: '#059669',
    title: 'Đối soát thành công Q4',
    message: 'VNPay đã khớp 240 giao dịch · chênh lệch 0₫',
    deeplink: '/admin/payment-transaction',
    created_at: hours(1), is_unread: true,
  },
  {
    id: 'ntf-005', category: 'promotion', severity: 'info',
    icon: 'solar:tag-price-linear', color: '#EC4899',
    title: `Chiến dịch "${mockPromotions[0]?.name ?? 'Tết 2026'}" bắt đầu`,
    message: `Khuyến mãi áp dụng ngay — đã dùng ${mockPromotions[0]?.used ?? 0} lượt`,
    deeplink: '/admin/promotion',
    created_at: hours(2), is_unread: false,
  },
  {
    id: 'ntf-006', category: 'order', severity: 'info',
    icon: 'solar:bag-check-linear', color: '#2563EB',
    title: `Đơn hàng ${mockOrders[1]?.order_no ?? '#DH001002'} đã thanh toán`,
    message: `${new Intl.NumberFormat('vi-VN').format(mockOrders[1]?.grand_total ?? 0)}₫ · VNPay · sẵn sàng chuẩn bị`,
    deeplink: `/admin/order/${mockOrders[1]?.id ?? ''}`,
    created_at: hours(3), is_unread: false,
  },
  {
    id: 'ntf-007', category: 'system', severity: 'info',
    icon: 'solar:shield-user-linear', color: '#64748B',
    title: 'Admin mới được mời',
    message: 'Nguyễn Minh Tuấn · vai trò Marketing · chờ xác nhận email',
    deeplink: '/admin/admin-user',
    created_at: hours(5), is_unread: false,
  },
  {
    id: 'ntf-008', category: 'gold', severity: 'info',
    icon: 'solar:cup-star-linear', color: '#D97706',
    title: 'Giá vàng cập nhật',
    message: 'SJC 24K · Mua 83.2tr · Bán 83.8tr · +200k so với sáng',
    deeplink: '/admin/gold-price',
    created_at: hours(8), is_unread: false,
  },
  {
    id: 'ntf-009', category: 'inventory', severity: 'warning',
    icon: 'solar:box-minimalistic-linear', color: '#D97706',
    title: 'Phiếu chuyển kho cần duyệt',
    message: 'HCM01 → HN01 · 8 SKU · tổng giá trị 240tr',
    deeplink: '/admin/inventory/transfers',
    created_at: days(1), is_unread: false,
  },
  {
    id: 'ntf-010', category: 'review', severity: 'warning',
    icon: 'solar:star-linear', color: '#F59E0B',
    title: 'Đánh giá 2 sao cần phản hồi',
    message: 'Sản phẩm Nhẫn kim cương 2ct · "Hơi khác so với kỳ vọng"',
    deeplink: '/admin/return-request',
    created_at: days(1), is_unread: false,
  },
  {
    id: 'ntf-011', category: 'order', severity: 'success',
    icon: 'solar:check-circle-linear', color: '#059669',
    title: `Đơn ${mockOrders[2]?.order_no ?? '#DH001003'} đã giao thành công`,
    message: 'Khách xác nhận nhận hàng · chờ đánh giá',
    deeplink: `/admin/order/${mockOrders[2]?.id ?? ''}`,
    created_at: days(2), is_unread: false,
  },
  {
    id: 'ntf-012', category: 'system', severity: 'info',
    icon: 'solar:refresh-linear', color: '#64748B',
    title: 'Backup hệ thống đã chạy',
    message: 'Snapshot nightly · 12GB · OK',
    deeplink: '/admin/activity-log',
    created_at: days(2), is_unread: false,
  },
];

export const NOTIFICATION_CATEGORIES = [
  { value: 'all',       label: 'Tất cả',     icon: 'solar:bell-linear' },
  { value: 'order',     label: 'Đơn hàng',   icon: 'solar:bag-check-linear' },
  { value: 'inventory', label: 'Kho',        icon: 'solar:box-minimalistic-linear' },
  { value: 'return',    label: 'Hậu mãi',    icon: 'solar:refresh-circle-linear' },
  { value: 'payment',   label: 'Thanh toán', icon: 'solar:dollar-linear' },
  { value: 'promotion', label: 'KM',         icon: 'solar:tag-price-linear' },
  { value: 'review',    label: 'Đánh giá',   icon: 'solar:star-linear' },
  { value: 'system',    label: 'Hệ thống',   icon: 'solar:shield-user-linear' },
];
