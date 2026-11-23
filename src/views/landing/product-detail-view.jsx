'use client';

import Link from 'next/link';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import Accordion from '@mui/material/Accordion';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import { fCurrency } from 'src/utils/format-number';

import { useGetProductDetail } from 'src/actions/landing';
import { landingTokens, sxSharpBtnCta, sxSharpBtnOutlined } from 'src/theme/landing';

import Wireframe from 'src/sections/landing/components/Wireframe';
import ProductCard from 'src/sections/landing/components/ProductCard';
import SectionTitle from 'src/sections/landing/components/SectionTitle';
import ScrollSnapRail from 'src/sections/landing/components/ScrollSnapRail';

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

const faqItems = [
  {
    q: 'Mua Online có ưu đãi gì đặc biệt?',
    a: 'Nhiều ưu đãi dành riêng cho kênh online: đặt giữ hàng, giao nhanh 3h tại khu vực trung tâm, trả góp 0% lãi suất với đơn từ 3 triệu, và chính sách đổi trả 48 giờ.',
  },
  {
    q: 'PNJ có thu mua lại trang sức không?',
    a: 'Có dịch vụ thu đổi trang sức tại toàn bộ hệ thống cửa hàng trên toàn quốc theo giá vàng tại thời điểm thu đổi.',
  },
  {
    q: 'Bảo hành sản phẩm trong bao lâu?',
    a: 'Trang sức vàng được bảo hành 6 tháng về lỗi kỹ thuật và nước xi. Trang sức bạc bảo hành 3 tháng. Dịch vụ siêu âm, đánh bóng miễn phí trọn đời.',
  },
  {
    q: 'Có hỗ trợ đổi size sau khi mua online?',
    a: 'Thu đổi trang sức vàng trong 48 giờ, đổi size trang sức bạc trong 72 giờ tại mọi cửa hàng.',
  },
];

