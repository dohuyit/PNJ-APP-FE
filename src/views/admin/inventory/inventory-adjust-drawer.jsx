// src/views/admin/inventory/inventory-adjust-drawer.jsx
// Drawer điều chỉnh tồn kho (nhập / xuất / điều chỉnh). Ghi 1 movement.

'use client';

import { useEffect, useState } from 'react';

import CloseOutlined from '@mui/icons-material/CloseOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import {
  Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Stack, TextField, Typography,
} from '@mui/material';

import { useGetStoreList } from 'src/actions/admin/store';
import { useGetProductList } from 'src/actions/admin/product';
import { UploadField } from 'src/views/admin/_shared/upload-field';
import {
  actionInventoryMovement,
  refreshInventoryList,
  refreshInventoryMovements,
  CONST_MOVEMENT_TYPE,
  CONST_MOVEMENT_REASON,
} from 'src/actions/admin/inventory';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const EMPTY = {
  type: 'adjust',
  store_id: null,
  sku: '',
  qty: 0,
  reason: 'manual',
  note: '',
  attachment: null, // File | string(URL) | null
};

export function InventoryAdjustDrawer({ open, onClose, initial }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const { searchResults: storeOpts } = useGetStoreList({ perPage: 200 });
  const { searchResults: productOpts } = useGetProductList({ perPage: 500 });

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY, ...(initial ?? {}) });
    }
  }, [open, initial]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));

  const canSubmit = form.store_id && form.sku && Number(form.qty) !== 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await actionInventoryMovement({
        type: form.type,
        store_id: form.store_id,
        sku: form.sku,
        qty: Number(form.qty),
        reason: form.reason,
        note: form.note,
        // shortcut: attachment upload chưa wire BE, chỉ gửi nếu là string URL (đã upload trước)
        attachment_file_id: typeof form.attachment === 'string' ? form.attachment : null,
      });
      toast.success('Đã ghi điều chỉnh tồn');
      refreshInventoryList();
      refreshInventoryMovements();
      onClose?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Lỗi khi ghi điều chỉnh');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1.5 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pb: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>Điều chỉnh tồn kho</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Ghi nhận 1 movement nhập / xuất / điều chỉnh vào nhật ký.
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end" size="small">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
      <Stack spacing={2}>
        <TextField
          select fullWidth size="small"
          label="Loại thao tác" required
          value={form.type}
          onChange={set('type')}
        >
          {CONST_MOVEMENT_TYPE.filter((t) => t.id !== 'transfer').map((t) => (
            <MenuItem key={t.id} value={t.id}>{t.label}</MenuItem>
          ))}
        </TextField>

        <Autocomplete
          size="small"
          options={storeOpts}
          value={storeOpts.find((o) => (o._id ?? o.id) === form.store_id) ?? null}
          getOptionLabel={(o) => o?.name ?? ''}
          isOptionEqualToValue={(a, b) => (a._id ?? a.id) === (b._id ?? b.id)}
          onChange={(_, v) => set('store_id')(v ? (v._id ?? v.id) : null)}
          renderInput={(p) => <TextField {...p} label="Cửa hàng" required placeholder="Chọn cửa hàng…" />}
        />

        <Autocomplete
          size="small"
          freeSolo
          options={productOpts.flatMap((p) => (p.variants ?? []).map((v) => ({ label: v.sku, product: p.name })))}
          value={form.sku}
          getOptionLabel={(o) => (typeof o === 'string' ? o : o.label ?? '')}
          onChange={(_, v) => set('sku')(typeof v === 'string' ? v : v?.label ?? '')}
          onInputChange={(_, v) => set('sku')(v)}
          renderOption={(props, o) => (
            <Box component="li" {...props}>
              <Box sx={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{o.label}</Box>
              <Typography sx={{ ml: 1, fontSize: 11, color: 'text.disabled' }}>· {o.product}</Typography>
            </Box>
          )}
          renderInput={(p) => <TextField {...p} label="SKU" required placeholder="Gõ hoặc chọn…" />}
        />

        <Stack direction="row" spacing={1}>
          <TextField
            label="Số lượng (±)" required type="number" size="small"
            value={form.qty}
            onChange={(e) => set('qty')(e.target.value)}
            helperText="Dương = nhập, âm = xuất. VD: +5 hoặc -3"
            sx={{ flex: 1 }}
          />
          <TextField
            select size="small" label="Lý do" required
            value={form.reason}
            onChange={set('reason')}
            sx={{ flex: 1 }}
          >
            {CONST_MOVEMENT_REASON.map((r) => (
              <MenuItem key={r.id} value={r.id}>{r.label}</MenuItem>
            ))}
          </TextField>
        </Stack>

        <TextField
          label="Ghi chú" fullWidth size="small" multiline rows={2}
          value={form.note}
          onChange={set('note')}
          placeholder="Vd: Kiểm kê cuối tháng, chênh lệch 2 chiếc."
        />

        <UploadField
          label="CHỨNG TỪ (ảnh/scan · tuỳ chọn)"
          value={form.attachment}
          onChange={(v) => set('attachment')(v)}
          accept={{ 'image/*': [], 'application/pdf': [] }}
          helperText="Chụp phiếu kiểm kê hoặc scan chứng từ nếu có."
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
          Ghi điều chỉnh
        </Button>
      </DialogActions>
    </Dialog>
  );
}
