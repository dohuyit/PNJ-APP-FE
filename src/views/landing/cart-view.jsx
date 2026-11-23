'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

import { fCurrency } from 'src/utils/format-number';

import {
  landingTokens,
  sxSharpBtnContained,
  sxSharpBtnCta,
  sxSharpBtnOutlined,
  sxSharpInput,
} from 'src/theme/landing';
import Wireframe from 'src/sections/landing/components/Wireframe';

// Stubs — mock removed; data rỗng cho tới khi view migrate sang useGetXxx hook.
const newProductsMock = [];

const initialCart = newProductsMock.slice(0, 3).map((p, i) => ({
  id: 1000 + i,
  product_name: p.product_name,
  product_image: p.product_image,
  price_variant: p.sale_price,
  original_price: p.original_price,
  size: ['6', '7', '8', '9', '10'][i % 5],
  quantity: 1,
}));

const sizeOptions = ['6', '7', '8', '9', '10', '11', '12'];

const TRUST_BADGES = [
  { Icon: LocalShippingOutlinedIcon, label: 'Giao 3 giờ', desc: 'Nội thành TP.HCM & Hà Nội' },
  { Icon: AutorenewOutlinedIcon, label: 'Đổi size 48h', desc: 'Miễn phí tại mọi cửa hàng' },
  { Icon: VerifiedUserOutlinedIcon, label: 'Bảo hành trọn đời', desc: 'Siêu âm, đánh bóng miễn phí' },
];

