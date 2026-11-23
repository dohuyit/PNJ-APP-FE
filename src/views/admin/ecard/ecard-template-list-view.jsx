// src/views/admin/ecard/ecard-template-list-view.jsx
// Thư viện mẫu thiệp — gallery pro với category tabs + preview + stats.

'use client';

import { useMemo, useState } from 'react';

import {
  Box, Button, Chip, Dialog, Grid, IconButton, Stack, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';
import { fmtNumber } from 'src/utils/format';
import { DashboardContent } from 'src/layouts/dashboard';
import { m, fadeIn, staggerContainer } from 'src/views/admin/_shared/motion';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { FilterBar } from 'src/components/common/filter-bar';

import { EcardTemplateFormDrawer } from './ecard-template-create-form';
import { mockEcardTemplates, mockEcardCategories } from 'src/mock-data';

const STATUS_META = {
  active: { label: 'Đang dùng', bg: '#DCFCE7', fg: '#15803D' },
  draft:  { label: 'Nháp',       bg: '#F1F5F9', fg: '#64748B' },
  archived: { label: 'Lưu trữ',  bg: '#FEE2E2', fg: '#DC2626' },
};
const statusMeta = (s) => STATUS_META[s] ?? STATUS_META.draft;

// ---- Preview Dialog ----

function TemplatePreviewDialog({ template, onClose, onEdit }) {
  if (!template) return null;
  const cat = mockEcardCategories.find((c) => c._id === template.category_id);
  const stat = statusMeta(template.status);

  return (
    <Dialog
      open={!!template}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 1 } }}
    >
      <Stack
        direction="row" alignItems="center" spacing={1.5}
        sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}
      >
        <Box sx={{
          width: 34, height: 34, borderRadius: 0.75,
          bgcolor: 'warning.lighter', color: 'warning.dark',
          display: 'grid', placeItems: 'center',
        }}>
          <Iconify icon="solar:letter-linear" width={17} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }} noWrap>
            {template.name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
            {cat?.name ?? 'Khác'} · {fmtNumber(template.usage_count ?? 0)} lượt dùng
          </Typography>
        </Box>
        <Chip
          label={stat.label}
          size="small"
          sx={{ height: 20, fontSize: 10, fontWeight: 700, bgcolor: stat.bg, color: stat.fg }}
        />
        <Button
          size="small" variant="outlined"
          onClick={() => onEdit?.(template)}
          startIcon={<Iconify icon="solar:pen-linear" width={13} />}
          sx={{ boxShadow: 'none', borderColor: 'divider' }}
        >
          Sửa
        </Button>
        <IconButton size="small" onClick={onClose}>
          <Iconify icon="solar:close-circle-linear" width={16} />
        </IconButton>
      </Stack>

      <Box sx={{ bgcolor: 'grey.100', p: 4, display: 'grid', placeItems: 'center', minHeight: 420 }}>
        <Box sx={{
          width: 320,
          aspectRatio: '3/4',
          bgcolor: 'common.white',
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
          border: 1, borderColor: 'divider',
          display: 'flex', flexDirection: 'column',
        }}>
          {template.preview_url ? (
            <Box
              component="img"
              src={template.preview_url}
              alt={template.name}
              sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Box sx={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FBBF24 100%)',
              display: 'grid', placeItems: 'center',
              color: 'warning.darker',
            }}>
              <Stack alignItems="center" spacing={1} sx={{ px: 3, textAlign: 'center' }}>
                <Iconify icon="solar:letter-linear" width={48} />
                <Typography sx={{ fontSize: 14, fontFamily: 'serif', fontWeight: 600, fontStyle: 'italic' }}>
                  {template.name}
                </Typography>
                {template.default_message && (
                  <Typography sx={{ fontSize: 11, fontStyle: 'italic', opacity: 0.75 }}>
                    “{template.default_message}”
                  </Typography>
                )}
                <Typography sx={{ fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.6 }}>
                  PNJ · {cat?.name}
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>

      <Stack
        direction="row" alignItems="center" spacing={2}
        sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Iconify icon="solar:chart-square-linear" width={12} sx={{ color: 'text.disabled' }} />
          <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
            {fmtNumber(template.usage_count ?? 0)} lượt dùng
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Iconify icon="solar:hashtag-linear" width={12} sx={{ color: 'text.disabled' }} />
          <Typography sx={{ fontSize: 11.5, color: 'text.secondary', fontFamily: 'ui-monospace, monospace' }}>
            {template.code}
          </Typography>
        </Stack>
        <Box sx={{ flex: 1 }} />
        {template.created_at && (
          <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
            Tạo {new Date(template.created_at).toLocaleDateString('vi-VN')}
          </Typography>
        )}
      </Stack>
    </Dialog>
  );
}

// ---- Template Card ----

