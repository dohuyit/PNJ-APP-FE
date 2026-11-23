# PNJ Frontend Landing Template Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Laravel Blade storefront template from `H:/WorkSpace/PNJ-App/` into the Next.js app at `H:/WorkSpace/PNJ-Project/pnj-fe/` so the public-facing UI is a pixel-for-pixel replica, using mock data only (no backend wiring).

**Architecture:** Direct 1:1 translation of Blade → JSX. We keep the original Bootstrap 5.3.2 markup, the shipped CSS files, Font Awesome, and Swiper exactly as they are in the Laravel app. No redesign, no Material UI wrapping, no Tailwind rewrite. Everything lives under a new `(storefront)` route group so the existing admin UI at `/admin` stays untouched. All dynamic content comes from static mock arrays in `src/_mock/storefront/`.

**Tech Stack:**
- Next.js 14 App Router (existing)
- Bootstrap 5.3.2 CSS + JS (CDN or npm, same version as Blade)
- Swiper 11 (same version as Blade)
- Font Awesome 6.7.1 (CDN, same version)
- SweetAlert2 11 (same version, for `<x-alert />` behavior)
- Original CSS files copied verbatim from `PNJ-App/public/frontend/css/`
- Original images/videos copied verbatim from `PNJ-App/public/frontend/{image,video}/`

**Scope / non-goals:**
- Admin UI (`/admin/**`) is OUT OF SCOPE — user explicitly said "ui admin tạm thời để như hiện tại".
- No real API calls — all data is mocked.
- No i18n changes — Vietnamese strings stay inlined exactly as Blade (that is the template).
- No backend auth integration — login/register are UI-only with fake submit handlers.

**Source file map (Blade → Next.js route):**

| Blade | Route | Notes |
|---|---|---|
| `client.blade.php` | `(storefront)/page.jsx` | Landing / home |
| `detail.blade.php` | `(storefront)/product/[id]/page.jsx` | Product detail |
| `detail-category.blade.php` | `(storefront)/category/[type]/[id]/page.jsx` | Category listing |
| `detail-search.blade.php` | `(storefront)/search/page.jsx` | Search results |
| `detail-user.blade.php` | `(storefront)/account/[id]/page.jsx` | User profile |
| `detail-voucher.blade.php` | `(storefront)/voucher/page.jsx` | Voucher listing/detail |
| `detail-order.blade.php` | `(storefront)/order/[id]/page.jsx` | Order detail |
| `detail-info-order.blade.php` | `(storefront)/order-info/[id]/page.jsx` | Order info / tracking |
| `cart.blade.php` | `(storefront)/cart/page.jsx` | Cart |
| `order.blade.php` | `(storefront)/checkout/page.jsx` | Checkout |
| `order-success.blade.php` | `(storefront)/order-success/page.jsx` | Order success |
| `auth/login.blade.php` | `(storefront)/sign-in/page.jsx` | Login |
| `auth/register.blade.php` | `(storefront)/sign-up/page.jsx` | Register |
| `auth/set-password.blade.php` | `(storefront)/set-password/page.jsx` | Set password |

**Translation rules (apply to every task):**
1. Keep every HTML class name byte-for-byte identical to the Blade file. Bootstrap classes, `col-md-4`, `swiper-slide`, custom classes — all preserved.
2. Blade `@foreach ($items as $item)` → JSX `{items.map((item) => (...))}` with `key={item.id}`.
3. Blade `@if ... @else ... @endif` → ternary / `&&` in JSX.
4. Blade `{{ asset('frontend/image/x.svg') }}` → `/frontend/image/x.svg` (we place assets under Next.js `public/frontend/`).
5. Blade `{{ Storage::url($x->image) }}` → the mock's image path — point to `/frontend/image/<mocked>.jpg`.
6. Blade `{{ route('xxx') }}` → the matching Next.js route from the table above (or `#` if the target is unmapped — use `#` as placeholder exactly like the Blade already does in many places).
7. Blade `{{ formatPrice($x) }}` → `fCurrency(x)` from `src/utils/format-number` (per MEMORY: utils formatters mandatory, never inline `toLocaleString`).
8. Blade `\Carbon\Carbon::parse($x)->format('d-m-Y')` → `fDate(x, 'DD-MM-YYYY')` from `src/utils/format-time`.
9. `class=` → `className=`, `for=` → `htmlFor=`, self-closing `<img />`, `<input />`, `<br />`.
10. Inline `onclick=` from CDN scripts stays. For Bootstrap collapses/tabs/carousels, the Bootstrap JS bundle (loaded in the layout) handles `data-bs-*` attributes — do **not** convert these to React state.
11. When Blade pushes `@push('link')` or `@push('script')` with a page-specific CSS, import that CSS at the top of the page component via `import 'public/frontend/css/<name>.css'` — Next.js supports importing CSS from anywhere in a client-tree page.
12. Every storefront page is a Client Component (`'use client'` at top) because of Bootstrap JS, Swiper init, and inline event handlers.

**Shortcut tag:** any place we stub out behavior (e.g., no real cart state, no real auth), add exactly one line: `// shortcut: <limit>, <when to upgrade>` per the ponytail rules.

---

## File Structure

