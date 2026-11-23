// src/mock-data/post-authors.js

export const POST_AUTHOR_IDS = {
  A1:'au-mai-anh', A2:'au-phuong-linh', A3:'au-kha-ngan', A4:'au-minh-khoa', A5:'au-guest-01',
};

export const mockPostAuthors = [
  { _id: POST_AUTHOR_IDS.A1, id: POST_AUTHOR_IDS.A1, name: 'Trần Thị Mai Anh',  slug: 'mai-anh',     bio: 'Chuyên viên content marketing PNJ · 6 năm kinh nghiệm trang sức',  avatar: '', role: 'editor',     post_count: 48, status: 'active' },
  { _id: POST_AUTHOR_IDS.A2, id: POST_AUTHOR_IDS.A2, name: 'Ngô Phương Linh',   slug: 'phuong-linh', bio: 'Content lead phụ trách BST Tết, Valentine',                       avatar: '', role: 'editor',     post_count: 32, status: 'active' },
  { _id: POST_AUTHOR_IDS.A3, id: POST_AUTHOR_IDS.A3, name: 'Lưu Khả Ngân',       slug: 'kha-ngan',   bio: 'Biên tập chuyên mục xu hướng + cưới hỏi',                          avatar: '', role: 'editor',     post_count: 26, status: 'active' },
  { _id: POST_AUTHOR_IDS.A4, id: POST_AUTHOR_IDS.A4, name: 'Nguyễn Hoàng Minh',  slug: 'minh-nh',     bio: 'CEO · thỉnh thoảng viết bài về chiến lược',                         avatar: '', role: 'guest',      post_count: 5,  status: 'active' },
  { _id: POST_AUTHOR_IDS.A5, id: POST_AUTHOR_IDS.A5, name: 'Chuyên gia KTS',      slug: 'guest-kts',  bio: 'Khách mời · chuyên gia kiểm định kim cương',                        avatar: '', role: 'guest',      post_count: 8,  status: 'active' },
];
