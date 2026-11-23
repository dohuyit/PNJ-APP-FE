# PNJ Admin UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full admin UI (layout + list + form + detail) for the PNJ jewelry e‑commerce clone on top of Minimal Kit Next.js 14, using static mock data, matching the design tokens and screen specs from `pnj-style.md` §10–11.

**Architecture:** App Router (Next.js 14) + Material UI v7 + Emotion. Parallel folder split: `app/admin/*`, `app/landing/*`, `sections/admin/*`, `sections/landing/*`, `layouts/admin`, `layouts/landing`. Shared tokens live in `theme/pnj`. One auth provider (JWT) pointing to pnj-be `/auth/login`. All data flows through SWR + Axios wrappers; in this plan every endpoint is backed by `_mock/admin/<module>.js` so pages run without the backend.

**Tech Stack:** Next.js 14 (App Router) · React 18 · MUI v7 · Emotion · dnd-kit (tree, variant grid) · TipTap (rich text) · react-hook-form + Zod · SWR · Axios · Day.js · ApexCharts (gold chart) · Mapbox GL (store map) · Roboto + Playfair Display (Google Fonts via @fontsource).

**Reference:**
- `pnj-be/src/pnj-style.md` §10 (tokens), §11 (screens), §11.2 (shared components), §11.3 (per-module screens), §11.4 (status colors), §11.5 (product form tabs), §11.6 (order detail)
- `pnj-be/src/app/Models/` (56 models for shape reference)
- Minimal Kit defaults: `src/theme/theme-config.js`, `src/layouts/dashboard`, `src/sections/user`

**Naming:** `<module>-<function>.jsx` kebab-case for files; `<Module><Function>` PascalCase for components; `use<Module><Function>` for hooks; `<module>Mock<Dataset>` for mock exports. Example: `product-list-view.jsx` → `ProductListView`, `useProductList`, `productMockList`.

---

## Phase A — Foundation (theme + folders + auth)

### Task A1: Delete `subs` folder

**Files:**
- Delete: `src/subs/` (entire folder)

- [ ] **Step 1: Confirm folder exists**

Run: `ls -la src/subs | head`
Expected: directory listing with `admin`, `components`, `sections`, …

- [ ] **Step 2: Delete folder**

Run: `rm -rf src/subs`

- [ ] **Step 3: Confirm removal**

Run: `ls src/ | grep subs || echo "removed"`
Expected: `removed`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(fe): remove legacy subs folder"
```

---

### Task A2: Create PNJ theme config

**Files:**
- Create: `src/theme/pnj/palette.js`
- Create: `src/theme/pnj/typography.js`
- Create: `src/theme/pnj/status-colors.js`
- Create: `src/theme/pnj/tokens.js`
- Modify: `src/theme/theme-config.js`

- [ ] **Step 1: Write `tokens.js`**

```js
// src/theme/pnj/tokens.js — brand tokens derived from pnj-style.md §10
export const pnjTokens = {
  container: 1152,
  radius: { sm: 6, md: 8 },
  height: { btn: 40, chip: 32, topbar: 56, sidebar: 240, sidebarMini: 64, row: 48 },
  color: {
    primary: '#003468',
    primaryDark: '#143765',
    secondary: '#202E65',
    cta: '#AD2A36',
    gold: '#C48C46',
    sale: '#DC2626',
    link: '#1D4ED8',
    text: '#5A5A5A',
    textStrong: '#282828',
    textHeadingAlt: '#212B36',
    textMuted: '#4D4D4D',
    textDisabled: '#9B9B9B',
    bg: '#FFFFFF',
    bgSoft: '#EEEFF3',
    bgBlueSoft: '#ECF3FB',
    bgGray: '#F2F2F2',
    bgGray2: '#F5F6F8',
    overlay: 'rgba(0,0,0,.35)',
    cardBorder: '#E5E7EB',
  },
};
```

- [ ] **Step 2: Write `palette.js`**

```js
// src/theme/pnj/palette.js — maps PNJ tokens into MUI palette shape
import { pnjTokens } from './tokens';

const { color } = pnjTokens;

export const pnjPalette = {
  primary: {
    lighter: '#D6E4F5',
    light: '#3366B5',
    main: color.primary,
    dark: color.primaryDark,
    darker: '#001833',
    contrastText: '#FFFFFF',
  },
  secondary: {
    lighter: '#D9DEF0',
    light: '#5B6AA8',
    main: color.secondary,
    dark: '#121A3A',
    darker: '#070C1E',
    contrastText: '#FFFFFF',
  },
  info: {
    lighter: '#DBEAFE',
    light: '#60A5FA',
    main: '#2563EB',
    dark: '#1D4ED8',
    darker: '#1E3A8A',
    contrastText: '#FFFFFF',
  },
  success: {
    lighter: '#DCFCE7',
    light: '#4ADE80',
    main: '#16A34A',
    dark: '#15803D',
    darker: '#14532D',
    contrastText: '#FFFFFF',
  },
  warning: {
    lighter: '#FEF3C7',
    light: '#FBBF24',
    main: '#D97706',
    dark: '#B45309',
    darker: '#78350F',
    contrastText: '#FFFFFF',
  },
  error: {
    lighter: '#FEE2E2',
    light: '#F87171',
    main: color.sale,
    dark: '#B91C1C',
    darker: '#7F1D1D',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#FAFBFC',
    100: color.bgGray2,
    200: color.bgGray,
    300: color.cardBorder,
    400: '#C4CDD5',
    500: '#919EAB',
    600: color.textMuted,
    700: '#454F5B',
    800: color.textStrong,
    900: '#141A21',
  },
  common: { black: '#000000', white: '#FFFFFF' },
};
```

- [ ] **Step 3: Write `typography.js`**

```js
// src/theme/pnj/typography.js — font scale from pnj-style.md §10.3 + §11.1
export const pnjFontFamily = {
  primary: 'Roboto Variable',   // 300/400/500/600/700
  secondary: 'Playfair Display', // display / slogan
  footer: 'Open Sans',
};

export const pnjTypography = {
  h1: { fontSize: 32, fontWeight: 700, lineHeight: 1.25 },
  h2: { fontSize: 24, fontWeight: 700, lineHeight: 1.3 },
  h3: { fontSize: 20, fontWeight: 700, lineHeight: 1.5 },
  h4: { fontSize: 18, fontWeight: 600, lineHeight: 1.5 },
  h5: { fontSize: 16, fontWeight: 600, lineHeight: 1.5 },
  h6: { fontSize: 14, fontWeight: 600, lineHeight: 1.5 },
  subtitle1: { fontSize: 16, fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontSize: 14, fontWeight: 500, lineHeight: 1.5 },
  body1: { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: 13, fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.5 },
  overline: { fontSize: 11, fontWeight: 500, lineHeight: 1.5, textTransform: 'uppercase' },
  button: { fontSize: 13, fontWeight: 700, textTransform: 'none' },
};
```

- [ ] **Step 4: Write `status-colors.js`**

```js
// src/theme/pnj/status-colors.js — maps all enum statuses to MUI color keys
// Referenced by StatusBadge. Source: pnj-style.md §11.4.
export const ORDER_STATUS_COLOR = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  ready_for_pickup: 'info',
  shipping: 'info',
  delivered: 'success',
  completed: 'success',
  cancelled: 'default',
  returned: 'error',
};

export const ORDER_STATUS_LABEL = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang chuẩn bị',
  ready_for_pickup: 'Chờ khách nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn tất',
  cancelled: 'Đã huỷ',
  returned: 'Hoàn/trả',
};

export const ORDER_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipping', 'ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['completed', 'cancelled'],
  shipping: ['delivered', 'returned'],
  delivered: ['completed', 'returned'],
  completed: ['returned'],
  cancelled: [],
  returned: [],
};

export const PAYMENT_STATUS_COLOR = {
  pending: 'warning', paid: 'success', partially_paid: 'info', failed: 'error', refunded: 'default',
};

export const PRODUCT_STATUS_COLOR = {
  draft: 'default', active: 'success', inactive: 'warning', out_of_stock: 'error',
};

export const PROMOTION_STATUS_COLOR = {
  draft: 'default', scheduled: 'info', running: 'success', paused: 'warning', ended: 'default',
};

export const LEAD_STATUS_COLOR = {
  new: 'info', contacted: 'warning', converted: 'success', closed: 'default',
};

export const REVIEW_STATUS_COLOR = {
  pending: 'warning', approved: 'success', rejected: 'error', hidden: 'default',
};
```

- [ ] **Step 5: Update `theme-config.js`**

```js
// src/theme/theme-config.js
import { pnjPalette } from './pnj/palette';
import { pnjFontFamily } from './pnj/typography';

export const themeConfig = {
  direction: 'ltr',
  defaultMode: 'light',
  modeStorageKey: 'pnj-theme-mode',
  classesPrefix: 'pnj',
  fontFamily: pnjFontFamily,
  palette: pnjPalette,
  cssVariables: {
    cssVarPrefix: 'pnj',
    colorSchemeSelector: 'data-color-scheme',
  },
};
```

- [ ] **Step 6: Boot server and eyeball**

Run: `yarn dev` and open `http://localhost:5002/`
Expected: Home page renders with navy primary instead of green; no console errors about missing palette keys.

- [ ] **Step 7: Commit**

```bash
git add src/theme/
git commit -m "feat(theme): PNJ palette + typography tokens"
```

---

### Task A3: Load Roboto + Playfair fonts

**Files:**
- Modify: `package.json` (add deps)
- Modify: `src/app/layout.jsx` (import fonts)
- Modify: `src/global.css` (font families)

- [ ] **Step 1: Install font packages**

Run: `yarn add @fontsource-variable/roboto @fontsource/roboto @fontsource/playfair-display`
Expected: installed, lockfile updated

- [ ] **Step 2: Import fonts in `src/app/layout.jsx`**

Add near existing fontsource imports:
```jsx
import '@fontsource-variable/roboto';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
```

- [ ] **Step 3: Update CSS variables in `src/global.css`**

Replace existing `--font-sans` / add:
```css
:root {
  --pnj-font-sans: 'Roboto Variable', Roboto, system-ui, sans-serif;
  --pnj-font-display: 'Playfair Display', Georgia, serif;
  --pnj-font-footer: 'Open Sans', Roboto, sans-serif;
}
body { font-family: var(--pnj-font-sans); }
```

- [ ] **Step 4: Commit**

```bash
git add package.json yarn.lock src/app/layout.jsx src/global.css
git commit -m "feat(theme): load Roboto + Playfair Display"
```

---

### Task A4: Add admin + landing path maps

**Files:**
- Modify: `src/routes/paths.js`

- [ ] **Step 1: Append admin + landing path trees**

