'use client';

import { keyframes } from '@emotion/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

const driftA = keyframes`
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  33%  { transform: translate3d(-18%, 12%, 0) scale(1.18); }
  66%  { transform: translate3d(10%, -10%, 0) scale(0.92); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
`;

const driftB = keyframes`
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  33%  { transform: translate3d(15%, -14%, 0) scale(0.9); }
  66%  { transform: translate3d(-12%, 8%, 0) scale(1.2); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
`;

// ----------------------------------------------------------------------

// Dữ liệu 3 ô stats — chỉ cần sửa ở đây nếu muốn đổi nội dung
const STATS = [
    { value: 'TOP 1', label: 'Agency TikTok 2024' },
    { value: '$50M+', label: 'Chi tiêu QC đã quản lý' },
    { value: '2017', label: 'Năm thành lập' },
];

// Dữ liệu 3 dòng feature — icon outline (linear) của bộ solar
const FEATURES = [
    {
        icon: 'solar:bolt-linear',
        title: 'Tài khoản đã xác minh, sẵn sàng nhanh chóng',
        desc: 'Lịch sử chi tiêu ổn định — chạy chiến dịch ngay lập tức',
    },
    {
        icon: 'solar:shield-check-linear',
        title: 'Đảm bảo & an toàn tài chính',
        desc: 'An toàn 100% dòng tiền với hệ thống thanh toán được quản lý',
    },
    {
        icon: 'solar:chat-round-dots-linear',
        title: 'Hỗ trợ chuyên gia 1-1',
        desc: 'Đội ngũ media buyer được TikTok chứng nhận luôn đồng hành cùng bạn',
    },
];

// Subtitle mặc định — nếu page không truyền prop `subtitle` thì dùng dòng này
const DEFAULT_SUBTITLE =
    'Tham gia Zeno Global — agency TikTok chính thức — để có tài khoản quảng cáo đã xác minh, đảm bảo tài chính, nhắm mục tiêu đa quốc gia và tối ưu hóa bởi chuyên gia.';

// Danh sách avatar partner ở footer — hiển thị kí tự đầu của tên,
// kèm màu nền khác nhau để phân biệt từng avatar.
const PARTNER_AVATARS = [
    { name: 'Anna', bg: '#FF7A45' },
    { name: 'Kevin', bg: '#E8420C' },
    { name: 'Mia', bg: '#FFCE3D', color: '#7A2A10' },
    { name: 'Tom', bg: 'rgba(255,255,255,0.22)' },
];

// ----------------------------------------------------------------------

