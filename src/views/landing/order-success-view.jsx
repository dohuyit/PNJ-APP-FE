'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { landingTokens, sxSharpBtnContained, sxSharpBtnOutlined } from 'src/theme/landing';

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('order_id') ?? '101';

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          mx: 'auto',
          mb: 4,
          border: `1px solid ${landingTokens.GOLD}`,
          color: landingTokens.GOLD,
          animation: 'pnjSuccess 600ms ease-out',
          '@keyframes pnjSuccess': {
            from: { transform: 'scale(0.8)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 },
          },
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 72 }} />
      </Box>

      <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
        ĐẶT HÀNG THÀNH CÔNG
      </Typography>
      <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 44 }, mt: 1, mb: 2 }}>
        Cảm ơn quý khách
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 5, lineHeight: 1.75, maxWidth: 420, mx: 'auto' }}>
        Đơn hàng <strong>#PNJ-000{orderId}</strong> đã được tiếp nhận. Nhân viên PNJ sẽ liên hệ xác nhận
        trong vòng 2 giờ làm việc.
      </Typography>

      <Divider sx={{ my: 5, borderColor: landingTokens.HAIRLINE, maxWidth: 240, mx: 'auto' }} />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
        <Button component={Link} href={`/order-info/${orderId}`} variant="contained" sx={sxSharpBtnContained} size="large">
          Theo dõi đơn hàng
        </Button>
        <Button component={Link} href="/" variant="outlined" size="large">
          Về trang chủ
        </Button>
      </Stack>
    </Container>
  );
}

export function OrderSuccessView() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}
