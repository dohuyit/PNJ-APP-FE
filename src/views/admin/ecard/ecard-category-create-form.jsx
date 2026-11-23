// src/views/admin/ecard/ecard-category-create-form.jsx — FormDrawer chủ đề thiệp (lite polish)

'use client';

import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, IconButton, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

const EMPTY = { code: '', name: '', sort: 10, status: 'active' };

export function EcardCategoryFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const canSubmit = form.code.trim() && form.name.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {isEdit ? `Sửa chủ đề · ${initial?.name ?? ''}` : 'Tạo chủ đề thiệp'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {isEdit ? initial?.name : 'Tặng mẹ · Thả thính · 20/10 · Nhà giáo · Giáng Sinh…'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end" size="small">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
        <SectionCard icon={InfoOutlined} title="Thông tin chủ đề">
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Box sx={{ width: 220 }}>
              <FieldLabel required>CODE</FieldLabel>
              <TextField
                autoFocus size="small" fullWidth
                value={form.code}
                onChange={(e) => set('code', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                placeholder="tang_me"
                inputProps={{ style: { fontFamily: 'monospace' } }}
              />
            </Box>
            <Box sx={{ width: 120 }}>
              <FieldLabel>SORT</FieldLabel>
              <TextField
                type="number" size="small" fullWidth
                value={form.sort}
                onChange={(e) => set('sort', Number(e.target.value) || 0)}
                inputProps={{ min: 0 }}
              />
            </Box>
          </Stack>
          <Box>
            <FieldLabel required>TÊN HIỂN THỊ</FieldLabel>
            <TextField
              fullWidth size="small"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Vd: Tặng mẹ yêu"
            />
          </Box>
          <FormControlLabel
            control={<Switch checked={form.status === 'active'} onChange={(_, v) => set('status', v ? 'active' : 'inactive')} />}
            label={<Typography variant="body2">{form.status === 'active' ? 'Đang hiển thị' : 'Tạm ẩn'}</Typography>}
          />
        </Stack>
      </SectionCard>
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo chủ đề'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
