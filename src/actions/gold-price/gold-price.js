// src/actions/gold-price/gold-price.js
// Wrapper cho API giá vàng chính thức của PNJ.
// Endpoint: https://edge-cf-api.pnj.io/ecom-frontend/v3/get-gold-price (CORS-enabled, không cần key).
//
// Response shape:
//   {
//     updated_text: "Giá vàng ngày: 13/11/2026 11:11:31",
//     locations: [
//       { name: "TPHCM" | "Hà Nội" | ... | "Giá vàng nữ trang" | "Giá vàng nguyên liệu mua ngoài",
//         gold_type: [ { name, gia_ban, gia_mua, updated_at, note, color_note } ] }
//     ],
//     note: "..."
//   }
//
// gia_ban / gia_mua là string dạng "137.400" (dấu "." = thousand separator,
// đơn vị NGHÌN VND/lượng → ×1000 để ra VND).

import { useMemo } from 'react';
import useSWR from 'swr';

const URL = 'https://edge-cf-api.pnj.io/ecom-frontend/v3/get-gold-price';

// Chỉ giữ 1 vùng "vàng miếng" (các vùng còn lại giá giống hệt) + 2 section đặc biệt.
const PRIMARY_BAR_LOCATION = 'TPHCM';
const JEWELRY_LOCATION = 'Giá vàng nữ trang';
const RAW_LOCATION = 'Giá vàng nguyên liệu mua ngoài';

// ----------------------------------------------------------
// Helpers
// ----------------------------------------------------------

// "137.400" → 137_400_000 VND
function parsePrice(str) {
  if (!str) return 0;
  const digits = String(str).replace(/\./g, '').replace(/,/g, '');
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n * 1000 : 0;
}

// "13/11/2026 08:35:36" → Date
function parseDate(str) {
  if (!str) return null;
  const m = String(str).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (!m) return null;
  const [, d, mo, y, h = '0', mi = '0', s = '0'] = m;
  return new Date(+y, +mo - 1, +d, +h, +mi, +s);
}

// Trích karat từ tên: "Vàng 416 (10K)" → "10K"; "Nhẫn Trơn PNJ 999.9" → "999.9"
function inferKarat(name, groupFallback) {
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch && /k/i.test(parenMatch[1])) return parenMatch[1].toUpperCase();
  const tuoi = name.match(/(999\.9|9999|999|9920|99\.99|99|9[0-9]{2,3})(?!\d)/);
  if (tuoi) return tuoi[1];
  if (groupFallback === 'raw_material') return name; // "99.99" / "99"
  return '24K';
}

function slugCode(location, name) {
  return `${location}__${name}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function groupOf(locationName) {
  if (locationName === JEWELRY_LOCATION) return 'jewelry';
  if (locationName === RAW_LOCATION) return 'raw_material';
  return 'bar';
}

// Fetcher riêng — endpoint external
const extFetcher = async (url) => {
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error(`PNJ gold API ${res.status}`);
  return res.json();
};

const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60_000,
  refreshInterval: 300_000, // 5 phút
  keepPreviousData: true,
};

// ----------------------------------------------------------
// GET giá vàng hiện tại
// ----------------------------------------------------------
export function useGetGoldPrices() {
  const { data, isLoading, error, mutate } = useSWR(URL, extFetcher, swrOptions);

  const memoized = useMemo(() => {
    const locations = data?.locations ?? [];
    const rows = [];

    locations.forEach((loc) => {
      // Vàng miếng: chỉ lấy 1 vùng chính (các vùng khác giá giống)
      if (groupOf(loc.name) === 'bar' && loc.name !== PRIMARY_BAR_LOCATION) return;

      const group = groupOf(loc.name);
      (loc.gold_type ?? []).forEach((g) => {
        rows.push({
          gold_type_code: slugCode(loc.name, g.name),
          gold_type_name: g.name,
          karat_label:    inferKarat(g.name, group),
          group,
          location:       loc.name,
          buy:            parsePrice(g.gia_mua),
          sell:           parsePrice(g.gia_ban),
          change_buy:     0, // API không cung cấp
          change_sell:    0,
          change_pct:     0,
          currency:       'VND',
          note:           g.note || '',
          updated_at:     (parseDate(g.updated_at) ?? new Date()).toISOString(),
        });
      });
    });

    const headerDate = data?.updated_text
      ? parseDate(data.updated_text.replace(/^[^0-9]*/, ''))
      : null;

    return {
      prices:        rows,
      pricesLoading: isLoading,
      pricesError:   error,
      lastUpdated:   headerDate,
      refresh:       mutate,
    };
  }, [data, isLoading, error, mutate]);

  return memoized;
}
