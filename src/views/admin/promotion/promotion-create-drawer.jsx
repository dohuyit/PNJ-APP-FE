// src/views/admin/promotion/promotion-create-drawer.jsx — Full-width drawer tạo/sửa chương trình KM

'use client';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import RuleOutlined from '@mui/icons-material/RuleOutlined';
import EventOutlined from '@mui/icons-material/EventOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import ToggleOnOutlined from '@mui/icons-material/ToggleOnOutlined';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Chip, FormControlLabel, Grid, MenuItem, Stack, Switch, TextField, Typography,
} from '@mui/material';

import { useGetCategoryList } from 'src/actions/admin/category';
import { UploadField } from 'src/views/admin/_shared/upload-field';
import { SectionCard, FieldLabel } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';
import { MoneyInput } from 'src/components/common/money-input';


const TYPES = [
  { value: 'product_discount',     label: 'Giảm giá SP',           icon: 'solar:tag-price-linear' },
  { value: 'gift_with_purchase',   label: 'Quà tặng kèm',          icon: 'solar:gift-linear' },
  { value: 'tiered_quantity',      label: 'Mua nhiều giảm nhiều',  icon: 'solar:tuning-linear' },
  { value: 'order_threshold_gift', label: 'Quà theo hoá đơn',      icon: 'solar:box-linear' },
  { value: 'payment_method',       label: 'Giảm theo ví TT',       icon: 'solar:card-linear' },
  { value: 'coupon',               label: 'Yêu cầu nhập mã',       icon: 'solar:ticket-linear' },
];

const STATUSES = [
  { value: 'running',   label: 'Đang chạy',    icon: 'solar:check-circle-linear' },
  { value: 'scheduled', label: 'Hẹn lịch',     icon: 'solar:calendar-linear' },
  { value: 'paused',    label: 'Tạm dừng',     icon: 'solar:pause-circle-linear' },
  { value: 'ended',     label: 'Đã kết thúc',  icon: 'solar:close-circle-linear' },
];

const EMPTY = {
  name: '',
  code: '',
  type: 'product_discount',
  description: '',
  banner_url: '',
  rules_json: '{\n  "discount_percent": 10,\n  "min_order": 0\n}',
  category_ids: [],
  product_ids: [],
  priority: 0,
  stackable: false,
  usage_limit: 1000,
  used_count: 0,
  start_at: '',
  end_at: '',
  status: 'scheduled',
};

