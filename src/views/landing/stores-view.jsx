'use client';

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import DirectionsOutlinedIcon from '@mui/icons-material/DirectionsOutlined';

import { landingTokens, sxSharpBtnContained, sxSharpBtnOutlined, sxSharpInput } from 'src/theme/landing';
import { useGetStoreList } from 'src/actions/landing';

const DEFAULT_CITY = 'Tất cả';

const openingSummary = (hours) => {
  if (!Array.isArray(hours) || hours.length === 0) return '09:00 - 21:30';
  const h = hours[0];
  return `${h.open ?? '09:00'} - ${h.close ?? '21:30'}`;
};

export function StoresView() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [query, setQuery] = useState('');

  const { stores: apiStores, provinces } = useGetStoreList();

  const cityFilters = useMemo(
    () => [DEFAULT_CITY, ...(provinces || []).map((p) => p.code).filter(Boolean)],
    [provinces]
  );

  const list = useMemo(() => {
    const normalized = (apiStores || []).map((s) => ({
      id: s.id,
      name: s.name,
      city: s.province_code,
      address: s.address,
      hours: openingSummary(s.opening_hours),
      phone: s.phone ?? '19005457',
      map_url: s.map_url,
    }));
    return normalized.filter(
      (s) =>
        (city === DEFAULT_CITY || s.city === city) &&
        (query === '' || (s.name + (s.address ?? '')).toLowerCase().includes(query.toLowerCase()))
    );
  }, [apiStores, city, query]);

  return (
    <>
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, py: { xs: 6, md: 10 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            HỆ THỐNG CỬA HÀNG
          </Typography>
          <Typography sx={{ fontFamily: landingTokens.FONT_SERIF, fontSize: { xs: 36, md: 56 }, fontWeight: 500, mt: 1, mb: 1 }}>
            Trên 400 cửa hàng toàn quốc
          </Typography>
          <Typography sx={{ color: landingTokens.INK_MUTED, fontSize: 17, maxWidth: 640 }}>
            Tìm cửa hàng gần bạn nhất để trải nghiệm trực tiếp từng sản phẩm, nhận tư vấn chuyên sâu
            và dịch vụ hậu mãi trọn đời.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 5, md: 7 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
          <TextField
            select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            size="small"
            sx={{ ...sxSharpInput, minWidth: 200 }}
          >
            {cityFilters.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField
            placeholder="Tìm theo tên hoặc địa chỉ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="small"
            fullWidth
            sx={sxSharpInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: landingTokens.GOLD_DARK }} />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" size="large" sx={sxSharpBtnContained}>
            Tìm cửa hàng
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED, mb: 3 }}>
          {list.length} cửa hàng
        </Typography>

        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {list.map((s) => (
            <Grid key={s.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Box
                sx={{
                  bgcolor: landingTokens.SURFACE,
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 200ms ease, transform 200ms ease',
                  '&:hover': { borderColor: landingTokens.GOLD, transform: 'translateY(-2px)' },
                }}
              >
                <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.2em' }}>
                  {s.city}
                </Typography>
                <Typography variant="h6" sx={{ fontFamily: landingTokens.FONT_SERIF, fontWeight: 500, mt: 0.5, mb: 2 }}>
                  {s.name}
                </Typography>
                <Stack spacing={1.25} sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <PlaceOutlinedIcon fontSize="small" sx={{ color: landingTokens.GOLD_DARK, mt: 0.25 }} />
                    <Typography variant="body2">{s.address}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeOutlinedIcon fontSize="small" sx={{ color: landingTokens.GOLD_DARK }} />
                    <Typography variant="body2">{s.hours}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneOutlinedIcon fontSize="small" sx={{ color: landingTokens.GOLD_DARK }} />
                    <Typography variant="body2">{s.phone}</Typography>
                  </Stack>
                </Stack>
                <Button
                  component="a"
                  href={s.map_url || '#'}
                  target="_blank"
                  rel="noopener"
                  startIcon={<DirectionsOutlinedIcon />}
                  variant="outlined"
                  size="small"
                  sx={{ ...sxSharpBtnOutlined, mt: 3, alignSelf: 'flex-start' }}
                >
                  Chỉ đường
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
