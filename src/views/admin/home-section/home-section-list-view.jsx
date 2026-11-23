'use client';

import { useState } from 'react';

import { Box, Button, Card, CardContent } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { SortableTree } from 'src/components/common/sortable-tree';

import { HomeSectionFormDrawer } from './home-section-create-form';
import { mockHomeSections } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const homeSectionsList = mockHomeSections;
// Actions exported để hub-view gắn vào PageHeader chính
export function HomeSectionActions() {
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <>
      <Button
        size="small" variant="outlined"
        startIcon={<Iconify icon="solar:eye-linear" width={13} />}
        sx={{ boxShadow: 'none', borderColor: 'divider' }}
      >
        Xem trước
      </Button>
      <Button
        size="small" variant="contained"
        startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
        onClick={() => setCreateOpen(true)}
        sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
      >
        Thêm section
      </Button>
      <HomeSectionFormDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(v) => console.log('create section', v)}
      />
    </>
  );
}

export function HomeSectionListView({ embedded = false } = {}) {
  const [sections, setSections] = useState(homeSectionsList);
  const [editing, setEditing] = useState(null);

  const body = (
    <Box sx={{ p: { xs: 2, md: 2.5 } }}>
      <Card sx={{ boxShadow: 'none', border: 1, borderColor: 'divider' }}>
        <CardContent>
          <SortableTree
            items={sections.map((s) => ({
              id: s.id,
              name: s.title,
              icon: null,
              slug: s.type,
              badge: s.status === 'inactive' ? 'Ẩn' : null,
            }))}
            onChange={setSections}
            onEdit={(item) => setEditing(sections.find((s) => s.id === item.id) ?? item)}
            onDelete={() => {}}
          />
        </CardContent>
      </Card>

      <HomeSectionFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update section', v)}
      />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Builder trang chủ"
        subtitle={`${sections.length} section · kéo thả sắp xếp · xem trước`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Trang chủ' }]}
        actions={<HomeSectionActions />}
      />
      {body}
    </DashboardContent>
  );
}
