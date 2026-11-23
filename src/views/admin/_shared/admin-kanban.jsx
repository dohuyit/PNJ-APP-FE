// src/views/admin/_shared/admin-kanban.jsx
// Shell kanban dùng chung — style port từ zeno-crm-fe CSKH board.
// Cột 288px nền #F9FAFB, header white 52px, scroll body có outline khi isOver.
// Card: bg trắng, radius 12px, shadow subtle, hover lift + green glow, drag opacity.
//
// Dùng:
//   <AdminKanbanBoard>
//     <AdminKanbanColumn
//       title="Chờ xác nhận"
//       badgeTone="warning"
//       count={12}
//       nodeRef={setDroppableRef}
//       isOver={isOver}
//       rightSlot={<IconButton …/>}
//     >
//       {cards}
//     </AdminKanbanColumn>
//   </AdminKanbanBoard>
//
//   <AdminKanbanCard
//     nodeRef={setDraggableRef}
//     dragProps={{ ...attributes, ...listeners }}
//     transform={transform}
//     isDragging={isDragging}
//   >
//     {zones}
//   </AdminKanbanCard>

'use client';

import { Box, Stack, Typography } from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';

const COLUMN_WIDTH = 288;

// Pastel badge palette cho count pill — key tự do do caller map (warning/success/…)
const BADGE_TONE = {
  neutral: { color: '#525252', bg: '#f5f5f5', border: '#e5e5e5' },
  info:    { color: '#1d4ed8', bg: '#eff6ff', border: '#dbeafe' },
  primary: { color: '#6d28d9', bg: '#f5f3ff', border: '#ede9fe' },
  warning: { color: '#b45309', bg: '#fffbeb', border: '#fef3c7' },
  cyan:    { color: '#0e7490', bg: '#ecfeff', border: '#cffafe' },
  success: { color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  error:   { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
};

export function AdminKanbanBoard({ children, sx, ...other }) {
  return (
    <Box sx={{ height: 'calc(100vh - 280px)', minHeight: 560, display: 'flex', ...sx }} {...other}>
      <Scrollbar sx={{ flex: 1 }}>
        <Stack direction="row" sx={{ height: '100%', pb: 2, px: '2px', gap: '10px', alignItems: 'stretch' }}>
          {children}
        </Stack>
      </Scrollbar>
    </Box>
  );
}

export function AdminKanbanColumn({
  title,
  subtitle,
  badgeTone = 'neutral',
  count,
  totalCount,
  hasFilter,
  rightSlot,
  footer,
  isOver,
  nodeRef,
  children,
}) {
  const badge = BADGE_TONE[badgeTone] ?? BADGE_TONE.neutral;
  const titleColor =
    badgeTone === 'success' ? 'success.dark' : badgeTone === 'error' ? 'error.dark' : 'text.primary';

  return (
    <Box
      ref={nodeRef}
      sx={{
        flex: '0 0 auto',
        width: COLUMN_WIDTH,
        bgcolor: '#F9FAFB',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          height: 52,
          pl: '14px', pr: '10px',
          gap: '8px',
          borderBottom: '1px solid rgba(145,158,171,0.16)',
          bgcolor: 'background.paper',
          borderRadius: '12px 12px 0 0',
          flexShrink: 0,
        }}
      >
        <Typography
          noWrap
          sx={{
            fontWeight: 700, fontSize: 13.5, color: titleColor,
            letterSpacing: '-0.01em', lineHeight: 1,
          }}
        >
          {title}
        </Typography>

        {typeof count === 'number' && (
          <Box
            sx={{
              px: '7px', py: '1px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '999px',
              bgcolor: badge.bg, color: badge.color,
              border: '1px solid', borderColor: badge.border,
              fontSize: 11, fontWeight: 700,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              letterSpacing: '-0.02em', lineHeight: 1,
              minWidth: 24,
            }}
          >
            {hasFilter && typeof totalCount === 'number' ? `${count}/${totalCount}` : count}
          </Box>
        )}

        {subtitle && (
          <Typography
            noWrap
            sx={{
              color: 'text.secondary',
              fontWeight: 600, fontSize: 10,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              letterSpacing: '-0.01em',
            }}
          >
            {subtitle}
          </Typography>
        )}

        <Box sx={{ flex: 1 }} />
        {rightSlot}
      </Stack>

      {/* Body */}
      <Scrollbar
        sx={{
          flex: 1, minHeight: 0,
          bgcolor: isOver ? '#D8FBDE' : 'transparent',
          outline: isOver ? '1.5px dashed #22C55E' : 'none',
          outlineOffset: '-4px',
          transition: 'background-color .15s, outline .15s',
        }}
      >
        <Stack sx={{ p: '6px', gap: '6px' }}>
          {children}
          {footer}
        </Stack>
      </Scrollbar>
    </Box>
  );
}

export function AdminKanbanCard({
  children,
  isDragging = false,
  nodeRef,
  dragProps,
  transform,
  sx,
  ...other
}) {
  return (
    <Box
      ref={nodeRef}
      {...dragProps}
      {...other}
      sx={(theme) => ({
        position: 'relative',
        bgcolor: 'background.paper',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow:
          '0 0 2px 0 rgba(145,158,171,0.2), 0 4px 8px -2px rgba(145,158,171,0.08)',
        cursor: 'grab',
        touchAction: 'manipulation',
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition:
          'box-shadow .15s cubic-bezier(0.4,0,0.2,1), transform .15s cubic-bezier(0.4,0,0.2,1), border-color .15s',
        '&:active': { cursor: 'grabbing' },
        '&:hover': {
          boxShadow: '0 0 2px 0 rgba(34,197,94,0.32), 0 12px 24px -4px rgba(34,197,94,0.12)',
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y - 2}px, 0)`
            : 'translateY(-2px)',
          zIndex: 2,
        },
        ...(isDragging && {
          opacity: 0.6,
          boxShadow: theme.vars?.customShadows?.z20 ?? '0 12px 32px -4px rgba(0,0,0,0.2)',
          zIndex: 10,
        }),
        ...sx,
      })}
    >
      {children}
    </Box>
  );
}
