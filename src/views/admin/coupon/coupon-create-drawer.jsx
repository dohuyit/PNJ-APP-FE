// src/views/admin/coupon/coupon-create-drawer.jsx — Full-width drawer tạo/sửa mã giảm giá

'use client';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EventOutlined from '@mui/icons-material/EventOutlined';
import SpeedOutlined from '@mui/icons-material/SpeedOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import TagOutlined from '@mui/icons-material/LocalOfferOutlined';
import PercentOutlined from '@mui/icons-material/PercentOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Chip, FormControlLabel, Grid, InputAdornment, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { useGetCategoryList } from 'src/actions/admin/category';
import { useGetPromotionList } from 'src/actions/admin/promotion';
import { SectionCard, FieldLabel } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';
import { MoneyInput } from 'src/components/common/money-input';


const DISCOUNT_TYPES = [
  { value: 'percent',  label: '% Giảm giá',    icon: 'solar:percent-circle-linear' },
  { value: 'fixed',    label: 'Giảm tiền mặt', icon: 'solar:dollar-linear' },
  { value: 'freeship', label: 'Miễn phí ship', icon: 'solar:delivery-linear' },
];

const APPLIES_TO = [
  { value: 'all',       label: 'Toàn shop',   icon: 'solar:global-linear' },
  { value: 'category',  label: 'Danh mục',    icon: 'solar:folder-linear' },
  { value: 'product',   label: 'Sản phẩm',    icon: 'solar:box-linear' },
];

const TYPES = [
  { value: 'public',   label: 'Công khai', icon: 'solar:users-group-rounded-linear' },
  { value: 'personal', label: 'Cá nhân',   icon: 'solar:user-linear' },
];

const STATUSES = [
  { value: 'active',   label: 'Đang chạy', icon: 'solar:check-circle-linear' },
  { value: 'scheduled',label: 'Hẹn lịch',  icon: 'solar:calendar-linear' },
  { value: 'paused',   label: 'Tạm dừng',  icon: 'solar:pause-circle-linear' },
  { value: 'expired',  label: 'Hết hạn',   icon: 'solar:close-circle-linear' },
];

const EMPTY = {
  code: '',
  promotion_id: '',
  title: '',
  description: '',
  discount_type: 'percent',
  discount_value: 10,
  min_order: 0,
  max_discount: 0,
  applies_to: 'all',
  category_ids: [],
  product_ids: [],
  type: 'public',
  is_listed: true,
  usage_limit_total: 100,
  usage_limit_per_user: 1,
  used_count: 0,
  start_at: '',
  end_at: '',
  status: 'active',
};

const randomCode = () =>
  'PNJ-' + Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');

