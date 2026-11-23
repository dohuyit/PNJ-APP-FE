// src/views/admin/menu/menu-create-form.jsx — FormDrawer tạo/sửa vị trí menu
// Style khớp brand-form: full-width · SectionCard · 2-col · dirty indicator · preview chip.

'use client';

import { useState, useEffect, useMemo } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import ViewColumnOutlined from '@mui/icons-material/ViewColumnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Chip, FormControlLabel, Grid, InputAdornment, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';

// ----------------------------------------------------------------------

const GROUPS = [
  { value: 'header', label: 'Khu vực đầu trang',  icon: 'solar:hamburger-menu-linear', color: '#2563EB', desc: 'Menu ngay dưới logo · trên banner hero.' },
  { value: 'mega',   label: 'Mega menu',           icon: 'solar:widget-linear',         color: '#D97706', desc: 'Menu nhiều cột khi hover tab ở main nav (Nữ/Nam/Trẻ em).' },
  { value: 'footer', label: 'Chân trang',          icon: 'solar:document-text-linear',  color: '#059669', desc: 'Cột trong footer (Về PNJ, Dịch vụ, Chính sách…).' },
  { value: 'mobile', label: 'Thiết bị di động',    icon: 'solar:smartphone-linear',     color: '#7C3AED', desc: 'Drawer bên trái trên mobile.' },
];

const STATUSES = [
  { value: 'active',   label: 'Đang hiển thị', icon: 'solar:check-circle-linear' },
  { value: 'draft',    label: 'Nháp',          icon: 'solar:document-text-linear' },
  { value: 'inactive', label: 'Tạm ẩn',        icon: 'solar:pause-circle-linear' },
];

const EMPTY = {
  label: '',
  code: '',
  group: 'header',
  hint: '',
  sort: 1,
  status: 'active',
  show_in_cache: true,
  max_depth: 3,
  audience: 'any',
};

