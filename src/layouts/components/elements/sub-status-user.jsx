import { CONST_USER_STATUS_OPTIONS } from "src/actions/user";

import { Label } from "src/components/label";

export default function SubUserStatus({value, sx}) {
    const renderStatusLabel = (status) => CONST_USER_STATUS_OPTIONS.find(item => item.id === status)?.label || status

    const renderLabelColor = (status) => CONST_USER_STATUS_OPTIONS.find(item => item.id === status)?.color || 'default'

    return (
        <Label color={renderLabelColor(value)} sx={sx}>
            {renderStatusLabel(value)}
        </Label>
    )
}