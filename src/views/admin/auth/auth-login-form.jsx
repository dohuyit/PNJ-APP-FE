// src/views/admin/auth/auth-login-form.jsx — email + password form (PNJ luxury style).

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import { adminPaths } from 'src/routes/paths';

import { landingTokens } from 'src/theme/landing';

import { useAuthLogin } from 'src/auth/pnj/use-auth-login';

const labelSx = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',
  color: landingTokens.INK,
  mb: 0.75,
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 0.75,
    fontSize: 14.5,
    bgcolor: '#FFFFFF',
    transition: 'border-color 180ms ease, box-shadow 180ms ease',
    '& fieldset': {
      borderColor: landingTokens.HAIRLINE,
    },
    '&:hover fieldset': {
      borderColor: landingTokens.GOLD,
    },
    '&.Mui-focused fieldset': {
      borderColor: landingTokens.PRIMARY,
      borderWidth: 1.5,
    },
  },
  '& .MuiOutlinedInput-input': {
    py: 1.5,
  },
};

export function AuthLoginForm({ prefill }) {
  const login = useAuthLogin();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (prefill?.email) {
      setEmail(prefill.email);
      setPassword(prefill.password ?? '');
      setError('');
    }
  }, [prefill?.ts]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login({ email, password });
      router.push(adminPaths.dashboard);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Đăng nhập thất bại');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack component="form" spacing={2.5} onSubmit={onSubmit} noValidate>
      {error && (
        <Alert
          severity="error"
          sx={{
            borderRadius: 0.75,
            border: `1px solid ${landingTokens.CTA}30`,
            bgcolor: `${landingTokens.CTA}0D`,
            color: landingTokens.CTA,
            '& .MuiAlert-icon': { color: landingTokens.CTA },
            fontSize: 13,
          }}
        >
          {error}
        </Alert>
      )}

      <Box>
        <Typography sx={labelSx}>Email</Typography>
        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          autoFocus
          placeholder="admin@pnj.local"
          sx={inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon fontSize="small" sx={{ color: landingTokens.INK_MUTED }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box>
        <Typography sx={labelSx}>Mật khẩu</Typography>
        <TextField
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          placeholder="••••••••"
          sx={inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon fontSize="small" sx={{ color: landingTokens.INK_MUTED }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPw((v) => !v)}
                  edge="end"
                  size="small"
                  aria-label="Hiện / ẩn mật khẩu"
                  sx={{ color: landingTokens.INK_MUTED, '&:hover': { color: landingTokens.PRIMARY } }}
                >
                  {showPw ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              sx={{
                p: 0.5,
                color: landingTokens.HAIRLINE,
                '&.Mui-checked': { color: landingTokens.PRIMARY },
                '& .MuiSvgIcon-root': { fontSize: 18 },
              }}
            />
          }
          label={
            <Typography sx={{ fontSize: 13, color: landingTokens.INK }}>
              Ghi nhớ đăng nhập
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
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'inherit',
            color: landingTokens.GOLD_DARK,
            transition: 'color 180ms ease',
            '&:hover': { color: landingTokens.PRIMARY, textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: landingTokens.GOLD },
          }}
        >
          Quên mật khẩu?
        </Box>
      </Stack>

      <Button
        type="submit"
        size="large"
        disabled={busy}
        disableElevation
        sx={{
          mt: 1,
          py: 1.6,
          borderRadius: 0.75,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          bgcolor: landingTokens.PRIMARY,
          color: '#FFFFFF',
          border: `1px solid ${landingTokens.PRIMARY}`,
          position: 'relative',
          transition: 'all 220ms ease',
          '&:hover': {
            bgcolor: landingTokens.PRIMARY_DARK,
            borderColor: landingTokens.GOLD,
            boxShadow: `0 8px 24px ${landingTokens.PRIMARY}2E`,
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
          '&.Mui-disabled': {
            bgcolor: landingTokens.PRIMARY,
            color: '#FFFFFF',
            opacity: 0.65,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 8,
            height: '1px',
            bgcolor: landingTokens.GOLD,
            opacity: 0,
            transition: 'opacity 220ms ease',
          },
          '&:hover::after': { opacity: 0.6 },
        }}
      >
        {busy ? (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CircularProgress size={14} sx={{ color: '#FFFFFF' }} />
            <Box component="span">Đang đăng nhập…</Box>
          </Stack>
        ) : (
          'Đăng nhập'
        )}
      </Button>
    </Stack>
  );
}
