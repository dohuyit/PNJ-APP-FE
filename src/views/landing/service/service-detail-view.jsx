'use client';

import Link from 'next/link';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DiamondIcon from '@mui/icons-material/Diamond';
import DrawIcon from '@mui/icons-material/Draw';
import EditNoteIcon from '@mui/icons-material/EditNote';
import HandymanIcon from '@mui/icons-material/Handyman';
import StraightenIcon from '@mui/icons-material/Straighten';

import { landingTokens, sxSharpBtnContained, sxSharpInput } from 'src/theme/landing';
import { m, LazyMotion, domAnimation, fadeIn, slideUp, staggerContainer } from 'src/views/admin/_shared/motion';

const SERVICES = {
  'thu-doi-vang': {
    icon: AutorenewIcon,
    title: 'Thu đổi vàng',
    eyebrow: 'DỊCH VỤ THU ĐỔI',
    intro: [
      'PNJ thu đổi vàng cũ các tuổi (9999, 999, 980, 750, 680, 585) với mức giá minh bạch được niêm yết công khai mỗi ngày tại toàn bộ hệ thống hơn 400 cửa hàng trên cả nước.',
      'Đội ngũ chuyên viên định giá sử dụng máy quang phổ để kiểm tra chính xác tuổi vàng, đảm bảo khách hàng nhận được giá trị đúng với sản phẩm đang sở hữu.',
      'Đối với vàng mua tại PNJ còn đủ bao bì và phiếu bảo hành, mức thu đổi sẽ ưu đãi hơn so với vàng không rõ nguồn gốc. Khách hàng có thể quy đổi ngay thành tiền mặt hoặc trừ vào sản phẩm mới.',
      'Quy trình thực hiện nhanh gọn trong 15 – 30 phút, cam kết an toàn và bảo mật tuyệt đối cho tài sản của khách hàng.',
    ],
    fees: [
      { label: 'Vàng miếng SJC', value: 'Theo giá niêm yết, không phí' },
      { label: 'Vàng trang sức PNJ', value: 'Thu lại 95 – 98% giá bán' },
      { label: 'Vàng trang sức ngoài PNJ', value: 'Định giá theo tuổi thực tế' },
      { label: 'Phí kiểm định tuổi vàng', value: 'Miễn phí' },
    ],
    steps: [
      'Mang trang sức và giấy tờ liên quan (nếu có) đến cửa hàng PNJ',
      'Chuyên viên kiểm tra, cân trọng lượng và đo tuổi vàng bằng máy quang phổ',
      'Báo giá chi tiết và thỏa thuận mức thu đổi với khách hàng',
      'Lập phiếu thu đổi, in hóa đơn minh bạch',
      'Thanh toán tiền mặt hoặc chuyển khoản theo yêu cầu',
    ],
    notes: [
      'Mang theo CCCD/CMND để hoàn tất thủ tục giao dịch',
      'Vàng không còn nguyên vẹn vẫn được thu đổi, nhưng mức giá có thể điều chỉnh',
      'Giá thu đổi cập nhật liên tục theo biến động thị trường',
    ],
  },
  'bao-hanh': {
    icon: VerifiedUserIcon,
    title: 'Bảo hành trọn đời',
    eyebrow: 'CAM KẾT TRỌN ĐỜI',
    intro: [
      'Mọi trang sức do PNJ sản xuất đều được bảo hành trọn đời, không giới hạn số lần, bao gồm đánh bóng, xi lại lớp mạ, làm mới và kiểm tra an toàn đá quý.',
      'Dịch vụ áp dụng tại toàn bộ hệ thống cửa hàng PNJ trên cả nước, chỉ cần khách hàng xuất trình phiếu bảo hành hoặc hóa đơn mua hàng.',
      'Đối với các hạng mục sửa chữa phát sinh do lỗi nhà sản xuất, PNJ hỗ trợ hoàn toàn miễn phí. Các hạng mục khác được tính phí theo bảng giá niêm yết công khai.',
      'Thời gian bảo hành tiêu chuẩn 3 – 7 ngày làm việc tùy mức độ phục hồi, có thể nhanh hơn với các hạng mục đơn giản.',
    ],
    fees: [
      { label: 'Đánh bóng, làm mới', value: 'Miễn phí trọn đời' },
      { label: 'Kiểm tra độ an toàn đá', value: 'Miễn phí trọn đời' },
      { label: 'Xi lại lớp mạ vàng trắng', value: 'Từ 150.000₫ / món' },
      { label: 'Lỗi từ nhà sản xuất', value: 'Miễn phí 100%' },
    ],
    steps: [
      'Mang trang sức và phiếu bảo hành đến cửa hàng PNJ gần nhất',
      'Chuyên viên tiếp nhận và kiểm tra tình trạng sản phẩm',
      'Tư vấn hạng mục bảo hành, báo giá (nếu có phát sinh)',
      'Lập phiếu nhận hàng, hẹn ngày trả',
      'Nhận lại trang sức như mới cùng phiếu bảo hành cập nhật',
    ],
    notes: [
      'Phiếu bảo hành là cơ sở xác nhận nguồn gốc sản phẩm PNJ',
      'Mất phiếu bảo hành có thể xuất trình hóa đơn hoặc tra cứu lịch sử mua hàng',
      'Trang sức ngoài PNJ không nằm trong phạm vi bảo hành trọn đời',
    ],
  },
  'kiem-dinh-kim-cuong': {
    icon: DiamondIcon,
    title: 'Kiểm định kim cương',
    eyebrow: 'TRUNG TÂM PNJLAB',
    intro: [
      'Trung tâm kiểm định PNJLab là đơn vị kiểm định kim cương uy tín hàng đầu tại Việt Nam, giám định theo tiêu chuẩn 4C (Carat, Cut, Color, Clarity) với quy trình chuẩn quốc tế GIA.',
      'Dịch vụ phù hợp cho khách hàng muốn xác minh chất lượng kim cương đã mua, đánh giá tài sản hoặc chuẩn bị giao dịch mua bán kim cương.',
      'Đội ngũ chuyên viên giám định được đào tạo bài bản, sử dụng hệ thống thiết bị hiện đại gồm kính hiển vi chuyên dụng, máy đo chỉ số khúc xạ và máy phân tích quang phổ.',
      'Giấy chứng nhận PNJLab có giá trị pháp lý, được chấp nhận trên toàn hệ thống PNJ và các đối tác uy tín trong ngành kim hoàn.',
    ],
    fees: [
      { label: 'Kiểm định nhanh tại quầy', value: 'Miễn phí (viên dưới 10 ly)' },
      { label: 'Cấp giấy chứng nhận PNJLab', value: 'Từ 500.000₫ / viên' },
      { label: 'Khắc mã số viên kim cương', value: '300.000₫ / viên' },
      { label: 'Kiểm định lại định kỳ', value: 'Miễn phí trọn đời (cho khách PNJ)' },
    ],
    steps: [
      'Mang kim cương đến cửa hàng PNJ hoặc trung tâm PNJLab',
      'Chuyên viên tiếp nhận và kiểm tra sơ bộ',
      'Thực hiện giám định bằng thiết bị chuyên dụng',
      'Phân tích chỉ số 4C và các đặc điểm nhận dạng',
      'Cấp giấy chứng nhận trong 1 – 3 ngày làm việc',
      'Giao giấy chứng nhận kèm hộp bảo quản chính hãng',
    ],
    notes: [
      'Kim cương dưới 0.18ct chỉ kiểm định cơ bản, không cấp giấy chi tiết',
      'Kim cương đã qua xử lý nhiệt được ghi chú rõ trong giấy chứng nhận',
      'Khách hàng có thể lưu lại ảnh và dữ liệu giám định trên hệ thống PNJ',
    ],
  },
  'gia-cong': {
    icon: HandymanIcon,
    title: 'Gia công theo yêu cầu',
    eyebrow: 'CHẾ TÁC RIÊNG',
    intro: [
      'PNJ cung cấp dịch vụ gia công trang sức theo yêu cầu riêng, từ nhẫn cầu hôn, nhẫn cưới đến bộ trang sức kỷ niệm độc bản chỉ dành riêng cho bạn.',
      'Khách hàng có thể gửi bản phác thảo, hình ảnh tham khảo hoặc trao đổi ý tưởng với đội ngũ thiết kế. Chúng tôi sẽ dựng bản vẽ 3D để duyệt trước khi tiến hành chế tác.',
      'Mỗi sản phẩm được thực hiện bởi nghệ nhân có trên 15 năm kinh nghiệm, kết hợp kỹ thuật chế tác thủ công truyền thống với công nghệ CNC và in 3D sáp hiện đại.',
      'Thời gian hoàn thiện từ 15 – 30 ngày tùy độ phức tạp của thiết kế. Khách hàng được cập nhật tiến độ ở từng giai đoạn chế tác.',
    ],
    fees: [
      { label: 'Phí thiết kế 3D', value: 'Từ 500.000₫ (hoàn lại nếu đặt gia công)' },
      { label: 'Tiền công chế tác cơ bản', value: 'Từ 1.200.000₫ / chỉ vàng' },
      { label: 'Nhẫn kim cương đặt riêng', value: 'Báo giá theo thiết kế' },
      { label: 'Đặt cọc tối thiểu', value: '50% giá trị đơn hàng' },
    ],
    steps: [
      'Trao đổi ý tưởng, gửi phác thảo hoặc hình ảnh tham khảo',
      'Đội thiết kế dựng bản vẽ 3D và báo giá chi tiết',
      'Khách hàng duyệt thiết kế và đặt cọc',
      'Chế tác mẫu sáp, duyệt thử trước khi đổ vàng',
      'Hoàn thiện, đính đá và kiểm tra chất lượng',
      'Giao hàng kèm giấy chứng nhận và hộp quà',
    ],
    notes: [
      'Thiết kế sẽ được chỉnh sửa miễn phí tối đa 3 lần',
      'Mẫu sản phẩm thuộc sở hữu riêng, PNJ không sao chép cho khách khác',
      'Nên đặt trước tối thiểu 30 ngày cho các dịp lễ quan trọng',
    ],
  },
  'khac-chu': {
    icon: DrawIcon,
    title: 'Khắc chữ',
    eyebrow: 'DẤU ẤN CÁ NHÂN',
    intro: [
      'Dịch vụ khắc chữ PNJ cho phép bạn in dấu tên, ngày kỷ niệm hoặc thông điệp cá nhân lên trang sức, biến mỗi món thành kỷ vật mang ý nghĩa riêng biệt.',
      'Chúng tôi sử dụng công nghệ khắc laser chính xác đến 0.01mm, đảm bảo nét chữ sắc sảo, không ảnh hưởng đến kết cấu và độ bền của sản phẩm.',
      'Hỗ trợ nhiều phông chữ, ngôn ngữ, biểu tượng và cả chữ ký tay được số hóa từ bản viết của khách hàng.',
      'Thời gian thực hiện nhanh gọn, từ 30 phút đến 2 giờ tùy độ phức tạp, có thể lấy ngay trong ngày tại cửa hàng.',
    ],
    fees: [
      { label: 'Khắc chữ laser cơ bản', value: '100.000₫ / món' },
      { label: 'Khắc chữ ký tay số hóa', value: '200.000₫ / món' },
      { label: 'Khắc hình biểu tượng', value: 'Từ 150.000₫ / món' },
      { label: 'Khách mua sản phẩm PNJ', value: 'Miễn phí lần đầu' },
    ],
    steps: [
      'Chọn sản phẩm và vị trí muốn khắc',
      'Cung cấp nội dung, phông chữ và biểu tượng',
      'Chuyên viên xem trước bản khắc trên máy tính',
      'Duyệt bản thử và tiến hành khắc laser',
      'Kiểm tra, đánh bóng hoàn thiện',
    ],
    notes: [
      'Khắc chữ không ảnh hưởng đến chính sách bảo hành sản phẩm',
      'Một số sản phẩm có bề mặt cong không phù hợp để khắc',
      'Nội dung khắc không được chứa thông tin vi phạm pháp luật',
    ],
  },
  'sua-chua': {
    icon: EditNoteIcon,
    title: 'Sửa chữa trang sức',
    eyebrow: 'PHỤC HỒI CHUYÊN SÂU',
    intro: [
      'Dịch vụ sửa chữa trang sức PNJ bao gồm nong rộng, thu nhỏ size nhẫn, hàn nối dây chuyền đứt, thay móc, gắn lại đá rơi và phục hồi trang sức cũ về trạng thái gần như mới.',
      'Mọi thao tác được thực hiện tại xưởng kỹ thuật của PNJ với hệ thống máy hàn laser, máy đúc và dụng cụ đánh bóng chuyên dụng.',
      'Đội ngũ thợ kim hoàn tay nghề cao sẽ tư vấn phương án phù hợp cho từng tình trạng sản phẩm, đảm bảo giữ nguyên thiết kế và giá trị ban đầu.',
      'Thời gian sửa chữa trung bình 3 – 7 ngày làm việc, có dịch vụ nhanh cho các hạng mục cấp thiết.',
    ],
    fees: [
      { label: 'Nong rộng / thu nhỏ size nhẫn', value: 'Từ 200.000₫ / lần' },
      { label: 'Hàn nối dây chuyền', value: 'Từ 150.000₫ / mối' },
      { label: 'Thay móc khóa', value: 'Từ 250.000₫ / cái' },
      { label: 'Gắn lại đá rơi', value: 'Từ 100.000₫ / viên' },
    ],
    steps: [
      'Mang trang sức đến cửa hàng để kiểm tra',
      'Chuyên viên tư vấn hạng mục cần sửa chữa',
      'Báo giá chi tiết và thời gian hoàn thành',
      'Lập phiếu nhận hàng, chuyển về xưởng kỹ thuật',
      'Thực hiện sửa chữa và kiểm tra chất lượng',
      'Giao lại sản phẩm kèm phiếu bảo hành hạng mục sửa',
    ],
    notes: [
      'Sửa chữa trang sức ngoài PNJ vẫn được tiếp nhận',
      'Hạng mục phát sinh thay đá sẽ cần thời gian đặt hàng thêm',
      'Bảo hành 6 tháng cho các hạng mục sửa chữa phát sinh phí',
    ],
  },
  'do-size': {
    icon: StraightenIcon,
    title: 'Đo size nhẫn/vòng',
    eyebrow: 'MIỄN PHÍ TẠI CỬA HÀNG',
    intro: [
      'Dịch vụ đo size nhẫn, vòng tay và vòng cổ miễn phí tại toàn bộ hệ thống cửa hàng PNJ, đảm bảo bạn chọn được kích thước vừa vặn cho bản thân hoặc người thân yêu.',
      'Chuyên viên sử dụng bộ dụng cụ đo chuẩn quốc tế, kết hợp tư vấn về đặc điểm ngón tay và thói quen đeo để chọn size phù hợp nhất.',
      'PNJ cũng hỗ trợ đo size từ xa thông qua hướng dẫn chi tiết và bộ dụng cụ đo gửi tận nhà, phù hợp cho khách hàng mua sản phẩm làm quà tặng bất ngờ.',
      'Tất cả các sản phẩm mua tại PNJ đều được hỗ trợ đổi size miễn phí lần đầu trong vòng 30 ngày kể từ ngày mua.',
    ],
    fees: [
      { label: 'Đo size tại cửa hàng', value: 'Miễn phí' },
      { label: 'Bộ dụng cụ đo size tại nhà', value: 'Miễn phí (hoàn lại sau khi dùng)' },
      { label: 'Đổi size lần đầu', value: 'Miễn phí trong 30 ngày' },
      { label: 'Đổi size từ lần 2', value: 'Theo bảng giá nong / thu' },
    ],
    steps: [
      'Đến cửa hàng PNJ gần nhất',
      'Chuyên viên tư vấn và đo bằng dụng cụ chuyên dụng',
      'Ghi nhận size và lưu vào hồ sơ khách hàng',
      'Hỗ trợ thử sản phẩm thực tế nếu cần',
    ],
    notes: [
      'Size tay có thể thay đổi theo thời tiết, nên đo vào buổi trưa',
      'Đeo size thử tối thiểu 10 phút để cảm nhận độ vừa vặn',
      'Lưu lại size trong hồ sơ để tiện cho các lần mua sau',
    ],
  },
};

