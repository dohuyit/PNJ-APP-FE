// src/components/common/skeletons/list-rows-skeleton.jsx
// Skeleton cho các card list-item (top products, recent orders, low stock, search no-result, alerts…).
// Mỗi row: leading icon/avatar + name + meta + trailing (value / chip / progress).
import { Box, Skeleton, Stack } from '@mui/material';

export function ListRowsSkeleton({
  count = 6,
  leadingSize = 36,
  leadingShape = 'rounded', // 'rounded' | 'circular'
  withTrailing = true,
  withProgress = false,
  rowBg = 'grey.50',
  rowBordered = true,
  spacing = 1,
}) {
  return (
    <Stack spacing={spacing}>
      {Array.from({ length: count }).map((_, i) => {
        // Pseudo-random widths — nhìn organic, không đồng đều
        const titleW = 58 + ((i * 17) % 32);
        const metaW  = 38 + ((i * 11) % 30);
        return (
          <Stack
            key={i}
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              p: 1.25,
              borderRadius: 1.5,
              bgcolor: rowBg,
              border: rowBordered ? 1 : 0,
              borderColor: 'divider',
            }}
          >
            <Skeleton
              variant={leadingShape === 'circular' ? 'circular' : 'rounded'}
              width={leadingSize}
              height={leadingSize}
              sx={{ borderRadius: leadingShape === 'circular' ? '50%' : 1, flexShrink: 0 }}
            />
            <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" width={`${titleW}%`} sx={{ fontSize: 13 }} />
              <Skeleton variant="text" width={`${metaW}%`} sx={{ fontSize: 11 }} />
            </Stack>
            {withProgress && (
              <Box sx={{ width: 60, flexShrink: 0 }}>
                <Skeleton variant="rounded" height={6} sx={{ borderRadius: 3 }} />
              </Box>
            )}
            {withTrailing && (
              <Stack spacing={0.5} alignItems="flex-end" sx={{ flexShrink: 0 }}>
                <Skeleton variant="rounded" width={56} height={18} />
                <Skeleton variant="text" width={40} sx={{ fontSize: 10 }} />
              </Stack>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}
