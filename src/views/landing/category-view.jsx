'use client';

import Link from 'next/link';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import TuneIcon from '@mui/icons-material/Tune';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fCurrency } from 'src/utils/format-number';

import { landingTokens } from 'src/theme/landing';
import { useGetCategoryProductList } from 'src/actions/landing';

import ProductCard from 'src/sections/landing/components/ProductCard';

const CATEGORY_LABEL = {
  'product-type': 'Chủng loại',
  'jewelry-line': 'Dòng hàng',
  collection: 'Bộ sưu tập',
  brand: 'Thương hiệu',
};

const toCard = (p) => ({
  id: p.slug ?? p.id,
  product_name: p.name,
  sale_price: p.price_min,
  original_price: p.price_max,
  rating: p.rating?.avg ?? 5,
  review_count: p.rating?.count ?? 0,
  sold: p.stats?.sold_count ?? 0,
});

// shortcut: filter UI chỉ render từ filters.price_ranges + static chủng loại/chất liệu/giới tính; upgrade khi BE trả hết nhóm filter.
const staticGroups = [
  { title: 'Chủng loại', items: ['Nhẫn', 'Dây chuyền', 'Bông tai', 'Lắc tay', 'Vòng tay', 'Mặt dây', 'Charm'] },
  { title: 'Chất liệu', items: ['Vàng 24K', 'Vàng 18K', 'Vàng trắng 14K', 'Bạc', 'Kim cương', 'Đá quý'] },
  { title: 'Giới tính', items: ['Nữ', 'Nam', 'Trẻ em', 'Unisex'] },
];

function Filters({ onClose, priceRanges }) {
  const priceGroup = priceRanges?.length
    ? { title: 'Khoảng giá', items: priceRanges.map((r) => r.label ?? `${fCurrency(r.min)} - ${fCurrency(r.max)}`) }
    : { title: 'Khoảng giá', items: ['Dưới 2 triệu', '2 - 5 triệu', '5 - 10 triệu', '10 - 20 triệu', 'Trên 20 triệu'] };
  const groups = [...staticGroups, priceGroup];

  return (
    <Box sx={{ p: { xs: 3, md: 0 } }}>
      {onClose && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6">Bộ lọc</Typography>
          <Button onClick={onClose} size="small">Đóng</Button>
        </Stack>
      )}
      {groups.map((g, gi) => (
        <Box key={g.title} sx={{ mb: gi === groups.length - 1 ? 0 : 4 }}>
          <Typography
            variant="overline"
            sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.2em', display: 'block', mb: 1.5 }}
          >
            {g.title}
          </Typography>
          <FormGroup>
            {g.items.map((item) => (
              <FormControlLabel
                key={item}
                control={<Checkbox size="small" sx={{ color: landingTokens.GOLD_DARK, '&.Mui-checked': { color: landingTokens.PRIMARY } }} />}
                label={<Typography variant="body2">{item}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>
      ))}
    </Box>
  );
}

export function CategoryView({ params }) {
  const { type, id } = params;
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const { category, products, meta, filters } = useGetCategoryProductList(type, id, { sort, page, limit: 24 });

  const label = CATEGORY_LABEL[type] ?? null;
  const name = category?.name ?? 'Danh mục';
  const bannerUrl = category?.banner_url ?? (category?.banner_file_ids?.length ? null : null);
  const totalPages = Math.max(1, Math.ceil((meta?.total ?? products.length) / (meta?.perPage || 24)));

  return (
    <>
      <Container maxWidth={false} sx={{ maxWidth: 1155, pt: { xs: 3, md: 4 } }}>
        <Breadcrumbs separator="/" sx={{ fontSize: 13, color: landingTokens.INK_MUTED, mb: 2 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang chủ</Link>
          {label && <Typography variant="caption" sx={{ fontSize: 13 }}>{label}</Typography>}
          <Typography variant="caption" sx={{ color: landingTokens.INK, fontSize: 13 }}>{name}</Typography>
        </Breadcrumbs>
      </Container>

      {/* Hero */}
      {bannerUrl ? (
        <Box sx={{ position: 'relative', height: { xs: 240, md: 360 }, overflow: 'hidden', mb: { xs: 5, md: 7 } }}>
          <Box component="img" src={bannerUrl} alt={name} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(26,20,19,0.55)' }} />
          <Container maxWidth={false} sx={{ maxWidth: 1155, position: 'relative', height: '100%', display: 'grid', placeItems: 'center' }}>
            <Stack alignItems="center" sx={{ color: '#FBF7F2', textAlign: 'center' }}>
              <Typography variant="overline" sx={{ color: landingTokens.GOLD, letterSpacing: '0.22em' }}>
                {label}
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 64 }, color: '#FBF7F2' }}>
                {name}
              </Typography>
            </Stack>
          </Container>
        </Box>
      ) : (
        <Container maxWidth={false} sx={{ maxWidth: 1155, mb: { xs: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}>
            {label}
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 48 }, mt: 1 }}>
            {name}
          </Typography>
        </Container>
      )}

      <Container maxWidth={false} sx={{ maxWidth: 1155, pb: { xs: 8, md: 12 } }}>
        <Grid container spacing={{ xs: 2, md: 5 }}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Filters priceRanges={filters?.price_ranges} />
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            {/* Toolbar */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={2}
              sx={{ mb: 4, pb: 3, borderBottom: `1px solid ${landingTokens.HAIRLINE}` }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  onClick={() => setFilterOpen(true)}
                  startIcon={<TuneIcon />}
                  variant="outlined"
                  size="small"
                  sx={{ display: { md: 'none' } }}
                >
                  Bộ lọc
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {meta?.total ?? products.length} sản phẩm
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="caption" color="text.secondary">Sắp xếp</Typography>
                <Select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  size="small"
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="newest">Mới nhất</MenuItem>
                  <MenuItem value="price_asc">Giá thấp đến cao</MenuItem>
                  <MenuItem value="price_desc">Giá cao đến thấp</MenuItem>
                  <MenuItem value="bestseller">Bán chạy nhất</MenuItem>
                </Select>
              </Stack>
            </Stack>

            {/* Grid */}
            {products.length > 0 ? (
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {products.map((p) => (
                  <Grid key={p.id} size={{ xs: 6, md: 4 }}>
                    <ProductCard product={toCard(p)} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography color="text.secondary">Hiện chưa có sản phẩm nào.</Typography>
              </Box>
            )}

            <Stack alignItems="center" sx={{ mt: { xs: 6, md: 8 } }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                shape="rounded"
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Drawer anchor="left" open={filterOpen} onClose={() => setFilterOpen(false)} PaperProps={{ sx: { width: 320 } }}>
        <Filters onClose={() => setFilterOpen(false)} priceRanges={filters?.price_ranges} />
      </Drawer>
    </>
  );
}
