// src/views/admin/gift-card/gift-card-gallery-view.jsx
// Gift Card gallery — thiết kế mô phỏng thẻ Visa Platinum/Gold/Diamond thật ngoài đời.

'use client';

import { useMemo, useState } from 'react';

import {
  Box, Button, Chip, Grid, InputAdornment, Stack, TextField, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fmtVND, fmtDate } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { m, fadeIn, staggerContainer, useCountUp } from 'src/views/admin/_shared/motion';

import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/common/page-header';
import { mockGiftCards } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const giftCardsList = mockGiftCards;
// ────────── Tier palette — gradient metallic kiểu Visa thật
function tierOf(face) {
  if (face >= 5_000_000) return {
    name: 'DIAMOND',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #334155 75%, #1e293b 100%)',
    accent: '#B9D4F1', glow: 'rgba(185,212,241,0.4)',
    accentSecondary: '#64748B',
  };
  if (face >= 1_000_000) return {
    name: 'GOLD',
    gradient: 'linear-gradient(135deg, #78350F 0%, #B45309 25%, #D97706 50%, #B45309 75%, #78350F 100%)',
    accent: '#FDE68A', glow: 'rgba(253,230,138,0.4)',
    accentSecondary: '#78350F',
  };
  if (face >= 500_000) return {
    name: 'PLATINUM',
    gradient: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 25%, #3B82F6 50%, #1E40AF 75%, #1E3A8A 100%)',
    accent: '#BFDBFE', glow: 'rgba(191,219,254,0.4)',
    accentSecondary: '#1E3A8A',
  };
  return {
    name: 'SILVER',
    gradient: 'linear-gradient(135deg, #374151 0%, #4B5563 25%, #6B7280 50%, #4B5563 75%, #374151 100%)',
    accent: '#E5E7EB', glow: 'rgba(229,231,235,0.3)',
    accentSecondary: '#374151',
  };
}

const STATUS_META = {
  active:   { label: 'Đang dùng',    color: 'success' },
  redeemed: { label: 'Đã dùng hết',  color: 'info' },
  expired:  { label: 'Hết hạn',       color: 'default' },
  void:     { label: 'Huỷ',           color: 'error' },
};

// Format mã card 16 chữ số kiểu Visa: •••• •••• •••• 1234
function formatCardNumber(code) {
  const digits = code.replace(/\D/g, '').padStart(16, '0').slice(-16);
  return [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12), digits.slice(12, 16)].join(' ')
    .replace(/0/g, '•'); // mask zeros as dots for the first 12
}

// Lấy 4 số cuối riêng để show lớn
function last4(code) {
  const digits = code.replace(/\D/g, '');
  return digits.slice(-4).padStart(4, '0');
}

