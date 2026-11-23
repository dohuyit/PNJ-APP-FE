// src/views/admin/attribute/attribute-view.jsx
// Thuộc tính + Bộ thuộc tính — 2 tab, layout pattern chuẩn: KPI row + FilterBar + DataTable.

'use client';

import { useMemo, useState } from 'react';

import TuneOutlined from '@mui/icons-material/TuneOutlined';
import ScaleOutlined from '@mui/icons-material/ScaleOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import StraightenOutlined from '@mui/icons-material/StraightenOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import LibraryBooksOutlined from '@mui/icons-material/LibraryBooksOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import {
  Box, Button, Chip, Grid, LinearProgress, Stack, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtNumber } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { KpiCard } from 'src/views/admin/_shared/kpi-card';
import { useGetAttributeList } from 'src/actions/admin/attribute';
import { useGetAttributeSetList } from 'src/actions/admin/attribute';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';

import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';

import { AttributeFormDrawer } from './attribute-create-drawer';

export function AttributeCreateButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small" variant="contained"
        startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
        onClick={() => setOpen(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Thêm thuộc tính
      </Button>
      <AttributeFormDrawer open={open} onClose={() => setOpen(false)} onSubmit={(v) => console.log('create attribute', v)} />
    </>
  );
}
import { AttributeSetFormDrawer } from 'src/views/admin/attribute-set/attribute-set-create-form';


// -------------- Meta: kiểu nhập → icon + accent color (hex)
const INPUT_TYPE_META = {
  select:      { label: 'Chọn 1',        icon: 'solar:list-check-linear',              color: '#2563EB' },
  multiselect: { label: 'Chọn nhiều',    icon: 'solar:list-check-minimalistic-linear', color: '#7C3AED' },
  text:        { label: 'Text',          icon: 'solar:text-field-linear',              color: '#64748B' },
  number:      { label: 'Số nguyên',     icon: 'solar:hashtag-linear',                 color: '#0891B2' },
  decimal:     { label: 'Thập phân',     icon: 'solar:dot-linear',                     color: '#0891B2' },
  boolean:     { label: 'Có / Không',    icon: 'solar:check-square-linear',            color: '#D97706' },
};

const FILTER_DISPLAY_LABEL = { chip: 'Chip', color: 'Màu', range: 'Khoảng', check: 'Checkbox' };

const INPUT_TYPE_OPTS = [
  { value: 'all', label: 'Mọi kiểu nhập', icon: 'solar:layers-minimalistic-linear' },
  ...Object.entries(INPUT_TYPE_META).map(([v, m]) => ({ value: v, label: m.label, icon: m.icon })),
];

const USAGE_OPTS = [
  { value: 'all',     label: 'Mọi tình trạng', icon: 'solar:layers-minimalistic-linear' },
  { value: 'in_use',  label: 'Đang dùng',      dot: 'success.main' },
  { value: 'unused',  label: 'Chưa dùng',      dot: 'text.disabled' },
];

const ROLE_OPTS = [
  { value: 'all',               label: 'Mọi vai trò',    icon: 'solar:layers-minimalistic-linear' },
  { value: 'is_filterable',     label: 'Dùng để lọc',    icon: 'solar:filter-linear' },
  { value: 'is_variant_axis',   label: 'Trục biến thể',  icon: 'solar:ruler-cross-pen-linear' },
  { value: 'is_visible_on_detail', label: 'Bảng thông số', icon: 'solar:list-arrow-up-linear' },
];

const SIZE_OPTS = [
  { value: 'all',    label: 'Mọi quy mô',    icon: 'solar:layers-minimalistic-linear' },
  { value: 'small',  label: 'Nhỏ (≤5)',      icon: 'solar:box-minimalistic-linear' },
  { value: 'medium', label: 'Trung (6–10)',  icon: 'solar:box-linear' },
  { value: 'large',  label: 'Lớn (>10)',     icon: 'solar:box-bold' },
];

// --------------------------------------------------- Attribute tab

