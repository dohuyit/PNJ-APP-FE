// src/views/admin/post-author/post-author-create-form.jsx
// FormDrawer thêm/sửa tác giả blog · profile + vai trò + bio + expertise + liên hệ

'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Autocomplete, Avatar, Box, Button, Chip, FormControlLabel,
  MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { UploadField } from 'src/views/admin/_shared/upload-field';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';

const ROLE_OPTS = [
  { value: 'Chief Editor',  label: 'Trưởng ban biên tập', color: '#DC2626', icon: 'solar:crown-bold-duotone' },
  { value: 'Senior Writer', label: 'Senior Writer',       color: '#2563EB', icon: 'solar:pen-new-square-bold-duotone' },
  { value: 'Writer',        label: 'Writer',              color: '#059669', icon: 'solar:pen-bold-duotone' },
  { value: 'Contributor',   label: 'Cộng tác viên',       color: '#D97706', icon: 'solar:user-hand-up-bold-duotone' },
];

const EXPERTISE_SUGGESTIONS = [
  'SEO', 'Trang sức', 'Phong thuỷ', 'Cưới hỏi', 'Mix & Match',
  'Cung mệnh', 'Giá vàng', 'Tin tức', 'Xu hướng', 'Kim cương', 'Vàng 24k',
];

const EMPTY = {
  name: '',
  email: '',
  role: 'Writer',
  avatar: null,
  bio: '',
  expertise: [],
  joined_at: new Date().toISOString().slice(0, 10),
  is_active: true,
  phone: '',
  facebook: '',
};

const initialsOf = (s = '') =>
  s.trim().split(/\s+/).slice(-2).map((w) => w[0] ?? '').join('').toUpperCase() || '??';

const AVATAR_GRADIENTS = [
  ['#818CF8', '#4F46E5'], ['#F87171', '#DC2626'], ['#34D399', '#059669'],
  ['#FBBF24', '#D97706'], ['#A78BFA', '#7C3AED'], ['#38BDF8', '#0284C7'],
];
const hashStr = (s = '') => Array.from(s).reduce((a, c) => a + c.charCodeAt(0), 0);
const gradientOf = (n) => AVATAR_GRADIENTS[hashStr(n || '?') % AVATAR_GRADIENTS.length];

