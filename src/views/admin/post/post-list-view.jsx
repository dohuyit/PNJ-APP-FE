// src/views/admin/post/post-list-view.jsx
// Bài viết blog · layout chuẩn: KPI + FilterBar + Advanced drawer + DataTable.

'use client';

import { useMemo, useState } from 'react';

import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import EditNoteOutlined from '@mui/icons-material/EditNoteOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Avatar, Box, Button, Chip, Drawer, FormControlLabel, Grid, IconButton,
  Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtDate, fmtNumber, fmtRelative } from 'src/utils/format';

import { useGetPostList } from 'src/actions/admin/post';
import { DashboardContent } from 'src/layouts/dashboard';
import { KpiCard } from 'src/views/admin/_shared/kpi-card';
import { useGetPostCategoryList } from 'src/actions/admin/post';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';

import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';
import { StatusBadge } from 'src/components/common/status-badge';

import { PostFormDrawer } from './post-create-drawer';


const POST_STATUS_COLOR = { draft: 'default', scheduled: 'info', published: 'success' };
const POST_STATUS_LABEL = { draft: 'Nháp', scheduled: 'Hẹn lịch', published: 'Đã đăng' };

const AUTHORS = ['Nguyễn Minh', 'Trần An', 'Lê Hương', 'Phạm Dung'];

// Filter options
const CATEGORY_OPTS = [
  { value: 'all', label: 'Mọi chuyên mục', icon: 'solar:layers-minimalistic-linear' },
  ...postCategoriesTree.map((c) => ({ value: c.id, label: c.name, icon: 'solar:bookmark-linear' })),
];

const STATUS_OPTS = [
  { value: 'all',       label: 'Mọi trạng thái', icon: 'solar:layers-minimalistic-linear' },
  { value: 'published', label: 'Đã đăng',        dot: 'success.main' },
  { value: 'scheduled', label: 'Hẹn lịch',       dot: 'info.main' },
  { value: 'draft',     label: 'Nháp',           dot: 'text.disabled' },
];

const TIME_OPTS = [
  { value: 'all',   label: 'Mọi thời gian', icon: 'solar:infinity-linear' },
  { value: '7d',    label: '7 ngày qua',    icon: 'solar:calendar-linear' },
  { value: '30d',   label: '30 ngày qua',   icon: 'solar:calendar-mark-linear' },
  { value: '90d',   label: '90 ngày qua',   icon: 'solar:calendar-search-linear' },
  { value: 'year',  label: 'Trong năm',     icon: 'solar:calendar-date-linear' },
];

const EMPTY_ADV = {
  authors: [],
  viewMin: '',
  viewMax: '',
  featuredOnly: false,
  dateFrom: '',
  dateTo: '',
};

function countAdvFilters(adv) {
  return (
    (adv.authors.length ? 1 : 0) +
    (adv.viewMin || adv.viewMax ? 1 : 0) +
    (adv.featuredOnly ? 1 : 0) +
    (adv.dateFrom || adv.dateTo ? 1 : 0)
  );
}

// -------------------- Advanced drawer

// Module-scope shadow (empty) so top-level references work; component shadows via hook.
const postCategoriesTree = [];

