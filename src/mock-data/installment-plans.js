// src/mock-data/installment-plans.js
// Chương trình trả góp — link bank_id.
import { BANK_IDS } from './banks';

export const mockInstallmentPlans = [
  { _id: 'ip-001', id: 'ip-001', code: 'VCB-6-0%',  bank_id: BANK_IDS.VCB,   name: 'Vietcombank · 6 tháng 0%', months: 6,  interest: 0,   min_amount: 3_000_000,  max_amount: 150_000_000, status: 'active' },
  { _id: 'ip-002', id: 'ip-002', code: 'VCB-12-0%', bank_id: BANK_IDS.VCB,   name: 'Vietcombank · 12 tháng 0%', months: 12, interest: 0,   min_amount: 5_000_000,  max_amount: 300_000_000, status: 'active' },
  { _id: 'ip-003', id: 'ip-003', code: 'TCB-6-0%',  bank_id: BANK_IDS.TCB,   name: 'Techcombank · 6 tháng 0%',  months: 6,  interest: 0,   min_amount: 3_000_000,  max_amount: 200_000_000, status: 'active' },
  { _id: 'ip-004', id: 'ip-004', code: 'TCB-9-2%',  bank_id: BANK_IDS.TCB,   name: 'Techcombank · 9 tháng 2%',  months: 9,  interest: 2.5, min_amount: 5_000_000,  max_amount: 250_000_000, status: 'active' },
  { _id: 'ip-005', id: 'ip-005', code: 'ACB-6-0%',  bank_id: BANK_IDS.ACB,   name: 'ACB · 6 tháng 0%',          months: 6,  interest: 0,   min_amount: 3_000_000,  max_amount: 180_000_000, status: 'active' },
  { _id: 'ip-006', id: 'ip-006', code: 'MB-12-0%',  bank_id: BANK_IDS.MB,    name: 'MBBank · 12 tháng 0%',      months: 12, interest: 0,   min_amount: 5_000_000,  max_amount: 300_000_000, status: 'active' },
  { _id: 'ip-007', id: 'ip-007', code: 'TPB-18-5%', bank_id: BANK_IDS.TPB,   name: 'TPBank · 18 tháng 5%',      months: 18, interest: 5.0, min_amount: 10_000_000, max_amount: 500_000_000, status: 'inactive' },
  { _id: 'ip-008', id: 'ip-008', code: 'SAC-6-0%',  bank_id: BANK_IDS.SACOM, name: 'Sacombank · 6 tháng 0%',    months: 6,  interest: 0,   min_amount: 3_000_000,  max_amount: 150_000_000, status: 'active' },
];
