'use client';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

import { landingTokens, sxSharpBtnContained, sxSharpBtnOutlined, sxSharpInput } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn, slideUp, staggerContainer } from 'src/views/admin/_shared/motion';

const values = [
  { icon: TrendingUpIcon, title: 'Phát triển', desc: 'Lộ trình thăng tiến minh bạch, đào tạo liên tục qua PNJ Academy.' },
  { icon: PaymentsOutlinedIcon, title: 'Thu nhập', desc: 'Lương cạnh tranh, thưởng theo hiệu quả, ESOP cho vị trí quản lý.' },
  { icon: FavoriteBorderIcon, title: 'Sức khoẻ', desc: 'Bảo hiểm cao cấp cho nhân viên và người thân, khám sức khỏe định kỳ.' },
  { icon: Groups2OutlinedIcon, title: 'Cộng đồng', desc: 'Cơ hội tham gia chương trình CSR, lan toả giá trị tốt đẹp đến xã hội.' },
  { icon: Diversity3OutlinedIcon, title: 'Văn hoá', desc: 'Môi trường đa dạng, bình đẳng, đề cao sự chính trực và học hỏi.' },
];

const DEPTS = ['Retail', 'Marketing', 'Finance', 'IT', 'HR'];
const LOCS = ['HCM', 'HN', 'DN'];

const jobs = [
  { id: 1, title: 'Tư vấn bán hàng trang sức cao cấp', dept: 'Retail', loc: 'HCM', type: 'Full-time', date: '15/03/2025' },
  { id: 2, title: 'Chuyên viên Marketing Thương hiệu', dept: 'Marketing', loc: 'HCM', type: 'Full-time', date: '12/03/2025' },
  { id: 3, title: 'Kế toán tổng hợp', dept: 'Finance', loc: 'HCM', type: 'Full-time', date: '10/03/2025' },
  { id: 4, title: 'Lập trình viên Fullstack (React · Node)', dept: 'IT', loc: 'HCM', type: 'Full-time', date: '08/03/2025' },
  { id: 5, title: 'Chuyên viên Tuyển dụng', dept: 'HR', loc: 'HN', type: 'Full-time', date: '05/03/2025' },
  { id: 6, title: 'Quản lý cửa hàng khu vực Hà Nội', dept: 'Retail', loc: 'HN', type: 'Full-time', date: '02/03/2025' },
  { id: 7, title: 'Content Creator (video short-form)', dept: 'Marketing', loc: 'HCM', type: 'Part-time', date: '28/02/2025' },
  { id: 8, title: 'Nhân viên tư vấn Đà Nẵng', dept: 'Retail', loc: 'DN', type: 'Part-time', date: '25/02/2025' },
  { id: 9, title: 'Kỹ sư DevOps (AWS · Kubernetes)', dept: 'IT', loc: 'HCM', type: 'Full-time', date: '20/02/2025' },
  { id: 10, title: 'Chuyên viên Phân tích Tài chính', dept: 'Finance', loc: 'HN', type: 'Full-time', date: '18/02/2025' },
];

const benefits = [
  { title: 'BHYT cao cấp', desc: 'Gói bảo hiểm sức khoẻ cho nhân viên và gia đình.' },
  { title: 'Thưởng tháng 13', desc: 'Thưởng tháng 13 và thưởng hiệu quả hàng quý.' },
  { title: 'Đào tạo liên tục', desc: 'Khoá học nội bộ và tài trợ chứng chỉ quốc tế.' },
  { title: 'Company trip', desc: 'Du lịch hàng năm trong nước và quốc tế.' },
  { title: 'Khám sức khỏe', desc: 'Khám sức khỏe tổng quát mỗi năm tại bệnh viện quốc tế.' },
  { title: 'Event văn hoá', desc: 'Year-end party, teambuilding và các sự kiện nội bộ.' },
];

const steps = [
  { no: '01', title: 'Nộp hồ sơ', desc: 'Ứng tuyển online và hoàn thiện CV trên hệ thống PNJ.' },
  { no: '02', title: 'Phỏng vấn HR', desc: 'Trao đổi sơ bộ về định hướng và văn hoá doanh nghiệp.' },
  { no: '03', title: 'Phỏng vấn chuyên môn', desc: 'Gặp trưởng bộ phận, đánh giá năng lực và bài test.' },
  { no: '04', title: 'Offer & Onboarding', desc: 'Nhận offer, ký hợp đồng và chương trình đào tạo hội nhập.' },
];

