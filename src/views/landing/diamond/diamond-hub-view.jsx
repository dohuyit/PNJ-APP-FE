'use client';

import Link from 'next/link';
import { m, LazyMotion, domAnimation } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SearchIcon from '@mui/icons-material/Search';

import { landingTokens, sxSharpBtnContained, sxSharpBtnOutlined, sxSharpInput, sxSharpCard } from 'src/theme/landing';
import Wireframe from 'src/sections/landing/components/Wireframe';
import { mockCollections } from 'src/mock-data/collections';
import { COLLECTION_IDS } from 'src/mock-data/ids';

// Reuse MY_FIRST_DIAMOND for diamond ring; others hard-labelled per brief.
const diamondCollections = [
  {
    key: 'engagement',
    title: 'Nhẫn cầu hôn',
    desc: 'Khoảnh khắc ngỏ lời, viên kim cương đại diện cho lời hứa trọn đời.',
    href: `/category/collection/${COLLECTION_IDS.MY_FIRST_DIAMOND}`,
  },
  {
    key: 'necklace',
    title: 'Dây chuyền kim cương',
    desc: 'Điểm nhấn tinh tế cho mọi phong cách, từ công sở đến dạ tiệc.',
    href: '/category/type/necklace',
  },
  {
    key: 'earring',
    title: 'Hoa tai kim cương',
    desc: 'Lấp lánh bên gương mặt, tôn lên vẻ đẹp dịu dàng của bạn.',
    href: '/category/type/earring',
  },
];

const fourC = [
  { c: 'Carat', icon: ScaleOutlinedIcon, scale: '0.1 – 5.0 ct', body: 'Trọng lượng viên kim cương. 1 carat = 0.2 gram. Carat càng cao, kim cương càng hiếm.' },
  { c: 'Cut', icon: ContentCutOutlinedIcon, scale: 'Excellent · Very Good · Good', body: 'Giác cắt quyết định độ lấp lánh. Giác cắt chuẩn giúp ánh sáng phản chiếu tối đa.' },
  { c: 'Color', icon: PaletteOutlinedIcon, scale: 'D (không màu) → Z (vàng nhạt)', body: 'Thang màu từ D đến Z. Kim cương D-F được xếp loại không màu, đắt nhất.' },
  { c: 'Clarity', icon: AutoAwesomeOutlinedIcon, scale: 'IF → I3', body: 'Độ tinh khiết. IF (hoàn mỹ), VVS/VS (tạp chất rất nhỏ), SI/I (có tạp chất thấy được).' },
];

const compareRows = [
  { label: 'Nguồn gốc', natural: 'Hình thành tự nhiên trong lòng đất hàng tỷ năm', lab: 'Nuôi cấy trong phòng thí nghiệm 4-8 tuần' },
  { label: 'Giá', natural: 'Cao hơn 30-50%', lab: 'Thấp hơn, dễ sở hữu carat lớn' },
  { label: 'Chứng nhận', natural: 'GIA, IGI, HRD', lab: 'GIA LGR, IGI' },
  { label: 'Giá trị đầu tư', natural: 'Giữ giá, hiếm có', lab: 'Chưa có thị trường thứ cấp ổn định' },
];

const certs = [
  { name: 'GIA', body: 'Gemological Institute of America — tiêu chuẩn vàng toàn cầu.' },
  { name: 'IGI', body: 'International Gemological Institute — mạng lưới kiểm định rộng.' },
  { name: 'HRD', body: 'Hoge Raad voor Diamant — chuẩn châu Âu từ Antwerp.' },
  { name: 'PNJ Lab', body: 'Trung tâm kiểm định PNJ đạt chuẩn quốc tế từ 2015.' },
];

