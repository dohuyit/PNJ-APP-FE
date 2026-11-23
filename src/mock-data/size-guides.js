// src/mock-data/size-guides.js
import { SIZE_GUIDE_IDS } from './ids';

export const mockSizeGuides = [
  {
    _id: SIZE_GUIDE_IDS.NHAN, id: SIZE_GUIDE_IDS.NHAN,
    name: 'Hướng dẫn size nhẫn', type: 'ring', status: 'active',
    items: [
      { size: '5',  mm: 15.7, inch: 0.62, note: '' },
      { size: '6',  mm: 16.5, inch: 0.65, note: 'Phổ thông' },
      { size: '7',  mm: 17.3, inch: 0.68, note: '' },
      { size: '8',  mm: 18.1, inch: 0.71, note: '' },
      { size: '9',  mm: 19.0, inch: 0.75, note: 'Phổ thông nam' },
      { size: '10', mm: 19.8, inch: 0.78, note: '' },
      { size: '11', mm: 20.6, inch: 0.81, note: '' },
      { size: '12', mm: 21.4, inch: 0.84, note: '' },
      { size: '13', mm: 22.2, inch: 0.87, note: '' },
    ],
  },
  {
    _id: SIZE_GUIDE_IDS.VONG_TAY, id: SIZE_GUIDE_IDS.VONG_TAY,
    name: 'Hướng dẫn size vòng tay', type: 'bangle', status: 'active',
    items: [
      { size: '50', mm: 50, inch: 1.97, note: '' },
      { size: '52', mm: 52, inch: 2.05, note: 'Phổ thông nữ' },
      { size: '54', mm: 54, inch: 2.13, note: '' },
      { size: '56', mm: 56, inch: 2.20, note: '' },
      { size: '58', mm: 58, inch: 2.28, note: 'Phổ thông nam' },
      { size: '60', mm: 60, inch: 2.36, note: '' },
    ],
  },
  {
    _id: SIZE_GUIDE_IDS.LAC, id: SIZE_GUIDE_IDS.LAC,
    name: 'Hướng dẫn size lắc tay', type: 'bracelet', status: 'active',
    items: [
      { size: 'S',  mm: 160, inch: 6.3, note: 'Nữ nhỏ' },
      { size: 'M',  mm: 170, inch: 6.7, note: 'Phổ thông nữ' },
      { size: 'L',  mm: 180, inch: 7.1, note: 'Phổ thông nam' },
      { size: 'XL', mm: 190, inch: 7.5, note: 'Nam lớn' },
    ],
  },
  {
    _id: SIZE_GUIDE_IDS.DAY_CHUYEN, id: SIZE_GUIDE_IDS.DAY_CHUYEN,
    name: 'Hướng dẫn size dây chuyền', type: 'necklace', status: 'active',
    items: [
      { size: '40cm', mm: 400, inch: 15.7, note: 'Choker' },
      { size: '42cm', mm: 420, inch: 16.5, note: 'Phổ thông nữ' },
      { size: '45cm', mm: 450, inch: 17.7, note: '' },
      { size: '50cm', mm: 500, inch: 19.7, note: '' },
      { size: '55cm', mm: 550, inch: 21.6, note: '' },
      { size: '60cm', mm: 600, inch: 23.6, note: 'Phổ thông nam' },
    ],
  },
];
