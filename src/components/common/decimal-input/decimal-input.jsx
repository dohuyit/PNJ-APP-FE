// src/components/common/decimal-input/decimal-input.jsx — for weights (phân, ly), carat, purity
'use client';

import { TextField, InputAdornment } from '@mui/material';
import { NumericFormat } from 'react-number-format';

const DecimalAdapter = ({ onChange, name, ...rest }) => (
  <NumericFormat
    {...rest}
    getInputRef={rest.inputRef}
    decimalScale={4}
    allowNegative={false}
    thousandSeparator="."
    decimalSeparator=","
    onValueChange={(v) => onChange({ target: { name, value: v.floatValue ?? '' } })}
  />
);

export function DecimalInput({ value, onChange, label, unit = 'phân', sx, ...props }) {
  return (
    <TextField
      {...props}
      label={label}
      value={value ?? ''}
      onChange={onChange}
      InputProps={{
        inputComponent: DecimalAdapter,
        endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
      }}
      sx={{
        '& .MuiInputBase-input': { textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
        ...sx,
      }}
    />
  );
}
