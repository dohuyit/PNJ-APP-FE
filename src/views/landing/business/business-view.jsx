'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import BrandingWatermarkOutlinedIcon from '@mui/icons-material/BrandingWatermarkOutlined';

import { landingTokens, sxSharpBtnContained, sxSharpInput } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn, slideUp, staggerContainer } from 'src/views/admin/_shared/motion';

const services = [
  { icon: BusinessCenterOutlinedIcon, title: 'Quà tặng nhân viên', desc: 'Tri ân nhân viên dịp lễ, kỷ niệm thâm niên bằng trang sức đẳng cấp.' },
  { icon: HandshakeOutlinedIcon, title: 'Quà cho khách hàng', desc: 'Củng cố quan hệ đối tác với quà tặng sang trọng, mang dấu ấn riêng.' },
  { icon: SavingsOutlinedIcon, title: 'Vàng tích luỹ', desc: 'Giải pháp tích luỹ vàng miếng dài hạn cho doanh nghiệp và quỹ nội bộ.' },
  { icon: BrandingWatermarkOutlinedIcon, title: 'Khắc logo riêng', desc: 'Khắc logo công ty lên trang sức và huy hiệu bằng công nghệ laser.' },
];

const volumeTiers = [
  { range: '10 – 50 đơn', discount: '5%', support: 'Giao hàng tận nơi', priority: 'Tiêu chuẩn' },
  { range: '51 – 200 đơn', discount: '10%', support: 'Giao hàng + lắp đặt', priority: 'Ưu tiên' },
  { range: 'Trên 200 đơn', discount: '15%', support: 'Giao hàng + lắp đặt + bảo hiểm', priority: 'VIP · Hỗ trợ 24/7' },
];

const partners = [
  'Vietcombank', 'FPT Corp', 'Viettel', 'Vinamilk', 'Vingroup', 'Techcombank',
];

const steps = [
  { no: '01', title: 'Tiếp nhận yêu cầu', desc: 'Doanh nghiệp gửi thông tin và nhu cầu qua form hoặc hotline B2B.' },
  { no: '02', title: 'Tư vấn & báo giá', desc: 'Chuyên viên B2B tư vấn giải pháp phù hợp và gửi báo giá trong 24 giờ.' },
  { no: '03', title: 'Ký hợp đồng', desc: 'Hai bên ký hợp đồng, thống nhất tiến độ sản xuất và giao nhận.' },
  { no: '04', title: 'Sản xuất & bàn giao', desc: 'PNJ sản xuất, khắc logo và bàn giao tận nơi theo lịch hẹn.' },
];