function AttributeTab() {
  const { searchResults: attributesList, searchLoading: attributesLoading } = useGetAttributeList();
  const [editing, setEditing]       = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch]         = useState('');
  const [inputType, setInputType]   = useState('all');
  const [usage, setUsage]           = useState('all');
  const [role, setRole]             = useState('all');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });

  const kpi = useMemo(() => {
    const total       = attributesList.length;
    const inUse       = attributesList.filter((a) => a.in_use).length;
    const filterable  = attributesList.filter((a) => a.is_filterable).length;
    const variantAxis = attributesList.filter((a) => a.is_variant_axis).length;
    return { total, inUse, filterable, variantAxis };
  }, [attributesList]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return attributesList.filter((a) => {
      if (q && !a.name.toLowerCase().includes(q) && !a.code.toLowerCase().includes(q)) return false;
      if (inputType !== 'all' && a.input_type !== inputType) return false;
      if (usage === 'in_use' && !a.in_use) return false;
      if (usage === 'unused' && a.in_use)  return false;
      if (role !== 'all' && !a[role])     return false;
      return true;
    });
  }, [attributesList, search, inputType, usage, role]);

  const resetFilters = () => { setSearch(''); setInputType('all'); setUsage('all'); setRole('all'); };
  const hasFilter = search || inputType !== 'all' || usage !== 'all' || role !== 'all';

  const columns = [
    {
      field: 'code', headerName: 'Code', width: 150,
      renderCell: (p) => (
        <Box sx={{
          display: 'inline-flex', alignItems: 'center',
          px: 1, py: 0.25, borderRadius: 0.75,
          bgcolor: 'grey.100', border: 1, borderColor: 'grey.200',
          fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: 'text.primary',
        }}>
          {p.row.code}
        </Box>
      ),
    },
    {
      field: 'name', headerName: 'Thuộc tính', flex: 1, minWidth: 250,
      renderCell: (p) => {
        const m = INPUT_TYPE_META[p.row.input_type] ?? INPUT_TYPE_META.text;
        return (
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box sx={{
              width: 32, height: 32, borderRadius: 1,
              bgcolor: m.color + '14', color: m.color,
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Iconify icon={m.icon} width={16} />
            </Box>
            <Stack sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 13.5 }} noWrap>{p.row.name}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                {m.label}
                {p.row.unit && ` · đơn vị: ${p.row.unit}`}
              </Typography>
            </Stack>
          </Stack>
        );
      },
    },
    {
      field: 'option_count', headerName: 'Tuỳ chọn', width: 180,
      renderCell: (p) => {
        if (!['select', 'multiselect'].includes(p.row.input_type)) {
          return <Typography variant="caption" color="text.disabled">—</Typography>;
        }
        const n = p.row.option_count ?? 0;
        const max = 30;
        const pct = Math.min((n / max) * 100, 100);
        return (
          <Stack sx={{ width: '100%' }} spacing={0.375}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 11.5 }}>
                {n}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
                {n > 20 ? 'nhiều' : n > 5 ? 'vừa' : 'ít'}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 4, borderRadius: 2,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  bgcolor: n > 20 ? 'warning.main' : n > 10 ? 'info.main' : 'success.main',
                  borderRadius: 2,
                },
              }}
            />
          </Stack>
        );
      },
    },
    {
      field: 'roles', headerName: 'Vai trò', width: 240,
      renderCell: (p) => {
        const badges = [];
        if (p.row.is_filterable) {
          badges.push({ label: FILTER_DISPLAY_LABEL[p.row.filter_display] ?? 'Lọc', icon: 'solar:filter-linear', color: '#2563EB' });
        }
        if (p.row.is_variant_axis) {
          badges.push({ label: 'Biến thể', icon: 'solar:ruler-cross-pen-linear', color: '#D97706' });
        }
        if (p.row.is_visible_on_detail) {
          badges.push({ label: 'Chi tiết', icon: 'solar:list-arrow-up-linear', color: '#059669' });
        }
        if (badges.length === 0) {
          return <Typography variant="caption" color="text.disabled">—</Typography>;
        }
        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
            {badges.map((b, i) => (
              <Box
                key={i}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  px: 0.75, py: 0.25, borderRadius: 0.75,
                  bgcolor: b.color + '14', color: b.color,
                  fontSize: 10.5, fontWeight: 600,
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
      field: 'in_use', headerName: 'Tình trạng', width: 140,
      renderCell: (p) => (
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{
            width: 8, height: 8, borderRadius: '50%',
            bgcolor: p.row.in_use ? 'success.main' : 'grey.400',
            boxShadow: p.row.in_use ? '0 0 0 3px rgba(34,197,94,0.15)' : 'none',
          }} />
          <Typography variant="caption" sx={{
            fontSize: 11.5, fontWeight: 600,
            color: p.row.in_use ? 'success.darker' : 'text.secondary',
          }}>
            {p.row.in_use ? 'Đang dùng' : 'Chưa dùng'}
          </Typography>
        </Stack>
      ),
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
            { label: 'Sửa thuộc tính', icon: 'solar:pen-linear', onClick: () => setEditing(p.row) },
            { label: 'Nhân bản',       icon: 'solar:copy-linear', onClick: () => alert('Clone ' + p.row.code) },
            { label: 'Copy code',      icon: 'solar:copy-linear', onClick: () => navigator.clipboard?.writeText(p.row.code) },
            { divider: true },
            { label: 'Xoá', icon: 'solar:trash-bin-trash-linear', color: 'error',
              disabled: p.row.in_use,
              onClick: () => alert('Xoá ' + p.row.code) },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      {/* KPI row */}
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={0} icon={TuneOutlined}        label="Tổng thuộc tính" value={fmtNumber(kpi.total)}       color="primary" helperText="Nguồn cho lọc, chi tiết, biến thể" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={1} icon={CheckCircleOutlined} label="Đang dùng"       value={fmtNumber(kpi.inUse)}       color="success" helperText={`${((kpi.inUse / Math.max(kpi.total, 1)) * 100).toFixed(0)}% được áp dụng`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={2} icon={FilterListOutlined}  label="Dùng để lọc"     value={fmtNumber(kpi.filterable)}  color="info"    helperText="Hiển thị trên bộ lọc trang SP" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={3} icon={StraightenOutlined}  label="Trục biến thể"   value={fmtNumber(kpi.variantAxis)} color="warning" helperText="Dùng tạo biến thể size/màu" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        loading={attributesLoading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}
        emptyText={hasFilter ? 'Không có kết quả — thử xoá bớt lọc' : 'Chưa có thuộc tính'}
        emptyIcon="solar:tuning-linear"
        toolbar={
          <FilterBar
            searchValue={search} onSearch={setSearch}
            placeholder="Tìm theo code hoặc tên…"
            filters={[
              { value: inputType, onChange: setInputType, options: INPUT_TYPE_OPTS, minWidth: 180 },
              { value: usage,     onChange: setUsage,     options: USAGE_OPTS,      minWidth: 170 },
              { value: role,      onChange: setRole,      options: ROLE_OPTS,       minWidth: 180 },
            ]}
            onReset={hasFilter ? resetFilters : undefined}
          />
        }
      />

      <AttributeFormDrawer open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={(v) => console.log('create attribute', v)} />
      <AttributeFormDrawer open={!!editing} initial={editing} onClose={() => setEditing(null)} onSubmit={(v) => console.log('update attribute', v)} />
    </>
  );
}

// --------------------------------------------------- Attribute set tab

function AttributeSetTab() {
  const { searchResults: attributeSetsList, searchLoading: attributeSetsLoading } = useGetAttributeSetList();
  const [editing, setEditing]       = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch]         = useState('');
  const [sizeBucket, setSizeBucket] = useState('all');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });

  const kpi = useMemo(() => {
    const total  = attributeSetsList.length;
    const small  = attributeSetsList.filter((s) => (s.attribute_count ?? 0) <= 5).length;
    const medium = attributeSetsList.filter((s) => { const c = s.attribute_count ?? 0; return c > 5 && c <= 10; }).length;
    const large  = attributeSetsList.filter((s) => (s.attribute_count ?? 0) > 10).length;
    const totalAttrs = attributeSetsList.reduce((s, x) => s + (x.attribute_count ?? 0), 0);
    return { total, small, medium, large, totalAttrs };
  }, [attributeSetsList]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return attributeSetsList.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false;
      const c = s.attribute_count ?? 0;
      if (sizeBucket === 'small'  && c > 5)                return false;
      if (sizeBucket === 'medium' && (c < 6 || c > 10))    return false;
      if (sizeBucket === 'large'  && c <= 10)              return false;
      return true;
    });
  }, [attributeSetsList, search, sizeBucket]);

  const resetFilters = () => { setSearch(''); setSizeBucket('all'); };
  const hasFilter = search || sizeBucket !== 'all';
  const maxCount = Math.max(...attributeSetsList.map((s) => s.attribute_count ?? 0), 1);

  const columns = [
    {
      field: 'name', headerName: 'Bộ thuộc tính', flex: 1, minWidth: 280,
      renderCell: (p) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 40, height: 40, borderRadius: 1.25,
              bgcolor: 'primary.lighter', color: 'primary.main',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}
          >
            <LibraryBooksOutlined sx={{ fontSize: 20 }} />
          </Box>
          <Stack sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 13.5 }} noWrap>{p.row.name}</Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, fontFamily: 'monospace' }}>
              #{p.row.id} · sort {p.row.sort}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      field: 'attribute_count', headerName: 'Số thuộc tính', width: 260,
      renderCell: (p) => {
        const c = p.row.attribute_count ?? 0;
        const pct = (c / maxCount) * 100;
        return (
          <Stack sx={{ width: '100%' }} spacing={0.375}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Iconify icon="solar:bookmark-bold" width={13} sx={{ color: 'primary.main' }} />
              <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: 'monospace' }}>
                {c}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
                thuộc tính
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 4, borderRadius: 2,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  bgcolor: c > 10 ? '#7C3AED' : c > 5 ? '#2563EB' : '#64748B',
                  borderRadius: 2,
                },
              }}
            />
          </Stack>
        );
      },
    },
    {
      field: 'size_bucket', headerName: 'Quy mô', width: 130,
      renderCell: (p) => {
        const c = p.row.attribute_count ?? 0;
        const [label, color] = c > 10 ? ['Lớn', '#7C3AED'] : c > 5 ? ['Trung', '#2563EB'] : ['Nhỏ', '#64748B'];
        return (
          <Box sx={{
            display: 'inline-flex', alignItems: 'center',
            px: 1, py: 0.25, borderRadius: 0.75,
            bgcolor: color + '14', color,
            fontSize: 11.5, fontWeight: 700,
          }}>
            {label}
          </Box>
        );
      },
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
            { label: 'Sửa bộ', icon: 'solar:pen-linear', onClick: () => setEditing(p.row) },
            { label: 'Nhân bản', icon: 'solar:copy-linear', onClick: () => alert('Clone ' + p.row.name) },
            { divider: true },
            { label: 'Xoá bộ', icon: 'solar:trash-bin-trash-linear', color: 'error', onClick: () => alert('Xoá ' + p.row.name) },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      {/* KPI row */}
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={0} icon={LibraryBooksOutlined} label="Tổng bộ" value={fmtNumber(kpi.total)} color="primary"
            helperText={`${fmtNumber(kpi.totalAttrs)} thuộc tính được gán`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={1} icon={Inventory2Outlined} label="Bộ nhỏ" value={fmtNumber(kpi.small)} color="info"
            helperText="≤ 5 thuộc tính" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={2} icon={ScaleOutlined} label="Bộ trung" value={fmtNumber(kpi.medium)} color="warning"
            helperText="6 – 10 thuộc tính" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={3} icon={WarningAmberOutlined} label="Bộ lớn" value={fmtNumber(kpi.large)} color="error"
            helperText="> 10 — cân nhắc tách nhỏ" />
        </Grid>
      </Grid>

      <DataTable
        rows={filtered}
        columns={columns}
        loading={attributeSetsLoading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}
        emptyText={hasFilter ? 'Không có kết quả — thử xoá bớt lọc' : 'Chưa có bộ thuộc tính'}
        emptyIcon="solar:library-linear"
        toolbar={
          <FilterBar
            searchValue={search} onSearch={setSearch}
            placeholder="Tìm theo tên bộ…"
            filters={[
              { value: sizeBucket, onChange: setSizeBucket, options: SIZE_OPTS, minWidth: 200 },
            ]}
            onReset={hasFilter ? resetFilters : undefined}
          />
        }
      />

      <AttributeSetFormDrawer open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={(v) => console.log('create attr-set', v)} />
      <AttributeSetFormDrawer open={!!editing} initial={editing} onClose={() => setEditing(null)} onSubmit={(v) => console.log('update attr-set', v)} />
    </>
  );
}

