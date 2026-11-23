// src/views/admin/role/role-list-view.jsx
// Trang quản trị Vai trò & Phân quyền — layout 2 panel:
//   [Trái] danh sách vai trò (card)
//   [Phải] PermissionPicker gắn với vai trò đang chọn

'use client';

import { useMemo, useState } from 'react';

import {
  Box, Button, Chip, Grid, IconButton, LinearProgress, Stack, Tooltip, Typography,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { m, staggerContainer, fadeIn } from 'src/views/admin/_shared/motion';

import { Iconify } from 'src/components/iconify';
import { Can } from 'src/components/common/can';

import {
  PERMISSION_GROUPS, ALL_PERMISSION_KEYS, SYSTEM_ROLES,
} from 'src/constants/permissions';

import { RoleFormDrawer } from './role-create-drawer';
import { PermissionPicker } from './permission-picker';

const COLOR_HEX = {
  red:    '#DC2626',
  blue:   '#2563EB',
  purple: '#7C3AED',
  green:  '#059669',
  amber:  '#D97706',
  grey:   '#64748B',
};

// Seed rolesList từ SYSTEM_ROLES + thêm user_count mock
const SEED_ROLES = SYSTEM_ROLES.map((r, i) => ({
  id: r.key,
  user_count: [12, 48, 6, 4, 3, 21][i] ?? 1,
  ...r,
}));

// ---------- Role Card ----------

function RoleCard({ role, active, onClick, grantedCount, totalCount }) {
  const accent = COLOR_HEX[role.color] ?? COLOR_HEX.grey;
  const pct = totalCount > 0 ? (grantedCount / totalCount) * 100 : 0;

  return (
    <m.div variants={fadeIn} whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
      <Box
        onClick={onClick}
        sx={{
          position: 'relative',
          bgcolor: active ? 'grey.50' : 'background.paper',
          border: 1,
          borderColor: active ? accent + '55' : 'divider',
          borderLeft: 3,
          borderLeftColor: active ? accent : 'transparent',
          borderRadius: 1,
          p: 1.75, cursor: 'pointer',
          transition: 'background-color .15s ease, border-color .15s ease',
          '&:hover': { bgcolor: 'grey.50', borderColor: accent + '55' },
        }}
      >
        <Stack direction="row" alignItems="flex-start" spacing={1.5}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: 1,
              display: 'grid', placeItems: 'center', flexShrink: 0,
              bgcolor: accent + '12', color: accent,
            }}
          >
            <Iconify icon={role.is_system ? 'solar:shield-linear' : 'solar:user-id-linear'} width={18} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.25 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                {role.name}
              </Typography>
              {role.is_system && (
                <Tooltip title="Vai trò hệ thống — không thể xoá">
                  <Chip
                    label="SYS"
                    size="small"
                    sx={{
                      height: 15, fontSize: 9, fontWeight: 700, letterSpacing: 0.4,
                      bgcolor: 'grey.100', color: 'text.secondary',
                      '& .MuiChip-label': { px: 0.5 },
                    }}
                  />
                </Tooltip>
              )}
            </Stack>
            <Typography sx={{ fontSize: 10.5, color: 'text.disabled', fontFamily: 'monospace' }}>
              {role.key}
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.4 }}>
                <Typography sx={{ fontSize: 10, color: 'text.disabled', fontWeight: 500, letterSpacing: 0.3 }}>
                  QUYỀN HẠN
                </Typography>
                <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                  {grantedCount}/{totalCount}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 3, borderRadius: 2,
                  bgcolor: 'grey.100',
                  '& .MuiLinearProgress-bar': { bgcolor: accent, opacity: 0.7, borderRadius: 2 },
                }}
              />
            </Box>

            <Stack direction="row" spacing={0.75} sx={{ mt: 1.25 }}>
              <Chip
                icon={<Iconify icon="solar:users-group-rounded-linear" width={11} />}
                label={`${role.user_count} người dùng`}
                size="small"
                variant="outlined"
                sx={{ height: 19, fontSize: 10, '& .MuiChip-icon': { color: 'text.disabled' } }}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </m.div>
  );
}

// ---------- Main ----------

