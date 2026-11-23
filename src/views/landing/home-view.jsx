'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fUnixToDateVN } from 'src/utils/format-time';

import { useGetHomePage } from 'src/actions/landing';
import { landingTokens, sxSharpBtnOutlined } from 'src/theme/landing';

import Wireframe from 'src/sections/landing/components/Wireframe';
import ProductCard from 'src/sections/landing/components/ProductCard';

// API product → ProductCard-expected shape (ProductCard reads product_name / sale_price / original_price).
const toCard = (p) => ({
  id: p.slug ?? p.id,
  product_name: p.name,
  sale_price: p.price_min,
  original_price: p.price_max,
  rating: p.rating?.avg ?? 5,
  review_count: p.rating?.count ?? 0,
  sold: p.stats?.sold_count ?? 0,
});

const services = [
  { icon: <LocalShippingOutlinedIcon />, title: 'Giao hàng 3 giờ', desc: 'Miễn phí toàn quốc' },
  { icon: <SupportAgentOutlinedIcon />, title: 'Phục vụ 24/7', desc: 'Tư vấn mọi lúc' },
  { icon: <AutorenewOutlinedIcon />, title: 'Thu đổi 48h', desc: 'Dễ dàng đổi size' },
  { icon: <VerifiedUserOutlinedIcon />, title: 'Chuẩn GIA', desc: 'Kim cương kiểm định' },
];

const copyVoucher = async (code) => {
  try { await navigator.clipboard?.writeText(code); } catch { /* noop */ }
};

function HeroSwiper({ banners }) {
  useEffect(() => {
    let swiper;
    let mounted = true;
    (async () => {
      const [{ default: Swiper }, mods] = await Promise.all([
        import('swiper'),
        import('swiper/modules'),
      ]);
      if (!mounted) return;
      swiper = new Swiper('#hero-swiper', {
        modules: [mods.Autoplay, mods.Pagination, mods.EffectFade],
        effect: 'fade',
        fadeEffect: { crossFade: true },
        loop: true,
        autoplay: { delay: 4500, disableOnInteraction: false },
        pagination: { el: '#hero-swiper-pagination', clickable: true },
      });
    })();
    return () => { mounted = false; if (swiper) swiper.destroy(true, true); };
  }, [banners]);

  const slides = banners?.length ? banners : [{ id: 'placeholder', title: '1200×450' }];

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box className="swiper" id="hero-swiper" sx={{ overflow: 'hidden', width: '100%' }}>
        <Box className="swiper-wrapper">
          {slides.map((banner) => (
            <Box
              key={banner.id}
              className="swiper-slide"
              sx={{
                position: 'relative',
                aspectRatio: { xs: '16 / 10', md: '1200 / 450' },
                overflow: 'hidden',
              }}
            >
              {banner.image_desktop_url ? (
                <Box
                  component={banner.link_url ? Link : 'div'}
                  href={banner.link_url || undefined}
                  sx={{ display: 'block', width: '100%', height: '100%' }}
                >
                  <Box
                    component="img"
                    src={banner.image_desktop_url}
                    alt={banner.title ?? ''}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ) : (
                <Wireframe label={`Hero banner ${banner.id} · ${banner.title ?? '1200×450'}`} iconSize="large" />
              )}
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        id="hero-swiper-pagination"
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          '& .swiper-pagination-bullet': {
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: 'rgba(0,52,104,0.35)',
            cursor: 'pointer',
            transition: 'all 220ms ease',
          },
          '& .swiper-pagination-bullet-active': {
            bgcolor: landingTokens.PRIMARY,
            transform: 'scale(1.3)',
          },
        }}
      />
    </Box>
  );
}

