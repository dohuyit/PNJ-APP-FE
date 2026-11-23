'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

import { landingTokens } from 'src/theme/landing';

export default function Wireframe({ label, aspectRatio, width, height, sx, iconSize = 'large', fill }) {
  return (
    <Box
      sx={{
        width: width ?? '100%',
        height: height ?? (aspectRatio ? undefined : '100%'),
        aspectRatio,
        bgcolor: '#EEF0F3',
        color: landingTokens.INK_MUTED,
        display: 'grid',
        placeItems: 'center',
        backgroundImage:
          'linear-gradient(135deg, rgba(0,52,104,0.05) 25%, transparent 25%, transparent 50%, rgba(0,52,104,0.05) 50%, rgba(0,52,104,0.05) 75%, transparent 75%, transparent)',
        backgroundSize: '18px 18px',
        position: fill ? 'absolute' : 'relative',
        inset: fill ? 0 : undefined,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Stack alignItems="center" spacing={0.5} sx={{ textAlign: 'center', px: 1.5 }}>
        <ImageOutlinedIcon fontSize={iconSize} sx={{ opacity: 0.55 }} />
        {label && (
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, letterSpacing: '0.04em', opacity: 0.75, lineHeight: 1.3 }}
          >
            {label}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
