'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlaceIcon from '@mui/icons-material/Place';

import { fCurrency, fNumber, fPercent } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';
import {
  landingTokens,
  sxSharpBtnContained,
  sxSharpBtnCta,
  sxSharpBtnOutlined,
  sxSharpCard,
  sxSharpInput,
  sxEyebrow,
} from 'src/theme/landing';
import {
  mockGoldPrices,
  mockGoldTypes,
  mockGoldPriceRegions,
} from 'src/mock-data/gold-prices';

// 1 lượng = 10 chỉ (quy ước PNJ: giá lưu theo chỉ)
const UNITS = [
  { code: 'chi', label: 'Chỉ', factor: 1 },
  { code: 'luong', label: 'Lượng', factor: 10 },
];

// Delta % loại vàng so với base 24K (mô phỏng cho ticker + bảng)
function priceForType(basePrice, purity) {
  // shortcut: tuyến tính theo purity, upgrade khi có API giá thật từng loại
  return Math.round((basePrice * purity) / 99.99 / 1000) * 1000;
}

function formatDelta(delta) {
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${fNumber(delta)}`;
}

export function GoldPriceView() {
  const latest = mockGoldPrices[0];
  const previous = mockGoldPrices[1];

  // Tick giả lập "cập nhật" để flash
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 6000);
    return () => clearInterval(id);
  }, []);

  const [refreshedAt, setRefreshedAt] = useState(() => new Date());

  // Ticker 6 loại
  const tickerRows = useMemo(
    () =>
      mockGoldTypes.map((t) => {
        const buy = priceForType(latest.buy_price, t.purity);
        const sell = priceForType(latest.sell_price, t.purity);
        const prevBuy = priceForType(previous.buy_price, t.purity);
        const delta = buy - prevBuy;
        const pct = prevBuy ? (delta / prevBuy) * 100 : 0;
        return { ...t, buy, sell, delta, pct };
      }),
    [latest, previous]
  );

  // Bảng loại × vùng
  const tableRows = useMemo(() => {
    const rows = [];
    mockGoldTypes.forEach((t) => {
      const buyBase = priceForType(latest.buy_price, t.purity);
      const sellBase = priceForType(latest.sell_price, t.purity);
      const prevBuyBase = priceForType(previous.buy_price, t.purity);
      mockGoldPriceRegions.forEach((r) => {
        const buy = buyBase + r.buy_adjust;
        const sell = sellBase + r.sell_adjust;
        const prevBuy = prevBuyBase + r.buy_adjust;
        const delta = buy - prevBuy;
        const pct = prevBuy ? (delta / prevBuy) * 100 : 0;
        rows.push({
          key: `${t.id}-${r.id}`,
          typeName: t.name,
          typeCode: t.code,
          regionName: r.name,
          buy,
          sell,
          spread: sell - buy,
          delta,
          pct,
        });
      });
    });
    return rows;
  }, [latest, previous]);

  // Chart 12 ngày (SVG tự vẽ, cũ→mới)
  const chartSeries = useMemo(() => [...mockGoldPrices].reverse(), []);
  const chart = useMemo(() => {
    const W = 1120;
    const H = 300;
    const PADX = 48;
    const PADY = 28;
    const vals = chartSeries.flatMap((p) => [p.buy_price, p.sell_price]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const x = (i) =>
      PADX + (i * (W - PADX * 2)) / Math.max(chartSeries.length - 1, 1);
    const y = (v) => H - PADY - ((v - min) / range) * (H - PADY * 2);
    const toPath = (key) =>
      chartSeries
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p[key])}`)
        .join(' ');
    return {
      W,
      H,
      PADX,
      PADY,
      min,
      max,
      x,
      y,
      buyPath: toPath('buy_price'),
      sellPath: toPath('sell_price'),
    };
  }, [chartSeries]);

  // Công cụ quy đổi
  const [convTypeId, setConvTypeId] = useState(mockGoldTypes[0].id);
  const [convWeight, setConvWeight] = useState('1');
  const [convUnit, setConvUnit] = useState('chi');

  const convResult = useMemo(() => {
    const t = mockGoldTypes.find((x) => x.id === convTypeId) || mockGoldTypes[0];
    const unit = UNITS.find((u) => u.code === convUnit) || UNITS[0];
    const w = Number(convWeight);
    if (!Number.isFinite(w) || w <= 0) return 0;
    const sell = priceForType(latest.sell_price, t.purity);
    return sell * w * unit.factor;
  }, [convTypeId, convWeight, convUnit, latest.sell_price]);

  const flashKey = tick; // tạo key làm trigger animation

  return (
    <>
      {/* 1. Hero */}
      <Box
        sx={{
          bgcolor: landingTokens.PRIMARY,
          color: '#FBF7F2',
          py: { xs: 6, md: 10 },
          borderBottom: `2px solid ${landingTokens.GOLD}`,
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Typography sx={{ ...sxEyebrow, color: landingTokens.GOLD, mb: 2 }}>
            CẬP NHẬT LIÊN TỤC
          </Typography>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                sx={{
                  fontFamily: landingTokens.FONT_SANS,
                  fontSize: { xs: 36, md: 56 },
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                Giá vàng PNJ hôm nay
              </Typography>
              <Typography
                sx={{
                  mt: 2,
                  color: 'rgba(251,247,242,0.82)',
                  fontSize: 16,
                }}
              >
                {fDate(refreshedAt, 'dddd, DD/MM/YYYY')} · Cập nhật lúc{' '}
                {fTime(refreshedAt, 'HH:mm:ss')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { md: 'right' } }}>
              <Button
                onClick={() => setRefreshedAt(new Date())}
                startIcon={<RefreshIcon />}
                sx={{
                  ...sxSharpBtnContained,
                  bgcolor: landingTokens.GOLD,
                  color: landingTokens.INK,
                  '&:hover': {
                    bgcolor: landingTokens.GOLD_DARK,
                    color: '#FBF7F2',
                  },
                }}
              >
                Làm mới giá
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. Live ticker */}
      <Box sx={{ bgcolor: landingTokens.INK, color: '#FBF7F2', py: 2 }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(6, 1fr)',
              },
              gap: 2,
            }}
          >
            {tickerRows.map((r) => {
              const up = r.delta >= 0;
              return (
                <Box
                  key={`${r.id}-${flashKey}`}
                  sx={{
                    px: 1.5,
                    py: 1.25,
                    borderLeft: `2px solid ${
                      up ? landingTokens.GOLD : landingTokens.CTA
                    }`,
                    animation: 'pnjFlash 1200ms ease-out',
                    '@keyframes pnjFlash': {
                      '0%': {
                        backgroundColor: up
                          ? 'rgba(196,140,70,0.35)'
                          : 'rgba(173,42,54,0.35)',
                      },
                      '100%': { backgroundColor: 'transparent' },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: landingTokens.GOLD,
                      letterSpacing: '0.12em',
                      fontWeight: 700,
                    }}
                  >
                    {r.code}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 600,
                      mt: 0.25,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {fNumber(r.sell)}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    sx={{
                      color: up ? '#7FD684' : '#FF8A8A',
                      fontSize: 12,
                      mt: 0.25,
                    }}
                  >
                    {up ? (
                      <ArrowUpwardIcon sx={{ fontSize: 12 }} />
                    ) : (
                      <ArrowDownwardIcon sx={{ fontSize: 12 }} />
                    )}
                    <span>
                      {formatDelta(r.delta)} ({fPercent(r.pct)})
                    </span>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* 3. Bảng giá theo vùng */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 6, md: 10 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ ...sxEyebrow, color: landingTokens.GOLD_DARK }}>
            BẢNG GIÁ CHI TIẾT
          </Typography>
          <Typography
            sx={{
              fontFamily: landingTokens.FONT_SANS,
              fontSize: { xs: 26, md: 36 },
              fontWeight: 600,
              mt: 1,
            }}
          >
            Giá vàng theo vùng · {mockGoldPriceRegions.length} khu vực
          </Typography>
        </Box>

        <Box
          sx={{
            ...sxSharpCard,
            overflowX: 'auto',
          }}
        >
          <Table size="small" sx={{ minWidth: 820 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: landingTokens.NEUTRAL }}>
                {[
                  'Loại vàng',
                  'Khu vực',
                  'Mua vào (₫/chỉ)',
                  'Bán ra (₫/chỉ)',
                  'Chênh lệch',
                  'Biến động',
                ].map((h, i) => (
                  <TableCell
                    key={h}
                    align={i >= 2 ? 'right' : 'left'}
                    sx={{
                      fontWeight: 700,
                      color: landingTokens.INK,
                      borderBottom: `1px solid ${landingTokens.HAIRLINE}`,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row) => {
                const up = row.delta >= 0;
                return (
                  <TableRow
                    key={row.key}
                    sx={{
                      '&:hover': { bgcolor: landingTokens.NEUTRAL_SOFT },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={row.typeCode}
                          size="small"
                          sx={{
                            bgcolor: landingTokens.GOLD,
                            color: '#FFF',
                            fontWeight: 700,
                            borderRadius: 0.5,
                          }}
                        />
                        <span>{row.typeName}</span>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: landingTokens.INK_MUTED }}>
                      {row.regionName}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {fNumber(row.buy)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        color: landingTokens.PRIMARY,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {fNumber(row.sell)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: landingTokens.INK_MUTED,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {fNumber(row.spread)}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="flex-end"
                        sx={{
                          color: up ? '#1F7A3A' : landingTokens.CTA,
                          fontWeight: 600,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {up ? (
                          <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                        ) : (
                          <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                        )}
                        <span>{fPercent(row.pct)}</span>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Container>

      {/* 4. Biểu đồ 12 ngày */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 6, md: 10 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ ...sxEyebrow, color: landingTokens.GOLD_DARK }}>
              XU HƯỚNG 12 NGÀY
            </Typography>
            <Typography
              sx={{
                fontFamily: landingTokens.FONT_SANS,
                fontSize: { xs: 26, md: 36 },
                fontWeight: 600,
                mt: 1,
              }}
            >
              Lịch sử giá vàng 24K
            </Typography>
          </Box>

          <Box sx={{ ...sxSharpCard, p: { xs: 2, md: 4 } }}>
            <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 14,
                    height: 2,
                    bgcolor: landingTokens.PRIMARY,
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Mua vào
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{ width: 14, height: 2, bgcolor: landingTokens.GOLD }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Bán ra
                </Typography>
              </Stack>
            </Stack>
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <svg
                viewBox={`0 0 ${chart.W} ${chart.H}`}
                width="100%"
                height="300"
                style={{ display: 'block' }}
              >
                {[0, 0.25, 0.5, 0.75, 1].map((f) => {
                  const yy = chart.PADY + f * (chart.H - chart.PADY * 2);
                  const val = chart.max - f * (chart.max - chart.min);
                  return (
                    <g key={f}>
                      <line
                        x1={chart.PADX}
                        x2={chart.W - chart.PADX}
                        y1={yy}
                        y2={yy}
                        stroke={landingTokens.HAIRLINE}
                        strokeDasharray="3 4"
                      />
                      <text
                        x={chart.PADX - 8}
                        y={yy + 4}
                        fontSize="10"
                        fill={landingTokens.INK_MUTED}
                        textAnchor="end"
                      >
                        {fNumber(val)}
                      </text>
                    </g>
                  );
                })}
                <path
                  d={chart.buyPath}
                  fill="none"
                  stroke={landingTokens.PRIMARY}
                  strokeWidth="2.5"
                />
                <path
                  d={chart.sellPath}
                  fill="none"
                  stroke={landingTokens.GOLD}
                  strokeWidth="2.5"
                />
                {chartSeries.map((p, i) => (
                  <g key={p.id}>
                    <circle
                      cx={chart.x(i)}
                      cy={chart.y(p.buy_price)}
                      r="3"
                      fill={landingTokens.PRIMARY}
                    />
                    <circle
                      cx={chart.x(i)}
                      cy={chart.y(p.sell_price)}
                      r="3"
                      fill={landingTokens.GOLD}
                    />
                    {i % 2 === 0 && (
                      <text
                        x={chart.x(i)}
                        y={chart.H - 8}
                        fontSize="10"
                        fill={landingTokens.INK_MUTED}
                        textAnchor="middle"
                      >
                        {fDate(p.date, 'DD/MM')}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 5. Công cụ quy đổi */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 6, md: 10 } }}>
        <Grid container spacing={{ xs: 3, md: 5 }} alignItems="stretch">
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography sx={{ ...sxEyebrow, color: landingTokens.GOLD_DARK }}>
              CÔNG CỤ
            </Typography>
            <Typography
              sx={{
                fontFamily: landingTokens.FONT_SANS,
                fontSize: { xs: 26, md: 36 },
                fontWeight: 600,
                mt: 1,
                mb: 2,
              }}
            >
              Quy đổi giá trị vàng
            </Typography>
            <Typography sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.75 }}>
              Nhập trọng lượng và chọn loại vàng để ước tính giá trị theo giá
              bán ra hiện tại. Kết quả chỉ mang tính tham khảo.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ ...sxSharpCard, p: { xs: 3, md: 4 } }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Loại vàng"
                    value={convTypeId}
                    onChange={(e) => setConvTypeId(e.target.value)}
                    sx={sxSharpInput}
                  >
                    {mockGoldTypes.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 8, sm: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Trọng lượng"
                    value={convWeight}
                    onChange={(e) => setConvWeight(e.target.value)}
                    inputProps={{ min: 0, step: 0.1 }}
                    sx={sxSharpInput}
                  />
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Đơn vị"
                    value={convUnit}
                    onChange={(e) => setConvUnit(e.target.value)}
                    sx={sxSharpInput}
                  >
                    {UNITS.map((u) => (
                      <MenuItem key={u.code} value={u.code}>
                        {u.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  bgcolor: landingTokens.NEUTRAL,
                  borderLeft: `3px solid ${landingTokens.GOLD}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: landingTokens.INK_MUTED,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Giá trị ước tính
                </Typography>
                <Typography
                  sx={{
                    fontFamily: landingTokens.FONT_SANS,
                    fontSize: { xs: 28, md: 40 },
                    fontWeight: 700,
                    color: landingTokens.PRIMARY,
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1.1,
                    mt: 0.5,
                  }}
                >
                  {fCurrency(convResult, 'VND')}
                </Typography>
              </Box>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 3 }}
              >
                <Button
                  component={Link}
                  href="/stores"
                  sx={sxSharpBtnCta}
                  fullWidth
                >
                  Đặt mua tại cửa hàng
                </Button>
                <Button
                  component={Link}
                  href="/contact"
                  sx={sxSharpBtnOutlined}
                  fullWidth
                >
                  Tư vấn giá sỉ
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* 6. Thông tin phụ */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL_SOFT, py: { xs: 6, md: 10 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  ...sxSharpCard,
                  p: 3,
                  height: '100%',
                  borderTop: `2px solid ${landingTokens.GOLD}`,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 1.5 }}
                >
                  Cách đọc bảng giá
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.8 }}
                >
                  <b>Mua vào</b> là giá PNJ thu lại từ khách. <b>Bán ra</b> là
                  giá khách trả khi mua vàng. <b>Chênh lệch</b> là biên lợi
                  nhuận cho mỗi chỉ. <b>Biến động</b> so với giá đóng cửa hôm
                  qua.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  ...sxSharpCard,
                  p: 3,
                  height: '100%',
                  borderTop: `2px solid ${landingTokens.GOLD}`,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 1.5 }}
                >
                  Đơn vị thường dùng
                </Typography>
                <Stack
                  spacing={0.75}
                  sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.8 }}
                >
                  <span>
                    <b>1 chỉ</b> = 3,75 gram
                  </span>
                  <span>
                    <b>1 lượng (cây)</b> = 10 chỉ = 37,5 gram
                  </span>
                  <span>
                    <b>Carat</b> đo độ tuổi vàng: 24K = 99,99%
                  </span>
                  <span>
                    Giá niêm yết đơn vị <b>₫/chỉ</b>
                  </span>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  ...sxSharpCard,
                  p: 3,
                  height: '100%',
                  borderTop: `2px solid ${landingTokens.GOLD}`,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 1.5 }}
                >
                  Giờ cập nhật
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.8 }}
                >
                  Giá được niêm yết theo khung giờ giao dịch 08:30 – 17:30
                  hàng ngày. Giá hiển thị ở trang này chỉ mang tính tham khảo,
                  giao dịch thực tế tại cửa hàng có thể chênh lệch tùy thời
                  điểm.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 7. CTA */}
      <Box
        sx={{
          bgcolor: landingTokens.INK,
          color: '#FBF7F2',
          py: { xs: 8, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            sx={{
              fontFamily: landingTokens.FONT_SANS,
              fontSize: { xs: 28, md: 44 },
              color: landingTokens.GOLD,
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Giao dịch trực tiếp,<br />an tâm từng chỉ vàng.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={Link}
              href="/stores"
              sx={sxSharpBtnContained}
              startIcon={<PlaceIcon />}
            >
              Tìm cửa hàng PNJ gần nhất
            </Button>
            <Button
              component={Link}
              href="/contact"
              sx={{
                ...sxSharpBtnOutlined,
                color: '#FBF7F2',
                borderColor: '#FBF7F2',
                '&:hover': {
                  color: landingTokens.GOLD,
                  borderColor: landingTokens.GOLD,
                  bgcolor: 'transparent',
                },
              }}
            >
              Liên hệ tư vấn
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
