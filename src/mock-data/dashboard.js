// src/mock-data/dashboard.js
// Số liệu KPI tính từ mock orders/customers để Dashboard hiển thị.

import { mockOrders } from './orders';
import { mockCustomers } from './customers';
import { mockReturnRequests } from './return-requests';
import { mockPaymentTransactions } from './payment-transactions';

const sum = (arr, fn) => arr.reduce((n, x) => n + fn(x), 0);
const day = (n) => new Date(Date.now() + n * 86_400_000).toISOString();

const paidOrders = mockOrders.filter((o) => ['confirmed','processing','shipping','delivered'].includes(o.status));
const revenue = sum(paidOrders, (o) => o.grand_total);
const totalOrders = mockOrders.length;
const totalCustomers = mockCustomers.length;
const aov = paidOrders.length > 0 ? Math.round(revenue / paidOrders.length) : 0;

export const mockDashboardKpi = {
  revenue: { value: revenue, delta_percent: 12.4, period: '30d' },
  orders:  { value: totalOrders, delta_percent: 8.3, period: '30d' },
  customers: { value: totalCustomers, delta_percent: 5.1, period: '30d' },
  aov: { value: aov, delta_percent: 3.2, period: '30d' },
  returns: { value: mockReturnRequests.length, delta_percent: -4.6, period: '30d' },
  settled_amount: { value: sum(mockPaymentTransactions.filter((t) => t.status === 'success'), (t) => t.net_amount), delta_percent: 10.8, period: '30d' },
};

// 30 ngày series doanh thu + đơn hàng
export const mockRevenueSeries = Array.from({ length: 30 }, (_, i) => {
  const base = 80_000_000 + Math.round(Math.sin(i / 3) * 30_000_000);
  const wave = i % 7 < 2 ? base * 1.25 : base;
  return {
    date: day(-29 + i).slice(0, 10),
    revenue: Math.round(wave + (Math.random() - 0.5) * 10_000_000),
    orders: Math.round(wave / 1_500_000 + Math.random() * 5),
  };
});

// Top sản phẩm bán chạy
export const mockTopProducts = [
  { product_id: 'prod-001', product_name: 'Nhẫn cầu hôn kim cương 2ct', sku: 'SKU0001', qty: 48, revenue: 1_450_000_000 },
  { product_id: 'prod-002', product_name: 'Dây chuyền vàng 18K hoa tulip', sku: 'SKU0002', qty: 62, revenue: 820_000_000 },
  { product_id: 'prod-003', product_name: 'Hoa tai kim cương nhỏ', sku: 'SKU0003', qty: 95, revenue: 760_000_000 },
  { product_id: 'prod-004', product_name: 'Lắc tay vàng 24K Phúc Lộc Thọ', sku: 'SKU0004', qty: 32, revenue: 680_000_000 },
  { product_id: 'prod-005', product_name: 'Nhẫn cưới đôi vàng 18K', sku: 'SKU0005', qty: 44, revenue: 520_000_000 },
];

// Phân bổ order theo status
export const mockOrderStatusBreakdown = (() => {
  const map = {};
  mockOrders.forEach((o) => { map[o.status] = (map[o.status] ?? 0) + 1; });
  return Object.entries(map).map(([status, count]) => ({ status, count }));
})();
