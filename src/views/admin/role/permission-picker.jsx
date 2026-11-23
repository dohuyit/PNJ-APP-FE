// src/views/admin/role/permission-picker.jsx
// Picker dạng group card — thay cho ma trận module × action cũ.
// UX: thanh group pill ở trên + ô tìm kiếm + danh sách card group collapsible.

'use client';

import { useMemo, useState } from 'react';

import {
  Box, Button, InputAdornment, Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { m, AnimatePresence, fadeIn, staggerContainer } from 'src/views/admin/_shared/motion';

import {
  PERMISSION_GROUPS, PERMISSION_ACTIONS, PERMISSION_MAP,
  getPermissionsByGroup, ALL_PERMISSION_KEYS,
} from 'src/constants/permissions';

// ---------- small bits ----------

function GroupPill({ group, active, grantedCount, totalCount, onClick }) {
  const pct = totalCount > 0 ? grantedCount / totalCount : 0;
  const state = pct === 1 ? 'full' : pct > 0 ? 'partial' : 'empty';
  const dotColor =
    state === 'full' ? group.color
    : state === 'partial' ? '#D97706'
    : 'rgba(100,116,139,.35)';

  return (
    <m.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
    >
      <Box sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.75,
        px: 1.25, py: 0.75,
        bgcolor: active ? group.color + '12' : 'background.paper',
        border: 1,
        borderColor: active ? group.color + '66' : 'divider',
        borderRadius: 1,
        transition: 'background-color .18s, border-color .18s',
      }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: dotColor }} />
        <Iconify icon={group.icon} width={13} sx={{ color: active ? group.color : 'text.secondary' }} />
        <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: active ? group.color : 'text.primary' }}>
          {group.label}
        </Typography>
        <Typography sx={{
          fontSize: 10, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
          color: 'text.disabled',
          bgcolor: active ? 'background.paper' : 'grey.100',
          px: 0.5, borderRadius: 0.5,
        }}>
          {grantedCount}/{totalCount}
        </Typography>
      </Box>
    </m.button>
  );
}

function PermissionChip({ perm, checked, accent, onToggle }) {
  const action = PERMISSION_ACTIONS[perm.action] ?? PERMISSION_ACTIONS.view;
  return (
    <m.div
      layout
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    >
      <Tooltip title={perm.description || perm.key} placement="top" arrow>
        <Box
          onClick={onToggle}
          role="button"
          aria-pressed={checked}
          sx={{
            position: 'relative',
            display: 'flex', alignItems: 'center', gap: 0.75,
            px: 1, py: 0.625,
            bgcolor: checked ? accent + '14' : 'background.paper',
            border: 1,
            borderColor: checked ? accent + '55' : 'divider',
            borderRadius: 1,
            cursor: 'pointer',
            transition: 'background-color .18s, border-color .18s',
            '&:hover': {
              borderColor: checked ? accent + '88' : 'text.disabled',
              bgcolor: checked ? accent + '1F' : 'grey.50',
            },
            minHeight: 34,
          }}
        >
          <Box sx={{
            width: 18, height: 18, borderRadius: 0.5,
            bgcolor: checked ? accent + '22' : 'grey.100',
            color: checked ? accent : action.color,
            display: 'grid', placeItems: 'center', flexShrink: 0,
            transition: 'background-color .18s, color .18s',
          }}>
            <Iconify icon={action.icon} width={10} />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
              {perm.label}
            </Typography>
            <Typography sx={{ fontSize: 9.5, color: 'text.disabled', fontFamily: 'monospace', lineHeight: 1.1 }}>
              {perm.key}
            </Typography>
          </Box>

          <Box sx={{
            width: 14, height: 14, borderRadius: 0.5,
            border: 1,
            borderColor: checked ? accent : 'divider',
            bgcolor: checked ? accent : 'transparent',
            color: 'common.white',
            display: 'grid', placeItems: 'center',
            flexShrink: 0,
            transition: 'all .18s',
          }}>
            <AnimatePresence initial={false}>
              {checked && (
                <m.div
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'flex' }}
                >
                  <Iconify icon="solar:check-read-linear" width={10} />
                </m.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Tooltip>
    </m.div>
  );
}

