// src/views/admin/category/category-view.jsx — tree trái + editor phải (grid 2 cột)

'use client';

import { useEffect, useMemo, useState } from 'react';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import {
  Box, Button, Chip, Grid, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCategoryTree } from 'src/actions/admin/category';
import { SectionCard, FieldLabel } from 'src/views/admin/_shared/section-card';

import { Iconify } from 'src/components/iconify';
import { SeoPanel } from 'src/components/common/seo-panel';
import { SlugInput } from 'src/components/common/slug-input';
import { PageHeader } from 'src/components/common/page-header';
import { FormSkeleton } from 'src/components/common/skeletons';
import { UploadField } from 'src/views/admin/_shared/upload-field';
import { UploadGallery } from 'src/views/admin/_shared/upload-gallery';
import { SortableTree } from 'src/components/common/sortable-tree';

import { CategoryFormDrawer } from './category-create-form';


const TYPES = [
  { value: 'jewelry', label: 'Trang sức',   icon: 'solar:crown-linear' },
  { value: 'watch',   label: 'Đồng hồ',     icon: 'solar:clock-circle-linear' },
  { value: 'diamond', label: 'Kim cương',   icon: 'solar:star-shine-linear' },
  { value: 'gift',    label: 'Quà tặng',    icon: 'solar:gift-linear' },
  { value: 'egift',   label: 'E-gift',      icon: 'solar:letter-linear' },
];

const AUDIENCES = [
  { value: 'female',  label: 'Nữ',      icon: 'solar:women-linear' },
  { value: 'male',    label: 'Nam',     icon: 'solar:men-linear' },
  { value: 'kids',    label: 'Trẻ em',  icon: 'solar:emoji-funny-circle-linear' },
  { value: 'unisex',  label: 'Unisex',  icon: 'solar:users-group-rounded-linear' },
];

function flatten(items, depth = 0, out = []) {
  items.forEach((item) => {
    out.push({ ...item, _depth: depth });
    if (item.children?.length) flatten(item.children, depth + 1, out);
  });
  return out;
}

function filterTree(items, q) {
  if (!q) return items;
  return items
    .map((it) => {
      const children = it.children ? filterTree(it.children, q) : [];
      const match = it.name?.toLowerCase().includes(q) || it.slug?.toLowerCase().includes(q);
      if (match || children.length) return { ...it, children };
      return null;
    })
    .filter(Boolean);
}

// ----------------------------------------------------------------------

