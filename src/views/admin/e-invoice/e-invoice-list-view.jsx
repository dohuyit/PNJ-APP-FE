'use client';

import { Avatar, IconButton, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtDate } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { mockEInvoices } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const eInvoicesList = mockEInvoices;
const STATUS = {
  issued:    { label: 'Đã phát hành', color: 'success' },
  pending:   { label: 'Chờ phát hành', color: 'warning' },
  cancelled: { label: 'Đã huỷ',        color: 'error' },
};

const columns = [
  {
    field: 'invoice_no', headerName: 'Số HĐ', width: 190,
    renderCell: (p) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(239,68,68,0.1)', color: 'error.main' }}>
          <Iconify icon="solar:file-text-linear" width={16} />
        </Avatar>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12.5 }}>{p.row.invoice_no ?? '-'}</Typography>
      </Stack>
    ),
  },
  { field: 'order_no', headerName: 'Đơn', width: 170,
    renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>{p.row.order_no ?? '-'}</Typography> },
  { field: 'customer', headerName: 'Khách', flex: 1, minWidth: 150 },
  { field: 'mst', headerName: 'MST', width: 140,
    renderCell: (p) => p.row.mst ? <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{p.row.mst ?? '-'}</Typography> : <Typography variant="caption" color="text.disabled">—</Typography> },
  { field: 'amount_before_vat', headerName: 'Trước VAT', width: 140, align: 'right', renderCell: (p) => fmtVND(p.row.amount_before_vat) },
  { field: 'vat_amount', headerName: 'VAT 10%', width: 120, align: 'right', renderCell: (p) => fmtVND(p.row.vat_amount) },
  { field: 'amount_total', headerName: 'Tổng', width: 150, align: 'right',
    renderCell: (p) => <Typography variant="body2" sx={{ fontWeight: 700, color: 'warning.dark' }}>{fmtVND(p.row.amount_total)}</Typography> },
  { field: 'issued_at', headerName: 'Ngày phát hành', width: 140, renderCell: (p) => fmtDate(p.row.issued_at) },
  { field: 'status', headerName: 'Trạng thái', width: 150,
    renderCell: (p) => <Label color={STATUS[p.row.status].color} variant="filled">{STATUS[p.row.status].label}</Label> },
  {
    field: 'actions', headerName: '', width: 80, align: 'center', sortable: false,
    renderCell: (p) => (
      <Stack direction="row">
        <IconButton size="small" onClick={() => p.row.pdf_url && window.open(p.row.pdf_url, '_blank')}>
          <Iconify icon="solar:download-linear" width={16} />
        </IconButton>
        <IconButton size="small"><Iconify icon="solar:eye-linear" width={16} /></IconButton>
      </Stack>
    ),
  },
];

export function EInvoiceListView({ embedded = false } = {}) {
  return (
    <SimpleListView
      embedded={embedded}
      title="Hoá đơn điện tử"
      subtitle={`${eInvoicesList.length} hoá đơn · VAT 10% · PDF download`}
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'E-invoice' }]}
      rows={eInvoicesList}
      columns={columns}
      searchKeys={['invoice_no', 'order_no', 'customer', 'mst']}
    />
  );
}