function GroupCard({ group, perms, selected, accent, onToggle, onToggleGroup }) {
  const granted = perms.filter((p) => selected.has(p.key)).length;
  const total = perms.length;
  const pct = total > 0 ? (granted / total) * 100 : 0;
  const allOn = total > 0 && granted === total;

  return (
    <m.div variants={fadeIn}>
      <Box sx={{
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderLeft: 3, borderLeftColor: pct === 100 ? group.color : pct > 0 ? '#F59E0B' : 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}>
        {/* header */}
        <Stack direction="row" alignItems="center" spacing={1.25}
          sx={{ px: 1.75, py: 1.25, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}
        >
          <Box sx={{
            width: 30, height: 30, borderRadius: 1,
            bgcolor: group.color + '14', color: group.color,
            display: 'grid', placeItems: 'center',
          }}>
            <Iconify icon={group.icon} width={15} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
              {group.label}
            </Typography>
            <Typography sx={{ fontSize: 10.5, color: 'text.secondary', mt: 0.1 }}>
              {group.description}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right', mr: 0.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {granted}<Box component="span" sx={{ color: 'text.disabled', fontWeight: 500 }}>/{total}</Box>
            </Typography>
            <Typography sx={{ fontSize: 9.5, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
              quyền
            </Typography>
          </Box>

          <Tooltip title={allOn ? 'Bỏ chọn tất cả trong nhóm' : 'Chọn tất cả trong nhóm'}>
            <Switch
              size="small"
              checked={allOn}
              onChange={(_, v) => onToggleGroup(group.key, v)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: group.color },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: group.color },
              }}
            />
          </Tooltip>
        </Stack>

        {/* progress bar */}
        <Box sx={{ height: 2, bgcolor: 'grey.100', position: 'relative' }}>
          <m.div
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            style={{
              position: 'absolute', top: 0, bottom: 0, left: 0,
              background: pct === 100 ? group.color : '#F59E0B',
              opacity: 0.7,
            }}
          />
        </Box>

        {/* body — grid chips */}
        <Box sx={{ p: 1.25 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: 0.75,
          }}>
            {perms.map((p) => (
              <PermissionChip
                key={p.key}
                perm={p}
                checked={selected.has(p.key)}
                accent={accent}
                onToggle={() => onToggle(p.key)}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </m.div>
  );
}

// ---------- Main ----------

export function PermissionPicker({ value = [], onChange, accentColor = '#2563EB' }) {
  const [activeGroup, setActiveGroup] = useState('all');
  const [search, setSearch] = useState('');

  const selected = useMemo(() => new Set(value), [value]);

  const groupStats = useMemo(() => {
    return PERMISSION_GROUPS.map((g) => {
      const perms = getPermissionsByGroup(g.key);
      const granted = perms.filter((p) => selected.has(p.key)).length;
      return { group: g, perms, granted, total: perms.length };
    });
  }, [selected]);

  const totalGranted = selected.size;
  const totalPerms = ALL_PERMISSION_KEYS.length;

  const visibleGroups = useMemo(() => {
    const base = activeGroup === 'all' ? groupStats : groupStats.filter((g) => g.group.key === activeGroup);
    if (!search.trim()) return base;
    const q = search.trim().toLowerCase();
    return base
      .map(({ group, perms, granted, total }) => ({
        group, granted, total,
        perms: perms.filter((p) =>
          p.key.toLowerCase().includes(q) ||
          p.label.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.perms.length > 0);
  }, [activeGroup, search, groupStats]);

  const toggleOne = (key) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key); else next.add(key);
    onChange?.(Array.from(next));
  };

  const toggleGroup = (groupKey, grant) => {
    const next = new Set(selected);
    getPermissionsByGroup(groupKey).forEach((p) => {
      if (grant) next.add(p.key); else next.delete(p.key);
    });
    onChange?.(Array.from(next));
  };

  const toggleAll = (grant) => {
    onChange?.(grant ? [...ALL_PERMISSION_KEYS] : []);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box sx={{ px: 2, pt: 1.75, pb: 1.5, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography sx={{ fontSize: 22, fontWeight: 700, color: accentColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {totalGranted}
              </Typography>
              <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                / {totalPerms} quyền được cấp
              </Typography>
            </Stack>
            <Box sx={{ mt: 0.75, height: 3, borderRadius: 2, bgcolor: 'grey.200', overflow: 'hidden', maxWidth: 320 }}>
              <m.div
                initial={false}
                animate={{ width: `${(totalGranted / totalPerms) * 100}%` }}
                transition={{ type: 'spring', stiffness: 160, damping: 28 }}
                style={{ height: '100%', background: accentColor, opacity: 0.75 }}
              />
            </Box>
          </Box>

          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            placeholder="Tìm quyền theo tên hoặc key…"
            sx={{ width: { xs: '100%', md: 260 }, bgcolor: 'background.paper' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-linear" width={14} />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={0.75}>
            <Button
              size="small" variant="outlined"
              onClick={() => toggleAll(true)}
              startIcon={<Iconify icon="solar:check-square-linear" width={13} />}
              sx={{ boxShadow: 'none', borderColor: 'divider', fontSize: 11 }}
            >
              Chọn tất cả
            </Button>
            <Button
              size="small" variant="outlined" color="inherit"
              onClick={() => toggleAll(false)}
              startIcon={<Iconify icon="solar:close-square-linear" width={13} />}
              sx={{ boxShadow: 'none', borderColor: 'divider', fontSize: 11 }}
            >
              Bỏ hết
            </Button>
          </Stack>
        </Stack>

        {/* Group pills */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          <m.button
            onClick={() => setActiveGroup('all')}
            whileTap={{ scale: 0.97 }}
            style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75,
              px: 1.25, py: 0.75,
              bgcolor: activeGroup === 'all' ? accentColor + '12' : 'background.paper',
              border: 1,
              borderColor: activeGroup === 'all' ? accentColor + '66' : 'divider',
              borderRadius: 1,
            }}>
              <Iconify icon="solar:widget-5-linear" width={13} sx={{ color: activeGroup === 'all' ? accentColor : 'text.secondary' }} />
              <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: activeGroup === 'all' ? accentColor : 'text.primary' }}>
                Tất cả
              </Typography>
              <Typography sx={{
                fontSize: 10, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                color: 'text.disabled',
                bgcolor: activeGroup === 'all' ? 'background.paper' : 'grey.100',
                px: 0.5, borderRadius: 0.5,
              }}>
                {totalGranted}/{totalPerms}
              </Typography>
            </Box>
          </m.button>

          {groupStats.map(({ group, granted, total }) => (
            <GroupPill
              key={group.key}
              group={group}
              active={activeGroup === group.key}
              grantedCount={granted}
              totalCount={total}
              onClick={() => setActiveGroup(group.key)}
            />
          ))}
        </Box>
      </Box>

      {/* Groups body */}
      <Box sx={{ p: { xs: 1.5, md: 2 }, bgcolor: 'grey.50', maxHeight: { md: 'calc(100vh - 360px)' }, overflowY: 'auto' }}>
        <m.div variants={staggerContainer(0.05, 0.02)} initial="hidden" animate="show">
          <Stack spacing={1.5}>
            <AnimatePresence initial={false}>
              {visibleGroups.length === 0 ? (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Box sx={{
                    textAlign: 'center', py: 6,
                    bgcolor: 'background.paper', border: 1, borderColor: 'divider',
                    borderRadius: 1, color: 'text.disabled',
                  }}>
                    <Iconify icon="solar:magnifer-linear" width={28} sx={{ mb: 1 }} />
                    <Typography sx={{ fontSize: 12.5 }}>Không có quyền nào khớp với "{search}"</Typography>
                  </Box>
                </m.div>
              ) : (
                visibleGroups.map(({ group, perms }) => (
                  <GroupCard
                    key={group.key}
                    group={group}
                    perms={perms}
                    selected={selected}
                    accent={accentColor}
                    onToggle={toggleOne}
                    onToggleGroup={toggleGroup}
                  />
                ))
              )}
            </AnimatePresence>
          </Stack>
        </m.div>
      </Box>
    </Box>
  );
}
