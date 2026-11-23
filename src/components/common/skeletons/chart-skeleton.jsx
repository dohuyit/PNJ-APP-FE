// src/components/common/skeletons/chart-skeleton.jsx
// Skeleton cho vùng chart: title + tabs + chart area + legend.
import { Box, Skeleton, Stack } from '@mui/material';

export function ChartSkeleton({
  height = 320,
  variant = 'bars', // 'bars' | 'line' | 'area'
  withLegend = true,
  withTabs = true,
  withHeader = true,
}) {
  const bars = Array.from({ length: 14 }).map((_, i) => {
    // seed cao độ không nhảy lệch nhau quá nhiều — nhìn organic
    const h = 24 + ((i * 29) % 70);
    return (
      <Skeleton
        key={i}
        variant="rectangular"
        width={`${100 / 14 - 1.2}%`}
        height={`${h}%`}
        sx={{ borderRadius: 0.5, alignSelf: 'flex-end' }}
      />
    );
  });

  return (
    <Box sx={{ p: { xs: 2, md: 2.5 } }}>
      {withHeader && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Stack spacing={0.5}>
            <Skeleton variant="text" width={200} sx={{ fontSize: 15 }} />
            <Skeleton variant="text" width={280} sx={{ fontSize: 12 }} />
          </Stack>
          <Skeleton variant="rounded" width={120} height={28} />
        </Stack>
      )}
      {withTabs && (
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width={72} height={24} />
          ))}
        </Stack>
      )}
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 0.75,
          borderBottom: 1,
          borderLeft: 1,
          borderColor: 'divider',
          px: 1.5,
          pt: 2,
          pb: 1,
        }}
      >
        {variant === 'bars' ? bars : (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="88%"
            sx={{ borderRadius: 1, alignSelf: 'flex-end' }}
          />
        )}
      </Box>
      {withLegend && (
        <Stack direction="row" spacing={2} sx={{ mt: 1.5 }} flexWrap="wrap" rowGap={1}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Stack key={i} direction="row" alignItems="center" spacing={0.75}>
              <Skeleton variant="circular" width={10} height={10} />
              <Skeleton variant="text" width={64 + (i % 3) * 18} />
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
