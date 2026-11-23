'use client';

import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { usePopover } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Divider from "@mui/material/Divider";
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotListedLocationOutlinedIcon from '@mui/icons-material/NotListedLocationOutlined';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { getAuthUser } from '../../utils/auth';
import { fCurrency } from '../../utils/format-number';
import { actionGetUserProfileCrm } from '../../actions/user';

// ----------------------------------------------------------------------

export function WorkspacesPopover({ data = [], sx, ...other }) {
  const mediaQuery = 'sm';
  const router = useRouter()
  const _user = getAuthUser()
  const [user, setUser] = useState({});

  const { open, anchorEl, onClose, onOpen } = usePopover();

  const [workspace, setWorkspace] = useState(data[0]);

  const handleChangeWorkspace = useCallback(
    (newValue) => {
      setWorkspace(newValue);
      onClose();
    },
    [onClose]
  );

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!_user?.id) return;

                const res = await actionGetUserProfileCrm(_user.id);

                if (res?.status === 200 && res?.data?.data) {
                    setUser(res.data.data);
                }
            } catch (error) {
                console.error('error', error);
            }
        };

        fetchData();
    }, [_user?.id]);


  const buttonBg = {
    height: 1,
    zIndex: -1,
    opacity: 0,
    content: "''",
    borderRadius: 1,
    position: 'absolute',
    visibility: 'hidden',
    bgcolor: 'action.hover',
    width: 'calc(100% + 8px)',
    transition: (theme) =>
      theme.transitions.create(['opacity', 'visibility'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    ...(open && {
      opacity: 1,
      visibility: 'visible',
    }),
  };

  const renderButton = () => (
    <ButtonBase
      disableRipple
      onClick={onOpen}
      sx={[
        {
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          '&::before': buttonBg,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/*<Box*/}
      {/*  component="img"*/}
      {/*  alt={workspace?.name}*/}
      {/*  src={workspace?.logo}*/}
      {/*  sx={{ width: 24, height: 24, borderRadius: '50%' }}*/}
      {/*/>*/}
        <AccountBalanceWalletIcon size="small" color="disabled"/>


      <Box
        component="span"
        sx={{ typography: 'subtitle2' }}
      >
          {fCurrency(user?.cash_balance, 'VND')}
      </Box>

      <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
    </ButtonBase>
  );

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        arrow: { placement: 'top-left' },
        paper: { sx: { mt: 0.5, ml: -1.55 } },
      }}
    >
      <MenuList sx={{ width: 240 }}>
          <MenuItem
              selected={false}
              sx={{ height: 48 }}
              href="/transaction/top-up/list"
              component={RouterLink}
          >
              <HistoryOutlinedIcon size="small" color="primary"/>

              <Box component="span" sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}>
                  Transaction history
              </Box>
          </MenuItem>

          <MenuItem
              selected={false}
              // onClick={() => handleChangeWorkspace(option)}
              sx={{ height: 48 }}
              href="/faq"
              component={RouterLink}
          >
              <NotListedLocationOutlinedIcon  color="primary"/>

              <Box component="span" sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}>
                  Wallet top-up guide
              </Box>
          </MenuItem>
          <Divider  />

          <MenuItem
              selected={false}
              // onClick={() => handleChangeWorkspace(option)}
              sx={{ height: 48 }}
              href="/top-up"
              component={RouterLink}
          >
              <AddOutlinedIcon color="primary"/>
              <Box component="span" sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}>
                  Top up
              </Box>
              {/*<Label color={'info'}>abc</Label>*/}
          </MenuItem>

      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      {renderButton()}
      {renderMenuList()}
    </>
  );
}
