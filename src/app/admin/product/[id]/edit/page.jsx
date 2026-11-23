import { ProductEditView } from 'src/views/admin/product/product-edit-view';
export const metadata = { title: 'Sửa sản phẩm · PNJ Admin' };
export default function Page({ params }) { return <ProductEditView id={params.id} />; }
