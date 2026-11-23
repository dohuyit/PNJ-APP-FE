'use client';

import { useState } from 'react';
import Link from 'next/link';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';

import { MotionViewport, varFade } from 'src/components/animate';
import {
  landingTokens,
  sxSharpBtnContained,
  sxSharpBtnCta,
  sxSharpInput,
} from 'src/theme/landing';
import Wireframe from 'src/sections/landing/components/Wireframe';
import { mockCollections } from 'src/mock-data/collections';

// Pick 3 wedding-leaning collections from existing mock
const WEDDING_SLUGS = ['trang-suc-cuoi-hoi', 'hanh-phuc', 'thanh-xuan'];
const featured = WEDDING_SLUGS
  .map((s) => mockCollections.find((c) => c.slug === s))
  .filter(Boolean);

const signatureLabels = ['Wedding Signature', 'Hạnh Phúc', 'Thanh Xuân'];

const splitBlocks = [
  {
    title: 'Nhẫn cưới',
    desc: 'Cặp đôi đồng hành trọn đời, khắc tên miễn phí.',
    tags: ['Platinum', 'Gold 18K', 'Vàng ta', 'Cặp đôi'],
    href: '/category/collection/trang-suc-cuoi-hoi',
    cta: 'Xem nhẫn cưới',
  },
  {
    title: 'Nhẫn cầu hôn',
    desc: 'Khoảnh khắc ngỏ lời cùng viên kim cương kiểm định.',
    tags: ['Natural Diamond', 'Lab Diamond', 'Solitaire', 'Halo'],
    href: '/category/collection/my-first-diamond',
    cta: 'Xem nhẫn cầu hôn',
  },
];

const lookbook = [
  { caption: 'Hạnh phúc trọn vẹn', tone: '#2A1F1D' },
  { caption: 'Khoảnh khắc đáng nhớ', tone: '#3A2A28' },
  { caption: 'Lời hẹn vĩnh cửu', tone: '#1F2A3A' },
  { caption: 'Sánh bước cùng nhau', tone: '#2E2320' },
];

const services = [
  { icon: DiamondOutlinedIcon, title: 'Khắc tên miễn phí', desc: 'Khắc tên và ngày cưới trên mặt trong nhẫn.' },
  { icon: VerifiedOutlinedIcon, title: 'Bảo hành trọn đời', desc: 'Đánh bóng, làm mới miễn phí trọn đời sản phẩm.' },
  { icon: SwapHorizOutlinedIcon, title: 'Đổi size miễn phí', desc: 'Hỗ trợ đổi size nhẫn trong vòng 90 ngày.' },
  { icon: SupportAgentOutlinedIcon, title: 'Tư vấn trực tiếp', desc: 'Chuyên gia 1-1 tại cửa hàng hoặc online.' },
  { icon: LocalShippingOutlinedIcon, title: 'Giao tận nơi', desc: 'Giao hàng bảo hiểm đến tận địa chỉ cưới.' },
];

const faqs = [
  {
    q: 'Làm sao để chọn size nhẫn cưới đúng?',
    a: 'Bạn có thể đến cửa hàng PNJ gần nhất để đo size miễn phí, hoặc dùng bộ đo size tại nhà do PNJ gửi tới.',
  },
  {
    q: 'Nên chọn chất liệu Platinum hay Vàng 18K?',
    a: 'Platinum bền, giữ màu trắng tự nhiên; Vàng 18K linh hoạt kiểu dáng và tối ưu chi phí. Tư vấn viên sẽ gợi ý theo nhu cầu.',
  },
  {
    q: 'Chính sách bảo hành nhẫn cưới ra sao?',
    a: 'PNJ bảo hành trọn đời: đánh bóng, xi mạ, kiểm tra đá miễn phí tại mọi cửa hàng trên toàn quốc.',
  },
  {
    q: 'Có thể thu đổi nhẫn cưới sau này không?',
    a: 'Có. PNJ thu đổi theo bảng giá vàng hiện hành và chính sách thu đổi trang sức áp dụng toàn hệ thống.',
  },
];

const MotionBox = m(Box);