export function CareerView() {
  const [dept, setDept] = useState('all');
  const [loc, setLoc] = useState('all');
  const [openJob, setOpenJob] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', position: '' });
  const [sent, setSent] = useState(false);

  const filtered = useMemo(
    () => jobs.filter((j) => (dept === 'all' || j.dept === dept) && (loc === 'all' || j.loc === loc)),
    [dept, loc]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSent(true);
  };

  return (
    <LazyMotion features={domAnimation}>
      {/* 1. Hero */}
      <Box sx={{ position: 'relative', bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', py: { xs: 10, md: 16 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 70% 30%, ${landingTokens.GOLD}22, transparent 60%)` }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative' }}>
          <m.div initial="hidden" animate="show" variants={staggerContainer(0.1)}>
            <m.div variants={fadeIn}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
                CƠ HỘI NGHỀ NGHIỆP
              </Typography>
            </m.div>
            <m.div variants={slideUp}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 36, md: 60 }, fontWeight: 600, lineHeight: 1.1, maxWidth: 900, mb: 3 }}>
                Trở thành Người PNJ<br />— Toả sáng sự nghiệp
              </Typography>
            </m.div>
            <m.div variants={fadeIn}>
              <Typography sx={{ color: '#E8DFD4', opacity: 0.85, fontSize: { xs: 16, md: 18 }, maxWidth: 640, lineHeight: 1.7, mb: 4 }}>
                PNJ tin rằng mỗi nhân viên là một viên kim cương — được tôi luyện,
                chế tác và toả sáng theo cách riêng của mình.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component="a" href="#jobs" variant="contained" size="large" sx={sxSharpBtnContained} endIcon={<ArrowForwardIcon />}>
                  Xem vị trí tuyển dụng
                </Button>
                <Button
                  component="a"
                  href="#apply"
                  variant="outlined"
                  size="large"
                  sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600, px: 3.5, py: 1.5, color: '#FBF7F2', borderColor: '#FBF7F2', '&:hover': { color: landingTokens.GOLD, borderColor: landingTokens.GOLD } }}
                >
                  Ứng tuyển nhanh
                </Button>
              </Stack>
            </m.div>
          </m.div>
        </Container>
      </Box>

      {/* 2. 5 values */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            5 GIÁ TRỊ CHO NGƯỜI PNJ
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
            Vì sao chọn PNJ
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 3, md: 3 }}>
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Grid key={v.title} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <m.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
                >
                  <Box sx={{ p: 3.5, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, borderTop: `2px solid ${landingTokens.GOLD}`, height: '100%' }}>
                    <Icon sx={{ fontSize: 36, color: landingTokens.PRIMARY, mb: 2 }} />
                    <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 18, fontWeight: 600, mb: 1 }}>
                      {v.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.7 }}>
                      {v.desc}
                    </Typography>
                  </Box>
                </m.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* 3. Jobs */}
      <Box id="jobs" sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              VỊ TRÍ ĐANG TUYỂN
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
              {filtered.length} cơ hội đang chờ bạn
            </Typography>
          </Box>

          {/* Filters */}
          <Stack spacing={2.5} sx={{ mb: 4 }}>
            <Box>
              <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.1em', fontWeight: 600, display: 'block', mb: 1 }}>
                PHÒNG BAN
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label="Tất cả"
                  onClick={() => setDept('all')}
                  sx={{
                    borderRadius: 0.5,
                    bgcolor: dept === 'all' ? landingTokens.PRIMARY : 'transparent',
                    color: dept === 'all' ? '#FFF' : landingTokens.INK,
                    border: `1px solid ${dept === 'all' ? landingTokens.PRIMARY : landingTokens.HAIRLINE}`,
                    fontWeight: 600,
                  }}
                />
                {DEPTS.map((d) => (
                  <Chip
                    key={d}
                    label={d}
                    onClick={() => setDept(d)}
                    sx={{
                      borderRadius: 0.5,
                      bgcolor: dept === d ? landingTokens.PRIMARY : 'transparent',
                      color: dept === d ? '#FFF' : landingTokens.INK,
                      border: `1px solid ${dept === d ? landingTokens.PRIMARY : landingTokens.HAIRLINE}`,
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, letterSpacing: '0.1em', fontWeight: 600, display: 'block', mb: 1 }}>
                ĐỊA ĐIỂM
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label="Tất cả"
                  onClick={() => setLoc('all')}
                  sx={{
                    borderRadius: 0.5,
                    bgcolor: loc === 'all' ? landingTokens.GOLD : 'transparent',
                    color: loc === 'all' ? '#FFF' : landingTokens.INK,
                    border: `1px solid ${loc === 'all' ? landingTokens.GOLD : landingTokens.HAIRLINE}`,
                    fontWeight: 600,
                  }}
                />
                {LOCS.map((l) => (
                  <Chip
                    key={l}
                    label={l}
                    onClick={() => setLoc(l)}
                    sx={{
                      borderRadius: 0.5,
                      bgcolor: loc === l ? landingTokens.GOLD : 'transparent',
                      color: loc === l ? '#FFF' : landingTokens.INK,
                      border: `1px solid ${loc === l ? landingTokens.GOLD : landingTokens.HAIRLINE}`,
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>

          {/* Job table */}
          <Box sx={{ bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}` }}>
            {/* Header */}
            <Grid container sx={{ p: { xs: 2, md: 2.5 }, bgcolor: landingTokens.PRIMARY_DARK, color: '#FBF7F2', display: { xs: 'none', md: 'flex' } }}>
              <Grid size={{ md: 5 }}><Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>VỊ TRÍ</Typography></Grid>
              <Grid size={{ md: 2 }}><Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>PHÒNG BAN</Typography></Grid>
              <Grid size={{ md: 2 }}><Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>ĐỊA ĐIỂM</Typography></Grid>
              <Grid size={{ md: 1.5 }}><Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>LOẠI</Typography></Grid>
              <Grid size={{ md: 1.5 }}><Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>NGÀY</Typography></Grid>
            </Grid>
            {filtered.length === 0 && (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography sx={{ color: landingTokens.INK_MUTED }}>Không có vị trí phù hợp. Hãy đổi bộ lọc.</Typography>
              </Box>
            )}
            {filtered.map((j) => (
              <Grid
                key={j.id}
                container
                onClick={() => setOpenJob(j)}
                sx={{
                  p: { xs: 2.5, md: 2.5 },
                  borderTop: `1px solid ${landingTokens.HAIRLINE}`,
                  cursor: 'pointer',
                  transition: 'background-color 160ms ease',
                  '&:hover': { bgcolor: landingTokens.NEUTRAL_SOFT },
                }}
              >
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography sx={{ fontWeight: 600, color: landingTokens.INK }}>{j.title}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 2 }} sx={{ mt: { xs: 1, md: 0 } }}>
                  <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>{j.dept}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 2 }} sx={{ mt: { xs: 1, md: 0 } }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <PlaceOutlinedIcon sx={{ fontSize: 14, color: landingTokens.PRIMARY }} />
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>{j.loc}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 6, md: 1.5 }} sx={{ mt: { xs: 1, md: 0 } }}>
                  <Chip label={j.type} size="small" sx={{ bgcolor: j.type === 'Full-time' ? 'rgba(0,52,104,0.08)' : 'rgba(196,140,70,0.12)', color: j.type === 'Full-time' ? landingTokens.PRIMARY : landingTokens.GOLD_DARK, borderRadius: 0.5, fontWeight: 600 }} />
                </Grid>
                <Grid size={{ xs: 6, md: 1.5 }} sx={{ mt: { xs: 1, md: 0 } }}>
                  <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED }}>{j.date}</Typography>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 4. Benefits */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            PHÚC LỢI
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
            Benefits dành cho Người PNJ
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 3, md: 3 }}>
          {benefits.map((b) => (
            <Grid key={b.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{ p: 3.5, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}`, borderLeft: `3px solid ${landingTokens.GOLD}`, height: '100%' }}>
                <BadgeOutlinedIcon sx={{ fontSize: 28, color: landingTokens.PRIMARY, mb: 1.5 }} />
                <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 18, fontWeight: 600, mb: 1 }}>
                  {b.title}
                </Typography>
                <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.7 }}>
                  {b.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 5. Process */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 14 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              QUY TRÌNH TUYỂN DỤNG
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 500, mt: 1 }}>
              Gọn gàng trong 4 bước
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
                    <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 20, fontWeight: 500, mb: 1.5 }}>
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
      </Box>

      {/* 6. Apply form */}
      <Box id="apply" sx={{ bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 820 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.24em' }}>
              ỨNG TUYỂN NHANH
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 44 }, fontWeight: 600, color: '#FBF7F2', mt: 1.5, lineHeight: 1.2 }}>
              Gửi hồ sơ trong 60 giây
            </Typography>
            <Typography sx={{ color: 'rgba(251,247,242,0.72)', mt: 2 }}>
              Để lại thông tin, chuyên viên PNJ sẽ gọi trong 24 giờ làm việc.
            </Typography>
          </Box>

          {sent ? (
            <Box sx={{ textAlign: 'center', border: `1px solid ${landingTokens.GOLD}`, p: 5 }}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 24, color: landingTokens.GOLD, mb: 1 }}>
                Đã nhận hồ sơ!
              </Typography>
              <Typography sx={{ color: 'rgba(251,247,242,0.82)' }}>
                PNJ sẽ liên hệ với bạn trong 24 giờ làm việc.
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
                <Grid size={{ xs: 12 }}>
                  <TextField
                    select
                    fullWidth
                    label="Vị trí quan tâm"
                    value={form.position}
                    onChange={(e) => setForm((s) => ({ ...s, position: e.target.value }))}
                    sx={{
                      ...sxSharpInput,
                      '& .MuiInputLabel-root': { color: 'rgba(251,247,242,0.72)' },
                      '& .MuiSelect-icon': { color: 'rgba(251,247,242,0.72)' },
                      '& .MuiOutlinedInput-root': {
                        ...sxSharpInput['& .MuiOutlinedInput-root'],
                        bgcolor: 'rgba(255,255,255,0.06)',
                        color: '#FBF7F2',
                        '& fieldset': { borderColor: 'rgba(251,247,242,0.3)' },
                        '&:hover fieldset': { borderColor: landingTokens.GOLD },
                        '&.Mui-focused fieldset': { borderColor: landingTokens.GOLD },
                      },
                    }}
                  >
                    {jobs.map((j) => (
                      <MenuItem key={j.id} value={j.title}>{j.title}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      border: `1px dashed rgba(251,247,242,0.4)`,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { borderColor: landingTokens.GOLD },
                    }}
                  >
                    <UploadFileOutlinedIcon sx={{ fontSize: 32, color: landingTokens.GOLD, mb: 1 }} />
                    <Typography sx={{ color: 'rgba(251,247,242,0.85)' }}>Kéo thả CV hoặc nhấn để chọn file</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(251,247,242,0.5)' }}>PDF/DOCX · tối đa 5MB</Typography>
                  </Box>
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
                    Gửi ứng tuyển
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
      </Box>

      {/* Job detail drawer */}
      <Drawer
        anchor="right"
        open={Boolean(openJob)}
        onClose={() => setOpenJob(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 480 } } }}
      >
        {openJob && (
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.18em', fontWeight: 700 }}>
                  {openJob.dept.toUpperCase()}
                </Typography>
                <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 24, fontWeight: 600, mt: 0.5 }}>
                  {openJob.title}
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenJob(null)}><CloseIcon /></IconButton>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <Chip label={openJob.loc} size="small" icon={<PlaceOutlinedIcon sx={{ fontSize: 14 }} />} sx={{ borderRadius: 0.5 }} />
              <Chip label={openJob.type} size="small" sx={{ borderRadius: 0.5, bgcolor: 'rgba(0,52,104,0.08)', color: landingTokens.PRIMARY, fontWeight: 600 }} />
              <Chip label={openJob.date} size="small" variant="outlined" sx={{ borderRadius: 0.5 }} />
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Mô tả công việc</Typography>
            <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.8, mb: 3 }}>
              Phụ trách triển khai hoạt động {openJob.dept} tại khu vực {openJob.loc},
              phối hợp với các phòng ban liên quan để đạt mục tiêu chung của PNJ.
              Chịu trách nhiệm báo cáo kết quả định kỳ và đề xuất cải tiến quy trình.
            </Typography>

            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Yêu cầu</Typography>
            <Box component="ul" sx={{ pl: 2.5, m: 0, mb: 3, color: landingTokens.INK_MUTED, lineHeight: 1.9 }}>
              <li>Tốt nghiệp Đại học chuyên ngành liên quan.</li>
              <li>2 năm kinh nghiệm trở lên trong lĩnh vực {openJob.dept}.</li>
              <li>Kỹ năng giao tiếp và làm việc nhóm tốt.</li>
              <li>Chủ động, cầu tiến, cam kết dài hạn.</li>
            </Box>

            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Phúc lợi</Typography>
            <Box component="ul" sx={{ pl: 2.5, m: 0, mb: 4, color: landingTokens.INK_MUTED, lineHeight: 1.9 }}>
              <li>Lương cạnh tranh + thưởng hiệu quả hàng quý.</li>
              <li>BHYT cao cấp cho nhân viên và gia đình.</li>
              <li>Môi trường trẻ, năng động, đa dạng.</li>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={sxSharpBtnContained}
              endIcon={<ArrowForwardIcon />}
              onClick={() => {
                setForm((s) => ({ ...s, position: openJob.title }));
                setOpenJob(null);
                document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ứng tuyển vị trí này
            </Button>
            <Button component="a" href="#" onClick={(e) => e.preventDefault()} variant="outlined" fullWidth sx={{ ...sxSharpBtnOutlined, mt: 1.5 }}>
              Chia sẻ tin tuyển dụng
            </Button>
          </Box>
        )}
      </Drawer>
    </LazyMotion>
  );
}