const stores = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function DiamondHubView() {
  return (
    <LazyMotion features={domAnimation}>
      {/* 1. Hero */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '68dvh', md: '80dvh' },
          minHeight: 520,
          overflow: 'hidden',
          bgcolor: landingTokens.PRIMARY_DARK,
          color: '#FBF7F2',
        }}
      >
        {/* IMAGE: hero diamond close-up 1920x900 */}
        <Wireframe label="Hero · Kim cương PNJ · 1920×900" fill sx={{ opacity: 0.5 }} />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${landingTokens.PRIMARY_DARK} 0%, rgba(20,55,101,0.75) 55%, rgba(20,55,101,0.35) 100%)`,
          }}
        />
        <Container
          maxWidth={false}
          sx={{ maxWidth: 1155, position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
        >
          <m.div variants={fadeUp} initial="hidden" animate="show" style={{ maxWidth: 820 }}>
            <Typography
              variant="overline"
              sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}
            >
              KIM CƯƠNG PNJ
            </Typography>
            <Typography
              sx={{
                fontFamily: landingTokens.FONT_SANS,
                fontSize: { xs: 40, md: 72 },
                fontWeight: 600,
                lineHeight: 1.05,
                color: '#FBF7F2',
                mb: 3,
              }}
            >
              Vĩnh cửu<br />từ 1988.
            </Typography>
            <Typography sx={{ fontSize: { xs: 16, md: 18 }, maxWidth: 560, color: 'rgba(251,247,242,0.85)', mb: 4, lineHeight: 1.7 }}>
              Mỗi viên kim cương PNJ đều đạt chứng nhận quốc tế, được chọn lọc từ những mỏ danh tiếng và chế tác bởi nghệ nhân có trên 15 năm kinh nghiệm.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={Link} href="#bst" variant="contained" size="large" sx={sxSharpBtnContained} endIcon={<ArrowForwardIcon />}>
                Khám phá bộ sưu tập
              </Button>
              <Button
                component={Link}
                href="/kim-cuong/4c-la-gi"
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#FBF7F2',
                  borderColor: '#FBF7F2',
                  px: 3.5,
                  py: 1.5,
                  '&:hover': { color: landingTokens.GOLD, borderColor: landingTokens.GOLD, bgcolor: 'rgba(196,140,70,0.08)' },
                }}
              >
                Học 4C kim cương
              </Button>
            </Stack>
          </m.div>
        </Container>
      </Box>

      {/* 2. Stats */}
      <Box sx={{ bgcolor: landingTokens.SURFACE, borderBottom: `1px solid ${landingTokens.HAIRLINE}` }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 5, md: 7 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {[
              { icon: VerifiedOutlinedIcon, n: '100%', t: 'Chứng nhận GIA' },
              { icon: DiamondOutlinedIcon, n: '5000+', t: 'Viên kim cương trong kho' },
              { icon: LocalShippingOutlinedIcon, n: '30 ngày', t: 'Đổi trả không điều kiện' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <Grid key={s.t} size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(0,52,104,0.06)',
                        color: landingTokens.PRIMARY,
                      }}
                    >
                      <Icon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontWeight: 700, fontSize: 28, color: landingTokens.PRIMARY, lineHeight: 1 }}>
                        {s.n}
                      </Typography>
                      <Typography sx={{ color: landingTokens.INK_MUTED, mt: 0.5 }}>{s.t}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* 3. 4C Education */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            HIỂU VỀ KIM CƯƠNG
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
            Bốn tiêu chí 4C
          </Typography>
          <Typography sx={{ color: landingTokens.INK_MUTED, maxWidth: 640, mx: 'auto', mt: 2 }}>
            Carat · Cut · Color · Clarity — ngôn ngữ chung của các viên kim cương trên toàn thế giới.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {fourC.map((item, i) => {
            const Icon = item.icon;
            return (
              <Grid key={item.c} size={{ xs: 12, sm: 6, md: 3 }}>
                <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
                  <Box sx={{ ...sxSharpCard, p: { xs: 3, md: 3.5 }, height: '100%', borderTop: `2px solid ${landingTokens.GOLD}` }}>
                    <Box sx={{ color: landingTokens.PRIMARY, mb: 2 }}>
                      <Icon sx={{ fontSize: 36 }} />
                    </Box>
                    <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: 22, fontWeight: 600, mb: 1 }}>
                      {item.c}
                    </Typography>
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75, mb: 2.5, minHeight: 72 }}>
                      {item.body}
                    </Typography>
                    {/* Scale bar */}
                    <Box
                      sx={{
                        height: 6,
                        bgcolor: landingTokens.NEUTRAL_SOFT,
                        position: 'relative',
                        overflow: 'hidden',
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          width: `${(i + 1) * 22 + 15}%`,
                          background: `linear-gradient(90deg, ${landingTokens.PRIMARY}, ${landingTokens.GOLD})`,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.04em' }}>
                      {item.scale}
                    </Typography>
                  </Box>
                </m.div>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: { xs: 5, md: 6 } }}>
          <Button
            component={Link}
            href="/kim-cuong/4c-la-gi"
            variant="outlined"
            sx={sxSharpBtnOutlined}
            endIcon={<ArrowForwardIcon />}
          >
            Tìm hiểu thêm về 4C
          </Button>
        </Box>
      </Container>

      {/* 4. BST Kim cương */}
      <Box id="bst" sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 5, md: 7 } }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              BỘ SƯU TẬP
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
              Kim cương cho mọi khoảnh khắc
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {diamondCollections.map((c) => (
              <Grid key={c.key} size={{ xs: 12, md: 4 }}>
                <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
                  <Box
                    component={Link}
                    href={c.href}
                    sx={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                      bgcolor: landingTokens.SURFACE,
                      border: `1px solid ${landingTokens.HAIRLINE}`,
                      overflow: 'hidden',
                      transition: 'transform 220ms ease, box-shadow 220ms ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(0,52,104,0.12)' },
                    }}
                  >
                    {/* IMAGE: collection cover 800x1000 for each category */}
                    <Wireframe label={`Ảnh BST · ${c.title} · 800×1000`} aspectRatio="4/5" />
                    <Box sx={{ p: 3.5 }}>
                      <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: 22, fontWeight: 600, mb: 1 }}>
                        {c.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.7, mb: 2 }}>
                        {c.desc}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ color: landingTokens.PRIMARY }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Khám phá</Typography>
                        <ArrowForwardIcon sx={{ fontSize: 16 }} />
                      </Stack>
                    </Box>
                  </Box>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. Natural vs Lab Grown */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            SO SÁNH
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
            Kim cương tự nhiên & Lab Grown
          </Typography>
        </Box>

        <Box sx={{ ...sxSharpCard, overflow: 'hidden' }}>
          <Grid container>
            <Grid size={{ xs: 4 }} sx={{ p: { xs: 2, md: 3 }, bgcolor: landingTokens.NEUTRAL_SOFT }}>
              <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.1em', fontWeight: 700 }}>
                TIÊU CHÍ
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }} sx={{ p: { xs: 2, md: 3 }, bgcolor: landingTokens.PRIMARY, color: '#FBF7F2' }}>
              <Typography sx={{ fontWeight: 700, letterSpacing: '0.04em' }}>Tự nhiên</Typography>
            </Grid>
            <Grid size={{ xs: 4 }} sx={{ p: { xs: 2, md: 3 }, bgcolor: landingTokens.NEUTRAL_SOFT }}>
              <Typography sx={{ fontWeight: 700, color: landingTokens.INK, letterSpacing: '0.04em' }}>Lab Grown</Typography>
            </Grid>
            {compareRows.map((r, idx) => (
              <Grid
                key={r.label}
                container
                size={{ xs: 12 }}
                sx={{ borderTop: `1px solid ${landingTokens.HAIRLINE}`, bgcolor: idx % 2 ? 'transparent' : 'rgba(0,52,104,0.02)' }}
              >
                <Grid size={{ xs: 4 }} sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography sx={{ fontWeight: 600, color: landingTokens.INK }}>{r.label}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }} sx={{ p: { xs: 2, md: 3 }, borderLeft: `1px solid ${landingTokens.HAIRLINE}`, borderRight: `1px solid ${landingTokens.HAIRLINE}` }}>
                  <Typography variant="body2" sx={{ color: landingTokens.INK, lineHeight: 1.7 }}>{r.natural}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }} sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.7 }}>{r.lab}</Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* 6. Certification */}
      <Box sx={{ bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em' }}>
              CAM KẾT CHỨNG NHẬN
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, color: '#FBF7F2' }}>
              Mỗi viên đều có giấy khai sinh
            </Typography>
            <Typography sx={{ maxWidth: 640, mx: 'auto', mt: 2, color: 'rgba(251,247,242,0.75)' }}>
              PNJ chỉ kinh doanh kim cương có chứng nhận từ các tổ chức kiểm định hàng đầu thế giới.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {certs.map((c) => (
              <Grid key={c.name} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 3, border: `1px solid rgba(196,140,70,0.3)`, height: '100%' }}>
                  {/* IMAGE: cert logo 160x80 — replace with real GIA/IGI/HRD/PNJ Lab marks */}
                  <Box
                    sx={{
                      height: 72,
                      display: 'grid',
                      placeItems: 'center',
                      mb: 2,
                      border: `1px solid rgba(196,140,70,0.25)`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: landingTokens.FONT_SANS,
                        fontSize: 26,
                        fontWeight: 700,
                        color: landingTokens.GOLD,
                        letterSpacing: '0.1em',
                      }}
                    >
                      {c.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(251,247,242,0.75)', lineHeight: 1.7 }}>
                    {c.body}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 7. Diamond Search tool */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              CÔNG CỤ TÌM KIM CƯƠNG
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 40 }, fontWeight: 500, mt: 1, lineHeight: 1.2 }}>
              Chọn viên kim cương theo tiêu chí của bạn.
            </Typography>
            <Typography sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.85, mt: 2.5 }}>
              Lọc theo carat, màu sắc, giác cắt và độ tinh khiết. Mỗi viên đều kèm chứng nhận và ảnh thực tế 360°.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ ...sxSharpCard, p: { xs: 3, md: 4 }, borderTop: `3px solid ${landingTokens.GOLD}` }}>
              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Carat</Typography>
                    <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED }}>0.3 – 2.0 ct</Typography>
                  </Stack>
                  <Slider
                    defaultValue={[0.5, 1.2]}
                    min={0.1}
                    max={5}
                    step={0.1}
                    valueLabelDisplay="auto"
                    sx={{ color: landingTokens.PRIMARY }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField select fullWidth label="Màu (Color)" defaultValue="D" sx={sxSharpInput}>
                      {['D', 'E', 'F', 'G', 'H', 'I', 'J'].map((x) => (
                        <MenuItem key={x} value={x}>{x}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField select fullWidth label="Giác cắt (Cut)" defaultValue="EX" sx={sxSharpInput}>
                      {['EX', 'VG', 'G', 'F'].map((x) => (
                        <MenuItem key={x} value={x}>{x}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField select fullWidth label="Tinh khiết (Clarity)" defaultValue="VVS1" sx={sxSharpInput}>
                      {['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'].map((x) => (
                        <MenuItem key={x} value={x}>{x}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Divider />
                <Button
                  component={Link}
                  href="/kim-cuong/tim-vien"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={sxSharpBtnContained}
                  startIcon={<SearchIcon />}
                >
                  Tìm viên kim cương
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* 8. CTA — Expert consultation */}
      <Box sx={{ bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <ShieldOutlinedIcon sx={{ fontSize: 44, color: landingTokens.GOLD, mb: 2 }} />
              <Typography sx={{ fontFamily: landingTokens.FONT_SANS, fontSize: { xs: 28, md: 44 }, color: landingTokens.GOLD, mb: 2, lineHeight: 1.2 }}>
                Hẹn gặp chuyên gia tư vấn kim cương
              </Typography>
              <Typography sx={{ color: 'rgba(251,247,242,0.8)', lineHeight: 1.85, fontSize: 16 }}>
                Chuyên gia PNJ sẽ gọi lại trong 2 giờ làm việc, tư vấn ngân sách, giải thích chứng nhận và đặt lịch xem viên tại cửa hàng gần bạn.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="form"
                onSubmit={(e) => e.preventDefault()}
                sx={{
                  bgcolor: '#FBF7F2',
                  p: { xs: 3, md: 4 },
                  borderTop: `3px solid ${landingTokens.GOLD}`,
                }}
              >
                <Stack spacing={2.5}>
                  <TextField fullWidth label="Họ và tên" sx={sxSharpInput} required />
                  <TextField fullWidth label="Số điện thoại" type="tel" sx={sxSharpInput} required />
                  <TextField select fullWidth label="Cửa hàng mong muốn" defaultValue="" sx={sxSharpInput}>
                    {stores.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </TextField>
                  <Button type="submit" variant="contained" size="large" sx={sxSharpBtnContained} endIcon={<ArrowForwardIcon />}>
                    Đặt lịch tư vấn
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </LazyMotion>
  );
}
