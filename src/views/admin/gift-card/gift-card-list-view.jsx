'use client';

import { IconButton, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtDate } from 'src/utils/format';

import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { mockGiftCards } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const giftCardsList = mockGiftCards;
const STATUS_COLOR = { active: 'success', redeemed: 'info', expired: 'default', void: 'error' };
const STATUS_LABEL = { active: 'Đang dùng', redeemed: 'Đã dùng hết', expired: 'Hết hạn', void: 'Huỷ' };

const columns = [
  { field: 'code', headerName: 'Mã (che)', width: 180, renderCell: (p) => <Typography sx={{ fontFamily: 'monospace' }}>{p.row.code ?? '-'}</Typography> },
  { field: 'face_value', headerName: 'Mệnh giá', width: 150, align: 'right', renderCell: (p) => fmtVND(p.row.face_value ?? 0) },
  { field: 'balance', headerName: 'Số dư', width: 150, align: 'right', renderCell: (p) => <Typography color="primary.main">{fmtVND(p.row.balance ?? 0)}</Typography> },
  { field: 'purchaser_name', headerName: 'Người mua', flex: 1 },
  { field: 'recipient_phone', headerName: 'Người nhận', width: 140, renderCell: (p) => <Typography sx={{ fontFamily: 'monospace' }}>{p.row.recipient_phone ?? '-'}</Typography> },
  { field: 'expires_at', headerName: 'Hạn', width: 130, renderCell: (p) => fmtDate(p.row.expires_at) },
  { field: 'status', headerName: 'Trạng thái', width: 140, renderCell: (p) => <Label color={STATUS_COLOR[p.row.status]} variant="filled">{STATUS_LABEL[p.row.status]}</Label> },
  { field: 'actions', headerName: '', width: 120, sortable: false,
    renderCell: () => (
      <>
        <IconButton size="small" title="Gia hạn"><Iconify icon="solar:calendar-mark-linear" width={16} /></IconButton>
        <IconButton size="small" title="Gửi lại SMS"><Iconify icon="solar:refresh-linear" width={16} /></IconButton>
        <IconButton size="small" title="Huỷ" sx={{ color: 'error.main' }}><Iconify icon="solar:close-circle-linear" width={16} /></IconButton>
      </>
    ) },
];

export function GiftCardListView() {
  return (
    <SimpleListView
      title="Phiếu quà tặng (E-gift)"
      subtitle={`${giftCardsList.length} phiếu · 100K → 5 triệu`}
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Phiếu quà tặng' }]}
      rows={giftCardsList}
      columns={columns}
      searchKeys={['code', 'purchaser_name', 'recipient_phone']}
    />
  );
}
