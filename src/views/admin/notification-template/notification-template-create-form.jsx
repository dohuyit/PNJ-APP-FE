// src/views/admin/notification-template/notification-template-create-form.jsx — FormDrawer mẫu thông báo
// Style khớp brand-form: full-width · SectionCard · 2-col · dirty · preview chip.

'use client';

import { useState, useEffect, useMemo } from 'react';

import HubOutlined from '@mui/icons-material/HubOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CodeOutlined from '@mui/icons-material/CodeOutlined';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Alert, Box, Button, Chip, FormControlLabel, Grid, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';

const CHANNELS = [
  { value: 'sms',      label: 'SMS',       icon: 'solar:chat-round-dots-linear', max_body: 160,   color: '#059669' },
  { value: 'zalo_zns', label: 'Zalo ZNS',  icon: 'solar:chat-line-linear',       max_body: 500,   color: '#2563EB' },
  { value: 'email',    label: 'Email',     icon: 'solar:letter-linear',          max_body: 10000, color: '#7C3AED' },
  { value: 'push',     label: 'Push',      icon: 'solar:bell-linear',            max_body: 200,   color: '#EA580C' },
];

const COMMON_VARIABLES = [
  '{{customer_name}}', '{{order_id}}', '{{total_amount}}',
  '{{otp_code}}', '{{store_name}}', '{{tracking_url}}',
  '{{brand_name}}', '{{tier_name}}',
];

const STATUSES = [
  { value: 'active',   label: 'Đang bật',  icon: 'solar:check-circle-linear' },
  { value: 'draft',    label: 'Nháp',       icon: 'solar:document-text-linear' },
  { value: 'inactive', label: 'Đã tắt',     icon: 'solar:pause-circle-linear' },
];

const EMPTY = {
  code: '',
  name: '',
  channel: 'sms',
  subject: '',
  body: '',
  sender_id: '',
  status: 'active',
};

