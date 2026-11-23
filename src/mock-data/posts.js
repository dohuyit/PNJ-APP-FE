// src/mock-data/posts.js
// Link: category_id → POST_CATEGORY_IDS, author_id → POST_AUTHOR_IDS.

import { POST_CATEGORY_IDS } from './post-categories';
import { POST_AUTHOR_IDS } from './post-authors';

const day = (n) => new Date(Date.now() + n * 86_400_000).toISOString();

const POSTS_SRC = [
  ['5 cách bảo quản nhẫn kim cương sáng như mới',           POST_CATEGORY_IDS.CARE,    POST_AUTHOR_IDS.A1, 'published', -2,   4820],
  ['Xu hướng trang sức cô dâu 2026',                         POST_CATEGORY_IDS.TREND,   POST_AUTHOR_IDS.A3, 'published', -3,   8230],
  ['Chuyện tình đẹp cùng cặp nhẫn cưới PNJ',                  POST_CATEGORY_IDS.STORY,   POST_AUTHOR_IDS.A2, 'published', -5,   3210],
  ['Chọn kim cương theo chuẩn 4C — hướng dẫn chi tiết',      POST_CATEGORY_IDS.GUIDE,   POST_AUTHOR_IDS.A5, 'published', -7,   12_400],
  ['PNJ khai trương cửa hàng flagship mới tại Hà Nội',        POST_CATEGORY_IDS.NEWS,    POST_AUTHOR_IDS.A1, 'published', -10,  6_500],
  ['Nghi thức trao nhẫn trong đám cưới Việt',                 POST_CATEGORY_IDS.WEDDING, POST_AUTHOR_IDS.A3, 'published', -12,  4_120],
  ['Cách làm sạch dây chuyền vàng tại nhà',                   POST_CATEGORY_IDS.CARE,    POST_AUTHOR_IDS.A2, 'published', -15,  3_320],
  ['Top 10 mẫu hoa tai được yêu thích nhất 2025',             POST_CATEGORY_IDS.TREND,   POST_AUTHOR_IDS.A3, 'published', -18,  9_200],
  ['Khách hàng chia sẻ: hành trình chọn nhẫn cầu hôn',        POST_CATEGORY_IDS.STORY,   POST_AUTHOR_IDS.A2, 'published', -22,  2_880],
  ['Nên chọn vàng 18K hay 24K cho trang sức hàng ngày?',      POST_CATEGORY_IDS.GUIDE,   POST_AUTHOR_IDS.A1, 'published', -25,  7_650],
  ['PNJ đồng hành cùng chương trình "Triệu nụ cười Việt"',    POST_CATEGORY_IDS.NEWS,    POST_AUTHOR_IDS.A4, 'published', -30,  5_400],
  ['Trang sức kim cương tăng giá — phân tích thị trường Q4',  POST_CATEGORY_IDS.NEWS,    POST_AUTHOR_IDS.A4, 'published', -40,  4_800],
  ['BST Tết 2026 chính thức ra mắt',                           POST_CATEGORY_IDS.NEWS,    POST_AUTHOR_IDS.A1, 'published', -14,  22_100],
  ['Cưới hỏi sang trọng với ngân sách vừa phải',               POST_CATEGORY_IDS.WEDDING, POST_AUTHOR_IDS.A3, 'draft',     0,    0],
  ['Mẹo chọn quà tặng 8/3 cho mẹ',                              POST_CATEGORY_IDS.GUIDE,   POST_AUTHOR_IDS.A2, 'scheduled', 3,    0],
];

export const mockPosts = POSTS_SRC.map(([title, cat, author, status, daysAgo, views], i) => {
  const id = `post-${String(i + 1).padStart(3, '0')}`;
  return {
    _id: id, id,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9ăâđêôơưàáạảãèéẹẻẽìíịỉĩòóọỏõùúụủũỳýỵỷỹ\s]/gi, '').replace(/\s+/g, '-').slice(0, 60),
    excerpt: title + ' — đọc chi tiết trong bài viết.',
    cover_image: '',
    category_id: cat,
    author_id: author,
    status,
    is_featured: i < 3,
    reading_time: 4 + (i % 7),
    views,
    published_at: status === 'published' ? day(daysAgo) : status === 'scheduled' ? day(daysAgo) : null,
    updated_at: day(daysAgo - 0.5),
  };
});
