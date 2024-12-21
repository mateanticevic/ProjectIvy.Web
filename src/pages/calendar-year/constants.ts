import { Moment } from "moment";

export enum CalendarMode {
    Cities,
    Countries,
    Locations,
    WorkDays,
}

export type CalendarDate = {
    date: Moment;
}

export interface CalendarDateBinary extends CalendarDate {
    value: boolean;
}

export interface CalendarDateFlag extends CalendarDate {
    countryId?: string;
}

export const isCalendarDateBinary = (date: CalendarDate): date is CalendarDateBinary => {
    return 'value' in date;
};

export const isCalendarDateFlag = (date: CalendarDate): date is CalendarDateFlag => {
    return 'countryId' in date;
};

export interface CalendarDateStyle extends CalendarDate {
    style: string;
}

export const isCalendarDateStyle = (date: CalendarDate): date is CalendarDateStyle => {
    return 'style' in date;
};

export interface CalendarDateIntensity extends CalendarDate {
    intensity: number;
}