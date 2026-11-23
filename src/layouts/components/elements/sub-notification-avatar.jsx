import React from "react";

import { NOTIFICATION_TYPES } from "src/actions/notification/notification";

import { Iconify } from "src/components/iconify";


export default function SubNotificationAvatar({type}) {
    return NOTIFICATION_TYPES.find(item => item.value === type)?.icon || <Iconify icon="mdi:account" width="24" height="24" />;
}
