import { ProfileView } from 'src/views/landing/account/profile-view';
export const metadata = { title: 'Hồ sơ · PNJ' };
export default function Page({ params }) { return <ProfileView params={params} />; }
