// src/views/admin/media/media-library-view.jsx — Pinterest-style media library với drag-drop upload

'use client';

import { useMemo, useState, useRef, useCallback } from 'react';

// animation primitives re-exported from _shared/motion
import {
  Avatar, Box, Button, Chip, Divider, IconButton, InputAdornment, LinearProgress, Stack, TextField, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMediaFolders, useGetMediaList } from 'src/actions/admin/media';
import { m, AnimatePresence, fadeIn, staggerContainer, hoverLift, hoverTap } from 'src/views/admin/_shared/motion';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { GridCardSkeleton } from 'src/components/common/skeletons';

// Stubs — API chưa có hook; giữ literal để view không crash.
const mediaStats = { total: 0, images: 0, videos: 0, size: 0, unused: 0 };

function fmtBytes(b) {
  if (!b) return '—';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

// ========== Media Tile (Pinterest masonry card) ==========

function MediaTile({ item, selected, onToggle, onPreview }) {
  return (
    <m.div
      variants={fadeIn}
      {...hoverLift}
      layout
      style={{
        breakInside: 'avoid',
        marginBottom: 12,
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        border: selected ? '3px solid #3B82F6' : '1px solid #E5E7EB',
        boxShadow: selected ? '0 8px 24px rgba(59,130,246,0.25)' : '0 1px 2px rgba(145, 158, 171, 0.08)',
      }}
      onClick={(e) => { if (!e.ctrlKey && !e.metaKey) onPreview(item); }}
    >
      {/* Image at true aspect ratio */}
      <Box sx={{ position: 'relative', bgcolor: 'grey.100' }}>
        <img
          src={item.thumbnail}
          alt={item.name}
          loading="lazy"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />

        {/* Checkbox top-left */}
        <Box
          onClick={(e) => { e.stopPropagation(); onToggle(item.id); }}
          sx={{
            position: 'absolute', top: 8, left: 8,
            width: 22, height: 22, borderRadius: '50%',
            bgcolor: selected ? 'primary.main' : 'rgba(255,255,255,0.9)',
            border: '2px solid white',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            transition: 'transform .15s ease',
            transform: selected ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          {selected && <Iconify icon="solar:check-circle-bold" width={14} sx={{ color: 'common.white' }} />}
        </Box>

        {/* Video badge */}
        {item.kind === 'video' && (
          <Chip
            icon={<Iconify icon="solar:videocamera-record-bold" width={12} />}
            label="Video"
            size="small"
            sx={{
              position: 'absolute', top: 8, right: 8,
              bgcolor: 'rgba(0,0,0,0.75)', color: 'common.white',
              fontSize: 10, height: 20, fontWeight: 700,
              '& .MuiChip-icon': { color: '#EF4444' },
            }}
          />
        )}

        {/* Hover overlay with info */}
        <m.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            padding: 10, color: 'white',
          }}
        >
          <Box />
          <Box>
            <Typography sx={{ color: 'inherit', fontSize: 11.5, fontWeight: 700, mb: 0.5 }} noWrap>
              {item.name}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Chip label={`${item.width}×${item.height}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', height: 18, fontSize: 9.5 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 10 }}>
                {fmtBytes(item.size_bytes)}
              </Typography>
              {item.used_in_count > 0 && (
                <Chip
                  icon={<Iconify icon="solar:link-linear" width={9} />}
                  label={`${item.used_in_count}`}
                  size="small"
                  sx={{ bgcolor: '#10B981', color: 'white', height: 18, fontSize: 9.5, '& .MuiChip-icon': { color: 'inherit' } }}
                />
              )}
            </Stack>
          </Box>
        </m.div>
      </Box>

      {/* Bottom strip tags */}
      <Box sx={{ px: 1, py: 0.75, bgcolor: 'background.paper' }}>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ rowGap: 0.5 }}>
          {item.tags.slice(0, 3).map((t) => (
            <Chip key={t} label={t} size="small" variant="outlined" sx={{ height: 16, fontSize: 9.5 }} />
          ))}
        </Stack>
      </Box>
    </m.div>
  );
}

// ========== Upload Progress Item (fake) ==========

function UploadItem({ upload, onRemove }) {
  return (
    <m.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      layout
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.25, borderRadius: 1.5, bgcolor: 'grey.50', border: 1, borderColor: 'divider', mb: 1 }}>
        <Avatar variant="rounded" sx={{ width: 36, height: 36, bgcolor: 'primary.lighter', color: 'primary.main' }}>
          <Iconify icon={upload.kind === 'video' ? 'solar:videocamera-record-bold' : 'solar:gallery-bold'} width={16} />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11.5 }} noWrap>{upload.name}</Typography>
          <LinearProgress
            variant="determinate"
            value={upload.progress}
            sx={{
              height: 4, borderRadius: 2, mt: 0.5, bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': { borderRadius: 2, background: upload.progress === 100 ? 'linear-gradient(90deg, #10B981, #059669)' : 'linear-gradient(90deg, #3B82F6, #6366F1)' },
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 700, color: upload.progress === 100 ? 'success.main' : 'primary.main', fontSize: 11, minWidth: 40, textAlign: 'right' }}>
          {upload.progress}%
        </Typography>
        <IconButton size="small" onClick={() => onRemove(upload.id)}>
          <Iconify icon="solar:close-circle-linear" width={14} />
        </IconButton>
      </Stack>
    </m.div>
  );
}

// ========== Main view ==========

export function MediaLibraryView({ embedded = false } = {}) {
  const { folders: mediaFolders, foldersLoading } = useGetMediaFolders();
  const { searchResults: mediaList, searchLoading: mediaLoading } = useGetMediaList();
  const [folder, setFolder]     = useState('all');
  const [search, setSearch]     = useState('');
  const [kindFilter, setKindFilter] = useState('all');
  const [selected, setSelected] = useState([]);
  const [previewOf, setPreviewOf] = useState(null);
  const [uploads, setUploads]   = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef            = useRef(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mediaList.filter((m) => {
      if (folder !== 'all' && m.folder !== folder) return false;
      if (kindFilter !== 'all' && m.kind !== kindFilter) return false;
      if (q && !m.name.toLowerCase().includes(q) && !m.tags.some((t) => t.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [mediaList, folder, search, kindFilter]);

  const toggle = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const clearSelection = () => setSelected([]);

  // Simulated upload with progress animation
  const simulateUpload = useCallback((files) => {
    const list = Array.from(files).map((f, i) => ({
      id: `up-${Date.now()}-${i}`,
      name: f.name,
      kind: f.type?.startsWith('video') ? 'video' : 'image',
      progress: 0,
    }));
    setUploads((prev) => [...prev, ...list]);
    list.forEach((up) => {
      const tick = setInterval(() => {
        setUploads((prev) => {
          const i = prev.findIndex((x) => x.id === up.id);
          if (i === -1) { clearInterval(tick); return prev; }
          const next = [...prev];
          next[i] = { ...next[i], progress: Math.min(100, next[i].progress + 7 + Math.random() * 12) };
          if (next[i].progress === 100) {
            clearInterval(tick);
            setTimeout(() => setUploads((p) => p.filter((x) => x.id !== up.id)), 1500);
          }
          return next;
        });
      }, 160);
    });
  }, []);

  const handleFiles = (files) => files?.length && simulateUpload(files);

  const Wrap = embedded ? Box : DashboardContent;
  const wrapProps = embedded ? {} : { disablePadding: true };
  if (foldersLoading || mediaLoading) {
    return <Wrap {...wrapProps}><GridCardSkeleton count={18} cols={{ xs: 6, sm: 4, md: 3, lg: 2 }} aspectRatio="1 / 1" /></Wrap>;
  }
  return (
    <Wrap {...wrapProps}>
      {!embedded && (
      <PageHeader
        title="Thư viện media"
        subtitle={`${mediaStats.total} files · ${mediaStats.images} ảnh · ${mediaStats.videos} video · ${fmtBytes(mediaStats.size)}`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Media' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:upload-bold" width={14} />}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload
          </Button>
        }
      />
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Stats hero */}
      <Box sx={{ mx: { xs: 2, md: 3 }, mt: 2 }}>
        <Stack
          component={m.div}
          variants={staggerContainer(0.08)}
          initial="hidden" animate="show"
          direction="row" spacing={2} flexWrap="wrap" sx={{ rowGap: 1.5 }}
        >
          {[
            { icon: 'solar:gallery-bold',          label: 'Ảnh',       value: mediaStats.images, color: '#3B82F6' },
            { icon: 'solar:videocamera-record-bold', label: 'Video',    value: mediaStats.videos, color: '#EF4444' },
            { icon: 'solar:folder-with-files-bold', label: 'Dung lượng', value: fmtBytes(mediaStats.size), color: '#10B981' },
            { icon: 'solar:unlink-bold',           label: 'Không dùng', value: mediaStats.unused, color: '#F59E0B' },
          ].map((s) => (
            <m.div key={s.label} variants={fadeIn}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', minWidth: 170 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 1.5, display: 'grid', placeItems: 'center', bgcolor: s.color + '1A', color: s.color }}>
                  <Iconify icon={s.icon} width={18} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: 10.5, letterSpacing: 0.4 }}>{s.label}</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 17, lineHeight: 1.1 }}>{s.value}</Typography>
                </Box>
              </Stack>
            </m.div>
          ))}
        </Stack>
      </Box>

      {/* Upload drop zone + progress */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ margin: '16px 24px 0' }}
          >
            <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'primary.light', borderRadius: 2, p: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Iconify icon="solar:upload-bold" width={14} sx={{ color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  Đang upload {uploads.length} file
                </Typography>
              </Stack>
              <AnimatePresence>
                {uploads.map((u) => (
                  <UploadItem key={u.id} upload={u} onRemove={(id) => setUploads((p) => p.filter((x) => x.id !== id))} />
                ))}
              </AnimatePresence>
            </Box>
          </m.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <Stack
        direction="row" alignItems="center" spacing={1.5} flexWrap="wrap"
        sx={{ px: { xs: 2, md: 3 }, py: 2, rowGap: 1 }}
      >
        <TextField
          size="small" sx={{ minWidth: 240, flex: 1 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên / tag…"
          InputProps={{ startAdornment: <InputAdornment position="start"><Iconify icon="solar:magnifer-linear" width={16} /></InputAdornment> }}
        />
        <Chip label="Tất cả" size="small" color={kindFilter === 'all' ? 'primary' : 'default'} variant={kindFilter === 'all' ? 'filled' : 'outlined'} onClick={() => setKindFilter('all')} />
        <Chip icon={<Iconify icon="solar:gallery-bold" width={11} sx={{ ml: 0.25 }} />} label="Ảnh" size="small" color={kindFilter === 'image' ? 'primary' : 'default'} variant={kindFilter === 'image' ? 'filled' : 'outlined'} onClick={() => setKindFilter('image')} />
        <Chip icon={<Iconify icon="solar:videocamera-record-bold" width={11} sx={{ ml: 0.25 }} />} label="Video" size="small" color={kindFilter === 'video' ? 'error' : 'default'} variant={kindFilter === 'video' ? 'filled' : 'outlined'} onClick={() => setKindFilter('video')} />
        <Box sx={{ flex: 1 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {filtered.length} / {mediaList.length}
        </Typography>
      </Stack>

      {/* Body: folder sidebar + masonry */}
      <Box
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        sx={{
          display: 'flex',
          minHeight: '50vh',
          position: 'relative',
          bgcolor: dragOver ? 'primary.lighter' : 'grey.50',
          transition: 'background-color .2s ease',
        }}
      >
        {/* Drag overlay */}
        <AnimatePresence>
          {dragOver && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 16, zIndex: 10,
                border: '3px dashed #3B82F6', borderRadius: 16,
                display: 'grid', placeItems: 'center',
                background: 'rgba(59,130,246,0.08)', pointerEvents: 'none',
              }}
            >
              <Stack alignItems="center" spacing={1}>
                <Iconify icon="solar:upload-bold" width={48} sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ color: 'primary.dark', fontWeight: 800 }}>Thả file vào đây</Typography>
              </Stack>
            </m.div>
          )}
        </AnimatePresence>

        {/* Folder sidebar */}
        <Box sx={{ width: 220, flexShrink: 0, borderRight: 1, borderColor: 'divider', p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 0.4, fontSize: 10.5 }}>THƯ MỤC</Typography>
          <Stack spacing={0.5} sx={{ mt: 1 }}>
            <Button
              size="small"
              variant={folder === 'all' ? 'contained' : 'text'}
              color={folder === 'all' ? 'primary' : 'inherit'}
              fullWidth
              startIcon={<Iconify icon="solar:folder-with-files-linear" width={14} />}
              onClick={() => setFolder('all')}
              sx={{ justifyContent: 'flex-start', fontSize: 12 }}
            >
              Tất cả · {mediaList.length}
            </Button>
            {mediaFolders.map((f) => (
              <Button
                key={f.name}
                size="small"
                variant={folder === f.name ? 'contained' : 'text'}
                color={folder === f.name ? 'primary' : 'inherit'}
                fullWidth
                startIcon={<Iconify icon={f.icon} width={14} />}
                onClick={() => setFolder(f.name)}
                sx={{ justifyContent: 'flex-start', fontSize: 12 }}
              >
                <Box component="span" sx={{ flex: 1, textAlign: 'left' }}>{f.name}</Box>
                <Typography variant="caption" sx={{ ml: 1, color: folder === f.name ? 'inherit' : 'text.secondary' }}>{f.count}</Typography>
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Masonry */}
        <Box sx={{ flex: 1, p: 1.5 }}>
          {filtered.length === 0 ? (
            <Stack alignItems="center" spacing={1.5} sx={{ py: 10, color: 'text.disabled' }}>
              <Iconify icon="solar:gallery-wide-linear" width={40} />
              <Typography variant="body2">Chưa có media</Typography>
            </Stack>
          ) : (
            <m.div
              variants={staggerContainer(0.03, 0.05)}
              initial="hidden" animate="show"
              style={{ columnCount: 4, columnGap: 12 }}
            >
              {filtered.map((m) => (
                <MediaTile
                  key={m.id}
                  item={m}
                  selected={selected.includes(m.id)}
                  onToggle={toggle}
                  onPreview={setPreviewOf}
                />
              ))}
            </m.div>
          )}
        </Box>
      </Box>

      {/* Bulk action bar when selected */}
      <AnimatePresence>
        {selected.length > 0 && (
          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1300 }}
          >
            <Stack
              direction="row" alignItems="center" spacing={1}
              sx={{
                px: 2, py: 1.25, borderRadius: 3,
                bgcolor: '#0F172A', color: 'common.white',
                boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
              }}
            >
              <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800 }}>
                {selected.length}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, mr: 1 }}>đã chọn</Typography>
              <Button size="small" variant="outlined" startIcon={<Iconify icon="solar:folder-with-files-linear" width={14} />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Chuyển thư mục</Button>
              <Button size="small" variant="outlined" startIcon={<Iconify icon="solar:tag-linear" width={14} />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Gán tag</Button>
              <Button size="small" variant="outlined" startIcon={<Iconify icon="solar:download-linear" width={14} />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Download</Button>
              <Button size="small" variant="outlined" color="error" startIcon={<Iconify icon="solar:trash-bin-trash-linear" width={14} />}>Xoá</Button>
              <Tooltip title="Bỏ chọn">
                <IconButton size="small" onClick={clearSelection} sx={{ color: 'white' }}>
                  <Iconify icon="solar:close-circle-linear" width={16} />
                </IconButton>
              </Tooltip>
            </Stack>
          </m.div>
        )}
      </AnimatePresence>

      {/* Preview lightbox */}
      <AnimatePresence>
        {previewOf && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1400, display: 'grid', placeItems: 'center', padding: 24 }}
            onClick={() => setPreviewOf(null)}
          >
            <m.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={previewOf.url} alt={previewOf.name} style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: 8, display: 'block' }} />
              <Box sx={{ position: 'absolute', top: -40, right: 0 }}>
                <IconButton onClick={() => setPreviewOf(null)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}>
                  <Iconify icon="solar:close-circle-linear" width={20} />
                </IconButton>
              </Box>
              <Box sx={{ mt: 1, color: 'white' }}>
                <Typography variant="subtitle2" sx={{ color: 'inherit' }}>{previewOf.name}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {previewOf.width}×{previewOf.height} · {fmtBytes(previewOf.size_bytes)} · {previewOf.folder}
                </Typography>
              </Box>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </Wrap>
  );
}
