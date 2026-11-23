// src/components/common/money-input/money-input.jsx — VND number input (integer only) with thousand grouping
'use client';

import { TextField, InputAdornment } from '@mui/material';
import { NumericFormat } from 'react-number-format';

const MoneyFormatAdapter = ({ onChange, name, ...rest }) => (
  <NumericFormat
    {...rest}
    getInputRef={rest.inputRef}
    thousandSeparator="."
    decimalSeparator=","
    decimalScale={0}
    allowNegative={false}
    onValueChange={(v) => onChange({ target: { name, value: v.floatValue ?? '' } })}
  />
);

/**
 * @param {import('@mui/material').TextFieldProps & { value:number|string, onChange:Function }} props
 */
export function MoneyInput({ value, onChange, label, sx, ...props }) {
  return (
    <TextField
      {...props}
      label={label}
      value={value ?? ''}
      onChange={onChange}
      InputProps={{
        inputComponent: MoneyFormatAdapter,
        endAdornment: <InputAdornment position="end">₫</InputAdornment>,
      }}
      sx={{
        '& .MuiInputBase-input': { textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
        ...sx,
      }}
    />
  );
}
