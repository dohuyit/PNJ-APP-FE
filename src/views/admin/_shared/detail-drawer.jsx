// src/views/admin/_shared/detail-drawer.jsx
// Shell dùng chung cho mọi drawer "xem chi tiết" (product / order / customer…).
// Pattern: right-anchored, clamped để không tràn qua sidebar, header + tabs + body + footer.
//
// Props:
//   open, onClose
//   title (string | ReactNode)
//   subtitle (ReactNode)
//   icon (iconify string — hiện trong avatar góc trái)
//   accent (hex color — màu nhận diện module)
//   headerActions (ReactNode — chip status, action buttons)
//   tabs: [{ value, label, icon, count?, content: ReactNode }]
//   defaultTab (value)
//   footer (ReactNode — thường là action buttons)
//   width (number|string, default 720)

'use client';

import { useEffect, useState } from 'react';

import { Box, Drawer, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function DetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  icon,
  accent = '#2563EB',
  headerActions,
  tabs = [],
  defaultTab,
  footer,
  width = 720,
}) {
  const [tab, setTab] = useState(defaultTab ?? tabs[0]?.value);

  useEffect(() => {
    if (open) setTab(defaultTab ?? tabs[0]?.value);
  }, [open, defaultTab, tabs]);

  const activeTab = tabs.find((t) => t.value === tab);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiBackdrop-root': {
          left: { xs: 0, md: 'var(--layout-nav-vertical-width, 280px)' },
        },
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: typeof width === 'number' ? `${width}px` : width },
          maxWidth: { xs: '100%', md: 'calc(100vw - var(--layout-nav-vertical-width, 280px) - 24px)' },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ px: 2.5, py: 2 }}>
          {icon && (
            <Box sx={{
              width: 36, height: 36, borderRadius: 0.75,
              bgcolor: accent + '14', color: accent,
              display: 'grid', placeItems: 'center',
              flexShrink: 0,
            }}>
              <Iconify icon={icon} width={18} />
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }} noWrap>
              {title}
            </Typography>
            {subtitle && (
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {headerActions && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
              {headerActions}
            </Stack>
          )}
          <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
            <Iconify icon="solar:close-circle-linear" width={16} />
          </IconButton>
        </Stack>

        {/* Tabs */}
        {tabs.length > 0 && (
          <Box sx={{ px: 2.5 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons={false}
              TabIndicatorProps={{ sx: { height: 2, bgcolor: accent } }}
              sx={{
                minHeight: 36,
                '& .MuiTabs-flexContainer': { gap: 0 },
                '& .MuiTab-root': {
                  minHeight: 36, minWidth: 'auto', fontWeight: 500, fontSize: 12.5,
                  textTransform: 'none', px: 1.25, mr: 0.5,
                  color: 'text.secondary',
                  '&.Mui-selected': { color: accent, fontWeight: 600 },
                },
              }}
            >
              {tabs.map((t) => (
                <Tab
                  key={t.value}
                  value={t.value}
                  label={
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      {t.icon && <Iconify icon={t.icon} width={13} />}
                      <span>{t.label}</span>
                      {t.count != null && (
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            minWidth: 18, height: 16, px: 0.5, borderRadius: 0.75,
                            fontSize: 10, fontWeight: 600,
                            bgcolor: tab === t.value ? accent + '14' : 'grey.100',
                            color: tab === t.value ? accent : 'text.disabled',
                          }}
                        >
                          {t.count}
                        </Box>
                      )}
                    </Stack>
                  }
                />
              ))}
            </Tabs>
          </Box>
        )}
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.paper' }}>
        {activeTab?.content}
      </Box>

      {/* Footer */}
      {footer && (
        <Stack
          direction="row" spacing={1} alignItems="center"
          sx={{ px: 2.5, py: 1.5, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}
        >
          {footer}
        </Stack>
      )}
    </Drawer>
  );
}

// --- Helper: Section block dùng chung trong tab content ---
export function DetailSection({ title, action, children, sx }) {
  return (
    <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider', ...sx }}>
      {(title || action) && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
          <Typography sx={{
            fontSize: 10.5, fontWeight: 700, color: 'text.disabled',
            letterSpacing: 0.4, textTransform: 'uppercase', flex: 1,
          }}>
            {title}
          </Typography>
          {action}
        </Stack>
      )}
      {children}
    </Box>
  );
}

// --- Helper: Row key-value dùng trong DetailSection ---
export function DetailRow({ label, value, icon, mono }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ py: 0.75 }}>
      {icon && <Iconify icon={icon} width={13} sx={{ color: 'text.disabled', flexShrink: 0 }} />}
      <Typography sx={{ fontSize: 11.5, color: 'text.secondary', minWidth: 120, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize: 12.5, color: 'text.primary', fontWeight: 500,
        flex: 1, textAlign: 'right',
        fontFamily: mono ? 'ui-monospace, "SF Mono", Menlo, monospace' : undefined,
        fontVariantNumeric: mono ? 'tabular-nums' : undefined,
      }}>
        {value ?? '—'}
      </Typography>
    </Stack>
  );
}
