'use client';

import Link from 'next/link';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DiamondIcon from '@mui/icons-material/Diamond';
import DrawIcon from '@mui/icons-material/Draw';
import EditNoteIcon from '@mui/icons-material/EditNote';
import HandymanIcon from '@mui/icons-material/Handyman';
import StraightenIcon from '@mui/icons-material/Straighten';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { landingTokens, sxSharpBtnContained } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn, slideUp, staggerContainer } from 'src/views/admin/_shared/motion';

const services = [
  { slug: 'thu-doi-vang', icon: AutorenewIcon, title: 'Thu đổi vàng', desc: 'Thu đổi vàng cũ các tuổi, định giá minh bạch theo giá niêm yết mỗi ngày.' },
  { slug: 'bao-hanh', icon: VerifiedUserIcon, title: 'Bảo hành trọn đời', desc: 'Đánh bóng, làm mới và kiểm tra miễn phí cho trang sức PNJ, không giới hạn thời gian.' },
  { slug: 'kiem-dinh-kim-cuong', icon: DiamondIcon, title: 'Kiểm định kim cương', desc: 'Giám định 4C, cấp giấy chứng nhận theo chuẩn GIA tại trung tâm kiểm định PNJLab.' },
  { slug: 'gia-cong', icon: HandymanIcon, title: 'Gia công theo yêu cầu', desc: 'Thiết kế và chế tác trang sức riêng từ bản phác thảo đến thành phẩm hoàn thiện.' },
  { slug: 'khac-chu', icon: DrawIcon, title: 'Khắc chữ', desc: 'Khắc tên, ngày kỷ niệm hoặc thông điệp cá nhân bằng máy khắc laser chính xác.' },
  { slug: 'sua-chua', icon: EditNoteIcon, title: 'Sửa chữa trang sức', desc: 'Nong rộng, thu nhỏ size, hàn nối, thay móc và phục hồi trang sức cũ về như mới.' },
  { slug: 'do-size', icon: StraightenIcon, title: 'Đo size nhẫn/vòng', desc: 'Đo size miễn phí tại cửa hàng, tư vấn chọn size phù hợp cho bạn và người thân.' },
];

const commitments = [
  { title: 'Chất lượng 99.99%', desc: 'Vàng nguyên liệu kiểm định tuổi bằng máy quang phổ, công bố rõ ràng trên tem sản phẩm.' },
  { title: 'Minh bạch giá', desc: 'Niêm yết công khai giá mua – giá bán vàng và tiền công chế tác, không phát sinh phụ phí.' },
  { title: 'Bảo hành trọn đời', desc: 'Toàn bộ trang sức PNJ được đánh bóng, làm mới và kiểm tra định kỳ miễn phí.' },
  { title: 'Đổi mới trong 7 ngày', desc: 'Đổi sản phẩm mới trong 7 ngày nếu phát sinh lỗi kỹ thuật từ nhà sản xuất.' },
];

const steps = [
  { no: '01', title: 'Chọn dịch vụ', desc: 'Lựa chọn dịch vụ bạn cần và tham khảo thông tin chi phí, thời gian xử lý.' },
  { no: '02', title: 'Đặt lịch', desc: 'Đăng ký lịch hẹn trực tuyến hoặc gọi hotline 1900 54 54 57 để được tư vấn.' },
  { no: '03', title: 'Đến cửa hàng', desc: 'Mang trang sức đến cửa hàng PNJ gần nhất đúng ngày giờ đã đặt lịch.' },
  { no: '04', title: 'Nhận kết quả', desc: 'Nhận lại trang sức hoặc kết quả kiểm định cùng phiếu bảo hành chính hãng.' },
];

