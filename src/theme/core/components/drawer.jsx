import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

const MuiDrawer = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    // Khi drawer mở, MUI Modal mặc định lock body scroll + bù padding-right bằng scrollbar
    // width → đẩy sidebar/content sang trái vài px. Tắt luôn global.
    ModalProps: { disableScrollLock: true },
  },
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paperAnchorRight: ({ ownerState, theme }) => ({
      ...(ownerState.variant === 'temporary' && {
        ...theme.mixins.paperStyles(theme),
        boxShadow: `-40px 40px 80px -8px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
        ...theme.applyStyles('dark', {
          boxShadow: `-40px 40px 80px -8px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
        }),
      }),
    }),
    paperAnchorLeft: ({ ownerState, theme }) => ({
      ...(ownerState.variant === 'temporary' && {
        ...theme.mixins.paperStyles(theme),
        boxShadow: `40px 40px 80px -8px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
        ...theme.applyStyles('dark', {
          boxShadow: `40px 40px 80px -8px  ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
        }),
      }),
    }),
  },
};

// ----------------------------------------------------------------------

export const drawer = { MuiDrawer };
