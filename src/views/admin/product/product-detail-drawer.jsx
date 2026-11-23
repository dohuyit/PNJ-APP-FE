// src/views/admin/product/product-detail-drawer.jsx
// Xem chi tiết sản phẩm · tabs: Tổng quan · Biến thể · Media · Mô tả & SEO · Thống kê

'use client';

import {
  Avatar, Box, Button, Chip, Grid, LinearProgress, Rating, Stack, Typography,
} from '@mui/material';

import { fmtNumber, fmtVND, fmtRelative } from 'src/utils/format';

import { DetailDrawer, DetailSection, DetailRow } from 'src/views/admin/_shared/detail-drawer';

import { Iconify } from 'src/components/iconify';

const STATUS_META = {
  active:       { label: 'Đang bán',  color: '#059669', soft: '#ECFDF5' },
  draft:        { label: 'Nháp',      color: '#D97706', soft: '#FFFBEB' },
  inactive:     { label: 'Tạm ẩn',    color: '#64748B', soft: '#F8FAFC' },
  out_of_stock: { label: 'Hết hàng',  color: '#DC2626', soft: '#FEF2F2' },
};

const TYPE_META = {
  jewelry: { label: 'Trang sức', icon: 'solar:crown-linear' },
  watch:   { label: 'Đồng hồ',   icon: 'solar:clock-circle-linear' },
  diamond: { label: 'Kim cương', icon: 'solar:star-shine-linear' },
  gift:    { label: 'Quà tặng',  icon: 'solar:gift-linear' },
  egift:   { label: 'E-gift',    icon: 'solar:letter-linear' },
};