function slugify(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// ----------------------------------------------------------------------

export function MenuLocationFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoCode, setAutoCode] = useState(true);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
      setAutoCode(!initial);
      setDirty(false);
    }
  }, [open, initial]);

  const set = (k, v) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === 'label' && autoCode) next.code = slugify(v);
      return next;
    });
    setDirty(true);
  };

  const selectedGroup = useMemo(() => GROUPS.find((g) => g.value === form.group), [form.group]);
  const canSubmit = form.label.trim() && form.code.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa vị trí · ${initial?.label ?? ''}` : 'Thêm vị trí menu'}
      subtitle={
        isEdit
          ? `${selectedGroup?.label ?? '—'} · ${form.code}`
          : 'Khai báo vị trí menu mới trên website · dùng làm container cho cây menu / mega-panel.'
      }
      footer={
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && (
            <Box
              sx={{
                width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main',
                animation: 'pulse 1.4s infinite',
                '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
              }}
            />
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo vị trí'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          {/* ============ LEFT ============ */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard
                icon={InfoOutlined}
                title="Thông tin chung"
                description="Tên hiển thị trong admin + mã khoá dùng trong code."
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>TÊN HIỂN THỊ</FieldLabel>
                    <TextField
                      value={form.label}
                      onChange={(e) => set('label', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: Mega menu · Nữ"
                      helperText="Tên chỉ dùng trong admin, khách không thấy."
                    />
                  </Box>
                  <Box>
                    <FieldLabel required>MÃ ĐỊNH DANH (code)</FieldLabel>
                    <TextField
                      value={form.code}
                      onChange={(e) => { setAutoCode(false); set('code', slugify(e.target.value)); }}
                      fullWidth size="small"
                      placeholder="mega_female"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:code-linear" width={14} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Chip
                              label={autoCode ? 'Tự động' : 'Tuỳ chỉnh'}
                              size="small"
                              onClick={() => { setAutoCode(true); set('code', slugify(form.label)); }}
                              sx={{
                                height: 20, fontSize: 10, fontWeight: 600, cursor: 'pointer',
                                bgcolor: autoCode ? '#DCFCE7' : 'grey.100',
                                color: autoCode ? '#047857' : 'text.secondary',
                              }}
                            />
                          </InputAdornment>
                        ),
                        sx: { fontFamily: 'monospace' },
                      }}
                      helperText="Khoá duy nhất. Dùng chữ thường, số, gạch dưới."
                    />
                  </Box>
                  <Box>
                    <FieldLabel>GHI CHÚ (admin)</FieldLabel>
                    <TextField
                      value={form.hint}
                      onChange={(e) => set('hint', e.target.value)}
                      fullWidth size="small" multiline rows={2}
                      placeholder="Vd: Hover &lsquo;Nữ&rsquo; ở main nav · 3 cấp"
                      helperText="Mô tả ngắn giúp admin khác hiểu vị trí đặt ở đâu."
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={ViewColumnOutlined}
                title="Nhóm vị trí"
                description="Quyết định vị trí xuất hiện trên website."
              >
                <Stack spacing={1}>
                  {GROUPS.map((g) => {
                    const active = form.group === g.value;
                    return (
                      <Box
                        key={g.value}
                        onClick={() => set('group', g.value)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 1.5,
                          p: 1.5, borderRadius: 1,
                          border: '1.5px solid',
                          borderColor: active ? g.color : 'divider',
                          bgcolor: active ? g.color + '0F' : 'background.paper',
                          cursor: 'pointer',
                          transition: 'all .15s ease',
                          '&:hover': { borderColor: g.color + '88' },
                        }}
                      >
                        <Box
                          sx={{
                            width: 36, height: 36, borderRadius: 1,
                            bgcolor: active ? g.color + '22' : 'grey.100',
                            display: 'grid', placeItems: 'center',
                            color: g.color, flexShrink: 0,
                          }}
                        >
                          <Iconify icon={g.icon} width={18} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'text.primary' }}>
                            {g.label}
                          </Typography>
                          <Typography sx={{ fontSize: 11.5, color: 'text.disabled' }}>
                            {g.desc}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 16, height: 16, borderRadius: '50%',
                            border: `2px solid ${active ? g.color : '#ccc'}`,
                            bgcolor: active ? g.color : 'transparent',
                            flexShrink: 0,
                            display: 'grid', placeItems: 'center',
                          }}
                        >
                          {active && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#fff' }} />}
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </SectionCard>
            </Stack>
          </Grid>

          {/* ============ RIGHT ============ */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard
                icon={SettingsOutlined}
                title="Trạng thái & sort"
              >
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>TRẠNG THÁI</FieldLabel>
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
                  <Box>
                    <FieldLabel>SORT ORDER</FieldLabel>
                    <TextField
                      type="number"
                      value={form.sort}
                      onChange={(e) => set('sort', Number(e.target.value) || 0)}
                      fullWidth size="small"
                      inputProps={{ min: 0 }}
                      helperText="Nhỏ hiện trước trong cùng nhóm."
                    />
                  </Box>
                  <Box>
                    <FieldLabel>CẤP SÂU TỐI ĐA</FieldLabel>
                    <TextField
                      type="number"
                      value={form.max_depth}
                      onChange={(e) => set('max_depth', Number(e.target.value) || 1)}
                      fullWidth size="small"
                      inputProps={{ min: 1, max: 5 }}
                      helperText="1 = phẳng · 3 = tree như mega-menu PNJ."
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={FlagOutlined}
                title="Cấu hình"
              >
                <Stack spacing={0} divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ py: 1.25 }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Cache Redis</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Khuyến nghị bật để tăng tốc tải trang.
                      </Typography>
                    </Box>
                    <Switch checked={!!form.show_in_cache} onChange={(_, v) => set('show_in_cache', v)} />
                  </Stack>
                </Stack>
                <Box sx={{ mt: 1.5 }}>
                  <FieldLabel>TẬP KHÁN GIẢ</FieldLabel>
                  <TextField
                    select fullWidth size="small"
                    value={form.audience}
                    onChange={(e) => set('audience', e.target.value)}
                  >
                    <MenuItem value="any">Bất kỳ</MenuItem>
                    <MenuItem value="female">Nữ</MenuItem>
                    <MenuItem value="male">Nam</MenuItem>
                    <MenuItem value="kids">Trẻ em</MenuItem>
                  </TextField>
                </Box>
              </SectionCard>

              {/* Preview */}
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.4, color: 'text.disabled' }}>
                  PREVIEW
                </Typography>
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.25 }}>
                  <Box
                    sx={{
                      width: 38, height: 38, borderRadius: 1,
                      display: 'grid', placeItems: 'center',
                      bgcolor: (selectedGroup?.color ?? '#999') + '18',
                      color: selectedGroup?.color,
                    }}
                  >
                    <Iconify icon={selectedGroup?.icon ?? 'solar:menu-linear'} width={18} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }} noWrap>
                      {form.label || 'Tên vị trí'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'monospace' }} noWrap>
                      {form.code || '—'}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                      <Chip label={selectedGroup?.label?.toUpperCase?.()} size="small" sx={{ height: 16, fontSize: 9.5, fontWeight: 700, bgcolor: (selectedGroup?.color ?? '#999') + '22', color: selectedGroup?.color }} />
                      {form.show_in_cache && <Chip label="CACHE" size="small" color="info" sx={{ height: 16, fontSize: 9.5 }} />}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </FormDrawer>
  );
}
