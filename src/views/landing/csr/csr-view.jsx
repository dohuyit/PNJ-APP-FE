'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

import { landingTokens, sxSharpBtnContained, sxSharpInput } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn, slideUp, staggerContainer, useCountUp } from 'src/views/admin/_shared/motion';

const pillars = [
  { icon: SchoolOutlinedIcon, title: 'Giáo dục', desc: 'Học bổng sinh viên, đào tạo nghề kim hoàn và chương trình khởi nghiệp trẻ.' },
  { icon: LocalHospitalOutlinedIcon, title: 'Y tế', desc: 'Khám chữa bệnh miễn phí, xây trạm y tế vùng sâu, hỗ trợ bệnh nhân khó khăn.' },
  { icon: ParkOutlinedIcon, title: 'Môi trường', desc: 'Trồng rừng đầu nguồn, giảm phát thải carbon và kinh tế tuần hoàn trong chế tác.' },
  { icon: Diversity3OutlinedIcon, title: 'Phụ nữ khởi nghiệp', desc: 'Quỹ hỗ trợ phụ nữ khởi nghiệp, mentoring doanh nhân nữ và bình đẳng giới.' },
];

const programs = [
  { title: 'Học bổng PNJ – Thắp sáng ước mơ', year: 2024, impact: '5,000 sinh viên', tone: 'linear-gradient(135deg,#003468 0%,#2C5D9A 100%)' },
  { title: 'Siêu thị mini 0 đồng cho công nhân', year: 2023, impact: '12,000 hộ gia đình', tone: 'linear-gradient(135deg,#8A1E29 0%,#C48C46 100%)' },
  { title: 'Trồng 10,000 cây rừng ngập mặn', year: 2023, impact: '35 ha phục hồi', tone: 'linear-gradient(135deg,#1F7A46 0%,#2C5D9A 100%)' },
  { title: 'Khám sàng lọc bệnh tim trẻ em', year: 2022, impact: '8,500 trẻ em', tone: 'linear-gradient(135deg,#C48C46 0%,#8A6A2F 100%)' },
  { title: 'Quỹ phụ nữ khởi nghiệp PNJ', year: 2022, impact: '680 doanh nhân nữ', tone: 'linear-gradient(135deg,#143765 0%,#8A1E29 100%)' },
  { title: 'Sách giáo khoa vùng cao Hà Giang', year: 2021, impact: '42,000 học sinh', tone: 'linear-gradient(135deg,#2C5D9A 0%,#C48C46 100%)' },
];

const awards = [
  'Top 50 CSR Vietnam 2023',
  'Sustainability Report Award 2022',
  'Asia Responsible Enterprise 2022',
  'Vietnam HR Awards 2021',
  'Top 10 Corporate Governance 2020',
  'Woman Empowerment Award 2024',
];

function Counter({ to, suffix = '' }) {
  const n = useCountUp(to, { duration: 1800 });
  return (
    <span>
      {n.toLocaleString('vi-VN')}
      {suffix}
    </span>
  );
}

