// src/actions/notification/notification.jsx
// Stub cho layout header (notifications-drawer). Chưa có BE thật — tất cả API trả no-op.
// Khi tích hợp notification service thực tế, thay toàn bộ bằng useSWR tới endpoint tương ứng.
import { Iconify } from 'src/components/iconify';

export const NOTIFICATION_TYPES = [
  { value: 'order',   label: 'Đơn hàng',   icon: <Iconify icon="solar:bag-5-linear" width={24} /> },
  { value: 'payment', label: 'Thanh toán', icon: <Iconify icon="solar:card-linear" width={24} /> },
  { value: 'system',  label: 'Hệ thống',   icon: <Iconify icon="solar:settings-linear" width={24} /> },
  { value: 'chat',    label: 'Tin nhắn',   icon: <Iconify icon="solar:chat-round-linear" width={24} /> },
  { value: 'promo',   label: 'Khuyến mãi', icon: <Iconify icon="solar:tag-price-linear" width={24} /> },
];

// Stable references — tránh infinite re-render khi consumer dùng trong deps của useEffect.
const EMPTY_LIST_RESULT = Object.freeze({
  searchResults: Object.freeze([]),
  searchLoading: false,
  metaNextCursor: null,
  searchError: null,
});

const EMPTY_COUNT_RESULT = Object.freeze({
  searchResults: Object.freeze({ unread: 0, read: 0, total: 0 }),
  searchLoading: false,
});

export function getNotificationList(/* filters, open */) {
  return EMPTY_LIST_RESULT;
}

export function actionGetNotificationStatusCount() {
  return EMPTY_COUNT_RESULT;
}

export async function actionMarkAllAsRead() {
  // no-op: chưa có BE
  return { ok: true };
}

export function refreshNotificationList() {}
export function refreshNotificationStatusCount() {}
