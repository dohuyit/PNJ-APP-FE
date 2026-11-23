'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { landingTokens } from 'src/theme/landing';

const FOOTER_FONT = '"Roboto", "Helvetica Neue", Arial, sans-serif';

const columns = [
  {
    title: 'Về PNJ',
    links: [
      { label: 'Câu chuyện thương hiệu', href: '/about' },
      { label: 'Hệ thống cửa hàng', href: '/stores' },
      { label: 'Tin tức & cẩm nang', href: '/blog' },
      { label: 'Quan hệ cổ đông', href: '/quan-he-co-dong' },
      { label: 'Trách nhiệm xã hội', href: '/csr' },
      { label: 'Tuyển dụng', href: '/tuyen-dung' },
      { label: 'Liên hệ hợp tác', href: '/contact' },
    ],
  },
  {
    title: 'Mua sắm · Dịch vụ',
    links: [
      { label: 'Cưới hỏi', href: '/cuoi-hoi' },
      { label: 'Kim cương', href: '/kim-cuong' },
      { label: 'Dịch vụ trang sức', href: '/dich-vu' },
      { label: 'Giá vàng hôm nay', href: '/gia-vang' },
      { label: 'Quà tặng theo dịp', href: '/qua-tang' },
      { label: 'Thiệp điện tử', href: '/thiep-dien-tu' },
      { label: 'Doanh nghiệp (B2B)', href: '/doanh-nghiep' },
    ],
  },
  {
    title: 'Chăm sóc khách hàng',
    links: [
      { label: 'Hướng dẫn chọn size', href: '/huong-dan-chon-size' },
      { label: 'Hướng dẫn mua hàng', href: '/faq' },
      { label: 'Tra cứu đơn hàng', href: '/tra-cuu-don-hang' },
      { label: 'Yêu cầu đổi/trả', href: '/yeu-cau-doi-tra' },
      { label: 'Khách hàng thân thiết', href: '/khach-hang-than-thiet' },
      { label: 'Mã giảm giá', href: '/voucher' },
      { label: 'Trung tâm hỗ trợ', href: '/contact' },
    ],
  },
  {
    title: 'Chính sách',
    links: [
      { label: 'Giao hàng', href: '/policy/shipping' },
      { label: 'Đổi trả · Thu đổi', href: '/policy/return' },
      { label: 'Bảo hành trọn đời', href: '/policy/warranty' },
      { label: 'Bảo mật thông tin', href: '/policy/privacy' },
      { label: 'Điều khoản dịch vụ', href: '/policy/terms' },
    ],
  },
];

const paymentMethods = [
  { icon: 'logos:visa', label: 'Visa' },
  { icon: 'logos:mastercard', label: 'Mastercard' },
  { icon: 'logos:jcb', label: 'JCB' },
];

const legalLinks = [
  { label: 'Chính sách bảo mật', href: '/policy/privacy' },
  { label: 'Điều khoản', href: '/policy/terms' },
  { label: 'Cookie', href: '/policy/privacy' },
  { label: 'Sơ đồ', href: '/' },
];

