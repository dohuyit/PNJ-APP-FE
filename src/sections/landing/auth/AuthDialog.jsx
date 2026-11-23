'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { Logo } from 'src/components/logo';
import { landingTokens, sxSharpBtnContained, sxSharpInput } from 'src/theme/landing';

const inputSx = sxSharpInput;

function FieldLabel({ children, required }) {
  return (
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 600,
        color: landingTokens.INK,
        letterSpacing: '0.02em',
        mb: 0.75,
      }}
    >
      {children}
      {required && (
        <Box component="span" sx={{ color: landingTokens.CTA, ml: 0.5 }}>
          *
        </Box>
      )}
    </Typography>
  );
}

const socialBtnSx = {
  borderRadius: 1,
  borderColor: landingTokens.HAIRLINE,
  color: landingTokens.INK,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: 13,
  py: 0.875,
  justifyContent: 'center',
  transition: 'all 200ms ease',
  '&:hover': {
    borderColor: landingTokens.PRIMARY,
    bgcolor: 'rgba(0,52,104,0.03)',
    color: landingTokens.PRIMARY,
  },
};

// shortcut: UI-only, upgrade when auth API exists.
export default function AuthDialog({ open, mode = 'sign-in', onClose, onSwitchMode }) {
  const [showPw, setShowPw] = useState(false);
  const isSignUp = mode === 'sign-up';

  const onSubmit = (e) => e.preventDefault();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
          },
        },
      }}
    >
      {/* Close */}
      <IconButton
        onClick={onClose}
        aria-label="Đóng"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          color: landingTokens.INK_MUTED,
          '&:hover': { color: landingTokens.PRIMARY },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Logo
            href="/"
            sx={{ height: 44, width: 'auto', display: 'inline-flex' }}
          />
        </Box>

        {/* Title */}
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: { xs: 18, md: 20 },
            fontWeight: 700,
            color: landingTokens.PRIMARY,
            mb: 0.5,
          }}
        >
          {isSignUp ? 'Tạo tài khoản mới' : 'Chào mừng trở lại'}
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            color: landingTokens.INK_MUTED,
            fontSize: 13,
            mb: 3,
          }}
        >
          {isSignUp
            ? 'Đăng ký để nhận ưu đãi dành riêng cho thành viên.'
            : 'Đăng nhập để tiếp tục hành trình cùng PNJ.'}
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={onSubmit} noValidate>
          <Stack spacing={1.25}>
            {isSignUp && (
              <Box>
                <FieldLabel required>Họ và tên</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  name="username"
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  required
                  sx={inputSx}
                />
              </Box>
            )}
            <Box>
              <FieldLabel required>Email</FieldLabel>
              <TextField
                fullWidth
                size="small"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                autoComplete="email"
                required
                sx={inputSx}
              />
            </Box>
            <Box>
              <FieldLabel required>Mật khẩu</FieldLabel>
              <TextField
                fullWidth
                size="small"
                name="password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                sx={inputSx}
                InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPw((v) => !v)}
                      edge="end"
                      size="small"
                      aria-label="Hiện / ẩn mật khẩu"
                      sx={{ color: landingTokens.INK_MUTED }}
                    >
                      {showPw ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            </Box>

            {!isSignUp && (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: -0.5 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        p: 0.5,
                        color: landingTokens.GOLD_DARK,
                        '&.Mui-checked': { color: landingTokens.PRIMARY },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 12, color: landingTokens.INK_MUTED }}>
                      Ghi nhớ
                    </Typography>
                  }
                  sx={{ ml: 0 }}
                />
                <Box
                  component="button"
                  type="button"
                  sx={{
                    bgcolor: 'transparent',
                    border: 'none',
                    p: 0,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    color: landingTokens.GOLD_DARK,
                    '&:hover': { color: landingTokens.PRIMARY },
                  }}
                >
                  Quên mật khẩu?
                </Box>
              </Stack>
            )}

            {isSignUp && (
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: -0.5 }}>
                <Checkbox
                  size="small"
                  required
                  disableRipple
                  sx={{
                    p: 0,
                    flexShrink: 0,
                    color: landingTokens.GOLD_DARK,
                    '&.Mui-checked': { color: landingTokens.PRIMARY },
                    '& .MuiSvgIcon-root': { fontSize: 18 },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 12,
                    color: landingTokens.INK_MUTED,
                    lineHeight: 1.65,
                  }}
                >
                  Tôi đồng ý với{' '}
                  <Box
                    component="a"
                    href="/policy/terms"
                    sx={{
                      color: landingTokens.PRIMARY,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    điều khoản dịch vụ
                  </Box>{' '}
                  của PNJ.
                </Typography>
              </Stack>
            )}

            <Button
              type="submit"
              size="large"
              fullWidth
              sx={{
                ...sxSharpBtnContained,
                py: 1.25,
                fontSize: 13,
                letterSpacing: '0.08em',
              }}
            >
              {isSignUp ? 'TẠO TÀI KHOẢN' : 'ĐĂNG NHẬP'}
            </Button>
          </Stack>
        </Box>

        {/* Divider */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 3 }}>
          <Box sx={{ flex: 1, height: 1, bgcolor: landingTokens.HAIRLINE }} />
          <Typography
            sx={{
              fontSize: 10,
              letterSpacing: '0.24em',
              fontWeight: 700,
              color: landingTokens.GOLD_DARK,
            }}
          >
            HOẶC
          </Typography>
          <Box sx={{ flex: 1, height: 1, bgcolor: landingTokens.HAIRLINE }} />
        </Stack>

        {/* Social */}
        <Stack spacing={1}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon fontSize="small" />}
            sx={socialBtnSx}
          >
            Tiếp tục với Google
          </Button>
        </Stack>

        {/* Switch mode */}
        <Stack direction="row" justifyContent="center" spacing={0.75} sx={{ mt: 2.5 }}>
          <Typography sx={{ fontSize: 13, color: landingTokens.INK_MUTED }}>
            {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
          </Typography>
          <Box
            component="button"
            type="button"
            onClick={onSwitchMode}
            sx={{
              bgcolor: 'transparent',
              border: 'none',
              p: 0,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              color: landingTokens.PRIMARY,
              fontFamily: 'inherit',
              transition: 'color 180ms ease',
              '&:hover': {
                color: landingTokens.GOLD_DARK,
                textDecoration: 'underline',
                textDecorationColor: landingTokens.GOLD,
                textUnderlineOffset: '3px',
                textDecorationThickness: '1px',
              },
            }}
          >
            {isSignUp ? 'Đăng nhập' : 'Đăng ký ngay'}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
