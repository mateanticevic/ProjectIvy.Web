import moment from 'moment';
import React from 'react';

interface Props {
    day: moment.Moment;
}

export const CalendarMonthDayItem = ({ day }: Props) => {
    const style = {
        '--offset': (day.date() === 1 ? day.weekday() + 1 : 0)
    }
    return (
        <div key={day.format('YYYY-MM-DD')} className="calendar-month-day-item" style={style}>
        </div >
    );
}