export function CsrView() {
  const [form, setForm] = useState({ org: '', contact: '', goal: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.org.trim() || !form.contact.trim()) return;
    setSent(true);
  };

  return (
    <LazyMotion features={domAnimation}>
      {/* 1. Hero */}
      <Box sx={{ position: 'relative', bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 10, md: 16 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 20% 80%, ${landingTokens.GOLD}22, transparent 60%)` }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative' }}>
          <m.div initial="hidden" animate="show" variants={staggerContainer(0.1)}>
            <m.div variants={fadeIn}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
                TRÁCH NHIỆM XÃ HỘI
              </Typography>
            </m.div>
            <m.div variants={slideUp}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 36, md: 60 }, fontWeight: 600, lineHeight: 1.1, maxWidth: 900, mb: 3 }}>
                PNJ với cộng đồng<br />— 35 năm đồng hành
              </Typography>
            </m.div>
            <m.div variants={fadeIn}>
              <Typography sx={{ color: '#E8DFD4', opacity: 0.85, fontSize: { xs: 16, md: 18 }, maxWidth: 640, lineHeight: 1.7 }}>
                Mỗi món trang sức PNJ không chỉ chạm đến vẻ đẹp, mà còn mang theo cam kết lan toả
                giá trị bền vững đến cộng đồng — từ giáo dục, y tế đến môi trường và trao quyền cho phụ nữ.
              </Typography>
            </m.div>
          </m.div>
        </Container>
      </Box>

      {/* 2. 4 pillars */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            4 TRỤ CỘT CSR
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
            Bốn hướng hành động chiến lược
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 3, md: 3 }}>
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <Grid key={p.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <m.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
                >
                  <Box sx={{ p: 4, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, borderTop: `2px solid ${landingTokens.GOLD}`, height: '100%', textAlign: 'center' }}>
                    <Icon sx={{ fontSize: 44, color: landingTokens.PRIMARY, mb: 2 }} />
                    <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 22, fontWeight: 600, mb: 1.5 }}>
                      {p.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75 }}>
                      {p.desc}
                    </Typography>
                  </Box>
                </m.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* 3. Programs */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 5, md: 7 } }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              CHƯƠNG TRÌNH TIÊU BIỂU
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
              Những khoảnh khắc chạm đến cộng đồng
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 3, md: 3 }}>
            {programs.map((p, i) => (
              <Grid key={p.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <m.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.08, ease: 'easeOut' }}
                >
                  <Box sx={{ bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, height: '100%', overflow: 'hidden' }}>
                    {/* IMAGE: program photo 640x400 — replace with real event photography */}
                    <Box sx={{ position: 'relative', aspectRatio: '16/10', background: p.tone }}>
                      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
                      <Chip
                        label={p.year}
                        size="small"
                        sx={{ position: 'absolute', top: 16, left: 16, bgcolor: '#FBF7F2', color: landingTokens.INK, fontWeight: 700, borderRadius: 0.5 }}
                      />
                    </Box>
                    <Box sx={{ p: 3.5 }}>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 20, fontWeight: 600, mb: 1.5, minHeight: 56 }}>
                        {p.title}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <VolunteerActivismIcon sx={{ fontSize: 18, color: landingTokens.GOLD }} />
                        <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>
                          Hưởng lợi: <strong style={{ color: landingTokens.PRIMARY }}>{p.impact}</strong>
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. Impact stats */}
      <Box sx={{ bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {[
              { to: 100000, suffix: '+', label: 'Sinh viên được hỗ trợ' },
              { to: 50, suffix: '+ tỷ VNĐ', label: 'Quỹ cộng đồng' },
              { to: 20, suffix: '+ tỉnh thành', label: 'Phạm vi triển khai' },
            ].map((s) => (
              <Grid key={s.label} size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 48, md: 72 }, fontWeight: 700, color: landingTokens.GOLD, lineHeight: 1 }}>
                  <Counter to={s.to} suffix={s.suffix} />
                </Typography>
                <Typography sx={{ mt: 2, color: '#E8DFD4', opacity: 0.85, fontSize: 16 }}>
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. Awards */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 12 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            GHI NHẬN
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
            Giải thưởng tiêu biểu
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {awards.map((a) => (
            <Grid key={a} size={{ xs: 12, sm: 6, md: 4 }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ p: 3, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, borderLeft: `3px solid ${landingTokens.GOLD}` }}
              >
                <EmojiEventsOutlinedIcon sx={{ fontSize: 36, color: landingTokens.GOLD }} />
                <Typography sx={{ fontWeight: 600, color: landingTokens.INK }}>{a}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 6. CTA form */}
      <Box sx={{ bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 820 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.24em' }}>
              ĐỒNG HÀNH CÙNG PNJ
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 600, color: '#FBF7F2', mt: 1.5, lineHeight: 1.2 }}>
              Trở thành đối tác cộng đồng
            </Typography>
            <Typography sx={{ color: 'rgba(251,247,242,0.72)', mt: 2 }}>
              Tổ chức xã hội, trường học, doanh nghiệp — hãy chia sẻ mục tiêu để cùng PNJ kiến tạo thay đổi.
            </Typography>
          </Box>

          {sent ? (
            <Box sx={{ textAlign: 'center', border: `1px solid ${landingTokens.GOLD}`, p: 5 }}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 24, color: landingTokens.GOLD, mb: 1 }}>
                Cảm ơn tổ chức của bạn!
              </Typography>
              <Typography sx={{ color: 'rgba(251,247,242,0.82)' }}>
                Bộ phận CSR của PNJ sẽ liên hệ trong 3 ngày làm việc.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Tên tổ chức"
                    value={form.org}
                    onChange={(e) => setForm((s) => ({ ...s, org: e.target.value }))}
                    sx={{
                      ...sxSharpInput,
                      '& .MuiInputLabel-root': { color: 'rgba(251,247,242,0.72)' },
                      '& .MuiOutlinedInput-root': {
                        ...sxSharpInput['& .MuiOutlinedInput-root'],
                        bgcolor: 'rgba(255,255,255,0.06)',
                        color: '#FBF7F2',
                        '& fieldset': { borderColor: 'rgba(251,247,242,0.3)' },
                        '&:hover fieldset': { borderColor: landingTokens.GOLD },
                        '&.Mui-focused fieldset': { borderColor: landingTokens.GOLD },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Người liên hệ"
                    value={form.contact}
                    onChange={(e) => setForm((s) => ({ ...s, contact: e.target.value }))}
                    sx={{
                      ...sxSharpInput,
                      '& .MuiInputLabel-root': { color: 'rgba(251,247,242,0.72)' },
                      '& .MuiOutlinedInput-root': {
                        ...sxSharpInput['& .MuiOutlinedInput-root'],
                        bgcolor: 'rgba(255,255,255,0.06)',
                        color: '#FBF7F2',
                        '& fieldset': { borderColor: 'rgba(251,247,242,0.3)' },
                        '&:hover fieldset': { borderColor: landingTokens.GOLD },
                        '&.Mui-focused fieldset': { borderColor: landingTokens.GOLD },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Mục tiêu đồng hành"
                    value={form.goal}
                    onChange={(e) => setForm((s) => ({ ...s, goal: e.target.value }))}
                    sx={{
                      ...sxSharpInput,
                      '& .MuiInputLabel-root': { color: 'rgba(251,247,242,0.72)' },
                      '& .MuiOutlinedInput-root': {
                        ...sxSharpInput['& .MuiOutlinedInput-root'],
                        bgcolor: 'rgba(255,255,255,0.06)',
                        color: '#FBF7F2',
                        '& fieldset': { borderColor: 'rgba(251,247,242,0.3)' },
                        '&:hover fieldset': { borderColor: landingTokens.GOLD },
                        '&.Mui-focused fieldset': { borderColor: landingTokens.GOLD },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      ...sxSharpBtnContained,
                      bgcolor: landingTokens.GOLD,
                      color: landingTokens.INK,
                      px: 6,
                      '&:hover': { bgcolor: landingTokens.GOLD_DARK, color: '#FBF7F2' },
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Gửi đề xuất
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    </LazyMotion>
  );
}
