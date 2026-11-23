import { formatNumberLocale } from 'src/locales';

const DEFAULT_LOCALE = { code: 'vi-VN', currency: 'VND', format: 0 };

const LOCALE = [
    { code: 'vi-VN', currency: 'VND', format: 0 },
    { code: 'en-US', currency: 'USD', format: 2 },
];

// function processInput(inputValue) {
//   if (inputValue == null || Number.isNaN(inputValue)) return null;
//   return Number(inputValue);
// }

function truncate(num, precision) {
    const factor = 10 ** precision;
    const epsilon = num >= 0 ? 1e-12 : -1e-12;
    return Math.trunc((num + epsilon) * factor) / factor;
}

export function processInput(inputValue) {
    if (inputValue == null || `${inputValue}`.trim() === '' || Number.isNaN(inputValue))
        return null;

    const num = Number(inputValue);
    return Number.isFinite(num) ? num : null;
}

// ----------------------------------------------------------------------

export function fNumber(inputValue, options) {
    const locale = formatNumberLocale() || DEFAULT_LOCALE;

    let number = processInput(inputValue);
    if (number === null) return '';

    const fm = new Intl.NumberFormat(locale.code, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options,
    }).format(number);

    return fm;
}

// ----------------------------------------------------------------------

export function fCurrency(inputValue, currency, options) {
    const locale = LOCALE.find((item) => item.currency === currency) ?? DEFAULT_LOCALE;

    let number = processInput(inputValue);
    if (number === null) return '';

    const fm = new Intl.NumberFormat(locale.code, {
        style: 'currency',
        currency: locale.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: locale.format,
        ...options,
    }).format(number);

    return fm;
}

// ----------------------------------------------------------------------

export function fPercent(inputValue, options) {
    const locale = formatNumberLocale() || DEFAULT_LOCALE;

    const number = processInput(inputValue);
    if (number === null) return '';

    const fm = new Intl.NumberFormat(locale.code, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options,
    }).format(number / 100);

    return fm;
}

// ----------------------------------------------------------------------

export function fShortenNumber(inputValue, options) {
    const locale = formatNumberLocale() || DEFAULT_LOCALE;

    const number = processInput(inputValue);
    if (number === null) return '';

    const fm = new Intl.NumberFormat(locale.code, {
        notation: 'compact',
        maximumFractionDigits: 2,
        ...options,
    }).format(number);

    return fm.replace(/[A-Z]/g, (match) => match.toLowerCase());
}

// ----------------------------------------------------------------------

export function fData(inputValue) {
    const number = processInput(inputValue);
    if (number === null || number === 0) return '0 bytes';

    const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
    const decimal = 2;
    const baseValue = 1024;

    const index = Math.floor(Math.log(number) / Math.log(baseValue));
    const fm = `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`;

    return fm;
}

export function fmtVNDCompact(inputValue, currency, options = {}) {
    const { showCurrencySymbol = false } = options;

    const locale = LOCALE.find((item) => item.currency === currency) ?? DEFAULT_LOCALE;
    const currencySymbol = currency === 'USD' ? '$' : ' đ';

    const value = Number(inputValue) || 0;
    const sign = value < 0 ? '-' : '';
    const absValue = Math.abs(value);

    const appendCurrency = (formattedValue) =>
        showCurrencySymbol && currencySymbol ? `${formattedValue}${currencySymbol}` : formattedValue;

    if (absValue >= 1e9) {
        return appendCurrency(`${sign}${truncate(absValue / 1e9, 2)}B`);
    }

    if (absValue >= 1e6) {
        return appendCurrency(`${sign}${truncate(absValue / 1e6, 2)}M`);
    }

    if (absValue >= 1e3) {
        return appendCurrency(`${sign}${truncate(absValue / 1e3, 2)}K`);
    }

    return appendCurrency(`${sign}${truncate(absValue, locale.format)}`);
}

export function splitVNDCompact(inputValue, currency, type = 'vn') {

    const locale = LOCALE.find((item) => item.currency === currency) ?? DEFAULT_LOCALE;

    const value = Number(inputValue) || 0;
    const sign = value < 0 ? '-' : '';
    const absValue = Math.abs(value);

    if (absValue >= 1e9) {
        return {
            value: `${sign}${truncate(absValue / 1e9, 2)}`,
            symbol: type === 'vn' ? 'Tỉ' : 'B'
        }
    }

    if (absValue >= 1e6) {
        return {
            value: `${sign}${truncate(absValue / 1e6, 2)}`,
            symbol: type === 'vn' ? 'Triệu' : 'M'
        }
    }

    if (absValue >= 1e3) {
        return {
            value: `${sign}${truncate(absValue / 1e3, 2)}`,
            symbol: type === 'vn' ? 'Nghìn' : 'K'
        }
    }

    return {
        value: `${sign}${truncate(absValue, locale.format)}`,
        symbol: null
    }
}
