// src/mock-data/payment-methods.js
// Phương thức thanh toán cho storefront + POS.

export const PAYMENT_METHOD_IDS = {
  COD:      'pm-cod',
  VNPAY:    'pm-vnpay',
  MOMO:     'pm-momo',
  ZALOPAY:  'pm-zalopay',
  CARD_INTL:'pm-card-intl',
  BANK_QR:  'pm-bank-qr',
  INSTALL:  'pm-installment',
  STORE_CASH:'pm-store-cash',
};

export const mockPaymentMethods = [
  { _id: PAYMENT_METHOD_IDS.COD,       id: PAYMENT_METHOD_IDS.COD,       code: 'cod',        name: 'Thanh toán khi nhận hàng', icon: 'solar:box-linear',             fee_percent: 0,    status: 'active', scope: ['web','app'] },
  { _id: PAYMENT_METHOD_IDS.VNPAY,     id: PAYMENT_METHOD_IDS.VNPAY,     code: 'vnpay',      name: 'Cổng VNPay',               icon: 'solar:card-linear',            fee_percent: 1.2,  status: 'active', scope: ['web','app'] },
  { _id: PAYMENT_METHOD_IDS.MOMO,      id: PAYMENT_METHOD_IDS.MOMO,      code: 'momo',       name: 'MoMo ví điện tử',          icon: 'solar:wallet-money-linear',    fee_percent: 1.5,  status: 'active', scope: ['web','app'] },
  { _id: PAYMENT_METHOD_IDS.ZALOPAY,   id: PAYMENT_METHOD_IDS.ZALOPAY,   code: 'zalopay',    name: 'ZaloPay',                  icon: 'solar:wallet-linear',          fee_percent: 1.5,  status: 'active', scope: ['web','app'] },
  { _id: PAYMENT_METHOD_IDS.CARD_INTL, id: PAYMENT_METHOD_IDS.CARD_INTL, code: 'card_intl',  name: 'Thẻ quốc tế (Visa/Master)', icon: 'solar:card-send-linear',       fee_percent: 2.5,  status: 'active', scope: ['web','app'] },
  { _id: PAYMENT_METHOD_IDS.BANK_QR,   id: PAYMENT_METHOD_IDS.BANK_QR,   code: 'bank_qr',    name: 'QR ngân hàng',             icon: 'solar:qr-code-linear',         fee_percent: 0.8,  status: 'active', scope: ['web','store'] },
  { _id: PAYMENT_METHOD_IDS.INSTALL,   id: PAYMENT_METHOD_IDS.INSTALL,   code: 'installment',name: 'Trả góp 0%',               icon: 'solar:dollar-linear',          fee_percent: 0,    status: 'active', scope: ['web','store'] },
  { _id: PAYMENT_METHOD_IDS.STORE_CASH,id: PAYMENT_METHOD_IDS.STORE_CASH,code: 'store_cash', name: 'Tiền mặt tại cửa hàng',    icon: 'solar:money-bag-linear',       fee_percent: 0,    status: 'active', scope: ['store'] },
];
