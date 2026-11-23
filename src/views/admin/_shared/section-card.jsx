// src/views/admin/_shared/section-card.jsx
// Card-như-form-section tái sử dụng cho mọi drawer/form page trong admin.
// Match style đã polish ở product-form.jsx + collection-create-drawer.jsx.

'use client';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Box, Stack, Tooltip, Typography } from '@mui/material';

// Sync với product-form.jsx Section (CARD_SX): radius 1, 1px soft shadow, no hover shadow, grey header.
export function SectionCard({ icon: Ico, title, description, action, children, dense = false }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: '0 1px 0 rgba(145, 158, 171, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{
          px: 2,
          py: 1.25,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        {Ico && (
          <Ico sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
            {title}
          </Typography>
          {description && (
            <Typography sx={{ color: 'text.secondary', display: 'block', mt: 0.25, fontSize: 11.5 }}>
              {description}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
      <Box sx={{ p: dense ? 1.5 : 2, flex: 1 }}>{children}</Box>
    </Box>
  );
}

export function FieldLabel({ children, required, tooltip }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
      <Typography
        sx={{ fontSize: 11.5, fontWeight: 600, color: 'text.secondary', letterSpacing: 0.2 }}
      >
        {children}
        {required && <Box component="span" sx={{ color: 'error.main', ml: 0.25 }}>*</Box>}
      </Typography>
      {tooltip && (
        <Tooltip title={tooltip} arrow placement="top">
          <InfoOutlined sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
        </Tooltip>
      )}
    </Stack>
  );
}
