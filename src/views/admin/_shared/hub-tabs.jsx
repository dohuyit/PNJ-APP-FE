// src/views/admin/_shared/hub-tabs.jsx — minimal underline tabs cho hub pages
// Style GitHub/Vercel/Linear: inset shadow underline, count pill inline, bg paper, liền viền table.

'use client';

import { Box, Stack } from '@mui/material';

/**
 * @typedef {Object} HubTabItem
 * @property {string}   value
 * @property {string}   label
 * @property {Function} [Icon]   - MUI icon component
 * @property {number|string} [count]
 */

/**
 * @param {{ value: string, onChange: Function, tabs: HubTabItem[] }} props
 */
export function HubTabs({ value, onChange, tabs }) {
  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        px: { xs: 1, md: 2 },
        overflowX: 'auto',
      }}
    >
      {tabs.map((t) => {
        const active = value === t.value;
        return (
          <Box
            key={t.value}
            onClick={() => onChange?.(t.value)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2, py: 1.5,
              cursor: 'pointer',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              color: active ? 'text.primary' : 'text.secondary',
              fontWeight: active ? 600 : 500,
              fontSize: 13,
              lineHeight: 1,
              boxShadow: active ? 'inset 0 -2px 0 currentColor' : 'none',
              transition: 'color .15s ease, background-color .15s ease',
              '&:hover': {
                color: 'text.primary',
                bgcolor: active ? 'transparent' : 'action.hover',
              },
            }}
          >
            {t.Icon && <t.Icon sx={{ fontSize: 16 }} />}
            <span>{t.label}</span>
            {t.count != null && (
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 20,
                  height: 18,
                  px: 0.75,
                  borderRadius: 1,
                  fontSize: 10.5,
                  fontWeight: 600,
                  bgcolor: active ? 'grey.100' : 'grey.100',
                  color: active ? 'text.primary' : 'text.disabled',
                  transition: 'inherit',
                }}
              >
                {t.count}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
