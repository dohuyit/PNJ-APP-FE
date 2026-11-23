// src/mock-data/post-categories.js

export const POST_CATEGORY_IDS = {
  CARE:'pc-care', TREND:'pc-trend', STORY:'pc-story', GUIDE:'pc-guide', NEWS:'pc-news', WEDDING:'pc-wedding',
};

export const mockPostCategories = [
  { _id: POST_CATEGORY_IDS.CARE,    id: POST_CATEGORY_IDS.CARE,    code: 'care',    name: 'Chăm sóc trang sức', slug: 'cham-soc', icon: 'solar:brush-linear', post_count: 18, sort: 1, status: 'active' },
  { _id: POST_CATEGORY_IDS.TREND,   id: POST_CATEGORY_IDS.TREND,   code: 'trend',   name: 'Xu hướng',            slug: 'xu-huong',  icon: 'solar:fire-linear',  post_count: 24, sort: 2, status: 'active' },
  { _id: POST_CATEGORY_IDS.STORY,   id: POST_CATEGORY_IDS.STORY,   code: 'story',   name: 'Câu chuyện khách hàng',slug: 'cau-chuyen', icon: 'solar:book-linear', post_count: 12, sort: 3, status: 'active' },
  { _id: POST_CATEGORY_IDS.GUIDE,   id: POST_CATEGORY_IDS.GUIDE,   code: 'guide',   name: 'Cẩm nang mua sắm',     slug: 'cam-nang',  icon: 'solar:question-circle-linear', post_count: 30, sort: 4, status: 'active' },
  { _id: POST_CATEGORY_IDS.NEWS,    id: POST_CATEGORY_IDS.NEWS,    code: 'news',    name: 'Tin PNJ',             slug: 'tin-pnj',   icon: 'solar:news-linear',  post_count: 42, sort: 5, status: 'active' },
  { _id: POST_CATEGORY_IDS.WEDDING, id: POST_CATEGORY_IDS.WEDDING, code: 'wedding', name: 'Cưới hỏi',            slug: 'cuoi-hoi',  icon: 'solar:ring-linear',  post_count: 20, sort: 6, status: 'active' },
];
