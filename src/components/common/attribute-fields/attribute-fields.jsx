// src/components/common/attribute-fields/attribute-fields.jsx — dynamic fields from attribute_sets
'use client';

import {
  Stack, TextField, MenuItem, Autocomplete, Switch, FormControlLabel,
  Typography, Box, Chip,
} from '@mui/material';
import { DecimalInput } from 'src/components/common/decimal-input';

/**
 * @param {{
 *   attributes: Array<{code,name,input_type,unit?,options?:Array<{value,label,color_hex?}>, required?:boolean}>,
 *   value: Record<string,any>, onChange: Function,
 * }} props
 */
export function AttributeFields({ attributes = [], value = {}, onChange, sx }) {
  const set = (code, v) => onChange({ ...value, [code]: v });

  if (attributes.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', ...sx }}>
        <Typography variant="body2" color="text.secondary">
          Chọn bộ thuộc tính (danh mục) để sinh field tương ứng.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={sx}>
      {attributes.map((a) => {
        const v = value[a.code] ?? (a.input_type === 'multiselect' ? [] : '');

        if (a.input_type === 'select') {
          return (
            <TextField
              key={a.code}
              select
              label={a.name}
              value={v}
              onChange={(e) => set(a.code, e.target.value)}
              required={a.required}
              helperText={a.unit ? `Đơn vị: ${a.unit}` : null}
            >
              <MenuItem value="">—</MenuItem>
              {(a.options ?? []).map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {o.color_hex && (
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          bgcolor: o.color_hex,
                          border: 1,
                          borderColor: 'grey.300',
                        }}
                      />
                    )}
                    <span>{o.label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          );
        }

        if (a.input_type === 'multiselect') {
          return (
            <Autocomplete
              key={a.code}
              multiple
              options={a.options ?? []}
              getOptionLabel={(o) => o.label}
              value={(a.options ?? []).filter((o) => (v ?? []).includes(o.value))}
              onChange={(_, vs) => set(a.code, vs.map((o) => o.value))}
              renderTags={(selected, getTagProps) =>
                selected.map((o, i) => (
                  <Chip
                    {...getTagProps({ index: i })}
                    key={o.value}
                    label={o.label}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))
              }
              renderInput={(p) => <TextField {...p} label={a.name} required={a.required} />}
            />
          );
        }

        if (a.input_type === 'boolean') {
          return (
            <FormControlLabel
              key={a.code}
              control={
                <Switch
                  checked={!!v}
                  onChange={(e) => set(a.code, e.target.checked)}
                />
              }
              label={a.name}
            />
          );
        }

        if (a.input_type === 'decimal') {
          return (
            <DecimalInput
              key={a.code}
              label={a.name}
              value={v}
              onChange={(e) => set(a.code, e.target.value)}
              unit={a.unit ?? ''}
              required={a.required}
            />
          );
        }

        if (a.input_type === 'number') {
          return (
            <TextField
              key={a.code}
              type="number"
              label={a.name}
              value={v}
              onChange={(e) => set(a.code, e.target.value)}
              required={a.required}
              InputProps={a.unit ? { endAdornment: <Typography variant="body2" color="text.secondary">{a.unit}</Typography> } : undefined}
            />
          );
        }

        return (
          <TextField
            key={a.code}
            label={`${a.name}${a.unit ? ` (${a.unit})` : ''}`}
            value={v}
            onChange={(e) => set(a.code, e.target.value)}
            required={a.required}
          />
        );
      })}
    </Stack>
  );
}
