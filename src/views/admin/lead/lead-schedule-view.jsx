// src/views/admin/lead/lead-schedule-view.jsx
// Lịch đặt tư vấn — list grouped by date, matching UI mẫu PNJ.

'use client';

import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import {
  Box, Button, Stack, Tabs, Tab, Typography,
} from '@mui/material';

import { useGetLeadList } from 'src/actions/admin/lead';

import { Iconify } from 'src/components/iconify';
import { FilterBar } from 'src/components/common/filter-bar';
import { GridCardSkeleton } from 'src/components/common/skeletons';


// status mock → nhãn tiếng Việt + dot color + urgent tag
const STATUS_META = {
  new:       { label: 'Chờ xác nhận', dot: 'warning.main',     urgent: true  },
  contacted: { label: 'Đã xác nhận',  dot: 'info.main',        urgent: false },
  converted: { label: 'Đã chốt',      dot: 'success.main',     urgent: false },
  closed:    { label: 'Đã đóng',      dot: 'text.disabled',    urgent: false },
};

// type → chủ đề + hình thức
const TYPE_META = {
  callback:       { topic: 'Gọi lại tư vấn',    icon: 'solar:phone-linear',   method: 'Gọi điện thoại' },
  store_order:    { topic: 'Đặt tại cửa hàng',  icon: 'solar:shop-linear',    method: 'Gặp tại cửa hàng' },
  corporate_gift: { topic: 'Xem demo sản phẩm', icon: 'solar:videocamera-record-linear', method: 'Họp trực tuyến' },
  wholesale:      { topic: 'Tư vấn bán sỉ',     icon: 'solar:box-linear',     method: 'Gọi điện thoại' },
};

const STATUS_OPTS = [
  { value: 'all',       label: 'Mọi trạng thái', icon: 'solar:layers-minimalistic-linear' },
  { value: 'new',       label: 'Chờ xác nhận',   dot: 'warning.main' },
  { value: 'contacted', label: 'Đã xác nhận',    dot: 'info.main' },
  { value: 'converted', label: 'Đã chốt',        dot: 'success.main' },
  { value: 'closed',    label: 'Đã đóng',        dot: 'text.disabled' },
];

const TYPE_OPTS = [
  { value: 'all',            label: 'Mọi nội dung',   icon: 'solar:tag-linear' },
  { value: 'callback',       label: 'Gọi lại tư vấn', icon: 'solar:phone-linear' },
  { value: 'store_order',    label: 'Đặt tại CH',     icon: 'solar:shop-linear' },
  { value: 'corporate_gift', label: 'Xem demo SP',    icon: 'solar:videocamera-record-linear' },
  { value: 'wholesale',      label: 'Tư vấn bán sỉ',  icon: 'solar:box-linear' },
];

const METHOD_OPTS = [
  { value: 'all',     label: 'Mọi hình thức', icon: 'solar:layers-minimalistic-linear' },
  { value: 'online',  label: 'Họp trực tuyến', icon: 'solar:videocamera-record-linear' },
  { value: 'phone',   label: 'Gọi điện thoại', icon: 'solar:phone-linear' },
  { value: 'offline', label: 'Gặp tại CH',     icon: 'solar:shop-linear' },
];

const ASSIGNEE_OPTS = [
  { value: 'all',         label: 'Mọi người PT', icon: 'solar:users-group-rounded-linear' },
  { value: 'assigned',    label: 'Đã giao',      dot: 'success.main' },
  { value: 'unassigned',  label: 'Chưa giao',    dot: 'warning.main' },
];

const WEEKDAY_VI = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function bucketOf(d, today) {
  if (d.isSame(today, 'day')) return 'today';
  if (d.isAfter(today, 'day')) return 'upcoming';
  return 'past';
}

function methodKeyOf(type) {
  if (type === 'callback' || type === 'wholesale') return 'phone';
  if (type === 'store_order') return 'offline';
  return 'online';
}

