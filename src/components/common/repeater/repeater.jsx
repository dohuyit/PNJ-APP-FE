// src/components/common/repeater/repeater.jsx — generic add/remove list
'use client';

import { Stack, Button, IconButton, Paper, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';

/**
 * @param {{
 *   value?: any[], onChange: Function, renderRow: (row:any, setRow:Function, i:number)=>React.ReactNode,
 *   newItem?: any, addLabel?: string, emptyText?: string,
 * }} props
 */
export function Repeater({
  value = [],
  onChange,
  renderRow,
  newItem = {},
  addLabel = 'Thêm dòng',
  emptyText = 'Chưa có dòng nào',
  sx,
}) {
  const update = (i, next) => onChange(value.map((r, idx) => (idx === i ? next : r)));
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <Stack spacing={1} sx={sx}>
      {value.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          {emptyText}
        </Typography>
      )}
      {value.map((row, i) => (
        <Paper
          key={i}
          variant="outlined"
          sx={{
            p: 1.5,
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            '&:hover': { borderColor: 'primary.light' },
          }}
        >
          <Stack sx={{ flex: 1 }}>{renderRow(row, (next) => update(i, next), i)}</Stack>
          <IconButton size="small" onClick={() => remove(i)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-linear" width={16} />
          </IconButton>
        </Paper>
      ))}
      <Button
        startIcon={<Iconify icon="solar:add-circle-linear" width={16} />}
        onClick={() => onChange([...value, { ...newItem }])}
        variant="outlined"
        color="primary"
        sx={{ alignSelf: 'flex-start' }}
      >
        {addLabel}
      </Button>
    </Stack>
  );
}
