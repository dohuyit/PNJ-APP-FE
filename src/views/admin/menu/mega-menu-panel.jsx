// src/views/admin/menu/mega-menu-panel.jsx
// Shared 1:1 visual rendering of a PNJ-style mega-menu panel.
// Props: panel object (columns[], banner?, service_callouts[]) · tone override · dense mode.
// Used by:
//   - admin MegaMenuBuilder preview column
//   - admin menu-list-view card preview
//   - landing <MegaMenu> header component (import from sections/landing)

'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { MuiIcon } from 'src/components/common/icon-picker';

// Render icon field có thể là MUI registry name hoặc iconify string hoặc URL
// — MuiIcon tự fallback cho cả 3 case.
function MenuIcon({ icon, width = 16, sx }) {
  if (!icon) return null;
  return <MuiIcon name={icon} width={width} sx={sx} />;
}

// ───────────────── Primary sidebar (left column) ─────────────────

function PrimarySidebar({ primaries, activeId, onHover, onClick, dense }) {
  return (
    <Stack
      spacing={0.25}
      sx={{
        width: dense ? 170 : 210,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        py: 1,
        pr: 0.5,
      }}
    >
      {primaries.map((p) => {
        const active = p.id === activeId;
        return (
          <Box
            key={p.id}
            onMouseEnter={() => onHover?.(p.id)}
            onClick={() => onClick?.(p)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1.25,
              py: dense ? 0.75 : 1,
              borderRadius: 1,
              cursor: 'pointer',
              bgcolor: active ? 'action.selected' : 'transparent',
              '&:hover': { bgcolor: 'action.hover' },
              transition: 'background-color .15s ease',
            }}
          >
            {p.icon && (
              <Box sx={{ width: 20, display: 'grid', placeItems: 'center', color: active ? 'primary.main' : 'text.secondary' }}>
                <MenuIcon icon={p.icon} width={16} />
              </Box>
            )}
            <Typography sx={{ fontSize: dense ? 12 : 13, fontWeight: active ? 700 : 500, color: active ? 'primary.main' : 'text.primary', flex: 1 }} noWrap>
              {p.label}
            </Typography>
            {p.badge && (
              <Chip
                label={p.badge.text}
                size="small"
                sx={{
                  height: 16,
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 0.4,
                  bgcolor: p.badge.color ?? '#EF4444',
                  color: '#fff',
                  '& .MuiChip-label': { px: 0.6 },
                }}
              />
            )}
          </Box>
        );
      })}
    </Stack>
  );
}

// ───────────────── Entry (text / brand_chip / co_brand) ─────────────────

function EntryItem({ entry, dense }) {
  if (entry.kind === 'brand_chip') {
    return (
      <Box
        component={Link}
        href={entry.url ?? '#'}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1.75,
          py: 0.85,
          minWidth: 80,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          textDecoration: 'none',
          color: 'text.primary',
          bgcolor: 'background.paper',
          transition: 'all .15s ease',
          '&:hover': { borderColor: 'primary.main', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
        }}
      >
        {entry.logo_url ? (
          <Box component="img" src={entry.logo_url} alt={entry.label} sx={{ height: 20, maxWidth: 60, objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4 }}>
            {entry.label}
          </Typography>
        )}
      </Box>
    );
  }
  if (entry.kind === 'co_brand') {
    return (
      <Box
        component={Link}
        href={entry.url ?? '#'}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1.5,
          py: 0.75,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          textDecoration: 'none',
          color: 'text.primary',
          bgcolor: 'background.paper',
          minHeight: 32,
          transition: 'all .15s ease',
          '&:hover': { borderColor: 'primary.main', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
        }}
      >
        {entry.logo_url ? (
          <Box component="img" src={entry.logo_url} alt={entry.partner_name} sx={{ height: 18, maxWidth: 80, objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3, color: 'text.secondary' }}>
            PNJ × {entry.partner_name}
          </Typography>
        )}
      </Box>
    );
  }
  // Default: text entry
  return (
    <Box
      component={Link}
      href={entry.url ?? '#'}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        py: dense ? 0.4 : 0.5,
        textDecoration: 'none',
        color: 'text.primary',
        fontSize: dense ? 12.5 : 13,
        fontWeight: 400,
        transition: 'color .15s ease',
        '&:hover': { color: 'primary.main' },
      }}
    >
      <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
        {entry.label}
      </Typography>
      {entry.badge && (
        <Chip
          label={entry.badge}
          size="small"
          sx={{ height: 14, fontSize: 8.5, fontWeight: 800, bgcolor: '#FEE2E2', color: '#B91C1C', '& .MuiChip-label': { px: 0.5 } }}
        />
      )}
    </Box>
  );
}

