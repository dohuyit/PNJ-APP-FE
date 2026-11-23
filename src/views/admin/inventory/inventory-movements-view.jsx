// src/views/admin/inventory/inventory-movements-view.jsx
// Nhật ký mọi movement: in/out/adjust/transfer. Filter theo type/store/sku/reason/date.

'use client';

import { useMemo, useState } from 'react';

import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import {
  Button, Chip, MenuItem, Stack, TextField, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelative } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetStoreList } from 'src/actions/admin/store';
import {
  useGetInventoryMovements,
  actionInventoryExport,
  CONST_MOVEMENT_TYPE,
  CONST_MOVEMENT_REASON,
} from 'src/actions/admin/inventory';

import { toast } from 'src/components/snackbar';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';

export function InventoryMovementsView() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [reasonFilter, setReasonFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });

  const { searchResults: storeOpts } = useGetStoreList({ perPage: 200 });
  const { searchResults: rows, searchLoading: loading, metaTotal } = useGetInventoryMovements({
    perPage: 500,
    type: typeFilter || undefined,
    reason: reasonFilter || undefined,
    store_id: storeFilter || undefined,
  });

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      (r.sku ?? '').toLowerCase().includes(q) ||
      (r.note ?? '').toLowerCase().includes(q) ||
      (r.actor_name ?? '').toLowerCase().includes(q)
    );
  }, [rows, search]);

  const typeMeta = (id) => CONST_MOVEMENT_TYPE.find((t) => t.id === id) ?? CONST_MOVEMENT_TYPE[0];
  const reasonLabel = (id) => CONST_MOVEMENT_REASON.find((r) => r.id === id)?.label ?? id;

  const columns = [
    { field: 'created_at', headerName: 'Thời gian', width: 150,
      renderCell: (p) => <Typography sx={{ fontSize: 11 }}>{fmtRelative(p.row.created_at)}</Typography> },
    { field: 'type', headerName: 'Loại', width: 120,
      renderCell: (p) => {
        const m = typeMeta(p.row.type);
        return <Chip size="small" label={m.label} color={m.color} variant="outlined" sx={{ height: 22, fontSize: 11 }} />;
      },
    },
    { field: 'sku', headerName: 'SKU', width: 180,
      renderCell: (p) => <Typography sx={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{p.row.sku}</Typography> },
    { field: 'qty', headerName: 'SL', width: 90, align: 'right',
      renderCell: (p) => {
        const q = Number(p.row.qty ?? 0);
        return <Typography sx={{ fontWeight: 700, fontSize: 12, color: q > 0 ? 'success.dark' : q < 0 ? 'error.dark' : 'text.primary' }}>{q > 0 ? `+${q}` : q}</Typography>;
      },
    },
    { field: 'from_store', headerName: 'Từ', width: 140, valueGetter: (_v, row) => row.from_store_name ?? row.from_store_id ?? '—' },
    { field: 'to_store', headerName: 'Đến', width: 140, valueGetter: (_v, row) => row.to_store_name ?? row.to_store_id ?? '—' },
    { field: 'reason', headerName: 'Lý do', width: 140,
      renderCell: (p) => <Typography sx={{ fontSize: 11.5 }}>{reasonLabel(p.row.reason)}</Typography> },
    { field: 'actor_name', headerName: 'Người thực hiện', width: 160 },
    { field: 'note', headerName: 'Ghi chú', flex: 1, minWidth: 180,
      renderCell: (p) => <Typography sx={{ fontSize: 11.5 }} noWrap>{p.row.note}</Typography> },
    { field: 'attachment', headerName: '', width: 44, sortable: false,
      renderCell: (p) => p.row.attachment_url ? (
        <Button size="small" href={p.row.attachment_url} target="_blank" sx={{ minWidth: 0, p: 0.5 }}>
          <AttachFileOutlined sx={{ fontSize: 16 }} />
        </Button>
      ) : null,
    },
  ];

  const handleExport = async () => {
    try {
      const res = await actionInventoryExport({
        type: typeFilter,
        reason: reasonFilter,
        store_id: storeFilter,
      });
      const url = res?.data?.data?.url;
      if (url) window.open(url, '_blank');
      else toast.success('Đã tạo file export');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Lỗi khi export');
    }
  };

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Nhật ký nhập/xuất/điều chỉnh"
        subtitle={`${metaTotal} movement · lọc theo loại / store / lý do / thời gian`}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Tồn kho' },
          { label: 'Nhật ký' },
        ]}
        actions={
          <Button size="small" variant="outlined" startIcon={<FileDownloadOutlined sx={{ fontSize: 16 }} />} onClick={handleExport}>
            Export CSV
          </Button>
        }
      />
      <DataTable
        rows={filtered}
        columns={columns}
        loading={loading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        toolbar={
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <FilterBar searchValue={search} onSearch={setSearch} placeholder="Tìm SKU / ghi chú / người…" />
            <TextField select size="small" label="Loại" value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)} sx={{ minWidth: 130 }}>
              <MenuItem value="">Tất cả</MenuItem>
              {CONST_MOVEMENT_TYPE.map((t) => <MenuItem key={t.id} value={t.id}>{t.label}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Lý do" value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)} sx={{ minWidth: 150 }}>
              <MenuItem value="">Tất cả</MenuItem>
              {CONST_MOVEMENT_REASON.map((r) => <MenuItem key={r.id} value={r.id}>{r.label}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Cửa hàng" value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)} sx={{ minWidth: 160 }}>
              <MenuItem value="">Tất cả</MenuItem>
              {storeOpts.map((s) => (
                <MenuItem key={s._id ?? s.id} value={s._id ?? s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
          </Stack>
        }
      />
    </DashboardContent>
  );
}
