'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

import { fCurrency } from 'src/utils/format-number';

import { landingTokens, sxSharpBtnContained, sxSharpInput } from 'src/theme/landing';
import Wireframe from 'src/sections/landing/components/Wireframe';

// Stubs — mock removed; data rỗng cho tới khi view migrate sang useGetXxx hook.
const newProductsMock = [];

// Initial wishlist mock — reuse product catalog.
const initialWishlist = newProductsMock.map((p, i) => ({
  ...p,
  added_at: Date.now() - i * 86400000,
}));

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới thêm' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
];

export function WishlistView() {
  const [items, setItems] = useState(initialWishlist);
  const [sort, setSort] = useState('newest');

  const sorted = useMemo(() => {
    const arr = [...items];
    if (sort === 'price_asc') arr.sort((a, b) => a.sale_price - b.sale_price);
    else if (sort === 'price_desc') arr.sort((a, b) => b.sale_price - a.sale_price);
    else arr.sort((a, b) => b.added_at - a.added_at);
    return arr;
  }, [items, sort]);

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const removeAll = () => setItems([]);

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
            SẢN PHẨM YÊU THÍCH
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
          Danh sách bạn đã lưu
        </Typography>
        <Typography sx={{ color: landingTokens.INK_MUTED, mt: 1 }}>
          Tuyển lựa riêng — mua khi cảm hứng gọi tên.
        </Typography>
      </Box>

      {items.length > 0 ? (
        <>
          {/* Toolbar */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ sm: 'center' }}
            spacing={1.5}
            sx={{
              mb: 3,
              pb: 2,
              borderBottom: `1px solid ${landingTokens.HAIRLINE}`,
            }}
          >
            <Typography sx={{ fontSize: 13, color: landingTokens.INK_MUTED }}>
              <Box component="span" sx={{ color: landingTokens.INK, fontWeight: 700 }}>
                {items.length}
              </Box>{' '}
              sản phẩm đã lưu
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                size="small"
                sx={{ ...sxSharpInput, minWidth: 180 }}
              >
                {SORT_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    Sắp xếp: {o.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                onClick={removeAll}
                sx={{
                  fontSize: 12,
                  color: landingTokens.INK_MUTED,
                  textTransform: 'none',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  '&:hover': { color: landingTokens.CTA, bgcolor: 'transparent' },
                }}
              >
                Xoá tất cả
              </Button>
            </Stack>
          </Stack>

          {/* Grid */}
          <Grid container spacing={{ xs: 2, md: 2.5 }}>
            {sorted.map((item) => (
              <Grid key={item.id} size={{ xs: 6, sm: 4 }}>
                <WishlistCard item={item} onRemove={() => remove(item.id)} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <EmptyWishlist />
      )}
    </Box>
  );
}

function WishlistCard({ item, onRemove }) {
  const hasSale = item.original_price && item.sale_price !== item.original_price;
  const discount = hasSale
    ? Math.round(((item.original_price - item.sale_price) / item.original_price) * 100)
    : 0;

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: landingTokens.SURFACE,
        border: `1px solid ${landingTokens.HAIRLINE}`,
        overflow: 'hidden',
        transition: 'border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease',
        '&:hover': {
          borderColor: landingTokens.GOLD,
          boxShadow: '0 12px 32px rgba(26,20,19,0.08)',
          transform: 'translateY(-2px)',
        },
        '&:hover .wl-img': { transform: 'scale(1.04)' },
      }}
    >
      {/* Image */}
      <Box
        component={Link}
        href={`/product/${item.id}`}
        sx={{
          display: 'block',
          position: 'relative',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          bgcolor: landingTokens.NEUTRAL,
        }}
      >
        <Box
          className="wl-img"
          sx={{
            width: '100%',
            height: '100%',
            transition: 'transform 600ms cubic-bezier(.2,.8,.2,1)',
          }}
        >
          <Wireframe label="" iconSize="small" />
        </Box>
        {hasSale && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              bgcolor: landingTokens.CTA,
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.08em',
              px: 0.75,
              py: 0.25,
            }}
          >
            -{discount}%
          </Box>
        )}
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          aria-label="Bỏ khỏi yêu thích"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            bgcolor: 'rgba(255,255,255,0.95)',
            color: landingTokens.CTA,
            boxShadow: '0 2px 8px rgba(26,20,19,0.1)',
            transition: 'transform 180ms ease, background-color 180ms ease',
            '&:hover': {
              bgcolor: '#FFFFFF',
              color: landingTokens.CTA_DARK,
              transform: 'scale(1.08)',
            },
          }}
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ p: { xs: 1.5, md: 2 } }}>
        <Typography
          component={Link}
          href={`/product/${item.id}`}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.8em',
            fontSize: { xs: 12, md: 13 },
            fontWeight: 500,
            color: landingTokens.INK,
            textDecoration: 'none',
            lineHeight: 1.4,
            mb: 1,
            transition: 'color 180ms ease',
            '&:hover': { color: landingTokens.PRIMARY },
          }}
        >
          {item.product_name}
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 1.5 }}>
          <Typography
            sx={{
              color: landingTokens.CTA,
              fontWeight: 800,
              fontSize: { xs: 14, md: 15 },
            }}
          >
            {fCurrency(item.sale_price)}
          </Typography>
          {hasSale && (
            <Typography
              sx={{
                color: landingTokens.INK_MUTED,
                textDecoration: 'line-through',
                fontSize: 11,
              }}
            >
              {fCurrency(item.original_price)}
            </Typography>
          )}
        </Stack>
        <Button
          fullWidth
          size="small"
          startIcon={<AddShoppingCartOutlinedIcon fontSize="small" />}
          sx={{
            bgcolor: landingTokens.INK,
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: 12,
            textTransform: 'none',
            borderRadius: 0,
            py: 1,
            boxShadow: 'none',
            '&:hover': { bgcolor: landingTokens.PRIMARY, boxShadow: 'none' },
          }}
        >
          Thêm vào giỏ
        </Button>
      </Box>
    </Box>
  );
}

function EmptyWishlist() {
  return (
    <Box
      sx={{
        py: 10,
        textAlign: 'center',
        border: `1px dashed ${landingTokens.HAIRLINE}`,
        bgcolor: landingTokens.SURFACE,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: landingTokens.NEUTRAL,
          border: `1px solid ${landingTokens.GOLD}`,
          display: 'grid',
          placeItems: 'center',
          mx: 'auto',
          mb: 2.5,
        }}
      >
        <FavoriteBorderOutlinedIcon sx={{ fontSize: 36, color: landingTokens.GOLD_DARK }} />
      </Box>
      <Typography
        sx={{
          fontFamily: landingTokens.FONT_SERIF,
          fontSize: 22,
          fontWeight: 600,
          color: landingTokens.INK,
          mb: 0.75,
        }}
      >
        Chưa có sản phẩm yêu thích
      </Typography>
      <Typography sx={{ fontSize: 13, color: landingTokens.INK_MUTED, mb: 3, maxWidth: 360, mx: 'auto' }}>
        Chạm biểu tượng trái tim ở sản phẩm bạn thích để lưu lại và xem sau.
      </Typography>
      <Button
        component={Link}
        href="/"
        variant="contained"
        startIcon={<ShoppingBagOutlinedIcon />}
        sx={sxSharpBtnContained}
      >
        Khám phá sản phẩm
      </Button>
    </Box>
  );
}
