// src/mock-data/customers.js
import { CUSTOMER_IDS } from './ids';

const NAMES = [
  'Nguyễn Thị Hương', 'Trần Văn Nam', 'Lê Thị Mai', 'Phạm Minh Tuấn',
  'Hoàng Thị Lan', 'Vũ Đức Anh', 'Đỗ Thị Hà', 'Bùi Văn Hùng',
  'Đặng Thị Thu', 'Ngô Minh Long', 'Lý Thị Vân', 'Phan Trung Kiên',
  'Mai Thị Linh', 'Dương Quốc Đạt', 'Võ Thị Trúc', 'Tôn Nữ Khánh Ly',
  'Trịnh Văn Tài', 'Nguyễn Khánh An', 'Hồ Thị Thủy', 'Lâm Trung Hậu',
];
const TIERS = ['Silver', 'Gold', 'Platinum', 'Diamond'];

export const mockCustomers = CUSTOMER_IDS.map((id, i) => ({
  _id: id, id,
  code: `KH${String(i + 1).padStart(5, '0')}`,
  name: NAMES[i] ?? `Khách hàng ${i + 1}`,
  email: `customer${i + 1}@pnj.com.vn`,
  phone: `09${String(10_000_000 + i * 123_456).slice(0, 8)}`,
  tier: TIERS[i % TIERS.length],
  loyalty_points: 100 + i * 37,
  total_spent: 5_000_000 + i * 2_300_000,
  order_count: 1 + (i % 7),
  status: i % 10 === 0 ? 'inactive' : 'active',
  created_at: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 10).toISOString(),
  last_order_at: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 2).toISOString(),
}));
