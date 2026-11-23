'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';

import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

import { landingTokens, sxSharpBtnContained, sxSharpBtnOutlined } from 'src/theme/landing';
import Wireframe from 'src/sections/landing/components/Wireframe';

// Stubs — mock removed; data rỗng cho tới khi view migrate sang useGetXxx hook.
const currentCustomerMock = null;
const ordersMock = [];

const statusMeta = {
  processing: { label: 'Đang xử lý', color: landingTokens.GOLD_DARK, bg: 'rgba(196,140,70,0.12)' },
  shipping: { label: 'Đang vận chuyển', color: landingTokens.PRIMARY, bg: 'rgba(0,52,104,0.08)' },
  completed: { label: 'Đã giao hàng', color: landingTokens.GOLD_DARK, bg: 'rgba(196,140,70,0.12)' },
  cancelled: { label: 'Đã huỷ', color: landingTokens.INK_MUTED, bg: 'rgba(90,90,90,0.08)' },
};

const stageSteps = ['Đặt hàng', 'Xác nhận', 'Đang giao', 'Hoàn tất'];
const stageIndexByStatus = { processing: 1, shipping: 2, completed: 3, cancelled: 1 };

function StatusPill({ status }) {
  const meta = statusMeta[status] ?? statusMeta.processing;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.5,
        py: 0.75,
        bgcolor: meta.bg,
        color: meta.color,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.06em',
        lineHeight: 1,
      }}
    >
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'currentColor' }} />
      {meta.label.toUpperCase()}
    </Box>
  );
}

function PanelHead({ Icon, title }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          display: 'grid',
          placeItems: 'center',
          border: `1px solid ${landingTokens.GOLD}`,
          color: landingTokens.GOLD_DARK,
        }}
      >
        <Icon sx={{ fontSize: 16 }} />
      </Box>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: landingTokens.INK,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

