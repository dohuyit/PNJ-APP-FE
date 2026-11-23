import { BlogDetailView } from 'src/views/landing/blog-detail-view';
export const metadata = { title: 'Bài viết · PNJ' };
export default function Page({ params }) { return <BlogDetailView params={params} />; }
