// src/components/common/variant-grid/variant-grid.jsx
// Polished variant table cho product-form: toolbar, stats footer, inline edit, empty state.
'use client';

import { useMemo, useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, Menu, MenuItem, Stack, Table, TableBody, TableCell, TableHead,
  TableRow, TextField, Tooltip, Typography,
} from '@mui/material';

import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import MoreVertRounded from '@mui/icons-material/MoreVertRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import StarBorderRounded from '@mui/icons-material/StarBorderRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import PaidOutlined from '@mui/icons-material/PaidOutlined';

import { Iconify } from 'src/components/iconify';
import { MoneyInput } from 'src/components/common/money-input';
import { DecimalInput } from 'src/components/common/decimal-input';
import { fCurrency, fShortenNumber } from 'src/utils/format-number';

// Preset size sets theo trục biến thể
const SIZE_PRESETS = {
  size: ['14', '15', '16', '17', '18', '19', '20'],
  ring_size: ['6', '7', '8', '9', '10', '11', '12', '13'],
  bangle_size: ['50', '52', '54', '56', '58', '60'],
};

const STATUS_META = {
  active: { label: 'Đang bán', color: 'success', dot: '#22C55E' },
  inactive: { label: 'Tạm ẩn', color: 'default', dot: '#94A3B8' },
  out_of_stock: { label: 'Hết hàng', color: 'error', dot: '#EF4444' },
};

const emptyRow = (index = 0) => ({
  sku: '',
  size: '',
  gold_weight: '',
  stone_weight: '',
  price: '',
  compare_at_price: '',
  total_stock: 0,
  status: 'active',
  is_default: index === 0,
});

