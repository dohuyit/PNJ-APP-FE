// src/views/admin/attribute-set/attribute-set-create-form.jsx — FormDrawer tạo/sửa nhóm thuộc tính
// Style khớp brand-form: full-width · SectionCard · dirty · preview. Swap từ Dialog sang FormDrawer.

'use client';

import { useState, useEffect, useMemo } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Box, Button, Chip, Grid, IconButton, InputAdornment,
  Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';
import { DISPLAY_GROUPS } from 'src/views/admin/attribute/attribute-create-drawer';
import {
  useGetAttributeList,
  actionGetAttributeSetDetail,
} from 'src/actions/admin/attribute';

import { Iconify } from 'src/components/iconify';
import { FormDrawer } from 'src/components/common/form-drawer';


const EMPTY = {
  name: '',
  description: '',
  attributes: [], // [{ attribute_id, is_required, is_variant, sort }]
  sort: 1,
};

// Normalise initial.attribute(s) → shape nội bộ. Hỗ trợ dữ liệu cũ (attribute_ids: [id]).
function normaliseAttrs(raw) {
  if (!raw) return [];
  if (Array.isArray(raw.attributes) && raw.attributes.length) {
    return raw.attributes
      .map((a, i) => ({
        attribute_id: a.attribute_id ?? a._id ?? a.id,
        is_required: !!a.is_required,
        is_variant: !!a.is_variant,
        sort: typeof a.sort === 'number' ? a.sort : i + 1,
      }))
      .filter((a) => a.attribute_id);
  }
  if (Array.isArray(raw.attribute_ids) && raw.attribute_ids.length) {
    return raw.attribute_ids.map((id, i) => ({
      attribute_id: id,
      is_required: false,
      is_variant: false,
      sort: i + 1,
    }));
  }
  return [];
}