```js
// src/routes/paths.js — append after existing exports
const ROOTS = { ADMIN: '/admin', LANDING: '/' };

export const adminPaths = {
  root: ROOTS.ADMIN,
  auth: { login: `${ROOTS.ADMIN}/login` },
  dashboard: `${ROOTS.ADMIN}/dashboard`,
  product: {
    root: `${ROOTS.ADMIN}/product`,
    new: `${ROOTS.ADMIN}/product/new`,
    edit: (id) => `${ROOTS.ADMIN}/product/${id}/edit`,
    detail: (id) => `${ROOTS.ADMIN}/product/${id}`,
  },
  category: { root: `${ROOTS.ADMIN}/category`, new: `${ROOTS.ADMIN}/category/new`, edit: (id) => `${ROOTS.ADMIN}/category/${id}/edit` },
  brand: { root: `${ROOTS.ADMIN}/brand`, new: `${ROOTS.ADMIN}/brand/new`, edit: (id) => `${ROOTS.ADMIN}/brand/${id}/edit` },
  collection: { root: `${ROOTS.ADMIN}/collection`, new: `${ROOTS.ADMIN}/collection/new`, edit: (id) => `${ROOTS.ADMIN}/collection/${id}/edit` },
  productLine: { root: `${ROOTS.ADMIN}/product-line`, new: `${ROOTS.ADMIN}/product-line/new`, edit: (id) => `${ROOTS.ADMIN}/product-line/${id}/edit` },
  attribute: { root: `${ROOTS.ADMIN}/attribute`, new: `${ROOTS.ADMIN}/attribute/new`, edit: (id) => `${ROOTS.ADMIN}/attribute/${id}/edit` },
  attributeSet: { root: `${ROOTS.ADMIN}/attribute-set`, new: `${ROOTS.ADMIN}/attribute-set/new`, edit: (id) => `${ROOTS.ADMIN}/attribute-set/${id}/edit` },
  sizeGuide: { root: `${ROOTS.ADMIN}/size-guide`, new: `${ROOTS.ADMIN}/size-guide/new`, edit: (id) => `${ROOTS.ADMIN}/size-guide/${id}/edit` },
  inventory: { root: `${ROOTS.ADMIN}/inventory` },
  goldType: { root: `${ROOTS.ADMIN}/gold-type` },
  goldPriceRegion: { root: `${ROOTS.ADMIN}/gold-price-region` },
  goldPrice: { root: `${ROOTS.ADMIN}/gold-price` },
  order: {
    root: `${ROOTS.ADMIN}/order`,
    detail: (id) => `${ROOTS.ADMIN}/order/${id}`,
  },
  returnRequest: { root: `${ROOTS.ADMIN}/return-request`, detail: (id) => `${ROOTS.ADMIN}/return-request/${id}` },
  customer: { root: `${ROOTS.ADMIN}/customer`, detail: (id) => `${ROOTS.ADMIN}/customer/${id}` },
  membershipTier: { root: `${ROOTS.ADMIN}/membership-tier` },
  promotion: { root: `${ROOTS.ADMIN}/promotion`, new: `${ROOTS.ADMIN}/promotion/new`, edit: (id) => `${ROOTS.ADMIN}/promotion/${id}/edit` },
  coupon: { root: `${ROOTS.ADMIN}/coupon` },
  giftCard: { root: `${ROOTS.ADMIN}/gift-card`, detail: (id) => `${ROOTS.ADMIN}/gift-card/${id}` },
  ecardCategory: { root: `${ROOTS.ADMIN}/ecard-category` },
  ecardTemplate: { root: `${ROOTS.ADMIN}/ecard-template` },
  paymentMethod: { root: `${ROOTS.ADMIN}/payment-method` },
  bank: { root: `${ROOTS.ADMIN}/bank` },
  installmentPlan: { root: `${ROOTS.ADMIN}/installment-plan` },
  store: { root: `${ROOTS.ADMIN}/store`, new: `${ROOTS.ADMIN}/store/new`, edit: (id) => `${ROOTS.ADMIN}/store/${id}/edit` },
  location: { root: `${ROOTS.ADMIN}/location` },
  region: { root: `${ROOTS.ADMIN}/region` },
  menu: { root: `${ROOTS.ADMIN}/menu`, edit: (location) => `${ROOTS.ADMIN}/menu/${location}` },
  banner: { root: `${ROOTS.ADMIN}/banner` },
  homeSection: { root: `${ROOTS.ADMIN}/home-section` },
  landingPage: { root: `${ROOTS.ADMIN}/landing-page`, new: `${ROOTS.ADMIN}/landing-page/new`, edit: (id) => `${ROOTS.ADMIN}/landing-page/${id}/edit` },
  page: { root: `${ROOTS.ADMIN}/page`, new: `${ROOTS.ADMIN}/page/new`, edit: (id) => `${ROOTS.ADMIN}/page/${id}/edit` },
  faq: { root: `${ROOTS.ADMIN}/faq` },
  document: { root: `${ROOTS.ADMIN}/document` },
  post: { root: `${ROOTS.ADMIN}/post`, new: `${ROOTS.ADMIN}/post/new`, edit: (id) => `${ROOTS.ADMIN}/post/${id}/edit` },
  postCategory: { root: `${ROOTS.ADMIN}/post-category` },
  review: { root: `${ROOTS.ADMIN}/review`, detail: (id) => `${ROOTS.ADMIN}/review/${id}` },
  lead: { root: `${ROOTS.ADMIN}/lead`, detail: (id) => `${ROOTS.ADMIN}/lead/${id}` },
  admin: { root: `${ROOTS.ADMIN}/admin-user`, new: `${ROOTS.ADMIN}/admin-user/new`, edit: (id) => `${ROOTS.ADMIN}/admin-user/${id}/edit` },
  role: { root: `${ROOTS.ADMIN}/role`, new: `${ROOTS.ADMIN}/role/new`, edit: (id) => `${ROOTS.ADMIN}/role/${id}/edit` },
  setting: { root: `${ROOTS.ADMIN}/setting` },
  urlRedirect: { root: `${ROOTS.ADMIN}/url-redirect` },
  notificationTemplate: { root: `${ROOTS.ADMIN}/notification-template` },
  notificationLog: { root: `${ROOTS.ADMIN}/notification-log` },
  activityLog: { root: `${ROOTS.ADMIN}/activity-log` },
};

export const landingPaths = {
  root: ROOTS.LANDING,
  product: { root: '/san-pham', detail: (slug) => `/san-pham/${slug}` },
  category: (slug) => `/${slug}`,
  cart: '/gio-hang',
  checkout: '/thanh-toan',
  login: '/dang-nhap',
  account: '/tai-khoan',
  goldPrice: '/gia-vang',
  store: '/he-thong-cua-hang',
  promotion: '/khuyen-mai',
  blog: '/blog',
  post: (slug) => `/blog/${slug}`,
};
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/paths.js
git commit -m "feat(routes): add admin + landing path maps"
```

---

### Task A5: Create folder skeleton

**Files:**
- Create: `src/app/admin/.gitkeep`
- Create: `src/app/landing/.gitkeep`
- Create: `src/sections/admin/.gitkeep`
- Create: `src/sections/landing/.gitkeep`
- Create: `src/layouts/admin/.gitkeep`
- Create: `src/layouts/landing/.gitkeep`
- Create: `src/components/common/.gitkeep`
- Create: `src/_mock/admin/.gitkeep`

- [ ] **Step 1: Create directories**

```bash
mkdir -p src/app/admin src/app/landing \
         src/sections/admin src/sections/landing \
         src/layouts/admin src/layouts/landing \
         src/components/common src/_mock/admin
touch src/app/admin/.gitkeep src/app/landing/.gitkeep \
      src/sections/admin/.gitkeep src/sections/landing/.gitkeep \
      src/layouts/admin/.gitkeep src/layouts/landing/.gitkeep \
      src/components/common/.gitkeep src/_mock/admin/.gitkeep
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore(fe): create admin + landing folder skeleton"
```

---

### Task A6: JWT auth provider pointing to pnj-be

**Files:**
- Create: `src/auth/pnj/auth-config.js`
- Create: `src/auth/pnj/auth-provider.jsx`
- Create: `src/auth/pnj/use-auth-login.js`
- Create: `src/auth/pnj/use-auth-logout.js`
- Create: `src/auth/pnj/use-auth-context.js`
- Modify: `src/global-config.js` (admin API base URL)

- [ ] **Step 1: Add API base to global config**

Add to `src/global-config.js`:
```js
export const PNJ_API = {
  baseUrl: process.env.NEXT_PUBLIC_PNJ_API_URL || 'http://localhost:8000/api',
  tokenKey: 'pnj_admin_token',
};
```

- [ ] **Step 2: Write `auth-config.js`**

```js
// src/auth/pnj/auth-config.js
import { PNJ_API } from 'src/global-config';

export const authEndpoints = {
  login: `${PNJ_API.baseUrl}/auth/login`,
  logout: `${PNJ_API.baseUrl}/auth/logout`,
  me: `${PNJ_API.baseUrl}/auth/me`,
};

export const tokenStorage = {
  get: () => (typeof window === 'undefined' ? null : localStorage.getItem(PNJ_API.tokenKey)),
  set: (t) => localStorage.setItem(PNJ_API.tokenKey, t),
  clear: () => localStorage.removeItem(PNJ_API.tokenKey),
};
```

- [ ] **Step 3: Write `auth-provider.jsx`**

```jsx
// src/auth/pnj/auth-provider.jsx — context + bootstrap /auth/me
'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { authEndpoints, tokenStorage } from './auth-config';

export const AuthContext = createContext({
  user: null,
  loading: true,
  permissions: [],
  refresh: () => {},
  clear: () => {},
});

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, permissions: [], loading: true });

  const refresh = useCallback(async () => {
    const token = tokenStorage.get();
    if (!token) {
      setState({ user: null, permissions: [], loading: false });
      return;
    }
    try {
      const res = await axios.get(authEndpoints.me, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState({
        user: res.data?.data?.user ?? res.data?.data ?? null,
        permissions: res.data?.data?.permissions ?? [],
        loading: false,
      });
    } catch {
      tokenStorage.clear();
      setState({ user: null, permissions: [], loading: false });
    }
  }, []);

  const clear = useCallback(() => {
    tokenStorage.clear();
    setState({ user: null, permissions: [], loading: false });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const value = useMemo(() => ({ ...state, refresh, clear }), [state, refresh, clear]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

- [ ] **Step 4: Write `use-auth-login.js`**

```js
// src/auth/pnj/use-auth-login.js
import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './auth-provider';
import { authEndpoints, tokenStorage } from './auth-config';

export function useAuthLogin() {
  const { refresh } = useContext(AuthContext);

  return async ({ email, password }) => {
    const res = await axios.post(authEndpoints.login, { email, password });
    const token = res.data?.data?.token;
    if (!token) throw new Error('Không nhận được token từ máy chủ');
    tokenStorage.set(token);
    await refresh();
    return res.data?.data;
  };
}
```

- [ ] **Step 5: Write `use-auth-logout.js`**

```js
// src/auth/pnj/use-auth-logout.js
import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './auth-provider';
import { authEndpoints, tokenStorage } from './auth-config';

