import classNames from 'classnames';
import moment from 'moment';
import React from 'react';

import { components } from 'types/ivy-types';

type WorkDayType = components['schemas']['WorkDayType'];

interface Props {
    day: moment.Moment;
    highlighted: boolean;
    workDayType?: WorkDayType;
}

export const CalendarMonthDayItem = ({ day, highlighted, workDayType }: Props) => {
    const style = {
        '--offset': (day.date() === 1 ? day.weekday() + 1 : 0)
    };

    const classes = classNames('calendar-month-day-item', {
        'highlighted': highlighted,
        'holiday': workDayType === 'holiday',
        'office':  !workDayType || workDayType === 'office',
        'remote': workDayType === 'remote',
        'vacation': workDayType === 'vacation',
        'weekend': day.weekday() >= 5
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