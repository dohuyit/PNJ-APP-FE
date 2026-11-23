# PNJ Frontend

Frontend cho hệ thống PNJ, xây dựng trên **Next.js 14 (Pages + App Router)** và **MUI v7**, dùng chung bộ Minimal UI Kit đã tuỳ biến cho dự án.

## Tổng quan

- **Framework:** Next.js 14 + React 18
- **UI:** MUI v7 (`@mui/material`, `@mui/x-*`), Emotion, bộ component nội bộ trong `src/components`
- **State / Data:** SWR, Redux Toolkit, React Hook Form + Zod
- **Auth:** Auth0 + custom auth module trong `src/auth`
- **Khác:** i18next (đa ngôn ngữ), TipTap / CKEditor, Mapbox, ApexCharts / Highcharts, Framer Motion, GSAP
- **Node package manager:** Yarn 1.22 (xem `packageManager` trong `package.json`)

Cấu trúc `src/` chính:

```
src/
  app/          # Next.js App Router entry
  auth/         # Auth context, guards, utils (dùng getErrorMessage, ...)
  components/   # Component dùng chung (gồm <Upload> chuẩn cho admin)
  layouts/      # Layout dashboard / auth / main
  routes/       # paths + hook điều hướng
  sections/     # Khối UI theo trang / module
  views/        # Trang ghép từ sections
  theme/        # Theme MUI (KHÔNG override core — xem CLAUDE/MEMORY)
  utils/        # format-number, format-time, ... (bắt buộc dùng khi format)
  locales/      # i18n resources
  actions/      # API callers (axios + SWR)
  contexts/     # React contexts
```

## Yêu cầu

- Node.js ≥ 18
- Yarn 1.x (`npm i -g yarn`)
- Backend API chạy sẵn (mặc định `http://localhost:2005`)

## Cấu hình môi trường

Tạo file `.env` ở thư mục gốc (tham khảo file `.env` hiện tại):

```env
LANDING_INTERNAL_API_URL=http://pnj-be-nginx
NEXT_PUBLIC_AUTH_API_URL=http://localhost:2005
NEXT_PUBLIC_PNJ_API_URL=http://localhost:2005/api
```

- `NEXT_PUBLIC_*` được expose ra client — chỉ chứa URL/khoá public.
- `LANDING_INTERNAL_API_URL` chỉ dùng phía server (SSR / route handler).

## Chạy dự án

```bash
yarn install
yarn dev          # http://localhost:5002
```

Lệnh thường dùng:

| Script             | Mô tả                                             |
| ------------------ | ------------------------------------------------- |
| `yarn dev`         | Chạy dev server ở cổng **5002**                   |
| `yarn build`       | Build production                                  |
| `yarn start`       | Chạy bản đã build ở cổng **5002**                 |
| `yarn lint`        | Kiểm tra ESLint                                   |
| `yarn lint:fix`    | Fix ESLint tự động                                |
| `yarn fm:check`    | Kiểm tra format bằng Prettier                     |
| `yarn fm:fix`      | Format bằng Prettier                              |
| `yarn fix:all`     | Chạy `lint:fix` + `fm:fix`                        |
| `yarn re:dev`      | Clean `node_modules` + `.next` rồi install & dev  |
| `yarn re:build`    | Clean + install + build                           |

## Chạy bằng Docker

Dùng file compose trong `docker/`:

```bash
docker compose -f docker/docker-compose.local.yml up --build
```

Chi tiết xem `docker/readme.md`.

## Quy ước khi code

- **Format số / ngày:** luôn import từ `src/utils/format-number` và `src/utils/format-time`. Không gọi trực tiếp `toLocaleString`, `Intl`, hay `dayjs` rải rác.
- **Theme MUI:** không override `palette` / `typography` / `components` / `shape` trong theme core, cũng không lồng `ThemeProvider` cho storefront. Style trực tiếp qua `sx` trên từng MUI element.
- **Upload file (admin):** dùng `<Upload>` từ `src/components/upload` (hoặc wrapper `UploadField`). Không thêm `MediaPicker` mới.
- Trước khi commit: `yarn fix:all`.

## Tài liệu bổ sung

- `docs/` — ghi chú kỹ thuật nội bộ
- `docker/readme.md` — hướng dẫn container local
