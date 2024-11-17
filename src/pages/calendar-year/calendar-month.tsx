import React from 'react';
import moment from 'moment';
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom";

import { CalendarMonthDayItem } from './clalendar-month-day-item';

interface Props {
    highlightedDates: string[];
    month: number;
    year: number;
}

export const CalendarMonth = ({ highlightedDates, month, year }: Props) => {
    const daysInMonth = Array.from({ length: moment().year(year).month(month - 1).daysInMonth() }, (_, i) => i + 1);
    const days = daysInMonth.map(day => moment({ year, month: month - 1, day }));

    console.log(highlightedDates);

    return (
        <Card>
            <Card.Header>
                <Card.Title><Link to={`/calendar/${year}/${month}`}>{moment().month(month - 1).format('MMMM')}</Link></Card.Title>
            </Card.Header>
            <Card.Body>
                <div className="calendar-month-day-container">
                    {days.map(day =>
                        <CalendarMonthDayItem
                            day={day}
                            highlighted={highlightedDates.some(d => moment(d).isSame(day, 'day'))}
                        />
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};