// src/components/common/skeletons/kanban-skeleton.jsx
// Skeleton cho kanban board: n columns × m cards.
import { Box, Skeleton, Stack } from '@mui/material';

export function KanbanSkeleton({ columnCount = 4, cardsPerColumn = 3, columnWidth = 280 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        overflowX: 'auto',
        p: { xs: 2, md: 2.5 },
        bgcolor: 'background.paper',
      }}
    >
      {Array.from({ length: columnCount }).map((_, col) => (
        <Box
          key={col}
          sx={{
            minWidth: columnWidth,
            maxWidth: columnWidth,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'grey.50',
            flexShrink: 0,
          }}
        >
          {/* Column header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1.5, py: 1.25, borderBottom: 1, borderColor: 'divider' }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Skeleton variant="circular" width={8} height={8} />
              <Skeleton variant="text" width={88} sx={{ fontSize: 13 }} />
              <Skeleton variant="rounded" width={28} height={18} sx={{ borderRadius: 1 }} />
            </Stack>
            <Skeleton variant="rounded" width={20} height={20} />
          </Stack>

          {/* Cards */}
          <Stack spacing={1} sx={{ p: 1 }}>
            {Array.from({ length: cardsPerColumn - (col % 2) }).map((__, i) => (
              <Box
                key={i}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  p: 1.25,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  sx={{ mb: 0.75 }}
                >
                  <Skeleton variant="text" width={72} sx={{ fontSize: 11 }} />
                  <Skeleton variant="rounded" width={48} height={18} />
                </Stack>
                <Skeleton variant="text" width="88%" sx={{ fontSize: 13 }} />
                <Skeleton variant="text" width="64%" sx={{ fontSize: 13 }} />
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1 }}>
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={80} sx={{ fontSize: 11 }} />
                  <Box sx={{ flex: 1 }} />
                  <Skeleton variant="text" width={48} sx={{ fontSize: 11 }} />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
