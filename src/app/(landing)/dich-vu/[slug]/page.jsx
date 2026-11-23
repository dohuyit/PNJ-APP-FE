import { ServiceDetailView } from 'src/views/landing/service/service-detail-view';

const TITLES = {
  'thu-doi-vang': 'Thu đổi vàng',
  'bao-hanh': 'Bảo hành trọn đời',
  'kiem-dinh-kim-cuong': 'Kiểm định kim cương',
  'gia-cong': 'Gia công theo yêu cầu',
  'khac-chu': 'Khắc chữ',
  'sua-chua': 'Sửa chữa trang sức',
  'do-size': 'Đo size nhẫn/vòng',
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = TITLES[slug];
  return { title: t ? `${t} · Dịch vụ PNJ` : 'Dịch vụ · PNJ' };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <ServiceDetailView slug={slug} />;
}
