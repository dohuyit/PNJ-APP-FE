// src/components/common/media-picker/media-picker.jsx — dropzone + thumbnail grid for file_ids
'use client';

import {
  Box, Grid, IconButton, Stack, Typography, Chip,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useDropzone } from 'react-dropzone';

/**
 * @param {{ value: Array<{file_id:string,url:string,alt?:string,type?:'image'|'video'}>, onChange: Function, multiple?: boolean, label?: string, accept?: Record<string,string[]> }} props
 */
const MAX_SIZE_DEFAULT = 10 * 1024 * 1024; // 10MB/file — chỉnh qua prop maxSize.

export function MediaPicker({
  value = [],
  onChange,
  multiple = true,
  label = 'Hình ảnh / Video',
  accept = { 'image/*': [], 'video/*': [] },
  maxFiles = 20,
  maxSize = MAX_SIZE_DEFAULT,
  error,
  sx,
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    maxSize,
    onDrop: (files) => {
      const added = files.map((f, i) => ({
        file_id: `tmp-${Date.now()}-${i}`,
        url: URL.createObjectURL(f),
        alt: f.name,
        type: f.type.startsWith('video/') ? 'video' : 'image',
        _preview: true,
      }));
      onChange(multiple ? [...value, ...added].slice(0, maxFiles) : added.slice(0, 1));
    },
  });

  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const mb = Math.round(maxSize / 1048576);

  return (
    <Stack spacing={1.5} sx={sx}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="caption" color="text.secondary">
          {value.length}/{maxFiles}
        </Typography>
      </Stack>

      {/* Compact dropzone — khớp style src/subs/components/file/upload-compact.jsx của zeno-crm-fe */}
      <Box
        {...getRootProps()}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          px: '14px',
          py: '18px',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: 1,
          border: '1px dashed',
          borderColor: error
            ? 'error.main'
            : isDragActive
            ? 'primary.main'
            : 'rgba(145,158,171,.4)',
          bgcolor: isDragActive ? 'primary.lighter' : 'background.paper',
          transition: 'all .12s',
          outline: 'none',
          '&:hover, &:focus-visible': { borderColor: 'primary.main' },
        }}
      >
        <input {...getInputProps()} />
        <Iconify
          icon="material-symbols:upload"
          width={22}
          sx={{ mb: '2px', color: 'text.secondary' }}
        />
        <Box sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
          Kéo thả hoặc{' '}
          <Box
            component="span"
            sx={{ color: 'primary.dark', textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            chọn file
          </Box>
        </Box>
        <Box sx={{ fontSize: 11.5, color: 'text.disabled' }}>
          Ảnh/Video · ≤ {mb} MB/file · tối đa {maxFiles} file
        </Box>
      </Box>

      {value.length > 0 && (
        <Grid container spacing={1.5}>
          {value.map((m, i) => (
            <Grid key={m.file_id} item xs={6} sm={4} md={3}>
              <Box
                sx={{
                  position: 'relative',
                  aspectRatio: '1/1',
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: 1,
                  borderColor: 'grey.300',
                  '&:hover .mp-overlay': { opacity: 1 },
                }}
              >
                {m.type === 'video' ? (
                  <video
                    src={m.url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    component="img"
                    src={m.url}
                    alt={m.alt}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {i === 0 && (
                  <Chip
                    label="Ảnh bìa"
                    size="small"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      fontSize: 10,
                      height: 20,
                    }}
                  />
                )}
                <Box
                  className="mp-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'rgba(0,0,0,.4)',
                    opacity: 0,
                    transition: 'opacity .2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => remove(i)}
                    sx={{ bgcolor: 'common.white', '&:hover': { bgcolor: 'error.lighter' } }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
