import { CategoryView } from 'src/views/landing/category-view';
export const metadata = { title: 'Danh mục · PNJ' };
export default function Page({ params }) { return <CategoryView params={params} />; }
