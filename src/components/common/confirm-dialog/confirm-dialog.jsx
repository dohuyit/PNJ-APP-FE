// src/components/common/confirm-dialog/confirm-dialog.jsx — dangerous-action confirmation
'use client';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
  Stack, Alert, TextField,
} from '@mui/material';
import { useState } from 'react';
import { Iconify } from 'src/components/iconify';

/**
 * @param {{
 *   open: boolean, title: string, message: React.ReactNode, confirmLabel?: string, cancelLabel?: string,
 *   onCancel: Function, onConfirm: Function, danger?: boolean, requireTyping?: string,
 * }} props
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Huỷ',
  onCancel,
  onConfirm,
  danger = false,
  requireTyping,
  busy,
}) {
  const [typed, setTyped] = useState('');
  const canConfirm = !requireTyping || typed === requireTyping;

  const handleConfirm = async () => {
    await onConfirm();
    setTyped('');
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify
            icon={danger ? 'solar:danger-triangle-bold' : 'solar:info-circle-bold'}
            width={24}
            sx={{ color: danger ? 'error.main' : 'info.main' }}
          />
          <Typography variant="h6">{title}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {typeof message === 'string' ? (
            <Typography variant="body2">{message}</Typography>
          ) : (
            message
          )}
          {requireTyping && (
            <Stack spacing={1}>
              <Alert severity="warning" variant="outlined">
                Nhập <b>{requireTyping}</b> để xác nhận
              </Alert>
              <TextField
                autoFocus
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder={requireTyping}
                size="small"
                fullWidth
              />
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color="inherit">
          {cancelLabel}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={danger ? 'error' : 'primary'}
          disabled={!canConfirm || busy}
        >
          {busy ? 'Đang xử lý…' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
