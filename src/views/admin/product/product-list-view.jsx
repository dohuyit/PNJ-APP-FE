// src/views/admin/product/product-list-view.jsx

'use client';

import { useMemo, useState } from 'react';

import { Box, Button, Grid, Stack, Tabs, Tab, Typography } from '@mui/material';

import { adminPaths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fmtNumber, fmtVND } from 'src/utils/format';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetProductList } from 'src/actions/admin/product';
import { FilterDrawer } from 'src/views/admin/_shared/filter-drawer';
import { BulkActionBar } from 'src/views/admin/_shared/bulk-action-bar';

import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/components/common/data-table';
import { FilterBar } from 'src/components/common/filter-bar';
import { PageHeader } from 'src/components/common/page-header';
import { ConfirmDialog } from 'src/components/common/confirm-dialog';

import { ProductDetailDrawer } from './product-detail-drawer';
import { makeProductListColumns } from './product-list-columns';
import { mockCategories, mockBrands } from 'src/mock-data';

const categoriesList = mockCategories;
const brandsList = mockBrands;

const productsDetail = {};

const STATUS_TABS = [
  { value: 'all',          label: 'Tất cả' },
  { value: 'active',       label: 'Đang bán' },
  { value: 'draft',        label: 'Nháp' },
  { value: 'out_of_stock', label: 'Hết hàng' },
  { value: 'inactive',     label: 'Tạm ẩn' },
];

const TYPE_OPTS = [
  { value: 'jewelry', label: 'Trang sức',    icon: 'solar:crown-linear' },
  { value: 'watch',   label: 'Đồng hồ',      icon: 'solar:clock-circle-linear' },
  { value: 'diamond', label: 'Kim cương',    icon: 'solar:star-shine-linear' },
  { value: 'gift',    label: 'Quà tặng',     icon: 'solar:gift-linear' },
  { value: 'egift',   label: 'E-gift',       icon: 'solar:letter-linear' },
];

// Toolbar options (bao gồm 'all' đầu tiên) — tách khỏi TYPE_OPTS để drawer vẫn dùng TYPE_OPTS trơn.
const TOOLBAR_TYPE_OPTS = [
  { value: 'all', label: 'Tất cả loại', icon: 'solar:layers-minimalistic-linear' },
  ...TYPE_OPTS,
];

const TOOLBAR_BRAND_OPTS = [
  { value: 'all', label: 'Tất cả thương hiệu', icon: 'solar:tag-linear' },
  ...brandsList.map((b) => ({ value: b.slug, label: b.name, icon: 'solar:crown-linear' })),
];

const TOOLBAR_CAT_OPTS = [
  { value: 'all', label: 'Tất cả danh mục', icon: 'solar:widget-linear' },
  ...categoriesList.map((c) => ({ value: c.slug, label: c.name, icon: 'solar:folder-linear' })),
];

const AUDIENCE_OPTS = [
  { value: 'female', label: 'Nữ',     icon: 'solar:women-linear' },
  { value: 'male',   label: 'Nam',    icon: 'solar:men-linear' },
  { value: 'kids',   label: 'Trẻ em', icon: 'solar:emoji-funny-circle-linear' },
  { value: 'unisex', label: 'Unisex', icon: 'solar:users-group-rounded-linear' },
];

const FLAG_OPTS = [
  { value: 'is_new',           label: 'Mới',          icon: 'solar:star-linear' },
  { value: 'is_best_seller',   label: 'Bán chạy',     icon: 'solar:cup-star-linear' },
  { value: 'fast_delivery_3h', label: 'Giao 3H',      icon: 'solar:delivery-linear' },
  { value: 'installment_0',    label: 'Trả góp 0%',   icon: 'solar:card-linear' },
];

const STOCK_OPTS = [
  { value: 'ok',     label: 'Đủ hàng (>5)',         icon: 'solar:check-circle-linear' },
  { value: 'low',    label: 'Sắp hết (1–5)',         icon: 'solar:danger-triangle-linear' },
  { value: 'empty',  label: 'Hết hàng (0)',          icon: 'solar:close-circle-linear' },
];

