// src/views/admin/_shared/upload-field.jsx
// Thin wrapper quanh <Upload> để các form drawer dùng chung.
// - Nhận value = File | string(URL) | null
// - Trả về File qua onChange khi user kéo-thả, hoặc null khi xoá
// - Preview ảnh nếu value là URL string

'use client';

import { useEffect, useMemo } from 'react';

import { Box, FormHelperText, Typography } from '@mui/material';

import { Upload } from 'src/components/upload';

/**
 * @param {{
 *   value: File|string|null,
 *   onChange: (val: File|null) => void,
 *   label?: string,
 *   accept?: Record<string, string[]>,  // dropzone-style, default: { 'image/*': [] }
 *   maxSize?: number,                    // bytes
 *   helperText?: string,
 *   error?: string,
 *   placeholder?: string,
 *   sx?: object,
 * }} props
 */
export function UploadField({
  value,
  onChange,
  label,
  required = false,
  accept = { 'image/*': [] },
  maxSize = 2 * 1024 * 1024,
  helperText,
  error,
  sx,
}) {
  // Nếu value là URL string → fake File preview
  const previewFile = useMemo(() => {
    if (!value) return null;
    if (value instanceof File) return Object.assign(value, { preview: URL.createObjectURL(value) });
    if (typeof value === 'string') return { preview: value, name: value.split('/').pop() || 'preview', path: value };
    return value;
  }, [value]);

  // Revoke object URL khi unmount để tránh memory leak
  useEffect(() => () => {
      if (value instanceof File && previewFile?.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(previewFile.preview);
      }
    }, [value, previewFile]);

  return (
    <Box sx={sx}>
      {label && (
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: 0.75 }}>
          {label}
          {required && <Box component="span" sx={{ color: 'error.main', ml: 0.25 }}>*</Box>}
        </Typography>
      )}
      <Upload
        value={previewFile}
        accept={accept}
        maxSize={maxSize}
        onDrop={(accepted) => onChange?.(accepted?.[0] ?? null)}
        onDelete={() => onChange?.(null)}
        error={!!error}
        sx={{
          '& .MuiBox-root[class*="upload"]:first-of-type': {
            p: previewFile ? 0 : 3,
          },
        }}
      />
      {(error || helperText) && (
        <FormHelperText error={!!error} sx={{ mx: 1.5, fontSize: 11, mt: 0.5 }}>
          {error || helperText}
        </FormHelperText>
      )}
    </Box>
  );
}