export default function LandingFooterMui() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: landingTokens.SURFACE,
        color: landingTokens.INK,
        borderTop: `1px solid ${landingTokens.HAIRLINE}`,
        mt: 10,
        fontFamily: FOOTER_FONT,
        '& *': { fontFamily: FOOTER_FONT },
      }}
    >
      {/* Newsletter band */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${landingTokens.NEUTRAL_SOFT} 0%, #FFFFFF 50%, rgba(196,140,70,0.08) 100%)`,
          borderBottom: `1px solid ${landingTokens.HAIRLINE}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gold corners */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            width: 28,
            height: 28,
            borderTop: `1px solid ${landingTokens.GOLD}`,
            borderLeft: `1px solid ${landingTokens.GOLD}`,
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            width: 28,
            height: 28,
            borderBottom: `1px solid ${landingTokens.GOLD}`,
            borderRight: `1px solid ${landingTokens.GOLD}`,
            pointerEvents: 'none',
          }}
        />
        <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 5, md: 7 } }}>
          <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: landingTokens.GOLD_DARK,
                    letterSpacing: '0.24em',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  NHẬN ƯU ĐÃI ĐẶC QUYỀN
                </Typography>
                <Box sx={{ width: 24, height: 1, bgcolor: landingTokens.GOLD }} />
              </Stack>
              <Typography
                sx={{
                  fontFamily: FOOTER_FONT,
                  fontSize: { xs: 24, md: 32 },
                  fontWeight: 600,
                  color: landingTokens.PRIMARY,
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                Giảm 10% cho đơn hàng đầu tiên
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  color: landingTokens.INK_MUTED,
                  lineHeight: 1.6,
                  maxWidth: 520,
                }}
              >
                Đăng ký nhận bản tin PNJ để không bỏ lỡ bộ sưu tập mới, các dịp ưu đãi riêng dành cho thành viên và lời mời sự kiện đặc biệt.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                component="form"
                onSubmit={(e) => e.preventDefault()}
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  bgcolor: '#FFFFFF',
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                  borderRadius: 1,
                  overflow: 'hidden',
                  transition: 'border-color 220ms ease, box-shadow 220ms ease',
                  '&:focus-within': {
                    borderColor: landingTokens.GOLD,
                    boxShadow: '0 4px 16px rgba(196,140,70,0.1)',
                  },
                }}
              >
                <InputBase
                  placeholder="Nhập email của bạn"
                  type="email"
                  required
                  sx={{
                    flex: 1,
                    px: 2,
                    py: 1,
                    fontSize: 13,
                    '& input::placeholder': {
                      color: landingTokens.INK_MUTED,
                      opacity: 1,
                    },
                  }}
                />
                <Button
                  type="submit"
                  startIcon={<SendOutlinedIcon fontSize="small" />}
                  sx={{
                    bgcolor: landingTokens.PRIMARY,
                    color: '#FFFFFF',
                    borderRadius: 0,
                    px: 2.25,
                    fontWeight: 700,
                    fontSize: 12.5,
                    letterSpacing: '0.08em',
                    textTransform: 'none',
                    '&:hover': { bgcolor: landingTokens.PRIMARY_DARK },
                  }}
                >
                  ĐĂNG KÝ
                </Button>
              </Box>
              <Typography
                sx={{
                  fontSize: 11,
                  color: landingTokens.INK_MUTED,
                  mt: 1.25,
                  lineHeight: 1.5,
                }}
              >
                Bằng việc đăng ký, bạn đồng ý với{' '}
                <Box
                  component={Link}
                  href="/policy/privacy"
                  sx={{
                    color: landingTokens.GOLD_DARK,
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { color: landingTokens.PRIMARY },
                  }}
                >
                  chính sách bảo mật
                </Box>{' '}
                của PNJ.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main footer */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, pt: { xs: 6, md: 8 }, pb: 5 }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Brand + contact */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Logo href="/" sx={{ height: 72, width: 'auto', display: 'inline-flex' }} />
            </Box>

            <Typography
              sx={{
                fontSize: 13.5,
                color: landingTokens.INK_MUTED,
                lineHeight: 1.75,
                mb: 3,
                maxWidth: 360,
              }}
            >
              Công Ty Cổ Phần Vàng Bạc Đá Quý Phú Nhuận — thương hiệu trang sức Việt được yêu mến suốt 38 năm, chế tác thủ công cho từng khoảnh khắc đáng nhớ.
            </Typography>

            <Stack spacing={1.25} sx={{ mb: 3 }}>
              <ContactRow
                Icon={LocationOnOutlinedIcon}
                primary="Phú Nhuận, TP. Hồ Chí Minh"
                secondary="Trụ sở chính · Việt Nam"
              />
              <ContactRow
                Icon={PhoneInTalkOutlinedIcon}
                primary="Hotline 1800 54 54 57"
                secondary="Miễn phí cuộc gọi"
              />
              <ContactRow
                Icon={EmailOutlinedIcon}
                primary="cskh@pnj.example"
                secondary="Phản hồi trong 24 giờ"
              />
              <ContactRow
                Icon={AccessTimeOutlinedIcon}
                primary="08:00 – 21:00"
                secondary="Cả bảy ngày trong tuần"
              />
            </Stack>

            <Stack direction="row" spacing={1.25}>
              {[
                {
                  render: <FacebookIcon fontSize="small" />,
                  label: 'Facebook',
                  brand: '#1877F2',
                },
                {
                  render: <InstagramIcon fontSize="small" />,
                  label: 'Instagram',
                  brand: '#E4405F',
                  hoverBg:
                    'radial-gradient(circle at 30% 107%, #FDCB5C 0%, #F77737 25%, #E4405F 50%, #C13584 75%, #5851DB 100%)',
                },
                {
                  render: <YouTubeIcon fontSize="small" />,
                  label: 'YouTube',
                  brand: '#FF0000',
                },
                {
                  render: <Iconify icon="ic:baseline-tiktok" width={20} />,
                  label: 'TikTok',
                  brand: '#000000',
                },
                {
                  render: <Iconify icon="simple-icons:zalo" width={18} />,
                  label: 'Zalo',
                  brand: '#0068FF',
                },
              ].map(({ render, label, brand, hoverBg }) => (
                <IconButton
                  key={label}
                  aria-label={label}
                  sx={{
                    color: brand,
                    border: 'none',
                    borderRadius: 0,
                    width: 38,
                    height: 38,
                    p: 0,
                    transition: 'all 220ms ease',
                    '&:hover': {
                      color: '#FFFFFF',
                      ...(hoverBg ? { background: hoverBg } : { bgcolor: brand }),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {render}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Link columns */}
          {columns.map((col) => (
            <Grid key={col.title} size={{ xs: 6, md: 3 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  fontWeight: 700,
                  color: landingTokens.PRIMARY,
                  mb: 2.5,
                }}
              >
                {col.title.toUpperCase()}
              </Typography>
              <Stack spacing={1.25}>
                {col.links.map((l) => (
                  <Box
                    key={l.label}
                    component={Link}
                    href={l.href}
                    sx={{
                      fontSize: 13.5,
                      color: landingTokens.INK_MUTED,
                      textDecoration: 'none',
                      transition: 'color 180ms ease, padding-left 180ms ease',
                      '&:hover': {
                        color: landingTokens.PRIMARY,
                        pl: 0.5,
                      },
                    }}
                  >
                    {l.label}
                  </Box>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: landingTokens.HAIRLINE, my: 4 }} />

        {/* Legal strip */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography sx={{ fontSize: 12, color: landingTokens.INK_MUTED, lineHeight: 1.6 }}>
              © 2026 Công Ty Cổ Phần Vàng Bạc Đá Quý Phú Nhuận. Bảo lưu mọi quyền.
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mt: 0.75, flexWrap: 'wrap' }}>
              {legalLinks.map((l, i) => (
                <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    component={Link}
                    href={l.href}
                    sx={{
                      fontSize: 11,
                      color: landingTokens.INK_MUTED,
                      textDecoration: 'none',
                      '&:hover': { color: landingTokens.PRIMARY },
                    }}
                  >
                    {l.label}
                  </Box>
                  {i < legalLinks.length - 1 && (
                    <Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: landingTokens.HAIRLINE }} />
                  )}
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography
              sx={{
                fontSize: 10,
                letterSpacing: '0.18em',
                fontWeight: 700,
                color: landingTokens.GOLD_DARK,
                mb: 0.75,
              }}
            >
              THANH TOÁN AN TOÀN
            </Typography>
            <Stack
              direction="row"
              spacing={0.75}
              justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
              sx={{ flexWrap: 'wrap', rowGap: 0.75 }}
            >
              {paymentMethods.map((p) => (
                <Box
                  key={p.label}
                  aria-label={p.label}
                  title={p.label}
                  sx={{
                    width: 52,
                    height: 34,
                    bgcolor: '#FFFFFF',
                    border: `1px solid ${landingTokens.HAIRLINE}`,
                    borderRadius: 0.75,
                    display: 'grid',
                    placeItems: 'center',
                    transition: 'border-color 180ms ease, transform 180ms ease',
                    '&:hover': {
                      borderColor: landingTokens.GOLD,
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Iconify icon={p.icon} width={30} />
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function ContactRow({ Icon, primary, secondary }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          border: `1px solid ${landingTokens.HAIRLINE}`,
          color: landingTokens.GOLD_DARK,
        }}
      >
        <Icon sx={{ fontSize: 16 }} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: landingTokens.INK, lineHeight: 1.3 }}>
          {primary}
        </Typography>
        <Typography sx={{ fontSize: 11, color: landingTokens.INK_MUTED, lineHeight: 1.4, mt: 0.25 }}>
          {secondary}
        </Typography>
      </Box>
    </Stack>
  );
}
