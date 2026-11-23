import { m } from 'framer-motion';

import NoSsr from '@mui/material/NoSsr';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PersonOutlined from '@mui/icons-material/PersonOutlined';

import { varTap, varHover, AnimateBorder, transitionTap } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AccountButton({ photoURL, displayName, sx, ...other }) {
  const renderFallback = () => (
    <Avatar
      sx={[
        (theme) => ({
          width: 40,
          height: 40,
          border: `solid 2px ${theme.vars.palette.background.default}`,
        }),
      ]}
    >
      <PersonOutlined />

    </Avatar>
  );

  return (
    <IconButton
      component={m.button}
      whileTap={varTap(0.96)}
      whileHover={varHover(1.04)}
      transition={transitionTap()}
      aria-label="Account button"
      sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <NoSsr fallback={renderFallback()}>
        <AnimateBorder
          sx={{ p: '3px', borderRadius: '50%', width: 40, height: 40 }}
          slotProps={{
            primaryBorder: { size: 60, width: '1px', sx: { color: 'primary.main' } },
            secondaryBorder: { sx: { color: 'warning.main' } },
          }}
        >
          <Avatar src={photoURL} alt={displayName} sx={{ width: 1, height: 1 }}>
            {displayName?.charAt(0).toUpperCase()}
          </Avatar>
        </AnimateBorder>
      </NoSsr>
    </IconButton>
  );
}
