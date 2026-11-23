// src/views/admin/inventory/inventory-dashboard-view.jsx
// Tổng quan tồn kho: 4 KPI cards + 2 panels (top low-stock, biến động 7 ngày).

'use client';

import { useState } from 'react';

import TuneOutlined from '@mui/icons-material/TuneOutlined';
import SyncAltOutlined from '@mui/icons-material/SyncAltOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import AttachMoneyRounded from '@mui/icons-material/AttachMoneyRounded';
import FileUploadOutlined from '@mui/icons-material/FileUploadOutlined';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import {
  Box, Button, Chip, Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelative } from 'src/utils/format';
import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import { SectionCard } from 'src/views/admin/_shared/section-card';
import {
  useGetInventorySummary,
  CONST_MOVEMENT_TYPE,
} from 'src/actions/admin/inventory';

import { PageHeader } from 'src/components/common/page-header';

import { InventoryAdjustDrawer } from './inventory-adjust-drawer';
import { InventoryImportDrawer } from './inventory-import-drawer';
import { InventoryTransferDrawer } from './inventory-transfer-drawer';

function KpiCard({ icon: Icon, label, value, hint }) {
  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper', height: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: 'grey.100', display: 'grid', placeItems: 'center' }}>
          <Icon sx={{ fontSize: 20, color: 'text.secondary' }} />
        </Box>
        <Stack sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </Typography>
          {hint && (
            <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>{hint}</Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export function InventoryDashboardView() {
  const { totalSkus, outOfStockCount, lowStockCount, totalValue, topLowStock, recentMovements, loading } =
    useGetInventorySummary();

  const [adjustOpen, setAdjustOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const typeMeta = (id) => CONST_MOVEMENT_TYPE.find((t) => t.id === id) ?? CONST_MOVEMENT_TYPE[0];

  return (
    <DashboardContent>
      <PageHeader
        title="Tồn kho · Tổng quan"
        subtitle="KPI realtime · SKU sắp hết · biến động gần đây"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Tồn kho' }, { label: 'Tổng quan' }]}
        actions={
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<TuneOutlined sx={{ fontSize: 16 }} />} onClick={() => setAdjustOpen(true)}>
              Điều chỉnh
            </Button>
            <Button size="small" variant="outlined" startIcon={<SyncAltOutlined sx={{ fontSize: 16 }} />} onClick={() => setTransferOpen(true)}>
              Chuyển kho
            </Button>
            <Button size="small" variant="outlined" startIcon={<FileUploadOutlined sx={{ fontSize: 16 }} />} onClick={() => setImportOpen(true)}>
              Import
            </Button>
            <Button size="small" variant="contained" startIcon={<FileDownloadOutlined sx={{ fontSize: 16 }} />}>
              Export
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard icon={Inventory2Outlined} label="Tổng SKU" value={fShortenNumber(totalSkus)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard icon={ErrorOutlineRounded} label="Hết hàng" value={fShortenNumber(outOfStockCount)} hint="SKU × store = 0 tồn" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard icon={WarningAmberRounded} label="Sắp hết (≤ 5)" value={fShortenNumber(lowStockCount)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard icon={AttachMoneyRounded} label="Giá trị kho" value={fCurrency(totalValue)} />
        </Grid>

        {/* Top SKU sắp hết */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard icon={WarningAmberRounded} title={`Top SKU sắp hết · ${topLowStock.length}`} description="Hiển thị 10 SKU có tồn thấp nhất.">
            {topLowStock.length === 0 ? (
              <Typography sx={{ fontSize: 12, color: 'text.disabled', textAlign: 'center', py: 3 }}>
                {loading ? 'Đang tải...' : 'Chưa có dữ liệu.'}
              </Typography>
            ) : (
              <Table
                size="small"
                sx={{
                  '& .MuiTableCell-root': { borderBottomStyle: 'solid' },
                  '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
                    borderBottom: 'none',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={headSx}>SKU</TableCell>
                    <TableCell sx={headSx}>Sản phẩm</TableCell>
                    <TableCell sx={headSx}>Cửa hàng</TableCell>
                    <TableCell sx={headSx} align="right">Khả dụng</TableCell>
                    <TableCell sx={headSx} width={40} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topLowStock.map((row) => (
                    <TableRow key={`${row.sku}-${row.store_id}`}>
                      <TableCell sx={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{row.sku}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.product_name}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.store_name}</TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={row.available}
                          sx={{ height: 22, fontSize: 11, fontWeight: 700, bgcolor: row.available === 0 ? 'error.lighter' : 'warning.lighter', color: 'text.primary' }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => setAdjustOpen({ sku: row.sku, store_id: row.store_id })} title="Điều chỉnh">
                          <TuneOutlined sx={{ fontSize: 16 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SectionCard>
        </Grid>

        {/* Biến động gần */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionCard
            icon={HistoryOutlined}
            title={`Biến động 7 ngày · ${recentMovements.length}`}
            description="Nhập / xuất / điều chỉnh / chuyển kho."
            action={
              <Button size="small" href={adminPaths.inventory.movements}>Xem tất cả</Button>
            }
          >
            {recentMovements.length === 0 ? (
              <Typography sx={{ fontSize: 12, color: 'text.disabled', textAlign: 'center', py: 3 }}>
                {loading ? 'Đang tải...' : 'Chưa có biến động.'}
              </Typography>
            ) : (
              <Stack spacing={0.5}>
                {recentMovements.slice(0, 10).map((m) => {
                  const meta = typeMeta(m.type);
                  return (
                    <Stack
                      key={m._id ?? m.id}
                      direction="row" spacing={1} alignItems="center"
                      sx={{ p: 1, borderRadius: 1, border: 1, borderColor: 'divider', bgcolor: 'common.white' }}
                    >
                      <Chip size="small" label={meta.label} color={meta.color} variant="outlined" sx={{ height: 22, fontSize: 10.5 }} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600 }} noWrap>
                          {m.sku} · {m.qty > 0 ? '+' : ''}{m.qty}
                        </Typography>
                        <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }} noWrap>
                          {m.store_name ?? m.store_id} · {fmtRelative(m.created_at)}
                        </Typography>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            )}
          </SectionCard>
        </Grid>
      </Grid>

      <InventoryAdjustDrawer
        open={!!adjustOpen}
        initial={typeof adjustOpen === 'object' ? adjustOpen : null}
        onClose={() => setAdjustOpen(false)}
      />
      <InventoryTransferDrawer open={transferOpen} onClose={() => setTransferOpen(false)} />
      <InventoryImportDrawer open={importOpen} onClose={() => setImportOpen(false)} />
    </DashboardContent>
  );
}

const headSx = {
  fontWeight: 700,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.3,
  color: 'text.secondary',
  borderBottom: 1,
  borderColor: 'divider',
  py: 1,
};