export function BusinessView() {
  const [form, setForm] = useState({
    company: '', tax: '', contact: '', email: '', budget: '', goal: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.contact.trim() || !form.email.trim()) return;
    // eslint-disable-next-line no-console
    console.log('[B2B contact]', form);
    setSent(true);
  };

  return (
    <LazyMotion features={domAnimation}>
      {/* 1. Hero */}
      <Box sx={{ position: 'relative', bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', py: { xs: 10, md: 16 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${landingTokens.PRIMARY_DARK} 0%, rgba(20,55,101,0.75) 55%, rgba(20,55,101,0.35) 100%)` }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative' }}>
          <m.div initial="hidden" animate="show" variants={staggerContainer(0.1)}>
            <m.div variants={fadeIn}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
                PNJ BUSINESS
              </Typography>
            </m.div>
            <m.div variants={slideUp}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 36, md: 60 }, fontWeight: 600, lineHeight: 1.1, maxWidth: 900, mb: 3 }}>
                PNJ Business<br />— Đối tác tin cậy cho doanh nghiệp.
              </Typography>
            </m.div>
            <m.div variants={fadeIn}>
              <Typography sx={{ color: 'rgba(251,247,242,0.85)', fontSize: { xs: 16, md: 18 }, maxWidth: 640, lineHeight: 1.7, mb: 4 }}>
                Giải pháp quà tặng và vàng tích luỹ dành cho doanh nghiệp,
                đồng hành cùng 500+ thương hiệu hàng đầu Việt Nam từ 1988.
              </Typography>
              <Button component="a" href="#lien-he" variant="contained" size="large" sx={sxSharpBtnContained} endIcon={<ArrowForwardIcon />}>
                Nhận tư vấn B2B
              </Button>
            </m.div>
          </m.div>
        </Container>
      </Box>

      {/* 2. 4 B2B services */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            4 GIẢI PHÁP
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
            Dịch vụ chuyên biệt cho doanh nghiệp
          </Typography>
        </Box>

        <m.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer(0.08)}>
          <Grid container spacing={{ xs: 3, md: 3 }}>
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Grid key={s.title} size={{ xs: 12, sm: 6, md: 3 }}>
                  <m.div variants={slideUp} style={{ height: '100%' }}>
                    <Box sx={{
                      p: 4, bgcolor: landingTokens.SURFACE, height: '100%',
                      border: `1px solid ${landingTokens.HAIRLINE}`,
                      borderTop: `2px solid ${landingTokens.GOLD}`,
                    }}>
                      <Icon sx={{ fontSize: 40, color: landingTokens.PRIMARY, mb: 2 }} />
                      <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: 20, fontWeight: 600, mb: 1.5 }}>
                        {s.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75 }}>
                        {s.desc}
                      </Typography>
                    </Box>
                  </m.div>
                </Grid>
              );
            })}
          </Grid>
        </m.div>
      </Container>

      {/* 3. Volume discount */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              ƯU ĐÃI B2B
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
              Chiết khấu theo số lượng
            </Typography>
          </Box>

          <Box sx={{ border: `1px solid ${landingTokens.HAIRLINE}`, bgcolor: landingTokens.SURFACE, overflowX: 'auto' }}>
            <Table sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: landingTokens.PRIMARY }}>
                  {['Quy mô đơn hàng', 'Chiết khấu', 'Dịch vụ kèm theo', 'Mức ưu tiên'].map((h) => (
                    <TableCell key={h} sx={{ color: '#FBF7F2', fontWeight: 700, letterSpacing: '0.04em' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {volumeTiers.map((t, i) => (
                  <TableRow key={t.range} sx={{ bgcolor: i % 2 ? 'transparent' : 'rgba(0,52,104,0.02)' }}>
                    <TableCell sx={{ fontWeight: 700 }}>{t.range}</TableCell>
                    <TableCell>
                      <Chip
                        label={t.discount}
                        size="small"
                        sx={{ bgcolor: landingTokens.GOLD, color: '#FFF', fontWeight: 700, borderRadius: 0.5 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: landingTokens.INK_MUTED }}>{t.support}</TableCell>
                    <TableCell sx={{ color: landingTokens.PRIMARY, fontWeight: 600 }}>{t.priority}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Container>
      </Box>

      {/* 4. Partners logos (placeholder) */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            KHÁCH HÀNG TIÊU BIỂU
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
            500+ doanh nghiệp tin chọn PNJ
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {partners.map((p, i) => (
            <Grid key={p} size={{ xs: 6, sm: 4, md: 2 }}>
              <m.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
              >
                <Box sx={{
                  aspectRatio: '16/9',
                  display: 'grid', placeItems: 'center',
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                  bgcolor: landingTokens.SURFACE,
                  color: landingTokens.INK_MUTED,
                  transition: 'border-color 220ms ease, color 220ms ease',
                  '&:hover': { borderColor: landingTokens.GOLD, color: landingTokens.PRIMARY },
                }}>
                  {/* IMAGE: real partner logo 160x80 */}
                  <Typography sx={{ fontWeight: 700, letterSpacing: '0.08em' }}>{p}</Typography>
                </Box>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 5. Process 4 steps */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              QUY TRÌNH HỢP TÁC
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
              4 bước đồng hành
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {steps.map((s, i) => (
              <Grid key={s.no} size={{ xs: 12, sm: 6, md: 3 }}>
                <m.div
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
                >
                  <Box sx={{ borderLeft: `2px solid ${landingTokens.GOLD}`, pl: 3, py: 1 }}>
                    <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: 48, fontWeight: 700, color: landingTokens.GOLD, lineHeight: 1, mb: 2 }}>
                      {s.no}
                    </Typography>
                    <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: 20, fontWeight: 600, mb: 1.5 }}>
                      {s.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75 }}>
                      {s.desc}
                    </Typography>
                  </Box>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 6. Contact form */}
      <Box id="lien-he" sx={{ bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 960 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.24em' }}>
              LIÊN HỆ B2B
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 44 }, fontWeight: 600, color: '#FBF7F2', mt: 1.5, lineHeight: 1.2 }}>
              Đăng ký tư vấn doanh nghiệp
            </Typography>
            <Typography sx={{ color: 'rgba(251,247,242,0.72)', mt: 2 }}>
              Chuyên viên B2B PNJ sẽ liên hệ trong 24 giờ làm việc.
            </Typography>
          </Box>

          {sent ? (
            <Box sx={{ textAlign: 'center', border: `1px solid ${landingTokens.GOLD}`, p: 5, maxWidth: 560, mx: 'auto' }}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: 24, color: landingTokens.GOLD, mb: 1, fontWeight: 600 }}>
                Cảm ơn doanh nghiệp!
              </Typography>
              <Typography sx={{ color: 'rgba(251,247,242,0.82)' }}>
                Chúng tôi đã nhận yêu cầu và sẽ liên hệ sớm.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {[
                  { k: 'company', label: 'Tên công ty', type: 'text', required: true, sm: 6 },
                  { k: 'tax', label: 'Mã số thuế', type: 'text', required: false, sm: 6 },
                  { k: 'contact', label: 'Người liên hệ', type: 'text', required: true, sm: 6 },
                  { k: 'email', label: 'Email', type: 'email', required: true, sm: 6 },
                ].map((f) => (
                  <Grid key={f.k} size={{ xs: 12, sm: f.sm }}>
                    <TextField
                      fullWidth
                      required={f.required}
                      type={f.type}
                      label={f.label}
                      value={form[f.k]}
                      onChange={(e) => setForm((s) => ({ ...s, [f.k]: e.target.value }))}
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
                ))}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select fullWidth
                    label="Ngân sách dự kiến"
                    value={form.budget}
                    onChange={(e) => setForm((s) => ({ ...s, budget: e.target.value }))}
                    sx={{
                      ...sxSharpInput,
                      '& .MuiInputLabel-root': { color: 'rgba(251,247,242,0.72)' },
                      '& .MuiSelect-icon': { color: 'rgba(251,247,242,0.72)' },
                      '& .MuiOutlinedInput-root': {
                        ...sxSharpInput['& .MuiOutlinedInput-root'],
                        bgcolor: 'rgba(255,255,255,0.06)',
                        color: '#FBF7F2',
                        '& fieldset': { borderColor: 'rgba(251,247,242,0.3)' },
                        '&:hover fieldset': { borderColor: landingTokens.GOLD },
                        '&.Mui-focused fieldset': { borderColor: landingTokens.GOLD },
                      },
                    }}
                  >
                    {['Dưới 50 triệu', '50 – 200 triệu', '200 – 500 triệu', 'Trên 500 triệu'].map((b) => (
                      <MenuItem key={b} value={b}>{b}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select fullWidth
                    label="Mục tiêu hợp tác"
                    value={form.goal}
                    onChange={(e) => setForm((s) => ({ ...s, goal: e.target.value }))}
                    sx={{
                      ...sxSharpInput,
                      '& .MuiInputLabel-root': { color: 'rgba(251,247,242,0.72)' },
                      '& .MuiSelect-icon': { color: 'rgba(251,247,242,0.72)' },
                      '& .MuiOutlinedInput-root': {
                        ...sxSharpInput['& .MuiOutlinedInput-root'],
                        bgcolor: 'rgba(255,255,255,0.06)',
                        color: '#FBF7F2',
                        '& fieldset': { borderColor: 'rgba(251,247,242,0.3)' },
                        '&:hover fieldset': { borderColor: landingTokens.GOLD },
                        '&.Mui-focused fieldset': { borderColor: landingTokens.GOLD },
                      },
                    }}
                  >
                    {services.map((s) => (
                      <MenuItem key={s.title} value={s.title}>{s.title}</MenuItem>
                    ))}
                  </TextField>
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
                    Gửi đăng ký
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
