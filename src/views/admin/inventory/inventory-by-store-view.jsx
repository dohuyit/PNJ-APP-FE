// src/views/admin/inventory/inventory-by-store-view.jsx
// Tồn kho theo cửa hàng — mặc định hiển thị grid card tất cả cửa hàng.
// Click card → vào trang chi tiết SKU của store đó (có nút Quay lại + search).

'use client';

import { useMemo, useState } from 'react';

import TuneOutlined from '@mui/icons-material/TuneOutlined';
import StoreOutlined from '@mui/icons-material/StoreOutlined';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import {
  Box, Chip, Grid, IconButton, LinearProgress, Stack, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtNumber, fmtRelative } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetStoreList } from 'src/actions/admin/store';
import { useGetInventoryByStore } from 'src/actions/admin/inventory';
import { m, fadeIn, staggerContainer } from 'src/views/admin/_shared/motion';

import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';

import { InventoryAdjustDrawer } from './inventory-adjust-drawer';
import { mockInventory } from 'src/mock-data';

// Accent pastel cho từng loại store — gọn, không chói.
const TYPE_META = {
  flagship:      { label: 'Flagship',    accent: '#D97706', soft: '#FFFBEB' },
  jewelry_center:{ label: 'TT Kim hoàn', accent: '#7C3AED', soft: '#F5F3FF' },
  store:         { label: 'Cửa hàng',    accent: '#2563EB', soft: '#EFF6FF' },
  watch_store:   { label: 'CH Đồng hồ',  accent: '#059669', soft: '#ECFDF5' },
  kiosk:         { label: 'Kiosk',       accent: '#64748B', soft: '#F8FAFC' },
};
const typeMeta = (t) => TYPE_META[t] ?? { label: 'Cửa hàng', accent: '#64748B', soft: '#F8FAFC' };

const STATUS_META = {
  active:   { label: 'Đang mở',  dot: '#16A34A' },
  inactive: { label: 'Tạm ngưng', dot: '#94A3B8' },
  closed:   { label: 'Đã đóng', dot: '#DC2626' },
};

// Gom inventory theo store_id → { total, sku_count, low, out_of_stock, synced_at }
function buildStoreAggregates() {
  const map = new Map();
  mockInventory.forEach((it) => {
    const key = it.store_id;
    if (!map.has(key)) {
      map.set(key, {
        store_id: key, sku_count: 0, total_qty: 0, available: 0,
        reserved: 0, low: 0, out: 0, latest_sync: null,
      });
    }
    const agg = map.get(key);
    agg.sku_count += 1;
    agg.total_qty += it.qty_on_hand ?? 0;
    agg.available += it.available ?? 0;
    agg.reserved += it.qty_reserved ?? 0;
    if ((it.available ?? 0) === 0) agg.out += 1;
    else if ((it.available ?? 0) < 5) agg.low += 1;
    const t = it.synced_at ? new Date(it.synced_at).getTime() : 0;
    if (!agg.latest_sync || t > agg.latest_sync) agg.latest_sync = t;
  });
  return map;
}

// ---------- Store Card ----------

