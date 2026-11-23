// src/views/admin/inventory/inventory-transfers-view.jsx
// Phiếu chuyển kho — card grid với flow from → to + status pipeline.

'use client';

import { useMemo, useState } from 'react';

import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import StoreOutlined from '@mui/icons-material/StoreOutlined';
import {
  Box, Button, Chip, Grid, IconButton, Stack, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtNumber, fmtRelative } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetInventoryTransfers,
  CONST_TRANSFER_STATUS,
} from 'src/actions/admin/inventory';
import { m, fadeIn, staggerContainer } from 'src/views/admin/_shared/motion';

import { Iconify } from 'src/components/iconify';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';

import { InventoryTransferDrawer } from './inventory-transfer-drawer';

// Status meta — icon + màu riêng cho mỗi trạng thái
const STATUS_META = {
  draft:      { label: 'Nháp',        icon: 'solar:document-add-linear',    bg: '#F1F5F9', fg: '#64748B', dot: '#94A3B8', step: 0 },
  in_transit: { label: 'Đang chuyển', icon: 'solar:delivery-linear',        bg: '#FEF3C7', fg: '#B45309', dot: '#D97706', step: 1 },
  received:   { label: 'Đã nhận',     icon: 'solar:check-circle-linear',    bg: '#DCFCE7', fg: '#15803D', dot: '#16A34A', step: 2 },
  canceled:   { label: 'Đã huỷ',      icon: 'solar:close-circle-linear',    bg: '#FEE2E2', fg: '#DC2626', dot: '#DC2626', step: -1 },
};
const statusMeta = (s) => STATUS_META[s] ?? STATUS_META.draft;

// Pipeline 3 bước: Draft → In transit → Received (canceled = -1 off path)
const PIPELINE_STEPS = ['Lập phiếu', 'Đang chuyển', 'Đã nhận'];

// ---------- Mini store box ----------

function StoreBox({ name, label, align = 'left', accent }) {
  return (
    <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1, textAlign: align }}>
      <Typography sx={{
        fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
        color: 'text.disabled', lineHeight: 1,
      }}>
        {label}
      </Typography>
      <Stack
        direction={align === 'right' ? 'row-reverse' : 'row'}
        spacing={0.75} alignItems="center" sx={{ mt: 0.25 }}
      >
        <Box sx={{
          width: 24, height: 24, borderRadius: 0.75,
          bgcolor: accent + '14', color: accent,
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <StoreOutlined sx={{ fontSize: 13 }} />
        </Box>
        <Typography sx={{
          fontSize: 12.5, fontWeight: 600, color: 'text.primary',
          lineHeight: 1.25, minWidth: 0,
        }} noWrap>
          {name ?? '—'}
        </Typography>
      </Stack>
    </Stack>
  );
}

// ---------- Pipeline bar ----------

