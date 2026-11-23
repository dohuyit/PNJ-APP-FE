// src/views/admin/collection/collection-list-view.jsx
// Bộ sưu tập — layout pattern chuẩn: KPI row + FilterBar + DataTable.

'use client';

import { useMemo, useState } from 'react';

import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import CollectionsOutlined from '@mui/icons-material/CollectionsOutlined';
import NewReleasesOutlined from '@mui/icons-material/NewReleasesOutlined';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import {
  Avatar, Box, Button, Grid, LinearProgress, Stack, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtDate, fmtRelative, fmtNumber } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { KpiCard } from 'src/views/admin/_shared/kpi-card';
import { useGetCollectionList } from 'src/actions/admin/collection';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';
import { StatusBadge } from 'src/components/common/status-badge';

import { CollectionFormDrawer } from './collection-create-drawer';
import { mockBrands } from 'src/mock-data';

const brandsList = mockBrands;


const BRAND_OPTS = [
  { value: 'all', label: 'Mọi thương hiệu', icon: 'solar:layers-minimalistic-linear' },
  ...brandsList.map((b) => ({ value: b.slug, label: b.name, icon: 'solar:tag-linear' })),
];

const STATUS_OPTS = [
  { value: 'all',      label: 'Mọi trạng thái', icon: 'solar:layers-minimalistic-linear' },
  { value: 'active',   label: 'Đang hoạt động', dot: 'success.main' },
  { value: 'inactive', label: 'Đã ẩn',          dot: 'text.disabled' },
];

const BADGE_OPTS = [
  { value: 'all',     label: 'Mọi nhãn',     icon: 'solar:layers-minimalistic-linear' },
  { value: 'wedding', label: 'BST Cưới',     icon: 'solar:heart-bold' },
  { value: 'new',     label: 'Mới ra mắt',   icon: 'solar:verified-check-bold' },
  { value: 'none',    label: 'Không nhãn',   dot: 'text.disabled' },
];

const TIME_OPTS = [
  { value: 'all',  label: 'Mọi thời gian', icon: 'solar:infinity-linear' },
  { value: '30d',  label: 'Ra mắt 30 ngày', icon: 'solar:sun-linear' },
  { value: '90d',  label: 'Ra mắt 90 ngày', icon: 'solar:calendar-linear' },
  { value: 'year', label: 'Trong năm',      icon: 'solar:calendar-mark-linear' },
];

export function CollectionCreateButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small" variant="contained"
        startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
        onClick={() => setOpen(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Thêm BST
      </Button>
      <CollectionFormDrawer open={open} onClose={() => setOpen(false)} onSubmit={(v) => console.log('create collection', v)} />
    </>
  );
}