// ---------------------- TAB: Tổng quan ----------------------
function OverviewTab({ product }) {
  const status = STATUS_META[product.status] ?? STATUS_META.active;
  const type = TYPE_META[product.type] ?? { label: product.type, icon: 'solar:tag-linear' };
  const totalStock = (product.variants ?? []).reduce((s, v) => s + (v.total_stock ?? 0), 0);
  const stockPct = totalStock > 0 ? Math.min(100, (totalStock / 50) * 100) : 0;
  const soldPct = ((product.stats?.sold_count ?? 0) / Math.max(product.stats?.view_count ?? 1, 1)) * 100;

  return (
    <Box>
      {/* Hero card với ảnh + tên */}
      <Box sx={{ px: 2.5, py: 2, bgcolor: 'grey.50' }}>
        <Stack direction="row" spacing={1.5}>
          <Avatar
            src={product.media?.[0]}
            variant="rounded"
            sx={{ width: 80, height: 80, bgcolor: 'grey.100', border: 1, borderColor: 'divider' }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: 'text.primary' }}>
              {product.name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', fontFamily: 'monospace', mt: 0.25 }}>
              {product.display_code}
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 0.75 }} flexWrap="wrap" rowGap={0.5}>
              <Chip
                icon={<Iconify icon={type.icon} width={11} />}
                label={type.label}
                size="small"
                sx={{
                  height: 20, fontSize: 10.5, fontWeight: 500,
                  bgcolor: 'background.paper', color: 'text.secondary',
                  border: 1, borderColor: 'divider',
                  '& .MuiChip-icon': { color: 'inherit', ml: 0.5 },
                }}
              />
              <Chip
                label={status.label}
                size="small"
                sx={{
                  height: 20, fontSize: 10.5, fontWeight: 500,
                  bgcolor: status.soft, color: status.color,
                  border: 1, borderColor: status.color + '33',
                }}
              />
              {product.flags?.is_best_seller && (
                <Chip
                  icon={<Iconify icon="solar:cup-star-linear" width={11} />}
                  label="Bán chạy"
                  size="small"
                  sx={{
                    height: 20, fontSize: 10.5, fontWeight: 500,
                    bgcolor: '#FEF3C7', color: '#B45309',
                    border: 1, borderColor: '#F59E0B33',
                    '& .MuiChip-icon': { color: 'inherit', ml: 0.5 },
                  }}
                />
              )}
              {product.flags?.is_new && (
                <Chip
                  label="Mới"
                  size="small"
                  sx={{
                    height: 20, fontSize: 10.5, fontWeight: 500,
                    bgcolor: '#DBEAFE', color: '#1D4ED8',
                    border: 1, borderColor: '#3B82F633',
                  }}
                />
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Mini KPI cards */}
      <Box sx={{ px: 2.5, py: 2 }}>
        <Grid container spacing={1.25}>
          {[
            { label: 'Giá bán', value: fmtVND(product.price_min), sub: product.price_max !== product.price_min ? `→ ${fmtVND(product.price_max)}` : null, color: '#059669', icon: 'solar:dollar-linear' },
            { label: 'Tồn kho', value: fmtNumber(totalStock), sub: `${product.variants?.length ?? 0} biến thể`, color: totalStock === 0 ? '#DC2626' : '#2563EB', icon: 'solar:box-linear' },
            { label: 'Đã bán', value: fmtNumber(product.stats?.sold_count ?? 0), sub: `${fmtNumber(product.stats?.view_count ?? 0)} lượt xem`, color: '#D97706', icon: 'solar:bag-smile-linear' },
            { label: 'Rating', value: `${(product.rating?.avg ?? 0).toFixed(1)} ★`, sub: `${fmtNumber(product.rating?.count ?? 0)} đánh giá`, color: '#7C3AED', icon: 'solar:star-linear' },
          ].map((s) => (
            <Grid key={s.label} size={6}>
              <Box sx={{
                bgcolor: 'grey.50', border: 1, borderColor: 'divider',
                borderRadius: 1, px: 1.5, py: 1.25,
              }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  <Typography sx={{ fontSize: 10, fontWeight: 600, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase' }}>
                    {s.label}
                  </Typography>
                  <Iconify icon={s.icon} width={13} sx={{ color: s.color }} />
                </Stack>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary', mt: 0.25, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
                  {s.value}
                </Typography>
                {s.sub && (
                  <Typography sx={{ fontSize: 10.5, color: 'text.disabled', mt: 0.125 }}>
                    {s.sub}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Thông tin cơ bản */}
      <DetailSection title="Thông tin cơ bản">
        <DetailRow icon="solar:folder-linear" label="Danh mục" value={product.category?.name} />
        <DetailRow icon="solar:shop-linear" label="Thương hiệu" value={product.brand?.name} />
        <DetailRow icon="solar:code-linear" label="Slug" value={product.slug} mono />
        <DetailRow icon="solar:barcode-linear" label="Display code" value={product.display_code} mono />
      </DetailSection>

      {/* Tỷ lệ bán */}
      <DetailSection title="Hiệu quả chuyển đổi">
        <Stack spacing={1.5}>
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>Tỷ lệ view → mua</Typography>
              <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>{soldPct.toFixed(1)}%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min(soldPct, 100)}
              sx={{
                height: 4, borderRadius: 2, bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': { bgcolor: '#2563EB', opacity: 0.8, borderRadius: 2 },
              }}
            />
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>Độ đầy tồn kho (tối đa 50)</Typography>
              <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>{totalStock}/50</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={stockPct}
              sx={{
                height: 4, borderRadius: 2, bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  bgcolor: totalStock === 0 ? '#DC2626' : totalStock < 10 ? '#D97706' : '#059669',
                  opacity: 0.8, borderRadius: 2,
                },
              }}
            />
          </Box>
        </Stack>
      </DetailSection>

      <DetailSection title="Thời gian" sx={{ borderBottom: 0 }}>
        <DetailRow icon="solar:calendar-add-linear" label="Tạo lúc" value={fmtRelative(product.created_at)} />
        <DetailRow icon="solar:refresh-linear" label="Cập nhật" value={fmtRelative(product.updated_at)} />
      </DetailSection>
    </Box>
  );
}

// ---------------------- TAB: Biến thể ----------------------
function VariantsTab({ product }) {
  const variants = product.variants ?? [];

  if (variants.length === 0) {
    return (
      <Stack alignItems="center" spacing={1} sx={{ py: 6, color: 'text.disabled' }}>
        <Iconify icon="solar:layers-minimalistic-linear" width={32} />
        <Typography sx={{ fontSize: 12 }}>Sản phẩm không có biến thể</Typography>
      </Stack>
    );
  }

  return (
    <Box>
      <DetailSection title={`${variants.length} biến thể`}>
        <Stack spacing={0.75}>
          {variants.map((v) => {
            const outOfStock = (v.total_stock ?? 0) === 0;
            const lowStock = (v.total_stock ?? 0) > 0 && (v.total_stock ?? 0) <= 3;
            return (
              <Box
                key={v.sku ?? v.id}
                sx={{
                  border: 1, borderColor: 'divider', borderRadius: 1,
                  px: 1.5, py: 1.25,
                  bgcolor: v.is_default ? 'primary.lighter' : 'background.paper',
                  borderLeft: 3,
                  borderLeftColor: v.is_default ? 'primary.main' : 'transparent',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace', color: 'text.primary' }}>
                    {v.sku}
                  </Typography>
                  {v.is_default && (
                    <Chip
                      label="Mặc định"
                      size="small"
                      sx={{ height: 16, fontSize: 9.5, bgcolor: 'primary.main', color: 'common.white' }}
                    />
                  )}
                  <Box sx={{ flex: 1 }} />
                  <Chip
                    label={outOfStock ? 'Hết' : lowStock ? 'Sắp hết' : `${v.total_stock} còn`}
                    size="small"
                    sx={{
                      height: 18, fontSize: 10, fontWeight: 600,
                      bgcolor: outOfStock ? '#FEF2F2' : lowStock ? '#FFFBEB' : '#ECFDF5',
                      color:   outOfStock ? '#DC2626' : lowStock ? '#D97706' : '#059669',
                    }}
                  />
                </Stack>
                <Grid container spacing={1}>
                  <Grid size={4}>
                    <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.4 }}>
                      Size
                    </Typography>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>{v.size ?? '—'}</Typography>
                  </Grid>
                  {v.weight != null && (
                    <Grid size={4}>
                      <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.4 }}>
                        Trọng lượng
                      </Typography>
                      <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>{v.weight}g</Typography>
                    </Grid>
                  )}
                  <Grid size={4}>
                    <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.4 }}>
                      Giá
                    </Typography>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'success.darker', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtVND(v.price)}
                    </Typography>
                  </Grid>
                  {v.cost_price != null && (
                    <Grid size={6}>
                      <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.4 }}>
                        Giá vốn
                      </Typography>
                      <Typography sx={{ fontSize: 11.5, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                        {fmtVND(v.cost_price)}
                      </Typography>
                    </Grid>
                  )}
                  {v.reserved != null && v.reserved > 0 && (
                    <Grid size={6}>
                      <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.4 }}>
                        Đã giữ
                      </Typography>
                      <Typography sx={{ fontSize: 11.5, color: 'warning.dark', fontVariantNumeric: 'tabular-nums' }}>
                        {v.reserved}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            );
          })}
        </Stack>
      </DetailSection>
    </Box>
  );
}

