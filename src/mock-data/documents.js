// src/mock-data/documents.js
// Tài liệu nội bộ PNJ — chính sách, hướng dẫn, SOP.

const day = (n) => new Date(Date.now() - n * 86_400_000).toISOString();

export const mockDocuments = [
  { _id: 'doc-001', id: 'doc-001', code: 'POL-001', name: 'Chính sách bảo hành trang sức',       category: 'policy',   file_type: 'pdf',  file_size: 820_000,  version: 'v3.2', owner: 'Nguyễn Hoàng Minh', updated_at: day(5),  downloads: 1240, status: 'published' },
  { _id: 'doc-002', id: 'doc-002', code: 'POL-002', name: 'Chính sách thu đổi vàng',              category: 'policy',   file_type: 'pdf',  file_size: 540_000,  version: 'v2.0', owner: 'Nguyễn Hoàng Minh', updated_at: day(12), downloads: 980,  status: 'published' },
  { _id: 'doc-003', id: 'doc-003', code: 'SOP-001', name: 'SOP · Tiếp nhận yêu cầu thu đổi',      category: 'sop',      file_type: 'docx', file_size: 320_000,  version: 'v1.5', owner: 'Lê Quốc Khánh',      updated_at: day(20), downloads: 320,  status: 'published' },
  { _id: 'doc-004', id: 'doc-004', code: 'SOP-002', name: 'SOP · Nhập hàng cuối ngày',            category: 'sop',      file_type: 'docx', file_size: 420_000,  version: 'v2.1', owner: 'Phạm Thu Hằng',       updated_at: day(8),  downloads: 410,  status: 'published' },
  { _id: 'doc-005', id: 'doc-005', code: 'GUIDE-001',name: 'Hướng dẫn tư vấn kim cương 4C',       category: 'guide',    file_type: 'pdf',  file_size: 1_200_000,version: 'v1.0', owner: 'Trần Thị Mai Anh',   updated_at: day(45), downloads: 2_150,status: 'published' },
  { _id: 'doc-006', id: 'doc-006', code: 'TPL-001', name: 'Template · Báo giá khách VIP',          category: 'template', file_type: 'xlsx', file_size: 85_000,   version: 'v1.2', owner: 'Đinh Bảo Châu',       updated_at: day(3),  downloads: 180,  status: 'published' },
  { _id: 'doc-007', id: 'doc-007', code: 'POL-003', name: 'Chính sách bảo mật dữ liệu khách hàng', category: 'policy',   file_type: 'pdf',  file_size: 680_000,  version: 'v1.0', owner: 'Nguyễn Hoàng Minh',   updated_at: day(60), downloads: 540,  status: 'published' },
  { _id: 'doc-008', id: 'doc-008', code: 'TRAIN-01',name: 'Khoá training · Nhân viên mới',        category: 'training', file_type: 'pdf',  file_size: 2_100_000,version: 'v2.3', owner: 'Phạm Thu Hằng',       updated_at: day(90), downloads: 3_200,status: 'published' },
  { _id: 'doc-009', id: 'doc-009', code: 'POL-004', name: 'Chính sách bảo hành đồng hồ Rado',     category: 'policy',   file_type: 'pdf',  file_size: 450_000,  version: 'v1.0', owner: 'Võ Hoàng Nam',        updated_at: day(120),downloads: 220,  status: 'draft' },
  { _id: 'doc-010', id: 'doc-010', code: 'FORM-001',name: 'Mẫu đơn yêu cầu thu đổi',              category: 'template', file_type: 'pdf',  file_size: 95_000,   version: 'v1.1', owner: 'Lê Quốc Khánh',      updated_at: day(30), downloads: 810,  status: 'published' },
];
