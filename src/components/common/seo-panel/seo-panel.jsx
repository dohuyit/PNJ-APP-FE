// src/components/common/seo-panel/seo-panel.jsx — SEO fields with char counters + Google preview
'use client';

import {
  Card, CardContent, Stack, TextField, Switch, FormControlLabel, Typography,
  LinearProgress, Box, Divider,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { UploadField } from 'src/views/admin/_shared/upload-field';

const TITLE_MAX = 60;
const DESC_MAX = 160;

export function SeoPanel({ value = {}, onChange, sx }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  const titleLen = (value.title ?? '').length;
  const descLen = (value.description ?? '').length;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify icon="solar:global-linear" width={20} sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight={600}>
              SEO & chia sẻ
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <TextField
              label="Title"
              value={value.title ?? ''}
              onChange={(e) => set('title', e.target.value)}
              helperText={`${titleLen}/${TITLE_MAX} ký tự`}
              error={titleLen > TITLE_MAX}
            />
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (titleLen / TITLE_MAX) * 100)}
              color={titleLen > TITLE_MAX ? 'error' : titleLen > TITLE_MAX * 0.9 ? 'warning' : 'success'}
              sx={{ height: 4, borderRadius: 1 }}
            />
          </Stack>

          <Stack spacing={0.5}>
            <TextField
              label="Description"
              value={value.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              helperText={`${descLen}/${DESC_MAX} ký tự`}
              multiline
              rows={3}
              error={descLen > DESC_MAX}
            />
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (descLen / DESC_MAX) * 100)}
              color={descLen > DESC_MAX ? 'error' : descLen > DESC_MAX * 0.9 ? 'warning' : 'success'}
              sx={{ height: 4, borderRadius: 1 }}
            />
          </Stack>

          <TextField
            label="Canonical URL"
            value={value.canonical ?? ''}
            onChange={(e) => set('canonical', e.target.value)}
            placeholder="https://..."
            sx={{ '& input': { fontFamily: 'monospace' } }}
          />

          <TextField
            label="Keywords (ngăn cách bằng dấu phẩy)"
            value={value.keywords ?? ''}
            onChange={(e) => set('keywords', e.target.value)}
          />

          <FormControlLabel
            control={
              <Switch
                checked={!!value.noindex}
                onChange={(e) => set('noindex', e.target.checked)}
              />
            }
            label={
              <Stack>
                <Typography variant="body2" fontWeight={500}>Không index</Typography>
                <Typography variant="caption" color="text.secondary">
                  Thêm meta noindex — Google sẽ không hiển thị trang này.
                </Typography>
              </Stack>
            }
          />

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle2">OG Image (ảnh chia sẻ MXH)</Typography>
            <UploadField
              value={value.og_image_url || null}
              onChange={(file) => {
                if (file instanceof File) {
                  onChange({
                    ...value,
                    og_image_file_id: `tmp-${Date.now()}`,
                    og_image_url: URL.createObjectURL(file),
                  });
                } else {
                  onChange({ ...value, og_image_file_id: null, og_image_url: '' });
                }
              }}
            />
          </Stack>

          <Box
            sx={{
              bgcolor: 'grey.50',
              border: 1,
              borderColor: 'grey.300',
              borderRadius: 1,
              p: 2,
            }}
          >
            <Typography variant="overline" color="text.secondary">
              Xem trước Google
            </Typography>
            <Typography variant="body2" sx={{ color: '#1a0dab', fontSize: 18, mt: 0.5 }}>
              {value.title || 'Tiêu đề trang sẽ hiển thị ở đây'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#006621', fontFamily: 'monospace', display: 'block' }}>
              {value.canonical || 'https://pnj.example.com/...'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {value.description || 'Mô tả sẽ hiển thị ở đây...'}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
