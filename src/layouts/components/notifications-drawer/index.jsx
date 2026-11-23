// src/layouts/components/notifications-drawer/index.jsx — redesign v2
// Gọn gàng, nổi bật, dễ đọc. Mock data linked với orders/returns/promotions.

'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBoolean } from 'minimal-shared/hooks';

import {
  Badge, Box, Button, Divider, IconButton, Stack, Tooltip, Typography,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { varTap, varHover, transitionTap } from 'src/components/animate';
import { m, AnimatePresence, fadeIn, staggerContainer } from 'src/views/admin/_shared/motion';

import {
  mockAdminNotifications, NOTIFICATION_CATEGORIES,
} from 'src/mock-data/admin-notifications';

// ---- utilities ----
const DAY = 86_400_000;
function relative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
}

function groupByDay(items) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();
  const yestTs = todayTs - DAY;
  const groups = { today: [], yesterday: [], earlier: [] };
  items.forEach((n) => {
    const t = new Date(n.created_at).getTime();
    if (t >= todayTs) groups.today.push(n);
    else if (t >= yestTs) groups.yesterday.push(n);
    else groups.earlier.push(n);
  });
  return groups;
}

// ---- Item ----
function Item({ item, onClick }) {
  return (
    <m.div variants={fadeIn} layout>
      <Box
        onClick={onClick}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'flex-start',
          gap: 1.25,
          px: 2, py: 1.25,
          cursor: 'pointer',
          position: 'relative',
          borderLeft: 2,
          borderLeftColor: item.is_unread ? item.color : 'transparent',
          bgcolor: item.is_unread ? item.color + '08' : 'transparent',
          transition: 'background-color .18s, border-color .18s',
          '&:hover': { bgcolor: item.color + '12' },
        }}
      >
        <Box sx={{
          width: 32, height: 32, borderRadius: 1,
          bgcolor: item.color + '14', color: item.color,
          display: 'grid', placeItems: 'center',
          flexShrink: 0,
        }}>
          <Iconify icon={item.icon} width={16} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{
            fontSize: 12.5, fontWeight: item.is_unread ? 700 : 500,
            color: 'text.primary', lineHeight: 1.3, mb: 0.25,
          }}>
            {item.title}
          </Typography>
          <Typography sx={{
            fontSize: 11.5, color: 'text.secondary', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.message}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.5 }}>
            <Iconify icon="solar:clock-circle-linear" width={10} sx={{ color: 'text.disabled' }} />
            <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
              {relative(item.created_at)}
            </Typography>
          </Stack>
        </Box>

        {item.is_unread && (
          <Box sx={{
            width: 8, height: 8, borderRadius: '50%',
            bgcolor: item.color, mt: 0.5, flexShrink: 0,
          }} />
        )}
      </Box>
    </m.div>
  );
}

// ---- Group header ----
function GroupHeader({ label, count }) {
  return (
    <Stack
      direction="row" alignItems="center" spacing={1}
      sx={{ px: 2, py: 0.75, bgcolor: 'grey.50' }}
    >
      <Typography sx={{
        fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
        color: 'text.disabled', textTransform: 'uppercase',
      }}>
        {label}
      </Typography>
      <Box sx={{
        fontSize: 9.5, fontWeight: 700,
        color: 'text.disabled', bgcolor: 'grey.100',
        px: 0.75, borderRadius: 0.5,
      }}>
        {count}
      </Box>
      <Box sx={{ flex: 1, height: 1, bgcolor: 'divider', opacity: 0.5 }} />
    </Stack>
  );
}

