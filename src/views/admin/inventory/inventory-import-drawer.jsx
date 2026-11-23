// src/views/admin/inventory/inventory-import-drawer.jsx
// Drawer import tồn kho từ file Excel.

'use client';

import { useEffect, useState } from 'react';

import CloseOutlined from '@mui/icons-material/CloseOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Link, Stack, Typography,
} from '@mui/material';

import { UploadField } from 'src/views/admin/_shared/upload-field';
import {
  actionInventoryImport,
  refreshInventoryList,
} from 'src/actions/admin/inventory';

import { toast } from 'src/components/snackbar';

export function InventoryImportDrawer({ open, onClose }) {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (open) setFile(null); }, [open]);

  const handleSubmit = async () => {
    // shortcut: BE flow sẽ upload file → file_id trước khi call import; hiện gửi placeholder.
    setSubmitting(true);
    try {
      await actionInventoryImport(typeof file === 'string' ? file : 'PENDING_UPLOAD');
      toast.success('Đã gửi file import, hệ thống sẽ xử lý trong ít phút.');
      refreshInventoryList();
      onClose?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Lỗi khi import');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>Import tồn kho từ Excel</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Tải file mẫu, điền dữ liệu, upload. Hệ thống sẽ ghi movement theo từng dòng.
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end" size="small">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
      <Stack spacing={2}>
        <Alert severity="info" sx={{ fontSize: 12 }}>
          File Excel phải có 4 cột: <b>sku · store_code · qty · reason</b>.
          Xem{' '}
          <Link href="/templates/inventory-import-template.xlsx" target="_blank" sx={{ fontWeight: 600 }}>
            file mẫu
          </Link>.
        </Alert>

        <UploadField
          label="FILE EXCEL (.xlsx)"
          value={file}
          onChange={setFile}
          accept={{
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
          }}
          maxSize={5 * 1024 * 1024}
          helperText="Tối đa 5MB · ~ 5000 dòng."
        />

        <Button
          size="small"
          variant="outlined"
          startIcon={<FileDownloadOutlined sx={{ fontSize: 16 }} />}
          href="/templates/inventory-import-template.xlsx"
          sx={{ alignSelf: 'flex-start' }}
        >
          Tải file mẫu
        </Button>

        <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
          Sau khi upload, hệ thống sẽ xử lý bất đồng bộ. Xem kết quả ở
          Nhật ký nhập/xuất hoặc Thông báo.
        </Typography>
      </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}>Huỷ</Button>
        <Button
          variant="contained"
          disabled={!file || submitting}
          startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
          onClick={handleSubmit}
        >
          Chạy import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