function PipelineBar({ status }) {
  const meta = statusMeta(status);
  const isCanceled = status === 'canceled';
  return (
    <Stack direction="row" spacing={0} alignItems="center" sx={{ width: '100%' }}>
      {PIPELINE_STEPS.map((lbl, i) => {
        const done = !isCanceled && i <= meta.step;
        const current = !isCanceled && i === meta.step;
        return (
          <Stack key={lbl} direction="row" alignItems="center" sx={{ flex: 1 }}>
            <Stack alignItems="center" spacing={0.4} sx={{ flex: 1 }}>
              <Box sx={{
                width: 16, height: 16, borderRadius: '50%',
                bgcolor: done ? (isCanceled ? '#DC2626' : meta.dot) : 'grey.200',
                border: 2,
                borderColor: current ? meta.dot : 'transparent',
                boxShadow: current ? `0 0 0 3px ${meta.dot}22` : 'none',
                display: 'grid', placeItems: 'center',
                transition: 'all .2s',
              }}>
                {done && !current && (
                  <Iconify icon="solar:check-read-linear" width={10} sx={{ color: 'common.white' }} />
                )}
              </Box>
              <Typography sx={{
                fontSize: 9, fontWeight: current ? 700 : 500,
                color: done ? 'text.primary' : 'text.disabled',
                letterSpacing: 0.2,
                whiteSpace: 'nowrap',
              }}>
                {lbl}
              </Typography>
            </Stack>
            {i < PIPELINE_STEPS.length - 1 && (
              <Box sx={{
                height: 2, flex: 1, mt: -1.75,
                bgcolor: i < meta.step && !isCanceled ? meta.dot : 'grey.200',
                opacity: isCanceled ? 0.3 : 1,
                transition: 'background-color .2s',
              }} />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}

// ---------- Transfer Card ----------

function TransferCard({ transfer, onClick }) {
  const meta = statusMeta(transfer.status);
  const itemsCount = transfer.items?.length ?? transfer.items_count ?? 0;
  const qtyTotal = transfer.items?.reduce?.((s, it) => s + (it.qty ?? 0), 0) ?? 0;

  return (
    <m.div
      variants={fadeIn}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      style={{ height: '100%' }}
    >
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
          display: 'flex', flexDirection: 'column',
          height: '100%',
          '&:hover': {
            borderColor: meta.dot + '66',
            boxShadow: `0 4px 12px ${meta.dot}14`,
          },
        }}
      >
        {/* Accent strip top theo status */}
        <Box sx={{ height: 3, bgcolor: meta.dot, opacity: 0.85, flexShrink: 0 }} />

        {/* Header: code + status + time */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2, pt: 1.5, pb: 1 }}>
          <Typography sx={{
            fontSize: 11, fontWeight: 700, fontFamily: 'ui-monospace, monospace',
            color: 'text.primary', letterSpacing: 0.3,
          }}>
            {transfer._id?.toUpperCase?.() ?? transfer.id}
          </Typography>
          <Chip
            icon={<Iconify icon={meta.icon} width={11} />}
            label={meta.label}
            size="small"
            sx={{
              height: 20, fontSize: 10, fontWeight: 700, letterSpacing: 0.2,
              bgcolor: meta.bg, color: meta.fg,
              '& .MuiChip-icon': { color: 'inherit', ml: 0.4 },
              '& .MuiChip-label': { px: 0.6 },
            }}
          />
          <Box sx={{ flex: 1 }} />
          <Stack direction="row" alignItems="center" spacing={0.4}>
            <Iconify icon="solar:clock-circle-linear" width={11} sx={{ color: 'text.disabled' }} />
            <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
              {fmtRelative(transfer.created_at)}
            </Typography>
          </Stack>
        </Stack>

        {/* Flow: from → to */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2, py: 1.5 }}>
          <StoreBox
            label="TỪ"
            name={transfer.from_store_name}
            accent="#DC2626"
            align="left"
          />
          <Box sx={{
            display: 'grid', placeItems: 'center',
            px: 0.5,
          }}>
            <Box sx={{
              display: 'grid', placeItems: 'center',
              width: 28, height: 28, borderRadius: '50%',
              bgcolor: meta.bg, color: meta.fg,
            }}>
              <ArrowForwardOutlined sx={{ fontSize: 14 }} />
            </Box>
          </Box>
          <StoreBox
            label="ĐẾN"
            name={transfer.to_store_name}
            accent="#059669"
            align="right"
          />
        </Stack>

        {/* Pipeline */}
        <Box sx={{ px: 2, py: 1.25, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
          <PipelineBar status={transfer.status} />
        </Box>

        {/* Footer: items + actor + note — luôn chiếm phần dưới card để các card đều nhau */}
        <Box sx={{ mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
          <Stack
            direction="row" alignItems="center" spacing={1}
            sx={{ px: 2, py: 1.25 }}
          >
            <Tooltip title={`${itemsCount} SKU · ${qtyTotal} đơn vị`}>
              <Chip
                icon={<Iconify icon="solar:box-minimalistic-linear" width={11} />}
                label={`${itemsCount} SKU`}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: 10.5, fontWeight: 600, '& .MuiChip-icon': { color: 'text.disabled' } }}
              />
            </Tooltip>
            {qtyTotal > 0 && (
              <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
                · {fmtNumber(qtyTotal)} đơn vị
              </Typography>
            )}
            <Box sx={{ flex: 1 }} />
            <Tooltip title={transfer.actor_name ?? '—'}>
              <Stack direction="row" alignItems="center" spacing={0.4}>
                <Iconify icon="solar:user-linear" width={11} sx={{ color: 'text.disabled' }} />
                <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }} noWrap>
                  {transfer.actor_name ?? '—'}
                </Typography>
              </Stack>
            </Tooltip>
          </Stack>

          {/* Note slot — luôn reserve 2 dòng để card đều, nếu trống thì em-dash mờ */}
          <Box sx={{ px: 2, pb: 1.5, pt: 0.25 }}>
            <Typography sx={{
              fontSize: 11,
              color: transfer.note ? 'text.secondary' : 'text.disabled',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              fontStyle: transfer.note ? 'italic' : 'normal',
              minHeight: 32,
            }}>
              {transfer.note ? `“${transfer.note}”` : '— Không có ghi chú'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </m.div>
  );
}

// ---------- Main ----------

export function InventoryTransfersView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [open, setOpen] = useState(false);

  const { searchResults: rows, searchLoading: loading, metaTotal } = useGetInventoryTransfers({
    perPage: 200,
  });

  const counts = useMemo(() => {
    const c = { all: rows.length, draft: 0, in_transit: 0, received: 0, canceled: 0 };
    rows.forEach((r) => { c[r.status] = (c[r.status] ?? 0) + 1; });
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (r.from_store_name ?? '').toLowerCase().includes(q) ||
        (r.to_store_name ?? '').toLowerCase().includes(q) ||
        (r.note ?? '').toLowerCase().includes(q) ||
        (r._id ?? '').toLowerCase().includes(q)
      );
    });
  }, [rows, search, statusFilter]);

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Phiếu chuyển kho"
        subtitle={`${metaTotal} phiếu · ${counts.in_transit} đang chuyển · ${counts.draft} nháp chờ gửi`}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Tồn kho' },
          { label: 'Nhập · Xuất · Chuyển' },
        ]}
        actions={
          <Button
            size="small" variant="contained"
            startIcon={<AddCircleOutlined sx={{ fontSize: 16 }} />}
            onClick={() => setOpen(true)}
            sx={{
              boxShadow: 'none',
              bgcolor: '#1E293B', color: 'common.white',
              '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
            }}
          >
            Tạo phiếu chuyển
          </Button>
        }
      />

      {/* KPI row — edge-to-edge, 4 cột, border mờ qua CSS shorthand */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        bgcolor: 'background.paper',
        borderTop: '1px solid rgba(145, 158, 171, 0.08)',
        borderBottom: '1px solid rgba(145, 158, 171, 0.08)',
      }}>
        {[
          { label: 'Tổng phiếu',  value: counts.all,        icon: 'solar:document-linear',        color: '#64748B' },
          { label: 'Đang chuyển', value: counts.in_transit, icon: 'solar:delivery-linear',        color: '#D97706' },
          { label: 'Đã nhận',     value: counts.received,   icon: 'solar:check-circle-linear',    color: '#059669' },
          { label: 'Nháp',        value: counts.draft,      icon: 'solar:document-add-linear',    color: '#2563EB' },
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
                {fmtNumber(s.value)}
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
          placeholder="Tìm mã phiếu, store, ghi chú…"
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              minWidth: 180,
              defaultValue: 'all',
              options: [
                { value: 'all', label: `Tất cả trạng thái (${counts.all})` },
                ...CONST_TRANSFER_STATUS.map((s) => ({
                  value: s.id,
                  label: `${statusMeta(s.id).label} (${counts[s.id] ?? 0})`,
                })),
              ],
            },
          ]}
          onReset={
            (statusFilter !== 'all' || search)
              ? () => { setStatusFilter('all'); setSearch(''); }
              : undefined
          }
          extra={
            <Typography sx={{ fontSize: 11.5, color: 'text.disabled', ml: 1 }}>
              {filtered.length}/{rows.length} phiếu
            </Typography>
          }
        />
      </Box>

      {/* Grid cards — padding riêng, không ảnh hưởng KPI / toolbar */}
      <Box sx={{ px: { xs: 2, md: 2.5 }, py: 2 }}>
        {loading ? (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 8, color: 'text.disabled' }}>
            <Iconify icon="solar:refresh-linear" width={28} />
            <Typography sx={{ fontSize: 12.5 }}>Đang tải phiếu chuyển…</Typography>
          </Stack>
        ) : filtered.length === 0 ? (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 8, color: 'text.disabled' }}>
            <Iconify icon="solar:box-minimalistic-linear" width={32} />
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.secondary' }}>
              Không có phiếu chuyển nào
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
              Thử đổi bộ lọc hoặc tạo phiếu mới ở góc phải trên
            </Typography>
          </Stack>
        ) : (
          <m.div variants={staggerContainer(0.04, 0.02)} initial="hidden" animate="show">
            <Grid container spacing={1.5}>
              {filtered.map((t) => (
                <Grid key={t._id ?? t.id} size={{ xs: 12, md: 6, lg: 4 }}>
                  <TransferCard transfer={t} onClick={() => {/* open detail — tạm chưa có */}} />
                </Grid>
              ))}
            </Grid>
          </m.div>
        )}
      </Box>

      <InventoryTransferDrawer open={open} onClose={() => setOpen(false)} />
    </DashboardContent>
  );
}
