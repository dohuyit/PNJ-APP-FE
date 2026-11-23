// src/views/admin/url-redirect/url-redirect-create-form.jsx — FormDrawer tạo/sửa URL redirect (lite polish)

'use client';

import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, IconButton, InputAdornment, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';

const CODES = [
  { value: 301, label: '301 — Vĩnh viễn', icon: 'solar:arrow-right-linear' },
  { value: 302, label: '302 — Tạm thời',  icon: 'solar:refresh-circle-linear' },
];

const EMPTY = {
  from_path: '',
  to_path: '',
  code: 301,
  note: '',
  is_active: true,
};

export function UrlRedirectFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const same = form.from_path && form.to_path && form.from_path === form.to_path;
  const canSubmit = form.from_path.trim() && form.to_path.trim() && !same;

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {isEdit ? 'Sửa redirect' : 'Tạo redirect'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {isEdit ? `${initial?.from_path} → ${initial?.to_path}` : 'Đổi slug không mất SEO — luôn dùng 301 trừ khi URL đích còn tạm thời.'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end" size="small">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
      <Stack spacing={2}>
        <SectionCard icon={InfoOutlined} title="Đường dẫn">
          <Stack spacing={2}>
            <Box>
              <FieldLabel required>TỪ (URL CŨ)</FieldLabel>
              <TextField
                autoFocus fullWidth size="small"
                value={form.from_path}
                onChange={(e) => set('from_path', e.target.value)}
                placeholder="/vong-tay-vang-10k-cu"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Iconify icon="solar:link-broken-linear" width={16} sx={{ color: 'error.main' }} /></InputAdornment>,
                  sx: { fontFamily: 'monospace' },
                }}
              />
            </Box>
            <Box>
              <FieldLabel required>ĐẾN (URL MỚI)</FieldLabel>
              <TextField
                fullWidth size="small"
                value={form.to_path}
                onChange={(e) => set('to_path', e.target.value)}
                placeholder="/vong-tay-vang-10k-moi"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Iconify icon="solar:link-linear" width={16} sx={{ color: 'success.main' }} /></InputAdornment>,
                  sx: { fontFamily: 'monospace' },
                }}
              />
            </Box>
            {same && <Alert severity="error">URL nguồn và URL đích phải khác nhau.</Alert>}
          </Stack>
        </SectionCard>

        <SectionCard icon={ToggleOnOutlined} title="Cấu hình">
          <Stack spacing={2}>
            <Box>
              <FieldLabel>MÃ REDIRECT</FieldLabel>
              <TextField
                select fullWidth size="small"
                value={form.code}
                onChange={(e) => set('code', Number(e.target.value))}
              >
                {CODES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Iconify icon={c.icon} width={16} sx={{ color: 'text.secondary' }} />
                      <span>{c.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box>
              <FieldLabel>GHI CHÚ</FieldLabel>
              <TextField
                fullWidth size="small" multiline rows={2}
                value={form.note}
                onChange={(e) => set('note', e.target.value)}
                placeholder="Vd: Đổi slug sau chiến dịch 2026-11"
              />
            </Box>
            <FormControlLabel
              control={<Switch checked={form.is_active} onChange={(_, v) => set('is_active', v)} />}
              label={<Typography variant="body2">{form.is_active ? 'Đang chạy' : 'Tạm tắt'}</Typography>}
            />
          </Stack>
        </SectionCard>
      </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', animation: 'pulse 1.4s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />}
          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: dirty ? 'warning.dark' : 'text.secondary' }}>
            {dirty ? 'Có thay đổi chưa lưu' : isEdit ? 'Chưa có thay đổi' : 'Điền thông tin rồi bấm Tạo'}
          </Typography>
          <Button onClick={onClose} color="inherit" startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}>Huỷ</Button>
          <Button
            variant="contained"
            disabled={!canSubmit || submitting || (isEdit && !dirty)}
            startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
            onClick={handleSubmit}
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo redirect'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
