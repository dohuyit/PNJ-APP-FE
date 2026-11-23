// src/views/admin/dashboard/dashboard-low-stock.jsx

'use client';

import { Box, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { Label } from 'src/components/common/label';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';

export function DashboardLowStock({ items }) {
  const list = items ?? [];
  return (
    <Card>
      <CardHeader title="Sản phẩm sắp hết hàng" subheader="Tồn kho ≤ 5 theo cửa hàng" />
      <CardContent sx={{ p: 0 }}>
        {list.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <EmptyContent filled title="Chưa có sản phẩm sắp hết" sx={{ py: 5 }} />
          </Box>
        ) : (
          <Scrollbar>
            <Table stickyHeader size="small" sx={{ minWidth: 480 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Sản phẩm</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Cửa hàng</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Tồn</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{it.sku ?? '-'}</TableCell>
                    <TableCell>{it.product ?? '-'}</TableCell>
                    <TableCell>{it.store ?? '-'}</TableCell>
                    <TableCell align="right">
                      <Label color={it.qty === 0 ? 'error' : it.qty <= 2 ? 'warning' : 'default'} variant="filled">
                        {it.qty ?? 0}
                      </Label>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        )}
      </CardContent>
    </Card>
  );
}