// Expiry MM/YY
function expiryMMYY(iso) {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${yy}`;
}

// ─────────────────── EMV Chip component — mô phỏng chip SIM kim loại
function EmvChip() {
  return (
    <Box
      sx={{
        width: 44, height: 34,
        borderRadius: '5px',
        background: 'linear-gradient(135deg, #FFD54F 0%, #D4AF37 30%, #B8860B 60%, #FFD54F 100%)',
        position: 'relative',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.2)',
        overflow: 'hidden',
      }}
    >
      {/* Horizontal lines (chip contacts) */}
      <Box sx={{
        position: 'absolute', inset: '5px 4px',
        background: `
          linear-gradient(to bottom,
            transparent 0 20%,
            rgba(0,0,0,0.35) 20% 22%,
            transparent 22% 40%,
            rgba(0,0,0,0.35) 40% 42%,
            transparent 42% 60%,
            rgba(0,0,0,0.35) 60% 62%,
            transparent 62% 80%,
            rgba(0,0,0,0.35) 80% 82%,
            transparent 82% 100%
          )
        `,
      }} />
      {/* Vertical divider */}
      <Box sx={{
        position: 'absolute', top: '15%', bottom: '15%', left: '50%', width: '1.5px',
        bgcolor: 'rgba(0,0,0,0.35)', transform: 'translateX(-50%)',
      }} />
    </Box>
  );
}

// ─────────────────── Contactless wave — 4 arc đồng tâm
function ContactlessIcon({ color = 'currentColor', size = 22 }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      sx={{ width: size, height: size, color, display: 'block' }}
    >
      <path d="M8.5 7a5.5 5.5 0 0 1 0 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M11 5a7.5 7.5 0 0 1 0 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M13.5 3a9.5 9.5 0 0 1 0 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 9a3 3 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </Box>
  );
}

// ─────────────────── Visa-style brand logo mark
function VisaMark({ color = '#FFFFFF' }) {
  return (
    <Typography
      sx={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 22, fontWeight: 900, lineHeight: 1,
        fontStyle: 'italic', letterSpacing: '-0.02em',
        color,
        textShadow: '0 1px 2px rgba(0,0,0,0.25)',
      }}
    >
      PNJ
      <Box component="span" sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, ml: 0.5, fontStyle: 'normal', opacity: 0.85 }}>
        GIFT
      </Box>
    </Typography>
  );
}

// ========== Gift card — thiết kế Visa thật ==========

function GiftCardVisa({ card }) {
  const [flipped, setFlipped] = useState(false);
  const tier = tierOf(card.face_value);
  const usedPct = ((card.face_value - card.balance) / card.face_value) * 100;
  const daysLeft = Math.ceil((new Date(card.expires_at) - Date.now()) / (1000 * 60 * 60 * 24));
  const cardholder = (card.purchaser_name || 'PNJ CUSTOMER').toUpperCase();

  return (
    <m.div variants={fadeIn} style={{ perspective: 1400 }}>
      <m.div
        onClick={() => setFlipped(!flipped)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 15 }}
        whileHover={{ y: -6, scale: 1.015 }}
        style={{
          position: 'relative',
          aspectRatio: '85.6 / 54',  // ISO/IEC 7810 ID-1
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
          willChange: 'transform',
        }}
      >
        {/* ═══════════ MẶT TRƯỚC ═══════════ */}
        <Box
          sx={{
            position: 'absolute', inset: 0,
            borderRadius: '10px',
            background: tier.gradient,
            color: 'common.white',
            backfaceVisibility: 'hidden',
            boxShadow: `
              0 12px 32px -8px ${tier.glow},
              0 0 0 1px rgba(255,255,255,0.08) inset,
              0 1px 0 rgba(255,255,255,0.3) inset
            `,
            overflow: 'hidden',
          }}
        >
          {/* Metallic finish — subtle brushed texture */}
          <Box sx={{
            position: 'absolute', inset: 0, opacity: 0.08,
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 2px)',
            pointerEvents: 'none',
          }} />
          {/* Diagonal shine */}
          <Box sx={{
            position: 'absolute', top: '-30%', left: '-20%', width: '140%', height: '160%',
            background: 'linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0.08) 52%, transparent 62%)',
            pointerEvents: 'none',
          }} />
          {/* Corner shine */}
          <Box sx={{
            position: 'absolute', top: '-20%', right: '-20%', width: '60%', height: '60%',
            background: `radial-gradient(circle, ${tier.accent}1a 0%, transparent 60%)`,
            pointerEvents: 'none',
          }} />

          <Box sx={{ position: 'relative', height: '100%', p: '14px 16px', display: 'flex', flexDirection: 'column' }}>
            {/* Top row — brand + contactless */}
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
              <Box>
                <VisaMark />
                <Typography sx={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 2, opacity: 0.75, mt: 0.125 }}>
                  {tier.name} GIFT CARD
                </Typography>
              </Box>
              <ContactlessIcon color={tier.accent} size={20} />
            </Stack>

            {/* Chip + hologram row */}
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
              <EmvChip />
              {/* Hologram patch */}
              <Box
                sx={{
                  width: 32, height: 24, borderRadius: '3px',
                  background: `
                    linear-gradient(135deg,
                      rgba(255,255,255,0.15) 0%,
                      ${tier.accent}30 25%,
                      rgba(255,180,180,0.2) 50%,
                      ${tier.accent}30 75%,
                      rgba(255,255,255,0.15) 100%
                    )
                  `,
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{
                  position: 'absolute', inset: 0,
                  background: 'repeating-linear-gradient(45deg, transparent 0 2px, rgba(255,255,255,0.2) 2px 3px)',
                }} />
              </Box>
            </Stack>

            {/* Card number — 4 groups */}
            <Typography
              sx={{
                mt: 'auto', mb: 1,
                fontFamily: '"Courier New", ui-monospace, monospace',
                fontSize: 17, fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#FFFFFF',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {formatCardNumber(card.code)}
            </Typography>

            {/* Bottom row — valid thru + cardholder + face value */}
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={1}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 7.5, letterSpacing: 1.2, opacity: 0.7, fontWeight: 700 }}>
                  VALID THRU
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Courier New", monospace', fontSize: 12.5, fontWeight: 700,
                    letterSpacing: '0.05em', mt: 0.125,
                  }}
                >
                  {expiryMMYY(card.expires_at)}
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    mt: 0.5, color: '#FFFFFF',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {cardholder}
                </Typography>
              </Box>

              {/* Face value — stylish */}
              <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
                <Typography sx={{ fontSize: 7.5, letterSpacing: 1.2, opacity: 0.7, fontWeight: 700 }}>
                  FACE VALUE
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 14, fontWeight: 800, letterSpacing: '0.02em',
                    color: tier.accent,
                    textShadow: '0 1px 2px rgba(0,0,0,0.25)',
                    mt: 0.125,
                  }}
                >
                  {fmtVND(card.face_value)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>

        {/* ═══════════ MẶT SAU ═══════════ */}
        <Box
          sx={{
            position: 'absolute', inset: 0,
            borderRadius: '10px',
            background: tier.gradient,
            color: 'common.white',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: `0 12px 32px -8px ${tier.glow}, 0 0 0 1px rgba(255,255,255,0.08) inset`,
            overflow: 'hidden',
          }}
        >
          {/* Subtle metallic */}
          <Box sx={{
            position: 'absolute', inset: 0, opacity: 0.08,
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 2px)',
            pointerEvents: 'none',
          }} />

          {/* Magnetic stripe */}
          <Box sx={{
            position: 'absolute', top: 18, left: 0, right: 0,
            height: 42, bgcolor: '#000',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
          }} />

          <Box sx={{ position: 'relative', pt: '74px', px: 2 }}>
            {/* Signature + CVV box */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  flex: 1,
                  height: 26, borderRadius: '2px',
                  bgcolor: '#F5F5F5',
                  display: 'flex', alignItems: 'center', px: 1,
                  background: `repeating-linear-gradient(135deg, #F5F5F5 0 8px, #E5E7EB 8px 16px)`,
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)',
                }}
              >
                <Typography sx={{ fontFamily: 'cursive, "Segoe Script", "Brush Script MT"', fontSize: 11, color: '#111827', fontStyle: 'italic' }}>
                  {cardholder.split(' ').slice(-1)[0] || 'PNJ'}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 50, height: 26, borderRadius: '2px',
                  bgcolor: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)',
                }}
              >
                <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: 12, fontWeight: 700, color: '#111827', letterSpacing: '0.1em' }}>
                  {last4(card.code)}
                </Typography>
              </Box>
            </Stack>

            {/* CVV / balance info */}
            <Stack direction="row" alignItems="center" sx={{ mt: 1.25 }} spacing={1.5}>
              {/* QR micro code */}
              <Box sx={{
                width: 42, height: 42, borderRadius: '2px',
                background: 'repeating-conic-gradient(white 0 25%, #111827 0 50%) 50% / 6px 6px',
                border: '2px solid white',
                flexShrink: 0,
              }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 7.5, letterSpacing: 1.2, opacity: 0.7, fontWeight: 700 }}>
                  BALANCE
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Courier New", monospace', fontSize: 13, fontWeight: 800,
                    color: tier.accent, textShadow: '0 1px 2px rgba(0,0,0,0.3)', mt: 0.125,
                  }}
                >
                  {fmtVND(card.balance)}
                </Typography>
                <Box sx={{
                  mt: 0.5, height: 3, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                }}>
                  <Box sx={{
                    height: '100%',
                    width: `${100 - usedPct}%`,
                    background: `linear-gradient(90deg, ${tier.accent}, ${tier.accent}dd)`,
                    transition: 'width 1s ease',
                  }} />
                </Box>
              </Box>
            </Stack>

            {/* Terms + security info */}
            <Typography
              sx={{
                position: 'absolute', bottom: 8, left: 16, right: 16,
                fontSize: 6, lineHeight: 1.4, opacity: 0.55,
                letterSpacing: 0.3,
              }}
            >
              Thẻ không có giá trị quy đổi ra tiền mặt. Sử dụng theo điều khoản
              PNJ Gift Card. Mất thẻ vui lòng gọi hotline <b>1800-PNJ</b>.
            </Typography>
          </Box>
        </Box>
      </m.div>

      {/* Status strip below card */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.25, px: 0.5 }}>
        <Chip
          label={STATUS_META[card.status].label}
          size="small"
          color={STATUS_META[card.status].color}
          variant="filled"
          sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 10.5 }}>
          {Math.floor(usedPct)}% đã dùng · Hết hạn {fmtDate(card.expires_at)}
        </Typography>
        <Box sx={{ flex: 1 }} />
        {daysLeft > 0 && daysLeft < 30 && (
          <Chip label={`Còn ${daysLeft}d`} size="small" sx={{ bgcolor: 'error.main', color: 'white', height: 18, fontSize: 9, fontWeight: 700 }} />
        )}
        <Tooltip title="Click thẻ để lật">
          <Iconify icon="solar:refresh-circle-linear" width={14} sx={{ color: 'text.disabled' }} />
        </Tooltip>
      </Stack>
    </m.div>
  );
}

