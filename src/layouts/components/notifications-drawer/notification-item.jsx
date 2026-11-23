import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fUnixToNow } from 'src/utils/format-time';

import {Label} from 'src/components/label';
import {FileThumbnail} from 'src/components/file-thumbnail';

import SubNotificationAvatar from "../elements/sub-notification-avatar";
import {NOTIFICATION_TYPES} from "../../../actions/notification/notification";

// ----------------------------------------------------------------------

const readerContent = (title, message) => (
    <Box>
        <Box
            dangerouslySetInnerHTML={{__html: title}}
            sx={{
                '& p': {m: 0, typography: 'body2'},
                '& a': {color: 'inherit', textDecoration: 'none'},
                '& strong': {typography: 'subtitle2'},
            }}
        />
        <Box
            sx={{
                p: 1.5,
                my: 1.5,
                borderRadius: 1.5,
                color: 'text.secondary',
                bgcolor: 'background.neutral',
            }}
        >
            <Typography component="p" variant="body2">{message}</Typography>
        </Box>
    </Box>
);

export function NotificationItem({notification}) {
    const renderAvatar = () => (
        <ListItemAvatar>
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.neutral',
                }}
            >
                <SubNotificationAvatar type={notification.type} />
            </Box>
        </ListItemAvatar>
    );

    const renderText = () => (
        <ListItemText
            primary={readerContent(notification.title, notification.message)}
            secondary={
                <>
                    {fUnixToNow(notification.created_at)}
                    <Box
                        component="span"
                        sx={{width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor'}}
                    />
                    {NOTIFICATION_TYPES.find(item => item.value === notification.type)?.label || notification.type}
                </>
            }
            slotProps={{
                primary: {
                    sx: {mb: 0.5},
                },
                secondary: {
                    sx: {
                        gap: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        typography: 'caption',
                        color: 'text.disabled',
                    },
                },
            }}
        />
    );

    const renderUnReadBadge = () =>
        notification.isUnRead && (
            <Box
                sx={{
                    top: 26,
                    width: 8,
                    height: 8,
                    right: 20,
                    borderRadius: '50%',
                    bgcolor: 'info.main',
                    position: 'absolute',
                }}
            />
        );

    const renderFriendAction = () => (
        <Box sx={{gap: 1, mt: 1.5, display: 'flex'}}>
            <Button size="small" variant="contained">
                Accept
            </Button>
            <Button size="small" variant="outlined">
                Decline
            </Button>
        </Box>
    );

    const renderProjectAction = () => (
        <>
            <Box
                sx={{
                    p: 1.5,
                    my: 1.5,
                    borderRadius: 1.5,
                    color: 'text.secondary',
                    bgcolor: 'background.neutral',
                }}
            >
                {readerContent(
                    `<p><strong>@Jaydon Frankie</strong> feedback by asking questions or just leave a note of appreciation.</p>`
                )}
            </Box>

            <Button size="small" variant="contained" sx={{alignSelf: 'flex-start'}}>
                Reply
            </Button>
        </>
    );

    const renderFileAction = () => (
        <Box
            sx={(theme) => ({
                p: theme.spacing(1.5, 1.5, 1.5, 1),
                gap: 1,
                mt: 1.5,
                display: 'flex',
                borderRadius: 1.5,
                bgcolor: 'background.neutral',
            })}
        >
            <FileThumbnail file="http://localhost:8080/httpsdesign-suriname-2015.mp3"/>

            <ListItemText
                primary="design-suriname-2015.mp3 design-suriname-2015.mp3"
                secondary="2.3 Mb"
                slotProps={{
                    primary: {
                        noWrap: true,
                        sx: (theme) => ({
                            color: 'text.secondary',
                            fontSize: theme.typography.pxToRem(13),
                        }),
                    },
                    secondary: {
                        sx: {
                            mt: 0.25,
                            typography: 'caption',
                            color: 'text.disabled',
                        },
                    },
                }}
            />

            <Button size="small" variant="outlined" sx={{flexShrink: 0}}>
                Download
            </Button>
        </Box>
    );

    const renderTagsAction = () => (
        <Box
            sx={{
                mt: 1.5,
                gap: 0.75,
                display: 'flex',
                flexWrap: 'wrap',
            }}
        >
            <Label variant="outlined" color="info">
                Design
            </Label>
            <Label variant="outlined" color="warning">
                Dashboard
            </Label>
            <Label variant="outlined">Design system</Label>
        </Box>
    );

    const renderPaymentAction = () => (
        <Box sx={{gap: 1, mt: 1.5, display: 'flex'}}>
            <Button size="small" variant="contained">
                Pay
            </Button>
            <Button size="small" variant="outlined">
                Decline
            </Button>
        </Box>
    );

    return (
        <ListItemButton
            disableRipple
            sx={[
                (theme) => ({
                    p: 2.5,
                    alignItems: 'flex-start',
                    borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
                }),
            ]}
        >
            {renderUnReadBadge()}
            {renderAvatar()}

            <Box sx={{minWidth: 0, flex: '1 1 auto'}}>
                {renderText()}
                {/*{notification.type === 'friend' && renderFriendAction()}*/}
                {/*{notification.type === 'project' && renderProjectAction()}*/}
                {/*{notification.type === 'file' && renderFileAction()}*/}
                {/*{notification.type === 'tags' && renderTagsAction()}*/}
                {/*{notification.type === 'payment' && renderPaymentAction()}*/}
            </Box>
        </ListItemButton>
    );
}