```
pnj-fe/
├── public/frontend/                       # verbatim copy from PNJ-App/public/frontend
│   ├── css/                               # 13 CSS files, unchanged
│   ├── image/                             # ~80 images/svg/webp
│   ├── js/                                # client.js, cart.js, detail.js, helper.js, etc.
│   └── video/                             # video-pnj.mp4
├── src/
│   ├── _mock/storefront/
│   │   ├── index.js                       # re-exports
│   │   ├── banners.js
│   │   ├── vouchers.js
│   │   ├── brands.js
│   │   ├── products.js                    # new + bestseller + related
│   │   ├── collections.js
│   │   ├── jewelry-lines.js
│   │   ├── categories.js                  # top-level nav
│   │   ├── product-types.js
│   │   ├── sub-banner.js
│   │   ├── blogs.js
│   │   ├── customer.js                    # logged-in user fixture
│   │   └── orders.js
│   ├── sections/storefront/
│   │   ├── layout/
│   │   │   ├── storefront-header.jsx      # port of header.blade.php
│   │   │   ├── storefront-footer.jsx      # port of footer.blade.php
│   │   │   ├── storefront-chatbot.jsx     # port of <x-chatbot />
│   │   │   └── storefront-bootstrap-boot.jsx # loads Bootstrap JS once client-side
│   │   └── (sections per page, extracted if the page > ~300 lines)
│   └── app/
│       └── (storefront)/
│           ├── layout.jsx                 # Bootstrap/FA/Swiper CSS + Header/Footer
│           ├── page.jsx                   # home (client.blade.php)
│           ├── product/[id]/page.jsx
│           ├── category/[type]/[id]/page.jsx
│           ├── search/page.jsx
│           ├── account/[id]/page.jsx
│           ├── voucher/page.jsx
│           ├── order/[id]/page.jsx
│           ├── order-info/[id]/page.jsx
│           ├── cart/page.jsx
│           ├── checkout/page.jsx
│           ├── order-success/page.jsx
│           ├── sign-in/page.jsx
│           ├── sign-up/page.jsx
│           └── set-password/page.jsx
```

**Why a `(storefront)` route group:** Next.js route groups do not add a URL segment, so `/` still renders `(storefront)/page.jsx` while `/admin/**` is unaffected. The group also lets us scope a dedicated `layout.jsx` that pulls in Bootstrap CSS without leaking it into the admin tree.

---

## Phase 1 — Project Setup

### Task 1: Copy static assets

**Files:**
- Create: `public/frontend/css/*.css` (13 files from `PNJ-App/public/frontend/css/`)
- Create: `public/frontend/image/*` (all files from `PNJ-App/public/frontend/image/`)
- Create: `public/frontend/js/*.js` (all files from `PNJ-App/public/frontend/js/`)
- Create: `public/frontend/video/*` (all files from `PNJ-App/public/frontend/video/`)

- [ ] **Step 1: Copy assets verbatim**

```bash
cp -r "H:/WorkSpace/PNJ-App/public/frontend" "H:/WorkSpace/PNJ-Project/pnj-fe/public/frontend"
```

- [ ] **Step 2: Verify count**

```bash
ls "H:/WorkSpace/PNJ-Project/pnj-fe/public/frontend/image" | wc -l
ls "H:/WorkSpace/PNJ-Project/pnj-fe/public/frontend/css" | wc -l
```
Expected: image count matches source; css count = 13.

- [ ] **Step 3: Commit**

```bash
git add public/frontend
git commit -m "chore(storefront): import static assets from PNJ-App"
```

---

### Task 2: Install Bootstrap, Swiper, SweetAlert2, Font Awesome

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install deps**

```bash
cd H:/WorkSpace/PNJ-Project/pnj-fe
npm install bootstrap@5.3.2 swiper@11 sweetalert2@11
```

Font Awesome stays CDN-only (matches Blade `<link href="https://cdnjs.cloudflare.com/.../font-awesome/6.7.1/...">`).

- [ ] **Step 2: Verify**

```bash
node -e "console.log(require('bootstrap/package.json').version, require('swiper/package.json').version)"
```
Expected: `5.3.2 11.x.x`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(storefront): add bootstrap, swiper, sweetalert2 deps"
```

---

### Task 3: Create the storefront route group + layout skeleton

**Files:**
- Create: `src/app/(storefront)/layout.jsx`
- Create: `src/sections/storefront/layout/storefront-bootstrap-boot.jsx`

- [ ] **Step 1: Write `storefront-bootstrap-boot.jsx`**

```jsx
'use client';

import { useEffect } from 'react';

// Loads Bootstrap JS bundle on the client once. CSS is imported statically in the layout.
export default function StorefrontBootstrapBoot() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return null;
}
```

- [ ] **Step 2: Write `src/app/(storefront)/layout.jsx`**

```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css/bundle';
import 'public/frontend/css/style.css';
import 'public/frontend/css/chatbot.css';

import StorefrontBootstrapBoot from 'src/sections/storefront/layout/storefront-bootstrap-boot';

export const metadata = { title: 'PNJ' };

