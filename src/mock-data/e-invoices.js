// src/mock-data/e-invoices.js
// Hoá đơn điện tử — link order_id.

import { mockOrders } from './orders';

export const mockEInvoices = mockOrders
  .filter((o) => o.status === 'delivered' || o.status === 'confirmed')
  .map((o, i) => ({
    _id: `einv-${String(i + 1).padStart(5, '0')}`,
    id: `einv-${String(i + 1).padStart(5, '0')}`,
    code: `HDPNJ${String(100000 + i).padStart(7, '0')}`,
    serial: `C25TAA`,
    number: String(100000 + i).padStart(8, '0'),
    order_id: o._id,
    order_no: o.order_no,
    customer_id: o.customer_id,
    buyer_name: o.buyer.full_name,
    tax_code: i % 5 === 0 ? `0${Math.floor(Math.random() * 1e9)}` : null,
    subtotal: o.subtotal,
    vat_rate: 8,
    vat_amount: Math.round(o.subtotal * 0.08),
    total: o.grand_total,
    status: ['issued', 'signed', 'sent'][i % 3],
    issued_at: new Date(new Date(o.created_at).getTime() + 1 * 3600_000).toISOString(),
    sent_at: new Date(new Date(o.created_at).getTime() + 2 * 3600_000).toISOString(),
    pdf_url: '',
    xml_url: '',
  }));
