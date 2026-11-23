// src/mock-data/notification-logs.js
// Log gửi thông báo — link template_id + customer_id + order_id.

import { mockOrders } from './orders';
import { NOTIFICATION_TEMPLATE_IDS } from './notification-templates';

const STATUSES = ['sent', 'delivered', 'opened', 'clicked', 'failed'];

export const mockNotificationLogs = [];
let nid = 1;

mockOrders.forEach((o, i) => {
  const base = {
    order_id: o._id, order_no: o.order_no,
    customer_id: o.customer_id,
    to: o.buyer.email ?? `${o.buyer.phone}@sms.local`,
  };

  // order_created
  mockNotificationLogs.push({
    _id: `nl-${String(nid).padStart(5, '0')}`, id: `nl-${String(nid++).padStart(5, '0')}`,
    template_id: NOTIFICATION_TEMPLATE_IDS.OC,
    channel: 'email',
    status: 'delivered',
    ...base,
    sent_at: o.created_at,
  });

  if (o.status === 'confirmed' || o.status === 'processing' || o.status === 'delivered') {
    mockNotificationLogs.push({
      _id: `nl-${String(nid).padStart(5, '0')}`, id: `nl-${String(nid++).padStart(5, '0')}`,
      template_id: NOTIFICATION_TEMPLATE_IDS.OP,
      channel: 'email',
      status: STATUSES[i % STATUSES.length],
      ...base,
      sent_at: new Date(new Date(o.created_at).getTime() + 2 * 3600_000).toISOString(),
    });
  }

  if (o.status === 'shipping' || o.status === 'delivered') {
    mockNotificationLogs.push({
      _id: `nl-${String(nid).padStart(5, '0')}`, id: `nl-${String(nid++).padStart(5, '0')}`,
      template_id: NOTIFICATION_TEMPLATE_IDS.OS,
      channel: 'sms',
      status: 'delivered',
      ...base,
      sent_at: new Date(new Date(o.created_at).getTime() + 2 * 86_400_000).toISOString(),
    });
  }

  if (o.status === 'delivered') {
    mockNotificationLogs.push({
      _id: `nl-${String(nid).padStart(5, '0')}`, id: `nl-${String(nid++).padStart(5, '0')}`,
      template_id: NOTIFICATION_TEMPLATE_IDS.OD,
      channel: 'push',
      status: STATUSES[(i + 2) % STATUSES.length],
      ...base,
      sent_at: new Date(new Date(o.created_at).getTime() + 3 * 86_400_000).toISOString(),
    });
  }

  if (o.status === 'canceled') {
    mockNotificationLogs.push({
      _id: `nl-${String(nid).padStart(5, '0')}`, id: `nl-${String(nid++).padStart(5, '0')}`,
      template_id: NOTIFICATION_TEMPLATE_IDS.OCX,
      channel: 'email',
      status: 'delivered',
      ...base,
      sent_at: new Date(new Date(o.created_at).getTime() + 1 * 3600_000).toISOString(),
    });
  }
});
