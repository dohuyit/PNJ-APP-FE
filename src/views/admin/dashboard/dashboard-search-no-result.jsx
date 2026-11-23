// src/views/admin/dashboard/dashboard-search-no-result.jsx

'use client';

import { Card, CardContent, CardHeader, List, ListItem, Stack, Typography, Box } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/common/label';

export function DashboardSearchNoResult({ items }) {
  return (
    <Card>
      <CardHeader
        title="Từ khoá không có kết quả"
        subheader="7 ngày gần nhất — gợi ý bổ sung SP / danh mục"
      />
      <CardContent sx={{ pt: 0 }}>
        <List disablePadding>
          {items.map((it, i) => (
            <ListItem key={i} disableGutters sx={{ py: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                <Box
                  sx={{
                    width: 28, height: 28, borderRadius: 1,
                    bgcolor: 'warning.lighter', color: 'warning.dark',
                    display: 'grid', placeItems: 'center',
                  }}
                >
                  <Iconify icon="solar:magnifer-linear" width={14} />
                </Box>
                <Typography variant="body2" sx={{ flex: 1 }} noWrap>
                  "{it.keyword}"
                </Typography>
                <Label>{`${it.count} lượt`}</Label>
              </Stack>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
