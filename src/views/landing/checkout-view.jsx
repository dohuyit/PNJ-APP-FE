'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

import { fCurrency } from 'src/utils/format-number';

import {
  landingTokens,
  sxSharpBtnCta,
  sxSharpBtnOutlined,
  sxSharpInput,
} from 'src/theme/landing';
import Wireframe from 'src/sections/landing/components/Wireframe';

// Stubs — mock removed; data rỗng cho tới khi view migrate sang useGetXxx hook.
const currentCustomerMock = null;
const newProductsMock = [];

const cities = [
  { id: 1, name: 'TP.HCM' },
  { id: 2, name: 'Hà Nội' },
  { id: 3, name: 'Đà Nẵng' },
];
const districts = [
  { id: 1, name: 'Quận Phú Nhuận' },
  { id: 2, name: 'Quận 1' },
  { id: 3, name: 'Quận 3' },
];
const wards = [
  { id: 1, name: 'Phường 3' },
  { id: 2, name: 'Phường Bến Nghé' },
];

const sizes = ['6', '7', '8', '9', '10', '11', '12', '13'];
const qtys = [1, 2, 1, 1, 3, 1, 2, 1];
const cartItems = newProductsMock.map((p, i) => ({
  id: 2000 + i,
  name: p.product_name,
  image: p.product_image,
  price: p.sale_price,
  size: sizes[i % sizes.length],
  qty: qtys[i % qtys.length],
}));

const deliveryOptions = [
  {
    id: 'home',
    Icon: LocalShippingOutlinedIcon,
    label: 'Giao hàng tận nơi',
    desc: 'Miễn phí toàn quốc · 1–3 ngày',
  },
  {
    id: 'store',
    Icon: StorefrontOutlinedIcon,
    label: 'Nhận tại cửa hàng',
    desc: 'Sẵn sàng sau 2 giờ',
  },
];

const paymentMethods = [
  {
    id: 'cod',
    label: 'Thanh toán khi nhận hàng',
    hint: 'Trả tiền mặt khi nhận sản phẩm',
    Icon: LocalAtmOutlinedIcon,
  },
  {
    id: 'vnpay',
    label: 'VNPAY-QR',
    hint: 'Quét QR qua ứng dụng ngân hàng',
    Icon: QrCode2OutlinedIcon,
  },
  {
    id: 'momo',
    label: 'Ví MoMo',
    hint: 'Thanh toán qua ví điện tử MoMo',
    Icon: AccountBalanceWalletOutlinedIcon,
  },
];