export default function StorefrontLayout({ children }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css"
      />
      <div className="wrapper">{children}</div>
      <StorefrontBootstrapBoot />
    </>
  );
}
```

Note: `public/frontend/css/style.css` is imported via Next.js path alias. If the alias fails, use a relative path from the file: `../../../public/frontend/css/style.css`.

- [ ] **Step 3: Verify the dev server starts and `/` renders without the admin shell**

```bash
npm run dev
```
Open `http://localhost:3000/` — expect an empty wrapper div with Bootstrap CSS applied. The existing home page at `src/app/landing/` is empty, so `(storefront)/page.jsx` (next task) will own `/`.

- [ ] **Step 4: Commit**

```bash
git add src/app/(storefront)/layout.jsx src/sections/storefront/layout/storefront-bootstrap-boot.jsx
git commit -m "feat(storefront): add route-group layout with bootstrap + swiper CSS"
```

---

### Task 4: Mock data — categories, product-types, jewelry-lines, collections, brands, sub-banner

**Files:**
- Create: `src/_mock/storefront/categories.js`
- Create: `src/_mock/storefront/product-types.js`
- Create: `src/_mock/storefront/jewelry-lines.js`
- Create: `src/_mock/storefront/collections.js`
- Create: `src/_mock/storefront/brands.js`
- Create: `src/_mock/storefront/sub-banner.js`
- Create: `src/_mock/storefront/index.js`

These mocks drive the header nav, home sections, and the category dropdown. Use the exact Vietnamese labels the Blade uses.

- [ ] **Step 1: Write category/product-type/jewelry-line mocks**

```js
// src/_mock/storefront/categories.js
// Mirrors $categories passed to the Blade header. Key = id, value = display name.
export const categoriesMock = {
  1: 'Trang sức',
  2: 'Đồng hồ',
  3: 'Quà tặng',
  4: 'Khuyến mãi',
  5: 'Câu chuyện PNJ',
};
```

```js
// src/_mock/storefront/product-types.js
export const productTypesMock = {
  1: 'Nhẫn',
  2: 'Dây chuyền',
  3: 'Bông tai',
  4: 'Lắc tay',
  5: 'Vòng tay',
  6: 'Mặt dây',
  7: 'Charm',
};
```

```js
// src/_mock/storefront/jewelry-lines.js
export const jewelryLinesMock = [
  { id: 1, name: 'Kim cương' },
  { id: 2, name: 'Vàng 24K' },
  { id: 3, name: 'Vàng 18K' },
  { id: 4, name: 'Bạc' },
  { id: 5, name: 'Đá quý' },
];
```

```js
// src/_mock/storefront/collections.js
export const collectionsMock = [
  { id: 1, name: 'BST Hello Kitty', image_thumbnail: '/frontend/image/banner-test.webp' },
  { id: 2, name: 'BST Xuân 2025', image_thumbnail: '/frontend/image/XUAN2025-Vang24K_Banner-400x270.webp' },
  { id: 3, name: 'BST Kim cương', image_thumbnail: '/frontend/image/banner-test.webp' },
  { id: 4, name: 'BST Vàng 24K', image_thumbnail: '/frontend/image/XUAN2025-Vang24K_Banner-400x270.webp' },
];
```

```js
// src/_mock/storefront/brands.js
export const brandsMock = [
  { id: 1, name: 'PNJ', image_thumbnail: '/frontend/image/banner-test.webp', logo_brand: '/frontend/image/pnj.com.vn.png' },
  { id: 2, name: 'STYLE BY PNJ', image_thumbnail: '/frontend/image/banner-test.webp', logo_brand: '/frontend/image/pnj.com.vn.png' },
  { id: 3, name: 'DISNEY | PNJ', image_thumbnail: '/frontend/image/banner-test.webp', logo_brand: '/frontend/image/pnj.com.vn.png' },
  { id: 4, name: 'PNJART', image_thumbnail: '/frontend/image/banner-test.webp', logo_brand: '/frontend/image/pnj.com.vn.png' },
];
```

```js
// src/_mock/storefront/sub-banner.js
export const subBannerMock = {
  id: 1,
  link: '#',
  banner_image: '/frontend/image/Banner-lg-admin.jpg',
};
```

```js
// src/_mock/storefront/index.js
export * from './banners';
export * from './brands';
export * from './blogs';
export * from './categories';
export * from './collections';
export * from './customer';
export * from './jewelry-lines';
export * from './orders';
export * from './product-types';
export * from './products';
export * from './sub-banner';
export * from './vouchers';
```

- [ ] **Step 2: Commit**

```bash
git add src/_mock/storefront
git commit -m "feat(storefront): add nav + home mock data (categories, brands, collections)"
```

---

### Task 5: Mock data — banners, vouchers, products, blogs, customer, orders

**Files:**
- Create: `src/_mock/storefront/banners.js`
- Create: `src/_mock/storefront/vouchers.js`
- Create: `src/_mock/storefront/products.js`
- Create: `src/_mock/storefront/blogs.js`
- Create: `src/_mock/storefront/customer.js`
- Create: `src/_mock/storefront/orders.js`

- [ ] **Step 1: Banners**

```js
// src/_mock/storefront/banners.js
export const bannersMock = [
  { id: 1, name: 'Banner 1', banner_image: '/frontend/image/1200x450-nhan-t01-25 (1).jpg' },
  { id: 2, name: 'Banner 2', banner_image: '/frontend/image/GIAVANG-_THÔNG_TIN_HOMEPAGE_-_15.01.jpg' },
  { id: 3, name: 'Banner 3', banner_image: '/frontend/image/banner-test.webp' },
];
```

