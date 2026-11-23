import { ProductDetailView } from 'src/views/landing/product-detail-view';
export const metadata = { title: 'Chi tiết sản phẩm · PNJ' };
export default function Page({ params }) { return <ProductDetailView params={params} />; }
