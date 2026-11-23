// src/views/admin/setting/setting-view.jsx
// Cấu hình hệ thống — flat, light, nhất quán với role-list-view / roster-view.

'use client';

import { useState } from 'react';

import {
  Box, Button, Chip, FormControlLabel, Grid, IconButton, InputAdornment, Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { MoneyInput } from 'src/components/common/money-input';

// Stubs — API chưa có hook; giữ literal để view không crash.
// Shape: { [sectionKey]: { label, icon, fields: [{ key, label, type, default }] } }
// Rỗng khi chưa có API — view vẫn render shell không crash.
const settingsDefinition = {
  general: { label: 'Chung', icon: 'solar:settings-bold-duotone', fields: [] },
};

// Mỗi section — accent pastel + mô tả ngắn
const SECTION_META = {
  general:  { description: 'Thông tin pháp lý và nhận diện của PNJ',             accent: '#2563EB' },
  contact:  { description: 'Hotline, email và giờ hỗ trợ khách hàng',            accent: '#059669' },
  checkout: { description: 'Ngưỡng tiền mặt theo quy định và phí giao mặc định', accent: '#D97706' },
  usp:      { description: 'Ba điểm nổi bật hiển thị trên toàn site',            accent: '#7C3AED' },
  social:   { description: 'Liên kết mạng xã hội chính thức',                    accent: '#DB2777' },
};

// --- Nav item: active có nền grey.50 + stripe trái, không shadow ---
function SectionNavItem({ label, icon, meta, active, dirty, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 1.25,
        px: 1.5, py: 1.25,
        borderRadius: 0.75,
        cursor: 'pointer',
        bgcolor: active ? 'grey.50' : 'transparent',
        borderLeft: 3,
        borderLeftColor: active ? meta.accent : 'transparent',
        transition: 'background-color .15s ease, border-color .15s ease',
        '&:hover': { bgcolor: active ? 'grey.50' : 'action.hover' },
      }}
    >
      <Box
        sx={{
          width: 28, height: 28, borderRadius: 0.75,
          display: 'grid', placeItems: 'center',
          bgcolor: active ? meta.accent + '12' : 'grey.100',
          color: active ? meta.accent : 'text.secondary',
          flexShrink: 0,
        }}
      >
        <Iconify icon={icon} width={14} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{
          fontSize: 12.5, fontWeight: 600,
          color: active ? 'text.primary' : 'text.secondary',
          lineHeight: 1.2,
        }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 10.5, color: 'text.disabled', lineHeight: 1.25, mt: 0.15 }} noWrap>
          {meta.description}
        </Typography>
      </Box>
      {dirty && (
        <Tooltip title="Chưa lưu thay đổi">
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'warning.main' }} />
        </Tooltip>
      )}
    </Box>
  );
}

// --- Field row: layout 2 cột, không divider dưới mỗi field, input nền trắng ---
function FieldRow({ field, accent }) {
  const helperByType = {
    money:    'Số tiền tính bằng VND',
    textarea: 'Nội dung dài, có thể xuống dòng',
    email:    'Địa chỉ email nhận thông báo',
    url:      'Đường dẫn đầy đủ (bao gồm https://)',
    text:     'Giá trị dạng chữ',
    boolean:  'Bật / Tắt tính năng',
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: 'background.paper',
      '& fieldset': { borderColor: 'divider' },
      '&:hover fieldset': { borderColor: accent + '55' },
      '&.Mui-focused fieldset': { borderColor: accent + '99', borderWidth: 1 },
    },
  };

  return (
    <Grid container spacing={2} alignItems="flex-start" sx={{ py: 1.75 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.primary' }}>
            {field.label}
            {field.required && <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>}
          </Typography>
          <Tooltip title={`Khoá: ${field.key}`}>
            <IconButton size="small" sx={{ p: 0.25, color: 'text.disabled' }}>
              <Iconify icon="solar:info-circle-linear" width={12} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.25, lineHeight: 1.4 }}>
          {helperByType[field.type]}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        {field.type === 'money' && (
          <MoneyInput size="small" fullWidth defaultValue={field.default} sx={inputSx} />
        )}
        {field.type === 'textarea' && (
          <TextField size="small" fullWidth multiline rows={3} placeholder="Nhập nội dung…" sx={inputSx} />
        )}
        {field.type === 'boolean' && (
          <FormControlLabel
            control={
              <Switch
                size="small" defaultChecked
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: accent },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: accent },
                }}
              />
            }
            label={<Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>Bật</Typography>}
          />
        )}
        {(['text', 'email', 'url'].includes(field.type)) && (
          <TextField
            size="small" fullWidth
            type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
            defaultValue={field.default}
            InputProps={{
              startAdornment: field.type === 'url' ? (
                <InputAdornment position="start">
                  <Iconify icon="solar:link-linear" width={13} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ) : field.type === 'email' ? (
                <InputAdornment position="start">
                  <Iconify icon="solar:letter-linear" width={13} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ) : undefined,
            }}
            sx={inputSx}
          />
        )}
      </Grid>
    </Grid>
  );
}

// ---------- Main ----------

