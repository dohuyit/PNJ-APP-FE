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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DiamondIcon from '@mui/icons-material/Diamond';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { fNumber, fCurrency } from 'src/utils/format-number';
import { landingTokens, sxSharpBtnContained, sxSharpInput } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn, slideUp, staggerContainer } from 'src/views/admin/_shared/motion';
import { mockMembershipTiers } from 'src/mock-data/membership-tiers';

const TIER_ICONS = {
  silver: MilitaryTechIcon,
  gold: EmojiEventsIcon,
  platinum: WorkspacePremiumIcon,
  diamond: DiamondIcon,
};

const earnWays = [
  { icon: ShoppingBagOutlinedIcon, title: 'Mua trang sức', desc: 'Tích 1 – 2.5% giá trị hoá đơn tùy hạng thẻ. Áp dụng cho mọi sản phẩm PNJ.' },
  { icon: GroupAddOutlinedIcon, title: 'Giới thiệu bạn', desc: 'Nhận 100.000đ điểm thưởng cho mỗi bạn bè đăng ký và mua hàng thành công.' },
  { icon: CakeOutlinedIcon, title: 'Quà sinh nhật', desc: 'Nhận voucher sinh nhật và điểm thưởng x2 trong tháng sinh nhật của bạn.' },
];

const perkRows = [
  { label: 'Giảm giá sản phẩm', values: ['0%', '5%', '8%', '12%'] },
  { label: 'Tư vấn viên riêng', values: [false, false, true, true] },
  { label: 'Quà sinh nhật', values: ['Voucher 100k', 'Voucher 300k', 'Quà cao cấp', 'Quà VIP tuyển chọn'] },
  { label: 'Miễn phí dịch vụ vệ sinh', values: [false, true, true, true] },
  { label: 'Ưu tiên sửa chữa', values: [false, true, true, true] },
  { label: 'Mời sự kiện VIP', values: [false, false, false, true] },
];

