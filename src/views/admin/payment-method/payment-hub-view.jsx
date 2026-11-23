// src/views/admin/payment-method/payment-hub-view.jsx

'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import EventOutlined from '@mui/icons-material/EventOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';

import { adminPaths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { HubTabs } from 'src/views/admin/_shared/hub-tabs';
import { BankListView } from 'src/views/admin/bank/bank-list-view';
import { EInvoiceListView } from 'src/views/admin/e-invoice/e-invoice-list-view';
import { InstallmentPlanListView } from 'src/views/admin/installment-plan/installment-plan-list-view';
import { PaymentTransactionListView } from 'src/views/admin/payment-transaction/payment-transaction-list-view';

import { PageHeader } from 'src/components/common/page-header';

import { PaymentMethodListView } from './payment-method-list-view';
import { mockInstallmentPlans, mockEInvoices, mockPaymentTransactions, mockBanks, mockPaymentMethods } from 'src/mock-data';

// Stubs — API chưa có hook; giữ literal để view không crash.
const banksList = mockBanks;
const eInvoicesList = mockEInvoices;
const installmentPlansList = mockInstallmentPlans;
const paymentMethodsList = mockPaymentMethods;
const paymentTransactionsList = mockPaymentTransactions;
const TABS = [
  { value: 'methods',      label: 'Phương thức', Icon: CreditCardOutlined,    count: paymentMethodsList.length,     subtitle: 'Cổng thanh toán · PTTT bật/tắt theo kênh' },
  { value: 'banks',        label: 'Ngân hàng',   Icon: AccountBalanceOutlined, count: banksList.length,              subtitle: 'Danh mục ngân hàng hỗ trợ chuyển khoản' },
  { value: 'installment',  label: 'Gói trả góp', Icon: EventOutlined,          count: installmentPlansList.length,   subtitle: 'Gói trả góp 0% qua thẻ tín dụng / tổ chức' },
  { value: 'transactions', label: 'Giao dịch',   Icon: ReceiptLongOutlined,    count: paymentTransactionsList.length,subtitle: 'Nhật ký giao dịch thanh toán · reconcile' },
  { value: 'einvoice',     label: 'Hoá đơn ĐT',  Icon: DescriptionOutlined,    count: eInvoicesList.length,          subtitle: 'E-invoice phát hành theo đơn' },
];

export function PaymentHubView({ defaultTab = 'methods' }) {
  const [tab, setTab] = useState(defaultTab);
  const active = TABS.find((t) => t.value === tab) ?? TABS[0];
  return (
    <DashboardContent disablePadding>
      <PageHeader
        title={active.label}
        subtitle={active.subtitle}
        breadcrumbs={[
          { label: 'PNJ Admin', href: adminPaths.dashboard },
          { label: 'Vận hành' },
          { label: active.label },
        ]}
      />
      <HubTabs value={tab} onChange={setTab} tabs={TABS} />
      <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
        {tab === 'methods'      && <PaymentMethodListView embedded />}
        {tab === 'banks'        && <BankListView embedded />}
        {tab === 'installment'  && <InstallmentPlanListView embedded />}
        {tab === 'transactions' && <PaymentTransactionListView embedded />}
        {tab === 'einvoice'     && <EInvoiceListView embedded />}
      </Box>
    </DashboardContent>
  );
}