- [ ] **Step 2: Vouchers**

```js
// src/_mock/storefront/vouchers.js
export const vouchersMock = [
  {
    id: 1,
    voucher_code: 'PNJNEW10',
    is_fixed: 0,
    discount_amount: 10,
    min_order_value: 500000,
    end_date: '2026-12-31',
  },
  {
    id: 2,
    voucher_code: 'PNJXUAN25',
    is_fixed: 1,
    discount_amount: 200000,
    min_order_value: 2000000,
    end_date: '2026-12-31',
  },
  {
    id: 3,
    voucher_code: 'PNJVIP',
    is_fixed: 0,
    discount_amount: 15,
    min_order_value: 5000000,
    end_date: '2026-12-31',
  },
];
```

- [ ] **Step 3: Products**

```js
// src/_mock/storefront/products.js
const img = '/frontend/image/Frame 55883.png';

function build(id, name, price, original) {
  return {
    id,
    product_name: name,
    product_image: img,
    sale_price: price,
    original_price: original ?? price,
    rating: 5,
    sold: 200,
  };
}

export const newProductsMock = [
  build(1, 'Nhẫn Vàng 24K PNJ XMXMW000001', 15500000),
  build(2, 'Bông tai Vàng trắng 14K đính đá Topaz PNJ TPXMW000045', 6801000),
  build(3, 'Dây chuyền Vàng 18K PNJ DXMXMW000012', 8900000, 10500000),
  build(4, 'Lắc tay Vàng 24K PNJ LXMXMW000003', 12300000),
  build(5, 'Mặt dây Kim cương PNJ MDXMW000011', 24500000),
  build(6, 'Charm Vàng 18K PNJ CHXMW000034', 2100000),
  build(7, 'Vòng tay Bạc PNJ VTXMW000055', 890000),
  build(8, 'Nhẫn Kim cương PNJ XMXMW000078', 42000000, 48000000),
];

export const featuredProductsMock = [
  build(9, 'Nhẫn Vàng 24K PNJ (Best Seller)', 13500000),
  build(10, 'Bông tai Vàng trắng 14K PNJ (Best Seller)', 5800000),
  build(11, 'Dây chuyền Vàng 18K PNJ (Best Seller)', 7900000),
  build(12, 'Lắc tay Vàng 24K PNJ (Best Seller)', 11300000),
];

// Products shown under "Bộ sưu tập mới" when a collection is active.
export const collectionProductsMock = {
  1: newProductsMock.slice(0, 6),
  2: newProductsMock.slice(2, 8),
  3: featuredProductsMock,
  4: newProductsMock.slice(0, 4),
};

// Products under "Dòng hàng nổi bật" per jewelry line.
export const jewelryLineProductsMock = {
  1: newProductsMock.slice(0, 4),
  2: newProductsMock.slice(4, 8),
  3: featuredProductsMock,
  4: newProductsMock.slice(2, 6),
  5: newProductsMock.slice(1, 5),
};
```

- [ ] **Step 4: Blogs**

```js
// src/_mock/storefront/blogs.js
export const blogsMock = [
  {
    id: 1,
    thumbnail: '/frontend/image/thumbnail2-bst-bling-bling-fruit-tu-pnj-hello-kitty-cung-bestie-to-diem-lung-linh-mua-le-hoi-2024.jpg',
    title: 'BST Bling Bling Fruit từ PNJ ❤ Hello Kitty: Cùng bestie tô điểm lung linh mùa lễ hội 2024',
    excerpt: 'PNJ ❤ Hello Kitty mang đến một bất ngờ lấp lánh cho besties với BST Bling Bling Fruit, hứa hẹn sẽ làm say đắm trái tim của mọi tín đồ tiệc tùng.',
  },
  {
    id: 2,
    thumbnail: '/frontend/image/thumbnail2-tang-nang-mua-giang-sinh-ruc-ro-voi-6-mon-qua-trang-suc-kim-cuong-y-nghia.jpg',
    title: 'Tặng nàng mùa Giáng sinh rực rỡ với 6 món quà trang sức kim cương ý nghĩa',
    excerpt: 'Hãy để "viên kim cương đầu tiên" trở thành món quà tưởng thưởng cho hành trình 2024 tuyệt vời của bạn và những người thân yêu nhé!',
  },
];
export const blogBannerMock = '/frontend/image/GIAVANG-_THÔNG_TIN_HOMEPAGE_-_15.01.jpg';
```

- [ ] **Step 5: Customer fixture (no auth integration)**

```js
// src/_mock/storefront/customer.js
// shortcut: no real auth, upgrade when auth API is ready.
export const currentCustomerMock = {
  id: 42,
  username: 'Zeno',
  email: 'zenohihihihi@gmail.com',
  phone: '0901234567',
  address: '170E Phan Đăng Lưu, P.3, Q.Phú Nhuận, TP.HCM',
  avatar: '/frontend/image/avatar-default.jpg',
};
```

- [ ] **Step 6: Orders**