export function NotificationTemplateFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  const channel = useMemo(() => CHANNELS.find((c) => c.value === form.channel), [form.channel]);
  const isEmail = form.channel === 'email';
  const overLimit = channel && form.body.length > channel.max_body;
  // eslint-disable-next-line no-control-regex
  const hasUnicode = form.channel === 'sms' && /[^ -]/.test(form.body);

  const insertVariable = (variable) => {
    setForm((f) => ({ ...f, body: `${f.body}${variable}` }));
    setDirty(true);
  };

  const canSubmit = form.code.trim() && form.name.trim() && form.body.trim() && !overLimit;

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa mẫu — ${initial?.name ?? ''}` : 'Tạo mẫu thông báo'}
      subtitle={isEdit ? `${form.code} · ${channel?.label}` : 'OTP · Đơn hàng · E-gift · Nhắc lịch bảo trì — mẫu đa kênh SMS/Zalo/Email/Push.'}
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
          <Button variant="outlined" startIcon={<Iconify icon="solar:test-tube-linear" width={14} />}>Gửi thử</Button>
          <Button
            variant="contained"
            disabled={!canSubmit || submitting || (isEdit && !dirty)}
            startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
            onClick={handleSubmit}
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo mẫu'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={InfoOutlined} title="Thông tin mẫu">
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <FieldLabel required>CODE</FieldLabel>
                      <TextField
                        value={form.code}
                        onChange={(e) => set('code', e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                        fullWidth size="small" autoFocus
                        placeholder="OTP_LOGIN"
                        inputProps={{ style: { fontFamily: 'monospace' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <FieldLabel required>TÊN HIỂN THỊ</FieldLabel>
                      <TextField
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        fullWidth size="small"
                        placeholder="Vd: OTP đăng nhập tài khoản PNJ"
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </SectionCard>

              <SectionCard icon={HubOutlined} title="Kênh gửi" description="Chọn kênh — giới hạn độ dài & hành vi thay đổi theo kênh.">
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1}>
                    {CHANNELS.map((c) => {
                      const active = form.channel === c.value;
                      return (
                        <Box
                          key={c.value}
                          onClick={() => set('channel', c.value)}
                          sx={{
                            flex: 1,
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            gap: 0.5, p: 1.5, borderRadius: 1,
                            border: '1.5px solid',
                            borderColor: active ? c.color : 'divider',
                            bgcolor: active ? c.color + '14' : 'background.paper',
                            cursor: 'pointer',
                            transition: 'all .15s',
                          }}
                        >
                          <Iconify icon={c.icon} width={20} sx={{ color: c.color }} />
                          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{c.label}</Typography>
                          <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>≤ {c.max_body} ký tự</Typography>
                        </Box>
                      );
                    })}
                  </Stack>

                  {isEmail && (
                    <Box>
                      <FieldLabel>TIÊU ĐỀ EMAIL</FieldLabel>
                      <TextField
                        value={form.subject}
                        onChange={(e) => set('subject', e.target.value)}
                        fullWidth size="small"
                        placeholder="Vd: PNJ — Xác thực tài khoản của bạn"
                      />
                    </Box>
                  )}

                  <Box>
                    <FieldLabel>SENDER ID (tuỳ chọn)</FieldLabel>
                    <TextField
                      value={form.sender_id}
                      onChange={(e) => set('sender_id', e.target.value)}
                      fullWidth size="small"
                      placeholder="PNJ · PNJGOLD · noreply@pnj.vn"
                      inputProps={{ style: { fontFamily: 'monospace' } }}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={ArticleOutlined}
                title="Nội dung"
                description={`${form.body.length}/${channel?.max_body ?? 0} ký tự${overLimit ? ' · vượt giới hạn' : ''}`}
              >
                <Stack spacing={2}>
                  <TextField
                    value={form.body}
                    onChange={(e) => set('body', e.target.value)}
                    fullWidth size="small" multiline rows={8}
                    placeholder={
                      form.channel === 'sms'
                        ? 'PNJ: Ma OTP cua ban la {{otp_code}}, hieu luc 5 phut.'
                        : 'Xin chào {{customer_name}}, đơn hàng {{order_id}} của bạn đã được xác nhận…'
                    }
                    error={overLimit}
                    InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
                  />

                  {hasUnicode && (
                    <Alert severity="warning" sx={{ fontSize: 12 }}>
                      SMS có ký tự tiếng Việt có dấu → tính 70 ký tự / tin thay vì 160. Cân nhắc viết không dấu.
                    </Alert>
                  )}

                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.75 }}>
                      CHÈN BIẾN NHANH
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.75 }}>
                      {COMMON_VARIABLES.map((v) => (
                        <Chip
                          key={v}
                          label={v}
                          size="small"
                          clickable
                          variant="outlined"
                          onClick={() => insertVariable(v)}
                          sx={{ fontFamily: 'monospace', fontSize: 11 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </SectionCard>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard icon={ToggleOnOutlined} title="Trạng thái">
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
              </SectionCard>

              {/* Preview SMS-like */}
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, border: 1, borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.4, color: 'text.disabled' }}>
                  PREVIEW {channel?.label.toUpperCase()}
                </Typography>
                <Box
                  sx={{
                    mt: 1.25,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: (channel?.color ?? '#999') + '14',
                    border: 1,
                    borderColor: (channel?.color ?? '#999') + '33',
                    fontFamily: form.channel === 'email' ? undefined : 'monospace',
                    fontSize: 12,
                    maxHeight: 180,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    minHeight: 60,
                  }}
                >
                  {isEmail && form.subject && (
                    <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 1 }}>
                      {form.subject}
                    </Typography>
                  )}
                  {form.body || <span style={{ color: '#999' }}>Chưa có nội dung…</span>}
                </Box>
                <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                  <Chip label={channel?.label?.toUpperCase?.()} size="small" sx={{ height: 16, fontSize: 9.5, fontWeight: 700, bgcolor: (channel?.color ?? '#999') + '22', color: channel?.color }} />
                  {form.body.length > 0 && <Chip label={`${form.body.length}/${channel?.max_body}`} size="small" variant="outlined" sx={{ height: 16, fontSize: 9.5 }} color={overLimit ? 'error' : 'default'} />}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </FormDrawer>
  );
}
