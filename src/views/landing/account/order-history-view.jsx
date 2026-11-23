'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import SearchIcon from '@mui/icons-material/Search';

import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

import { landingTokens, sxSharpBtnOutlined, sxSharpInput } from 'src/theme/landing';
import Wireframe from 'src/sections/landing/components/Wireframe';

// Stubs — mock removed; data rỗng cho tới khi view migrate sang useGetXxx hook.
const ordersMock = [];

// Brand-palette status pills (replace MUI warning/info/success/error).
const statusMeta = {
  processing: { label: 'Đang xử lý', color: landingTokens.GOLD_DARK, bg: 'rgba(196,140,70,0.12)' },
  confirmed: { label: 'Đã xác nhận', color: landingTokens.PRIMARY, bg: 'rgba(0,52,104,0.08)' },
  shipping: { label: 'Đang vận chuyển', color: landingTokens.PRIMARY, bg: 'rgba(0,52,104,0.08)' },
  delivered: { label: 'Đã giao', color: landingTokens.GOLD_DARK, bg: 'rgba(196,140,70,0.12)' },
  completed: { label: 'Hoàn tất', color: landingTokens.GOLD_DARK, bg: 'rgba(196,140,70,0.12)' },
  cancelled: { label: 'Đã huỷ', color: landingTokens.INK_MUTED, bg: 'rgba(90,90,90,0.08)' },
};

function StatusPill({ status }) {
  const meta = statusMeta[status] ?? statusMeta.processing;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        bgcolor: meta.bg,
        color: meta.color,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        lineHeight: 1,
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
      {meta.label.toUpperCase()}
    </Box>
  );
}