// ---------------------- TAB: Media ----------------------
function MediaTab({ product }) {
  const media = product.media ?? [];

  if (media.length === 0) {
    return (
      <Stack alignItems="center" spacing={1} sx={{ py: 6, color: 'text.disabled' }}>
        <Iconify icon="solar:gallery-linear" width={32} />
        <Typography sx={{ fontSize: 12 }}>Chưa có media</Typography>
      </Stack>
    );
  }

  return (
    <DetailSection title={`${media.length} ảnh / video`}>
      <Grid container spacing={1}>
        {media.map((src, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4 }}>
            <Box
              sx={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 1,
                border: 1, borderColor: 'divider',
                overflow: 'hidden', bgcolor: 'grey.50',
              }}
            >
              <Box
                component="img"
                src={src}
                alt={`media-${i}`}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {i === 0 && (
                <Chip
                  label="Chính"
                  size="small"
                  sx={{
                    position: 'absolute', top: 6, left: 6,
                    height: 18, fontSize: 10, fontWeight: 600,
                    bgcolor: 'rgba(30,41,59,0.85)', color: 'common.white',
                  }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </DetailSection>
  );
}

// ---------------------- TAB: Mô tả & SEO ----------------------
function DescriptionTab({ product }) {
  return (
    <Box>
      {product.short_description && (
        <DetailSection title="Mô tả ngắn">
          <Typography sx={{ fontSize: 12.5, color: 'text.primary', lineHeight: 1.6 }}>
            {product.short_description}
          </Typography>
        </DetailSection>
      )}

      {product.description_html && (
        <DetailSection title="Mô tả chi tiết">
          <Box
            sx={{
              '& p': { fontSize: 12.5, color: 'text.primary', lineHeight: 1.6, mb: 1 },
              '& ul,& ol': { pl: 2.5, mb: 1 },
              '& li': { fontSize: 12.5, color: 'text.primary', lineHeight: 1.6 },
              '& h1,& h2,& h3': { fontSize: 13.5, fontWeight: 600, color: 'text.primary', mt: 1.5, mb: 0.5 },
            }}
            dangerouslySetInnerHTML={{ __html: product.description_html }}
          />
        </DetailSection>
      )}

      {product.price_note && (
        <DetailSection title="Ghi chú giá">
          <Typography sx={{ fontSize: 12, color: 'text.secondary', fontStyle: 'italic', lineHeight: 1.5 }}>
            {product.price_note}
          </Typography>
        </DetailSection>
      )}

      {product.seo && (
        <DetailSection title="SEO" sx={{ borderBottom: 0 }}>
          <Stack spacing={1}>
            {product.seo.title && (
              <Box>
                <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase', mb: 0.25 }}>
                  Title
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'text.primary' }}>
                  {product.seo.title}
                </Typography>
              </Box>
            )}
            {product.seo.description && (
              <Box>
                <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase', mb: 0.25 }}>
                  Description
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.5 }}>
                  {product.seo.description}
                </Typography>
              </Box>
            )}
            {product.seo.schema_type && (
              <DetailRow icon="solar:code-square-linear" label="Schema" value={product.seo.schema_type} />
            )}
            {product.seo.noindex && (
              <Chip
                label="noindex"
                size="small"
                sx={{ height: 18, fontSize: 10, bgcolor: 'error.lighter', color: 'error.darker', alignSelf: 'flex-start' }}
              />
            )}
          </Stack>
        </DetailSection>
      )}
    </Box>
  );
}

