'use client';

import { useRef } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { landingTokens } from 'src/theme/landing';

export default function ScrollSnapRail({ children, itemWidth = { xs: '70%', sm: '45%', md: '28%', lg: '22%' } }) {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7 * (dir === 'next' ? 1 : -1);
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        ref={trackRef}
        sx={{
          display: 'flex',
          gap: { xs: 2, md: 3 },
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollPaddingInline: { xs: 16, md: 0 },
          pb: 1,
        }}
      >
        {Array.isArray(children) ? (
          children.map((child, i) => (
            <Box
              key={i}
              sx={{
                flex: `0 0 ${itemWidth.xs}`,
                scrollSnapAlign: 'start',
                [`@media (min-width:600px)`]: { flex: `0 0 ${itemWidth.sm}` },
                [`@media (min-width:900px)`]: { flex: `0 0 ${itemWidth.md}` },
                [`@media (min-width:1200px)`]: { flex: `0 0 ${itemWidth.lg}` },
              }}
            >
              {child}
            </Box>
          ))
        ) : (
          children
        )}
      </Box>

      <IconButton
        onClick={() => scrollBy('prev')}
        aria-label="Trước"
        sx={{
          position: 'absolute',
          top: '40%',
          left: { xs: -4, md: -24 },
          display: { xs: 'none', md: 'inline-flex' },
          bgcolor: landingTokens.SURFACE,
          border: `1px solid ${landingTokens.HAIRLINE}`,
          '&:hover': { bgcolor: landingTokens.SURFACE, borderColor: landingTokens.GOLD },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <IconButton
        onClick={() => scrollBy('next')}
        aria-label="Tiếp"
        sx={{
          position: 'absolute',
          top: '40%',
          right: { xs: -4, md: -24 },
          display: { xs: 'none', md: 'inline-flex' },
          bgcolor: landingTokens.SURFACE,
          border: `1px solid ${landingTokens.HAIRLINE}`,
          '&:hover': { bgcolor: landingTokens.SURFACE, borderColor: landingTokens.GOLD },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}
