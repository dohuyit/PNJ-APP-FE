'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

import { landingTokens } from 'src/theme/landing';
import { fUnixToDateVN } from 'src/utils/format-time';
import { useGetPolicy } from 'src/actions/landing';

const _legacyPolicies = {
  shipping: {
    title: 'Chính sách giao hàng',
    updated: '2026-01-10',
    sections: [
      {
        heading: 'Phạm vi giao hàng',
        body: 'PNJ áp dụng giao hàng toàn quốc cho mọi đơn hàng online. Khu vực trung tâm TP.HCM, Hà Nội và Đà Nẵng có dịch vụ giao hàng trong 3 giờ với các sản phẩm có nhãn 3H.',
      },
      {
        heading: 'Thời gian giao hàng',
        body: 'Khu vực nội thành: 1-2 ngày làm việc. Tỉnh thành khác: 3-7 ngày làm việc tuỳ khu vực. Giao hàng 3H áp dụng từ 09:00 đến 20:00 hàng ngày.',
      },
      {
        heading: 'Phí vận chuyển',
        body: 'Miễn phí giao hàng toàn quốc cho tất cả đơn hàng, không phân biệt giá trị.',
      },
      {
        heading: 'Trường hợp không giao được',
        body: 'Nếu địa chỉ không khớp hoặc khách hàng không thể nhận, chúng tôi sẽ liên hệ sắp xếp lại lịch giao. Sau 3 lần giao không thành công, đơn hàng sẽ được huỷ và hoàn tiền trong 5-7 ngày làm việc.',
      },
    ],
  },
  return: {
    title: 'Chính sách đổi trả',
    updated: '2026-01-10',
    sections: [
      {
        heading: 'Thời hạn đổi trả',
        body: 'Trang sức vàng được đổi trong vòng 48 giờ. Trang sức bạc được đổi trong vòng 72 giờ. Tính từ thời điểm nhận hàng.',
      },
      {
        heading: 'Điều kiện đổi trả',
        body: 'Sản phẩm còn nguyên vẹn, chưa qua sử dụng, còn đầy đủ phụ kiện và hoá đơn mua hàng. Các sản phẩm có khắc tên, chế tác theo yêu cầu riêng không áp dụng chính sách đổi trả.',
      },
      {
        heading: 'Quy trình đổi trả',
        body: 'Mang sản phẩm đến bất kỳ cửa hàng PNJ nào trên toàn quốc kèm hoá đơn. Nhân viên sẽ hỗ trợ đổi size hoặc đổi sang mẫu khác có giá trị tương đương.',
      },
    ],
  },
  warranty: {
    title: 'Chính sách bảo hành',
    updated: '2026-01-10',
    sections: [
      {
        heading: 'Thời hạn bảo hành',
        body: 'Trang sức vàng: 6 tháng. Trang sức bạc: 3 tháng. Áp dụng với các lỗi kỹ thuật và nước xi.',
      },
      {
        heading: 'Dịch vụ miễn phí trọn đời',
        body: 'Siêu âm làm sạch, đánh bóng, thay đá ECZ/CZ và đá tổng hợp trong thời gian bảo hành.',
      },
      {
        heading: 'Trường hợp không bảo hành',
        body: 'Sản phẩm bị biến dạng do tác động bên ngoài, dây chuyền hoặc lắc chế tác bị đứt gãy, nữ trang 22K-24K dạng kiềng, vòng, dây cổ chế tác.',
      },
    ],
  },
  privacy: {
    title: 'Chính sách bảo mật',
    updated: '2026-01-10',
    sections: [
      {
        heading: 'Thu thập thông tin',
        body: 'Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, đặt hàng, hoặc đăng ký nhận bản tin. Các thông tin gồm họ tên, email, số điện thoại, địa chỉ giao hàng.',
      },
      {
        heading: 'Sử dụng thông tin',
        body: 'Thông tin được sử dụng để xử lý đơn hàng, giao sản phẩm, gửi thông báo khuyến mãi (khi được sự đồng ý), và cải thiện trải nghiệm mua sắm.',
      },
      {
        heading: 'Bảo mật thông tin',
        body: 'Mọi dữ liệu được mã hoá và lưu trữ trên hệ thống đạt tiêu chuẩn bảo mật ISO 27001. Chúng tôi không chia sẻ thông tin cho bên thứ ba ngoài mục đích vận chuyển đơn hàng.',
      },
      {
        heading: 'Quyền của khách hàng',
        body: 'Bạn có quyền truy cập, chỉnh sửa, hoặc yêu cầu xoá thông tin cá nhân bất cứ lúc nào qua email cskh@pnj.example.',
      },
    ],
  },
  terms: {
    title: 'Điều khoản dịch vụ',
    updated: '2026-01-10',
    sections: [
      {
        heading: 'Chấp nhận điều khoản',
        body: 'Bằng việc sử dụng website pnj.com.vn, bạn đồng ý tuân thủ các điều khoản được quy định tại đây.',
      },
      {
        heading: 'Quyền sở hữu trí tuệ',
        body: 'Mọi hình ảnh, thiết kế, nội dung trên website thuộc quyền sở hữu của Công ty Cổ phần Vàng Bạc Đá Quý Phú Nhuận.',
      },
      {
        heading: 'Giới hạn trách nhiệm',
        body: 'PNJ không chịu trách nhiệm về các thiệt hại gián tiếp phát sinh từ việc sử dụng website.',
      },
    ],
  },
};

