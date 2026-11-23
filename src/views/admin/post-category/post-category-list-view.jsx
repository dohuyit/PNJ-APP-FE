// src/views/admin/post-category/post-category-list-view.jsx
// Chuyên mục blog — card grid chi tiết với thumbnail + hierarchy.

'use client';

import { useMemo, useState } from 'react';

import { Avatar, Box, Button, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtNumber } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetPostCategoryList } from 'src/actions/admin/post';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { GridCardSkeleton } from 'src/components/common/skeletons';

import { PostCategoryFormDrawer } from './post-category-create-form';


export function PostCategoryCreateButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small" variant="contained"
        startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
        onClick={() => setOpen(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Thêm chuyên mục
      </Button>
      <PostCategoryFormDrawer
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(v) => console.log('create post-category', v)}
      />
    </>
  );
}

function CategoryCard({ category, onEdit }) {
  const children = category.children ?? [];
  const hasChildren = children.length > 0;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: 1, borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        height: '100%',
        transition: 'border-color .15s, box-shadow .15s',
        '&:hover': {
          borderColor: 'text.disabled',
          boxShadow: '0 2px 8px rgba(145,158,171,0.14)',
        },
      }}
    >
      {/* Cover thumbnail */}
      <Box sx={{ position: 'relative', height: 120, bgcolor: 'grey.100', overflow: 'hidden' }}>
        <Box
          component="img"
          src={category.cover}
          alt={category.name}
          loading="lazy"
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {category.is_featured && (
          <Box sx={{
            position: 'absolute', top: 8, left: 8,
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            px: 0.875, py: 0.25, borderRadius: '4px',
            bgcolor: 'rgba(17,24,39,0.72)', color: '#FDE68A',
            backdropFilter: 'blur(6px)',
            fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
          }}>
            <Iconify icon="solar:star-bold" width={11} /> NỔI BẬT
          </Box>
        )}
        <Box sx={{
          position: 'absolute', bottom: 8, right: 8,
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          px: 0.875, py: 0.25, borderRadius: '4px',
          bgcolor: 'rgba(17,24,39,0.72)', color: 'common.white',
          backdropFilter: 'blur(6px)',
          fontSize: 10.5, fontWeight: 700, fontFamily: 'monospace',
        }}>
          <Iconify icon="solar:document-text-linear" width={11} />
          {fmtNumber(category.post_count ?? 0)}
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2, flex: 1 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Stack sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }} noWrap>
              {category.name}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace', fontSize: 10.5 }} noWrap>
              {category.path}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, fontFamily: 'monospace', mt: 0.25 }}>
            #{category.sort}
          </Typography>
        </Stack>

        {category.description && (
          <Typography
            variant="caption"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              fontSize: 11.5, color: 'text.secondary', mt: 1, lineHeight: 1.45,
            }}
          >
            {category.description}
          </Typography>
        )}

        {/* Children chips */}
        {hasChildren && (
          <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1.25 }}>
            {children.slice(0, 3).map((ch) => (
              <Box
                key={ch.id}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  px: 0.875, py: 0.25, borderRadius: '4px',
                  bgcolor: 'grey.100', border: 1, borderColor: 'grey.200',
                  fontSize: 10.5, fontWeight: 600, color: 'text.secondary',
                }}
              >
                <Iconify icon="solar:arrow-right-linear" width={10} sx={{ color: 'text.disabled' }} />
                {ch.name}
                <Box component="span" sx={{ color: 'text.disabled', fontSize: 9.5, ml: 0.25, fontFamily: 'monospace' }}>
                  {ch.post_count ?? 0}
                </Box>
              </Box>
            ))}
            {children.length > 3 && (
              <Box sx={{
                display: 'inline-flex', alignItems: 'center',
                px: 0.75, py: 0.25, borderRadius: '4px',
                fontSize: 10.5, fontWeight: 600, color: 'text.disabled', fontFamily: 'monospace',
              }}>
                +{children.length - 3}
              </Box>
            )}
          </Stack>
        )}
      </Box>

      {/* Footer */}
      <Stack direction="row" alignItems="center" sx={{ px: 1.5, py: 0.75, borderTop: 1, borderColor: 'grey.100', bgcolor: 'grey.50' }}>
        {hasChildren && (
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, flex: 1 }}>
            {children.length} chuyên mục con
          </Typography>
        )}
        {!hasChildren && <Box sx={{ flex: 1 }} />}
        <Tooltip title="Sửa chuyên mục">
          <IconButton size="small" onClick={() => onEdit(category)} sx={{ width: 28, height: 28 }}>
            <Iconify icon="solar:pen-linear" width={14} />
          </IconButton>
        </Tooltip>
        <RowActionsMenu
          items={[
            { label: 'Xem trên site',  icon: 'solar:eye-linear',     onClick: () => window.open(category.path, '_blank') },
            { label: 'Copy slug',      icon: 'solar:copy-linear',    onClick: () => navigator.clipboard?.writeText(category.slug) },
            { divider: true },
            { label: 'Xoá chuyên mục', icon: 'solar:trash-bin-trash-linear', color: 'error', disabled: (category.post_count ?? 0) > 0, onClick: () => alert('Xoá ' + category.slug) },
          ]}
        />
      </Stack>
    </Box>
  );
}

export function PostCategoryListView({ embedded = false } = {}) {
  const { searchResults: postCategoriesTree, searchLoading: categoriesLoading } = useGetPostCategoryList();
  const [editing, setEditing] = useState(null);

  const totalPosts = useMemo(() => {
    const walk = (list) => list.reduce((s, c) => s + (c.post_count ?? 0) + walk(c.children ?? []), 0);
    return walk(postCategoriesTree);
  }, [postCategoriesTree]);

  const body = categoriesLoading ? (
    <GridCardSkeleton count={6} cols={{ xs: 12, sm: 6, md: 4 }} imageHeight={180} />
  ) : (
    <Box sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }} spacing={1}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>
          {postCategoriesTree.length} chuyên mục · {fmtNumber(totalPosts)} bài viết
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        {postCategoriesTree.map((cat) => (
          <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <CategoryCard category={cat} onEdit={setEditing} />
          </Grid>
        ))}
      </Grid>

      <PostCategoryFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update post-category', v)}
      />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Chuyên mục blog"
        subtitle="Cây 2 cấp · Mix & Match, Kiến thức, Cung Mệnh..."
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Chuyên mục' }]}
        actions={<PostCategoryCreateButton />}
      />
      {body}
    </DashboardContent>
  );
}
