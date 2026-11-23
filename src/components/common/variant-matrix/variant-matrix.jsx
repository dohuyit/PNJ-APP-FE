// src/components/common/variant-matrix/variant-matrix.jsx
// Shopify-style variant generator — pick option subsets per axis → cartesian product
// → inline-editable SKU/price/stock table. Preserves per-row edits across re-computes.
// Design: 3 zones (axis picker · matrix · stats), framer-motion row stagger,
// color swatches cho option có color_hex, mini stats footer.
'use client';

import { useCallback, useMemo, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  Alert, Box, Button, Chip, IconButton, Stack, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';

import StarRounded from '@mui/icons-material/StarRounded';
import StarBorderRounded from '@mui/icons-material/StarBorderRounded';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import TuneRounded from '@mui/icons-material/TuneRounded';
import Inventory2Rounded from '@mui/icons-material/Inventory2Rounded';
import PaidRounded from '@mui/icons-material/PaidRounded';

import { MoneyInput } from 'src/components/common/money-input';
import { fCurrency, fShortenNumber } from 'src/utils/format-number';

const DEFAULT_WARN_AT = 50;
const DEFAULT_LIMIT = 200;

// Stable key cho 1 combo {axis_code: value}.
export function axisKey(values = {}) {
  return Object.keys(values).sort().map((k) => `${k}=${values[k]}`).join('|');
}

function cartesian(axes, selection) {
  const lists = axes.map((a) => (selection[a.code] ?? []).map((v) => ({ [a.code]: v })));
  if (lists.some((l) => l.length === 0)) return [];
  return lists.reduce(
    (acc, list) => acc.flatMap((prev) => list.map((cur) => ({ ...prev, ...cur }))),
    [{}]
  );
}

function computeVariants({ axes, selection, existing, skuPrefix }) {
  const combos = cartesian(axes, selection);
  const byKey = new Map();
  (existing ?? []).forEach((v) => byKey.set(axisKey(v.attribute_values || {}), v));

  const next = combos.map((values, idx) => {
    const key = axisKey(values);
    const prev = byKey.get(key);
    if (prev) return { ...prev, attribute_values: values };
    const autoSku = [skuPrefix, ...Object.values(values)].filter(Boolean).join('-');
    return {
      attribute_values: values,
      sku: autoSku,
      price: '',
      compare_at_price: '',
      total_stock: 0,
      is_default: idx === 0 && !existing?.some((v) => v.is_default),
    };
  });

  if (next.length > 0 && !next.some((v) => v.is_default)) {
    next[0] = { ...next[0], is_default: true };
  }
  return next;
}

function assertUniqueKeys(variants) {
  if (process.env.NODE_ENV === 'production') return;
  const seen = new Set();
  for (const v of variants) {
    const k = axisKey(v.attribute_values || {});
    if (seen.has(k)) {
      // eslint-disable-next-line no-console
      console.assert(false, `[VariantMatrix] duplicate variant key: ${k}`);
    }
    seen.add(k);
  }
}

// Lookup helper: nhận axis + raw value → { label, colorHex, value }.
function lookupOption(axis, rawValue) {
  const opt = (axis.options ?? []).find((o) => (o?.value ?? o) === rawValue);
  return {
    value: rawValue,
    label: opt?.label ?? opt?.value ?? rawValue ?? '—',
    colorHex: opt?.color_hex,
  };
}

// ─── Axis picker — mỗi axis 1 mini-card ─────────────────────────
function AxisPicker({ axis, selected, onToggle }) {
  const options = axis.options ?? [];
  const selCount = selected.length;
  const totalCount = options.length;

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1,
        bgcolor: 'common.white',
        border: 1,
        borderColor: selCount > 0 ? 'primary.light' : 'divider',
        transition: 'border-color .2s ease',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Box
          sx={{
            width: 28, height: 28, borderRadius: 1,
            bgcolor: selCount > 0 ? 'primary.lighter' : 'grey.100',
            color: selCount > 0 ? 'primary.dark' : 'text.secondary',
            display: 'grid', placeItems: 'center',
          }}
        >
          <TuneRounded sx={{ fontSize: 16 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.3 }}>
            {axis.name}
            {axis.unit && <Box component="span" sx={{ color: 'text.disabled', fontWeight: 500, ml: 0.5 }}>({axis.unit})</Box>}
          </Typography>
          <Typography sx={{ fontSize: 10.5, color: 'text.disabled', letterSpacing: 0.3 }}>
            {axis.code}
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`${selCount}/${totalCount}`}
          sx={{
            height: 22, fontSize: 11, fontWeight: 700,
            bgcolor: selCount > 0 ? 'primary.lighter' : 'grey.100',
            color: selCount > 0 ? 'primary.dark' : 'text.secondary',
            border: 'none',
          }}
        />
      </Stack>
      {options.length === 0 ? (
        <Typography sx={{ fontSize: 11, color: 'text.disabled', py: 0.5 }}>
          Attribute "{axis.name}" chưa có option. Thêm trong module Thuộc tính.
        </Typography>
      ) : (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ gap: 0.75 }}>
          {options.map((o) => {
            const val = o.value ?? o;
            const label = o.label ?? val;
            const active = selected.includes(val);
            return (
              <m.div
                key={val}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <Box
                  onClick={() => onToggle(val)}
                  sx={{
                    cursor: 'pointer',
                    px: 1.25, py: 0.5,
                    borderRadius: 1,
                    border: active ? 2 : 1,
                    borderColor: active ? 'primary.main' : 'divider',
                    bgcolor: active ? 'primary.lighter' : 'common.white',
                    display: 'flex', alignItems: 'center', gap: 0.5,
                    fontSize: 12, fontWeight: 600,
                    color: active ? 'primary.dark' : 'text.primary',
                    transition: 'all .15s ease',
                    userSelect: 'none',
                    '&:hover': {
                      borderColor: active ? 'primary.main' : 'text.disabled',
                      bgcolor: active ? 'primary.lighter' : 'grey.50',
                    },
                  }}
                >
                  {o.color_hex && (
                    <Box
                      sx={{
                        width: 12, height: 12, borderRadius: '50%',
                        bgcolor: o.color_hex, border: 1, borderColor: 'divider',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {label}
                </Box>
              </m.div>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}

// ─── Main component ─────────────────────────────────────────────
export function VariantMatrix({
  variantAttrs = [],
  selection = {},
  onSelectionChange,
  variants = [],
  onVariantsChange,
  skuPrefix = '',
  warnAt = DEFAULT_WARN_AT,
  limit = DEFAULT_LIMIT,
}) {
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkStock, setBulkStock] = useState('');

  const toggleOption = useCallback(
    (axisCode, value) => {
      const cur = selection[axisCode] ?? [];
      const next = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value];
      const nextSelection = { ...selection, [axisCode]: next };
      onSelectionChange?.(nextSelection);
      const nextVariants = computeVariants({
        axes: variantAttrs,
        selection: nextSelection,
        existing: variants,
        skuPrefix,
      });
      assertUniqueKeys(nextVariants);
      onVariantsChange?.(nextVariants);
    },
    [selection, variantAttrs, variants, skuPrefix, onSelectionChange, onVariantsChange]
  );

  const comboCount = useMemo(() => {
    if (variantAttrs.length === 0) return 0;
    return variantAttrs.reduce((n, a) => n * (selection[a.code]?.length ?? 0), 1);
  }, [variantAttrs, selection]);

  const overLimit = comboCount > limit;
  const overWarn = comboCount > warnAt && !overLimit;

  // ─── Mini stats ────────────
  const stats = useMemo(() => {
    const totalStock = variants.reduce((s, r) => s + (Number(r.total_stock) || 0), 0);
    const prices = variants.map((r) => Number(r.price) || 0).filter((p) => p > 0);
    return {
      total: variants.length,
      totalStock,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      pricedCount: prices.length,
    };
  }, [variants]);

  const updateVariant = (idx, patch) => {
    onVariantsChange?.(variants.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  };
  const setDefault = (idx) => {
    onVariantsChange?.(variants.map((v, i) => ({ ...v, is_default: i === idx })));
  };
  const bulkFillPrice = () => {
    if (!bulkPrice) return;
    onVariantsChange?.(variants.map((v) => ({ ...v, price: bulkPrice })));
    setBulkPrice('');
  };
  const bulkFillStock = () => {
    const n = Number(bulkStock);
    if (Number.isNaN(n)) return;
    onVariantsChange?.(variants.map((v) => ({ ...v, total_stock: n })));
    setBulkStock('');
  };
  const resetMatrix = () => {
    onSelectionChange?.({});
    onVariantsChange?.([]);
  };

  // ─── Empty state ────────────
  if (variantAttrs.length === 0) {
    return (
      <Box
        sx={{
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          p: 4,
          textAlign: 'center',
          bgcolor: 'grey.50',
        }}
      >
        <Box
          sx={{
            width: 48, height: 48, borderRadius: '50%',
            bgcolor: 'common.white', border: 1, borderColor: 'divider',
            display: 'grid', placeItems: 'center',
            mx: 'auto', mb: 1.5, color: 'text.disabled',
          }}
        >
          <Inventory2Rounded sx={{ fontSize: 24 }} />
        </Box>
        <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 0.5 }}>
          Sản phẩm đơn — không có biến thể
        </Typography>
        <Typography sx={{ fontSize: 11.5, color: 'text.secondary', maxWidth: 320, mx: 'auto' }}>
          Nhóm thuộc tính đang chọn không có attribute nào bật <b>is_variant</b>.
          Cấu hình trong module Thuộc tính nếu muốn thêm trục biến thể.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {/* ═══ ZONE 1 · AXIS PICKER ══════════════════════════════════ */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
          <AutoAwesomeRounded sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.3, color: 'text.secondary', textTransform: 'uppercase' }}>
            Chọn giá trị cho từng trục
          </Typography>
          <Box sx={{ flex: 1 }} />
          <m.div
            key={comboCount}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Chip
              size="small"
              icon={<Inventory2Rounded sx={{ fontSize: 13, ml: 0.5 }} />}
              label={comboCount > 0 ? `Sẽ sinh ${comboCount} biến thể` : 'Chưa chọn'}
              sx={{
                height: 24, fontSize: 11.5, fontWeight: 700,
                bgcolor: comboCount > 0 ? 'primary.lighter' : 'grey.100',
                color: comboCount > 0 ? 'primary.dark' : 'text.secondary',
                border: 'none',
                '& .MuiChip-icon': { color: comboCount > 0 ? 'primary.dark' : 'text.secondary' },
              }}
            />
          </m.div>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' },
            gap: 1.25,
          }}
        >
          {variantAttrs.map((axis) => (
            <AxisPicker
              key={axis.code}
              axis={axis}
              selected={selection[axis.code] ?? []}
              onToggle={(v) => toggleOption(axis.code, v)}
            />
          ))}
        </Box>
      </Box>

      {/* ═══ WARNINGS ═════════════════════════════════════════════ */}
      {overWarn && (
        <Alert severity="warning" sx={{ fontSize: 12, borderRadius: 1 }}>
          Đang có <b>{comboCount}</b> biến thể — số lượng khá lớn. Cân nhắc giảm option để quản lý dễ hơn.
        </Alert>
      )}
      {overLimit && (
        <Alert severity="error" sx={{ fontSize: 12, borderRadius: 1 }}>
          Vượt giới hạn <b>{limit}</b> biến thể. Không sinh bảng. Giảm option tick để tiếp tục.
        </Alert>
      )}

      {/* ═══ ZONE 2 · MATRIX TABLE ════════════════════════════════ */}
      {!overLimit && variants.length > 0 && (
        <m.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Box
            sx={{
              border: 1, borderColor: 'divider', borderRadius: 1,
              bgcolor: 'common.white', overflow: 'hidden',
            }}
          >
            {/* ── Toolbar — bulk actions ── */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'stretch', md: 'center' }}
              sx={{
                px: 2, py: 1.25,
                bgcolor: 'grey.50',
                borderBottom: 1, borderColor: 'divider',
              }}
            >
              <Typography sx={{
                fontSize: 11, fontWeight: 700, color: 'text.secondary',
                letterSpacing: 0.4, textTransform: 'uppercase', flexShrink: 0,
              }}>
                Áp đồng loạt
              </Typography>

              <Stack direction="row" spacing={0.75} alignItems="center">
                <MoneyInput
                  size="small"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  placeholder="Giá bán"
                  sx={{ width: 160, '& .MuiOutlinedInput-root': { bgcolor: 'common.white' } }}
                />
                <Button
                  size="small" variant="outlined" color="inherit"
                  startIcon={<ContentCopyRounded sx={{ fontSize: 14 }} />}
                  onClick={bulkFillPrice}
                  disabled={!bulkPrice}
                  sx={{ flexShrink: 0, boxShadow: 'none' }}
                >
                  Áp giá
                </Button>
              </Stack>

              <Box sx={{ display: { xs: 'none', md: 'block' }, height: 24, width: 1, bgcolor: 'divider' }} />

              <Stack direction="row" spacing={0.75} alignItems="center">
                <TextField
                  size="small" type="number"
                  value={bulkStock}
                  onChange={(e) => setBulkStock(e.target.value)}
                  placeholder="Tồn"
                  sx={{ width: 100, '& .MuiOutlinedInput-root': { bgcolor: 'common.white' } }}
                />
                <Button
                  size="small" variant="outlined" color="inherit"
                  startIcon={<ContentCopyRounded sx={{ fontSize: 14 }} />}
                  onClick={bulkFillStock}
                  disabled={bulkStock === ''}
                  sx={{ flexShrink: 0, boxShadow: 'none' }}
                >
                  Áp tồn
                </Button>
              </Stack>

              <Box sx={{ flex: 1 }} />

              <Button
                size="small" color="inherit"
                startIcon={<RestartAltRounded sx={{ fontSize: 16 }} />}
                onClick={resetMatrix}
                sx={{ fontWeight: 600 }}
              >
                Reset
              </Button>
            </Stack>

            {/* ── Table ── */}
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 720 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={headSx} width={44} align="center">
                      <Tooltip title="Biến thể mặc định hiển thị trên card SP">
                        <StarRounded sx={{ fontSize: 14, color: 'text.disabled', verticalAlign: 'middle' }} />
                      </Tooltip>
                    </TableCell>
                    {variantAttrs.map((a) => (
                      <TableCell key={a.code} sx={headSx} width={140}>{a.name}</TableCell>
                    ))}
                    <TableCell sx={headSx} width={200}>SKU</TableCell>
                    <TableCell sx={headSx} width={170}>Giá bán</TableCell>
                    <TableCell sx={headSx} width={100} align="center">Tồn</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence initial={false}>
                    {variants.map((row, i) => {
                      const rowKey = axisKey(row.attribute_values);
                      return (
                        <m.tr
                          key={rowKey}
                          layout
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.18, delay: Math.min(i * 0.015, 0.3) }}
                          style={{ display: 'table-row' }}
                        >
                          <TableCell
                            align="center"
                            sx={{
                              ...rowCellSx(row.is_default),
                              borderLeft: row.is_default ? 3 : 0,
                              borderLeftColor: 'primary.main',
                            }}
                          >
                            <Tooltip title={row.is_default ? 'Đang là mặc định' : 'Đặt làm mặc định'}>
                              <IconButton
                                size="small"
                                onClick={() => setDefault(i)}
                                sx={{
                                  color: row.is_default ? 'primary.main' : 'text.disabled',
                                  transition: 'transform .15s ease',
                                  '&:hover': { transform: 'scale(1.1)' },
                                }}
                              >
                                {row.is_default
                                  ? <StarRounded sx={{ fontSize: 18 }} />
                                  : <StarBorderRounded sx={{ fontSize: 18 }} />}
                              </IconButton>
                            </Tooltip>
                          </TableCell>

                          {variantAttrs.map((a) => {
                            const opt = lookupOption(a, row.attribute_values?.[a.code]);
                            return (
                              <TableCell key={a.code} sx={rowCellSx(row.is_default)}>
                                <Stack direction="row" spacing={0.75} alignItems="center">
                                  {opt.colorHex && (
                                    <Box
                                      sx={{
                                        width: 14, height: 14, borderRadius: '50%',
                                        bgcolor: opt.colorHex, border: 1, borderColor: 'divider',
                                        flexShrink: 0,
                                      }}
                                    />
                                  )}
                                  <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>
                                    {opt.label}
                                  </Typography>
                                  {a.unit && (
                                    <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                                      {a.unit}
                                    </Typography>
                                  )}
                                </Stack>
                              </TableCell>
                            );
                          })}

                          <TableCell sx={rowCellSx(row.is_default)}>
                            <TextField
                              size="small" fullWidth
                              value={row.sku ?? ''}
                              onChange={(e) => updateVariant(i, { sku: e.target.value })}
                              placeholder="SKU"
                              sx={{
                                '& input': { fontFamily: 'ui-monospace, monospace', fontSize: 12 },
                                '& .MuiOutlinedInput-root': { bgcolor: 'common.white' },
                              }}
                            />
                          </TableCell>

                          <TableCell sx={rowCellSx(row.is_default)}>
                            <MoneyInput
                              size="small" fullWidth
                              value={row.price}
                              onChange={(e) => updateVariant(i, { price: e.target.value })}
                              placeholder="Giá bán"
                              sx={{
                                '& input': { fontWeight: 600 },
                                '& .MuiOutlinedInput-root': { bgcolor: 'common.white' },
                              }}
                            />
                          </TableCell>

                          <TableCell align="center" sx={rowCellSx(row.is_default)}>
                            <TextField
                              size="small" type="number"
                              value={row.total_stock ?? 0}
                              onChange={(e) => updateVariant(i, { total_stock: Number(e.target.value) || 0 })}
                              sx={{
                                width: 76,
                                '& input': { textAlign: 'center', fontWeight: 700, fontSize: 12 },
                                '& .MuiOutlinedInput-root': { bgcolor: 'common.white' },
                              }}
                            />
                          </TableCell>
                        </m.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </Box>

            {/* ── Stats footer ── */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{
                px: 2, py: 1.25, bgcolor: 'grey.50',
                borderTop: 1, borderColor: 'divider',
              }}
            >
              <StatItem icon={Inventory2Rounded} label="Biến thể" value={fShortenNumber(stats.total)} />
              <StatDivider />
              <StatItem icon={Inventory2Rounded} label="Tổng tồn" value={fShortenNumber(stats.totalStock)} />
              {stats.pricedCount > 0 && (
                <>
                  <StatDivider />
                  <StatItem
                    icon={PaidRounded}
                    label={stats.minPrice === stats.maxPrice ? 'Giá' : 'Giá min–max'}
                    value={
                      stats.minPrice === stats.maxPrice
                        ? fCurrency(stats.minPrice)
                        : `${fCurrency(stats.minPrice)} – ${fCurrency(stats.maxPrice)}`
                    }
                    mono
                  />
                </>
              )}
              {stats.pricedCount < stats.total && (
                <>
                  <StatDivider />
                  <Typography sx={{ fontSize: 11, color: 'warning.dark' }}>
                    {stats.total - stats.pricedCount} biến thể chưa có giá
                  </Typography>
                </>
              )}
            </Stack>
          </Box>
        </m.div>
      )}
    </Stack>
  );
}

// ─── Sub-styles & bits ──────────────────────────────────────────

const headSx = {
  fontWeight: 700,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  color: 'text.secondary',
  borderBottom: 1,
  borderColor: 'divider',
  py: 1.25,
};

const rowCellSx = (isDefault) => ({
  borderBottom: 1,
  borderColor: 'divider',
  py: 1.25,
  bgcolor: isDefault ? 'primary.lighter' : 'transparent',
  transition: 'background .15s ease',
  '.MuiTableRow-root:hover &': {
    bgcolor: isDefault ? 'primary.lighter' : 'action.hover',
  },
});

function StatItem({ icon: Icon, label, value, mono }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      {Icon && <Icon sx={{ fontSize: 14, color: 'text.secondary' }} />}
      <Typography sx={{ fontSize: 10.5, color: 'text.disabled', fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 12.5,
          fontWeight: 700,
          fontFamily: mono ? 'ui-monospace, monospace' : 'inherit',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function StatDivider() {
  return <Box sx={{ display: { xs: 'none', sm: 'block' }, height: 16, width: 1, bgcolor: 'divider' }} />;
}
