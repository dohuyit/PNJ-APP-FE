// src/views/admin/review/review-feed-view.jsx — Card feed cho review, duyệt nhanh

'use client';

import { useEffect, useMemo, useState } from 'react';

import StarBorderOutlined from '@mui/icons-material/StarBorderOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import HourglassBottomOutlined from '@mui/icons-material/HourglassBottomOutlined';
import {
  Avatar, Box, Button, Grid, IconButton, Rating, Stack, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelative } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { KpiCard } from 'src/views/admin/_shared/kpi-card';
import { useGetReviewList } from 'src/actions/admin/review';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';

import { Iconify } from 'src/components/iconify';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';
import { GridCardSkeleton } from 'src/components/common/skeletons';


const STATUS_META = {
  pending:  { label: 'Chờ duyệt', color: 'warning', icon: 'solar:clock-circle-linear' },
  approved: { label: 'Đã duyệt',  color: 'success', icon: 'solar:check-circle-linear' },
  rejected: { label: 'Từ chối',   color: 'error',   icon: 'solar:close-circle-linear' },
  hidden:   { label: 'Đã ẩn',     color: 'default', icon: 'solar:eye-closed-linear' },
};

const SORT_OPTS = [
  { value: 'newest',    label: 'Mới nhất',        icon: 'solar:sort-from-top-to-bottom-linear' },
  { value: 'oldest',    label: 'Cũ nhất',         icon: 'solar:sort-from-bottom-to-top-linear' },
  { value: 'rating_hi', label: 'Sao cao → thấp',  icon: 'solar:star-bold' },
  { value: 'rating_lo', label: 'Sao thấp → cao',  icon: 'solar:star-linear' },
];

const STATUS_OPTS = [
  { value: 'all',      label: 'Mọi trạng thái', icon: 'solar:layers-minimalistic-linear' },
  { value: 'pending',  label: 'Chờ duyệt',      dot: 'warning.main' },
  { value: 'approved', label: 'Đã duyệt',       dot: 'success.main' },
  { value: 'rejected', label: 'Từ chối',        dot: 'error.main' },
  { value: 'hidden',   label: 'Đã ẩn',          dot: 'text.disabled' },
];

const RATING_OPTS = [
  { value: 'all', label: 'Mọi sao',   icon: 'solar:star-linear' },
  { value: '5',   label: '5 sao',     icon: 'solar:star-bold' },
  { value: '4',   label: '4 sao',     icon: 'solar:star-bold' },
  { value: '3',   label: '3 sao',     icon: 'solar:star-bold' },
  { value: 'low', label: '≤ 2 sao',   icon: 'solar:danger-triangle-linear' },
];

// -------------------------------------------- Review card

// Avatar gradient palette — tái sử dụng pattern bên customer list cho đồng bộ
const REVIEW_GRADIENTS = [
  ['#818CF8', '#4F46E5'],
  ['#F87171', '#DC2626'],
  ['#34D399', '#059669'],
  ['#FBBF24', '#D97706'],
  ['#A78BFA', '#7C3AED'],
  ['#38BDF8', '#0284C7'],
];
const hashStr = (s = '') => Array.from(s).reduce((a, c) => a + c.charCodeAt(0), 0);
const initialsOf = (name = '') =>
  name.trim().split(/\s+/).slice(-2).map((w) => w[0] ?? '').join('').toUpperCase() || '??';

