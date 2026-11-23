'use client';

import Link from 'next/link';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';

import { fCurrency } from 'src/utils/format-number';
import { landingTokens, sxSharpBtnContained, sxSharpInput } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn, slideUp, staggerContainer } from 'src/views/admin/_shared/motion';

const occasions = [
  { slug: 'tet', icon: CelebrationOutlinedIcon, title: 'Tết Nguyên Đán', date: 'Tháng 1 – 2', suggest: ['Charm Thần Tài', 'Nhẫn cầu may', 'Dây chuyền Linh Vật'] },
  { slug: 'valentine', icon: FavoriteBorderIcon, title: 'Valentine', date: '14 tháng 2', suggest: ['Dây chuyền couple', 'Nhẫn đôi', 'Lắc tay chữ tình'] },
  { slug: '8-3', icon: LocalFloristOutlinedIcon, title: 'Quốc tế Phụ nữ', date: '8 tháng 3', suggest: ['Hoa tai ngọc trai', 'Lắc tay vàng', 'Nhẫn kim cương'] },
  { slug: '20-10', icon: WbSunnyOutlinedIcon, title: 'Phụ nữ Việt Nam', date: '20 tháng 10', suggest: ['Dây chuyền ruby', 'Nhẫn vàng 24K', 'Vòng tay charm'] },
  { slug: 'noel', icon: AcUnitOutlinedIcon, title: 'Giáng Sinh', date: '24 – 25 tháng 12', suggest: ['Charm bông tuyết', 'Dây chuyền kim cương', 'Hộp quà set đôi'] },
  { slug: 'sinh-nhat', icon: CakeOutlinedIcon, title: 'Sinh nhật', date: 'Mỗi ngày', suggest: ['Nhẫn cung hoàng đạo', 'Charm sinh thần', 'E-Gift Card'] },
];

const recipients = [
  { key: 'me', title: 'Dành cho Mẹ', desc: 'Món quà ấm áp tri ân công ơn sinh thành.' },
  { key: 'vo', title: 'Dành cho Vợ', desc: 'Kỷ vật tình yêu bền lâu suốt thời gian.' },
  { key: 'nguoi-yeu', title: 'Dành cho người yêu', desc: 'Lời hẹn ước ngọt ngào bằng kim cương.' },
  { key: 'ban-than', title: 'Dành cho bạn thân', desc: 'Dấu ấn tình bạn tinh tế mà ý nghĩa.' },
  { key: 'dong-nghiep', title: 'Dành cho đồng nghiệp', desc: 'Lịch thiệp và trang nhã nơi công sở.' },
  { key: 'tre-em', title: 'Dành cho trẻ em', desc: 'Lưu giữ khoảnh khắc đầu đời của bé.' },
];

const budgets = [
  { label: 'Dưới 2 triệu', max: 2_000_000, href: '/category/type/all?price=0-2000000' },
  { label: '2 – 5 triệu', min: 2_000_000, max: 5_000_000, href: '/category/type/all?price=2000000-5000000' },
  { label: '5 – 10 triệu', min: 5_000_000, max: 10_000_000, href: '/category/type/all?price=5000000-10000000' },
  { label: 'Trên 10 triệu', min: 10_000_000, href: '/category/type/all?price=10000000-' },
];

