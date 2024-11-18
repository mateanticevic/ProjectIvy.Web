import { Moment } from "moment";

export enum CalendarMode {
    Flags,
    Intensity,
    Styles,
}

export type CalendarDate = {
    date: Moment;
}

export interface CalendarDateFlag extends CalendarDate {
    value: boolean;
}

export const isCalendarDateFlag = (date: CalendarDate): date is CalendarDateFlag => {
    return 'value' in date;
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