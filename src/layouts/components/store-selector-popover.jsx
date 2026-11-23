// src/layouts/components/store-selector-popover.jsx
// Selector cửa hàng ở header admin. Tự ẩn nếu user không có quyền store.switch hoặc không có store nào.

'use client';

import { useMemo, useState } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import {
  Box, ButtonBase, Chip, Divider, InputAdornment, Stack, TextField, Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { usePermission } from 'src/auth/pnj/use-auth-context';
import { useCurrentStore, ALL_STORES } from 'src/contexts/current-store';
import { m, AnimatePresence, fadeIn, staggerContainer } from 'src/views/admin/_shared/motion';

const STATUS_COLOR = {
  active:   { bg: '#059669', label: 'Hoạt động' },
  inactive: { bg: '#94A3B8', label: 'Tạm dừng' },
  closed:   { bg: '#DC2626', label: 'Đã đóng' },
};

function StoreRow({ store, selected, onPick }) {
  const status = STATUS_COLOR[store.status] ?? STATUS_COLOR.inactive;
  return (
    <m.div variants={fadeIn}>
      <ButtonBase
        onClick={onPick}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 1,
          px: 1.25, py: 0.875,
          bgcolor: selected ? 'primary.lighter' : 'transparent',
          borderLeft: 3,
          borderLeftColor: selected ? 'primary.main' : 'transparent',
          borderRadius: 0,
          transition: 'background-color .12s, border-color .12s',
          '&:hover': { bgcolor: selected ? 'primary.lighter' : 'grey.50' },
          textAlign: 'left',
        }}
      >
        <Box sx={{
          width: 24, height: 24, borderRadius: 0.75,
          bgcolor: selected ? 'primary.main' + '22' : 'grey.100',
          color: selected ? 'primary.main' : 'text.secondary',
          display: 'grid', placeItems: 'center',
        }}>
          <Iconify icon="solar:shop-2-linear" width={13} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Typography sx={{ fontSize: 10, fontFamily: 'monospace', color: 'text.disabled', flexShrink: 0 }}>
              {store.code}
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }} noWrap>
              {store.name}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }} noWrap>
            {store.district} · {store.phone}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: status.bg }} />
          {selected && (
            <Iconify icon="solar:check-circle-bold" width={14} sx={{ color: 'primary.main' }} />
          )}
        </Box>
      </ButtonBase>
    </m.div>
  );
}

