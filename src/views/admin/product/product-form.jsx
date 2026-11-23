// src/views/admin/product/product-form.jsx - 4-step wizard (redesign of 8-tab version)

'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { m, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import AddRounded from '@mui/icons-material/AddRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import SellOutlined from '@mui/icons-material/SellOutlined';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import CheckRounded from '@mui/icons-material/CheckRounded';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import PaidOutlined from '@mui/icons-material/PaidOutlined';
import CloseRounded from '@mui/icons-material/CloseRounded';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ScaleOutlined from '@mui/icons-material/ScaleOutlined';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import QrCode2Outlined from '@mui/icons-material/QrCode2Outlined';
import DiamondOutlined from '@mui/icons-material/DiamondOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import EditNoteOutlined from '@mui/icons-material/EditNoteOutlined';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import InventoryOutlined from '@mui/icons-material/InventoryOutlined';
import CalculateOutlined from '@mui/icons-material/CalculateOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import NavigateNextRounded from '@mui/icons-material/NavigateNextRounded';
import PhotoLibraryOutlined from '@mui/icons-material/PhotoLibraryOutlined';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import NavigateBeforeRounded from '@mui/icons-material/NavigateBeforeRounded';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded';
import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import {
  Accordion, AccordionDetails, AccordionSummary,
  Alert, Autocomplete, Box, Button, Chip, CircularProgress, Divider, Grid, IconButton, InputAdornment,
  MenuItem, Snackbar, Stack, Switch, TextField, Tooltip, Typography,
} from '@mui/material';

import { adminPaths } from 'src/routes/paths';

import { fCurrency } from 'src/utils/format-number';

import { landingTokens } from 'src/theme/landing';
import { useGetFaqList } from 'src/actions/admin/faq';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetBrandList } from 'src/actions/admin/brand';
import { useGetCategoryList } from 'src/actions/admin/category';
import { useGetSizeGuideList } from 'src/actions/admin/size-guide';
import { UploadField } from 'src/views/admin/_shared/upload-field';
import { useGetCollectionList } from 'src/actions/admin/collection';
import { useGetProductLineList } from 'src/actions/admin/product-line';
import { UploadGallery } from 'src/views/admin/_shared/upload-gallery';
import { PRODUCT_STATUS_COLOR, PRODUCT_STATUS_LABEL } from 'src/theme/pnj/status-colors';
import { useGetAttributeSetList, actionGetAttributeSetDetail } from 'src/actions/admin/attribute';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';
import { SeoPanel } from 'src/components/common/seo-panel';
import { SlugInput } from 'src/components/common/slug-input';
import { PageHeader } from 'src/components/common/page-header';
import { MoneyInput } from 'src/components/common/money-input';
import { StatusBadge } from 'src/components/common/status-badge';
import { DecimalInput } from 'src/components/common/decimal-input';
import { VariantMatrix } from 'src/components/common/variant-matrix';
import { AuditTimeline } from 'src/components/common/audit-timeline';
import { ConfirmDialog } from 'src/components/common/confirm-dialog';
import { AttributeFields } from 'src/components/common/attribute-fields';

import Wireframe from 'src/sections/landing/components/Wireframe';

// ----------------------------------------------------------------------
// Config

const STEPS = [
  {
    id: 'basic',
    label: 'Cơ bản',
    description: 'Tên, mã, phân loại, kênh bán',
    icon: InfoOutlined,
    required: ['name', 'display_code', 'type', 'status', 'category_id'],
  },
  {
    id: 'pricing',
    label: 'Giá & Biến thể',
    description: 'Giá bán, sale, biến thể sinh từ attribute',
    icon: SellOutlined,
    required: ['pricing_mode', 'sale_price'],
  },
  {
    id: 'content',
    label: 'Media & Thông số',
    description: 'Ảnh chính/phụ, mô tả, thông số kỹ thuật',
    icon: PhotoLibraryOutlined,
    required: ['primary_image_id', 'short_description'],
  },
  {
    id: 'display',
    label: 'Hiển thị & SEO',
    description: 'Nhãn, SEO, hậu mãi, personalization',
    icon: FlagOutlined,
    required: [],
  },
];

const REQUIRED_LABELS = {
  name: 'Tên sản phẩm',
  display_code: 'Mã hiển thị',
  type: 'Loại sản phẩm',
  status: 'Trạng thái bán',
  category_id: 'Danh mục chính',
  pricing_mode: 'Cách tính giá',
  sale_price: 'Giá bán',
  media_file_ids: 'Ảnh sản phẩm',
  short_description: 'Mô tả ngắn',
};

const PRICING_MODES = [
  { value: 'fixed', label: 'Giá cố định', icon: 'solar:tag-price-linear', help: 'Nhập giá tay cho từng size trong bảng biến thể.' },
  { value: 'by_gold_rate', label: 'Theo giá vàng', icon: 'solar:calculator-minimalistic-linear', help: 'Giá = Trọng lượng × Giá vàng + Tiền công + Tiền đá + % lãi.' },
];

const PRODUCT_TYPES = [
  { value: 'jewelry', label: 'Trang sức', icon: 'solar:crown-linear' },
  { value: 'watch', label: 'Đồng hồ', icon: 'solar:clock-circle-linear' },
  { value: 'diamond', label: 'Kim cương viên', icon: 'solar:star-shine-linear' },
  { value: 'gift', label: 'Quà tặng', icon: 'solar:gift-linear' },
  { value: 'egift', label: 'E-gift', icon: 'solar:letter-linear' },
];

const AUDIENCES = [
  { value: 'female', label: 'Nữ', icon: 'solar:women-linear' },
  { value: 'male', label: 'Nam', icon: 'solar:men-linear' },
  { value: 'kids', label: 'Trẻ em', icon: 'solar:emoji-funny-circle-linear' },
  { value: 'unisex', label: 'Unisex', icon: 'solar:users-group-rounded-linear' },
];

const AGE_GROUPS = [
  { value: 'infant', label: 'Trẻ sơ sinh (0-3)', icon: 'solar:emoji-funny-circle-linear' },
  { value: 'kid', label: 'Thiếu nhi (4-12)', icon: 'solar:emoji-funny-circle-linear' },
  { value: 'teen', label: 'Vị thành niên (13-17)', icon: 'solar:user-linear' },
  { value: 'adult', label: 'Trưởng thành (18+)', icon: 'solar:user-id-linear' },
  { value: 'senior', label: 'Trung niên (45+)', icon: 'solar:user-rounded-linear' },
];

const VISIBILITY_CHANNELS = [
  { value: 'website', label: 'Website', icon: 'solar:global-linear' },
  { value: 'app', label: 'Ứng dụng', icon: 'solar:smartphone-linear' },
  { value: 'store', label: 'Cửa hàng', icon: 'solar:shop-linear' },
  { value: 'hotline', label: 'Tổng đài', icon: 'solar:phone-linear' },
  { value: 'marketplace', label: 'Sàn TMĐT', icon: 'solar:cart-large-linear' },
];

const MATERIALS = [
  { value: 'gold', label: 'Vàng' },
  { value: 'silver', label: 'Bạc' },
  { value: 'platinum', label: 'Bạch kim' },
  { value: 'diamond', label: 'Kim cương' },
  { value: 'gemstone', label: 'Đá quý' },
  { value: 'pearl', label: 'Ngọc trai' },
];

const KARATS = ['24K', '22K', '18K', '14K', '10K', '925 silver', 'PT950'];

const STONE_TYPES = [
  'Kim cương thiên nhiên', 'Kim cương nhân tạo (Moissanite)',
  'Ruby', 'Sapphire', 'Emerald', 'Topaz', 'Amethyst', 'Ngọc trai',
  'CZ (Cubic Zirconia)', 'ECZ (Enhanced CZ)',
];

const CERTIFICATE_TYPES = ['GIA', 'IGI', 'HRD', 'AGS', 'PNJ-Lab', 'Giấy bảo đảm PNJ'];

const SHIPPING_CLASSES = [
  { value: 'standard', label: 'Thường (≤ 20tr)' },
  { value: 'insured', label: 'Bảo hiểm (20-100tr)' },
  { value: 'high_value', label: 'Giá trị cao (>100tr, có bảo vệ)' },
];

const PROMO_BADGE_PRESETS = [
  { label: 'Trả góp 0% lãi suất', icon: 'solar:card-linear' },
  { label: 'Giao nhanh 3 giờ nội thành', icon: 'solar:delivery-linear' },
  { label: 'Tặng hộp quà PNJ cao cấp', icon: 'solar:gift-linear' },
  { label: 'Thu đổi trong 48 giờ', icon: 'solar:refresh-linear' },
  { label: 'Giảm thêm 5% cho KH Diamond', icon: 'solar:crown-star-linear' },
  { label: 'Miễn phí khắc tên', icon: 'solar:pen-linear' },
];

const TAG_SUGGESTIONS = [
  'tết', 'valentine', 'cưới hỏi', 'sinh nhật', 'kỷ niệm', 'tặng mẹ', 'tặng vợ',
  'bộ sưu tập limited', 'hàng mới', 'bán chạy', 'disney', 'hello kitty', 'hearts on fire',
];

const STATUS_OPTIONS = [
  { value: 'draft', icon: 'solar:document-text-linear' },
  { value: 'active', icon: 'solar:check-circle-linear' },
  { value: 'inactive', icon: 'solar:pause-circle-linear' },
  { value: 'out_of_stock', icon: 'solar:box-minimalistic-linear' },
];

const VARIANT_AXES = [
  { value: '', label: 'Không có biến thể', icon: 'solar:close-square-linear' },
  { value: 'size', label: 'Size (nhẫn / vòng / lắc)', icon: 'solar:ruler-linear' },
  { value: 'bangle_size', label: 'Size vòng tay', icon: 'solar:ring-linear' },
  { value: 'ring_size', label: 'Size nhẫn', icon: 'solar:ring-linear' },
];

const FLAGS_GROUPS = [
  {
    title: 'Trạng thái hiển thị',
    icon: VisibilityOutlined,
    items: [
      { k: 'is_new', label: 'Hàng mới', desc: 'Gắn nhãn NEW ở góc card sản phẩm.' },
      { k: 'is_best_seller', label: 'Bán chạy', desc: 'Hiện ở tab "Bán chạy" trên trang chủ.' },
      { k: 'is_featured', label: 'Nổi bật', desc: 'Ưu tiên hiển thị trong danh mục & tìm kiếm.' },
    ],
  },
  {
    title: 'Ưu đãi & giao hàng',
    icon: LocalOfferOutlined,
    items: [
      { k: 'fast_delivery_3h', label: 'Giao 3H', desc: 'Nhãn giao nhanh trong 3 giờ (chỉ nội thành).' },
      { k: 'installment_0', label: 'Trả góp 0%', desc: 'Áp gói trả góp 0% qua ngân hàng đối tác.' },
    ],
  },
  {
    title: 'Kênh bán',
    icon: InventoryOutlined,
    items: [
      { k: 'online_only', label: 'Chỉ bán online', desc: 'Không hiển thị nút "Đặt tại cửa hàng".' },
      { k: 'store_order_enabled', label: 'Đặt tại cửa hàng', desc: 'Bật nút "Đặt tại cửa hàng" ở trang chi tiết.' },
      { k: 'requires_size', label: 'Bắt buộc chọn size', desc: 'Khóa nút "Thêm vào giỏ" khi khách chưa chọn size.' },
    ],
  },
];

const SAMPLE_AUDIT = [
  { action: 'create', summary: 'Tạo sản phẩm', actor: 'Nguyễn A', at: '2026-11-10T09:00:00Z' },
  { action: 'update', summary: 'Cập nhật biến thể size 52', actor: 'Trần B', at: '2026-11-11T14:20:00Z' },
  { action: 'update', summary: 'Đổi trạng thái → Đang bán', actor: 'Nguyễn A', at: '2026-11-12T08:00:00Z', ip: '113.161.1.1' },
];

