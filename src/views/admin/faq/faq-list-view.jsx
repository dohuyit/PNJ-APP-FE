'use client';

import { useState } from 'react';

import { IconButton, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { useGetFaqList } from 'src/actions/admin/faq';
import { SimpleListView } from 'src/views/admin/_shared/simple-list-view';
import { COMMON_STATUS_COLOR, COMMON_STATUS_LABEL } from 'src/theme/pnj/status-colors';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';
import { StatusBadge } from 'src/components/common/status-badge';

import { FaqFormDrawer } from './faq-create-form';


const GROUP_LABEL = { product_general: 'SP chung', payment: 'Thanh toán', shipping: 'Giao hàng', warranty: 'Bảo hành' };
const GROUP_COLOR = { product_general: 'primary', payment: 'info', shipping: 'success', warranty: 'warning' };

export function FaqListView({ embedded = false } = {}) {
  const { searchResults: faqsList, searchLoading: faqsLoading } = useGetFaqList();
  const [editing, setEditing] = useState(null);

  const columns = [
    { field: 'question', headerName: 'Câu hỏi', flex: 1, renderCell: (p) => <Typography variant="body2">{p.row.question ?? '-'}</Typography> },
    { field: 'group', headerName: 'Nhóm', width: 150, renderCell: (p) => <Label color={GROUP_COLOR[p.row.group]}>{GROUP_LABEL[p.row.group]}</Label> },
    { field: 'sort', headerName: 'Thứ tự', width: 100 },
    { field: 'status', headerName: 'Trạng thái', width: 130, renderCell: (p) => <StatusBadge status={p.row.status} colorMap={COMMON_STATUS_COLOR} labelMap={COMMON_STATUS_LABEL} /> },
    {
      field: 'actions', headerName: '', width: 60, sortable: false,
      renderCell: (p) => (
        <IconButton size="small" onClick={() => setEditing(p.row)}>
          <Iconify icon="solar:pen-linear" width={16} />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <SimpleListView
        embedded={embedded}
        title="FAQ"
        subtitle={`${faqsList.length} câu hỏi · nhóm theo chủ đề`}
        breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'FAQ' }]}
        rows={faqsList}
        columns={columns}
        loading={faqsLoading}
        createLabel="Thêm FAQ"
        createDrawer={(close) => (
          <FaqFormDrawer open onClose={close} onSubmit={(v) => console.log('create faq', v)} />
        )}
        searchKeys={['question']}
      />

      <FaqFormDrawer
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(v) => console.log('update faq', v)}
      />
    </>
  );
}
