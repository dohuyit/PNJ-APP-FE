// src/views/admin/brand/brand-list-view.jsx
// Thương hiệu — layout pattern chuẩn: KPI row + FilterBar + DataTable.

'use client';

import { useMemo, useState } from 'react';

import HandshakeOutlined from '@mui/icons-material/HandshakeOutlined';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import {
  Avatar, Box, Button, Grid, LinearProgress, Stack, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtNumber } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetBrandList } from 'src/actions/admin/brand';
import { KpiCard } from 'src/views/admin/_shared/kpi-card';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';
import { StatusBadge } from 'src/components/common/status-badge';

import { BrandFormDrawer } from './brand-create-form';


// ------------ Meta: nhóm thương hiệu — icon + hex color
const GROUP_META = {
  product:     { label: 'SP riêng',       icon: 'solar:box-linear',             color: '#2563EB' },
  retail:      { label: 'Chuỗi bán lẻ',    icon: 'solar:shop-linear',            color: '#0891B2' },
  partnership: { label: 'Hợp tác',         icon: 'solar:hand-shake-linear',      color: '#D97706' },
  watch_maker: { label: 'Hãng đồng hồ',    icon: 'solar:clock-circle-linear',    color: '#7C3AED' },
};

const GROUP_OPTS = [
  { value: 'all',         label: 'Mọi nhóm',       icon: 'solar:layers-minimalistic-linear' },
  { value: 'product',     label: 'SP riêng',       icon: 'solar:box-linear' },
  { value: 'retail',      label: 'Chuỗi bán lẻ',   icon: 'solar:shop-linear' },
  { value: 'partnership', label: 'Hợp tác',        icon: 'solar:hand-shake-linear' },
  { value: 'watch_maker', label: 'Hãng đồng hồ',   icon: 'solar:clock-circle-linear' },
];

const STATUS_OPTS = [
  { value: 'all',      label: 'Mọi trạng thái', icon: 'solar:layers-minimalistic-linear' },
  { value: 'active',   label: 'Đang hoạt động', dot: 'success.main' },
  { value: 'inactive', label: 'Đã ẩn',          dot: 'text.disabled' },
];

const BADGE_OPTS = [
  { value: 'all',       label: 'Mọi nhãn',   icon: 'solar:layers-minimalistic-linear' },
  { value: 'featured',  label: 'Nổi bật',    dot: 'warning.main' },
  { value: 'new',       label: 'Mới ra mắt', dot: 'error.main' },
  { value: 'none',      label: 'Không nhãn', dot: 'text.disabled' },
];

// Standalone create button + drawer — dùng ở PageHeader actions (standalone / hub).
export function BrandCreateButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small" variant="contained"
        startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
        onClick={() => setOpen(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Thêm thương hiệu
      </Button>
      <BrandFormDrawer open={open} onClose={() => setOpen(false)} onSubmit={(v) => console.log('create brand', v)} />
    </>
  );
}

