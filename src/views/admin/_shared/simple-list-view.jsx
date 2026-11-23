// src/views/admin/_shared/simple-list-view.jsx — reusable list + filter + table for simple CRUD modules

'use client';

import { useMemo, useState } from 'react';

import { Box, Button, Stack } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';
import { ConfirmDialog } from 'src/components/common/confirm-dialog';

/**
 * `createDrawer`: (closeFn) => ReactNode  — ưu tiên hơn `createHref`.
 * Có drawer thì click "Tạo mới" mở drawer; không thì fallback về `createHref` (nav sang trang).
 */
export function SimpleListView({
  title,
  subtitle,
  breadcrumbs,
  rows,
  columns,
  loading,
  createHref,
  createDrawer,
  createLabel = 'Tạo mới',
  searchKeys = ['name'],
  extraActions,
  emptyText,
  deletable = true,
  checkboxSelection = false,
  embedded = false,       // true: skip DashboardContent + PageHeader (dùng trong hub view)
  filters = [],           // array of { key, options, predicate, defaultValue?, minWidth? }
  advancedDrawer,         // (closeFn) => ReactNode, mở khi bấm "Bộ lọc"
  advancedCount = 0,      // số filter trong drawer đang active, hiện badge
  nowrap = true,          // áp whiteSpace: nowrap vào cell
  createOpen: createOpenProp,       // controlled open state (optional) — dùng khi embedded trong hub-view
  onCloseCreate: onCloseCreateProp, // callback đóng drawer (optional, bắt buộc nếu createOpenProp dùng)
}) {
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [createOpenLocal, setCreateOpenLocal] = useState(false);
  const createOpen = createOpenProp !== undefined ? createOpenProp : createOpenLocal;
  const setCreateOpen = (v) => {
    if (createOpenProp !== undefined) {
      if (!v) onCloseCreateProp?.();
    } else {
      setCreateOpenLocal(v);
    }
  };
  const [advOpen, setAdvOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });
  // Mỗi filter giữ state local = { [key]: value } (default = 'all' nếu không khai báo)
  const [filterState, setFilterState] = useState(() =>
    Object.fromEntries(filters.map((f) => [f.key, f.defaultValue ?? 'all']))
  );

  const filtered = useMemo(() => {
    let r = rows;
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((x) => searchKeys.some((k) => String(x[k] ?? '').toLowerCase().includes(q)));
    }
    filters.forEach((f) => {
      const v = filterState[f.key];
      if (v !== (f.defaultValue ?? 'all')) {
        r = r.filter((x) => f.predicate(x, v));
      }
    });
    return r;
  }, [rows, search, searchKeys, filters, filterState]);

  const hasActiveFilter =
    !!search ||
    advancedCount > 0 ||
    filters.some((f) => filterState[f.key] !== (f.defaultValue ?? 'all'));

  const resetAll = () => {
    setSearch('');
    setFilterState(Object.fromEntries(filters.map((f) => [f.key, f.defaultValue ?? 'all'])));
  };

  const createBtn = createDrawer ? (
    <Button
      variant="contained"
      startIcon={<Iconify icon="solar:add-circle-linear" width={16} />}
      onClick={() => setCreateOpen(true)}
    >
      {createLabel}
    </Button>
  ) : createHref ? (
    <Button
      component={RouterLink}
      href={createHref}
      variant="contained"
      startIcon={<Iconify icon="solar:add-circle-linear" width={16} />}
    >
      {createLabel}
    </Button>
  ) : null;

  const body = (
    <>
      <DataTable
        rows={filtered}
        columns={columns}
        loading={loading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        checkboxSelection={checkboxSelection}
        emptyText={emptyText}
        sx={nowrap ? { '& .MuiTableCell-root': { whiteSpace: 'nowrap' } } : undefined}
        toolbar={
          <FilterBar
            searchValue={search}
            onSearch={setSearch}
            placeholder="Tìm kiếm..."
            filters={filters.map((f) => ({
              value: filterState[f.key],
              options: f.options,
              onChange: (v) => setFilterState((s) => ({ ...s, [f.key]: v })),
              minWidth: f.minWidth,
              defaultValue: f.defaultValue ?? 'all',
            }))}
            advancedCount={advancedCount}
            onOpenAdvanced={advancedDrawer ? () => setAdvOpen(true) : undefined}
            onReset={hasActiveFilter ? resetAll : undefined}
            /* Actions (createBtn + extraActions) không còn render trong toolbar — chuyển lên PageHeader
               khi standalone, hoặc tab.actions khi embedded trong hub-view. */
          />
        }
      />

      {createDrawer && createOpen && createDrawer(() => setCreateOpen(false))}
      {advancedDrawer && advOpen && advancedDrawer(() => setAdvOpen(false))}

      <ConfirmDialog
        open={!!toDelete}
        title="Xoá mục này?"
        message="Thao tác không thể hoàn tác."
        confirmLabel="Xoá"
        danger
        onCancel={() => setToDelete(null)}
        onConfirm={() => setToDelete(null)}
      />
    </>
  );

  if (embedded) {
    return (
      <Box sx={{
        bgcolor: 'background.paper',
        borderTop: 0,
        borderBottom: 1,
        borderColor: 'divider',
        overflow: 'hidden',
      }}>
        {body}
      </Box>
    );
  }

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        actions={
          <>
            {extraActions}
            {createBtn}
          </>
        }
      />
      <Box sx={{
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 1,
        mx: { xs: 2, md: 3 },
        mb: { xs: 2, md: 3 },
        overflow: 'hidden',
      }}>
        {body}
      </Box>
    </DashboardContent>
  );
}
