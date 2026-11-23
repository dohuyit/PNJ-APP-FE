import 'src/global.css';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import { CONFIG } from 'src/global-config';
import { primary } from 'src/theme/core/palette';
import { LocalizationProvider } from 'src/locales';
import { detectLanguage } from 'src/locales/server';
import { themeConfig, ThemeProvider } from 'src/theme';
import { I18nProvider } from 'src/locales/i18n-provider';

import CsrfToken from 'src/components/csrf';
import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { detectSettings } from 'src/components/settings/server';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';

import { GTM_ID, getGtmScript } from '../utils/gtm';

// Landing không có auth — admin tự wrap AuthProvider ở `/src/app/admin/layout.jsx`.

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: primary.main,
};

export const metadata = {
    icons: [
        {
            rel: 'icon',
            url: `${CONFIG.assetsDir}/favicon.ico`,
        },
    ],
};

async function getAppConfig() {
    if (CONFIG.isStaticExport) {
        return {
            lang: 'en',
            i18nLang: undefined,
            cookieSettings: undefined,
            dir: defaultSettings.direction,
        };
    } else {
        const [lang, settings] = await Promise.all([detectLanguage(), detectSettings()]);

        return {
            lang: lang ?? 'en',
            i18nLang: lang ?? 'en',
            cookieSettings: settings,
            dir: settings.direction,
        };
    }
}

// ----------------------------------------------------------------------

export default async function RootLayout({ children }) {
    const appConfig = await getAppConfig();

    return (
        <html lang={appConfig.lang} dir={appConfig.dir} suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Montserrat:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Open+Sans:wght@400;600;700&display=swap"
                    rel="stylesheet"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: getGtmScript(),
                    }}
                />
            </head>
            <body>
                <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                     />
                </noscript>

                <InitColorSchemeScript
                    defaultMode={themeConfig.defaultMode}
                    modeStorageKey={themeConfig.modeStorageKey}
                    attribute={themeConfig.cssVariables.colorSchemeSelector}
                />

                <I18nProvider lang={appConfig.i18nLang}>
                    <SettingsProvider
                        cookieSettings={appConfig.cookieSettings}
                        defaultSettings={defaultSettings}
                    >
                        <LocalizationProvider>
                            <AppRouterCacheProvider options={{ key: 'css' }}>
                                <ThemeProvider
                                    defaultMode={themeConfig.defaultMode}
                                    modeStorageKey={themeConfig.modeStorageKey}
                                >
                                    <CsrfToken>
                                        <MotionLazy>
                                            <CheckoutProvider>
                                                <Snackbar />
                                                <ProgressBar />
                                                <SettingsDrawer
                                                    defaultSettings={defaultSettings}
                                                />
                                                {children}
                                            </CheckoutProvider>
                                        </MotionLazy>
                                    </CsrfToken>
                                </ThemeProvider>
                            </AppRouterCacheProvider>
                        </LocalizationProvider>
                    </SettingsProvider>
                </I18nProvider>
            </body>
        </html>
    );
}