```js
// src/_mock/storefront/orders.js
import { newProductsMock } from './products';

export const ordersMock = [
  {
    id: 101,
    code: 'PNJ-000101',
    created_at: '2026-10-28',
    status: 'completed',
    total: 15500000,
    items: [
      { ...newProductsMock[0], quantity: 1, size: '12' },
    ],
  },
  {
    id: 102,
    code: 'PNJ-000102',
    created_at: '2026-11-02',
    status: 'processing',
    total: 6801000,
    items: [
      { ...newProductsMock[1], quantity: 1, size: '14' },
    ],
  },
];
```

- [ ] **Step 7: Verify imports**

```bash
node -e "const m = require('./src/_mock/storefront'); console.log(Object.keys(m));"
```
Expected: lists `bannersMock, vouchersMock, brandsMock, newProductsMock, ...`

- [ ] **Step 8: Commit**

```bash
git add src/_mock/storefront
git commit -m "feat(storefront): add products, vouchers, blogs, orders mocks"
```

---

## Phase 2 — Shared Layout Components

### Task 6: Port the header (`header.blade.php` → `storefront-header.jsx`)

**Files:**
- Create: `src/sections/storefront/layout/storefront-header.jsx`

**Translation reference:** `H:/WorkSpace/PNJ-App/resources/views/frontend/layouts/include/header.blade.php` (315 lines).

- [ ] **Step 1: Write the component**

Direct JSX translation. Preserve every `className`, `data-bs-*`, and inline image tag. Use mocks for `categories`, `productTypes`, `jewelryLines`, `collections`, `brands`, `subBanner`, and `currentCustomerMock`. Replace route helpers:
- `route('client.home')` → `/`
- `route('client.cart.show')` → `/cart`
- `route('client.login.form')` → `/sign-in`
- `route('client.register.form')` → `/sign-up`
- `route('client.logout.process')` → `#` (shortcut — no auth yet)
- `route('client.search')` → `/search`
- `route('category.show', ['type' => $type, 'id' => $id])` → `/category/${type}/${id}`
- `route('user.profile', $id)` → `/account/${id}`
- `route('orders.byCustomer', $id)` → `/account/${id}` (same page in our port)

Use Next.js `<Link>` from `next/link` for internal navigation; keep `<a>` tags for `#` placeholders so Bootstrap dropdowns don't break.

- [ ] **Step 2: Mount in the storefront layout**

Edit `src/app/(storefront)/layout.jsx`:

```jsx
import StorefrontHeader from 'src/sections/storefront/layout/storefront-header';
// ...
<div className="wrapper">
  <StorefrontHeader />
  {children}
</div>
```

- [ ] **Step 3: Verify in browser**

Expected: Header renders with the same three-column top bar (shareholder / logo / hotline-cart-user), Bootstrap navbar with dropdown submenu on "Trang sức", mobile responsive variant hidden on desktop.

- [ ] **Step 4: Commit**

```bash
git add src/sections/storefront/layout/storefront-header.jsx src/app/(storefront)/layout.jsx
git commit -m "feat(storefront): port blade header to react"
```

---

### Task 7: Port the footer (`footer.blade.php` → `storefront-footer.jsx`)

**Files:**
- Create: `src/sections/storefront/layout/storefront-footer.jsx`

- [ ] **Step 1: Translate footer verbatim**

131 lines of static HTML. No dynamic data. Replace asset URLs (`{{ asset('frontend/image/x') }}` → `/frontend/image/x`).

- [ ] **Step 2: Mount in the layout**

```jsx
import StorefrontFooter from 'src/sections/storefront/layout/storefront-footer';
// ...
<StorefrontFooter />
```

- [ ] **Step 3: Visual check**

Expected: Six-column footer with logo, company info, about us, services + policy, social icons, payment methods, certification.

- [ ] **Step 4: Commit**

```bash
git add src/sections/storefront/layout/storefront-footer.jsx src/app/(storefront)/layout.jsx
git commit -m "feat(storefront): port blade footer to react"
```

---

### Task 8: Port the chatbot stub (`<x-chatbot />`)

**Files:**
- Read: `H:/WorkSpace/PNJ-App/resources/views/components/chatbot.blade.php` (if it exists) to confirm markup
- Create: `src/sections/storefront/layout/storefront-chatbot.jsx`

- [ ] **Step 1: Locate the component source**

```bash
ls "H:/WorkSpace/PNJ-App/resources/views/components/"
```

If a chatbot component exists, translate it. If not, render an empty wrapper div with the `.chatbot` class so `chatbot.css` positioning still applies.

- [ ] **Step 2: Mount only on home**

```jsx
// in src/app/(storefront)/page.jsx (home)
<StorefrontChatbot />
```

Matches Blade's `@if (Request::is('/'))` check.

- [ ] **Step 3: Commit**

```bash
git add src/sections/storefront/layout/storefront-chatbot.jsx
git commit -m "feat(storefront): port chatbot shell"
```

---

## Phase 3 — Landing Page (home)

### Task 9: Port `client.blade.php` → `(storefront)/page.jsx`

**Files:**
- Create: `src/app/(storefront)/page.jsx`

**Translation reference:** `H:/WorkSpace/PNJ-App/resources/views/frontend/client.blade.php` (496 lines).

