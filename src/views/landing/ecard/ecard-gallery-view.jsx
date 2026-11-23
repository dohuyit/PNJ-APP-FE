'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';

import { landingTokens, sxSharpBtnContained } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn, slideUp, staggerContainer } from 'src/views/admin/_shared/motion';
import { mockEcardTemplates, mockEcardCategories } from 'src/mock-data/ecards';

// Category-specific visual tone for fallback gradient card covers.
const toneByCategoryCode = {
  tet:    { bg: 'linear-gradient(145deg,#8A1E29 0%,#C48C46 100%)', accent: '#FFE2A8', emoji: '囍' },
  val:    { bg: 'linear-gradient(145deg,#C48C46 0%,#E8A8B8 100%)', accent: '#FBE7EC', emoji: '♥' },
  birth:  { bg: 'linear-gradient(145deg,#C48C46 0%,#F3C967 100%)', accent: '#FFF6D6', emoji: '✦' },
  wed:    { bg: 'linear-gradient(145deg,#003468 0%,#C48C46 100%)', accent: '#F4E8D1', emoji: '∞' },
  mother: { bg: 'linear-gradient(145deg,#C48C46 0%,#D8A6B8 100%)', accent: '#FDEBE4', emoji: '❀' },
  father: { bg: 'linear-gradient(145deg,#143765 0%,#2C5D9A 100%)', accent: '#C9D6E8', emoji: '★' },
  anni:   { bg: 'linear-gradient(145deg,#8A6A2F 0%,#C48C46 100%)', accent: '#FBE8C4', emoji: '◈' },
  xmas:   { bg: 'linear-gradient(145deg,#1F7A46 0%,#C48C46 100%)', accent: '#F6E8C9', emoji: '❄' },
};

// Keep only categories that actually have templates visible.
const activeCategories = mockEcardCategories.filter(
  (c) => c.status === 'active' && mockEcardTemplates.some((t) => t.category_id === c._id && t.status === 'active')
);

const steps = [
  { icon: CollectionsOutlinedIcon, title: 'Chọn mẫu', desc: 'Lựa chọn thiệp phù hợp dịp lễ, từ Tết, Valentine đến sinh nhật.' },
  { icon: EditOutlinedIcon, title: 'Viết lời nhắn', desc: 'Cá nhân hoá lời chúc, chèn tên và ảnh gia đình nếu muốn.' },
  { icon: SendOutlinedIcon, title: 'Gửi qua email · SMS', desc: 'Thiệp đến tay người nhận trong vài giây, mọi lúc mọi nơi.' },
];