const slugToKey = {
  'chinh-sach-giao-hang': 'shipping',
  'chinh-sach-doi-tra': 'return',
  'chinh-sach-bao-hanh': 'warranty',
  'chinh-sach-bao-mat': 'privacy',
  'dieu-khoan-dich-vu': 'terms',
  shipping: 'shipping',
  return: 'return',
  warranty: 'warranty',
  privacy: 'privacy',
  terms: 'terms',
};

const sidebarLinks = [
  { slug: 'shipping', label: 'Chính sách giao hàng' },
  { slug: 'return', label: 'Chính sách đổi trả' },
  { slug: 'warranty', label: 'Chính sách bảo hành' },
  { slug: 'privacy', label: 'Chính sách bảo mật' },
  { slug: 'terms', label: 'Điều khoản dịch vụ' },
];

export function PolicyView({ params }) {
  const { slug } = params;
  const key = slugToKey[slug] ?? 'shipping';
  const { page } = useGetPolicy(key);
  const policy = {
    title: page?.title ?? _legacyPolicies[key]?.title ?? 'Chính sách',
    updated: page?.updated_at ? fUnixToDateVN(page.updated_at) : '2026-01-10',
    content_html: page?.content_html ?? null,
    sections: _legacyPolicies[key]?.sections ?? [],
  };

  return (
    <>
      <Container maxWidth={false} sx={{ maxWidth: 1155, pt: { xs: 3, md: 5 }, pb: 1 }}>
        <Breadcrumbs separator="/" sx={{ fontSize: 13, color: landingTokens.INK_MUTED }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang chủ</Link>
          <Typography variant="caption" sx={{ color: landingTokens.INK }}>Chính sách</Typography>
        </Breadcrumbs>
      </Container>

      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 4, md: 6 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
                CHÍNH SÁCH
              </Typography>
              <Stack spacing={0.5}>
                {sidebarLinks.map((l) => {
                  const active = l.slug === key;
                  return (
                    <Box
                      key={l.slug}
                      component={Link}
                      href={`/policy/${l.slug}`}
                      sx={{
                        textDecoration: 'none',
                        color: active ? landingTokens.PRIMARY : landingTokens.INK,
                        fontWeight: active ? 600 : 500,
                        fontSize: 14,
                        py: 1,
                        borderLeft: `2px solid ${active ? landingTokens.PRIMARY : 'transparent'}`,
                        pl: 2,
                        '&:hover': { color: landingTokens.PRIMARY },
                      }}
                    >
                      {l.label}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <DescriptionOutlinedIcon sx={{ color: landingTokens.GOLD_DARK }} />
              <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
                CẬP NHẬT {policy.updated}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 32, md: 44 }, fontWeight: 500, mb: 5, lineHeight: 1.15 }}>
              {policy.title}
            </Typography>

            <Divider sx={{ mb: 5 }} />

            {policy.content_html ? (
              <Box
                sx={{
                  color: landingTokens.INK,
                  lineHeight: 1.9,
                  fontSize: 16,
                  '& h1': { fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 36 }, fontWeight: 500, mt: 0, mb: 3 },
                  '& h2': { fontFamily: landingTokens.FONT_SANS, fontSize: 24, fontWeight: 500, mt: 4, mb: 2 },
                  '& p': { mt: 0, mb: 2 },
                  '& ul, & ol': { pl: 3, mb: 2 },
                }}
                dangerouslySetInnerHTML={{ __html: policy.content_html }}
              />
            ) : (
              <Stack spacing={5}>
                {policy.sections.map((s, i) => (
                  <Box key={i}>
                    <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: 24, fontWeight: 500, mb: 2 }}>
                      {s.heading}
                    </Typography>
                    <Typography sx={{ color: landingTokens.INK, lineHeight: 1.9, fontSize: 16 }}>
                      {s.body}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}

            <Box sx={{ mt: 8, p: 4, bgcolor: landingTokens.NEUTRAL }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Còn thắc mắc?</Typography>
              <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>
                Liên hệ hotline 1900 54 54 57 hoặc email cskh@pnj.example để được hỗ trợ cụ thể.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
