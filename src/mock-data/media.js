// src/mock-data/media.js
// Media library — ảnh / video / asset. Link uploaded_by_admin.

import { ADMIN_IDS } from './admins';

const day = (n) => new Date(Date.now() - n * 86_400_000).toISOString();

const SRC = [
  ['hero-tet-2026.jpg',          'image/jpeg', 2_100_000, [1920, 1080], 'tet',       ADMIN_IDS.ADMIN_02],
  ['hero-valentine.jpg',         'image/jpeg', 1_800_000, [1920, 1080], 'valentine', ADMIN_IDS.ADMIN_08],
  ['hero-wedding.jpg',           'image/jpeg', 2_400_000, [1920, 1080], 'wedding',   ADMIN_IDS.ADMIN_02],
  ['product-nhan-01.jpg',        'image/jpeg', 480_000,   [1200, 1200], 'product',   ADMIN_IDS.ADMIN_05],
  ['product-nhan-02.jpg',        'image/jpeg', 520_000,   [1200, 1200], 'product',   ADMIN_IDS.ADMIN_05],
  ['product-day-01.jpg',         'image/jpeg', 610_000,   [1200, 1200], 'product',   ADMIN_IDS.ADMIN_05],
  ['product-hoatai-01.jpg',      'image/jpeg', 390_000,   [1200, 1200], 'product',   ADMIN_IDS.ADMIN_12],
  ['sop-training.pdf',           'application/pdf', 2_100_000, null,    'document',  ADMIN_IDS.ADMIN_04],
  ['vid-ra-mat-bst-tet.mp4',     'video/mp4', 18_400_000, null,         'video',     ADMIN_IDS.ADMIN_02],
  ['logo-pnj-white.svg',         'image/svg+xml', 12_000, [240, 80],    'brand',     ADMIN_IDS.ADMIN_01],
  ['logo-pnj-color.svg',         'image/svg+xml', 14_000, [240, 80],    'brand',     ADMIN_IDS.ADMIN_01],
  ['category-ring-cover.jpg',    'image/jpeg', 620_000,   [1600, 900],  'category',  ADMIN_IDS.ADMIN_12],
  ['category-watch-cover.jpg',   'image/jpeg', 710_000,   [1600, 900],  'category',  ADMIN_IDS.ADMIN_12],
  ['banner-gold-day.jpg',        'image/jpeg', 540_000,   [1920, 420],  'banner',    ADMIN_IDS.ADMIN_08],
  ['popup-gift-card.jpg',        'image/jpeg', 380_000,   [800, 600],   'banner',    ADMIN_IDS.ADMIN_08],
  ['ecard-tet-01.jpg',           'image/jpeg', 420_000,   [1200, 800],  'ecard',     ADMIN_IDS.ADMIN_12],
  ['ecard-valentine-01.jpg',     'image/jpeg', 390_000,   [1200, 800],  'ecard',     ADMIN_IDS.ADMIN_12],
  ['about-team.jpg',             'image/jpeg', 1_200_000, [1600, 900],  'about',     ADMIN_IDS.ADMIN_01],
];

export const mockMedia = SRC.map(([name, mime, size, dims, tag, uploadedBy], i) => ({
  _id: `media-${String(i + 1).padStart(4, '0')}`,
  id: `media-${String(i + 1).padStart(4, '0')}`,
  name,
  mime_type: mime,
  size,
  width: dims?.[0],
  height: dims?.[1],
  url: `/mock/${name}`,
  thumbnail_url: `/mock/${name}?w=240`,
  tag,
  alt: name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
  uploaded_by_admin_id: uploadedBy,
  folder: tag,
  created_at: day(i * 3),
  used_count: Math.floor(Math.random() * 12),
}));
