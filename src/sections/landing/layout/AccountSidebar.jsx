'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { landingTokens } from 'src/theme/landing';

// Stubs — mock removed; data rỗng cho tới khi view migrate sang useGetXxx hook.
const currentCustomerMock = null;

const navItems = (customerId) => [
  { label: 'Thông tin tài khoản', icon: <PersonOutlineIcon />, href: `/account/${customerId}`, matches: (p) => p.startsWith('/account/') },
  { label: 'Lịch sử mua hàng', icon: <LocalMallOutlinedIcon />, href: `/order/${customerId}`, matches: (p) => p.startsWith('/order/') || p.startsWith('/order-info/') },
  { label: 'Mã giảm giá', icon: <LocalOfferOutlinedIcon />, href: '/voucher', matches: (p) => p.startsWith('/voucher') },
  { label: 'Sản phẩm yêu thích', icon: <FavoriteBorderOutlinedIcon />, href: '/wishlist', matches: (p) => p.startsWith('/wishlist') },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const customer = currentCustomerMock;
  const items = navItems(customer.id);

  return (
    <Box
      component="aside"
      sx={{
        bgcolor: landingTokens.SURFACE,
        border: `1px solid ${landingTokens.HAIRLINE}`,
        p: { xs: 2, md: 3 },
        position: { md: 'sticky' },
        top: { md: 96 },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Avatar
          src={customer.avatar}
          alt={customer.username}
          sx={{ width: 56, height: 56, border: `1px solid ${landingTokens.GOLD}` }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.18em' }}>
            XIN CHÀO
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {customer.username}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        {items.map((it) => {
          const active = it.matches(pathname);
          return (
            <ListItemButton
              key={it.label}
              component={Link}
              href={it.href}
              sx={{
                mb: 0.5,
                borderLeft: `2px solid ${active ? landingTokens.PRIMARY : 'transparent'}`,
                bgcolor: active ? 'rgba(139,26,31,0.04)' : 'transparent',
                color: active ? landingTokens.PRIMARY : landingTokens.INK,
                '&:hover': { bgcolor: 'rgba(201,168,105,0.08)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: active ? landingTokens.PRIMARY : landingTokens.INK_MUTED }}>
                {it.icon}
              </ListItemIcon>
              <ListItemText primary={it.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 500 }} />
            </ListItemButton>
          );
        })}
        <Divider sx={{ my: 1.5 }} />
        <ListItemButton href="#" sx={{ color: landingTokens.INK_MUTED }}>
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" primaryTypographyProps={{ fontSize: 14 }} />
        </ListItemButton>
      </List>
    </Box>
  );
}
