'use client';

import { useState } from 'react';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import StraightenIcon from '@mui/icons-material/Straighten';

import { landingTokens, sxSharpBtnContained, sxSharpBtnOutlined } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn, slideUp, staggerContainer } from 'src/views/admin/_shared/motion';

// Ring sizes 7-24 (VN system): diameter(mm), circumference(mm)
const ringSizes = Array.from({ length: 18 }, (_, i) => {
  const size = 7 + i;
  const dia = 14.1 + i * 0.4;
  return { size, dia: dia.toFixed(1), cir: (dia * Math.PI).toFixed(1) };
});

const braceletSizes = [
  { size: 'XS', cir: '14 – 15 cm' },
  { size: 'S',  cir: '15 – 16 cm' },
  { size: 'M',  cir: '16 – 17 cm' },
  { size: 'L',  cir: '17 – 18 cm' },
  { size: 'XL', cir: '18 – 19 cm' },
];

const necklaceSizes = [
  { length: '40 cm', name: 'Choker',  pos: 'Ôm sát cổ' },
  { length: '45 cm', name: 'Princess', pos: 'Xương đòn' },
  { length: '50 cm', name: 'Matinee',  pos: 'Dưới xương đòn' },
  { length: '60 cm', name: 'Opera',    pos: 'Chạm ngực' },
  { length: '70 cm', name: 'Long',     pos: 'Dưới ngực' },
];

const ankletSizes = [
  { size: 'M',  cir: '22 – 23 cm' },
  { size: 'L',  cir: '23 – 24 cm' },
  { size: 'XL', cir: '24 – 26 cm' },
];

const ringMethods = [
  { title: 'Dùng sợi chỉ', desc: 'Quấn 1 vòng quanh ngón tay, đánh dấu điểm giao và đo độ dài bằng thước mm — đây là chu vi ngón tay.' },
  { title: 'Dùng nhẫn cũ', desc: 'Lấy chiếc nhẫn vừa tay, đo đường kính trong bằng thước mm. So với bảng size để tìm số tương ứng.' },
  { title: 'Dùng size chuẩn PNJ', desc: 'Đặt bộ đo size miễn phí tại cửa hàng PNJ gần nhất, nhân viên sẽ hỗ trợ trong 5 phút.' },
];

const tips = [
  { title: 'Đo vào cuối ngày', desc: 'Kích thước ngón tay thường lớn hơn vào cuối ngày, tránh đo buổi sáng khi vừa thức dậy.' },
  { title: 'Khi trời ấm', desc: 'Nhiệt độ lạnh khiến ngón tay co lại. Chọn thời điểm nhiệt độ bình thường để đo chính xác.' },
  { title: 'Chọn size thoải mái', desc: 'Nhẫn nên vừa khít nhưng dễ tháo. Nếu khó phân vân, chọn size lớn hơn một bậc.' },
];

function TabPanel({ value, index, children }) {
  return value === index ? <Box sx={{ pt: { xs: 4, md: 6 } }}>{children}</Box> : null;
}

