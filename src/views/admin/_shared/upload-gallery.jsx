// src/views/admin/_shared/upload-gallery.jsx
// Multi-file wrapper quanh <Upload> — gallery ảnh/video cho các form admin.
// - Nhận value = Array<File | string(URL)>
// - Trả về mảng mới qua onChange khi add / remove
// - Preview thumbnail; limit maxFiles

'use client';

import { useEffect, useMemo } from 'react';

import { Box, FormHelperText, Typography } from '@mui/material';

import { Upload } from 'src/components/upload';

/**
 * @param {{
 *   value: Array<File|string>,
 *   onChange: (arr: Array<File|string>) => void,
 *   label?: string,
 *   accept?: Record<string, string[]>,
 *   maxSize?: number,
 *   maxFiles?: number,
 *   helperText?: string,
 *   error?: string,
 *   sx?: object,
 * }} props
 */
export function UploadGallery({
  value = [],
  onChange,
  label,
  accept = { 'image/*': [] },
  maxSize = 10 * 1024 * 1024, // 10MB/file
  maxFiles = 20,
  helperText,
  error,
  sx,
}) {
  const files = useMemo(() => value
      .filter(Boolean)
      .map((v) => {
        if (v instanceof File) return Object.assign(v, { preview: v.preview || URL.createObjectURL(v) });
        if (typeof v === 'string') return { preview: v, name: v.split('/').pop() || 'image', path: v };
        return v;
      }), [value]);

  // Revoke object URLs khi unmount (tránh leak)
  useEffect(() => 
     () => {
      files.forEach((f) => {
        if (f?.preview && typeof f.preview === 'string' && f.preview.startsWith('blob:')) {
          URL.revokeObjectURL(f.preview);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  , []);

  const handleDrop = (accepted) => {
    if (!accepted?.length) return;
    const next = [...value, ...accepted].slice(0, maxFiles);
    onChange?.(next);
  };

  const handleRemove = (file) => {
    const next = value.filter((v) => {
      if (v instanceof File) return v !== file;
      if (typeof v === 'string') return v !== file?.preview && v !== file?.path;
      return v !== file;
    });
    onChange?.(next);
  };

  const handleRemoveAll = () => onChange?.([]);

  // Ponytail self-check — trả cảnh báo dev nếu vượt maxFiles
  if (process.env.NODE_ENV !== 'production' && value.length > maxFiles) {
    // eslint-disable-next-line no-console
    console.warn(`[UploadGallery] value.length (${value.length}) > maxFiles (${maxFiles})`);
  }

  return (
    <Box sx={sx}>
      {label && (
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: 0.75 }}>
          {label}
        </Typography>
      )}
      <Upload
        multiple
        thumbnail
        value={files}
        accept={accept}
        maxSize={maxSize}
        onDrop={handleDrop}
        onRemove={handleRemove}
        onRemoveAll={value.length > 0 ? handleRemoveAll : undefined}
        error={!!error}
      />
      {(error || helperText) && (
        <FormHelperText error={!!error} sx={{ mx: 1.5, fontSize: 11, mt: 0.5 }}>
          {error || helperText}
        </FormHelperText>
      )}
    </Box>
  );
}