function TemplateCard({ template, category, onPreview, onEdit }) {
  const stat = statusMeta(template.status);

  return (
    <m.div variants={fadeIn} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
      <Box
        onClick={() => onPreview(template)}
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          border: 1, borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color .18s, box-shadow .18s',
          '&:hover': {
            borderColor: 'warning.main',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.14)',
            '& .ecard-overlay': { opacity: 1 },
          },
        }}
      >
        <Box sx={{
          aspectRatio: '3/4',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {template.preview_url ? (
            <Box
              component="img"
              src={template.preview_url}
              alt={template.name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              loading="lazy"
            />
          ) : (
            <Box sx={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FBBF24 100%)',
              display: 'grid', placeItems: 'center',
              color: 'warning.darker',
            }}>
              <Stack alignItems="center" spacing={0.75} sx={{ px: 2, textAlign: 'center' }}>
                <Iconify icon="solar:letter-linear" width={28} />
                <Typography sx={{
                  fontSize: 11, fontFamily: 'serif', fontWeight: 600, fontStyle: 'italic',
                }}>
                  {template.name}
                </Typography>
                <Typography sx={{
                  fontSize: 8, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.5,
                }}>
                  PNJ
                </Typography>
              </Stack>
            </Box>
          )}

          <Chip
            label={stat.label}
            size="small"
            sx={{
              position: 'absolute', top: 6, left: 6,
              height: 18, fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
              bgcolor: stat.bg, color: stat.fg,
              '& .MuiChip-label': { px: 0.75 },
            }}
          />

          <Box
            className="ecard-overlay"
            sx={{
              position: 'absolute', top: 6, right: 6,
              opacity: 0,
              transition: 'opacity .18s',
            }}
          >
            <Tooltip title="Sửa mẫu">
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); onEdit?.(template); }}
                sx={{
                  width: 26, height: 26,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  color: 'text.primary',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  '&:hover': { bgcolor: 'common.white' },
                }}
              >
                <Iconify icon="solar:pen-linear" width={13} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ p: 1.25 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', lineHeight: 1.25 }} noWrap>
            {template.name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
            <Iconify icon={category?.icon ?? 'solar:letter-linear'} width={10} sx={{ color: 'text.disabled' }} />
            <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }} noWrap>
              {category?.name ?? 'Khác'}
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Stack direction="row" alignItems="center" spacing={0.25}>
              <Iconify icon="solar:chart-square-linear" width={9} sx={{ color: 'text.disabled' }} />
              <Typography sx={{ fontSize: 10, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>
                {fmtNumber(template.usage_count ?? 0)}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </m.div>
  );
}

// ---- Main ----

