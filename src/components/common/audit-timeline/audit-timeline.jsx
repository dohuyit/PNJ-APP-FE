// src/components/common/audit-timeline/audit-timeline.jsx — timeline from activity_logs / status_history
'use client';

import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector,
  TimelineContent, TimelineDot, TimelineOppositeContent,
} from '@mui/lab';
import { Avatar, Box, Stack, Typography, Chip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import dayjs from 'dayjs';

const ACTION_ICON = {
  create: 'solar:add-circle-linear',
  update: 'solar:pen-linear',
  delete: 'solar:trash-bin-trash-linear',
  login: 'solar:login-3-linear',
  logout: 'solar:logout-3-linear',
  export: 'solar:download-linear',
  transition: 'solar:arrow-right-linear',
};
const ACTION_COLOR = {
  create: 'success', update: 'info', delete: 'error',
  login: 'primary', logout: 'default', export: 'warning', transition: 'secondary',
};

export function AuditTimeline({ entries = [], sx }) {
  if (!entries.length) {
    return (
      <Box sx={{ py: 3, textAlign: 'center', ...sx }}>
        <Iconify icon="solar:clock-circle-linear" width={32} sx={{ color: 'text.disabled' }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Chưa có hoạt động
        </Typography>
      </Box>
    );
  }

  return (
    <Timeline position="right" sx={{ p: 0, ...sx }}>
      {entries.map((e, i) => {
        const icon = ACTION_ICON[e.action] ?? 'solar:document-linear';
        const color = ACTION_COLOR[e.action] ?? 'primary';
        return (
          <TimelineItem key={i} sx={{ '&:before': { display: 'none' } }}>
            <TimelineSeparator>
              <TimelineDot color={color} sx={{ p: 0.75 }}>
                <Iconify icon={icon} width={14} />
              </TimelineDot>
              {i < entries.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent sx={{ pb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {e.actor_avatar && (
                  <Avatar src={e.actor_avatar} sx={{ width: 24, height: 24 }} />
                )}
                <Typography variant="subtitle2">{e.summary}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {e.actor ?? 'Hệ thống'}
                </Typography>
                <Typography variant="caption" color="text.disabled">·</Typography>
                <Typography variant="caption" color="text.secondary">
                  {dayjs(e.at).format('HH:mm · DD/MM/YYYY')}
                </Typography>
                {e.ip && (
                  <>
                    <Typography variant="caption" color="text.disabled">·</Typography>
                    <Chip label={e.ip} size="small" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
                  </>
                )}
              </Stack>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
