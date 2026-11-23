// src/views/admin/menu/menu-edit-view.jsx
// Edit view routes by location kind: mega_* → MegaMenuBuilder, others → simple tree editor.

'use client';

import { useState, useMemo } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetMenuTree,
  useGetMenuLocationList,
  useGetServiceCallouts,
  getLocationKind,
} from 'src/actions/admin/menu';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';

import { MegaMenuBuilder } from './mega-menu-builder';

// ----------------- Simple flat/tree editor (header/footer/mobile) -----------------

function SimpleMenuEditor({ tree, onChange }) {
  const patch = (id, p) => onChange(tree.map((it) => (it.id === id ? { ...it, ...p } : it)));
  const move = (id, dir) => {
    const i = tree.findIndex((t) => t.id === id);
    const t = i + dir;
    if (i < 0 || t < 0 || t >= tree.length) return;
    const next = [...tree];
    [next[i], next[t]] = [next[t], next[i]];
    onChange(next);
  };
  const remove = (id) => onChange(tree.filter((t) => t.id !== id));
  const add = () => onChange([
    ...tree,
    { id: `it-${Date.now()}`, label: 'Mục mới', icon: null, url: '/', sort: tree.length + 1, badge: null, panel: null },
  ]);

  return (
    <Box sx={{ maxWidth: 820 }}>
      <Stack spacing={1}>
        {tree.map((it, i) => (
          <Stack
            key={it.id}
            direction="row" alignItems="center" spacing={1}
            sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}
          >
            <Chip label={`#${i + 1}`} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 800 }} />
            <Box
              component="input"
              value={it.label}
              onChange={(e) => patch(it.id, { label: e.target.value })}
              placeholder="Nhãn"
              sx={{
                flex: 1, border: 1, borderColor: 'divider', borderRadius: 0.75,
                px: 1, py: 0.75, fontSize: 13, outline: 0,
                '&:focus': { borderColor: 'primary.main' },
              }}
            />
            <Box
              component="input"
              value={it.url ?? ''}
              onChange={(e) => patch(it.id, { url: e.target.value })}
              placeholder="/url"
              sx={{
                flex: 1, border: 1, borderColor: 'divider', borderRadius: 0.75,
                px: 1, py: 0.75, fontSize: 13, fontFamily: 'monospace', outline: 0,
                '&:focus': { borderColor: 'primary.main' },
              }}
            />
            <Button size="small" disabled={i === 0} onClick={() => move(it.id, -1)}>↑</Button>
            <Button size="small" disabled={i === tree.length - 1} onClick={() => move(it.id, 1)}>↓</Button>
            <Button size="small" color="error" onClick={() => remove(it.id)}>Xoá</Button>
          </Stack>
        ))}
      </Stack>
      <Button
        variant="outlined"
        startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
        onClick={add}
        sx={{ mt: 2 }}
      >
        Thêm mục
      </Button>
    </Box>
  );
}

// ----------------- Main view -----------------

export function MenuEditView({ location }) {
  const { locations } = useGetMenuLocationList();
  const meta = useMemo(() => locations.find((l) => l.location === location), [locations, location]);
  const { tree: initialTree } = useGetMenuTree(location);
  const { callouts: allCallouts } = useGetServiceCallouts();

  const [tree, setTree] = useState(initialTree);
  const [dirty, setDirty] = useState(false);

  const handleChange = (next) => {
    setTree(next);
    setDirty(true);
  };

  const kind = getLocationKind(location);

  if (!meta) {
    return (
      <DashboardContent disablePadding>
        <PageHeader
          title="Không tìm thấy vị trí menu"
          breadcrumbs={[
            { label: 'PNJ Admin', href: adminPaths.dashboard },
            { label: 'Menu', href: adminPaths.menu.root },
            { label: location },
          ]}
        />
        <Box sx={{ p: 4 }}>
          <Button variant="outlined" href={adminPaths.menu.root}>Quay lại danh sách</Button>
        </Box>
      </DashboardContent>
    );
  }

  const totalEntries = tree.reduce((n, it) => n + (it.panel?.columns ?? []).reduce((m, c) => m + c.entries.length, 0), 0);

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={meta.label}
        subtitle={`${location} · ${tree.length} mục chính${kind === 'mega' ? ` · ${totalEntries} entry` : ''}`}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Menu', href: adminPaths.menu.root },
          { label: meta.label },
        ]}
        actions={
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {dirty && (
              <Chip
                size="small"
                icon={<Iconify icon="solar:clock-circle-linear" width={12} />}
                label="Có thay đổi chưa lưu"
                color="warning"
                sx={{ height: 24, fontSize: 11 }}
              />
            )}
            <Button
              size="small"
              variant="outlined"
              startIcon={<Iconify icon="solar:restart-linear" width={14} />}
              disabled={!dirty}
              onClick={() => { setTree(initialTree); setDirty(false); toast.info('Đã khôi phục.'); }}
            >
              Khôi phục
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<Iconify icon="solar:check-circle-linear" width={14} />}
              disabled={!dirty}
              onClick={() => { setDirty(false); toast.success('Mock save: đã lưu menu.'); }}
            >
              Lưu menu
            </Button>
          </Stack>
        }
      />

      <Box sx={{ p: { xs: 2, md: 2.5 }, bgcolor: 'grey.50', minHeight: 'calc(100vh - 160px)' }}>
        {kind === 'mega' ? (
          <MegaMenuBuilder tree={tree} allCallouts={allCallouts} onChange={handleChange} />
        ) : (
          <Box sx={{ bgcolor: 'background.paper', p: 2.5, borderRadius: 1, border: 1, borderColor: 'divider' }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 2 }}>
              Menu đơn giản: tạo danh sách phẳng các mục link (header/footer/mobile).
              Dùng <b>MegaMenuBuilder</b> cho các vị trí `mega_*`.
            </Typography>
            <SimpleMenuEditor tree={tree} onChange={handleChange} />
          </Box>
        )}
      </Box>
    </DashboardContent>
  );
}
