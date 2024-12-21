import classNames from 'classnames';
import React from 'react';

import { CalendarDateBinary, CalendarDateFlag, CalendarDateIntensity, CalendarDateStyle, isCalendarDateBinary, isCalendarDateFlag, isCalendarDateStyle, isCalendarDateValue } from './constants';

interface Props {
    date: CalendarDateBinary | CalendarDateIntensity | CalendarDateStyle | CalendarDateFlag;
}

export const CalendarMonthDayItem = ({ date }: Props) => {

    console.log(date);

    const style = {
        '--offset': (date.date.date() === 1 ? date.date.weekday() + 1 : 0)
    };

    if (isCalendarDateFlag(date)) {
        const classes = classNames('calendar-month-day-item', {
            'country': date.countryId
        });

        return (
            <div
                key={date.date.format('YYYY-MM-DD')}
                className={classes}
                style={style}
            >
                {date.countryId &&
                    <span
                        className={`flag-icon flag-icon-${date.countryId.toLowerCase()}`}
                        title={date.countryId}
                        //style={{ width: '100%', height: '100%', display: 'block' }}
                    >
                    </span>
                }
            </div >
        );
    }

    if (isCalendarDateValue(date)) {
        const classes = classNames('calendar-month-day-item', {
            'active': date.value > 0
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

    if (isCalendarDateBinary(date)) {
        const classes = classNames('calendar-month-day-item', {
            'active': date.active
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