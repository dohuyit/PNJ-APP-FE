// src/views/admin/admin-user/admin-roster-view.jsx
// Danh sách tài khoản admin — flat, nhẹ, màu nhạt, nhất quán với role-list-view.

'use client';

import { useMemo, useState } from 'react';

import {
  Avatar, Box, Button, Chip, Grid, IconButton, InputAdornment, MenuItem, Stack, TextField, Tooltip, Typography,
} from '@mui/material';

import { fmtRelative } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { AdminUserFormDrawer } from './admin-user-create-form';
import { mockAdmins } from 'src/mock-data';
import { SYSTEM_ROLES } from 'src/constants/permissions';

const adminsList = mockAdmins;
const rolesList = SYSTEM_ROLES;

// Màu nhạt hơn — pastel 300/400, không dùng gradient/bold cho card
const ROLE_COLOR = {
  'Super Admin':         { accent: '#DC2626', soft: '#FEF2F2', icon: 'solar:crown-linear'              },
  'Quản lý sản phẩm':    { accent: '#2563EB', soft: '#EFF6FF', icon: 'solar:box-linear'                },
  Marketing:             { accent: '#7C3AED', soft: '#F5F3FF', icon: 'solar:megaphone-linear'          },
  CSKH:                  { accent: '#059669', soft: '#ECFDF5', icon: 'solar:headphones-round-linear'   },
  'Kế toán':             { accent: '#D97706', soft: '#FFFBEB', icon: 'solar:calculator-linear'         },
  'NV cửa hàng':         { accent: '#64748B', soft: '#F8FAFC', icon: 'solar:shop-linear'               },
  'Biên tập blog':       { accent: '#DB2777', soft: '#FDF2F8', icon: 'solar:pen-new-square-linear'     },
};

function roleMeta(role) {
  return ROLE_COLOR[role] ?? { accent: '#64748B', soft: '#F8FAFC', icon: 'solar:user-linear' };
}

