'use client';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { landingTokens } from 'src/theme/landing';
import AccountSidebar from 'src/sections/landing/layout/AccountSidebar';
import LandingFooterMui from 'src/sections/landing/layout/LandingFooterMui';
import LandingNavbar from 'src/sections/landing/layout/LandingNavbar';

const ACCOUNT_SEGMENTS = ['voucher', 'account', 'order', 'order-info', 'wishlist'];

function matchSegment(path, segments) {
  return segments.some((s) => path === `/${s}` || path.startsWith(`/${s}/`));
}

export default function LandingLayout({ children }) {
  const path = usePathname() || '';

  if (matchSegment(path, ACCOUNT_SEGMENTS)) {
    return (
      <Box sx={{ bgcolor: landingTokens.PAPER, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <LandingNavbar />
        <Box component="main" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
          <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid size={{ xs: 12, md: 3 }}>
                <AccountSidebar />
              </Grid>
              <Grid size={{ xs: 12, md: 9 }}>{children}</Grid>
            </Grid>
          </Container>
        </Box>
        <LandingFooterMui />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: landingTokens.PAPER, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <LandingNavbar />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <LandingFooterMui />
    </Box>
  );
}