function StoreCard({ store, agg, onClick }) {
  const meta = typeMeta(store.type);
  const status = STATUS_META[store.status] ?? STATUS_META.inactive;
  const healthPct = agg?.sku_count > 0
    ? Math.max(0, Math.min(100, Math.round(((agg.sku_count - agg.out - agg.low) / agg.sku_count) * 100)))
    : 0;
  const healthColor = healthPct >= 80 ? '#059669' : healthPct >= 50 ? '#D97706' : '#DC2626';

  return (
    <m.div variants={fadeIn} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
      <Box
        onClick={onClick}
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          border: 1, borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color .18s, box-shadow .18s',
          '&:hover': {
            borderColor: meta.accent + '66',
            boxShadow: `0 4px 12px ${meta.accent}14`,
          },
        }}
      >
        {/* Accent strip top */}
        <Box sx={{ height: 3, bgcolor: meta.accent, opacity: 0.85 }} />

        {/* Header: icon + code + name + type chip */}
        <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ p: 2, pb: 1.5 }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: 1,
            bgcolor: meta.soft, color: meta.accent,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <StoreOutlined sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography sx={{ fontSize: 10.5, fontFamily: 'ui-monospace, monospace', color: 'text.disabled', fontWeight: 700 }}>
                {store.code}
              </Typography>
              <Chip
                label={meta.label}
                size="small"
                sx={{
                  height: 16, fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
                  bgcolor: meta.soft, color: meta.accent,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            </Stack>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'text.primary', lineHeight: 1.25, mt: 0.1 }} noWrap>
              {store.name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: status.dot }} />
              <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>{status.label}</Typography>
              <Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'text.disabled', opacity: 0.4 }} />
              <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }} noWrap>
                {store.province}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Metrics */}
        <Box sx={{ px: 2, pb: 1.5 }}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {fmtNumber(agg?.sku_count ?? 0)}
            </Typography>
            <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
              SKU
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
              Tồn {fmtNumber(agg?.total_qty ?? 0)}
            </Typography>
          </Stack>

          {/* Health bar: xanh = ổn, vàng = cảnh báo, đỏ = nguy */}
          <Box sx={{ mt: 1, mb: 0.75 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.4 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 500, color: 'text.disabled', letterSpacing: 0.3, textTransform: 'uppercase' }}>
                Tình trạng kho
              </Typography>
              <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: healthColor, fontVariantNumeric: 'tabular-nums' }}>
                {healthPct}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={healthPct}
              sx={{
                height: 3, borderRadius: 2,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': { bgcolor: healthColor, opacity: 0.75, borderRadius: 2 },
              }}
            />
          </Box>
        </Box>

        {/* Alert strip */}
        <Stack
          direction="row" alignItems="center"
          sx={{
            px: 2, py: 1.25,
            bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider',
          }}
        >
          <Tooltip title={`${agg?.low ?? 0} SKU sắp hết`}>
            <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mr: 1.5 }}>
              <Iconify icon="solar:danger-triangle-linear" width={12} sx={{ color: '#D97706' }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: 'text.secondary' }}>
                {agg?.low ?? 0}
              </Typography>
              <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>sắp hết</Typography>
            </Stack>
          </Tooltip>
          <Tooltip title={`${agg?.out ?? 0} SKU hết hàng`}>
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <Iconify icon="solar:close-circle-linear" width={12} sx={{ color: '#DC2626' }} />
              <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: 'text.secondary' }}>
                {agg?.out ?? 0}
              </Typography>
              <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>hết</Typography>
            </Stack>
          </Tooltip>
          <Box sx={{ flex: 1 }} />
          <Tooltip title={agg?.latest_sync ? new Date(agg.latest_sync).toLocaleString('vi-VN') : '—'}>
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <Iconify icon="solar:refresh-linear" width={11} sx={{ color: 'text.disabled' }} />
              <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>
                {agg?.latest_sync ? fmtRelative(new Date(agg.latest_sync).toISOString()) : '—'}
              </Typography>
            </Stack>
          </Tooltip>
        </Stack>
      </Box>
    </m.div>
  );
}

// ---------- Grid view (default) ----------

