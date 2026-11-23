// src/views/admin/attribute/attribute-create-drawer.jsx — Full-width drawer tạo/sửa attribute

'use client';

import { useEffect, useState } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, FormControlLabel, Grid, IconButton, MenuItem, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,
} from '@mui/material';

import { SectionCard, FieldLabel } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';

const INPUT_TYPES = [
  { value: 'select',      label: 'Chọn 1',       icon: 'solar:list-check-linear' },
  { value: 'multiselect', label: 'Chọn nhiều',   icon: 'solar:list-check-minimalistic-linear' },
  { value: 'text',        label: 'Text',         icon: 'solar:text-field-linear' },
  { value: 'number',      label: 'Số nguyên',    icon: 'solar:hashtag-linear' },
  { value: 'decimal',     label: 'Số thập phân', icon: 'solar:dot-linear' },
  { value: 'boolean',     label: 'Có / Không',   icon: 'solar:check-square-linear' },
];

const FILTER_DISPLAYS = [
  { value: 'chip',   label: 'Chip',   icon: 'solar:tag-linear' },
  { value: 'color',  label: 'Màu sắc',icon: 'solar:palette-linear' },
  { value: 'range',  label: 'Khoảng', icon: 'solar:ruler-linear' },
  { value: 'check',  label: 'Checkbox', icon: 'solar:check-square-linear' },
];

// Nhóm hiển thị trên trang chi tiết SP PNJ — attribute-set gom theo group này.
export const DISPLAY_GROUPS = [
  { value: 'material',   label: 'Vật liệu & Trọng lượng', icon: 'solar:diamond-linear' },
  { value: 'main_stone', label: 'Đá chính',               icon: 'solar:star-shine-linear' },
  { value: 'side_stone', label: 'Đá phụ',                 icon: 'solar:stars-minimalistic-linear' },
  { value: 'size',       label: 'Kích thước',             icon: 'solar:ruler-linear' },
  { value: 'design',     label: 'Thiết kế',               icon: 'solar:palette-linear' },
  { value: 'other',      label: 'Thông tin khác',         icon: 'solar:info-circle-linear' },
];

const EMPTY = {
  code: '',
  name: '',
  input_type: 'select',
  unit: '',
  display_group: 'other',
  help_text: '',
  placeholder: '',
  is_filterable: true,
  filter_display: 'chip',
  is_variant_axis: false,
  is_visible_on_detail: true,
  options: [
    { value: '', label: '', color_hex: '', sort: 1 },
  ],
  sort: 1,
};

