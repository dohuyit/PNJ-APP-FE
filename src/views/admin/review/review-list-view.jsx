'use client';

import { Avatar, IconButton, Rating, Stack, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelative } from 'src/utils/format';

import { useGetReviewList } from 'src/actions/admin/review';
import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { REVIEW_STATUS_COLOR, REVIEW_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';


const columns = [
  { field: 'author', headerName: 'Khách', width: 180, sortable: false,
    renderCell: (p) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>{p.row.author_name?.[0]}</Avatar>
        <Stack>
          <Typography variant="body2">{p.row.author_name ?? '-'}</Typography>
          {p.row.has_order && <Label color="success" variant="filled">Đã mua</Label>}
        </Stack>
      </Stack>
    ) },
  { field: 'product_name', headerName: 'Sản phẩm', width: 200 },
  { field: 'rating', headerName: 'Sao', width: 140,
    renderCell: (p) => <Rating value={p.row.rating ?? 0} readOnly size="small" /> },
  { field: 'content', headerName: 'Nội dung', flex: 1, renderCell: (p) => <Typography variant="body2" noWrap>{p.row.content ?? '-'}</Typography> },
  { field: 'media', headerName: '', width: 50, sortable: false,
    renderCell: (p) => p.row.has_media && <Iconify icon="solar:gallery-bold" width={18} sx={{ color: 'primary.main' }} /> },
  { field: 'created_at', headerName: 'Ngày', width: 130, renderCell: (p) => fmtRelative(p.row.created_at) },
  { field: 'status', headerName: 'Trạng thái', width: 130,
    renderCell: (p) => <StatusBadge status={p.row.status} colorMap={REVIEW_STATUS_COLOR} labelMap={REVIEW_STATUS_LABEL} /> },
  { field: 'actions', headerName: '', width: 100, sortable: false,
    renderCell: (p) => p.row.status === 'pending' ? (
      <>
        <IconButton size="small" sx={{ color: 'success.main' }}><Iconify icon="solar:check-circle-linear" width={16} /></IconButton>
        <IconButton size="small" sx={{ color: 'error.main' }}><Iconify icon="solar:close-circle-linear" width={16} /></IconButton>
      </>
    ) : <IconButton size="small"><Iconify icon="solar:eye-linear" width={16} /></IconButton> },
];

const STATUS_OPTS = [
  { value: 'all',      label: 'Tất cả trạng thái', icon: 'solar:layers-minimalistic-linear' },
  { value: 'pending',  label: 'Chờ duyệt',          dot: 'warning.main' },
  { value: 'approved', label: 'Đã duyệt',           dot: 'success.main' },
  { value: 'rejected', label: 'Từ chối',            dot: 'error.main' },
  { value: 'hidden',   label: 'Đã ẩn',              dot: 'text.disabled' },
];

const RATING_OPTS = [
  { value: 'all', label: 'Mọi sao', icon: 'solar:star-linear' },
  { value: '5',   label: '5 sao',   icon: 'solar:star-bold' },
  { value: '4',   label: '4 sao',   icon: 'solar:star-bold' },
  { value: '3',   label: '≤ 3 sao', icon: 'solar:star-bold' },
];

export function ReviewListView() {
  const { searchResults: reviewsList, searchLoading: reviewsLoading } = useGetReviewList();
  return (
    <SimpleListView
      title="Đánh giá sản phẩm"
      subtitle={`${reviewsList.length} đánh giá · duyệt / ẩn / trả lời`}
      breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Đánh giá' }]}
      rows={reviewsList}
      columns={columns}
      loading={reviewsLoading}
      searchKeys={['author_name', 'product_name', 'content']}
      filters={[
        { key: 'status', options: STATUS_OPTS, predicate: (r, v) => r.status === v, minWidth: 170 },
        { key: 'rating', options: RATING_OPTS, predicate: (r, v) => v === '3' ? r.rating <= 3 : r.rating === Number(v), minWidth: 130 },
      ]}
    />
  );
}