function PostAdvancedFilterDrawer({ open, value, onChange, onClose, onReset }) {
  const v = value ?? EMPTY_ADV;
  const set = (patch) => onChange({ ...v, ...patch });
  const toggleAuthor = (a) =>
    set({ authors: v.authors.includes(a) ? v.authors.filter((x) => x !== a) : [...v.authors, a] });

  return (
    <Drawer
      anchor="right" open={open} onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 380 }, bgcolor: 'common.white' } }}
    >
      <Stack sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Iconify icon="solar:tuning-2-linear" width={18} sx={{ color: 'text.secondary', mr: 1 }} />
          <Typography sx={{ flex: 1, fontWeight: 700 }}>Bộ lọc nâng cao</Typography>
          <IconButton size="small" onClick={onClose}><Iconify icon="solar:close-circle-linear" width={18} /></IconButton>
        </Stack>

        <Stack spacing={2.5} sx={{ p: 2, flex: 1, overflow: 'auto' }}>
          {/* Tác giả · multi */}
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Tác giả
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {AUTHORS.map((a) => {
                const active = v.authors.includes(a);
                return (
                  <Chip
                    key={a}
                    label={a}
                    size="small"
                    onClick={() => toggleAuthor(a)}
                    color={active ? 'primary' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                  />
                );
              })}
            </Stack>
          </Box>

          {/* Khoảng lượt xem */}
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Khoảng lượt xem
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small" placeholder="Tối thiểu" fullWidth
                value={v.viewMin}
                onChange={(e) => set({ viewMin: e.target.value.replace(/[^\d]/g, '') })}
              />
              <TextField
                size="small" placeholder="Tối đa" fullWidth
                value={v.viewMax}
                onChange={(e) => set({ viewMax: e.target.value.replace(/[^\d]/g, '') })}
              />
            </Stack>
          </Box>

          {/* Khoảng ngày tuỳ chọn */}
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Khoảng ngày đăng (tuỳ chỉnh)
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                type="date" size="small" fullWidth
                value={v.dateFrom}
                onChange={(e) => set({ dateFrom: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="date" size="small" fullWidth
                value={v.dateTo}
                onChange={(e) => set({ dateTo: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </Box>

          <FormControlLabel
            control={<Switch checked={v.featuredOnly} onChange={(e) => set({ featuredOnly: e.target.checked })} />}
            label={<Typography sx={{ fontSize: 13 }}>Chỉ bài nổi bật (★)</Typography>}
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={onReset}>Đặt lại</Button>
          <Button fullWidth variant="contained" onClick={onClose}>Áp dụng</Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

// -------------------- Create button export

export function PostCreateButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small" variant="contained"
        startIcon={<Iconify icon="solar:pen-new-square-linear" width={14} />}
        onClick={() => setOpen(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Viết bài mới
      </Button>
      <PostFormDrawer
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(v) => console.log('create post', v)}
      />
    </>
  );
}

// -------------------- Main view

export function PostListView({ embedded = false } = {}) {
  const postCategoriesTree = useGetPostCategoryList().searchResults;
  const { searchResults: postsList, searchLoading: postsLoading } = useGetPostList();
  const [editing, setEditing]       = useState(null);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('all');
  const [status, setStatus]         = useState('all');
  const [timeRange, setTimeRange]   = useState('all');
  const [adv, setAdv]               = useState(EMPTY_ADV);
  const [advOpen, setAdvOpen]       = useState(false);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });

  const kpi = useMemo(() => {
    const total      = postsList.length;
    const published  = postsList.filter((p) => p.status === 'published').length;
    const drafts     = postsList.filter((p) => p.status === 'draft').length;
    const scheduled  = postsList.filter((p) => p.status === 'scheduled').length;
    return { total, published, drafts, scheduled };
  }, [postsList]);

  const advCount = countAdvFilters(adv);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return postsList.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (category !== 'all' && p.category_id !== category) return false;
      if (status   !== 'all' && p.status      !== status)   return false;
      if (timeRange !== 'all') {
        const DAY = 86_400_000;
        const span = { '7d': 7*DAY, '30d': 30*DAY, '90d': 90*DAY, 'year': 365*DAY }[timeRange];
        if (Date.now() - new Date(p.published_at).getTime() > span) return false;
      }
      if (adv.authors.length  && !adv.authors.includes(p.author)) return false;
      if (adv.viewMin && p.view_count < Number(adv.viewMin)) return false;
      if (adv.viewMax && p.view_count > Number(adv.viewMax)) return false;
      if (adv.featuredOnly && !p.is_featured) return false;
      if (adv.dateFrom && new Date(p.published_at) < new Date(adv.dateFrom)) return false;
      if (adv.dateTo   && new Date(p.published_at) > new Date(adv.dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [postsList, search, category, status, timeRange, adv]);

  const hasFilter = search || category !== 'all' || status !== 'all' || timeRange !== 'all' || advCount > 0;
  const resetAll = () => {
    setSearch(''); setCategory('all'); setStatus('all'); setTimeRange('all'); setAdv(EMPTY_ADV);
  };

  const columns = [
    {
      field: 'title', headerName: 'Bài viết', width: 360,
      renderCell: (p) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={p.row.thumbnail ?? '-'}
            variant="rounded"
            sx={{ width: 64, height: 42, bgcolor: 'grey.100', border: 1, borderColor: 'grey.200', flexShrink: 0 }}
          >
            <Iconify icon="solar:gallery-linear" width={16} sx={{ color: 'text.disabled' }} />
          </Avatar>
          <Stack sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography sx={{ fontWeight: 600, fontSize: 13 }} noWrap>
                {p.row.title ?? '-'}
              </Typography>
              {p.row.is_featured && (
                <Tooltip title="Bài nổi bật">
                  <Iconify icon="solar:star-bold" width={13} sx={{ color: 'warning.main' }} />
                </Tooltip>
              )}
            </Stack>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, fontFamily: 'monospace' }} noWrap>
              /{p.row.slug ?? '-'}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      field: 'category_name', headerName: 'Chuyên mục', width: 170,
      renderCell: (p) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Iconify icon="solar:bookmark-linear" width={12} sx={{ color: 'text.disabled' }} />
          <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>
            {p.row.category_name ?? '-'}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'author', headerName: 'Tác giả', width: 140,
      renderCell: (p) => (
        <Typography sx={{ fontSize: 12.5 }}>{p.row.author ?? '-'}</Typography>
      ),
    },
    {
      field: 'view_count', headerName: 'Lượt xem', width: 130, align: 'right', headerAlign: 'right',
      renderCell: (p) => (
        <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-end">
          <Iconify icon="solar:eye-linear" width={12} sx={{ color: 'text.disabled' }} />
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, fontFamily: 'monospace' }}>
            {fmtNumber(p.row.view_count ?? 0)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'published_at', headerName: 'Ngày đăng', width: 140,
      renderCell: (p) => (
        <Stack>
          <Typography variant="caption" sx={{ fontSize: 11.5, fontWeight: 500 }}>
            {fmtDate(p.row.published_at)}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
            {fmtRelative(p.row.published_at)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'status', headerName: 'Trạng thái', width: 130,
      renderCell: (p) => <StatusBadge status={p.row.status} colorMap={POST_STATUS_COLOR} labelMap={POST_STATUS_LABEL} />,
    },
    {
      field: 'actions', headerName: '', width: 56, align: 'center', sortable: false,
      renderCell: (p) => (
        <RowActionsMenu
          items={[
            { label: 'Xem bài',    icon: 'solar:eye-linear',           onClick: () => window.open(`/blog/${p.row.slug ?? '-'}`, '_blank') },
            { label: 'Sửa',        icon: 'solar:pen-linear',           onClick: () => setEditing(p.row) },
            { label: 'Nhân bản',   icon: 'solar:copy-linear',          onClick: () => alert('Clone ' + p.row.slug) },
            { label: 'Copy link',  icon: 'solar:link-linear',          onClick: () => navigator.clipboard?.writeText(`/blog/${p.row.slug ?? '-'}`) },
            { divider: true },
            { label: p.row.is_featured ? 'Bỏ nổi bật' : 'Đặt nổi bật',
              icon: p.row.is_featured ? 'solar:star-linear' : 'solar:star-bold',
              color: p.row.is_featured ? undefined : 'warning',
              onClick: () => alert('Toggle featured ' + p.row.slug) },
            { divider: true },
            { label: 'Xoá bài', icon: 'solar:trash-bin-trash-linear', color: 'error', onClick: () => alert('Xoá ' + p.row.slug) },
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
          <KpiCard index={0} icon={ArticleOutlined}      label="Tổng bài viết" value={fmtNumber(kpi.total)}     color="primary" helperText={`${postCategoriesTree.length} chuyên mục`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={1} icon={CheckCircleOutlined}  label="Đã đăng"       value={fmtNumber(kpi.published)} color="success" helperText={`${((kpi.published / Math.max(kpi.total, 1)) * 100).toFixed(0)}% hiển thị trên site`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={2} icon={ScheduleOutlined}     label="Hẹn lịch"      value={fmtNumber(kpi.scheduled)} color="info"    helperText="Chờ ngày publish" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={3} icon={EditNoteOutlined}     label="Nháp"          value={fmtNumber(kpi.drafts)}    color="warning" helperText="Chưa được xuất bản" />
        </Grid>
      </Grid>

      <DataTable
        rows={rows}
        columns={columns}
        loading={postsLoading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}
        emptyText={hasFilter ? 'Không có bài khớp bộ lọc' : 'Chưa có bài viết nào'}
        emptyIcon="solar:document-text-linear"
        toolbar={
          <FilterBar
            searchValue={search} onSearch={setSearch}
            placeholder="Tìm theo tiêu đề bài viết…"
            filters={[
              { value: category,  onChange: setCategory,  options: CATEGORY_OPTS, minWidth: 180 },
              { value: status,    onChange: setStatus,    options: STATUS_OPTS,   minWidth: 170 },
              { value: timeRange, onChange: setTimeRange, options: TIME_OPTS,     minWidth: 160 },
            ]}
            advancedCount={advCount}
            onOpenAdvanced={() => setAdvOpen(true)}
            advancedChips={[
              ...adv.authors.map((a) => ({
                label: `Tác giả: ${a}`,
                onClear: () => setAdv({ ...adv, authors: adv.authors.filter((x) => x !== a) }),
              })),
              ...(adv.viewMin || adv.viewMax ? [{
                label: `Lượt xem: ${adv.viewMin ? Number(adv.viewMin).toLocaleString('vi-VN') : '0'} — ${adv.viewMax ? Number(adv.viewMax).toLocaleString('vi-VN') : '∞'}`,
                onClear: () => setAdv({ ...adv, viewMin: '', viewMax: '' }),
              }] : []),
              ...(adv.featuredOnly ? [{ label: 'Chỉ bài nổi bật', onClear: () => setAdv({ ...adv, featuredOnly: false }) }] : []),
              ...(adv.dateFrom || adv.dateTo ? [{
                label: `Từ ${adv.dateFrom || '—'} đến ${adv.dateTo || '—'}`,
                onClear: () => setAdv({ ...adv, dateFrom: '', dateTo: '' }),
              }] : []),
            ]}
            onReset={hasFilter ? resetAll : undefined}
          />
        }
      />

      <PostAdvancedFilterDrawer
        open={advOpen}
        value={adv}
        onChange={setAdv}
        onClose={() => setAdvOpen(false)}
        onReset={() => setAdv(EMPTY_ADV)}
      />

      <PostFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update post', v)}
      />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Bài viết blog"
        subtitle={`${postsList.length} bài viết · ${postCategoriesTree.length} chuyên mục`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Blog' }]}
        actions={<PostCreateButton />}
      />
      {body}
    </DashboardContent>
  );
}