Sections to port (keep the same section IDs — CSS keys off them):
1. `#slider` — Bootstrap carousel over `bannersMock`.
2. `#group-about` — 3 service boxes (Giao hàng 3H / Phục vụ 24/7 / Thu đổi 48H), static.
3. `#group-voucher` — card grid over `vouchersMock` with copy-code button.
4. `#group-brand` — Swiper over `brandsMock`.
5. `#group-products-option` — Bootstrap tabs "Sản phẩm mới" (newProductsMock) / "Sản phẩm bán chạy" (featuredProductsMock), each a Swiper.
6. `#group-collection` — Swiper of collections thumbnails + Swiper of active collection's products (hook into `useState` for active id, pull from `collectionProductsMock`).
7. `#group-jewelry-line` — buttons over `jewelryLinesMock`, below them a Swiper of the active line's products (`jewelryLineProductsMock`).
8. `#group-media` — static title image + video (`video-pnj.mp4`).
9. `#group-blogs` — blog banner + 2 blog cards from `blogsMock`.

- [ ] **Step 1: Write the page with mocks**

```jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

import {
  bannersMock,
  vouchersMock,
  brandsMock,
  newProductsMock,
  featuredProductsMock,
  collectionsMock,
  collectionProductsMock,
  jewelryLinesMock,
  jewelryLineProductsMock,
  blogsMock,
  blogBannerMock,
} from 'src/_mock/storefront';

import StorefrontChatbot from 'src/sections/storefront/layout/storefront-chatbot';

// shortcut: Swipers initialized once on mount; if mocks become dynamic, re-init on data change.
export default function StorefrontHomePage() {
  const [activeCollection, setActiveCollection] = useState(collectionsMock[0]?.id);
  const [activeJewelryLine, setActiveJewelryLine] = useState(jewelryLinesMock[0]?.id);

  useEffect(() => {
    // Brand swiper
    new Swiper('.myBrand', {
      modules: [Navigation, Pagination],
      slidesPerView: 2,
      spaceBetween: 16,
      navigation: { nextEl: '#group-brand .swiper-button-next', prevEl: '#group-brand .swiper-button-prev' },
      pagination: { el: '#group-brand .swiper-pagination', clickable: true },
      breakpoints: { 768: { slidesPerView: 3 }, 992: { slidesPerView: 4 } },
    });
    // Product swipers — one per `.myBestseller` wrapper
    document.querySelectorAll('.myBestseller').forEach((el) => {
      new Swiper(el, {
        modules: [Navigation],
        slidesPerView: 2,
        spaceBetween: 16,
        navigation: {
          nextEl: el.parentElement.querySelector('.swiper-button-next'),
          prevEl: el.parentElement.querySelector('.swiper-button-prev'),
        },
        breakpoints: { 768: { slidesPerView: 3 }, 992: { slidesPerView: 4 } },
      });
    });
    // Collection thumbnails
    new Swiper('.sliderCollection', {
      modules: [Navigation, Pagination],
      slidesPerView: 3,
      spaceBetween: 12,
      navigation: {
        nextEl: '#group-collection .swiper-button-next',
        prevEl: '#group-collection .swiper-button-prev',
      },
      pagination: { el: '#group-collection .swiper-pagination', clickable: true },
      breakpoints: { 992: { slidesPerView: 4 } },
    });
  }, []);

  const activeCollectionProducts = collectionProductsMock[activeCollection] ?? [];
  const activeJewelryLineProducts = jewelryLineProductsMock[activeJewelryLine] ?? [];

  return (
    <>
      <main>
        {/* === #slider ... exact JSX from client.blade.php lines 7–39 === */}
        {/* === #group-about ... lines 40–64 === */}
        {/* === #group-voucher ... lines 65–125 (wrap in vouchersMock.length > 0 check) === */}
        {/* === #group-brand ... lines 126–156 === */}
        {/* === #group-products-option (tabs) ... lines 157–291 === */}
        {/* === #group-collection ... lines 293–358 (bind to activeCollection + activeCollectionProducts) === */}
        {/* === #group-jewelry-line ... lines 360–410 (bind to activeJewelryLine + activeJewelryLineProducts) === */}
        {/* === #group-media ... lines 412–423 === */}
        {/* === #group-blogs ... lines 425–479 === */}
      </main>
      <StorefrontChatbot />
    </>
  );
}
```

**Important for the implementer:** each `/* === ... === */` placeholder in the block above must be replaced by the real JSX translation of the Blade range cited. Do not commit with comments — translate every section. Preserve `className`, `data-bs-target`, `data-bs-slide`, `data-bs-toggle` exactly.

- [ ] **Step 2: Attach collection/jewelry-line click handlers**

For `#group-collection`:
```jsx
<div
  key={item.id}
  className="swiper-slide collection-item"
  data-id={item.id}
  onClick={() => setActiveCollection(item.id)}
  data-active={item.id === activeCollection ? 'true' : undefined}
>
  <img src={item.image_thumbnail} className="img-fluid" alt={item.name} />
</div>
```

For jewelry-line buttons:
```jsx
<button
  key={line.id}
  type="button"
  data-id={line.id}
  onClick={() => setActiveJewelryLine(line.id)}
  className={`btn lh-lg item-tags fw-bold text-capitalize ${line.id === activeJewelryLine ? 'active' : ''}`}
>
  {line.name}
</button>
```

- [ ] **Step 3: Copy-voucher button**

