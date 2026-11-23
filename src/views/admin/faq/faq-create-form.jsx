// src/views/admin/faq/faq-create-form.jsx — FormDrawer tạo/sửa FAQ (lite polish brand-style)

'use client';

import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';

const GROUPS = [
  { value: 'product_general', label: 'SP chung',   icon: 'solar:tag-linear' },
  { value: 'payment',         label: 'Thanh toán', icon: 'solar:card-linear' },
  { value: 'shipping',        label: 'Giao hàng',  icon: 'solar:delivery-linear' },
  { value: 'warranty',        label: 'Bảo hành',   icon: 'solar:shield-check-linear' },
];

const EMPTY = {
  question: '',
  answer_html: '',
  group: 'product_general',
  sort: 10,
  status: 'active',
};

export function FaqFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const canSubmit = form.question.trim() && form.answer_html.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {isEdit ? 'Sửa FAQ' : 'Thêm FAQ'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {isEdit ? initial?.question : 'Q&A hiển thị trên trang Hỗ trợ · nhóm theo chủ đề.'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end" size="small">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
      <Stack spacing={2}>
        <SectionCard icon={InfoOutlined} title="Câu hỏi">
          <TextField
            value={form.question}
            onChange={(e) => set('question', e.target.value)}
            fullWidth size="small" autoFocus
            placeholder="Vd: Làm thế nào để đổi size nhẫn?"
          />
        </SectionCard>

        <SectionCard icon={ArticleOutlined} title="Câu trả lời (HTML)" description="Hỗ trợ thẻ &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;a&gt;.">
          <TextField
            value={form.answer_html}
            onChange={(e) => set('answer_html', e.target.value)}
            fullWidth size="small" multiline rows={8}
            placeholder="Vd: Bạn có thể đổi size nhẫn trong vòng 48h kể từ khi mua, kèm hoá đơn và tem còn nguyên…"
          />
        </SectionCard>

        <SectionCard icon={ToggleOnOutlined} title="Nhóm · Sort · Trạng thái">
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
            <Box sx={{ width: 120 }}>
              <FieldLabel>SORT</FieldLabel>
              <TextField
                type="number" fullWidth size="small"
                value={form.sort}
                onChange={(e) => set('sort', Number(e.target.value) || 0)}
                inputProps={{ min: 0 }}
              />
            </Box>
          </Stack>
          <Box sx={{ mt: 2 }}>
            <Switch
              checked={form.status === 'active'}
              onChange={(_, v) => set('status', v ? 'active' : 'inactive')}
            />
            <Typography component="span" variant="body2" sx={{ ml: 1 }}>
              {form.status === 'active' ? 'Đang hiển thị trên site' : 'Tạm ẩn'}
            </Typography>
          </Box>
        </SectionCard>
      </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && (
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', animation: 'pulse 1.4s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
          )}
          <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: dirty ? 'warning.dark' : 'text.secondary' }}>
            {dirty ? 'Có thay đổi chưa lưu' : isEdit ? 'Chưa có thay đổi' : 'Điền thông tin rồi bấm Thêm'}
          </Typography>
          <Button onClick={onClose} color="inherit" startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}>Huỷ</Button>
          <Button
            variant="contained"
            disabled={!canSubmit || submitting || (isEdit && !dirty)}
            startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
            onClick={handleSubmit}
          >
            {isEdit ? 'Lưu thay đổi' : 'Thêm FAQ'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
