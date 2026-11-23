// src/components/common/skeletons/grid-card-skeleton.jsx
// Skeleton grid card (media-library, banner-gallery, review-feed).
import { Box, Grid, Skeleton, Stack } from '@mui/material';

export function GridCardSkeleton({
  count = 12,
  cols = { xs: 6, sm: 4, md: 3, lg: 2 },
  imageHeight = 160,
  withFooter = true,
  aspectRatio, // ví dụ '1 / 1', '16 / 9' — nếu truyền thì bỏ imageHeight
}) {
  return (
    <Grid container spacing={1.5} sx={{ p: { xs: 1.5, md: 2 } }}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={cols}>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
            <Skeleton
              variant="rectangular"
              height={aspectRatio ? undefined : imageHeight}
              sx={aspectRatio ? { aspectRatio, width: '100%' } : undefined}
            />
            {withFooter && (
              <Box sx={{ p: 1.25 }}>
                <Skeleton variant="text" width="78%" sx={{ fontSize: 13 }} />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                  <Skeleton variant="text" width={64} sx={{ fontSize: 11 }} />
                  <Skeleton variant="text" width={40} sx={{ fontSize: 11 }} />
                </Stack>
              </Box>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
