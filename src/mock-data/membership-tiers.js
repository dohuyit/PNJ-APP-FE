// src/mock-data/membership-tiers.js
// Hạng thẻ thành viên — benefit, threshold.

export const MEMBERSHIP_TIER_IDS = {
  SILVER:   'tier-silver',
  GOLD:     'tier-gold',
  PLATINUM: 'tier-platinum',
  DIAMOND:  'tier-diamond',
};

export const mockMembershipTiers = [
  {
    _id: MEMBERSHIP_TIER_IDS.SILVER, id: MEMBERSHIP_TIER_IDS.SILVER,
    code: 'silver', name: 'Bạc', color: '#94A3B8',
    icon: 'solar:medal-ribbon-linear',
    min_spent: 0, max_spent: 20_000_000,
    point_rate: 1.0, discount_percent: 0,
    benefits: ['Tích điểm 1%', 'Quà sinh nhật'],
    member_count: 42_300, sort: 1, status: 'active',
  },
  {
    _id: MEMBERSHIP_TIER_IDS.GOLD, id: MEMBERSHIP_TIER_IDS.GOLD,
    code: 'gold', name: 'Vàng', color: '#D97706',
    icon: 'solar:crown-star-linear',
    min_spent: 20_000_000, max_spent: 100_000_000,
    point_rate: 1.5, discount_percent: 5,
    benefits: ['Tích điểm 1.5%', 'Giảm thêm 5%', 'Quà sinh nhật đặc biệt', 'Ưu tiên sửa chữa'],
    member_count: 12_400, sort: 2, status: 'active',
  },
  {
    _id: MEMBERSHIP_TIER_IDS.PLATINUM, id: MEMBERSHIP_TIER_IDS.PLATINUM,
    code: 'platinum', name: 'Bạch Kim', color: '#64748B',
    icon: 'solar:crown-linear',
    min_spent: 100_000_000, max_spent: 500_000_000,
    point_rate: 2.0, discount_percent: 8,
    benefits: ['Tích điểm 2%', 'Giảm thêm 8%', 'Chuyên viên tư vấn riêng', 'Miễn phí vệ sinh/kiểm định'],
    member_count: 3_200, sort: 3, status: 'active',
  },
  {
    _id: MEMBERSHIP_TIER_IDS.DIAMOND, id: MEMBERSHIP_TIER_IDS.DIAMOND,
    code: 'diamond', name: 'Kim Cương', color: '#7C3AED',
    icon: 'solar:diamond-linear',
    min_spent: 500_000_000, max_spent: null,
    point_rate: 2.5, discount_percent: 12,
    benefits: ['Tích điểm 2.5%', 'Giảm thêm 12%', 'Concierge 24/7', 'Mời sự kiện VIP', 'Quà Tết cao cấp'],
    member_count: 480, sort: 4, status: 'active',
  },
];
