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
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';

import { fCurrency } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
import { landingTokens, sxSharpBtnContained, sxSharpInput, sxSharpCard } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn } from 'src/views/admin/_shared/motion';
import { mockOrders } from 'src/mock-data/orders';

const STEPS = [
  { code: 'pending', label: 'Chờ xác nhận' },
  { code: 'confirmed', label: 'Đã xác nhận' },
  { code: 'processing', label: 'Đang chuẩn bị' },
  { code: 'shipping', label: 'Đang giao' },
  { code: 'delivered', label: 'Đã giao' },
];

const guides = [
  { title: 'Cách 1 – Nhập mã đơn', desc: 'Nhập SĐT đặt hàng và mã đơn (bắt đầu bằng DH) vào ô tra cứu ở đầu trang.' },
  { title: 'Cách 2 – Tài khoản PNJ', desc: 'Đăng nhập tại trang Tài khoản để xem toàn bộ lịch sử đơn hàng của bạn.' },
  { title: 'Cách 3 – Gọi hotline', desc: 'Liên hệ hotline 1900 54 54 57 để được nhân viên PNJ tra cứu hộ.' },
];

export function TrackOrderView() {
  const [input, setInput] = useState({ phone: '', code: '' });
  const [result, setResult] = useState(null); // 'notfound' | order | null
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    const codeNorm = input.code.trim().toUpperCase();
    const phoneNorm = input.phone.trim();
    // shortcut: tìm theo code hoặc fallback đơn đầu nếu người dùng chỉ nhập SĐT
    const match = mockOrders.find((o) => (
      (codeNorm && (o.order_no === codeNorm || o.code === codeNorm))
      || (phoneNorm && o.buyer?.phone && String(o.buyer.phone).includes(phoneNorm))
    ));
    setResult(match ?? 'notfound');
  };

  const order = result && result !== 'notfound' ? result : null;
  const currentIdx = order ? STEPS.findIndex((s) => s.code === order.status) : -1;

  return (
    <LazyMotion features={domAnimation}>
      {/* 1. Hero mini + form */}
      <Box sx={{ bgcolor: landingTokens.PRIMARY, color: '#FBF7F2', py: { xs: 6, md: 10 }, borderBottom: `2px solid ${landingTokens.GOLD}` }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <m.div initial="hidden" animate="show" variants={fadeIn}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em' }}>
              TRA CỨU NHANH
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 32, md: 48 }, fontWeight: 700, mt: 1, mb: 1.5, lineHeight: 1.1 }}>
              Tra cứu đơn hàng
            </Typography>
            <Typography sx={{ color: 'rgba(251,247,242,0.82)', mb: 4, maxWidth: 560 }}>
              Nhập SĐT đặt hàng và mã đơn (bắt đầu bằng DH) để xem tiến độ.
            </Typography>
          </m.div>

          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth required label="Số điện thoại" type="tel"
                  value={input.phone}
                  onChange={(e) => setInput((s) => ({ ...s, phone: e.target.value }))}
                  sx={{
                    ...sxSharpInput,
                    '& .MuiInputLabel-root': { color: 'rgba(251,247,242,0.72)' },
                    '& .MuiOutlinedInput-root': {
                      ...sxSharpInput['& .MuiOutlinedInput-root'],
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: '#FBF7F2',
                      '& fieldset': { borderColor: 'rgba(251,247,242,0.3)' },
                      '&:hover fieldset': { borderColor: landingTokens.GOLD },
                      '&.Mui-focused fieldset': { borderColor: landingTokens.GOLD },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth label="Mã đơn hàng (VD: DH001000)"
                  value={input.code}
                  onChange={(e) => setInput((s) => ({ ...s, code: e.target.value }))}
                  sx={{
                    ...sxSharpInput,
                    '& .MuiInputLabel-root': { color: 'rgba(251,247,242,0.72)' },
                    '& .MuiOutlinedInput-root': {
                      ...sxSharpInput['& .MuiOutlinedInput-root'],
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: '#FBF7F2',
                      '& fieldset': { borderColor: 'rgba(251,247,242,0.3)' },
                      '&:hover fieldset': { borderColor: landingTokens.GOLD },
                      '&.Mui-focused fieldset': { borderColor: landingTokens.GOLD },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  startIcon={<SearchIcon />}
                  sx={{
                    ...sxSharpBtnContained,
                    bgcolor: landingTokens.GOLD,
                    color: landingTokens.INK,
                    py: 1.75,
                    '&:hover': { bgcolor: landingTokens.GOLD_DARK, color: '#FBF7F2' },
                  }}
                >
                  Tra cứu
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* 2. Result */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 6, md: 10 } }}>
        {!searched && (
          <Alert severity="info" sx={{ borderRadius: 1 }}>
            Mẹo: thử mã <strong>DH001000</strong> để xem demo timeline.
          </Alert>
        )}

        {searched && result === 'notfound' && (
          <Alert severity="warning" sx={{ borderRadius: 1 }}>
            Không tìm thấy đơn hàng khớp. Vui lòng kiểm tra lại SĐT hoặc mã đơn.
          </Alert>
        )}

        {order && (
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
            {/* Timeline */}
            <Box sx={{ ...sxSharpCard, p: { xs: 3, md: 4 }, mb: 4, borderTop: `3px solid ${landingTokens.GOLD}` }}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
                TRẠNG THÁI ĐƠN HÀNG
              </Typography>
              <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 22, md: 28 }, fontWeight: 600, mt: 1, mb: 4 }}>
                {STEPS[Math.max(currentIdx, 0)]?.label ?? 'Đã huỷ'}
              </Typography>

              <Box sx={{ position: 'relative' }}>
                <Box sx={{
                  position: 'absolute', top: 16, left: 16, right: 16, height: 2,
                  bgcolor: landingTokens.HAIRLINE, zIndex: 0,
                  display: { xs: 'none', md: 'block' },
                }} />
                <Box sx={{
                  position: 'absolute', top: 16, left: 16, height: 2,
                  width: `calc(${(Math.max(currentIdx, 0) / (STEPS.length - 1)) * 100}% - 32px)`,
                  bgcolor: landingTokens.PRIMARY, zIndex: 1,
                  transition: 'width 500ms ease',
                  display: { xs: 'none', md: 'block' },
                }} />

                <Grid container spacing={{ xs: 2, md: 2 }}>
                  {STEPS.map((s, i) => {
                    const done = i <= currentIdx;
                    const hist = order.status_history?.find((h) => h.status === s.code);
                    return (
                      <Grid key={s.code} size={{ xs: 12, md: 12 / STEPS.length }}>
                        <Stack direction={{ xs: 'row', md: 'column' }} spacing={{ xs: 2, md: 1 }} alignItems={{ xs: 'center', md: 'center' }} sx={{ position: 'relative', zIndex: 2 }}>
                          <Box sx={{
                            width: 34, height: 34, borderRadius: '50%',
                            display: 'grid', placeItems: 'center',
                            bgcolor: done ? landingTokens.PRIMARY : landingTokens.SURFACE,
                            color: done ? '#FBF7F2' : landingTokens.HAIRLINE,
                            border: `2px solid ${done ? landingTokens.PRIMARY : landingTokens.HAIRLINE}`,
                            flexShrink: 0,
                          }}>
                            {done
                              ? <CheckCircleIcon sx={{ fontSize: 22 }} />
                              : <RadioButtonUncheckedIcon sx={{ fontSize: 22 }} />}
                          </Box>
                          <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                            <Typography sx={{ fontWeight: done ? 700 : 500, color: done ? landingTokens.INK : landingTokens.INK_MUTED, fontSize: 14 }}>
                              {s.label}
                            </Typography>
                            {hist && (
                              <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, display: 'block', mt: 0.5 }}>
                                {fDateTime(hist.at, 'DD/MM HH:mm')}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Box>

            {/* Order details */}
            <Box sx={{ ...sxSharpCard, p: { xs: 3, md: 4 } }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="overline" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.12em' }}>
                    MÃ ĐƠN
                  </Typography>
                  <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: 22, fontWeight: 700, mt: 0.5, mb: 2 }}>
                    {order.order_no}
                  </Typography>
                  <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, mb: 0.5 }}>
                    Ngày đặt: <strong style={{ color: landingTokens.INK }}>{fDateTime(order.created_at, 'DD/MM/YYYY HH:mm')}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>
                    Khách hàng: <strong style={{ color: landingTokens.INK }}>{order.buyer?.full_name}</strong>
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="overline" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.12em' }}>
                    SẢN PHẨM
                  </Typography>
                  <Stack spacing={0.75} sx={{ mt: 1, mb: 2 }}>
                    {order.items.slice(0, 2).map((it) => (
                      <Stack key={it.variant_id} direction="row" justifyContent="space-between" spacing={2}>
                        <Typography variant="body2" sx={{ color: landingTokens.INK }}>
                          {it.product_name} × {it.qty}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                          {fCurrency(it.total, 'VND')}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Box sx={{ borderTop: `1px solid ${landingTokens.HAIRLINE}`, pt: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontWeight: 700 }}>Tổng tiền</Typography>
                      <Typography sx={{ fontWeight: 700, color: landingTokens.PRIMARY, fontVariantNumeric: 'tabular-nums', fontSize: 18 }}>
                        {fCurrency(order.amounts.grand_total, 'VND')}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </m.div>
        )}
      </Container>

      {/* 3. Guide + hotline */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              HƯỚNG DẪN
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 40 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
              3 cách tra cứu đơn hàng
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {guides.map((g, i) => (
              <Grid key={g.title} size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 4, bgcolor: landingTokens.SURFACE, borderTop: `2px solid ${landingTokens.GOLD}`, height: '100%' }}>
                  <LocalShippingOutlinedIcon sx={{ fontSize: 36, color: landingTokens.PRIMARY, mb: 2 }} />
                  <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: 20, fontWeight: 600, mb: 1.5 }}>
                    {g.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75 }}>
                    {g.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 8, p: { xs: 4, md: 6 }, textAlign: 'center', bgcolor: landingTokens.INK, color: '#FBF7F2' }}>
            <PhoneInTalkOutlinedIcon sx={{ fontSize: 40, color: landingTokens.GOLD, mb: 2 }} />
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 24, md: 32 }, color: landingTokens.GOLD, mb: 2 }}>
              Cần hỗ trợ ngay?
            </Typography>
            <Typography sx={{ color: '#E8DFD4', opacity: 0.85, mb: 3, maxWidth: 520, mx: 'auto' }}>
              Hotline PNJ hoạt động 8:00 – 22:00 mỗi ngày, kể cả cuối tuần và ngày lễ.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button component="a" href="tel:19005457" variant="contained" size="large" sx={sxSharpBtnContained} startIcon={<PhoneInTalkOutlinedIcon />}>
                Hotline 1900 54 54 57
              </Button>
              <Button
                component={Link} href="/contact"
                variant="outlined" size="large"
                sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600, px: 3.5, py: 1.5, color: '#FBF7F2', borderColor: '#FBF7F2', '&:hover': { color: landingTokens.GOLD, borderColor: landingTokens.GOLD } }}
              >
                Gửi tin nhắn
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </LazyMotion>
  );
}