const KARAT_OPTS = [
  { value: '24k', label: '24K', icon: 'solar:cup-star-linear' },
  { value: '18k', label: '18K', icon: 'solar:star-ring-linear' },
  { value: '14k', label: '14K', icon: 'solar:star-ring-linear' },
  { value: '10k', label: '10K', icon: 'solar:star-ring-linear' },
];

const MATERIAL_OPTS = [
  { value: 'gold',     label: 'Vàng',     icon: 'solar:crown-linear' },
  { value: 'silver',   label: 'Bạc',      icon: 'solar:ring-linear' },
  { value: 'platinum', label: 'Bạch kim', icon: 'solar:crown-star-linear' },
  { value: 'diamond',  label: 'Kim cương', icon: 'solar:star-shine-linear' },
  { value: 'gemstone', label: 'Đá quý',    icon: 'solar:gallery-linear' },
  { value: 'pearl',    label: 'Ngọc trai', icon: 'solar:planet-linear' },
];

const VISIBILITY_OPTS = [
  { value: 'website', label: 'Website',     icon: 'solar:global-linear' },
  { value: 'app',     label: 'Ứng dụng',    icon: 'solar:smartphone-linear' },
  { value: 'store',   label: 'Cửa hàng',    icon: 'solar:shop-linear' },
  { value: 'hotline', label: 'Tổng đài',    icon: 'solar:phone-linear' },
];

const FILTER_SECTIONS = [
  { key: 'type',         label: 'Loại sản phẩm',             icon: 'solar:tag-linear',                    type: 'chip-multi',   options: TYPE_OPTS },
  { key: 'audience',     label: 'Đối tượng khách hàng',       icon: 'solar:users-group-rounded-linear',    type: 'chip-multi',   options: AUDIENCE_OPTS },
  { key: 'material',     label: 'Chất liệu',                 icon: 'solar:gallery-linear',                type: 'chip-multi',   options: MATERIAL_OPTS },
  { key: 'karat',        label: 'Tuổi vàng',                  icon: 'solar:crown-linear',                  type: 'chip-multi',   options: KARAT_OPTS },
  { key: 'flags',        label: 'Nhãn hiển thị',             icon: 'solar:flag-linear',                   type: 'chip-multi',   options: FLAG_OPTS },
  { key: 'stock',        label: 'Tình trạng tồn kho',        icon: 'solar:box-linear',                    type: 'select',       options: STOCK_OPTS },
  { key: 'price',        label: 'Khoảng giá (₫)',             icon: 'solar:dollar-linear',                 type: 'range-money' },
  { key: 'sold_count',   label: 'Số lượng đã bán',            icon: 'solar:bag-smile-linear',              type: 'range-number', helperText: 'Vd: 50 → 500' },
  { key: 'rating_min',   label: 'Rating trung bình',          icon: 'solar:star-linear',                   type: 'range-number', helperText: '1–5 sao' },
  { key: 'visibility',   label: 'Hiển thị trên kênh',        icon: 'solar:eye-linear',                    type: 'chip-multi',   options: VISIBILITY_OPTS },
  { key: 'updated_range', label: 'Khoảng thời gian cập nhật', icon: 'solar:calendar-linear',               type: 'date-range' },
  { key: 'has_variants', label: 'Chỉ SP có biến thể',        icon: 'solar:layers-linear',                 type: 'switch',       helperText: 'Hiển thị SP có nhiều size/màu' },
  { key: 'has_media_3d', label: 'Chỉ SP có ảnh 3D/video',    icon: 'solar:videocamera-linear',            type: 'switch',       helperText: 'Dùng cho SP cao cấp' },
];

const EMPTY_FILTERS = {
  type: [], audience: [], material: [], karat: [], flags: [], visibility: [],
  stock: '',
  price: { min: '', max: '' }, sold_count: { min: '', max: '' }, rating_min: { min: '', max: '' },
  updated_range: { from: '', to: '' },
  has_variants: false, has_media_3d: false,
};