// ---------------------- TAB: Thống kê ----------------------
function StatsTab({ product }) {
  const stats = product.stats ?? {};
  const avgPrice = ((product.price_min ?? 0) + (product.price_max ?? product.price_min ?? 0)) / 2;
  const revenue = (stats.sold_count ?? 0) * avgPrice;
  const dist = product.rating?.dist ?? {};
  const totalReviews = Object.values(dist).reduce((s, n) => s + n, 0);

  return (
    <Box>
      <DetailSection title="Hiệu quả kinh doanh">
        <DetailRow icon="solar:dollar-linear" label="Doanh thu ước tính" value={fmtVND(revenue)} mono />
        <DetailRow icon="solar:bag-smile-linear" label="Số lượng bán ra" value={fmtNumber(stats.sold_count ?? 0)} mono />
        <DetailRow icon="solar:eye-linear" label="Lượt xem" value={fmtNumber(stats.view_count ?? 0)} mono />
        <DetailRow icon="solar:heart-linear" label="Wishlist" value={fmtNumber(stats.wishlist_count ?? 0)} mono />
      </DetailSection>

      <DetailSection title="Đánh giá" sx={{ borderBottom: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: 32, fontWeight: 700, lineHeight: 1, color: 'text.primary' }}>
              {(product.rating?.avg ?? 0).toFixed(1)}
            </Typography>
            <Rating value={product.rating?.avg ?? 0} readOnly precision={0.1} size="small" sx={{ fontSize: 13 }} />
            <Typography sx={{ fontSize: 10.5, color: 'text.disabled', mt: 0.25 }}>
              {fmtNumber(product.rating?.count ?? 0)} đánh giá
            </Typography>
          </Box>
          <Stack sx={{ flex: 1 }} spacing={0.5}>
            {[5, 4, 3, 2, 1].map((n) => {
              const count = dist[n] ?? 0;
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <Stack key={n} direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontSize: 10.5, color: 'text.secondary', minWidth: 14, textAlign: 'right' }}>
                    {n}
                  </Typography>
                  <Iconify icon="solar:star-linear" width={10} sx={{ color: '#D97706' }} />
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      flex: 1, height: 4, borderRadius: 2, bgcolor: 'grey.100',
                      '& .MuiLinearProgress-bar': { bgcolor: '#D97706', opacity: 0.7, borderRadius: 2 },
                    }}
                  />
                  <Typography sx={{ fontSize: 10.5, color: 'text.disabled', minWidth: 28, textAlign: 'right' }}>
                    {count}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </DetailSection>
    </Box>
  );
}

