import { BlogHubView } from 'src/views/admin/post/blog-hub-view';
export const metadata = { title: 'Chuyên mục blog · PNJ Admin' };
export default function Page() { return <BlogHubView defaultTab="categories" />; }
