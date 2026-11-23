// src/mock-data/ids.js
// Stable string IDs — dùng làm foreign key dễ đọc giữa các mock entity.
// Prefix theo entity → cross-reference dễ visual, grep nhanh.

export const BRAND_IDS = {
  PNJ: 'brand-pnj',
  STYLE: 'brand-style',
  MANCODE: 'brand-mancode',
  DISNEY: 'brand-disney-pnj',
  HEARTS_ON_FIRE: 'brand-hearts-on-fire',
  RADO: 'brand-rado',
  ARTA: 'brand-arta',
};

export const COLLECTION_IDS = {
  MY_FIRST_DIAMOND: 'col-my-first-diamond',
  HANH_PHUC: 'col-hanh-phuc',
  THANH_XUAN: 'col-thanh-xuan',
  WEDDING: 'col-wedding',
  DISNEY_PRINCESS: 'col-disney-princess',
  MANCODE: 'col-mancode',
  TET_2026: 'col-tet-2026',
  VALENTINE: 'col-valentine',
};

export const LINE_IDS = {
  NHAN_CAU_HON: 'line-nhan-cau-hon',
  NHAN_CUOI: 'line-nhan-cuoi',
  NHAN_NU: 'line-nhan-nu',
  NHAN_NAM: 'line-nhan-nam',
  DAY_CHUYEN_NU: 'line-day-chuyen-nu',
  VONG_TAY: 'line-vong-tay',
  LAC_TAY: 'line-lac-tay',
  HOA_TAI: 'line-hoa-tai',
  DONG_HO: 'line-dong-ho',
  KIM_CUONG_VIEN: 'line-kim-cuong-vien',
};

export const CATEGORY_IDS = {
  TRANG_SUC: 'cat-trang-suc',
  NHAN: 'cat-nhan',
  NHAN_KIM_CUONG: 'cat-nhan-kim-cuong',
  NHAN_VANG: 'cat-nhan-vang',
  DAY_CHUYEN: 'cat-day-chuyen',
  VONG_LAC: 'cat-vong-lac',
  HOA_TAI: 'cat-hoa-tai',
  DONG_HO: 'cat-dong-ho',
  KIM_CUONG_VIEN: 'cat-kim-cuong-vien',
  QUA_TANG: 'cat-qua-tang',
};

export const ATTRIBUTE_IDS = {
  METAL_COLOR: 'attr-metal-color',
  KARAT: 'attr-karat',
  MATERIAL: 'attr-material',
  RING_SIZE: 'attr-ring-size',
  BANGLE_SIZE: 'attr-bangle-size',
  CHAIN_LENGTH: 'attr-chain-length',
  GOLD_WEIGHT: 'attr-gold-weight',
  STONE_TYPE: 'attr-stone-type',
  STONE_CARAT: 'attr-stone-carat',
  STONE_COLOR: 'attr-stone-color',
  STONE_CLARITY: 'attr-stone-clarity',
  CERT_TYPE: 'attr-cert-type',
  ORIGIN: 'attr-origin',
  WATCH_MOVEMENT: 'attr-watch-movement',
  WATCH_STRAP: 'attr-watch-strap',
  WATCH_CASE_SIZE: 'attr-watch-case-size',
};

export const ATTRIBUTE_SET_IDS = {
  NHAN_KIM_CUONG: 'set-nhan-kim-cuong',
  NHAN_VANG: 'set-nhan-vang',
  NHAN_CUOI: 'set-nhan-cuoi',
  DAY_CHUYEN: 'set-day-chuyen',
  VONG_TAY: 'set-vong-tay',
  DONG_HO: 'set-dong-ho',
  KIM_CUONG_VIEN: 'set-kim-cuong-vien',
};

export const SIZE_GUIDE_IDS = {
  NHAN: 'sg-nhan',
  VONG_TAY: 'sg-vong-tay',
  LAC: 'sg-lac',
  DAY_CHUYEN: 'sg-day-chuyen',
};

export const STORE_IDS = {
  HCM_NTMK:   'store-hcm-ntmk',
  HCM_LTT:    'store-hcm-ltt',
  HCM_LTK:    'store-hcm-ltk',
  HCM_PTH:    'store-hcm-pth',
  HN_HBT:     'store-hn-hbt',
  HN_BAT_DAN: 'store-hn-bat-dan',
  HN_XUAN_THUY:'store-hn-xuan-thuy',
  DN_LE_DUAN: 'store-dn-le-duan',
  CT_30T4:    'store-ct-30t4',
  HP_LAC_LONG:'store-hp-lac-long',
  BRVT_HUNG_VUONG: 'store-brvt-hung-vuong',
  DL_BA_THANG_HAI: 'store-dl-ba-thang-hai',
  BINH_DUONG: 'store-bd-binh-duong',
};

export const ACTOR_IDS = {
  ADMIN_ROOT: 'actor-admin-root',
  TRAN_B: 'actor-tran-b',
  NGUYEN_A: 'actor-nguyen-a',
  LE_C: 'actor-le-c',
  PHAM_D: 'actor-pham-d',
};

export const CUSTOMER_IDS = Array.from({ length: 20 }, (_, i) => `cust-${String(i + 1).padStart(3, '0')}`);
export const PRODUCT_IDS  = Array.from({ length: 30 }, (_, i) => `prod-${String(i + 1).padStart(3, '0')}`);