export function AttributeFormDrawer({ open, onClose, onSubmit, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) { setForm(initial ? { ...EMPTY, ...initial, options: initial.options ?? EMPTY.options } : EMPTY); setDirty(false); }
  }, [open, initial]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const setOption = (idx, k, v) => set('options', form.options.map((o, i) => (i === idx ? { ...o, [k]: v } : o)));
  const addOption = () => set('options', [...form.options, { value: '', label: '', color_hex: '', sort: form.options.length + 1 }]);
  const removeOption = (idx) => set('options', form.options.filter((_, i) => i !== idx));

  const hasOptions = ['select', 'multiselect'].includes(form.input_type);
  const canSubmit = form.code.trim() && form.name.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await onSubmit?.(form); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa thuộc tính · ${initial?.name ?? ''}` : 'Tạo thuộc tính'}
      subtitle={isEdit ? `${initial?.in_use ? 'Đang được dùng' : 'Chưa sử dụng'}` : 'Thuộc tính là nguồn cho bộ lọc, bảng thông số, trục biến thể'}
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo thuộc tính'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, minHeight: '100%' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <SectionCard icon={InfoOutlined} title="Thông tin chung">
                <Stack spacing={2.25}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required tooltip="Khóa duy nhất, lowercase_snake. VD: gold_karat">CODE</FieldLabel>
                      <TextField
                        value={form.code}
                        onChange={(e) => set('code', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                        fullWidth size="small" autoFocus
                        placeholder="gold_karat"
                        inputProps={{ style: { fontFamily: 'monospace' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>TÊN HIỂN THỊ</FieldLabel>
                      <TextField
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        fullWidth size="small"
                        placeholder="Tuổi vàng"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required>KIỂU NHẬP</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.input_type}
                        onChange={(e) => set('input_type', e.target.value)}
                      >
                        {INPUT_TYPES.map((t) => (
                          <MenuItem key={t.value} value={t.value}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Iconify icon={t.icon} width={16} sx={{ color: 'text.secondary' }} />
                              <span>{t.label}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel tooltip="Đơn vị kèm số. VD: phân, kg, mm">ĐƠN VỊ</FieldLabel>
                      <TextField
                        value={form.unit}
                        onChange={(e) => set('unit', e.target.value)}
                        fullWidth size="small"
                        placeholder="phân"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel required tooltip="Quyết định attribute này nằm ở nhóm nào trên trang chi tiết SP PNJ.">NHÓM HIỂN THỊ</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.display_group}
                        onChange={(e) => set('display_group', e.target.value)}
                      >
                        {DISPLAY_GROUPS.map((g) => (
                          <MenuItem key={g.value} value={g.value}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Iconify icon={g.icon} width={16} sx={{ color: 'text.secondary' }} />
                              <span>{g.label}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FieldLabel tooltip="Gợi ý văn bản khi input trống (placeholder).">PLACEHOLDER</FieldLabel>
                      <TextField
                        value={form.placeholder}
                        onChange={(e) => set('placeholder', e.target.value)}
                        fullWidth size="small"
                        placeholder="Vd: Nhập số phân vàng"
                      />
                    </Grid>
                    <Grid size={12}>
                      <FieldLabel tooltip="Ghi chú hiện dưới input trên trang chi tiết — giúp khách hiểu attribute.">MÔ TẢ GỢI Ý</FieldLabel>
                      <TextField
                        value={form.help_text}
                        onChange={(e) => set('help_text', e.target.value)}
                        fullWidth size="small" multiline rows={2}
                        placeholder="Vd: Tuổi vàng là tỉ lệ phần trăm vàng nguyên chất trong hợp kim."
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </SectionCard>

              {hasOptions && (
                <SectionCard
                  icon={TuneOutlined}
                  title={`Options · ${form.options.length}`}
                  description="Giá trị chọn được. Có thể gắn màu hex nếu dùng filter_display = color."
                  action={
                    <Button
                      size="small" variant="outlined"
                      startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
                      onClick={addOption}
                    >
                      Thêm option
                    </Button>
                  }
                >
                  {/* Header row */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '160px 1fr 140px 80px 40px',
                      gap: 1.5, alignItems: 'center',
                      px: 1.25, py: 1,
                      bgcolor: 'grey.50', borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    {['Value', 'Label', 'Color', 'Sort', ''].map((h, idx) => (
                      <Typography
                        key={idx}
                        sx={{
                          fontSize: 10.5, fontWeight: 700,
                          letterSpacing: 0.4, textTransform: 'uppercase',
                          color: 'text.secondary',
                        }}
                      >
                        {h}
                      </Typography>
                    ))}
                  </Box>

                  {/* Option rows */}
                  <Stack spacing={1}>
                    {form.options.map((o, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '160px 1fr 140px 80px 40px',
                          gap: 1.5, alignItems: 'center',
                          px: 1.25, py: 0.75,
                          border: 1, borderColor: 'divider', borderRadius: 1,
                          bgcolor: 'common.white',
                          transition: 'border-color .15s ease, box-shadow .15s ease',
                          '&:hover': {
                            borderColor: 'text.disabled',
                            boxShadow: '0 1px 2px rgba(145, 158, 171, 0.08)',
                          },
                        }}
                      >
                        <TextField
                          size="small" fullWidth
                          value={o.value}
                          onChange={(e) => setOption(i, 'value', e.target.value)}
                          placeholder="10k"
                          inputProps={{ style: { fontFamily: 'ui-monospace, monospace', fontSize: 12 } }}
                        />
                        <TextField
                          size="small" fullWidth
                          value={o.label}
                          onChange={(e) => setOption(i, 'label', e.target.value)}
                          placeholder="Vàng 10K"
                        />
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Box
                            sx={{
                              width: 24, height: 24, borderRadius: '50%',
                              bgcolor: o.color_hex || 'transparent',
                              border: 1, borderColor: 'divider',
                              flexShrink: 0,
                            }}
                          />
                          <TextField
                            size="small" type="color"
                            value={o.color_hex || '#000000'}
                            onChange={(e) => setOption(i, 'color_hex', e.target.value)}
                            sx={{ width: 56, '& input[type=color]': { p: 0.25, cursor: 'pointer' } }}
                          />
                        </Stack>
                        <TextField
                          size="small" type="number"
                          value={o.sort}
                          onChange={(e) => setOption(i, 'sort', Number(e.target.value) || 0)}
                          sx={{ width: 70 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeOption(i)}
                          sx={{
                            color: 'text.disabled',
                            '&:hover': { color: 'error.main', bgcolor: 'error.lighter' },
                          }}
                        >
                          <Iconify icon="solar:trash-bin-trash-linear" width={16} />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </SectionCard>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <SectionCard icon={FilterListOutlined} title="Vai trò & hiển thị">
                <Stack spacing={1.5}>
                  <FormControlLabel
                    control={<Switch checked={form.is_filterable} onChange={(_, v) => set('is_filterable', v)} />}
                    label="Dùng cho bộ lọc danh mục"
                  />
                  {form.is_filterable && (
                    <Box>
                      <FieldLabel>KIỂU LỌC HIỂN THỊ</FieldLabel>
                      <TextField
                        select fullWidth size="small"
                        value={form.filter_display}
                        onChange={(e) => set('filter_display', e.target.value)}
                      >
                        {FILTER_DISPLAYS.map((f) => (
                          <MenuItem key={f.value} value={f.value}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Iconify icon={f.icon} width={16} sx={{ color: 'text.secondary' }} />
                              <span>{f.label}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  )}
                  <FormControlLabel
                    control={<Switch checked={form.is_variant_axis} onChange={(_, v) => set('is_variant_axis', v)} />}
                    label="Trục biến thể"
                  />
                  <FormControlLabel
                    control={<Switch checked={form.is_visible_on_detail} onChange={(_, v) => set('is_visible_on_detail', v)} />}
                    label="Hiện ở bảng thông số"
                  />
                  <Box>
                    <FieldLabel>THỨ TỰ</FieldLabel>
                    <TextField
                      type="number" size="small" sx={{ width: 120 }}
                      value={form.sort}
                      onChange={(e) => set('sort', Number(e.target.value) || 0)}
                    />
                  </Box>
                </Stack>
              </SectionCard>

              {isEdit && initial?.in_use && (
                <Box sx={{ bgcolor: 'grey.50', color: 'text.primary', borderRadius: 1, p: 1.5, border: 1, borderColor: 'divider' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="solar:shield-warning-linear" width={20} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>Đang được sử dụng</Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    Đổi code hoặc kiểu nhập có thể làm lỗi dữ liệu hiện tại.
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </FormDrawer>
  );
}
