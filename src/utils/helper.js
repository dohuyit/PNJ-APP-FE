import {TIMEZONES} from "../assets/data/time-zone";
import { INDUSTRY_LIST } from '../assets/data/industry';

export const getTimezoneOffset = (tz = 'Asia/Ho_Chi_Minh') => {
    const offset = TIMEZONES.find(item => tz === item.name).offset

    return offset
}

export const getIndustryName = (id) => {
    const industry = INDUSTRY_LIST.find((item) => item.id == id)?.name

    return industry
}