// ----------------------------------------------------------------------
// Primitives

const CARD_SX = {
  bgcolor: 'background.paper',
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  boxShadow: '0 1px 0 rgba(145, 158, 171, 0.04)',
  overflow: 'hidden',
};

// Accordion kiểu "Nâng cao" collapsed mặc định - gom field hiếm dùng.
const advancedAccordionSx = {
  ...CARD_SX,
  '&.MuiAccordion-root': { boxShadow: '0 1px 0 rgba(145, 158, 171, 0.04)' },
  '&:before': { display: 'none' },
};

function Section({ icon: Ico, title, description, action, badge, children, dense }) {
  return (
    <Box sx={{ ...CARD_SX, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{
          px: 2,
          py: 1.25,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        {Ico && <Ico sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
              {title}
            </Typography>
            {badge}
          </Stack>
          {description && (
            <Typography sx={{ color: 'text.secondary', fontSize: 11.5, display: 'block', mt: 0.25 }}>
              {description}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
      <Box sx={{ p: dense ? 1.5 : 2, flex: 1 }}>{children}</Box>
    </Box>
  );
}

function FieldLabel({ children, required, tooltip }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
      <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: 'text.secondary', letterSpacing: 0.2 }}>
        {children}
        {required && <Box component="span" sx={{ color: 'error.main', ml: 0.25 }}>*</Box>}
      </Typography>
      {tooltip && (
        <Tooltip title={tooltip} arrow placement="top">
          <InfoOutlined sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
        </Tooltip>
      )}
    </Stack>
  );
}

function Field({ label, tooltip, required, helper, children }) {
  return (
    <Box>
      <FieldLabel required={required} tooltip={tooltip}>{label}</FieldLabel>
      {children}
      {helper && (
        <Typography sx={{ color: 'text.secondary', fontSize: 11, display: 'block', mt: 0.5 }}>
          {helper}
        </Typography>
      )}
    </Box>
  );
}

// Hero strip đầu mỗi step - thêm tính trang trí, cho form đỡ khô.
// StepHero: banner đầu mỗi step. Navy icon đậm, không badge phải.
function StepHero({ icon: Ico, eyebrow, title, description }) {
  return (
    <Box
      sx={{
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        mb: 2,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
        <Box
          sx={{
            width: 48, height: 48, borderRadius: 1,
            display: 'grid', placeItems: 'center',
            bgcolor: landingTokens.PRIMARY,
            color: 'common.white',
            flexShrink: 0,
            boxShadow: `0 4px 12px ${landingTokens.PRIMARY}20`,
          }}
        >
          <Ico sx={{ fontSize: 24 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {eyebrow && (
            <Typography
              sx={{
                fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2,
                color: landingTokens.GOLD_DARK, textTransform: 'uppercase',
                display: 'block', mb: 0.25,
              }}
            >
              {eyebrow}
            </Typography>
          )}
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary', lineHeight: 1.3 }}>
            {title}
          </Typography>
          {description && (
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5, lineHeight: 1.5 }}>
              {description}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

// AdvancedTargetingCard - card "Nâng cao" collapsed-able cho audience/age/channels/tags.
// Thay MUI Accordion bằng card custom + height animation mượt + summary chip khi collapsed.
function AdvancedTargetingCard({ data, toggleAudience, toggleListValue }) {
  const [expanded, setExpanded] = useState(false);
  const audienceCount = (data.audiences ?? []).length;
  const ageCount = (data.age_group ?? []).length;
  const channelCount = (data.visibility_channels ?? []).length;
  const totalSet = audienceCount + ageCount + channelCount;

  return (
    <Box
      sx={{
        borderRadius: 1,
        border: 1,
        borderColor: expanded ? landingTokens.PRIMARY : 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        transition: 'border-color .2s ease, box-shadow .2s ease',
        boxShadow: expanded ? `0 2px 12px ${landingTokens.PRIMARY}10` : 'none',
      }}
    >
      {/* Header toggle */}
      <Box
        onClick={() => setExpanded((v) => !v)}
        sx={{
          cursor: 'pointer', px: 2, py: 1.5,
          display: 'flex', alignItems: 'center', gap: 1.5,
          bgcolor: expanded ? 'grey.50' : 'transparent',
          borderBottom: expanded ? 1 : 0,
          borderColor: 'divider',
          transition: 'background .15s ease',
          '&:hover': { bgcolor: 'grey.50' },
        }}
      >
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 1,
            bgcolor: expanded ? landingTokens.PRIMARY : 'grey.100',
            color: expanded ? 'common.white' : 'text.secondary',
            display: 'grid', placeItems: 'center',
            flexShrink: 0,
            transition: 'all .2s ease',
          }}
        >
          <GroupsOutlined sx={{ fontSize: 20 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            Nâng cao · Khách hàng mục tiêu & kênh phân phối
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
            Giới tính · Nhóm tuổi · Kênh hiển thị · Ảnh hưởng filter trang chủ.
          </Typography>
        </Box>
        {!expanded && totalSet > 0 && (
          <Chip
            size="small"
            label={`${totalSet} đã chọn`}
            sx={{ height: 22, fontSize: 11, fontWeight: 700, bgcolor: 'primary.lighter', color: 'primary.dark', border: 'none' }}
          />
        )}
        {!expanded && totalSet === 0 && (
          <Chip size="small" label="Tuỳ chọn" sx={{ height: 22, fontSize: 11, bgcolor: 'grey.100' }} />
        )}
        <m.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ExpandMoreRounded sx={{ fontSize: 22, color: 'text.secondary' }} />
        </m.div>
      </Box>

      {/* Body animated */}
      <AnimatePresence initial={false}>
        {expanded && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={0.75}>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: landingTokens.PRIMARY }} />
                      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: 'text.secondary', textTransform: 'uppercase' }}>
                        Giới tính / đối tượng
                      </Typography>
                      {audienceCount > 0 && (
                        <Chip size="small" label={audienceCount} sx={{ height: 16, fontSize: 10, bgcolor: 'primary.lighter', color: 'primary.dark' }} />
                      )}
                    </Stack>
                    <ChipPicker options={AUDIENCES} values={data.audiences} onToggle={toggleAudience} />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={0.75}>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: landingTokens.PRIMARY }} />
                      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: 'text.secondary', textTransform: 'uppercase' }}>
                        Nhóm tuổi
                      </Typography>
                      {ageCount > 0 && (
                        <Chip size="small" label={ageCount} sx={{ height: 16, fontSize: 10, bgcolor: 'primary.lighter', color: 'primary.dark' }} />
                      )}
                    </Stack>
                    <ChipPicker options={AGE_GROUPS} values={data.age_group ?? []} onToggle={(v) => toggleListValue('age_group', v)} />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={0.75}>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: landingTokens.GOLD_DARK }} />
                      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: 'text.secondary', textTransform: 'uppercase' }}>
                        Kênh hiển thị
                      </Typography>
                      {channelCount > 0 && (
                        <Chip size="small" label={channelCount} sx={{ height: 16, fontSize: 10, bgcolor: 'warning.lighter', color: 'warning.dark' }} />
                      )}
                    </Stack>
                    <ChipPicker options={VISIBILITY_CHANNELS} values={data.visibility_channels ?? []} onToggle={(v) => toggleListValue('visibility_channels', v)} color="secondary" />
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </m.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

// Multi-chip picker - chip layout + click toggle. Dùng cho audience, age group, channels.
function ChipPicker({ options, values, onToggle, color = 'primary' }) {
  return (
    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
      {options.map((o) => {
        const active = values.includes(o.value);
        return (
          <Chip
            key={o.value}
            label={o.label}
            icon={o.icon ? <Iconify icon={o.icon} width={14} sx={{ ml: 0.5 }} /> : undefined}
            color={active ? color : 'default'}
            variant={active ? 'filled' : 'outlined'}
            onClick={() => onToggle(o.value)}
            sx={{ fontWeight: 500 }}
          />
        );
      })}
    </Stack>
  );
}

