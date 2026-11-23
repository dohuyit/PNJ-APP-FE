'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DownloadIcon from '@mui/icons-material/Download';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';

import { landingTokens, sxSharpBtnContained, sxSharpBtnOutlined } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn, slideUp, staggerContainer } from 'src/views/admin/_shared/motion';

const kpis = [
  { label: 'Doanh thu 2024', value: '31,000', unit: 'tỷ đồng', delta: '+12.4%' },
  { label: 'Lợi nhuận sau thuế', value: '1,800', unit: 'tỷ đồng', delta: '+8.1%' },
  { label: 'EPS', value: '5,200', unit: 'VNĐ/CP', delta: '+6.3%' },
  { label: 'ROE', value: '24.5', unit: '%', delta: '+1.2 đ' },
];

const reports = [
  { year: 2024, title: 'Báo cáo thường niên 2024', size: '8.2 MB' },
  { year: 2023, title: 'Báo cáo thường niên 2023', size: '7.6 MB' },
  { year: 2022, title: 'Báo cáo thường niên 2022', size: '6.9 MB' },
  { year: 2021, title: 'Báo cáo thường niên 2021', size: '6.1 MB' },
  { year: 2020, title: 'Báo cáo thường niên 2020', size: '5.4 MB' },
];

const notices = [
  { date: '18/03/2025', tag: 'ĐHCĐ', title: 'Thông báo mời họp Đại hội đồng cổ đông thường niên 2025' },
  { date: '28/02/2025', tag: 'Cổ tức', title: 'Quyết định chi trả cổ tức Q4/2024 bằng tiền mặt — tỷ lệ 8%' },
  { date: '15/02/2025', tag: 'Tài chính', title: 'Công bố Báo cáo tài chính hợp nhất Q4/2024 đã soát xét' },
  { date: '20/01/2025', tag: 'Giao dịch', title: 'Thông báo giao dịch cổ phiếu của người nội bộ và người liên quan' },
  { date: '05/01/2025', tag: 'Quản trị', title: 'Quyết định bổ nhiệm nhân sự Hội đồng Quản trị nhiệm kỳ 2025–2030' },
];

const shareholders = [
  { label: 'Cổ đông lớn', value: 40, color: '#003468' },
  { label: 'Cổ đông nước ngoài', value: 30, color: '#C48C46' },
  { label: 'Cổ đông cá nhân', value: 25, color: '#2C5D9A' },
  { label: 'Khác', value: 5, color: '#8A6A2F' },
];

// Sparkline: 30 days — deterministic pseudo-random walk anchored to 95,000.
const sparkPoints = (() => {
  const seed = [0, 8, 12, 6, 14, 20, 16, 22, 18, 26, 30, 24, 34, 28, 36, 40, 32, 38, 42, 36, 46, 50, 44, 52, 48, 56, 60, 54, 62, 66];
  const base = 92;
  return seed.map((v, i) => ({ x: i, y: base + v * 0.15 }));
})();

