'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

import { landingTokens, sxSharpBtnContained, sxSharpInput } from 'src/theme/landing';

const topics = [
  'Tư vấn sản phẩm',
  'Đặt hàng online',
  'Đổi trả, bảo hành',
  'Khiếu nại',
  'Tuyển dụng',
  'Hợp tác doanh nghiệp',
  'Khác',
];

export function ContactView() {
  const onSubmit = (e) => e.preventDefault();

  return (
    <>
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 6, md: 10 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            LIÊN HỆ
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 36, md: 56 }, fontWeight: 500, mt: 1, mb: 2 }}>
            Chúng tôi lắng nghe
          </Typography>
          <Typography sx={{ color: landingTokens.INK_MUTED, fontSize: 17, maxWidth: 640 }}>
            Đội ngũ chăm sóc khách hàng của PNJ sẵn sàng hỗ trợ qua nhiều kênh. Chọn phương thức
            thuận tiện nhất cho bạn.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 6, md: 10 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={4}>
              {[
                { icon: <PhoneOutlinedIcon fontSize="large" />, title: 'Hotline', body: '1900 54 54 57', note: 'Miễn phí cuộc gọi' },
                { icon: <EmailOutlinedIcon fontSize="large" />, title: 'Email', body: 'cskh@pnj.example', note: 'Phản hồi trong 24 giờ' },
                { icon: <PlaceOutlinedIcon fontSize="large" />, title: 'Trụ sở', body: 'Phú Nhuận, TP.Hồ Chí Minh', note: 'Liên hệ qua hotline để đặt lịch' },
                { icon: <AccessTimeOutlinedIcon fontSize="large" />, title: 'Giờ làm việc', body: '08:00 - 21:00', note: 'Cả bảy ngày trong tuần' },
              ].map((c) => (
                <Stack key={c.title} direction="row" spacing={3} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      border: `1px solid ${landingTokens.HAIRLINE}`,
                      display: 'grid',
                      placeItems: 'center',
                      color: landingTokens.GOLD_DARK,
                      flexShrink: 0,
                    }}
                  >
                    {c.icon}
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.2em' }}>
                      {c.title}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5, mb: 0.5 }}>
                      {c.body}
                    </Typography>
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>
                      {c.note}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                border: `1px solid ${landingTokens.HAIRLINE}`,
                bgcolor: landingTokens.SURFACE,
                p: { xs: 3, md: 5 },
              }}
            >
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 28, fontWeight: 500, mb: 1 }}>
                Gửi tin nhắn
              </Typography>
              <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, mb: 4 }}>
                Điền thông tin dưới đây, chúng tôi sẽ phản hồi trong vòng 24 giờ.
              </Typography>

              <Box component="form" onSubmit={onSubmit}>
                <Stack spacing={2.5}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Họ và tên" name="name" required sx={sxSharpInput} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Số điện thoại" name="phone" required sx={sxSharpInput} />
                    </Grid>
                  </Grid>
                  <TextField fullWidth type="email" label="Email" name="email" required sx={sxSharpInput} />
                  <TextField select fullWidth label="Chủ đề" name="topic" defaultValue="" sx={sxSharpInput}>
                    <MenuItem value="">-- Chọn chủ đề --</MenuItem>
                    {topics.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                  <TextField fullWidth label="Nội dung" name="message" multiline rows={6} required sx={sxSharpInput} />
                  <Button type="submit" variant="contained" size="large" sx={sxSharpBtnContained}>
                    Gửi tin nhắn
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
