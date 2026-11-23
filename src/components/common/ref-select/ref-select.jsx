// src/components/common/ref-select/ref-select.jsx — async searchable select backed by SWR
'use client';

import { Autocomplete, Avatar, Box, Chip, CircularProgress, TextField } from '@mui/material';
import useSWR from 'swr';
import { adminFetcher } from 'src/lib/pnj-api/swr-fetcher';

/**
 * @param {{
 *   endpoint: string, value: any, onChange: Function, label: string,
 *   multiple?: boolean, getOptionLabel?: (o:any)=>string,
 *   mockFallback?: any[],
 *   renderAvatar?: (o:any)=>string,
 * }} props
 */
export function RefSelect({
  endpoint,
  value,
  onChange,
  label,
  multiple = false,
  getOptionLabel = (o) => o?.name ?? '',
  mockFallback = [],
  renderAvatar,
  placeholder,
  sx,
}) {
  const { data, error, isLoading } = useSWR(endpoint, adminFetcher, { shouldRetryOnError: false });
  const options = error ? mockFallback : data?.data ?? [];

  return (
    <Autocomplete
      multiple={multiple}
      loading={isLoading}
      options={options}
      value={value ?? (multiple ? [] : null)}
      onChange={(_, v) => onChange(v)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(a, b) => (a?.id ?? a?._id) === (b?.id ?? b?._id)}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {renderAvatar && <Avatar src={renderAvatar(option)} sx={{ width: 24, height: 24 }} />}
          <Box sx={{ flex: 1 }}>{getOptionLabel(option)}</Box>
        </Box>
      )}
      renderTags={(selected, getTagProps) =>
        selected.map((o, i) => (
          <Chip
            {...getTagProps({ index: i })}
            key={o.id ?? o._id}
            label={getOptionLabel(o)}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading && <CircularProgress size={16} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={sx}
    />
  );
}
