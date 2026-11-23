// PNJ paths — admin console + landing storefront, gộp vào 1 `paths`.
// Giữ `adminPaths` / `landingPaths` export để các file đang import tên cũ không vỡ.

const ROOTS = { ADMIN: '/admin', LANDING: '/' };

const admin = {
    root: ROOTS.ADMIN,
    auth: { login: `${ROOTS.ADMIN}/login` },
    dashboard: `${ROOTS.ADMIN}/dashboard`,
    profile: `${ROOTS.ADMIN}/profile`,

    product: {
        root: `${ROOTS.ADMIN}/product`,
        new: `${ROOTS.ADMIN}/product/new`,
        edit: (id) => `${ROOTS.ADMIN}/product/${id}/edit`,
        detail: (id) => `${ROOTS.ADMIN}/product/${id}`,
    },
    category: {
        root: `${ROOTS.ADMIN}/category`,
        new: `${ROOTS.ADMIN}/category/new`,
        edit: (id) => `${ROOTS.ADMIN}/category/${id}/edit`,
    },
    brand: {
        root: `${ROOTS.ADMIN}/brand`,
        new: `${ROOTS.ADMIN}/brand/new`,
        edit: (id) => `${ROOTS.ADMIN}/brand/${id}/edit`,
    },
    collection: {
        root: `${ROOTS.ADMIN}/collection`,
        new: `${ROOTS.ADMIN}/collection/new`,
        edit: (id) => `${ROOTS.ADMIN}/collection/${id}/edit`,
    },
    productLine: {
        root: `${ROOTS.ADMIN}/product-line`,
        new: `${ROOTS.ADMIN}/product-line/new`,
        edit: (id) => `${ROOTS.ADMIN}/product-line/${id}/edit`,
    },
    attribute: {
        root: `${ROOTS.ADMIN}/attribute`,
        new: `${ROOTS.ADMIN}/attribute/new`,
        edit: (id) => `${ROOTS.ADMIN}/attribute/${id}/edit`,
    },
    attributeSet: {
        root: `${ROOTS.ADMIN}/attribute-set`,
        new: `${ROOTS.ADMIN}/attribute-set/new`,
        edit: (id) => `${ROOTS.ADMIN}/attribute-set/${id}/edit`,
    },
    sizeGuide: {
        root: `${ROOTS.ADMIN}/size-guide`,
        new: `${ROOTS.ADMIN}/size-guide/new`,
        edit: (id) => `${ROOTS.ADMIN}/size-guide/${id}/edit`,
    },
    inventory: {
        root: `${ROOTS.ADMIN}/inventory`,
        stores: `${ROOTS.ADMIN}/inventory/stores`,
        movements: `${ROOTS.ADMIN}/inventory/movements`,
        transfers: `${ROOTS.ADMIN}/inventory/transfers`,
    },
    goldPrice: { root: `${ROOTS.ADMIN}/gold-price` },

    order: {
        root: `${ROOTS.ADMIN}/order`,
        detail: (id) => `${ROOTS.ADMIN}/order/${id}`,
    },
    returnRequest: {
        root: `${ROOTS.ADMIN}/return-request`,
        detail: (id) => `${ROOTS.ADMIN}/return-request/${id}`,
    },

    customer: {
        root: `${ROOTS.ADMIN}/customer`,
        detail: (id) => `${ROOTS.ADMIN}/customer/${id}`,
    },
    membershipTier: { root: `${ROOTS.ADMIN}/membership-tier` },

    promotion: {
        root: `${ROOTS.ADMIN}/promotion`,
        new: `${ROOTS.ADMIN}/promotion/new`,
        edit: (id) => `${ROOTS.ADMIN}/promotion/${id}/edit`,
    },
    coupon: { root: `${ROOTS.ADMIN}/coupon` },
    giftCard: {
        root: `${ROOTS.ADMIN}/gift-card`,
        detail: (id) => `${ROOTS.ADMIN}/gift-card/${id}`,
    },

    paymentMethod: { root: `${ROOTS.ADMIN}/payment-method` },
    bank: { root: `${ROOTS.ADMIN}/bank` },
    installmentPlan: { root: `${ROOTS.ADMIN}/installment-plan` },

    store: {
        root: `${ROOTS.ADMIN}/store`,
        new: `${ROOTS.ADMIN}/store/new`,
        edit: (id) => `${ROOTS.ADMIN}/store/${id}/edit`,
    },

    content: { root: `${ROOTS.ADMIN}/content` },
    menu: {
        root: `${ROOTS.ADMIN}/menu`,
        edit: (location) => `${ROOTS.ADMIN}/menu/${location}`,
    },
    banner: { root: `${ROOTS.ADMIN}/banner` },
    homeSection: { root: `${ROOTS.ADMIN}/home-section` },
    ecardCategory: { root: `${ROOTS.ADMIN}/ecard-category` },
    ecardTemplate: { root: `${ROOTS.ADMIN}/ecard-template` },
    media: { root: `${ROOTS.ADMIN}/media` },
    campaignCalendar: { root: `${ROOTS.ADMIN}/campaign-calendar` },
    landingPage: {
        root: `${ROOTS.ADMIN}/landing-page`,
        new: `${ROOTS.ADMIN}/landing-page/new`,
        edit: (id) => `${ROOTS.ADMIN}/landing-page/${id}/edit`,
    },
    page: {
        root: `${ROOTS.ADMIN}/page`,
        new: `${ROOTS.ADMIN}/page/new`,
        edit: (id) => `${ROOTS.ADMIN}/page/${id}/edit`,
    },
    faq: { root: `${ROOTS.ADMIN}/faq` },
    document: { root: `${ROOTS.ADMIN}/document` },

    post: {
        root: `${ROOTS.ADMIN}/post`,
        new: `${ROOTS.ADMIN}/post/new`,
        edit: (id) => `${ROOTS.ADMIN}/post/${id}/edit`,
    },
    postCategory: { root: `${ROOTS.ADMIN}/post-category` },

    review: {
        root: `${ROOTS.ADMIN}/review`,
        detail: (id) => `${ROOTS.ADMIN}/review/${id}`,
    },
    lead: {
        root: `${ROOTS.ADMIN}/lead`,
        detail: (id) => `${ROOTS.ADMIN}/lead/${id}`,
    },

    admin: {
        root: `${ROOTS.ADMIN}/admin-user`,
        new: `${ROOTS.ADMIN}/admin-user/new`,
        edit: (id) => `${ROOTS.ADMIN}/admin-user/${id}/edit`,
    },
    role: {
        root: `${ROOTS.ADMIN}/role`,
        new: `${ROOTS.ADMIN}/role/new`,
        edit: (id) => `${ROOTS.ADMIN}/role/${id}/edit`,
    },
    setting: { root: `${ROOTS.ADMIN}/setting` },
    urlRedirect: { root: `${ROOTS.ADMIN}/url-redirect` },
    notificationTemplate: { root: `${ROOTS.ADMIN}/notification-template` },
    notificationLog: { root: `${ROOTS.ADMIN}/notification-log` },
    activityLog: { root: `${ROOTS.ADMIN}/activity-log` },
};

const landing = {
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

// ----------------------------------------------------------------------

export const paths = {
    admin,
    landing,

    // Error pages (dùng ở error boundary + not-found)
    page403: '/error/403',
    page404: '/error/404',
    page500: '/error/500',

    // Alias cho code template leftover (sign-out, auth-guard) — đều về admin
    login: admin.auth.login,
    dashboard: { root: admin.dashboard },
    // Template checkout-provider (layout root) đọc paths.product.checkout khi mount —
    // alias về landing.checkout để không crash.
    product: { checkout: landing.checkout },
};

// Backward compat — nhiều file import 2 tên này.
export const adminPaths = admin;
export const landingPaths = landing;
