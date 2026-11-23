// src/views/admin/post-category/post-category-create-form.jsx — FormDrawer chuyên mục blog (lite polish)

'use client';

import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, IconButton, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { UploadField } from 'src/views/admin/_shared/upload-field';
import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { SlugInput } from 'src/components/common/slug-input';
import { mockPostCategories } from 'src/mock-data';

const postCategoriesTree = mockPostCategories;

const EMPTY = {
  name: '',
  slug: '',
  parent_id: '',
  cover: '',
  sort: 10,
  status: 'active',
};

const flatCategories = postCategoriesTree.flatMap((c) => [c, ...(c.children ?? [])]);

export function PostCategoryFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const canSubmit = form.name.trim() && form.slug.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {isEdit ? `Sửa chuyên mục · ${initial?.name ?? ''}` : 'Thêm chuyên mục'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {isEdit ? initial?.name : 'Cây 2 cấp · Mix & Match, Kiến thức, Cung Mệnh, Tin tức.'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end" size="small">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
      <Stack spacing={2}>
        <SectionCard icon={InfoOutlined} title="Thông tin chuyên mục">
          <Stack spacing={2}>
            <Box>
              <FieldLabel required>TÊN CHUYÊN MỤC</FieldLabel>
              <TextField
                autoFocus fullWidth size="small"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Vd: Mix & Match"
              />
            </Box>
            <Box>
              <FieldLabel required>SLUG</FieldLabel>
              <SlugInput label="" value={form.slug} onChange={(v) => set('slug', v)} sourceName={form.name} />
            </Box>
            <Box>
              <FieldLabel>CHUYÊN MỤC CHA</FieldLabel>
              <TextField
                select fullWidth size="small"
                value={form.parent_id}
                onChange={(e) => set('parent_id', e.target.value)}
                helperText="Để trống = chuyên mục cấp 1."
              >
                <MenuItem value="">— Không có —</MenuItem>
                {flatCategories.filter((c) => !c.parent_id).map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Stack>
        </SectionCard>

        <SectionCard icon={ImageOutlined} title="Ảnh cover" description="JPG/PNG/WEBP ≤ 2MB.">
          <UploadField label="" value={form.cover} onChange={(v) => set('cover', v)} />
        </SectionCard>

        <SectionCard icon={ToggleOnOutlined} title="Sort & trạng thái">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: 160 }}>
              <FieldLabel>SORT</FieldLabel>
              <TextField
                type="number" size="small" fullWidth
                value={form.sort}
                onChange={(e) => set('sort', Number(e.target.value) || 0)}
                inputProps={{ min: 0 }}
              />
            </Box>
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
            {dirty ? 'Có thay đổi chưa lưu' : isEdit ? 'Chưa có thay đổi' : 'Điền thông tin rồi bấm Thêm'}
          </Typography>
          <Button onClick={onClose} color="inherit" startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}>Huỷ</Button>
          <Button
            variant="contained"
            disabled={!canSubmit || submitting || (isEdit && !dirty)}
            startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
            onClick={handleSubmit}
          >
            {isEdit ? 'Lưu thay đổi' : 'Thêm chuyên mục'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
