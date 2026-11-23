// src/views/admin/product/product-edit-view.jsx

'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetProductList } from 'src/actions/admin/product';

import { FormSkeleton } from 'src/components/common/skeletons';

import { ProductForm } from './product-form';

// Stubs — API chưa có hook; giữ literal để view không crash.
const productsDetail = {};

export function ProductEditView({ id }) {
  const { searchResults: productsList, searchLoading: productsLoading } = useGetProductList();
  if (productsLoading) {
    return (
      <DashboardContent disablePadding>
        <FormSkeleton
          withSidebar
          sections={[
            { fields: ['text', 'text', 'two-col', 'rich'] },
            { fields: ['media', 'repeater'] },
            { fields: ['two-col', 'switch', 'switch'] },
          ]}
        />
      </DashboardContent>
    );
  }
  // Merge mock detail (fields đầy đủ cho form state) với list item (overrides theo id được click).
  // Nhờ vậy mọi product edit đều hiển thị full form — lộ đúng các field chưa có UI selector.
  const listItem = productsList.find((p) => p.id === id) ?? {};
  const initial = { ...productsDetail, ...listItem };
  return <ProductForm mode="edit" initial={initial} />;
}