export function GiftHubView() {
  const [form, setForm] = useState({ name: '', phone: '', occasion: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    // eslint-disable-next-line no-console
    console.log('[Gift consult]', form);
    setSent(true);
  };

  return (
    <LazyMotion features={domAnimation}>
      {/* 1. Hero */}
      <Box sx={{ position: 'relative', bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 10, md: 16 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 70% 30%, ${landingTokens.GOLD}22, transparent 60%)` }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative' }}>
          <m.div initial="hidden" animate="show" variants={staggerContainer(0.1)}>
            <m.div variants={fadeIn}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
                QUÀ TẶNG PNJ
              </Typography>
            </m.div>
            <m.div variants={slideUp}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 36, md: 60 }, fontWeight: 600, lineHeight: 1.1, maxWidth: 900, mb: 3 }}>
                Quà tặng PNJ<br />— Trao gửi yêu thương
              </Typography>
            </m.div>
            <m.div variants={fadeIn}>
              <Typography sx={{ color: '#E8DFD4', opacity: 0.85, fontSize: { xs: 16, md: 18 }, maxWidth: 640, lineHeight: 1.7, mb: 4 }}>
                Mỗi dịp lễ là một cơ hội để lời yêu thương được gửi gắm trọn vẹn.
                PNJ gợi ý những món trang sức cho từng dịp, từng người và từng ngân sách.
              </Typography>
              <Button component="a" href="#dip" variant="contained" size="large" sx={sxSharpBtnContained} endIcon={<ArrowForwardIcon />}>
                Chọn theo dịp
              </Button>
            </m.div>
          </m.div>
        </Container>
      </Box>

      {/* 2. Theo dịp */}
      <Container id="dip" maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            6 DỊP TRONG NĂM
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
            Món quà cho mọi khoảnh khắc
          </Typography>
        </Box>

        <m.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer(0.08)}>
          <Grid container spacing={{ xs: 3, md: 3 }}>
            {occasions.map((o) => {
              const Icon = o.icon;
              return (
                <Grid key={o.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                  <m.div variants={slideUp} style={{ height: '100%' }}>
                    <Box sx={{
                      display: 'flex', flexDirection: 'column', height: '100%',
                      p: 4, bgcolor: landingTokens.SURFACE,
                      border: `1px solid ${landingTokens.HAIRLINE}`,
                      borderTop: `2px solid ${landingTokens.GOLD}`,
                      transition: 'transform 220ms ease, box-shadow 220ms ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(0,52,104,0.12)' },
                    }}>
                      <Icon sx={{ fontSize: 40, color: landingTokens.PRIMARY, mb: 2.5 }} />
                      <Typography variant="overline" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.14em' }}>
                        {o.date}
                      </Typography>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 22, fontWeight: 600, mb: 2, mt: 0.5 }}>
                        {o.title}
                      </Typography>
                      <Stack component="ul" spacing={0.75} sx={{ listStyle: 'none', p: 0, m: 0, mb: 3, flexGrow: 1 }}>
                        {o.suggest.map((s) => (
                          <Box key={s} component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: landingTokens.INK_MUTED }}>
                            <Box sx={{ width: 4, height: 4, bgcolor: landingTokens.GOLD, borderRadius: '50%' }} />
                            <Typography variant="body2">{s}</Typography>
                          </Box>
                        ))}
                      </Stack>
                      <Button
                        component={Link}
                        href={`/category/type/all?occasion=${o.slug}`}
                        size="small"
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                        sx={{ alignSelf: 'flex-start', color: landingTokens.PRIMARY, fontWeight: 600, textTransform: 'none', px: 0 }}
                      >
                        Xem gợi ý
                      </Button>
                    </Box>
                  </m.div>
                </Grid>
              );
            })}
          </Grid>
        </m.div>
      </Container>

      {/* 3. Theo người nhận */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              THEO NGƯỜI NHẬN
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
              Chọn quà cho người bạn yêu thương
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {recipients.map((r, i) => (
              <Grid key={r.key} size={{ xs: 12, sm: 6, md: 4 }}>
                <m.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
                >
                  <Box
                    component={Link}
                    href={`/category/type/all?for=${r.key}`}
                    sx={{
                      display: 'block', textDecoration: 'none', color: landingTokens.INK,
                      p: 4, bgcolor: landingTokens.SURFACE, height: '100%',
                      border: `1px solid ${landingTokens.HAIRLINE}`,
                      transition: 'border-color 220ms ease',
                      '&:hover': { borderColor: landingTokens.GOLD },
                      '&:hover .gift-arrow': { color: landingTokens.GOLD, transform: 'translateX(4px)' },
                    }}
                  >
                    <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 22, fontWeight: 600, mb: 1 }}>
                      {r.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75, mb: 2 }}>
                      {r.desc}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: landingTokens.PRIMARY, fontWeight: 600, fontSize: 14 }}>
                      <span>Xem gợi ý</span>
                      <ArrowForwardIcon className="gift-arrow" sx={{ fontSize: 16, transition: 'transform 220ms ease, color 220ms ease' }} />
                    </Stack>
                  </Box>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. Theo ngân sách */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            THEO NGÂN SÁCH
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
            Món quà vừa túi, vừa lòng
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {budgets.map((b, i) => (
            <Grid key={b.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <m.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
              >
                <Box
                  component={Link}
                  href={b.href}
                  sx={{
                    display: 'block', textDecoration: 'none', color: landingTokens.INK,
                    p: 4, textAlign: 'center',
                    bgcolor: landingTokens.PRIMARY, color: '#FBF7F2',
                    borderBottom: `3px solid ${landingTokens.GOLD}`,
                    transition: 'transform 220ms ease',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.18em' }}>
                    NGÂN SÁCH
                  </Typography>
                  <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 24, fontWeight: 600, mt: 1, mb: 2 }}>
                    {b.label}
                  </Typography>
                  <Chip
                    label={`Khám phá`}
                    size="small"
                    sx={{
                      borderRadius: 0.5,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: '#FBF7F2',
                      border: `1px solid ${landingTokens.GOLD}`,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 5. Gift card */}
      <Box sx={{ bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <CardGiftcardOutlinedIcon sx={{ fontSize: 44, color: landingTokens.GOLD, mb: 2 }} />
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em' }}>
                PNJ GIFT CARD & E-GIFT
              </Typography>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 600, color: '#FBF7F2', mt: 1.5, lineHeight: 1.2 }}>
                Khi bạn chưa biết chọn gì
              </Typography>
              <Typography sx={{ color: 'rgba(251,247,242,0.82)', mt: 2, lineHeight: 1.85 }}>
                Thẻ quà tặng PNJ với mệnh giá từ {fCurrency(500_000, 'VND')} đến {fCurrency(50_000_000, 'VND')}.
                Giao tận nơi hoặc gửi qua email trong vòng 5 phút.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                <Button
                  component={Link}
                  href="/voucher"
                  variant="contained"
                  sx={{
                    ...sxSharpBtnContained,
                    bgcolor: landingTokens.GOLD,
                    color: landingTokens.INK,
                    '&:hover': { bgcolor: landingTokens.GOLD_DARK, color: '#FBF7F2' },
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Mua Gift Card
                </Button>
                <Button
                  component={Link}
                  href="/voucher"
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3.5,
                    py: 1.5,
                    color: '#FBF7F2',
                    borderColor: '#FBF7F2',
                    '&:hover': { color: landingTokens.GOLD, borderColor: landingTokens.GOLD },
                  }}
                >
                  Gửi E-Gift ngay
                </Button>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{
                aspectRatio: '16/10',
                bgcolor: `linear-gradient(135deg, ${landingTokens.GOLD}, ${landingTokens.GOLD_DARK})`,
                background: `linear-gradient(135deg, ${landingTokens.GOLD} 0%, ${landingTokens.GOLD_DARK} 100%)`,
                p: { xs: 4, md: 6 },
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                color: landingTokens.INK,
                position: 'relative',
                overflow: 'hidden',
                border: `1px solid ${landingTokens.GOLD}`,
              }}>
                <Box sx={{ position: 'absolute', top: 24, right: 24, opacity: 0.2 }}>
                  <CardGiftcardOutlinedIcon sx={{ fontSize: 120 }} />
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ letterSpacing: '0.2em', fontWeight: 700 }}>
                    PNJ GIFT CARD
                  </Typography>
                  <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 32, md: 44 }, fontWeight: 600, mt: 1 }}>
                    {fCurrency(5_000_000, 'VND')}
                  </Typography>
                </Box>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ position: 'relative' }}>
                  <Typography variant="caption" sx={{ letterSpacing: '0.12em' }}>
                    GC-XXXX-XXXX-XXXX
                  </Typography>
                  <Typography sx={{ fontWeight: 700, letterSpacing: '0.08em' }}>PNJ</Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 6. CTA form */}
      <Box sx={{ bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 820 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.24em' }}>
              TƯ VẤN CHỌN QUÀ
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 600, color: '#FBF7F2', mt: 1.5, lineHeight: 1.2 }}>
              Cần tư vấn chọn quà?
            </Typography>
            <Typography sx={{ color: 'rgba(251,247,242,0.72)', mt: 2 }}>
              Chuyên gia PNJ sẽ gợi ý món quà phù hợp theo dịp và ngân sách của bạn.
            </Typography>
          </Box>

          {sent ? (
            <Box sx={{ textAlign: 'center', border: `1px solid ${landingTokens.GOLD}`, p: 5 }}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 24, color: landingTokens.GOLD, mb: 1 }}>
                Cảm ơn bạn!
              </Typography>
              <Typography sx={{ color: 'rgba(251,247,242,0.82)' }}>
                Chuyên gia PNJ sẽ liên hệ với bạn trong 24 giờ.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {[
                  { k: 'name', label: 'Họ và tên', type: 'text', required: true, sm: 6 },
                  { k: 'phone', label: 'Số điện thoại', type: 'tel', required: true, sm: 6 },
                  { k: 'occasion', label: 'Dịp bạn muốn tặng', type: 'text', required: false, sm: 12 },
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
                    Gửi yêu cầu
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