export function EcardTemplateListView({ embedded = false } = {}) {
  const [editing, setEditing] = useState(null);
  const [previewing, setPreviewing] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const templates = mockEcardTemplates;

  const counts = useMemo(() => {
    const c = { all: templates.length };
    mockEcardCategories.forEach((cat) => {
      c[cat._id] = templates.filter((t) => t.category_id === cat._id).length;
    });
    return c;
  }, [templates]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return templates.filter((t) => {
      if (catFilter !== 'all' && t.category_id !== catFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (q && !t.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [templates, search, catFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: templates.length,
    active: templates.filter((t) => t.status === 'active').length,
    totalUse: templates.reduce((n, t) => n + (t.usage_count ?? 0), 0),
    categories: mockEcardCategories.length,
  }), [templates]);

  const Wrap = embedded ? Box : DashboardContent;
  const wrapProps = embedded ? {} : { disablePadding: true };

  return (
    <Wrap {...wrapProps}>
      {!embedded && (
        <PageHeader
          title="Thư viện mẫu thiệp điện tử"
          subtitle={`${stats.total} mẫu · ${stats.active} đang dùng · ${fmtNumber(stats.totalUse)} lượt sử dụng`}
          breadcrumbs={[
            { label: 'PNJ Admin', href: adminPaths.dashboard },
            { label: 'Marketing' },
            { label: 'Nội dung' },
            { label: 'Thiệp điện tử' },
          ]}
          actions={
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:add-circle-bold" width={16} />}
              onClick={() => setCreateOpen(true)}
              sx={{
                boxShadow: 'none',
                bgcolor: '#1E293B', color: 'common.white',
                '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
              }}
            >
              Tạo mẫu mới
            </Button>
          }
        />
      )}

      {/* KPI row */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        bgcolor: 'background.paper',
        borderTop: '1px solid rgba(145, 158, 171, 0.08)',
        borderBottom: '1px solid rgba(145, 158, 171, 0.08)',
      }}>
        {[
          { label: 'Tổng mẫu',  value: stats.total,      icon: 'solar:letter-linear',          color: '#D97706' },
          { label: 'Đang dùng', value: stats.active,     icon: 'solar:check-circle-linear',    color: '#059669' },
          { label: 'Chủ đề',    value: stats.categories, icon: 'solar:folder-linear',          color: '#7C3AED' },
          { label: 'Lượt dùng', value: stats.totalUse,   icon: 'solar:chart-square-linear',    color: '#2563EB' },
        ].map((s, i, arr) => (
          <Stack
            key={s.label}
            direction="row" spacing={1.25} alignItems="center"
            sx={{
              px: 2, py: 1.5,
              borderRight: {
                xs: i % 2 === 0 ? '1px solid rgba(145, 158, 171, 0.08)' : 'none',
                md: i < arr.length - 1 ? '1px solid rgba(145, 158, 171, 0.08)' : 'none',
              },
              borderBottom: { xs: i < arr.length - 2 ? '1px solid rgba(145, 158, 171, 0.08)' : 'none', md: 'none' },
            }}
          >
            <Box sx={{
              width: 32, height: 32, borderRadius: 0.75,
              bgcolor: s.color + '14', color: s.color,
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Iconify icon={s.icon} width={16} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 10.5, color: 'text.disabled', lineHeight: 1.2, fontWeight: 500, letterSpacing: 0.3, textTransform: 'uppercase' }}>
                {s.label}
              </Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary', lineHeight: 1.15, fontVariantNumeric: 'tabular-nums' }}>
                {fmtNumber(s.value)}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Box>

      {/* Category pill scroll */}
      <Box sx={{
        px: 2, py: 1.25,
        bgcolor: 'grey.50',
        borderBottom: 1, borderColor: 'divider',
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        <Stack direction="row" spacing={0.75} sx={{ width: 'fit-content' }}>
          {[
            { key: 'all', label: 'Tất cả', icon: 'solar:widget-5-linear' },
            ...mockEcardCategories.map((c) => ({ key: c._id, label: c.name, icon: c.icon })),
          ].map((t) => {
            const active = catFilter === t.key;
            const count = counts[t.key] ?? 0;
            if (count === 0 && t.key !== 'all') return null;
            return (
              <Chip
                key={t.key}
                icon={<Iconify icon={t.icon} width={11} />}
                label={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <span>{t.label}</span>
                    <Box sx={{
                      fontSize: 9.5, fontWeight: 700,
                      bgcolor: active ? 'background.paper' : 'grey.100',
                      color: active ? 'warning.dark' : 'text.disabled',
                      px: 0.5, borderRadius: 0.5, lineHeight: 1.3,
                    }}>
                      {count}
                    </Box>
                  </Stack>
                }
                size="small"
                variant={active ? 'filled' : 'outlined'}
                onClick={() => setCatFilter(t.key)}
                sx={{
                  height: 26, fontSize: 11.5, fontWeight: 600,
                  bgcolor: active ? 'warning.lighter' : 'background.paper',
                  color: active ? 'warning.dark' : 'text.secondary',
                  borderColor: active ? 'warning.main' : 'divider',
                  flexShrink: 0,
                  '& .MuiChip-icon': { color: 'inherit' },
                  '& .MuiChip-label': { display: 'flex', alignItems: 'center' },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* Toolbar */}
      <Box sx={{
        px: 2, py: 1.25,
        bgcolor: 'grey.50',
        borderBottom: 1, borderColor: 'divider',
      }}>
        <FilterBar
          searchValue={search}
          onSearch={setSearch}
          placeholder="Tìm mẫu thiệp…"
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              minWidth: 160,
              defaultValue: 'all',
              options: [
                { value: 'all',      label: 'Mọi trạng thái' },
                { value: 'active',   label: 'Đang dùng' },
                { value: 'draft',    label: 'Nháp' },
                { value: 'archived', label: 'Lưu trữ' },
              ],
            },
          ]}
          onReset={
            (statusFilter !== 'all' || catFilter !== 'all' || search)
              ? () => { setStatusFilter('all'); setCatFilter('all'); setSearch(''); }
              : undefined
          }
          extra={
            <Typography sx={{ fontSize: 11.5, color: 'text.disabled', ml: 1 }}>
              {filtered.length}/{templates.length} mẫu
            </Typography>
          }
        />
      </Box>

      {/* Grid */}
      <Box sx={{ p: { xs: 2, md: 2.5 }, bgcolor: 'grey.50', minHeight: '60vh' }}>
        {filtered.length === 0 ? (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 10, color: 'text.disabled' }}>
            <Iconify icon="solar:letter-linear" width={40} />
            <Typography variant="body2">Không có mẫu phù hợp</Typography>
          </Stack>
        ) : (
          <m.div variants={staggerContainer(0.03, 0.02)} initial="hidden" animate="show">
            <Grid container spacing={1.5}>
              {filtered.map((t) => {
                const category = mockEcardCategories.find((c) => c._id === t.category_id);
                return (
                  <Grid key={t._id ?? t.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
                    <TemplateCard
                      template={t}
                      category={category}
                      onPreview={setPreviewing}
                      onEdit={setEditing}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </m.div>
        )}
      </Box>

      <TemplatePreviewDialog
        template={previewing}
        onClose={() => setPreviewing(null)}
        onEdit={(t) => { setPreviewing(null); setEditing(t); }}
      />

      <EcardTemplateFormDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(v) => console.log('create ecard', v)}
      />
      <EcardTemplateFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update ecard', v)}
      />
    </Wrap>
  );
}