// ---- Main ----
export function NotificationsDrawer({ sx, ...other }) {
  const router = useRouter();
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();
  const [items, setItems] = useState(mockAdminNotifications);
  const [category, setCategory] = useState('all');

  const unreadCount = useMemo(() => items.filter((x) => x.is_unread).length, [items]);
  const filtered = useMemo(
    () => (category === 'all' ? items : items.filter((x) => x.category === category)),
    [items, category],
  );
  const grouped = useMemo(() => groupByDay(filtered), [filtered]);
  const categoryCounts = useMemo(() => {
    const map = { all: items.length };
    items.forEach((x) => { map[x.category] = (map[x.category] ?? 0) + 1; });
    return map;
  }, [items]);

  const markAllRead = () => setItems((prev) => prev.map((x) => ({ ...x, is_unread: false })));
  const markOneRead = (id) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, is_unread: false } : x)));

  const handleItemClick = (item) => {
    markOneRead(item.id);
    if (item.deeplink) {
      onClose();
      router.push(item.deeplink);
    }
  };

  const renderHeader = () => (
    <Box sx={{
      position: 'relative',
      px: 2.5, pt: 2, pb: 1.5,
      bgcolor: 'grey.50',
      borderBottom: 1, borderColor: 'divider',
    }}>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Box sx={{
          width: 34, height: 34, borderRadius: 1,
          bgcolor: 'primary.lighter', color: 'primary.main',
          display: 'grid', placeItems: 'center',
        }}>
          <Iconify icon="solar:bell-bold" width={17} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
            Thông báo
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.1 }}>
            {unreadCount > 0 ? `${unreadCount} chưa đọc · ${items.length} tổng` : `${items.length} thông báo`}
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Tooltip title="Đánh dấu tất cả đã đọc">
            <IconButton size="small" onClick={markAllRead} sx={{ color: 'text.secondary' }}>
              <Iconify icon="solar:check-read-linear" width={16} />
            </IconButton>
          </Tooltip>
        )}
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <Iconify icon="solar:close-circle-linear" width={16} />
        </IconButton>
      </Stack>
    </Box>
  );

  const renderCategoryPills = () => (
    <Box sx={{
      px: 1.5, py: 1.25,
      bgcolor: 'background.paper',
      borderBottom: 1, borderColor: 'divider',
      overflowX: 'auto',
      '&::-webkit-scrollbar': { display: 'none' },
    }}>
      <Stack direction="row" spacing={0.75} sx={{ width: 'fit-content' }}>
        {NOTIFICATION_CATEGORIES.map((c) => {
          const active = category === c.value;
          const count = categoryCounts[c.value] ?? 0;
          if (count === 0 && c.value !== 'all') return null;
          return (
            <m.button
              key={c.value}
              onClick={() => setCategory(c.value)}
              whileTap={{ scale: 0.95 }}
              style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.5,
                px: 1, py: 0.5,
                bgcolor: active ? 'primary.lighter' : 'background.paper',
                border: 1,
                borderColor: active ? 'primary.main' : 'divider',
                borderRadius: 1,
                transition: 'background-color .15s, border-color .15s',
                whiteSpace: 'nowrap',
              }}>
                <Iconify icon={c.icon} width={11} sx={{ color: active ? 'primary.main' : 'text.secondary' }} />
                <Typography sx={{
                  fontSize: 11, fontWeight: 600,
                  color: active ? 'primary.main' : 'text.primary',
                }}>
                  {c.label}
                </Typography>
                <Typography sx={{
                  fontSize: 9.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                  color: active ? 'primary.main' : 'text.disabled',
                  bgcolor: active ? 'background.paper' : 'grey.100',
                  px: 0.5, borderRadius: 0.5,
                }}>
                  {count}
                </Typography>
              </Box>
            </m.button>
          );
        })}
      </Stack>
    </Box>
  );

  const renderEmpty = () => (
    <Stack alignItems="center" spacing={1.5} sx={{ py: 8, color: 'text.disabled' }}>
      <Box sx={{
        width: 56, height: 56, borderRadius: 1,
        bgcolor: 'grey.100', color: 'text.disabled',
        display: 'grid', placeItems: 'center',
      }}>
        <Iconify icon="solar:bell-off-linear" width={28} />
      </Box>
      <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.secondary' }}>
        Không có thông báo
      </Typography>
      <Typography sx={{ fontSize: 11, color: 'text.disabled', textAlign: 'center', px: 4 }}>
        Bạn đã xử lý xong mọi thứ trong danh mục này.
      </Typography>
    </Stack>
  );

  const renderGroup = (label, list) => {
    if (!list.length) return null;
    return (
      <Box>
        <GroupHeader label={label} count={list.length} />
        <m.div variants={staggerContainer(0.04, 0.02)} initial="hidden" animate="show">
          {list.map((item) => (
            <Item key={item.id} item={item} onClick={() => handleItemClick(item)} />
          ))}
        </m.div>
      </Box>
    );
  };

  const renderFooter = () => (
    <Box sx={{
      borderTop: 1, borderColor: 'divider',
      bgcolor: 'grey.50',
      px: 2, py: 1.25,
      display: 'flex', alignItems: 'center', gap: 1,
    }}>
      <Iconify icon="solar:info-circle-linear" width={12} sx={{ color: 'text.disabled' }} />
      <Typography sx={{ fontSize: 10.5, color: 'text.disabled', flex: 1 }}>
        Realtime · tự động cập nhật
      </Typography>
      <Button
        size="small" variant="text"
        onClick={() => { onClose(); router.push('/admin/activity-log'); }}
        endIcon={<Iconify icon="solar:arrow-right-linear" width={12} />}
        sx={{ fontSize: 11, color: 'primary.main', textTransform: 'none' }}
      >
        Xem tất cả
      </Button>
    </Box>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="Thông báo"
        onClick={onOpen}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsNoneOutlined />
        </Badge>
      </IconButton>

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{
          sx: {
            width: 1, maxWidth: 420,
            display: 'flex', flexDirection: 'column',
            borderLeft: 1, borderColor: 'divider',
          },
        }}
      >
        {renderHeader()}
        {renderCategoryPills()}

        <Scrollbar sx={{ flex: 1 }}>
          <AnimatePresence initial={false}>
            {filtered.length === 0 ? (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderEmpty()}
              </m.div>
            ) : (
              <Box key={category}>
                {renderGroup('Hôm nay', grouped.today)}
                {renderGroup('Hôm qua', grouped.yesterday)}
                {renderGroup('Trước đó', grouped.earlier)}
              </Box>
            )}
          </AnimatePresence>
        </Scrollbar>

        {renderFooter()}
      </Drawer>
    </>
  );
}
