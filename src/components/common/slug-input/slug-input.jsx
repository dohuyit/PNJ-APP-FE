// src/components/common/slug-input/slug-input.jsx — auto-slugify Vietnamese
'use client';

import { useEffect } from 'react';
import { TextField, Stack, Button, InputAdornment } from '@mui/material';
import { Iconify } from 'src/components/iconify';

function slugify(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function SlugInput({ sourceName, value, onChange, auto = true, label = 'Slug', sx }) {
  useEffect(() => {
    if (auto && sourceName) onChange(slugify(sourceName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceName, auto]);

  return (
    <Stack direction="row" spacing={1} alignItems="flex-start" sx={sx}>
      <TextField
        label={label}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="solar:link-linear" width={16} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': { fontFamily: 'monospace' },
        }}
      />
      <Button
        variant="outlined"
        size="small"
        startIcon={<Iconify icon="solar:refresh-linear" width={14} />}
        onClick={() => onChange(slugify(sourceName))}
        sx={{ height: 40, flexShrink: 0 }}
      >
        Tự sinh
      </Button>
    </Stack>
  );
}
