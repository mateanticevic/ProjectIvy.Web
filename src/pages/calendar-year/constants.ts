import { Moment } from "moment";

export enum CalendarMode {
    Beer = "beer",
    Cities = "cities",
    Countries = "countries",
    Locations = "locations",
    WorkDays = "workdays",
    Expenses = "expenses"
}

export type CalendarDate = {
    date: Moment;
}

export interface CalendarDateBinary extends CalendarDate {
    active: boolean;
}

export interface CalendarDateFlag extends CalendarDate {
    countryId?: string;
}

export interface CalendarDateValue extends CalendarDate {
    value: number;
}

export const isCalendarDateBinary = (date: CalendarDate): date is CalendarDateBinary => {
    return 'active' in date;
};

export const isCalendarDateFlag = (date: CalendarDate): date is CalendarDateFlag => {
    return 'countryId' in date;
};

export const isCalendarDateValue = (date: CalendarDate): date is CalendarDateValue => {
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

export const isCalendarDateIntensity = (date: CalendarDate): date is CalendarDateIntensity => {
    return 'intensity' in date;
}