// src/views/admin/gold/gold-price-view.jsx — gold price entry table + history chart

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import { useTheme } from '@mui/material/styles';
import {
  Button, Card, CardContent, CardHeader, Grid, Stack, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, MenuItem, Typography, Chip, Alert, Box,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtDateTime } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetGoldPriceHistory } from 'src/actions/admin/gold-price';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { PageHeader } from 'src/components/common/page-header';
import { MoneyInput } from 'src/components/common/money-input';
import { ChartSkeleton, KpiCardsSkeleton } from 'src/components/common/skeletons';

import { mockGoldPriceRegions, mockGoldPrices } from 'src/mock-data';

const goldPriceRegionsList = mockGoldPriceRegions;
const goldPricesCurrent = mockGoldPrices;

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function GoldPriceView() {
  const { searchResults: goldPricesHistory, searchLoading: goldLoading } = useGetGoldPriceHistory();
  const goldTypesList = goldPricesHistory;
  const theme = useTheme();
  const [region, setRegion] = useState('HCM');
  const [chartType, setChartType] = useState(goldTypesList[0]?.code ?? '');
  if (goldLoading) {
    return (
      <DashboardContent disablePadding>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ mb: 2 }}>
            <KpiCardsSkeleton count={4} mode="standalone" spacing={2} />
          </Box>
          <Box sx={{
            bgcolor: 'background.paper', border: 1, borderColor: 'divider',
            borderRadius: 2.5, overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(145, 158, 171, 0.08)',
          }}>
            <ChartSkeleton height={320} variant="line" />
          </Box>
        </Box>
      </DashboardContent>
    );
  }
  const [prices, setPrices] = useState(goldPricesCurrent);

  const series = [
    { name: 'Mua vào', data: goldPricesHistory.map((h) => h.buy) },
    { name: 'Bán ra', data: goldPricesHistory.map((h) => h.sell) },
  ];

  const options = {
    chart: { type: 'line', toolbar: { show: false }, fontFamily: 'var(--pnj-font-sans)' },
    stroke: { curve: 'smooth', width: 3 },
    colors: [theme.palette.info.main, theme.palette.warning.main],
    xaxis: { categories: goldPricesHistory.map((h) => h.ts.slice(5, 10)) },
    yaxis: { labels: { formatter: (v) => (v / 1_000_000).toFixed(1) + 'tr' } },
    tooltip: { y: { formatter: (v) => fmtVND(v) } },
    grid: { borderColor: theme.palette.grey[200], strokeDashArray: 4 },
    legend: { position: 'top', horizontalAlign: 'right' },
  };

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Giá vàng"
        subtitle="Nhập giá theo vùng · lịch sử · biểu đồ · áp giá cho SP by_gold_rate"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Giá vàng' }]}
        actions={
          <>
            <Button variant="outlined" startIcon={<Iconify icon="solar:copy-linear" width={16} />}>
              Sao chép sang vùng khác
            </Button>
            <Button variant="contained" startIcon={<Iconify icon="solar:refresh-linear" width={16} />}>
              Áp giá mới
            </Button>
          </>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardHeader
              title="Bảng giá hiện tại"
              subheader={`Vùng ${region} · cập nhật ${fmtDateTime(prices[0]?.updated_at)}`}
              action={
                <TextField
                  select
                  size="small"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  {goldPriceRegionsList.map((r) => (
                    <MenuItem key={r.code} value={r.code}>{r.name}</MenuItem>
                  ))}
                </TextField>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Cảnh báo tự động khi thay đổi &gt; 3% so với lần nhập trước.
              </Alert>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Loại vàng</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Karat</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Mua vào</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Bán ra</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Thay đổi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prices.map((p, i) => {
                      const warn = Math.abs(p.change_pct) > 3;
                      return (
                        <TableRow key={p.gold_type_code} sx={{ bgcolor: warn ? 'warning.lighter' : undefined }}>
                          <TableCell>{p.gold_type_name}</TableCell>
                          <TableCell><Label>{p.karat_label}</Label></TableCell>
                          <TableCell align="right" sx={{ p: 1 }}>
                            <MoneyInput
                              size="small"
                              value={p.buy}
                              onChange={(e) => setPrices(prices.map((x, j) => j === i ? { ...x, buy: e.target.value.value } : x))}
                              sx={{ width: 160 }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ p: 1 }}>
                            <MoneyInput
                              size="small"
                              value={p.sell}
                              onChange={(e) => setPrices(prices.map((x, j) => j === i ? { ...x, sell: e.target.value.value } : x))}
                              sx={{ width: 160 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              icon={<Iconify icon={p.change_pct > 0 ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'} width={12} />}
                              label={`${p.change_pct > 0 ? '+' : ''}${p.change_pct.toFixed(2)}%`}
                              size="small"
                              color={warn ? 'warning' : p.change_pct > 0 ? 'success' : 'error'}
                              variant="filled"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button variant="contained" startIcon={<Iconify icon="solar:check-circle-linear" width={16} />}>
                  Lưu toàn bộ bảng
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card>
            <CardHeader
              title="Biểu đồ 30 ngày"
              action={
                <TextField
                  select
                  size="small"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  sx={{ minWidth: 160 }}
                >
                  {goldTypesList.map((t) => (
                    <MenuItem key={t.code} value={t.code}>{t.name}</MenuItem>
                  ))}
                </TextField>
              }
            />
            <CardContent>
              <Chart options={options} series={series} type="line" height={300} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
