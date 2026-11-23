// src/sections/landing/layout/LandingMegaMenu.jsx
// Header mega-menu for the landing site. Uses the SAME MegaMenuPanel as admin preview,
// so the admin builder's live preview matches the real site 1:1.

'use client';

import Link from 'next/link';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { MegaMenuPanel } from 'src/views/admin/menu/mega-menu-panel';
import { useGetMenuTree, useGetServiceCallouts } from 'src/actions/admin/menu';

// Horizontal audience tabs (Nữ · Nam · Trẻ em)
const AUDIENCES = [
  { key: 'female',   label: 'Nữ',     location: 'mega_female' },
  { key: 'male',     label: 'Nam',    location: 'mega_male' },
  { key: 'kids',     label: 'Trẻ em', location: 'mega_kids' },
];

export function LandingMegaMenu() {
  const [audience, setAudience] = useState('female');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const location = AUDIENCES.find((a) => a.key === audience)?.location ?? 'mega_female';
  const { tree } = useGetMenuTree(location);
  const { callouts: allCallouts } = useGetServiceCallouts();

  const [activePrimaryId, setActivePrimaryId] = useState(tree.find((p) => p.panel)?.id);
  const activePrimary = tree.find((p) => p.id === activePrimaryId) ?? tree[0];
  const panel = activePrimary?.panel ?? null;
  const resolvedCallouts = (panel?.service_callouts ?? [])
    .map((id) => allCallouts.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Top strip: audience tabs */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          px: { xs: 2, md: 4 },
          py: 1.25,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {AUDIENCES.map((a) => {
          const active = a.key === audience;
          return (
            <Box
              key={a.key}
              ref={(el) => { if (active) setAnchorEl(el); }}
              onMouseEnter={(e) => { setAudience(a.key); setAnchorEl(e.currentTarget); setOpen(true); }}
              onClick={(e) => { setAudience(a.key); setAnchorEl(e.currentTarget); setOpen((o) => !o); }}
              sx={{
                cursor: 'pointer',
                position: 'relative',
                pb: 0.75,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  bgcolor: active ? 'warning.main' : 'transparent',
                  transition: 'background-color .15s ease',
                },
              }}
            >
              <Box
                sx={{
                  fontSize: 15,
                  fontWeight: active ? 800 : 500,
                  color: active ? 'warning.main' : 'text.primary',
                  letterSpacing: 0.3,
                }}
              >
                {a.label}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Mega-panel popper */}
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
        sx={{ zIndex: 1300, width: 'min(1360px, calc(100vw - 48px))' }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={180}>
            <Box
              onMouseLeave={() => setOpen(false)}
              sx={{
                boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Box>
                  <MegaMenuPanel
                    primaries={tree}
                    activePrimaryId={activePrimary?.id}
                    onHoverPrimary={setActivePrimaryId}
                    panel={panel}
                    callouts={resolvedCallouts}
                  />
                </Box>
              </ClickAwayListener>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}

// Quick-access chip row: for small devices or secondary nav, surface popular items.
export function LandingMegaMenuChips({ location = 'mega_female', max = 6 }) {
  const { tree } = useGetMenuTree(location);
  const items = tree.slice(0, max);
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {items.map((p) => (
        <Chip
          key={p.id}
          component={Link}
          href={p.url}
          clickable
          label={p.label}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ))}
    </Box>
  );
}
