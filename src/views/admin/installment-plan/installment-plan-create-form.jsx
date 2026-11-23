// src/views/admin/installment-plan/installment-plan-create-form.jsx — FormDrawer tạo/sửa gói trả góp
// Style khớp brand-form: full-width · SectionCard · 2-col · dirty · preview chip · MUI DatePicker.

'use client';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import PaidOutlined from '@mui/icons-material/PaidOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EventOutlined from '@mui/icons-material/EventOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Chip, Grid, InputAdornment, MenuItem, Stack, TextField, Typography,
} from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { MoneyInput } from 'src/components/common/money-input';
import { FormDrawer } from 'src/components/common/form-drawer';
import { mockBanks } from 'src/mock-data';

const banksList = mockBanks;
const PROVIDERS = [
  { value: 'payoo',      label: 'Payoo',       icon: 'solar:card-linear' },
  { value: 'onepay',     label: 'OnePay',      icon: 'solar:card-linear' },
  { value: 'homecredit', label: 'Home Credit', icon: 'solar:home-linear' },
  { value: 'fecredit',   label: 'FE Credit',   icon: 'solar:card-linear' },
];

const MONTH_OPTIONS = [3, 6, 9, 12, 18, 24];

const APPLIES_TO = [
  { value: 'jewelry', label: 'Trang sức', icon: 'solar:crown-linear' },
  { value: 'watch',   label: 'Đồng hồ',   icon: 'solar:clock-circle-linear' },
  { value: 'diamond', label: 'Kim cương', icon: 'solar:star-shine-linear' },
  { value: 'gift',    label: 'Quà tặng',  icon: 'solar:gift-linear' },
];

const STATUSES = [
  { value: 'active',   label: 'Đang chạy', icon: 'solar:check-circle-linear' },
  { value: 'draft',    label: 'Nháp',       icon: 'solar:document-text-linear' },
  { value: 'inactive', label: 'Tạm dừng',   icon: 'solar:pause-circle-linear' },
];

const EMPTY = {
  provider: 'payoo',
  bank_code: 'VCB',
  months: [3, 6, 12],
  interest_rate: 0,
  fee_pct: 0,
  min_order_amount: 3_000_000,
  applies_to: ['jewelry'],
  start_at: '',
  end_at: '',
  sort: 10,
  status: 'active',
};

