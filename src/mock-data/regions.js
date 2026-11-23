// src/mock-data/regions.js
// Vùng kinh doanh (gom store theo khu vực).
import { STORE_IDS } from './ids';

export const REGION_IDS = {
  R_SOUTH:   'region-south',
  R_NORTH:   'region-north',
  R_CENTRAL: 'region-central',
  R_WEST:    'region-west',
};

export const mockRegions = [
  {
    _id: REGION_IDS.R_SOUTH, id: REGION_IDS.R_SOUTH, code: 'MN',
    name: 'Miền Nam', description: 'TP.HCM, Bình Dương, BR-VT, Lâm Đồng',
    store_ids: [STORE_IDS.HCM_NTMK, STORE_IDS.HCM_LTT, STORE_IDS.HCM_LTK, STORE_IDS.HCM_PTH, STORE_IDS.BRVT_HUNG_VUONG, STORE_IDS.DL_BA_THANG_HAI, STORE_IDS.BINH_DUONG],
    manager: 'Nguyễn Hoàng Minh', status: 'active',
  },
  {
    _id: REGION_IDS.R_NORTH, id: REGION_IDS.R_NORTH, code: 'MB',
    name: 'Miền Bắc', description: 'Hà Nội, Hải Phòng',
    store_ids: [STORE_IDS.HN_HBT, STORE_IDS.HN_BAT_DAN, STORE_IDS.HN_XUAN_THUY, STORE_IDS.HP_LAC_LONG],
    manager: 'Phạm Thu Hằng', status: 'active',
  },
  {
    _id: REGION_IDS.R_CENTRAL, id: REGION_IDS.R_CENTRAL, code: 'MT',
    name: 'Miền Trung', description: 'Đà Nẵng',
    store_ids: [STORE_IDS.DN_LE_DUAN],
    manager: 'Bùi Thanh Tùng', status: 'active',
  },
  {
    _id: REGION_IDS.R_WEST, id: REGION_IDS.R_WEST, code: 'MT',
    name: 'Miền Tây', description: 'Cần Thơ',
    store_ids: [STORE_IDS.CT_30T4],
    manager: 'Trương Hà My', status: 'active',
  },
];
