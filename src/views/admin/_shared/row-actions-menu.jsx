// src/views/admin/_shared/row-actions-menu.jsx — Kebab menu cho action row trong table

'use client';

import { useState } from 'react';

import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

/**
 * @typedef {Object} ActionItem
 * @property {string}   label
 * @property {string}   [icon]       - tên Iconify, vd 'solar:pen-linear'
 * @property {Function} [onClick]
 * @property {string}   [href]       - nếu có, render MenuItem như RouterLink
 * @property {boolean}  [disabled]
 * @property {'error'|'warning'} [color]  - cho destructive hoặc warning
 * @property {boolean}  [divider]    - tạo <Divider /> thay vì item
 * @property {string}   [shortcut]   - hint phím tắt bên phải
 */

/**
 * @param {{ items: ActionItem[], label?: string }} props
 */
export function RowActionsMenu({ items = [], label = 'Thao tác' }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const openMenu = (e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const closeMenu = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        aria-label={label}
        onClick={openMenu}
        sx={{
          width: 32, height: 32,
          color: 'text.secondary',
          '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
        }}
      >
        <Iconify icon="solar:menu-dots-bold" width={20} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
              mt: 0.5,
              borderRadius: 1.5,
              boxShadow: '0 8px 24px rgba(145, 158, 171, 0.18), 0 0 0 1px rgba(145, 158, 171, 0.08)',
              '& .MuiMenuItem-root': { fontSize: 13, py: 0.75 },
              '& .MuiListItemIcon-root': { minWidth: 28 },
            },
          },
        }}
      >
        {items.map((it, i) => {
          if (it.divider) return <Divider key={`d-${i}`} sx={{ my: 0.5 }} />;

          const common = {
            disabled: it.disabled,
            sx: it.color === 'error'
              ? { color: 'error.main', '& .MuiListItemIcon-root': { color: 'error.main' } }
              : it.color === 'warning'
                ? { color: 'warning.dark', '& .MuiListItemIcon-root': { color: 'warning.dark' } }
                : undefined,
            onClick: (e) => { e.stopPropagation(); closeMenu(); it.onClick?.(); },
          };

          const content = (
            <>
              {it.icon && (
                <ListItemIcon>
                  <Iconify icon={it.icon} width={16} />
                </ListItemIcon>
              )}
              <ListItemText primary={it.label} />
              {it.shortcut && (
                <span style={{ marginLeft: 12, fontSize: 11, color: 'rgba(0,0,0,0.4)' }}>{it.shortcut}</span>
              )}
            </>
          );

          return it.href ? (
            <MenuItem key={it.label} component={RouterLink} href={it.href} {...common}>
              {content}
            </MenuItem>
          ) : (
            <MenuItem key={it.label} {...common}>
              {content}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
