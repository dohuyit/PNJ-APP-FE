// src/views/admin/lead/lead-pipeline-view.jsx
// CRM pipeline — style port từ zeno-crm-fe CSKH board.
// Card 5 zones (A source bar, B identity, C data grid, D SLA, E footer).

'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DndContext, closestCorners, PointerSensor, useSensor, useSensors, useDraggable, useDroppable,
} from '@dnd-kit/core';

import {
  Box, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtRelativeDate } from 'src/utils/format-time';

import { useGetLeadList } from 'src/actions/admin/lead';
import { DashboardContent } from 'src/layouts/dashboard';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';
import { AdminKanbanBoard, AdminKanbanColumn, AdminKanbanCard } from 'src/views/admin/_shared/admin-kanban';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { KanbanSkeleton } from 'src/components/common/skeletons';


const STAGES = [
  { id: 'new',       label: 'Mới',        tone: 'neutral', icon: 'solar:star-linear',         sla: 'Phản hồi trong 2h' },
  { id: 'contacted', label: 'Đã liên hệ', tone: 'info',    icon: 'solar:phone-linear',        sla: 'Theo dõi trong 24h' },
  { id: 'converted', label: 'Đã chốt',    tone: 'success', icon: 'solar:check-circle-linear', sla: 'Chuyển sang đơn' },
  { id: 'closed',    label: 'Đã đóng',    tone: 'error',   icon: 'solar:close-circle-linear', sla: 'Không hoạt động' },
];

// Lead type — map màu pastel, hiển thị ở source bar
const TYPE_META = {
  callback:       { label: 'GỌI LẠI',  icon: 'solar:phone-calling-linear', color: '#8B5CF6' },
  store_order:    { label: 'TẠI CH',   icon: 'solar:shop-linear',          color: '#EC4899' },
  corporate_gift: { label: 'QUÀ DN',   icon: 'solar:gift-linear',          color: '#F59E0B' },
  wholesale:      { label: 'BÁN SỈ',   icon: 'solar:box-linear',           color: '#10B981' },
};

// SLA tính từ created_at vs assigned_admin — ảnh hưởng zone D
function computeSLA(lead) {
  const age = Date.now() - new Date(lead.created_at).getTime();
  const hrs = age / 3_600_000;
  if (lead.status === 'converted') return { key: 'done', label: 'Đã chốt', icon: 'solar:check-circle-linear', bg: '#f0fdf4', border: 'rgba(22,163,74,.2)',  color: '#16a34a', delta: null };
  if (lead.status === 'closed')    return { key: 'done', label: 'Đã đóng', icon: 'solar:close-circle-linear', bg: '#F9FAFB', border: 'rgba(145,158,171,0.16)', color: '#637381', delta: null };
  if (!lead.assigned_admin && hrs > 2)   return { key: 'danger', label: 'Chờ phân quá hạn', icon: 'solar:bell-linear',     bg: '#fff5f5', border: 'rgba(220,38,38,.22)', color: '#dc2626', delta: `${Math.round(hrs)}h` };
  if (hrs > 24)                          return { key: 'warn',   label: 'Chưa follow-up',    icon: 'solar:clock-circle-linear', bg: '#fffbeb', border: 'rgba(217,119,6,.22)', color: '#d97706', delta: `${Math.round(hrs / 24)}d` };
  return { key: 'ok', label: 'Trong hạn', icon: 'solar:check-circle-linear', bg: '#f0fdf4', border: 'rgba(22,163,74,.2)', color: '#16a34a', delta: `${Math.max(1, Math.round(hrs))}h` };
}

