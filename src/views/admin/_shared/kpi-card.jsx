// src/views/admin/_shared/kpi-card.jsx — KPI card chuẩn PNJ admin.
// Style port 1:1 từ product-list-view inline KPI: borderRight + borderBottom, no radius,
// value 26px, trend là plain colored text, helperText luôn render dưới dạng sub-text.

'use client';

import { Box, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

/**
 * @param {object}   props
 * @param {Function} props.icon        - MUI icon component
 * @param {string}   props.label
 * @param {string|number} props.value
 * @param {string}   [props.color]     - primary|success|warning|error|info
 * @param {string}   [props.helperText] - "sub" text hiển thị dưới trend
 * @param {{value:number, direction:'up'|'down', period?:string}} [props.trend]
 * @param {Function} [props.onClick]
 * @param {boolean}  [props.selected]
 * @param {number}   [props.index]     - vị trí trong grid (0-based) — ẩn borderRight cột cuối
 * @param {number}   [props.cols]      - số cột ở md (default 4)
 * @param {number}   [props.valueSize] - font-size của value (default 26)
 */
export function KpiCard({
  icon: Ico, label, value, color = 'primary', helperText, trend, onClick, selected,
  index = 0, cols = 4, valueSize = 26,
}) {
  const i = index;
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        bgcolor: selected ? 'action.selected' : 'transparent',
        borderRightWidth: {
          xs: 0,
          sm: i % 2 === 1 ? 0 : 1,
          md: (i + 1) % cols === 0 ? 0 : 1,
        },
        borderRightStyle: 'solid',
        borderRightColor: 'grey.200',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'grey.100',
        px: 2, py: 1.5,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color .15s ease',
        '&:hover': onClick ? { bgcolor: 'action.hover' } : {},
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top row: label + icon */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1} sx={{ mb: 1 }}>
        <Typography sx={{
          fontSize: 10.5, color: 'text.disabled', fontWeight: 600,
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>
          {label}
        </Typography>
        {Ico && (
          <Box sx={{
            width: 32, height: 32, borderRadius: 0.75,
            bgcolor: (t) => t.palette[color]?.lighter ?? 'grey.100',
            color:   (t) => t.palette[color]?.main    ?? 'text.secondary',
            display: 'grid', placeItems: 'center',
            flexShrink: 0,
          }}>
            <Ico sx={{ fontSize: 16 }} />
          </Box>
        )}
      </Stack>

      {/* Value lớn */}
      <Typography sx={{
        fontSize: valueSize, fontWeight: 700, color: 'text.primary',
        lineHeight: 1.1, fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {value}
      </Typography>

      {/* Trend + trend.period — cùng 1 hàng, chỉ render nếu có trend */}
      {trend && (
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1 }} flexWrap="wrap" rowGap={0.5}>
          <Stack
            direction="row" alignItems="center" spacing={0.25}
            sx={{ color: trend.direction === 'up' ? 'success.main' : 'error.main' }}
          >
            <Iconify
              icon={trend.direction === 'up' ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'}
              width={12}
            />
            <Typography sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1, color: 'inherit' }}>
              {Math.abs(trend.value)}%
            </Typography>
          </Stack>
          {trend.period && (
            <Typography sx={{ fontSize: 11, color: 'text.disabled', lineHeight: 1.3 }}>
              {trend.period}
            </Typography>
          )}
        </Stack>
      )}

      {/* Sub detail breakdown — luôn render helperText nếu có, dưới trend hoặc dưới value */}
      {helperText && (
        <Typography sx={{
          fontSize: 11, color: 'text.secondary', mt: trend ? 0.75 : 1, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
