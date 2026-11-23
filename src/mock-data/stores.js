// src/mock-data/stores.js
import { STORE_IDS } from './ids';

export const mockStores = [
  { _id: STORE_IDS.HCM_NTMK, id: STORE_IDS.HCM_NTMK, code: 'HCM01', name: 'PNJ Nguyễn Thị Minh Khai',
    address: '170E Nguyễn Thị Minh Khai, Q.3, TP.HCM', province: 'Hồ Chí Minh', district: 'Quận 3',
    phone: '028 3930 2399', type: 'flagship', status: 'active',
    lat: 10.776, lng: 106.692, services: ['pos','repair','pickup'],
    open_time: '08:30', close_time: '21:30' },

  { _id: STORE_IDS.HCM_LTT, id: STORE_IDS.HCM_LTT, code: 'HCM02', name: 'PNJ Lê Thánh Tôn',
    address: '52C Lê Thánh Tôn, Q.1, TP.HCM', province: 'Hồ Chí Minh', district: 'Quận 1',
    phone: '028 3822 1122', type: 'store', status: 'active',
    lat: 10.776, lng: 106.700, services: ['pos','pickup'],
    open_time: '08:30', close_time: '21:30' },

  { _id: STORE_IDS.HCM_LTK, id: STORE_IDS.HCM_LTK, code: 'HCM03', name: 'PNJ Lý Thường Kiệt',
    address: '85 Lý Thường Kiệt, Q.10, TP.HCM', province: 'Hồ Chí Minh', district: 'Quận 10',
    phone: '028 3927 5566', type: 'store', status: 'active',
    lat: 10.772, lng: 106.666, services: ['pos','repair'],
    open_time: '08:30', close_time: '21:00' },

  { _id: STORE_IDS.HCM_PTH, id: STORE_IDS.HCM_PTH, code: 'HCM04', name: 'PNJ Phan Thúc Hoạch',
    address: '12 Phan Thúc Hoạch, Q.Bình Thạnh, TP.HCM', province: 'Hồ Chí Minh', district: 'Bình Thạnh',
    phone: '028 3899 1133', type: 'store', status: 'active',
    lat: 10.806, lng: 106.711, services: ['pos'],
    open_time: '09:00', close_time: '21:00' },

  { _id: STORE_IDS.HN_HBT, id: STORE_IDS.HN_HBT, code: 'HN01', name: 'PNJ Hai Bà Trưng',
    address: '134 Hai Bà Trưng, Q.Hoàn Kiếm, Hà Nội', province: 'Hà Nội', district: 'Hoàn Kiếm',
    phone: '024 3936 8899', type: 'flagship', status: 'active',
    lat: 21.028, lng: 105.851, services: ['pos','repair','pickup'],
    open_time: '08:30', close_time: '21:30' },

  { _id: STORE_IDS.HN_BAT_DAN, id: STORE_IDS.HN_BAT_DAN, code: 'HN02', name: 'PNJ Bát Đàn',
    address: '38 Bát Đàn, Q.Hoàn Kiếm, Hà Nội', province: 'Hà Nội', district: 'Hoàn Kiếm',
    phone: '024 3923 1234', type: 'store', status: 'active',
    lat: 21.034, lng: 105.848, services: ['pos'],
    open_time: '08:30', close_time: '21:00' },

  { _id: STORE_IDS.HN_XUAN_THUY, id: STORE_IDS.HN_XUAN_THUY, code: 'HN03', name: 'PNJ Xuân Thủy',
    address: '87 Xuân Thủy, Q.Cầu Giấy, Hà Nội', province: 'Hà Nội', district: 'Cầu Giấy',
    phone: '024 3754 1199', type: 'store', status: 'active',
    lat: 21.036, lng: 105.785, services: ['pos','pickup'],
    open_time: '09:00', close_time: '21:00' },

  { _id: STORE_IDS.DN_LE_DUAN, id: STORE_IDS.DN_LE_DUAN, code: 'DN01', name: 'PNJ Lê Duẩn',
    address: '144 Lê Duẩn, Q.Hải Châu, Đà Nẵng', province: 'Đà Nẵng', district: 'Hải Châu',
    phone: '0236 3821 456', type: 'store', status: 'active',
    lat: 16.070, lng: 108.223, services: ['pos'],
    open_time: '08:30', close_time: '21:00' },

  { _id: STORE_IDS.CT_30T4, id: STORE_IDS.CT_30T4, code: 'CT01', name: 'PNJ 30/4',
    address: '98 Đường 30 Tháng 4, Q.Ninh Kiều, Cần Thơ', province: 'Cần Thơ', district: 'Ninh Kiều',
    phone: '0292 3838 123', type: 'store', status: 'active',
    lat: 10.033, lng: 105.776, services: ['pos'],
    open_time: '08:30', close_time: '21:00' },

  { _id: STORE_IDS.HP_LAC_LONG, id: STORE_IDS.HP_LAC_LONG, code: 'HP01', name: 'PNJ Lạc Long Quân',
    address: '112 Lạc Long Quân, Hồng Bàng, Hải Phòng', province: 'Hải Phòng', district: 'Hồng Bàng',
    phone: '0225 3747 123', type: 'store', status: 'active',
    lat: 20.857, lng: 106.676, services: ['pos'],
    open_time: '08:30', close_time: '21:00' },

  { _id: STORE_IDS.BRVT_HUNG_VUONG, id: STORE_IDS.BRVT_HUNG_VUONG, code: 'VT01', name: 'PNJ Hùng Vương',
    address: '45 Hùng Vương, Vũng Tàu', province: 'Bà Rịa - Vũng Tàu', district: 'Vũng Tàu',
    phone: '0254 3858 999', type: 'store', status: 'inactive',
    lat: 10.346, lng: 107.084, services: ['pos'],
    open_time: '08:30', close_time: '21:00' },

  { _id: STORE_IDS.DL_BA_THANG_HAI, id: STORE_IDS.DL_BA_THANG_HAI, code: 'DL01', name: 'PNJ 3 Tháng 2',
    address: '55 Đường 3 Tháng 2, Đà Lạt', province: 'Lâm Đồng', district: 'Đà Lạt',
    phone: '0263 3828 111', type: 'store', status: 'active',
    lat: 11.943, lng: 108.448, services: ['pos'],
    open_time: '08:30', close_time: '21:00' },

  { _id: STORE_IDS.BINH_DUONG, id: STORE_IDS.BINH_DUONG, code: 'BD01', name: 'PNJ Bình Dương',
    address: '200 Đại lộ Bình Dương, Thủ Dầu Một', province: 'Bình Dương', district: 'Thủ Dầu Một',
    phone: '0274 3789 888', type: 'store', status: 'active',
    lat: 10.980, lng: 106.676, services: ['pos','pickup'],
    open_time: '08:30', close_time: '21:00' },
];
