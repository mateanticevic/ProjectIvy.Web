import classNames from 'classnames';
import React from 'react';

import { CalendarDateFlag, CalendarDateIntensity, CalendarDateStyle, isCalendarDateStyle } from './constants';

interface Props {
    date: CalendarDateFlag | CalendarDateIntensity | CalendarDateStyle;
}

export const CalendarMonthDayItem = ({ date }: Props) => {

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
}