// Promo badge editor - đẹp, trực quan. Preset + custom thêm.
function PromoBadgeEditor({ value, onChange }) {
  const [draft, setDraft] = useState('');
  const add = (label) => {
    if (!label.trim()) return;
    if (value.some((b) => b.label === label)) return;
    onChange([...value, { label, icon: 'solar:star-shine-linear' }]);
    setDraft('');
  };
  const remove = (idx) => onChange(value.filter((_, i) => i !== idx));

  return (
    <Stack spacing={1.5}>
      {/* Preset chips */}
      <Box>
        <Typography sx={{ fontSize: 10.5, color: 'text.disabled', mb: 0.75, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase' }}>
          Mẫu nhanh
        </Typography>
        <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.75 }}>
          {PROMO_BADGE_PRESETS.map((p) => (
            <Chip
              key={p.label}
              icon={<Iconify icon={p.icon} width={13} sx={{ ml: 0.5, color: landingTokens.GOLD_DARK }} />}
              label={p.label}
              size="small"
              variant="outlined"
              onClick={() => add(p.label)}
              sx={{ fontSize: 11, bgcolor: 'grey.50' }}
            />
          ))}
        </Stack>
      </Box>

      {/* Custom add */}
      <Stack direction="row" spacing={1}>
        <TextField
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(draft); } }}
          fullWidth size="small"
          placeholder="Nhập nhãn ưu đãi mới rồi Enter…"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:star-shine-linear" width={14} sx={{ color: landingTokens.GOLD_DARK }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          size="small"
          variant="contained"
          startIcon={<AddRounded sx={{ fontSize: 16 }} />}
          onClick={() => add(draft)}
          sx={{ boxShadow: 'none', flexShrink: 0 }}
        >
          Thêm
        </Button>
      </Stack>

      {/* Preview active badges */}
      {value.length > 0 && (
        <Box
          sx={{
            border: 1,
            borderColor: 'warning.light',
            bgcolor: 'warning.lighter',
            borderRadius: 1,
            p: 1.25,
          }}
        >
          <Typography sx={{ fontSize: 10.5, color: 'warning.dark', mb: 0.75, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>
            Nhãn đang áp dụng ({value.length})
          </Typography>
          <Stack spacing={0.75}>
            {value.map((b, i) => (
              <Stack
                key={i}
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  bgcolor: 'common.white',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 0.75,
                  px: 1,
                  py: 0.5,
                }}
              >
                <Iconify icon={b.icon ?? 'solar:star-shine-linear'} width={14} sx={{ color: landingTokens.GOLD_DARK }} />
                <Typography sx={{ fontSize: 12, flex: 1, fontWeight: 500 }}>{b.label}</Typography>
                <IconButton size="small" onClick={() => remove(i)} sx={{ color: 'text.disabled' }}>
                  <CloseRounded sx={{ fontSize: 14 }} />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}

// ----------------------------------------------------------------------
// Helpers

function isEmptyValue(v) {
  if (v == null) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0;
  return false;
}

function stepCompletion(step, data) {
  if (!step.required.length) return { done: 0, total: 0, missing: [] };
  const missing = step.required.filter((k) => isEmptyValue(data[k]));
  return { done: step.required.length - missing.length, total: step.required.length, missing };
}

// ----------------------------------------------------------------------
// Stepper header

// StepperBar: horizontal step indicator với connector line + animated progress.
// Mỗi step = circle number (pending/active/done) + label + desc + progress line giữa 2 step.
function StepperBar({ current, completions, onJump }) {
  const totalRequired = completions.reduce((s, c) => s + c.total, 0);
  const totalDone = completions.reduce((s, c) => s + c.done, 0);
  const progressPct = totalRequired > 0 ? Math.round((totalDone / totalRequired) * 100) : 0;

  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      {/* Header bar: tổng progress + label */}
      <Stack
        direction="row" alignItems="center" spacing={1.5}
        sx={{ px: { xs: 2, md: 3 }, pt: 2, pb: 1 }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: 'text.secondary', textTransform: 'uppercase' }}>
          Tiến trình
        </Typography>
        <Box sx={{ flex: 1, position: 'relative', height: 4, borderRadius: 2, bgcolor: 'grey.100', overflow: 'hidden' }}>
          <m.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              background: `linear-gradient(90deg, ${landingTokens.PRIMARY}, ${landingTokens.GOLD_DARK})`,
            }}
          />
        </Box>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: landingTokens.GOLD_DARK, fontVariantNumeric: 'tabular-nums', minWidth: 32, textAlign: 'right' }}>
          {progressPct}%
        </Typography>
      </Stack>

      {/* Step cards */}
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          pb: 2,
          pt: 1,
          display: 'flex',
          gap: { xs: 1, md: 0 },
          overflowX: 'auto',
          alignItems: 'stretch',
        }}
      >
        {STEPS.map((s, idx) => {
          const Ico = s.icon;
          const isActive = idx === current;
          const isDone = idx < current || (completions[idx].total > 0 && completions[idx].done === completions[idx].total);
          const isPast = idx < current;
          const isFuture = idx > current;
          const num = idx + 1;

          // Connector line giữa 2 step (trừ step cuối)
          const isLast = idx === STEPS.length - 1;
          const nextDone = idx + 1 <= current;

          return (
            <m.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3, ease: 'easeOut' }}
              style={{
                flex: 1,
                minWidth: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 0,
              }}
            >
              {/* Card */}
              <m.div
                onClick={() => onJump(idx)}
                whileHover={{ y: isFuture ? -2 : 0, scale: isActive ? 1 : 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  borderRadius: 12,
                  padding: 12,
                  background: isActive ? '#fff' : 'transparent',
                  border: `1px solid ${isActive ? landingTokens.PRIMARY : 'transparent'}`,
                  boxShadow: isActive ? `0 4px 14px ${landingTokens.PRIMARY}1F` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  position: 'relative',
                }}
              >
                {/* Active glow pulse */}
                {isActive && (
                  <m.div
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: [0.6, 0.3, 0.6], scale: [1, 1.015, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', inset: 0,
                      borderRadius: 12,
                      border: `1px solid ${landingTokens.PRIMARY}40`,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Number / Check circle with pulse animation */}
                <m.div
                  animate={isActive ? { scale: [1, 1.06, 1] } : {}}
                  transition={isActive ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : {}}
                  style={{
                    width: 42, height: 42,
                    borderRadius: '50%',
                    background: isActive
                      ? landingTokens.PRIMARY
                      : isDone
                        ? landingTokens.GOLD_DARK
                        : '#F4F6F8',
                    color: isActive || isDone ? '#fff' : '#919EAB',
                    border: isActive ? `3px solid ${landingTokens.PRIMARY}25` : 0,
                    boxShadow: isActive ? `0 2px 10px ${landingTokens.PRIMARY}44` : 'none',
                    display: 'grid', placeItems: 'center',
                    flexShrink: 0,
                    fontWeight: 800,
                    fontSize: 15,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {(isPast || isDone) ? (
                      <m.div
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        style={{ display: 'grid', placeItems: 'center' }}
                      >
                        <CheckRounded sx={{ fontSize: 20 }} />
                      </m.div>
                    ) : (
                      <m.div
                        key="num"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {num}
                      </m.div>
                    )}
                  </AnimatePresence>
                </m.div>

                {/* Label + Description */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.25 }}>
                    <Ico sx={{
                      fontSize: 14,
                      color: isActive ? landingTokens.PRIMARY : isDone ? landingTokens.GOLD_DARK : 'text.disabled',
                    }} />
                    <Typography sx={{
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: 0.6, textTransform: 'uppercase',
                      color: isActive ? landingTokens.PRIMARY : 'text.disabled',
                    }}>
                      Bước {num}
                    </Typography>
                    {completions[idx].total > 0 && completions[idx].done === completions[idx].total && !isActive && (
                      <CheckCircleOutlined sx={{ fontSize: 12, color: landingTokens.GOLD_DARK }} />
                    )}
                  </Stack>
                  <Typography sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isActive ? 'text.primary' : isDone ? 'text.primary' : 'text.secondary',
                    lineHeight: 1.3,
                  }} noWrap>
                    {s.label}
                  </Typography>
                  <Typography sx={{
                    fontSize: 11,
                    color: 'text.disabled',
                    mt: 0.25,
                    lineHeight: 1.3,
                  }} noWrap>
                    {s.description}
                  </Typography>
                  {completions[idx].total > 0 && (
                    <Box sx={{ mt: 0.75, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{ flex: 1, height: 3, borderRadius: 1.5, bgcolor: 'grey.100', overflow: 'hidden' }}>
                        <m.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(completions[idx].done / completions[idx].total) * 100}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          style={{
                            height: '100%',
                            background: completions[idx].done === completions[idx].total
                              ? landingTokens.GOLD_DARK
                              : isActive ? landingTokens.PRIMARY : '#C4CDD5',
                          }}
                        />
                      </Box>
                      <Typography sx={{
                        fontSize: 10, fontWeight: 700,
                        color: completions[idx].done === completions[idx].total ? landingTokens.GOLD_DARK : 'text.disabled',
                        fontVariantNumeric: 'tabular-nums',
                        flexShrink: 0,
                      }}>
                        {completions[idx].done}/{completions[idx].total}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </m.div>

              {/* Connector line - animated fill */}
              {!isLast && (
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    px: 0.5,
                    alignSelf: 'center',
                    mt: -0.5,
                  }}
                >
                  <Box sx={{ width: 24, height: 2, borderRadius: 1, bgcolor: 'grey.200', overflow: 'hidden', position: 'relative' }}>
                    <m.div
                      initial={{ width: 0 }}
                      animate={{ width: nextDone ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                      style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        background: landingTokens.GOLD_DARK,
                      }}
                    />
                  </Box>
                </Box>
              )}
            </m.div>
          );
        })}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Sidebar - preview + checklist + audit

