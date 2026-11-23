'use client';

import { useMemo, useState } from 'react';

import { Button, IconButton, Stack, TextField, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelative } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetInventoryList } from 'src/actions/admin/inventory';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';


const columns = [
  { field: 'sku', headerName: 'SKU', width: 180,
    renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{p.row.sku ?? '-'}</Typography> },
  { field: 'product', headerName: 'Sản phẩm', flex: 1, minWidth: 200 },
  { field: 'size', headerName: 'Size', width: 80,
    renderCell: (p) => <Label>{p.row.size ?? '-'}</Label> },
  { field: 'store', headerName: 'Cửa hàng', width: 200,
    renderCell: (p) => (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Iconify icon="solar:shop-2-linear" width={14} sx={{ color: 'text.secondary' }} />
        <Typography variant="body2">{p.row.store ?? '-'}</Typography>
      </Stack>
    ) },
  { field: 'qty_on_hand', headerName: 'Tồn kho', width: 100, align: 'right' },
  { field: 'qty_reserved', headerName: 'Đang giữ', width: 100, align: 'right',
    renderCell: (p) => <Typography variant="body2" color="warning.main">{p.row.qty_reserved ?? 0}</Typography> },
  { field: 'available', headerName: 'Khả dụng', width: 100, align: 'right',
    renderCell: (p) => (
      <Label color={p.row.available === 0 ? 'error' : p.row.available < 5 ? 'warning' : 'success'} variant="filled">{p.row.available ?? 0}</Label>
    ) },
  { field: 'synced_at', headerName: 'Đồng bộ lúc', width: 140,
    renderCell: (p) => (
      <Stack>
        <Typography variant="caption">{fmtRelative(p.row.synced_at)}</Typography>
        <Label>{p.row.synced_from ?? '-'}</Label>
      </Stack>
    ) },
  { field: 'actions', headerName: '', width: 80, sortable: false,
    renderCell: () => (
      <IconButton size="small" title="Điều chỉnh"><Iconify icon="solar:pen-linear" width={16} /></IconButton>
    ) },
];

export function InventoryListView({ embedded = false } = {}) {
  const { searchResults: inventoriesList, searchLoading: inventoriesLoading } = useGetInventoryList();
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });

  const rows = useMemo(() => {
    if (!search) return inventoriesList;
    const q = search.toLowerCase();
    return inventoriesList.filter((r) => r.sku.toLowerCase().includes(q) || r.product.toLowerCase().includes(q));
  }, [inventoriesList, search]);

  const WrapOuter = embedded ? 'div' : DashboardContent;
  const outerProps = embedded ? {} : { disablePadding: true };

  return (
    <WrapOuter {...outerProps}>
      {!embedded && (
      <PageHeader
        title="Tồn kho"
        subtitle={`${inventoriesList.length} dòng · tồn kho theo cửa hàng · đồng bộ POS`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Tồn kho' }]}
        actions={
          <>
            <Button variant="outlined" startIcon={<Iconify icon="solar:refresh-linear" width={16} />}>Đồng bộ POS</Button>
            <Button variant="outlined" startIcon={<Iconify icon="solar:upload-linear" width={16} />}>Nhập Excel</Button>
          </>
        }
      />
      )}
      <DataTable
        rows={rows}
        columns={columns}
        loading={inventoriesLoading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        toolbar={
          <FilterBar searchValue={search} onSearch={setSearch} placeholder="Tìm SKU / sản phẩm..." />
        }
      />
    </WrapOuter>
  );
}