function formatPhone(p) {
  if (!p) return '';
  return p.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

function initials(name = '') {
  return name.split(' ').slice(-2).map((w) => w[0] || '').join('').toUpperCase();
}

// ---------------------------------------------------------- Card

function LeadCard({ lead }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });
  const type = TYPE_META[lead.type] ?? { label: (lead.type || '—').toUpperCase(), icon: 'solar:tag-linear', color: '#637381' };
  const sla = computeSLA(lead);
  const hasEmail = !!lead.email;

  return (
    <AdminKanbanCard
      nodeRef={setNodeRef}
      dragProps={{ ...attributes, ...listeners }}
      transform={transform}
      isDragging={isDragging}
    >
      {/* Zone A — Source bar */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          pt: '7px', pb: '7px', pl: '12px', pr: '10px',
          gap: '8px',
          background: 'linear-gradient(180deg,#fafafa 0%,#fff 100%)',
          borderBottom: '1px solid rgba(145,158,171,0.16)',
        }}
      >
        <Stack direction="row" alignItems="center" gap="5px" sx={{ flexShrink: 0 }}>
          <Box
            sx={{
              width: 16, height: 16, borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: type.color, flexShrink: 0,
            }}
          >
            <Iconify icon={type.icon} width={11} sx={{ color: '#fff' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 10.5, letterSpacing: '0.02em', color: type.color, whiteSpace: 'nowrap' }}>
            {type.label}
          </Typography>
        </Stack>
        <Box sx={{ width: '1px', height: '11px', bgcolor: 'rgba(145,158,171,0.16)', flexShrink: 0 }} />
        <Typography
          noWrap
          sx={{ flex: 1, minWidth: 0, fontSize: 10.5, fontWeight: 500, color: '#454F5B' }}
        >
          Lead #{lead.id}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
            fontSize: 10, fontWeight: 600, color: '#637381',
            flexShrink: 0, letterSpacing: '-0.01em',
          }}
        >
          {fmtRelativeDate(lead.created_at)}
        </Typography>
      </Stack>

      {/* Zone B — Identity */}
      <Stack direction="row" alignItems="center" gap="8px" sx={{ pt: '10px', pb: '8px', pl: '12px', pr: '10px' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            noWrap
            sx={{ fontWeight: 600, fontSize: 13, letterSpacing: '-0.018em', lineHeight: 1.25, color: 'text.primary' }}
          >
            {lead.full_name}
          </Typography>
          <Stack direction="row" alignItems="center" gap="5px" sx={{ mt: '3px' }}>
            <Box
              sx={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                bgcolor: lead.assigned_admin ? '#22C55E' : '#FFAB00',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary', fontSize: 11,
                fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
                lineHeight: 1.8,
              }}
            >
              {formatPhone(lead.phone)}
            </Typography>
          </Stack>
        </Box>

        {/* Initials box — thay cho score box của zeno */}
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 38, py: '5px',
            borderRadius: '8px',
            flexShrink: 0,
            bgcolor: `${type.color}1F`,
            color: type.color,
          }}
        >
          <Typography sx={{
            fontWeight: 800, fontSize: 13, lineHeight: 1,
            fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
            letterSpacing: '-0.03em', color: 'inherit',
          }}>
            {initials(lead.full_name) || '??'}
          </Typography>
        </Stack>
      </Stack>

      {/* Zone C — Data grid */}
      <Box
        sx={{
          pt: '2px', pb: '9px', pl: '12px', pr: '10px',
          display: 'grid',
          gridTemplateColumns: '58px 1fr',
          rowGap: '3px',
          columnGap: '8px',
          alignItems: 'baseline',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10.5, fontWeight: 500 }}>
          Email
        </Typography>
        <Typography
          variant="caption" noWrap
          sx={{
            fontWeight: 600, fontSize: 10.5,
            color: hasEmail ? 'text.primary' : 'text.disabled',
            fontStyle: hasEmail ? 'normal' : 'italic',
          }}
        >
          {lead.email || 'Chưa có'}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10.5, fontWeight: 500 }}>
          Cửa hàng
        </Typography>
        <Typography variant="caption" noWrap sx={{ fontWeight: 600, fontSize: 10.5, color: lead.store_id ? 'text.primary' : 'text.disabled', fontStyle: lead.store_id ? 'normal' : 'italic' }}>
          {lead.store_id || 'Chưa chọn'}
        </Typography>
      </Box>

      {/* Note preview (nếu có message) */}
      {lead.message && (
        <Stack
          direction="row"
          spacing={0.75}
          alignItems="flex-start"
          sx={{
            ml: '12px', mr: '10px', mb: '9px',
            px: '8px', py: '6px',
            borderRadius: '6px',
            background: '#fffdf5',
            border: '1px solid #fef3c7',
            borderLeft: '2px solid #fbbf24',
          }}
        >
          <Iconify icon="solar:notes-linear" width={12} sx={{ color: '#d97706', mt: '2px', flexShrink: 0 }} />
          <Typography
            variant="caption"
            sx={{
              fontSize: 10.5, fontStyle: 'italic', fontWeight: 500,
              color: 'text.secondary', lineHeight: 1.4,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {lead.message}
          </Typography>
        </Stack>
      )}

      {/* Zone D — SLA bar */}
      <Stack
        direction="row"
        alignItems="center"
        gap="6px"
        sx={{
          ml: '12px', mr: '10px', mb: '9px',
          px: '8px', py: '5px',
          borderRadius: '6px',
          background: sla.bg,
          border: `1px solid ${sla.border}`,
        }}
      >
        <Iconify icon={sla.icon} width={12} sx={{ color: sla.color, flexShrink: 0 }} />
        <Typography sx={{ flex: 1, fontSize: 11, fontWeight: 600, color: sla.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {sla.label}
        </Typography>
        {sla.delta && (
          <Typography sx={{ fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace', fontSize: 10.5, fontWeight: 700, color: sla.color, flexShrink: 0, letterSpacing: '-0.01em' }}>
            {sla.delta}
          </Typography>
        )}
      </Stack>

      {/* Zone E — Footer */}
      {lead.assigned_admin ? (
        <Stack
          direction="row" alignItems="center" gap="6px"
          sx={{ pt: '6px', pb: '7px', pl: '12px', pr: '8px', borderTop: '1px solid rgba(145,158,171,0.16)' }}
        >
          <Box
            sx={{
              width: 18, height: 18, borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: 'primary.main', color: 'common.white',
              fontSize: 9, fontWeight: 700,
              outline: '1.5px solid #fff',
              boxShadow: '0 0 0 1px rgba(145,158,171,0.16)',
              flexShrink: 0,
            }}
          >
            {lead.assigned_admin[0]}
          </Box>
          <Typography noWrap sx={{ fontSize: 11, fontWeight: 500, color: '#919EAB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
            {lead.assigned_admin}
          </Typography>
          <Stack direction="row" gap="1px" sx={{ flexShrink: 0 }}>
            <Tooltip title={`Gọi ${lead.phone}`}>
              <IconButton
                size="small"
                sx={{ width: 28, height: 28, borderRadius: '8px', border: '1px solid transparent', color: '#637381', '&:hover': { bgcolor: '#D8FBDE', borderColor: 'rgba(22,163,74,.3)', color: '#22C55E' } }}
                onClick={(e) => { e.stopPropagation(); }}
              >
                <Iconify icon="solar:phone-linear" width={13} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chat Zalo">
              <IconButton
                size="small"
                sx={{ width: 28, height: 28, borderRadius: '8px', border: '1px solid transparent', color: '#637381', '&:hover': { bgcolor: '#D6E4FF', borderColor: 'rgba(2,136,209,.3)', color: '#1877F2' } }}
                onClick={(e) => { e.stopPropagation(); }}
              >
                <Iconify icon="solar:chat-line-linear" width={13} />
              </IconButton>
            </Tooltip>
            {hasEmail && (
              <Tooltip title={lead.email}>
                <IconButton
                  size="small"
                  sx={{ width: 28, height: 28, borderRadius: '8px', border: '1px solid transparent', color: '#637381', '&:hover': { bgcolor: '#FEF3C7', borderColor: 'rgba(217,119,6,.3)', color: '#d97706' } }}
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Iconify icon="solar:letter-linear" width={13} />
                </IconButton>
              </Tooltip>
            )}
            <RowActionsMenu
              items={[
                { label: 'Xem chi tiết', icon: 'solar:eye-linear', onClick: () => {} },
                { label: 'Gán cho tôi',  icon: 'solar:user-plus-linear', onClick: () => {} },
                { divider: true },
                { label: 'Đóng lead', icon: 'solar:close-circle-linear', color: 'error', onClick: () => {} },
              ]}
            />
          </Stack>
        </Stack>
      ) : (
        <Stack
          direction="row" alignItems="center" gap="6px"
          sx={{
            pt: '6px', pb: '7px', pl: '12px', pr: '8px',
            background: 'linear-gradient(90deg,#fffbeb 0%,transparent 100%)',
            borderTop: '1px dashed rgba(217,119,6,.35)',
          }}
        >
          <Box sx={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#FFF5CC', border: '1.5px dashed #FFAB00', color: '#FFAB00', flexShrink: 0 }}>
            <Iconify icon="solar:user-plus-linear" width={12} />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: 11, color: '#B76E00', letterSpacing: '-0.005em', flex: 1 }}>
            Chưa phân
          </Typography>
          <Box
            component="button"
            onClick={(e) => { e.stopPropagation(); }}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: '3px',
              height: 24, px: '9px', py: '4px', fontSize: 11, fontWeight: 600,
              letterSpacing: '-0.005em',
              bgcolor: '#22C55E', color: '#fff', border: '1px solid #22C55E',
              borderRadius: '8px', cursor: 'pointer',
              '&:hover': { bgcolor: '#118D57', borderColor: '#118D57' },
            }}
          >
            <Iconify icon="solar:bolt-linear" width={12} />
            Nhận lead
          </Box>
        </Stack>
      )}
    </AdminKanbanCard>
  );
}

// ---------------------------------------------------------- Column

function StageColumn({ stage, leads, totalCount, hasFilter }) {
  const { isOver, setNodeRef } = useDroppable({ id: stage.id });
  return (
    <AdminKanbanColumn
      title={stage.label}
      badgeTone={stage.tone}
      count={leads.length}
      totalCount={totalCount}
      hasFilter={hasFilter}
      nodeRef={setNodeRef}
      isOver={isOver}
    >
      {leads.length === 0 ? (
        <Stack alignItems="center" spacing={0.5} sx={{ py: 5, color: 'text.disabled' }}>
          <Iconify icon={stage.icon} width={22} />
          <Typography variant="caption" sx={{ fontSize: 10.5 }}>Trống</Typography>
        </Stack>
      ) : (
        leads.map((l) => <LeadCard key={l.id} lead={l} />)
      )}
    </AdminKanbanColumn>
  );
}

// ---------------------------------------------------------- Main view

export function LeadPipelineView({ embedded = false } = {}) {
  const { searchResults: leadsList, searchLoading: leadsLoading } = useGetLeadList();
  const [leads, setLeads]   = useState(leadsList);
  useEffect(() => { setLeads(leadsList); }, [leadsList]);
  const [search, setSearch] = useState('');
  const [types, setTypes]   = useState([]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const toggleType = (v) =>
    setTypes((t) => (t.includes(v) ? t.filter((x) => x !== v) : [...t, v]));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (q && !l.full_name.toLowerCase().includes(q) && !l.phone.includes(q) && !(l.message ?? '').toLowerCase().includes(q)) return false;
      if (types.length && !types.includes(l.type)) return false;
      return true;
    });
  }, [leads, search, types]);

  const byStage = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s.id, []]));
    filtered.forEach((l) => { if (map[l.status]) map[l.status].push(l); });
    return map;
  }, [filtered]);

  const totalByStage = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s.id, 0]));
    leads.forEach((l) => { if (map[l.status] != null) map[l.status] += 1; });
    return map;
  }, [leads]);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const destStage = STAGES.find((s) => s.id === over.id);
    if (!destStage) return;
    setLeads((list) =>
      list.map((l) => (l.id === active.id && l.status !== destStage.id ? { ...l, status: destStage.id } : l))
    );
  };

  const activeFilters = (search ? 1 : 0) + types.length;
  const hasFilter = activeFilters > 0;

  const Wrap = embedded ? Box : DashboardContent;
  const wrapProps = embedded ? {} : { disablePadding: true };
  if (leadsLoading) return <Wrap {...wrapProps}><KanbanSkeleton columnCount={4} cardsPerColumn={3} /></Wrap>;
  return (
    <Wrap {...wrapProps}>
      {!embedded && (
        <PageHeader
          title="CRM Pipeline — Lead"
          subtitle="Kéo thả lead qua từng stage · theo dõi funnel · gọi/chat/email nhanh từ card"
          breadcrumbs={[
            { label: 'PNJ Admin', href: adminPaths.dashboard },
            { label: 'Bán hàng' },
            { label: 'Lead Pipeline' },
          ]}
        />
      )}

      {/* Toolbar sạch kiểu zeno */}
      <Stack
        direction="row" alignItems="center" flexWrap="wrap"
        sx={{
          px: { xs: 2, md: 3 }, py: 1.25,
          borderBottom: 1, borderColor: 'divider',
          bgcolor: 'background.paper',
          gap: '8px', rowGap: 1,
        }}
      >
        <TextField
          size="small"
          sx={(theme) => ({
            width: 240, flexShrink: 0,
            '& .MuiInputBase-root': {
              height: 32, fontSize: 12, borderRadius: '8px', bgcolor: 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(145,158,171,0.24)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
            },
            '& .MuiInputBase-input': { py: 0, fontSize: 12 },
          })}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm tên / SĐT / nội dung…"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:magnifer-linear" width={14} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        {Object.entries(TYPE_META).map(([v, m]) => {
          const active = types.includes(v);
          return (
            <Box
              key={v}
              onClick={() => toggleType(v)}
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                height: 30, px: '10px', borderRadius: '8px',
                border: '1px solid',
                borderColor: active ? m.color : 'rgba(145,158,171,0.24)',
                bgcolor: active ? `${m.color}14` : 'background.paper',
                color: active ? m.color : 'text.secondary',
                fontSize: 11.5, fontWeight: 700,
                cursor: 'pointer', userSelect: 'none',
                letterSpacing: '0.02em',
                transition: 'all .15s',
                '&:hover': { borderColor: m.color, color: m.color, bgcolor: `${m.color}0D` },
              }}
            >
              <Iconify icon={m.icon} width={12} />
              {m.label}
            </Box>
          );
        })}

        <Box sx={{ flex: 1 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
          {filtered.length}/{leads.length} lead{activeFilters > 0 && ` · ${activeFilters} filter`}
        </Typography>
      </Stack>

      {/* Pipeline columns */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <AdminKanbanBoard sx={{ px: { xs: 1, md: 1.5 }, pt: 1.5 }}>
          {STAGES.map((s) => (
            <StageColumn
              key={s.id}
              stage={s}
              leads={byStage[s.id] ?? []}
              totalCount={totalByStage[s.id]}
              hasFilter={hasFilter}
            />
          ))}
        </AdminKanbanBoard>
      </DndContext>
    </Wrap>
  );
}