// Status chip inline toggle
function StatusChip({ value, onChange }) {
  const [anchor, setAnchor] = useState(null);
  const meta = STATUS_META[value] ?? STATUS_META.active;
  return (
    <>
      <Chip
        clickable
        onClick={(e) => setAnchor(e.currentTarget)}
        icon={<Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: meta.dot, ml: 1 }} />}
        label={meta.label}
        size="small"
        sx={{
          height: 22,
          fontSize: 11,
          fontWeight: 600,
          bgcolor: 'grey.50',
          border: 1,
          borderColor: 'divider',
          '&:hover': { bgcolor: 'grey.100' },
          '& .MuiChip-icon': { color: 'inherit' },
        }}
        deleteIcon={<Iconify icon="solar:alt-arrow-down-linear" width={10} />}
        onDelete={(e) => setAnchor(e.currentTarget.parentElement)}
      />
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
      >
        {Object.entries(STATUS_META).map(([k, m]) => (
          <MenuItem
            key={k}
            selected={k === value}
            onClick={() => { onChange(k); setAnchor(null); }}
            sx={{ fontSize: 12, py: 0.75 }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: m.dot, mr: 1 }} />
            {m.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export function VariantGrid({
  value = [],
  onChange,
  variantAxis = 'size',
  variantAxisLabel,
  disabled = false,
  sx,
}) {
  const [rowMenu, setRowMenu] = useState({ anchor: null, idx: -1 });
  const [bulkOpen, setBulkOpen] = useState(false);

  const update = (i, patch) => onChange(value.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => onChange([...value, emptyRow(value.length)]);
  const remove = (i) => {
    const next = value.filter((_, idx) => idx !== i);
    // Nếu xoá row default, auto chọn row đầu tiên làm default
    if (value[i]?.is_default && next.length > 0 && !next.some((r) => r.is_default)) {
      next[0] = { ...next[0], is_default: true };
    }
    onChange(next);
  };
  const duplicate = (i) => {
    const copy = { ...value[i], is_default: false, sku: value[i].sku ? `${value[i].sku}-COPY` : '' };
    onChange([...value.slice(0, i + 1), copy, ...value.slice(i + 1)]);
  };
  const setDefault = (i) => onChange(value.map((r, idx) => ({ ...r, is_default: idx === i })));

  const addBulk = (sizes) => {
    const newRows = sizes.map((sz, i) => ({
      ...emptyRow(value.length + i),
      size: sz,
      is_default: value.length === 0 && i === 0,
    }));
    onChange([...value, ...newRows]);
    setBulkOpen(false);
  };

  // Stats footer
  const stats = useMemo(() => {
    const prices = value.map((r) => Number(r.price) || 0).filter((p) => p > 0);
    const totalStock = value.reduce((s, r) => s + (Number(r.total_stock) || 0), 0);
    const lowStockCount = value.filter((r) => (Number(r.total_stock) || 0) > 0 && (Number(r.total_stock) || 0) <= 3).length;
    const outCount = value.filter((r) => (Number(r.total_stock) || 0) === 0).length;
    return {
      count: value.length,
      totalStock,
      lowStockCount,
      outCount,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      avgPrice: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
    };
  }, [value]);

  const hasRows = value.length > 0;

  return (
    <Stack spacing={1.5} sx={sx}>
      {/* ─── TOOLBAR ─── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1}
        sx={{
          p: 1.25,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'grey.50',
        }}
      >
        <Button
          size="small"
          variant="contained"
          startIcon={<AddCircleOutlined sx={{ fontSize: 16 }} />}
          onClick={add}
          disabled={disabled}
          sx={{ boxShadow: 'none', flexShrink: 0 }}
        >
          Thêm biến thể
        </Button>
        {!disabled && SIZE_PRESETS[variantAxis] && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<AutoAwesomeOutlined sx={{ fontSize: 16 }} />}
            onClick={() => setBulkOpen(true)}
            sx={{ flexShrink: 0 }}
          >
            Thêm hàng loạt theo size
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" rowGap={0.5}>
          <Chip
            icon={<Inventory2Outlined sx={{ fontSize: 13, ml: 0.5 }} />}
            label={`${stats.count} biến thể`}
            size="small"
            sx={neutralChipSx}
          />
          {hasRows && (
            <Chip
              label={`Tồn: ${fShortenNumber(stats.totalStock)}`}
              size="small"
              sx={neutralChipSx}
            />
          )}
          {stats.lowStockCount > 0 && (
            <Tooltip title={`${stats.lowStockCount} SKU tồn ≤ 3`}>
              <Chip
                icon={<WarningAmberRounded sx={{ fontSize: 13, ml: 0.5, color: 'text.secondary' }} />}
                label={stats.lowStockCount}
                size="small"
                sx={neutralChipSx}
              />
            </Tooltip>
          )}
        </Stack>
      </Stack>

      {/* ─── TABLE ─── */}
      {!hasRows ? (
        <EmptyVariantState onAdd={add} onBulk={SIZE_PRESETS[variantAxis] ? () => setBulkOpen(true) : null} />
      ) : (
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'common.white',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 980 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={headSx} width={36} />
                  <TableCell sx={headSx} width={72}>
                    {variantAxisLabel || (variantAxis === 'size' ? 'Size' : (variantAxis || '').replace(/_/g, ' ') || '—')}
                  </TableCell>
                  <TableCell sx={headSx}>SKU</TableCell>
                  <TableCell sx={headSx} width={150}>
                    <Stack>
                      <span>Trọng lượng</span>
                      <Typography sx={{ fontSize: 10, fontWeight: 500, color: 'text.disabled' }}>
                        Vàng · Đá
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={headSx} width={170}>
                    <Stack>
                      <span>Giá bán</span>
                      <Typography sx={{ fontSize: 10, fontWeight: 500, color: 'text.disabled' }}>
                        Sale · Gốc
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={headSx} width={100} align="center">Tồn</TableCell>
                  <TableCell sx={headSx} width={130}>Trạng thái</TableCell>
                  <TableCell sx={headSx} width={44} align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {value.map((row, i) => {
                  const stock = Number(row.total_stock) || 0;
                  const isLow = stock > 0 && stock <= 3;
                  const isOut = stock === 0;
                  const hasSale = row.compare_at_price && row.price && Number(row.compare_at_price) > Number(row.price);

                  return (
                    <TableRow
                      key={i}
                      sx={{
                        bgcolor: 'transparent',
                        '&:hover': { bgcolor: 'action.hover' },
                        borderLeft: row.is_default ? 2 : 0,
                        borderLeftColor: row.is_default ? 'text.primary' : 'transparent',
                        '& .MuiTableCell-root': { borderBottom: 1, borderColor: 'divider', py: 1.25 },
                      }}
                    >
                      {/* Default star */}
                      <TableCell align="center">
                        <Tooltip title={row.is_default ? 'Biến thể mặc định hiện ở card SP' : 'Đặt làm mặc định'}>
                          <IconButton
                            size="small"
                            onClick={() => setDefault(i)}
                            sx={{
                              color: row.is_default ? 'text.primary' : 'text.disabled',
                              '&:hover': { color: 'text.primary' },
                            }}
                          >
                            {row.is_default ? <StarRounded sx={{ fontSize: 18 }} /> : <StarBorderRounded sx={{ fontSize: 18 }} />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                      {/* Size badge */}
                      <TableCell>
                        <TextField
                          size="small"
                          value={row.size ?? ''}
                          onChange={(e) => update(i, { size: e.target.value })}
                          placeholder="—"
                          sx={{
                            width: 64,
                            '& input': {
                              textAlign: 'center',
                              fontWeight: 700,
                              fontSize: 13,
                              fontFamily: 'ui-monospace, monospace',
                            },
                          }}
                        />
                      </TableCell>

                      {/* SKU */}
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          value={row.sku ?? ''}
                          onChange={(e) => update(i, { sku: e.target.value })}
                          placeholder="SKU-SIZE-16"
                          sx={{
                            minWidth: 160,
                            '& input': { fontFamily: 'ui-monospace, monospace', fontSize: 12 },
                          }}
                        />
                      </TableCell>

                      {/* Weight compact: gold + stone stacked */}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <DecimalInput
                            size="small"
                            value={row.gold_weight}
                            onChange={(e) => update(i, { gold_weight: e.target.value })}
                            unit="phân"
                            placeholder="Vàng"
                            sx={{ '& input': { fontSize: 11.5 } }}
                          />
                          <DecimalInput
                            size="small"
                            value={row.stone_weight}
                            onChange={(e) => update(i, { stone_weight: e.target.value })}
                            unit="ly"
                            placeholder="Đá"
                            sx={{ '& input': { fontSize: 11.5 } }}
                          />
                        </Stack>
                      </TableCell>

                      {/* Price stack */}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <MoneyInput
                            size="small"
                            value={row.price}
                            onChange={(e) => update(i, { price: e.target.value })}
                            placeholder="Giá sale"
                            sx={{
                              '& input': {
                                fontSize: 12,
                                fontWeight: 700,
                                color: hasSale ? 'error.main' : 'text.primary',
                              },
                            }}
                          />
                          <MoneyInput
                            size="small"
                            value={row.compare_at_price}
                            onChange={(e) => update(i, { compare_at_price: e.target.value })}
                            placeholder="Giá gốc"
                            sx={{
                              '& input': {
                                fontSize: 11.5,
                                textDecoration: hasSale ? 'line-through' : 'none',
                                color: 'text.disabled',
                              },
                            }}
                          />
                        </Stack>
                      </TableCell>

                      {/* Stock with warning */}
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                          <TextField
                            size="small"
                            type="number"
                            value={row.total_stock ?? 0}
                            onChange={(e) => update(i, { total_stock: Number(e.target.value) })}
                            sx={{
                              width: 70,
                              '& input': {
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize: 12,
                                color: 'text.primary',
                              },
                            }}
                          />
                          {(isLow || isOut) && (
                            <Tooltip title={isOut ? 'Đã hết hàng' : 'Tồn thấp (≤ 3)'}>
                              <WarningAmberRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>

                      {/* Status chip toggle */}
                      <TableCell>
                        <StatusChip
                          value={row.status ?? 'active'}
                          onChange={(v) => update(i, { status: v })}
                        />
                      </TableCell>

                      {/* Row menu */}
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => setRowMenu({ anchor: e.currentTarget, idx: i })}
                          sx={{ color: 'text.disabled' }}
                        >
                          <MoreVertRounded sx={{ fontSize: 18 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>

          {/* ─── STATS FOOTER ─── */}
          <Box
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'grey.50',
              px: 2,
              py: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
              flexWrap="wrap"
              rowGap={0.75}
            >
              <StatCell label="Tổng tồn" value={fShortenNumber(stats.totalStock)} />
              {stats.outCount > 0 && (
                <StatCell label="Hết hàng" value={`${stats.outCount} SKU`} />
              )}
              {stats.lowStockCount > 0 && (
                <StatCell label="Sắp hết" value={`${stats.lowStockCount} SKU`} />
              )}
              {stats.minPrice > 0 && (
                <StatCell label="Giá thấp nhất" value={fCurrency(stats.minPrice)} mono />
              )}
              {stats.maxPrice > 0 && stats.maxPrice !== stats.minPrice && (
                <StatCell label="Giá cao nhất" value={fCurrency(stats.maxPrice)} mono />
              )}
              {stats.avgPrice > 0 && (
                <StatCell label="Giá trung bình" value={fCurrency(stats.avgPrice)} mono />
              )}
            </Stack>
          </Box>
        </Box>
      )}

      {/* ─── ROW MENU ─── */}
      <Menu
        anchorEl={rowMenu.anchor}
        open={!!rowMenu.anchor}
        onClose={() => setRowMenu({ anchor: null, idx: -1 })}
      >
        <MenuItem
          onClick={() => { duplicate(rowMenu.idx); setRowMenu({ anchor: null, idx: -1 }); }}
          sx={{ fontSize: 12.5 }}
        >
          <ContentCopyOutlined sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          Nhân bản
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => { remove(rowMenu.idx); setRowMenu({ anchor: null, idx: -1 }); }}
          sx={{ fontSize: 12.5, color: 'error.main' }}
        >
          <DeleteOutlined sx={{ fontSize: 16, mr: 1 }} />
          Xoá
        </MenuItem>
      </Menu>

      {/* ─── BULK ADD DIALOG ─── */}
      <BulkSizeDialog
        open={bulkOpen}
        sizes={SIZE_PRESETS[variantAxis] ?? []}
        existing={value.map((v) => v.size)}
        onClose={() => setBulkOpen(false)}
        onAdd={addBulk}
      />
    </Stack>
  );
}

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

const neutralChipSx = {
  height: 22,
  fontSize: 11,
  fontWeight: 600,
  bgcolor: 'common.white',
  color: 'text.primary',
  border: 1,
  borderColor: 'divider',
};

function StatCell({ label, value, mono, color }) {
  return (
    <Stack spacing={0}>
      <Typography sx={{ fontSize: 10, color: 'text.disabled', fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', lineHeight: 1.3 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 12.5,
          fontWeight: 700,
          color: color ?? 'text.primary',
          fontFamily: mono ? 'ui-monospace, monospace' : 'inherit',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function EmptyVariantState({ onAdd, onBulk }) {
  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 1,
        p: 5,
        textAlign: 'center',
        bgcolor: 'grey.50',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          mx: 'auto',
          mb: 1.5,
          borderRadius: '50%',
          bgcolor: 'common.white',
          border: 1,
          borderColor: 'divider',
          display: 'grid',
          placeItems: 'center',
          color: 'text.disabled',
        }}
      >
        <Inventory2Outlined sx={{ fontSize: 28 }} />
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.5 }}>
        Chưa có biến thể nào
      </Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2, maxWidth: 400, mx: 'auto' }}>
        Thêm biến thể cho từng size / phiên bản. SP không có biến thể vẫn hoạt động — chỉ dùng giá chung.
      </Typography>
      <Stack direction="row" spacing={1} justifyContent="center">
        <Button
          variant="contained"
          startIcon={<AddCircleOutlined sx={{ fontSize: 16 }} />}
          onClick={onAdd}
          sx={{ boxShadow: 'none' }}
        >
          Thêm biến thể đầu tiên
        </Button>
        {onBulk && (
          <Button
            variant="outlined"
            startIcon={<AutoAwesomeOutlined sx={{ fontSize: 16 }} />}
            onClick={onBulk}
          >
            Thêm hàng loạt từ size list
          </Button>
        )}
      </Stack>
    </Box>
  );
}

function BulkSizeDialog({ open, sizes, existing, onClose, onAdd }) {
  const [selected, setSelected] = useState([]);
  const toggle = (s) => setSelected((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);
  const selectAll = () => setSelected(sizes.filter((s) => !existing.includes(s)));
  const clear = () => setSelected([]);

  const handleAdd = () => {
    onAdd(selected);
    setSelected([]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: 15, fontWeight: 700, pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AutoAwesomeOutlined sx={{ fontSize: 20, color: 'primary.main' }} />
          <span>Thêm biến thể hàng loạt</span>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Alert
          severity="info"
          icon={<InfoOutlined sx={{ fontSize: 16 }} />}
          sx={{ mb: 2, fontSize: 11.5 }}
        >
          Chọn các size cần tạo — mỗi size sẽ thêm 1 dòng biến thể rỗng.
        </Alert>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 11, color: 'text.disabled', fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>
            Size có sẵn
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Button size="small" onClick={selectAll} sx={{ fontSize: 11, minWidth: 'auto' }}>
              Chọn tất cả
            </Button>
            <Button size="small" onClick={clear} sx={{ fontSize: 11, minWidth: 'auto', color: 'text.secondary' }}>
              Bỏ chọn
            </Button>
          </Stack>
        </Stack>
        <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.75 }}>
          {sizes.map((s) => {
            const used = existing.includes(s);
            const isSelected = selected.includes(s);
            return (
              <Chip
                key={s}
                label={s}
                size="small"
                clickable={!used}
                onClick={!used ? () => toggle(s) : undefined}
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 700,
                  fontFamily: 'ui-monospace, monospace',
                  minWidth: 48,
                  opacity: used ? 0.4 : 1,
                  textDecoration: used ? 'line-through' : 'none',
                }}
              />
            );
          })}
        </Stack>
        <Typography sx={{ fontSize: 10.5, color: 'text.disabled', mt: 1.5 }}>
          Size có gạch ngang đã được thêm trước đó.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button onClick={onClose} color="inherit">Huỷ</Button>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlined sx={{ fontSize: 16 }} />}
          onClick={handleAdd}
          disabled={selected.length === 0}
          sx={{ boxShadow: 'none' }}
        >
          Thêm {selected.length > 0 ? `${selected.length} size` : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
