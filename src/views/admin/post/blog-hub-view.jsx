// src/views/admin/post/blog-hub-view.jsx — Hub gộp Blog = Bài viết + Chuyên mục

'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import EditNoteOutlined from '@mui/icons-material/EditNoteOutlined';
import BookmarksOutlined from '@mui/icons-material/BookmarksOutlined';
import PeopleOutlineOutlined from '@mui/icons-material/PeopleOutlineOutlined';

import { adminPaths } from 'src/routes/paths';

import { useGetPostList } from 'src/actions/admin/post';
import { DashboardContent } from 'src/layouts/dashboard';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { useGetPostCategoryList } from 'src/actions/admin/post';
import { PostAuthorListView, PostAuthorCreateButton } from 'src/views/admin/post-author/post-author-list-view';
import { PostCategoryListView, PostCategoryCreateButton } from 'src/views/admin/post-category/post-category-list-view';

import { PageHeader } from 'src/components/common/page-header';

import { PostListView, PostCreateButton } from './post-list-view';
import { mockPostAuthors } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const postAuthorsList = mockPostAuthors;
function countTree(items) {
  return items.reduce((n, it) => n + 1 + (it.children ? countTree(it.children) : 0), 0);
}

export function BlogHubView({ defaultTab = 'posts' }) {
  const postCategoriesTree = useGetPostCategoryList().searchResults;
  const postsList = useGetPostList().searchResults;
  const [tab, setTab] = useState(defaultTab);
  const TABS = [
    { value: 'posts',      label: 'Bài viết',   Icon: EditNoteOutlined,       count: postsList.length,                   subtitle: 'Bài blog · lịch xuất bản · SEO',          actions: <PostCreateButton /> },
    { value: 'categories', label: 'Chuyên mục', Icon: BookmarksOutlined,      count: countTree(postCategoriesTree),      subtitle: 'Cây chuyên mục blog phân cấp',            actions: <PostCategoryCreateButton /> },
    { value: 'authors',    label: 'Tác giả',    Icon: PeopleOutlineOutlined,  count: postAuthorsList.length,             subtitle: 'Đội ngũ viết bài · phân quyền · hoạt động', actions: <PostAuthorCreateButton /> },
  ];
  const active = TABS.find((t) => t.value === tab) ?? TABS[0];

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={active.label}
        subtitle={active.subtitle}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Marketing' },
          { label: active.label },
        ]}
        actions={active.actions}
      />

      <HubTabs value={tab} onChange={setTab} tabs={TABS} />

      <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
        {tab === 'posts'      && <PostListView embedded />}
        {tab === 'categories' && <PostCategoryListView embedded />}
        {tab === 'authors'    && <PostAuthorListView embedded />}
      </Box>
    </DashboardContent>
  );
}