export function LoyaltyView() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', birthday: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    // Mock submit
    // eslint-disable-next-line no-console
    console.log('[PNJ CARE register]', form);
    setSent(true);
  };

  return (
    <LazyMotion features={domAnimation}>
      {/* 1. Hero */}
      <Box sx={{ position: 'relative', bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 10, md: 16 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 25% 30%, ${landingTokens.GOLD}22, transparent 55%)` }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative' }}>
          <m.div initial="hidden" animate="show" variants={staggerContainer(0.1)}>
            <m.div variants={fadeIn}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
                PNJ CARE
              </Typography>
            </m.div>
            <m.div variants={slideUp}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 36, md: 60 }, fontWeight: 600, lineHeight: 1.1, maxWidth: 900, mb: 3 }}>
                Hành trình PNJ CARE<br />— Vàng ngọc tri ân
              </Typography>
            </m.div>
            <m.div variants={fadeIn}>
              <Typography sx={{ color: '#E8DFD4', opacity: 0.85, fontSize: { xs: 16, md: 18 }, maxWidth: 640, lineHeight: 1.7, mb: 4 }}>
                Chương trình khách hàng thân thiết dành cho người yêu trang sức.
                Mỗi khoảnh khắc đồng hành cùng PNJ là một bước gần hơn tới ưu đãi dành riêng cho bạn.
              </Typography>
              <Button component="a" href="#dang-ky" variant="contained" size="large" sx={sxSharpBtnContained} endIcon={<ArrowForwardIcon />}>
                Đăng ký thành viên
              </Button>
            </m.div>
          </m.div>
        </Container>
      </Box>

      {/* 2. Tier ladder */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            4 HẠNG THẺ
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
            Nấc thang tri ân dành cho bạn
          </Typography>
        </Box>

        <Stack spacing={{ xs: 2.5, md: 3 }}>
          {mockMembershipTiers.map((t, i) => {
            const Icon = TIER_ICONS[t.code] ?? MilitaryTechIcon;
            return (
              <m.div
                key={t._id}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              >
                <Box sx={{
                  bgcolor: landingTokens.SURFACE,
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                  borderLeft: `4px solid ${t.color}`,
                  p: { xs: 3, md: 4 },
                }}>
                  <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 56, height: 56, display: 'grid', placeItems: 'center', bgcolor: `${t.color}15`, color: t.color }}>
                          <Icon sx={{ fontSize: 32 }} />
                        </Box>
                        <Box>
                          <Typography variant="overline" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.16em' }}>
                            Hạng {t.sort}
                          </Typography>
                          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 24, fontWeight: 600, lineHeight: 1.1 }}>
                            {t.name}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 6, md: 2.5 }}>
                      <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.08em', fontWeight: 600 }}>
                        CHI TIÊU
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', mt: 0.5 }}>
                        {t.max_spent
                          ? `${fCurrency(t.min_spent, 'VND')} – ${fCurrency(t.max_spent, 'VND')}`
                          : `Từ ${fCurrency(t.min_spent, 'VND')}`}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 6, md: 1.5 }}>
                      <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.08em', fontWeight: 600 }}>
                        TÍCH ĐIỂM
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: landingTokens.PRIMARY, mt: 0.5 }}>
                        {t.point_rate}%
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3.5 }}>
                      <Stack direction="row" flexWrap="wrap" gap={0.75}>
                        {t.benefits.map((b) => (
                          <Chip
                            key={b}
                            label={b}
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
                    </Grid>

                    <Grid size={{ xs: 12, md: 1.5 }} sx={{ textAlign: { md: 'right' } }}>
                      <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.08em', fontWeight: 600 }}>
                        THÀNH VIÊN
                      </Typography>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 22, fontWeight: 600, color: t.color, mt: 0.5 }}>
                        {fNumber(t.member_count)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </m.div>
            );
          })}
        </Stack>
      </Container>

      {/* 3. Cách tích điểm */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              TÍCH LUỸ ĐIỂM
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
              3 cách để bạn tiến hạng
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {earnWays.map((w, i) => {
              const Icon = w.icon;
              return (
                <Grid key={w.title} size={{ xs: 12, md: 4 }}>
                  <m.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
                  >
                    <Box sx={{ p: 4, bgcolor: landingTokens.SURFACE, borderTop: `2px solid ${landingTokens.GOLD}`, height: '100%' }}>
                      <Icon sx={{ fontSize: 40, color: landingTokens.PRIMARY, mb: 2 }} />
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 22, fontWeight: 600, mb: 1.5 }}>
                        {w.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75 }}>
                        {w.desc}
                      </Typography>
                    </Box>
                  </m.div>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* 4. Perk comparison table */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            ĐẶC QUYỀN THEO HẠNG
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
            So sánh quyền lợi
          </Typography>
        </Box>

        <Box sx={{ border: `1px solid ${landingTokens.HAIRLINE}`, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: landingTokens.NEUTRAL }}>
                <TableCell sx={{ fontWeight: 700, borderBottom: `1px solid ${landingTokens.HAIRLINE}` }}>Quyền lợi</TableCell>
                {mockMembershipTiers.map((t) => (
                  <TableCell key={t._id} align="center" sx={{ borderBottom: `1px solid ${landingTokens.HAIRLINE}`, borderLeft: `1px solid ${landingTokens.HAIRLINE}` }}>
                    <Stack alignItems="center" spacing={0.5}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: t.color }} />
                      <Typography sx={{ fontWeight: 700, color: landingTokens.INK }}>{t.name}</Typography>
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {perkRows.map((row, ri) => (
                <TableRow key={row.label} sx={{ bgcolor: ri % 2 ? 'transparent' : 'rgba(0,52,104,0.02)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.label}</TableCell>
                  {row.values.map((v, ci) => (
                    <TableCell
                      key={ci}
                      align="center"
                      sx={{ borderLeft: `1px solid ${landingTokens.HAIRLINE}`, fontVariantNumeric: 'tabular-nums' }}
                    >
                      {typeof v === 'boolean' ? (
                        v ? (
                          <CheckIcon sx={{ color: landingTokens.PRIMARY }} />
                        ) : (
                          <CloseIcon sx={{ color: landingTokens.HAIRLINE, fontSize: 18 }} />
                        )
                      ) : (
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{v}</Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Container>

      {/* 5. Registration form */}
      <Box id="dang-ky" sx={{ bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 820 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.24em' }}>
              ĐĂNG KÝ THÀNH VIÊN
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 600, color: '#FBF7F2', mt: 1.5, lineHeight: 1.2 }}>
              Bắt đầu hành trình tri ân
            </Typography>
            <Typography sx={{ color: 'rgba(251,247,242,0.72)', mt: 2 }}>
              Nhận hạng Bạc ngay khi đăng ký, kèm voucher 100.000đ cho đơn đầu tiên.
            </Typography>
          </Box>

          {sent ? (
            <Box sx={{ textAlign: 'center', border: `1px solid ${landingTokens.GOLD}`, p: 5 }}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 24, color: landingTokens.GOLD, mb: 1 }}>
                Chào mừng bạn đến với PNJ CARE!
              </Typography>
              <Typography sx={{ color: 'rgba(251,247,242,0.82)' }}>
                Chúng tôi đã gửi mã thành viên qua SĐT của bạn.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {[
                  { k: 'name', label: 'Họ và tên', type: 'text', required: true, sm: 6 },
                  { k: 'phone', label: 'Số điện thoại', type: 'tel', required: true, sm: 6 },
                  { k: 'email', label: 'Email', type: 'email', required: false, sm: 6 },
                  { k: 'birthday', label: 'Ngày sinh', type: 'date', required: false, sm: 6, shrink: true },
                ].map((f) => (
                  <Grid key={f.k} size={{ xs: 12, sm: f.sm }}>
                    <TextField
                      fullWidth
                      required={f.required}
                      type={f.type}
                      label={f.label}
                      value={form[f.k]}
                      onChange={(e) => setForm((s) => ({ ...s, [f.k]: e.target.value }))}
                      InputLabelProps={f.shrink ? { shrink: true } : undefined}
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
                    Đăng ký ngay
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