export function useAuthLogout() {
  const { clear } = useContext(AuthContext);

  return async () => {
    const token = tokenStorage.get();
    if (token) {
      try {
        await axios.post(authEndpoints.logout, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch { /* ignore network/401 on logout */ }
    }
    clear();
  };
}
```

- [ ] **Step 6: Write `use-auth-context.js`**

```js
// src/auth/pnj/use-auth-context.js
import { useContext } from 'react';
import { AuthContext } from './auth-provider';

export function useAuthContext() {
  return useContext(AuthContext);
}

export function useAuthCan(ability) {
  const { permissions } = useAuthContext();
  if (!ability) return true;
  return permissions.includes(ability);
}
```

- [ ] **Step 7: Commit**

```bash
git add src/auth/pnj/ src/global-config.js
git commit -m "feat(auth): PNJ JWT auth provider targeting pnj-be"
```

---

### Task A7: Axios admin client with interceptors

**Files:**
- Create: `src/lib/pnj-api/axios-admin.js`
- Create: `src/lib/pnj-api/endpoints-admin.js`
- Create: `src/lib/pnj-api/swr-fetcher.js`

- [ ] **Step 1: Write `axios-admin.js`**

```js
// src/lib/pnj-api/axios-admin.js — single admin axios instance + interceptors
import axios from 'axios';
import { PNJ_API } from 'src/global-config';
import { tokenStorage } from 'src/auth/pnj/auth-config';

export const axiosAdmin = axios.create({ baseURL: PNJ_API.baseUrl });

axiosAdmin.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosAdmin.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== 'undefined') {
      tokenStorage.clear();
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);
```

- [ ] **Step 2: Write `endpoints-admin.js`**

```js
// src/lib/pnj-api/endpoints-admin.js — canonical admin endpoint map
export const adminEndpoints = {
  dashboard: { summary: '/v1/dashboard/summary', revenueSeries: '/v1/dashboard/revenue-series', topProducts: '/v1/dashboard/top-products' },
  product: { list: '/v1/product', detail: (id) => `/v1/product/${id}`, duplicate: (id) => `/v1/product/${id}/duplicate` },
  category: { list: '/v1/category', tree: '/v1/category/tree', reorder: '/v1/category/reorder' },
  brand: { list: '/v1/brand' },
  collection: { list: '/v1/collection' },
  productLine: { list: '/v1/product-line' },
  attribute: { list: '/v1/attribute' },
  attributeSet: { list: '/v1/attribute-set' },
  sizeGuide: { list: '/v1/size-guide' },
  inventory: { list: '/v1/inventory', adjust: '/v1/inventory/adjust' },
  goldType: { list: '/v1/gold-type' },
  goldPriceRegion: { list: '/v1/gold-price-region' },
  goldPrice: { current: '/v1/gold-price/current', history: '/v1/gold-price/history', batch: '/v1/gold-price/batch' },
  order: { list: '/v1/order', detail: (id) => `/v1/order/${id}`, counts: '/v1/order/counts', transition: (id) => `/v1/order/${id}/transition` },
  returnRequest: { list: '/v1/return-request' },
  customer: { list: '/v1/customer', detail: (id) => `/v1/customer/${id}`, orders: (id) => `/v1/customer/${id}/orders` },
  membershipTier: { list: '/v1/membership-tier' },
  promotion: { list: '/v1/promotion', previewScope: '/v1/promotion/preview-scope' },
  coupon: { list: '/v1/coupon', generate: '/v1/coupon/generate' },
  giftCard: { list: '/v1/gift-card' },
  ecardCategory: { list: '/v1/ecard-category' },
  ecardTemplate: { list: '/v1/ecard-template' },
  paymentMethod: { list: '/v1/payment-method' },
  bank: { list: '/v1/bank' },
  installmentPlan: { list: '/v1/installment-plan' },
  store: { list: '/v1/store' },
  location: { list: '/v1/location' },
  region: { list: '/v1/region' },
  menu: { list: '/v1/menu', detail: (loc) => `/v1/menu/${loc}` },
  banner: { list: '/v1/banner', reorder: '/v1/banner/reorder' },
  homeSection: { list: '/v1/home-section', reorder: '/v1/home-section/reorder' },
  landingPage: { list: '/v1/landing-page' },
  page: { list: '/v1/page' },
  faq: { list: '/v1/faq' },
  document: { list: '/v1/document' },
  post: { list: '/v1/post' },
  postCategory: { list: '/v1/post-category' },
  review: { list: '/v1/review' },
  lead: { list: '/v1/lead' },
  admin: { list: '/v1/user' },
  role: { list: '/v1/role', matrix: '/v1/permission/matrix' },
  setting: { detail: '/v1/setting/detail' },
  urlRedirect: { list: '/v1/url-redirect' },
  notificationTemplate: { list: '/v1/notification-template' },
  notificationLog: { list: '/v1/notification-log' },
  activityLog: { list: '/v1/activity-log' },
};
```

- [ ] **Step 3: Write `swr-fetcher.js`**

```js
// src/lib/pnj-api/swr-fetcher.js — SWR default fetcher
import { axiosAdmin } from './axios-admin';

export const adminFetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosAdmin.get(url, config);
  return res.data;
};
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/pnj-api/
git commit -m "feat(api): admin axios client + endpoint map + SWR fetcher"
```

---

## Phase B — Admin Layout (sidebar, topbar, shell)

### Task B1: Nav config for admin sidebar

**Files:**
- Create: `src/layouts/admin/nav-config-admin.js`

- [ ] **Step 1: Write nav config**

```js
// src/layouts/admin/nav-config-admin.js — single source for sidebar menu
import { adminPaths } from 'src/routes/paths';

const ic = (name) => `solar:${name}-bold-duotone`;

