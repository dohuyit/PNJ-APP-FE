// src/views/admin/document/document-library-view.jsx
// Document library — file icon cards grouped by year/group, không dùng table.

'use client';

import { useMemo, useState } from 'react';

import {
  Avatar, Box, Button, Chip, Divider, Grid, IconButton, InputAdornment, LinearProgress, Stack, TextField, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtDate } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';

import { DocumentFormDrawer } from './document-create-form';
import { mockDocuments } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const documentsList = mockDocuments;
const GROUP_META = {
  financial_report: { label: 'Báo cáo TC',       icon: 'solar:chart-bold',             color: '#10B981' },
  agm:              { label: 'ĐHĐCĐ',           icon: 'solar:users-group-rounded-bold', color: '#3B82F6' },
  disclosure:       { label: 'Công bố TT',       icon: 'solar:document-text-bold',     color: '#F59E0B' },
  license:          { label: 'Giấy phép',        icon: 'solar:verified-check-bold',    color: '#A855F7' },
};

function fileExt(url) {
  if (!url) return 'PDF';
  const m = url.match(/\.([a-zA-Z0-9]+)$/);
  return (m?.[1] ?? 'PDF').toUpperCase();
}

const EXT_COLOR = {
  PDF:  '#EF4444',
  XLSX: '#10B981',
  XLS:  '#10B981',
  DOC:  '#3B82F6',
  DOCX: '#3B82F6',
  PPT:  '#F59E0B',
  PPTX: '#F59E0B',
};

function fmtBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// -------------------------------------------- Document card