function ReviewCard({ review, onApprove, onReject, onReply }) {
  const meta = STATUS_META[review.status] ?? STATUS_META.pending;
  const [g0, g1] = REVIEW_GRADIENTS[hashStr(review.author_name) % REVIEW_GRADIENTS.length];

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        height: '100%',
        transition: 'border-color .15s, box-shadow .15s',
        '&:hover': { borderColor: 'text.disabled', boxShadow: '0 2px 6px rgba(145, 158, 171, 0.14)' },
      }}
    >
      {/* HEADER — avatar + name + status strip + menu */}
      <Stack
        direction="row" alignItems="center" spacing={1.25}
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'grey.100' }}
      >
        <Avatar
          sx={{
            width: 36, height: 36,
            background: `linear-gradient(135deg, ${g0}, ${g1})`,
            color: 'common.white', fontWeight: 800, fontSize: 12,
            textShadow: '0 1px 1px rgba(0,0,0,0.15)',
            flexShrink: 0,
          }}
        >
          {initialsOf(review.author_name)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }} noWrap>
              {review.author_name}
            </Typography>
            {review.has_order && (
              <Iconify icon="solar:verified-check-bold" width={14} sx={{ color: 'success.main' }} />
            )}
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: `${meta.color}.main`, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10.5, lineHeight: 1 }}>
              {meta.label} · {fmtRelative(review.created_at)}
            </Typography>
          </Stack>
        </Box>
        <RowActionsMenu
          items={[
            { label: 'Xem trên site',  icon: 'solar:eye-linear',             onClick: () => window.open(`/products/${review.product_id}#reviews`, '_blank') },
            { label: 'Copy nội dung',  icon: 'solar:copy-linear',            onClick: () => navigator.clipboard?.writeText(review.content) },
            { divider: true },
            { label: 'Báo spam',       icon: 'solar:flag-linear',            color: 'warning', onClick: () => alert('Báo spam') },
            { label: 'Xoá',            icon: 'solar:trash-bin-trash-linear', color: 'error',   onClick: () => alert('Xoá') },
          ]}
        />
      </Stack>

      {/* BODY — rating + content + media */}
      <Box sx={{ px: 2, py: 1.75, flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
          <Rating value={review.rating} readOnly size="small" sx={{ fontSize: 15 }} />
          <Typography sx={{ fontSize: 11, color: 'text.disabled', fontWeight: 600, fontFamily: 'monospace' }}>
            {review.rating.toFixed(1)}
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          sx={{
            fontSize: 13, lineHeight: 1.55, color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {review.content}
        </Typography>
        {review.has_media && (
          <Stack direction="row" spacing={0.5} sx={{ mt: 1.25 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 56, height: 56,
                  bgcolor: 'grey.50', border: 1, borderColor: 'grey.100',
                  display: 'grid', placeItems: 'center',
                }}
              >
                <Iconify icon="solar:gallery-linear" width={16} sx={{ color: 'text.disabled' }} />
              </Box>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', ml: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10.5 }}>
                +N
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>

      {/* PRODUCT META */}
      <Stack
        direction="row" alignItems="center" spacing={1}
        sx={{
          px: 2, py: 1,
          borderTop: 1, borderColor: 'grey.100',
          bgcolor: 'grey.50',
        }}
      >
        <Iconify icon="solar:bag-4-linear" width={13} sx={{ color: 'text.disabled' }} />
        <Typography
          component="a"
          href={adminPaths.product.edit(review.product_id)}
          variant="caption"
          sx={{
            color: 'text.secondary', flex: 1, fontSize: 11.5,
            textDecoration: 'none',
            '&:hover': { color: 'primary.main', textDecoration: 'underline' },
          }}
          noWrap
        >
          {review.product_name}
        </Typography>
      </Stack>

      {/* FOOTER — actions */}
      <Stack
        direction="row"
        sx={{ borderTop: 1, borderColor: 'grey.100' }}
      >
        {review.status === 'pending' ? (
          <>
            <Button
              fullWidth
              startIcon={<Iconify icon="solar:check-circle-linear" width={13} />}
              onClick={() => onApprove(review)}
              sx={{
                borderRadius: 0, py: 1, fontSize: 12, fontWeight: 600,
                color: 'success.main',
                borderRight: 1, borderColor: 'grey.100',
                '&:hover': { bgcolor: 'success.lighter' },
              }}
            >
              Duyệt
            </Button>
            <Button
              fullWidth
              startIcon={<Iconify icon="solar:close-circle-linear" width={13} />}
              onClick={() => onReject(review)}
              sx={{
                borderRadius: 0, py: 1, fontSize: 12, fontWeight: 600,
                color: 'error.main',
                borderRight: 1, borderColor: 'grey.100',
                '&:hover': { bgcolor: 'error.lighter' },
              }}
            >
              Từ chối
            </Button>
            <Button
              fullWidth
              startIcon={<Iconify icon="solar:chat-round-dots-linear" width={13} />}
              onClick={() => onReply(review)}
              sx={{
                borderRadius: 0, py: 1, fontSize: 12, fontWeight: 600,
                color: 'text.primary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Trả lời
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              startIcon={<Iconify icon="solar:chat-round-dots-linear" width={13} />}
              onClick={() => onReply(review)}
              sx={{
                borderRadius: 0, py: 1, fontSize: 12, fontWeight: 600,
                color: 'text.primary',
                borderRight: review.status === 'approved' ? 1 : 0, borderColor: 'grey.100',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Trả lời
            </Button>
            {review.status === 'approved' && (
              <Button
                fullWidth
                startIcon={<Iconify icon="solar:eye-closed-linear" width={13} />}
                onClick={() => alert('Ẩn ' + review.id)}
                sx={{
                  borderRadius: 0, py: 1, fontSize: 12, fontWeight: 600,
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                Ẩn
              </Button>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
}

// -------------------------------------------- Main view

const PAGE_SIZE = 9;

export function ReviewFeedView({ embedded = false } = {}) {
  const { searchResults: reviewsList, searchLoading: reviewsLoading } = useGetReviewList();
  const [list, setList]       = useState(reviewsList);
  useEffect(() => { setList(reviewsList); }, [reviewsList]);
  const [search, setSearch]   = useState('');
  const [rating, setRating]   = useState('all');    // all | 5 | 4 | 3 | low
  const [status, setStatus]   = useState('all');
  const [sort, setSort]       = useState('newest');
  const [page, setPage]       = useState(0);

  const kpi = useMemo(() => {
    const total    = list.length;
    const pending  = list.filter((r) => r.status === 'pending').length;
    const approved = list.filter((r) => r.status === 'approved').length;
    const avgRate  = list.reduce((s, r) => s + r.rating, 0) / (total || 1);
    return { total, pending, approved, avgRate };
  }, [list]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = list.filter((r) => {
      if (q && !r.author_name.toLowerCase().includes(q) && !r.product_name.toLowerCase().includes(q) && !r.content.toLowerCase().includes(q)) return false;
      if (rating !== 'all') {
        if (rating === 'low' ? r.rating > 2 : r.rating !== Number(rating)) return false;
      }
      if (status !== 'all' && r.status !== status) return false;
      return true;
    });
    const by = {
      newest:    (a, b) => new Date(b.created_at) - new Date(a.created_at),
      oldest:    (a, b) => new Date(a.created_at) - new Date(b.created_at),
      rating_hi: (a, b) => b.rating - a.rating,
      rating_lo: (a, b) => a.rating - b.rating,
    };
    return out.sort(by[sort]);
  }, [list, search, rating, status, sort]);

  const pageCount = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
  const pageStart = page * PAGE_SIZE;
  const paged     = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const hasFilter = search || status !== 'all' || rating !== 'all' || sort !== 'newest';

  const handleApprove = (rv) => setList((l) => l.map((x) => (x.id === rv.id ? { ...x, status: 'approved' } : x)));
  const handleReject  = (rv) => setList((l) => l.map((x) => (x.id === rv.id ? { ...x, status: 'rejected' } : x)));
  const handleReply   = (rv) => alert('Mở drawer trả lời: ' + rv.author_name);

  const Wrap = embedded ? Box : DashboardContent;
  const wrapProps = embedded ? {} : { disablePadding: true };
  if (reviewsLoading) {
    return <Wrap {...wrapProps}><GridCardSkeleton count={8} cols={{ xs: 12, sm: 6, md: 4, lg: 3 }} imageHeight={140} /></Wrap>;
  }
  return (
    <Wrap {...wrapProps}>
      {!embedded && (
      <PageHeader
        title="Đánh giá sản phẩm"
        subtitle={`${list.length} đánh giá · duyệt nhanh / trả lời / ẩn`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Đánh giá' }]}
      />
      )}

      {/* KPI — full-width, border nhẹ */}
      <Box>
        <Grid container spacing={0}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              index={0}
              icon={StarBorderOutlined}
              label="Tổng đánh giá"
              value={kpi.total}
              color="primary"
              helperText={`Trung bình ${kpi.avgRate.toFixed(2)}★`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              index={1}
              icon={HourglassBottomOutlined}
              label="Chờ duyệt"
              value={kpi.pending}
              color="warning"
              helperText="Cần xử lý trong ngày"
              onClick={() => setStatus('pending')}
              selected={status === 'pending'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              index={2}
              icon={CheckCircleOutlined}
              label="Đã duyệt"
              value={kpi.approved}
              color="success"
              helperText="Đang hiển thị trên site"
              onClick={() => setStatus('approved')}
              selected={status === 'approved'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              index={3}
              icon={VisibilityOffOutlined}
              label="Đã ẩn / từ chối"
              value={kpi.total - kpi.approved - kpi.pending}
              color="error"
              helperText="Không hiển thị cho khách"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Filter toolbar — style y hệt order (search + 3 FilterSelect), không có nút lọc nâng cao */}
      <Box sx={{ px: { xs: 2, md: 2.5 }, py: 1.25, borderBottom: 1, borderColor: 'divider' }}>
        <FilterBar
          searchValue={search}
          onSearch={(v) => { setSearch(v); setPage(0); }}
          placeholder="Tìm theo tên KH / sản phẩm / nội dung…"
          filters={[
            { value: status, onChange: (v) => { setStatus(v); setPage(0); }, options: STATUS_OPTS, minWidth: 170 },
            { value: rating, onChange: (v) => { setRating(v); setPage(0); }, options: RATING_OPTS, minWidth: 140 },
            { value: sort,   onChange: setSort,   options: SORT_OPTS,   minWidth: 180 },
          ]}
          onReset={hasFilter ? () => { setSearch(''); setStatus('all'); setRating('all'); setSort('newest'); setPage(0); } : undefined}
          extra={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12, whiteSpace: 'nowrap' }}>
                {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} / {filtered.length}
              </Typography>
              <IconButton
                size="small"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                sx={{ width: 28, height: 28 }}
              >
                <Iconify icon="solar:alt-arrow-left-linear" width={14} />
              </IconButton>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 11.5, minWidth: 40, textAlign: 'center' }}>
                {page + 1} / {pageCount}
              </Typography>
              <IconButton
                size="small"
                disabled={page >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
                sx={{ width: 28, height: 28 }}
              >
                <Iconify icon="solar:alt-arrow-right-linear" width={14} />
              </IconButton>
            </Stack>
          }
        />
      </Box>

      {/* Feed */}
      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'grey.50', minHeight: 'calc(100vh - 480px)' }}>
        {paged.length === 0 ? (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 10, color: 'text.disabled' }}>
            <Iconify icon="solar:chat-round-dots-linear" width={40} />
            <Typography variant="body2">Không có đánh giá khớp bộ lọc</Typography>
          </Stack>
        ) : (
          <Grid container spacing={2}>
            {paged.map((r) => (
              <Grid key={r.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <ReviewCard
                  review={r}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onReply={handleReply}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Wrap>
  );
}