export function CollectionListView({ embedded = false } = {}) {
  const { searchResults: collectionsList, searchLoading: collectionsLoading } = useGetCollectionList();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('all');
  const [status, setStatus] = useState('all');
  const [badge, setBadge] = useState('all');
  const [timeRange, setTime] = useState('all');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });

  const kpi = useMemo(() => {
    const total      = collectionsList.length;
    const wedding    = collectionsList.filter((c) => c.is_wedding).length;
    const fresh      = collectionsList.filter((c) => c.is_new_badge).length;
    const totalSP    = collectionsList.reduce((s, c) => s + (c.product_count ?? 0), 0);
    return { total, wedding, fresh, totalSP };
  }, [collectionsList]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return collectionsList.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q) && !c.slug.toLowerCase().includes(q)) return false;
      if (brand  !== 'all' && c.brand?.slug !== brand)  return false;
      if (status !== 'all' && c.status      !== status) return false;
      if (badge === 'wedding' && !c.is_wedding)  return false;
      if (badge === 'new'     && !c.is_new_badge) return false;
      if (badge === 'none'    && (c.is_wedding || c.is_new_badge)) return false;
      if (timeRange !== 'all') {
        const DAY = 86_400_000;
        const span = { '30d': 30*DAY, '90d': 90*DAY, 'year': 365*DAY }[timeRange];
        if (Date.now() - new Date(c.launch_date).getTime() > span) return false;
      }
      return true;
    });
  }, [collectionsList, search, brand, status, badge, timeRange]);

  const hasFilter = search || brand !== 'all' || status !== 'all' || badge !== 'all' || timeRange !== 'all';
  const resetFilters = () => { setSearch(''); setBrand('all'); setStatus('all'); setBadge('all'); setTime('all'); };

  const columns = [
    {
      field: 'name', headerName: 'Bộ sưu tập', width: 260,
      renderCell: (p) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={p.row.cover ?? '-'}
            variant="rounded"
            sx={{
              width: 72, height: 44,
              bgcolor: 'grey.50', border: 1, borderColor: 'grey.200',
              flexShrink: 0,
            }}
          >
            <Iconify icon="solar:gallery-linear" width={18} sx={{ color: 'text.disabled' }} />
          </Avatar>
          <Stack sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13.5 }} noWrap>
              {p.row.name ?? '-'}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Iconify icon="solar:tag-linear" width={11} sx={{ color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                {p.row.brand?.name ?? '—'}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>·</Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, fontFamily: 'monospace' }}>
                /{p.row.slug ?? '-'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      ),
    },
    {
      field: 'launch_date', headerName: 'Ra mắt', width: 160,
      renderCell: (p) => (
        <Stack>
          <Typography variant="caption" sx={{ fontSize: 11.5, fontWeight: 600 }}>
            {fmtDate(p.row.launch_date)}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
            {fmtRelative(p.row.launch_date)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'product_count', headerName: 'Danh mục SP', width: 220,
      renderCell: (p) => {
        const n = p.row.product_count ?? 0;
        const maxCount = Math.max(...collectionsList.map((c) => c.product_count ?? 0), 1);
        const pct = (n / maxCount) * 100;
        const [bucket, color] = n > 50 ? ['Lớn', '#7C3AED'] : n > 30 ? ['Vừa', '#2563EB'] : ['Nhỏ', '#64748B'];
        return (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
            <Stack direction="row" alignItems="baseline" spacing={0.375} sx={{ minWidth: 70 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, fontFamily: 'monospace', color: 'text.primary' }}>
                {fmtNumber(n)}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
                SP
              </Typography>
            </Stack>
            <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.375}>
              <Box
                component="span"
                sx={{
                  display: 'inline-block', width: 'fit-content',
                  px: 0.75, py: 0.125, borderRadius: 0.5,
                  bgcolor: color + '14', color,
                  fontSize: 10, fontWeight: 700, lineHeight: 1.4,
                }}
              >
                {bucket}
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 4, borderRadius: 2,
                  bgcolor: 'grey.100',
                  '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 2 },
                }}
              />
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: 'badges', headerName: 'Nhãn', width: 180, sortable: false,
      renderCell: (p) => {
        const badges = [];
        if (p.row.is_wedding)   badges.push({ label: 'BST Cưới',  icon: 'solar:heart-bold',          color: '#DB2777' });
        if (p.row.is_new_badge) badges.push({ label: 'NEW',       icon: 'solar:verified-check-bold', color: '#DC2626' });
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
            { label: 'Sửa BST',   icon: 'solar:pen-linear',       onClick: () => setEditing(p.row) },
            { label: 'Xem SP',    icon: 'solar:box-linear',       onClick: () => alert('SP của ' + p.row.name) },
            { label: 'Copy slug', icon: 'solar:copy-linear',      onClick: () => navigator.clipboard?.writeText(p.row.slug) },
            { divider: true },
            { label: 'Xoá',       icon: 'solar:trash-bin-trash-linear', color: 'error', disabled: (p.row.product_count ?? 0) > 0, onClick: () => alert('Xoá ' + p.row.name) },
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
          <KpiCard index={0} icon={CollectionsOutlined}    label="Tổng BST"       value={fmtNumber(kpi.total)}   color="primary" helperText="Theo mùa, chủ đề, cưới…" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={1} icon={FavoriteBorderOutlined} label="BST Cưới"       value={fmtNumber(kpi.wedding)} color="error"   helperText="Dòng SP cho ngày trọng đại" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={2} icon={NewReleasesOutlined}    label="BST mới"        value={fmtNumber(kpi.fresh)}   color="warning" helperText="Có nhãn NEW đang gắn" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={3} icon={Inventory2Outlined}     label="Tổng danh mục SP" value={fmtNumber(kpi.totalSP)} color="success" helperText="SP trong tất cả BST" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        loading={collectionsLoading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}
        emptyText={hasFilter ? 'Không có kết quả — thử xoá bớt lọc' : 'Chưa có bộ sưu tập'}
        emptyIcon="solar:gallery-linear"
        toolbar={
          <FilterBar
            searchValue={search} onSearch={setSearch}
            placeholder="Tìm theo tên BST / slug…"
            filters={[
              { value: brand,     onChange: setBrand,  options: BRAND_OPTS,  minWidth: 180 },
              { value: status,    onChange: setStatus, options: STATUS_OPTS, minWidth: 170 },
              { value: badge,     onChange: setBadge,  options: BADGE_OPTS,  minWidth: 160 },
              { value: timeRange, onChange: setTime,   options: TIME_OPTS,   minWidth: 170 },
            ]}
            onReset={hasFilter ? resetFilters : undefined}
          />
        }
      />

      <CollectionFormDrawer open={!!editing} initial={editing} onClose={() => setEditing(null)} onSubmit={(v) => console.log('update collection', v)} />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Bộ sưu tập"
        subtitle={`${collectionsList.length} BST · gồm BST cưới, BST theo chủ đề, BST theo mùa`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Bộ sưu tập' }]}
        actions={<CollectionCreateButton />}
      />
      {body}
    </DashboardContent>
  );
}
