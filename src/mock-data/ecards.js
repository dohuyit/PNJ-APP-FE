// src/mock-data/ecards.js
// Thiệp điện tử: categories + templates (link category_id).

export const ECARD_CATEGORY_IDS = {
  TET:'ecc-tet', VAL:'ecc-val', BIRTH:'ecc-birth', WED:'ecc-wed', MOTHER:'ecc-mother',
  FATHER:'ecc-father', ANNI:'ecc-anni', XMAS:'ecc-xmas',
};

export const mockEcardCategories = [
  { _id: ECARD_CATEGORY_IDS.TET,    id: ECARD_CATEGORY_IDS.TET,    code: 'tet',      name: 'Tết nguyên đán',   icon: 'solar:leaf-linear',       sort: 1, template_count: 8,  status: 'active' },
  { _id: ECARD_CATEGORY_IDS.VAL,    id: ECARD_CATEGORY_IDS.VAL,    code: 'val',      name: 'Valentine',        icon: 'solar:heart-linear',      sort: 2, template_count: 6,  status: 'active' },
  { _id: ECARD_CATEGORY_IDS.BIRTH,  id: ECARD_CATEGORY_IDS.BIRTH,  code: 'birth',    name: 'Sinh nhật',        icon: 'solar:cake-linear',       sort: 3, template_count: 10, status: 'active' },
  { _id: ECARD_CATEGORY_IDS.WED,    id: ECARD_CATEGORY_IDS.WED,    code: 'wed',      name: 'Cưới hỏi',         icon: 'solar:ring-linear',       sort: 4, template_count: 5,  status: 'active' },
  { _id: ECARD_CATEGORY_IDS.MOTHER, id: ECARD_CATEGORY_IDS.MOTHER, code: 'mother',   name: 'Ngày của Mẹ',      icon: 'solar:gift-linear',       sort: 5, template_count: 4,  status: 'active' },
  { _id: ECARD_CATEGORY_IDS.FATHER, id: ECARD_CATEGORY_IDS.FATHER, code: 'father',   name: 'Ngày của Cha',     icon: 'solar:gift-linear',       sort: 6, template_count: 3,  status: 'active' },
  { _id: ECARD_CATEGORY_IDS.ANNI,   id: ECARD_CATEGORY_IDS.ANNI,   code: 'anni',     name: 'Kỷ niệm',          icon: 'solar:calendar-linear',   sort: 7, template_count: 5,  status: 'active' },
  { _id: ECARD_CATEGORY_IDS.XMAS,   id: ECARD_CATEGORY_IDS.XMAS,   code: 'xmas',     name: 'Giáng sinh',       icon: 'solar:star-linear',       sort: 8, template_count: 4,  status: 'inactive' },
];

const templateNames = [
  'Chúc xuân an khang', 'Tân xuân thịnh vượng', 'Phú quý thái lai',
  'Yêu em cả đời', 'Mãi bên nhau', 'Nồng nàn hoa hồng',
  'Chúc mừng sinh nhật', 'Năm mới tuổi mới', 'Tỏa sáng tuổi mới',
  'Hạnh phúc trăm năm', 'Trọn đời yêu thương',
  'Cảm ơn Mẹ', 'Mẹ là nhất', 'Mẹ ơi con yêu Mẹ',
];

export const mockEcardTemplates = [];
let tid = 1;
mockEcardCategories.forEach((cat) => {
  const count = Math.min(cat.template_count, 6); // limit visual
  for (let i = 0; i < count; i += 1) {
    const id = `ect-${String(tid++).padStart(3, '0')}`;
    mockEcardTemplates.push({
      _id: id, id,
      code: id,
      category_id: cat._id,
      name: templateNames[(tid + i) % templateNames.length],
      preview_url: '',
      sort: i + 1,
      status: i === count - 1 ? 'draft' : 'active',
      usage_count: Math.floor(Math.random() * 500),
      created_at: new Date(Date.now() - (tid * 86_400_000)).toISOString(),
    });
  }
});