export function OrderInfoView({ params }) {
  const { id } = params;
  const order = ordersMock.find((o) => String(o.id) === String(id)) ?? ordersMock[0];
  const customer = currentCustomerMock;
  const activeStep = stageIndexByStatus[order.status] ?? 1;
  const itemsTotal = order.items.reduce((s, i) => s + i.sale_price * i.quantity, 0);

  return (
    <Box>
      {/* Hero */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'flex-end' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <Typography
              variant="overline"
              sx={{
                color: landingTokens.GOLD_DARK,
                letterSpacing: '0.24em',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              CHI TIẾT ĐƠN HÀNG
            </Typography>
            <Box sx={{ width: 24, height: 1, bgcolor: landingTokens.GOLD }} />
          </Stack>
          <Typography
            sx={{
              fontFamily: landingTokens.FONT_SERIF,
              fontSize: { xs: 28, md: 36 },
              fontWeight: 700,
              color: landingTokens.INK,
              lineHeight: 1.2,
              fontFamily: 'ui-monospace, Menlo, monospace',
            }}
          >
            {order.code}
          </Typography>
          <Typography sx={{ color: landingTokens.INK_MUTED, mt: 1, fontSize: 13 }}>
            Đặt lúc {fDate(order.created_at, 'DD-MM-YYYY')}
          </Typography>
        </Box>
        <Button
          component={Link}
          href={`/order/${customer.id}`}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: landingTokens.INK,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { color: landingTokens.PRIMARY, bgcolor: 'transparent' },
          }}
        >
          Quay lại danh sách
        </Button>
      </Stack>

      {/* Status + Stepper */}
      <Box
        sx={{
          bgcolor: landingTokens.SURFACE,
          border: `1px solid ${landingTokens.HAIRLINE}`,
          p: { xs: 3, md: 4 },
          mb: 3,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ md: 'center' }}
          spacing={1.5}
          sx={{ mb: order.status !== 'cancelled' ? 4 : 0 }}
        >
          <StatusPill status={order.status} />
          <Typography sx={{ fontSize: 12, color: landingTokens.INK_MUTED }}>
            {order.status === 'cancelled'
              ? 'Đơn đã huỷ, liên hệ hỗ trợ nếu cần.'
              : 'Cập nhật tự động khi đơn thay đổi trạng thái.'}
          </Typography>
        </Stack>

        {order.status !== 'cancelled' && (
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              '@keyframes pnjStepIn': {
                from: { opacity: 0, transform: 'translateY(8px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
              '@keyframes pnjStepPulse': {
                '0%, 100%': { boxShadow: `0 0 0 0 ${landingTokens.PRIMARY}59` },
                '50%': { boxShadow: `0 0 0 10px ${landingTokens.PRIMARY}00` },
              },
              '& .MuiStep-root': {
                opacity: 0,
                animation: 'pnjStepIn 520ms cubic-bezier(.2,.8,.2,1) forwards',
              },
              '& .MuiStep-root:nth-of-type(1)': { animationDelay: '0ms' },
              '& .MuiStep-root:nth-of-type(2)': { animationDelay: '100ms' },
              '& .MuiStep-root:nth-of-type(3)': { animationDelay: '200ms' },
              '& .MuiStep-root:nth-of-type(4)': { animationDelay: '300ms' },
              '& .MuiStepLabel-label': {
                fontWeight: 600,
                fontSize: 12,
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
                fontSize: 28,
                color: landingTokens.HAIRLINE,
                transition: 'color 320ms ease',
              },
              '& .MuiStepIcon-root.Mui-active': {
                color: landingTokens.PRIMARY,
                borderRadius: '50%',
                animation: 'pnjStepPulse 2.2s ease-in-out infinite',
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: landingTokens.GOLD,
              },
              '& .MuiStepConnector-root': { top: 14 },
              '& .MuiStepConnector-line': {
                borderTopWidth: 0,
                height: 2,
                backgroundColor: landingTokens.HAIRLINE,
                backgroundImage: `linear-gradient(90deg, ${landingTokens.GOLD}, ${landingTokens.GOLD})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '0% 100%',
                transition: 'background-size 520ms cubic-bezier(.2,.8,.2,1)',
              },
              '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line, & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line':
                { backgroundSize: '100% 100%' },
            }}
          >
            {stageSteps.map((s) => (
              <Step key={s}>
                <StepLabel>{s}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Left: items + summary */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            sx={{
              bgcolor: landingTokens.SURFACE,
              border: `1px solid ${landingTokens.HAIRLINE}`,
              p: { xs: 3, md: 4 },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
              <Typography
                variant="overline"
                sx={{
                  color: landingTokens.GOLD_DARK,
                  letterSpacing: '0.24em',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                SẢN PHẨM
              </Typography>
              <Box sx={{ width: 20, height: 1, bgcolor: landingTokens.GOLD }} />
              <Typography sx={{ fontSize: 12, color: landingTokens.INK_MUTED, ml: 'auto' }}>
                {order.items.length} sản phẩm
              </Typography>
            </Stack>

            <Stack
              divider={<Divider sx={{ borderColor: landingTokens.HAIRLINE }} />}
              spacing={0}
            >
              {order.items.map((item, i) => (
                <Stack key={i} direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      flexShrink: 0,
                      border: `1px solid ${landingTokens.HAIRLINE}`,
                    }}
                  >
                    <Wireframe label="" iconSize="small" />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: landingTokens.INK,
                        lineHeight: 1.4,
                        mb: 0.5,
                      }}
                    >
                      {item.product_name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: landingTokens.INK_MUTED }}>
                      Size {item.size} · Số lượng {item.quantity}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: landingTokens.INK,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {fCurrency(item.sale_price * item.quantity)}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 3, borderColor: landingTokens.HAIRLINE }} />

            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: landingTokens.INK_MUTED }}>
                  Tạm tính
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{fCurrency(itemsTotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: 13, color: landingTokens.INK_MUTED }}>
                  Phí vận chuyển
                </Typography>
                <Typography sx={{ fontSize: 13, color: landingTokens.GOLD_DARK, fontWeight: 600 }}>
                  Miễn phí
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 2, borderColor: landingTokens.HAIRLINE }} />

            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Tổng cộng</Typography>
              <Typography
                sx={{
                  fontFamily: landingTokens.FONT_SERIF,
                  fontSize: 22,
                  fontWeight: 700,
                  color: landingTokens.PRIMARY,
                }}
              >
                {fCurrency(order.total)}
              </Typography>
            </Stack>
          </Box>
        </Grid>

        {/* Right: recipient, payment, actions */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2.5}>
            <Box
              sx={{
                bgcolor: landingTokens.SURFACE,
                border: `1px solid ${landingTokens.HAIRLINE}`,
                p: { xs: 3, md: 3.5 },
              }}
            >
              <PanelHead Icon={PersonOutlineOutlinedIcon} title="Người nhận" />
              <Stack spacing={1.25}>
                <Field label="Họ tên" value={customer.username} />
                <Field label="Số điện thoại" value={customer.phone} />
                <Field label="Địa chỉ giao" value={customer.address} multiline />
              </Stack>
            </Box>

            <Box
              sx={{
                bgcolor: landingTokens.SURFACE,
                border: `1px solid ${landingTokens.HAIRLINE}`,
                p: { xs: 3, md: 3.5 },
              }}
            >
              <PanelHead Icon={LocalShippingOutlinedIcon} title="Vận chuyển" />
              <Field label="Phương thức" value="Giao hàng nhanh" />
              <Typography sx={{ fontSize: 12, color: landingTokens.INK_MUTED, mt: 1 }}>
                Giao trong 1–3 ngày làm việc.
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: landingTokens.SURFACE,
                border: `1px solid ${landingTokens.HAIRLINE}`,
                p: { xs: 3, md: 3.5 },
              }}
            >
              <PanelHead Icon={PaymentOutlinedIcon} title="Thanh toán" />
              <Field label="Phương thức" value="Thanh toán khi nhận hàng" />
              <Divider sx={{ my: 1.5, borderColor: landingTokens.HAIRLINE }} />
              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography sx={{ fontSize: 12, color: landingTokens.INK_MUTED }}>
                  Số tiền cần trả
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: landingTokens.PRIMARY,
                  }}
                >
                  {fCurrency(order.total)}
                </Typography>
              </Stack>
            </Box>

            {/* Actions */}
            <Stack spacing={1.25}>
              {order.status === 'completed' && (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ReplayOutlinedIcon />}
                  sx={sxSharpBtnContained}
                >
                  Mua lại đơn này
                </Button>
              )}
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<HeadsetMicOutlinedIcon />}
                sx={sxSharpBtnOutlined}
              >
                Liên hệ hỗ trợ
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

function Field({ label, value, multiline }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 11,
          color: landingTokens.INK_MUTED,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: landingTokens.INK,
          lineHeight: multiline ? 1.55 : 1.3,
          mt: 0.25,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
