// src/layouts/components/nav-upgrade.jsx — info card hiển thị user ở cuối sidebar admin
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';

import { useAuthContext } from 'src/auth/pnj/use-auth-context';

const ONLINE_DOT = {
  width: 11,
  height: 11,
  borderRadius: '50%',
  bgcolor: 'success.main',
  position: 'absolute',
  right: -1,
  bottom: -1,
  border: '2.5px solid',
  borderColor: 'background.paper',
  boxShadow: '0 0 0 1px rgba(34,197,94,0.3)',
};

export function NavUpgrade({ sx, ...other }) {
  const { user } = useAuthContext();

  if (!user) return null;

  const initial = (user.name || user.email || '?').trim().charAt(0).toUpperCase();

  return (
    <Box sx={[{ mt: 3, px: 2, pb: 2 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Box
        sx={(theme) => ({
          position: 'relative',
          borderRadius: 2,
          p: '14px 14px 12px',
          border: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
          background: `linear-gradient(135deg,
            ${varAlpha(theme.vars.palette.primary.mainChannel, 0.06)} 0%,
            ${varAlpha(theme.vars.palette.primary.mainChannel, 0.02)} 50%,
            ${varAlpha(theme.vars.palette.warning.mainChannel, 0.04)} 100%)`,
          transition: theme.transitions.create(['border-color', 'box-shadow', 'transform']),
          '&:hover': {
            borderColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.32),
            boxShadow: `0 2px 8px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.12)}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            borderRadius: '8px 8px 0 0',
            background: `linear-gradient(90deg,
              ${theme.vars.palette.primary.main} 0%,
              ${theme.vars.palette.warning.main} 100%)`,
            opacity: 0.6,
          },
        })}
      >
        <Stack direction="row" alignItems="flex-start" spacing={1.25}>
          {/* Avatar with online dot */}
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
              src={user.avatar_url}
              alt={user.name}
              sx={(theme) => ({
                width: 44, height: 44,
                bgcolor: 'primary.main',
                fontSize: 17, fontWeight: 700,
                border: `2px solid ${theme.vars.palette.background.paper}`,
                boxShadow: `0 0 0 1.5px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.4)}`,
              })}
            >
              {initial}
            </Avatar>
            <Box sx={ONLINE_DOT} />
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0, pt: 0.125 }}>
            <Typography
              noWrap
              sx={{
                fontSize: 13.5,
                fontWeight: 700,
                lineHeight: 1.2,
                color: 'var(--layout-nav-text-primary-color)',
                letterSpacing: '-0.01em',
              }}
            >
              {user.name || 'Người dùng'}
            </Typography>

            <Typography
              noWrap
              sx={{
                fontSize: 10.5,
                fontWeight: 500,
                color: 'var(--layout-nav-text-disabled-color)',
                mt: '2px',
                lineHeight: 1.3,
              }}
            >
              {user.email}
            </Typography>

            {user.role && (
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.75 }}>
                <Box
                  sx={(theme) => ({
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    px: 0.75, py: '2px',
                    borderRadius: 0.75,
                    bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.12),
                    color: 'primary.main',
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    textTransform: 'uppercase',
                  })}
                >
                  <WorkspacePremiumOutlined sx={{ width: 11, height: 11 }} />
                  {user.role}
                </Box>
              </Stack>
            )}
          </Box>

          {/* More menu */}
          <Tooltip title="Tuỳ chọn tài khoản">
            <IconButton
              size="small"
              sx={{
                width: 28, height: 28,
                color: 'var(--layout-nav-text-disabled-color)',
                '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
              }}
            >
              <MoreVertOutlined sx={{ width: 16, height: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
}
