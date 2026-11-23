// src/views/admin/size-guide/size-guide-create-form.jsx — Dialog tạo/sửa hướng dẫn size
// Form nhỏ (3 field + bảng quy đổi) nên dùng Dialog gọn hơn FormDrawer.

'use client';

import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import StraightenOutlined from '@mui/icons-material/StraightenOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
  MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,
} from '@mui/material';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';

const TYPES = [
  { value: 'ring',     label: 'Nhẫn',       icon: 'solar:ring-linear' },
  { value: 'bangle',   label: 'Vòng tay',   icon: 'solar:ring-linear' },
  { value: 'necklace', label: 'Dây chuyền', icon: 'solar:crown-line-linear' },
  { value: 'bracelet', label: 'Lắc tay',    icon: 'solar:tag-horizontal-linear' },
];

const EMPTY = {
  name: '',
  type: 'ring',
  items: [
    { size: '15', mm: 47.1, inch: 1.85, note: '' },
    { size: '16', mm: 50.3, inch: 1.98, note: '' },
  ],
  status: 'active',
};

export function SizeGuideFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial, items: initial.items ?? EMPTY.items } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  const setItem = (idx, k, v) => {
    setForm((f) => ({ ...f, items: f.items.map((it, i) => (i === idx ? { ...it, [k]: v } : it)) }));
    setDirty(true);
  };
  const addItem = () => { setForm((f) => ({ ...f, items: [...f.items, { size: '', mm: 0, inch: 0, note: '' }] })); setDirty(true); };
  const removeItem = (idx) => { setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) })); setDirty(true); };

  const canSubmit = form.name.trim() && form.items.length > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 1.5 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {isEdit ? `Sửa hướng dẫn · ${initial?.name ?? ''}` : 'Tạo hướng dẫn size'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Nhẫn / Vòng tay / Lắc / Dây chuyền — bảng quy đổi size ↔ mm.
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end" size="small">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
        <Stack spacing={2}>
          <SectionCard icon={InfoOutlined} title="Thông tin">
            <Stack spacing={2}>
              <Box>
                <FieldLabel required>TÊN HƯỚNG DẪN</FieldLabel>
                <TextField
                  autoFocus fullWidth size="small"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Vd: Đo size nhẫn nữ"
                />
              </Box>
              <Box sx={{ width: 240 }}>
                <FieldLabel>LOẠI TRANG SỨC</FieldLabel>
                <TextField
                  select fullWidth size="small"
                  value={form.type}
                  onChange={(e) => set('type', e.target.value)}
                >
                  {TYPES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon={t.icon} width={16} sx={{ color: 'text.secondary' }} />
                        <span>{t.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Stack>
          </SectionCard>

          <SectionCard
            icon={StraightenOutlined}
            title={`Bảng quy đổi · ${form.items.length} dòng`}
            action={
              <Button
                size="small" variant="outlined"
                startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
                onClick={addItem}
              >
                Thêm dòng
              </Button>
            }
          >
            <Table
              size="small"
              sx={{
                // Theme core (Minimal Kit) đặt dashed border cho TableCell —
                // override tại đây để bảng form có border solid mảnh, hoặc none.
                '& .MuiTableCell-root': { borderBottomStyle: 'solid', borderColor: 'divider' },
                '& .MuiTableBody-root .MuiTableCell-root': { borderBottom: 0 },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">mm</TableCell>
                  <TableCell align="right">inch</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell width={40} />
                </TableRow>
              </TableHead>
              <TableBody>
                {form.items.map((it, i) => (
                  <TableRow key={i}>
                    <TableCell><TextField size="small" value={it.size} onChange={(e) => setItem(i, 'size', e.target.value)} placeholder="15" sx={{ width: 80 }} /></TableCell>
                    <TableCell align="right">
                      <TextField type="number" size="small" sx={{ width: 100 }} value={it.mm} onChange={(e) => setItem(i, 'mm', Number(e.target.value) || 0)} inputProps={{ step: 0.1 }} />
                    </TableCell>
                    <TableCell align="right">
                      <TextField type="number" size="small" sx={{ width: 100 }} value={it.inch} onChange={(e) => setItem(i, 'inch', Number(e.target.value) || 0)} inputProps={{ step: 0.01 }} />
                    </TableCell>
                    <TableCell>
                      <TextField size="small" fullWidth value={it.note} onChange={(e) => setItem(i, 'note', e.target.value)} placeholder="Phổ thông, trẻ em…" />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => removeItem(i)} sx={{ color: 'error.main' }}>
                        <Iconify icon="solar:trash-bin-trash-linear" width={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && (
            <Box sx={{
              width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main',
              animation: 'pulse 1.4s infinite',
              '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
            }} />
          )}
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo hướng dẫn'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