export function ProductDetailView({ params }) {
  const { id } = params;
  const { product, related, breadcrumb, loading } = useGetProductDetail(id);

  const [activeMedia, setActiveMedia] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(0);

  if (!product) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: 10, textAlign: 'center' }}>
        <Typography color="text.secondary">{loading ? 'Đang tải…' : 'Không tìm thấy sản phẩm.'}</Typography>
      </Container>
    );
  }

  const media = product.media ?? [];
  const mainImage = media[activeMedia]?.url ?? product.primary_image?.url ?? null;
  const hasSale = product.price_max && product.price_min !== product.price_max;
  const variants = product.variants ?? [];

  return (
    <>
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 3, md: 4 } }}>
        <Breadcrumbs separator="/" sx={{ fontSize: 13, color: landingTokens.INK_MUTED }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang chủ</Link>
          {(breadcrumb || []).map((b) => (
            <Link key={b.id ?? b.name} href={b.href ?? '#'} style={{ color: 'inherit', textDecoration: 'none' }}>
              {b.name}
            </Link>
          ))}
          <Typography variant="caption" sx={{ color: landingTokens.INK, fontSize: 13 }}>
            {product.name}
          </Typography>
        </Breadcrumbs>
      </Container>

      <Container maxWidth={false} sx={{ maxWidth: 1155, pb: { xs: 6, md: 10 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }}>
          {/* GALLERY */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>
              <Box sx={{ aspectRatio: '1 / 1', overflow: 'hidden' }}>
                {mainImage ? (
                  <Box component="img" src={mainImage} alt={product.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Wireframe label={`Ảnh SP ${product.id} · 800×800`} />
                )}
              </Box>
              {media.length > 1 && (
                <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
                  {media.slice(0, 4).map((m, i) => (
                    <Grid key={m.id ?? i} size={3}>
                      <Box
                        onClick={() => setActiveMedia(i)}
                        sx={{
                          aspectRatio: '1 / 1',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          border: i === activeMedia ? `2px solid ${landingTokens.PRIMARY}` : `1px solid ${landingTokens.HAIRLINE}`,
                        }}
                      >
                        {m.url ? (
                          <Box component="img" src={m.url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Wireframe label={`Thumb ${i + 1}`} iconSize="small" />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Grid>

          {/* INFO */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              variant="overline"
              sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em', display: 'block', mb: 1 }}
            >
              MÃ {product.display_code ?? product.code ?? product.id}
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontSize: { xs: 28, md: 36 }, mb: 2, lineHeight: 1.2 }}>
              {product.name}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <Rating value={product.rating?.avg ?? 5} readOnly size="small" />
              <Typography variant="caption" color="text.secondary">
                ({product.rating?.count ?? 0} đánh giá) · {product.stats?.sold_count ?? 0} đã bán
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="baseline" sx={{ mb: 1 }}>
              <Typography variant="h4" sx={{ color: landingTokens.CTA, fontWeight: 700 }}>
                {fCurrency(product.price_min)}
              </Typography>
              {hasSale && (
                <Typography variant="body1" sx={{ color: landingTokens.INK_MUTED, textDecoration: 'line-through' }}>
                  {fCurrency(product.price_max)}
                </Typography>
              )}
            </Stack>
            {(product.price_note || product.card_note) && (
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {product.price_note ?? product.card_note}
              </Typography>
            )}

            <Divider sx={{ my: 4 }} />

            {product.short_description && (
              <Typography variant="body2" sx={{ mb: 3, color: landingTokens.INK_MUTED, lineHeight: 1.75 }}>
                {product.short_description}
              </Typography>
            )}

            {/* VARIANTS */}
            {variants.length > 0 && (
              <>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{product.variant_axis ?? 'Lựa chọn'}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mb: 4 }}>
                  {variants.map((v) => {
                    const label = v.label ?? v.name ?? v.code ?? v.id;
                    const active = selectedVariant === (v.id ?? label);
                    return (
                      <Button
                        key={v.id ?? label}
                        onClick={() => setSelectedVariant(v.id ?? label)}
                        variant={active ? 'contained' : 'outlined'}
                        color={active ? 'primary' : 'inherit'}
                        sx={{ minWidth: 48, px: 2 }}
                      >
                        {label}
                      </Button>
                    );
                  })}
                </Stack>
              </>
            )}

            {/* QUANTITY */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Số lượng</Typography>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ border: `1px solid ${landingTokens.HAIRLINE}`, width: 'fit-content', mb: 4 }}
            >
              <IconButton onClick={() => setQuantity((q) => Math.max(1, q - 1))} size="small" aria-label="Giảm">
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 48, textAlign: 'center' }}>{quantity}</Typography>
              <IconButton onClick={() => setQuantity((q) => Math.min(99, q + 1))} size="small" aria-label="Tăng">
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>

            {/* PROMOS */}
            {(product.promo_badges?.length ?? 0) > 0 && (
              <Box
                sx={{
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                  p: 2.5,
                  mb: 4,
                  bgcolor: '#F3EDE4',
                }}
              >
                <Typography variant="overline" sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.2em', display: 'block', mb: 1.5 }}>
                  ƯU ĐÃI
                </Typography>
                <Stack spacing={1}>
                  {product.promo_badges.map((t, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                      <Box sx={{ color: landingTokens.GOLD_DARK, mt: '2px', fontSize: 16 }}>✦</Box>
                      <Typography variant="body2">{t.label ?? t}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}

            {/* CTAS */}
            <Stack spacing={1.5} sx={{ mb: 4 }}>
              <Button variant="contained" sx={sxSharpBtnCta} size="large" fullWidth>
                Mua ngay
              </Button>
              <Stack direction="row" spacing={1.5}>
                <Button variant="outlined" size="large" fullWidth sx={sxSharpBtnOutlined}>
                  Thêm vào giỏ
                </Button>
                <IconButton
                  aria-label="Yêu thích"
                  sx={{
                    border: `1px solid ${landingTokens.HAIRLINE}`,
                    borderRadius: 0,
                    px: 2,
                    '&:hover': { borderColor: landingTokens.PRIMARY, color: landingTokens.PRIMARY },
                  }}
                >
                  <FavoriteBorderOutlinedIcon />
                </IconButton>
              </Stack>
            </Stack>

            {/* BENEFITS */}
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={0}
              sx={{ border: `1px solid ${landingTokens.HAIRLINE}`, bgcolor: landingTokens.SURFACE }}
            >
              {[
                { icon: <LocalShippingOutlinedIcon />, label: 'Giao 3 giờ' },
                { icon: <SupportAgentOutlinedIcon />, label: 'Phục vụ 24/7' },
                { icon: <AutorenewOutlinedIcon />, label: 'Thu đổi 48h' },
              ].map((b, i) => (
                <Stack key={i} alignItems="center" spacing={0.5} sx={{ flex: 1, py: 2, color: landingTokens.GOLD_DARK }}>
                  {b.icon}
                  <Typography variant="caption" sx={{ color: landingTokens.INK }}>{b.label}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* TABS: description / policy / FAQ */}
      <Box sx={{ bgcolor: '#F3EDE4', py: { xs: 6, md: 10 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            centered
            TabIndicatorProps={{ sx: { bgcolor: landingTokens.PRIMARY, height: 2 } }}
            sx={{ mb: 5, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, letterSpacing: '0.04em' } }}
          >
            <Tab label="Mô tả sản phẩm" />
            <Tab label="Chính sách hậu đãi" />
            <Tab label="Câu hỏi thường gặp" />
          </Tabs>

          <Box sx={{ maxWidth: 820, mx: 'auto' }}>
            {tab === 0 && (
              product.description_html ? (
                <Box
                  sx={{ fontSize: 16, lineHeight: 1.85, '& p': { mb: 2 } }}
                  dangerouslySetInnerHTML={{ __html: product.description_html }}
                />
              ) : (
                <Typography color="text.secondary">Chưa có mô tả cho sản phẩm này.</Typography>
              )
            )}
            {tab === 1 && (
              <Stack spacing={3}>
                {(product.after_sales_policy?.items ?? [
                  { h: 'Miễn phí bảo hành 6 tháng', b: 'Bảo hành 6 tháng với lỗi kỹ thuật và nước xi tại mọi cửa hàng trên toàn quốc.' },
                  { h: 'Siêu âm, đánh bóng trọn đời', b: 'Miễn phí siêu âm làm sạch và đánh bóng tại hệ thống cửa hàng.' },
                  { h: 'Thay đá ECZ, CZ miễn phí', b: 'Áp dụng trong thời gian bảo hành với các loại đá tổng hợp.' },
                  { h: 'Thu đổi trong 48 giờ', b: 'Đổi size, đổi mẫu trang sức vàng trong 48 giờ, bạc trong 72 giờ.' },
                ]).map((p, i) => (
                  <Box key={i}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>{p.h ?? p.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{p.b ?? p.description}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
            {tab === 2 && (
              <Box>
                {faqItems.map((f, i) => (
                  <Accordion key={i} elevation={0} disableGutters square sx={{ bgcolor: 'transparent', borderBottom: `1px solid ${landingTokens.HAIRLINE}` }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{f.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0, pb: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                        {f.a}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* RELATED */}
      {related.length > 0 && (
        <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 8, md: 12 } }}>
          <SectionTitle eyebrow="SẢN PHẨM TƯƠNG TỰ" title="Gợi ý dành cho bạn" align="left" />
          <ScrollSnapRail>
            {related.map((p) => <ProductCard key={p.id} product={toCard(p)} />)}
          </ScrollSnapRail>
        </Container>
      )}
    </>
  );
}
