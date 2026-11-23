// src/views/admin/dashboard/dashboard-top-products.jsx

'use client';

import { Avatar, Card, CardContent, CardHeader, List, ListItem, Stack, Typography, LinearProgress, Box } from '@mui/material';

import { fmtNumber, fmtVND } from 'src/utils/format';

export function DashboardTopProducts({ items }) {
  const max = Math.max(...items.map((i) => i.sold_count), 1);
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Top sản phẩm bán chạy" subheader="30 ngày gần nhất" />
      <CardContent sx={{ pt: 0 }}>
        <List disablePadding>
          {items.map((item, i) => (
            <ListItem key={item.id} disableGutters sx={{ py: 1.25, borderBottom: i === items.length - 1 ? 0 : 1, borderColor: 'grey.100' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                <Avatar src={item.image} variant="rounded" sx={{ width: 40, height: 40 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>{item.name}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                    <Typography variant="caption" color="text.secondary">
                      Đã bán <b>{fmtNumber(item.sold_count)}</b>
                    </Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={600}>
                      {fmtVND(item.revenue)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(item.sold_count / max) * 100}
                    sx={{ mt: 0.5, height: 4, borderRadius: 1 }}
                  />
                </Box>
              </Stack>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
