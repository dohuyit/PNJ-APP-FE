// src/views/admin/inventory/inventory-transfer-drawer.jsx
// Drawer chuyển kho from → to với list items.

'use client';

import { useEffect, useState } from 'react';

import CloseOutlined from '@mui/icons-material/CloseOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Stack, TextField, Typography,
} from '@mui/material';

import { useGetStoreList } from 'src/actions/admin/store';
import { UploadField } from 'src/views/admin/_shared/upload-field';
import {
  actionInventoryTransfer,
  refreshInventoryList,
  refreshInventoryTransfers,
} from 'src/actions/admin/inventory';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const EMPTY = {
  from_store_id: null,
  to_store_id: null,
  items: [{ sku: '', qty: 1 }],
  note: '',
  attachment: null,
};

export function InventoryTransferDrawer({ open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const { searchResults: storeOpts } = useGetStoreList({ perPage: 200 });

  useEffect(() => {
    if (open) setForm(EMPTY);
  }, [open]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));

  const setItem = (i, patch) =>
    setForm((f) => ({ ...f, items: f.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }));
  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, { sku: '', qty: 1 }] }));
  const removeItem = (i) => setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const sameStore = form.from_store_id && form.to_store_id && form.from_store_id === form.to_store_id;
  const canSubmit =
    form.from_store_id &&
    form.to_store_id &&
    !sameStore &&
    form.items.length > 0 &&
    form.items.every((it) => it.sku.trim() && Number(it.qty) > 0);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await actionInventoryTransfer({
        from_store_id: form.from_store_id,
        to_store_id: form.to_store_id,
        items: form.items.map((it) => ({ sku: it.sku.trim(), qty: Number(it.qty) })),
        note: form.note,
        attachment_file_id: typeof form.attachment === 'string' ? form.attachment : null,
      });
      toast.success('Đã tạo phiếu chuyển kho');
      refreshInventoryList();
      refreshInventoryTransfers();
      onClose?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Lỗi khi tạo phiếu chuyển');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>Tạo phiếu chuyển kho</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Chuyển SKU giữa 2 cửa hàng · sinh movement ở cả 2 phía.
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end" size="small">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Autocomplete
            size="small" sx={{ flex: 1 }}
            options={storeOpts}
            value={storeOpts.find((o) => (o._id ?? o.id) === form.from_store_id) ?? null}
            getOptionLabel={(o) => o?.name ?? ''}
            isOptionEqualToValue={(a, b) => (a._id ?? a.id) === (b._id ?? b.id)}
            onChange={(_, v) => set('from_store_id')(v ? (v._id ?? v.id) : null)}
            renderInput={(p) => <TextField {...p} label="Từ kho" required placeholder="Kho xuất…" />}
          />
          <Autocomplete
            size="small" sx={{ flex: 1 }}
            options={storeOpts.filter((o) => (o._id ?? o.id) !== form.from_store_id)}
            value={storeOpts.find((o) => (o._id ?? o.id) === form.to_store_id) ?? null}
            getOptionLabel={(o) => o?.name ?? ''}
            isOptionEqualToValue={(a, b) => (a._id ?? a.id) === (b._id ?? b.id)}
            onChange={(_, v) => set('to_store_id')(v ? (v._id ?? v.id) : null)}
            renderInput={(p) => <TextField {...p} label="Đến kho" required placeholder="Kho nhận…" />}
          />
        </Stack>

        {sameStore && (
          <Alert severity="warning" sx={{ fontSize: 12 }}>
            Kho xuất và kho nhận phải khác nhau.
          </Alert>
        )}

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3, color: 'text.secondary' }}>
              SKU CHUYỂN · {form.items.length}
            </Typography>
            <Button size="small" startIcon={<Iconify icon="solar:add-circle-linear" width={14} />} onClick={addItem}>
              Thêm dòng
            </Button>
          </Stack>
          <Stack spacing={1}>
            {form.items.map((it, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <TextField
                  size="small"
                  placeholder="SKU"
                  value={it.sku}
                  onChange={(e) => setItem(i, { sku: e.target.value })}
                  sx={{ flex: 1, '& input': { fontFamily: 'ui-monospace, monospace', fontSize: 12 } }}
                />
                <TextField
                  size="small" type="number"
                  placeholder="SL" value={it.qty}
                  onChange={(e) => setItem(i, { qty: e.target.value })}
                  sx={{ width: 100 }}
                />
                <IconButton
                  size="small"
                  disabled={form.items.length === 1}
                  onClick={() => removeItem(i)}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon="solar:trash-bin-trash-linear" width={16} />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Box>

        <TextField
          label="Ghi chú" fullWidth size="small" multiline rows={2}
          value={form.note}
          onChange={set('note')}
          placeholder="Vd: Chuyển bổ sung tồn đợt tết."
        />

        <UploadField
          label="CHỨNG TỪ (phiếu chuyển · tuỳ chọn)"
          value={form.attachment}
          onChange={(v) => set('attachment')(v)}
          accept={{ 'image/*': [], 'application/pdf': [] }}
        />
      </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}>Huỷ</Button>
        <Button
          variant="contained"
          disabled={!canSubmit || submitting}
          startIcon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
          onClick={handleSubmit}
        >
          Tạo phiếu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
