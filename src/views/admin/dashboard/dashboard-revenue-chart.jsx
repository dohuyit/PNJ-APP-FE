// src/views/admin/dashboard/dashboard-revenue-chart.jsx — area chart of revenue + bars of order count

'use client';

import dynamic from 'next/dynamic';

import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader } from '@mui/material';

import { fmtVND } from 'src/utils/format';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function DashboardRevenueChart({ series }) {
  const theme = useTheme();
  const options = {
    chart: { type: 'area', toolbar: { show: false }, fontFamily: 'var(--pnj-font-sans)' },
    stroke: { curve: 'smooth', width: 3 },
    colors: [theme.palette.primary.main, theme.palette.warning.main],
    dataLabels: { enabled: false },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.05 } },
    xaxis: { categories: series.map((s) => s.date.slice(5)), labels: { style: { fontSize: '11px' } } },
    yaxis: [
      {
        seriesName: 'Doanh thu',
        labels: { formatter: (v) => (v / 1_000_000).toFixed(0) + 'tr', style: { fontSize: '11px' } },
      },
      { opposite: true, show: false, seriesName: 'Số đơn' },
    ],
    tooltip: {
      shared: true,
      y: [
        { formatter: (v) => fmtVND(v) },
        { formatter: (v) => `${v} đơn` },
      ],
    },
    legend: { position: 'top', horizontalAlign: 'right' },
    grid: { borderColor: theme.palette.grey[200], strokeDashArray: 4 },
  };
  const data = [
    { name: 'Doanh thu', data: series.map((s) => s.revenue) },
    { name: 'Số đơn', data: series.map((s) => s.orders) },
  ];

  return (
    <Card>
      <CardHeader title="Doanh thu 30 ngày" />
      <CardContent>
        <Chart options={options} series={data} type="area" height={300} />
      </CardContent>
    </Card>
  );
}