// --- KPI card — style y hệt shared KpiCard: borderRight/Bottom + trend plain text.
function KpiCard({ label, value, delta, icon, color, foot, index = 0, cols = 4 }) {
  const i = index;
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        borderRightWidth: {
          xs: 0,
          sm: i % 2 === 1 ? 0 : 1,
          md: (i + 1) % cols === 0 ? 0 : 1,
        },
        borderRightStyle: 'solid',
        borderRightColor: 'grey.200',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'grey.100',
        px: 2, py: 1.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography sx={{
          fontSize: 10.5, fontWeight: 600, color: 'text.disabled',
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>
          {label}
        </Typography>
        <Box sx={{
          width: 32, height: 32, borderRadius: 0.75,
          bgcolor: color + '14', color,
          display: 'grid', placeItems: 'center',
          flexShrink: 0,
        }}>
          <Iconify icon={icon} width={16} />
        </Box>
      </Stack>

      <Typography sx={{
        fontSize: 24, fontWeight: 700, color: 'text.primary',
        lineHeight: 1.1, fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {value}
      </Typography>

      {(delta != null || foot) && (
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1 }} flexWrap="wrap" rowGap={0.5}>
          {delta != null && (
            <Stack
              direction="row" alignItems="center" spacing={0.25}
              sx={{ color: delta >= 0 ? 'success.main' : 'error.main' }}
            >
              <Iconify icon={delta >= 0 ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'} width={12} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1, color: 'inherit' }}>
                {delta >= 0 ? '+' : ''}{delta}
              </Typography>
            </Stack>
          )}
          {foot && (
            <Typography sx={{ fontSize: 11, color: 'text.disabled', lineHeight: 1.3 }}>
              {foot}
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  );
}

// ------------------------------- Admin Card (flat, light)

function AdminCard({ admin, onEdit }) {
  const meta = roleMeta(admin.role);
  const initials = admin.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const isBlocked = admin.status === 'blocked';
  const isOnline = (Date.now() - new Date(admin.last_login_at).getTime()) < 15 * 60 * 1000;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        transition: 'border-color .15s ease',
        opacity: isBlocked ? 0.65 : 1,
        '&:hover': { borderColor: meta.accent + '55' },
      }}
    >
      {/* Body */}
      <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ p: 2 }}>
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Avatar
            sx={{
              width: 48, height: 48,
              bgcolor: meta.soft, color: meta.accent,
              fontWeight: 600, fontSize: 16,
              border: 1, borderColor: meta.accent + '33',
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{
            position: 'absolute', bottom: 0, right: 0,
            width: 11, height: 11, borderRadius: '50%',
            bgcolor: isBlocked ? 'error.main' : isOnline ? 'success.main' : 'grey.400',
            border: 2, borderColor: 'background.paper',
          }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'text.primary', lineHeight: 1.25 }} noWrap>
            {admin.name}
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.125 }} noWrap>
            {admin.email}
          </Typography>

          <Stack direction="row" spacing={0.5} sx={{ mt: 0.75 }} flexWrap="wrap" rowGap={0.5}>
            <Chip
              icon={<Iconify icon={meta.icon} width={11} />}
              label={admin.role}
              size="small"
              sx={{
                height: 20, fontSize: 10.5, fontWeight: 500,
                bgcolor: meta.soft, color: meta.accent, border: 1, borderColor: meta.accent + '33',
                '& .MuiChip-icon': { color: 'inherit', ml: 0.5 },
              }}
            />
            <Chip
              icon={<Iconify icon={admin.two_factor_enabled ? 'solar:shield-check-linear' : 'solar:shield-warning-linear'} width={11} />}
              label={admin.two_factor_enabled ? '2FA' : '2FA tắt'}
              size="small"
              sx={{
                height: 20, fontSize: 10.5, fontWeight: 500,
                bgcolor: admin.two_factor_enabled ? 'success.lighter' : 'error.lighter',
                color:   admin.two_factor_enabled ? 'success.darker'  : 'error.darker',
                border: 1, borderColor: admin.two_factor_enabled ? 'success.light' : 'error.light',
                '& .MuiChip-icon': { color: 'inherit', ml: 0.5 },
              }}
            />
          </Stack>
        </Box>
      </Stack>

      {/* Info row */}
      <Stack
        direction="row" spacing={2} alignItems="center"
        sx={{ px: 2, py: 1.25, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}
      >
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Iconify icon="solar:phone-linear" width={12} sx={{ color: 'text.disabled' }} />
          <Typography sx={{ fontSize: 11, fontFamily: 'monospace', color: 'text.secondary' }} noWrap>
            {admin.phone}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
          <Iconify icon="solar:clock-circle-linear" width={12} sx={{ color: 'text.disabled' }} />
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>
            {fmtRelative(admin.last_login_at)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.25}>
          <Tooltip title="Sửa">
            <IconButton size="small" onClick={() => onEdit(admin)} sx={{ color: 'text.secondary' }}>
              <Iconify icon="solar:pen-linear" width={13} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset 2FA">
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Iconify icon="solar:shield-warning-linear" width={13} />
            </IconButton>
          </Tooltip>
          <Tooltip title={isBlocked ? 'Mở khoá' : 'Khoá tài khoản'}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Iconify icon={isBlocked ? 'solar:lock-password-unlocked-linear' : 'solar:lock-password-linear'} width={13} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
}

// ------------------------------- Main view

export function AdminRosterView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [status, setStatus] = useState('all');
  const [twoFactor, setTwoFactor] = useState('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return adminsList.filter((a) => {
      if (q && !a.name.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q)) return false;
      if (roleFilter !== 'all' && a.role !== roleFilter) return false;
      if (status !== 'all' && a.status !== status) return false;
      if (twoFactor === 'on'  && !a.two_factor_enabled) return false;
      if (twoFactor === 'off' && a.two_factor_enabled) return false;
      return true;
    });
  }, [search, roleFilter, status, twoFactor]);

  const stats = useMemo(() => {
    const total      = adminsList.length;
    const active     = adminsList.filter((a) => a.status === 'active').length;
    const with2fa    = adminsList.filter((a) => a.two_factor_enabled).length;
    const online     = adminsList.filter((a) => {
      const diffMs = Date.now() - new Date(a.last_login_at).getTime();
      return diffMs < 15 * 60 * 1000;
    }).length;
    return { total, active, with2fa, online };
  }, []);

  const body = (
    <Box sx={{
      bgcolor: 'background.paper',
      border: 1, borderColor: 'divider',
      borderRadius: 1,
      p: { xs: 2, md: 2.5 },
    }}>
      {/* KPI cards — full-width, border nhẹ */}
      <Grid container spacing={0} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={0} label="Tổng tài khoản"  value={stats.total}   icon="solar:users-group-rounded-linear" color="#2563EB" foot={`${rolesList.length} vai trò`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={1} label="Đang hoạt động" value={stats.active}  icon="solar:check-circle-linear" color="#059669" foot={`${((stats.active / Math.max(stats.total, 1)) * 100).toFixed(0)}% tổng`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={2} label="Đã bật 2FA"     value={stats.with2fa} icon="solar:shield-check-linear" color="#7C3AED" foot={`${((stats.with2fa / Math.max(stats.total, 1)) * 100).toFixed(0)}% bảo mật`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard index={3} label="Online (<15m)"  value={stats.online}  icon="solar:signal-linear" color="#D97706" foot={`${stats.total - stats.online} offline`} />
        </Grid>
      </Grid>

      {/* Title row: tiêu đề chính + nút mời admin */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
            Tài khoản admin
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
            {adminsList.length} tài khoản · phân theo vai trò + phạm vi cửa hàng/vùng
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<Iconify icon="solar:user-plus-linear" width={14} />}
          onClick={() => setCreateOpen(true)}
          sx={{
            boxShadow: 'none',
            bgcolor: '#1E293B', color: 'common.white',
            '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
          }}
        >
          Mời admin
        </Button>
      </Stack>

      {/* Filter bar — liền mạch, không border đóng khung */}
      <Stack
        direction="row" spacing={1.5} alignItems="center" flexWrap="wrap"
        sx={{
          px: 1.5, py: 1.25, mb: 2,
          borderRadius: 1,
          border: 1, borderColor: 'divider',
          bgcolor: 'grey.50',
          rowGap: 1,
        }}
      >
        <TextField
          size="small" sx={{ minWidth: 220, flex: 1, bgcolor: 'background.paper' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên / email…"
          InputProps={{
            startAdornment: <InputAdornment position="start"><Iconify icon="solar:magnifer-linear" width={14} /></InputAdornment>,
          }}
        />
        <TextField
          select size="small" sx={{ width: 200, bgcolor: 'background.paper' }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <MenuItem value="all">Tất cả vai trò</MenuItem>
          {rolesList.map((r) => (
            <MenuItem key={r.id} value={r.name}>{r.name}</MenuItem>
          ))}
        </TextField>
        <Chip
          icon={<Iconify icon="solar:shield-check-linear" width={11} sx={{ ml: 0.5 }} />}
          label="2FA bật"
          size="small"
          variant="outlined"
          onClick={() => setTwoFactor((v) => (v === 'on' ? 'all' : 'on'))}
          sx={{
            bgcolor: twoFactor === 'on' ? 'success.lighter' : 'background.paper',
            color:   twoFactor === 'on' ? 'success.darker'  : 'text.secondary',
            borderColor: twoFactor === 'on' ? 'success.light' : 'divider',
          }}
        />
        <Chip
          icon={<Iconify icon="solar:shield-warning-linear" width={11} sx={{ ml: 0.5 }} />}
          label="2FA tắt"
          size="small"
          variant="outlined"
          onClick={() => setTwoFactor((v) => (v === 'off' ? 'all' : 'off'))}
          sx={{
            bgcolor: twoFactor === 'off' ? 'error.lighter' : 'background.paper',
            color:   twoFactor === 'off' ? 'error.darker'  : 'text.secondary',
            borderColor: twoFactor === 'off' ? 'error.light' : 'divider',
          }}
        />
        <Chip
          icon={<Iconify icon="solar:lock-password-linear" width={11} sx={{ ml: 0.5 }} />}
          label="Đã khoá"
          size="small"
          variant="outlined"
          onClick={() => setStatus((v) => (v === 'blocked' ? 'all' : 'blocked'))}
          sx={{
            bgcolor: status === 'blocked' ? 'error.lighter' : 'background.paper',
            color:   status === 'blocked' ? 'error.darker'  : 'text.secondary',
            borderColor: status === 'blocked' ? 'error.light' : 'divider',
          }}
        />
        <Box sx={{ flex: 1 }} />
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
          {filtered.length}/{adminsList.length} admin
        </Typography>
      </Stack>

      {/* Grid — nền liền mạch, không màu khác */}
      {filtered.length === 0 ? (
        <Stack alignItems="center" spacing={1.5} sx={{ py: 10, color: 'text.disabled' }}>
          <Iconify icon="solar:users-group-rounded-linear" width={36} />
          <Typography variant="body2">Không có tài khoản khớp bộ lọc</Typography>
        </Stack>
      ) : (
        <Grid container spacing={1.5}>
          {filtered.map((a) => (
            <Grid key={a.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AdminCard admin={a} onEdit={setEditing} />
            </Grid>
          ))}
        </Grid>
      )}

      <AdminUserFormDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(v) => console.log('invite admin', v)}
      />
      <AdminUserFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update admin', v)}
      />
    </Box>
  );

  if (embedded) return body;

  return <DashboardContent disablePadding>{body}</DashboardContent>;
}