export function ProductListView({ embedded = false } = {}) {
  const { searchResults: productsList, searchLoading: productsLoading } = useGetProductList();
  const [tab,    setTab]        = useState('all');
  const [search, setSearch]     = useState('');
  const [brand,  setBrand]      = useState('all');
  const [cat,    setCat]        = useState('all');
  const [typeSel, setTypeSel]   = useState('all');
  const [filters, setFilters]   = useState(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 20 });

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return productsList.filter((r) => {
      if (tab !== 'all' && r.status !== tab) return false;
      if (q && !r.name.toLowerCase().includes(q) && !r.display_code.toLowerCase().includes(q)) return false;
      if (typeSel !== 'all' && r.type !== typeSel) return false;
      if (brand !== 'all'   && r.brand?.slug !== brand) return false;
      if (cat !== 'all'     && r.category?.slug !== cat)  return false;

      if (filters.type?.length && !filters.type.includes(r.type))       return false;
      if (filters.audience?.length && !filters.audience.some((a) => r.audiences?.includes(a))) return false;
      if (filters.flags?.length && !filters.flags.every((f) => r.flags?.[f])) return false;

      const stockTotal = (r.variants ?? []).reduce((s, v) => s + (v.total_stock ?? 0), 0);
      if (filters.stock === 'ok'    && stockTotal <= 5) return false;
      if (filters.stock === 'low'   && (stockTotal === 0 || stockTotal >= 5)) return false;
      if (filters.stock === 'empty' && stockTotal > 0) return false;

      const pMin = Number(filters.price?.min); const pMax = Number(filters.price?.max);
      if (pMin && r.price_min < pMin) return false;
      if (pMax && r.price_max > pMax) return false;

      const rMin = Number(filters.rating_min?.min); const rMax = Number(filters.rating_min?.max);
      if (rMin && (r.rating?.avg ?? 0) < rMin) return false;
      if (rMax && (r.rating?.avg ?? 0) > rMax) return false;

      if (filters.has_variants && (r.variants?.length ?? 0) === 0) return false;

      return true;
    });
  }, [productsList, tab, search, brand, cat, typeSel, filters]);

  const columns = useMemo(
    () => makeProductListColumns({
      onDelete: (p) => setToDelete(p),
      onDuplicate: (p) => alert('Nhân bản ' + p.name),
      onView: (p) => setViewing({ ...productsDetail, ...p }),
    }),
    []
  );

  const kpi = useMemo(() => {
    const totalStock = productsList.reduce((s, p) => s + (p.variants ?? []).reduce((a, v) => a + (v.total_stock ?? 0), 0), 0);
    const active = productsList.filter((p) => p.status === 'active');
    const draft  = productsList.filter((p) => p.status === 'draft');
    const oos    = productsList.filter((p) => p.status === 'out_of_stock' || (p.variants ?? []).reduce((a, v) => a + (v.total_stock ?? 0), 0) === 0);
    const lowStock = productsList.filter((p) => {
      const s = (p.variants ?? []).reduce((a, v) => a + (v.total_stock ?? 0), 0);
      return s > 0 && s <= 5;
    });
    const bestsellers = productsList.filter((p) => p.flags?.is_best_seller);
    const newItems    = productsList.filter((p) => p.flags?.is_new);
    const gmv = productsList.reduce((s, p) => {
      const avgPrice = ((p.price_min ?? 0) + (p.price_max ?? p.price_min ?? 0)) / 2;
      return s + avgPrice * (p.stats?.sold_count ?? 0);
    }, 0);
    const totalSold = productsList.reduce((s, p) => s + (p.stats?.sold_count ?? 0), 0);
    const ratedProducts = productsList.filter((p) => (p.rating?.count ?? 0) > 0);
    const avgRating = ratedProducts.length > 0
      ? ratedProducts.reduce((s, p) => s + (p.rating?.avg ?? 0), 0) / ratedProducts.length
      : 0;
    const totalReviews = productsList.reduce((s, p) => s + (p.rating?.count ?? 0), 0);
    const topBestseller = [...productsList]
      .sort((a, b) => (b.stats?.sold_count ?? 0) - (a.stats?.sold_count ?? 0))[0];
    return {
      total: productsList.length,
      active: active.length,
      draft: draft.length,
      oos: oos.length,
      lowStock: lowStock.length,
      bestsellers: bestsellers.length,
      newItems: newItems.length,
      topBestseller,
      avgRating,
      totalReviews,
      gmv,
      totalSold,
      totalStock,
    };
  }, [productsList]);

  // Đếm active filter chip ở toolbar
  const chipFilterCount =
    (typeSel !== 'all' ? 1 : 0) + (brand !== 'all' ? 1 : 0) + (cat !== 'all' ? 1 : 0);
  const drawerFilterCount = Object.entries(filters).reduce((n, [k, v]) => {
    if (Array.isArray(v) && v.length === 0) return n;
    if (typeof v === 'string' && v === '')  return n;
    if (typeof v === 'object' && !Array.isArray(v) && Object.values(v).every((x) => x === '' || x == null)) return n;
    if (v === false || v == null) return n;
    return n + 1;
  }, 0);

  const resetAllFilters = () => {
    setTypeSel('all'); setBrand('all'); setCat('all'); setFilters(EMPTY_FILTERS); setSearch('');
  };

  const bulkActions = [
    { label: 'Kích hoạt',    icon: 'solar:check-circle-linear',  color: 'success', onClick: () => alert(`Kích hoạt ${selected.length}`) },
    { label: 'Tạm ẩn',       icon: 'solar:eye-closed-linear',    color: 'warning', onClick: () => alert(`Ẩn ${selected.length}`) },
    { label: 'Nhân bản',     icon: 'solar:copy-linear',          onClick: () => alert(`Clone ${selected.length}`) },
    { divider: true },
    { label: 'In tem SKU',   icon: 'solar:printer-linear',       onClick: () => alert(`In tem ${selected.length}`) },
    { label: 'Xuất Excel',   icon: 'solar:download-linear',      onClick: () => alert(`Xuất ${selected.length}`) },
    { divider: true },
    { label: 'Xoá',          icon: 'solar:trash-bin-trash-linear', color: 'error', onClick: () => alert(`Xoá ${selected.length}`) },
  ];

  const body = (
    <Box sx={{
      bgcolor: 'background.paper',
      borderBottom: 1, borderColor: 'divider',
      overflow: 'hidden',
    }}>
      {/* KPI row · full-width, border từng card */}
      <Box>
        <Grid container spacing={0}>
          {[
            {
              key: 'gmv',
              label: 'GMV catalog',
              value: fmtVND(kpi.gmv),
              valueSize: 20,
              icon: 'solar:dollar-linear',
              color: '#059669',
              sub: `${fmtNumber(kpi.totalSold)} SP đã bán · từ ${fmtNumber(kpi.active)} SP đang bán`,
              trend: { value: 12.4, dir: 'up' }, trendLabel: 'so tháng trước',
              filterTab: null,
            },
            {
              key: 'bestsellers',
              label: 'Bán chạy',
              value: fmtNumber(kpi.bestsellers),
              icon: 'solar:cup-star-linear',
              color: '#D97706',
              sub: kpi.topBestseller
                ? `#1 ${kpi.topBestseller.name.length > 34 ? kpi.topBestseller.name.slice(0, 34) + '…' : kpi.topBestseller.name}`
                : 'Chưa có bestseller',
              trend: { value: 3.8, dir: 'up' }, trendLabel: 'tuần này',
              filterTab: null,
            },
            {
              key: 'rating',
              label: 'Rating trung bình',
              value: `${kpi.avgRating.toFixed(1)} ★`,
              icon: 'solar:star-linear',
              color: '#2563EB',
              sub: `${fmtNumber(kpi.totalReviews)} đánh giá · ${fmtNumber(kpi.newItems)} SP mới trong tháng`,
              trend: { value: 0.3, dir: 'up' }, trendLabel: 'vs quý trước',
              filterTab: null,
            },
            {
              key: 'alerts',
              label: 'Cần xử lý',
              value: fmtNumber(kpi.oos + kpi.lowStock + kpi.draft),
              icon: 'solar:danger-triangle-linear',
              color: '#DC2626',
              sub: `${kpi.oos} hết · ${kpi.lowStock} sắp hết · ${kpi.draft} nháp`,
              trend: { value: 2.1, dir: 'down' }, trendLabel: 'tuần này',
              filterTab: 'out_of_stock',
            },
          ].map((s, i) => {
            const active = s.filterTab && tab === s.filterTab;
            const clickable = !!s.filterTab;
            return (
              <Grid key={s.key} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box
                  onClick={clickable ? () => setTab(s.filterTab) : undefined}
                  sx={{
                    position: 'relative',
                    bgcolor: active ? 'action.selected' : 'transparent',
                    borderRightWidth: {
                      xs: 0,
                      sm: i % 2 === 1 ? 0 : 1,
                      md: (i + 1) % 4 === 0 ? 0 : 1,
                    },
                    borderRightStyle: 'solid',
                    borderRightColor: 'grey.200',
                    borderBottomWidth: 1,
                    borderBottomStyle: 'solid',
                    borderBottomColor: 'grey.100',
                    px: 2, py: 1.5,
                    cursor: clickable ? 'pointer' : 'default',
                    transition: 'background-color .15s ease',
                    '&:hover': clickable ? { bgcolor: 'action.hover' } : {},
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Top row: label + icon */}
                  <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1} sx={{ mb: 1 }}>
                    <Typography sx={{
                      fontSize: 10.5, color: 'text.disabled', fontWeight: 600,
                      letterSpacing: 0.5, textTransform: 'uppercase',
                    }}>
                      {s.label}
                    </Typography>
                    <Box sx={{
                      width: 32, height: 32, borderRadius: 0.75,
                      bgcolor: s.color + '14', color: s.color,
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                    }}>
                      <Iconify icon={s.icon} width={16} />
                    </Box>
                  </Stack>

                  {/* Value lớn */}
                  <Typography sx={{
                    fontSize: s.valueSize ?? 26, fontWeight: 700, color: 'text.primary',
                    lineHeight: 1.1, fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {s.value}
                  </Typography>

                  {/* Trend badge + label */}
                  <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1 }} flexWrap="wrap" rowGap={0.5}>
                    {s.trend && (
                      <Stack
                        direction="row" alignItems="center" spacing={0.25}
                        sx={{ color: s.trend.dir === 'up' ? 'success.main' : 'error.main' }}
                      >
                        <Iconify
                          icon={s.trend.dir === 'up' ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'}
                          width={12}
                        />
                        <Typography sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1, color: 'inherit' }}>
                          {s.trend.value}%
                        </Typography>
                      </Stack>
                    )}
                    <Typography sx={{ fontSize: 11, color: 'text.disabled', lineHeight: 1.3 }}>
                      {s.trendLabel}
                    </Typography>
                  </Stack>

                  {/* Sub detail breakdown */}
                  <Typography sx={{
                    fontSize: 11, color: 'text.secondary', mt: 0.75, lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {s.sub}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Tabs status · flat underline, nhẹ hơn */}
      <Box sx={{ px: { xs: 2, md: 2.5 }, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable" scrollButtons="auto"
          TabIndicatorProps={{ sx: { height: 2, bgcolor: 'text.primary' } }}
          sx={{
            minHeight: 36,
            '& .MuiTabs-flexContainer': { gap: 0 },
            '& .MuiTab-root': {
              minHeight: 36, minWidth: 'auto', fontWeight: 500, fontSize: 12.5,
              textTransform: 'none', px: 1.25, mr: 0.5,
              color: 'text.secondary',
              '&.Mui-selected': { color: 'text.primary', fontWeight: 600 },
            },
          }}
        >
          {STATUS_TABS.map((t) => {
            const count = t.value === 'all'
              ? productsList.length
              : productsList.filter((x) => x.status === t.value).length;
            return (
              <Tab
                key={t.value} value={t.value}
                label={
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <span>{t.label}</span>
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        minWidth: 20, height: 18, px: 0.75, borderRadius: 1,
                        fontSize: 10.5, fontWeight: 600,
                        bgcolor: tab === t.value ? 'grey.200' : 'grey.100',
                        color: tab === t.value ? 'text.primary' : 'text.disabled',
                      }}
                    >
                      {count}
                    </Box>
                  </Stack>
                }
              />
            );
          })}
        </Tabs>
      </Box>

      <DataTable
        rows={rows}
        columns={columns}
        loading={productsLoading}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        checkboxSelection
        selectedKeys={selected}
        onSelectionChange={setSelected}
        bulkBar={<BulkActionBar count={selected.length} total={rows.length} actions={bulkActions} onClear={() => setSelected([])} />}
        sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}
        toolbar={
          <FilterBar
            searchValue={search}
            onSearch={setSearch}
            placeholder="Tìm theo tên / mã sản phẩm…"
            filters={[
              { value: typeSel, onChange: setTypeSel, options: TOOLBAR_TYPE_OPTS,  minWidth: 160 },
              { value: brand,   onChange: setBrand,   options: TOOLBAR_BRAND_OPTS, minWidth: 180 },
              { value: cat,     onChange: setCat,     options: TOOLBAR_CAT_OPTS,   minWidth: 180 },
            ]}
            advancedCount={drawerFilterCount}
            onOpenAdvanced={() => setFilterOpen(true)}
            advancedChips={FILTER_SECTIONS.flatMap((sec) => {
              const v = filters[sec.key];
              if (Array.isArray(v) && v.length) {
                // chip-multi: mỗi value 1 chip
                return v.map((val) => ({
                  label: `${sec.label}: ${sec.options?.find((o) => o.value === val)?.label ?? val}`,
                  onClear: () => setFilters({ ...filters, [sec.key]: v.filter((x) => x !== val) }),
                }));
              }
              if (typeof v === 'string' && v && v !== '') {
                // select
                return [{
                  label: `${sec.label}: ${sec.options?.find((o) => o.value === v)?.label ?? v}`,
                  onClear: () => setFilters({ ...filters, [sec.key]: '' }),
                }];
              }
              if (v && typeof v === 'object' && !Array.isArray(v)) {
                const hasRange = Object.values(v).some((x) => x !== '' && x != null);
                if (!hasRange) return [];
                const parts = Object.entries(v).filter(([, x]) => x !== '' && x != null).map(([, x]) => x).join(' → ');
                return [{
                  label: `${sec.label}: ${parts}`,
                  onClear: () => setFilters({ ...filters, [sec.key]: Object.fromEntries(Object.keys(v).map((k) => [k, ''])) }),
                }];
              }
              if (v === true) {
                return [{ label: sec.label, onClear: () => setFilters({ ...filters, [sec.key]: false }) }];
              }
              return [];
            })}
            onReset={(chipFilterCount > 0 || drawerFilterCount > 0 || search) ? resetAllFilters : undefined}
          />
        }
      />

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        sections={FILTER_SECTIONS}
        value={filters}
        onApply={setFilters}
        title="Lọc sản phẩm chi tiết"
      />

      <ProductDetailDrawer
        open={!!viewing}
        product={viewing}
        onClose={() => setViewing(null)}
        onEdit={(p) => window.location.href = adminPaths.product.edit(p.id)}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Xoá sản phẩm?"
        message={`Thao tác này sẽ xoá sản phẩm "${toDelete?.name}". Có thể khôi phục trong 30 ngày.`}
        confirmLabel="Xoá" danger
        onCancel={() => setToDelete(null)}
        onConfirm={() => setToDelete(null)}
      />
    </Box>
  );

  if (embedded) return body;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title="Sản phẩm"
        subtitle={`${productsList.length} sản phẩm · catalog, biến thể, giá, nhãn`}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Catalog' },
          { label: 'Sản phẩm' },
        ]}
        actions={<ProductListActions />}
      />
      {body}
    </DashboardContent>
  );
}

// Actions dùng cho cả standalone + catalog-hub — import để gắn vào PageHeader khi tab=products.
export function ProductListActions() {
  return (
    <Stack direction="row" spacing={1}>
      <Button
        variant="outlined" size="small"
        startIcon={<Iconify icon="solar:upload-linear" width={13} />}
        sx={{ boxShadow: 'none', borderColor: 'divider' }}
      >
        Nhập Excel
      </Button>
      <Button
        variant="outlined" size="small"
        startIcon={<Iconify icon="solar:download-linear" width={13} />}
        sx={{ boxShadow: 'none', borderColor: 'divider' }}
      >
        Xuất Excel
      </Button>
      <Button
        component={RouterLink} href={adminPaths.product.new}
        variant="contained" size="small"
        startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
        sx={{
          boxShadow: 'none',
          bgcolor: '#1E293B', color: 'common.white',
          '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
        }}
      >
        Tạo sản phẩm
      </Button>
    </Stack>
  );
}
