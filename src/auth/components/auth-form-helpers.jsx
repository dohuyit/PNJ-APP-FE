'use client';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
// Bộ helpers UI dùng chung cho các trang auth (login / sign-up / forgot-password).
// Mục tiêu: render đúng giao diện của file zeno-auth.html mẫu nhưng dùng theme tokens
// (primary.main, primary.lighter...) thay vì hard-code màu hex của HTML mẫu.
// ----------------------------------------------------------------------

/**
 * Eyebrow pill ở đầu form — chip nhỏ uppercase với chấm tròn.
 * Map theme: bg = primary.lighter, text = primary.main, dot = primary.main.
 */
export function AuthEyebrow({ children }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 1.75,
        py: 0.875,
        borderRadius: 999,
        bgcolor: 'primary.lighter',
        color: 'primary.main',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        lineHeight: 1,
      }}
    >
      <Box
        component="span"
        sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main' }}
      />
      {children}
    </Box>
  );
}

/**
 * Khối head của form: optional leading icon → eyebrow → title (h1, 32px bold) → subtitle.
 * Khớp với cụm .eyebrow / .h-title / .h-sub của HTML mẫu.
 * Prop `centered`: căn giữa cả icon, title, subtitle (dùng cho trang forgot password).
 */
export function AuthHead({ eyebrow, title, subtitle, leadingIcon, centered = false }) {
  return (
    <Box sx={centered ? { textAlign: 'center' } : undefined}>
      {leadingIcon && (
        <Box
          sx={
            centered
              ? { display: 'flex', justifyContent: 'center' }
              : undefined
          }
        >
          {leadingIcon}
        </Box>
      )}

      {eyebrow && <AuthEyebrow>{eyebrow}</AuthEyebrow>}

      <Typography
        component="h1"
        sx={{
          mt: eyebrow || leadingIcon ? 2.25 : 0,
          fontSize: { xs: 27, sm: 32 },
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          sx={{
            mt: 1.5,
            fontSize: 15,
            color: 'text.secondary',
            lineHeight: 1.6,
            ...(centered && { mx: 'auto', maxWidth: 380 }),
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

/**
 * Submit button — dùng màu primary thường (solid), không gradient.
 * Giữ tên `GradientSubmit` để tránh đụng các import hiện tại ở login/sign-up/forgot-password.
 */
export function GradientSubmit({ children, loading, ...other }) {
  return (
    <LoadingButton
      fullWidth
      type="submit"
      variant="contained"
      color="primary"
      loading={loading}
      sx={(theme) => ({
        mt: 1,
        height: 54,
        borderRadius: 1.75,
        fontSize: 15,
        fontWeight: 700,
        textTransform: 'none',
        color: 'common.white',
        boxShadow: `0 12px 28px -6px ${theme.palette.primary.main}B3, 0 6px 14px -4px ${theme.palette.primary.main}80`,
        transition: theme.transitions.create(['box-shadow', 'transform'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
          color: 'common.white',
          backgroundColor: theme.palette.primary.main,
          transform: 'translateY(-2px)',
          boxShadow: `0 20px 40px -8px ${theme.palette.primary.main}CC, 0 12px 22px -6px ${theme.palette.primary.main}B3`,
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: `0 8px 18px -6px ${theme.palette.primary.main}B3`,
        },
        '&.Mui-disabled': {
          color: 'common.white',
          opacity: 0.7,
          boxShadow: 'none',
        },
        '& .MuiLoadingButton-loadingIndicator': { color: 'common.white' },
      })}
      {...other}
    >
      <Box component="span" sx={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </Box>
    </LoadingButton>
  );
}

/**
 * Icon đứng đầu trang Forgot password — thiết kế "ổ khóa" có chiều sâu:
 *  - Vòng tròn ngoài bằng primary.lighter (làm ring nhẹ)
 *  - Vòng tròn trong gradient primary.light → primary.main + soft shadow màu primary
 *  - Icon ổ khóa trắng ở giữa
 * Dùng cùng AuthHead(centered) để căn giữa cả khối icon + title + subtitle.
 */
export function ForgotIcon() {
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        width: 88,
        height: 88,
        mb: 3,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.lighter',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 10,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          boxShadow: `0 12px 28px -8px ${theme.palette.primary.main}80`,
        },
      })}
    >
      <Iconify
        icon="solar:lock-keyhole-minimalistic-bold"
        width={32}
        sx={{ color: 'common.white', position: 'relative', zIndex: 1 }}
      />
    </Box>
  );
}

/** Banner xanh "Reset link sent..." sau khi gửi forgot-password thành công. */
export function SentBanner({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        px: 2,
        py: 1.75,
        borderRadius: 1.75,
        bgcolor: 'rgba(34,160,107,0.08)',
        border: '1px solid rgba(34,160,107,0.25)',
        color: 'success.darker',
      }}
    >
      <Iconify icon="eva:checkmark-fill" width={18} sx={{ color: 'success.main' }} />
      <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>
        {children || 'Reset link sent. Please check your inbox.'}
      </Typography>
    </Box>
  );
}

/**
 * Password strength meter — 4 ô đo độ mạnh + label gợi ý.
 * Tính score dựa trên length / hoa-thường / số / ký tự đặc biệt (giống HTML mẫu).
 */
export function PasswordStrength({ value }) {
  const score = useMemo(() => {
    let s = 0;
    if (value.length >= 8) s += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) s += 1;
    if (/\d/.test(value)) s += 1;
    if (/[^A-Za-z0-9]/.test(value)) s += 1;
    return Math.min(s, 4);
  }, [value]);

  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['error.main', 'warning.main', 'warning.light', 'success.main', 'success.main'];

  if (!value) return null;

  return (
    <Box sx={{ mt: 1.125 }}>
      <Box sx={{ display: 'flex', gap: 0.625 }}>
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              height: 4,
              flex: 1,
              borderRadius: 0.5,
              bgcolor: i < score ? colors[score] : 'grey.300',
              transition: 'background-color 0.25s',
            }}
          />
        ))}
      </Box>
      <Typography sx={{ mt: 0.875, fontSize: 12, fontWeight: 500, color: 'text.disabled' }}>
        {labels[score]}
      </Typography>
    </Box>
  );
}

/**
 * Link "Back to sign in" với icon mũi tên — dùng ở trang Forgot password.
 */
export function BackToSignIn({ href = '/login', label = 'Quay lại trang đăng nhập' }) {
  return (
    <Box sx={{ textAlign: 'center', mt: 3 }}>
      <Link
        component={RouterLink}
        href={href}
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: 'text.primary',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          '&:hover': { color: 'primary.main' },
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={18} />
        {label}
      </Link>
    </Box>
  );
}

/**
 * Dòng switch nằm bên phải topbar (logo + switch ở cùng hàng trên cùng).
 * Render trong slot `topRight` của AuthSplitContent.
 *
 * VD: <TopbarSwitch text="Already have an account?" ctaText="Sign in" href="/login" />
 */
export function TopbarSwitch({ text, ctaText, href }) {
  return (
    <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
      {text}{' '}
      <Link
        component={RouterLink}
        href={href}
        sx={{
          ml: 0.5,
          fontWeight: 700,
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        {ctaText}
      </Link>
    </Box>
  );
}