function SwiperRail({ id, children, slidesMd = 4 }) {
  useEffect(() => {
    let swiper;
    let mounted = true;
    (async () => {
      const [{ default: Swiper }, mods] = await Promise.all([
        import('swiper'),
        import('swiper/modules'),
      ]);
      if (!mounted) return;
      swiper = new Swiper(`#${id}`, {
        modules: [mods.Navigation],
        slidesPerView: 2,
        spaceBetween: 12,
        navigation: { nextEl: `#${id}-next`, prevEl: `#${id}-prev` },
        breakpoints: {
          768: { slidesPerView: 3, spaceBetween: 16 },
          1200: { slidesPerView: slidesMd, spaceBetween: 20 },
        },
      });
    })();
    return () => { mounted = false; if (swiper) swiper.destroy(true, true); };
  }, [id, slidesMd]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box className="swiper" id={id} sx={{ overflow: 'hidden' }}>
        <Box className="swiper-wrapper">
          {children.map((child, i) => (
            <Box key={i} className="swiper-slide" sx={{ height: 'auto' }}>
              {child}
            </Box>
          ))}
        </Box>
      </Box>
      <IconButton
        id={`${id}-prev`}
        aria-label="Trước"
        sx={{
          position: 'absolute',
          top: '42%',
          left: { xs: -4, md: -20 },
          zIndex: 2,
          bgcolor: landingTokens.SURFACE,
          border: `1px solid ${landingTokens.HAIRLINE}`,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          display: { xs: 'none', md: 'inline-flex' },
          '&:hover': { bgcolor: landingTokens.PRIMARY, color: '#FFFFFF' },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <IconButton
        id={`${id}-next`}
        aria-label="Tiếp"
        sx={{
          position: 'absolute',
          top: '42%',
          right: { xs: -4, md: -20 },
          zIndex: 2,
          bgcolor: landingTokens.SURFACE,
          border: `1px solid ${landingTokens.HAIRLINE}`,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          display: { xs: 'none', md: 'inline-flex' },
          '&:hover': { bgcolor: landingTokens.PRIMARY, color: '#FFFFFF' },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}

function CollectionsCoverflow({ collections, onActive }) {
  useEffect(() => {
    let swiper;
    let mounted = true;
    (async () => {
      const [{ default: Swiper }, mods] = await Promise.all([
        import('swiper'),
        import('swiper/modules'),
      ]);
      if (!mounted) return;
      swiper = new Swiper('#collections-swiper', {
        modules: [mods.EffectCoverflow, mods.Navigation, mods.Pagination],
        effect: 'coverflow',
        centeredSlides: true,
        slidesPerView: 'auto',
        grabCursor: true,
        coverflowEffect: {
          rotate: 18,
          stretch: -20,
          depth: 220,
          modifier: 1,
          slideShadows: false,
        },
        loop: true,
        pagination: { el: '#collections-pagination', clickable: true },
        navigation: { nextEl: '#collections-next', prevEl: '#collections-prev' },
        on: {
          slideChange: (s) => {
            const idx = s.realIndex;
            if (onActive && collections[idx]) onActive(collections[idx].id);
          },
        },
      });
    })();
    return () => { mounted = false; if (swiper) swiper.destroy(true, true); };
  }, [collections, onActive]);

  return (
    <Box sx={{ position: 'relative', py: 2 }}>
      <Box
        className="swiper"
        id="collections-swiper"
        sx={{
          overflow: 'visible',
          '& .swiper-slide': {
            width: 300,
            transition: 'opacity 300ms ease',
            opacity: 0.55,
          },
          '& .swiper-slide-active': { opacity: 1 },
          '& .swiper-slide > a': {
            transition: 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 400ms ease',
            transformOrigin: 'center center',
          },
          '& .swiper-slide-active > a': {
            transform: 'scale(1.12) translateY(-8px)',
            boxShadow: '0 3px 10px rgba(0,52,104,0.05)',
            zIndex: 2,
          },
        }}
      >
        <Box className="swiper-wrapper">
          {collections.map((c) => (
            <Box key={c.id} className="swiper-slide">
              <Box
                component={Link}
                href={`/category/collection/${c.slug ?? c.id}`}
                sx={{
                  display: 'block',
                  width: 300,
                  height: 300,
                  textDecoration: 'none',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,52,104,0.06)',
                  position: 'relative',
                }}
              >
                {c.image_url ? (
                  <Box component="img" src={c.image_url} alt={c.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Wireframe label={`BST · ${c.name}`} iconSize="large" />
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <IconButton
        id="collections-prev"
        aria-label="BST trước"
        sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          zIndex: 3,
          width: 44,
          height: 44,
          bgcolor: '#FFFFFF',
          border: `1px solid ${landingTokens.HAIRLINE}`,
          color: landingTokens.PRIMARY,
          boxShadow: '0 4px 14px rgba(0,52,104,0.12)',
          '&:hover': { bgcolor: landingTokens.PRIMARY, color: '#FFFFFF' },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <IconButton
        id="collections-next"
        aria-label="BST tiếp"
        sx={{
          position: 'absolute',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 3,
          width: 44,
          height: 44,
          bgcolor: '#FFFFFF',
          border: `1px solid ${landingTokens.HAIRLINE}`,
          color: landingTokens.PRIMARY,
          boxShadow: '0 4px 14px rgba(0,52,104,0.12)',
          '&:hover': { bgcolor: landingTokens.PRIMARY, color: '#FFFFFF' },
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      <Box
        id="collections-pagination"
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          '& .swiper-pagination-bullet': {
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: 'rgba(0,52,104,0.25)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          },
          '& .swiper-pagination-bullet-active': {
            bgcolor: landingTokens.PRIMARY,
            transform: 'scale(1.3)',
          },
        }}
      />
    </Box>
  );
}

function BrandsCenteredSwiper({ brands }) {
  useEffect(() => {
    let swiper;
    let mounted = true;
    (async () => {
      const [{ default: Swiper }, mods] = await Promise.all([
        import('swiper'),
        import('swiper/modules'),
      ]);
      if (!mounted) return;
      swiper = new Swiper('#brands-swiper', {
        modules: [mods.Navigation, mods.Pagination],
        slidesPerView: 1,
        centeredSlides: true,
        loop: true,
        spaceBetween: 16,
        pagination: { el: '#brands-pagination', clickable: true },
        navigation: { nextEl: '#brands-next', prevEl: '#brands-prev' },
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
        },
      });
    })();
    return () => { mounted = false; if (swiper) swiper.destroy(true, true); };
  }, [brands]);

  return (
    <Box sx={{ position: 'relative', py: 2, pb: 6 }}>
      <Box
        className="swiper"
        id="brands-swiper"
        sx={{
          overflow: 'hidden',
          mx: { xs: 0, md: 7 },
        }}
      >
        <Box className="swiper-wrapper">
          {brands.map((b) => (
            <Box
              key={b.id}
              className="swiper-slide"
              sx={{ height: 'auto', pb: 4, display: 'flex', justifyContent: 'center' }}
            >
              <Box sx={{ position: 'relative', width: 368, maxWidth: '100%' }}>
                <Box
                  component={Link}
                  href={b.slug ? `/category/brand/${b.slug}` : '#'}
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: 368,
                    textDecoration: 'none',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  {b.image_url ? (
                    <Box component="img" src={b.image_url} alt={b.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Wireframe label={b.name} iconSize="large" sx={{ borderRadius: 1, border: 'none' }} />
                  )}
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -22,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#FFFFFF',
                    px: 3,
                    py: 1.25,
                    borderRadius: 1.5,
                    border: `1px solid ${landingTokens.HAIRLINE}`,
                    minWidth: 150,
                    textAlign: 'center',
                    zIndex: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: landingTokens.PRIMARY,
                      letterSpacing: '0.08em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {b.name}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <IconButton
        id="brands-prev"
        aria-label="Thương hiệu trước"
        sx={{
          position: 'absolute',
          top: 200,
          transform: 'translateY(-50%)',
          left: { xs: 0, md: 40 },
          zIndex: 3,
          bgcolor: landingTokens.SURFACE,
          border: `1px solid ${landingTokens.HAIRLINE}`,
          color: landingTokens.PRIMARY,
          '&:hover': { bgcolor: landingTokens.PRIMARY, color: '#FFFFFF' },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <IconButton
        id="brands-next"
        aria-label="Thương hiệu tiếp"
        sx={{
          position: 'absolute',
          top: 200,
          transform: 'translateY(-50%)',
          right: { xs: 0, md: 40 },
          zIndex: 3,
          bgcolor: landingTokens.SURFACE,
          border: `1px solid ${landingTokens.HAIRLINE}`,
          color: landingTokens.PRIMARY,
          '&:hover': { bgcolor: landingTokens.PRIMARY, color: '#FFFFFF' },
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      <Box
        id="brands-pagination"
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          '& .swiper-pagination-bullet': {
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: 'rgba(0,52,104,0.25)',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          },
          '& .swiper-pagination-bullet-active': {
            bgcolor: landingTokens.PRIMARY,
            transform: 'scale(1.3)',
          },
        }}
      />
    </Box>
  );
}

function PromoCard() {
  return (
    <Box
      component={Link}
      href="/category/collection/1"
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: { xs: 325, md: 425 },
        bgcolor: landingTokens.NEUTRAL_SOFT,
        overflow: 'hidden',
        borderRadius: 1.5,
        textDecoration: 'none',
        color: 'inherit',
        textAlign: 'center',
        px: { xs: 3, md: 4 },
        py: 5,
        transition: 'background-color 240ms ease',
        '&:hover .promo-bg': { transform: 'scale(1.04)' },
        '&:hover .promo-link': { color: landingTokens.PRIMARY, borderColor: landingTokens.PRIMARY },
      }}
    >
      <Box
        className="promo-bg"
        sx={{
          position: 'absolute',
          inset: 0,
          transition: 'transform 700ms cubic-bezier(.2,.8,.2,1)',
        }}
      >
        <Wireframe label="Nhẫn cưới · Bộ sưu tập" iconSize="large" />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.65) 100%)',
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: landingTokens.GOLD_DARK,
            mb: 1.5,
          }}
        >
          TUYỆT TÁC
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: { xs: 34, md: 44 },
            fontWeight: 500,
            lineHeight: 1.05,
            color: landingTokens.PRIMARY,
            mb: 3.5,
          }}
        >
          Nhẫn Cưới
        </Typography>
        <Box
          className="promo-link"
          sx={{
            display: 'inline-block',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: landingTokens.INK,
            borderBottom: `1px solid ${landingTokens.INK}`,
            pb: 0.5,
            transition: 'color 200ms ease, border-color 200ms ease',
          }}
        >
          Khám phá ngay
        </Box>
      </Box>
    </Box>
  );
}

function ProductColumn({ title, pages, page, onPrev, onNext }) {
  const totalPages = pages.length;
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const navSx = (enabled) => ({
    border: `1px solid ${enabled ? landingTokens.HAIRLINE : 'transparent'}`,
    borderRadius: 1,
    width: 28,
    height: 28,
    color: enabled ? landingTokens.INK : landingTokens.INK_MUTED,
    transition: 'all 180ms ease',
    '&:hover': enabled
      ? { borderColor: landingTokens.GOLD, bgcolor: 'transparent', color: landingTokens.PRIMARY }
      : undefined,
  });

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: 2.5,
          pb: 1.5,
          borderBottom: `1px solid ${landingTokens.HAIRLINE}`,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: 16, md: 18 },
            color: landingTokens.PRIMARY,
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            disabled={!canPrev}
            onClick={onPrev}
            sx={navSx(canPrev)}
            aria-label="Trước"
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            disabled={!canNext}
            onClick={onNext}
            sx={navSx(canNext)}
            aria-label="Tiếp"
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Carousel track */}
      <Box sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            width: `${totalPages * 100}%`,
            transform: `translateX(-${(page * 100) / totalPages}%)`,
            transition: 'transform 520ms cubic-bezier(.2,.8,.2,1)',
          }}
        >
          {pages.map((pageItems, pageIdx) => (
            <Box
              key={pageIdx}
              sx={{
                width: `${100 / totalPages}%`,
                flexShrink: 0,
                pr: pageIdx === totalPages - 1 ? 0 : 0.25,
              }}
            >
              <Stack spacing={2.5}>
                {pageItems.map((p, i) => {
                  const original =
                    p.original_price && p.original_price !== p.sale_price
                      ? p.original_price
                      : Math.round(p.sale_price * 1.18);
                  const rowNo = pageIdx * pageItems.length + i + 1;
                  return (
                    <Stack
                      key={p.id}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      component={Link}
                      href={`/product/${p.id}`}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover .pc-img': { transform: 'scale(1.06)' },
                        '&:hover .pc-name': { color: landingTokens.PRIMARY },
                      }}
                    >
                      <Box
                        sx={{
                          width: 76,
                          height: 76,
                          flexShrink: 0,
                          bgcolor: landingTokens.NEUTRAL,
                          overflow: 'hidden',
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          className="pc-img"
                          sx={{
                            width: '100%',
                            height: '100%',
                            transition: 'transform 420ms cubic-bezier(.2,.8,.2,1)',
                          }}
                        >
                          <Wireframe label="" iconSize="small" />
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          className="pc-name"
                          sx={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: landingTokens.INK,
                            lineHeight: 1.4,
                            mb: 0.75,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            transition: 'color 200ms ease',
                          }}
                        >
                          {rowNo}. {p.product_name}
                        </Typography>
                        <Stack direction="row" alignItems="baseline" spacing={1}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: landingTokens.INK_MUTED,
                              textDecoration: 'line-through',
                            }}
                          >
                            {fCurrency(original)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: landingTokens.GOLD_DARK,
                            }}
                          >
                            {fCurrency(p.sale_price)}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

function FeaturedProductsSection({ bestsellers, newProducts }) {
  const PER_PAGE = 4;

  const bestSellers = [...(bestsellers || []), ...(newProducts || [])].slice(0, 12).map(toCard);
  const saleProducts = [...(newProducts || []), ...(bestsellers || [])]
    .slice(0, 12)
    .map(toCard)
    .filter((p) => p.original_price && p.sale_price !== p.original_price);

  const bestPages = chunk(bestSellers, PER_PAGE);
  const salePages = chunk(saleProducts.length ? saleProducts : bestSellers, PER_PAGE);

  const [bestPage, setBestPage] = useState(0);
  const [salePage, setSalePage] = useState(0);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: landingTokens.SURFACE,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: landingTokens.PRIMARY,
              fontSize: { xs: 22, md: 28 },
              mb: 1,
            }}
          >
            Trang sức dành riêng cho bạn
          </Typography>
          <Typography
            sx={{
              color: landingTokens.INK_MUTED,
              fontSize: 14,
              maxWidth: 540,
              mx: 'auto',
            }}
          >
            Những thiết kế mới nhất và ưu đãi nổi bật, tuyển lựa kỹ cho từng khoảnh khắc.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <PromoCard />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ProductColumn
              title="Bán chạy nhất"
              pages={bestPages}
              page={bestPage}
              onPrev={() => setBestPage((p) => Math.max(0, p - 1))}
              onNext={() => setBestPage((p) => Math.min(bestPages.length - 1, p + 1))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ProductColumn
              title="Đang giảm giá"
              pages={salePages}
              page={salePage}
              onPrev={() => setSalePage((p) => Math.max(0, p - 1))}
              onNext={() => setSalePage((p) => Math.min(salePages.length - 1, p + 1))}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export function HomeView() {
  const { sections } = useGetHomePage();

  const heroBanners = sections?.hero_banners ?? [];
  const megaMenu = sections?.mega_menu ?? [];
  const featuredProducts = sections?.featured_products ?? [];
  const bestsellerProducts = sections?.bestseller_products ?? [];
  const newProducts = sections?.new_products ?? [];
  const jewelryLines = sections?.jewelry_lines ?? [];
  const collections = sections?.collections_featured ?? [];
  const blogTeasers = sections?.blog_teasers ?? [];
  const brands = sections?.brands_showcase ?? [];

  const [activeLine, setActiveLine] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);

  // Init active ids when sections arrive.
  const currentLineId = activeLine ?? jewelryLines[0]?.id ?? null;
  const currentCollectionId = activeCollection ?? collections[0]?.id ?? null;

  const activeLineObj = jewelryLines.find((j) => j.id === currentLineId) ?? jewelryLines[0];
  const jewelryLineProducts = (activeLineObj?.products ?? []).map(toCard);

  const activeCollectionObj = collections.find((c) => c.id === currentCollectionId) ?? collections[0];
  const activeCollectionProducts = (activeCollectionObj?.products ?? newProducts).map(toCard);

  // Product-type tiles from mega_menu (fallback to hardcoded if API empty).
  const productTypeTiles = megaMenu.length
    ? megaMenu.slice(0, 12).map((m) => ({ id: m.id, name: m.name, slug: m.slug, image_url: m.image_url }))
    : [
        { id: 1, name: 'Trang sức trẻ em' },
        { id: 2, name: 'Nhẫn Cưới' },
        { id: 3, name: 'Nhẫn Cầu hôn' },
        { id: 4, name: 'Bông tai ECZ' },
        { id: 5, name: 'Dây chuyền Vàng' },
        { id: 6, name: 'Đồng hồ Kim cương' },
      ];

  return (
    <>
      <HeroSwiper banners={heroBanners} />

      {/* SERVICE STRIP */}
      <Box sx={{ bgcolor: landingTokens.NEUTRAL, borderBottom: `1px solid ${landingTokens.HAIRLINE}` }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 3, md: 4 } }}>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {services.map((s) => (
              <Grid key={s.title} size={{ xs: 6, md: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ color: landingTokens.PRIMARY, fontSize: 28, display: 'inline-flex' }}>{s.icon}</Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: landingTokens.PRIMARY, fontSize: { xs: 13, md: 14 } }}>
                      {s.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED, display: 'block', fontSize: { xs: 11, md: 12 } }}>
                      {s.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* VOUCHER SECTION — ticket-style cards (disabled until promo_homepage design confirmed) */}
      {/* eslint-disable-next-line no-constant-binary-expression */}
      {false && (sections?.promotions_homepage ?? []).length > 0 && (
        <Box
          sx={{
            py: { xs: 6, md: 10 },
            background: `linear-gradient(135deg, ${landingTokens.NEUTRAL_SOFT} 0%, #FFFFFF 50%, ${landingTokens.NEUTRAL_SOFT} 100%)`,
          }}
        >
          <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
            {/* Section header */}
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 2,
                  '&::before, &::after': {
                    content: '""',
                    display: 'block',
                    width: 40,
                    height: 1,
                    bgcolor: landingTokens.GOLD,
                  },
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: landingTokens.GOLD_DARK,
                    letterSpacing: '0.22em',
                    fontWeight: 700,
                  }}
                >
                  ƯU ĐÃI ĐỘC QUYỀN
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: landingTokens.PRIMARY,
                  fontSize: { xs: 22, md: 28 },
                }}
              >
                Mã giảm giá dành riêng cho bạn
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: landingTokens.INK_MUTED, mt: 1, maxWidth: 560, mx: 'auto' }}
              >
                Sao chép mã bên dưới và áp dụng tại trang thanh toán. Số lượng có hạn, dùng ngay hôm nay.
              </Typography>
            </Box>

            {/* Vouchers */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 3, md: 4 }}
              justifyContent="center"
              sx={{ width: '100%' }}
            >
              {(sections?.promotions_homepage ?? []).map((v) => (
                <Box
                  key={v.id}
                  sx={{
                    flex: 1,
                    maxWidth: { md: 360 },
                    position: 'relative',
                    bgcolor: '#FFFFFF',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,52,104,0.08)',
                    display: 'flex',
                    minHeight: 150,
                    transition: 'transform 300ms ease, box-shadow 300ms ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(0,52,104,0.14)',
                    },
                    /* Ticket cutout circles on the perforation */
                    '&::before, &::after': {
                      content: '""',
                      position: 'absolute',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: landingTokens.NEUTRAL_SOFT,
                      left: '35%',
                      transform: 'translateX(-50%)',
                    },
                    '&::before': { top: -10 },
                    '&::after': { bottom: -10 },
                  }}
                >
                  {/* Left — discount value */}
                  <Box
                    sx={{
                      width: '35%',
                      background: `linear-gradient(135deg, ${landingTokens.PRIMARY} 0%, ${landingTokens.PRIMARY_DARK} 100%)`,
                      color: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 800,
                        lineHeight: 1,
                        fontSize: v.is_fixed === 0 ? { xs: 32, md: 40 } : { xs: 16, md: 18 },
                      }}
                    >
                      {v.is_fixed === 0 ? `${Math.floor(v.discount_amount)}%` : fCurrency(v.discount_amount)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        letterSpacing: '0.2em',
                        fontWeight: 700,
                        mt: 1,
                        opacity: 0.9,
                      }}
                    >
                      GIẢM GIÁ
                    </Typography>
                  </Box>

                  {/* Perforation */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '35%',
                      top: 10,
                      bottom: 10,
                      borderLeft: `1px dashed ${landingTokens.HAIRLINE}`,
                    }}
                  />

                  {/* Right — content */}
                  <Box
                    sx={{
                      flex: 1,
                      p: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minWidth: 0,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          color: landingTokens.INK_MUTED,
                          fontSize: 11,
                          letterSpacing: '0.18em',
                          fontWeight: 600,
                        }}
                      >
                        MÃ GIẢM
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: landingTokens.PRIMARY,
                          fontSize: { xs: 16, md: 18 },
                          lineHeight: 1.2,
                          mt: 0.25,
                        }}
                      >
                        {v.voucher_code}
                      </Typography>
                      <Typography
                        sx={{ color: landingTokens.INK_MUTED, fontSize: 12, mt: 1 }}
                      >
                        Đơn tối thiểu <strong style={{ color: landingTokens.INK }}>{fCurrency(v.min_order_value)}</strong>
                      </Typography>
                      <Typography
                        sx={{ color: landingTokens.INK_MUTED, fontSize: 11, mt: 0.5 }}
                      >
                        HSD {fDate(v.end_date, 'DD-MM-YYYY')}
                      </Typography>
                    </Box>
                    <Button
                      onClick={() => copyVoucher(v.voucher_code)}
                      size="small"
                      startIcon={<ContentCopyOutlinedIcon fontSize="small" />}
                      sx={{
                        mt: 1.5,
                        color: landingTokens.PRIMARY,
                        fontWeight: 700,
                        fontSize: 12,
                        textTransform: 'none',
                        alignSelf: 'flex-start',
                        px: 1,
                        py: 0.5,
                        minWidth: 'auto',
                        '&:hover': { bgcolor: 'rgba(0,52,104,0.06)' },
                      }}
                    >
                      Sao chép
                    </Button>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Container>
        </Box>
      )}

      {/* CATEGORY TILES */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: landingTokens.PRIMARY, fontSize: { xs: 20, md: 24 }, mb: 1 }}>
            Bạn đang tìm gì hôm nay?
          </Typography>
          <Typography sx={{ color: landingTokens.INK_MUTED, fontSize: 14, maxWidth: 540, mx: 'auto' }}>
            Khám phá trang sức theo chủng loại và dịp sử dụng — tìm nhanh món bạn cần.
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 2, md: 3 }} rowSpacing={{ xs: 3, md: 5 }}>
          {productTypeTiles.map((t) => (
            <Grid key={t.id} size={{ xs: 4, sm: 3, md: 2 }}>
              <Box
                component={Link}
                href={`/category/product-type/${t.slug ?? t.id}`}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  textAlign: 'center',
                  transition: 'transform 220ms ease',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <Box
                  sx={{
                    aspectRatio: '1 / 1',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(0,52,104,0.08)',
                  }}
                >
                  {t.image_url ? (
                    <Box component="img" src={t.image_url} alt={t.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Wireframe label={t.name} iconSize="small" sx={{ border: 'none', borderRadius: 3 }} />
                  )}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    mt: 1.5,
                    color: landingTokens.INK,
                    fontSize: { xs: 13, md: 14 },
                  }}
                >
                  {t.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FEATURED PRODUCTS — Spotlight + Grid */}
      <FeaturedProductsSection bestsellers={bestsellerProducts.length ? bestsellerProducts : featuredProducts} newProducts={newProducts} />

      {/* BRANDS CENTERED SWIPER */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, pt: 0, pb: { xs: 6, md: 10 }, overflow: 'hidden' }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: landingTokens.PRIMARY, fontSize: { xs: 22, md: 28 }, mb: 1 }}>
            Thương hiệu nổi bật
          </Typography>
          <Typography sx={{ color: landingTokens.INK_MUTED, fontSize: 14, maxWidth: 540, mx: 'auto' }}>
            Những thương hiệu danh tiếng được hàng triệu khách hàng tin yêu.
          </Typography>
        </Box>
        <BrandsCenteredSwiper brands={brands.length ? brands : [{ id: 'placeholder', name: 'PNJ' }]} />
      </Container>

      {/* COLLECTIONS COVERFLOW + PRODUCT RAIL */}
      <Container maxWidth={false} sx={{ maxWidth: 1155, pt: 0, pb: { xs: 6, md: 10 }, overflow: 'hidden' }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: landingTokens.PRIMARY, fontSize: { xs: 22, md: 28 }, mb: 1 }}>
            Bộ sưu tập mới
          </Typography>
          <Typography sx={{ color: landingTokens.INK_MUTED, fontSize: 14, maxWidth: 540, mx: 'auto' }}>
            Những bộ sưu tập chọn lọc theo chủ đề và cảm hứng chế tác mới nhất.
          </Typography>
        </Box>
        <CollectionsCoverflow collections={collections.length ? collections : [{ id: 'placeholder', name: 'Bộ sưu tập' }]} onActive={setActiveCollection} />

        <Box sx={{ mt: { xs: 5, md: 7 } }}>
          <SwiperRail id={`col-${currentCollectionId}`} key={`col-${currentCollectionId}`}>
            {activeCollectionProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </SwiperRail>
          <Stack alignItems="center" sx={{ mt: 4 }}>
            <Button
              component={Link}
              href={`/category/collection/${activeCollectionObj?.slug ?? currentCollectionId}`}
              variant="outlined"
              size="large"
              sx={sxSharpBtnOutlined}
            >
              Xem thêm
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* JEWELRY LINE: selector + banner + arc transition + product rail */}
      <Box sx={{ fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif', '& *': { fontFamily: 'inherit' } }}>
        {/* White top: title + banner + pills + description */}
        <Container maxWidth={false} sx={{ maxWidth: 1155, pt: 0, pb: { xs: 4, md: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: landingTokens.PRIMARY, fontSize: { xs: 22, md: 28 }, mb: 1 }}>
              Dòng hàng nổi bật
            </Typography>
            <Typography sx={{ color: landingTokens.INK_MUTED, fontSize: 14, maxWidth: 540, mx: 'auto' }}>
              Từng dòng sản phẩm được thiết kế riêng cho mỗi phong cách và cảm hứng.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ aspectRatio: '1 / 1', borderRadius: 1, overflow: 'hidden' }}>
                <Wireframe
                  label={`Banner ${activeLineObj?.name ?? ''}`}
                  iconSize="large"
                  sx={{ border: 'none', borderRadius: 1 }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1.25, mb: 3 }}>
                {jewelryLines.map((jl) => {
                  const active = jl.id === currentLineId;
                  return (
                    <Box
                      key={jl.id}
                      component="button"
                      type="button"
                      onClick={() => setActiveLine(jl.id)}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        bgcolor: active ? landingTokens.PRIMARY : 'rgba(0,52,104,0.08)',
                        color: active ? '#FFFFFF' : landingTokens.PRIMARY,
                        border: `1px solid ${landingTokens.PRIMARY}`,
                        borderRadius: '8px',
                        px: 2.5,
                        py: 1.1,
                        fontFamily: 'inherit',
                        fontSize: 14,
                        fontWeight: active ? 700 : 500,
                        lineHeight: 1.2,
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        transition: 'all 180ms ease',
                        '&:hover': {
                          bgcolor: active ? landingTokens.PRIMARY_DARK : 'rgba(0,52,104,0.14)',
                        },
                        '&:focus-visible': {
                          outline: `2px solid ${landingTokens.GOLD}`,
                          outlineOffset: 2,
                        },
                      }}
                    >
                      {jl.name}
                    </Box>
                  );
                })}
              </Stack>

              <Typography
                variant="body2"
                sx={{ color: landingTokens.INK_MUTED, lineHeight: 1.85, fontSize: { xs: 14, md: 15 } }}
              >
                Khám phá dòng{' '}
                <strong style={{ color: landingTokens.PRIMARY }}>
                  {activeLineObj?.name}
                </strong>{' '}
                {activeLineObj?.short_description ?? 'với tuyển lựa thiết kế mới nhất, được chế tác thủ công bởi những nghệ nhân giàu kinh nghiệm — từng chi tiết được cân chỉnh tỉ mỉ để tôn lên vẻ đẹp tinh tế, đồng thời giữ được độ bền và sự sang trọng theo thời gian.'}
              </Typography>
            </Grid>
          </Grid>
        </Container>


        {/* Blue rail */}
        <Box
          sx={{
            position: 'relative',
            backgroundImage: 'url(/images/vector.png)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mt: '-90px',
            pt: { xs: 10, md: 30 },
            pb: { xs: 6, md: 10 },
          }}
        >
          {/* Arrow triangle — base glued to white curve */}
          <Box
            component="svg"
            viewBox="0 0 100 70"
            preserveAspectRatio="none"
            sx={{
              position: 'absolute',
              top: { xs: 40, md: 120 },
              left: '50%',
              transform: 'translateX(-50%)',
              width: { xs: 48, md: 72 },
              height: { xs: 33, md: 50 },
              display: 'block',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <path d="M0 0 L100 0 L50 70 Z" fill="#FFFFFF" />
          </Box>
          <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
            <SwiperRail id={`line-${currentLineId}`} key={`line-${currentLineId}`}>
              {jewelryLineProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </SwiperRail>

            <Stack alignItems="center" sx={{ mt: 4 }}>
              <Button
                component={Link}
                href={`/category/jewelry-line/${activeLineObj?.slug ?? currentLineId}`}
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.25,
                  color: landingTokens.PRIMARY,
                  borderColor: landingTokens.PRIMARY,
                  bgcolor: '#FFFFFF',
                  '&:hover': {
                    bgcolor: landingTokens.PRIMARY,
                    color: '#FFFFFF',
                    borderColor: landingTokens.PRIMARY,
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Xem dòng hàng này
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* BLOG — editorial grid */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          {/* Header */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ sm: 'flex-end' }}
            spacing={2}
            sx={{ mb: { xs: 4, md: 6 }, pb: 2.5, borderBottom: `1px solid ${landingTokens.HAIRLINE}` }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1 }}>
                <Box sx={{ width: 24, height: 1, bgcolor: landingTokens.GOLD }} />
                <Typography
                  variant="overline"
                  sx={{
                    color: landingTokens.GOLD_DARK,
                    letterSpacing: '0.24em',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  CẨM NANG & SỰ KIỆN
                </Typography>
              </Stack>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: landingTokens.PRIMARY,
                  fontSize: { xs: 22, md: 28 },
                  mb: 0.5,
                }}
              >
                Cảm hứng mỗi tuần, chuyên sâu mỗi tháng
              </Typography>
              <Typography sx={{ color: landingTokens.INK_MUTED, fontSize: 14, maxWidth: 520 }}>
                Góc cẩm nang chăm sóc trang sức, cập nhật xu hướng và câu chuyện sau mỗi thiết kế.
              </Typography>
            </Box>
            <Box
              component={Link}
              href="/blog"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                color: landingTokens.PRIMARY,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.08em',
                textDecoration: 'none',
                transition: 'color 180ms ease',
                '&:hover': { color: landingTokens.GOLD_DARK },
                '&:hover .pnj-blog-arrow': { transform: 'translateX(3px)' },
              }}
            >
              XEM TẤT CẢ
              <ArrowForwardIcon
                className="pnj-blog-arrow"
                fontSize="small"
                sx={{ transition: 'transform 200ms ease' }}
              />
            </Box>
          </Stack>

          {/* Grid: 1 featured hero + 2×2 compact cards */}
          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            <Grid size={{ xs: 12, md: 5 }}>
            {/* FEATURED hero card */}
            {(() => {
              const feature = blogTeasers[0] ?? {
                id: 1,
                title: 'Bài viết nổi bật',
                excerpt: 'Khám phá xu hướng trang sức năm nay và lời khuyên chuyên môn.',
              };
              return (
                <Box
                  component={Link}
                  href={`/blog/${feature.slug ?? feature.id ?? ''}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#FFFFFF',
                    textDecoration: 'none',
                    color: 'inherit',
                    border: `1px solid ${landingTokens.HAIRLINE}`,
                    borderRadius: 1,
                    overflow: 'hidden',
                    transition: 'border-color 220ms ease, transform 220ms ease',
                    '&:hover': {
                      borderColor: landingTokens.GOLD,
                      transform: 'translateY(-2px)',
                    },
                    '&:hover .feat-img': { transform: 'scale(1.03)' },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      aspectRatio: { xs: '16 / 10', md: '16 / 11' },
                      overflow: 'hidden',
                      bgcolor: landingTokens.NEUTRAL,
                    }}
                  >
                    <Box
                      className="feat-img"
                      sx={{ width: '100%', height: '100%', transition: 'transform 600ms ease' }}
                    >
                      {feature.thumbnail?.url ? (
                        <Box component="img" src={feature.thumbnail.url} alt={feature.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Wireframe label={`Featured ${feature.id}`} />
                      )}
                    </Box>
                    {/* Category chip overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        bgcolor: landingTokens.INK,
                        color: '#FFFFFF',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        px: 1.25,
                        py: 0.5,
                      }}
                    >
                      BÀI VIẾT NỔI BẬT
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: { xs: 3, md: 4 },
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        letterSpacing: '0.18em',
                        fontWeight: 700,
                        color: landingTokens.GOLD_DARK,
                        mb: 1.25,
                      }}
                    >
                      CẨM NANG · 5 phút đọc
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: 20, md: 24 },
                        lineHeight: 1.25,
                        color: landingTokens.INK,
                        mb: 1.5,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: landingTokens.INK_MUTED,
                        lineHeight: 1.7,
                        mb: 2.5,
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {feature.excerpt}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ pt: 2, borderTop: `1px solid ${landingTokens.HAIRLINE}` }}
                    >
                      <Typography
                        sx={{ fontSize: 11, color: landingTokens.INK_MUTED, letterSpacing: '0.06em' }}
                      >
                        {feature.published_at ? fUnixToDateVN(feature.published_at) : ''}
                      </Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{
                          color: landingTokens.PRIMARY,
                          fontWeight: 700,
                          fontSize: 12,
                          letterSpacing: '0.08em',
                        }}
                      >
                        <span>ĐỌC TIẾP</span>
                        <ArrowForwardIcon sx={{ fontSize: 15 }} />
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              );
            })()}
            </Grid>

            {/* SIDE grid — 2×2 vertical cards */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Grid container spacing={{ xs: 1.5, md: 2 }}>
              {(blogTeasers.slice(1, 5).length
                ? blogTeasers.slice(1, 5)
                : [
                    { id: 101, title: 'Hướng dẫn đo size nhẫn chính xác không cần tới cửa hàng' },
                    { id: 102, title: 'Ý nghĩa vòng vàng trơn dịp lễ Tết trong văn hoá Việt' },
                    { id: 103, title: 'Xu hướng trang sức 2026 cập nhật từ chuyên gia' },
                    { id: 104, title: 'Chăm sóc trang sức vàng tại nhà đúng cách' },
                  ]
              ).map((b, i) => (
                <Grid key={b.id} size={6}>
                <Box
                  component={Link}
                  href={`/blog/${b.slug ?? b.id}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    bgcolor: '#FFFFFF',
                    textDecoration: 'none',
                    color: 'inherit',
                    border: `1px solid ${landingTokens.HAIRLINE}`,
                    borderRadius: 1,
                    overflow: 'hidden',
                    transition: 'border-color 220ms ease, transform 220ms ease',
                    '&:hover': {
                      borderColor: landingTokens.GOLD,
                      transform: 'translateY(-2px)',
                    },
                    '&:hover .side-img': { transform: 'scale(1.06)' },
                    '&:hover .side-title': { color: landingTokens.PRIMARY },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      aspectRatio: '16 / 9',
                      overflow: 'hidden',
                      bgcolor: landingTokens.NEUTRAL,
                    }}
                  >
                    <Box
                      className="side-img"
                      sx={{
                        width: '100%',
                        height: '100%',
                        transition: 'transform 500ms ease',
                      }}
                    >
                      {b.thumbnail?.url ? (
                        <Box component="img" src={b.thumbnail.url} alt={b.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Wireframe label="" iconSize="small" />
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,
                        letterSpacing: '0.18em',
                        fontWeight: 700,
                        color: landingTokens.GOLD_DARK,
                        mb: 0.75,
                      }}
                    >
                      {['CẨM NANG', 'HƯỚNG DẪN', 'VĂN HOÁ', 'XU HƯỚNG'][i] ?? 'TIN TỨC'}
                    </Typography>
                    <Typography
                      className="side-title"
                      sx={{
                        fontWeight: 600,
                        color: landingTokens.INK,
                        fontSize: 13.5,
                        lineHeight: 1.4,
                        mb: 1,
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        transition: 'color 180ms ease',
                      }}
                    >
                      {b.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: landingTokens.INK_MUTED,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {b.published_at ? fUnixToDateVN(b.published_at) : ''}
                    </Typography>
                  </Box>
                </Box>
                </Grid>
              ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