export function CartView() {
  const [cart, setCart] = useState(initialCart);
  const [selected, setSelected] = useState(() => new Set(initialCart.map((c) => c.id)));
  const [promo, setPromo] = useState('');
  // shortcut: hardcoded 200K discount for any non-empty code; upgrade when voucher API lands.
  const [promoApplied, setPromoApplied] = useState(0);

  const activeItems = useMemo(
    () => cart.filter((c) => selected.has(c.id)),
    [cart, selected]
  );
  const subtotal = useMemo(
    () => activeItems.reduce((s, c) => s + c.price_variant * c.quantity, 0),
    [activeItems]
  );
  const originalTotal = useMemo(
    () =>
      activeItems.reduce(
        (s, c) => s + (c.original_price ?? c.price_variant) * c.quantity,
        0
      ),
    [activeItems]
  );
  const savedFromSale = originalTotal - subtotal;
  const total = Math.max(0, subtotal - promoApplied);

  const allSelected = cart.length > 0 && selected.size === cart.length;
  const indeterminate = selected.size > 0 && selected.size < cart.length;

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(cart.map((c) => c.id)));
  const toggleOne = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const updateQty = (id, delta) =>
    setCart((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, quantity: Math.max(1, Math.min(10, c.quantity + delta)) } : c
      )
    );
  const updateSize = (id, size) =>
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, size } : c)));
  const removeItem = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };
  const removeSelected = () => {
    setCart((prev) => prev.filter((c) => !selected.has(c.id)));
    setSelected(new Set());
  };
  const applyPromo = () => {
    if (promo.trim()) setPromoApplied(200000);
  };
  const clearPromo = () => {
    setPromo('');
    setPromoApplied(0);
  };

  if (cart.length === 0) return <EmptyCart />;

  return (
    <>
      {/* Hero header */}
      <Box
        sx={{
          bgcolor: landingTokens.NEUTRAL,
          borderBottom: `1px solid ${landingTokens.HAIRLINE}`,
          py: { xs: 5, md: 7 },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1155 }}>
          <Breadcrumbs separator="›" sx={{ fontSize: 13, color: landingTokens.INK_MUTED, mb: 2 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Trang chủ
            </Link>
            <Typography variant="caption" sx={{ color: landingTokens.INK, fontSize: 13 }}>
              Giỏ hàng
            </Typography>
          </Breadcrumbs>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ sm: 'flex-end' }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: landingTokens.GOLD_DARK,
                  letterSpacing: '0.24em',
                  fontWeight: 700,
                }}
              >
                GIỎ HÀNG CỦA BẠN
              </Typography>
              <Typography
                sx={{
                  fontFamily: landingTokens.FONT_SERIF,
                  fontSize: { xs: 34, md: 52 },
                  fontWeight: 600,
                  mt: 0.5,
                  lineHeight: 1.1,
                  color: landingTokens.INK,
                }}
              >
                Đơn hàng sẵn sàng
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: landingTokens.INK_MUTED, mt: 1.5 }}
              >
                {cart.length} sản phẩm · Chọn những món bạn muốn thanh toán
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/"
              startIcon={<ArrowBackIcon />}
              sx={{
                color: landingTokens.INK,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { color: landingTokens.PRIMARY, bgcolor: 'transparent' },
              }}
            >
              Tiếp tục mua sắm
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ maxWidth: 1155, py: { xs: 5, md: 8 } }}>
        <Grid container spacing={{ xs: 4, md: 5 }}>
          {/* Left: items */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Toolbar */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                pb: 2.5,
                mb: 3,
                borderBottom: `1px solid ${landingTokens.HAIRLINE}`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={indeterminate}
                  onChange={toggleAll}
                  sx={{
                    p: 0.5,
                    color: landingTokens.GOLD_DARK,
                    '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                      color: landingTokens.PRIMARY,
                    },
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Chọn tất cả ({selected.size}/{cart.length})
                </Typography>
              </Stack>
              <Button
                onClick={removeSelected}
                disabled={selected.size === 0}
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                sx={{
                  color: landingTokens.INK_MUTED,
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': { color: landingTokens.CTA, bgcolor: 'transparent' },
                }}
              >
                Xoá đã chọn
              </Button>
            </Stack>

            {/* Items */}
            <Stack spacing={2.5}>
              {cart.map((item) => {
                const isSelected = selected.has(item.id);
                const hasSale =
                  item.original_price && item.original_price !== item.price_variant;
                return (
                  <Box
                    key={item.id}
                    sx={{
                      position: 'relative',
                      p: { xs: 2, md: 3 },
                      bgcolor: landingTokens.SURFACE,
                      border: `1px solid ${isSelected ? landingTokens.GOLD : landingTokens.HAIRLINE}`,
                      transition: 'border-color 220ms ease, box-shadow 220ms ease',
                      '&:hover': {
                        borderColor: landingTokens.GOLD,
                        boxShadow: '0 6px 20px rgba(0,52,104,0.06)',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={{ xs: 1.5, md: 2.5 }} alignItems="flex-start">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleOne(item.id)}
                        sx={{
                          p: 0,
                          mt: 0,
                          color: landingTokens.GOLD_DARK,
                          '&.Mui-checked': { color: landingTokens.PRIMARY },
                        }}
                      />
                      <Box
                        component={Link}
                        href={`/product/${item.id}`}
                        sx={{
                          position: 'relative',
                          flexShrink: 0,
                          width: { xs: 96, md: 128 },
                          height: { xs: 96, md: 128 },
                          overflow: 'hidden',
                          textDecoration: 'none',
                          border: `1px solid ${landingTokens.HAIRLINE}`,
                        }}
                      >
                        <Wireframe label={`SP ${item.id}`} iconSize="small" />
                        {hasSale && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 6,
                              left: 6,
                              bgcolor: landingTokens.CTA,
                              color: '#FFFFFF',
                              fontSize: 9,
                              fontWeight: 800,
                              letterSpacing: '0.1em',
                              px: 0.75,
                              py: 0.25,
                              lineHeight: 1.4,
                            }}
                          >
                            SALE
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          component={Link}
                          href={`/product/${item.id}`}
                          sx={{
                            fontWeight: 600,
                            lineHeight: 1.45,
                            fontSize: { xs: 14, md: 15 },
                            color: landingTokens.INK,
                            textDecoration: 'none',
                            display: 'block',
                            mb: 0.5,
                            '&:hover': { color: landingTokens.PRIMARY },
                          }}
                        >
                          {item.product_name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: landingTokens.INK_MUTED,
                            display: 'block',
                            mb: 2,
                            letterSpacing: '0.04em',
                          }}
                        >
                          Mã PNJ{item.id} · Vàng 18K
                        </Typography>

                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={{ xs: 1.5, sm: 3 }}
                          alignItems={{ sm: 'center' }}
                          sx={{ mb: 2 }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED }}>
                              Size
                            </Typography>
                            <Select
                              value={item.size}
                              onChange={(e) => updateSize(item.id, e.target.value)}
                              size="small"
                              sx={{
                                minWidth: 72,
                                height: 30,
                                fontSize: 13,
                                '& .MuiSelect-select': { py: 0, pr: '28px !important' },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: landingTokens.HAIRLINE,
                                  borderRadius: 0,
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: landingTokens.GOLD,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: landingTokens.PRIMARY,
                                },
                              }}
                            >
                              {sizeOptions.map((s) => (
                                <MenuItem key={s} value={s}>
                                  {s}
                                </MenuItem>
                              ))}
                            </Select>
                          </Stack>

                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="caption" sx={{ color: landingTokens.INK_MUTED }}>
                              Số lượng
                            </Typography>
                            <Stack
                              direction="row"
                              alignItems="center"
                              sx={{
                                border: `1px solid ${landingTokens.HAIRLINE}`,
                                height: 30,
                              }}
                            >
                              <IconButton
                                onClick={() => updateQty(item.id, -1)}
                                size="small"
                                disabled={item.quantity <= 1}
                                sx={{ borderRadius: 0, width: 28, height: '100%' }}
                                aria-label="Giảm"
                              >
                                <RemoveIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <Typography
                                sx={{
                                  minWidth: 32,
                                  textAlign: 'center',
                                  fontSize: 13,
                                  fontWeight: 600,
                                }}
                              >
                                {item.quantity}
                              </Typography>
                              <IconButton
                                onClick={() => updateQty(item.id, 1)}
                                size="small"
                                disabled={item.quantity >= 10}
                                sx={{ borderRadius: 0, width: 28, height: '100%' }}
                                aria-label="Tăng"
                              >
                                <AddIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Stack>

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack direction="row" alignItems="baseline" spacing={1.5}>
                            <Typography
                              sx={{
                                color: landingTokens.CTA,
                                fontWeight: 700,
                                fontSize: { xs: 16, md: 18 },
                              }}
                            >
                              {fCurrency(item.price_variant * item.quantity)}
                            </Typography>
                            {hasSale && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: landingTokens.INK_MUTED,
                                  textDecoration: 'line-through',
                                }}
                              >
                                {fCurrency(item.original_price * item.quantity)}
                              </Typography>
                            )}
                          </Stack>
                          <IconButton
                            onClick={() => removeItem(item.id)}
                            size="small"
                            aria-label="Xoá"
                            sx={{
                              color: landingTokens.INK_MUTED,
                              '&:hover': {
                                color: landingTokens.CTA,
                                bgcolor: 'rgba(173,42,54,0.06)',
                              },
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>

            {/* Trust badges */}
            <Box
              sx={{
                mt: 4,
                p: 3,
                bgcolor: landingTokens.NEUTRAL,
                border: `1px solid ${landingTokens.HAIRLINE}`,
              }}
            >
              <Grid container spacing={2}>
                {TRUST_BADGES.map(({ Icon, label, desc }) => (
                  <Grid key={label} size={{ xs: 12, sm: 4 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Icon sx={{ color: landingTokens.GOLD_DARK, fontSize: 30 }} />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}
                        >
                          {label}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: landingTokens.INK_MUTED, fontSize: 11 }}
                        >
                          {desc}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right: summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 104 } }}>
              <Box
                sx={{
                  border: `1px solid ${landingTokens.HAIRLINE}`,
                  bgcolor: landingTokens.SURFACE,
                  p: { xs: 3, md: 4 },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="baseline"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: landingTokens.GOLD_DARK,
                      letterSpacing: '0.2em',
                      fontWeight: 700,
                    }}
                  >
                    TÓM TẮT ĐƠN HÀNG
                  </Typography>
                  <Box sx={{ width: 32, height: 1, bgcolor: landingTokens.GOLD }} />
                </Stack>

                {/* Promo */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: landingTokens.INK_MUTED,
                      display: 'block',
                      mb: 1,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}
                  >
                    MÃ GIẢM GIÁ
                  </Typography>
                  {promoApplied > 0 ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        p: 1.5,
                        bgcolor: 'rgba(196,140,70,0.08)',
                        border: `1px dashed ${landingTokens.GOLD}`,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocalOfferOutlinedIcon
                          fontSize="small"
                          sx={{ color: landingTokens.GOLD_DARK }}
                        />
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 700, display: 'block' }}
                          >
                            {promo.toUpperCase()}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: landingTokens.INK_MUTED, fontSize: 11 }}
                          >
                            Đã áp dụng -{fCurrency(promoApplied)}
                          </Typography>
                        </Box>
                      </Stack>
                      <IconButton onClick={clearPromo} size="small" aria-label="Huỷ mã">
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <TextField
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        placeholder="Nhập mã giảm giá"
                        size="small"
                        fullWidth
                        sx={sxSharpInput}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalOfferOutlinedIcon
                                fontSize="small"
                                sx={{ color: landingTokens.GOLD_DARK }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        variant="outlined"
                        onClick={applyPromo}
                        disabled={!promo.trim()}
                        sx={{
                          ...sxSharpBtnOutlined,
                          px: 2,
                          py: 0,
                          minHeight: 40,
                          flexShrink: 0,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Áp dụng
                      </Button>
                    </Stack>
                  )}
                </Box>

                <Divider sx={{ mb: 3, borderColor: landingTokens.HAIRLINE }} />

                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>
                      Tạm tính ({selected.size} sản phẩm)
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {fCurrency(subtotal)}
                    </Typography>
                  </Stack>
                  {savedFromSale > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>
                        Tiết kiệm khuyến mãi
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: landingTokens.GOLD_DARK, fontWeight: 600 }}
                      >
                        -{fCurrency(savedFromSale)}
                      </Typography>
                    </Stack>
                  )}
                  {promoApplied > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>
                        Mã giảm giá
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: landingTokens.GOLD_DARK, fontWeight: 600 }}
                      >
                        -{fCurrency(promoApplied)}
                      </Typography>
                    </Stack>
                  )}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: landingTokens.INK_MUTED }}>
                      Phí vận chuyển
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: landingTokens.GOLD_DARK, fontWeight: 600 }}
                    >
                      Miễn phí
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ mb: 3, borderColor: landingTokens.HAIRLINE }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="baseline"
                  sx={{ mb: 4 }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Tổng cộng
                  </Typography>
                  <Typography
                    sx={{
                      color: landingTokens.PRIMARY,
                      fontWeight: 700,
                      fontSize: { xs: 22, md: 26 },
                    }}
                  >
                    {fCurrency(total)}
                  </Typography>
                </Stack>

                <Button
                  component={Link}
                  href="/checkout"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={selected.size === 0}
                  endIcon={<ArrowForwardIcon />}
                  sx={sxSharpBtnCta}
                >
                  Tiến hành thanh toán
                </Button>

                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ mt: 2 }}
                >
                  <LockOutlinedIcon
                    sx={{ fontSize: 14, color: landingTokens.INK_MUTED }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: landingTokens.INK_MUTED }}
                  >
                    Thanh toán bảo mật SSL 256-bit
                  </Typography>
                </Stack>

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 2,
                    textAlign: 'center',
                    color: landingTokens.INK_MUTED,
                    lineHeight: 1.6,
                    px: 1,
                  }}
                >
                  Hỗ trợ trả góp 0% lãi suất với đơn từ 3 triệu
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