export function AttributeSetFormDrawer({ open, onClose, onSubmit, initial }) {
  const attributesList = useGetAttributeList().searchResults;
  const isEdit = !!initial;
  const [form, setForm] = useState(EMPTY);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!open) return;
    setDirty(false);
    if (!initial) { setForm(EMPTY); setFilter(''); return; }
    setFilter('');
    setForm({
      ...EMPTY,
      ...initial,
      attributes: normaliseAttrs(initial),
    });
    const id = initial._id ?? initial.id;
    if (id) {
      actionGetAttributeSetDetail(id)
        .then((res) => {
          const detail = res?.data?.data ?? res?.data ?? null;
          const attrs = normaliseAttrs(detail);
          if (attrs.length) setForm((f) => ({ ...f, ...detail, attributes: attrs }));
        })
        .catch(() => {});
    }
  }, [open, initial]);

  const byId = useMemo(() => {
    const m = new Map();
    attributesList.forEach((a) => m.set(a._id ?? a.id, a));
    return m;
  }, [attributesList]);

  const selectedIds = useMemo(() => new Set(form.attributes.map((x) => x.attribute_id)), [form.attributes]);

  const available = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return attributesList.filter((a) => {
      const id = a._id ?? a.id;
      if (selectedIds.has(id)) return false;
      if (!q) return true;
      return (a.name || '').toLowerCase().includes(q) || (a.code || '').toLowerCase().includes(q);
    });
  }, [attributesList, selectedIds, filter]);

  const addAttr = (id) =>
    { setForm((f) => ({
      ...f,
      attributes: [
        ...f.attributes,
        { attribute_id: id, is_required: false, is_variant: false, sort: f.attributes.length + 1 },
      ],
    })); setDirty(true); }

  const removeAttr = (id) => {
    setForm((f) => ({
      ...f,
      attributes: f.attributes.filter((x) => x.attribute_id !== id).map((x, i) => ({ ...x, sort: i + 1 })),
    }));
    setDirty(true);
  };

  const toggleFlag = (id, flag) => {
    setForm((f) => ({
      ...f,
      attributes: f.attributes.map((x) => (x.attribute_id === id ? { ...x, [flag]: !x[flag] } : x)),
    }));
    setDirty(true);
  };

  const move = (id, dir) => {
    setForm((f) => {
      const idx = f.attributes.findIndex((x) => x.attribute_id === id);
      if (idx < 0) return f;
      const target = idx + dir;
      if (target < 0 || target >= f.attributes.length) return f;
      const next = [...f.attributes];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...f, attributes: next.map((x, i) => ({ ...x, sort: i + 1 })) };
    });
    setDirty(true);
  };

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e })); setDirty(true); };

  const canSubmit = form.name.trim() && form.attributes.length > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit?.({
        name: form.name,
        description: form.description,
        sort: form.sort,
        attributes: form.attributes,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      width="100vw"
      title={isEdit ? `Sửa nhóm — ${initial?.name ?? ''}` : 'Tạo nhóm thuộc tính'}
      subtitle={isEdit ? `${form.attributes.length} attribute · gán cho sản phẩm/dòng hàng` : 'Gộp các attribute vào 1 nhóm để gán cho sản phẩm / dòng hàng.'}
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
            {isEdit ? 'Lưu thay đổi' : 'Tạo nhóm'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ bgcolor: 'grey.50', mx: -3, my: -2.5, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 } }}>
       <Stack spacing={2}>
        <SectionCard icon={InfoOutlined} title="Thông tin nhóm">
          <Stack spacing={2}>
            <Box>
              <FieldLabel required>TÊN NHÓM</FieldLabel>
              <TextField
                autoFocus fullWidth size="small"
                value={form.name}
                onChange={set('name')}
                placeholder="Vd: Thuộc tính Trang sức vàng"
              />
            </Box>
            <Box>
              <FieldLabel>MÔ TẢ</FieldLabel>
              <TextField
                fullWidth size="small" multiline rows={2}
                value={form.description ?? ''}
                onChange={set('description')}
                placeholder="Áp dụng cho dòng Trang sức — gồm chất liệu, tuổi vàng, màu vàng, đá chính..."
              />
            </Box>
            <Box sx={{ width: 180 }}>
              <FieldLabel>THỨ TỰ NHÓM</FieldLabel>
              <TextField
                type="number" size="small" fullWidth
                value={form.sort}
                onChange={(e) => { setForm((f) => ({ ...f, sort: Number(e.target.value) || 0 })); setDirty(true); }}
                inputProps={{ min: 0 }}
              />
            </Box>
          </Stack>
        </SectionCard>

        <SectionCard
          icon={LayersOutlined}
          title={`Attribute picker · ${form.attributes.length}/${attributesList.length}`}
          description="KHO bên trái: nhấn + để thêm. ĐÃ CHỌN bên phải: gom theo nhóm hiển thị, bật required / variant."
        >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' },
            gap: 2,
            alignItems: 'start',
          }}
        >
          {/* LEFT · available */}
          <Stack spacing={1} sx={{ bgcolor: 'background.neutral', p: 1.5, borderRadius: 1, minHeight: 280 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                KHO ATTRIBUTE · {available.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Nhấn + để thêm</Typography>
            </Stack>
            <TextField
              size="small" fullWidth
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Tìm theo tên / code…"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="solar:magnifer-linear" width={14} sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Stack spacing={0.5} sx={{ maxHeight: 360, overflow: 'auto' }}>
              {available.length === 0 && (
                <Typography variant="caption" color="text.disabled" sx={{ py: 1, textAlign: 'center' }}>
                  Không còn attribute để thêm
                </Typography>
              )}
              {available.map((a) => {
                const id = a._id ?? a.id;
                return (
                  <Stack
                    key={id}
                    direction="row" alignItems="center" spacing={1}
                    sx={{
                      px: 1, py: 0.75, borderRadius: 1, bgcolor: 'background.paper',
                      border: (t) => `1px solid ${t.palette.divider}`,
                    }}
                  >
                    <Stack sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap>{a.name}</Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="caption" color="text.disabled" noWrap>
                          {a.code} · {a.input_type}
                        </Typography>
                        {a.display_group && (
                          <Chip
                            size="small"
                            label={DISPLAY_GROUPS.find((g) => g.value === a.display_group)?.label ?? a.display_group}
                            sx={{ height: 16, fontSize: 9.5, bgcolor: 'grey.100', ml: 0.5 }}
                          />
                        )}
                      </Stack>
                    </Stack>
                    <IconButton size="small" onClick={() => addAttr(id)} sx={{ color: 'primary.main' }}>
                      <Iconify icon="solar:add-circle-linear" width={18} />
                    </IconButton>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>

          {/* RIGHT · selected grouped by display_group */}
          <Stack spacing={1} sx={{ p: 1.5, borderRadius: 1, border: (t) => `1px dashed ${t.palette.divider}`, minHeight: 280 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              ĐÃ CHỌN · {form.attributes.length} · gom theo nhóm hiển thị
            </Typography>
            {form.attributes.length === 0 && (
              <Typography variant="caption" color="text.disabled" sx={{ py: 3, textAlign: 'center' }}>
                Chưa có attribute. Thêm từ cột bên trái.
              </Typography>
            )}
            <Stack spacing={1.25} sx={{ maxHeight: 420, overflow: 'auto' }}>
              {DISPLAY_GROUPS.map((group) => {
                const rows = form.attributes
                  .map((r, originalIdx) => ({ r, originalIdx, attr: byId.get(r.attribute_id) }))
                  .filter(({ attr }) => (attr?.display_group ?? 'other') === group.value);
                if (rows.length === 0) return null;
                return (
                  <Box key={group.value}>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                      <Iconify icon={group.icon} width={14} sx={{ color: 'text.secondary' }} />
                      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3, color: 'text.secondary' }}>
                        {group.label.toUpperCase()} · {rows.length}
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5}>
                      {rows.map(({ r: row, originalIdx: idx, attr: a }) => (
                        <Stack
                          key={row.attribute_id}
                          direction="row" alignItems="center" spacing={1}
                          sx={{
                            px: 1, py: 0.75, borderRadius: 1, bgcolor: 'background.paper',
                            border: (t) => `1px solid ${t.palette.divider}`,
                          }}
                        >
                          <Stack sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap>{a?.name ?? row.attribute_id}</Typography>
                            <Typography variant="caption" color="text.disabled" noWrap>
                              {a?.code ?? '—'} · {a?.input_type ?? '—'}
                            </Typography>
                          </Stack>
                          <Tooltip title="Bắt buộc nhập cho sản phẩm trong bộ này">
                            <Chip
                              label="Required"
                              size="small"
                              color={row.is_required ? 'warning' : 'default'}
                              variant={row.is_required ? 'filled' : 'outlined'}
                              onClick={() => toggleFlag(row.attribute_id, 'is_required')}
                              sx={{ cursor: 'pointer' }}
                            />
                          </Tooltip>
                          <Tooltip title="Dùng làm biến thể (variant axis) cho sản phẩm">
                            <Switch
                              size="small"
                              checked={row.is_variant}
                              onChange={() => toggleFlag(row.attribute_id, 'is_variant')}
                            />
                          </Tooltip>
                          <IconButton size="small" disabled={idx === 0} onClick={() => move(row.attribute_id, -1)}>
                            <Iconify icon="solar:alt-arrow-up-linear" width={14} />
                          </IconButton>
                          <IconButton
                            size="small"
                            disabled={idx === form.attributes.length - 1}
                            onClick={() => move(row.attribute_id, 1)}
                          >
                            <Iconify icon="solar:alt-arrow-down-linear" width={14} />
                          </IconButton>
                          <IconButton size="small" onClick={() => removeAttr(row.attribute_id)} sx={{ color: 'error.main' }}>
                            <Iconify icon="solar:trash-bin-trash-linear" width={14} />
                          </IconButton>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        </Box>

        </SectionCard>
       </Stack>
      </Box>
    </FormDrawer>
  );
}