export function RoleListView({ embedded = false } = {}) {
  const [roles, setRoles] = useState(SEED_ROLES);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedId, setSelectedId] = useState(SEED_ROLES[0]?.id);

  const totalPerms = ALL_PERMISSION_KEYS.length;
  const selected = roles.find((r) => r.id === selectedId);
  const accent = COLOR_HEX[selected?.color] ?? COLOR_HEX.grey;

  const updateRolePermissions = (keys) => {
    setRoles((prev) => prev.map((r) => (r.id === selectedId ? { ...r, permission_keys: keys } : r)));
  };

  const handleCreate = (form) => {
    const id = form.key;
    setRoles((prev) => [...prev, { ...form, id, user_count: 0 }]);
    setSelectedId(id);
  };

  const handleUpdate = (form) => {
    setRoles((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...form } : r)));
  };

  const kpiStats = useMemo(() => {
    const totalUsers = roles.reduce((n, r) => n + r.user_count, 0);
    const totalGrants = roles.reduce((n, r) => n + r.permission_keys.length, 0);
    return [
      { label: 'Tổng vai trò',    value: roles.length,  icon: 'solar:shield-linear',               color: '#7C3AED' },
      { label: 'Tổng người dùng', value: totalUsers,    icon: 'solar:users-group-rounded-linear',  color: '#2563EB' },
      { label: 'Quyền đã cấp',    value: totalGrants,   icon: 'solar:check-circle-linear',         color: '#059669' },
      { label: 'Nhóm · Quyền',    value: `${PERMISSION_GROUPS.length}·${totalPerms}`, icon: 'solar:widget-5-linear', color: '#64748B' },
    ];
  }, [roles, totalPerms]);

  const body = (
    <Box sx={{
      bgcolor: 'background.paper',
      border: 1, borderColor: 'divider',
      borderRadius: 1,
      p: { xs: 2, md: 2.5 },
    }}>
      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        {kpiStats.map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <m.div variants={fadeIn} initial="hidden" animate="show">
              <Stack
                direction="row" spacing={1.25} alignItems="center"
                sx={{
                  bgcolor: 'grey.50',
                  border: 1, borderColor: 'divider',
                  borderRadius: 1,
                  px: 1.75, py: 1.25,
                }}
              >
                <Box sx={{
                  width: 32, height: 32, borderRadius: 0.75,
                  bgcolor: s.color + '14', color: s.color,
                  display: 'grid', placeItems: 'center',
                }}>
                  <Iconify icon={s.icon} width={16} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 10.5, color: 'text.disabled', lineHeight: 1.2, fontWeight: 500, letterSpacing: 0.3, textTransform: 'uppercase' }}>
                    {s.label}
                  </Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary', lineHeight: 1.15, fontVariantNumeric: 'tabular-nums' }}>
                    {s.value}
                  </Typography>
                </Box>
              </Stack>
            </m.div>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
            Vai trò & phân quyền
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
            {roles.length} vai trò · {PERMISSION_GROUPS.length} nhóm quyền · {totalPerms} quyền chi tiết
          </Typography>
        </Box>
        <Can permissions={['role.create']}>
          <Button
            variant="contained"
            size="small"
            startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
            onClick={() => setCreateOpen(true)}
            sx={{
              boxShadow: 'none',
              bgcolor: '#1E293B', color: 'common.white',
              '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
            }}
          >
            Tạo vai trò
          </Button>
        </Can>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.25 }}>
            <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Danh sách vai trò
            </Typography>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Iconify icon="solar:filter-linear" width={14} />
            </IconButton>
          </Stack>
          <m.div variants={staggerContainer(0.05, 0.05)} initial="hidden" animate="show">
            <Stack spacing={1.25}>
              {roles.map((r) => (
                <RoleCard
                  key={r.id}
                  role={r}
                  active={selectedId === r.id}
                  grantedCount={r.permission_keys.length}
                  totalCount={totalPerms}
                  onClick={() => setSelectedId(r.id)}
                />
              ))}
            </Stack>
          </m.div>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <m.div
            key={selectedId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.25 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  Phân quyền — {selected?.name ?? '—'}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.25 }}>
                  Bấm chip để cấp hoặc thu hồi · nút chuyển nhóm cấp đầy đủ cả nhóm
                </Typography>
              </Box>
              <Can permissions={['role.update']}>
                <Button
                  size="small" variant="outlined"
                  onClick={() => setEditing(selected)}
                  startIcon={<Iconify icon="solar:pen-linear" width={13} />}
                  sx={{ boxShadow: 'none', borderColor: 'divider', fontSize: 11 }}
                >
                  Sửa thông tin
                </Button>
              </Can>
            </Stack>

            <Can
              permissions={['role.update']}
              fallback={
                <PermissionPicker
                  value={selected?.permission_keys ?? []}
                  onChange={() => {}}
                  accentColor={accent}
                />
              }
            >
              <PermissionPicker
                value={selected?.permission_keys ?? []}
                onChange={updateRolePermissions}
                accentColor={accent}
              />
            </Can>
          </m.div>
        </Grid>
      </Grid>

      <RoleFormDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <RoleFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
      />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      {body}
    </DashboardContent>
  );
}
