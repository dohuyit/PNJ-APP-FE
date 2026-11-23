'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { landingTokens, sxSharpBtnContained, sxSharpBtnOutlined, sxSharpInput } from 'src/theme/landing';

// Stubs — mock removed; data rỗng cho tới khi view migrate sang useGetXxx hook.
const currentCustomerMock = null;

const cities = [{ id: 1, name: 'TP.HCM' }, { id: 2, name: 'Hà Nội' }, { id: 3, name: 'Đà Nẵng' }];
const districts = [{ id: 1, name: 'Quận Phú Nhuận' }, { id: 2, name: 'Quận 1' }, { id: 3, name: 'Quận 3' }];
const wards = [{ id: 1, name: 'Phường 3' }, { id: 2, name: 'Phường Bến Nghé' }];

function SectionHead({ no, title, note }) {
  return (
    <Stack direction="row" spacing={2} alignItems="baseline" sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          fontFamily: landingTokens.FONT_SERIF,
          fontSize: 24,
          fontWeight: 600,
          color: landingTokens.GOLD,
          lineHeight: 1,
          minWidth: 28,
        }}
      >
        {no}
      </Typography>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, color: landingTokens.INK, lineHeight: 1.3 }}>
          {title}
        </Typography>
        {note && (
          <Typography sx={{ fontSize: 12, color: landingTokens.INK_MUTED, mt: 0.25 }}>
            {note}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

const radioSx = {
  color: landingTokens.GOLD_DARK,
  '&.Mui-checked': { color: landingTokens.PRIMARY },
};

export function ProfileView({ params }) {
  const { id } = params;
  const customer = currentCustomerMock;
  const [avatar, setAvatar] = useState(customer.avatar);
  const [birthday, setBirthday] = useState(customer.birthday ? dayjs(customer.birthday) : null);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: landingTokens.GOLD_DARK,
              letterSpacing: '0.24em',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            THÔNG TIN TÀI KHOẢN
          </Typography>
          <Box sx={{ width: 24, height: 1, bgcolor: landingTokens.GOLD }} />
        </Stack>
        <Typography
          sx={{
            fontFamily: landingTokens.FONT_SERIF,
            fontSize: { xs: 28, md: 36 },
            fontWeight: 600,
            color: landingTokens.INK,
            lineHeight: 1.2,
          }}
        >
          Hồ sơ cá nhân
        </Typography>
        <Typography sx={{ color: landingTokens.INK_MUTED, mt: 1 }}>
          Quản lý thông tin liên hệ và địa chỉ giao hàng mặc định.
        </Typography>
      </Box>

      <form onSubmit={(e) => e.preventDefault()}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Left: Identity card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                border: `1px solid ${landingTokens.HAIRLINE}`,
                bgcolor: landingTokens.SURFACE,
                p: 4,
                textAlign: 'center',
                position: { md: 'sticky' },
                top: { md: 96 },
              }}
            >
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2.5 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -6,
                    border: `1px solid ${landingTokens.GOLD}`,
                    pointerEvents: 'none',
                  }}
                />
                <Avatar
                  src={avatar}
                  sx={{ width: 120, height: 120, border: `2px solid ${landingTokens.SURFACE}` }}
                />
                <Button
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    minWidth: 32,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: landingTokens.INK,
                    color: landingTokens.GOLD,
                    boxShadow: '0 2px 8px rgba(26,20,19,0.2)',
                    '&:hover': { bgcolor: landingTokens.PRIMARY, color: '#FFFFFF' },
                  }}
                  aria-label="Thay ảnh đại diện"
                >
                  <PhotoCameraOutlinedIcon fontSize="small" />
                  <input type="file" hidden onChange={onFileChange} accept="image/*" />
                </Button>
              </Box>

              <Typography
                sx={{
                  fontFamily: landingTokens.FONT_SERIF,
                  fontWeight: 600,
                  fontSize: 18,
                  color: landingTokens.INK,
                  mb: 1,
                }}
              >
                {customer.username}
              </Typography>
              <Chip
                icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 14 }} />}
                label="Hạng Vàng · 2022"
                size="small"
                sx={{
                  bgcolor: 'rgba(196,140,70,0.1)',
                  color: landingTokens.GOLD_DARK,
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  borderRadius: 0,
                  '& .MuiChip-icon': { color: landingTokens.GOLD_DARK },
                }}
              />

              <Divider sx={{ my: 2.5, borderColor: landingTokens.HAIRLINE }} />

              <Stack spacing={1.25} sx={{ textAlign: 'left' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <EmailOutlinedIcon sx={{ color: landingTokens.GOLD_DARK, fontSize: 18 }} />
                  <Typography sx={{ fontSize: 13, color: landingTokens.INK_MUTED, wordBreak: 'break-all' }}>
                    {customer.email}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PhoneOutlinedIcon sx={{ color: landingTokens.GOLD_DARK, fontSize: 18 }} />
                  <Typography sx={{ fontSize: 13, color: landingTokens.INK_MUTED }}>
                    {customer.phone}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Grid>

          {/* Right: Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                border: `1px solid ${landingTokens.HAIRLINE}`,
                bgcolor: landingTokens.SURFACE,
                p: { xs: 3, md: 4 },
              }}
            >
              <Stack spacing={5}>
                <Box>
                  <SectionHead
                    no="01"
                    title="Thông tin cá nhân"
                    note="Giúp PNJ gửi lời chúc phù hợp vào dịp đặc biệt."
                  />
                  <Grid container spacing={2.5}>
                    <Grid size={12}>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: landingTokens.INK_MUTED,
                          letterSpacing: '0.04em',
                          mb: 0.5,
                        }}
                      >
                        DANH XƯNG
                      </Typography>
                      <RadioGroup row defaultValue="1">
                        <FormControlLabel
                          value="1"
                          control={<Radio size="small" sx={radioSx} />}
                          label={<Typography sx={{ fontSize: 14 }}>Chị</Typography>}
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio size="small" sx={radioSx} />}
                          label={<Typography sx={{ fontSize: 14 }}>Anh</Typography>}
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Họ và tên" defaultValue={customer.username} sx={sxSharpInput} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <DatePicker
                        label="Ngày sinh"
                        value={birthday}
                        onChange={setBirthday}
                        format="DD/MM/YYYY"
                        maxDate={dayjs()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: sxSharpInput,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <SectionHead no="02" title="Liên hệ" />
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Email" type="email" defaultValue={customer.email} sx={sxSharpInput} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Số điện thoại" defaultValue={customer.phone} sx={sxSharpInput} />
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <SectionHead
                    no="03"
                    title="Địa chỉ giao hàng"
                    note="Áp dụng mặc định cho các đơn hàng online."
                  />
                  <Grid container spacing={2.5}>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Địa chỉ cụ thể (số nhà, tên đường)"
                        defaultValue={customer.address}
                        sx={sxSharpInput}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField select fullWidth label="Tỉnh / Thành" defaultValue="" sx={sxSharpInput}>
                        <MenuItem value="">-- Chọn --</MenuItem>
                        {cities.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField select fullWidth label="Quận / Huyện" defaultValue="" sx={sxSharpInput}>
                        <MenuItem value="">-- Chọn --</MenuItem>
                        {districts.map((d) => (
                          <MenuItem key={d.id} value={d.id}>
                            {d.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField select fullWidth label="Phường / Xã" defaultValue="" sx={sxSharpInput}>
                        <MenuItem value="">-- Chọn --</MenuItem>
                        {wards.map((w) => (
                          <MenuItem key={w.id} value={w.id}>
                            {w.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>

                <input type="hidden" value={id} readOnly />

                <Divider sx={{ borderColor: landingTokens.HAIRLINE }} />
                <Stack
                  direction={{ xs: 'column-reverse', sm: 'row' }}
                  spacing={1.5}
                  justifyContent="flex-end"
                >
                  <Button variant="outlined" sx={sxSharpBtnOutlined}>
                    Huỷ thay đổi
                  </Button>
                  <Button type="submit" variant="contained" sx={sxSharpBtnContained}>
                    Lưu thông tin
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