const faqs = [
  { q: 'Tôi có cần đặt lịch trước khi đến cửa hàng không?', a: 'Việc đặt lịch trước giúp bạn được phục vụ nhanh hơn và tránh thời gian chờ, nhưng khách hàng vẫn có thể đến trực tiếp bất kỳ cửa hàng PNJ nào trong giờ làm việc.' },
  { q: 'Bảo hành trọn đời áp dụng cho sản phẩm nào?', a: 'Tất cả trang sức do PNJ sản xuất đều được bảo hành trọn đời, bao gồm đánh bóng, làm mới và kiểm tra định kỳ miễn phí tại hệ thống hơn 400 cửa hàng.' },
  { q: 'Thu đổi vàng cũ có bị trừ phần trăm hao hụt không?', a: 'PNJ công bố tỷ lệ thu đổi minh bạch tại quầy. Đối với vàng mua tại PNJ còn đủ bao bì và phiếu bảo hành, mức thu đổi ưu đãi hơn so với vàng không rõ nguồn gốc.' },
  { q: 'Thời gian kiểm định kim cương mất bao lâu?', a: 'Kiểm định nhanh tại quầy mất khoảng 15 – 30 phút. Giấy chứng nhận PNJLab được cấp trong 1 – 3 ngày làm việc tuỳ theo số lượng viên cần giám định.' },
  { q: 'Tôi có thể gia công trang sức theo bản thiết kế riêng không?', a: 'Có. Bạn có thể gửi hình ảnh, phác thảo hoặc mô tả ý tưởng. Đội ngũ thiết kế sẽ dựng 3D và báo giá trước khi tiến hành chế tác.' },
];

