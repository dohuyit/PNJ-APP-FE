// src/views/admin/coupon/coupon-list-view.jsx
// Mã giảm giá — accordion list, expand để xem lịch sử dùng mã.

'use client';

import { useMemo, useState } from 'react';

import PaidOutlined from '@mui/icons-material/PaidOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined';
import {
  Avatar, Box, Button, Collapse, Grid, IconButton, InputAdornment, LinearProgress, Stack, TextField, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtNumber, fmtRelative, fmtDate } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { KpiCard } from 'src/views/admin/_shared/kpi-card';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';

import { Iconify } from 'src/components/iconify';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';

import { CouponFormDrawer } from './coupon-create-drawer';
import { mockCoupons, mockCouponUsages } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const couponUsagesList = mockCouponUsages;
const couponsList = mockCoupons;
// Avatar gradient palette — đồng bộ cross-view
const AVATAR_GRADIENTS = [
  ['#818CF8', '#4F46E5'], ['#F87171', '#DC2626'], ['#34D399', '#059669'],
  ['#FBBF24', '#D97706'], ['#A78BFA', '#7C3AED'], ['#38BDF8', '#0284C7'],
];
const hashStr = (s = '') => Array.from(s).reduce((a, c) => a + c.charCodeAt(0), 0);
const gradientOf = (n) => AVATAR_GRADIENTS[hashStr(n) % AVATAR_GRADIENTS.length];
const initialsOf = (n = '') =>
  n.trim().split(/\s+/).slice(-2).map((w) => w[0] ?? '').join('').toUpperCase() || '??';

const TYPE_OPTS = [
  { value: 'all',      label: 'Mọi loại',   icon: 'solar:layers-minimalistic-linear' },
  { value: 'public',   label: 'Công khai',  dot: 'success.main' },
  { value: 'personal', label: 'Cá nhân',    dot: 'warning.main' },
];

const STATUS_OPTS = [
  { value: 'all',      label: 'Mọi trạng thái', icon: 'solar:layers-minimalistic-linear' },
  { value: 'active',   label: 'Đang hoạt động', dot: 'success.main' },
  { value: 'inactive', label: 'Đã ẩn',          dot: 'text.disabled' },
];

const LISTED_OPTS = [
  { value: 'all', label: 'Mọi hiển thị',  icon: 'solar:layers-minimalistic-linear' },
  { value: 'yes', label: 'Hiện ở "Chọn ưu đãi"', dot: 'primary.main' },
  { value: 'no',  label: 'Không hiện',    dot: 'text.disabled' },
];

export function CouponCreateButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small" variant="contained"
        startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
        onClick={() => setOpen(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Tạo mã giảm giá
      </Button>
      <CouponFormDrawer open={open} onClose={() => setOpen(false)} onSubmit={(v) => console.log('create coupon', v)} />
    </>
  );
}

// ─────────────────────────────────── Usage row (bên trong accordion)

function UsageRow({ usage }) {
  const [g0, g1] = gradientOf(usage.customer_name);
  const cancelled = usage.status === 'cancelled';
  return (
    <Stack
      direction="row" alignItems="center" spacing={1.5}
      sx={{
        px: 2, py: 1.25,
        borderTop: 1, borderColor: 'grey.100',
        '&:hover': { bgcolor: 'grey.50' },
      }}
    >
      <Avatar
        sx={{
          width: 32, height: 32,
          background: `linear-gradient(135deg, ${g0}, ${g1})`,
          color: 'common.white', fontWeight: 700, fontSize: 11,
          flexShrink: 0,
        }}
      >
        {initialsOf(usage.customer_name)}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 500 }} noWrap>
          {usage.customer_name}
        </Typography>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Iconify icon="solar:bag-4-linear" width={11} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: 10.5 }}>
            {usage.order_no}
          </Typography>
        </Stack>
      </Box>
      <Stack alignItems="flex-end" sx={{ minWidth: 100 }}>
        <Typography sx={{ fontSize: 12, color: cancelled ? 'text.disabled' : 'success.main', fontWeight: 600, fontFamily: 'monospace', textDecoration: cancelled ? 'line-through' : 'none' }}>
          − {fmtVND(usage.discount_amount)}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
          Đơn {fmtVND(usage.order_total)}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: 110 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: cancelled ? 'error.main' : 'success.main' }} />
        <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 500 }}>
          {cancelled ? 'Đã huỷ' : 'Áp dụng'}
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, minWidth: 90, textAlign: 'right' }}>
        {fmtRelative(usage.used_at)}
      </Typography>
    </Stack>
  );
}

