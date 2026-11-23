'use client';

import Link from 'next/link';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

import { landingTokens, sxSharpBtnContained, sxSharpBtnOutlined } from 'src/theme/landing';

// Stubs — mock removed; data rỗng cho tới khi view migrate sang useGetXxx hook.
const vouchersMock = [];

const validVouchers = vouchersMock;
const usedVouchers = [];
const expiredVouchers = [];

const faqs = [
  { q: 'Làm thế nào để sử dụng mã giảm giá?', a: 'Sao chép mã và dán vào ô "Mã giảm giá" ở trang thanh toán, hoặc bấm "Sử dụng ngay" để hệ thống tự áp dụng.' },
  { q: 'Tại sao mã của tôi không áp dụng được?', a: 'Kiểm tra lại giá trị đơn tối thiểu, danh mục áp dụng và thời hạn sử dụng của mã.' },
  { q: 'Có thể dùng nhiều mã cho một đơn không?', a: 'Mỗi đơn hàng chỉ áp dụng được một mã giảm giá. Hãy chọn mã có giá trị giảm cao nhất.' },
];

function VoucherCard({ voucher, variant }) {
  const expired = variant === 'expired';
  const used = variant === 'used';
  const inactive = expired || used;
  const percentage = voucher.is_fixed === 0;

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(voucher.voucher_code);
    } catch {
      /* noop */
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        minHeight: 160,
        bgcolor: '#FFFFFF',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: inactive
          ? '0 2px 10px rgba(0,52,104,0.04)'
          : '0 4px 20px rgba(0,52,104,0.08)',
        opacity: inactive ? 0.6 : 1,
        filter: expired ? 'grayscale(0.5)' : 'none',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
        '&:hover': inactive
          ? undefined
          : {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 32px rgba(0,52,104,0.14)',
            },
        // Ticket cutouts on the perforation line
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: 20,
          height: 20,
          borderRadius: '50%',
          bgcolor: landingTokens.PAPER,
          left: '35%',
          transform: 'translateX(-50%)',
        },
        '&::before': { top: -10 },
        '&::after': { bottom: -10 },
      }}
    >
      {/* Left — discount value */}
      <Box
        sx={{
          width: '35%',
          background: `linear-gradient(135deg, ${landingTokens.PRIMARY} 0%, ${landingTokens.PRIMARY_DARK} 100%)`,
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            color: '#FFFFFF',
            fontWeight: 800,
            lineHeight: 1,
            fontSize: percentage ? { xs: 32, md: 40 } : { xs: 16, md: 18 },
          }}
        >
          {percentage
            ? `${Math.floor(voucher.discount_amount)}%`
            : fCurrency(voucher.discount_amount)}
        </Typography>
        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: '0.2em',
            fontWeight: 700,
            mt: 1,
            opacity: 0.9,
          }}
        >
          GIẢM GIÁ
        </Typography>
      </Box>

      {/* Perforation line */}
      <Box
        sx={{
          position: 'absolute',
          left: '35%',
          top: 10,
          bottom: 10,
          borderLeft: `1px dashed ${landingTokens.HAIRLINE}`,
        }}
      />

      {/* Right — content */}
      <Box
        sx={{
          flex: 1,
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minWidth: 0,
        }}
      >
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
            <Typography
              sx={{
                color: landingTokens.INK_MUTED,
                fontSize: 11,
                letterSpacing: '0.18em',
                fontWeight: 600,
              }}
            >
              MÃ GIẢM
            </Typography>
            {used && (
              <Chip
                label="Đã dùng"
                size="small"
                sx={{
                  borderRadius: 0,
                  bgcolor: 'transparent',
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                  color: landingTokens.INK_MUTED,
                  fontSize: 10,
                  height: 20,
                }}
              />
            )}
            {expired && (
              <Chip
                label="Hết hạn"
                size="small"
                sx={{
                  borderRadius: 0,
                  bgcolor: 'transparent',
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                  color: landingTokens.INK_MUTED,
                  fontSize: 10,
                  height: 20,
                }}
              />
            )}
          </Stack>
          <Typography
            sx={{
              fontWeight: 800,
              color: landingTokens.PRIMARY,
              fontSize: { xs: 16, md: 18 },
              lineHeight: 1.2,
            }}
          >
            {voucher.voucher_code}
          </Typography>
          <Typography sx={{ color: landingTokens.INK_MUTED, fontSize: 12, mt: 1 }}>
            Đơn tối thiểu{' '}
            <Box component="strong" sx={{ color: landingTokens.INK }}>
              {fCurrency(voucher.min_order_value)}
            </Box>
          </Typography>
          <Typography sx={{ color: landingTokens.INK_MUTED, fontSize: 11, mt: 0.5 }}>
            HSD {fDate(voucher.end_date, 'DD-MM-YYYY')}
          </Typography>
        </Box>

        {!variant && (
          <Stack direction="row" spacing={0.5} sx={{ mt: 1.5 }}>
            <Button
              component={Link}
              href="/"
              size="small"
              sx={{
                color: '#FFFFFF',
                bgcolor: landingTokens.PRIMARY,
                fontWeight: 700,
                fontSize: 12,
                textTransform: 'none',
                px: 1.5,
                py: 0.5,
                minWidth: 'auto',
                borderRadius: 0.5,
                '&:hover': { bgcolor: landingTokens.PRIMARY_DARK },
              }}
            >
              Dùng ngay
            </Button>
            <Button
              onClick={copy}
              size="small"
              startIcon={<ContentCopyOutlinedIcon fontSize="small" />}
              sx={{
                color: landingTokens.PRIMARY,
                fontWeight: 700,
                fontSize: 12,
                textTransform: 'none',
                px: 1,
                py: 0.5,
                minWidth: 'auto',
                '&:hover': { bgcolor: 'rgba(0,52,104,0.06)' },
              }}
            >
              Sao chép
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export function VoucherView() {
  const [tab, setTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const lists = [validVouchers, usedVouchers, expiredVouchers];
  const variants = [null, 'used', 'expired'];
  const current = lists[tab];

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ mb: 4 }}>
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
            MÃ GIẢM GIÁ CỦA TÔI
          </Typography>
          <Box sx={{ width: 24, height: 1, bgcolor: landingTokens.GOLD }} />
        </Stack>
        <Typography
          sx={{
            fontFamily: landingTokens.FONT_SERIF,
            fontSize: { xs: 28, md: 36 },
            fontWeight: 600,
            color: landingTokens.INK,
            lineHeight: 1.2,
          }}
        >
          Ưu đãi dành riêng cho bạn
        </Typography>
        <Typography sx={{ color: landingTokens.INK_MUTED, mt: 1 }}>
          Sử dụng mã trước khi hết hạn để tối ưu giá trị đơn hàng.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: `1px solid ${landingTokens.HAIRLINE}`, mb: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          TabIndicatorProps={{
            sx: { bgcolor: landingTokens.GOLD, height: 2 },
          }}
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 14,
              minHeight: 44,
              color: landingTokens.INK_MUTED,
              '&.Mui-selected': { color: landingTokens.PRIMARY, fontWeight: 700 },
            },
          }}
        >
          <Tab label={`Có thể dùng (${validVouchers.length})`} />
          <Tab label={`Đã dùng (${usedVouchers.length})`} />
          <Tab label={`Hết hạn (${expiredVouchers.length})`} />
        </Tabs>
      </Box>

      {/* List */}
      {current.length > 0 ? (
        <Grid container spacing={2.5}>
          {current.map((v) => (
            <Grid key={v.id} size={{ xs: 12, md: 6 }}>
              <VoucherCard voucher={v} variant={variants[tab]} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            py: 10,
            textAlign: 'center',
            border: `1px dashed ${landingTokens.HAIRLINE}`,
            bgcolor: landingTokens.SURFACE,
          }}
        >
          <LocalOfferOutlinedIcon sx={{ fontSize: 44, color: landingTokens.GOLD_DARK, mb: 1.5 }} />
          <Typography sx={{ fontWeight: 600, color: landingTokens.INK, mb: 0.5 }}>
            {tab === 0
              ? 'Chưa có mã khả dụng'
              : tab === 1
                ? 'Chưa có mã đã dùng'
                : 'Chưa có mã hết hạn'}
          </Typography>
          <Typography sx={{ fontSize: 13, color: landingTokens.INK_MUTED }}>
            Theo dõi trang chủ để cập nhật ưu đãi mới nhất.
          </Typography>
        </Box>
      )}

      {/* FAQ */}
      <Box sx={{ mt: 6 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Typography
            variant="overline"
            sx={{
              color: landingTokens.GOLD_DARK,
              letterSpacing: '0.24em',
              fontWeight: 700,
            }}
          >
            CÂU HỎI THƯỜNG GẶP
          </Typography>
          <Box sx={{ flex: 1, height: 1, bgcolor: landingTokens.HAIRLINE }} />
        </Stack>
        {faqs.map((f, i) => {
          const isOpen = openFaq === i;
          return (
            <Box
              key={i}
              sx={{ borderBottom: `1px solid ${landingTokens.HAIRLINE}` }}
            >
              <Box
                component="button"
                type="button"
                onClick={() => setOpenFaq(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  py: 2,
                  px: 0,
                  bgcolor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  font: 'inherit',
                  color: landingTokens.INK,
                  transition: 'color 180ms ease',
                  '&:hover': { color: landingTokens.PRIMARY },
                  '&:focus-visible': {
                    outline: `2px solid ${landingTokens.GOLD}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: 14, flex: 1, lineHeight: 1.4 }}>
                  {f.q}
                </Typography>
                <ExpandMoreIcon
                  sx={{
                    color: isOpen ? landingTokens.PRIMARY : landingTokens.GOLD_DARK,
                    fontSize: 22,
                    flexShrink: 0,
                    transition: 'transform 220ms ease, color 180ms ease',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                  }}
                />
              </Box>
              <Collapse in={isOpen} unmountOnExit>
                <Box sx={{ pb: 2.5, pr: 4 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: landingTokens.INK_MUTED,
                      lineHeight: 1.75,
                    }}
                  >
                    {f.a}
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      {/* Newsletter CTA */}
      <Box
        sx={{
          mt: 5,
          p: { xs: 3, md: 4 },
          background: `linear-gradient(135deg, ${landingTokens.NEUTRAL_SOFT} 0%, #FFFFFF 50%, rgba(196,140,70,0.08) 100%)`,
          color: landingTokens.INK,
          border: `1px solid ${landingTokens.HAIRLINE}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            width: 24,
            height: 24,
            borderTop: `1px solid ${landingTokens.GOLD}`,
            borderLeft: `1px solid ${landingTokens.GOLD}`,
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            width: 24,
            height: 24,
            borderBottom: `1px solid ${landingTokens.GOLD}`,
            borderRight: `1px solid ${landingTokens.GOLD}`,
            pointerEvents: 'none',
          }}
        />
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
            <Typography
              variant="overline"
              sx={{
                color: landingTokens.GOLD_DARK,
                letterSpacing: '0.24em',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              ƯU ĐÃI ĐỘC QUYỀN
            </Typography>
            <Box sx={{ width: 20, height: 1, bgcolor: landingTokens.GOLD }} />
          </Stack>
          <Typography
            sx={{
              fontFamily: landingTokens.FONT_SERIF,
              fontSize: { xs: 20, md: 24 },
              fontWeight: 600,
              color: landingTokens.INK,
              lineHeight: 1.25,
            }}
          >
            Nhận mã giảm 10% cho đơn đầu tiên
          </Typography>
          <Typography sx={{ color: landingTokens.INK_MUTED, fontSize: 13, mt: 0.75 }}>
            Đăng ký nhận bản tin để không bỏ lỡ ưu đãi mỗi tháng.
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            bgcolor: landingTokens.PRIMARY,
            color: '#FFFFFF',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 0,
            px: 3,
            py: 1.25,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: landingTokens.PRIMARY_DARK,
              boxShadow: 'none',
              transform: 'translateY(-1px)',
            },
            transition: 'transform 180ms ease, background-color 180ms ease',
          }}
        >
          Đăng ký ngay
        </Button>
      </Box>
    </Box>
  );
}