function EmptyCart() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 10, md: 15 }, textAlign: 'center' }}>
      <Box
        sx={{
          width: 128,
          height: 128,
          borderRadius: '50%',
          bgcolor: landingTokens.NEUTRAL,
          display: 'grid',
          placeItems: 'center',
          mx: 'auto',
          mb: 4,
          border: `1px solid ${landingTokens.GOLD}`,
        }}
      >
        <ShoppingBagOutlinedIcon
          sx={{ fontSize: 56, color: landingTokens.GOLD_DARK }}
        />
      </Box>
      <Typography
        variant="overline"
        sx={{ color: landingTokens.GOLD_DARK, letterSpacing: '0.22em' }}
      >
        GIỎ HÀNG
      </Typography>
      <Typography
        sx={{
          fontFamily: landingTokens.FONT_SERIF,
          fontSize: { xs: 28, md: 36 },
          fontWeight: 500,
          mt: 1,
          mb: 2,
          lineHeight: 1.2,
        }}
      >
        Giỏ hàng đang trống
      </Typography>
      <Typography
        sx={{ color: landingTokens.INK_MUTED, mb: 5, lineHeight: 1.7 }}
      >
        Khám phá bộ sưu tập và thêm những món bạn yêu thích.
      </Typography>
      <Button
        component={Link}
        href="/"
        variant="contained"
        sx={sxSharpBtnContained}
        size="large"
        endIcon={<ArrowForwardIcon />}
      >
        Bắt đầu mua sắm
      </Button>
    </Container>
  );
}