function StoresGrid({ stores, aggregates, onPick }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const types = useMemo(() => {
    const set = new Set(stores.map((s) => s.type).filter(Boolean));
    return Array.from(set);
  }, [stores]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stores.filter((s) => {
      if (q && !(`${s.name} ${s.code} ${s.province}`.toLowerCase().includes(q))) return false;
      if (typeFilter !== 'all' && s.type !== typeFilter) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      return true;
    });
  }, [stores, search, typeFilter, statusFilter]);

  // KPI cho hub header
  const kpi = useMemo(() => {
    let sku = 0, low = 0, out = 0;
    stores.forEach((s) => {
      const a = aggregates.get(s._id ?? s.id);
      if (!a) return;
      sku += a.sku_count;
      low += a.low;
      out += a.out;
    });
    return { stores: stores.length, sku, low, out };
  }, [stores, aggregates]);

  return (
    <>
      {/* KPI row — edge-to-edge, 4 cột, border mờ qua CSS shorthand */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        bgcolor: 'background.paper',
        borderTop: '1px solid rgba(145, 158, 171, 0.08)',
        borderBottom: '1px solid rgba(145, 158, 171, 0.08)',
      }}>
        {[
          { label: 'Cửa hàng', value: fmtNumber(kpi.stores), icon: 'solar:shop-linear',             color: '#2563EB' },
          { label: 'Tổng SKU', value: fmtNumber(kpi.sku),    icon: 'solar:box-minimalistic-linear', color: '#7C3AED' },
          { label: 'Sắp hết',  value: fmtNumber(kpi.low),    icon: 'solar:danger-triangle-linear',  color: '#D97706' },
          { label: 'Hết hàng', value: fmtNumber(kpi.out),    icon: 'solar:close-circle-linear',     color: '#DC2626' },
        ].map((s, i, arr) => {
          const needRight = { xs: i % 2 === 0, md: i < arr.length - 1 };
          const needBottom = { xs: i < arr.length - 2, md: false };
          return (
          <Stack
            key={s.label}
            direction="row" spacing={1.25} alignItems="center"
            sx={{
              px: 2, py: 1.5,
              borderRight: {
                xs: needRight.xs ? '1px solid rgba(145, 158, 171, 0.08)' : 'none',
                md: needRight.md ? '1px solid rgba(145, 158, 171, 0.08)' : 'none',
              },
              borderBottom: {
                xs: needBottom.xs ? '1px solid rgba(145, 158, 171, 0.08)' : 'none',
                md: 'none',
              },
            }}
          >
            <Box sx={{
              width: 32, height: 32, borderRadius: 0.75,
              bgcolor: s.color + '14', color: s.color,
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Iconify icon={s.icon} width={16} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 10.5, color: 'text.disabled', lineHeight: 1.2, fontWeight: 500, letterSpacing: 0.3, textTransform: 'uppercase' }}>
                {s.label}
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary', lineHeight: 1.15, fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </Typography>
            </Box>
          </Stack>
          );
        })}
      </Box>

      {/* Toolbar — dùng FilterBar chuẩn như order/product */}
      <Box sx={{
        px: 2, py: 1.25,
        bgcolor: 'grey.50',
        borderBottom: 1, borderColor: 'divider',
      }}>
        <FilterBar
          searchValue={search}
          onSearch={setSearch}
          placeholder="Tìm theo mã, tên, tỉnh/TP…"
          filters={[
            {
              value: typeFilter,
              onChange: setTypeFilter,
              minWidth: 180,
              defaultValue: 'all',
              options: [
                { value: 'all', label: 'Tất cả loại CH' },
                ...types.map((t) => ({ value: t, label: typeMeta(t).label })),
              ],
            },
            {
              value: statusFilter,
              onChange: setStatusFilter,
              minWidth: 160,
              defaultValue: 'all',
              options: [
                { value: 'all',      label: 'Tất cả trạng thái' },
                { value: 'active',   label: 'Đang mở' },
                { value: 'inactive', label: 'Tạm ngưng' },
                { value: 'closed',   label: 'Đã đóng' },
              ],
            },
          ]}
          onReset={
            (typeFilter !== 'all' || statusFilter !== 'all' || search)
              ? () => { setTypeFilter('all'); setStatusFilter('all'); setSearch(''); }
              : undefined
          }
          extra={
            <Typography sx={{ fontSize: 11.5, color: 'text.disabled', ml: 1 }}>
              {filtered.length}/{stores.length} cửa hàng
            </Typography>
          }
        />
      </Box>

      {/* Grid cards — padding riêng */}
      <Box sx={{ px: { xs: 2, md: 2.5 }, py: 2 }}>
      {filtered.length === 0 ? (
        <Stack alignItems="center" spacing={1.5} sx={{ py: 8, color: 'text.disabled' }}>
          <Iconify icon="solar:shop-linear" width={32} />
          <Typography sx={{ fontSize: 12.5 }}>Không có cửa hàng nào khớp bộ lọc</Typography>
        </Stack>
      ) : (
        <m.div variants={staggerContainer(0.04, 0.02)} initial="hidden" animate="show">
          <Grid container spacing={1.5}>
            {filtered.map((s) => {
              const id = s._id ?? s.id;
              return (
                <Grid key={id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <StoreCard
                    store={s}
                    agg={aggregates.get(id)}
                    onClick={() => onPick(id)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </m.div>
      )}
      </Box>
    </>
  );
}

// ---------- Stock-level meta ----------

const STOCK_LEVEL = {
  out:  { label: 'Hết hàng',    icon: 'solar:close-circle-bold',      bg: '#FEE2E2', fg: '#DC2626' },
  low:  { label: 'Sắp hết',     icon: 'solar:danger-triangle-bold',   bg: '#FEF3C7', fg: '#B45309' },
  mid:  { label: 'Bình thường', icon: 'solar:box-minimalistic-bold',  bg: '#DBEAFE', fg: '#1D4ED8' },
  high: { label: 'Dồi dào',     icon: 'solar:check-circle-bold',      bg: '#DCFCE7', fg: '#15803D' },
};

function stockLevel(available) {
  if (available === 0) return STOCK_LEVEL.out;
  if (available < 5) return STOCK_LEVEL.low;
  if (available < 15) return STOCK_LEVEL.mid;
  return STOCK_LEVEL.high;
}

// ---------- Detail (table) view ----------

function StoreInventoryTable({ store, onBack, onAdjust }) {
  const storeId = store?._id ?? store?.id;
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });
  const { searchResults: rows, searchLoading: loading } = useGetInventoryByStore(storeId, { perPage: 200 }, !!storeId);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => {
      if (q && !(r.sku ?? '').toLowerCase().includes(q) && !(r.product_name ?? '').toLowerCase().includes(q)) return false;
      if (levelFilter !== 'all') {
        const v = r.available ?? 0;
        if (levelFilter === 'out' && v !== 0) return false;
        if (levelFilter === 'low' && !(v > 0 && v < 5)) return false;
        if (levelFilter === 'mid' && !(v >= 5 && v < 15)) return false;
        if (levelFilter === 'high' && v < 15) return false;
      }
      return true;
    });
  }, [rows, search, levelFilter]);

  // Count by level for filter badges
  const counts = useMemo(() => {
    const c = { all: rows.length, out: 0, low: 0, mid: 0, high: 0 };
    rows.forEach((r) => {
      const v = r.available ?? 0;
      if (v === 0) c.out += 1;
      else if (v < 5) c.low += 1;
      else if (v < 15) c.mid += 1;
      else c.high += 1;
    });
    return c;
  }, [rows]);

  const meta = typeMeta(store?.type);

  const columns = [
    {
      field: 'product_name', headerName: 'Sản phẩm', flex: 1, minWidth: 280, sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ py: 1, minWidth: 0, width: '100%' }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 0.75,
            bgcolor: meta.soft, color: meta.accent,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Iconify icon="solar:box-linear" width={16} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', lineHeight: 1.25 }} noWrap>
              {p.row.product_name ?? '—'}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.125 }}>
              <Typography sx={{ fontSize: 10.5, fontFamily: 'ui-monospace, monospace', color: 'text.disabled' }} noWrap>
                {p.row.sku}
              </Typography>
              {p.row.variant_label && (
                <>
                  <Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'text.disabled', opacity: 0.5 }} />
                  <Chip
                    label={p.row.variant_label}
                    size="small"
                    sx={{
                      height: 16, fontSize: 9.5, fontWeight: 600,
                      bgcolor: 'grey.100', color: 'text.secondary',
                      '& .MuiChip-label': { px: 0.75 },
                    }}
                  />
                </>
              )}
            </Stack>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'qty_on_hand', headerName: 'Tồn kho', width: 100, align: 'right', headerAlign: 'right',
      renderCell: (p) => (
        <Box sx={{ width: '100%', textAlign: 'right' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
            {fmtNumber(p.row.qty_on_hand ?? 0)}
          </Typography>
          <Typography sx={{ fontSize: 9.5, color: 'text.disabled', letterSpacing: 0.3, textTransform: 'uppercase' }}>
            trên kệ
          </Typography>
        </Box>
      ),
    },
    {
      field: 'qty_reserved', headerName: 'Đang giữ', width: 100, align: 'right', headerAlign: 'right',
      renderCell: (p) => {
        const v = p.row.qty_reserved ?? 0;
        return (
          <Box sx={{ width: '100%', textAlign: 'right' }}>
            <Typography sx={{
              fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
              color: v > 0 ? 'warning.dark' : 'text.disabled',
            }}>
              {v > 0 ? `−${fmtNumber(v)}` : '0'}
            </Typography>
            <Typography sx={{ fontSize: 9.5, color: 'text.disabled', letterSpacing: 0.3, textTransform: 'uppercase' }}>
              reserved
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'available', headerName: 'Khả dụng', width: 150, align: 'right', headerAlign: 'right', sortable: true,
      renderCell: (p) => {
        const v = p.row.available ?? 0;
        const lv = stockLevel(v);
        return (
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ width: '100%', justifyContent: 'flex-end' }}>
            <Typography sx={{
              fontSize: 14, fontWeight: 700, color: lv.fg, fontVariantNumeric: 'tabular-nums',
            }}>
              {fmtNumber(v)}
            </Typography>
            <Chip
              icon={<Iconify icon={lv.icon} width={10} />}
              label={lv.label}
              size="small"
              sx={{
                height: 20, fontSize: 10, fontWeight: 700,
                bgcolor: lv.bg, color: lv.fg,
                '& .MuiChip-icon': { color: 'inherit', ml: 0.4 },
                '& .MuiChip-label': { px: 0.5 },
              }}
            />
          </Stack>
        );
      },
    },
    {
      field: 'synced_at', headerName: 'Đồng bộ', width: 140,
      renderCell: (p) => (
        <Stack direction="row" spacing={0.4} alignItems="center">
          <Iconify icon="solar:refresh-linear" width={11} sx={{ color: 'text.disabled' }} />
          <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
            {fmtRelative(p.row.synced_at)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'actions', headerName: '', width: 60, sortable: false, align: 'center',
      renderCell: (p) => (
        <Tooltip title="Điều chỉnh tồn kho">
          <IconButton size="small" onClick={() => onAdjust({ sku: p.row.sku, store_id: storeId })}>
            <TuneOutlined sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      {/* Store detail header */}
      <Stack
        direction="row" alignItems="center" spacing={1.5}
        sx={{
          px: { xs: 2, md: 2.5 }, py: 1.75,
          bgcolor: 'background.paper',
          borderBottom: 1, borderColor: 'divider',
        }}
      >
        <Tooltip title="Quay lại danh sách cửa hàng">
          <IconButton size="small" onClick={onBack} sx={{ color: 'text.secondary' }}>
            <ArrowBackOutlined sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Box sx={{
          width: 38, height: 38, borderRadius: 1,
          bgcolor: meta.soft, color: meta.accent,
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <StoreOutlined sx={{ fontSize: 18 }} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography sx={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: 'text.disabled', fontWeight: 700 }}>
              {store?.code}
            </Typography>
            <Chip
              label={meta.label}
              size="small"
              sx={{
                height: 16, fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
                bgcolor: meta.soft, color: meta.accent, '& .MuiChip-label': { px: 0.75 },
              }}
            />
            {store?.status && (
              <Stack direction="row" alignItems="center" spacing={0.4}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: STATUS_META[store.status]?.dot ?? '#94A3B8' }} />
                <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
                  {STATUS_META[store.status]?.label ?? '—'}
                </Typography>
              </Stack>
            )}
          </Stack>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }} noWrap>
            {store?.name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
            {store?.address}
          </Typography>
        </Box>
      </Stack>

      {/* KPI chips row cho table */}
      <Stack
        direction="row" spacing={0.75} alignItems="center" flexWrap="wrap"
        sx={{
          px: { xs: 2, md: 2.5 }, py: 1.5,
          bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider',
          rowGap: 0.75,
        }}
      >
        <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase', mr: 1 }}>
          Lọc nhanh
        </Typography>
        {[
          { key: 'all',  label: 'Tất cả',     meta: { bg: 'grey.100',  fg: 'text.primary' } },
          { key: 'out',  label: STOCK_LEVEL.out.label,  meta: { bg: STOCK_LEVEL.out.bg,  fg: STOCK_LEVEL.out.fg },  icon: STOCK_LEVEL.out.icon },
          { key: 'low',  label: STOCK_LEVEL.low.label,  meta: { bg: STOCK_LEVEL.low.bg,  fg: STOCK_LEVEL.low.fg },  icon: STOCK_LEVEL.low.icon },
          { key: 'mid',  label: STOCK_LEVEL.mid.label,  meta: { bg: STOCK_LEVEL.mid.bg,  fg: STOCK_LEVEL.mid.fg },  icon: STOCK_LEVEL.mid.icon },
          { key: 'high', label: STOCK_LEVEL.high.label, meta: { bg: STOCK_LEVEL.high.bg, fg: STOCK_LEVEL.high.fg }, icon: STOCK_LEVEL.high.icon },
        ].map((f) => {
          const active = levelFilter === f.key;
          const count = counts[f.key];
          return (
            <Chip
              key={f.key}
              icon={f.icon ? <Iconify icon={f.icon} width={11} /> : undefined}
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>{f.label}</span>
                  <Box sx={{
                    fontSize: 9.5, fontWeight: 700,
                    bgcolor: active ? 'background.paper' : 'grey.100',
                    color: active ? f.meta.fg : 'text.disabled',
                    px: 0.5, borderRadius: 0.5, lineHeight: 1.3,
                  }}>
                    {count}
                  </Box>
                </Stack>
              }
              size="small"
              variant={active ? 'filled' : 'outlined'}
              onClick={() => setLevelFilter(f.key)}
              sx={{
                height: 24, fontSize: 11, fontWeight: 600,
                bgcolor: active ? f.meta.bg : 'background.paper',
                color: active ? f.meta.fg : 'text.secondary',
                borderColor: active ? f.meta.fg + '44' : 'divider',
                '& .MuiChip-icon': { color: active ? 'inherit' : 'text.disabled' },
                '& .MuiChip-label': { display: 'flex', alignItems: 'center' },
              }}
            />
          );
        })}
        <Box sx={{ flex: 1 }} />
        <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
          {filteredRows.length}/{rows.length} dòng
        </Typography>
      </Stack>

      <DataTable
        rows={filteredRows}
        columns={columns}
        loading={loading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        toolbar={
          <FilterBar
            searchValue={search}
            onSearch={setSearch}
            placeholder="Tìm SKU / sản phẩm…"
          />
        }
      />
    </Box>
  );
}

// ---------- Main ----------

export function InventoryByStoreView() {
  const [storeId, setStoreId] = useState(null);
  const [adjustInitial, setAdjustInitial] = useState(null);

  const { searchResults: storeOpts } = useGetStoreList({ perPage: 200 });
  const aggregates = useMemo(() => buildStoreAggregates(), []);
  const selectedStore = useMemo(
    () => storeOpts.find((s) => (s._id ?? s.id) === storeId) ?? null,
    [storeOpts, storeId],
  );

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Tồn kho theo cửa hàng"
        subtitle={selectedStore
          ? `${selectedStore.code} · ${selectedStore.name}`
          : 'Chọn cửa hàng từ danh sách dưới để xem chi tiết SKU · tồn / khả dụng / đã giữ.'}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Tồn kho' },
          { label: 'Theo kho' },
          ...(selectedStore ? [{ label: selectedStore.name }] : []),
        ]}
      />

      {!selectedStore ? (
        <StoresGrid
          stores={storeOpts}
          aggregates={aggregates}
          onPick={setStoreId}
        />
      ) : (
        <StoreInventoryTable
          store={selectedStore}
          onBack={() => setStoreId(null)}
          onAdjust={setAdjustInitial}
        />
      )}

      <InventoryAdjustDrawer
        open={!!adjustInitial}
        initial={adjustInitial ?? {}}
        onClose={() => setAdjustInitial(null)}
      />
    </DashboardContent>
  );
}