export function InstallmentPlanFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  const toggleMonth = (m) => {
    setForm((f) => ({
      ...f,
      months: f.months.includes(m) ? f.months.filter((x) => x !== m) : [...f.months, m].sort((a, b) => a - b),
    }));
    setDirty(true);
  };

  const toggleApply = (v) => {
    setForm((f) => ({
      ...f,
      applies_to: f.applies_to.includes(v) ? f.applies_to.filter((x) => x !== v) : [...f.applies_to, v],
    }));
    setDirty(true);
  };

  const canSubmit = form.provider && form.bank_code && form.months.length > 0 && form.applies_to.length > 0;
  const providerMeta = PROVIDERS.find((p) => p.value === form.provider);

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa gói · ${initial?.provider ?? ''} · ${initial?.bank_code ?? ''}` : 'Tạo gói trả góp'}
      subtitle={isEdit ? `${form.months.join('/')}m · ${form.interest_rate}% lãi` : 'Trả góp 0% / có lãi theo bank + provider · tuỳ chỉnh kỳ hạn và ngưỡng đơn.'}
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo gói'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={InfoOutlined} title="Provider & ngân hàng">
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel required>NHÀ CUNG CẤP</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.provider}
                      onChange={(e) => set('provider', e.target.value)}
                    >
                      {PROVIDERS.map((p) => (
                        <MenuItem key={p.value} value={p.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify icon={p.icon} width={16} sx={{ color: 'text.secondary' }} />
                            <span>{p.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FieldLabel required>NGÂN HÀNG</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.bank_code}
                      onChange={(e) => set('bank_code', e.target.value)}
                    >
                      {banksList
                        .filter((b) => b.supports_installment || b.code === form.bank_code)
                        .map((b) => (
                          <MenuItem key={b.id} value={b.code}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <code>{b.code}</code>
                              <span>·</span>
                              <span>{b.short_name}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      {banksList.length === 0 && (
                        <MenuItem value={form.bank_code}>{form.bank_code} · Chưa có list bank</MenuItem>
                      )}
                    </TextField>
                  </Grid>
                </Grid>
              </SectionCard>

              <SectionCard icon={PaidOutlined} title="Kỳ hạn · Lãi · Phí">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel required>KỲ HẠN (THÁNG)</FieldLabel>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.75 }}>
                      {MONTH_OPTIONS.map((m) => {
                        const on = form.months.includes(m);
                        return (
                          <Chip
                            key={m}
                            label={`${m} tháng`}
                            size="small"
                            clickable
                            onClick={() => toggleMonth(m)}
                            variant={on ? 'filled' : 'outlined'}
                            color={on ? 'primary' : 'default'}
                            sx={{ height: 28, fontWeight: 600 }}
                          />
                        );
                      })}
                    </Stack>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel>LÃI SUẤT (%/năm)</FieldLabel>
                      <TextField
                        type="number" fullWidth size="small"
                        value={form.interest_rate}
                        onChange={(e) => set('interest_rate', Number(e.target.value) || 0)}
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        helperText="0 = trả góp 0%"
                        inputProps={{ min: 0, step: 0.1 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel>PHÍ GIAO DỊCH (%)</FieldLabel>
                      <TextField
                        type="number" fullWidth size="small"
                        value={form.fee_pct}
                        onChange={(e) => set('fee_pct', Number(e.target.value) || 0)}
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        inputProps={{ min: 0, step: 0.1 }}
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <FieldLabel>ĐƠN TỐI THIỂU</FieldLabel>
                    <MoneyInput
                      size="small"
                      fullWidth
                      value={form.min_order_amount}
                      onChange={(e) => set('min_order_amount', e.target.value?.value ?? 0)}
                      placeholder="3.000.000"
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard icon={CategoryOutlined} title="Phạm vi áp dụng">
                <FieldLabel>LOẠI SẢN PHẨM ÁP DỤNG (multi)</FieldLabel>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.75 }}>
                  {APPLIES_TO.map((a) => {
                    const on = form.applies_to.includes(a.value);
                    return (
                      <Chip
                        key={a.value}
                        icon={<Iconify icon={a.icon} width={14} sx={{ ml: 0.5 }} />}
                        label={a.label}
                        size="small"
                        clickable
                        onClick={() => toggleApply(a.value)}
                        variant={on ? 'filled' : 'outlined'}
                        color={on ? 'primary' : 'default'}
                        sx={{ height: 28, fontWeight: 600 }}
                      />
                    );
                  })}
                </Stack>
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

              <SectionCard icon={EventOutlined} title="Lịch chạy">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>BẮT ĐẦU</FieldLabel>
                    <DatePicker
                      value={form.start_at ? dayjs(form.start_at) : null}
                      onChange={(v) => set('start_at', v ? dayjs(v).toISOString() : '')}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: { fullWidth: true, size: 'small', placeholder: 'dd/mm/yyyy' },
                        actionBar: { actions: ['clear', 'today', 'accept'] },
                      }}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>KẾT THÚC</FieldLabel>
                    <DatePicker
                      value={form.end_at ? dayjs(form.end_at) : null}
                      onChange={(v) => set('end_at', v ? dayjs(v).toISOString() : '')}
                      format="DD/MM/YYYY"
                      minDate={form.start_at ? dayjs(form.start_at) : undefined}
                      slotProps={{
                        textField: { fullWidth: true, size: 'small', placeholder: 'dd/mm/yyyy' },
                        actionBar: { actions: ['clear', 'today', 'accept'] },
                      }}
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
                  <Box sx={{ width: 42, height: 42, borderRadius: 1, display: 'grid', placeItems: 'center', bgcolor: 'primary.lighter', color: 'primary.main' }}>
                    <Iconify icon={providerMeta?.icon ?? 'solar:card-linear'} width={22} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }} noWrap>
                      {providerMeta?.label} · {form.bank_code}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
                      {form.months.join(' / ')} tháng · {form.interest_rate}% lãi
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
                      {form.interest_rate === 0 && <Chip label="0%" size="small" color="success" sx={{ height: 16, fontSize: 9.5, fontWeight: 700 }} />}
                      <Chip label={`≥${fCurrency(form.min_order_amount)}`} size="small" variant="outlined" sx={{ height: 16, fontSize: 9.5 }} />
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
