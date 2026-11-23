// src/utils/format.js — VND, date, number helpers (append to existing utils; or new file)
import dayjs from 'dayjs';

export const fmtVND = (n) => {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('vi-VN') + ' ₫';
};

export const fmtNumber = (n) => {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('vi-VN');
};

export const fmtDate = (v) => (v ? dayjs(v).format('DD/MM/YYYY') : '—');
export const fmtDateTime = (v) => (v ? dayjs(v).format('HH:mm · DD/MM/YYYY') : '—');
export const fmtRelative = (v) => {
  if (!v) return '—';
  const d = dayjs(v);
  const diff = dayjs().diff(d, 'hour');
  if (diff < 1) return 'Vừa xong';
  if (diff < 24) return `${diff} giờ trước`;
  if (diff < 24 * 7) return `${Math.floor(diff / 24)} ngày trước`;
  return d.format('DD/MM/YYYY');
};
