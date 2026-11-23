// src/components/common/form-drawer/form-drawer.jsx
// Drawer bên phải cho form Tạo/Sửa — style §11 của PNJ (form 2 cột nhẹ).
//
// Scroll fix (ref: zeno-crm-fe/src/subs/adsAccount/*):
//   1. Paper = flex column full height.
//   2. Body dùng <Scrollbar> (SimpleBar overlay) → chỉ 1 thanh cuộn, không chiếm chiều rộng.
//   3. Lock cả body + html + root layout khi drawer mở — chặn triệt để tất cả scrollbar ngoài
//      (document, dashboard content container…) để chỉ còn 1 thanh duy nhất của drawer.

'use client';

import { useRef, useEffect } from 'react';

import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// Khi mở drawer, lock scroll của mọi container ngoài — để chỉ còn thanh của <Scrollbar> trong drawer.
// Trả ra function restore để useEffect dọn khi đóng / unmount.
function lockOuterScroll() {
  if (typeof window === 'undefined') return () => {};
  const html = document.documentElement;
  const body = document.body;

  // Đo width scrollbar đã mất để bù padding-right, tránh layout nhảy.
  const sbw = window.innerWidth - html.clientWidth;

  const prev = {
    bodyOverflow: body.style.overflow,
    htmlOverflow: html.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
  };

  // Lock cứng document scroll
  body.style.overflow = 'hidden';
  html.style.overflow = 'hidden';
  if (sbw > 0) body.style.paddingRight = `${sbw}px`;

  // Dashboard template thường có container `<Box component="main">` hoặc wrapper với
  // `overflow: auto` riêng → tìm và tạm lock overflow của chúng.
  const scrollables = Array.from(document.querySelectorAll('[data-slot="main"], main, .simplebar-wrapper'))
    .filter((el) => {
      const cs = window.getComputedStyle(el);
      return cs.overflowY === 'auto' || cs.overflowY === 'scroll';
    });
  const lockedOutside = scrollables.map((el) => {
    const was = el.style.overflow;
    el.style.overflow = 'hidden';
    return () => { el.style.overflow = was; };
  });

  return () => {
    body.style.overflow = prev.bodyOverflow;
    html.style.overflow = prev.htmlOverflow;
    body.style.paddingRight = prev.bodyPaddingRight;
    lockedOutside.forEach((fn) => fn());
  };
}

export function FormDrawer({
  open,
  onClose,
  title,
  subtitle,
  width = 560,
  footer,
  children,
  disableBackdropClose,
}) {
  // Giữ ref restore để cleanup chuẩn dù prop `open` toggle nhanh.
  const restoreRef = useRef(null);
  useEffect(() => {
    if (open) {
      restoreRef.current = lockOuterScroll();
    } else if (restoreRef.current) {
      restoreRef.current();
      restoreRef.current = null;
    }
    return () => {
      if (restoreRef.current) {
        restoreRef.current();
        restoreRef.current = null;
      }
    };
  }, [open]);

  // Resolve width string: number → px, else dùng raw ('100vw', '50%'…).
  const requested = typeof width === 'number' ? `${width}px` : width;
  // Clamp để không tràn qua sidebar — max = viewport - sidebar - 24px margin.
  const maxOnDesktop = 'calc(100vw - var(--layout-nav-vertical-width, 280px) - 24px)';
  const clampedWidth = `min(${requested}, ${maxOnDesktop})`;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={disableBackdropClose ? undefined : onClose}
      // Tắt luôn Mui ScrollLock mặc định — ta tự lock đầy đủ hơn.
      ModalProps={{ disableScrollLock: true }}
      PaperProps={{
        sx: {
          width: { xs: '100%', md: clampedWidth },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // Paper không scroll — chỉ Scrollbar bên trong scroll.
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={2}
        sx={{
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" noWrap>{subtitle}</Typography>
          )}
        </Box>
        <IconButton onClick={onClose} edge="end" size="small">
          <Iconify icon="eva:close-fill" width={20} />
        </IconButton>
      </Stack>

      {/* Body — SimpleBar overlay scroll (chỉ 1 thanh, không chiếm width).
          Scrollbar nhuộm grey.50 để match grey wrapper của form bên trong.
          Padding Box > mx/my (-3/-2.5) của form wrapper → cards cách Paper một khoảng đều. */}
      <Scrollbar fillContent={false} sx={{ flex: 1, minHeight: 0, bgcolor: 'grey.50' }}>
        <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 4 } }}>{children}</Box>
      </Scrollbar>

      {/* Footer */}
      {footer && (
        <>
          <Divider />
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            sx={{ px: 3, py: 2, bgcolor: 'background.default', flexShrink: 0 }}
          >
            {footer}
          </Stack>
        </>
      )}
    </Drawer>
  );
}
