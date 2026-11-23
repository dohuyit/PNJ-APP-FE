// src/views/admin/auth/auth-login-view.jsx — split-screen login: left brand panel + right form.

'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { landingTokens } from 'src/theme/landing';
import { MOCK_TEST_USERS } from 'src/mock-data/mock-auth-users';

import { AuthLoginForm } from './auth-login-form';

const PATTERN_BG =
  'radial-gradient(circle at 20% 15%, rgba(196,140,70,0.18), transparent 45%),' +
  'radial-gradient(circle at 80% 80%, rgba(196,140,70,0.12), transparent 50%),' +
  'linear-gradient(140deg, #001F42 0%, #003468 45%, #0A2C5A 100%)';

export function AuthLoginView() {
  const [prefill, setPrefill] = useState(null);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
        bgcolor: '#FFFFFF',
      }}
    >
      {/* LEFT — brand panel (hidden on mobile) */}
      <Box
        sx={{
          position: 'relative',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { md: 6, lg: 8 },
          color: '#FBF7F2',
          background: PATTERN_BG,
          overflow: 'hidden',
        }}
      >
        {/* Decorative gold rings */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            right: -140,
            top: -140,
            width: 480,
            height: 480,
            borderRadius: '50%',
            border: `1px solid ${landingTokens.GOLD}40`,
            opacity: 0.6,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            right: -80,
            top: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            border: `1px solid ${landingTokens.GOLD}30`,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: -100,
            bottom: -120,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${landingTokens.GOLD}15, transparent 70%)`,
          }}
        />

        {/* Top brand */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              display: 'grid',
              placeItems: 'center',
              border: `1.5px solid ${landingTokens.GOLD}`,
              color: landingTokens.GOLD,
              fontFamily: landingTokens.FONT_SERIF,
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: '0.04em',
            }}
          >
            P
          </Box>
          <Stack spacing={0.25}>
            <Typography
              sx={{
                fontFamily: landingTokens.FONT_SERIF,
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: '#FBF7F2',
              }}
            >
              PNJ
            </Typography>
            <Typography sx={{ fontSize: 10, letterSpacing: '0.3em', color: `${landingTokens.GOLD}` }}>
              ADMIN CONSOLE
            </Typography>
          </Stack>
        </Stack>

        {/* Center story */}
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
          <Box
            sx={{
              width: 48,
              height: 2,
              bgcolor: landingTokens.GOLD,
              mb: 4,
            }}
          />
          <Typography
            sx={{
              fontFamily: landingTokens.FONT_SERIF,
              fontSize: { md: 44, lg: 56 },
              fontWeight: 500,
              lineHeight: 1.1,
              mb: 3,
              color: '#FBF7F2',
            }}
          >
            Tinh hoa trang sức Việt,
            <br />
            <Box component="span" sx={{ color: landingTokens.GOLD, fontStyle: 'italic' }}>
              được quản trị trọn vẹn.
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: 15,
              lineHeight: 1.75,
              color: '#E8DFD4',
              opacity: 0.85,
              maxWidth: 420,
            }}
          >
            Nền tảng điều phối toàn bộ hoạt động bán lẻ: sản phẩm, đơn hàng, khách hàng,
            khuyến mãi, cửa hàng — trong cùng một không gian được thiết kế dành riêng cho PNJ.
          </Typography>
        </Box>

        {/* Bottom credit */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ position: 'relative', zIndex: 1, pt: 4, borderTop: `1px solid ${landingTokens.GOLD}30` }}
        >
          <Typography sx={{ fontSize: 11, letterSpacing: '0.22em', color: `${landingTokens.GOLD}` }}>
            SINCE 1988
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#E8DFD4', opacity: 0.65 }}>
            © {new Date().getFullYear()} Công ty Cổ phần Vàng Bạc Đá Quý Phú Nhuận
          </Typography>
        </Stack>
      </Box>

      {/* RIGHT — form */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, sm: 6, md: 6, lg: 10 },
          py: { xs: 6, md: 4 },
          bgcolor: '#FFFFFF',
          position: 'relative',
        }}
      >
        {/* Mobile brand header */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent="center"
          sx={{ display: { xs: 'flex', md: 'none' }, mb: 5 }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              display: 'grid',
              placeItems: 'center',
              border: `1.5px solid ${landingTokens.GOLD}`,
              color: landingTokens.GOLD,
              fontFamily: landingTokens.FONT_SERIF,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            P
          </Box>
          <Stack spacing={0.1}>
            <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: 17, fontWeight: 600, letterSpacing: '0.06em', color: landingTokens.PRIMARY }}>
              PNJ
            </Typography>
            <Typography sx={{ fontSize: 9, letterSpacing: '0.28em', color: landingTokens.GOLD_DARK }}>
              ADMIN CONSOLE
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ maxWidth: 440, width: '100%', mx: 'auto' }}>
          <Typography
            variant="overline"
            sx={{
              color: landingTokens.GOLD_DARK,
              letterSpacing: '0.24em',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            ĐĂNG NHẬP
          </Typography>
          <Typography
            sx={{
              fontFamily: landingTokens.FONT_SERIF,
              fontSize: { xs: 32, sm: 38 },
              fontWeight: 500,
              lineHeight: 1.1,
              mt: 1.5,
              mb: 1,
              color: landingTokens.INK,
            }}
          >
            Chào mừng trở lại.
          </Typography>
          <Typography
            sx={{
              fontSize: 14.5,
              color: landingTokens.INK_MUTED,
              mb: 4,
            }}
          >
            Nhập thông tin tài khoản quản trị PNJ để tiếp tục.
          </Typography>

          <AuthLoginForm prefill={prefill} />

          {/* Dev credentials — click-to-fill mỗi role */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              border: `1px dashed ${landingTokens.HAIRLINE}`,
              bgcolor: landingTokens.NEUTRAL,
              borderRadius: 0.5,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
              <Typography sx={{ fontSize: 11, letterSpacing: '0.18em', color: landingTokens.GOLD_DARK, fontWeight: 700 }}>
                TÀI KHOẢN THỬ NGHIỆM
              </Typography>
              <Typography sx={{ fontSize: 10.5, color: landingTokens.INK_MUTED, fontStyle: 'italic' }}>
                click để tự điền
              </Typography>
            </Stack>
            <Stack spacing={0.5}>
              {MOCK_TEST_USERS.map((u) => (
                <Box
                  key={u.id}
                  onClick={() => setPrefill({ email: u.email, password: u.password, ts: Date.now() })}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center',
                    gap: 1,
                    px: 1,
                    py: 0.75,
                    cursor: 'pointer',
                    border: '1px solid transparent',
                    borderRadius: 0.5,
                    transition: 'background-color .15s, border-color .15s',
                    '&:hover': {
                      bgcolor: '#FFFFFF',
                      borderColor: landingTokens.HAIRLINE,
                    },
                  }}
                >
                  <Box sx={{
                    width: 6, height: 6, borderRadius: '50%', bgcolor: u.role_color, flexShrink: 0,
                  }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 12, color: landingTokens.INK, fontFamily: 'ui-monospace, monospace', lineHeight: 1.2 }} noWrap>
                      {u.email} · {u.password}
                    </Typography>
                    <Typography sx={{ fontSize: 10.5, color: landingTokens.INK_MUTED, lineHeight: 1.3 }} noWrap>
                      {u.role_label} · {u.hint}
                    </Typography>
                  </Box>
                  <Typography sx={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: '0.15em',
                    color: u.role_color, textTransform: 'uppercase', flexShrink: 0,
                  }}>
                    {Array.isArray(u.accessible_store_ids) ? `${u.accessible_store_ids.length} CH` : 'ALL'}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>

        <Typography
          sx={{
            display: { xs: 'block', md: 'none' },
            textAlign: 'center',
            mt: 6,
            fontSize: 11,
            color: landingTokens.INK_MUTED,
          }}
        >
          © {new Date().getFullYear()} PNJ · All rights reserved
        </Typography>
      </Box>
    </Box>
  );
}