export function StoreSelectorPopover({ sx }) {
  const { has } = usePermission();
  const { currentStore, availableStores, isAllStores, canViewAll, setCurrentStoreId } = useCurrentStore();
  const popover = usePopover();
  const [search, setSearch] = useState('');

  const canSwitch = has('store.switch') || canViewAll;
  if (!canSwitch || !availableStores?.length) return null;

  const groupedByProvince = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? availableStores.filter((s) =>
          s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.district?.toLowerCase().includes(q)
        )
      : availableStores;
    const map = new Map();
    filtered.forEach((s) => {
      const key = s.province ?? 'Khác';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    });
    return Array.from(map.entries()).map(([province, stores]) => ({ province, stores }));
  }, [availableStores, search]);

  const pick = (id) => {
    setCurrentStoreId(id);
    popover.onClose();
    setSearch('');
  };

  return (
    <>
      <ButtonBase
        onClick={popover.onOpen}
        disableRipple
        sx={[{
          height: 36,
          px: 1.25, py: 0.5,
          bgcolor: popover.open ? 'grey.100' : 'background.paper',
          border: 1, borderColor: 'divider',
          borderRadius: 1,
          display: 'inline-flex', alignItems: 'center', gap: 1,
          transition: 'background-color .15s, border-color .15s',
          '&:hover': { borderColor: 'text.disabled', bgcolor: 'grey.50' },
        }, ...(Array.isArray(sx) ? sx : [sx])]}
      >
        <Box sx={{
          width: 22, height: 22, borderRadius: 0.5,
          bgcolor: isAllStores ? 'warning.lighter' : 'primary.lighter',
          color:   isAllStores ? 'warning.dark'    : 'primary.main',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Iconify icon={isAllStores ? 'solar:global-linear' : 'solar:shop-2-linear'} width={12} />
        </Box>

        <Box sx={{ textAlign: 'left', minWidth: 0 }}>
          <Typography sx={{ fontSize: 9.5, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase', lineHeight: 1 }}>
            Cửa hàng
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', lineHeight: 1.1, mt: 0.1 }} noWrap>
            {isAllStores ? 'Tất cả cửa hàng' : `${currentStore?.code ?? '—'} · ${currentStore?.name ?? ''}`}
          </Typography>
        </Box>

        <Iconify
          icon="solar:alt-arrow-down-linear"
          width={12}
          sx={{
            color: 'text.disabled',
            transition: 'transform .2s',
            transform: popover.open ? 'rotate(180deg)' : 'rotate(0)',
          }}
        />
      </ButtonBase>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={() => { popover.onClose(); setSearch(''); }}
        slotProps={{
          arrow: { placement: 'top-center' },
          paper: {
            sx: {
              mt: 0.5, width: 340, overflow: 'hidden',
              border: 1, borderColor: 'divider',
            },
          },
        }}
      >
        <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Iconify icon="solar:shop-2-linear" width={14} sx={{ color: 'text.secondary' }} />
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary', letterSpacing: 0.3, textTransform: 'uppercase' }}>
              Chọn cửa hàng
            </Typography>
            <Chip
              label={`${availableStores.length}`}
              size="small"
              sx={{ ml: 'auto', height: 16, fontSize: 9.5, fontWeight: 700, bgcolor: 'grey.100' }}
            />
          </Stack>

          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small" fullWidth
            placeholder="Tìm theo mã, tên, quận…"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-linear" width={13} />
                </InputAdornment>
              ),
              sx: { fontSize: 12 },
            }}
          />
        </Box>

        <Divider />

        <Box sx={{ maxHeight: 420, overflowY: 'auto', py: 0.5 }}>
          {canViewAll && (
            <>
              <StoreRow
                store={{
                  code: '🌐', name: 'Tất cả cửa hàng',
                  district: 'Dữ liệu tổng hợp cross-store', phone: '',
                  status: 'active',
                }}
                selected={isAllStores}
                onPick={() => pick(ALL_STORES)}
              />
              <Divider sx={{ my: 0.5 }} />
            </>
          )}

          <AnimatePresence initial={false}>
            {groupedByProvince.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.disabled' }}>
                <Iconify icon="solar:magnifer-linear" width={22} sx={{ mb: 0.5 }} />
                <Typography sx={{ fontSize: 11.5 }}>Không có cửa hàng nào khớp</Typography>
              </Box>
            ) : (
              <m.div variants={staggerContainer(0.03, 0)} initial="hidden" animate="show">
                {groupedByProvince.map(({ province, stores }) => (
                  <Box key={province} sx={{ mb: 0.5 }}>
                    <Stack
                      direction="row" alignItems="center" spacing={0.75}
                      sx={{ px: 1.5, py: 0.5, bgcolor: 'grey.50' }}
                    >
                      <Iconify icon="solar:map-point-linear" width={11} sx={{ color: 'text.disabled' }} />
                      <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.3, textTransform: 'uppercase' }}>
                        {province}
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: 'text.disabled', ml: 'auto' }}>
                        {stores.length}
                      </Typography>
                    </Stack>
                    {stores.map((s) => (
                      <StoreRow
                        key={s.id}
                        store={s}
                        selected={!isAllStores && currentStore?.id === s.id}
                        onPick={() => pick(s.id)}
                      />
                    ))}
                  </Box>
                ))}
              </m.div>
            )}
          </AnimatePresence>
        </Box>

        <Divider />

        <Box sx={{ px: 1.5, py: 1, bgcolor: 'grey.50' }}>
          <Typography sx={{ fontSize: 10.5, color: 'text.disabled', lineHeight: 1.4 }}>
            {isAllStores
              ? 'Đang xem dữ liệu tất cả cửa hàng có quyền truy cập.'
              : `Đang xem riêng cửa hàng ${currentStore?.name ?? ''}.`}
          </Typography>
        </Box>
      </CustomPopover>
    </>
  );
}