// ─────────────────────────────────── Usage panel — search, filter, paginate

const PAGE_SIZE_USAGE = 8;

function UsagePanel({ usages, couponCode }) {
  const [q, setQ] = useState('');
  const [statusF, setStatusF] = useState('all'); // all | applied | cancelled
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return usages.filter((u) => {
      if (statusF !== 'all' && u.status !== statusF) return false;
      if (qq && !u.customer_name.toLowerCase().includes(qq) && !u.order_no.toLowerCase().includes(qq)) return false;
      return true;
    });
  }, [usages, q, statusF]);

  const totalApplied   = usages.filter((u) => u.status === 'applied').length;
  const totalCancelled = usages.length - totalApplied;
  const totalDisc      = usages.filter((u) => u.status === 'applied').reduce((s, u) => s + u.discount_amount, 0);

  const pageCount = Math.max(Math.ceil(filtered.length / PAGE_SIZE_USAGE), 1);
  const start = page * PAGE_SIZE_USAGE;
  const paged = filtered.slice(start, start + PAGE_SIZE_USAGE);

  if (usages.length === 0) {
    return (
      <Stack alignItems="center" spacing={1} sx={{ py: 3, color: 'text.disabled' }}>
        <Iconify icon="solar:ticket-sale-linear" width={24} />
        <Typography variant="caption">Mã này chưa được khách hàng sử dụng</Typography>
      </Stack>
    );
  }

  const chipSx = (active, dot) => ({
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    px: 1, py: 0.375, borderRadius: '6px',
    bgcolor: active ? 'background.paper' : 'transparent',
    border: 1, borderColor: active ? dot : 'grey.300',
    color: active ? dot : 'text.secondary',
    fontSize: 11.5, fontWeight: 600,
    cursor: 'pointer', userSelect: 'none',
    transition: 'all .15s',
    '&:hover': { borderColor: dot, color: dot },
  });

  return (
    <Box>
      {/* Panel header — summary + search + status chip */}
      <Box sx={{ px: 2, py: 1.25 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ md: 'center' }}
          spacing={1}
        >
          {/* Title with totals */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
            <Iconify icon="solar:history-linear" width={14} sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.3, textTransform: 'uppercase' }}>
              Lịch sử dùng {couponCode}
            </Typography>
            <Box
              component="span"
              sx={{
                display: 'inline-flex', alignItems: 'center',
                px: 0.75, py: 0.125, borderRadius: '6px',
                bgcolor: 'grey.200', color: 'text.primary',
                fontSize: 10.5, fontWeight: 700, fontFamily: 'monospace',
              }}
            >
              {usages.length}
            </Box>
          </Stack>

          <Box sx={{ flex: 1 }} />

          {/* Mini filter chips */}
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box component="span" onClick={() => { setStatusF('all'); setPage(0); }} sx={chipSx(statusF === 'all', '#64748B')}>
              Tất cả · {usages.length}
            </Box>
            <Box component="span" onClick={() => { setStatusF('applied'); setPage(0); }} sx={chipSx(statusF === 'applied', '#16A34A')}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
              Áp dụng · {totalApplied}
            </Box>
            <Box component="span" onClick={() => { setStatusF('cancelled'); setPage(0); }} sx={chipSx(statusF === 'cancelled', '#DC2626')}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main' }} />
              Đã huỷ · {totalCancelled}
            </Box>
          </Stack>

          {/* Search */}
          <TextField
            size="small" placeholder="Tìm khách / mã đơn…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
            sx={{
              width: { xs: '100%', md: 220 },
              '& .MuiInputBase-root': {
                height: 32, borderRadius: '6px', fontSize: 12,
                bgcolor: 'background.paper',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.300' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'text.disabled' },
              },
              '& .MuiInputBase-input': { py: 0, fontSize: 12 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-linear" width={13} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: q ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => { setQ(''); setPage(0); }} sx={{ p: 0.25 }}>
                    <Iconify icon="solar:close-circle-linear" width={12} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
        </Stack>
      </Box>

      {/* Table header */}
      <Stack
        direction="row" spacing={1.5}
        sx={{
          px: 2, py: 0.75,
          borderTop: 1, borderBottom: 1, borderColor: 'grey.100',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ width: 32, flexShrink: 0 }} />
        <Typography variant="caption" sx={{ flex: 1, fontSize: 10, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
          Khách · Đơn
        </Typography>
        <Typography variant="caption" sx={{ minWidth: 100, textAlign: 'right', fontSize: 10, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
          Giảm
        </Typography>
        <Typography variant="caption" sx={{ minWidth: 110, fontSize: 10, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
          Trạng thái
        </Typography>
        <Typography variant="caption" sx={{ minWidth: 90, textAlign: 'right', fontSize: 10, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
          Thời gian
        </Typography>
      </Stack>

      {/* Rows */}
      <Box sx={{ bgcolor: 'background.paper' }}>
        {paged.length === 0 ? (
          <Stack alignItems="center" spacing={1} sx={{ py: 4, color: 'text.disabled' }}>
            <Iconify icon="solar:magnifer-zoom-out-linear" width={22} />
            <Typography variant="caption">Không tìm thấy lượt dùng phù hợp</Typography>
          </Stack>
        ) : (
          paged.map((u) => <UsageRow key={u.id} usage={u} />)
        )}
      </Box>

      {/* Footer: total + pagination */}
      <Stack
        direction="row" alignItems="center" spacing={1.5}
        sx={{
          px: 2, py: 1,
          borderTop: 1, borderColor: 'grey.100',
          bgcolor: 'grey.50',
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
          Tổng đã giảm:
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: 'success.dark' }}>
          − {fmtVND(totalDisc)}
        </Typography>
        <Box sx={{ flex: 1 }} />
        {filtered.length > PAGE_SIZE_USAGE && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, fontFamily: 'monospace' }}>
              {start + 1}–{Math.min(start + PAGE_SIZE_USAGE, filtered.length)} / {filtered.length}
            </Typography>
            <IconButton size="small" disabled={page === 0} onClick={() => setPage((p) => Math.max(p - 1, 0))} sx={{ width: 24, height: 24 }}>
              <Iconify icon="solar:alt-arrow-left-linear" width={12} />
            </IconButton>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 11, minWidth: 32, textAlign: 'center' }}>
              {page + 1}/{pageCount}
            </Typography>
            <IconButton size="small" disabled={page >= pageCount - 1} onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))} sx={{ width: 24, height: 24 }}>
              <Iconify icon="solar:alt-arrow-right-linear" width={12} />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

// ─────────────────────────────────── Coupon card (accordion)

function CouponAccordion({ coupon, usages, expanded, onToggle, onEdit }) {
  const usagePct = Math.min((coupon.used_count / Math.max(coupon.usage_limit_total, 1)) * 100, 100);
  const isPersonal = coupon.type === 'personal';
  const daysLeft = Math.ceil((new Date(coupon.end_at) - Date.now()) / 86_400_000);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1, borderColor: expanded ? 'primary.light' : 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        transition: 'border-color .15s',
      }}
    >
      {/* Summary row */}
      <Stack
        direction="row" alignItems="center" spacing={1.5}
        onClick={onToggle}
        sx={{
          px: 2, py: 1.5,
          cursor: 'pointer',
          bgcolor: expanded ? 'grey.50' : 'transparent',
          transition: 'background-color .15s',
          '&:hover': { bgcolor: expanded ? 'grey.100' : 'grey.50' },
        }}
      >
        {/* Toggle icon */}
        <IconButton size="small" sx={{ p: 0.25, color: 'text.secondary' }}>
          <Iconify
            icon="solar:alt-arrow-right-linear"
            width={14}
            sx={{ transition: 'transform .2s', transform: expanded ? 'rotate(90deg)' : 'none' }}
          />
        </IconButton>

        {/* Icon + code */}
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 220, flexShrink: 0 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 1,
            bgcolor: isPersonal ? 'warning.lighter' : 'success.lighter',
            color: isPersonal ? 'warning.dark' : 'success.dark',
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Iconify icon="solar:ticket-linear" width={18} />
          </Box>
          <Stack sx={{ minWidth: 0 }}>
            <Typography sx={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, letterSpacing: 0.5, color: 'text.primary' }} noWrap>
              {coupon.code}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: isPersonal ? 'warning.main' : 'success.main', flexShrink: 0 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10.5 }}>
                {isPersonal ? 'Cá nhân' : 'Công khai'}
              </Typography>
              {coupon.is_listed && (
                <>
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>·</Typography>
                  <Typography variant="caption" color="primary.main" sx={{ fontSize: 10.5, fontWeight: 500 }}>
                    Hiện ưu đãi
                  </Typography>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>

        {/* Promotion name */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', display: 'block' }}>
            Thuộc chương trình
          </Typography>
          <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: 'text.primary' }} noWrap>
            {coupon.promotion_name}
          </Typography>
        </Box>

        {/* Usage progress */}
        <Box sx={{ minWidth: 170 }}>
          <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mb: 0.375 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace', color: 'text.primary' }}>
              {fmtNumber(coupon.used_count)}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
              / {fmtNumber(coupon.usage_limit_total)} đã dùng
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={usagePct}
            sx={{
              height: 4, borderRadius: 2,
              bgcolor: 'grey.100',
              '& .MuiLinearProgress-bar': {
                bgcolor: usagePct > 80 ? 'warning.main' : 'success.main',
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Expiry */}
        <Stack sx={{ minWidth: 120 }} alignItems="flex-start">
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>
            Hết hạn
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.primary', fontWeight: 500 }}>
            {fmtDate(coupon.end_at)}
          </Typography>
          {daysLeft > 0 && daysLeft < 15 && (
            <Typography variant="caption" sx={{ fontSize: 10, color: 'warning.dark' }}>
              Còn {daysLeft} ngày
            </Typography>
          )}
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={0.25} onClick={(e) => e.stopPropagation()}>
          <IconButton size="small" onClick={() => onEdit(coupon)}>
            <Iconify icon="solar:pen-linear" width={14} />
          </IconButton>
          <RowActionsMenu
            items={[
              { label: 'Copy mã',   icon: 'solar:copy-linear',    onClick: () => navigator.clipboard?.writeText(coupon.code) },
              { label: 'Nhân bản',  icon: 'solar:copy-linear',    onClick: () => alert('Clone ' + coupon.code) },
              { label: 'Xuất CSV lịch sử', icon: 'solar:download-linear', onClick: () => alert('Export ' + coupon.code) },
              { divider: true },
              { label: 'Ngưng dùng', icon: 'solar:pause-circle-linear', color: 'warning', onClick: () => alert('Pause ' + coupon.code) },
              { label: 'Xoá',       icon: 'solar:trash-bin-trash-linear', color: 'error', disabled: coupon.used_count > 0, onClick: () => alert('Xoá ' + coupon.code) },
            ]}
          />
        </Stack>
      </Stack>

      {/* Expanded content — lịch sử dùng */}
      <Collapse in={expanded} timeout={250}>
        {expanded && (
          <Box sx={{ borderTop: 1, borderColor: 'grey.100', bgcolor: 'grey.50' }}>
            <UsagePanel usages={usages} couponCode={coupon.code} />
          </Box>
        )}
      </Collapse>
    </Box>
  );
}

// ─────────────────────────────────── Main view

export function CouponListView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [listed, setListed] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  // Group usages by coupon code
  const usagesByCode = useMemo(() => {
    const map = {};
    couponUsagesList.forEach((u) => {
      if (!map[u.coupon_code]) map[u.coupon_code] = [];
      map[u.coupon_code].push(u);
    });
    return map;
  }, []);

  const kpi = useMemo(() => {
    const total      = couponsList.length;
    const totalUse   = couponUsagesList.filter((u) => u.status === 'applied').length;
    const totalDisc  = couponUsagesList.filter((u) => u.status === 'applied').reduce((s, u) => s + u.discount_amount, 0);
    const totalOrders = couponUsagesList.filter((u) => u.status === 'applied').reduce((s, u) => s + u.order_total, 0);
    return { total, totalUse, totalDisc, totalOrders };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return couponsList.filter((c) => {
      if (q && !c.code.toLowerCase().includes(q) && !c.promotion_name.toLowerCase().includes(q)) return false;
      if (type   !== 'all' && c.type   !== type)   return false;
      if (status !== 'all' && c.status !== status) return false;
      if (listed === 'yes' && !c.is_listed) return false;
      if (listed === 'no'  && c.is_listed)  return false;
      return true;
    });
  }, [search, type, status, listed]);

  const hasFilter = search || type !== 'all' || status !== 'all' || listed !== 'all';
  const resetFilters = () => { setSearch(''); setType('all'); setStatus('all'); setListed('all'); };

  const body = (
    <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
      {/* KPI */}
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={0} icon={ConfirmationNumberOutlined} label="Tổng mã" value={fmtNumber(kpi.total)}      color="primary" helperText="Public + cá nhân" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={1} icon={CheckCircleOutlined}       label="Lượt đã dùng" value={fmtNumber(kpi.totalUse)}  color="success" helperText="Khách đã áp mã thành công" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={2} icon={PaidOutlined}              label="Tổng giảm" value={fmtVND(kpi.totalDisc)}     color="warning" valueSize={24} helperText="Giá trị khách được giảm" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={3} icon={ReceiptLongOutlined}       label="GMV có mã" value={fmtVND(kpi.totalOrders)}   color="info"    valueSize={24} helperText="Doanh thu đơn có mã" />
        </Grid>
      </Grid>

      {/* Toolbar */}
      <Box sx={{ px: { xs: 2, md: 2.5 }, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <FilterBar
          searchValue={search}
          onSearch={setSearch}
          placeholder="Tìm mã / chương trình…"
          filters={[
            { value: type,   onChange: setType,   options: TYPE_OPTS,   minWidth: 160 },
            { value: status, onChange: setStatus, options: STATUS_OPTS, minWidth: 170 },
            { value: listed, onChange: setListed, options: LISTED_OPTS, minWidth: 180 },
          ]}
          onReset={hasFilter ? resetFilters : undefined}
        />
      </Box>

      {/* Accordion list */}
      <Box sx={{ p: { xs: 1.5, md: 2 } }}>
        {filtered.length === 0 ? (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 8, color: 'text.disabled' }}>
            <Iconify icon="solar:ticket-sale-linear" width={32} />
            <Typography variant="body2">Không có mã giảm giá khớp bộ lọc</Typography>
          </Stack>
        ) : (
          <Stack spacing={1}>
            {filtered.map((coupon) => (
              <CouponAccordion
                key={coupon.id}
                coupon={coupon}
                usages={usagesByCode[coupon.code] ?? []}
                expanded={expandedId === coupon.id}
                onToggle={() => setExpandedId((id) => (id === coupon.id ? null : coupon.id))}
                onEdit={setEditing}
              />
            ))}
          </Stack>
        )}
      </Box>

      <CouponFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update coupon', v)}
      />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Mã giảm giá"
        subtitle={`${couponsList.length} mã · public / personal · ${couponUsagesList.length} lượt đã dùng`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Mã giảm giá' }]}
        actions={<CouponCreateButton />}
      />
      {body}
    </DashboardContent>
  );
}