export function ServiceHubView() {
  return (
    <LazyMotion features={domAnimation}>
      {/* Hero */}
      <Box sx={{ position: 'relative', bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 10, md: 16 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 70% 30%, ${landingTokens.PRIMARY_LIGHT}22, transparent 60%)` }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative' }}>
          <m.div initial="hidden" animate="show" variants={staggerContainer(0.1)}>
            <m.div variants={fadeIn}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
                DỊCH VỤ PNJ
              </Typography>
            </m.div>
            <m.div variants={slideUp}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 36, md: 60 }, fontWeight: 600, lineHeight: 1.1, maxWidth: 900, mb: 3 }}>
                Chăm sóc trọn vòng đời<br />trang sức của bạn
              </Typography>
            </m.div>
            <m.div variants={fadeIn}>
              <Typography sx={{ color: '#E8DFD4', opacity: 0.85, fontSize: { xs: 16, md: 18 }, maxWidth: 640, lineHeight: 1.7, mb: 4 }}>
                Từ gia công theo yêu cầu, kiểm định kim cương đến bảo hành trọn đời — PNJ đồng hành
                cùng bạn trên hành trình giữ gìn vẻ đẹp cho từng món trang sức.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component="a" href="#services" variant="contained" size="large" sx={sxSharpBtnContained} endIcon={<ArrowForwardIcon />}>
                  Khám phá dịch vụ
                </Button>
                <Button
                  component="a"
                  href="tel:19005457"
                  variant="outlined"
                  size="large"
                  sx={{ borderRadius: 0, textTransform: 'none', fontWeight: 600, color: '#FBF7F2', borderColor: '#FBF7F2', '&:hover': { color: landingTokens.GOLD, borderColor: landingTokens.GOLD } }}
                >
                  Hotline 1900 54 54 57
                </Button>
              </Stack>
            </m.div>
          </m.div>
        </Container>
      </Box>

      {/* Service cards */}
      <Container id="services" maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            7 DỊCH VỤ CHUYÊN BIỆT
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
            Mọi nhu cầu về trang sức,<br />trong một nơi
          </Typography>
        </Box>

        <m.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer(0.08)}>
          <Grid container spacing={{ xs: 3, md: 3 }}>
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Grid key={s.slug} size={{ xs: 12, sm: 6, md: 3 }}>
                  <m.div variants={slideUp} style={{ height: '100%' }}>
                    <Box
                      component={Link}
                      href={`/dich-vu/${s.slug}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        p: 4,
                        bgcolor: landingTokens.SURFACE,
                        border: `1px solid ${landingTokens.HAIRLINE}`,
                        textDecoration: 'none',
                        color: landingTokens.INK,
                        transition: 'border-color 220ms ease, transform 220ms ease',
                        '&:hover': { borderColor: landingTokens.GOLD, transform: 'translateY(-4px)' },
                        '&:hover .svc-arrow': { color: landingTokens.GOLD, transform: 'translateX(4px)' },
                      }}
                    >
                      <Icon sx={{ fontSize: 40, color: landingTokens.GOLD, mb: 2.5 }} />
                      <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 20, fontWeight: 600, mb: 1.5 }}>
                        {s.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.7, mb: 3, flexGrow: 1 }}>
                        {s.desc}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: landingTokens.PRIMARY, fontWeight: 600, fontSize: 14 }}>
                        <span>Xem chi tiết</span>
                        <ArrowForwardIcon className="svc-arrow" sx={{ fontSize: 16, transition: 'transform 220ms ease, color 220ms ease' }} />
                      </Stack>
                    </Box>
                  </m.div>
                </Grid>
              );
            })}
          </Grid>
        </m.div>
      </Container>

      {/* Commitments */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              CAM KẾT PNJ
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
              Lời hứa với khách hàng
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {commitments.map((c, i) => (
              <Grid key={c.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <m.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
                >
                  <Box sx={{ p: 4, bgcolor: landingTokens.SURFACE, borderTop: `2px solid ${landingTokens.GOLD}`, height: '100%' }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 32, color: landingTokens.PRIMARY, mb: 2 }} />
                    <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 20, fontWeight: 600, mb: 1.5 }}>
                      {c.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75 }}>
                      {c.desc}
                    </Typography>
                  </Box>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Process */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            QUY TRÌNH ĐĂNG KÝ
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
            Nhanh gọn trong 4 bước
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
                  <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 48, fontWeight: 600, color: landingTokens.GOLD, lineHeight: 1, mb: 2 }}>
                    {s.no}
                  </Typography>
                  <Typography variant="h6" sx={{ fontFamily: landingTokens.FONT_SERIF, fontWeight: 500, mb: 1.5 }}>
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

      {/* FAQ */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth="md">
          <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              CÂU HỎI THƯỜNG GẶP
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 40 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
              Giải đáp về dịch vụ PNJ
            </Typography>
          </Box>

          <Box>
            {faqs.map((it, i) => (
              <Accordion
                key={i}
                elevation={0}
                disableGutters
                square
                sx={{ bgcolor: 'transparent', borderBottom: `1px solid ${landingTokens.HAIRLINE}`, '&:before': { display: 'none' } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, py: 1.5 }}>
                  <Typography sx={{ fontWeight: 600 }}>{it.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pb: 2.5 }}>
                  <Typography sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.8 }}>{it.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          <Box sx={{ mt: 8, p: { xs: 4, md: 6 }, textAlign: 'center', bgcolor: landingTokens.INK, color: '#FBF7F2' }}>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 24, md: 32 }, color: landingTokens.GOLD, mb: 2 }}>
              Cần tư vấn thêm?
            </Typography>
            <Typography sx={{ color: '#E8DFD4', opacity: 0.85, mb: 3, maxWidth: 480, mx: 'auto' }}>
              Đội ngũ chuyên viên PNJ sẵn sàng hỗ trợ bạn qua hotline hoặc tại hệ thống cửa hàng toàn quốc.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button component={Link} href="/contact" variant="contained" size="large" sx={sxSharpBtnContained}>
                Liên hệ ngay
              </Button>
              <Button
                component={Link}
                href="/stores"
                variant="outlined"
                size="large"
                sx={{ borderRadius: 0, textTransform: 'none', fontWeight: 600, color: '#FBF7F2', borderColor: '#FBF7F2', '&:hover': { color: landingTokens.GOLD, borderColor: landingTokens.GOLD } }}
              >
                Tìm cửa hàng
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </LazyMotion>
  );
}