export function OrderHistoryView() {
  const orders = ordersMock;
  const [filter, setFilter] = useState('all');
  const [period, setPeriod] = useState('all');
  const [query, setQuery] = useState('');

  const list = useMemo(
    () =>
      orders.filter((o) => {
        if (filter !== 'all' && o.status !== filter) return false;
        if (query && !o.code.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [orders, filter, query]
  );

  const stats = useMemo(() => {
    const total = orders.length;
    const processing = orders.filter((o) => ['processing', 'confirmed', 'shipping'].includes(o.status)).length;
    const done = orders.filter((o) => ['completed', 'delivered'].includes(o.status)).length;
    return { total, processing, done };
  }, [orders]);

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
            LỊCH SỬ MUA HÀNG
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
          Đơn hàng của bạn
        </Typography>
        <Typography sx={{ color: landingTokens.INK_MUTED, mt: 1 }}>
          Theo dõi trạng thái và lịch sử đơn hàng tại PNJ.
        </Typography>
      </Box>

      {/* Stats strip */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'TỔNG ĐƠN', value: stats.total },
          { label: 'ĐANG XỬ LÝ', value: stats.processing },
          { label: 'HOÀN TẤT', value: stats.done },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 4 }}>
            <Box
              sx={{
                border: `1px solid ${landingTokens.HAIRLINE}`,
                bgcolor: landingTokens.SURFACE,
                p: 2,
                borderTop: `2px solid ${landingTokens.GOLD}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: landingTokens.GOLD_DARK,
                }}
              >
                {s.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: landingTokens.FONT_SERIF,
                  fontSize: { xs: 22, md: 28 },
                  fontWeight: 700,
                  color: landingTokens.INK,
                  mt: 0.25,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Filter bar */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
        <TextField
          select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
          sx={{ ...sxSharpInput, minWidth: 180 }}
        >
          <MenuItem value="all">Tất cả trạng thái</MenuItem>
          <MenuItem value="processing">Đang xử lý</MenuItem>
          <MenuItem value="shipping">Đang vận chuyển</MenuItem>
          <MenuItem value="completed">Đã hoàn tất</MenuItem>
          <MenuItem value="cancelled">Đã huỷ</MenuItem>
        </TextField>
        <TextField
          select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          size="small"
          sx={{ ...sxSharpInput, minWidth: 160 }}
        >
          <MenuItem value="all">Mọi thời gian</MenuItem>
          <MenuItem value="7">7 ngày qua</MenuItem>
          <MenuItem value="30">30 ngày qua</MenuItem>
          <MenuItem value="90">3 tháng qua</MenuItem>
        </TextField>
        <TextField
          placeholder="Tìm theo mã đơn..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          fullWidth
          sx={sxSharpInput}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: landingTokens.GOLD_DARK }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* List */}
      {list.length > 0 ? (
        <Stack spacing={2.5}>
          {list.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Stack>
      ) : (
        <Box
          sx={{
            py: 10,
            textAlign: 'center',
            border: `1px dashed ${landingTokens.HAIRLINE}`,
            bgcolor: landingTokens.SURFACE,
          }}
        >
          <InventoryOutlinedIcon sx={{ fontSize: 48, color: landingTokens.GOLD_DARK, mb: 1.5 }} />
          <Typography sx={{ fontWeight: 600, color: landingTokens.INK, mb: 0.5 }}>
            Không có đơn phù hợp
          </Typography>
          <Typography sx={{ fontSize: 13, color: landingTokens.INK_MUTED }}>
            Thử lại với bộ lọc khác hoặc khám phá bộ sưu tập mới.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function OrderCard({ order }) {
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const preview = order.items.slice(0, 3);
  const extra = order.items.length - preview.length;

  return (
    <Box
      sx={{
        bgcolor: landingTokens.SURFACE,
        border: `1px solid ${landingTokens.HAIRLINE}`,
        transition: 'border-color 220ms ease, box-shadow 220ms ease',
        '&:hover': {
          borderColor: landingTokens.GOLD,
          boxShadow: '0 6px 24px rgba(26,20,19,0.06)',
        },
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={1.5}
        sx={{ px: 3, py: 2, borderBottom: `1px solid ${landingTokens.HAIRLINE}` }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: landingTokens.GOLD_DARK,
              }}
            >
              MÃ ĐƠN
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: landingTokens.INK,
                fontFamily: 'ui-monospace, Menlo, monospace',
                lineHeight: 1.2,
              }}
            >
              {order.code}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ borderColor: landingTokens.HAIRLINE }} />
          <StatusPill status={order.status} />
        </Stack>
        <Typography sx={{ fontSize: 12, color: landingTokens.INK_MUTED }}>
          Đặt ngày {fDate(order.created_at, 'DD-MM-YYYY')}
        </Typography>
      </Stack>

      {/* Items preview */}
      <Box sx={{ px: 3, py: 2.5 }}>
        <Stack spacing={1.5}>
          {preview.map((item, i) => (
            <Stack key={i} direction="row" spacing={1.75} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                }}
              >
                <Wireframe label="" iconSize="small" />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: landingTokens.INK,
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {item.product_name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: landingTokens.INK_MUTED, mt: 0.25 }}>
                  Size {item.size} · × {item.quantity}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: landingTokens.INK,
                  whiteSpace: 'nowrap',
                }}
              >
                {fCurrency(item.sale_price * item.quantity)}
              </Typography>
            </Stack>
          ))}
          {extra > 0 && (
            <Typography sx={{ fontSize: 12, color: landingTokens.GOLD_DARK, fontWeight: 600, pl: 7.5 }}>
              + {extra} sản phẩm khác
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Footer */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={2}
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${landingTokens.HAIRLINE}`,
          bgcolor: landingTokens.NEUTRAL,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 11, color: landingTokens.INK_MUTED, letterSpacing: '0.06em' }}>
            TỔNG {itemCount} SẢN PHẨM
          </Typography>
          <Typography
            sx={{
              fontFamily: landingTokens.FONT_SERIF,
              fontSize: 20,
              fontWeight: 700,
              color: landingTokens.PRIMARY,
              lineHeight: 1.1,
            }}
          >
            {fCurrency(order.total)}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {order.status === 'processing' && (
            <Button variant="outlined" size="small" sx={sxSharpBtnOutlined}>
              Huỷ đơn
            </Button>
          )}
          <Button
            component={Link}
            href={`/order-info/${order.id}`}
            variant="outlined"
            size="small"
            endIcon={<ArrowRightAltIcon />}
            sx={sxSharpBtnOutlined}
          >
            Chi tiết đơn
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
