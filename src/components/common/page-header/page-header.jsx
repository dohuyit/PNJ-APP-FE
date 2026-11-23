// src/components/common/page-header/page-header.jsx
// Inline title style — khớp với order list view: fontSize 18 + subtitle 12, bỏ breadcrumbs.
'use client';

import { Box, Stack, Typography } from '@mui/material';

/**
 * @param {{
 *   title: React.ReactNode, subtitle?: React.ReactNode,
 *   breadcrumbs?: Array<{label:string,href?:string}>, // nhận prop nhưng không render (BC)
 *   actions?: React.ReactNode, sx?: any,
 * }} props
 */
export function PageHeader({ title, subtitle, actions, sx }) {
  return (
    <Box
      sx={[
        {
          px: { xs: 2, md: 2.5 },
          py: 2,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Stack
        direction="row" alignItems="center" spacing={1.5}
        flexWrap="wrap" rowGap={1}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions}
      </Stack>
    </Box>
  );
}
