// src/components/common/skeletons/detail-skeleton.jsx
// Skeleton cho các view detail (order-detail, customer-360, product-edit…): header + tabs + 2-column body.
import { Box, Grid, Skeleton, Stack, Divider } from '@mui/material';

export function DetailSkeleton({
  withTabs = true,
  tabCount = 4,
  leftSections = 3,
  rightSections = 2,
}) {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      {/* Header: breadcrumb + title row + actions */}
      <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Skeleton variant="text" width={72} />
          <Skeleton variant="text" width={8} />
          <Skeleton variant="text" width={96} />
          <Skeleton variant="text" width={8} />
          <Skeleton variant="text" width={120} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Skeleton variant="rounded" width={56} height={56} sx={{ borderRadius: 1 }} />
            <Stack spacing={0.75}>
              <Skeleton variant="text" width={280} sx={{ fontSize: 22 }} />
              <Stack direction="row" spacing={1}>
                <Skeleton variant="rounded" width={72} height={20} />
                <Skeleton variant="rounded" width={88} height={20} />
                <Skeleton variant="text" width={140} />
              </Stack>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={96} height={32} />
            <Skeleton variant="rounded" width={112} height={32} />
          </Stack>
        </Stack>
      </Box>

      {/* Tabs */}
      {withTabs && (
        <Box sx={{ px: { xs: 2, md: 3 }, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} sx={{ py: 1.25 }}>
            {Array.from({ length: tabCount }).map((_, i) => (
              <Skeleton key={i} variant="text" width={72 + (i % 3) * 18} />
            ))}
          </Stack>
        </Box>
      )}

      {/* Body 2 cột */}
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ borderRight: { md: 1 }, borderColor: 'divider' }}>
          <Stack divider={<Divider />}>
            {Array.from({ length: leftSections }).map((_, i) => (
              <Box key={i} sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Skeleton variant="rounded" width={28} height={28} />
                  <Skeleton variant="text" width={160} sx={{ fontSize: 15 }} />
                </Stack>
                <Stack spacing={1.25}>
                  <Skeleton variant="rectangular" height={14} sx={{ borderRadius: 0.5 }} />
                  <Skeleton variant="rectangular" height={14} width="88%" sx={{ borderRadius: 0.5 }} />
                  <Skeleton variant="rectangular" height={14} width="72%" sx={{ borderRadius: 0.5 }} />
                </Stack>
                <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
                  {Array.from({ length: 4 }).map((__, j) => (
                    <Grid key={j} size={{ xs: 6, sm: 3 }}>
                      <Skeleton variant="text" width={64} sx={{ fontSize: 11 }} />
                      <Skeleton variant="text" width={88} sx={{ fontSize: 15 }} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack divider={<Divider />}>
            {Array.from({ length: rightSections }).map((_, i) => (
              <Box key={i} sx={{ p: { xs: 2, md: 2.5 } }}>
                <Skeleton variant="text" width={120} sx={{ fontSize: 13, mb: 1.5 }} />
                <Stack spacing={1}>
                  {Array.from({ length: 4 }).map((__, j) => (
                    <Stack key={j} direction="row" justifyContent="space-between">
                      <Skeleton variant="text" width={88} />
                      <Skeleton variant="text" width={64} />
                    </Stack>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
