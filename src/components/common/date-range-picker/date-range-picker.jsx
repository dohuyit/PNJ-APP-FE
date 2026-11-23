// src/components/common/date-range-picker/date-range-picker.jsx — from-to pair
'use client';

import { Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export function DateRangePicker({
  value = [null, null],
  onChange,
  fromLabel = 'Từ ngày',
  toLabel = 'Đến ngày',
  size = 'small',
  sx,
  showDivider = true,
}) {
  const [from, to] = value;
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={sx}>
      <DatePicker
        label={fromLabel}
        value={from}
        onChange={(v) => onChange([v, to])}
        slotProps={{ textField: { size, sx: { minWidth: 160 } } }}
      />
      {showDivider && <Typography variant="body2" color="text.secondary">→</Typography>}
      <DatePicker
        label={toLabel}
        value={to}
        onChange={(v) => onChange([from, v])}
        slotProps={{ textField: { size, sx: { minWidth: 160 } } }}
      />
    </Stack>
  );
}
