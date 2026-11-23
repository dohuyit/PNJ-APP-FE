// src/views/admin/product/catalog-hub-view.jsx — Catalog hub: sản phẩm + taxonomy
// Tồn kho đã tách thành module sidebar riêng (/admin/inventory) — không còn tab ở đây.

'use client';

import { useState } from 'react';

import { Box, Button } from '@mui/material';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import StraightenOutlined from '@mui/icons-material/StraightenOutlined';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { useGetProductList } from 'src/actions/admin/product';
import { useGetCategoryTree } from 'src/actions/admin/category';
import { useGetSizeGuideList } from 'src/actions/admin/size-guide';
import { CategoryView } from 'src/views/admin/category/category-view';
import { useGetProductLineList } from 'src/actions/admin/product-line';
import { SizeGuideListView } from 'src/views/admin/size-guide/size-guide-list-view';
import { ProductLineListView } from 'src/views/admin/product-line/product-line-list-view';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';

import { ProductListView, ProductListActions } from './product-list-view';

function countTree(items) {
  return items.reduce((n, it) => n + 1 + (it.children ? countTree(it.children) : 0), 0);
}

function CreateButton({ label, onClick }) {
  return (
    <Button
      variant="contained" size="small"
      startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
      onClick={onClick}
      sx={{
        boxShadow: 'none',
        bgcolor: '#1E293B', color: 'common.white',
        '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
      }}
    >
      {label}
    </Button>
  );
}

export function CatalogHubView({ defaultTab = 'products' }) {
  const categoriesTree = useGetCategoryTree().tree;
  const productLinesList = useGetProductLineList().searchResults;
  const productsList = useGetProductList().searchResults;
  const sizeGuidesList = useGetSizeGuideList().searchResults;
  const [tab, setTab] = useState(defaultTab);
  const [createOpen, setCreateOpen] = useState({ lines: false, size: false });
  const openCreate = (key) => setCreateOpen((s) => ({ ...s, [key]: true }));
  const closeCreate = (key) => setCreateOpen((s) => ({ ...s, [key]: false }));

  const TABS = [
    { value: 'products',   label: 'Sản phẩm',       Icon: Inventory2Outlined,  count: productsList.length,          subtitle: 'Catalog SP · biến thể · giá · nhãn', actions: <ProductListActions /> },
    { value: 'categories', label: 'Danh mục',       Icon: CategoryOutlined,    count: countTree(categoriesTree),    subtitle: 'Cây danh mục phân cấp · sắp xếp · hiển thị' },
    { value: 'lines',      label: 'Dòng hàng',      Icon: LayersOutlined,      count: productLinesList.length,      subtitle: 'Dòng sản phẩm theo chủ đề / chất liệu', actions: <CreateButton label="Tạo dòng hàng" onClick={() => openCreate('lines')} /> },
    { value: 'size',       label: 'Hướng dẫn size', Icon: StraightenOutlined,  count: sizeGuidesList.length,        subtitle: 'Bảng quy đổi size theo loại SP',       actions: <CreateButton label="Tạo hướng dẫn" onClick={() => openCreate('size')} /> },
  ];
  const active = TABS.find((t) => t.value === tab) ?? TABS[0];

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={active.label}
        subtitle={active.subtitle}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Catalog' },
          { label: active.label },
        ]}
        actions={active.actions}
      />
      <HubTabs value={tab} onChange={setTab} tabs={TABS} />
      <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
        {tab === 'products'   && <ProductListView embedded />}
        {tab === 'categories' && <CategoryView embedded />}
        {tab === 'lines'      && <ProductLineListView embedded createOpen={createOpen.lines} onCloseCreate={() => closeCreate('lines')} />}
        {tab === 'size'       && <SizeGuideListView embedded createOpen={createOpen.size} onCloseCreate={() => closeCreate('size')} />}
      </Box>
    </DashboardContent>
  );
}
