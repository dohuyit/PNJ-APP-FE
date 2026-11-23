import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

// ----------------------------------------------------------------------

/**
 * @Docs
 * https://day.js.org/docs/en/display/format
 */

/**
 * Default timezones
 * https://day.js.org/docs/en/timezone/set-default-timezone#docsNav
 *
 */

/**
 * UTC
 * https://day.js.org/docs/en/plugin/utc
 * @install
 * import utc from 'dayjs/plugin/utc';
 * dayjs.extend(utc);
 * @usage
 * dayjs().utc().format()
 *
 */

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// ----------------------------------------------------------------------

export const formatPatterns = {
  dateTime: 'DD MMM YYYY h:mm a', // 17 Apr 2022 12:00 am
  date: 'DD MMM YYYY', // 17 Apr 2022
  time: 'h:mm a', // 12:00 am
  split: {
    dateTime: 'DD/MM/YYYY h:mm a', // 17/04/2022 12:00 am
    date: 'DD/MM/YYYY', // 17/04/2022
  },
  paramCase: {
    dateTime: 'DD-MM-YYYY h:mm a', // 17-04-2022 12:00 am
    date: 'DD-MM-YYYY', // 17-04-2022
  },
};

const isValidDate = (date) => date !== null && date !== undefined && dayjs(date).isValid();

// ----------------------------------------------------------------------

export function today(template) {
  return dayjs(new Date()).startOf('day').format(template);
}

// ----------------------------------------------------------------------

/**
 * @output 17 Apr 2022 12:00 am
 */

// ----------------------------------------------------------------------

export function fDateTime(date, template) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return dayjs(date).format(template ?? formatPatterns.dateTime);
}

// ----------------------------------------------------------------------

/**
 * @output 17 Apr 2022
 */

// ----------------------------------------------------------------------

export function fDate(date, template) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return dayjs(date).format(template ?? formatPatterns.date);
}

// ----------------------------------------------------------------------

/**
 * @output 12:00 am
 */

// ----------------------------------------------------------------------

export function fTime(date, template) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return dayjs(date).format(template ?? formatPatterns.time);
}

// ----------------------------------------------------------------------

/**
 * @output 1713250100
 */

// ----------------------------------------------------------------------

export function fTimestamp(date) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return dayjs(date).valueOf();
}

// ----------------------------------------------------------------------

/**
 * @output a few seconds, 2 years
 */

// ----------------------------------------------------------------------

export function fToNow(date) {
  if (!isValidDate(date)) {
    return 'Invalid date';
  }

  return dayjs(date).toNow(true);
}

export function fUnixToNow(date) {
    const currentLocale = dayjs.locale();

    // Admin UI dùng tiếng Việt — luôn ép locale 'vi' để output ra "13 ngày"
    // thay vì "13 days" (dayjs/locale/vi đã register ở localization-provider).
    dayjs.locale('vi');
    const result = dayjs.unix(date).toNow(true);

    dayjs.locale(currentLocale);

    return result;
}
// ----------------------------------------------------------------------

/**
 * @output boolean
 */

// ----------------------------------------------------------------------

export function fIsBetween(inputDate, startDate, endDate) {
  if (!isValidDate(inputDate) || !isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  const formattedInputDate = fTimestamp(inputDate);
  const formattedStartDate = fTimestamp(startDate);
  const formattedEndDate = fTimestamp(endDate);

  if (
    formattedInputDate === 'Invalid date' ||
    formattedStartDate === 'Invalid date' ||
    formattedEndDate === 'Invalid date'
  ) {
    return false;
  }

  return formattedInputDate >= formattedStartDate && formattedInputDate <= formattedEndDate;
}

// ----------------------------------------------------------------------

/**
 * @output boolean
 */

// ----------------------------------------------------------------------

export function fIsAfter(startDate, endDate) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  return dayjs(startDate).isAfter(endDate);
}

// ----------------------------------------------------------------------

/**
 * @output boolean
 */

// ----------------------------------------------------------------------

export function fIsSame(startDate, endDate, unitToCompare) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  return dayjs(startDate).isSame(endDate, unitToCompare ?? 'year');
}

/**
 * @output
 * Same day: 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same year: 25 Apr - 26 May 2024
 */

// ----------------------------------------------------------------------

export function fDateRangeShortLabel(startDate, endDate, initial) {
  if (!isValidDate(startDate) || !isValidDate(endDate) || fIsAfter(startDate, endDate)) {
    return 'Invalid date';
  }

  let label = `${fDate(startDate)} - ${fDate(endDate)}`;

  if (initial) {
    return label;
  }

  const isSameYear = fIsSame(startDate, endDate, 'year');
  const isSameMonth = fIsSame(startDate, endDate, 'month');
  const isSameDay = fIsSame(startDate, endDate, 'day');

  if (isSameYear && !isSameMonth) {
    label = `${fDate(startDate, 'DD MMM')} - ${fDate(endDate)}`;
  } else if (isSameYear && isSameMonth && !isSameDay) {
    label = `${fDate(startDate, 'DD')} - ${fDate(endDate)}`;
  } else if (isSameYear && isSameMonth && isSameDay) {
    label = `${fDate(endDate)}`;
  }

  return label;
}

// ----------------------------------------------------------------------

export function fAdd({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const result = dayjs()
    .add(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}

/**
 * @output 2024-05-28T05:55:31+00:00
 */

// ----------------------------------------------------------------------

export function fSub({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const result = dayjs()
    .subtract(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}

export function fFromTimestampToDate(timestamp, format = 'YYYY-MM-DD') {
    if (!timestamp || timestamp <= 0) {
        return '';
    }
    const parseDate = dayjs(timestamp * 1000);
    if (!parseDate.isValid()) {
        return timestamp;
    }
    return parseDate.format(format);
}

export function fFromTimestampToNow(timestamp) {
    if (!timestamp || timestamp <= 0) {
        return '';
    }
    const parseDate = dayjs(timestamp * 1000);
    if (!parseDate.isValid()) {
        return timestamp;
    }
    return parseDate.toNow(true);
}

export function fUnixToDate(time, tz = 'Asia/Ho_Chi_Minh'){
  return dayjs.unix(time).tz(tz).format('YYYY-MM-DD')
}

export function fUnixToTime(time, tz = 'Asia/Ho_Chi_Minh'){
    return dayjs.unix(time).tz(tz).format('HH:mm')
}

export function fUnixToDateTime(time, tz = 'Asia/Ho_Chi_Minh'){
  return dayjs.unix(time).tz(tz).format('YYYY-MM-DD HH:mm')
}

export function fUnixToDateVN(time) {
    return dayjs.unix(time).format('DD/MM/YYYY');
}

export function fmtRelativeDate(date) {
    if (!date) return '—';

    let d;

    if (date instanceof Date) {
        d = date;
    } else if (typeof date === 'number') {
        // timestamp < 10^12 → seconds
        d = new Date(date < 1e12 ? date * 1000 : date);
    } else {
        d = new Date(date);
    }

    if (Number.isNaN(d.getTime())) {
        return '—';
    }

    const diffMs = Date.now() - d.getTime();

    const mins = Math.floor(diffMs / 60000);

    if (mins < 1) return 'Vừa xong';

    if (mins < 60) {
        return `${mins} phút trước`;
    }

    const hrs = Math.floor(mins / 60);

    if (hrs < 24) {
        return `${hrs} giờ trước`;
    }

    const days = Math.floor(hrs / 24);

    if (days < 7) {
        return `${days} ngày trước`;
    }

    return d.toLocaleDateString('vi-VN');
}
