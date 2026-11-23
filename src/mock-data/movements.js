// src/mock-data/movements.js
// 40 movement events trộn in/out/adjust/transfer + 8 transfer bills.
import { mockInventory, mockInventorySummary } from './inventory';
import { mockStores } from './stores';
import { ACTOR_IDS } from './ids';

const ACTORS = [
  { id: ACTOR_IDS.ADMIN_ROOT, name: 'Admin PNJ' },
  { id: ACTOR_IDS.TRAN_B,     name: 'Trần B.' },
  { id: ACTOR_IDS.NGUYEN_A,   name: 'Nguyễn A.' },
  { id: ACTOR_IDS.LE_C,       name: 'Lê C.' },
  { id: ACTOR_IDS.PHAM_D,     name: 'Phạm D.' },
];

const TYPES = ['in', 'out', 'adjust', 'transfer'];
const REASONS = {
  in: ['purchase', 'return_customer', 'transfer_in'],
  out: ['order', 'damage'],
  adjust: ['stock_count', 'manual'],
  transfer: ['transfer_out', 'transfer_in'],
};

function pick(arr, i) { return arr[i % arr.length]; }

export const mockMovements = [];

for (let i = 0; i < 40; i += 1) {
  const invRow = mockInventory[(i * 3) % mockInventory.length];
  const type = pick(TYPES, i);
  const reasonList = REASONS[type];
  const reason = pick(reasonList, i);
  const actor = pick(ACTORS, i);
  const qty = type === 'out' ? -(1 + (i % 4)) : type === 'in' ? 2 + (i % 5) : (i % 2 === 0 ? -1 : 1);

  const base = {
    _id: `mov-${String(i + 1).padStart(3, '0')}`,
    id: `mov-${String(i + 1).padStart(3, '0')}`,
    type, reason, qty,
    sku: invRow.sku,
    variant_id: invRow.variant_id,
    product_name: invRow.product_name,
    note: i % 5 === 0 ? 'Kiểm kê cuối tuần, chênh lệch 1-2 chiếc.' : '',
    actor_id: actor.id,
    actor_name: actor.name,
    created_at: new Date(Date.now() - i * 1000 * 60 * 60 * 6).toISOString(), // mỗi 6h 1 movement
    attachment_url: i % 7 === 0 ? 'https://cdn.pnj.io/mock/attachments/receipt.pdf' : null,
    source_order_id: type === 'out' && reason === 'order' ? `order-${String(100 + i).padStart(4, '0')}` : null,
    source_return_id: null,
  };

  if (type === 'transfer') {
    const toStore = pick(mockStores.filter((s) => s._id !== invRow.store_id), i);
    mockMovements.push({
      ...base,
      from_store_id: invRow.store_id,
      from_store_name: invRow.store_name,
      to_store_id: toStore._id,
      to_store_name: toStore.name,
    });
  } else {
    mockMovements.push({
      ...base,
      from_store_id: type === 'out' ? invRow.store_id : null,
      from_store_name: type === 'out' ? invRow.store_name : null,
      to_store_id: type === 'in' || type === 'adjust' ? invRow.store_id : null,
      to_store_name: type === 'in' || type === 'adjust' ? invRow.store_name : null,
    });
  }
}

mockInventorySummary.recent_movements = mockMovements.slice(0, 10);

// Phiếu chuyển kho — gộp items.
export const mockTransfers = [
  {
    _id: 'trf-001', id: 'trf-001',
    from_store_id: mockStores[0]._id, from_store_name: mockStores[0].name,
    to_store_id: mockStores[1]._id, to_store_name: mockStores[1].name,
    items: [
      { sku: mockInventory[0].sku, qty: 2 },
      { sku: mockInventory[5].sku, qty: 1 },
    ],
    status: 'received',
    note: 'Bù tồn cuối tháng.',
    actor_name: 'Nguyễn A.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    attachment_url: null,
  },
  {
    _id: 'trf-002', id: 'trf-002',
    from_store_id: mockStores[4]._id, from_store_name: mockStores[4].name,
    to_store_id: mockStores[6]._id, to_store_name: mockStores[6].name,
    items: [{ sku: mockInventory[10].sku, qty: 5 }],
    status: 'in_transit',
    note: 'Chuyển bổ sung đợt tết.',
    actor_name: 'Trần B.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    attachment_url: null,
  },
  {
    _id: 'trf-003', id: 'trf-003',
    from_store_id: mockStores[0]._id, from_store_name: mockStores[0].name,
    to_store_id: mockStores[3]._id, to_store_name: mockStores[3].name,
    items: [{ sku: mockInventory[2].sku, qty: 3 }, { sku: mockInventory[7].sku, qty: 2 }],
    status: 'draft',
    note: '',
    actor_name: 'Lê C.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    attachment_url: null,
  },
  {
    _id: 'trf-004', id: 'trf-004',
    from_store_id: mockStores[5]._id, from_store_name: mockStores[5].name,
    to_store_id: mockStores[2]._id, to_store_name: mockStores[2].name,
    items: [{ sku: mockInventory[15].sku, qty: 1 }],
    status: 'canceled',
    note: 'Hủy do khách đổi ý.',
    actor_name: 'Phạm D.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    attachment_url: null,
  },
  {
    _id: 'trf-005', id: 'trf-005',
    from_store_id: mockStores[0]._id, from_store_name: mockStores[0].name,
    to_store_id: mockStores[8]._id, to_store_name: mockStores[8].name,
    items: [{ sku: mockInventory[20].sku, qty: 2 }],
    status: 'received',
    note: '',
    actor_name: 'Admin PNJ',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    attachment_url: null,
  },
];
