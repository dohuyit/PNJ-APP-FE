// src/components/common/import-wizard/import-wizard.jsx — 3-step import wizard
'use client';

import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Stack,
  Stepper, Step, StepLabel, Typography, Paper, Alert,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useDropzone } from 'react-dropzone';

const STEPS = ['Tải file', 'Xem trước', 'Chạy nhập'];

export function ImportWizard({
  open,
  onClose,
  onSubmit,
  previewRenderer,
  title = 'Nhập dữ liệu từ Excel',
  templateHref,
}) {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    onDrop: (files) => setFile(files[0] ?? null),
  });

  const handleSubmit = async () => {
    setBusy(true);
    try {
      await onSubmit(file);
      onClose();
      setFile(null);
      setStep(0);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stepper activeStep={step} sx={{ py: 2 }}>
          {STEPS.map((l) => (
            <Step key={l}><StepLabel>{l}</StepLabel></Step>
          ))}
        </Stepper>

        {step === 0 && (
          <Stack spacing={2}>
            {templateHref && (
              <Alert
                severity="info"
                action={
                  <Button component="a" href={templateHref} size="small" startIcon={<Iconify icon="solar:download-linear" />}>
                    Tải mẫu
                  </Button>
                }
              >
                Tải file mẫu, điền dữ liệu rồi upload lại.
              </Alert>
            )}
            <Paper
              {...getRootProps()}
              variant="outlined"
              sx={{
                borderStyle: 'dashed',
                borderWidth: 2,
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                p: 6,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? 'primary.lighter' : 'grey.50',
              }}
            >
              <input {...getInputProps()} />
              <Iconify icon="solar:file-text-bold-duotone" width={48} sx={{ color: 'primary.main', mb: 1 }} />
              <Typography variant="body2" fontWeight={600}>
                {file ? file.name : 'Kéo thả file Excel/CSV vào đây'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                hoặc bấm để chọn
              </Typography>
            </Paper>
          </Stack>
        )}

        {step === 1 && (
          <Box sx={{ minHeight: 200 }}>
            {previewRenderer ? previewRenderer(file) : (
              <Typography color="text.secondary">Chưa cấu hình preview.</Typography>
            )}
          </Box>
        )}

        {step === 2 && (
          <Stack spacing={2} alignItems="center" sx={{ py: 3 }}>
            <Iconify icon="solar:play-circle-bold-duotone" width={64} sx={{ color: 'success.main' }} />
            <Typography variant="body1">Sẵn sàng nhập <b>{file?.name}</b></Typography>
            <Typography variant="body2" color="text.secondary">
              Job sẽ chạy nền và báo kết quả khi xong.
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Đóng</Button>
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Trở lại
        </Button>
        {step < 2 ? (
          <Button
            onClick={() => setStep(step + 1)}
            variant="contained"
            disabled={!file}
          >
            Tiếp
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="contained" color="success" disabled={busy}>
            {busy ? 'Đang chạy…' : 'Chạy nhập'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