export function PromotionFormDrawer({ open, onClose, onSubmit, initial }) {
  const categoriesList = useGetCategoryList().searchResults;
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setDirty(false); setJsonError(''); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const canSubmit = form.name.trim() && form.code.trim() && !jsonError;

  const handleSubmit = async () => {
    try { JSON.parse(form.rules_json); setJsonError(''); } catch (err) { setJsonError(err.message); return; }
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  const typeMeta = TYPES.find((t) => t.value === form.type);

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa chương trình · ${initial?.name ?? ''}` : 'Tạo chương trình khuyến mãi'}
      subtitle={isEdit ? `Đã dùng ${initial?.used_count ?? 0}/${initial?.usage_limit ?? 0}` : `${TYPES.length} loại · giảm giá / quà tặng / mua nhiều / ví thanh toán / coupon`}
      footer={
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {dirty && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />}
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo chương trình'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={CampaignOutlined} title="Thông tin chương trình" description="Tên hiển thị, mã nội bộ, loại khuyến mãi.">
                <Stack spacing={2.25}>
                  <Box>
                    <FieldLabel required>TÊN CHƯƠNG TRÌNH</FieldLabel>
                    <TextField
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      fullWidth size="small" autoFocus
                      placeholder="Vd: Siêu sale 11/11 · Giảm 45% toàn danh mục nhẫn"
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>CODE NỘI BỘ</FieldLabel>
                      <TextField
                        value={form.code}
                        onChange={(e) => set('code', e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                        fullWidth size="small"
                        placeholder="SALE_1111_2026"
                        inputProps={{ style: { fontFamily: 'monospace' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>LOẠI</FieldLabel>
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
                    </Grid>
                  </Grid>

                  <Box>
                    <FieldLabel>MÔ TẢ NGẮN</FieldLabel>
                    <TextField
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      fullWidth size="small" multiline rows={2}
                      placeholder="Mô tả 1-2 câu, hiển thị ở card KM trên landing page."
                    />
                  </Box>

                  <Box>
                    <FieldLabel>BANNER CHƯƠNG TRÌNH</FieldLabel>
                    <UploadField
                      value={form.banner_url}
                      onChange={(v) => set('banner_url', v)}
                      helperText="Tỉ lệ 16:9 · ≤ 2MB · hiển thị ở card landing"
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard
                icon={RuleOutlined}
                title={`Quy tắc tính · ${typeMeta?.label}`}
                description="Rules JSON · payload gửi server. Tuỳ loại KM sẽ có schema khác nhau."
              >
                <TextField
                  value={form.rules_json}
                  onChange={(e) => set('rules_json', e.target.value)}
                  fullWidth size="small" multiline rows={10}
                  placeholder='{"discount_percent": 10, "min_order": 1000000}'
                  error={!!jsonError}
                  helperText={jsonError || 'Chỉnh lại JSON cho đúng schema trước khi lưu.'}
                  InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
                />
              </SectionCard>

              <SectionCard icon={CategoryOutlined} title="Phạm vi áp dụng" description="Giới hạn theo danh mục / sản phẩm.">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>DANH MỤC</FieldLabel>
                    <TextField
                      select SelectProps={{ multiple: true }} fullWidth size="small"
                      value={form.category_ids}
                      onChange={(e) => set('category_ids', e.target.value)}
                      helperText={form.category_ids.length === 0 ? 'Để trống = toàn shop' : `${form.category_ids.length} danh mục được chọn`}
                    >
                      {categoriesList.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                      ))}
                    </TextField>
                  </Box>

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

              <SectionCard icon={EventOutlined} title="Lịch chạy">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>BẮT ĐẦU</FieldLabel>
                    <DateTimePicker
                      value={form.start_at ? dayjs(form.start_at) : null}
                      onChange={(v) => set('start_at', v ? dayjs(v).toISOString() : '')}
                      format="DD/MM/YYYY HH:mm"
                      slotProps={{
                        textField: { fullWidth: true, size: 'small', placeholder: 'dd/mm/yyyy hh:mm' },
                        actionBar: { actions: ['clear', 'today', 'accept'] },
                      }}
                    />
                  </Box>
                  <Box>
                    <FieldLabel>KẾT THÚC</FieldLabel>
                    <DateTimePicker
                      value={form.end_at ? dayjs(form.end_at) : null}
                      onChange={(v) => set('end_at', v ? dayjs(v).toISOString() : '')}
                      format="DD/MM/YYYY HH:mm"
                      minDateTime={form.start_at ? dayjs(form.start_at) : undefined}
                      slotProps={{
                        textField: { fullWidth: true, size: 'small', placeholder: 'dd/mm/yyyy hh:mm' },
                        actionBar: { actions: ['clear', 'today', 'accept'] },
                      }}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              <SectionCard icon={LayersOutlined} title="Ưu tiên & gộp">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel tooltip="Số càng cao càng ưu tiên khi nhiều KM cùng áp dụng.">ĐỘ ƯU TIÊN</FieldLabel>
                    <TextField
                      type="number" fullWidth size="small"
                      value={form.priority}
                      onChange={(e) => set('priority', Number(e.target.value) || 0)}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Box>

                  <FormControlLabel
                    control={<Switch checked={form.stackable} onChange={(_, v) => set('stackable', v)} />}
                    label="Có thể cộng dồn với KM khác"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                  />
                </Stack>
              </SectionCard>

              <SectionCard icon={ToggleOnOutlined} title="Giới hạn sử dụng">
                <Stack spacing={2}>
                  <Box>
                    <FieldLabel>TỔNG LƯỢT DÙNG</FieldLabel>
                    <TextField
                      type="number" fullWidth size="small"
                      value={form.usage_limit}
                      onChange={(e) => set('usage_limit', Number(e.target.value) || 0)}
                      helperText="0 = không giới hạn"
                    />
                  </Box>
                  {isEdit && (
                    <Box sx={{ bgcolor: 'grey.100', borderRadius: 1.5, p: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">Đã dùng</Typography>
                      <Typography variant="h6">{form.used_count}/{form.usage_limit}</Typography>
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