export function SizeGuideView() {
  const [tab, setTab] = useState(0);

  return (
    <LazyMotion features={domAnimation}>
      {/* 1. Hero */}
      <Box sx={{ position: 'relative', bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', py: { xs: 9, md: 14 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 75% 25%, ${landingTokens.GOLD}22, transparent 60%)` }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative' }}>
          <m.div initial="hidden" animate="show" variants={staggerContainer(0.1)}>
            <m.div variants={fadeIn}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
                HƯỚNG DẪN
              </Typography>
            </m.div>
            <m.div variants={slideUp}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 32, md: 56 }, fontWeight: 600, lineHeight: 1.1, maxWidth: 820, mb: 2 }}>
                Hướng dẫn chọn size chính xác
              </Typography>
            </m.div>
            <m.div variants={fadeIn}>
              <Typography sx={{ color: '#E8DFD4', opacity: 0.85, fontSize: { xs: 15, md: 17 }, maxWidth: 620, lineHeight: 1.7 }}>
                Một chút cẩn trọng khi đo size giúp trang sức luôn vừa vặn và thoải mái.
                Hướng dẫn chi tiết cho nhẫn, vòng tay, dây chuyền và lắc chân từ chuyên gia PNJ.
              </Typography>
            </m.div>
          </m.div>
        </Container>
      </Box>

      {/* 2. Tabs */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 6, md: 10 } }}>
        <Box sx={{ borderBottom: `1px solid ${landingTokens.HAIRLINE}` }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: 16, color: landingTokens.INK_MUTED, px: 3 },
              '& .Mui-selected': { color: `${landingTokens.PRIMARY} !important` },
              '& .MuiTabs-indicator': { bgcolor: landingTokens.GOLD, height: 3 },
            }}
          >
            <Tab label="Nhẫn" />
            <Tab label="Vòng tay" />
            <Tab label="Dây chuyền" />
            <Tab label="Lắc" />
          </Tabs>
        </Box>

        {/* RING */}
        <TabPanel value={tab} index={0}>
          <Grid container spacing={{ xs: 4, md: 5 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
                3 CÁCH ĐO
              </Typography>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 24, md: 32 }, fontWeight: 600, mt: 1, mb: 3 }}>
                Chọn cách phù hợp với bạn
              </Typography>
              <Stack spacing={2.5}>
                {ringMethods.map((m2, i) => (
                  <Stack key={m2.title} direction="row" spacing={2.5}>
                    <Box sx={{ width: 44, height: 44, flexShrink: 0, display: 'grid', placeItems: 'center', bgcolor: landingTokens.PRIMARY, color: '#FFF', fontFamily: landingTokens.FONT_SERIF, fontWeight: 700 }}>
                      {i + 1}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{m2.title}</Typography>
                      <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.7 }}>
                        {m2.desc}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ border: `1px solid ${landingTokens.HAIRLINE}`, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', px: 3, py: 2 }}>
                  <Typography sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>Bảng size nhẫn chuẩn PNJ</Typography>
                </Box>
                <Box sx={{ maxHeight: 440, overflowY: 'auto' }}>
                  <Grid container sx={{ p: 2, borderBottom: `1px solid ${landingTokens.HAIRLINE}`, bgcolor: landingTokens.NEUTRAL_SOFT }}>
                    <Grid size={{ xs: 4 }}><Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em', color: landingTokens.INK }}>SIZE</Typography></Grid>
                    <Grid size={{ xs: 4 }}><Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em', color: landingTokens.INK }}>ĐƯỜNG KÍNH</Typography></Grid>
                    <Grid size={{ xs: 4 }}><Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em', color: landingTokens.INK }}>CHU VI</Typography></Grid>
                  </Grid>
                  {ringSizes.map((r, i) => (
                    <Grid key={r.size} container sx={{ p: 2, borderBottom: `1px solid ${landingTokens.HAIRLINE}`, bgcolor: i % 2 ? landingTokens.SURFACE : 'rgba(0,52,104,0.02)' }}>
                      <Grid size={{ xs: 4 }}>
                        <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 18, fontWeight: 700, color: landingTokens.PRIMARY }}>
                          {r.size}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}><Typography variant="body2">{r.dia} mm</Typography></Grid>
                      <Grid size={{ xs: 4 }}><Typography variant="body2">{r.cir} mm</Typography></Grid>
                    </Grid>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* BRACELET */}
        <TabPanel value={tab} index={1}>
          <Grid container spacing={{ xs: 4, md: 5 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
                CÁCH ĐO
              </Typography>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 24, md: 32 }, fontWeight: 600, mt: 1, mb: 3 }}>
                Đo chu vi cổ tay
              </Typography>
              <Typography sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.85, mb: 2.5 }}>
                Dùng thước dây mềm quấn quanh cổ tay (ngay dưới xương cổ tay) một vòng, không kéo căng.
                Số đo thu được là chu vi cổ tay — cộng thêm 1–2 cm để vòng có độ rủ thoải mái.
              </Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}><strong style={{ color: landingTokens.PRIMARY }}>+1 cm</strong> · vòng ôm sát</Typography>
                <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}><strong style={{ color: landingTokens.PRIMARY }}>+2 cm</strong> · vòng thoải mái</Typography>
                <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}><strong style={{ color: landingTokens.PRIMARY }}>+3 cm</strong> · vòng rủ, hợp charm</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ border: `1px solid ${landingTokens.HAIRLINE}` }}>
                <Box sx={{ bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', px: 3, py: 2 }}>
                  <Typography sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>Bảng size vòng tay</Typography>
                </Box>
                {braceletSizes.map((b, i) => (
                  <Grid key={b.size} container sx={{ p: 2.5, borderTop: `1px solid ${landingTokens.HAIRLINE}`, bgcolor: i % 2 ? landingTokens.SURFACE : 'rgba(0,52,104,0.02)' }}>
                    <Grid size={{ xs: 4 }}>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 20, fontWeight: 700, color: landingTokens.PRIMARY }}>
                        {b.size}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography sx={{ color: landingTokens.INK }}>{b.cir}</Typography>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* NECKLACE */}
        <TabPanel value={tab} index={2}>
          <Grid container spacing={{ xs: 4, md: 5 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
                ĐỘ DÀI DÂY CHUYỀN
              </Typography>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 24, md: 32 }, fontWeight: 600, mt: 1, mb: 3 }}>
                Mỗi độ dài — một phong cách
              </Typography>
              <Typography sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.85 }}>
                Từ choker ôm cổ 40 cm đến long 70 cm chạm xuống dưới ngực. Tham khảo vị trí tương ứng
                trong bảng bên dưới để chọn chiều dài phù hợp phong cách của bạn.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={2}>
                {necklaceSizes.map((n) => (
                  <Stack key={n.length} direction="row" alignItems="center" spacing={3} sx={{ p: 2.5, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, borderLeft: `3px solid ${landingTokens.GOLD}` }}>
                    <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 24, fontWeight: 700, color: landingTokens.PRIMARY, minWidth: 90 }}>
                      {n.length}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 600 }}>{n.name}</Typography>
                      <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>{n.pos}</Typography>
                    </Box>
                    <Box sx={{ width: { xs: 60, md: 120 }, height: 8, bgcolor: landingTokens.NEUTRAL_SOFT, position: 'relative', overflow: 'hidden' }}>
                      <Box sx={{ position: 'absolute', inset: 0, width: `${(parseInt(n.length, 10) - 30) * 2.5}%`, bgcolor: landingTokens.GOLD }} />
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* ANKLET */}
        <TabPanel value={tab} index={3}>
          <Grid container spacing={{ xs: 4, md: 5 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
                CÁCH ĐO
              </Typography>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 24, md: 32 }, fontWeight: 600, mt: 1, mb: 3 }}>
                Đo chu vi cổ chân
              </Typography>
              <Typography sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.85 }}>
                Quấn thước dây quanh phần nhỏ nhất của cổ chân, phía trên mắt cá. Lắc chân nên có
                độ rủ nhẹ 1–2 cm so với chu vi thực tế để thoải mái khi di chuyển.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ border: `1px solid ${landingTokens.HAIRLINE}` }}>
                <Box sx={{ bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', px: 3, py: 2 }}>
                  <Typography sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>Bảng size lắc chân</Typography>
                </Box>
                {ankletSizes.map((a, i) => (
                  <Grid key={a.size} container sx={{ p: 2.5, borderTop: `1px solid ${landingTokens.HAIRLINE}`, bgcolor: i % 2 ? landingTokens.SURFACE : 'rgba(0,52,104,0.02)' }}>
                    <Grid size={{ xs: 4 }}>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 20, fontWeight: 700, color: landingTokens.PRIMARY }}>
                        {a.size}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                      <Typography sx={{ color: landingTokens.INK }}>{a.cir}</Typography>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Container>

      {/* 3. Tools */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: { xs: 3.5, md: 5 }, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, borderTop: `3px solid ${landingTokens.GOLD}`, height: '100%' }}>
                <PrintOutlinedIcon sx={{ fontSize: 44, color: landingTokens.PRIMARY, mb: 2 }} />
                <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 22, md: 28 }, fontWeight: 600, mb: 1.5 }}>
                  In bảng size chuẩn
                </Typography>
                <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75, mb: 3 }}>
                  Tải và in bảng đo size nhẫn tỉ lệ 1:1 để đối chiếu nhẫn cũ hoặc đo ngón tay ngay tại nhà.
                </Typography>
                <Button
                  variant="contained"
                  sx={sxSharpBtnContained}
                  startIcon={<PrintOutlinedIcon />}
                  onClick={() => window.print()}
                >
                  Tải bảng size PDF
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: { xs: 3.5, md: 5 }, bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', borderTop: `3px solid ${landingTokens.GOLD}`, height: '100%' }}>
                <SupportAgentOutlinedIcon sx={{ fontSize: 44, color: landingTokens.GOLD, mb: 2 }} />
                <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 22, md: 28 }, fontWeight: 600, mb: 1.5, color: '#FBF7F2' }}>
                  Đến cửa hàng đo size
                </Typography>
                <Typography variant="body2" sx={{ color: '#E8DFD4', opacity: 0.85, lineHeight: 1.75, mb: 3 }}>
                  Cần tư vấn trực tiếp? Đặt lịch với dịch vụ đo size miễn phí tại hơn 400 cửa hàng PNJ toàn quốc.
                </Typography>
                <Button
                  component={Link}
                  href="/dich-vu/do-size"
                  variant="outlined"
                  sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600, px: 3.5, py: 1.5, color: '#FBF7F2', borderColor: '#FBF7F2', '&:hover': { color: landingTokens.GOLD, borderColor: landingTokens.GOLD } }}
                  startIcon={<StraightenIcon />}
                  endIcon={<ArrowForwardIcon />}
                >
                  Đặt lịch đo size
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. Tips */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 12 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            LƯU Ý
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
            3 mẹo chọn size chuẩn
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 3, md: 3 }}>
          {tips.map((t) => (
            <Grid key={t.title} size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={2} sx={{ p: 3.5, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, height: '100%' }}>
                <LightbulbOutlinedIcon sx={{ fontSize: 28, color: landingTokens.GOLD, flexShrink: 0, mt: 0.5 }} />
                <Box>
                  <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 18, fontWeight: 600, mb: 1 }}>
                    {t.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75 }}>
                    {t.desc}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </LazyMotion>
  );
}
