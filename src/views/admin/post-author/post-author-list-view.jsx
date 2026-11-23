// src/views/admin/post-author/post-author-list-view.jsx
// Tác giả blog — card grid chi tiết với avatar, stats, expertise.

'use client';

import { useState } from 'react';

import { Box, Button, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtNumber, fmtDate } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { RowActionsMenu } from 'src/views/admin/_shared/row-actions-menu';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';

import { PostAuthorFormDrawer } from './post-author-create-form';
import { mockPostAuthors } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const postAuthorsList = mockPostAuthors;
// Pastel gradient palette cho avatar — deterministic theo tên
const AVATAR_GRADIENTS = [
  ['#818CF8', '#4F46E5'], ['#F87171', '#DC2626'], ['#34D399', '#059669'],
  ['#FBBF24', '#D97706'], ['#A78BFA', '#7C3AED'], ['#38BDF8', '#0284C7'],
];
const hashStr = (s = '') => Array.from(s).reduce((a, c) => a + c.charCodeAt(0), 0);
const gradientOf = (n) => AVATAR_GRADIENTS[hashStr(n) % AVATAR_GRADIENTS.length];
const initialsOf = (n = '') =>
  n.trim().split(/\s+/).slice(-2).map((w) => w[0] ?? '').join('').toUpperCase() || '??';

const ROLE_META = {
  'Chief Editor':  { label: 'Trưởng ban',  color: '#DC2626' },
  'Senior Writer': { label: 'Senior',      color: '#2563EB' },
  'Writer':        { label: 'Writer',      color: '#059669' },
  'Contributor':   { label: 'Cộng tác',    color: '#D97706' },
};

export function PostAuthorCreateButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="small" variant="contained"
        startIcon={<Iconify icon="solar:user-plus-linear" width={14} />}
        onClick={() => setOpen(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Thêm tác giả
      </Button>
      <PostAuthorFormDrawer
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(v) => console.log('create post-author', v)}
      />
    </>
  );
}

function AuthorCard({ author, onEdit }) {
  const [g0, g1] = gradientOf(author.name);
  const role = ROLE_META[author.role] ?? { label: author.role, color: '#64748B' };

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
      {/* Body — avatar + info row song song, không overlap gradient */}
      <Box sx={{ p: 2, flex: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          {/* Avatar gradient */}
          <Box
            sx={{
              width: 56, height: 56, borderRadius: '50%',
              background: `linear-gradient(135deg, ${g0}, ${g1})`,
              color: 'common.white',
              display: 'grid', placeItems: 'center',
              fontWeight: 800, fontSize: 17,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              flexShrink: 0,
            }}
          >
            {initialsOf(author.name)}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Name + status dot + role badge */}
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }} noWrap>
                {author.name}
              </Typography>
              <Tooltip title={author.is_active ? 'Đang hoạt động' : 'Đã nghỉ'}>
                <Box sx={{
                  width: 7, height: 7, borderRadius: '50%',
                  bgcolor: author.is_active ? 'success.main' : 'grey.400',
                  flexShrink: 0,
                }} />
              </Tooltip>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center',
                px: 0.75, py: 0.125, borderRadius: 0.5,
                bgcolor: role.color + '14', color: role.color,
                fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
                flexShrink: 0,
              }}>
                {role.label}
              </Box>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, minWidth: 0 }} noWrap>
                · {author.email}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Bio */}
        <Typography
          variant="caption"
          sx={{
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            fontSize: 11.5, color: 'text.secondary', mt: 1, lineHeight: 1.45,
          }}
        >
          {author.bio}
        </Typography>

        {/* Expertise chips */}
        {(author.expertise ?? []).length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
            {author.expertise.map((e) => (
              <Box
                key={e}
                sx={{
                  display: 'inline-flex', alignItems: 'center',
                  px: 0.75, py: 0.125, borderRadius: 0.5,
                  bgcolor: 'grey.100', border: 1, borderColor: 'grey.200',
                  fontSize: 10, fontWeight: 600, color: 'text.secondary',
                }}
              >
                {e}
              </Box>
            ))}
          </Stack>
        )}

        {/* Stats */}
        <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="solar:document-text-linear" width={13} sx={{ color: 'text.disabled' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
              {fmtNumber(author.post_count)}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
              bài
            </Typography>
          </Stack>
          <Box sx={{ width: '1px', height: 16, bgcolor: 'grey.200', alignSelf: 'center' }} />
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify icon="solar:eye-linear" width={13} sx={{ color: 'text.disabled' }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
              {fmtNumber(author.view_count)}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5 }}>
              lượt xem
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Footer */}
      <Stack direction="row" alignItems="center" sx={{ px: 1.5, py: 0.75, borderTop: 1, borderColor: 'grey.100', bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10.5, flex: 1 }}>
          Vào ban: {fmtDate(author.joined_at)}
        </Typography>
        <Tooltip title="Sửa tác giả">
          <IconButton size="small" onClick={() => onEdit?.(author)} sx={{ width: 28, height: 28 }}>
            <Iconify icon="solar:pen-linear" width={14} />
          </IconButton>
        </Tooltip>
        <RowActionsMenu
          items={[
            { label: 'Xem bài của tác giả', icon: 'solar:document-text-linear', onClick: () => alert('Posts by ' + author.name) },
            { label: 'Copy email',          icon: 'solar:copy-linear',          onClick: () => navigator.clipboard?.writeText(author.email) },
            { divider: true },
            { label: author.is_active ? 'Ngưng hoạt động' : 'Kích hoạt lại',
              icon: author.is_active ? 'solar:pause-circle-linear' : 'solar:play-circle-linear',
              color: author.is_active ? 'warning' : undefined,
              onClick: () => alert('Toggle ' + author.name) },
            { label: 'Xoá tác giả', icon: 'solar:trash-bin-trash-linear', color: 'error', disabled: author.post_count > 0, onClick: () => alert('Xoá ' + author.name) },
          ]}
        />
      </Stack>
    </Box>
  );
}

export function PostAuthorListView({ embedded = false } = {}) {
  const totalPosts  = postAuthorsList.reduce((s, a) => s + a.post_count, 0);
  const totalViews  = postAuthorsList.reduce((s, a) => s + a.view_count, 0);
  const activeCount = postAuthorsList.filter((a) => a.is_active).length;
  const [editing, setEditing] = useState(null);

  const body = (
    <Box sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>
          {postAuthorsList.length} tác giả · {activeCount} đang hoạt động · {fmtNumber(totalPosts)} bài · {fmtNumber(totalViews)} lượt xem
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        {postAuthorsList.map((au) => (
          <Grid key={au.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <AuthorCard author={au} onEdit={setEditing} />
          </Grid>
        ))}
      </Grid>

      <PostAuthorFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update post-author', v)}
      />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Tác giả blog"
        subtitle={`${postAuthorsList.length} tác giả · trưởng ban · writer · cộng tác`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Tác giả' }]}
        actions={<PostAuthorCreateButton />}
      />
      {body}
    </DashboardContent>
  );
}
