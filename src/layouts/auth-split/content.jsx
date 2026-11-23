'use client';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

import { layoutClasses } from '../core/classes';

// ----------------------------------------------------------------------

export function AuthSplitContent({
                                     sx,
                                     children,
                                     topSlot,
                                     className,
                                     layoutQuery = 'md',
                                     ...other
                                 }) {
    return (
        <Box
            className={mergeClasses([layoutClasses.content, className])}
            sx={[
                (theme) => ({
                    display: 'flex',
                    flex: '1 1 auto',
                    alignItems: 'stretch',
                    flexDirection: 'column',
                    p: theme.spacing(3, 2, 10, 2),
                    [theme.breakpoints.up(layoutQuery)]: {
                        flex: '1 1 0',
                        width: 0,
                        minWidth: 0,
                        p: theme.spacing(5, 7, 10, 7),
                    },
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            {/* topSlot — render ở TRÊN CÙNG content pane, full pane width (trừ padding).
          Không bị bọc bởi wrapper 420px → không kéo lệch theo form, không tràn section pane. */}
            {topSlot && <Box sx={{ width: 1 }}>{topSlot}</Box>}

            {/* Khu vực form: chiếm phần còn lại + căn giữa dọc + bọc bằng wrapper 420px */}
            <Box
                sx={{
                    flex: '1 1 auto',
                    width: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        // maxWidth: 'var(--layout-auth-content-width)',
                        maxWidth: '500px',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