function DocumentCard({ doc, onEdit }) {
  const meta = GROUP_META[doc.group] ?? GROUP_META.disclosure;
  const ext = fileExt(doc.file_url);
  const extColor = EXT_COLOR[ext] ?? '#64748B';

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2.5,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        boxShadow: '0 1px 2px rgba(145, 158, 171, 0.08)',
        transition: 'transform .2s ease, box-shadow .2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 12px 28px ${meta.color}22`,
          '& .doc-ext-tag': { transform: 'scale(1.08) rotate(-2deg)' },
        },
      }}
    >
      {/* File icon section — dominant visual */}
      <Box
        sx={{
          position: 'relative',
          height: 128,
          background: `linear-gradient(135deg, ${meta.color}14, ${meta.color}22)`,
          display: 'grid', placeItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background pattern */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, ${meta.color}0A, ${meta.color}0A 10px, transparent 10px, transparent 20px)`,
          opacity: 0.5,
        }} />

        {/* Document icon stylized */}
        <Box
          sx={{
            position: 'relative',
            width: 72, height: 88,
            borderRadius: 1.5,
            bgcolor: 'common.white',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, right: 0,
              width: 20, height: 20,
              background: `linear-gradient(225deg, ${meta.color}33 50%, transparent 50%)`,
            },
          }}
        >
          {/* Fake text lines */}
          <Stack spacing={0.5} sx={{ p: 1.25, flex: 1, pt: 2.5 }}>
            <Box sx={{ height: 3, borderRadius: 1, bgcolor: `${meta.color}44`, width: '85%' }} />
            <Box sx={{ height: 3, borderRadius: 1, bgcolor: `${meta.color}33`, width: '70%' }} />
            <Box sx={{ height: 3, borderRadius: 1, bgcolor: `${meta.color}33`, width: '90%' }} />
            <Box sx={{ height: 3, borderRadius: 1, bgcolor: `${meta.color}33`, width: '60%' }} />
          </Stack>

          {/* Extension tag */}
          <Box
            className="doc-ext-tag"
            sx={{
              bgcolor: extColor,
              color: 'common.white',
              textAlign: 'center',
              py: 0.5,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 0.5,
              transition: 'transform .25s ease',
            }}
          >
            {ext}
          </Box>
        </Box>

        {/* Year chip top-right */}
        <Chip
          label={doc.year}
          size="small"
          sx={{
            position: 'absolute', top: 10, right: 10,
            fontWeight: 800, bgcolor: 'common.white', color: 'text.primary',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          }}
        />
      </Box>

      {/* Content */}
      <Stack spacing={0.75} sx={{ p: 2, flex: 1 }}>
        <Chip
          icon={<Iconify icon={meta.icon} width={11} />}
          label={meta.label}
          size="small"
          sx={{
            alignSelf: 'flex-start', height: 20, fontSize: 10.5, fontWeight: 700,
            bgcolor: `${meta.color}1A`, color: meta.color,
            '& .MuiChip-icon': { color: 'inherit' },
          }}
        />
        <Typography variant="subtitle2" sx={{ fontSize: 13, lineHeight: 1.35, minHeight: 36 }}>
          {doc.title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 'auto', pt: 1 }}>
          <Iconify icon="solar:calendar-linear" width={11} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary" sx={{ flex: 1, fontSize: 11 }}>
            {fmtDate(doc.published_at)}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', fontSize: 11 }}>
            {fmtBytes(doc.file_size)}
          </Typography>
        </Stack>
      </Stack>

      {/* Actions footer */}
      <Stack direction="row" sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Button
          size="small"
          fullWidth
          startIcon={<Iconify icon="solar:download-bold" width={14} />}
          onClick={() => doc.file_url && window.open(doc.file_url, '_blank', 'noopener,noreferrer')}
          sx={{
            borderRadius: 0, py: 1,
            color: meta.color,
            borderRight: 1, borderColor: 'divider',
            '&:hover': { bgcolor: `${meta.color}0A` },
          }}
        >
          Tải
        </Button>
        <Button
          size="small"
          fullWidth
          startIcon={<Iconify icon="solar:pen-linear" width={14} />}
          onClick={() => onEdit(doc)}
          sx={{ borderRadius: 0, py: 1, color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}
        >
          Sửa
        </Button>
      </Stack>
    </Box>
  );
}

// -------------------------------------------- Main

export function DocumentLibraryView({ embedded = false } = {}) {
  const [editing, setEditing]       = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch]         = useState('');
  const [group, setGroup]           = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const years = useMemo(
    () => [...new Set(documentsList.map((d) => d.year))].sort((a, b) => b - a),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return documentsList.filter((d) => {
      if (q && !d.title.toLowerCase().includes(q)) return false;
      if (group !== 'all' && d.group !== group) return false;
      if (yearFilter !== 'all' && d.year !== yearFilter) return false;
      return true;
    });
  }, [search, group, yearFilter]);

  // Group by group (then show)
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((d) => {
      (map[d.group] = map[d.group] ?? []).push(d);
    });
    return map;
  }, [filtered]);

  const totalSize = useMemo(() => documentsList.reduce((s, d) => s + (d.file_size ?? 0), 0), []);

  const Wrap = embedded ? Box : DashboardContent;
  const wrapProps = embedded ? {} : { disablePadding: true };
  return (
    <Wrap {...wrapProps}>
      {!embedded && (
      <PageHeader
        title="Thư viện tài liệu IR"
        subtitle="Báo cáo tài chính · ĐHĐCĐ · Công bố thông tin · Giấy phép — tổ chức theo chủ đề, lọc theo năm"
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Hệ thống' },
          { label: 'Tài liệu IR' },
        ]}
        actions={
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:upload-bold" width={14} />}
            onClick={() => setCreateOpen(true)}
          >
            Upload tài liệu
          </Button>
        }
      />
      )}

      {/* Library stats hero */}
      <Box sx={{ mx: { xs: 2, md: 3 }, mt: 2 }}>
        <Box
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: 'common.white',
            p: { xs: 2, md: 2.5 },
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)' }} />
          <Stack direction="row" alignItems="center" spacing={3} flexWrap="wrap" sx={{ rowGap: 1.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center' }}>
                <Iconify icon="solar:folder-with-files-bold" width={22} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: 0.4 }}>TOTAL</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 20 }}>{documentsList.length} tài liệu</Typography>
              </Box>
            </Stack>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
            {Object.entries(GROUP_META).map(([k, m]) => {
              const count = documentsList.filter((d) => d.group === k).length;
              return (
                <Stack key={k} direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: m.color }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                    {m.label}: <b style={{ color: '#fff' }}>{count}</b>
                  </Typography>
                </Stack>
              );
            })}
            <Box sx={{ flex: 1 }} />
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>Dung lượng kho</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{fmtBytes(totalSize)}</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Filter row */}
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        flexWrap="wrap"
        sx={{ px: { xs: 2, md: 3 }, py: 2, rowGap: 1.25 }}
      >
        <TextField
          size="small" sx={{ minWidth: 260, flex: 1 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm tài liệu…"
          InputProps={{
            startAdornment: <InputAdornment position="start"><Iconify icon="solar:magnifer-linear" width={16} /></InputAdornment>,
          }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>NĂM:</Typography>
        <Chip label="Tất cả" size="small" color={yearFilter === 'all' ? 'primary' : 'default'} variant={yearFilter === 'all' ? 'filled' : 'outlined'} onClick={() => setYearFilter('all')} />
        {years.map((y) => (
          <Chip
            key={y}
            label={y}
            size="small"
            color={yearFilter === y ? 'primary' : 'default'}
            variant={yearFilter === y ? 'filled' : 'outlined'}
            onClick={() => setYearFilter(y)}
          />
        ))}
        <Box sx={{ borderLeft: 1, borderColor: 'divider', height: 24, mx: 0.5 }} />
        <Chip label="Mọi chủ đề" size="small" color={group === 'all' ? 'primary' : 'default'} variant={group === 'all' ? 'filled' : 'outlined'} onClick={() => setGroup('all')} />
        {Object.entries(GROUP_META).map(([k, m]) => (
          <Chip
            key={k}
            icon={<Iconify icon={m.icon} width={11} sx={{ ml: 0.25 }} />}
            label={m.label}
            size="small"
            onClick={() => setGroup(k)}
            sx={{
              bgcolor: group === k ? m.color : 'transparent',
              color: group === k ? 'common.white' : 'text.primary',
              border: 1, borderColor: group === k ? m.color : 'divider',
              fontWeight: 600,
              '&:hover': { bgcolor: group === k ? m.color : `${m.color}1A` },
            }}
          />
        ))}
      </Stack>

      {/* Grouped content */}
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 3, bgcolor: 'grey.50', minHeight: '50vh' }}>
        {filtered.length === 0 ? (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 10, color: 'text.disabled' }}>
            <Iconify icon="solar:folder-open-linear" width={40} />
            <Typography variant="body2">Không có tài liệu phù hợp</Typography>
          </Stack>
        ) : (
          Object.entries(grouped).map(([groupKey, docs]) => {
            const m = GROUP_META[groupKey] ?? GROUP_META.disclosure;
            return (
              <Box key={groupKey} sx={{ pt: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: `${m.color}1A`, color: m.color, display: 'grid', placeItems: 'center' }}>
                    <Iconify icon={m.icon} width={18} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: m.color }}>{m.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {docs.length} tài liệu
                    </Typography>
                  </Box>
                </Stack>
                <Grid container spacing={2}>
                  {docs.map((d) => (
                    <Grid key={d.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                      <DocumentCard doc={d} onEdit={setEditing} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })
        )}
      </Box>

      <DocumentFormDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(v) => console.log('upload', v)}
      />
      <DocumentFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update doc', v)}
      />
    </Wrap>
  );
}
