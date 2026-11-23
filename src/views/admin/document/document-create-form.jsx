// src/views/admin/document/document-create-form.jsx — FormDrawer upload tài liệu IR (lite polish + DatePicker)

'use client';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import UploadOutlined from '@mui/icons-material/UploadFileOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Stack, TextField, Typography,
} from '@mui/material';

import { UploadField } from 'src/views/admin/_shared/upload-field';
import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';

const GROUPS = [
  { value: 'financial_report', label: 'Báo cáo tài chính',  icon: 'solar:chart-linear' },
  { value: 'agm',              label: 'ĐHĐCĐ',               icon: 'solar:users-group-rounded-linear' },
  { value: 'disclosure',       label: 'Công bố thông tin',   icon: 'solar:document-text-linear' },
  { value: 'license',          label: 'Giấy phép',           icon: 'solar:verified-check-linear' },
];

const STATUSES = [
  { value: 'active', label: 'Hiển thị', icon: 'solar:check-circle-linear' },
  { value: 'draft',  label: 'Nháp',     icon: 'solar:document-text-linear' },
];

const EMPTY = {
  title: '',
  group: 'financial_report',
  year: new Date().getFullYear(),
  file_url: '',
  file_size: 0,
  published_at: new Date().toISOString(),
  status: 'active',
};

export function DocumentFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const canSubmit = form.title.trim() && !!form.file_url;

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {isEdit ? `Sửa tài liệu · ${initial?.title ?? ''}` : 'Upload tài liệu IR'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {isEdit ? initial?.title : 'Báo cáo tài chính · ĐHĐCĐ · Công bố thông tin · Giấy phép.'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end" size="small">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
      <Stack spacing={2}>
        <SectionCard icon={InfoOutlined} title="Thông tin tài liệu">
          <Stack spacing={2}>
            <Box>
              <FieldLabel required>TIÊU ĐỀ</FieldLabel>
              <TextField
                autoFocus fullWidth size="small"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Vd: Báo cáo tài chính Q4 2026"
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <FieldLabel>NHÓM</FieldLabel>
                <TextField
                  select fullWidth size="small"
                  value={form.group}
                  onChange={(e) => set('group', e.target.value)}
                >
                  {GROUPS.map((g) => (
                    <MenuItem key={g.value} value={g.value}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon={g.icon} width={16} sx={{ color: 'text.secondary' }} />
                        <span>{g.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ width: 140 }}>
                <FieldLabel>NĂM</FieldLabel>
                <TextField
                  type="number" size="small" fullWidth
                  value={form.year}
                  onChange={(e) => set('year', Number(e.target.value) || new Date().getFullYear())}
                  inputProps={{ min: 2000, max: 2100 }}
                />
              </Box>
            </Stack>
          </Stack>
        </SectionCard>

        <SectionCard icon={UploadOutlined} title="Tài liệu (PDF / Excel)" description="PDF hoặc Excel · ≤ 20MB">
          <UploadField
            label=""
            value={form.file_url}
            onChange={(v) => {
              set('file_url', v);
              set('file_size', v instanceof File ? v.size : form.file_size);
            }}
            accept={{
              'application/pdf': ['.pdf'],
              'application/vnd.ms-excel': ['.xls'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            }}
            maxSize={20 * 1024 * 1024}
          />
        </SectionCard>

        <SectionCard icon={ToggleOnOutlined} title="Lịch đăng & trạng thái">
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <FieldLabel>NGÀY ĐĂNG</FieldLabel>
              <DatePicker
                value={form.published_at ? dayjs(form.published_at) : null}
                onChange={(v) => set('published_at', v ? dayjs(v).toISOString() : '')}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: { fullWidth: true, size: 'small', placeholder: 'dd/mm/yyyy' },
                  actionBar: { actions: ['clear', 'today', 'accept'] },
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FieldLabel>TRẠNG THÁI</FieldLabel>
              <TextField
                select fullWidth size="small"
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Iconify icon={s.icon} width={16} sx={{ color: 'text.secondary' }} />
                      <span>{s.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Stack>
        </SectionCard>
      </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', animation: 'pulse 1.4s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />}
          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: dirty ? 'warning.dark' : 'text.secondary' }}>
            {dirty ? 'Có thay đổi chưa lưu' : isEdit ? 'Chưa có thay đổi' : 'Điền thông tin rồi bấm Upload'}
          </Typography>
          <Button onClick={onClose} color="inherit" startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}>Huỷ</Button>
          <Button
            variant="contained"
            disabled={!canSubmit || submitting || (isEdit && !dirty)}
            startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
            onClick={handleSubmit}
          >
            {isEdit ? 'Lưu thay đổi' : 'Upload'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