```jsx
<div
  className="action btn btn-primary copy-btn"
  onClick={() => navigator.clipboard?.writeText(voucher.voucher_code)}
>
  <span className="copy-content" data-copied-text="Đã chép">Sao chép mã</span>
</div>
```

- [ ] **Step 4: Visual verification**

Open `http://localhost:3000/` and compare against the Laravel template screenshots. Confirm all 9 sections render, carousel auto-advances, Swipers scroll, tabs switch, voucher copy works, video loads.

- [ ] **Step 5: Commit**

```bash
git add src/app/(storefront)/page.jsx
git commit -m "feat(storefront): port home landing page"
```

---

## Phase 4 — Auth Pages

### Task 10: Port login (`auth/login.blade.php`)

**Files:**
- Create: `src/app/(storefront)/sign-in/page.jsx`
- Read source: `H:/WorkSpace/PNJ-App/resources/views/frontend/auth/login.blade.php`

- [ ] **Step 1: Translate JSX** — 77 lines, mostly static form. Replace `{{ route('client.login.process') }}` with `#` and attach a no-op `onSubmit={(e) => { e.preventDefault(); }}`.

Shortcut comment above the form: `// shortcut: UI-only, no credential validation, upgrade when auth API exists.`

- [ ] **Step 2: Include `login-register.css`**

Add `import 'public/frontend/css/login-register.css';` at the top of the file.

- [ ] **Step 3: Commit**

```bash
git add src/app/(storefront)/sign-in/page.jsx
git commit -m "feat(storefront): port login page"
```

---

### Task 11: Port register (`auth/register.blade.php`)

**Files:**
- Create: `src/app/(storefront)/sign-up/page.jsx`

- [ ] **Step 1: Translate JSX** — 82 lines. Same pattern as login: no-op submit, shortcut comment, import CSS.
- [ ] **Step 2: Commit** — `git commit -m "feat(storefront): port register page"`

---

### Task 12: Port set-password (`auth/set-password.blade.php`)

**Files:**
- Create: `src/app/(storefront)/set-password/page.jsx`

- [ ] **Step 1: Translate JSX** — 42 lines. Same pattern.
- [ ] **Step 2: Commit** — `git commit -m "feat(storefront): port set-password page"`

---

## Phase 5 — Product + Category + Search Pages

### Task 13: Port product detail (`detail.blade.php`)

**Files:**
- Create: `src/app/(storefront)/product/[id]/page.jsx`
- Read source: `H:/WorkSpace/PNJ-App/resources/views/frontend/detail.blade.php` (641 lines — biggest page)

- [ ] **Step 1: Pull product by id**

```jsx
'use client';
import { use } from 'react';
import { newProductsMock, featuredProductsMock } from 'src/_mock/storefront';

const allProducts = [...newProductsMock, ...featuredProductsMock];

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const product = allProducts.find((p) => String(p.id) === id) ?? allProducts[0];
  // ...
}
```

- [ ] **Step 2: Translate every section of the Blade** — image gallery, price block, size picker, quantity, add-to-cart, specs, reviews tab, related products Swiper. Preserve all classes. Any `onclick` → `onClick`; wrap non-trivial state (quantity, selected size) in `useState`.

- [ ] **Step 3: Include `detail.css`**

```jsx
import 'public/frontend/css/detail.css';
```

- [ ] **Step 4: Commit** — `git commit -m "feat(storefront): port product detail page"`

---

### Task 14: Port category listing (`detail-category.blade.php`)

**Files:**
- Create: `src/app/(storefront)/category/[type]/[id]/page.jsx`

- [ ] **Step 1: Resolve `type` + `id` from `params`**

The Blade accepts `type` in `{product-type, jewelry-line, collection, brand}` and `id` keyed off the respective mock. Pick the matching mock list for the page title and filter `newProductsMock` deterministically by `id`. Shortcut: `// shortcut: filter is deterministic (id → slice), upgrade when category->product join exists.`

- [ ] **Step 2: Translate 475 lines** — sidebar filters, breadcrumbs, grid of product cards, pagination buttons.
- [ ] **Step 3: Include `detail-category.css`**
- [ ] **Step 4: Commit** — `git commit -m "feat(storefront): port category listing page"`

---

### Task 15: Port search results (`detail-search.blade.php`)

**Files:**
- Create: `src/app/(storefront)/search/page.jsx`

- [ ] **Step 1: Read `?input-search=...` with `useSearchParams`** — filter `newProductsMock` client-side by `product_name.toLowerCase().includes(query.toLowerCase())`. Shortcut: `// shortcut: in-memory substring filter, upgrade when search API exists.`
- [ ] **Step 2: Translate 268 lines** — search bar echo, result grid, empty state.
- [ ] **Step 3: Include `detail-search.css`**
- [ ] **Step 4: Commit** — `git commit -m "feat(storefront): port search results page"`

---

## Phase 6 — Account + Orders + Vouchers

### Task 16: Port user profile (`detail-user.blade.php`)

**Files:**
- Create: `src/app/(storefront)/account/[id]/page.jsx`

- [ ] **Step 1:** Render `currentCustomerMock` fields; forms submit no-op.
- [ ] **Step 2:** Include `detail-user.css`.
- [ ] **Step 3: Commit** — `git commit -m "feat(storefront): port user profile page"`

---

