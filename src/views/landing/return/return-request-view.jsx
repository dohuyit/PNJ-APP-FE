'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import StraightenIcon from '@mui/icons-material/Straighten';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import { landingTokens, sxSharpBtnContained, sxSharpInput, sxSharpCard } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn, slideUp, staggerContainer } from 'src/views/admin/_shared/motion';

const policies = [
  {
    icon: AutorenewIcon,
    title: 'Thu đổi vàng',
    desc: 'Thu đổi vàng cũ các tuổi, định giá minh bạch theo giá niêm yết hằng ngày. Vàng mua tại PNJ còn đủ hoá đơn được ưu đãi tỷ lệ thu đổi.',
  },
  {
    icon: StraightenIcon,
    title: 'Đổi size trong 7 ngày',
    desc: 'Miễn phí đổi size nhẫn trong 7 ngày đầu, miễn phí nong rộng/thu nhỏ trọn đời cho trang sức PNJ.',
  },
  {
    icon: PaidOutlinedIcon,
    title: 'Hoàn tiền trong 30 ngày',
    desc: 'Hoàn tiền 100% trong 30 ngày nếu sản phẩm lỗi kỹ thuật từ nhà sản xuất. Áp dụng toàn hệ thống hơn 400 cửa hàng.',
  },
];

const mockPurchased = [
  { id: 'item-1', name: 'Nhẫn vàng 18K đính kim cương PNJ XMXMM000456', date: '12/10/2026' },
  { id: 'item-2', name: 'Dây chuyền vàng 24K PNJ SPXMM000789', date: '05/09/2026' },
];

const requestTypes = [
  { code: 'exchange_gold', label: 'Thu đổi vàng' },
  { code: 'resize', label: 'Đổi size' },
  { code: 'refund', label: 'Hoàn tiền' },
  { code: 'warranty', label: 'Bảo hành' },
];

const faqs = [
  { q: 'Mất bao lâu để xử lý yêu cầu?', a: 'PNJ xử lý và phản hồi trong 24 – 48 giờ làm việc kể từ khi nhận yêu cầu.' },
  { q: 'Tôi có cần mang hoá đơn gốc?', a: 'Vui lòng mang theo hoá đơn và phiếu bảo hành khi đến cửa hàng để quá trình xử lý nhanh hơn.' },
  { q: 'Phí đổi size là bao nhiêu?', a: 'Miễn phí trọn đời cho trang sức PNJ. Trang sức ngoài PNJ áp dụng bảng giá niêm yết tại cửa hàng.' },
  { q: 'Thu đổi vàng có bị trừ hao hụt?', a: 'Vàng mua tại PNJ còn đủ bao bì và phiếu bảo hành được thu đổi theo tỷ lệ ưu đãi nhất.' },
];

