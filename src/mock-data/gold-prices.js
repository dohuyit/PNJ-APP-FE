// src/mock-data/gold-prices.js
export const mockGoldPrices = Array.from({ length: 12 }, (_, i) => ({
  _id: `gp-${i + 1}`, id: `gp-${i + 1}`,
  date: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
  type: '24K',
  buy_price: 7_500_000 - i * 10_000,
  sell_price: 7_580_000 - i * 10_000,
  region: 'national',
  source: 'PNJ',
  status: 'active',
}));

export const GOLD_TYPE_IDS = {
  K24:'gt-24k', K18:'gt-18k', K14:'gt-14k', K10:'gt-10k', SJC:'gt-sjc', PNJ999:'gt-pnj999',
};

export const mockGoldTypes = [
  { _id: GOLD_TYPE_IDS.K24,    id: GOLD_TYPE_IDS.K24,    code: '24K',     name: 'Vàng 24K (9999)',    purity: 99.99, color: '#D97706', status: 'active', note: 'Vàng miếng cao cấp' },
  { _id: GOLD_TYPE_IDS.K18,    id: GOLD_TYPE_IDS.K18,    code: '18K',     name: 'Vàng 18K (750)',     purity: 75.00, color: '#EAB308', status: 'active', note: 'Trang sức phổ biến' },
  { _id: GOLD_TYPE_IDS.K14,    id: GOLD_TYPE_IDS.K14,    code: '14K',     name: 'Vàng 14K (585)',     purity: 58.50, color: '#CA8A04', status: 'active', note: 'Trang sức tiết kiệm' },
  { _id: GOLD_TYPE_IDS.K10,    id: GOLD_TYPE_IDS.K10,    code: '10K',     name: 'Vàng 10K (417)',     purity: 41.70, color: '#A16207', status: 'active', note: 'Trang sức phổ thông' },
  { _id: GOLD_TYPE_IDS.SJC,    id: GOLD_TYPE_IDS.SJC,    code: 'SJC',     name: 'Vàng miếng SJC',     purity: 99.99, color: '#C2410C', status: 'active', note: 'Chuẩn SJC' },
  { _id: GOLD_TYPE_IDS.PNJ999, id: GOLD_TYPE_IDS.PNJ999, code: 'PNJ-999', name: 'Vàng miếng PNJ-999', purity: 99.90, color: '#B45309', status: 'active', note: 'Chuẩn PNJ' },
];

export const mockGoldPriceRegions = [
  { _id: 'gr-hcm',    id: 'gr-hcm',    code: 'HCM',    name: 'TP. Hồ Chí Minh',  buy_adjust: 0,       sell_adjust: 0,       status: 'active' },
  { _id: 'gr-hn',     id: 'gr-hn',     code: 'HN',     name: 'Hà Nội',           buy_adjust: 20_000,  sell_adjust: 20_000,  status: 'active' },
  { _id: 'gr-dn',     id: 'gr-dn',     code: 'DN',     name: 'Đà Nẵng',          buy_adjust: 10_000,  sell_adjust: 10_000,  status: 'active' },
  { _id: 'gr-ct',     id: 'gr-ct',     code: 'CT',     name: 'Cần Thơ',          buy_adjust: 5_000,   sell_adjust: 5_000,   status: 'active' },
  { _id: 'gr-hp',     id: 'gr-hp',     code: 'HP',     name: 'Hải Phòng',        buy_adjust: 15_000,  sell_adjust: 15_000,  status: 'active' },
  { _id: 'gr-nat',    id: 'gr-nat',    code: 'NAT',    name: 'Giá quốc gia',     buy_adjust: 0,       sell_adjust: 0,       status: 'active' },
];
