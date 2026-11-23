// src/mock-data/locations.js
// Địa giới hành chính VN rút gọn — dùng cho address picker.

export const mockProvinces = [
  { _id: 'prov-79', id: 'prov-79', code: '79', name: 'Hồ Chí Minh', district_count: 22, region: 'Miền Nam' },
  { _id: 'prov-01', id: 'prov-01', code: '01', name: 'Hà Nội', district_count: 30, region: 'Miền Bắc' },
  { _id: 'prov-48', id: 'prov-48', code: '48', name: 'Đà Nẵng', district_count: 8, region: 'Miền Trung' },
  { _id: 'prov-92', id: 'prov-92', code: '92', name: 'Cần Thơ', district_count: 9, region: 'Miền Tây' },
  { _id: 'prov-31', id: 'prov-31', code: '31', name: 'Hải Phòng', district_count: 15, region: 'Miền Bắc' },
  { _id: 'prov-77', id: 'prov-77', code: '77', name: 'Bà Rịa - Vũng Tàu', district_count: 8, region: 'Miền Nam' },
  { _id: 'prov-68', id: 'prov-68', code: '68', name: 'Lâm Đồng', district_count: 12, region: 'Miền Nam' },
  { _id: 'prov-74', id: 'prov-74', code: '74', name: 'Bình Dương', district_count: 9, region: 'Miền Nam' },
  { _id: 'prov-56', id: 'prov-56', code: '56', name: 'Khánh Hoà', district_count: 9, region: 'Miền Trung' },
  { _id: 'prov-72', id: 'prov-72', code: '72', name: 'Đồng Nai', district_count: 11, region: 'Miền Nam' },
];

export const mockDistricts = [
  { _id: 'dist-q1',  id: 'dist-q1',  province_id: 'prov-79', name: 'Quận 1',        ward_count: 10 },
  { _id: 'dist-q3',  id: 'dist-q3',  province_id: 'prov-79', name: 'Quận 3',        ward_count: 12 },
  { _id: 'dist-q10', id: 'dist-q10', province_id: 'prov-79', name: 'Quận 10',       ward_count: 14 },
  { _id: 'dist-btn', id: 'dist-btn', province_id: 'prov-79', name: 'Bình Thạnh',    ward_count: 20 },
  { _id: 'dist-hk',  id: 'dist-hk',  province_id: 'prov-01', name: 'Hoàn Kiếm',     ward_count: 18 },
  { _id: 'dist-cg',  id: 'dist-cg',  province_id: 'prov-01', name: 'Cầu Giấy',      ward_count: 8 },
  { _id: 'dist-hc',  id: 'dist-hc',  province_id: 'prov-48', name: 'Hải Châu',      ward_count: 13 },
  { _id: 'dist-nk',  id: 'dist-nk',  province_id: 'prov-92', name: 'Ninh Kiều',     ward_count: 13 },
];
