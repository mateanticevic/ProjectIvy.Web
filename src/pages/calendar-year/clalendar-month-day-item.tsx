import classNames from 'classnames';
import React from 'react';

import { CalendarDate, CalendarDateFlag, CalendarDateIntensity, CalendarDateStyle, isCalendarDateFlag, isCalendarDateStyle } from './constants';

interface Props {
    date: CalendarDateFlag | CalendarDateIntensity | CalendarDateStyle;
}

export const CalendarMonthDayItem = ({ date }: Props) => {

    console.log(date);

    const style = {
        '--offset': (date.date.date() === 1 ? date.date.weekday() + 1 : 0)
    };

    if (isCalendarDateStyle(date)) {
        const classes = classNames('calendar-month-day-item', date.style);

        return (
            <div
                key={date.date.format('YYYY-MM-DD')}
                className={classes}
                style={style}
            >
            </div >
        );
    }

    if (isCalendarDateFlag(date)) {
        const classes = classNames('calendar-month-day-item', {
            'active': date.value
        });

        return (
            <div
                key={date.date.format('YYYY-MM-DD')}
                className={classes}
                style={style}
            >
            </div >
        );
    }
}