export function BrandListView({ embedded = false } = {}) {
  const { searchResults: brandsList, searchLoading: brandsLoading } = useGetBrandList();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');
  const [status, setStatus] = useState('all');
  const [badge, setBadge] = useState('all');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });

  const kpi = useMemo(() => {
    const total      = brandsList.length;
    const ownProduct = brandsList.filter((b) => b.group === 'product').length;
    const partner    = brandsList.filter((b) => b.group === 'partnership' || b.group === 'watch_maker').length;
    const totalSP    = brandsList.reduce((s, b) => s + (b.product_count ?? 0), 0);
    return { total, ownProduct, partner, totalSP };
  }, [brandsList]);

  const maxCount = Math.max(...brandsList.map((b) => b.product_count ?? 0), 1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return brandsList.filter((b) => {
      if (q && !b.name.toLowerCase().includes(q) && !b.slug.toLowerCase().includes(q)) return false;
      if (group  !== 'all' && b.group  !== group)  return false;
      if (status !== 'all' && b.status !== status) return false;
      if (badge === 'featured' && !b.is_featured)  return false;
      if (badge === 'new'      && !b.is_new_badge) return false;
      if (badge === 'none'     && (b.is_featured || b.is_new_badge)) return false;
      return true;
    });
  }, [brandsList, search, group, status, badge]);

  const hasFilter = search || group !== 'all' || status !== 'all' || badge !== 'all';
  const resetFilters = () => { setSearch(''); setGroup('all'); setStatus('all'); setBadge('all'); };

  const columns = [
    {
      field: 'name', headerName: 'Thương hiệu', width: 240,
      renderCell: (p) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={p.row.logo ?? '-'}
            variant="rounded"
            sx={{
              width: 44, height: 44,
              bgcolor: 'grey.50', border: 1, borderColor: 'grey.200',
              flexShrink: 0,
            }}
          >
            <Iconify icon="solar:tag-linear" width={20} sx={{ color: 'text.disabled' }} />
          </Avatar>
          <Stack sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography sx={{ fontWeight: 700, fontSize: 13.5 }} noWrap>
                {p.row.name ?? '-'}
              </Typography>
              {p.row.origin && (
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center',
                  px: 0.5, py: 0.125, borderRadius: 0.5,
                  bgcolor: 'grey.100', color: 'text.secondary',
                  fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: 0.3,
                }}>
                  {p.row.origin ?? '-'}
                </Box>
              )}
            </Stack>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, fontFamily: 'monospace' }}>
              /{p.row.slug ?? '-'}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      field: 'group', headerName: 'Nhóm', width: 180,
      renderCell: (p) => {
        const m = GROUP_META[p.row.group] ?? GROUP_META.product;
        return (
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Box sx={{
              width: 26, height: 26, borderRadius: 1,
              bgcolor: m.color + '14', color: m.color,
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Iconify icon={m.icon} width={14} />
            </Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: m.color }}>
              {m.label}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: 'product_count', headerName: 'Danh mục SP', width: 230,
      renderCell: (p) => {
        const n = p.row.product_count ?? 0;
        const pct = (n / maxCount) * 100;
        return (
          <Stack sx={{ width: '100%' }} spacing={0.375}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'monospace' }}>
                {fmtNumber(n)}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
                {n > 1000 ? 'Đông' : n > 200 ? 'Vừa' : 'Ít'}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 4, borderRadius: 2,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  bgcolor: n > 1000 ? '#2563EB' : n > 200 ? '#0891B2' : '#64748B',
                  borderRadius: 2,
                },
              }}
            />
          </Stack>
        );
      },
    },
    {
      field: 'badges', headerName: 'Nhãn', width: 160, sortable: false,
      renderCell: (p) => {
        const badges = [];
        if (p.row.is_featured)  badges.push({ label: 'Nổi bật', icon: 'solar:star-bold',          color: '#D97706' });
        if (p.row.is_new_badge) badges.push({ label: 'NEW',     icon: 'solar:verified-check-bold', color: '#DC2626' });
        if (badges.length === 0) return <Typography variant="caption" color="text.disabled">—</Typography>;
        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
            {badges.map((b, i) => (
              <Box
                key={i}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  px: 0.75, py: 0.25, borderRadius: 0.75,
                  bgcolor: b.color + '14', color: b.color,
                  fontSize: 10.5, fontWeight: 700,
                }}
              >
                <Iconify icon={b.icon} width={11} />
                <span>{b.label}</span>
              </Box>
            ))}
          </Stack>
        );
      },
    },
    {
      field: 'status', headerName: 'Trạng thái', width: 140,
      renderCell: (p) => <StatusBadge status={p.row.status} colorMap={COMMON_STATUS_COLOR} labelMap={COMMON_STATUS_LABEL} />,
    },
    {
      field: 'sort', headerName: 'Thứ tự', width: 80, align: 'center', headerAlign: 'center',
      renderCell: (p) => (
        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: 11.5 }}>
          #{p.row.sort}
        </Typography>
      ),
    },
    {
      field: 'actions', headerName: '', width: 56, align: 'center', sortable: false,
      renderCell: (p) => (
        <RowActionsMenu
          items={[
            { label: 'Sửa thương hiệu', icon: 'solar:pen-linear',       onClick: () => setEditing(p.row) },
            { label: 'Xem SP',          icon: 'solar:box-linear',       onClick: () => alert('SP của ' + p.row.name) },
            { label: 'Copy slug',       icon: 'solar:copy-linear',      onClick: () => navigator.clipboard?.writeText(p.row.slug) },
            { divider: true },
            { label: 'Xoá',             icon: 'solar:trash-bin-trash-linear', color: 'error', disabled: (p.row.product_count ?? 0) > 0, onClick: () => alert('Xoá ' + p.row.name) },
          ]}
        />
      ),
    },
  ];

  const body = (
    <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
      {/* KPI row */}
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={0} icon={LocalOfferOutlined} label="Tổng thương hiệu" value={fmtNumber(kpi.total)}      color="primary" helperText="Brand sản phẩm, partner, watch maker" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={1} icon={StorefrontOutlined} label="SP riêng"         value={fmtNumber(kpi.ownProduct)} color="info"    helperText="Thương hiệu thuộc PNJ" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={2} icon={HandshakeOutlined}  label="Hợp tác"           value={fmtNumber(kpi.partner)}    color="warning" helperText="Partner, Hãng đồng hồ" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={3} icon={Inventory2Outlined} label="Tổng danh mục SP"  value={fmtNumber(kpi.totalSP)}    color="success" helperText="Số SP trên tất cả brand" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        loading={brandsLoading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}
        emptyText={hasFilter ? 'Không có kết quả — thử xoá bớt lọc' : 'Chưa có thương hiệu'}
        emptyIcon="solar:tag-linear"
        toolbar={
          <FilterBar
            searchValue={search} onSearch={setSearch}
            placeholder="Tìm theo tên / slug…"
            filters={[
              { value: group,  onChange: setGroup,  options: GROUP_OPTS,  minWidth: 180 },
              { value: status, onChange: setStatus, options: STATUS_OPTS, minWidth: 170 },
              { value: badge,  onChange: setBadge,  options: BADGE_OPTS,  minWidth: 160 },
            ]}
            onReset={hasFilter ? resetFilters : undefined}
          />
        }
      />

      <BrandFormDrawer open={!!editing} initial={editing} onClose={() => setEditing(null)} onSubmit={(v) => console.log('update brand', v)} />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Thương hiệu"
        subtitle={`${brandsList.length} thương hiệu · PNJ / STYLE / ARTA / Disney / Rado…`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Thương hiệu' }]}
        actions={<BrandCreateButton />}
      />
      {body}
    </DashboardContent>
  );
}
