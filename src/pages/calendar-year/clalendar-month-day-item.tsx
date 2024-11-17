import classNames from 'classnames';
import moment from 'moment';
import React from 'react';

interface Props {
    day: moment.Moment;
    highlighted: boolean;
}

export const CalendarMonthDayItem = ({ day, highlighted }: Props) => {
    const style = {
        '--offset': (day.date() === 1 ? day.weekday() + 1 : 0)
    };

    const classes = classNames('calendar-month-day-item', {
        'highlighted': highlighted,
    });

    return (
        <div
            key={day.format('YYYY-MM-DD')}
            className={classes}
            style={style}
        >
        </div >
    );
}