function LeadRow({ lead }) {
  const status = STATUS_META[lead.status] ?? STATUS_META.new;
  const type = TYPE_META[lead.type] ?? { topic: lead.message, icon: 'solar:tag-linear', method: 'Khác' };
  const time = dayjs(lead.created_at).format('HH:mm');
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        px: { xs: 2, md: 2.5 }, py: 1.5,
        borderBottom: 1, borderColor: 'grey.100',
        gap: 2,
        '&:hover': { bgcolor: 'grey.50' },
      }}
    >
      {/* Time */}
      <Typography sx={{ fontWeight: 700, fontSize: 14, minWidth: 48, fontVariantNumeric: 'tabular-nums' }}>
        {time}
      </Typography>

      {/* Name + phone/email */}
      <Box sx={{ minWidth: 220, flex: 1 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.25 }}>
          {lead.full_name}
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ mt: 0.25, color: 'text.secondary' }} flexWrap="wrap" rowGap={0.25}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="solar:phone-linear" width={12} />
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: 11 }}>
              {lead.phone}
            </Typography>
          </Stack>
          {lead.email && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="solar:letter-linear" width={12} />
              <Typography variant="caption" sx={{ fontSize: 11 }}>
                {lead.email}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Topic + method */}
      <Box sx={{ minWidth: 200 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
          {type.topic}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary', mt: 0.25 }}>
          <Iconify icon={type.icon} width={11} />
          <Typography variant="caption" sx={{ fontSize: 11 }}>
            {type.method}
          </Typography>
        </Stack>
      </Box>

      {/* Status */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 220 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: status.dot, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap' }}>
          {status.label}
        </Typography>
        {status.urgent && (
          <Box sx={{
            display: 'inline-flex', alignItems: 'center',
            px: 0.75, py: 0.125, borderRadius: 0.75,
            fontSize: 10.5, fontWeight: 600,
            bgcolor: 'error.lighter', color: 'error.main',
            whiteSpace: 'nowrap',
          }}>
            Cần xác nhận gấp
          </Box>
        )}
      </Stack>

      {/* Assignee */}
      <Typography sx={{
        fontSize: 12.5,
        color: lead.assigned_admin ? 'text.primary' : 'text.disabled',
        fontStyle: lead.assigned_admin ? 'normal' : 'italic',
        minWidth: 110,
        whiteSpace: 'nowrap',
      }}>
        {lead.assigned_admin ?? 'Chưa giao'}
      </Typography>

      {/* Action */}
      <Box sx={{ minWidth: 100, textAlign: 'right' }}>
        {lead.status === 'new' ? (
          <Button
            size="small" variant="contained" color="error"
            sx={{ textTransform: 'none', boxShadow: 'none', fontWeight: 600, '&:hover': { boxShadow: 'none' } }}
          >
            Xác nhận
          </Button>
        ) : (
          <Button size="small" variant="text" endIcon={<Iconify icon="solar:alt-arrow-right-linear" width={13} />} sx={{ color: 'text.secondary', textTransform: 'none' }}>
            Chi tiết
          </Button>
        )}
      </Box>
    </Stack>
  );
}

export function LeadScheduleView({ embedded = false } = {}) {
  const { searchResults: leadsList, searchLoading: leadsLoading } = useGetLeadList();
  const [bucket, setBucket]           = useState('upcoming');
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusF]    = useState('all');
  const [typeFilter, setTypeF]        = useState('all');
  const [methodFilter, setMethodF]    = useState('all');
  const [assigneeFilter, setAssignee] = useState('all');

  const today = useMemo(() => dayjs().startOf('day'), []);

  const enriched = useMemo(
    () => leadsList.map((l) => ({ ...l, _dt: dayjs(l.created_at), _method: methodKeyOf(l.type) })),
    [leadsList]
  );

  const counts = useMemo(() => {
    const c = { today: 0, upcoming: 0, past: 0, all: enriched.length };
    enriched.forEach((l) => { c[bucketOf(l._dt, today)] += 1; });
    return c;
  }, [enriched, today]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enriched.filter((l) => {
      if (bucket !== 'all' && bucketOf(l._dt, today) !== bucket) return false;
      if (q && !l.full_name.toLowerCase().includes(q) && !l.phone.includes(q) && !(l.email ?? '').toLowerCase().includes(q)) return false;
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (typeFilter   !== 'all' && l.type   !== typeFilter)   return false;
      if (methodFilter !== 'all' && l._method !== methodFilter) return false;
      if (assigneeFilter === 'assigned'   && !l.assigned_admin) return false;
      if (assigneeFilter === 'unassigned' && !!l.assigned_admin) return false;
      return true;
    });
  }, [enriched, bucket, today, search, statusFilter, typeFilter, methodFilter, assigneeFilter]);

  // group by date
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((l) => {
      const key = l._dt.format('YYYY-MM-DD');
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(l);
    });
    // sort date desc for 'past', asc for upcoming/today/all
    const entries = Array.from(map.entries());
    entries.sort((a, b) => (bucket === 'past' ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0])));
    // sort rows within each date by time
    entries.forEach(([, rows]) => rows.sort((a, b) => a._dt.unix() - b._dt.unix()));
    return entries;
  }, [filtered, bucket]);

  const resetFilters = () => {
    setSearch(''); setStatusF('all'); setTypeF('all'); setMethodF('all'); setAssignee('all');
  };
  const hasFilter = !!search || statusFilter !== 'all' || typeFilter !== 'all' || methodFilter !== 'all' || assigneeFilter !== 'all';

  if (leadsLoading) return <Box><GridCardSkeleton count={6} cols={{ xs: 12, md: 6 }} imageHeight={96} /></Box>;

  return (
    <Box>
      {/* Secondary tabs: Hôm nay / Sắp tới / Đã qua / Tất cả */}
      <Box sx={{ px: { xs: 2, md: 2.5 }, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={bucket}
          onChange={(_, v) => setBucket(v)}
          variant="scrollable" scrollButtons="auto"
          TabIndicatorProps={{ sx: { height: 2, bgcolor: 'text.primary' } }}
          sx={{
            minHeight: 36,
            '& .MuiTabs-flexContainer': { gap: 0 },
            '& .MuiTab-root': {
              minHeight: 36, minWidth: 'auto', fontWeight: 500, fontSize: 12.5,
              textTransform: 'none', px: 1.25, mr: 0.5,
              color: 'text.secondary',
              '&.Mui-selected': { color: 'text.primary', fontWeight: 600 },
            },
          }}
        >
          {[
            { value: 'today',    label: 'Hôm nay' },
            { value: 'upcoming', label: 'Sắp tới' },
            { value: 'past',     label: 'Đã qua' },
            { value: 'all',      label: 'Tất cả' },
          ].map((t) => (
            <Tab
              key={t.value} value={t.value}
              label={
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <span>{t.label}</span>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: 20, height: 18, px: 0.75, borderRadius: 1,
                      fontSize: 10.5, fontWeight: 600,
                      bgcolor: bucket === t.value ? 'grey.200' : 'grey.100',
                      color:   bucket === t.value ? 'text.primary' : 'text.disabled',
                    }}
                  >
                    {counts[t.value]}
                  </Box>
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Filter toolbar */}
      <Box sx={{ px: { xs: 2, md: 2.5 }, py: 1.25, borderBottom: 1, borderColor: 'divider' }}>
        <FilterBar
          searchValue={search}
          onSearch={setSearch}
          placeholder="Tìm tên, số điện thoại, email"
          filters={[
            { value: statusFilter,   onChange: setStatusF,  options: STATUS_OPTS,   minWidth: 160 },
            { value: typeFilter,     onChange: setTypeF,    options: TYPE_OPTS,     minWidth: 160 },
            { value: methodFilter,   onChange: setMethodF,  options: METHOD_OPTS,   minWidth: 160 },
            { value: assigneeFilter, onChange: setAssignee, options: ASSIGNEE_OPTS, minWidth: 160 },
          ]}
          onReset={hasFilter ? resetFilters : undefined}
        />
      </Box>

      {/* Date-grouped list */}
      {grouped.length === 0 ? (
        <Stack alignItems="center" spacing={1} sx={{ py: 8, color: 'text.disabled' }}>
          <Iconify icon="solar:calendar-linear" width={28} />
          <Typography variant="caption">Không có lịch nào</Typography>
        </Stack>
      ) : (
        grouped.map(([dateKey, items]) => {
          const d = dayjs(dateKey);
          return (
            <Box key={dateKey}>
              {/* Date header */}
              <Box sx={{
                px: { xs: 2, md: 2.5 }, py: 1,
                bgcolor: 'grey.50',
                borderBottom: 1, borderColor: 'grey.100',
              }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>
                  {WEEKDAY_VI[d.day()]}, {d.format('DD/MM/YYYY')}
                  <Box component="span" sx={{ ml: 1, color: 'text.disabled', fontWeight: 500 }}>
                    {items.length} lịch
                  </Box>
                </Typography>
              </Box>
              {items.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
            </Box>
          );
        })
      )}
    </Box>
  );
}
