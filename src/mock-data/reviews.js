// src/mock-data/reviews.js
// Review sản phẩm — link order_id, product_id (lấy từ order item đầu), customer_id.

import { mockOrders } from './orders';
import { mockCustomers } from './customers';

const COMMENTS = [
  'Sản phẩm rất đẹp, đóng gói cẩn thận!',
  'Thiết kế tinh tế, đúng như hình.',
  'Giao hàng nhanh, chất lượng tốt.',
  'Ưng ý lắm, sẽ ủng hộ PNJ tiếp.',
  'Nhân viên tư vấn nhiệt tình, sản phẩm đẹp.',
  'Chất lượng tuyệt vời, rất hài lòng.',
  'Có một chút trầy nhẹ ở viền, nhìn chung ổn.',
  'Hình chụp nhẹ nhàng hơn thực tế, nhưng rất đẹp.',
  'Món quà cho vợ, cô ấy rất thích.',
  'Thiết kế hiện đại, phù hợp đi làm.',
  'Hơi khác so với kỳ vọng nhưng vẫn đẹp.',
  'Chất lượng không đạt mong đợi, hơi tiếc.',
];

export const mockReviews = mockOrders
  .filter((o) => o.status === 'delivered')
  .map((o, i) => {
    const firstItem = o.items[0];
    const customer = mockCustomers.find((c) => c._id === o.customer_id) ?? mockCustomers[0];
    const rating = i % 11 === 0 ? 2 : i % 7 === 0 ? 3 : i % 3 === 0 ? 4 : 5;
    const status = rating >= 4 ? 'published' : rating >= 3 ? 'pending' : 'rejected';
    return {
      _id: `rv-${String(i + 1).padStart(4, '0')}`,
      id: `rv-${String(i + 1).padStart(4, '0')}`,
      order_id: o._id,
      order_no: o.order_no,
      product_sku: firstItem?.sku,
      product_name: firstItem?.product_name,
      variant_id: firstItem?.variant_id,
      customer_id: o.customer_id,
      customer_name: customer.name,
      rating,
      title: rating >= 4 ? 'Hài lòng với sản phẩm' : rating === 3 ? 'Tạm ổn' : 'Chưa như mong đợi',
      comment: COMMENTS[i % COMMENTS.length],
      images: [],
      helpful_count: Math.floor(Math.random() * 30),
      status,
      reply: status === 'published' && i % 3 === 0 ? 'Cảm ơn quý khách đã tin tưởng PNJ!' : null,
      replied_by: 'Trần Thị Mai Anh',
      created_at: new Date(new Date(o.created_at).getTime() + 7 * 86_400_000).toISOString(),
    };
  });