### Task 17: Port voucher page (`detail-voucher.blade.php`)

**Files:**
- Create: `src/app/(storefront)/voucher/page.jsx`

- [ ] **Step 1:** Loop `vouchersMock` into voucher cards; copy-code works like on home.
- [ ] **Step 2:** Include `detail-voucher.css`.
- [ ] **Step 3: Commit** — `git commit -m "feat(storefront): port voucher page"`

---

### Task 18: Port order detail (`detail-order.blade.php`)

**Files:**
- Create: `src/app/(storefront)/order/[id]/page.jsx`

- [ ] **Step 1:** Find order in `ordersMock` by `params.id`.
- [ ] **Step 2:** Translate 423 lines — order header, item list, address, payment summary.
- [ ] **Step 3:** Include `detail-order.css`.
- [ ] **Step 4: Commit** — `git commit -m "feat(storefront): port order detail page"`

---

### Task 19: Port order info / tracking (`detail-info-order.blade.php`)

**Files:**
- Create: `src/app/(storefront)/order-info/[id]/page.jsx`

- [ ] **Step 1:** Find order by id, render status timeline + delivery info.
- [ ] **Step 2:** Include `detail-info-order.css`.
- [ ] **Step 3: Commit** — `git commit -m "feat(storefront): port order info page"`

---

## Phase 7 — Cart + Checkout

### Task 20: Port cart (`cart.blade.php`)

**Files:**
- Create: `src/app/(storefront)/cart/page.jsx`

- [ ] **Step 1:** Seed cart from `newProductsMock.slice(0, 2)` with quantity state. Shortcut: `// shortcut: local-state cart, upgrade when cart API / persistence exists.`
- [ ] **Step 2:** Translate 170 lines — item rows, qty +/-, total summary, "Thanh toán" button → `/checkout`.
- [ ] **Step 3:** Include `cart.css`.
- [ ] **Step 4: Commit** — `git commit -m "feat(storefront): port cart page"`

---

### Task 21: Port checkout (`order.blade.php`)

**Files:**
- Create: `src/app/(storefront)/checkout/page.jsx`

- [ ] **Step 1:** Translate 366 lines — address form, shipping method, payment method, order summary.
- [ ] **Step 2:** Submit button redirects to `/order-success` via `router.push` (no real request).
- [ ] **Step 3:** Include `order.css`.
- [ ] **Step 4: Commit** — `git commit -m "feat(storefront): port checkout page"`

---

### Task 22: Port order success (`order-success.blade.php`)

**Files:**
- Create: `src/app/(storefront)/order-success/page.jsx`

- [ ] **Step 1:** Translate 86 lines of static success page.
- [ ] **Step 2:** Include `order-success.css`.
- [ ] **Step 3: Commit** — `git commit -m "feat(storefront): port order success page"`

---

## Phase 8 — Final verification

### Task 23: End-to-end visual QA

- [ ] **Step 1: Run dev server**

```bash
npm run dev
```

- [ ] **Step 2: Walk every route in the browser**

Open each in a tab and compare against the Laravel template running locally (or against the Blade HTML you ported from):

```
/
/product/1
/category/product-type/1
/category/jewelry-line/2
/category/collection/3
/category/brand/4
/search?input-search=vàng
/account/42
/voucher
/order/101
/order-info/101
/cart
/checkout
/order-success
/sign-in
/sign-up
/set-password
```

Expected for each: identical layout, colors, typography, spacing, iconography, carousel/Swiper behavior, and image placement to the Blade template. Record any delta in a scratch note and fix inline.

- [ ] **Step 3: Confirm `/admin/**` is untouched**

Open `/admin` — expect the existing admin UI with no visual regression and no Bootstrap bleed-through (Bootstrap CSS is only imported inside `(storefront)/layout.jsx`, so admin should be unaffected).

- [ ] **Step 4: Confirm the two-tab product section**

On `/`, click "Sản phẩm bán chạy" and confirm the second Swiper hydrates (Bootstrap tab + Swiper interaction is the most fragile piece).

- [ ] **Step 5: Final commit**

```bash
git commit --allow-empty -m "chore(storefront): landing template port complete"
```

---

## Self-Review Checklist

Before you start executing:

1. **Spec coverage:** Every Blade file listed in the source file map has a dedicated task (9, 10–12, 13, 14, 15, 16–19, 20–22). ✓
2. **Asset coverage:** Task 1 copies CSS, images, JS, videos. ✓
3. **Dependencies:** Bootstrap 5.3.2 + Swiper 11 + SweetAlert2 11 installed in Task 2. ✓
4. **Formatters:** All currency goes through `fCurrency` (MEMORY: utils formatters are mandatory). All dates through `fDate`. ✓
5. **No unwanted abstraction:** We do NOT convert Bootstrap carousels/tabs/dropdowns to MUI; we DO keep raw `data-bs-*` attributes. ✓
6. **Shortcut tags:** Every stubbed behavior (auth, cart persistence, search) has a `// shortcut: ...` comment per ponytail rules. ✓
7. **Admin isolation:** `(storefront)` route group isolates Bootstrap CSS — admin UI is not touched. ✓
8. **No fake tests:** This is pure visual port work; the verification task uses manual QA, not unit tests (writing tests for static markup would be waste per YAGNI). ✓