// --------------------------------------------------- Main view

const TABS = [
  { value: 'attributes', label: 'Thuộc tính',    subtitle: 'Nguồn cho bộ lọc, bảng thông số và trục biến thể', Icon: TuneOutlined },
  { value: 'sets',       label: 'Bộ thuộc tính', subtitle: 'Gộp thuộc tính thành Set để gán cho danh mục / dòng hàng', Icon: LibraryBooksOutlined },
];

export function AttributeView({ defaultTab = 'attributes', embedded = false } = {}) {
  const attributeSetsList = useGetAttributeSetList().searchResults;
  const attributesList = useGetAttributeList().searchResults;
  const [tab, setTab] = useState(defaultTab);
  const active = TABS.find((t) => t.value === tab) ?? TABS[0];

  const Wrap = embedded ? 'div' : DashboardContent;
  const wrapProps = embedded ? {} : { disablePadding: true };
  return (
    <Wrap {...wrapProps}>
      {!embedded && (
        <PageHeader
          title={active.label}
          subtitle={active.subtitle}
          breadcrumbs={[
            { label: 'PNJ Admin', href: adminPaths.dashboard },
            { label: 'Catalog' },
            { label: active.label },
          ]}
        />
      )}

      {/* Underline tabs — ẩn khi embedded (parent hub đã render HubTabs). */}
      {!embedded ? (
        <Box sx={{ display: 'flex', bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', px: { xs: 1, md: 2 } }}>
          {TABS.map((t) => {
            const isActive = tab === t.value;
            const count = t.value === 'attributes' ? attributesList.length : attributeSetsList.length;
            return (
              <Box
                key={t.value}
                onClick={() => setTab(t.value)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 2, py: 1.5, cursor: 'pointer', userSelect: 'none',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? 700 : 500, fontSize: 13.5, lineHeight: 1,
                  boxShadow: isActive ? 'inset 0 -2px 0 currentColor' : 'none',
                  transition: 'color .15s, background-color .15s',
                  '&:hover': { color: isActive ? 'primary.dark' : 'text.primary', bgcolor: isActive ? 'transparent' : 'action.hover' },
                }}
              >
                <t.Icon sx={{ fontSize: 18 }} />
                <span>{t.label}</span>
                <Chip
                  label={count}
                  size="small"
                  sx={{
                    height: 20, px: 0.5, fontSize: 10.5, fontWeight: 700,
                    bgcolor: isActive ? 'primary.lighter' : 'grey.100',
                    color:   isActive ? 'primary.dark'    : 'text.secondary',
                    borderRadius: 1,
                  }}
                />
              </Box>
            );
          })}
        </Box>
      ) : null}

      <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
        {tab === 'attributes' && <AttributeTab />}
        {tab === 'sets'       && <AttributeSetTab />}
      </Box>
    </Wrap>
  );
}
