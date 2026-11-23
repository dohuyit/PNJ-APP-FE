'use client';

import { merge } from 'es-toolkit';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Logo } from 'src/components/logo';

import { AuthSplitSection } from './section';
import { AuthSplitContent } from './content';
import { MainSection } from '../core/main-section';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';

// ----------------------------------------------------------------------

// Breakpoint chuyển từ mobile → split layout (số px). 1024 = từ 1024px trở lên mới show
// brand panel bên phải; dưới 1024px chỉ hiển thị form (cùng pattern với HTML mock 1000px).
export function AuthSplitLayout({ sx, cssVars, children, slotProps, layoutQuery = 1024 }) {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(layoutQuery));

    // Lấy nội dung topRight (vd switch link "Sign in / Sign up") mà page layout truyền
    // qua slotProps.header.slots.rightArea — sẽ render TRONG content pane chứ không phải header.
    const topRightContent = slotProps?.header?.slots?.rightArea;

    const renderHeader = () => {
        const headerSlotProps = {
            container: { maxWidth: false },
        };

        const headerSlots = {
            topArea: (
                <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                    This is an info Alert.
                </Alert>
            ),
            centerArea: !isMdUp ? <Logo /> : null,
            bottomArea:
                !isMdUp && topRightContent ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            textAlign: 'center',
                            px: 2,
                            pb: 1.25,
                        }}
                    >
                        {topRightContent}
                    </Box>
                ) : null,
        };

        return (
            <HeaderSection
                disableElevation
                layoutQuery={layoutQuery}
                {...slotProps?.header}
                slots={{ ...headerSlots, ...slotProps?.header?.slots, rightArea: null }}
                slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
                sx={[
                    // Dùng callback form để layoutQuery (number) tương thích với theme.breakpoints.up
                    (themeArg) => ({
                        [themeArg.breakpoints.up(layoutQuery)]: {
                            position: 'fixed',
                            display: 'none',
                        },
                    }),
                    ...(Array.isArray(slotProps?.header?.sx)
                        ? (slotProps?.header?.sx ?? [])
                        : [slotProps?.header?.sx]),
                ]}
            />
        );
    };

    const renderFooter = () => null;

    const renderMain = () => (
        <MainSection
            {...slotProps?.main}
            sx={[
                (themeArg) => ({ [themeArg.breakpoints.up(layoutQuery)]: { flexDirection: 'row' } }),
                ...(Array.isArray(slotProps?.main?.sx)
                    ? (slotProps?.main?.sx ?? [])
                    : [slotProps?.main?.sx]),
            ]}
        >
            <AuthSplitSection
                layoutQuery={layoutQuery}
                method={CONFIG.auth.method}
                {...slotProps?.section}
                methods={[
                    {
                        label: 'Jwt',
                        path: paths.auth.jwt.signIn,
                        icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-jwt.svg`,
                    },
                    {
                        label: 'Firebase',
                        path: paths.auth.firebase.signIn,
                        icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-firebase.svg`,
                    },
                    {
                        label: 'Amplify',
                        path: paths.auth.amplify.signIn,
                        icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-amplify.svg`,
                    },
                    {
                        label: 'Auth0',
                        path: paths.auth.auth0.signIn,
                        icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-auth0.svg`,
                    },
                    {
                        label: 'Supabase',
                        path: paths.auth.supabase.signIn,
                        icon: `${CONFIG.assetsDir}/assets/icons/platforms/ic-supabase.svg`,
                    },
                ]}
            />
            <AuthSplitContent
                layoutQuery={layoutQuery}
                {...slotProps?.content}
                topSlot={
                    // Topbar desktop: logo (trái) + topRightContent (phải) trong cùng 1 hàng.
                    // Mobile thì TopbarSwitch render trong renderHeader (bottomArea) — xem trên.
                    isMdUp ? (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: 1,
                                gap: 2,
                                mb: 5,
                            }}
                        >
                            <Box sx={{ height: 32, display: 'flex', alignItems: 'center' }}>
                                <Logo sx={{ height: 1, width: 'auto' }} />
                            </Box>
                            {topRightContent && <Box>{topRightContent}</Box>}
                        </Box>
                    ) : null
                }
            >
                {children}
            </AuthSplitContent>
        </MainSection>
    );

    return (
        <LayoutSection
            /** **************************************
             * @Header
             *************************************** */
            headerSection={renderHeader()}
            /** **************************************
             * @Footer
             *************************************** */
            footerSection={renderFooter()}
            /** **************************************
             * @Styles
             *************************************** */
            cssVars={{ '--layout-auth-content-width': '420px', ...cssVars }}
            sx={sx}
        >
            {renderMain()}
        </LayoutSection>
    );
}
