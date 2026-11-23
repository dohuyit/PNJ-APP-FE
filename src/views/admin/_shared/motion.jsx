// src/views/admin/_shared/motion.jsx — framer-motion presets + useCountUp hook
// Dùng `m` component vì <LazyMotion strict> ở root layout cấm `motion.*`

'use client';

import { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';

// Re-export để file gọi chỉ cần import từ đây
export { m, AnimatePresence, LazyMotion, domAnimation };

// ----- Variants presets

export const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const slideUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

export const slideRight = {
  hidden: { opacity: 0, x: -24 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show:   { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 18 } },
};

export const staggerContainer = (stagger = 0.06, delayChildren = 0.08) => ({
  hidden: {},
  show:   { transition: { staggerChildren: stagger, delayChildren } },
});

// ----- Hover effects

export const hoverLift = {
  whileHover: { y: -4, scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 20 } },
  whileTap:   { scale: 0.98 },
};

export const hoverTap = {
  whileHover: { scale: 1.03 },
  whileTap:   { scale: 0.95 },
};

// ----- useCountUp — animated number from 0 → target

export function useCountUp(target, { duration = 1500, decimals = 0, start = 0 } = {}) {
  const [value, setValue] = useState(start);
  const frameRef = useRef(null);
  const startTsRef = useRef(null);

  useEffect(() => {
    startTsRef.current = null;
    cancelAnimationFrame(frameRef.current);

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const step = (ts) => {
      if (!startTsRef.current) startTsRef.current = ts;
      const progress = Math.min((ts - startTsRef.current) / duration, 1);
      const eased = easeOutExpo(progress);
      setValue(start + (target - start) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, start]);

  return decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value);
}

// ----- useRealtimeClock

export function useRealtimeClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