// PreviewCard - replica landing ProductCard (src/sections/landing/components/ProductCard.jsx).
// Giữ 280px width + 320px image + text centered gold price + hover actions stagger.
function PreviewCard({ data }) {
  const hasSale = data.compare_at_price && data.sale_price && Number(data.compare_at_price) !== Number(data.sale_price);
  const primaryPrice = Number(data.sale_price) || Number(data.compare_at_price) || 0;
  const discountPct = hasSale
    ? Math.round((1 - Number(data.sale_price) / Number(data.compare_at_price)) * 100)
    : 0;

  return (
    <Box sx={{ ...CARD_SX }}>
      {/* Header compact giống 2 card còn lại */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ px: 1.5, py: 0.75, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
      >
        <VisibilityOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'text.disabled', flex: 1 }}>
          Xem trước trên store
        </Typography>
        <StatusBadge status={data.status} colorMap={PRODUCT_STATUS_COLOR} labelMap={PRODUCT_STATUS_LABEL} />
      </Stack>

      {/* Body - nền nhạt làm landing card nổi lên, center-align */}
      <Box
        sx={{
          p: 1.5,
          bgcolor: 'grey.50',
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 },
        }}
      >
        {/* Landing ProductCard replica - 280px width per spec */}
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            bgcolor: landingTokens.SURFACE,
            borderRadius: 1,
            overflow: 'hidden',
            border: `1px solid ${landingTokens.HAIRLINE}`,
            transition: 'transform 220ms ease',
            '&:hover': { transform: 'translateY(-2px)' },
            '&:hover .pf-img': { transform: 'scale(1.03)' },
            '&:hover .pf-action': { opacity: 1, transform: 'translateY(0)' },
          }}
        >
          {/* Image area - landing size default = 320px */}
          <Box sx={{ position: 'relative', overflow: 'hidden', height: 320 }}>
            <Box className="pf-img" sx={{ width: '100%', height: '100%', transition: 'transform 600ms ease' }}>
              <Wireframe label={data.display_code ? `SP ${data.display_code}` : 'Chưa có ảnh'} />
            </Box>

            {/* Flag badges top-left (stack ngang) */}
            {(discountPct > 0 || data.flags?.is_new || data.flags?.is_best_seller || data.flags?.is_featured) && (
              <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                {discountPct > 0 && (
                  <Box sx={{ bgcolor: landingTokens.CTA, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 0.4, px: 0.875, py: 0.3, borderRadius: 0.5 }}>
                    -{discountPct}%
                  </Box>
                )}
                {data.flags?.is_new && (
                  <Box sx={{ bgcolor: landingTokens.CTA, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 0.4, px: 0.875, py: 0.3, borderRadius: 0.5 }}>
                    NEW
                  </Box>
                )}
                {data.flags?.is_best_seller && (
                  <Box sx={{ bgcolor: landingTokens.GOLD_DARK, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 0.4, px: 0.875, py: 0.3, borderRadius: 0.5 }}>
                    BEST
                  </Box>
                )}
                {data.flags?.is_featured && (
                  <Box sx={{ bgcolor: landingTokens.PRIMARY, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 0.4, px: 0.875, py: 0.3, borderRadius: 0.5 }}>
                    HOT
                  </Box>
                )}
              </Stack>
            )}

            {/* Hover actions right column - rise bottom→top stagger (decorative) */}
            <Stack direction="column" spacing={1} sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
              {[
                { Icon: VisibilityOutlined, delay: 160 },
                { Icon: ShoppingCartOutlined, delay: 80 },
                { Icon: FavoriteBorderRounded, delay: 0 },
              ].map(({ Icon, delay }, i) => (
                <Box
                  key={i}
                  className="pf-action"
                  sx={{
                    width: 34,
                    height: 34,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#FFFFFF',
                    color: landingTokens.PRIMARY,
                    border: `1px solid ${landingTokens.HAIRLINE}`,
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px rgba(26,20,19,0.08)',
                    opacity: 0,
                    transform: 'translateY(16px)',
                    transition: `opacity 320ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 320ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
                    pointerEvents: 'none',
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Name + price - centered theo landing */}
          <Stack spacing={0.75} sx={{ px: 2, pt: 2, pb: 1.25, textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: landingTokens.INK_MUTED,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.8em',
                lineHeight: 1.4,
              }}
            >
              {data.name || (
                <Box component="span" sx={{ color: landingTokens.INK_MUTED, fontStyle: 'italic', opacity: 0.55 }}>
                  Chưa đặt tên sản phẩm
                </Box>
              )}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="baseline" justifyContent="center">
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: landingTokens.GOLD_DARK }}>
                {primaryPrice ? fCurrency(primaryPrice) : (
                  <Box component="span" sx={{ color: 'text.disabled', fontWeight: 500, letterSpacing: 2 }}>— ₫</Box>
                )}
              </Typography>
              {hasSale && (
                <Typography sx={{ fontSize: 11, color: landingTokens.INK_MUTED, textDecoration: 'line-through' }}>
                  {fCurrency(Number(data.compare_at_price))}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Rating + sold bottom corners - exactly như landing */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 2, pb: 1.5, pt: 0.75 }}
          >
            <Stack direction="row" alignItems="center" spacing={0.25}>
              <StarRounded sx={{ fontSize: 14, color: '#FFB400' }} />
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: landingTokens.INK }}>5.0</Typography>
              <Typography sx={{ fontSize: 11, color: landingTokens.INK_MUTED }}>(0)</Typography>
            </Stack>
            <Typography sx={{ fontSize: 11, color: landingTokens.INK_MUTED }}>
              Đã bán 0
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Step bodies

function Step1Basic({ data, set, toggleAudience, toggleListValue }) {
  // API hooks - load option cho các select taxonomy.
  const { searchResults: categoryOpts, searchLoading: categoryLoading } = useGetCategoryList({ perPage: 200 });
  const { searchResults: brandOpts, searchLoading: brandLoading } = useGetBrandList({ perPage: 200 });
  const { searchResults: productLineOpts, searchLoading: productLineLoading } = useGetProductLineList({ perPage: 200 });
  const { searchResults: collectionOpts, searchLoading: collectionLoading } = useGetCollectionList({ perPage: 200 });

  // Helper props chuẩn cho Autocomplete single-select by id.
  const singleAc = (options, key, placeholder, loading) => ({
    size: 'small',
    options,
    loading,
    getOptionLabel: (o) => (typeof o === 'string' ? o : o?.name ?? ''),
    isOptionEqualToValue: (a, b) => (a?.id ?? a) === (b?.id ?? b),
    value: options.find((o) => o.id === data[key]) ?? null,
    onChange: (_, v) => set(key, v?.id ?? null),
    renderInput: (params) => (
      <TextField
        {...params}
        size="small"
        placeholder={placeholder}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading && <CircularProgress size={14} />}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    ),
  });

  // Helper props cho multi-select by id array.
  const multiAc = (options, key, placeholder, loading) => ({
    multiple: true,
    size: 'small',
    options,
    loading,
    getOptionLabel: (o) => (typeof o === 'string' ? o : o?.name ?? ''),
    isOptionEqualToValue: (a, b) => (a?.id ?? a) === (b?.id ?? b),
    value: options.filter((o) => (data[key] ?? []).includes(o.id)),
    onChange: (_, v) => set(key, v.map((x) => x.id)),
    renderTags: (tags, getTagProps) =>
      tags.map((t, i) => (
        <Chip key={t.id} label={t.name} size="small" {...getTagProps({ index: i })} sx={{ fontSize: 11 }} />
      )),
    renderInput: (params) => (
      <TextField
        {...params}
        size="small"
        placeholder={placeholder}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading && <CircularProgress size={14} />}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    ),
  });

  return (
    <>
      <StepHero
        icon={InfoOutlined}
        eyebrow="Bước 1 / 4"
        title="Thiết lập thông tin cơ bản"
        description="Bắt đầu với tên, mã nhận dạng, phân loại và kênh bán. Các bước sau sẽ dễ hơn khi đủ nền tảng."
      />

      <Grid container spacing={2}>
        {/* ======== Nhận dạng ======== */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Section
            icon={InfoOutlined}
            title="Nhận dạng sản phẩm"
            description="Tên hiển thị trên site và các mã tham chiếu nội bộ."
          >
            <Stack spacing={2}>
              <Field label="TÊN SẢN PHẨM" required tooltip="Hiển thị làm tiêu đề trang chi tiết (h1). Nên có từ khóa chính.">
                <TextField
                  value={data.name}
                  onChange={(e) => set('name', e.target.value)}
                  fullWidth size="small"
                  placeholder="Vd: Vòng tay Vàng 10K Disney Princess"
                />
              </Field>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Field label="MÃ THIẾT KẾ" tooltip="Mã SKU gốc nội bộ. Unique, viết hoa.">
                    <TextField
                      value={data.code}
                      onChange={(e) => set('code', e.target.value)}
                      fullWidth size="small"
                      placeholder="GV-GNDDDPPL002"
                      sx={{ '& input': { fontFamily: 'monospace' } }}
                    />
                  </Field>
                </Grid>
                <Grid size={6}>
                  <Field label="MÃ HIỂN THỊ" required helper="Mã khách thấy trên trang chi tiết">
                    <TextField
                      value={data.display_code}
                      onChange={(e) => set('display_code', e.target.value)}
                      fullWidth size="small"
                      placeholder="GV0000Y001642"
                      sx={{ '& input': { fontFamily: 'monospace' } }}
                    />
                  </Field>
                </Grid>
              </Grid>
              <Field label="SLUG URL" tooltip="Tự sinh từ tên. Đổi slug đã xuất bản sẽ hệ tạo redirect 301.">
                <SlugInput sourceName={data.name} value={data.slug} onChange={(v) => set('slug', v)} label="" />
              </Field>
            </Stack>
          </Section>
        </Grid>

        {/* ======== Loại & trạng thái ======== */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Section
            icon={LayersOutlined}
            title="Loại & trạng thái"
            description="Phân loại SP, trạng thái bán và tag từ khóa cho tìm kiếm."
          >
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="LOẠI SẢN PHẨM" required>
                    <TextField
                      select value={data.type} onChange={(e) => set('type', e.target.value)}
                      fullWidth size="small"
                    >
                      {PRODUCT_TYPES.map((o) => (
                        <MenuItem key={o.value} value={o.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify icon={o.icon} width={16} sx={{ color: 'text.secondary' }} />
                            <span>{o.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Field label="TRẠNG THÁI BÁN" required>
                    <TextField
                      select value={data.status} onChange={(e) => set('status', e.target.value)}
                      fullWidth size="small"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Iconify icon={s.icon} width={16} sx={{ color: 'text.secondary' }} />
                            <span>{PRODUCT_STATUS_LABEL[s.value]}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Field>
                </Grid>
              </Grid>
              <Field label="TAG / TỪ KHÓA" tooltip="Hỗ trợ tìm kiếm & gợi ý. Nhấn Enter để thêm.">
                <Autocomplete
                  multiple
                  freeSolo
                  size="small"
                  options={TAG_SUGGESTIONS}
                  value={data.tags ?? []}
                  onChange={(_, v) => set('tags', v)}
                  renderTags={(tags, getTagProps) =>
                    tags.map((tag, idx) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        {...getTagProps({ index: idx })}
                        sx={{ fontSize: 11 }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Vd: tết, valentine, tặng mẹ…" size="small" />
                  )}
                />
              </Field>
            </Stack>
          </Section>
        </Grid>

        {/* ======== Danh mục & thương hiệu (API selects) ======== */}
        <Grid size={12}>
          <Section
            icon={LayersOutlined}
            title="Danh mục, thương hiệu & bộ sưu tập"
            description="Gán SP vào các nhóm phân loại để lọc, promotion, đề xuất."
          >
            {/* Summary pill-bar - hiển tức thì những gì user đã chọn */}
            <Box
              sx={{
                mb: 2, px: 1.5, py: 1,
                borderRadius: 1,
                bgcolor: 'grey.50',
                border: 1, borderColor: 'divider',
                display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.4, textTransform: 'uppercase', mr: 0.5 }}>
                Đã gán:
              </Typography>
              {!data.category_id && !data.brand_id && !data.product_line_id && (data.collection_ids ?? []).length === 0 ? (
                <Typography sx={{ fontSize: 11.5, color: 'text.disabled' }}>
                  Chưa có phân loại nào - chọn bên dưới.
                </Typography>
              ) : (
                <>
                  {data.category_id && (
                    <Chip
                      size="small"
                      icon={<CategoryOutlined sx={{ fontSize: 13, ml: 0.5 }} />}
                      label={categoryOpts.find((c) => c.id === data.category_id)?.name ?? '—'}
                      sx={{ height: 22, fontSize: 11, fontWeight: 600, bgcolor: 'common.white', border: 1, borderColor: 'divider' }}
                    />
                  )}
                  {data.brand_id && (
                    <Chip
                      size="small"
                      icon={<LocalOfferOutlined sx={{ fontSize: 13, ml: 0.5 }} />}
                      label={brandOpts.find((b) => b.id === data.brand_id)?.name ?? '—'}
                      sx={{ height: 22, fontSize: 11, fontWeight: 600, bgcolor: 'common.white', border: 1, borderColor: 'divider' }}
                    />
                  )}
                  {data.product_line_id && (
                    <Chip
                      size="small"
                      icon={<LayersOutlined sx={{ fontSize: 13, ml: 0.5 }} />}
                      label={productLineOpts.find((l) => l.id === data.product_line_id)?.name ?? '—'}
                      sx={{ height: 22, fontSize: 11, fontWeight: 600, bgcolor: 'common.white', border: 1, borderColor: 'divider' }}
                    />
                  )}
                  {(data.collection_ids ?? []).length > 0 && (
                    <Chip
                      size="small"
                      icon={<WorkspacePremiumOutlined sx={{ fontSize: 13, ml: 0.5 }} />}
                      label={`${data.collection_ids.length} BST`}
                      sx={{ height: 22, fontSize: 11, fontWeight: 600, bgcolor: 'common.white', border: 1, borderColor: 'divider' }}
                    />
                  )}
                </>
              )}
            </Box>

            {/* Tiers: Danh mục → Thương hiệu → BST */}
            <Stack spacing={2.5}>
              {/* Tier 1 - Danh mục (primary + extra) */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
                  <CategoryOutlined sx={{ fontSize: 14, color: landingTokens.PRIMARY }} />
                  <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: 'text.secondary', textTransform: 'uppercase' }}>
                    Danh mục
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
                    Dùng cho breadcrumb & SEO canonical
                  </Typography>
                </Stack>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Field label="CHÍNH" required tooltip="SP bắt buộc thuộc 1 danh mục chính.">
                      <Autocomplete {...singleAc(categoryOpts, 'category_id', 'Chọn danh mục chính…', categoryLoading)} />
                    </Field>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Field label="PHỤ" helper="Chọn thêm để SP hiện trong nhiều bộ lọc.">
                      <Autocomplete {...multiAc(categoryOpts, 'category_ids_extra', 'Chọn thêm…', categoryLoading)} />
                    </Field>
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* Tier 2 - Thương hiệu & Dòng hàng */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
                  <LocalOfferOutlined sx={{ fontSize: 14, color: landingTokens.PRIMARY }} />
                  <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: 'text.secondary', textTransform: 'uppercase' }}>
                    Thương hiệu & Dòng hàng
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
                    Line prefill attribute-set → Bước 2
                  </Typography>
                </Stack>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Field label="THƯƠNG HIỆU">
                      <Autocomplete {...singleAc(brandOpts, 'brand_id', 'Chọn thương hiệu…', brandLoading)} />
                    </Field>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Field label="DÒNG HÀNG" helper="Vd: Disney Collection, Hearts On Fire…">
                      <Autocomplete {...singleAc(productLineOpts, 'product_line_id', 'Chọn dòng hàng…', productLineLoading)} />
                    </Field>
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* Tier 3 - Bộ sưu tập */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
                  <WorkspacePremiumOutlined sx={{ fontSize: 14, color: landingTokens.PRIMARY }} />
                  <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: 'text.secondary', textTransform: 'uppercase' }}>
                    Bộ sưu tập
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Typography sx={{ fontSize: 10.5, color: 'text.disabled' }}>
                    Có thể thuộc nhiều BST
                  </Typography>
                </Stack>
                <Autocomplete {...multiAc(collectionOpts, 'collection_ids', 'Chọn bộ sưu tập…', collectionLoading)} />
              </Box>
            </Stack>
          </Section>
        </Grid>

        {/* ======== NÂNG CAO: Target khách hàng & kênh bán (card) ======== */}
        <Grid size={12}>
          <AdvancedTargetingCard
            data={data}
            toggleAudience={toggleAudience}
            toggleListValue={toggleListValue}
          />
        </Grid>
      </Grid>
    </>
  );
}

function Step2Pricing({ data, set, setSnack, variantAttrs = [], setDetailLoading = false }) {
  const hasSale = data.sale_price && data.compare_at_price && Number(data.sale_price) < Number(data.compare_at_price);
  const discountPct = hasSale
    ? Math.round((1 - Number(data.sale_price) / Number(data.compare_at_price)) * 100)
    : 0;
  const pricingModeMeta = PRICING_MODES.find((p) => p.value === data.pricing_mode);
  const variantAxisAttr = variantAttrs[0] ?? null;
  const hasVariantAxis = !!variantAxisAttr;
  const { searchResults: attributeSetOpts, searchLoading: attributeSetLoading } = useGetAttributeSetList({ perPage: 200 });
  const attributeSetAc = {
    size: 'small',
    options: attributeSetOpts,
    loading: attributeSetLoading,
    getOptionLabel: (o) => o?.name ?? '',
    isOptionEqualToValue: (a, b) => (a?._id ?? a?.id) === (b?._id ?? b?.id),
    value: attributeSetOpts.find((o) => (o._id ?? o.id) === data.attribute_set_id) ?? null,
    onChange: (_, v) => set('attribute_set_id', v ? (v._id ?? v.id) : null),
    renderInput: (params) => <TextField {...params} size="small" placeholder="Chọn nhóm thuộc tính…" />,
  };

  return (
    <>
      <StepHero
        icon={SellOutlined}
        eyebrow="Bước 2 / 4"
        title="Giá bán, khuyến mãi & biến thể"
        description="Chọn cách tính giá, nhập giá bán & sale, cấu hình biến thể size/phiên bản."
      />

      <Grid container spacing={2}>
        {/* --- ROW 0: Nhóm thuộc tính - chọn ở Step 2 vì nó drive variants + specs --- */}
        <Grid size={12}>
          <Section
            icon={TuneOutlined}
            title="Nhóm thuộc tính"
            description="Quyết định các attribute + trục biến thể của SP. Thay đổi sẽ reset biến thể."
          >
            <Field
              label="CHỌN NHÓM THUỘC TÍNH"
              required
              tooltip="Gợi ý: nhóm này đã prefill từ dòng hàng ở Bước 1. Có thể override."
              helper={data.product_line_id ? 'Đã prefill từ dòng hàng. Có thể override.' : 'Chưa chọn dòng hàng - chọn tay.'}
            >
              <Autocomplete {...attributeSetAc} />
            </Field>
          </Section>
        </Grid>

        {/* --- ROW 1: Cách tính giá - full-width, 2 big option tiles --- */}
        <Grid size={12}>
          <Section
            icon={SellOutlined}
            title="Cách tính giá"
            description="Quyết định cách hệ thống xác định giá bán. Đổi sẽ reset bảng biến thể."
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1.5,
              }}
            >
              {PRICING_MODES.map((m) => {
                const active = data.pricing_mode === m.value;
                return (
                  <Box
                    key={m.value}
                    onClick={() => set('pricing_mode', m.value)}
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      border: active ? 2 : 1,
                      borderRadius: 1,
                      px: 2,
                      py: 1.75,
                      borderColor: active ? 'primary.main' : 'divider',
                      bgcolor: active ? 'primary.lighter' : 'common.white',
                      transition: 'all .15s ease',
                      '&:hover': {
                        borderColor: active ? 'primary.main' : 'text.disabled',
                        bgcolor: active ? 'primary.lighter' : 'grey.50',
                      },
                    }}
                  >
                    {/* Check mark khi active */}
                    {active && (
                      <Box sx={{
                        position: 'absolute', top: 10, right: 10,
                        width: 22, height: 22, borderRadius: '50%',
                        bgcolor: 'primary.main', color: 'common.white',
                        display: 'grid', placeItems: 'center',
                      }}>
                        <Iconify icon="solar:check-circle-bold" width={16} />
                      </Box>
                    )}
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 44, height: 44, borderRadius: 1,
                          bgcolor: active ? 'primary.main' : 'grey.100',
                          color: active ? 'common.white' : 'text.secondary',
                          display: 'grid', placeItems: 'center', flexShrink: 0,
                        }}
                      >
                        <Iconify icon={m.icon} width={22} />
                      </Box>
                      <Box sx={{ minWidth: 0, pr: 3 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: active ? 'primary.dark' : 'text.primary', mb: 0.25 }}>
                          {m.label}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.5 }}>
                          {m.help}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Section>
        </Grid>

        {/* --- ROW 2 - LEFT: Giá SP mặc định --- */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Section
            icon={PaidOutlined}
            title="Giá SP mặc định"
            description="Dùng khi SP không có biến thể, hoặc hiển thị trên card khi chưa chọn size."
            badge={
              hasSale && (
                <Chip
                  label={`-${discountPct}%`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10.5,
                    fontWeight: 700,
                    bgcolor: 'error.main',
                    color: 'common.white',
                  }}
                />
              )
            }
          >
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Field label="GIÁ BÁN" required helper="Giá chính hiển thị ở card SP">
                    <MoneyInput
                      value={data.sale_price}
                      onChange={(e) => set('sale_price', e.target.value)}
                      fullWidth size="small"
                      placeholder="4.990.000"
                      sx={{
                        '& input': {
                          fontWeight: 700,
                          color: hasSale ? 'error.main' : 'text.primary',
                        },
                      }}
                    />
                  </Field>
                </Grid>
                <Grid size={6}>
                  <Field label="GIÁ GỐC" helper="Giá gạch ngang khi có sale">
                    <MoneyInput
                      value={data.compare_at_price}
                      onChange={(e) => set('compare_at_price', e.target.value)}
                      fullWidth size="small"
                      placeholder="5.900.000"
                      sx={{
                        '& input': {
                          textDecoration: hasSale ? 'line-through' : 'none',
                          color: 'text.secondary',
                        },
                      }}
                    />
                  </Field>
                </Grid>
              </Grid>

              {/* Mini preview chip - hiển thị giá đang set */}
              {(data.sale_price || data.compare_at_price) && (
                <Box
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    px: 1.5,
                    py: 1,
                    bgcolor: 'grey.50',
                  }}
                >
                  <Typography sx={{ fontSize: 10, color: 'text.disabled', fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', mb: 0.5 }}>
                    Preview trên card
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="baseline">
                    <Typography sx={{ fontSize: 16, fontWeight: 800, color: hasSale ? 'error.main' : landingTokens.GOLD_DARK }}>
                      {fCurrency(Number(data.sale_price) || Number(data.compare_at_price) || 0)}
                    </Typography>
                    {hasSale && (
                      <Typography sx={{ fontSize: 12, color: 'text.disabled', textDecoration: 'line-through' }}>
                        {fCurrency(Number(data.compare_at_price))}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Section>
        </Grid>

        {/* --- ROW 2 - RIGHT: Stack cards phụ cho giá --- */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            {/* Card A: Lịch khuyến mãi */}
            <Section
              icon={EventAvailableOutlined}
              title="Lịch khuyến mãi"
              description="Nếu có giá gốc, sale tự kích hoạt trong khoảng thời gian đã cấu hình."
            >
              <Stack spacing={2}>
                <Field label="BẮT ĐẦU SALE" helper="Để trống = áp dụng ngay">
                  <DateTimePicker
                    value={data.sale_starts_at ? dayjs(data.sale_starts_at) : null}
                    onChange={(v) => set('sale_starts_at', v ? dayjs(v).toISOString() : '')}
                    format="DD/MM/YYYY HH:mm"
                    slotProps={{
                      textField: { fullWidth: true, size: 'small', placeholder: 'dd/mm/yyyy hh:mm' },
                      actionBar: { actions: ['clear', 'today', 'accept'] },
                    }}
                  />
                </Field>
                <Field label="KẾT THÚC SALE" helper="Để trống = không giới hạn">
                  <DateTimePicker
                    value={data.sale_ends_at ? dayjs(data.sale_ends_at) : null}
                    onChange={(v) => set('sale_ends_at', v ? dayjs(v).toISOString() : '')}
                    format="DD/MM/YYYY HH:mm"
                    minDateTime={data.sale_starts_at ? dayjs(data.sale_starts_at) : undefined}
                    slotProps={{
                      textField: { fullWidth: true, size: 'small', placeholder: 'dd/mm/yyyy hh:mm' },
                      actionBar: { actions: ['clear', 'today', 'accept'] },
                    }}
                  />
                </Field>
              </Stack>
            </Section>

            {/* Card B: Giới hạn mua (compact) */}
            <Section
              icon={ShoppingCartOutlined}
              title="Giới hạn mua"
              description="Chặn mua gom + áp dụng cho từng đơn / khách hàng."
            >
              <Grid container spacing={1.5}>
                <Grid size={4}>
                  <Field label="MIN / ĐƠN" helper="Mặc định 1">
                    <TextField
                      type="number"
                      value={data.min_per_order ?? ''}
                      onChange={(e) => set('min_per_order', e.target.value)}
                      fullWidth size="small"
                      placeholder="1"
                    />
                  </Field>
                </Grid>
                <Grid size={4}>
                  <Field label="MAX / ĐƠN" helper="Chặn mua gom">
                    <TextField
                      type="number"
                      value={data.max_per_order ?? ''}
                      onChange={(e) => set('max_per_order', e.target.value)}
                      fullWidth size="small"
                      placeholder="5"
                    />
                  </Field>
                </Grid>
                <Grid size={4}>
                  <Field label="MAX / KHÁCH" helper="Vòng đời KH">
                    <TextField
                      type="number"
                      value={data.max_per_customer ?? ''}
                      onChange={(e) => set('max_per_customer', e.target.value)}
                      fullWidth size="small"
                      placeholder="10"
                    />
                  </Field>
                </Grid>
              </Grid>
            </Section>

            {/* Card C: Tóm tắt khuyến mãi (chỉ hiện khi có sale) */}
            {hasSale && (
              <Section
                icon={LocalOfferOutlined}
                title="Tóm tắt khuyến mãi"
                description="Chênh lệch giữa giá gốc & giá bán."
                badge={
                  <Chip
                    size="small"
                    label={`-${discountPct}%`}
                    sx={{
                      height: 20, fontSize: 10.5, fontWeight: 800,
                      bgcolor: 'error.main', color: 'common.white',
                    }}
                  />
                }
              >
                <Stack spacing={1.25}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>Giá gốc</Typography>
                    <Typography sx={{ fontSize: 12, textDecoration: 'line-through', color: 'text.disabled' }}>
                      {fCurrency(Number(data.compare_at_price) || 0)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>Giá sau sale</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 800, color: 'error.main' }}>
                      {fCurrency(Number(data.sale_price) || 0)}
                    </Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>Tiết kiệm</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'success.dark' }}>
                      {fCurrency(Number(data.compare_at_price) - Number(data.sale_price))}
                    </Typography>
                  </Stack>
                </Stack>
              </Section>
            )}
          </Stack>
        </Grid>

        {/* --- CARD 3: Gold rate formula (conditional) --- */}
        {data.pricing_mode === 'by_gold_rate' && (
          <Grid size={12}>
            <GoldRateFormulaCard data={data} set={set} setSnack={setSnack} />
          </Grid>
        )}

        {/* --- CARD 5: Bảng biến thể (highlight - core card) --- */}
        <Grid size={12}>
          <Section
            icon={ScaleOutlined}
            title="Bảng biến thể"
            description="Mỗi size = 1 dòng SKU riêng. Có giá / tồn / trạng thái độc lập."
            badge={
              data.variants.length > 0 && (
                <Chip
                  label={`${data.variants.length} SKU`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10.5,
                    fontWeight: 700,
                    bgcolor: 'common.white',
                    color: 'text.primary',
                    border: 1,
                    borderColor: 'divider',
                  }}
                />
              )
            }
          >
            <VariantMatrix
              variantAttrs={variantAttrs}
              selection={data.variant_option_selection}
              onSelectionChange={(s) => set('variant_option_selection', s)}
              variants={data.variants}
              onVariantsChange={(v) => set('variants', v)}
              skuPrefix={data.display_code || data.code || ''}
            />
          </Section>
        </Grid>

        {/* --- CARD 6: Ghi chú hiển thị + Volume discount hint --- */}
        <Grid size={12}>
          <Section
            icon={InfoOutlined}
            title="Ghi chú hiển thị"
            description="Dùng chú thích nhỏ hiện kèm giá trên landing + card SP."
          >
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field label="GHI CHÚ GIÁ" helper="Hiện dưới giá trên trang chi tiết">
                    <TextField
                      value={data.price_note}
                      onChange={(e) => set('price_note', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Giá thay đổi theo trọng lượng vàng và đá"
                    />
                  </Field>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field label="GHI CHÚ CARD" helper="Dòng chữ nhỏ xám trên card SP">
                    <TextField
                      value={data.card_note}
                      onChange={(e) => set('card_note', e.target.value)}
                      fullWidth size="small"
                      placeholder="Vd: Chưa kèm Vàng / Lắc"
                    />
                  </Field>
                </Grid>
              </Grid>

              <Alert
                severity="info"
                icon={<Iconify icon="solar:info-circle-linear" width={16} />}
                sx={{ borderRadius: 1, fontSize: 11.5, '& .MuiAlert-message': { py: 0.5 } }}
              >
                <strong>Volume discount:</strong> dùng module <b>Promotion</b> để tạo rule "mua 2 giảm 5%" áp lên SP này.
              </Alert>
            </Stack>
          </Section>
        </Grid>
      </Grid>
    </>
  );
}

// Gold rate formula card - tách riêng với preview tính thử.
function GoldRateFormulaCard({ data, set, setSnack }) {
  const labor = Number(data.pricing?.labor_cost) || 0;
  const stone = Number(data.pricing?.stone_cost) || 0;
  const markup = Number(data.pricing?.markup_pct) || 0;
  // shortcut: giá vàng cố định 7.500.000đ/chỉ 24K - upgrade khi có GoldRate API
  const GOLD_RATE_PER_CHI = 7_500_000;
  const base = GOLD_RATE_PER_CHI + labor + stone;
  const previewPrice = Math.round(base * (1 + markup / 100));

  return (
    <Section
      icon={CalculateOutlined}
      title="Công thức tính giá theo vàng"
      description="Giá = Trọng lượng vàng × Giá vàng hiện tại + Tiền công + Tiền đá + % lãi."
      badge={
        <Chip
          icon={<Iconify icon="solar:crown-linear" width={11} sx={{ ml: 0.5 }} />}
          label="Vàng 7.5tr / chỉ"
          size="small"
          sx={{
            height: 20,
            fontSize: 10.5,
            fontWeight: 600,
            bgcolor: 'warning.lighter',
            color: 'warning.dark',
            border: 'none',
            '& .MuiChip-icon': { color: 'warning.dark' },
          }}
        />
      }
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Field label="TIỀN CÔNG" helper="VND/SP">
                <MoneyInput
                  value={data.pricing.labor_cost}
                  onChange={(e) => set('pricing', { ...data.pricing, labor_cost: e.target.value })}
                  fullWidth size="small"
                  placeholder="500.000"
                />
              </Field>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Field label="TIỀN ĐÁ" helper="VND/SP">
                <MoneyInput
                  value={data.pricing.stone_cost}
                  onChange={(e) => set('pricing', { ...data.pricing, stone_cost: e.target.value })}
                  fullWidth size="small"
                  placeholder="200.000"
                />
              </Field>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Field label="% LÃI" helper="Markup trên giá vốn">
                <DecimalInput
                  value={data.pricing.markup_pct}
                  onChange={(e) => set('pricing', { ...data.pricing, markup_pct: e.target.value })}
                  unit="%"
                  fullWidth size="small"
                  placeholder="15"
                />
              </Field>
            </Grid>
          </Grid>
        </Grid>

        {/* Preview card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              border: 1,
              borderColor: 'warning.light',
              borderRadius: 1,
              bgcolor: 'warning.lighter',
              p: 1.5,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 10, color: 'warning.dark', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                Giá dự kiến (1 chỉ vàng)
              </Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: 'warning.dark', mt: 0.5, fontVariantNumeric: 'tabular-nums' }}>
                {fCurrency(previewPrice)}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5, color: 'warning.dark', opacity: 0.8 }}>
                <Typography sx={{ fontSize: 10 }}>
                  = {fCurrency(GOLD_RATE_PER_CHI)} + {fCurrency(labor)} + {fCurrency(stone)}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 10, color: 'warning.dark', opacity: 0.7 }}>
                × (1 + {markup}%)
              </Typography>
            </Box>
            <Button
              size="small"
              variant="contained"
              color="warning"
              startIcon={<CalculateOutlined sx={{ fontSize: 14 }} />}
              onClick={() => setSnack({
                severity: 'info',
                message: `Giá dự kiến: ${fCurrency(previewPrice)} (giả định vàng 7.5tr/chỉ, 1 chỉ)`,
              })}
              sx={{ boxShadow: 'none', mt: 1 }}
            >
              Áp giá cho tất cả biến thể
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Section>
  );
}

function Step3Content({ data, set, specAttrs = [], setDetailLoading = false }) {
  const setId = data.attribute_set_id;
  const { searchResults: sizeGuideOpts, searchLoading: sizeGuideLoading } = useGetSizeGuideList({ perPage: 200 });
  const { searchResults: faqOpts, searchLoading: faqLoading } = useGetFaqList({ perPage: 500 });

  // Certificates repeater
  const certs = data.certificates ?? [];
  const setCerts = (next) => set('certificates', next);
  const addCert = () => setCerts([...certs, { name: '', number: '', image_file_id: null, image_url: '' }]);
  const updateCert = (i, patch) => setCerts(certs.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const removeCert = (i) => setCerts(certs.filter((_, idx) => idx !== i));

  const sizeGuideSingleAc = {
    size: 'small',
    options: sizeGuideOpts,
    loading: sizeGuideLoading,
    getOptionLabel: (o) => o?.name ?? '',
    isOptionEqualToValue: (a, b) => (a?._id ?? a?.id) === (b?._id ?? b?.id),
    value: sizeGuideOpts.find((o) => (o._id ?? o.id) === data.size_guide_id) ?? null,
    onChange: (_, v) => set('size_guide_id', v ? (v._id ?? v.id) : null),
    renderInput: (params) => (
      <TextField {...params} size="small" placeholder="Chọn hướng dẫn size…" />
    ),
  };

  return (
    <>
      <StepHero
        icon={PhotoLibraryOutlined}
        eyebrow="Bước 3 / 4"
        title="Media, mô tả & thông số kỹ thuật"
        description="Phần nội dung quan trọng nhất để chốt đơn. Ảnh chất lượng + thông số đầy đủ = tỷ lệ chuyển đổi cao hơn."
      />
      <Grid container spacing={2}>
      <Grid size={12}>
        <Section
          icon={PhotoLibraryOutlined}
          title="Hình ảnh & video"
          description="Ảnh chính hiện trên card SP. Ảnh phụ hiện trong gallery trang chi tiết."
        >
          <Stack spacing={2}>
            {/* shortcut: UploadField/Gallery value = File|string URL; save flow sẽ POST File → file_id */}
            <UploadField
              label="ẢNH CHÍNH (hiện trên card SP, thumbnail, kết quả tìm kiếm)"
              required
              value={data._primary_pending ?? data.primary_image_url ?? null}
              onChange={(v) => setData((d) => ({
                ...d,
                _primary_pending: v instanceof File ? v : null,
                primary_image_url: typeof v === 'string' ? v : (v === null ? '' : d.primary_image_url),
                primary_image_id: v === null ? null : d.primary_image_id,
              }))}
            />
            <UploadGallery
              label="ẢNH PHỤ - GALLERY (hiện trên trang chi tiết)"
              value={data._gallery_mixed ?? data.gallery_image_urls ?? []}
              onChange={(arr) => setData((d) => ({
                ...d,
                _gallery_mixed: arr,
                // đồng bộ ids/urls: cái nào là string thì giữ url, File thì chờ upload
                gallery_image_urls: arr.filter((x) => typeof x === 'string'),
                gallery_image_ids: arr
                  .map((x, i) => (typeof x === 'string' ? d.gallery_image_ids?.[i] : null))
                  .filter(Boolean),
              }))}
              maxFiles={20}
            />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field label="VIDEO YOUTUBE / TIKTOK" helper="URL embed">
                <TextField
                  value={data.video_url ?? ''}
                  onChange={(e) => set('video_url', e.target.value)}
                  fullWidth size="small"
                  placeholder="https://youtube.com/watch?v=…"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="solar:videocamera-record-linear" width={14} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Field>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field label="ẢNH 360° / AR MODEL" helper="URL file glb/usdz hoặc link 360°">
                <TextField
                  value={data.model_3d_url ?? ''}
                  onChange={(e) => set('model_3d_url', e.target.value)}
                  fullWidth size="small"
                  placeholder="https://cdn.pnj.com.vn/model.glb"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="solar:cube-linear" width={14} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Field>
            </Grid>
          </Grid>
        </Section>
      </Grid>

      <Grid size={12}>
        <Section
          icon={TuneOutlined}
          title="Thông số kỹ thuật"
          description="Các attribute không phải biến thể (biến thể đã nằm ở Bước 2)."
        >
          {!setId ? (
            <Box
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                bgcolor: 'grey.50',
              }}
            >
              <TuneOutlined sx={{ fontSize: 28, color: 'text.disabled', mb: 1 }} />
              <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mb: 0.5 }}>
                Chưa chọn nhóm thuộc tính.
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                Quay lại Bước 1 → chọn "Nhóm thuộc tính" để field động hiện ra.
              </Typography>
            </Box>
          ) : setDetailLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={18} />
            </Box>
          ) : specAttrs.length === 0 ? (
            <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1, p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
              <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                Nhóm thuộc tính này không có thông số (tất cả đã là biến thể).
              </Typography>
            </Box>
          ) : (
            <AttributeFields
              attributes={specAttrs}
              value={data.attrs}
              onChange={(v) => set('attrs', v)}
            />
          )}
        </Section>
      </Grid>

      <Grid size={12}>
        <Section icon={ArticleOutlined} title="Mô tả hiển thị" description="Mô tả ngắn hiện ở card. Mô tả chi tiết hiện ở trang chi tiết.">
          <Stack spacing={2}>
            <Field label="MÔ TẢ NGẮN" required helper="1-2 câu súc tích - ≤ 160 ký tự">
              <TextField
                value={data.short_description}
                onChange={(e) => set('short_description', e.target.value)}
                fullWidth multiline rows={2} size="small"
                placeholder="Vd: Vòng tay vàng 10K khắc hình Disney Princess - kèm hộp quà PNJ."
              />
            </Field>
            <Field label="MÔ TẢ CHI TIẾT">
              <Editor
                fullItem
                value={data.description_html}
                onChange={(v) => set('description_html', v)}
                placeholder="Mô tả chi tiết sản phẩm - tiêu đề, đoạn, bullet, bảng thông số, ảnh minh hoạ…"
                sx={{ maxHeight: 520 }}
              />
            </Field>
          </Stack>
        </Section>
      </Grid>

      {/* ======== NÂNG CAO: cá nhân hoá + vận chuyển + hậu mãi (collapsed) ======== */}
      <Grid size={12}>
        <Accordion disableGutters sx={advancedAccordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={{ px: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EditNoteOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                Nâng cao · Cá nhân hoá · Vận chuyển · Hậu mãi
              </Typography>
              <Chip label="Tuỳ chọn" size="small" sx={{ height: 20, fontSize: 10.5, bgcolor: 'grey.100' }} />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
      <Section
          icon={EditNoteOutlined}
          title="Cá nhân hoá"
          description="Khắc tên, khắc ngày, thiết kế riêng theo yêu cầu khách."
          action={
            <Switch
              size="small"
              checked={!!data.personalization?.enabled}
              onChange={(e) => set('personalization', { ...(data.personalization ?? {}), enabled: e.target.checked })}
            />
          }
        >
          {data.personalization?.enabled ? (
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Field label="PHÍ KHẮC" helper="0 = miễn phí">
                    <MoneyInput
                      value={data.personalization?.fee ?? ''}
                      onChange={(e) => set('personalization', { ...(data.personalization ?? {}), fee: e.target.value })}
                      fullWidth size="small"
                      placeholder="200.000"
                    />
                  </Field>
                </Grid>
                <Grid size={6}>
                  <Field label="SỐ KÝ TỰ TỐI ĐA">
                    <TextField
                      type="number"
                      value={data.personalization?.max_chars ?? ''}
                      onChange={(e) => set('personalization', { ...(data.personalization ?? {}), max_chars: e.target.value })}
                      fullWidth size="small"
                      placeholder="15"
                    />
                  </Field>
                </Grid>
              </Grid>
              <Field label="KÝ TỰ CHO PHÉP" helper="VD: A-Z, 0-9, ♥, ★">
                <TextField
                  value={data.personalization?.allowed_chars ?? ''}
                  onChange={(e) => set('personalization', { ...(data.personalization ?? {}), allowed_chars: e.target.value })}
                  fullWidth size="small"
                  placeholder="A-Z, 0-9, ., ♥"
                />
              </Field>
            </Stack>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.disabled' }}>
              <EditNoteOutlined sx={{ fontSize: 28, mb: 1 }} />
              <Typography sx={{ fontSize: 12 }}>Bật switch để cho phép khách yêu cầu khắc chữ / cá nhân hoá.</Typography>
            </Box>
          )}
        </Section>
      </Grid>

      {/* ======== Vận chuyển & kho ======== */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Section
          icon={LocalShippingOutlined}
          title="Vận chuyển & xuất hoá đơn"
          description="Trọng lượng kiện đóng gói, phân loại ship, HS code cho xuất hoá đơn."
        >
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Field label="TRỌNG LƯỢNG KIỆN (G)" helper="Dùng tính cước ship">
                  <TextField
                    type="number"
                    value={data.shipping?.package_weight_g ?? ''}
                    onChange={(e) => set('shipping', { ...(data.shipping ?? {}), package_weight_g: e.target.value })}
                    fullWidth size="small"
                    placeholder="150"
                    InputProps={{ endAdornment: <InputAdornment position="end">g</InputAdornment> }}
                  />
                </Field>
              </Grid>
              <Grid size={6}>
                <Field label="MÃ HS" helper="Thuế xuất nhập khẩu">
                  <TextField
                    value={data.shipping?.hs_code ?? ''}
                    onChange={(e) => set('shipping', { ...(data.shipping ?? {}), hs_code: e.target.value })}
                    fullWidth size="small"
                    placeholder="7113.19.10"
                    sx={{ '& input': { fontFamily: 'monospace' } }}
                  />
                </Field>
              </Grid>
            </Grid>
            <Field label="PHÂN LOẠI VẬN CHUYỂN" tooltip="Hàng giá trị cao cần bảo hiểm riêng.">
              <TextField
                select value={data.shipping?.shipping_class ?? 'standard'}
                onChange={(e) => set('shipping', { ...(data.shipping ?? {}), shipping_class: e.target.value })}
                fullWidth size="small"
              >
                {SHIPPING_CLASSES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </TextField>
            </Field>
          </Stack>
        </Section>
      </Grid>

      {/* ======== Hậu mãi ======== */}
      <Grid size={12}>
        <Section icon={WorkspacePremiumOutlined} title="Hậu mãi & chứng nhận" description="Bảo hành, size guide, FAQ, giấy tờ đi kèm.">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Field label="CHÍNH SÁCH HẬU MÃI" helper="ID policy từ module Chính sách bán hàng">
                <TextField
                  value={data.after_sales_policy_id ?? ''}
                  onChange={(e) => set('after_sales_policy_id', e.target.value)}
                  fullWidth size="small"
                  placeholder="ID policy"
                />
              </Field>
            </Grid>
            {data.flags?.requires_size && (
              <Grid size={{ xs: 12, md: 3 }}>
                <Field label="HƯỚNG DẪN SIZE" helper="Hiện khi bật 'Bắt buộc chọn size' ở Bước 4.">
                  <Autocomplete {...sizeGuideSingleAc} />
                </Field>
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <Field label="FAQ ÁP DỤNG" helper="Chọn các câu hỏi thường gặp hiện trên trang chi tiết.">
                <Autocomplete
                  multiple
                  size="small"
                  loading={faqLoading}
                  options={faqOpts}
                  value={faqOpts.filter((o) => (data.faq_ids ?? []).includes(o._id ?? o.id))}
                  getOptionLabel={(o) => o?.question ?? o?.name ?? ''}
                  isOptionEqualToValue={(a, b) => (a?._id ?? a?.id) === (b?._id ?? b?.id)}
                  onChange={(_, v) => set('faq_ids', v.map((x) => x._id ?? x.id))}
                  renderInput={(params) => <TextField {...params} size="small" placeholder="Chọn FAQ…" />}
                  renderTags={(tags, getTagProps) =>
                    tags.map((t, i) => (
                      <Chip
                        key={t._id ?? t.id}
                        size="small"
                        label={(t.question ?? t.name ?? '').slice(0, 40)}
                        {...getTagProps({ index: i })}
                      />
                    ))
                  }
                />
              </Field>
            </Grid>

            {/* --- Giấy tờ đi kèm (repeater có ảnh) --- */}
            <Grid size={12}>
              <Field
                label="GIẤY TỜ ĐI KÈM"
                helper="GIA cert, giấy bảo đảm PNJ, thẻ kiểm định - mỗi giấy có ảnh scan."
              >
                <Stack spacing={1}>
                  {certs.length === 0 && (
                    <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1, p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                      <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>Chưa có giấy tờ nào.</Typography>
                    </Box>
                  )}
                  {certs.map((cert, i) => {
                    // Migration: nếu cert cũ là string, treat như number
                    const safeCert = typeof cert === 'string' ? { name: '', number: cert, image_file_id: null, image_url: '' } : cert;
                    return (
                      <Stack
                        key={i}
                        spacing={1.25}
                        sx={{
                          p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1,
                          bgcolor: 'background.paper',
                        }}
                      >
                        {/* Dòng 1: text fields + xoá */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                          <TextField
                            size="small"
                            label="Loại giấy"
                            value={safeCert.name}
                            onChange={(e) => updateCert(i, { name: e.target.value })}
                            placeholder="GIA / PNJ-Lab / Giấy bảo đảm"
                            sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}
                          />
                          <TextField
                            size="small"
                            label="Mã số"
                            value={safeCert.number}
                            onChange={(e) => updateCert(i, { number: e.target.value })}
                            placeholder="GIA-1234567"
                            sx={{ flex: 1, width: { xs: '100%', sm: 'auto' }, '& input': { fontFamily: 'ui-monospace, monospace' } }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeCert(i)}
                            sx={{ color: 'error.main', alignSelf: { xs: 'flex-end', sm: 'center' } }}
                            title="Xoá giấy tờ này"
                          >
                            <Iconify icon="solar:trash-bin-trash-linear" width={16} />
                          </IconButton>
                        </Stack>

                        {/* Dòng 2: upload trọn chiều ngang */}
                        {/* shortcut: value=File|URL; save flow sẽ upload File → file_id */}
                        <UploadField
                          label="ẢNH SCAN / FILE GIẤY"
                          value={safeCert._pending ?? safeCert.image_url ?? null}
                          onChange={(v) => updateCert(i, {
                            _pending: v instanceof File ? v : null,
                            image_url: typeof v === 'string' ? v : (v === null ? '' : safeCert.image_url),
                            image_file_id: v === null ? null : safeCert.image_file_id,
                          })}
                          accept={{ 'image/*': [], 'application/pdf': [] }}
                        />
                      </Stack>
                    );
                  })}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Iconify icon="solar:add-circle-linear" width={14} />}
                    onClick={addCert}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Thêm giấy tờ
                  </Button>
                </Stack>
              </Field>
            </Grid>
          </Grid>
        </Section>
      </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
    </>
  );
}

function Step4Display({ data, set, setFlag }) {
  const activeFlagsCount = Object.values(data.flags).filter(Boolean).length;
  return (
    <>
      <StepHero
        icon={FlagOutlined}
        eyebrow="Bước 4 / 4"
        title="Nhãn hiển thị, ưu đãi & SEO"
        description="Bước cuối - bật nhãn đặc biệt, viết ưu đãi hiện trên trang chi tiết, tối ưu SEO để tăng traffic organic."
      />

      <Grid container spacing={2}>
      {/* ======== Nhãn ưu đãi (promo badges) ======== */}
      <Grid size={12}>
        <Section
          icon={LocalOfferOutlined}
          title="Nhãn khuyến mãi (Promo badges)"
          description="Dòng ưu đãi hiện trong ô 'ƯU ĐÃI' vàng ở trang chi tiết. Click preset hoặc nhập mới."
        >
          <PromoBadgeEditor
            value={data.promo_badges ?? []}
            onChange={(v) => set('promo_badges', v)}
          />
        </Section>
      </Grid>

      {FLAGS_GROUPS.map((g) => (
        <Grid key={g.title} size={{ xs: 12, md: 4 }}>
          <Section
            icon={g.icon}
            title={g.title}
            description={`${g.items.filter((i) => data.flags[i.k]).length}/${g.items.length} đang bật`}
          >
            <Stack spacing={1.25} divider={<Divider flexItem />}>
              {g.items.map((item) => (
                <Stack
                  key={item.k}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1.5}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 10.5, color: 'text.secondary', lineHeight: 1.4 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                  <Switch
                    size="small"
                    checked={!!data.flags[item.k]}
                    onChange={(e) => setFlag(item.k, e.target.checked)}
                  />
                </Stack>
              ))}
            </Stack>
          </Section>
        </Grid>
      ))}

      <Grid size={{ xs: 12, md: 6 }}>
        <Section icon={LinkOutlined} title="Sản phẩm tương tự" description="Hiện ở khối 'Có thể bạn thích'. Để trống = hệ thống tự gợi ý.">
          <TextField
            value={(data.related_product_ids ?? []).join(', ')}
            onChange={(e) => set('related_product_ids', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
            placeholder="Nhập ID cách nhau bằng dấu phẩy..."
            fullWidth size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-linear" width={16} />
                </InputAdornment>
              ),
            }}
          />
        </Section>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Section icon={LocalOfferOutlined} title="Sản phẩm theo bộ (combo)" description="Combo cưới · bộ mẹ-con · bộ vợ-chồng.">
          <TextField
            value={(data.set_product_ids ?? []).join(', ')}
            onChange={(e) => set('set_product_ids', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
            placeholder="Nhập ID cách nhau bằng dấu phẩy..."
            fullWidth size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-linear" width={16} />
                </InputAdornment>
              ),
            }}
          />
        </Section>
      </Grid>

      {/* ======== Giới hạn khu vực bán ======== */}
      <Grid size={12}>
        <Section
          icon={LocalShippingOutlined}
          title="Giới hạn khu vực bán"
          description="SP chỉ bán tại / không bán tại tỉnh thành nào. Để trống = bán toàn quốc."
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field label="CHỈ BÁN TẠI" helper="Nhiều tỉnh cách nhau dấu phẩy (HCM, HN, DN…)">
                <TextField
                  value={(data.region_restrictions?.included ?? []).join(', ')}
                  onChange={(e) => set('region_restrictions', {
                    ...(data.region_restrictions ?? {}),
                    included: e.target.value.split(',').map((x) => x.trim().toUpperCase()).filter(Boolean),
                  })}
                  fullWidth size="small"
                  placeholder="HCM, HN, DN"
                  sx={{ '& input': { fontFamily: 'monospace' } }}
                />
              </Field>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field label="KHÔNG BÁN TẠI" helper="Loại trừ các tỉnh (ưu tiên hơn 'chỉ bán tại')">
                <TextField
                  value={(data.region_restrictions?.excluded ?? []).join(', ')}
                  onChange={(e) => set('region_restrictions', {
                    ...(data.region_restrictions ?? {}),
                    excluded: e.target.value.split(',').map((x) => x.trim().toUpperCase()).filter(Boolean),
                  })}
                  fullWidth size="small"
                  placeholder="CTH, AGI"
                  sx={{ '& input': { fontFamily: 'monospace' } }}
                />
              </Field>
            </Grid>
          </Grid>
        </Section>
      </Grid>

      <Grid size={12}>
        <Section
          icon={LanguageOutlined}
          title="SEO & chia sẻ mạng xã hội"
          description="Để trống title/description sẽ auto-fill từ tên + mô tả ngắn."
        >
          <SeoPanel
            value={data.seo}
            onChange={(v) => set('seo', v)}
            sx={{ boxShadow: 'none', border: 0, '& .MuiCardContent-root': { p: 0 } }}
          />
        </Section>
      </Grid>
    </Grid>
    </>
  );
}

// ----------------------------------------------------------------------
// Main

export function ProductForm({ initial = {}, mode = 'new' }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [data, setData] = useState({
    // Step 1 - Nhận dạng & taxonomy
    name: '', code: '', display_code: '', slug: '', barcode: '',
    type: 'jewelry', status: 'draft',
    category_id: null, category_ids_extra: [],
    brand_id: null, product_line_id: null, collection_ids: [],
    attribute_set_id: null,
    tags: [],
    audiences: ['female'], age_group: ['adult'],
    visibility_channels: ['website', 'app', 'store'],

    // Step 2 - Giá & biến thể
    variants: [],
    variant_option_selection: {},
    pricing_mode: 'fixed', pricing: {}, price_note: '', card_note: '',
    compare_at_price: '', sale_price: '',
    sale_starts_at: '', sale_ends_at: '',
    min_per_order: '', max_per_order: '', max_per_customer: '',

    // Step 3 - Media, mô tả, hậu mãi (specs chuyển sang `attrs` theo attribute-set)
    attrs: {},
    primary_image_id: null, primary_image_url: '',
    gallery_image_ids: [], gallery_image_urls: [],
    media_file_ids: [], // DEPRECATED - giữ tạm để không break payload cũ
    video_url: '', model_3d_url: '',
    short_description: '', description_html: '',
    personalization: { enabled: false, fee: '', max_chars: 15, allowed_chars: 'A-Z, 0-9, ♥' },
    shipping: { package_weight_g: '', shipping_class: 'standard', hs_code: '' },
    after_sales_policy_id: null, faq_ids: [], size_guide_id: null,
    certificates: [],

    // Step 4 - Hiển thị & SEO
    related_product_ids: [], set_product_ids: [],
    promo_badges: [],
    region_restrictions: { included: [], excluded: [] },
    flags: {
      is_new: false, is_best_seller: false, is_featured: false, fast_delivery_3h: true,
      installment_0: false, online_only: false, store_order_enabled: true, requires_size: true,
    },
    seo: {},
    ...initial,
  });
  const [cancelOpen, setCancelOpen] = useState(false);
  const [snack, setSnack] = useState(null);

  const set = (k, v) => { setData((d) => ({ ...d, [k]: v })); setDirty(true); };
  const setFlag = (k, v) => set('flags', { ...data.flags, [k]: v });

  // Khi tắt requires_size → xoá size_guide_id đã chọn.
  useEffect(() => {
    if (!data.flags?.requires_size && data.size_guide_id) {
      setData((d) => ({ ...d, size_guide_id: null }));
    }
  }, [data.flags?.requires_size, data.size_guide_id]);

  // Cascade: khi đổi product_line_id → prefill attribute_set_id từ line.default_attribute_set_id.
  const { searchResults: productLineOptsTop } = useGetProductLineList({ perPage: 200 });
  useEffect(() => {
    if (!data.product_line_id) return;
    if (data.attribute_set_id) return;
    const line = productLineOptsTop.find((l) => (l._id ?? l.id) === data.product_line_id);
    const defSet = line?.attribute_set_id ?? line?.default_attribute_set_id;
    if (defSet) setData((d) => ({ ...d, attribute_set_id: defSet }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.product_line_id, productLineOptsTop.length]);

  // Fetch attribute-set detail 1 lần, share cho Step 2 & Step 3.
  const [setDetail, setSetDetail] = useState(null);
  const [setDetailLoading, setSetDetailLoading] = useState(false);
  useEffect(() => {
    if (!data.attribute_set_id) { setSetDetail(null); return; }
    let cancelled = false;
    setSetDetailLoading(true);
    actionGetAttributeSetDetail(data.attribute_set_id)
      .then((res) => { if (!cancelled) setSetDetail(res?.data?.data ?? res?.data ?? null); })
      .catch(() => { if (!cancelled) setSetDetail(null); })
      .finally(() => { if (!cancelled) setSetDetailLoading(false); });
    return () => { cancelled = true; };
  }, [data.attribute_set_id]);

  // Chia attributes: is_variant → Step 2 (VariantMatrix); còn lại → Step 3 (AttributeFields specs).
  const { variantAttrs, specAttrs } = useMemo(() => {
    const list = setDetail?.attributes ?? [];
    const mapped = list
      .map((row) => {
        const attr = row.attribute ?? row;
        if (!attr?.code) return null;
        return {
          code: attr.code,
          name: attr.name ?? attr.code,
          input_type: attr.input_type ?? 'text',
          unit: attr.unit ?? '',
          options: attr.options ?? [],
          required: !!row.is_required,
          is_variant: !!row.is_variant,
          sort: row.sort ?? 0,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.sort - b.sort);
    return {
      variantAttrs: mapped.filter((x) => x.is_variant),
      specAttrs: mapped.filter((x) => !x.is_variant),
    };
  }, [setDetail]);

  // Khi set attribute-set đổi → clear variant_option_selection + variants nếu không khớp axes cũ.
  useEffect(() => {
    const axisCodes = new Set(variantAttrs.map((a) => a.code));
    const keys = Object.keys(data.variant_option_selection ?? {});
    const stale = keys.some((k) => !axisCodes.has(k));
    if (stale) {
      setData((d) => ({ ...d, variant_option_selection: {}, variants: [] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantAttrs]);
  const toggleAudience = (val) =>
    set('audiences', data.audiences.includes(val)
      ? data.audiences.filter((x) => x !== val)
      : [...data.audiences, val]);
  const toggleListValue = (key, val) => {
    const cur = data[key] ?? [];
    set(key, cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]);
  };

  const completions = useMemo(() => STEPS.map((s) => stepCompletion(s, data)), [data]);
  const activeFlagsCount = Object.values(data.flags).filter(Boolean).length;

  const handleSave = () => {
    setDirty(false);
    setSnack({ severity: 'success', message: mode === 'new' ? 'Đã tạo sản phẩm' : 'Đã lưu thay đổi' });
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((s) => s + 1);
    else handleSave();
  };
  const goPrev = () => currentStep > 0 && setCurrentStep((s) => s - 1);

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={mode === 'new' ? 'Tạo sản phẩm mới' : data.name || 'Sửa sản phẩm'}
        subtitle={mode === 'new'
          ? `Bước ${currentStep + 1}/${STEPS.length} · ${step.label}`
          : `Mã: ${data.display_code || '—'} · ${data.variants.length} biến thể · ${activeFlagsCount} nhãn bật`}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Sản phẩm', href: adminPaths.product.root },
          { label: mode === 'new' ? 'Tạo mới' : 'Sửa' },
        ]}
      />

      <StepperBar current={currentStep} completions={completions} onJump={setCurrentStep} />

      <Box sx={{ py: { xs: 2, md: 2.5 }, px: { xs: 2, md: 3 }, bgcolor: 'grey.50' }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 8 }}>
            {currentStep === 0 && <Step1Basic data={data} set={set} toggleAudience={toggleAudience} toggleListValue={toggleListValue} />}
            {currentStep === 1 && <Step2Pricing data={data} set={set} setSnack={setSnack} variantAttrs={variantAttrs} setDetailLoading={setDetailLoading} />}
            {currentStep === 2 && <Step3Content data={data} set={set} specAttrs={specAttrs} setDetailLoading={setDetailLoading} />}
            {currentStep === 3 && <Step4Display data={data} set={set} setFlag={setFlag} />}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <PreviewCard data={data} />
              {mode === 'edit' && (
                <Section icon={HistoryOutlined} title="Lịch sử thay đổi" description={`${SAMPLE_AUDIT.length} hoạt động`} dense>
                  <AuditTimeline entries={SAMPLE_AUDIT} />
                </Section>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Sticky action bar */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          px: { xs: 2, md: 3 },
          py: 1.25,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          boxShadow: '0 -2px 8px rgba(0,0,0,.04)',
          zIndex: 10,
          flexWrap: 'wrap',
        }}
      >
        {dirty && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'warning.main',
              animation: 'pulse 1.4s infinite',
              '@keyframes pulse': {
                '0%,100%': { opacity: 1 },
                '50%': { opacity: 0.4 },
              },
            }}
          />
        )}
        <Typography sx={{ flex: 1, fontSize: 12.5, fontWeight: 500, color: dirty ? 'warning.dark' : 'text.secondary' }}>
          {dirty ? 'Có thay đổi chưa lưu' : mode === 'new' ? `Bước ${currentStep + 1}/${STEPS.length}` : 'Chưa có thay đổi'}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<VisibilityOutlined sx={{ fontSize: 16 }} />}
          onClick={() =>
            data.slug
              ? window.open(`/products/${data.slug}`, '_blank', 'noopener,noreferrer')
              : setSnack({ severity: 'warning', message: 'Nhập slug trước để xem preview trên site' })
          }
          sx={{ boxShadow: 'none' }}
        >
          Xem site
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}
          onClick={() => (dirty ? setCancelOpen(true) : router.push(adminPaths.product.root))}
          sx={{ boxShadow: 'none' }}
        >
          Huỷ
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<NavigateBeforeRounded sx={{ fontSize: 18 }} />}
          disabled={currentStep === 0}
          onClick={goPrev}
          sx={{ boxShadow: 'none' }}
        >
          Quay lại
        </Button>
        {mode === 'edit' && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<SaveOutlined sx={{ fontSize: 16 }} />}
            onClick={handleSave}
            disabled={!dirty}
            sx={{ boxShadow: 'none' }}
          >
            Lưu nháp
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          onClick={goNext}
          startIcon={isLast ? <CheckCircleOutlined sx={{ fontSize: 16 }} /> : undefined}
          endIcon={isLast ? undefined : <NavigateNextRounded sx={{ fontSize: 18 }} />}
          sx={{ boxShadow: 'none' }}
        >
          {isLast ? (mode === 'new' ? 'Tạo sản phẩm' : 'Lưu thay đổi') : 'Tiếp theo'}
        </Button>
      </Box>

      <ConfirmDialog
        open={cancelOpen}
        title="Bỏ thay đổi?"
        message="Mọi thay đổi chưa lưu sẽ bị mất."
        confirmLabel="Bỏ"
        danger
        onCancel={() => setCancelOpen(false)}
        onConfirm={() => { setCancelOpen(false); router.push(adminPaths.product.root); }}
      />

      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snack && <Alert severity={snack.severity} onClose={() => setSnack(null)}>{snack.message}</Alert>}
      </Snackbar>
    </DashboardContent>
  );
}