export function ReturnRequestView() {
  const [form, setForm] = useState({
    phone: '',
    orderCode: '',
    items: [],
    type: 'exchange_gold',
    reason: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });
  const [sent, setSent] = useState(false);

  const toggleItem = (id) => {
    setForm((s) => ({
      ...s,
      items: s.items.includes(id) ? s.items.filter((x) => x !== id) : [...s.items, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.phone.trim() || !form.orderCode.trim() || !form.reason.trim() || !form.contactName.trim()) return;
    // eslint-disable-next-line no-console
    console.log('[Return request]', form);
    setSent(true);
  };

  return (
    <LazyMotion features={domAnimation}>
      {/* 1. Hero */}
      <Box sx={{ position: 'relative', bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 8, md: 12 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 20% 40%, ${landingTokens.GOLD}22, transparent 55%)` }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative' }}>
          <m.div initial="hidden" animate="show" variants={fadeIn}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
              CHĂM SÓC KHÁCH HÀNG
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 34, md: 56 }, fontWeight: 600, lineHeight: 1.1, maxWidth: 820, mb: 3 }}>
              Yêu cầu thu đổi · hoàn tiền
            </Typography>
            <Typography sx={{ color: '#E8DFD4', opacity: 0.85, fontSize: { xs: 15, md: 17 }, maxWidth: 620, lineHeight: 1.7 }}>
              Minh bạch — nhanh gọn — đúng cam kết. Gửi yêu cầu ở đây, PNJ sẽ phản hồi trong 24 giờ.
            </Typography>
          </m.div>
        </Container>
      </Box>

      {/* 2. Policy summary */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 6, md: 10 } }}>
        <m.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer(0.08)}>
          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {policies.map((p) => {
              const Icon = p.icon;
              return (
                <Grid key={p.title} size={{ xs: 12, md: 4 }}>
                  <m.div variants={slideUp} style={{ height: '100%' }}>
                    <Box sx={{ p: 4, bgcolor: landingTokens.SURFACE, borderTop: `2px solid ${landingTokens.GOLD}`, border: `1px solid ${landingTokens.HAIRLINE}`, height: '100%' }}>
                      <Icon sx={{ fontSize: 40, color: landingTokens.PRIMARY, mb: 2 }} />
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 20, fontWeight: 600, mb: 1.5 }}>
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
        </m.div>
      </Container>

      {/* 3. Form + FAQ sidebar */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 6, md: 10 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Grid container spacing={{ xs: 4, md: 5 }} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 8 }}>
              {sent ? (
                <Box sx={{ ...sxSharpCard, p: { xs: 4, md: 6 }, textAlign: 'center', borderTop: `3px solid ${landingTokens.GOLD}` }}>
                  <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 28, fontWeight: 600, color: landingTokens.PRIMARY, mb: 2 }}>
                    Đã tiếp nhận yêu cầu
                  </Typography>
                  <Typography sx={{ color: landingTokens.INK_MUTED, maxWidth: 480, mx: 'auto' }}>
                    PNJ sẽ liên hệ với bạn trong vòng 24 giờ làm việc để hướng dẫn các bước tiếp theo.
                  </Typography>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit} sx={{ ...sxSharpCard, p: { xs: 3, md: 4 }, borderTop: `3px solid ${landingTokens.GOLD}` }}>
                  {/* 3.1 Order info */}
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 18, fontWeight: 600, mb: 2 }}>
                        1. Thông tin đơn hàng
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth required type="tel" label="Số điện thoại đặt hàng"
                            value={form.phone}
                            onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                            sx={sxSharpInput}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth required label="Mã đơn hàng"
                            value={form.orderCode}
                            onChange={(e) => setForm((s) => ({ ...s, orderCode: e.target.value }))}
                            sx={sxSharpInput}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* 3.2 Product selection */}
                    <Box>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 18, fontWeight: 600, mb: 2 }}>
                        2. Chọn sản phẩm cần xử lý
                      </Typography>
                      <Stack spacing={1}>
                        {mockPurchased.map((it) => (
                          <Box
                            key={it.id}
                            onClick={() => toggleItem(it.id)}
                            sx={{
                              display: 'flex', alignItems: 'center', gap: 1.5,
                              p: 2, border: `1px solid ${form.items.includes(it.id) ? landingTokens.PRIMARY : landingTokens.HAIRLINE}`,
                              cursor: 'pointer',
                              bgcolor: form.items.includes(it.id) ? 'rgba(0,52,104,0.04)' : 'transparent',
                              transition: 'border-color 220ms ease, background-color 220ms ease',
                            }}
                          >
                            <Checkbox
                              checked={form.items.includes(it.id)}
                              onChange={() => toggleItem(it.id)}
                              sx={{ p: 0.5, color: landingTokens.HAIRLINE, '&.Mui-checked': { color: landingTokens.PRIMARY } }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontWeight: 600 }}>{it.name}</Typography>
                              <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED }}>
                                Mua ngày {it.date}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    {/* 3.3 Request type */}
                    <FormControl>
                      <FormLabel sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 18, fontWeight: 600, color: landingTokens.INK, mb: 1.5, '&.Mui-focused': { color: landingTokens.INK } }}>
                        3. Loại yêu cầu
                      </FormLabel>
                      <RadioGroup
                        value={form.type}
                        onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
                        row
                      >
                        {requestTypes.map((t) => (
                          <FormControlLabel
                            key={t.code}
                            value={t.code}
                            control={<Radio sx={{ color: landingTokens.HAIRLINE, '&.Mui-checked': { color: landingTokens.PRIMARY } }} />}
                            label={t.label}
                            sx={{ mr: 3 }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>

                    {/* 3.4 Reason */}
                    <Box>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 18, fontWeight: 600, mb: 1.5 }}>
                        4. Lý do chi tiết
                      </Typography>
                      <TextField
                        fullWidth required multiline rows={4}
                        placeholder="Mô tả tình trạng sản phẩm, lý do đổi/trả…"
                        value={form.reason}
                        onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))}
                        sx={sxSharpInput}
                      />
                    </Box>

                    {/* 3.5 Upload (placeholder) */}
                    <Box>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 18, fontWeight: 600, mb: 1.5 }}>
                        5. Ảnh sản phẩm
                      </Typography>
                      <Box sx={{
                        border: `1px dashed ${landingTokens.HAIRLINE}`,
                        p: 4, textAlign: 'center', bgcolor: landingTokens.NEUTRAL_SOFT,
                        cursor: 'pointer',
                        transition: 'border-color 220ms ease',
                        '&:hover': { borderColor: landingTokens.GOLD },
                      }}>
                        <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: landingTokens.PRIMARY, mb: 1 }} />
                        <Typography sx={{ fontWeight: 600 }}>Kéo thả hoặc bấm để tải ảnh</Typography>
                        <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, display: 'block', mt: 0.5 }}>
                          Tối đa 5 ảnh, mỗi ảnh dưới 5MB
                        </Typography>
                      </Box>
                    </Box>

                    {/* 3.6 Contact */}
                    <Box>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 18, fontWeight: 600, mb: 2 }}>
                        6. Thông tin liên hệ
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth required label="Họ và tên"
                            value={form.contactName}
                            onChange={(e) => setForm((s) => ({ ...s, contactName: e.target.value }))}
                            sx={sxSharpInput}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth required type="tel" label="SĐT liên hệ"
                            value={form.contactPhone}
                            onChange={(e) => setForm((s) => ({ ...s, contactPhone: e.target.value }))}
                            sx={sxSharpInput}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth type="email" label="Email"
                            value={form.contactEmail}
                            onChange={(e) => setForm((s) => ({ ...s, contactEmail: e.target.value }))}
                            sx={sxSharpInput}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Alert severity="info" sx={{ borderRadius: 1 }}>
                      Thông tin chỉ dùng để xử lý yêu cầu. PNJ cam kết bảo mật theo chính sách riêng tư.
                    </Alert>

                    <Box sx={{ textAlign: 'right' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={sxSharpBtnContained}
                        endIcon={<ArrowForwardIcon />}
                      >
                        Gửi yêu cầu
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              )}
            </Grid>

            {/* FAQ sidebar sticky */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
                <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
                  HỎI ĐÁP NHANH
                </Typography>
                <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 22, fontWeight: 600, mt: 1, mb: 2.5 }}>
                  Câu hỏi thường gặp
                </Typography>
                <Stack spacing={1}>
                  {faqs.map((f, i) => (
                    <Accordion
                      key={f.q}
                      defaultExpanded={i === 0}
                      disableGutters
                      elevation={0}
                      sx={{ border: `1px solid ${landingTokens.HAIRLINE}`, '&:before': { display: 'none' }, bgcolor: landingTokens.SURFACE }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: landingTokens.PRIMARY }} />} sx={{ px: 2 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{f.q}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 2, pt: 0 }}>
                        <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.7 }}>
                          {f.a}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </LazyMotion>
  );
}
