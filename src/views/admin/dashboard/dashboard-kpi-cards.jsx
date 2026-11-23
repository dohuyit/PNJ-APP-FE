// src/views/admin/dashboard/dashboard-kpi-cards.jsx — 4 top KPIs

'use client';

import { Card, CardContent, Grid, Stack, Typography, Box, Chip } from '@mui/material';

import { fmtVND, fmtNumber } from 'src/utils/format';

import { Iconify } from 'src/components/iconify';

const KPI_META = {
  revenue: { icon: 'solar:dollar-minimalistic-bold-duotone', color: 'primary.main', fmt: fmtVND },
  orders: { icon: 'solar:cart-large-bold-duotone', color: 'info.main', fmt: fmtNumber },
  aov: { icon: 'solar:tag-horizontal-bold-duotone', color: 'warning.main', fmt: fmtVND },
  new_customers: { icon: 'solar:users-group-rounded-bold-duotone', color: 'success.main', fmt: fmtNumber },
};

export function DashboardKpiCards({ kpi }) {
  return (
    <Grid container spacing={2.5}>
      {Object.entries(kpi).map(([key, v]) => {
        const meta = KPI_META[key] ?? { icon: 'solar:chart-linear', color: 'primary.main', fmt: fmtNumber };
        const positive = v.delta_pct >= 0;
        return (
          <Grid key={key} item xs={12} sm={6} md={3}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: -20, right: -20,
                  width: 140, height: 140,
                  bgcolor: meta.color,
                  opacity: 0.08,
                  borderRadius: '50%',
                },
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                      {v.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                      {meta.fmt(v.value)}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                      <Chip
                        icon={<Iconify icon={positive ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'} width={14} />}
                        label={`${positive ? '+' : ''}${v.delta_pct.toFixed(1)}%`}
                        size="small"
                        color={positive ? 'success' : 'error'}
                        variant="outlined"
                        sx={{ height: 22, '& .MuiChip-icon': { ml: 0.5 } }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        so với kỳ trước
                      </Typography>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      width: 48, height: 48,
                      borderRadius: 2,
                      bgcolor: `${meta.color}`,
                      color: 'common.white',
                      display: 'grid',
                      placeItems: 'center',
                      opacity: 0.9,
                    }}
                  >
                    <Iconify icon={meta.icon} width={24} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