export function AuthSplitSection({
                                     sx,
                                     method, // không dùng trong UI mới (giữ để tương thích)
                                     methods, // không dùng trong UI mới (giữ để tương thích)
                                     layoutQuery = 'md',
                                     title,
                                     imgUrl, // không dùng trong UI mới (giữ để tương thích)
                                     subtitle,
                                     ...other
                                 }) {
    return (
        <Box
            sx={[
                (theme) => ({
                    // Mobile: ẩn hoàn toàn cột phải — chỉ form ở cột trái
                    display: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    width: 1,
                    color: 'common.white',
                    // Nền tĩnh: linear gradient chủ đạo (tone primary, không hard-code hex).
                    // 2 blob màu động sẽ được render dưới dạng Box absolute riêng để có thể animate.
                    background: `linear-gradient(155deg, ${theme.palette.primary.darker} 0%, ${theme.palette.primary.dark} 45%, ${theme.palette.primary.main} 100%)`,
                    // Pattern dots mờ phủ toàn pane (dùng pseudo để tránh ảnh hưởng nội dung)
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
                        backgroundSize: '26px 26px',
                        pointerEvents: 'none',
                        zIndex: 1,
                    },
                    // Respect reduced motion — user tắt animation thì không drift
                    '@media (prefers-reduced-motion: reduce)': {
                        '& .auth-blob': { animation: 'none' },
                    },
                    // Từ breakpoint layoutQuery trở lên: hiện ra dưới dạng cột phải, chia đôi 50/50
                    // với content. `flex: 1 1 0` + `minWidth: 0` đảm bảo không bị content bên trái
                    // co kéo lệch dù form nhiều field.
                    [theme.breakpoints.up(layoutQuery)]: {
                        flex: '1 1 0',
                        width: 0,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: { md: 6, lg: 7 },
                    },
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            {/* Blob A — đốm sáng (primary.lighter) drift từ góc trên-phải.
          mix-blend-mode: screen → cộng sáng lên gradient tối → glow rõ rệt. */}
            <Box
                aria-hidden
                className="auth-blob"
                sx={(theme) => ({
                    position: 'absolute',
                    top: '-15%',
                    right: '-10%',
                    width: '70%',
                    height: '70%',
                    zIndex: 0,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${theme.palette.primary.lighter} 0%, transparent 65%)`,
                    mixBlendMode: 'screen',
                    filter: 'blur(40px)',
                    opacity: 0.7,
                    pointerEvents: 'none',
                    animation: `${driftA} 14s ease-in-out infinite`,
                    willChange: 'transform',
                })}
            />

            {/* Blob B — đốm sáng tone secondary (tím) drift ngược chiều ở góc dưới-trái,
          tạo điểm nhấn màu khác primary → cảm giác đa sắc, "aurora". */}
            <Box
                aria-hidden
                className="auth-blob"
                sx={(theme) => ({
                    position: 'absolute',
                    bottom: '-20%',
                    left: '-15%',
                    width: '75%',
                    height: '75%',
                    zIndex: 0,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${theme.palette.secondary.light} 0%, transparent 60%)`,
                    mixBlendMode: 'screen',
                    filter: 'blur(50px)',
                    opacity: 0.55,
                    pointerEvents: 'none',
                    animation: `${driftB} 18s ease-in-out infinite`,
                    willChange: 'transform',
                })}
            />

            {/* Vùng nội dung — nằm trên pattern dots và blob */}
            <Box sx={{ position: 'relative', zIndex: 2, width: 1, maxWidth: 520, mx: 'auto' }}>
                {/* Phần 1: Award badge — chip nhỏ ở đầu panel */}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: 999,
                        bgcolor: 'rgba(255,255,255,0.10)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        backdropFilter: 'blur(6px)',
                        fontSize: 13.5,
                        fontWeight: 600,
                    }}
                >
                    <Box component="span" sx={{ color: 'warning.light' }}>
                        ⭐
                    </Box>
                    Đối tác Tăng trưởng Xuất sắc 2025 — TikTok
                </Box>

                <Typography
                    component="h2"
                    sx={{mt: 3.5, fontSize: { md: 38, lg: 46 }, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.09, color: 'common.white'}}
                >
                    {title || (
                        <>
                            Bứt phá quảng cáo TikTok với{' '}
                            <Box
                                component="span"
                                sx={{
                                    borderRadius: 1,
                                    px: 0.75,
                                    WebkitBoxDecorationBreak: 'clone',
                                    boxDecorationBreak: 'clone',
                                    bgcolor: 'rgba(255,255,255,0.16)',
                                }}
                            >
                                tài khoản agency đã xác minh
                            </Box>
                        </>
                    )}
                </Typography>

                {/* Phần 3: Subtitle — mô tả ngắn dưới heading */}
                <Typography
                    sx={{
                        mt: 2.5,
                        fontSize: 16,
                        lineHeight: 1.65,
                        color: 'rgba(255,255,255,0.82)',
                        maxWidth: 460,
                    }}
                >
                    {subtitle || DEFAULT_SUBTITLE}
                </Typography>

                {/* Phần 4: Stats grid — 3 ô số liệu nổi bật */}
                <Box
                    sx={{
                        mt: 4.25,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 1.75,
                    }}
                >
                    {STATS.map((s) => (
                        <Box
                            key={s.value}
                            sx={{
                                px: 2,
                                py: 2.25,
                                borderRadius: 2,
                                bgcolor: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.14)',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 28,
                                    fontWeight: 800,
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1,
                                    color: 'common.white',
                                }}
                            >
                                {s.value}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: 1,
                                    fontSize: 12.5,
                                    fontWeight: 500,
                                    lineHeight: 1.35,
                                    color: 'rgba(255,255,255,0.72)',
                                }}
                            >
                                {s.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Phần 5: Feature list — 3 dòng (icon + title + desc) */}
                <Stack spacing={2.5} sx={{ mt: 4.25 }}>
                    {FEATURES.map((f) => (
                        <Box key={f.title} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.875 }}>
                            {/* Wrapper icon — ô vuông 42x42, bo góc 12 */}
                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,
                                    flexShrink: 0,
                                    borderRadius: 1.5,
                                    bgcolor: 'rgba(255,255,255,0.12)',
                                    border: '1px solid rgba(255,255,255,0.16)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Iconify icon={f.icon} width={20} sx={{ color: 'common.white' }} />
                            </Box>
                            <Box>
                                <Typography
                                    sx={{ fontSize: 15.5, fontWeight: 700, color: 'common.white' }}
                                >
                                    {f.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: 0.375,
                                        fontSize: 13.5,
                                        lineHeight: 1.5,
                                        color: 'rgba(255,255,255,0.72)',
                                    }}
                                >
                                    {f.desc}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>

                {/* Phần 6: Divider mờ ngăn phần feature và footer */}
                <Box sx={{ mt: 4, height: '1px', bgcolor: 'rgba(255,255,255,0.16)' }} />

                {/* Phần 7: Footer — AvatarGroup + dòng text "1,000+ partners..." */}
                <Box sx={{ mt: 3.25, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AvatarGroup
                        max={4}
                        sx={{
                            '& .MuiAvatar-root': {
                                width: 40,
                                height: 40,
                                fontSize: 14,
                                fontWeight: 700,
                                color: 'common.white',
                                // Viền avatar dùng tone primary.dark cho hợp nền gradient
                                borderColor: (theme) => theme.palette.primary.dark,
                            },
                        }}
                    >
                        {PARTNER_AVATARS.map((avt) => (
                            <Avatar
                                key={avt.name}
                                alt={avt.name}
                                sx={{ bgcolor: avt.bg, color: avt.color || 'common.white' }}
                            >
                                {avt.name.charAt(0).toUpperCase()}
                            </Avatar>
                        ))}
                    </AvatarGroup>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                        1.000+ đối tác đang phát triển cùng Zeno
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
