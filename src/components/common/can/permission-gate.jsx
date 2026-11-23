// src/components/common/can/permission-gate.jsx
// Page-level gate — hiển thị fallback "Không đủ quyền" nếu user không có quyền yêu cầu.

'use client';

import { Box, Button, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { usePermission } from 'src/auth/pnj/use-auth-context';
import { PERMISSION_MAP } from 'src/constants/permissions';

export function PermissionGate({ permissions = [], mode = 'any', children, fallback }) {
  const { hasAny, hasAll } = usePermission();

  const ok = permissions.length === 0
    ? true
    : mode === 'all'
      ? hasAll(permissions)
      : hasAny(permissions);

  if (ok) return children;
  if (fallback) return fallback;

  const needed = permissions.map((k) => PERMISSION_MAP[k]?.label ?? k);

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 160px)',
      display: 'grid', placeItems: 'center',
      bgcolor: 'grey.50', p: 3,
    }}>
      <Stack
        alignItems="center" spacing={2}
        sx={{
          bgcolor: 'background.paper',
          border: 1, borderColor: 'divider',
          borderRadius: 1,
          px: 4, py: 5,
          maxWidth: 440, width: '100%', textAlign: 'center',
        }}
      >
        <Box sx={{
          width: 56, height: 56, borderRadius: 1,
          bgcolor: 'error.lighter', color: 'error.dark',
          display: 'grid', placeItems: 'center',
        }}>
          <Iconify icon="solar:shield-cross-linear" width={28} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary' }}>
            Không đủ quyền truy cập
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mt: 0.5 }}>
            Tài khoản của bạn chưa được cấp quyền để xem trang này.
          </Typography>
        </Box>
        {needed.length > 0 && (
          <Box sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5, width: '100%' }}>
            <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase', mb: 0.75 }}>
              Quyền yêu cầu
            </Typography>
            <Stack spacing={0.5}>
              {needed.map((n) => (
                <Stack key={n} direction="row" spacing={0.75} alignItems="center">
                  <Iconify icon="solar:dot-linear" width={10} sx={{ color: 'error.main' }} />
                  <Typography sx={{ fontSize: 11.5, color: 'text.primary' }}>{n}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}
        <Button
          size="small" variant="outlined"
          onClick={() => window.history.back()}
          startIcon={<Iconify icon="solar:arrow-left-linear" width={13} />}
          sx={{ boxShadow: 'none', borderColor: 'divider' }}
        >
          Quay lại
        </Button>
      </Stack>
    </Box>
  );
}