// ========== Main ==========

export function GiftCardGalleryView({ embedded = false } = {}) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [tier,   setTier]   = useState('all');

  const totalValue = useMemo(() => giftCardsList.reduce((s, c) => s + c.face_value, 0), []);
  const activeCount = useMemo(() => giftCardsList.filter((c) => c.status === 'active').length, []);

  const animatedTotal = useCountUp(totalValue, { duration: 1500 });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return giftCardsList.filter((c) => {
      if (q && !c.code.toLowerCase().includes(q) && !c.purchaser_name.toLowerCase().includes(q) && !c.recipient_phone.includes(q)) return false;
      if (status !== 'all' && c.status !== status) return false;
      if (tier !== 'all' && tierOf(c.face_value).name !== tier.toUpperCase()) return false;
      return true;
    });
  }, [search, status, tier]);

  const Wrap = embedded ? Box : DashboardContent;
  const wrapProps = embedded ? {} : { disablePadding: true };
  return (
    <Wrap {...wrapProps}>
      {!embedded && (
        <PageHeader
          title="Phiếu quà tặng (Gift Card)"
          subtitle="Mô phỏng thẻ Visa thật · click 1 thẻ để lật xem PIN/CVV mặt sau"
          breadcrumbs={[{ label: 'PNJ Admin', href: adminPaths.dashboard }, { label: 'Gift Card' }]}
          actions={
            <Button variant="contained" size="small" startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
              sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
              Phát hành mới
            </Button>
          }
        />
      )}

      {/* Hero stats */}
      <Box sx={{ mx: { xs: 2, md: 3 }, mt: 2 }}>
        <Box
          sx={{
            borderRadius: 1,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: 'common.white',
            p: { xs: 2, md: 2.5 },
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.15), transparent 70%)' }} />
          <Stack direction="row" alignItems="center" spacing={3} flexWrap="wrap" sx={{ rowGap: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: 'rgba(255,215,0,0.15)', display: 'grid', placeItems: 'center' }}>
                <Iconify icon="solar:gift-bold" width={22} sx={{ color: '#FFD700' }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: 0.4 }}>TỔNG GIÁ TRỊ</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 22, fontVariantNumeric: 'tabular-nums' }}>{fmtVND(animatedTotal)}</Typography>
              </Box>
            </Stack>
            <Box sx={{ borderLeft: 1, borderColor: 'rgba(255,255,255,0.15)', height: 40 }} />
            {[
              { label: 'Tổng',       value: giftCardsList.length, color: '#3B82F6' },
              { label: 'Đang dùng',  value: activeCount,              color: '#10B981' },
              { label: 'Hết hạn',    value: giftCardsList.filter((c) => c.status === 'expired').length, color: '#F59E0B' },
            ].map((s) => (
              <Stack key={s.label} direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: s.color }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                  {s.label}: <b style={{ color: '#fff' }}>{s.value}</b>
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Filters */}
      <Stack
        direction="row" spacing={1.5} alignItems="center" flexWrap="wrap"
        sx={{ px: { xs: 2, md: 3 }, py: 2, rowGap: 1 }}
      >
        <TextField
          size="small" sx={{ minWidth: 220, flex: 1 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm mã / người mua / SĐT…"
          InputProps={{ startAdornment: <InputAdornment position="start"><Iconify icon="solar:magnifer-linear" width={15} /></InputAdornment> }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>HẠNG:</Typography>
        {['all', 'Silver', 'Platinum', 'Gold', 'Diamond'].map((t) => (
          <Chip
            key={t}
            label={t === 'all' ? 'Tất cả' : t}
            size="small"
            color={tier === t ? 'primary' : 'default'}
            variant={tier === t ? 'filled' : 'outlined'}
            onClick={() => setTier(t)}
          />
        ))}
        <Box sx={{ borderLeft: 1, borderColor: 'divider', height: 24, mx: 0.5 }} />
        {['all', 'active', 'redeemed', 'expired', 'void'].map((s) => (
          <Chip
            key={s}
            label={s === 'all' ? 'Mọi TT' : STATUS_META[s].label}
            size="small"
            color={status === s ? STATUS_META[s]?.color ?? 'primary' : 'default'}
            variant={status === s ? 'filled' : 'outlined'}
            onClick={() => setStatus(s)}
          />
        ))}
        <Box sx={{ flex: 1 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {filtered.length}/{giftCardsList.length}
        </Typography>
      </Stack>

      {/* Gallery */}
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 3, minHeight: '50vh', bgcolor: 'grey.50' }}>
        {filtered.length === 0 ? (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 10, color: 'text.disabled' }}>
            <Iconify icon="solar:gift-linear" width={40} />
            <Typography variant="body2">Không có gift card phù hợp</Typography>
          </Stack>
        ) : (
          <m.div variants={staggerContainer(0.05, 0.1)} initial="hidden" animate="show">
            <Grid container spacing={2.5}>
              {filtered.map((c) => (
                <Grid key={c.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <GiftCardVisa card={c} />
                </Grid>
              ))}
            </Grid>
          </m.div>
        )}
      </Box>
    </Wrap>
  );
}