// ───────────────── Column (heading + entries) ─────────────────

function MegaColumn({ column, dense }) {
  const isChipKind = column.entries.some((e) => e.kind === 'brand_chip' || e.kind === 'co_brand');
  return (
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: dense ? 1 : 1.5 }}>
        {column.heading_icon && (
          <MenuIcon icon={column.heading_icon} width={14} sx={{ color: 'text.disabled' }} />
        )}
        <Typography
          sx={{
            fontSize: dense ? 11 : 12,
            fontWeight: 800,
            letterSpacing: 0.3,
            color: 'text.primary',
            textTransform: 'uppercase',
          }}
        >
          {column.heading}
        </Typography>
      </Stack>
      {isChipKind ? (
        <Stack spacing={1}>
          {column.entries.map((entry) => (
            <EntryItem key={entry.id} entry={entry} dense={dense} />
          ))}
        </Stack>
      ) : (
        <Stack spacing={dense ? 0 : 0.25}>
          {column.entries.map((entry) => (
            <EntryItem key={entry.id} entry={entry} dense={dense} />
          ))}
        </Stack>
      )}
    </Box>
  );
}

// ───────────────── Banner (right-side promotional image + CTA) ─────────────────

function PanelBanner({ banner, dense }) {
  const widthPct = banner.width_pct ?? 36;
  return (
    <Box
      component={banner.cta_url ? Link : 'div'}
      href={banner.cta_url || undefined}
      sx={{
        flexShrink: 0,
        width: `${widthPct}%`,
        minHeight: dense ? 260 : 320,
        position: 'relative',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'grey.100',
        backgroundImage: banner.image_url ? `url(${banner.image_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        p: dense ? 2 : 2.5,
        textDecoration: 'none',
        color: '#fff',
        transition: 'transform .3s ease',
        '&:hover': banner.cta_url ? { transform: 'scale(1.015)' } : undefined,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.5) 100%)',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {banner.eyebrow && (
          <Typography sx={{ fontSize: 10, letterSpacing: 2.5, fontWeight: 700, mb: 0.5, opacity: 0.9 }}>
            {banner.eyebrow}
          </Typography>
        )}
        <Typography
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: dense ? 24 : 32,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          {banner.title}
        </Typography>
        {banner.subtitle && (
          <Typography sx={{ fontSize: dense ? 12 : 13, mt: 0.5, opacity: 0.95 }}>
            {banner.subtitle}
          </Typography>
        )}
        {banner.cta_label && (
          <Button
            variant="contained"
            size="small"
            sx={{
              mt: 1.5,
              bgcolor: banner.cta_color ?? '#1A8F4C',
              color: '#fff',
              borderRadius: 999,
              px: 2.5,
              py: 0.75,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.5,
              boxShadow: 'none',
              '&:hover': { bgcolor: banner.cta_color ?? '#1A8F4C', opacity: 0.9, boxShadow: 'none' },
            }}
          >
            {banner.cta_label}
          </Button>
        )}
      </Box>
    </Box>
  );
}

// ───────────────── Service callouts (footer strip) ─────────────────

function ServiceCallouts({ callouts, dense }) {
  if (!callouts?.length) return null;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${callouts.length}, 1fr)`,
        gap: dense ? 1 : 1.5,
        pt: 2,
        mt: 2,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      {callouts.map((c) => (
        <Box
          key={c.id}
          component={c.url ? Link : 'div'}
          href={c.url || undefined}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: dense ? 1.25 : 1.75,
            borderRadius: 1,
            bgcolor: 'grey.50',
            textDecoration: 'none',
            color: 'text.primary',
            transition: 'background-color .15s ease',
            '&:hover': c.url ? { bgcolor: 'action.hover' } : undefined,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              display: 'grid',
              placeItems: 'center',
              color: c.color ?? '#D97706',
              bgcolor: (c.color ?? '#D97706') + '18',
              flexShrink: 0,
            }}
          >
            <Iconify icon={c.icon ?? 'solar:box-bold'} width={20} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 800, lineHeight: 1.1 }}>{c.label}</Typography>
            <Typography sx={{ fontSize: 11.5, color: 'text.secondary', lineHeight: 1.2 }}>{c.sub_label}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// ───────────────── Main panel ─────────────────

/**
 * Render a full mega-menu panel exactly like pnj.com.vn.
 *
 * @param primaries   left sidebar items [{ id, label, icon, url, badge, panel }]
 * @param activePrimaryId  id of highlighted sidebar item
 * @param onHoverPrimary   (id) => void
 * @param onClickPrimary   (primary) => void
 * @param panel       currently-shown mega panel (columns, banner, service_callouts resolved)
 * @param callouts    resolved service-callout objects
 * @param dense       smaller paddings for admin preview; false by default for landing
 * @param emptyState  string shown when primary has no panel (hub links out)
 */
export function MegaMenuPanel({
  primaries = [],
  activePrimaryId,
  onHoverPrimary,
  onClickPrimary,
  panel,
  callouts = [],
  dense = false,
  emptyState = 'Mục này mở trang hub riêng — không có mega-panel.',
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        minHeight: dense ? 360 : 440,
      }}
    >
      <PrimarySidebar
        primaries={primaries}
        activeId={activePrimaryId}
        onHover={onHoverPrimary}
        onClick={onClickPrimary}
        dense={dense}
      />

      <Box sx={{ flex: 1, p: dense ? 2 : 3, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {panel ? (
          <>
            <Box sx={{ display: 'flex', gap: dense ? 2.5 : 4, flex: 1 }}>
              <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${Math.min(panel.columns.length, 4)}, minmax(0, 1fr))`, columnGap: dense ? 2 : 3, rowGap: 2 }}>
                {panel.columns.map((col) => (
                  <MegaColumn key={col.id} column={col} dense={dense} />
                ))}
              </Box>
              {panel.banner && <PanelBanner banner={panel.banner} dense={dense} />}
            </Box>

            <ServiceCallouts callouts={callouts} dense={dense} />
          </>
        ) : (
          <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', color: 'text.disabled' }}>
            <Stack alignItems="center" spacing={1}>
              <Iconify icon="solar:link-linear" width={28} />
              <Typography variant="body2">{emptyState}</Typography>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ───────────────── Compact preview tile (for menu-list-view cards) ─────────────────

export function MegaMenuMini({ panel, maxCols = 3 }) {
  if (!panel) return null;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(panel.columns.length, maxCols)}, 1fr)`,
        gap: 1,
        p: 1.25,
        bgcolor: 'grey.50',
        borderRadius: 1,
      }}
    >
      {panel.columns.slice(0, maxCols).map((col) => (
        <Box key={col.id} sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary', letterSpacing: 0.4, mb: 0.5 }} noWrap>
            {col.heading}
          </Typography>
          <Stack spacing={0}>
            {col.entries.slice(0, 4).map((e) => (
              <Typography key={e.id} sx={{ fontSize: 10.5, color: 'text.primary' }} noWrap>
                · {e.label ?? e.partner_name ?? e.brand_slug}
              </Typography>
            ))}
            {col.entries.length > 4 && (
              <Typography sx={{ fontSize: 9.5, color: 'text.disabled' }}>
                +{col.entries.length - 4} khác
              </Typography>
            )}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

// Re-export for brevity in builders.
export { Divider };
