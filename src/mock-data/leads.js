// src/mock-data/leads.js
// Lead CSKH — khách tiềm năng để chăm sóc convert.

import { PRODUCT_IDS } from './ids';

const SOURCES = ['web_form', 'hotline', 'facebook', 'zalo', 'instagram', 'store_walk_in', 'tiktok'];
const STAGES = ['new', 'contacted', 'qualified', 'interested', 'converted', 'lost'];
const FIRST_NAMES = ['Minh', 'Lan', 'Hoa', 'Hùng', 'Linh', 'Khoa', 'Trang', 'Nam', 'My', 'Tú', 'Phương', 'Huy'];
const LAST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Đặng', 'Bùi'];

const day = (n) => new Date(Date.now() - n * 86_400_000).toISOString();

export const mockLeads = Array.from({ length: 18 }, (_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[(i * 3) % LAST_NAMES.length];
  const stage = STAGES[i % STAGES.length];
  const interest = PRODUCT_IDS[i % PRODUCT_IDS.length];
  return {
    _id: `lead-${String(i + 1).padStart(4, '0')}`,
    id: `lead-${String(i + 1).padStart(4, '0')}`,
    code: `LEAD${String(1000 + i).padStart(5, '0')}`,
    name: `${last} ${first}`,
    phone: `09${12345000 + i * 37}`.slice(0, 10),
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@gmail.com`,
    source: SOURCES[i % SOURCES.length],
    stage,
    interest_product_ids: [interest],
    interest_category: ['nhẫn cưới', 'nhẫn cầu hôn', 'dây chuyền nữ', 'hoa tai', 'đồng hồ nam'][i % 5],
    budget_range: ['<5M', '5-10M', '10-20M', '20-50M', '>50M'][i % 5],
    assigned_to: ['Nguyễn Hoàng Minh', 'Trần Thị Mai Anh', 'Lê Quốc Khánh', 'Phạm Thu Hằng'][i % 4],
    notes: stage === 'lost' ? 'Khách phản hồi đã mua nơi khác' : stage === 'converted' ? 'Đã chốt đơn, chuyển sang customer' : 'Hẹn gọi lại tuần sau',
    last_contact_at: day(i % 7),
    created_at: day(i + 1),
    priority: i % 5 === 0 ? 'high' : 'normal',
  };
});
