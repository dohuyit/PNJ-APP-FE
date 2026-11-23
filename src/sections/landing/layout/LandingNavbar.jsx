'use client';

import Link from 'next/link';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';

import { landingTokens } from 'src/theme/landing';
import AuthDialog from 'src/sections/landing/auth/AuthDialog';

const topLeftLinks = [
  { label: 'Câu Chuyện PNJ', icon: <AutoStoriesOutlinedIcon fontSize="small" />, href: '/about' },
  { label: 'Cửa Hàng', icon: <StorefrontOutlinedIcon fontSize="small" />, href: '/stores' },
  { label: 'Tuyển dụng', icon: <WorkOutlineOutlinedIcon fontSize="small" />, href: '/tuyen-dung' },
];

const navCategories = [
  { label: 'Nữ', href: '/category/product-type/1' },
  { label: 'Nam', href: '/category/product-type/2' },
  { label: 'Trẻ em', href: '/category/product-type/3' },
  { label: 'Cưới hỏi', href: '/cuoi-hoi', highlight: true },
  { label: 'Kim cương', href: '/kim-cuong' },
  { label: 'Dịch vụ', href: '/dich-vu' },
  { label: 'Giá vàng', href: '/gia-vang' },
  { label: 'Quà tặng', href: '/qua-tang' },
  { label: 'KH thân thiết', href: '/khach-hang-than-thiet' },
];

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);

  const openAuth = (mode) => (e) => {
    if (e) e.preventDefault();
    setAuthMode(mode);
  };
  const closeAuth = () => setAuthMode(null);
  const switchAuth = () =>
    setAuthMode((m) => (m === 'sign-in' ? 'sign-up' : 'sign-in'));

  return (
    <>
      {/* Top navy strip */}
      <Box sx={{ bgcolor: landingTokens.PRIMARY_DARK, height: 10 }} />

      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          bgcolor: '#FFFFFF',
          borderBottom: `1px solid ${landingTokens.HAIRLINE}`,
          boxShadow: 'none',
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          {/* Main row: icons left · logo center · hotline/account/cart right */}
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 48, md: 56 },
              display: 'grid',
              gridTemplateColumns: { xs: 'auto 1fr auto', md: '1fr auto 1fr' },
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Left: icon links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Stack direction="row" spacing={2.5}>
                {topLeftLinks.map((l) => (
                  <Stack
                    key={l.label}
                    component={Link}
                    href={l.href}
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{
                      textDecoration: 'none',
                      color: landingTokens.INK,
                      fontSize: 13,
                      fontWeight: 500,
                      '&:hover': { color: landingTokens.PRIMARY },
                    }}
                  >
                    <Box sx={{ color: landingTokens.PRIMARY, display: 'inline-flex' }}>{l.icon}</Box>
                    <span>{l.label}</span>
                  </Stack>
                ))}
              </Stack>
            </Box>

            {/* Mobile hamburger */}
            <IconButton
              edge="start"
              onClick={() => setOpen(true)}
              aria-label="Mở menu"
              sx={{ display: { md: 'none' }, color: landingTokens.PRIMARY }}
            >
              <MenuIcon />
            </IconButton>

            {/* Center: logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              <Box
                component="img"
                src="/logo/logo-full.png"
                alt="PNJ"
                sx={{ height: { xs: 32, md: 44 }, width: 'auto', display: 'block' }}
              />
            </Box>

            {/* Right: hotline · account · cart */}
            <Stack direction="row" spacing={{ xs: 1, md: 3 }} justifyContent="flex-end" alignItems="center">
              <Stack
                component="a"
                href="tel:18005454 57"
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{
                  textDecoration: 'none',
                  color: landingTokens.INK,
                  fontSize: 13,
                  fontWeight: 600,
                  display: { xs: 'none', md: 'inline-flex' },
                  '&:hover': { color: landingTokens.PRIMARY },
                }}
              >
                <HeadsetMicOutlinedIcon fontSize="small" sx={{ color: landingTokens.PRIMARY }} />
                <span>1800 54 54 57</span>
              </Stack>

              <Stack
                component="button"
                type="button"
                onClick={openAuth('sign-in')}
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{
                  bgcolor: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  font: 'inherit',
                  color: landingTokens.INK,
                  fontSize: 13,
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:hover': { color: landingTokens.PRIMARY },
                }}
              >
                <PersonOutlineIcon fontSize="small" sx={{ color: landingTokens.PRIMARY }} />
                <span>Tài khoản của tôi</span>
              </Stack>
              <IconButton
                onClick={openAuth('sign-in')}
                aria-label="Tài khoản"
                sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: landingTokens.PRIMARY }}
              >
                <PersonOutlineIcon />
              </IconButton>

              <Stack
                component={Link}
                href="/cart"
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{
                  textDecoration: 'none',
                  color: landingTokens.INK,
                  fontSize: 13,
                  fontWeight: 500,
                  '&:hover': { color: landingTokens.PRIMARY },
                }}
              >
                <Badge
                  badgeContent={1}
                  color="error"
                  sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}
                >
                  <ShoppingBagOutlinedIcon fontSize="small" sx={{ color: landingTokens.PRIMARY }} />
                </Badge>
                <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>Giỏ hàng</Box>
              </Stack>
            </Stack>
          </Toolbar>

          <Divider sx={{ borderColor: landingTokens.HAIRLINE }} />

          {/* Second row: nav categories + search */}
          <Toolbar
            disableGutters
            sx={{ minHeight: { xs: 48, md: 56 }, justifyContent: 'space-between', gap: 2 }}
          >
            <Stack direction="row" spacing={{ xs: 2, md: 4 }}>
              {navCategories.map((n) => (
                <Box
                  key={n.label}
                  component={Link}
                  href={n.href}
                  sx={{
                    textDecoration: 'none',
                    color: landingTokens.INK,
                    fontSize: { xs: 14, md: 15 },
                    fontWeight: 600,
                    py: 1,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: '2px',
                      bgcolor: landingTokens.PRIMARY,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 260ms ease',
                    },
                    '&:hover': { color: landingTokens.PRIMARY },
                    '&:hover::after': { transform: 'scaleX(1)' },
                  }}
                >
                  {n.label}
                </Box>
              ))}
            </Stack>

            <Box
              component="form"
              action="/search"
              method="get"
              role="search"
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#F5F6F8',
                borderRadius: 999,
                px: 2,
                py: 0.5,
                minWidth: { xs: 180, md: 320 },
              }}
            >
              <InputBase
                name="input-search"
                placeholder="Tìm kiếm nhanh"
                inputProps={{ 'aria-label': 'Tìm kiếm' }}
                sx={{ fontSize: 14, flex: 1, color: landingTokens.INK }}
              />
              <SearchIcon fontSize="small" sx={{ color: landingTokens.INK_MUTED }} />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 300 } }}>
        <Box sx={{ p: 3 }}>
          <Box component="img" src="/logo/logo-full.png" alt="PNJ" sx={{ height: 36 }} />
        </Box>
        <Divider />
        <List>
          {[...topLeftLinks, ...navCategories].map((it) => (
            <ListItemButton
              key={it.label}
              component={Link}
              href={it.href}
              onClick={() => setOpen(false)}
            >
              <ListItemText primary={it.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <AuthDialog
        open={authMode !== null}
        mode={authMode ?? 'sign-in'}
        onClose={closeAuth}
        onSwitchMode={switchAuth}
      />
    </>
  );
}
