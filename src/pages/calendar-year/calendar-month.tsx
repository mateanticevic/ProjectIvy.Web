import React from 'react';
import moment from 'moment';
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom";

import { CalendarMonthDayItem } from './clalendar-month-day-item';
import { CalendarDateFlag, CalendarDateIntensity, CalendarDateStyle, CalendarMode } from './constants';

interface Props {
    calendarMode: CalendarMode;
    dates: CalendarDateFlag[] | CalendarDateIntensity[] | CalendarDateStyle[];
    month: number;
    year: number;
}

export const CalendarMonth = ({ dates, month, year }: Props) => {
    const daysInMonth = Array.from({ length: moment().year(year).month(month - 1).daysInMonth() }, (_, i) => i + 1);
    const days = daysInMonth.map(day => moment({ year, month: month - 1, day }));

    return (
        <Card>
            <Card.Header>
                <Card.Title><Link to={`/calendar/${year}/${month}`}>{moment().month(month - 1).format('MMMM')}</Link></Card.Title>
            </Card.Header>
            <Card.Body>
                <div className="calendar-month-day-container">
                    {dates && dates.length > 0 && days.map(day =>
                        <CalendarMonthDayItem
                            date={dates.find(d => moment(d.date).isSame(day, 'day'))!}
                        />
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};