export function CouponFormDrawer({ open, onClose, onSubmit, initial }) {
  const categoriesList = useGetCategoryList().searchResults;
  const promotionsList = useGetPromotionList().searchResults;
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const canSubmit = form.code.trim() && form.discount_value > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  const valueSuffix = form.discount_type === 'percent' ? '%' : form.discount_type === 'fixed' ? '₫' : '';

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa mã · ${initial?.code ?? ''}` : 'Tạo mã giảm giá'}
      subtitle={
        isEdit
          ? `Đã dùng ${initial?.used_count ?? 0}/${initial?.usage_limit_total ?? 0} lần`
          : 'Public / Personal · theo %, theo ₫ hoặc miễn phí ship'
      }
      footer={
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && (
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main',
              animation: 'pulse 1.4s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo mã'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          {/* ==== LEFT ==== */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={TagOutlined} title="Mã & chương trình" description="Mã khách nhập khi thanh toán. Có thể gắn vào 1 chương trình mẹ để gộp báo cáo.">
                <Stack spacing={2.25}>
                  <Stack direction="row" spacing={1} alignItems="flex-end">
                    <Box sx={{ flex: 1 }}>
                      <FieldLabel required tooltip="Khách sẽ nhập chính xác chuỗi này ở ô 'Mã giảm giá'">MÃ CODE</FieldLabel>
                      <TextField
                        value={form.code}
                        onChange={(e) => set('code', e.target.value.toUpperCase().replace(/\s+/g, ''))}
                        fullWidth size="small"
                        placeholder="PNJ-WELCOME"
                        inputProps={{ style: { fontFamily: 'monospace', letterSpacing: 1, fontWeight: 600 } }}
                      />
                    </Box>
                    <Button
                      size="small" variant="outlined"
                      startIcon={<Iconify icon="solar:dice-linear" width={16} />}
                      onClick={() => set('code', randomCode())}
                    >
                      Random
                    </Button>
                  </Stack>

                  <Box>
                    <FieldLabel>CHƯƠNG TRÌNH LIÊN KẾT</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.promotion_id}
                      onChange={(e) => set('promotion_id', e.target.value)}
                    >
                      <MenuItem value="">— Không gắn —</MenuItem>
                      {promotionsList.slice(0, 10).map((p) => (
                        <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Box>
                    <FieldLabel>TIÊU ĐỀ HIỂN THỊ</FieldLabel>
                    <TextField
                      value={form.title}
                      onChange={(e) => set('title', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Giảm 10% cho khách lần đầu"
                    />
                  </Box>

                  <Box>
                    <FieldLabel>MÔ TẢ (hiển thị trong &lsquo;Chọn ưu đãi&rsquo;)</FieldLabel>
                    <TextField
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      fullWidth size="small" multiline rows={2}
                      placeholder="Áp dụng cho đơn từ 1 triệu · không áp dụng chung với mã khác."
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard icon={PercentOutlined} title="Quy tắc giảm giá" description="Chọn loại: theo %, theo ₫ mặt, hoặc miễn phí ship.">
                <Stack spacing={2.25}>
                  <Box>
                    <FieldLabel required>LOẠI GIẢM</FieldLabel>
                    <TextField
                      select fullWidth size="small"
                      value={form.discount_type}
                      onChange={(e) => set('discount_type', e.target.value)}
                    >
                      {DISCOUNT_TYPES.map((d) => (
                        <MenuItem key={d.value} value={d.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify icon={d.icon} width={16} sx={{ color: 'text.secondary' }} />
                            <span>{d.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  {form.discount_type !== 'freeship' && (
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FieldLabel required>GIÁ TRỊ GIẢM</FieldLabel>
                        <TextField
                          type="number" fullWidth size="small"
                          value={form.discount_value}
                          onChange={(e) => set('discount_value', Number(e.target.value) || 0)}
                          InputProps={{ endAdornment: <InputAdornment position="end">{valueSuffix}</InputAdornment> }}
                          inputProps={{ min: 0, max: form.discount_type === 'percent' ? 100 : undefined }}
                        />
                      </Grid>
                      {form.discount_type === 'percent' && (
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FieldLabel tooltip="Áp % nhưng không giảm quá số này · để 0 nghĩa là không giới hạn.">GIẢM TỐI ĐA</FieldLabel>
                          <MoneyInput
                            value={form.max_discount}
                            onChange={(e) => set('max_discount', e.target.value.value ?? 0)}
                            fullWidth size="small"
                            placeholder="0 = không giới hạn"
                          />
                        </Grid>
                      )}
                    </Grid>
                  )}

                  <Box>
                    <FieldLabel>ĐƠN TỐI THIỂU</FieldLabel>
                    <MoneyInput
                      value={form.min_order}
                      onChange={(e) => set('min_order', e.target.value.value ?? 0)}
                      fullWidth size="small"
                      placeholder="0"
                      helperText={form.min_order ? `Áp dụng cho đơn từ ${fCurrency(form.min_order, 'VND')}` : 'Để 0 nghĩa là không giới hạn'}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard icon={CategoryOutlined} title="Phạm vi áp dụng" description="Giới hạn danh mục / sản phẩm cụ thể. Mặc định toàn shop.">
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                    {APPLIES_TO.map((a) => {
                      const active = form.applies_to === a.value;
                      return (
                        <Chip
                          key={a.value}
                          icon={<Iconify icon={a.icon} width={14} sx={{ ml: 0.5 }} />}
                          label={a.label}
                          color={active ? 'primary' : 'default'}
                          variant={active ? 'filled' : 'outlined'}
                          onClick={() => set('applies_to', a.value)}
                        />
                      );
                    })}
                  </Stack>

                  {form.applies_to === 'category' && (
                    <Box>
                      <FieldLabel>DANH MỤC ÁP DỤNG</FieldLabel>
                      <TextField
                        select SelectProps={{ multiple: true }}
                        fullWidth size="small"
                        value={form.category_ids}
                        onChange={(e) => set('category_ids', e.target.value)}
                      >
                        {categoriesList.map((c) => (
                          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  )}

                  {form.applies_to === 'product' && (
                    <Box>
                      <FieldLabel>ID SẢN PHẨM (cách bởi dấu phẩy)</FieldLabel>
                      <TextField
                        value={(form.product_ids ?? []).join(', ')}
                        onChange={(e) => set('product_ids', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                        fullWidth size="small"
                        placeholder="p1, p5, p9"
                        inputProps={{ style: { fontFamily: 'monospace' } }}
                      />
                    </Box>
                  )}
                </Stack>
              </SectionCard>
            </Stack>
          </Grid>

          {/* ==== RIGHT ==== */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard icon={ToggleOnOutlined} title="Loại & trạng thái">
                <Stack spacing={2.25}>
                  <Box>
                    <FieldLabel required>LOẠI MÃ</FieldLabel>
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

                  <FormControlLabel
                    control={<Switch checked={form.is_listed} onChange={(_, v) => set('is_listed', v)} />}
                    label="Hiện trong 'Chọn ưu đãi'"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                  />
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

              <SectionCard icon={SpeedOutlined} title="Giới hạn số lần">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>TỔNG SỐ LẦN DÙNG</FieldLabel>
                    <TextField
                      type="number" fullWidth size="small"
                      value={form.usage_limit_total}
                      onChange={(e) => set('usage_limit_total', Number(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                      helperText="0 = không giới hạn"
                    />
                  </Box>
                  <Box>
                    <FieldLabel>GIỚI HẠN / KHÁCH</FieldLabel>
                    <TextField
                      type="number" fullWidth size="small"
                      value={form.usage_limit_per_user}
                      onChange={(e) => set('usage_limit_per_user', Number(e.target.value) || 0)}
                      inputProps={{ min: 0 }}
                    />
                  </Box>
                  {isEdit && (
                    <Box sx={{ bgcolor: 'grey.100', borderRadius: 1.5, p: 1.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Đã dùng</Typography>
                      <Typography variant="h6">
                        {form.used_count}/{form.usage_limit_total}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </SectionCard>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </FormDrawer>
  );
}
