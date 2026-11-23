// src/mock-data/banks.js
// 10 ngân hàng phổ biến VN — dùng cho payment-method + installment-plan.

export const BANK_IDS = {
  VCB: 'bank-vcb', TCB: 'bank-tcb', MB: 'bank-mb', BIDV: 'bank-bidv',
  ACB: 'bank-acb', VPB: 'bank-vpb', TPB: 'bank-tpb', HDB: 'bank-hdb',
  SACOM: 'bank-sacom', VIB: 'bank-vib',
};

export const mockBanks = [
  { _id: BANK_IDS.VCB,   id: BANK_IDS.VCB,   code: 'VCB',  name: 'Vietcombank',           logo: '', color: '#007F3E', status: 'active' },
  { _id: BANK_IDS.TCB,   id: BANK_IDS.TCB,   code: 'TCB',  name: 'Techcombank',           logo: '', color: '#E31E24', status: 'active' },
  { _id: BANK_IDS.MB,    id: BANK_IDS.MB,    code: 'MB',   name: 'MBBank',                logo: '', color: '#C20E1A', status: 'active' },
  { _id: BANK_IDS.BIDV,  id: BANK_IDS.BIDV,  code: 'BIDV', name: 'BIDV',                  logo: '', color: '#216729', status: 'active' },
  { _id: BANK_IDS.ACB,   id: BANK_IDS.ACB,   code: 'ACB',  name: 'ACB',                   logo: '', color: '#005091', status: 'active' },
  { _id: BANK_IDS.VPB,   id: BANK_IDS.VPB,   code: 'VPB',  name: 'VPBank',                logo: '', color: '#019934', status: 'active' },
  { _id: BANK_IDS.TPB,   id: BANK_IDS.TPB,   code: 'TPB',  name: 'TPBank',                logo: '', color: '#642776', status: 'active' },
  { _id: BANK_IDS.HDB,   id: BANK_IDS.HDB,   code: 'HDB',  name: 'HDBank',                logo: '', color: '#E31836', status: 'active' },
  { _id: BANK_IDS.SACOM, id: BANK_IDS.SACOM, code: 'STB',  name: 'Sacombank',             logo: '', color: '#CC2127', status: 'active' },
  { _id: BANK_IDS.VIB,   id: BANK_IDS.VIB,   code: 'VIB',  name: 'VIB',                   logo: '', color: '#003B70', status: 'inactive' },
];