const STORES = [
  'PNJ Nguyễn Trãi, Q.5, TP.HCM',
  'PNJ Lê Lợi, Q.1, TP.HCM',
  'PNJ Phan Đăng Lưu, Q. Phú Nhuận, TP.HCM',
  'PNJ Hai Bà Trưng, Hoàn Kiếm, Hà Nội',
  'PNJ Trần Phú, Hải Châu, Đà Nẵng',
];

export function ServiceDetailView({ slug }) {
  const svc = SERVICES[slug];
  const [form, setForm] = useState({ store: '', date: '', name: '', phone: '', note: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!svc) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 10, md: 16 }, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 40 }, mb: 2 }}>
          Không tìm thấy dịch vụ
        </Typography>
        <Typography sx={{ color: landingTokens.INK_MUTED, mb: 4 }}>
          Dịch vụ bạn truy cập không tồn tại hoặc đã được di chuyển.
        </Typography>
        <Button component={Link} href="/dich-vu" variant="contained" sx={sxSharpBtnContained} startIcon={<ArrowBackIcon />}>
          Quay lại trang Dịch vụ
        </Button>
      </Container>
    );
  }

  const Icon = svc.icon;

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // shortcut: mock submit, upgrade when booking API is ready
    setSubmitted(true);
  };

  return (
    <LazyMotion features={domAnimation}>
      {/* Hero */}
      <Box sx={{ position: 'relative', bgcolor: landingTokens.INK, color: '#FBF7F2', py: { xs: 8, md: 12 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 80% 20%, ${landingTokens.GOLD}15, transparent 60%)` }} />
        <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative' }}>
          <Button
            component={Link}
            href="/dich-vu"
            startIcon={<ArrowBackIcon />}
            sx={{ color: '#E8DFD4', textTransform: 'none', mb: 3, '&:hover': { color: landingTokens.GOLD, bgcolor: 'transparent' } }}
          >
            Tất cả dịch vụ
          </Button>
          <m.div initial="hidden" animate="show" variants={staggerContainer(0.1)}>
            <m.div variants={fadeIn}>
              <Icon sx={{ fontSize: 72, color: landingTokens.GOLD, mb: 3 }} />
            </m.div>
            <m.div variants={fadeIn}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em', mb: 2, display: 'block' }}>
                {svc.eyebrow}
              </Typography>
            </m.div>
            <m.div variants={slideUp}>
              <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 36, md: 56 }, fontWeight: 600, lineHeight: 1.1, maxWidth: 820 }}>
                {svc.title}
              </Typography>
            </m.div>
            <m.div variants={fadeIn}>
              <Button
                component="a"
                href="#booking"
                variant="contained"
                size="large"
                sx={{ ...sxSharpBtnContained, mt: 5 }}
                endIcon={<ArrowForwardIcon />}
              >
                Đặt lịch ngay
              </Button>
            </m.div>
          </m.div>
        </Container>
      </Box>

      {/* Intro */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 12 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              GIỚI THIỆU
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 40 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
              Dịch vụ dành riêng<br />cho bạn
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              {svc.intro.map((p, i) => (
                <Typography key={i} sx={{ lineHeight: 1.85, fontSize: 16, color: i === 0 ? landingTokens.INK : landingTokens.INK_MUTED }}>
                  {p}
                </Typography>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Fees */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              CHI PHÍ THAM KHẢO
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 40 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
              Minh bạch & công khai
            </Typography>
          </Box>
          <Box sx={{ bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}` }}>
            {svc.fees.map((f, i) => (
              <Stack
                key={f.label}
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1}
                sx={{
                  px: { xs: 3, md: 4 },
                  py: 2.5,
                  borderBottom: i < svc.fees.length - 1 ? `1px solid ${landingTokens.HAIRLINE}` : 'none',
                }}
              >
                <Typography sx={{ color: landingTokens.INK, fontWeight: 500 }}>{f.label}</Typography>
                <Typography sx={{ color: landingTokens.PRIMARY, fontWeight: 600 }}>{f.value}</Typography>
              </Stack>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Steps */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 12 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            QUY TRÌNH CHI TIẾT
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 40 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
            Thực hiện thế nào?
          </Typography>
        </Box>
        <Stack spacing={3}>
          {svc.steps.map((s, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
            >
              <Stack direction="row" spacing={3} alignItems="flex-start">
                <Typography
                  sx={{
                    fontFamily: landingTokens.FONT_SERIF,
                    fontSize: 32,
                    fontWeight: 600,
                    color: landingTokens.GOLD,
                    lineHeight: 1,
                    minWidth: 48,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Box sx={{ flex: 1, pt: 0.5, borderBottom: `1px solid ${landingTokens.HAIRLINE}`, pb: 2.5 }}>
                  <Typography sx={{ fontSize: 17, color: landingTokens.INK, lineHeight: 1.7 }}>{s}</Typography>
                </Box>
              </Stack>
            </m.div>
          ))}
        </Stack>
      </Container>

      {/* Notes */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 8, md: 12 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
              LƯU Ý QUAN TRỌNG
            </Typography>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 40 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
              Khách hàng cần biết
            </Typography>
          </Box>
          <Stack component="ul" spacing={2} sx={{ pl: 0, m: 0, listStyle: 'none' }}>
            {svc.notes.map((n, i) => (
              <Stack key={i} component="li" direction="row" spacing={2} alignItems="flex-start">
                <CheckCircleIcon sx={{ color: landingTokens.PRIMARY, fontSize: 22, mt: 0.3, flexShrink: 0 }} />
                <Typography sx={{ color: landingTokens.INK, lineHeight: 1.8 }}>{n}</Typography>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Booking form */}
      <Container id="booking" maxWidth="md" sx={{ py: { xs: 8, md: 14 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            ĐẶT LỊCH HẸN
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 28, md: 40 }, fontWeight: 500, mt: 1, lineHeight: 1.15 }}>
            Đăng ký dịch vụ {svc.title.toLowerCase()}
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: { xs: 3, md: 5 }, bgcolor: landingTokens.SURFACE, border: `1px solid ${landingTokens.HAIRLINE}` }}
        >
          {submitted ? (
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              sx={{ borderRadius: 0, bgcolor: '#F1F8F2', border: `1px solid ${landingTokens.PRIMARY}22` }}
            >
              <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Đăng ký thành công!</Typography>
              <Typography variant="body2">
                PNJ sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận lịch hẹn. Cảm ơn bạn đã tin chọn dịch vụ của chúng tôi.
              </Typography>
            </Alert>
          ) : (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  required
                  fullWidth
                  label="Cửa hàng"
                  value={form.store}
                  onChange={handleChange('store')}
                  sx={sxSharpInput}
                >
                  {STORES.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Ngày hẹn"
                  InputLabelProps={{ shrink: true }}
                  value={form.date}
                  onChange={handleChange('date')}
                  sx={sxSharpInput}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Họ và tên"
                  value={form.name}
                  onChange={handleChange('name')}
                  sx={sxSharpInput}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Số điện thoại"
                  inputProps={{ inputMode: 'tel', pattern: '[0-9+ ]{8,15}' }}
                  value={form.phone}
                  onChange={handleChange('phone')}
                  sx={sxSharpInput}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Ghi chú thêm (tùy chọn)"
                  value={form.note}
                  onChange={handleChange('note')}
                  sx={sxSharpInput}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button type="submit" variant="contained" size="large" fullWidth sx={sxSharpBtnContained}>
                  Gửi đăng ký
                </Button>
                <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center', color: landingTokens.INK_MUTED }}>
                  Bằng việc gửi đăng ký, bạn đồng ý với chính sách bảo mật thông tin của PNJ.
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </LazyMotion>
  );
}