function SectionHeading({ eyebrow, title, align = 'left', light }) {
  return (
    <Box sx={{ textAlign: align, mb: { xs: 4, md: 6 } }}>
      <Typography
        variant="overline"
        sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', display: 'block', mb: 1 }}
      >
        {eyebrow}
      </Typography>
      <Typography
        sx={{
          fontFamily: landingTokens.FONT_SERIF,
          fontSize: { xs: 28, md: 44 },
          fontWeight: 600,
          lineHeight: 1.15,
          color: light ? '#FBF7F2' : landingTokens.INK,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export function WeddingHubView() {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSent(true);
  };

  return (
    <MotionViewport>
      {/* 1. Hero */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '68dvh', md: '80dvh' },
          minHeight: 520,
          overflow: 'hidden',
          bgcolor: landingTokens.INK,
          color: '#FBF7F2',
        }}
      >
        <Wireframe label="Hero cưới hỏi · 1920×820" fill sx={{ opacity: 0.45 }} />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(26,20,19,0.55) 0%, rgba(26,20,19,0.85) 100%)',
          }}
        />
        <Container
          maxWidth={false}
          sx={{
            maxWidth: 1155,
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            pb: { xs: 6, md: 10 },
          }}
        >
          <MotionBox variants={varFade().inUp} initial="initial" animate="animate" sx={{ maxWidth: 820 }}>
            <Typography
              variant="overline"
              sx={{ color: landingTokens.GOLD, letterSpacing: '0.24em', mb: 2, display: 'block' }}
            >
              MÙA CƯỚI PNJ 2026
            </Typography>
            <Typography
              sx={{
                fontFamily: landingTokens.FONT_SERIF,
                fontSize: { xs: 40, md: 72 },
                fontWeight: 600,
                lineHeight: 1.05,
                color: '#FBF7F2',
                mb: 3,
              }}
            >
              Mùa cưới PNJ 2026<br />— Khởi đầu hạnh phúc.
            </Typography>
            <Typography sx={{ color: 'rgba(251,247,242,0.82)', fontSize: { xs: 15, md: 18 }, lineHeight: 1.7, maxWidth: 620, mb: 4 }}>
              Bộ sưu tập nhẫn cưới và trang sức ngày trọng đại, chế tác thủ công
              bởi nghệ nhân PNJ cùng kim cương kiểm định quốc tế.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={Link}
                href="/category/collection/trang-suc-cuoi-hoi"
                variant="contained"
                size="large"
                sx={sxSharpBtnCta}
                endIcon={<ArrowForwardIcon />}
              >
                Khám phá BST
              </Button>
              <Button
                component="a"
                href="#tu-van"
                variant="outlined"
                size="large"
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
                Đặt tư vấn
              </Button>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      {/* 2. BST cưới hỏi */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <SectionHeading eyebrow="BỘ SƯU TẬP" title="BST cưới hỏi tuyển chọn" />
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {featured.map((c, i) => (
            <Grid key={c._id} size={{ xs: 12, md: 4 }}>
              <MotionBox
                variants={varFade().inUp}
                component={Link}
                href={`/category/collection/${c.slug}`}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  position: 'relative',
                  overflow: 'hidden',
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                  '&:hover .cover': { transform: 'scale(1.04)' },
                }}
              >
                <Box sx={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                  <Box
                    className="cover"
                    sx={{ position: 'absolute', inset: 0, transition: 'transform 600ms ease' }}
                  >
                    <Wireframe label={`${signatureLabels[i]} · 640×800`} fill />
                  </Box>
                </Box>
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="overline"
                    sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.2em' }}
                  >
                    {signatureLabels[i]}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: landingTokens.FONT_SERIF,
                      fontSize: { xs: 22, md: 26 },
                      fontWeight: 500,
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    {c.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, mb: 2 }}>
                    {c.short_description}
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED }}>
                      {c.product_count} sản phẩm
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: landingTokens.PRIMARY, fontWeight: 600 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Khám phá</Typography>
                      <ArrowForwardIcon fontSize="small" />
                    </Stack>
                  </Stack>
                </Box>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 3. Nhẫn cưới & Cầu hôn */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <SectionHeading eyebrow="CHO NGÀY TRỌNG ĐẠI" title="Nhẫn cưới & Nhẫn cầu hôn" />
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {splitBlocks.map((b) => (
              <Grid key={b.title} size={{ xs: 12, md: 6 }}>
                <MotionBox variants={varFade().inUp} sx={{ bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, height: '100%' }}>
                  <Box sx={{ position: 'relative', aspectRatio: '16/10' }}>
                    <Wireframe label={`${b.title} · 960×600`} fill />
                  </Box>
                  <Box sx={{ p: { xs: 3, md: 5 } }}>
                    <Typography
                      sx={{
                        fontFamily: landingTokens.FONT_SERIF,
                        fontSize: { xs: 24, md: 32 },
                        fontWeight: 600,
                        mb: 1.5,
                      }}
                    >
                      {b.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, mb: 2.5 }}>
                      {b.desc}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
                      {b.tags.map((t) => (
                        <Chip
                          key={t}
                          label={t}
                          size="small"
                          sx={{
                            borderRadius: 0.5,
                            bgcolor: 'transparent',
                            border: `1px solid ${landingTokens.HAIRLINE}`,
                            color: landingTokens.INK,
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Stack>
                    <Button
                      component={Link}
                      href={b.href}
                      variant="contained"
                      sx={sxSharpBtnContained}
                      endIcon={<ArrowForwardIcon />}
                    >
                      {b.cta}
                    </Button>
                  </Box>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. Lookbook */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <SectionHeading eyebrow="LOOKBOOK" title="Khoảnh khắc chạm dấu yêu thương" />
        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {lookbook.map((l, i) => (
            <Grid key={l.caption} size={{ xs: 6, md: 3 }}>
              <MotionBox
                variants={varFade().inUp}
                sx={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  bgcolor: l.tone,
                  overflow: 'hidden',
                  color: '#FBF7F2',
                }}
              >
                <Wireframe label={`Lookbook ${i + 1}`} fill sx={{ opacity: 0.25 }} />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent 55%)',
                  }}
                />
                <Box sx={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
                  <FavoriteBorderIcon sx={{ color: landingTokens.GOLD, fontSize: 18, mb: 1 }} />
                  <Typography
                    sx={{
                      fontFamily: landingTokens.FONT_SERIF,
                      fontSize: { xs: 16, md: 20 },
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {l.caption}
                  </Typography>
                </Box>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 5. Dịch vụ cưới */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL_SOFT, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <SectionHeading eyebrow="DỊCH VỤ CƯỚI" title="Trọn gói cho cặp đôi PNJ" align="center" />
          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Grid key={s.title} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                  <MotionBox
                    variants={varFade().inUp}
                    sx={{
                      bgcolor: landingTokens.SURFACE,
                      p: { xs: 3, md: 3.5 },
                      height: '100%',
                      border: `1px solid ${landingTokens.HAIRLINE}`,
                      borderTop: `2px solid ${landingTokens.GOLD}`,
                      textAlign: 'center',
                    }}
                  >
                    <Icon sx={{ fontSize: 36, color: landingTokens.PRIMARY, mb: 1.5 }} />
                    <Typography sx={{ fontWeight: 600, mb: 1 }}>{s.title}</Typography>
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.65 }}>
                      {s.desc}
                    </Typography>
                  </MotionBox>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* 6. FAQ mini */}
      <Container maxWidth={false} sx={{ maxWidth: 920, py: { xs: 8, md: 14 } }}>
        <SectionHeading eyebrow="HỎI ĐÁP" title="Những điều cặp đôi thường hỏi" align="center" />
        <Stack spacing={1.5}>
          {faqs.map((f, i) => (
            <Accordion
              key={f.q}
              defaultExpanded={i === 0}
              disableGutters
              elevation={0}
              sx={{
                border: `1px solid ${landingTokens.HAIRLINE}`,
                borderRadius: 1,
                '&:before': { display: 'none' },
                bgcolor: landingTokens.SURFACE,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: landingTokens.PRIMARY }} />} sx={{ px: 3 }}>
                <Typography sx={{ fontWeight: 600 }}>{f.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pt: 0 }}>
                <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75 }}>
                  {f.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>

      {/* 7. CTA cuối — form đặt tư vấn */}
      <Box id="tu-van" sx={{ bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 820 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.24em' }}>
              ĐẶT LỊCH TƯ VẤN
            </Typography>
            <Typography
              sx={{
                fontFamily: landingTokens.FONT_SERIF,
                fontSize: { xs: 28, md: 44 },
                fontWeight: 600,
                color: '#FBF7F2',
                mt: 1.5,
                lineHeight: 1.2,
              }}
            >
              Đặt lịch tư vấn tận nơi
            </Typography>
            <Typography sx={{ color: 'rgba(251,247,242,0.72)', mt: 2 }}>
              Để lại thông tin, chuyên gia cưới PNJ sẽ liên hệ trong 24 giờ.
            </Typography>
          </Box>

          {sent ? (
            <Box sx={{ textAlign: 'center', border: `1px solid ${landingTokens.GOLD}`, p: 5 }}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 24, color: landingTokens.GOLD, mb: 1 }}>
                Cảm ơn bạn!
              </Typography>
              <Typography sx={{ color: 'rgba(251,247,242,0.82)' }}>
                PNJ đã nhận yêu cầu và sẽ liên hệ sớm.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Họ và tên"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
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
                    label="Số điện thoại"
                    value={form.phone}
                    onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
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
                    Gửi yêu cầu
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    </MotionViewport>
  );
}