function SectionHeader({ no, title, note }) {
  return (
    <Stack direction="row" spacing={2.5} alignItems="baseline" sx={{ mb: 3 }}>
      <Typography
        sx={{
          fontFamily: landingTokens.FONT_SERIF,
          fontSize: { xs: 28, md: 32 },
          fontWeight: 600,
          color: landingTokens.GOLD,
          lineHeight: 1,
          minWidth: 36,
        }}
      >
        {no}
      </Typography>
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: 18, md: 20 },
            color: landingTokens.INK,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        {note && (
          <Typography
            variant="caption"
            sx={{ color: landingTokens.INK_MUTED, display: 'block', mt: 0.5 }}
          >
            {note}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

export function CheckoutView() {
  const router = useRouter();
  const [payment, setPayment] = useState('cod');
  const [delivery, setDelivery] = useState('home');
  const [vatInvoice, setVatInvoice] = useState(false);
  const [itemsAnchor, setItemsAnchor] = useState(null);

  const subtotal = useMemo(
    () => cartItems.reduce((s, i) => s + i.price * i.qty, 0),
    []
  );
  const total = subtotal;

  const onSubmit = (e) => {
    e.preventDefault();
    router.push('/order-success?order_id=101');
  };

  return (
    <>
      {/* Hero header */}
      <Box
        sx={{
          bgcolor: landingTokens.NEUTRAL,
          borderBottom: `1px solid ${landingTokens.HAIRLINE}`,
          py: { xs: 5, md: 7 },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Breadcrumbs separator="›" sx={{ fontSize: 13, color: landingTokens.INK_MUTED, mb: 2 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Trang chủ
            </Link>
            <Link href="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>
              Giỏ hàng
            </Link>
            <Typography variant="caption" sx={{ color: landingTokens.INK, fontSize: 13 }}>
              Thanh toán
            </Typography>
          </Breadcrumbs>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ sm: 'flex-end' }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: landingTokens.GOLD_DARK,
                  letterSpacing: '0.24em',
                  fontWeight: 700,
                }}
              >
                THANH TOÁN
              </Typography>
              <Typography
                sx={{
                  fontFamily: landingTokens.FONT_SERIF,
                  fontSize: { xs: 34, md: 52 },
                  fontWeight: 600,
                  mt: 0.5,
                  lineHeight: 1.1,
                  color: landingTokens.INK,
                }}
              >
                Hoàn tất đơn hàng
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: landingTokens.INK_MUTED, mt: 1.5 }}
              >
                Vài bước đơn giản để nhận trang sức bạn yêu.
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/cart"
              startIcon={<ArrowBackIcon />}
              sx={{
                color: landingTokens.INK,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { color: landingTokens.PRIMARY, bgcolor: 'transparent' },
              }}
            >
              Quay lại giỏ hàng
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 5, md: 7 } }}>
        {/* Elegant Stepper */}
        <Box sx={{ maxWidth: 680, mx: 'auto', mb: { xs: 5, md: 7 } }}>
          <Stepper
            activeStep={1}
            alternativeLabel
            sx={{
              '@keyframes pnjStepIn': {
                from: { opacity: 0, transform: 'translateY(8px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
              '@keyframes pnjStepPulse': {
                '0%, 100%': {
                  boxShadow: `0 0 0 0 ${landingTokens.PRIMARY}59`,
                  transform: 'scale(1)',
                },
                '50%': {
                  boxShadow: `0 0 0 10px ${landingTokens.PRIMARY}00`,
                  transform: 'scale(1.06)',
                },
              },
              '@keyframes pnjConnectorDraw': {
                from: { backgroundSize: '0% 100%' },
                to: { backgroundSize: '100% 100%' },
              },
              '& .MuiStep-root': {
                opacity: 0,
                animation: 'pnjStepIn 520ms cubic-bezier(.2,.8,.2,1) forwards',
              },
              '& .MuiStep-root:nth-of-type(1)': { animationDelay: '0ms' },
              '& .MuiStep-root:nth-of-type(2)': { animationDelay: '120ms' },
              '& .MuiStep-root:nth-of-type(3)': { animationDelay: '240ms' },
              '& .MuiStepLabel-label': {
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.04em',
                mt: 1,
                transition: 'color 320ms ease',
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: landingTokens.PRIMARY,
                fontWeight: 700,
              },
              '& .MuiStepLabel-label.Mui-completed': {
                color: landingTokens.GOLD_DARK,
              },
              '& .MuiStepIcon-root': {
                fontSize: 32,
                color: landingTokens.HAIRLINE,
                transition: 'color 320ms ease, transform 320ms ease',
              },
              '& .MuiStepIcon-root.Mui-active': {
                color: landingTokens.PRIMARY,
                borderRadius: '50%',
                animation: 'pnjStepPulse 2.2s ease-in-out infinite',
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: landingTokens.GOLD,
              },
              '& .MuiStepConnector-root': {
                top: 16,
              },
              '& .MuiStepConnector-line': {
                borderTopWidth: 0,
                height: 2,
                backgroundColor: landingTokens.HAIRLINE,
                backgroundImage: `linear-gradient(90deg, ${landingTokens.GOLD}, ${landingTokens.GOLD})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '0% 100%',
                transition: 'background-size 520ms cubic-bezier(.2,.8,.2,1)',
              },
              '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line, & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                backgroundSize: '100% 100%',
              },
            }}
          >
            <Step completed>
              <StepLabel>Giỏ hàng</StepLabel>
            </Step>
            <Step active>
              <StepLabel>Thanh toán</StepLabel>
            </Step>
            <Step>
              <StepLabel>Hoàn tất</StepLabel>
            </Step>
          </Stepper>
        </Box>

        <form onSubmit={onSubmit}>
          <Grid container spacing={{ xs: 4, md: 5 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={{ xs: 5, md: 6 }}>
                {/* 01: Contact */}
                <Box>
                  <SectionHeader
                    no="01"
                    title="Thông tin giao nhận"
                    note="Chúng tôi sẽ liên hệ xác nhận đơn qua các thông tin dưới đây."
                  />
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Họ và tên"
                        name="name"
                        defaultValue={currentCustomerMock.username}
                        required
                        sx={sxSharpInput}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        name="phone"
                        defaultValue={currentCustomerMock.phone}
                        required
                        sx={sxSharpInput}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        defaultValue={currentCustomerMock.email}
                        required
                        sx={sxSharpInput}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* 02: Delivery */}
                <Box>
                  <SectionHeader no="02" title="Phương thức nhận hàng" />
                  <RadioGroup
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value)}
                  >
                    <Grid container spacing={2}>
                      {deliveryOptions.map(({ id, Icon, label, desc }) => {
                        const active = id === delivery;
                        return (
                          <Grid key={id} size={{ xs: 12, sm: 6 }}>
                            <Box
                              onClick={() => setDelivery(id)}
                              sx={{
                                position: 'relative',
                                p: 2.5,
                                cursor: 'pointer',
                                border: `1px solid ${active ? landingTokens.PRIMARY : landingTokens.HAIRLINE}`,
                                bgcolor: active ? 'rgba(0,52,104,0.03)' : landingTokens.SURFACE,
                                transition: 'all 200ms ease',
                                '&:hover': {
                                  borderColor: active
                                    ? landingTokens.PRIMARY
                                    : landingTokens.GOLD,
                                },
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Radio
                                  checked={active}
                                  sx={{
                                    p: 0,
                                    color: landingTokens.GOLD_DARK,
                                    '&.Mui-checked': { color: landingTokens.PRIMARY },
                                  }}
                                />
                                <Box
                                  sx={{
                                    color: active
                                      ? landingTokens.PRIMARY
                                      : landingTokens.GOLD_DARK,
                                    display: 'flex',
                                  }}
                                >
                                  <Icon />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 700, lineHeight: 1.35 }}
                                  >
                                    {label}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: landingTokens.INK_MUTED,
                                      display: 'block',
                                    }}
                                  >
                                    {desc}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </RadioGroup>

                  <Grid container spacing={2.5} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        select
                        fullWidth
                        label="Tỉnh / Thành"
                        defaultValue=""
                        sx={sxSharpInput}
                      >
                        <MenuItem value="">-- Chọn --</MenuItem>
                        {cities.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        select
                        fullWidth
                        label="Quận / Huyện"
                        defaultValue=""
                        sx={sxSharpInput}
                      >
                        <MenuItem value="">-- Chọn --</MenuItem>
                        {districts.map((d) => (
                          <MenuItem key={d.id} value={d.id}>
                            {d.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        select
                        fullWidth
                        label="Phường / Xã"
                        defaultValue=""
                        sx={sxSharpInput}
                      >
                        <MenuItem value="">-- Chọn --</MenuItem>
                        {wards.map((w) => (
                          <MenuItem key={w.id} value={w.id}>
                            {w.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Địa chỉ cụ thể (số nhà, tên đường)"
                        defaultValue={currentCustomerMock.address}
                        sx={sxSharpInput}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Ghi chú đơn hàng (tuỳ chọn)"
                        multiline
                        rows={3}
                        placeholder="Ghi chú cho shipper, yêu cầu đóng gói..."
                        sx={sxSharpInput}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* 03: Payment */}
                <Box>
                  <SectionHeader
                    no="03"
                    title="Phương thức thanh toán"
                    note="Thông tin thẻ được mã hoá SSL 256-bit, tuân thủ chuẩn PCI DSS."
                  />
                  <Stack spacing={1.5}>
                    {paymentMethods.map((m) => {
                      const active = m.id === payment;
                      return (
                        <Box
                          key={m.id}
                          onClick={() => setPayment(m.id)}
                          sx={{
                            px: 2,
                            py: 1.25,
                            cursor: 'pointer',
                            border: `1px solid ${active ? landingTokens.PRIMARY : landingTokens.HAIRLINE}`,
                            bgcolor: active ? 'rgba(0,52,104,0.03)' : landingTokens.SURFACE,
                            transition: 'all 200ms ease',
                            '&:hover': {
                              borderColor: active
                                ? landingTokens.PRIMARY
                                : landingTokens.GOLD,
                            },
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Radio
                              checked={active}
                              onChange={() => setPayment(m.id)}
                              size="small"
                              sx={{
                                p: 0,
                                color: landingTokens.GOLD_DARK,
                                '&.Mui-checked': { color: landingTokens.PRIMARY },
                              }}
                            />
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                flexShrink: 0,
                                borderRadius: 0.5,
                                bgcolor: '#FFFFFF',
                                border: `1px solid ${landingTokens.HAIRLINE}`,
                                p: 0.5,
                                display: 'grid',
                                placeItems: 'center',
                                color: landingTokens.GOLD_DARK,
                              }}
                            >
                              <m.Icon sx={{ fontSize: 22 }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, lineHeight: 1.3, fontSize: 13 }}
                              >
                                {m.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: landingTokens.INK_MUTED, display: 'block', fontSize: 11 }}
                              >
                                {m.hint}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>

                {/* 04: VAT invoice (optional) */}
                <Box>
                  <SectionHeader
                    no="04"
                    title="Xuất hoá đơn VAT"
                    note="Tuỳ chọn · Hoá đơn điện tử gửi qua email sau khi đơn hoàn tất."
                  />
                  <Box
                    onClick={() => setVatInvoice((v) => !v)}
                    sx={{
                      p: 2.5,
                      cursor: 'pointer',
                      border: `1px solid ${vatInvoice ? landingTokens.PRIMARY : landingTokens.HAIRLINE}`,
                      bgcolor: vatInvoice ? 'rgba(0,52,104,0.03)' : landingTokens.SURFACE,
                      transition: 'all 200ms ease',
                      '&:hover': {
                        borderColor: vatInvoice ? landingTokens.PRIMARY : landingTokens.GOLD,
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Checkbox
                        checked={vatInvoice}
                        onChange={() => setVatInvoice((v) => !v)}
                        sx={{
                          p: 0,
                          color: landingTokens.GOLD_DARK,
                          '&.Mui-checked': { color: landingTokens.PRIMARY },
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, lineHeight: 1.35 }}
                        >
                          Có, tôi cần xuất hoá đơn VAT cho đơn hàng này
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: landingTokens.INK_MUTED, display: 'block' }}
                        >
                          Cần cung cấp mã số thuế & thông tin công ty.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Collapse in={vatInvoice}>
                    <Grid container spacing={2.5} sx={{ mt: 2 }}>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          label="Tên công ty / đơn vị"
                          name="company_name"
                          required={vatInvoice}
                          sx={sxSharpInput}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Mã số thuế"
                          name="tax_code"
                          required={vatInvoice}
                          sx={sxSharpInput}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email nhận hoá đơn"
                          name="invoice_email"
                          type="email"
                          required={vatInvoice}
                          sx={sxSharpInput}
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          label="Địa chỉ công ty"
                          name="company_address"
                          required={vatInvoice}
                          sx={sxSharpInput}
                        />
                      </Grid>
                    </Grid>
                  </Collapse>
                </Box>
              </Stack>
            </Grid>

            {/* Summary */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ position: { md: 'sticky' }, top: { md: 104 } }}>
                <Box
                  sx={{
                    border: `1px solid ${landingTokens.HAIRLINE}`,
                    bgcolor: landingTokens.SURFACE,
                    p: { xs: 3, md: 4 },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="baseline"
                    justifyContent="space-between"
                    sx={{ mb: 3 }}
                  >
                    <Typography
                      variant="overline"
                      sx={{
                        color: landingTokens.GOLD_DARK,
                        letterSpacing: '0.2em',
                        fontWeight: 700,
                      }}
                    >
                      ĐƠN HÀNG CỦA BẠN
                    </Typography>
                    <Box sx={{ width: 32, height: 1, bgcolor: landingTokens.GOLD }} />
                  </Stack>

                  <Box sx={{ mb: 3 }}>
                    {cartItems.slice(0, 3).map((item, idx) => (
                      <Stack
                        key={item.id}
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{
                          py: 1.25,
                          borderBottom: `1px solid ${landingTokens.HAIRLINE}`,
                          ...(idx === 0 && { pt: 0 }),
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            flexShrink: 0,
                            border: `1px solid ${landingTokens.HAIRLINE}`,
                          }}
                        >
                          <Wireframe label="" iconSize="small" />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              lineHeight: 1.35,
                              fontSize: 13,
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: landingTokens.INK_MUTED,
                              display: 'block',
                              fontSize: 11,
                            }}
                          >
                            Size {item.size} · × {item.qty}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            color: landingTokens.INK,
                            fontSize: 13,
                          }}
                        >
                          {fCurrency(item.price * item.qty)}
                        </Typography>
                      </Stack>
                    ))}

                    {cartItems.length > 3 && (
                      <Box
                        component="button"
                        type="button"
                        onClick={(e) => setItemsAnchor(e.currentTarget)}
                        sx={{
                          mt: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          py: 0.5,
                          px: 0,
                          bgcolor: 'transparent',
                          border: 'none',
                          font: 'inherit',
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: 600,
                          color: landingTokens.GOLD_DARK,
                          transition: 'color 180ms ease',
                          '&:hover': { color: landingTokens.PRIMARY },
                          '&:hover .pnj-more-chev': { transform: 'translateX(3px)' },
                          '&:focus-visible': {
                            outline: `2px solid ${landingTokens.GOLD}`,
                            outlineOffset: 3,
                          },
                        }}
                        aria-label={`Xem ${cartItems.length - 3} sản phẩm còn lại`}
                      >
                        <span>+{cartItems.length - 3} sản phẩm khác</span>
                        <ArrowRightAltIcon
                          className="pnj-more-chev"
                          sx={{ fontSize: 20, transition: 'transform 200ms ease' }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Popover
                    open={Boolean(itemsAnchor)}
                    anchorEl={itemsAnchor}
                    onClose={() => setItemsAnchor(null)}
                    anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                    slotProps={{
                      paper: {
                        sx: {
                          ml: 2,
                          overflow: 'visible',
                          bgcolor: 'transparent',
                          boxShadow:
                            '0 24px 60px rgba(26,20,19,0.14), 0 4px 16px rgba(26,20,19,0.06)',
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: 360,
                        maxHeight: 460,
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: landingTokens.SURFACE,
                        border: `1px solid ${landingTokens.HAIRLINE}`,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderTop: '10px solid transparent',
                          borderBottom: '10px solid transparent',
                          borderRight: `10px solid ${landingTokens.HAIRLINE}`,
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          left: -8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 0,
                          height: 0,
                          borderTop: '9px solid transparent',
                          borderBottom: '9px solid transparent',
                          borderRight: `9px solid ${landingTokens.SURFACE}`,
                        },
                      }}
                    >
                      {/* Header */}
                      <Box
                        sx={{
                          px: 3,
                          pt: 2.5,
                          pb: 2,
                          borderBottom: `1px solid ${landingTokens.HAIRLINE}`,
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Typography
                            variant="overline"
                            sx={{
                              color: landingTokens.GOLD_DARK,
                              letterSpacing: '0.24em',
                              fontWeight: 700,
                              fontSize: 10,
                              lineHeight: 1,
                            }}
                          >
                            CHI TIẾT ĐƠN HÀNG
                          </Typography>
                          <Box sx={{ width: 24, height: 1, bgcolor: landingTokens.GOLD }} />
                        </Stack>
                        <Typography
                          sx={{
                            mt: 0.75,
                            fontSize: 18,
                            fontWeight: 700,
                            color: landingTokens.INK,
                            fontFamily: landingTokens.FONT_SERIF,
                            lineHeight: 1.2,
                          }}
                        >
                          {cartItems.length} sản phẩm
                        </Typography>
                      </Box>

                      {/* Items list */}
                      <Box
                        sx={{
                          flex: 1,
                          overflowY: 'auto',
                          px: 3,
                          py: 0.5,
                          '&::-webkit-scrollbar': { width: 4 },
                          '&::-webkit-scrollbar-thumb': {
                            bgcolor: landingTokens.HAIRLINE,
                            borderRadius: 2,
                          },
                        }}
                      >
                        {cartItems.map((item, idx) => (
                          <Stack
                            key={item.id}
                            direction="row"
                            spacing={1.75}
                            alignItems="center"
                            sx={{
                              py: 1.5,
                              borderBottom:
                                idx === cartItems.length - 1
                                  ? 'none'
                                  : `1px solid ${landingTokens.HAIRLINE}`,
                            }}
                          >
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                flexShrink: 0,
                                border: `1px solid ${landingTokens.HAIRLINE}`,
                                bgcolor: landingTokens.NEUTRAL,
                              }}
                            >
                              <Wireframe label="" iconSize="small" />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                  lineHeight: 1.35,
                                  fontSize: 13,
                                  color: landingTokens.INK,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {item.name}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: landingTokens.INK_MUTED,
                                  letterSpacing: '0.04em',
                                  mt: 0.25,
                                }}
                              >
                                Size {item.size} · × {item.qty}
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: landingTokens.PRIMARY,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {fCurrency(item.price * item.qty)}
                            </Typography>
                          </Stack>
                        ))}
                      </Box>

                      {/* Footer */}
                      <Box
                        sx={{
                          px: 3,
                          py: 2,
                          borderTop: `1px solid ${landingTokens.HAIRLINE}`,
                          bgcolor: landingTokens.NEUTRAL,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="baseline"
                        >
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: landingTokens.INK_MUTED,
                              letterSpacing: '0.04em',
                            }}
                          >
                            Tạm tính
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: landingTokens.PRIMARY,
                            }}
                          >
                            {fCurrency(subtotal)}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                  </Popover>

                  <Divider sx={{ mb: 3, borderColor: landingTokens.HAIRLINE }} />

                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>
                        Tạm tính
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {fCurrency(subtotal)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>
                        Phí vận chuyển
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: landingTokens.GOLD_DARK, fontWeight: 600 }}
                      >
                        Miễn phí
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider sx={{ mb: 3, borderColor: landingTokens.HAIRLINE }} />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                    sx={{ mb: 4 }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Tổng cộng
                    </Typography>
                    <Typography
                      sx={{
                        color: landingTokens.PRIMARY,
                        fontWeight: 700,
                        fontSize: { xs: 22, md: 26 },
                      }}
                    >
                      {fCurrency(total)}
                    </Typography>
                  </Stack>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={sxSharpBtnCta}
                  >
                    Đặt hàng
                  </Button>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mt: 2 }}
                  >
                    <LockOutlinedIcon
                      sx={{ fontSize: 14, color: landingTokens.INK_MUTED }}
                    />
                    <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED }}>
                      Thanh toán được bảo mật SSL 256-bit
                    </Typography>
                  </Stack>
                </Box>

                {/* Trust */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2.5,
                    border: `1px solid ${landingTokens.HAIRLINE}`,
                    bgcolor: landingTokens.NEUTRAL,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <VerifiedUserOutlinedIcon
                      sx={{ color: landingTokens.GOLD_DARK, fontSize: 24, mt: 0.25 }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.35 }}
                      >
                        Cam kết từ PNJ
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.65 }}
                      >
                        Trang sức chuẩn chất liệu niêm yết, kiểm định độc lập, bảo hành trọn đời tại hơn 400 cửa hàng.
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
