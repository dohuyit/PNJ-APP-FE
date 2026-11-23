// src/views/admin/dashboard/hc-chart.jsx — wrapper Highcharts theo pattern zeno-crm-fe

'use client';

// Highcharts PHẢI import trước modules — ES import được chạy theo thứ tự xuất hiện.
// `highcharts-more` v12 đọc `Highcharts.SeriesRegistry` ngay khi load; nếu chạy trước,
// sẽ crash "Cannot read properties of undefined (reading 'SeriesRegistry')".
import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';
import 'highcharts/modules/heatmap';
import 'highcharts/modules/funnel';
import 'highcharts/modules/treemap';
import 'highcharts/modules/solid-gauge';
import 'highcharts/modules/exporting';

import { Chart } from '@highcharts/react';

let defaultsApplied = false;
function applyDefaults() {
  if (defaultsApplied) return;
  defaultsApplied = true;
  Highcharts.setOptions({
    chart: { style: { fontFamily: "'Be Vietnam Pro', sans-serif" }, backgroundColor: 'transparent' },
    // Pastel palette — giảm saturation ~40% so với bản gốc để chart nhẹ hơn
    colors: ['#93C5FD', '#FCD34D', '#6EE7B7', '#D8B4FE', '#FCA5A5', '#7DD3FC', '#F9A8D4'],
    title: { style: { fontSize: '13px', fontWeight: '600', color: '#9CA3AF' } },
    credits: { enabled: false },
    // Tắt menu hamburger "3 gạch" của exporting
    exporting: { enabled: false, buttons: { contextButton: { enabled: false } } },
    navigation: { buttonOptions: { enabled: false } },
    xAxis: {
      labels: { style: { color: '#9CA3AF', fontSize: '10.5px', fontWeight: '400' } },
      lineColor: '#F3F4F6', tickColor: '#F3F4F6',
    },
    yAxis: {
      labels: { style: { color: '#9CA3AF', fontSize: '10.5px', fontWeight: '400' } },
      gridLineColor: '#F9FAFB', title: { text: null },
    },
    legend: { itemStyle: { color: '#6B7280', fontSize: '11px', fontWeight: '500' } },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderWidth: 0, borderRadius: 8,
      style: { color: '#fff', fontSize: '12px', fontWeight: '500' },
      shadow: false,
    },
  });
}

export function HcChart({ options, height = 300 }) {
  applyDefaults();
  return (
    <Chart
      options={{ ...options, chart: { ...options?.chart, height } }}
      highcharts={Highcharts}
    />
  );
}

export { Highcharts };