export function EcardGalleryView() {
  const [cat, setCat] = useState('all');
  const [preview, setPreview] = useState(null);

  const catByCode = useMemo(() => {
    const m2 = {};
    mockEcardCategories.forEach((c) => { m2[c._id] = c; });
    return m2;
  }, []);

  const templates = useMemo(() => {
    const list = mockEcardTemplates.filter((t) => t.status === 'active');
    const filtered = cat === 'all' ? list : list.filter((t) => t.category_id === cat);
    return filtered.slice(0, 30);
  }, [cat]);

  return (
    <LazyMotion features={domAnimation}>
      {/* 1. Hero */}
      <Box sx={{ position: 'relative', bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 9, md: 14 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 25% 30%, ${landingTokens.GOLD}22, transparent 60%)` }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative' }}>
          <m.div initial="hidden" animate="show" variants={staggerContainer(0.1)}>
            <m.div variants={fadeIn}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
                THIỆP ĐIỆN TỬ PNJ
              </Typography>
            </m.div>
            <m.div variants={slideUp}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 32, md: 56 }, fontWeight: 600, lineHeight: 1.1, maxWidth: 900, mb: 3 }}>
                Thiệp điện tử PNJ<br />— Trao gửi tình cảm số hoá
              </Typography>
            </m.div>
            <m.div variants={fadeIn}>
              <Typography sx={{ color: '#E8DFD4', opacity: 0.85, fontSize: { xs: 15, md: 17 }, maxWidth: 620, lineHeight: 1.7 }}>
                Hàng chục mẫu thiệp thiết kế riêng cho từng dịp lễ. Tuỳ chỉnh lời chúc, gửi tức thì
                qua email hoặc SMS — đi kèm một món quà PNJ càng thêm ý nghĩa.
              </Typography>
            </m.div>
          </m.div>
        </Container>
      </Box>

      {/* 2. Filters + gallery */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 6, md: 10 } }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 5 }}>
          <Chip
            label={`Tất cả (${mockEcardTemplates.filter((t) => t.status === 'active').length})`}
            onClick={() => setCat('all')}
            sx={{
              borderRadius: 0.5,
              bgcolor: cat === 'all' ? landingTokens.PRIMARY : 'transparent',
              color: cat === 'all' ? '#FFF' : landingTokens.INK,
              border: `1px solid ${cat === 'all' ? landingTokens.PRIMARY : landingTokens.HAIRLINE}`,
              fontWeight: 600,
            }}
          />
          {activeCategories.map((c) => (
            <Chip
              key={c._id}
              label={c.name}
              onClick={() => setCat(c._id)}
              sx={{
                borderRadius: 0.5,
                bgcolor: cat === c._id ? landingTokens.PRIMARY : 'transparent',
                color: cat === c._id ? '#FFF' : landingTokens.INK,
                border: `1px solid ${cat === c._id ? landingTokens.PRIMARY : landingTokens.HAIRLINE}`,
                fontWeight: 600,
              }}
            />
          ))}
        </Stack>

        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {templates.map((t) => {
            const category = catByCode[t.category_id];
            const tone = toneByCategoryCode[category?.code] || toneByCategoryCode.tet;
            return (
              <Grid key={t._id} size={{ xs: 6, sm: 4, md: 3 }}>
                <m.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <Box
                    onClick={() => setPreview({ template: t, category, tone })}
                    sx={{
                      cursor: 'pointer',
                      border: `1px solid ${landingTokens.HAIRLINE}`,
                      overflow: 'hidden',
                      bgcolor: landingTokens.SURFACE,
                      transition: 'transform 220ms ease, box-shadow 220ms ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(0,52,104,0.14)' },
                    }}
                  >
                    {/* IMAGE: ecard template cover 480x640 — fallback gradient per category tone */}
                    <Box sx={{ position: 'relative', aspectRatio: '3/4', background: tone.bg }}>
                      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.35) 100%)' }} />
                      <Typography
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'grid',
                          placeItems: 'center',
                          fontFamily: landingTokens.FONT_SERIF,
                          fontSize: { xs: 72, md: 96 },
                          color: tone.accent,
                          opacity: 0.6,
                          fontWeight: 300,
                        }}
                      >
                        {tone.emoji}
                      </Typography>
                      <Box sx={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>
                        <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 14, md: 16 }, fontWeight: 600, color: '#FBF7F2', lineHeight: 1.3 }}>
                          {t.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Chip
                        label={category?.name || '—'}
                        size="small"
                        sx={{ borderRadius: 0.5, bgcolor: 'rgba(0,52,104,0.06)', color: landingTokens.PRIMARY, fontWeight: 600, fontSize: 11 }}
                      />
                    </Box>
                  </Box>
                </m.div>
              </Grid>
            );
          })}
        </Grid>

        {templates.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: landingTokens.INK_MUTED }}>Không có thiệp nào trong nhóm này.</Typography>
          </Box>
        )}
      </Container>

      {/* 3. 3 steps */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              CÁCH GỬI THIỆP
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
              Ba bước để trao gửi yêu thương
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Grid key={s.title} size={{ xs: 12, md: 4 }}>
                  <m.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' }}
                  >
                    <Box sx={{ p: 4, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, borderTop: `2px solid ${landingTokens.GOLD}`, height: '100%' }}>
                      <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 2 }}>
                        <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 48, fontWeight: 700, color: landingTokens.GOLD, lineHeight: 1 }}>
                          0{i + 1}
                        </Typography>
                        <Icon sx={{ fontSize: 32, color: landingTokens.PRIMARY }} />
                      </Stack>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 22, fontWeight: 600, mb: 1 }}>
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
        </Container>
      </Box>

      {/* 4. Gift CTA */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 12 } }}>
        <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', p: { xs: 4, md: 8 } }}>
          <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 85% 20%, ${landingTokens.GOLD}2a, transparent 55%)` }} />
          <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center" sx={{ position: 'relative' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <CardGiftcardOutlinedIcon sx={{ fontSize: 44, color: landingTokens.GOLD, mb: 2 }} />
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.24em' }}>
                QUÀ TẶNG PNJ
              </Typography>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 600, mt: 1.5, lineHeight: 1.2, color: '#FBF7F2' }}>
                Đính kèm thiệp với một món trang sức PNJ
              </Typography>
              <Typography sx={{ color: '#E8DFD4', opacity: 0.85, mt: 2.5, lineHeight: 1.75, fontSize: 16 }}>
                Mỗi món quà PNJ đi kèm thiệp điện tử đều được giao trong hộp sang trọng,
                sẵn sàng cho mọi dịp đặc biệt trong đời bạn.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                component={Link}
                href="/qua-tang"
                variant="contained"
                size="large"
                sx={{ ...sxSharpBtnContained, bgcolor: landingTokens.GOLD, color: landingTokens.INK, px: 5, '&:hover': { bgcolor: landingTokens.GOLD_DARK, color: '#FBF7F2' } }}
                endIcon={<ArrowForwardIcon />}
              >
                Khám phá quà tặng PNJ
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Preview dialog */}
      <Dialog
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { bgcolor: landingTokens.INK, borderRadius: 1 } }}
      >
        {preview && (
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              onClick={() => setPreview(null)}
              sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, bgcolor: 'rgba(0,0,0,0.4)', color: '#FBF7F2', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ position: 'relative', aspectRatio: '3/4', background: preview.tone.bg }}>
              <Typography
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: landingTokens.FONT_SERIF,
                  fontSize: { xs: 140, md: 180 },
                  color: preview.tone.accent,
                  opacity: 0.5,
                  fontWeight: 300,
                }}
              >
                {preview.tone.emoji}
              </Typography>
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />
              <Box sx={{ position: 'absolute', left: 24, right: 24, bottom: 28, textAlign: 'center' }}>
                <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em' }}>
                  {preview.category?.name}
                </Typography>
                <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 24, md: 30 }, fontWeight: 600, color: '#FBF7F2', mt: 1, lineHeight: 1.25 }}>
                  {preview.template.name}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ p: 3, bgcolor: landingTokens.INK }}>
              <Button
                variant="contained"
                fullWidth
                sx={{ ...sxSharpBtnContained, bgcolor: landingTokens.GOLD, color: landingTokens.INK, '&:hover': { bgcolor: landingTokens.GOLD_DARK, color: '#FBF7F2' } }}
                startIcon={<SendOutlinedIcon />}
              >
                Dùng mẫu này
              </Button>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </LazyMotion>
  );
}
