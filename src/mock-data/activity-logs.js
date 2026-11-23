// src/mock-data/activity-logs.js
// Audit log mọi thao tác admin — link actor (admin), target (polymorphic).

import { mockAdmins } from './admins';
import { mockOrders } from './orders';
import { mockReturnRequests } from './return-requests';
import { mockPromotions } from './promotions';

const ACTIONS = [
  { verb: 'login',            target_type: null,         icon: 'solar:login-linear',          severity: 'info' },
  { verb: 'logout',           target_type: null,         icon: 'solar:logout-linear',         severity: 'info' },
  { verb: 'approve_order',    target_type: 'order',      icon: 'solar:check-circle-linear',   severity: 'info' },
  { verb: 'update_order',     target_type: 'order',      icon: 'solar:pen-linear',            severity: 'info' },
  { verb: 'cancel_order',     target_type: 'order',      icon: 'solar:close-circle-linear',   severity: 'warn' },
  { verb: 'approve_return',   target_type: 'return',     icon: 'solar:check-circle-linear',   severity: 'info' },
  { verb: 'reject_return',    target_type: 'return',     icon: 'solar:close-circle-linear',   severity: 'warn' },
  { verb: 'create_promotion', target_type: 'promotion',  icon: 'solar:tag-price-linear',      severity: 'info' },
  { verb: 'update_promotion', target_type: 'promotion',  icon: 'solar:pen-linear',            severity: 'info' },
  { verb: 'update_gold_price',target_type: 'gold_price', icon: 'solar:cup-star-linear',       severity: 'warn' },
  { verb: 'invite_admin',     target_type: 'admin',      icon: 'solar:user-plus-linear',      severity: 'info' },
  { verb: 'block_admin',      target_type: 'admin',      icon: 'solar:lock-password-linear',  severity: 'warn' },
  { verb: 'change_role',      target_type: 'admin',      icon: 'solar:shield-user-linear',    severity: 'warn' },
  { verb: 'failed_login',     target_type: null,         icon: 'solar:shield-warning-linear', severity: 'error' },
];

const LABEL = {
  login: 'đăng nhập', logout: 'đăng xuất',
  approve_order: 'duyệt đơn', update_order: 'cập nhật đơn', cancel_order: 'huỷ đơn',
  approve_return: 'duyệt yêu cầu thu đổi', reject_return: 'từ chối thu đổi',
  create_promotion: 'tạo khuyến mãi', update_promotion: 'cập nhật khuyến mãi',
  update_gold_price: 'cập nhật giá vàng',
  invite_admin: 'mời admin mới', block_admin: 'khoá admin', change_role: 'đổi vai trò admin',
  failed_login: 'đăng nhập thất bại',
};

export const mockActivityLogs = [];
let aid = 1;

const TARGETS = {
  order: mockOrders,
  return: mockReturnRequests,
  promotion: mockPromotions,
  admin: mockAdmins,
};

for (let i = 0; i < 80; i += 1) {
  const action = ACTIONS[i % ACTIONS.length];
  const actor = mockAdmins[i % mockAdmins.length];
  const list = action.target_type ? TARGETS[action.target_type] ?? [] : [];
  const target = list[i % Math.max(list.length, 1)];
  mockActivityLogs.push({
    _id: `al-${String(aid).padStart(5, '0')}`,
    id: `al-${String(aid++).padStart(5, '0')}`,
    actor_id: actor._id,
    actor_name: actor.name,
    actor_role: actor.role,
    verb: action.verb,
    label: `${actor.name} ${LABEL[action.verb]}${target ? ` ${target.order_no ?? target.code ?? target.name ?? target._id}` : ''}`,
    target_type: action.target_type,
    target_id: target?._id ?? null,
    icon: action.icon,
    severity: action.severity,
    ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    user_agent: 'Mozilla/5.0 (Windows NT 10.0)',
    created_at: new Date(Date.now() - i * 37 * 60_000).toISOString(),
  });
}
