// src/components/common/skeletons/kpi-cards-skeleton.jsx
// Skeleton cho hàng KPI card (dashboard, hub views).
import { Box, Grid, Skeleton, Stack } from '@mui/material';

/**
 * mode:
 *  - 'inline' (mặc định) — cell gắn liền, chia bởi border (dùng trong KPI-row list-view).
 *  - 'standalone' — mỗi KPI là card riêng, nền trắng + shadow + border radius (dùng trong dashboard).
 */
export function KpiCardsSkeleton({
  count = 4,
  withBorder = true,
  mode = 'inline',
  spacing = 2,
  size,
}) {
  const standalone = mode === 'standalone';
  const perRow = Math.min(count, 4);
  const cellSize = size ?? { xs: 12, sm: 6, md: 4, lg: 12 / perRow };

  const cellSx = standalone
    ? {
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2.5,
        boxShadow: '0 1px 2px rgba(145, 158, 171, 0.08)',
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }
    : {
        position: 'relative',
        borderRightWidth: withBorder
          ? { xs: 0, md: (0 + 1) % perRow === 0 ? 0 : 1 } // placeholder; overridden per-cell below
          : 0,
        borderRightStyle: 'solid',
        borderRightColor: 'grey.200',
        borderBottomWidth: withBorder ? 1 : 0,
        borderBottomStyle: 'solid',
        borderBottomColor: 'grey.100',
        px: 2,
        py: 1.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      };

  return (
    <Grid container spacing={standalone ? spacing : 0}>
      {Array.from({ length: count }).map((_, i) => {
        const isLastInRow = (i + 1) % perRow === 0;
        const perCellSx = standalone
          ? cellSx
          : {
              ...cellSx,
              borderRightWidth: withBorder ? { xs: 0, md: isLastInRow ? 0 : 1 } : 0,
            };
        return (
          <Grid key={i} size={cellSize}>
            <Box sx={perCellSx}>
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Skeleton variant="text" width={88} sx={{ fontSize: 10.5 }} />
                <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: 0.75 }} />
              </Stack>
              <Skeleton variant="text" width={120} sx={{ fontSize: standalone ? 24 : 26 }} />
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1 }}>
                <Skeleton variant="rounded" width={14} height={14} />
                <Skeleton variant="text" width={36} />
                <Skeleton variant="text" width={72} />
              </Stack>
              <Skeleton variant="text" width="88%" sx={{ fontSize: 11, mt: 0.75 }} />
              <Skeleton variant="text" width="64%" sx={{ fontSize: 11 }} />
              {standalone && (
                <Box sx={{ mt: 1.25 }}>
                  <Skeleton variant="rectangular" height={44} sx={{ borderRadius: 1 }} />
                </Box>
              )}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}
