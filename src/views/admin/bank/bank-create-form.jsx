// src/views/admin/bank/bank-create-form.jsx — FormDrawer tạo/sửa ngân hàng (lite polish)

'use client';

import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, IconButton, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { UploadField } from 'src/views/admin/_shared/upload-field';
import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

const EMPTY = {
  code: '',
  short_name: '',
  name: '',
  logo_file_id: '',
  supports_installment: false,
  sort: 10,
  status: 'active',
};

export function BankFormDrawer({ open, onClose, onSubmit, initial }) {
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
            {isEdit ? `Sửa ngân hàng · ${initial?.short_name ?? ''}` : 'Thêm ngân hàng'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {isEdit ? initial?.name : 'Dùng cho thanh toán, trả góp, hiển thị logo VietQR.'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end" size="small">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
      <Stack spacing={2}>
        <SectionCard icon={ImageOutlined} title="Logo ngân hàng" description="PNG trong suốt · tỷ lệ 2:1 · ≤ 2MB">
          <UploadField label="" value={form.logo_file_id} onChange={(v) => set('logo_file_id', v)} />
        </SectionCard>

        <SectionCard icon={InfoOutlined} title="Thông tin ngân hàng">
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Box sx={{ width: 160 }}>
                <FieldLabel required>CODE</FieldLabel>
                <TextField
                  autoFocus size="small" fullWidth
                  value={form.code}
                  onChange={(e) => set('code', e.target.value.toUpperCase())}
                  placeholder="VCB"
                  inputProps={{ style: { fontFamily: 'monospace', textTransform: 'uppercase' } }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FieldLabel>VIẾT TẮT</FieldLabel>
                <TextField
                  size="small" fullWidth
                  value={form.short_name}
                  onChange={(e) => set('short_name', e.target.value)}
                  placeholder="Vietcombank"
                />
              </Box>
            </Stack>
            <Box>
              <FieldLabel required>TÊN ĐẦY ĐỦ</FieldLabel>
              <TextField
                fullWidth size="small"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Ngân hàng TMCP Ngoại Thương Việt Nam"
              />
            </Box>
          </Stack>
        </SectionCard>

        <SectionCard icon={ToggleOnOutlined} title="Trạng thái & tuỳ chọn">
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={2}>
              <Box sx={{ width: 160 }}>
                <FieldLabel>SORT</FieldLabel>
                <TextField
                  type="number" size="small" fullWidth
                  value={form.sort}
                  onChange={(e) => set('sort', Number(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                />
              </Box>
            </Stack>
            <FormControlLabel
              control={<Switch checked={form.supports_installment} onChange={(_, v) => set('supports_installment', v)} />}
              label={<Typography variant="body2">Hỗ trợ trả góp 0%</Typography>}
            />
            <FormControlLabel
              control={<Switch checked={form.status === 'active'} onChange={(_, v) => set('status', v ? 'active' : 'inactive')} />}
              label={<Typography variant="body2">{form.status === 'active' ? 'Đang hiển thị' : 'Tạm ẩn'}</Typography>}
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo ngân hàng'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