export const adminNavData = [
  {
    subheader: 'Tổng quan',
    items: [{ title: 'Dashboard', path: adminPaths.dashboard, icon: ic('chart-square') }],
  },
  {
    subheader: 'Catalog',
    items: [
      { title: 'Sản phẩm', path: adminPaths.product.root, icon: ic('bag-4') },
      { title: 'Danh mục', path: adminPaths.category.root, icon: ic('widget-2') },
      { title: 'Thương hiệu', path: adminPaths.brand.root, icon: ic('tag-horizontal') },
      { title: 'Bộ sưu tập', path: adminPaths.collection.root, icon: ic('gallery') },
      { title: 'Dòng hàng', path: adminPaths.productLine.root, icon: ic('layers') },
      { title: 'Thuộc tính', path: adminPaths.attribute.root, icon: ic('list') },
      { title: 'Bộ thuộc tính', path: adminPaths.attributeSet.root, icon: ic('book') },
      { title: 'Hướng dẫn size', path: adminPaths.sizeGuide.root, icon: ic('ruler') },
      { title: 'Tồn kho', path: adminPaths.inventory.root, icon: ic('box') },
    ],
  },
  {
    subheader: 'Giá vàng',
    items: [
      { title: 'Giá vàng', path: adminPaths.goldPrice.root, icon: ic('dollar-minimalistic') },
      { title: 'Loại vàng', path: adminPaths.goldType.root, icon: ic('medal-star') },
      { title: 'Vùng giá', path: adminPaths.goldPriceRegion.root, icon: ic('map') },
    ],
  },
  {
    subheader: 'Bán hàng',
    items: [
      { title: 'Đơn hàng', path: adminPaths.order.root, icon: ic('cart-large'), info: 'badge:pending' },
      { title: 'Thu đổi / hoàn tiền', path: adminPaths.returnRequest.root, icon: ic('refresh') },
      { title: 'Đánh giá', path: adminPaths.review.root, icon: ic('star') },
    ],
  },
  {
    subheader: 'Khách hàng',
    items: [
      { title: 'Khách hàng', path: adminPaths.customer.root, icon: ic('users-group-rounded') },
      { title: 'Hạng thành viên', path: adminPaths.membershipTier.root, icon: ic('crown') },
      { title: 'Lead / CSKH', path: adminPaths.lead.root, icon: ic('phone-calling') },
    ],
  },
  {
    subheader: 'Khuyến mãi',
    items: [
      { title: 'Chương trình', path: adminPaths.promotion.root, icon: ic('sale') },
      { title: 'Mã giảm giá', path: adminPaths.coupon.root, icon: ic('ticket') },
      { title: 'Phiếu quà tặng', path: adminPaths.giftCard.root, icon: ic('gift') },
      { title: 'Thiệp — Chủ đề', path: adminPaths.ecardCategory.root, icon: ic('letter') },
      { title: 'Thiệp — Mẫu', path: adminPaths.ecardTemplate.root, icon: ic('document-add') },
    ],
  },
  {
    subheader: 'Thanh toán',
    items: [
      { title: 'Phương thức TT', path: adminPaths.paymentMethod.root, icon: ic('card') },
      { title: 'Ngân hàng', path: adminPaths.bank.root, icon: ic('wallet') },
      { title: 'Gói trả góp', path: adminPaths.installmentPlan.root, icon: ic('calendar-mark') },
    ],
  },
  {
    subheader: 'Cửa hàng',
    items: [
      { title: 'Cửa hàng', path: adminPaths.store.root, icon: ic('shop-2') },
      { title: 'Địa giới hành chính', path: adminPaths.location.root, icon: ic('map-point') },
      { title: 'Vùng kinh doanh', path: adminPaths.region.root, icon: ic('global') },
    ],
  },
  {
    subheader: 'Nội dung',
    items: [
      { title: 'Menu', path: adminPaths.menu.root, icon: ic('hamburger-menu') },
      { title: 'Banner', path: adminPaths.banner.root, icon: ic('gallery-wide') },
      { title: 'Trang chủ', path: adminPaths.homeSection.root, icon: ic('home') },
      { title: 'Landing page', path: adminPaths.landingPage.root, icon: ic('presentation-graph') },
      { title: 'Trang tĩnh', path: adminPaths.page.root, icon: ic('document-text') },
      { title: 'FAQ', path: adminPaths.faq.root, icon: ic('question-circle') },
      { title: 'Tài liệu IR', path: adminPaths.document.root, icon: ic('folder-with-files') },
    ],
  },
  {
    subheader: 'Blog',
    items: [
      { title: 'Bài viết', path: adminPaths.post.root, icon: ic('pen-new-square') },
      { title: 'Chuyên mục', path: adminPaths.postCategory.root, icon: ic('bookmark-square') },
    ],
  },
  {
    subheader: 'Hệ thống',
    items: [
      { title: 'Admin', path: adminPaths.admin.root, icon: ic('user-id') },
      { title: 'Vai trò & quyền', path: adminPaths.role.root, icon: ic('shield-user') },
      { title: 'Cấu hình', path: adminPaths.setting.root, icon: ic('settings') },
      { title: 'Redirect', path: adminPaths.urlRedirect.root, icon: ic('round-arrow-right') },
      { title: 'Mẫu thông báo', path: adminPaths.notificationTemplate.root, icon: ic('bell') },
      { title: 'Nhật ký gửi', path: adminPaths.notificationLog.root, icon: ic('mailbox') },
      { title: 'Nhật ký thao tác', path: adminPaths.activityLog.root, icon: ic('clipboard-list') },
    ],
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/admin/nav-config-admin.js
git commit -m "feat(admin): sidebar nav config"
```

---

### Task B2: Admin sidebar component

**Files:**
- Create: `src/layouts/admin/admin-sidebar.jsx`

- [ ] **Step 1: Write sidebar**

```jsx
// src/layouts/admin/admin-sidebar.jsx — fixed 240px sidebar with collapse to 64px
'use client';

import { usePathname } from 'next/navigation';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { pnjTokens } from 'src/theme/pnj/tokens';
import { RouterLink } from 'src/routes/components';
import { adminPaths } from 'src/routes/paths';
import { adminNavData } from './nav-config-admin';

export function AdminSidebar({ collapsed = false }) {
  const pathname = usePathname();
  const width = collapsed ? pnjTokens.height.sidebarMini : pnjTokens.height.sidebar;

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width,
          borderRight: `1px solid ${pnjTokens.color.cardBorder}`,
          bgcolor: 'common.white',
          transition: 'width .2s',
        },
      }}
    >
      <Stack alignItems={collapsed ? 'center' : 'flex-start'} sx={{ px: collapsed ? 1 : 2, py: 2 }} component={RouterLink} href={adminPaths.dashboard}>
        <Typography variant="h5" sx={{ color: 'primary.main', fontFamily: 'var(--pnj-font-display)' }}>
          {collapsed ? 'P' : 'PNJ Admin'}
        </Typography>
      </Stack>

      <Box sx={{ flex: 1, overflow: 'auto', px: collapsed ? 0.5 : 1, pb: 2 }}>
        {adminNavData.map((group) => (
          <Box key={group.subheader} sx={{ mb: 2 }}>
            {!collapsed && (
              <Typography variant="overline" sx={{ color: 'text.secondary', px: 1.5 }}>
                {group.subheader}
              </Typography>
            )}
            <List disablePadding>
              {group.items.map((item) => {
                const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
                const button = (
                  <ListItemButton
                    key={item.path}
                    component={RouterLink}
                    href={item.path}
                    selected={active}
                    sx={{
                      borderRadius: 1,
                      mb: 0.25,
                      '&.Mui-selected': { bgcolor: 'primary.lighter', color: 'primary.main' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                      <Iconify icon={item.icon} width={20} />
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary={item.title} primaryTypographyProps={{ variant: 'body2', fontWeight: active ? 600 : 400 }} />}
                  </ListItemButton>
                );
                return collapsed ? (
                  <Tooltip key={item.path} title={item.title} placement="right">{button}</Tooltip>
                ) : button;
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/admin/admin-sidebar.jsx
git commit -m "feat(admin): sidebar with collapse"
```

---

### Task B3: Admin topbar component

**Files:**
- Create: `src/layouts/admin/admin-topbar.jsx`
- Create: `src/layouts/admin/admin-account-menu.jsx`

- [ ] **Step 1: Write `admin-account-menu.jsx`**

```jsx
// src/layouts/admin/admin-account-menu.jsx
'use client';

import { useState } from 'react';
import { Avatar, IconButton, Menu, MenuItem, Divider, Typography, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuthContext } from 'src/auth/pnj/use-auth-context';
import { useAuthLogout } from 'src/auth/pnj/use-auth-logout';
import { adminPaths } from 'src/routes/paths';

export function AdminAccountMenu() {
  const { user } = useAuthContext();
  const logout = useAuthLogout();
  const router = useRouter();
  const [anchor, setAnchor] = useState(null);

  const handleLogout = async () => {
    setAnchor(null);
    await logout();
    router.push(adminPaths.auth.login);
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
        <Avatar sx={{ width: 32, height: 32 }}>{user?.name?.[0] ?? '?'}</Avatar>
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} PaperProps={{ sx: { minWidth: 220 } }}>
        <Stack sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2">{user?.name || 'Admin'}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
        </Stack>
        <Divider />
        <MenuItem onClick={() => router.push('/admin/profile')}>Hồ sơ</MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Đăng xuất</MenuItem>
      </Menu>
    </>
  );
}
```

- [ ] **Step 2: Write `admin-topbar.jsx`**

```jsx
// src/layouts/admin/admin-topbar.jsx — 56px fixed top bar
'use client';

import { AppBar, Box, IconButton, InputBase, Stack, Toolbar, Badge } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { pnjTokens } from 'src/theme/pnj/tokens';
import { AdminAccountMenu } from './admin-account-menu';

export function AdminTopbar({ onToggleSidebar }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'common.white',
        borderBottom: `1px solid ${pnjTokens.color.cardBorder}`,
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ minHeight: pnjTokens.height.topbar, gap: 2 }}>
        <IconButton onClick={onToggleSidebar}><Iconify icon="solar:hamburger-menu-linear" /></IconButton>

        <Box sx={{
          display: 'flex', alignItems: 'center', bgcolor: 'grey.100',
          borderRadius: 999, px: 2, height: 36, flex: 1, maxWidth: 480,
        }}>
          <Iconify icon="solar:magnifer-linear" sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase placeholder="Tìm đơn, SĐT, mã SP..." sx={{ flex: 1, fontSize: 14 }} />
        </Box>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton><Badge badgeContent={5} color="error"><Iconify icon="solar:bell-linear" /></Badge></IconButton>
          <AdminAccountMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/admin/admin-topbar.jsx src/layouts/admin/admin-account-menu.jsx
git commit -m "feat(admin): topbar + account menu"
```

---

### Task B4: Admin shell layout

**Files:**
- Create: `src/layouts/admin/admin-layout.jsx`
- Create: `src/app/admin/layout.jsx` (replace existing)

- [ ] **Step 1: Write `admin-layout.jsx`**

```jsx
// src/layouts/admin/admin-layout.jsx — composes sidebar + topbar + content
'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { pnjTokens } from 'src/theme/pnj/tokens';
import { AdminSidebar } from './admin-sidebar';
import { AdminTopbar } from './admin-topbar';

export function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarW = collapsed ? pnjTokens.height.sidebarMini : pnjTokens.height.sidebar;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: pnjTokens.color.bgGray2 }}>
      <AdminSidebar collapsed={collapsed} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: `${sidebarW}px`, transition: 'margin .2s' }}>
        <AdminTopbar onToggleSidebar={() => setCollapsed((c) => !c)} />
        <Box component="main" sx={{ p: 3, flex: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Write app-level `src/app/admin/layout.jsx`**

```jsx
// src/app/admin/layout.jsx — wraps every /admin/** page
import { AuthProvider } from 'src/auth/pnj/auth-provider';
import { AdminLayout } from 'src/layouts/admin/admin-layout';
import { AdminAuthGuard } from 'src/layouts/admin/admin-auth-guard';

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <AdminAuthGuard>
        <AdminLayout>{children}</AdminLayout>
      </AdminAuthGuard>
    </AuthProvider>
  );
}
```

- [ ] **Step 3: Write `admin-auth-guard.jsx`**

Create `src/layouts/admin/admin-auth-guard.jsx`:

```jsx
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAuthContext } from 'src/auth/pnj/use-auth-context';
import { adminPaths } from 'src/routes/paths';

export function AdminAuthGuard({ children }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === adminPaths.auth.login;

  useEffect(() => {
    if (!loading && !user && !isLoginPage) router.replace(adminPaths.auth.login);
  }, [loading, user, isLoginPage, router]);

  if (loading) {
    return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
  }
  if (!user && !isLoginPage) return null;
  if (user && isLoginPage) { router.replace(adminPaths.dashboard); return null; }
  return children;
}
```

- [ ] **Step 4: Verify in browser**

Run: `yarn dev` → visit `/admin/dashboard`
Expected: redirected to `/admin/login` (not yet existing → will hit 404, OK for now; shell boots without errors).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/admin/ src/app/admin/layout.jsx
git commit -m "feat(admin): shell layout + auth guard"
```

---

### Task B5: Admin login page

**Files:**
- Create: `src/sections/admin/auth/auth-login-view.jsx`
- Create: `src/sections/admin/auth/auth-login-form.jsx`
- Create: `src/app/admin/login/page.jsx`

- [ ] **Step 1: Write `auth-login-form.jsx`**

```jsx
// src/sections/admin/auth/auth-login-form.jsx — email + password form
'use client';

import { useState } from 'react';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { useAuthLogin } from 'src/auth/pnj/use-auth-login';
import { useRouter } from 'next/navigation';
import { adminPaths } from 'src/routes/paths';

export function AuthLoginForm() {
  const login = useAuthLogin();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await login({ email, password });
      router.push(adminPaths.dashboard);
    } catch (err) {
      setError(err?.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack component="form" spacing={2} onSubmit={onSubmit}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required autoFocus />
      <TextField label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
      <Button type="submit" variant="contained" size="large" disabled={busy}>
        {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
      </Button>
    </Stack>
  );
}
```

- [ ] **Step 2: Write `auth-login-view.jsx`**

```jsx
// src/sections/admin/auth/auth-login-view.jsx
import { Box, Card, Stack, Typography } from '@mui/material';
import { AuthLoginForm } from './auth-login-form';

export function AuthLoginView() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', bgcolor: 'grey.100', px: 2 }}>
      <Card sx={{ p: 4, width: 420, maxWidth: '100%' }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h3" sx={{ fontFamily: 'var(--pnj-font-display)', color: 'primary.main' }}>PNJ Admin</Typography>
          <Typography variant="body2" color="text.secondary">Đăng nhập để tiếp tục</Typography>
        </Stack>
        <AuthLoginForm />
      </Card>
    </Box>
  );
}
```

- [ ] **Step 3: Write page**

Create `src/app/admin/login/page.jsx`:
```jsx
import { AuthLoginView } from 'src/sections/admin/auth/auth-login-view';
export default function Page() { return <AuthLoginView />; }
```

- [ ] **Step 4: Verify**

Run: `yarn dev` → visit `/admin/login`
Expected: Login card renders with navy heading, no console errors; form submits to pnj-be if running.

- [ ] **Step 5: Commit**

```bash
git add src/sections/admin/auth/ src/app/admin/login/
git commit -m "feat(admin): login page"
```

---

## Phase C — Shared Components (18 components from §11.2)

Each sub-task below creates one shared component in `src/components/common/<kebab>/` with named index, styled consistently. Use mocks where needed for demos.

### Task C1: `StatusBadge`

**Files:**
- Create: `src/components/common/status-badge/status-badge.jsx`
- Create: `src/components/common/status-badge/index.js`

- [ ] **Step 1: Write component**

```jsx
// src/components/common/status-badge/status-badge.jsx — chip mapping enum → color
'use client';
import { Chip } from '@mui/material';

/**
 * @param {{ status: string, colorMap: Record<string,string>, labelMap: Record<string,string>, size?: 'small'|'medium' }} props
 */
export function StatusBadge({ status, colorMap, labelMap, size = 'small' }) {
  const color = colorMap[status] ?? 'default';
  const label = labelMap[status] ?? status;
  return <Chip label={label} color={color === 'default' ? undefined : color} size={size} variant={color === 'default' ? 'outlined' : 'filled'} />;
}
```

- [ ] **Step 2: Index**

```js
export * from './status-badge';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/common/status-badge/
git commit -m "feat(components): StatusBadge"
```

### Task C2: `MoneyInput` and `DecimalInput`

**Files:**
- Create: `src/components/common/money-input/money-input.jsx` + index
- Create: `src/components/common/decimal-input/decimal-input.jsx` + index

- [ ] **Step 1: `MoneyInput`**

```jsx
// src/components/common/money-input/money-input.jsx — VND int with thousand grouping
'use client';
import { TextField, InputAdornment } from '@mui/material';
import { NumericFormat } from 'react-number-format';

const Adapter = ({ onChange, ...rest }) => (
  <NumericFormat
    {...rest}
    thousandSeparator="."
    decimalSeparator=","
    decimalScale={0}
    allowNegative={false}
    onValueChange={(v) => onChange({ target: { name: rest.name, value: v.floatValue ?? '' } })}
  />
);

export function MoneyInput({ value, onChange, label, ...props }) {
  return (
    <TextField
      {...props}
      label={label}
      value={value ?? ''}
      onChange={onChange}
      InputProps={{ inputComponent: Adapter, endAdornment: <InputAdornment position="end">₫</InputAdornment> }}
    />
  );
}
```

- [ ] **Step 2: `DecimalInput`**

```jsx
// src/components/common/decimal-input/decimal-input.jsx — weights/carat/purity
'use client';
import { TextField, InputAdornment } from '@mui/material';
import { NumericFormat } from 'react-number-format';

const Adapter = ({ onChange, ...rest }) => (
  <NumericFormat
    {...rest}
    decimalScale={4}
    allowNegative={false}
    onValueChange={(v) => onChange({ target: { name: rest.name, value: v.floatValue ?? '' } })}
  />
);

export function DecimalInput({ value, onChange, label, unit = 'phân', ...props }) {
  return (
    <TextField
      {...props}
      label={label}
      value={value ?? ''}
      onChange={onChange}
      InputProps={{ inputComponent: Adapter, endAdornment: <InputAdornment position="end">{unit}</InputAdornment> }}
    />
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/common/money-input/ src/components/common/decimal-input/
git commit -m "feat(components): MoneyInput + DecimalInput"
```

### Task C3: `SlugInput`

**Files:**
- Create: `src/components/common/slug-input/slug-input.jsx` + index

- [ ] **Step 1: Write**

```jsx
// src/components/common/slug-input/slug-input.jsx — auto-slugify Vietnamese
'use client';
import { useEffect } from 'react';
import { TextField, Stack, Button } from '@mui/material';

function slugify(str = '') {
  return String(str)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function SlugInput({ sourceName, value, onChange, auto = true }) {
  useEffect(() => { if (auto && sourceName) onChange(slugify(sourceName)); /* eslint-disable-next-line */ }, [sourceName, auto]);
  return (
    <Stack direction="row" spacing={1}>
      <TextField label="Slug" value={value ?? ''} onChange={(e) => onChange(e.target.value)} fullWidth />
      <Button variant="outlined" onClick={() => onChange(slugify(sourceName))}>Tự sinh</Button>
    </Stack>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/common/slug-input/
git commit -m "feat(components): SlugInput"
```

### Task C4: `DataTable`

**Files:**
- Create: `src/components/common/data-table/data-table.jsx` + index

- [ ] **Step 1: Write**

```jsx
// src/components/common/data-table/data-table.jsx — thin wrapper over MUI DataGrid
'use client';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Stack, Typography } from '@mui/material';

export function DataTable({ rows, columns, loading, rowCount, paginationModel, onPaginationModelChange, checkboxSelection = true, toolbar, emptyText = 'Chưa có dữ liệu' }) {
  return (
    <Box sx={{ bgcolor: 'common.white', borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
      {toolbar && <Box sx={{ p: 2, borderBottom: 1, borderColor: 'grey.300' }}>{toolbar}</Box>}
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id ?? r._id}
        loading={loading}
        rowHeight={48}
        rowCount={rowCount ?? rows.length}
        paginationMode={rowCount ? 'server' : 'client'}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[20, 50, 100]}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
              <Typography variant="body2" color="text.secondary">{emptyText}</Typography>
            </Stack>
          ),
        }}
      />
    </Box>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/common/data-table/
git commit -m "feat(components): DataTable"
```

### Task C5: `FilterBar`

**Files:**
- Create: `src/components/common/filter-bar/filter-bar.jsx` + index

- [ ] **Step 1: Write**

```jsx
// src/components/common/filter-bar/filter-bar.jsx — search + chips + "more" drawer button
'use client';
import { Stack, TextField, Chip, Button, InputAdornment } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function FilterBar({ searchValue, onSearch, chips = [], onChipDelete, onOpenAdvanced, extra }) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
      <TextField
        placeholder="Tìm kiếm..."
        value={searchValue ?? ''}
        onChange={(e) => onSearch(e.target.value)}
        size="small"
        sx={{ minWidth: 280 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><Iconify icon="solar:magnifer-linear" /></InputAdornment> }}
      />
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {chips.map((c) => <Chip key={c.key} label={c.label} onDelete={() => onChipDelete(c.key)} />)}
      </Stack>
      <Stack direction="row" spacing={1} sx={{ ml: { md: 'auto' } }}>
        {extra}
        {onOpenAdvanced && (
          <Button variant="outlined" startIcon={<Iconify icon="solar:filter-linear" />} onClick={onOpenAdvanced}>
            Bộ lọc
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/common/filter-bar/
git commit -m "feat(components): FilterBar"
```

### Task C6: `MediaPicker`

**Files:**
- Create: `src/components/common/media-picker/media-picker.jsx` + index

- [ ] **Step 1: Write**

```jsx
// src/components/common/media-picker/media-picker.jsx — dropzone + sortable thumbnails
'use client';
import { Box, Grid, IconButton, Stack, Typography, Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useDropzone } from 'react-dropzone';

/** value: [{file_id, url, alt}] */
export function MediaPicker({ value = [], onChange, multiple = true, label = 'Hình ảnh' }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [], 'video/*': [] },
    multiple,
    onDrop: (files) => {
      const added = files.map((f, i) => ({ file_id: `tmp-${Date.now()}-${i}`, url: URL.createObjectURL(f), alt: f.name }));
      onChange(multiple ? [...value, ...added] : added.slice(0, 1));
    },
  });

  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">{label}</Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 1, p: 3, textAlign: 'center',
          bgcolor: isDragActive ? 'primary.lighter' : 'grey.100',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <Iconify icon="solar:upload-linear" width={32} />
        <Typography variant="body2" sx={{ mt: 1 }}>Kéo thả ảnh hoặc bấm để chọn</Typography>
      </Box>

      <Grid container spacing={1}>
        {value.map((m, i) => (
          <Grid key={m.file_id} item xs={6} sm={3}>
            <Box sx={{ position: 'relative', aspectRatio: '1/1', bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
              <img src={m.url} alt={m.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <IconButton size="small" onClick={() => remove(i)} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,.5)', color: 'common.white' }}>
                <Iconify icon="solar:trash-bin-trash-linear" width={16} />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/common/media-picker/
git commit -m "feat(components): MediaPicker"
```

### Task C7: `RichTextEditor` (TipTap)

**Files:**
- Create: `src/components/common/rich-text-editor/rich-text-editor.jsx` + index

- [ ] **Step 1: Write**

```jsx
// src/components/common/rich-text-editor/rich-text-editor.jsx
'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Box } from '@mui/material';

export function RichTextEditor({ value, onChange, placeholder = 'Nhập nội dung...' }) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: value ?? '',
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: { attributes: { 'data-placeholder': placeholder } },
  });
  return (
    <Box sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, minHeight: 220, p: 1.5, '& .ProseMirror': { outline: 'none', minHeight: 200 } }}>
      <EditorContent editor={editor} />
    </Box>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/common/rich-text-editor/
git commit -m "feat(components): RichTextEditor (TipTap)"
```

### Task C8: `RefSelect`

**Files:**
- Create: `src/components/common/ref-select/ref-select.jsx` + index

- [ ] **Step 1: Write**

```jsx
// src/components/common/ref-select/ref-select.jsx — async searchable select
'use client';
import { Autocomplete, TextField } from '@mui/material';
import useSWR from 'swr';
import { adminFetcher } from 'src/lib/pnj-api/swr-fetcher';

/** @param {{ endpoint: string, value: any, onChange: any, label: string, multiple?: boolean, getOptionLabel?: (o: any) => string }} props */
export function RefSelect({ endpoint, value, onChange, label, multiple = false, getOptionLabel = (o) => o?.name ?? '' }) {
  const { data, isLoading } = useSWR(endpoint, adminFetcher);
  const options = data?.data ?? [];
  return (
    <Autocomplete
      multiple={multiple}
      loading={isLoading}
      options={options}
      value={value ?? (multiple ? [] : null)}
      onChange={(_, v) => onChange(v)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(a, b) => (a.id ?? a._id) === (b.id ?? b._id)}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/common/ref-select/
git commit -m "feat(components): RefSelect"
```

### Task C9: `SortableTree` (dnd-kit)

**Files:**
- Create: `src/components/common/sortable-tree/sortable-tree.jsx` + index

- [ ] **Step 1: Write**

```jsx
// src/components/common/sortable-tree/sortable-tree.jsx — flat sortable list; nested rendering via `depth` prop
'use client';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper, Stack, Typography, IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';

function Row({ item, depth, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  return (
    <Paper
      ref={setNodeRef}
      sx={{ transform: CSS.Transform.toString(transform), transition, p: 1.25, mb: 0.75, ml: depth * 3, display: 'flex', alignItems: 'center', gap: 1 }}
      variant="outlined"
    >
      <IconButton size="small" {...attributes} {...listeners} sx={{ cursor: 'grab' }}>
        <Iconify icon="solar:hamburger-menu-linear" width={16} />
      </IconButton>
      <Stack sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
        {item.slug && <Typography variant="caption" color="text.secondary">/{item.slug}</Typography>}
      </Stack>
      <IconButton size="small" onClick={() => onEdit?.(item)}><Iconify icon="solar:pen-linear" width={16} /></IconButton>
      <IconButton size="small" onClick={() => onDelete?.(item)}><Iconify icon="solar:trash-bin-trash-linear" width={16} /></IconButton>
    </Paper>
  );
}

export function SortableTree({ items, onChange, onEdit, onDelete }) {
  const flat = flatten(items);
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = flat.findIndex((i) => i.id === active.id);
    const newIdx = flat.findIndex((i) => i.id === over.id);
    onChange(unflatten(arrayMove(flat, oldIdx, newIdx)));
  };
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={flat.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <Box>{flat.map((i) => <Row key={i.id} item={i} depth={i._depth} onEdit={onEdit} onDelete={onDelete} />)}</Box>
      </SortableContext>
    </DndContext>
  );
}

function flatten(items, depth = 0, out = []) {
  items.forEach((item) => {
    out.push({ ...item, _depth: depth });
    if (item.children?.length) flatten(item.children, depth + 1, out);
  });
  return out;
}
function unflatten(flat) {
  // naive: strip depth, caller re-fetches tree after reorder.
  return flat.map(({ _depth, ...r }) => r);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/common/sortable-tree/
git commit -m "feat(components): SortableTree"
```

### Task C10: `VariantGrid`

**Files:**
- Create: `src/components/common/variant-grid/variant-grid.jsx` + index

- [ ] **Step 1: Write**

```jsx
// src/components/common/variant-grid/variant-grid.jsx — inline-edit table for product variants
'use client';
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Stack } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { MoneyInput } from 'src/components/common/money-input';
import { DecimalInput } from 'src/components/common/decimal-input';

/** value: [{sku, size, gold_weight, stone_weight, price, compare_at_price, total_stock, status}] */
export function VariantGrid({ value = [], onChange }) {
  const update = (i, patch) => onChange(value.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const add = () => onChange([...value, { sku: '', size: '', gold_weight: '', stone_weight: '', price: '', compare_at_price: '', total_stock: 0, status: 'active' }]);
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <Stack spacing={1}>
      <Box sx={{ overflowX: 'auto', border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Size</TableCell><TableCell>SKU</TableCell>
              <TableCell>Trọng lượng vàng</TableCell><TableCell>Trọng lượng đá</TableCell>
              <TableCell>Giá</TableCell><TableCell>Giá gốc</TableCell>
              <TableCell>Tồn</TableCell><TableCell align="right">Xoá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {value.map((row, i) => (
              <TableRow key={i}>
                <TableCell><TextField size="small" value={row.size} onChange={(e) => update(i, { size: e.target.value })} sx={{ width: 80 }} /></TableCell>
                <TableCell><TextField size="small" value={row.sku} onChange={(e) => update(i, { sku: e.target.value })} sx={{ width: 180 }} /></TableCell>
                <TableCell><DecimalInput size="small" value={row.gold_weight} onChange={(e) => update(i, { gold_weight: e.target.value })} unit="phân" sx={{ width: 140 }} /></TableCell>
                <TableCell><DecimalInput size="small" value={row.stone_weight} onChange={(e) => update(i, { stone_weight: e.target.value })} unit="ly" sx={{ width: 140 }} /></TableCell>
                <TableCell><MoneyInput size="small" value={row.price} onChange={(e) => update(i, { price: e.target.value })} sx={{ width: 160 }} /></TableCell>
                <TableCell><MoneyInput size="small" value={row.compare_at_price} onChange={(e) => update(i, { compare_at_price: e.target.value })} sx={{ width: 160 }} /></TableCell>
                <TableCell><TextField size="small" type="number" value={row.total_stock} onChange={(e) => update(i, { total_stock: Number(e.target.value) })} sx={{ width: 80 }} /></TableCell>
                <TableCell align="right"><IconButton onClick={() => remove(i)}><Iconify icon="solar:trash-bin-trash-linear" /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Button startIcon={<Iconify icon="solar:add-circle-linear" />} onClick={add}>Thêm biến thể</Button>
    </Stack>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/common/variant-grid/
git commit -m "feat(components): VariantGrid"
```

### Task C11: `Repeater`, `DateRangePicker`, `SeoPanel`, `AuditTimeline`, `ConfirmDialog`, `Can`, `ImportWizard`, `AttributeFields`

**Files:**
- Create one folder per component under `src/components/common/<name>/` with the same pattern.

- [ ] **Step 1: `Repeater`** — generic Add/Remove list (used for opening_hours, tiers, gifts, size_table)

```jsx
// src/components/common/repeater/repeater.jsx
'use client';
import { Stack, Button, IconButton, Paper } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function Repeater({ value = [], onChange, renderRow, newItem = {} }) {
  const update = (i, next) => onChange(value.map((r, idx) => (idx === i ? next : r)));
  return (
    <Stack spacing={1}>
      {value.map((row, i) => (
        <Paper key={i} variant="outlined" sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'center' }}>
          <Stack sx={{ flex: 1 }}>{renderRow(row, (next) => update(i, next))}</Stack>
          <IconButton onClick={() => onChange(value.filter((_, idx) => idx !== i))}><Iconify icon="solar:trash-bin-trash-linear" /></IconButton>
        </Paper>
      ))}
      <Button startIcon={<Iconify icon="solar:add-circle-linear" />} onClick={() => onChange([...value, { ...newItem }])}>Thêm dòng</Button>
    </Stack>
  );
}
```

- [ ] **Step 2: `DateRangePicker`**

```jsx
// src/components/common/date-range-picker/date-range-picker.jsx
'use client';
import { Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export function DateRangePicker({ value = [null, null], onChange }) {
  const [from, to] = value;
  return (
    <Stack direction="row" spacing={1}>
      <DatePicker label="Từ ngày" value={from} onChange={(v) => onChange([v, to])} slotProps={{ textField: { size: 'small' } }} />
      <DatePicker label="Đến ngày" value={to} onChange={(v) => onChange([from, v])} slotProps={{ textField: { size: 'small' } }} />
    </Stack>
  );
}
```

- [ ] **Step 3: `SeoPanel`**

```jsx
// src/components/common/seo-panel/seo-panel.jsx
'use client';
import { Card, CardContent, Stack, TextField, Switch, FormControlLabel, Typography } from '@mui/material';

export function SeoPanel({ value = {}, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle2">SEO</Typography>
          <TextField label="Title (tối đa 60 ký tự)" value={value.title ?? ''} onChange={(e) => set('title', e.target.value)} helperText={`${(value.title ?? '').length}/60`} />
          <TextField label="Description (tối đa 160 ký tự)" value={value.description ?? ''} onChange={(e) => set('description', e.target.value)} multiline rows={3} helperText={`${(value.description ?? '').length}/160`} />
          <TextField label="Canonical URL" value={value.canonical ?? ''} onChange={(e) => set('canonical', e.target.value)} />
          <FormControlLabel control={<Switch checked={!!value.noindex} onChange={(e) => set('noindex', e.target.checked)} />} label="Noindex" />
        </Stack>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: `AuditTimeline`**

```jsx
// src/components/common/audit-timeline/audit-timeline.jsx
'use client';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

export function AuditTimeline({ entries = [] }) {
  if (!entries.length) return <Typography variant="body2" color="text.secondary">Chưa có hoạt động</Typography>;
  return (
    <Timeline position="right" sx={{ p: 0 }}>
      {entries.map((e, i) => (
        <TimelineItem key={i}>
          <TimelineSeparator><TimelineDot color="primary" />{i < entries.length - 1 && <TimelineConnector />}</TimelineSeparator>
          <TimelineContent>
            <Stack>
              <Typography variant="subtitle2">{e.summary}</Typography>
              <Typography variant="caption" color="text.secondary">{e.actor} · {dayjs(e.at).format('HH:mm DD/MM/YYYY')}</Typography>
            </Stack>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
```

- [ ] **Step 5: `ConfirmDialog`**

```jsx
// src/components/common/confirm-dialog/confirm-dialog.jsx
'use client';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export function ConfirmDialog({ open, title, message, confirmLabel = 'Xác nhận', onCancel, onConfirm, danger = false }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent><Typography variant="body2">{message}</Typography></DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Huỷ</Button>
        <Button onClick={onConfirm} variant="contained" color={danger ? 'error' : 'primary'}>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
```

- [ ] **Step 6: `Can`**

```jsx
// src/components/common/can/can.jsx
'use client';
import { useAuthCan } from 'src/auth/pnj/use-auth-context';
export function Can({ ability, children, fallback = null }) { return useAuthCan(ability) ? children : fallback; }
```

- [ ] **Step 7: `ImportWizard`**

```jsx
// src/components/common/import-wizard/import-wizard.jsx
'use client';
import { Stepper, Step, StepLabel, Box, Button, Stack } from '@mui/material';
import { useState } from 'react';

const STEPS = ['Tải file', 'Xem trước + lỗi', 'Xác nhận'];

export function ImportWizard({ open, onClose, onSubmit, previewRenderer }) {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  if (!open) return null;
  return (
    <Box sx={{ p: 3 }}>
      <Stepper activeStep={step}>{STEPS.map((l) => <Step key={l}><StepLabel>{l}</StepLabel></Step>)}</Stepper>
      <Box sx={{ mt: 3 }}>
        {step === 0 && <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />}
        {step === 1 && previewRenderer?.(file)}
        {step === 2 && <Button variant="contained" onClick={() => onSubmit(file)}>Chạy nhập</Button>}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Trở lại</Button>
        <Button onClick={() => setStep(Math.min(2, step + 1))} disabled={!file}>Tiếp</Button>
        <Button onClick={onClose}>Đóng</Button>
      </Stack>
    </Box>
  );
}
```

- [ ] **Step 8: `AttributeFields`**

```jsx
// src/components/common/attribute-fields/attribute-fields.jsx
// Renders dynamic fields based on attribute_sets definition. attributes: [{code, name, input_type, unit, options[], required}]
'use client';
import { Stack, TextField, MenuItem, Autocomplete, Switch, FormControlLabel } from '@mui/material';

export function AttributeFields({ attributes = [], value = {}, onChange }) {
  const set = (code, v) => onChange({ ...value, [code]: v });
  return (
    <Stack spacing={2}>
      {attributes.map((a) => {
        const v = value[a.code] ?? (a.input_type === 'multiselect' ? [] : '');
        if (a.input_type === 'select') return (
          <TextField key={a.code} select label={a.name} value={v} onChange={(e) => set(a.code, e.target.value)} required={a.required}>
            {a.options.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </TextField>
        );
        if (a.input_type === 'multiselect') return (
          <Autocomplete key={a.code} multiple options={a.options} getOptionLabel={(o) => o.label}
            value={a.options.filter((o) => (v ?? []).includes(o.value))}
            onChange={(_, vs) => set(a.code, vs.map((o) => o.value))}
            renderInput={(p) => <TextField {...p} label={a.name} />} />
        );
        if (a.input_type === 'boolean') return (
          <FormControlLabel key={a.code} control={<Switch checked={!!v} onChange={(e) => set(a.code, e.target.checked)} />} label={a.name} />
        );
        return <TextField key={a.code} label={`${a.name}${a.unit ? ` (${a.unit})` : ''}`} value={v} onChange={(e) => set(a.code, e.target.value)} required={a.required} />;
      })}
    </Stack>
  );
}
```

- [ ] **Step 9: Index files**

For every component above, create `src/components/common/<name>/index.js` that re-exports:
```js
export * from './<name>';
```

- [ ] **Step 10: Commit**

```bash
git add src/components/common/
git commit -m "feat(components): remaining shared components"
```

---

## Phase D — Mock data

### Task D1: Universal mock helpers

**Files:**
- Create: `src/_mock/admin/_helpers.js`

- [ ] **Step 1: Write**

```js
// src/_mock/admin/_helpers.js — paginated mock factory
export function mockPaginate(rows, { page = 1, per_page = 20 } = {}) {
  const start = (page - 1) * per_page;
  return {
    data: rows.slice(start, start + per_page),
    meta: { page, per_page, total: rows.length, last_page: Math.ceil(rows.length / per_page) },
  };
}

export function fakeId(prefix = 'id') { return `${prefix}_${Math.random().toString(36).slice(2, 10)}`; }
```

- [ ] **Step 2: Commit**

```bash
git add src/_mock/admin/_helpers.js
git commit -m "feat(mock): mock helpers"
```

### Task D2 → Dxx: One mock per module

For each module (products, categories, brands, …) create `src/_mock/admin/<module>.js` exporting a `<module>MockList` array and a `<module>MockDetail` object. Data must match the shapes in `pnj-be/src/app/Models/<Model>.php`.

**Example — `products.js`:**

```js
// src/_mock/admin/products.js
export const productsMockList = [
  {
    id: 'p1', code: '0000Y001642', display_code: 'GV0000Y001642',
    name: 'Vòng tay Vàng 41,6% (10K)', slug: 'vong-tay-vang-10k-0000y001642',
    type: 'jewelry', status: 'active',
    brand: { name: 'PNJ', slug: 'pnj' },
    category: { name: 'Vòng tay', slug: 'vong-tay' },
    price_min: 3_516_000, price_max: 3_602_000,
    variants: [{ sku: 'GV0000Y001642-51', size: '51', price: 3_516_000, total_stock: 1 }],
    flags: { is_new: true, fast_delivery_3h: true, installment_0: true },
    rating: { avg: 4.6, count: 128 },
    stats: { sold_count: 34, view_count: 1200 },
    media: ['https://via.placeholder.com/400x400/F2F2F2/5A5A5A?text=PNJ'],
    created_at: '2026-11-01T02:00:00Z',
  },
  // ... 40 similar rows ...
];

export const productsMockDetail = productsMockList[0];
```

Run the same pattern for: `categories, brands, collections, product-lines, attributes, attribute-sets, size-guides, inventories, gold-types, gold-price-regions, gold-prices, orders, return-requests, customers, membership-tiers, promotions, coupons, gift-cards, ecard-categories, ecard-templates, payment-methods, banks, installment-plans, stores, locations, regions, menus, banners, home-sections, landing-pages, pages, faqs, documents, posts, post-categories, reviews, leads, admins, roles, settings, url-redirects, notification-templates, notification-logs, activity-logs`.

- [ ] **Step 1: Create all mock files with 20–40 rows each** (one file per module).
- [ ] **Step 2: Commit after all mocks are in place**

```bash
git add src/_mock/admin/
git commit -m "feat(mock): module mocks for admin screens"
```

---

## Phase E — Admin Module Screens

This phase ships 4 screens per CRUD module (`list`, `new`, `edit`, `detail`), plus special screens listed below.

**File skeleton for each module `<module>`:**

```
src/app/admin/<module>/page.jsx              → renders <Module>ListView
src/app/admin/<module>/new/page.jsx          → renders <Module>NewView
src/app/admin/<module>/[id]/edit/page.jsx    → renders <Module>EditView
src/app/admin/<module>/[id]/page.jsx         → renders <Module>DetailView  (where applicable)
src/sections/admin/<module>/<module>-list-view.jsx
src/sections/admin/<module>/<module>-list-filter.jsx
src/sections/admin/<module>/<module>-list-columns.js
src/sections/admin/<module>/<module>-form.jsx
src/sections/admin/<module>/<module>-form-schema.js
src/sections/admin/<module>/<module>-new-view.jsx
src/sections/admin/<module>/<module>-edit-view.jsx
src/sections/admin/<module>/<module>-detail-view.jsx  (if detail != edit)
src/sections/admin/<module>/use-<module>-list.js
src/sections/admin/<module>/use-<module>-detail.js
```

Each `use-<module>-list.js` SWR hook falls back to the mock module when the API is not reachable:

```js
// src/sections/admin/<module>/use-<module>-list.js
import useSWR from 'swr';
import { adminFetcher } from 'src/lib/pnj-api/swr-fetcher';
import { adminEndpoints } from 'src/lib/pnj-api/endpoints-admin';
import { <module>MockList } from 'src/_mock/admin/<module>s';
import { mockPaginate } from 'src/_mock/admin/_helpers';

export function use<Module>List(params) {
  const key = [adminEndpoints.<module>.list, { params }];
  const { data, error, isLoading } = useSWR(key, adminFetcher, { shouldRetryOnError: false });
  if (error) return { data: mockPaginate(<module>MockList, params), loading: false, isMock: true };
  return { data, loading: isLoading, isMock: false };
}
```

Below, each module gets a short task block. For brevity, the plan gives the pattern once — **repeat identically for every module** unless the module appears in §E.X (special screens).

---

### Task E1: Dashboard

**Files:**
- Create: `src/app/admin/dashboard/page.jsx`
- Create: `src/sections/admin/dashboard/dashboard-view.jsx`
- Create: `src/sections/admin/dashboard/dashboard-kpi-cards.jsx`
- Create: `src/sections/admin/dashboard/dashboard-revenue-chart.jsx`
- Create: `src/sections/admin/dashboard/dashboard-top-products.jsx`
- Create: `src/sections/admin/dashboard/dashboard-low-stock.jsx`
- Create: `src/sections/admin/dashboard/dashboard-search-no-result.jsx`
- Create: `src/_mock/admin/dashboard.js`

- [ ] **Step 1: Write mock (`dashboard.js`)** with `kpi`, `revenueSeries[]`, `topProducts[]`, `lowStock[]`, `searchNoResult[]`.
- [ ] **Step 2: Write `DashboardKpiCards`** — 4 KPI cards (doanh thu, số đơn, AOV, khách mới) in a 4-column grid.
- [ ] **Step 3: Write `DashboardRevenueChart`** — ApexCharts area chart; 30 data points.
- [ ] **Step 4: Write `DashboardTopProducts`** — small table: ảnh, tên, sold_count.
- [ ] **Step 5: Write `DashboardLowStock`** — small table: SKU, SP, size, tồn.
- [ ] **Step 6: Write `DashboardSearchNoResult`** — list keywords + count.
- [ ] **Step 7: Compose `dashboard-view.jsx`** with Grid layout: top row = KPI cards; row 2 = chart (8) + top products (4); row 3 = low stock (6) + search (6).
- [ ] **Step 8: Write page**:

```jsx
// src/app/admin/dashboard/page.jsx
import { DashboardView } from 'src/sections/admin/dashboard/dashboard-view';
export default function Page() { return <DashboardView />; }
```

- [ ] **Step 9: Verify in browser** — `yarn dev` → `/admin/dashboard` renders without errors.
- [ ] **Step 10: Commit** — `feat(admin): dashboard`

---

### Task E2: Product (8-tab form per §11.5)

**Files (full list in §Phase E skeleton):** plus:
- Create: `src/sections/admin/product/product-form-tab-general.jsx`
- Create: `src/sections/admin/product/product-form-tab-variants.jsx`
- Create: `src/sections/admin/product/product-form-tab-attributes.jsx`
- Create: `src/sections/admin/product/product-form-tab-media.jsx`
- Create: `src/sections/admin/product/product-form-tab-description.jsx`
- Create: `src/sections/admin/product/product-form-tab-related.jsx`
- Create: `src/sections/admin/product/product-form-tab-flags.jsx`
- Create: `src/sections/admin/product/product-form-tab-seo.jsx`

- [ ] **Step 1: Columns** — image, name+code, category, brand, price_min/max, stock sum, badges, status, updated_at.
- [ ] **Step 2: Filter bar** — search, status, category (RefSelect), brand, flags (chips).
- [ ] **Step 3: List view** — composes DataTable + FilterBar + mocks.
- [ ] **Step 4: Form schema (Zod)** — name, code, slug, type, category_id, brand_id, product_line_id, collection_ids, variants[], attrs, media_file_ids, descriptions, flags, seo.
- [ ] **Step 5: 8 tab components** — each a `Card` with the fields listed in §11.5. Use VariantGrid, AttributeFields, MediaPicker, RichTextEditor, SeoPanel.
- [ ] **Step 6: Form shell** — react-hook-form + Tabs + sticky save bar when `isDirty`.
- [ ] **Step 7: Side column** — Status, published_at, flags summary, AuditTimeline, "Xem trên site" button.
- [ ] **Step 8: New/Edit views** — `ProductNewView`, `ProductEditView` pass initial values; share `ProductForm`.
- [ ] **Step 9: Pages** — `page.jsx`, `new/page.jsx`, `[id]/edit/page.jsx`.
- [ ] **Step 10: Verify** `/admin/product`, `/admin/product/new`, `/admin/product/p1/edit`.
- [ ] **Step 11: Commit** — `feat(admin): product CRUD + 8-tab form`

---

### Task E3: Category (tree + reorder) [special]

- [ ] **Step 1: List view** — SortableTree on the left (3 columns wide), form for selected node on the right (9 columns).
- [ ] **Step 2: Node form** — name, slug (SlugInput), parent_id (RefSelect filtered to same type), type, audiences (multiselect), icon/thumbnail/banner (MediaPicker), attribute_set_id (RefSelect), filter_codes (sortable chips), default_sort (select), size_guide_id (RefSelect), seo.
- [ ] **Step 3: Pages** — single `/admin/category` page; edit happens inline (no separate `/new`).
- [ ] **Step 4: Commit** — `feat(admin): category tree`

---

### Task E4: Brand, Collection, ProductLine (simple CRUD)

Three independent CRUD modules following §Phase E skeleton pattern. Each has list, new, edit; detail view not needed. Fields per PNJ.md §5.2–5.4.

- [ ] **Step 1: Brand** — name, slug, logo/cover (MediaPicker single), group, origin, is_new_badge, is_featured, sort, status, seo.
- [ ] **Step 2: Collection** — name, slug, brand_id (RefSelect), cover, banner, launch_date, is_wedding, is_new_badge, sort, status, seo.
- [ ] **Step 3: ProductLine** — name, slug, short_description, banner, is_featured_home, sort, status, seo.
- [ ] **Step 4: Commit** — `feat(admin): brand + collection + product-line CRUD`

---

### Task E5: Attribute + AttributeSet + SizeGuide

- [ ] **Step 1: Attribute list** — columns code, name, input_type, option count, is_filterable, filter_display.
- [ ] **Step 2: Attribute form** — code, name, input_type, unit, options (Repeater with value/label/color/icon/sort), flags, filter_display, sort. Lock delete when attribute is in use (`in_use: true` in mock → disabled button + tooltip).
- [ ] **Step 3: AttributeSet** — list + form: name, attributes (RefSelect multi with ordering + required toggle via Repeater).
- [ ] **Step 4: SizeGuide** — list + form: name, content_html (RichText), image_file_ids (MediaPicker), size_table (Repeater: size, circumference_mm, diameter_mm).
- [ ] **Step 5: Commit** — `feat(admin): attribute family`

---

### Task E6: Inventory (special — inline edit)

- [ ] **Step 1: List** — columns sku, product name, size, store, qty_on_hand, qty_reserved, available, synced_from, synced_at.
- [ ] **Step 2: Filter** — store, province, product, hết hàng toggle.
- [ ] **Step 3: Inline adjust** — click qty cell → mini form (new qty + reason textarea) → PATCH `/inventory/adjust`.
- [ ] **Step 4: Bulk actions** — sync POS button, import Excel.
- [ ] **Step 5: Commit** — `feat(admin): inventory`

---

### Task E7: GoldType + GoldPriceRegion + GoldPrice [special]

- [ ] **Step 1: GoldType** — CRUD code/name/purity/karat/group/buy_only/footnote/sort/status.
- [ ] **Step 2: GoldPriceRegion** — CRUD code/name/province_codes/sort/is_default.
- [ ] **Step 3: GoldPrice entry screen** — region selector → table of all gold types × (buy, sell, change%) with batch save; highlight rows with |change| > 3%.
- [ ] **Step 4: GoldPrice chart** — ApexCharts line chart of buy/sell by gold_type over 30 days (select type + range).
- [ ] **Step 5: "Áp giá mới" button** — triggers re-price job; shows confirm dialog (how many products affected).
- [ ] **Step 6: Commit** — `feat(admin): gold prices`

---

### Task E8: Order (list + 7 tab detail) [special]

- [ ] **Step 1: List view** — tabs by status (all/pending/confirmed/processing/shipping/delivered/completed/cancelled/returned) with counts.
- [ ] **Step 2: Columns** — order_no, created_at, buyer (name + phone), item count, grand_total, payment status (StatusBadge), fulfillment method, store, status.
- [ ] **Step 3: Filter** — date range, payment method, payment status, fulfillment, store, province, coupon code, channel.
- [ ] **Step 4: Detail view** per §11.6 — two columns:
  - Left: items list (image, name, size, qty, unit_price, gifts), totals card, promotions_applied, payment transactions, status_history timeline.
  - Right: customer link + tier, fulfillment (address or pickup store), ecard preview + resend, company_invoice, consents, note, admin_note, assignee.
  - Action bar: next valid transition buttons, Cancel (require reason), Print, Issue e-invoice, Create return request.
- [ ] **Step 5: Transition dialog** — select next status + note + optional tracking_no, call `/order/{id}/transition`.
- [ ] **Step 6: Commit** — `feat(admin): order list + detail`

---

### Task E9: ReturnRequest + Review + Lead

- [ ] **Step 1: ReturnRequest** — list (type, status chips), detail (items, reason, media gallery, refund amount, refund method, history), actions (approve/reject/receive/refund/close).
- [ ] **Step 2: Review** — list (product, rating stars, excerpt, has_media icon, status, created_at), bulk approve/hide, detail dialog with reply form.
- [ ] **Step 3: Lead** — list (type chip, name, phone, product/store, assignee, status), detail with note timeline (Repeater) + assign + status change.
- [ ] **Step 4: Commit** — `feat(admin): returns + reviews + leads`

---

### Task E10: Customer + MembershipTier

- [ ] **Step 1: Customer list** — columns name, phone, email, tier, points, order_count, total_spent, last_order_at, status.
- [ ] **Step 2: Customer detail** — tabs: Profile (addresses sub-table), Orders (DataTable), Loyalty history (table), Reviews, Consents, Notes.
- [ ] **Step 3: Loyalty adjust dialog** — points +/- with mandatory reason + idempotency hint.
- [ ] **Step 4: MembershipTier** — CRUD code/name/min_spent/point_rate/benefits_html (RichText)/discount_pct/card_file_id/sort.
- [ ] **Step 5: Commit** — `feat(admin): customer + membership`

---

### Task E11: Promotion + Coupon + GiftCard + Ecard [special]

- [ ] **Step 1: Promotion list** — columns name, type chip, scope summary (e.g. "20 SP"), schedule, used/limit, priority, status chip.
- [ ] **Step 2: Promotion form** — multi-step: (1) info + badge, (2) scope (RefSelect for categories/brands/products + "all_products" toggle + preview count), (3) conditions, (4) actions (switch based on type: discount fields OR tiers Repeater OR gifts Repeater), (5) schedule (DateRangePicker + status).
- [ ] **Step 3: Coupon** — list + generate dialog (`prefix`, `quantity`, `usage_limit_per_customer`); usage sub-table per coupon.
- [ ] **Step 4: GiftCard** — list with masked code, detail showing redemption history; actions: void, extend, resend.
- [ ] **Step 5: EcardCategory + EcardTemplate** — CRUD; template form has SMS preview with variable substitution.
- [ ] **Step 6: Commit** — `feat(admin): promotions family`

---

### Task E12: PaymentMethod + Bank + InstallmentPlan

- [ ] **Step 1: PaymentMethod** — list with drag-to-reorder; form includes config (secret fields masked; "Test kết nối" button → mock success/fail).
- [ ] **Step 2: Bank** — simple CRUD.
- [ ] **Step 3: InstallmentPlan** — form: provider, bank_code (RefSelect to Bank), months (multi-select chips), interest_rate, fee_pct, min_order_amount, applies_to.
- [ ] **Step 4: Commit** — `feat(admin): payments + installment`

---

### Task E13: Store + Location + Region

- [ ] **Step 1: Store list** — table + map toggle (mapbox-gl with markers).
- [ ] **Step 2: Store form** — address, province_code/ward_code (cascaded RefSelects), Mapbox pick-location widget → writes location {type:'Point', coordinates:[lng, lat]}, opening_hours (Repeater: day select + open/close), services (multi-chips), image_file_ids, accept_store_order toggle.
- [ ] **Step 3: Location tree** — province → ward hierarchy; import from JSON button.
- [ ] **Step 4: Region** — list + form (code/name/province_codes multi/sort/banner_file_id).
- [ ] **Step 5: Commit** — `feat(admin): stores + locations + regions`

---

### Task E14: Menu + Banner + HomeSection + LandingPage

- [ ] **Step 1: Menu** — list of 8 locations; clicking a location opens a tree builder (SortableTree) up to 3 levels; each item: label, icon, link_type + RefSelect, column_group, display, badge (NEW), highlight_color, banner image. Preview panel on the right.
- [ ] **Step 2: Banner** — list with position filter; form with image_desktop + image_mobile pickers, schedule (DateRangePicker), region multi, link_url, target_ids.
- [ ] **Step 3: HomeSection** — list with drag-reorder; form switches by `type` (hero_slider / usp / category_icons / brand_carousel / product_tabs / product_line_tabs / post_list / html) — render the correct config fields per type.
- [ ] **Step 4: LandingPage** — blocks builder (same `type`→config switch as HomeSection), product_query filter builder, SEO.
- [ ] **Step 5: Commit** — `feat(admin): menu + banner + home builder + landing`

---

### Task E15: Page + Faq + Document

- [ ] **Step 1: Page** — CRUD: slug, title, type, content_html (RichText), attachment_file_ids (MediaPicker files mode), seo, sort, status.
- [ ] **Step 2: Faq** — CRUD: question, answer_html (RichText), group, category_ids (RefSelect multi), sort, status. List grouped by `group`.
- [ ] **Step 3: Document** — CRUD: title, group, year, file_id (single file picker), published_at, status.
- [ ] **Step 4: Commit** — `feat(admin): page + faq + document`

---

### Task E16: Post + PostCategory (blog)

- [ ] **Step 1: PostCategory** — tree + form (parent_id, slug, description, seo).
- [ ] **Step 2: Post list** — thumbnail, title, category, author, view_count, published_at, status chip.
- [ ] **Step 3: Post form** — title, slug, excerpt, content (RichText), thumbnail, category_id + category_ids, tags, author_admin_id (RefSelect), related_product_ids (RefSelect multi), is_featured, published_at (hẹn giờ), status (draft/scheduled/published), seo.
- [ ] **Step 4: Commit** — `feat(admin): blog`

---

### Task E17: Admin + Role

- [ ] **Step 1: Admin (User) list** — name, email, role, status, 2FA badge, last_login_at.
- [ ] **Step 2: Admin form** — name, email, phone, role_id, position, bio, avatar_file_id, status; Reset 2FA button (dialog).
- [ ] **Step 3: Role list** — name, key, color chip, permission count.
- [ ] **Step 4: Role form** — key, name, description, color, icon; permissions = matrix (module rows × action columns). Pull matrix from `/permission/matrix` with mock fallback.
- [ ] **Step 5: Commit** — `feat(admin): admin + role`

---

### Task E18: Setting + UrlRedirect + NotificationTemplate + NotificationLog + ActivityLog

- [ ] **Step 1: Setting** — tabs per section (general, contact, social, checkout, usp, seo, integrations). Form generates fields from mock `settingsMockDefinition`.
- [ ] **Step 2: UrlRedirect** — list + simple form (from_path, to_path, code select 301/302, is_active).
- [ ] **Step 3: NotificationTemplate** — list + form (code, channel select, subject, body with variable helpers, zns_template_id). Send test dialog.
- [ ] **Step 4: NotificationLog** — read-only list with status chips, filter by channel/status/date; row click opens payload dialog.
- [ ] **Step 5: ActivityLog** — read-only list; filter by admin, module, subject_id, date; row click shows `changes` diff dialog.
- [ ] **Step 6: Commit** — `feat(admin): system module`

---

## Phase F — Landing skeleton (placeholders)

Create empty route groups + `page.jsx` placeholders so the admin and landing trees are both wired. Actual landing UI is out of scope for this plan (user said "chỉ làm thiết kế phần admin trước").

### Task F1: Landing shell

**Files:**
- Create: `src/app/landing/layout.jsx`
- Create: `src/app/landing/page.jsx`
- Create: `src/layouts/landing/landing-layout.jsx`
- Create: `src/sections/landing/placeholder-view.jsx`

- [ ] **Step 1: Empty `LandingLayout`** — just a `main` wrapper for now.
- [ ] **Step 2: `PlaceholderView`** — centered card: "Landing UI sẽ thiết kế sau."
- [ ] **Step 3: Pages** compose both.
- [ ] **Step 4: Commit** — `feat(landing): skeleton placeholder`

---

## Phase G — Smoke & cleanup

### Task G1: ESLint + Prettier pass

- [ ] **Step 1:** `yarn lint:fix && yarn fm:fix`
- [ ] **Step 2:** `yarn lint` — expect 0 errors.
- [ ] **Step 3:** Commit — `chore: lint fix`

### Task G2: Dev smoke test

- [ ] **Step 1:** `yarn dev` and click through every item in the sidebar once.
- [ ] **Step 2:** Verify no console errors.
- [ ] **Step 3:** Document any TODOs that surfaced in `docs/pnj-admin-ui-known-issues.md`.
- [ ] **Step 4:** Commit — `docs: admin UI known issues`

---

## Self-Review

**Spec coverage against pnj-style.md §10–11:**
- §10 tokens (color/font/spacing) → Task A2–A3 ✓
- §11.1 shell (sidebar/topbar/layout) → Task B1–B4 ✓
- §11.2 all 18 shared components → Task C1–C11 ✓
- §11.3 per-module screens → Task E1–E18 covers all 28 rows ✓
- §11.4 order status colors → `status-colors.js` in A2 + Task E8 ✓
- §11.5 product 8-tab form → Task E2 ✓
- §11.6 order detail two-column layout → Task E8 ✓
- Naming convention `<module>-<function>.jsx` → §Phase E skeleton ✓

**Placeholder scan:** The §Phase E skeleton defines the file pattern once; every Task E block spells out the concrete screens, fields, and special behaviours for its module. No "TBD" / "add validation" / "handle edge cases" placeholders.

**Type consistency:** `adminPaths`, `adminEndpoints`, and section component names use the same kebab/PascalCase mapping across all tasks (e.g. `adminPaths.product.root` ↔ `src/app/admin/product/page.jsx` ↔ `ProductListView`).

---

## Execution notes for the implementer

- **Order matters:** A → B → C → D → E (any module) → F → G. Phase E modules are independent of each other after C is done, so they can be parallelised.
- **Mock-first:** every SWR hook falls back to the module's mock when the API 404/500s. Backend wiring happens later.
- **No tests** in this plan: UI design phase, user asked for static screens with mock data. Smoke test via dev server click-through only.
- **Keep Minimal Kit sections** (`src/sections/user`, `src/sections/overview`, etc.) untouched as reference material, per user decision.
