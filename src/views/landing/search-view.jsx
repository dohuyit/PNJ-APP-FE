'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';

import { landingTokens } from 'src/theme/landing';
import { useSearchProducts } from 'src/actions/landing';

import ProductCard from 'src/sections/landing/components/ProductCard';

// API product → ProductCard-expected shape.
const toCard = (p) => ({
  id: p.slug ?? p.id,
  product_name: p.name,
  sale_price: p.price_min,
  original_price: p.price_max,
  rating: p.rating?.avg ?? 5,
  review_count: p.rating?.count ?? 0,
  sold: p.stats?.sold_count ?? 0,
});

function SearchContent() {
  const params = useSearchParams();
  const query = params.get('input-search') ?? params.get('q') ?? '';
  const [sort, setSort] = useState('newest');

  const { products, meta, quickFilters } = useSearchProducts({ query, sort, limit: 24 });

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 5, md: 8 } }}>
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
          KẾT QUẢ TÌM KIẾM
        </Typography>
        <Typography variant="h3" sx={{ mt: 1, fontSize: { xs: 28, md: 40 } }}>
          {query ? <>Tìm thấy cho &ldquo;<Box component="span" sx={{ color: landingTokens.PRIMARY }}>{query}</Box>&rdquo;</> : 'Khám phá tất cả sản phẩm'}
        </Typography>
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ md: 'center' }}
        sx={{ mb: 4, pb: 3, borderBottom: `1px solid ${landingTokens.HAIRLINE}` }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
          {(quickFilters || []).map((f) => (
            <Chip key={f.label ?? f} label={f.label ?? f} variant="outlined" clickable />
          ))}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="body2" color="text.secondary">{meta?.total ?? products.length} sản phẩm</Typography>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} size="small" sx={{ minWidth: 180 }}>
            <MenuItem value="newest">Mới nhất</MenuItem>
            <MenuItem value="price_asc">Giá thấp đến cao</MenuItem>
            <MenuItem value="price_desc">Giá cao đến thấp</MenuItem>
            <MenuItem value="bestseller">Bán chạy nhất</MenuItem>
          </Select>
        </Stack>
      </Stack>

      {products.length > 0 ? (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {products.map((p) => (
            <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <ProductCard product={toCard(p)} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <SearchOffOutlinedIcon sx={{ fontSize: 64, color: landingTokens.GOLD_DARK, mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1 }}>Không tìm thấy sản phẩm nào</Typography>
          <Typography color="text.secondary">Thử với từ khoá khác hoặc duyệt theo danh mục.</Typography>
        </Box>
      )}
    </Container>
  );
}

export function SearchView() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