// ---------------------- Main ----------------------
export function ProductDetailDrawer({ open, onClose, product, onEdit }) {
  if (!product) return null;

  const type = TYPE_META[product.type] ?? { label: product.type, icon: 'solar:tag-linear' };
  const status = STATUS_META[product.status] ?? STATUS_META.active;

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      icon={type.icon}
      accent="#2563EB"
      title={product.name}
      subtitle={`${product.display_code} · ${product.category?.name ?? '—'}`}
      headerActions={
        <Chip
          label={status.label}
          size="small"
          sx={{
            height: 22, fontSize: 11, fontWeight: 600,
            bgcolor: status.soft, color: status.color,
            border: 1, borderColor: status.color + '33',
          }}
        />
      }
      tabs={[
        { value: 'overview',    label: 'Tổng quan',    icon: 'solar:info-circle-linear',  content: <OverviewTab product={product} /> },
        { value: 'variants',    label: 'Biến thể',     icon: 'solar:layers-linear',        count: product.variants?.length ?? 0, content: <VariantsTab product={product} /> },
        { value: 'media',       label: 'Media',        icon: 'solar:gallery-linear',       count: product.media?.length ?? 0,    content: <MediaTab product={product} /> },
        { value: 'description', label: 'Mô tả & SEO', icon: 'solar:document-text-linear', content: <DescriptionTab product={product} /> },
        { value: 'stats',       label: 'Thống kê',     icon: 'solar:chart-2-linear',       content: <StatsTab product={product} /> },
      ]}
      footer={
        <>
          <Button
            onClick={onClose}
            color="inherit" variant="outlined" size="small"
            sx={{ boxShadow: 'none', borderColor: 'divider' }}
          >
            Đóng
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="outlined" size="small"
            startIcon={<Iconify icon="solar:eye-linear" width={13} />}
            onClick={() => product.slug && window.open(`/products/${product.slug}`, '_blank', 'noopener,noreferrer')}
            sx={{ boxShadow: 'none', borderColor: 'divider' }}
          >
            Xem trên site
          </Button>
          <Button
            variant="contained" size="small"
            startIcon={<Iconify icon="solar:pen-linear" width={13} />}
            onClick={() => { onEdit?.(product); onClose(); }}
            sx={{
              boxShadow: 'none',
              bgcolor: '#1E293B', color: 'common.white',
              '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
            }}
          >
            Sửa sản phẩm
          </Button>
        </>
      }
    />
  );
}
