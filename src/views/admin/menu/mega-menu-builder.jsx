// src/views/admin/menu/mega-menu-builder.jsx
// 3-pane mega-menu builder: primary items (left) · column editor (center) · live preview (right).

'use client';

import { useState, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { FieldLabel, SectionCard } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { IconPicker } from 'src/components/common/icon-picker';

import { MegaMenuPanel } from './mega-menu-panel';

// ───────────────── Helpers ─────────────────

const newId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

const ENTRY_KINDS = [
  { value: 'text',       label: 'Text link',   icon: 'solar:link-linear',          desc: 'Text + URL · gắn badge NEW/HOT' },
  { value: 'brand_chip', label: 'Brand chip',  icon: 'solar:crown-minimalistic-linear', desc: 'Chip logo thương hiệu (PNJ, STYLE, ARTA…)' },
  { value: 'co_brand',   label: 'Co-brand',    icon: 'solar:hand-shake-linear',    desc: 'Co-brand quốc tế (Disney, Hello Kitty…)' },
];

// ───────────────── Entry row editor ─────────────────

function EntryRow({ entry, onChange, onRemove, onMove, idx, total }) {
  if (entry.kind === 'brand_chip') {
    return (
      <Stack
        direction="row" alignItems="center" spacing={0.75}
        sx={{ p: 1, borderRadius: 1, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
      >
        <Chip label="BRAND" size="small" sx={{ height: 18, fontSize: 9, fontWeight: 800 }} />
        <TextField
          size="small"
          value={entry.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="PNJ"
          sx={{ width: 100 }}
        />
        <TextField
          size="small"
          value={entry.logo_url ?? ''}
          onChange={(e) => onChange({ logo_url: e.target.value })}
          placeholder="/logo/brand-pnj.svg"
          sx={{ flex: 1 }}
          inputProps={{ style: { fontFamily: 'monospace', fontSize: 11 } }}
        />
        <TextField
          size="small"
          value={entry.url ?? ''}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="/thuong-hieu/pnj"
          sx={{ flex: 1 }}
          inputProps={{ style: { fontFamily: 'monospace', fontSize: 11 } }}
        />
        <IconButton size="small" disabled={idx === 0} onClick={() => onMove(-1)}>
          <Iconify icon="solar:arrow-up-linear" width={14} />
        </IconButton>
        <IconButton size="small" disabled={idx === total - 1} onClick={() => onMove(1)}>
          <Iconify icon="solar:arrow-down-linear" width={14} />
        </IconButton>
        <IconButton size="small" onClick={onRemove} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-linear" width={14} />
        </IconButton>
      </Stack>
    );
  }
  if (entry.kind === 'co_brand') {
    return (
      <Stack
        direction="row" alignItems="center" spacing={0.75}
        sx={{ p: 1, borderRadius: 1, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
      >
        <Chip label="CO-BRAND" size="small" color="info" sx={{ height: 18, fontSize: 9, fontWeight: 800 }} />
        <TextField
          size="small"
          value={entry.partner_name ?? ''}
          onChange={(e) => onChange({ partner_name: e.target.value })}
          placeholder="Disney"
          sx={{ width: 120 }}
        />
        <TextField
          size="small"
          value={entry.logo_url ?? ''}
          onChange={(e) => onChange({ logo_url: e.target.value })}
          placeholder="/logo/cobrand-disney.svg"
          sx={{ flex: 1 }}
          inputProps={{ style: { fontFamily: 'monospace', fontSize: 11 } }}
        />
        <TextField
          size="small"
          value={entry.url ?? ''}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="/co-brand/disney-pnj"
          sx={{ flex: 1 }}
          inputProps={{ style: { fontFamily: 'monospace', fontSize: 11 } }}
        />
        <IconButton size="small" disabled={idx === 0} onClick={() => onMove(-1)}>
          <Iconify icon="solar:arrow-up-linear" width={14} />
        </IconButton>
        <IconButton size="small" disabled={idx === total - 1} onClick={() => onMove(1)}>
          <Iconify icon="solar:arrow-down-linear" width={14} />
        </IconButton>
        <IconButton size="small" onClick={onRemove} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-linear" width={14} />
        </IconButton>
      </Stack>
    );
  }
  return (
    <Stack
      direction="row" alignItems="center" spacing={0.75}
      sx={{ p: 1, borderRadius: 1, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
    >
      <Chip label="TEXT" size="small" variant="outlined" sx={{ height: 18, fontSize: 9, fontWeight: 800 }} />
      <TextField
        size="small"
        value={entry.label ?? ''}
        onChange={(e) => onChange({ label: e.target.value })}
        placeholder="Nhẫn"
        sx={{ flex: 1 }}
      />
      <TextField
        size="small"
        value={entry.url ?? ''}
        onChange={(e) => onChange({ url: e.target.value })}
        placeholder="/nhan"
        sx={{ flex: 1 }}
        inputProps={{ style: { fontFamily: 'monospace', fontSize: 11 } }}
      />
      <TextField
        size="small"
        value={entry.badge ?? ''}
        onChange={(e) => onChange({ badge: e.target.value || undefined })}
        placeholder="NEW"
        sx={{ width: 68 }}
      />
      <IconButton size="small" disabled={idx === 0} onClick={() => onMove(-1)}>
        <Iconify icon="solar:arrow-up-linear" width={14} />
      </IconButton>
      <IconButton size="small" disabled={idx === total - 1} onClick={() => onMove(1)}>
        <Iconify icon="solar:arrow-down-linear" width={14} />
      </IconButton>
      <IconButton size="small" onClick={onRemove} sx={{ color: 'error.main' }}>
        <Iconify icon="solar:trash-bin-trash-linear" width={14} />
      </IconButton>
    </Stack>
  );
}

// ───────────────── Column editor ─────────────────

function ColumnEditor({ column, onChange, onRemove, onMove, idx, total }) {
  const addEntry = (kind) => {
    const base = { id: newId('e'), kind };
    const entry = kind === 'brand_chip'
      ? { ...base, label: '', logo_url: '', url: '' }
      : kind === 'co_brand'
        ? { ...base, partner_name: '', logo_url: '', url: '' }
        : { ...base, label: '', url: '' };
    onChange({ entries: [...column.entries, entry] });
  };

  const updateEntry = (entryId, patch) => {
    onChange({
      entries: column.entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)),
    });
  };

  const removeEntry = (entryId) => {
    onChange({ entries: column.entries.filter((e) => e.id !== entryId) });
  };

  const moveEntry = (entryId, dir) => {
    const i = column.entries.findIndex((e) => e.id === entryId);
    const t = i + dir;
    if (i < 0 || t < 0 || t >= column.entries.length) return;
    const next = [...column.entries];
    [next[i], next[t]] = [next[t], next[i]];
    onChange({ entries: next });
  };

  return (
    <SectionCard
      title={column.heading || 'Cột chưa đặt tên'}
      description={`${column.entries.length} entry${column.entries.length > 1 ? 's' : ''}`}
      action={
        <Stack direction="row" spacing={0.25}>
          <IconButton size="small" disabled={idx === 0} onClick={() => onMove(-1)}>
            <Iconify icon="solar:arrow-left-linear" width={14} />
          </IconButton>
          <IconButton size="small" disabled={idx === total - 1} onClick={() => onMove(1)}>
            <Iconify icon="solar:arrow-right-linear" width={14} />
          </IconButton>
          <IconButton size="small" onClick={onRemove} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-linear" width={14} />
          </IconButton>
        </Stack>
      }
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1}>
          <Box sx={{ flex: 1 }}>
            <FieldLabel>HEADING</FieldLabel>
            <TextField
              size="small" fullWidth
              value={column.heading}
              onChange={(e) => onChange({ heading: e.target.value })}
              placeholder="Chủng Loại"
            />
          </Box>
          <Box sx={{ width: 220 }}>
            <FieldLabel>ICON</FieldLabel>
            <IconPicker
              value={column.heading_icon ?? ''}
              onChange={(v) => onChange({ heading_icon: v })}
              placeholder="Chọn icon cột..."
            />
          </Box>
        </Stack>

        <Stack spacing={0.5}>
          {column.entries.map((e, i) => (
            <EntryRow
              key={e.id}
              entry={e}
              idx={i}
              total={column.entries.length}
              onChange={(patch) => updateEntry(e.id, patch)}
              onRemove={() => removeEntry(e.id)}
              onMove={(dir) => moveEntry(e.id, dir)}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={0.5}>
          {ENTRY_KINDS.map((k) => (
            <Button
              key={k.value}
              size="small"
              variant="outlined"
              startIcon={<Iconify icon={k.icon} width={14} />}
              onClick={() => addEntry(k.value)}
              sx={{ flex: 1, textTransform: 'none' }}
            >
              {k.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </SectionCard>
  );
}

// ───────────────── Banner editor ─────────────────

function BannerEditor({ banner, onChange, onRemove }) {
  if (!banner) {
    return (
      <SectionCard title="Banner quảng cáo (tuỳ chọn)" description="Ảnh promo + title + CTA ở cột phải mega panel.">
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
          onClick={() => onChange({
            image_url: '',
            eyebrow: '',
            title: 'Bộ sưu tập mới',
            subtitle: '',
            cta_label: 'Khám phá ngay',
            cta_url: '',
            cta_color: '#1A8F4C',
            position: 'right',
            width_pct: 36,
          })}
        >
          Thêm banner
        </Button>
      </SectionCard>
    );
  }
  return (
    <SectionCard
      title="Banner quảng cáo"
      description={`Chiếm ${banner.width_pct ?? 36}% chiều ngang · bên ${banner.position ?? 'right'}.`}
      action={
        <IconButton size="small" onClick={onRemove} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-linear" width={14} />
        </IconButton>
      }
    >
      <Stack spacing={1.5}>
        <Box>
          <FieldLabel>IMAGE URL</FieldLabel>
          <TextField
            size="small" fullWidth
            value={banner.image_url}
            onChange={(e) => onChange({ image_url: e.target.value })}
            placeholder="https://cdn.pnj.com.vn/banner/la-ngoc-canh-vang.jpg"
            inputProps={{ style: { fontFamily: 'monospace', fontSize: 11 } }}
          />
        </Box>
        <Stack direction="row" spacing={1}>
          <Box sx={{ flex: 1 }}>
            <FieldLabel>EYEBROW</FieldLabel>
            <TextField
              size="small" fullWidth
              value={banner.eyebrow ?? ''}
              onChange={(e) => onChange({ eyebrow: e.target.value })}
              placeholder="BỘ SƯU TẬP MỚI"
            />
          </Box>
          <Box sx={{ flex: 2 }}>
            <FieldLabel>TITLE</FieldLabel>
            <TextField
              size="small" fullWidth
              value={banner.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Lá Ngọc Cành Vàng"
            />
          </Box>
        </Stack>
        <Box>
          <FieldLabel>SUBTITLE</FieldLabel>
          <TextField
            size="small" fullWidth
            value={banner.subtitle ?? ''}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            placeholder="Để thương yêu. Để nâng niu."
          />
        </Box>
        <Stack direction="row" spacing={1}>
          <Box sx={{ flex: 1 }}>
            <FieldLabel>CTA LABEL</FieldLabel>
            <TextField
              size="small" fullWidth
              value={banner.cta_label ?? ''}
              onChange={(e) => onChange({ cta_label: e.target.value })}
            />
          </Box>
          <Box sx={{ flex: 2 }}>
            <FieldLabel>CTA URL</FieldLabel>
            <TextField
              size="small" fullWidth
              value={banner.cta_url ?? ''}
              onChange={(e) => onChange({ cta_url: e.target.value })}
              inputProps={{ style: { fontFamily: 'monospace', fontSize: 11 } }}
            />
          </Box>
          <Box sx={{ width: 110 }}>
            <FieldLabel>WIDTH %</FieldLabel>
            <TextField
              type="number" size="small" fullWidth
              value={banner.width_pct ?? 36}
              onChange={(e) => onChange({ width_pct: Number(e.target.value) || 36 })}
              inputProps={{ min: 20, max: 60 }}
            />
          </Box>
          <Box sx={{ width: 110 }}>
            <FieldLabel>CTA COLOR</FieldLabel>
            <TextField
              size="small" fullWidth
              value={banner.cta_color ?? '#1A8F4C'}
              onChange={(e) => onChange({ cta_color: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: banner.cta_color ?? '#1A8F4C', border: 1, borderColor: 'divider' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </SectionCard>
  );
}

// ───────────────── Main builder ─────────────────

/**
 * Edit a full mega-menu tree.
 *
 * @param tree             primary items with panels
 * @param allCallouts      resolved service-callout objects (list)
 * @param onChange         (nextTree) => void
 */
export function MegaMenuBuilder({ tree = [], allCallouts = [], onChange }) {
  const [activeId, setActiveId] = useState(() => tree.find((p) => p.panel)?.id ?? tree[0]?.id);

  useEffect(() => {
    if (!tree.length) return;
    if (!tree.find((p) => p.id === activeId)) setActiveId(tree[0].id);
  }, [tree, activeId]);

  const active = tree.find((p) => p.id === activeId);
  const panel = active?.panel ?? null;
  const resolvedCallouts = useMemo(
    () => (panel?.service_callouts ?? []).map((id) => allCallouts.find((c) => c.id === id)).filter(Boolean),
    [panel, allCallouts]
  );

  const updateTree = (next) => { onChange?.(next); };

  const patchPrimary = (patch) => {
    updateTree(tree.map((p) => (p.id === activeId ? { ...p, ...patch } : p)));
  };

  const patchPanel = (patch) => {
    updateTree(tree.map((p) => (p.id === activeId ? { ...p, panel: { ...(p.panel ?? { kind: 'multi_column', columns: [], service_callouts: [] }), ...patch } } : p)));
  };

  const ensurePanel = () => {
    if (!panel) patchPanel({ columns: [], service_callouts: [] });
  };

  const addColumn = () => {
    ensurePanel();
    const nextCols = [...(panel?.columns ?? []), { id: newId('col'), heading: 'Cột mới', heading_icon: '', entries: [] }];
    patchPanel({ columns: nextCols });
  };

  const patchColumn = (colId, patch) => {
    patchPanel({ columns: panel.columns.map((c) => (c.id === colId ? { ...c, ...patch } : c)) });
  };

  const removeColumn = (colId) => {
    patchPanel({ columns: panel.columns.filter((c) => c.id !== colId) });
  };

  const moveColumn = (colId, dir) => {
    const i = panel.columns.findIndex((c) => c.id === colId);
    const t = i + dir;
    if (i < 0 || t < 0 || t >= panel.columns.length) return;
    const next = [...panel.columns];
    [next[i], next[t]] = [next[t], next[i]];
    patchPanel({ columns: next });
  };

  const addPrimary = () => {
    const newItem = {
      id: newId('p'),
      label: 'Mục mới',
      icon: 'solar:tag-linear',
      url: '/',
      sort: tree.length + 1,
      badge: null,
      panel: null,
    };
    updateTree([...tree, newItem]);
    setActiveId(newItem.id);
  };

  const removePrimary = (id) => {
    const next = tree.filter((p) => p.id !== id);
    updateTree(next);
    if (id === activeId) setActiveId(next[0]?.id);
  };

  const movePrimary = (id, dir) => {
    const i = tree.findIndex((p) => p.id === id);
    const t = i + dir;
    if (i < 0 || t < 0 || t >= tree.length) return;
    const next = [...tree];
    [next[i], next[t]] = [next[t], next[i]];
    updateTree(next);
  };

  return (
    <Grid container spacing={2}>
      {/* ───── Primary items list ───── */}
      <Grid size={{ xs: 12, md: 3 }}>
        <SectionCard
          title={`Mục chính · ${tree.length}`}
          description="Sidebar trái của mega menu."
          action={
            <Button size="small" variant="outlined" startIcon={<Iconify icon="solar:add-circle-linear" width={14} />} onClick={addPrimary}>
              Thêm
            </Button>
          }
        >
          <Stack spacing={0.5}>
            {tree.map((p, i) => {
              const isActive = p.id === activeId;
              return (
                <Box
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    border: 1,
                    borderColor: isActive ? 'primary.light' : 'divider',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon={p.icon} width={16} sx={{ color: isActive ? 'primary.main' : 'text.secondary' }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: isActive ? 700 : 600 }} noWrap>{p.label}</Typography>
                      <Typography sx={{ fontSize: 10.5, color: 'text.disabled', fontFamily: 'monospace' }} noWrap>{p.url}</Typography>
                    </Box>
                    {p.panel && <Chip label="MEGA" size="small" color="primary" sx={{ height: 15, fontSize: 8, fontWeight: 800 }} />}
                    {p.badge && <Chip label={p.badge.text} size="small" sx={{ height: 15, fontSize: 8, fontWeight: 800, bgcolor: p.badge.color ?? '#EF4444', color: '#fff' }} />}
                  </Stack>
                  <Stack direction="row" spacing={0.25} sx={{ mt: 0.5 }}>
                    <IconButton size="small" disabled={i === 0} onClick={(e) => { e.stopPropagation(); movePrimary(p.id, -1); }}>
                      <Iconify icon="solar:arrow-up-linear" width={12} />
                    </IconButton>
                    <IconButton size="small" disabled={i === tree.length - 1} onClick={(e) => { e.stopPropagation(); movePrimary(p.id, 1); }}>
                      <Iconify icon="solar:arrow-down-linear" width={12} />
                    </IconButton>
                    <Box sx={{ flex: 1 }} />
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); removePrimary(p.id); }} sx={{ color: 'error.main' }}>
                      <Iconify icon="solar:trash-bin-trash-linear" width={12} />
                    </IconButton>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </SectionCard>
      </Grid>

      {/* ───── Column editor + primary meta ───── */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Stack spacing={2}>
          {active && (
            <SectionCard title="Thuộc tính mục chính">
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1}>
                  <Box sx={{ flex: 1 }}>
                    <FieldLabel>LABEL</FieldLabel>
                    <TextField
                      size="small" fullWidth
                      value={active.label}
                      onChange={(e) => patchPrimary({ label: e.target.value })}
                    />
                  </Box>
                  <Box sx={{ width: 220 }}>
                    <FieldLabel>ICON</FieldLabel>
                    <IconPicker
                      value={active.icon}
                      onChange={(v) => patchPrimary({ icon: v })}
                      placeholder="Chọn icon..."
                    />
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Box sx={{ flex: 1 }}>
                    <FieldLabel>URL</FieldLabel>
                    <TextField
                      size="small" fullWidth
                      value={active.url ?? ''}
                      onChange={(e) => patchPrimary({ url: e.target.value })}
                      inputProps={{ style: { fontFamily: 'monospace', fontSize: 12 } }}
                    />
                  </Box>
                  <Box sx={{ width: 150 }}>
                    <FieldLabel>BADGE TEXT</FieldLabel>
                    <TextField
                      size="small" fullWidth
                      value={active.badge?.text ?? ''}
                      onChange={(e) => {
                        const text = e.target.value;
                        patchPrimary({ badge: text ? { text, color: active.badge?.color ?? '#EF4444' } : null });
                      }}
                      placeholder="NEW"
                    />
                  </Box>
                </Stack>
              </Stack>
            </SectionCard>
          )}

          {panel && panel.columns.map((col, i) => (
            <ColumnEditor
              key={col.id}
              column={col}
              idx={i}
              total={panel.columns.length}
              onChange={(patch) => patchColumn(col.id, patch)}
              onRemove={() => removeColumn(col.id)}
              onMove={(dir) => moveColumn(col.id, dir)}
            />
          ))}

          {active && (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
              onClick={addColumn}
            >
              {panel ? 'Thêm cột' : 'Khởi tạo mega-panel'}
            </Button>
          )}

          {panel && (
            <BannerEditor
              banner={panel.banner}
              onChange={(patch) => patchPanel({ banner: { ...(panel.banner ?? {}), ...patch } })}
              onRemove={() => patchPanel({ banner: null })}
            />
          )}

          {panel && (
            <SectionCard title="Service callouts" description="Dải 3 ô dưới mega panel (3H · 24/7 · 48H).">
              <Autocomplete
                multiple
                options={allCallouts.map((c) => c.id)}
                value={panel.service_callouts ?? []}
                getOptionLabel={(id) => {
                  const c = allCallouts.find((x) => x.id === id);
                  return c ? `${c.label} · ${c.sub_label}` : id;
                }}
                onChange={(_e, v) => patchPanel({ service_callouts: v.slice(0, 4) })}
                size="small"
                renderInput={(p) => <TextField {...p} placeholder="Chọn tối đa 4 callout" />}
              />
            </SectionCard>
          )}
        </Stack>
      </Grid>

      {/* ───── Live preview ───── */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={{ position: 'sticky', top: 16 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: 'text.disabled', mb: 1 }}>
            LIVE PREVIEW
          </Typography>
          <MegaMenuPanel
            primaries={tree}
            activePrimaryId={activeId}
            onHoverPrimary={setActiveId}
            panel={panel}
            callouts={resolvedCallouts}
            dense
          />
        </Box>
      </Grid>
    </Grid>
  );
}
