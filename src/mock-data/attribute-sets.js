// src/mock-data/attribute-sets.js
// Mỗi set gom 1 nhóm attribute cho 1 loại SP. Per-set: is_required, is_variant, sort.
import { ATTRIBUTE_SET_IDS, ATTRIBUTE_IDS } from './ids';
import { mockAttributes } from './attributes';

const attr = (id) => mockAttributes.find((a) => a._id === id);

function buildSet(id, name, description, items, sort = 1) {
  return {
    _id: id, id,
    name, description, sort,
    // backend có thể trả attributes với attribute nested, mock bao gồm cả per-set flags + nested attribute
    attributes: items.map((it, i) => ({
      attribute_id: it.id,
      is_required: !!it.required,
      is_variant: !!it.variant,
      sort: i + 1,
      attribute: attr(it.id),
    })),
    attribute_count: items.length,
  };
}

export const mockAttributeSets = [
  buildSet(
    ATTRIBUTE_SET_IDS.NHAN_KIM_CUONG,
    'Nhẫn kim cương',
    'Dùng cho vỏ nhẫn kim cương / nhẫn cầu hôn.',
    [
      { id: ATTRIBUTE_IDS.METAL_COLOR, required: true,  variant: true },
      { id: ATTRIBUTE_IDS.KARAT,       required: true,  variant: true },
      { id: ATTRIBUTE_IDS.RING_SIZE,   required: true,  variant: true },
      { id: ATTRIBUTE_IDS.MATERIAL,    required: true },
      { id: ATTRIBUTE_IDS.GOLD_WEIGHT, required: true },
      { id: ATTRIBUTE_IDS.STONE_TYPE,  required: true },
      { id: ATTRIBUTE_IDS.STONE_CARAT, required: true },
      { id: ATTRIBUTE_IDS.STONE_COLOR },
      { id: ATTRIBUTE_IDS.STONE_CLARITY },
      { id: ATTRIBUTE_IDS.CERT_TYPE, required: true },
      { id: ATTRIBUTE_IDS.ORIGIN },
    ],
    1,
  ),
  buildSet(
    ATTRIBUTE_SET_IDS.NHAN_VANG,
    'Nhẫn vàng (không đá)',
    'Nhẫn vàng trơn hoặc đính đá phụ.',
    [
      { id: ATTRIBUTE_IDS.METAL_COLOR, required: true, variant: true },
      { id: ATTRIBUTE_IDS.KARAT,       required: true, variant: true },
      { id: ATTRIBUTE_IDS.RING_SIZE,   required: true, variant: true },
      { id: ATTRIBUTE_IDS.MATERIAL,    required: true },
      { id: ATTRIBUTE_IDS.GOLD_WEIGHT, required: true },
      { id: ATTRIBUTE_IDS.ORIGIN },
    ],
    2,
  ),
  buildSet(
    ATTRIBUTE_SET_IDS.NHAN_CUOI,
    'Nhẫn cưới (cặp đôi)',
    'Cặp nhẫn cưới nam + nữ.',
    [
      { id: ATTRIBUTE_IDS.METAL_COLOR, required: true, variant: true },
      { id: ATTRIBUTE_IDS.KARAT,       required: true, variant: true },
      { id: ATTRIBUTE_IDS.RING_SIZE,   required: true, variant: true },
      { id: ATTRIBUTE_IDS.MATERIAL,    required: true },
      { id: ATTRIBUTE_IDS.GOLD_WEIGHT, required: true },
    ],
    3,
  ),
  buildSet(
    ATTRIBUTE_SET_IDS.DAY_CHUYEN,
    'Dây chuyền',
    'Dây chuyền vàng / bạc.',
    [
      { id: ATTRIBUTE_IDS.METAL_COLOR,  required: true, variant: true },
      { id: ATTRIBUTE_IDS.KARAT,        required: true, variant: true },
      { id: ATTRIBUTE_IDS.CHAIN_LENGTH, required: true, variant: true },
      { id: ATTRIBUTE_IDS.MATERIAL,     required: true },
      { id: ATTRIBUTE_IDS.GOLD_WEIGHT,  required: true },
      { id: ATTRIBUTE_IDS.STONE_TYPE },
    ],
    4,
  ),
  buildSet(
    ATTRIBUTE_SET_IDS.VONG_TAY,
    'Vòng tay · Lắc tay',
    'Vòng kiểng, vòng trơn, lắc tay.',
    [
      { id: ATTRIBUTE_IDS.METAL_COLOR, required: true, variant: true },
      { id: ATTRIBUTE_IDS.KARAT,       required: true, variant: true },
      { id: ATTRIBUTE_IDS.BANGLE_SIZE, required: true, variant: true },
      { id: ATTRIBUTE_IDS.MATERIAL,    required: true },
      { id: ATTRIBUTE_IDS.GOLD_WEIGHT, required: true },
    ],
    5,
  ),
  buildSet(
    ATTRIBUTE_SET_IDS.DONG_HO,
    'Đồng hồ',
    'Đồng hồ nam / nữ cao cấp.',
    [
      { id: ATTRIBUTE_IDS.WATCH_STRAP,     required: true, variant: true },
      { id: ATTRIBUTE_IDS.WATCH_CASE_SIZE, required: true, variant: true },
      { id: ATTRIBUTE_IDS.WATCH_MOVEMENT,  required: true },
      { id: ATTRIBUTE_IDS.ORIGIN },
    ],
    6,
  ),
  buildSet(
    ATTRIBUTE_SET_IDS.KIM_CUONG_VIEN,
    'Kim cương viên',
    'Kim cương rời có chứng nhận.',
    [
      { id: ATTRIBUTE_IDS.STONE_CARAT,   required: true, variant: true },
      { id: ATTRIBUTE_IDS.STONE_COLOR,   required: true },
      { id: ATTRIBUTE_IDS.STONE_CLARITY, required: true },
      { id: ATTRIBUTE_IDS.CERT_TYPE,     required: true },
      { id: ATTRIBUTE_IDS.ORIGIN },
    ],
    7,
  ),
];