function Sparkline({ points }) {
  const w = 320;
  const h = 72;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const nx = (x) => (x / (xs.length - 1)) * w;
  const ny = (y) => h - ((y - minY) / (maxY - minY || 1)) * h;
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${nx(p.x).toFixed(1)} ${ny(p.y).toFixed(1)}`).join(' ');
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <path d={area} fill={landingTokens.GOLD} opacity="0.12" />
      <path d={d} fill="none" stroke={landingTokens.GOLD} strokeWidth="2" />
    </svg>
  );
}

function Donut({ segments, size = 220 }) {
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={landingTokens.NEUTRAL_SOFT} strokeWidth="18" />
      {segments.map((s) => {
        const len = (s.value / 100) * c;
        const el = (
          <circle
            key={s.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="18"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-acc}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        acc += len;
        return el;
      })}
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        style={{ fontSize: 14, fill: landingTokens.INK_MUTED, letterSpacing: '0.1em' }}
      >
        TỔNG
      </text>
      <text
        x="50%"
        y="60%"
        textAnchor="middle"
        style={{ fontSize: 22, fontWeight: 700, fill: landingTokens.PRIMARY }}
      >
        100%
      </text>
    </svg>
  );
}

export function InvestorView() {
  const notice5 = useMemo(() => notices.slice(0, 5), []);

  return (
    <LazyMotion features={domAnimation}>
      {/* 1. Hero */}
      <Box sx={{ position: 'relative', bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', py: { xs: 10, md: 16 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 80% 20%, ${landingTokens.GOLD}22, transparent 60%)` }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative' }}>
          <m.div initial="hidden" animate="show" variants={staggerContainer(0.1)}>
            <m.div variants={fadeIn}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
                QUAN HỆ CỔ ĐÔNG
              </Typography>
            </m.div>
            <m.div variants={slideUp}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 36, md: 60 }, fontWeight: 600, lineHeight: 1.1, maxWidth: 900, mb: 3 }}>
                Quan hệ cổ đông PNJ<br />— Minh bạch · Bền vững
              </Typography>
            </m.div>
            <m.div variants={fadeIn}>
              <Typography sx={{ color: '#E8DFD4', opacity: 0.85, fontSize: { xs: 16, md: 18 }, maxWidth: 640, lineHeight: 1.7, mb: 4 }}>
                Cam kết công bố thông tin đầy đủ, kịp thời và chính xác — đồng hành cùng cổ đông
                trên hành trình tăng trưởng dài hạn của PNJ trong suốt hơn ba thập kỷ.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component="a" href="#reports" variant="contained" size="large" sx={sxSharpBtnContained} endIcon={<ArrowForwardIcon />}>
                  Báo cáo thường niên
                </Button>
                <Button
                  component="a"
                  href="#contact-ir"
                  variant="outlined"
                  size="large"
                  sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600, px: 3.5, py: 1.5, color: '#FBF7F2', borderColor: '#FBF7F2', '&:hover': { color: landingTokens.GOLD, borderColor: landingTokens.GOLD } }}
                >
                  Liên hệ IR
                </Button>
              </Stack>
            </m.div>
          </m.div>
        </Container>
      </Box>

      {/* 2. KPI */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            KẾT QUẢ KINH DOANH 2024
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
            Tăng trưởng vững chắc
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {kpis.map((k, i) => (
            <Grid key={k.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <m.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              >
                <Box sx={{ p: 4, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, borderTop: `2px solid ${landingTokens.GOLD}`, height: '100%' }}>
                  <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {k.label}
                  </Typography>
                  <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 32, md: 42 }, fontWeight: 700, color: landingTokens.PRIMARY, mt: 1.5, lineHeight: 1 }}>
                    {k.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, mt: 0.5 }}>
                    {k.unit}
                  </Typography>
                  <Chip
                    label={k.delta}
                    size="small"
                    icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                    sx={{ mt: 2, borderRadius: 0.5, bgcolor: 'rgba(0,52,104,0.06)', color: landingTokens.PRIMARY, fontWeight: 600 }}
                  />
                </Box>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 3. Stock & shareholders */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Grid container spacing={{ xs: 4, md: 5 }}>
            {/* Stock card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: { xs: 3.5, md: 4.5 }, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                  <Box>
                    <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
                      HOSE · PNJ
                    </Typography>
                    <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 24, md: 32 }, fontWeight: 600, mt: 0.5 }}>
                      Mã chứng khoán PNJ
                    </Typography>
                  </Box>
                  <Chip label="LIVE" size="small" sx={{ bgcolor: landingTokens.PRIMARY, color: '#FFF', fontWeight: 700, borderRadius: 0.5 }} />
                </Stack>
                <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mb: 1 }}>
                  <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 40, md: 54 }, fontWeight: 700, color: landingTokens.PRIMARY, lineHeight: 1 }}>
                    95,000
                  </Typography>
                  <Typography sx={{ color: landingTokens.INK_MUTED }}>VNĐ</Typography>
                  <Chip
                    label="+2.1%"
                    size="small"
                    icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                    sx={{ borderRadius: 0.5, bgcolor: 'rgba(32,120,70,0.1)', color: '#1f7a46', fontWeight: 700 }}
                  />
                </Stack>
                <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED }}>
                  Cập nhật phiên 14:45 · 30 ngày gần nhất
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Sparkline points={sparkPoints} />
                </Box>
              </Box>
            </Grid>

            {/* Donut */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: { xs: 3.5, md: 4.5 }, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, height: '100%' }}>
                <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
                  CƠ CẤU CỔ ĐÔNG
                </Typography>
                <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 24, md: 32 }, fontWeight: 600, mt: 0.5, mb: 3 }}>
                  Tỷ lệ sở hữu tại 31/12/2024
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid size={{ xs: 12, sm: 5 }} sx={{ textAlign: 'center' }}>
                    <Donut segments={shareholders} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <Stack spacing={1.5}>
                      {shareholders.map((s) => (
                        <Stack key={s.label} direction="row" alignItems="center" spacing={1.5}>
                          <Box sx={{ width: 12, height: 12, bgcolor: s.color }} />
                          <Typography variant="body2" sx={{ flexGrow: 1, color: landingTokens.INK }}>
                            {s.label}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: landingTokens.PRIMARY }}>
                            {s.value}%
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. Reports */}
      <Container id="reports" maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 12 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            TÀI LIỆU CÔNG BỐ
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
            Báo cáo thường niên 2020–2024
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {reports.map((r) => (
            <Grid key={r.year} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
              <Box
                component="a"
                href="#"
                onClick={(e) => e.preventDefault()}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  p: 3,
                  bgcolor: landingTokens.SURFACE,
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                  transition: 'all 220ms ease',
                  '&:hover': { borderColor: landingTokens.GOLD, transform: 'translateY(-4px)' },
                }}
              >
                <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 32, fontWeight: 700, color: landingTokens.GOLD, lineHeight: 1 }}>
                  {r.year}
                </Typography>
                <Typography sx={{ mt: 1.5, fontWeight: 600, color: landingTokens.INK, minHeight: 48 }}>
                  {r.title}
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${landingTokens.HAIRLINE}` }}>
                  <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED }}>
                    PDF · {r.size}
                  </Typography>
                  <DownloadIcon sx={{ fontSize: 18, color: landingTokens.PRIMARY }} />
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 5. Notices */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL_SOFT, py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              CÔNG BỐ THÔNG TIN
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
              Thông báo quan trọng
            </Typography>
          </Box>
          <Stack spacing={1.5}>
            {notice5.map((n, i) => (
              <m.div
                key={n.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
              >
                <Box
                  component="a"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    p: { xs: 2.5, md: 3 },
                    bgcolor: landingTokens.SURFACE,
                    border: `1px solid ${landingTokens.HAIRLINE}`,
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 200ms ease',
                    '&:hover': { borderLeft: `3px solid ${landingTokens.GOLD}`, pl: { xs: 2.5, md: 3.3 } },
                  }}
                >
                  <NotificationsOutlinedIcon sx={{ color: landingTokens.PRIMARY, fontSize: 24, flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, minWidth: 92, fontWeight: 600 }}>
                    {n.date}
                  </Typography>
                  <Chip label={n.tag} size="small" sx={{ bgcolor: 'rgba(0,52,104,0.08)', color: landingTokens.PRIMARY, borderRadius: 0.5, fontWeight: 600 }} />
                  <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>
                    {n.title}
                  </Typography>
                  <ArrowForwardIcon sx={{ color: landingTokens.PRIMARY, fontSize: 18, display: { xs: 'none', sm: 'block' } }} />
                </Box>
              </m.div>
            ))}
          </Stack>
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button component={Link} href="#" variant="outlined" sx={sxSharpBtnOutlined} endIcon={<ArrowForwardIcon />}>
              Xem toàn bộ công bố
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 6. IR contact */}
      <Box id="contact-ir" sx={{ bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em' }}>
                LIÊN HỆ IR
              </Typography>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, color: landingTokens.GOLD, mt: 1.5, lineHeight: 1.2 }}>
                Chuyên trách quan hệ cổ đông
              </Typography>
              <Typography sx={{ color: '#E8DFD4', opacity: 0.85, mt: 2.5, lineHeight: 1.8 }}>
                Mọi câu hỏi, yêu cầu tài liệu hoặc đăng ký nhận bản tin cổ đông xin gửi về
                Phòng Quan hệ Nhà đầu tư PNJ. Chúng tôi phản hồi trong vòng 2 ngày làm việc.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2.5}>
                {[
                  { icon: EmailOutlinedIcon, label: 'Email', value: 'ir@pnj.com.vn' },
                  { icon: PhoneOutlinedIcon, label: 'Hotline', value: '+84 28 3827 5058' },
                  { icon: PlaceOutlinedIcon, label: 'Địa chỉ', value: '170E Phan Đăng Lưu, P.3, Q. Phú Nhuận, TP. HCM' },
                ].map((it) => {
                  const Icon = it.icon;
                  return (
                    <Stack key={it.label} direction="row" spacing={2.5} alignItems="center" sx={{ p: 2.5, border: `1px solid rgba(196,140,70,0.3)` }}>
                      <Box sx={{ width: 48, height: 48, display: 'grid', placeItems: 'center', bgcolor: 'rgba(196,140,70,0.12)', color: landingTokens.GOLD }}>
                        <Icon />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(251,247,242,0.65)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          {it.label}
                        </Typography>
                        <Typography sx={{ color: '#FBF7F2', fontWeight: 500, mt: 0.3 }}>
                          {it.value}
                        </Typography>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </LazyMotion>
  );
}
