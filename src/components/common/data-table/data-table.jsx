// src/components/common/data-table/data-table.jsx — MUI Table (zeno-crm-fe style) giữ API cột cũ
'use client';

import { useMemo, useState } from 'react';

import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { TableHeadCustom } from 'src/components/table/table-head-custom';
import { TableSkeleton } from 'src/components/table/table-skeleton';
import { TablePaginationCustom } from 'src/components/table/table-pagination-custom';

const getKey = (r) => r?.id ?? r?._id;

// 12.5px head · 13px cell · hover xám nhạt · border mảnh — khớp bảng zeno-crm-fe.
// 12.5px head · 13px cell · full-bleed sát lề · cell đầu/cuối tự add px để không dính mép.
const tableSx = {
  minWidth: 960,
  '& .MuiTableCell-root': {
    '&:first-of-type': { pl: { xs: 2, md: 3 } },
    '&:last-of-type': { pr: { xs: 2, md: 3 } },
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    bgcolor: 'grey.50',
    color: 'text.secondary',
    fontSize: 12.5,
    fontWeight: 600,
    lineHeight: 1.4,
    textTransform: 'none',
    letterSpacing: 0,
    py: 1.25,
    borderBottom: 1,
    borderColor: 'divider',
  },
  '& .MuiTableBody-root .MuiTableCell-root': {
    fontSize: 13,
    lineHeight: 1.45,
    py: 1.25,
    borderBottom: 1,
    borderColor: (t) => t.palette.action.hover,
    color: 'text.primary',
  },
  '& .MuiTableBody-root .MuiTableRow-root:hover': {
    bgcolor: 'action.hover',
  },
  '& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root': {
    borderBottom: 0,
  },
};

export function DataTable({
  rows = [],
  columns = [],
  loading,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  checkboxSelection = false,
  toolbar,
  emptyText = 'Chưa có dữ liệu',
  emptyDescription,
  getRowId = getKey,
  sx,
  onRowClick,
  selectedKeys,          // controlled selection array
  onSelectionChange,     // (keys) => void
  bulkBar,               // ReactNode render giữa toolbar + head
}) {
  const page = paginationModel?.page ?? 0;
  const pageSize = paginationModel?.pageSize ?? 20;
  const total = rowCount ?? rows.length;

  const paged = useMemo(() => {
    if (rowCount != null) return rows; // server-paged: caller đã slice
    return rows.slice(page * pageSize, page * pageSize + pageSize);
  }, [rows, page, pageSize, rowCount]);

  const headCells = useMemo(
    () =>
      columns.map((c) => ({
        id: c.field,
        label: c.headerName ?? '',
        width: c.width,
        align: c.align,
        sx: c.minWidth ? { minWidth: c.minWidth } : undefined,
      })),
    [columns]
  );

  const [internalSelected, setInternalSelected] = useState([]);
  const controlled = selectedKeys != null;
  const selected = controlled ? selectedKeys : internalSelected;
  const emit = (next) => { if (!controlled) setInternalSelected(next); onSelectionChange?.(next); };

  const allKeys = paged.map(getRowId);
  const numSelected = selected.filter((k) => allKeys.includes(k)).length;
  const allChecked = allKeys.length > 0 && numSelected === allKeys.length;

  const toggleOne = (key) =>
    emit(selected.includes(key) ? selected.filter((x) => x !== key) : [...selected, key]);
  const toggleAll = (checked) => {
    const others = selected.filter((k) => !allKeys.includes(k));
    emit(checked ? [...others, ...allKeys] : others);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', ...sx }}>
      {toolbar && (
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          {toolbar}
        </Box>
      )}

      {bulkBar}

      <Scrollbar sx={{ minHeight: 320 }}>
        <Table stickyHeader size="small" sx={tableSx}>
          <TableHeadCustom
            headCells={headCells}
            rowCount={allKeys.length}
            numSelected={numSelected}
            onSelectAllRows={checkboxSelection ? toggleAll : undefined}
          />

          <TableBody>
            {loading ? (
              <TableSkeleton
                rowCount={Math.min(pageSize, 8)}
                cellCount={headCells.length + (checkboxSelection ? 1 : 0)}
              />
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headCells.length + (checkboxSelection ? 1 : 0)} sx={{ p: 0, border: 0 }}>
                  <EmptyContent
                    filled
                    title={emptyText}
                    description={emptyDescription}
                    sx={{ py: 6, borderRadius: 0 }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => {
                const key = getRowId(row);
                return (
                  <TableRow
                    key={key}
                    hover
                    onClick={onRowClick ? () => onRowClick({ row, id: key }) : undefined}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {checkboxSelection && (
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          size="small"
                          checked={selected.includes(key)}
                          onChange={() => toggleOne(key)}
                        />
                      </TableCell>
                    )}
                    {columns.map((c) => (
                      <TableCell key={c.field} align={c.align || 'left'}>
                        {c.renderCell ? c.renderCell({ row, id: key, value: row[c.field] }) : row[c.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePaginationCustom
        page={page}
        count={total}
        rowsPerPage={pageSize}
        onPageChange={(_, newPage) => onPaginationModelChange?.({ page: newPage, pageSize })}
        onRowsPerPageChange={(e) =>
          onPaginationModelChange?.({ page: 0, pageSize: parseInt(e.target.value, 10) })
        }
        sx={{ borderTop: 1, borderColor: 'divider' }}
      />
    </Box>
  );
}
