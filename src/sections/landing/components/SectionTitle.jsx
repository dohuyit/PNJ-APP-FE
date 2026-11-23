'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { landingTokens } from 'src/theme/landing';

export default function SectionTitle({ eyebrow, title, subtitle, align = 'center', action }) {
  const isCenter = align === 'center';
  return (
    <Stack
      direction={{ xs: 'column', md: action ? 'row' : 'column' }}
      alignItems={{ xs: isCenter ? 'center' : 'flex-start', md: action ? 'flex-end' : isCenter ? 'center' : 'flex-start' }}
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: { xs: 4, md: 6 } }}
    >
      <Box sx={{ textAlign: { xs: align, md: action ? 'left' : align }, maxWidth: 720 }}>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{ color: landingTokens.GOLD_DARK, display: 'block', mb: 1 }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h3" component="h2" sx={{ fontSize: { xs: 28, md: 40 }, lineHeight: 1.15 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, lineHeight: 1.65 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Stack>
  );
}