export function PostAuthorFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
      setTouched({});
    }
  }, [open, initial]);

  const set = (k) => (v) =>
    setForm((f) => ({ ...f, [k]: typeof v === 'object' && v?.target ? v.target.value : v }));
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nhập tên tác giả';
    if (!form.email.trim()) e.email = 'Nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ';
    if (form.bio.length > 240) e.bio = `Giới hạn 240 ký tự (hiện ${form.bio.length})`;
    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0 && !submitting;
  const role = ROLE_OPTS.find((r) => r.value === form.role) ?? ROLE_OPTS[2];
  const [g0, g1] = gradientOf(form.name);

  const handleSubmit = async () => {
    if (!canSubmit) {
      setTouched({ name: true, email: true, bio: true });
      return;
    }
    setSubmitting(true);
    try { await onSubmit?.(form); onClose?.(); }
    finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      title={isEdit ? 'Sửa tác giả' : 'Thêm tác giả'}
      subtitle={isEdit ? initial?.name : 'Thành viên đội viết bài · phân quyền · kênh liên hệ'}
      width={600}
      footer={
        <>
          <Button onClick={onClose} color="inherit">Huỷ</Button>
          <Button
            variant="contained"
            disabled={!canSubmit}
            startIcon={<Iconify icon="solar:check-circle-linear" width={16} />}
            onClick={handleSubmit}
          >
            {isEdit ? 'Lưu thay đổi' : 'Thêm tác giả'}
          </Button>
        </>
      }
    >
      <Stack spacing={2.5}>
        {/* --- Section 1 · Profile preview + Avatar upload --- */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '92px 1fr',
            gap: 2,
            alignItems: 'start',
          }}
        >
          {/* Avatar preview · generated from name if no upload */}
          <Box>
            {form.avatar ? (
              <Avatar
                src={typeof form.avatar === 'string' ? form.avatar : URL.createObjectURL(form.avatar)}
                sx={{ width: 76, height: 76 }}
              />
            ) : (
              <Box sx={{
                width: 76, height: 76, borderRadius: '50%',
                background: `linear-gradient(135deg, ${g0}, ${g1})`,
                color: 'common.white',
                display: 'grid', placeItems: 'center',
                fontWeight: 800, fontSize: 24,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}>
                {initialsOf(form.name)}
              </Box>
            )}
          </Box>

          <Stack spacing={1}>
            <UploadField
              label="Ảnh đại diện"
              value={form.avatar}
              onChange={(v) => setForm((f) => ({ ...f, avatar: v }))}
              helperText="JPG/PNG vuông · ≤ 2MB · để trống dùng chữ cái đầu"
              sx={{ '& .MuiBox-root[class*="upload"]:first-of-type': { minHeight: 80 } }}
            />
          </Stack>
        </Box>

        {/* --- Section 2 · Danh tính --- */}
        <SectionTitle icon="solar:user-id-bold-duotone">Danh tính</SectionTitle>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Họ và tên" required autoFocus size="small" fullWidth
            value={form.name}
            onChange={set('name')}
            onBlur={blur('name')}
            error={!!(touched.name && errors.name)}
            helperText={touched.name && errors.name}
            placeholder="Nguyễn Minh"
          />
          <TextField
            label="Email" required size="small" fullWidth type="email"
            value={form.email}
            onChange={set('email')}
            onBlur={blur('email')}
            error={!!(touched.email && errors.email)}
            helperText={(touched.email && errors.email) || 'Email nội bộ pnj.com'}
            placeholder="ten.ho@pnj.com"
          />
        </Stack>

        {/* --- Section 3 · Vai trò --- */}
        <SectionTitle icon="solar:shield-user-bold-duotone">Vai trò & trạng thái</SectionTitle>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
          <TextField
            label="Vai trò" select size="small" fullWidth
            value={form.role}
            onChange={set('role')}
            SelectProps={{
              renderValue: (v) => {
                const r = ROLE_OPTS.find((o) => o.value === v);
                if (!r) return v;
                return (
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Box sx={{
                      width: 6, height: 6, borderRadius: '50%',
                      bgcolor: r.color, flexShrink: 0,
                    }} />
                    {r.label}
                  </Stack>
                );
              },
            }}
          >
            {ROLE_OPTS.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 0.25 }}>
                  <Box sx={{
                    width: 28, height: 28, borderRadius: 1,
                    bgcolor: r.color + '14', color: r.color,
                    display: 'grid', placeItems: 'center',
                    flexShrink: 0,
                  }}>
                    <Iconify icon={r.icon} width={16} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.2 }}>
                      {r.label}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
                      {r.value}
                    </Typography>
                  </Box>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Ngày vào ban" type="date" size="small" fullWidth
            value={form.joined_at}
            onChange={set('joined_at')}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        <FormControlLabel
          sx={{ mt: '-4px' }}
          control={
            <Switch
              checked={form.is_active}
              onChange={(_, v) => setForm((f) => ({ ...f, is_active: v }))}
              color="success"
            />
          }
          label={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{
                width: 8, height: 8, borderRadius: '50%',
                bgcolor: form.is_active ? 'success.main' : 'grey.400',
              }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {form.is_active ? 'Đang hoạt động' : 'Đã nghỉ'}
              </Typography>
            </Stack>
          }
        />

        {/* --- Section 4 · Giới thiệu --- */}
        <SectionTitle icon="solar:document-text-bold-duotone">Giới thiệu & chuyên môn</SectionTitle>

        <TextField
          label="Giới thiệu ngắn" size="small" fullWidth multiline rows={3}
          value={form.bio}
          onChange={set('bio')}
          onBlur={blur('bio')}
          error={!!(touched.bio && errors.bio)}
          helperText={(touched.bio && errors.bio) || `${form.bio.length} / 240 · hiển thị dưới tên trong card tác giả`}
          placeholder="Trưởng ban biên tập, 10 năm kinh nghiệm viết nội dung ngành trang sức…"
          inputProps={{ maxLength: 260 }}
        />

        <Autocomplete
          multiple freeSolo openOnFocus filterSelectedOptions
          options={EXPERTISE_SUGGESTIONS}
          value={form.expertise}
          onChange={(_e, next) => {
            const cleaned = Array.from(new Set(next.map((t) => String(t).trim()).filter(Boolean))).slice(0, 8);
            setForm((f) => ({ ...f, expertise: cleaned }));
          }}
          size="small"
          renderTags={(items, getTagProps) =>
            items.map((t, i) => {
              const { key, ...rest } = getTagProps({ index: i });
              return (
                <Chip
                  key={key}
                  {...rest}
                  label={t}
                  size="small"
                  sx={{
                    height: 24, borderRadius: 0.75,
                    bgcolor: 'primary.lighter', color: 'primary.dark',
                    fontWeight: 600, fontSize: 11.5,
                  }}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Lĩnh vực chuyên môn"
              placeholder={form.expertise.length >= 8 ? 'Tối đa 8 lĩnh vực' : 'Chọn hoặc gõ rồi Enter…'}
              helperText={`${form.expertise.length} / 8 · hiển thị dưới dạng tag trong card`}
            />
          )}
        />

        {/* --- Section 5 · Liên hệ --- */}
        <SectionTitle icon="solar:phone-bold-duotone">Liên hệ (tuỳ chọn)</SectionTitle>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Số điện thoại" size="small" fullWidth
            value={form.phone}
            onChange={set('phone')}
            placeholder="090x xxx xxx"
            InputProps={{
              startAdornment: (
                <Iconify icon="solar:phone-linear" width={16} sx={{ mr: 0.75, color: 'text.disabled' }} />
              ),
            }}
          />
          <TextField
            label="Facebook / LinkedIn" size="small" fullWidth
            value={form.facebook}
            onChange={set('facebook')}
            placeholder="https://facebook.com/..."
            InputProps={{
              startAdornment: (
                <Iconify icon="solar:link-linear" width={16} sx={{ mr: 0.75, color: 'text.disabled' }} />
              ),
            }}
          />
        </Stack>

        {/* Preview card nhỏ gọn cuối form */}
        <Box
          sx={{
            mt: 1, p: 1.5,
            border: 1, borderColor: 'divider', borderRadius: 1,
            bgcolor: 'grey.50',
          }}
        >
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>
            Xem trước card
          </Typography>
          <Stack direction="row" spacing={1.25} sx={{ mt: 1 }} alignItems="center">
            {form.avatar ? (
              <Avatar
                src={typeof form.avatar === 'string' ? form.avatar : URL.createObjectURL(form.avatar)}
                sx={{ width: 40, height: 40 }}
              />
            ) : (
              <Box sx={{
                width: 40, height: 40, borderRadius: '50%',
                background: `linear-gradient(135deg, ${g0}, ${g1})`,
                color: 'common.white', display: 'grid', placeItems: 'center',
                fontWeight: 800, fontSize: 13,
                flexShrink: 0,
              }}>
                {initialsOf(form.name)}
              </Box>
            )}
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }} noWrap>
                  {form.name || 'Tên tác giả'}
                </Typography>
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%',
                  bgcolor: form.is_active ? 'success.main' : 'grey.400',
                }} />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
                <Box sx={{
                  display: 'inline-flex',
                  px: 0.625, py: 0.125, borderRadius: 0.5,
                  bgcolor: role.color + '14', color: role.color,
                  fontSize: 9.5, fontWeight: 700, letterSpacing: 0.3,
                }}>
                  {role.label}
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }} noWrap>
                  · {form.email || 'email@pnj.com'}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </FormDrawer>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ pt: 0.5 }}>
      <Iconify icon={icon} width={16} sx={{ color: 'primary.main' }} />
      <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', color: 'text.secondary' }}>
        {children}
      </Typography>
      <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
    </Stack>
  );
}
