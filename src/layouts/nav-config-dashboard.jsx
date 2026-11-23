// Nav config cho dashboard layout — trỏ vào các module PNJ admin.
import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';

export const ICONS = {
    dashboard: <Iconify icon="solar:widget-5-linear" />,

    product: <Iconify icon="solar:bag-smile-linear" />,
    category: <Iconify icon="solar:folder-with-files-linear" />,
    brand: <Iconify icon="solar:crown-star-linear" />,
    collection: <Iconify icon="solar:gallery-wide-linear" />,
    productLine: <Iconify icon="solar:layers-linear" />,
    attribute: <Iconify icon="solar:tuning-2-linear" />,
    inventory: <Iconify icon="solar:box-linear" />,
    goldPrice: <Iconify icon="solar:dollar-linear" />,

    order: <Iconify icon="solar:bill-list-linear" />,
    returnRequest: <Iconify icon="solar:restart-linear" />,

    customer: <Iconify icon="solar:users-group-rounded-linear" />,
    lead: <Iconify icon="solar:chat-round-call-linear" />,
    review: <Iconify icon="solar:star-linear" />,

    promotion: <Iconify icon="solar:sale-linear" />,

    banner: <Iconify icon="solar:gallery-linear" />,
    post: <Iconify icon="solar:document-text-linear" />,
    faq: <Iconify icon="solar:question-circle-linear" />,
    page: <Iconify icon="solar:file-text-linear" />,

    store: <Iconify icon="solar:shop-linear" />,

    paymentMethod: <Iconify icon="solar:card-linear" />,
    media: <Iconify icon="solar:camera-linear" />,

    admin: <Iconify icon="solar:user-id-linear" />,
    role: <Iconify icon="solar:shield-user-linear" />,
    setting: <Iconify icon="solar:settings-linear" />,
    activity: <Iconify icon="solar:history-linear" />,
};

export const navData = [
    {
        subheader: 'Tổng quan',
        items: [
            { title: 'Dashboard', path: paths.admin.dashboard, icon: ICONS.dashboard },
        ],
    },

    {
        subheader: 'Sản phẩm',
        items: [
            { title: 'Sản phẩm', path: paths.admin.product.root, icon: ICONS.product },
            { title: 'Danh mục', path: paths.admin.category.root, icon: ICONS.category },
            { title: 'Thương hiệu', path: paths.admin.brand.root, icon: ICONS.brand },
            { title: 'Bộ sưu tập', path: paths.admin.collection.root, icon: ICONS.collection },
            { title: 'Dòng hàng', path: paths.admin.productLine.root, icon: ICONS.productLine },
            { title: 'Tồn kho', path: paths.admin.inventory.root, icon: ICONS.inventory },
            { title: 'Giá vàng', path: paths.admin.goldPrice.root, icon: ICONS.goldPrice },
        ],
    },

    {
        subheader: 'Thuộc tính',
        items: [
            { title: 'Thuộc tính', path: paths.admin.attribute.root, icon: ICONS.attribute },
            { title: 'Bộ thuộc tính', path: paths.admin.attributeSet.root, icon: ICONS.attribute },
        ],
    },

    {
        subheader: 'Bán hàng',
        items: [
            { title: 'Đơn hàng', path: paths.admin.order.root, icon: ICONS.order },
            { title: 'Đổi trả / Bảo hành', path: paths.admin.returnRequest.root, icon: ICONS.returnRequest },
            { title: 'Khuyến mãi', path: paths.admin.promotion.root, icon: ICONS.promotion },
        ],
    },

    {
        subheader: 'Khách hàng',
        items: [
            { title: 'Khách hàng', path: paths.admin.customer.root, icon: ICONS.customer },
            { title: 'Yêu cầu tư vấn', path: paths.admin.lead.root, icon: ICONS.lead },
            { title: 'Đánh giá', path: paths.admin.review.root, icon: ICONS.review },
        ],
    },

    {
        subheader: 'Nội dung',
        items: [
            { title: 'Bài viết', path: paths.admin.post.root, icon: ICONS.post },
            { title: 'Chuyên mục blog', path: paths.admin.postCategory.root, icon: ICONS.post },
            { title: 'Banner', path: paths.admin.banner.root, icon: ICONS.banner },
            { title: 'Trang CMS', path: paths.admin.page.root, icon: ICONS.page },
            { title: 'FAQ', path: paths.admin.faq.root, icon: ICONS.faq },
        ],
    },

    {
        subheader: 'Cửa hàng',
        items: [
            { title: 'Hệ thống cửa hàng', path: paths.admin.store.root, icon: ICONS.store },
            { title: 'Phương thức thanh toán', path: paths.admin.paymentMethod.root, icon: ICONS.paymentMethod },
        ],
    },

    {
        subheader: 'Hệ thống',
        items: [
            { title: 'Tài khoản admin', path: paths.admin.admin.root, icon: ICONS.admin },
            { title: 'Vai trò', path: paths.admin.role.root, icon: ICONS.role },
            { title: 'Cấu hình chung', path: paths.admin.setting.root, icon: ICONS.setting },
            { title: 'Nhật ký hoạt động', path: paths.admin.activityLog.root, icon: ICONS.activity },
        ],
    },
];
