'use client';

import Link from 'next/link';
import { useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { fCurrency } from 'src/utils/format-number';

import { landingTokens } from 'src/theme/landing';
import Wireframe from './Wireframe';

const ACTION_DURATION = 900;

export default function ProductCard({ product, size = 'default' }) {
  const hasSale = product.sale_price && product.original_price && product.sale_price !== product.original_price;
  const imageHeight = size === 'small' ? 220 : 320;

  const [loading, setLoading] = useState({ view: false, cart: false, wishlist: false });

  const handleAction = (key) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading[key]) return;
    setLoading((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }, ACTION_DURATION);
  };

  // Stack top → bottom. Delays make the bottom icon appear first (rise-up stagger).
  const actions = [
    { key: 'view', Icon: VisibilityOutlinedIcon, label: 'Xem nhanh', delay: 160 },
    { key: 'cart', Icon: ShoppingCartOutlinedIcon, label: 'Thêm vào giỏ', delay: 80 },
    { key: 'wishlist', Icon: FavoriteBorderOutlinedIcon, label: 'Yêu thích', delay: 0 },
  ];

  return (
    <Box
      component={Link}
      href={`/product/${product.id}`}
      sx={{
        display: 'block',
        width: 280,
        maxWidth: '100%',
        textDecoration: 'none',
        color: 'inherit',
        bgcolor: landingTokens.SURFACE,
        borderRadius: 1,
        overflow: 'hidden',
        border: `1px solid ${landingTokens.HAIRLINE}`,
        transition: 'transform 220ms ease',
        '&:hover': { transform: 'translateY(-2px)' },
        '&:hover .product-img': { transform: 'scale(1.03)' },
        '&:hover .pc-action': { opacity: 1, transform: 'translateY(0)' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: imageHeight,
        }}
      >
        <Box
          className="product-img"
          sx={{
            width: '100%',
            height: '100%',
            transition: 'transform 600ms ease',
          }}
        >
          <Wireframe label={`SP ${product.id}`} />
        </Box>

        {/* Hover actions — right column, rises bottom→top */}
        <Stack
          direction="column"
          spacing={1}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
          }}
        >
          {actions.map(({ key, Icon, label, delay }) => {
            const isLoading = loading[key];
            return (
              <Box
                key={key}
                component="button"
                type="button"
                className="pc-action"
                onClick={handleAction(key)}
                aria-label={label}
                title={label}
                sx={{
                  width: 34,
                  height: 34,
                  minWidth: 34,
                  flexShrink: 0,
                  padding: 0,
                  margin: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  lineHeight: 0,
                  font: 'inherit',
                  bgcolor: '#FFFFFF',
                  color: landingTokens.PRIMARY,
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(26,20,19,0.08)',
                  opacity: 0,
                  transform: 'translateY(16px)',
                  transition:
                    'opacity 320ms cubic-bezier(.2,.8,.2,1), transform 320ms cubic-bezier(.2,.8,.2,1), background-color 180ms ease, color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
                  transitionDelay: `${delay}ms, ${delay}ms, 0ms, 0ms, 0ms, 0ms`,
                  '&:hover': {
                    bgcolor: landingTokens.PRIMARY,
                    color: '#FFFFFF',
                    borderColor: landingTokens.PRIMARY,
                    boxShadow: '0 4px 14px rgba(0,52,104,0.25)',
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${landingTokens.GOLD}`,
                    outlineOffset: 2,
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress
                    size={14}
                    thickness={5}
                    sx={{ color: 'inherit' }}
                  />
                ) : (
                  <Icon sx={{ fontSize: 16 }} />
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>

      <Stack spacing={0.75} sx={{ px: 2, pt: 2, pb: 1.25, textAlign: 'center' }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: '#5A5A5A',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.8em',
            lineHeight: 1.4,
          }}
        >
          {product.product_name}
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="baseline" justifyContent="center">
          <Typography variant="subtitle2" sx={{ color: landingTokens.GOLD_DARK, fontWeight: 700 }}>
            {fCurrency(product.sale_price ?? product.original_price)}
          </Typography>
          {hasSale && (
            <Typography
              variant="caption"
              sx={{ color: landingTokens.INK_MUTED, textDecoration: 'line-through' }}
            >
              {fCurrency(product.original_price)}
            </Typography>
          )}
        </Stack>
      </Stack>

      {/* Bottom corners: rating · sold */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: 2,
          pb: 1.5,
          pt: 0.75,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.25}>
          <StarRoundedIcon sx={{ fontSize: 14, color: '#FFB400' }} />
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: landingTokens.INK }}>
            {product.rating ?? 5}
          </Typography>
          <Typography sx={{ fontSize: 11, color: landingTokens.INK_MUTED }}>
            ({product.review_count ?? 3})
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: 11, color: landingTokens.INK_MUTED }}>
          Đã bán {product.sold ?? 200}
        </Typography>
      </Stack>
    </Box>
  );
}