export function CategoryView({ embedded = false } = {}) {
  const { tree: apiTree, treeLoading } = useGetCategoryTree();
  const [tree, setTree] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  // Sync local tree state khi SWR trả data (initial `useState([])` chưa có data lúc mount).
  useEffect(() => {
    if (apiTree?.length) {
      setTree(apiTree);
      setSelected((prev) => prev ?? apiTree[0]);
    }
  }, [apiTree]);

  const [createOpen, setCreateOpen]   = useState(false);
  const [parentForNew, setParentForNew] = useState(null);

  const flatForSelect = useMemo(() => flatten(tree), [tree]);
  const filteredTree  = useMemo(() => filterTree(tree, search.trim().toLowerCase()), [tree, search]);

  const setField = (k, v) => setSelected((s) => (s ? { ...s, [k]: v } : s));
  const toggleAudience = (v) =>
    setField('audiences', (selected?.audiences ?? []).includes(v)
      ? selected.audiences.filter((x) => x !== v)
      : [...(selected?.audiences ?? []), v]);

  const openAddRoot = () => { setParentForNew(null); setCreateOpen(true); };
  const openAddChild = (parent) => { setParentForNew(parent); setCreateOpen(true); };

  if (treeLoading && !apiTree?.length) {
    const skeleton = <FormSkeleton withSidebar withHeader={!embedded} sections={[{ fields: ['text','text','two-col','media'] }, { fields: ['rich'] }]} />;
    return embedded ? skeleton : <DashboardContent disablePadding>{skeleton}</DashboardContent>;
  }

  const Wrap = embedded ? 'div' : DashboardContent;
  const wrapProps = embedded ? {} : { disablePadding: true };
  return (
    <Wrap {...wrapProps}>
      {!embedded && (
      <PageHeader
        title="Danh mục sản phẩm"
        subtitle="Cây danh mục · kéo thả sắp xếp · click một mục để sửa"
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Danh mục' }]}
      />
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          bgcolor: 'background.paper',
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        {/* ================= Cột trái: cây danh mục ================= */}
        <Box
          sx={{
            width: { xs: '100%', md: 380 },
            flexShrink: 0,
            borderBottom: { xs: 1, md: 0 },
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Tree toolbar */}
          <Stack
            spacing={1.25}
            sx={{
              px: { xs: 2, md: 2.5 }, py: 1.5,
              borderBottom: 1, borderColor: 'divider',
              bgcolor: 'grey.50',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccountTreeOutlined sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="subtitle2" sx={{ fontSize: 13 }}>Cây danh mục</Typography>
                <Chip label={flatForSelect.length} size="small" sx={{ height: 20, fontSize: 11, fontWeight: 700 }} />
              </Stack>
              <Chip
                icon={<Iconify icon="solar:hand-shake-linear" width={12} />}
                label="Kéo thả"
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: 11 }}
              />
            </Stack>
            <TextField
              size="small" fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm trong cây…"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Iconify icon="solar:magnifer-linear" width={14} /></InputAdornment>,
                endAdornment: search ? (
                  <IconButton size="small" onClick={() => setSearch('')}><Iconify icon="solar:close-circle-linear" width={14} /></IconButton>
                ) : null,
              }}
            />
            <Button
              size="small" fullWidth variant="outlined"
              startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
              onClick={openAddRoot}
            >
              Thêm danh mục gốc
            </Button>
          </Stack>

          {/* Tree body */}
          <Box sx={{ p: { xs: 1.5, md: 2 }, flex: 1, overflow: 'auto' }}>
            {filteredTree.length > 0 ? (
              <SortableTree
                items={filteredTree}
                onChange={setTree}
                onEdit={setSelected}
                onAddChild={openAddChild}
                selectedId={selected?.id}
                onSelect={setSelected}
              />
            ) : (
              <Stack alignItems="center" spacing={1} sx={{ py: 6, color: 'text.disabled' }}>
                <Iconify icon="solar:folder-open-linear" width={28} />
                <Typography variant="caption">Không có danh mục khớp "{search}"</Typography>
              </Stack>
            )}
          </Box>
        </Box>

        {/* ================= Cột phải: editor ================= */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Editor toolbar */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              px: { xs: 2, md: 3 }, py: 1.5,
              borderBottom: 1, borderColor: 'divider',
              bgcolor: 'grey.50',
              minHeight: 56,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {selected ? (
                <>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle2" sx={{ fontSize: 13.5 }}>{selected.name}</Typography>
                    {selected.type && (
                      <Chip
                        icon={<Iconify icon={TYPES.find((t) => t.value === selected.type)?.icon ?? 'solar:tag-linear'} width={12} />}
                        label={TYPES.find((t) => t.value === selected.type)?.label ?? selected.type}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: 11 }}
                      />
                    )}
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                    /{selected.slug ?? ''}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">Chọn danh mục để sửa</Typography>
              )}
            </Box>
            {selected && (
              <Stack direction="row" spacing={1}>
                <Button size="small" color="inherit" variant="outlined">Huỷ</Button>
                <Button
                  size="small" variant="contained"
                  startIcon={<Iconify icon="solar:check-circle-linear" width={14} />}
                >
                  Lưu
                </Button>
              </Stack>
            )}
          </Stack>

          {/* Editor body · grid 2 cột */}
          <Box sx={{ p: { xs: 2, md: 3 }, flex: 1, overflow: 'auto', bgcolor: 'grey.50' }}>
            {selected ? (
              <Grid container spacing={2}>
                {/* Trái: thông tin cơ bản */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={2}>
                    <SectionCard icon={InfoOutlined} title="Thông tin cơ bản" description="Tên, slug URL, loại và danh mục cha.">
                      <Stack spacing={2.25}>
                        <Box>
                          <FieldLabel required>TÊN DANH MỤC</FieldLabel>
                          <TextField
                            value={selected.name ?? ''}
                            onChange={(e) => setField('name', e.target.value)}
                            fullWidth size="small"
                            placeholder="Vd: Nhẫn kim cương"
                          />
                        </Box>

                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, md: 7 }}>
                            <FieldLabel required>SLUG URL</FieldLabel>
                            <SlugInput
                              sourceName={selected.name}
                              value={selected.slug ?? ''}
                              onChange={(v) => setField('slug', v)}
                              auto={false}
                              label=""
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 5 }}>
                            <FieldLabel required>LOẠI</FieldLabel>
                            <TextField
                              select fullWidth size="small"
                              value={selected.type ?? ''}
                              onChange={(e) => setField('type', e.target.value)}
                            >
                              {TYPES.map((t) => (
                                <MenuItem key={t.value} value={t.value}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Iconify icon={t.icon} width={16} sx={{ color: 'text.secondary' }} />
                                    <span>{t.label}</span>
                                  </Stack>
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        </Grid>

                        <Box>
                          <FieldLabel>DANH MỤC CHA</FieldLabel>
                          <TextField
                            select fullWidth size="small"
                            value={selected.parent_id ?? ''}
                            onChange={(e) => setField('parent_id', e.target.value)}
                          >
                            <MenuItem value="">— Danh mục gốc —</MenuItem>
                            {flatForSelect.filter((c) => c.id !== selected.id).map((c) => (
                              <MenuItem key={c.id} value={c.id} sx={{ pl: c._depth ? (c._depth * 2 + 2) : 2 }}>
                                {c._depth > 0 ? '└ ' : ''}{c.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>

                        <Box>
                          <FieldLabel>ĐỐI TƯỢNG KHÁCH</FieldLabel>
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                            {AUDIENCES.map((a) => {
                              const active = (selected.audiences ?? []).includes(a.value);
                              return (
                                <Chip
                                  key={a.value}
                                  icon={<Iconify icon={a.icon} width={14} sx={{ ml: 0.5 }} />}
                                  label={a.label}
                                  color={active ? 'primary' : 'default'}
                                  variant={active ? 'filled' : 'outlined'}
                                  onClick={() => toggleAudience(a.value)}
                                />
                              );
                            })}
                          </Stack>
                        </Box>
                      </Stack>
                    </SectionCard>

                    <SectionCard icon={LanguageOutlined} title="SEO" description="Hiển thị trên Google & khi chia sẻ.">
                      <SeoPanel
                        value={selected.seo ?? {}}
                        onChange={(v) => setField('seo', v)}
                        sx={{ boxShadow: 'none', border: 0, '& .MuiCardContent-root': { p: 0 } }}
                      />
                    </SectionCard>
                  </Stack>
                </Grid>

                {/* Phải: ảnh */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={2}>
                    <SectionCard icon={ImageOutlined} title="Icon danh mục" description="Hiện ở khối 'Bạn đang tìm gì hôm nay?' trên homepage. 1:1, ≥ 128px.">
                      <UploadField
                        value={selected.icon || null}
                        onChange={(file) => {
                          if (file instanceof File) {
                            setField('icon_file_id', `tmp-${Date.now()}`);
                            setField('icon', URL.createObjectURL(file));
                          } else {
                            setField('icon_file_id', null);
                            setField('icon', '');
                          }
                        }}
                      />
                    </SectionCard>

                    <SectionCard icon={ImageOutlined} title="Banner đầu trang" description="3–5 ảnh ngang, dùng cho hero danh mục. 16:9, ≥ 1200px.">
                      <UploadGallery
                        value={selected.banner_file_ids ?? []}
                        maxFiles={5}
                        onChange={(arr) => setField('banner_file_ids', arr.map((v) => (v instanceof File ? URL.createObjectURL(v) : v)))}
                      />
                    </SectionCard>

                    <Box sx={{ bgcolor: 'primary.lighter', color: 'primary.darker', borderRadius: 2, p: 2, border: 1, borderColor: 'primary.light' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>TÓM TẮT</Typography>
                      <Stack spacing={0.5} sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <b>{selected.name || 'Chưa đặt tên'}</b>
                        </Typography>
                        <Typography variant="caption">
                          {selected.count ?? 0} sản phẩm · {(selected.children?.length ?? 0)} danh mục con
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            ) : (
              <Stack alignItems="center" spacing={1.5} sx={{ py: 10, color: 'text.secondary' }}>
                <Iconify icon="solar:arrow-left-linear" width={32} sx={{ color: 'text.disabled' }} />
                <Typography variant="body2">Hãy chọn một danh mục bên trái để xem và chỉnh sửa.</Typography>
              </Stack>
            )}
          </Box>
        </Box>
      </Box>

      <CategoryFormDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        parent={parentForNew}
        flatCategories={flatForSelect}
        onSubmit={(v) => console.log('create category', v)}
      />
    </Wrap>
  );
}