export function SettingView({ embedded = false } = {}) {
  const [section, setSection] = useState('general');
  const [dirty, setDirty] = useState(false);
  const def = settingsDefinition[section];
  const meta = SECTION_META[section] ?? { description: '', accent: '#64748B' };
  const totalSections = Object.keys(settingsDefinition).length;
  const totalFields = Object.values(settingsDefinition).reduce((n, s) => n + s.fields.length, 0);

  const body = (
    <Box sx={{
      bgcolor: 'background.paper',
      border: 1, borderColor: 'divider',
      borderRadius: 1,
      p: { xs: 2, md: 2.5 },
    }}>
      {/* Title row */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
            Cấu hình hệ thống
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
            {totalSections} nhóm · {totalFields} trường cấu hình · thay đổi ảnh hưởng toàn site
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        {/* Left: Section nav */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              border: 1, borderColor: 'divider',
              borderRadius: 1, overflow: 'hidden',
              position: { lg: 'sticky' }, top: { lg: 88 },
            }}
          >
            <Box sx={{ px: 1.75, py: 1.25, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
              <Typography sx={{ fontSize: 10.5, color: 'text.disabled', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                Danh mục cấu hình
              </Typography>
            </Box>

            <Stack spacing={0.25} sx={{ p: 0.75 }}>
              {Object.entries(settingsDefinition).map(([key, s]) => (
                <SectionNavItem
                  key={key}
                  label={s.label}
                  icon={s.icon}
                  meta={SECTION_META[key] ?? { description: '', accent: '#64748B' }}
                  active={section === key}
                  dirty={false}
                  onClick={() => setSection(key)}
                />
              ))}
            </Stack>

            {/* Help panel */}
            <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                <Iconify icon="solar:info-circle-linear" width={13} sx={{ color: 'info.main' }} />
                <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
                  Lưu ý
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', lineHeight: 1.5 }}>
                Thay đổi cấu hình ảnh hưởng toàn site. Luôn kiểm tra kỹ trước khi lưu — cache CDN có thể mất tới 5 phút để đồng bộ.
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right: Content */}
        <Grid size={{ xs: 12, lg: 9 }}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              border: 1, borderColor: 'divider',
              borderRadius: 1, overflow: 'hidden',
            }}
          >
            {/* Section header: không gradient, flat */}
            <Stack
              direction="row" alignItems="center" spacing={1.5}
              sx={{
                px: 2.5, py: 1.75,
                bgcolor: 'grey.50',
                borderBottom: 1, borderColor: 'divider',
              }}
            >
              <Box sx={{
                width: 36, height: 36, borderRadius: 0.75,
                bgcolor: meta.accent + '12', color: meta.accent,
                display: 'grid', placeItems: 'center',
              }}>
                <Iconify icon={def.icon} width={18} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                  {def.label}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.125 }}>
                  {meta.description} · {def.fields.length} trường
                </Typography>
              </Box>
              <Chip
                icon={<Iconify icon="solar:history-linear" width={11} sx={{ ml: 0.5 }} />}
                label="Cập nhật 2 ngày trước"
                size="small"
                variant="outlined"
                sx={{ color: 'text.secondary', bgcolor: 'background.paper', fontSize: 10.5, height: 22, borderColor: 'divider' }}
              />
            </Stack>

            {/* Fields body */}
            <Box
              sx={{ px: 2.5, py: 0.5 }}
              onInput={() => setDirty(true)}
            >
              <Stack divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
                {def.fields.map((f) => <FieldRow key={f.key} field={f} accent={meta.accent} />)}
              </Stack>
            </Box>

            {/* Footer */}
            <Stack
              direction="row" alignItems="center" spacing={1.5}
              sx={{
                px: 2.5, py: 1.5, bgcolor: 'grey.50',
                borderTop: 1, borderColor: 'divider',
              }}
            >
              {dirty ? (
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Box sx={{
                    width: 7, height: 7, borderRadius: '50%', bgcolor: 'warning.main',
                    animation: 'dot-pulse 1.4s ease-in-out infinite',
                    '@keyframes dot-pulse': {
                      '0%,100%': { opacity: 1 },
                      '50%':     { opacity: 0.3 },
                    },
                  }} />
                  <Typography sx={{ fontSize: 11.5, color: 'warning.dark', fontWeight: 500 }}>
                    Có thay đổi chưa lưu
                  </Typography>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Iconify icon="solar:check-circle-linear" width={13} sx={{ color: 'success.main' }} />
                  <Typography sx={{ fontSize: 11.5, color: 'text.disabled' }}>
                    Đã đồng bộ
                  </Typography>
                </Stack>
              )}
              <Box sx={{ flex: 1 }} />
              <Button
                size="small" color="inherit" variant="outlined"
                disabled={!dirty}
                onClick={() => setDirty(false)}
                sx={{ boxShadow: 'none', borderColor: 'divider' }}
              >
                Huỷ thay đổi
              </Button>
              <Button
                size="small" variant="contained"
                disabled={!dirty}
                startIcon={<Iconify icon="solar:diskette-linear" width={13} />}
                onClick={() => setDirty(false)}
                sx={{
                  boxShadow: 'none',
                  bgcolor: '#1E293B', color: 'common.white',
                  '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
                  '&.Mui-disabled': { bgcolor: 'grey.300' },
                }}
              >
                Lưu cấu hình
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  if (embedded) return body;

  return <DashboardContent disablePadding>{body}</DashboardContent>;
}
