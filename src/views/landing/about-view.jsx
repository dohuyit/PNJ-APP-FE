'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { landingTokens, sxSharpBtnContained } from 'src/theme/landing';
import Wireframe from 'src/sections/landing/components/Wireframe';

const milestones = [
  { year: '1988', title: 'Xưởng chế tác đầu tiên', body: 'Khởi đầu từ một xưởng nhỏ tại Phú Nhuận, nơi mỗi món trang sức được chế tác thủ công.' },
  { year: '2004', title: 'Niêm yết doanh nghiệp', body: 'Công ty Cổ phần được thành lập, mở rộng mạng lưới cửa hàng trên cả nước.' },
  { year: '2015', title: 'Trung tâm kim cương', body: 'Ra mắt trung tâm kiểm định kim cương theo tiêu chuẩn quốc tế.' },
  { year: '2024', title: 'Thương mại điện tử', body: 'Nền tảng online với giao hàng 3 giờ, đặt giữ hàng, trả góp 0% lãi suất.' },
];

const values = [
  { title: 'Thủ công tận tâm', body: 'Mỗi món là thành quả của những nghệ nhân có trên 20 năm kinh nghiệm.' },
  { title: 'Chất lượng kiểm định', body: 'Kim cương đạt chứng nhận GIA, vàng đo tuổi bằng máy quang phổ.' },
  { title: 'Di sản gia đình', body: 'Giữ gìn tinh hoa trang sức Việt qua từng thế hệ khách hàng.' },
];

export function AboutView() {
  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60dvh', md: '72dvh' },
          minHeight: 480,
          overflow: 'hidden',
          bgcolor: landingTokens.INK,
          color: '#FBF7F2',
        }}
      >
        <Wireframe label="Hero ảnh · Về PNJ · 1920×720" fill sx={{ opacity: 0.6 }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,20,19,0.55), rgba(26,20,19,0.85))' }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', pb: { xs: 6, md: 10 } }}>
          <Box sx={{ maxWidth: 820 }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
              CÂU CHUYỆN PNJ
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 40, md: 72 }, fontWeight: 600, lineHeight: 1.05, color: '#FBF7F2' }}>
              Di sản chế tác,<br />bắt nguồn từ Phú Nhuận.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Story */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              SỨ MỆNH
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 32, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
              Trao gửi vẻ đẹp đích thực.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <Typography sx={{ lineHeight: 1.85, fontSize: 17, color: landingTokens.INK }}>
                Từ một xưởng thủ công năm 1988, PNJ đã trở thành nhà chế tác trang sức hàng đầu Việt Nam.
                Chúng tôi giữ nguyên triết lý ban đầu: mỗi món trang sức là một lời chúc phúc, là vật trao
                truyền qua các thế hệ.
              </Typography>
              <Typography sx={{ lineHeight: 1.85, fontSize: 16, color: landingTokens.INK_MUTED }}>
                Hơn 400 cửa hàng trên toàn quốc, hệ thống kiểm định kim cương đạt chuẩn quốc tế, và đội ngũ
                nghệ nhân với trung bình trên 15 năm kinh nghiệm là nền tảng để chúng tôi tiếp tục đồng hành
                cùng gia đình Việt trong những dịp quan trọng.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Milestones */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              CỘT MỐC
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 40 }, mt: 1 }}>
              Những bước chân đã đi qua
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {milestones.map((m) => (
              <Grid key={m.year} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ bgcolor: landingTokens.SURFACE, p: 4, height: '100%', borderTop: `2px solid ${landingTokens.GOLD}` }}>
                  <Typography
                    sx={{
                      fontFamily: landingTokens.FONT_SANS,
                      fontSize: 44,
                      fontWeight: 600,
                      color: landingTokens.PRIMARY,
                      lineHeight: 1,
                      mb: 2,
                    }}
                  >
                    {m.year}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>{m.title}</Typography>
                  <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.7 }}>
                    {m.body}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Values */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 5, md: 7 } }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            GIÁ TRỊ CỐT LÕI
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 40 }, mt: 1 }}>
            Điều chúng tôi tin
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 5 }}>
          {values.map((v, i) => (
            <Grid key={v.title} size={{ xs: 12, md: 4 }}>
              <Box sx={{ borderLeft: `2px solid ${landingTokens.GOLD}`, pl: 3 }}>
                <Typography
                  sx={{
                    fontFamily: landingTokens.FONT_SANS,
                    fontSize: 48,
                    fontWeight: 600,
                    color: landingTokens.GOLD,
                    lineHeight: 1,
                    mb: 2,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: landingTokens.FONT_SANS, fontWeight: 500, mb: 1.5 }}>
                  {v.title}
                </Typography>
                <Typography variant="body1" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75 }}>
                  {v.body}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 8, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 44 }, color: landingTokens.GOLD, mb: 3, lineHeight: 1.2 }}>
            Khám phá bộ sưu tập,<br />tìm món trang sức dành cho bạn.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button component={Link} href="/" variant="contained" size="large" sx={sxSharpBtnContained} endIcon={<ArrowForwardIcon />}>
              Về trang chủ
            </Button>
            <Button
              component={Link}
              href="/stores"
              variant="outlined"
              size="large"
              sx={{ borderRadius: 0, textTransform: 'none', fontWeight: 600, color: '#FBF7F2', borderColor: '#FBF7F2', '&:hover': { color: landingTokens.GOLD, borderColor: landingTokens.GOLD } }}
            >
              Tìm cửa hàng
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
