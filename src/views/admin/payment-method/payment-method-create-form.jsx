// src/views/admin/payment-method/payment-method-create-form.jsx — FormDrawer tạo/sửa phương thức thanh toán
// Config field thay đổi theo gateway (VNPay/Momo/ZaloPay/OnePay/Payoo/Manual).
// Style khớp brand-form: full-width · SectionCard · 2-col · dirty · preview chip.

'use client';

import { useState, useEffect, useMemo } from 'react';

import KeyOutlined from '@mui/icons-material/KeyOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import PaidOutlined from '@mui/icons-material/PaidOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Alert, Box, Button, Chip, Grid, MenuItem, Stack, TextField, Typography,
} from '@mui/material';

import { UploadField } from 'src/views/admin/_shared/upload-field';
import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { MoneyInput } from 'src/components/common/money-input';
import { FormDrawer } from 'src/components/common/form-drawer';

const GATEWAYS = [
  { value: 'manual',  label: 'Manual (CK/COD)', icon: 'solar:hand-stars-linear',   color: '#64748B' },
  { value: 'vnpay',   label: 'VNPay',           icon: 'solar:card-linear',          color: '#1D4ED8' },
  { value: 'momo',    label: 'MoMo',            icon: 'solar:wallet-linear',        color: '#D1366B' },
  { value: 'zalopay', label: 'ZaloPay',         icon: 'solar:chat-line-linear',     color: '#008FE5' },
  { value: 'onepay',  label: 'OnePay',          icon: 'solar:card-2-linear',        color: '#DC2626' },
  { value: 'payoo',   label: 'Payoo',           icon: 'solar:card-linear',          color: '#F97316' },
];

const GATEWAY_FIELDS = {
  vnpay:   ['tmn_code', 'hash_secret', 'return_url'],
  momo:    ['partner_code', 'access_key', 'secret_key'],
  zalopay: ['app_id', 'key1', 'key2', 'callback_url'],
  onepay:  ['merchant_id', 'access_code', 'secret_key'],
  payoo:   ['business_id', 'api_username', 'api_password'],
  manual:  [],
};

const FIELD_LABELS = {
  tmn_code: 'TMN Code',
  hash_secret: 'Hash Secret',
  return_url: 'Return URL',
  partner_code: 'Partner Code',
  access_key: 'Access Key',
  secret_key: 'Secret Key',
  app_id: 'App ID',
  key1: 'Key 1',
  key2: 'Key 2',
  callback_url: 'Callback URL',
  merchant_id: 'Merchant ID',
  access_code: 'Access Code',
  business_id: 'Business ID',
  api_username: 'API Username',
  api_password: 'API Password',
};

const STATUSES = [
  { value: 'active',   label: 'Đang bật', icon: 'solar:check-circle-linear' },
  { value: 'draft',    label: 'Nháp',     icon: 'solar:document-text-linear' },
  { value: 'inactive', label: 'Đã tắt',   icon: 'solar:pause-circle-linear' },
];

const EMPTY = {
  code: '',
  name: '',
  gateway: 'manual',
  logo_file_id: '',
  config: {},
  max_amount: 0,
  min_amount: 0,
  sort: 10,
  status: 'active',
};

export function PaymentMethodFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial, config: initial.config ?? {} } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const setConfig = (k, v) => { setForm((f) => ({ ...f, config: { ...f.config, [k]: v } })); setDirty(true); };

  const requiredFields = useMemo(() => GATEWAY_FIELDS[form.gateway] ?? [], [form.gateway]);
  const canSubmit = form.code.trim() && form.name.trim();
  const gatewayMeta = GATEWAYS.find((g) => g.value === form.gateway);

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa PTTT · ${initial?.name ?? ''}` : 'Thêm phương thức thanh toán'}
      subtitle={isEdit ? `Gateway: ${gatewayMeta?.label}` : 'Config thay đổi theo gateway đã chọn · logo + ngưỡng đơn.'}
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo PTTT'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={InfoOutlined} title="Thông tin PTTT">
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FieldLabel required>CODE</FieldLabel>
                      <TextField
                        value={form.code}
                        onChange={(e) => set('code', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                        fullWidth size="small" autoFocus
                        placeholder="momo"
                        inputProps={{ style: { fontFamily: 'monospace' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <FieldLabel required>TÊN HIỂN THỊ</FieldLabel>
                      <TextField
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        fullWidth size="small"
                        placeholder="MoMo"
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <FieldLabel required>GATEWAY</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.gateway}
                      onChange={(e) => { setForm((f) => ({ ...f, gateway: e.target.value, config: {} })); setDirty(true); }}
                    >
                      {GATEWAYS.map((g) => (
                        <MenuItem key={g.value} value={g.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify icon={g.icon} width={16} sx={{ color: g.color }} />
                            <span>{g.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard icon={ImageOutlined} title="Logo" description="PNG nền trong suốt · ~120×72 · ≤ 2MB">
                <UploadField
                  label=""
                  value={form.logo_file_id}
                  onChange={(v) => set('logo_file_id', v)}
                />
              </SectionCard>

              {requiredFields.length > 0 && (
                <SectionCard
                  icon={KeyOutlined}
                  title={`Cấu hình gateway · ${gatewayMeta?.label}`}
                  description="Secret được mã hoá KMS khi lưu server · UI mock hiện plaintext."
                >
                  <Stack spacing={2}>
                    {requiredFields.map((fk) => (
                      <Box key={fk}>
                        <FieldLabel>{(FIELD_LABELS[fk] ?? fk).toUpperCase()}</FieldLabel>
                        <TextField
                          fullWidth size="small"
                          value={form.config[fk] ?? ''}
                          onChange={(e) => setConfig(fk, e.target.value)}
                          type={fk.includes('secret') || fk.includes('password') || fk.includes('key') ? 'password' : 'text'}
                          inputProps={{ style: { fontFamily: 'monospace' } }}
                        />
                      </Box>
                    ))}
                    <Alert severity="info" sx={{ fontSize: 12 }}>
                      Mock form · lưu plaintext. Server production phải mã hoá bằng KMS.
                    </Alert>
                  </Stack>
                </SectionCard>
              )}

              <SectionCard icon={PaidOutlined} title="Ngưỡng đơn">
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel>ĐƠN TỐI THIỂU</FieldLabel>
                    <MoneyInput
                      size="small"
                      fullWidth
                      value={form.min_amount}
                      onChange={(e) => set('min_amount', e.target.value?.value ?? 0)}
                      placeholder="0 = không giới hạn"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel>ĐƠN TỐI ĐA</FieldLabel>
                    <MoneyInput
                      size="small"
                      fullWidth
                      value={form.max_amount}
                      onChange={(e) => set('max_amount', e.target.value?.value ?? 0)}
                      placeholder="0 = không giới hạn"
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard icon={ToggleOnOutlined} title="Trạng thái & sort">
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
                    />
                  </Box>
                </Stack>
              </SectionCard>

              {/* Preview */}
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, border: 1, borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.4, color: 'text.disabled' }}>
                  PREVIEW
                </Typography>
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1.25 }}>
                  <Box sx={{ width: 42, height: 42, borderRadius: 1, display: 'grid', placeItems: 'center', bgcolor: (gatewayMeta?.color ?? '#999') + '22', color: gatewayMeta?.color }}>
                    <Iconify icon={gatewayMeta?.icon ?? 'solar:card-linear'} width={22} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }} noWrap>
                      {form.name || 'Tên PTTT'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'monospace' }} noWrap>
                      {form.code || '—'}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                      <Chip label={gatewayMeta?.label?.toUpperCase?.()} size="small" sx={{ height: 16, fontSize: 9.5, fontWeight: 700, bgcolor: (gatewayMeta?.color ?? '#999') + '22', color: gatewayMeta?.color }} />
                      {requiredFields.length > 0 && (
                        <Chip
                          label={requiredFields.every((k) => form.config[k]) ? 'CONFIG OK' : 'THIẾU KEY'}
                          size="small"
                          color={requiredFields.every((k) => form.config[k]) ? 'success' : 'warning'}
                          sx={{ height: 16, fontSize: 9.5 }}
                        />
                      )}
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
